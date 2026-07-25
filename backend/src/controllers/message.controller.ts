import { Request, Response } from 'express';
import { z } from 'zod';
import { eq, or, desc, sql, and, inArray } from 'drizzle-orm';
import { messages, users, listings } from '../db/schema';
import { assertAuthenticated } from '../types';

const sendMessageSchema = z.object({
  receiverId: z.string(),
  listingId: z.string().optional(),
  content: z.string().min(1).max(1000)
});

const markAsReadSchema = z.object({
  messageIds: z.array(z.string())
});

export const getConversations = async (req: Request, res: Response) => {
  try {
    assertAuthenticated(req);
    const userId = req.user.id;

    // Get all unique users the current user has exchanged messages with
    const sentMessages = await req.db.selectDistinct({ receiverId: messages.receiverId })
      .from(messages)
      .where(eq(messages.senderId, userId));

    const receivedMessages = await req.db.selectDistinct({ senderId: messages.senderId })
      .from(messages)
      .where(eq(messages.receiverId, userId));

    const userIds = new Set([
      ...sentMessages.map((m: any) => m.receiverId),
      ...receivedMessages.map((m: any) => m.senderId)
    ]);

    // Get conversation details for each user
    const conversations = await Promise.all(
      Array.from(userIds).map(async (otherUserId: string) => {
        // Get latest message
        const latestMessages = await req.db.select({
          message: messages,
          listing: {
            id: listings.id,
            title: listings.title,
            price: listings.price,
          }
        }).from(messages)
          .leftJoin(listings, eq(messages.listingId, listings.id))
          .where(
            or(
              and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
              and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId))
            )
          )
          .orderBy(desc(messages.createdAt))
          .limit(1);

        const latestMessage = latestMessages[0];

        // Get unread count
        const unreadCountResult = await req.db.select({ count: sql<number>`count(*)` })
          .from(messages)
          .where(
            and(
              eq(messages.senderId, otherUserId),
              eq(messages.receiverId, userId),
              eq(messages.read, false)
            )
          );

        const unreadCount = Number(unreadCountResult[0]?.count || 0);

        // Get other user info
        const otherUsers = await req.db.select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email
        }).from(users)
          .where(eq(users.id, otherUserId))
          .limit(1);

        const otherUser = otherUsers[0];

        return {
          user: otherUser,
          latestMessage: latestMessage?.message || null,
          unreadCount
        };
      })
    );

    // Sort by latest message date
    conversations.sort((a: any, b: any) => {
      const dateA = a.latestMessage?.createdAt || new Date(0);
      const dateB = b.latestMessage?.createdAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    assertAuthenticated(req);
    const userId = req.user.id;
    const { otherUserId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (!otherUserId) {
      return res.status(400).json({ message: 'Other user ID is required' });
    }

    const allMessages = await req.db.select({
      message: messages,
      sender: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      },
      receiver: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      },
      listing: {
        id: listings.id,
        title: listings.title,
        price: listings.price,
      }
    }).from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .leftJoin(listings, eq(messages.listingId, listings.id))
      .where(
        or(
          and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
          and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId))
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(parseInt(limit as string))
      .offset((parseInt(page as string) - 1) * parseInt(limit as string));

    // Toplam sayıyı al
    const countResult = await req.db.select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
          and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId))
        )
      );

    const total = Number(countResult[0]?.count || 0);

    // Mark received messages as read
    await req.db.update(messages)
      .set({ read: true })
      .where(
        and(
          eq(messages.senderId, otherUserId),
          eq(messages.receiverId, userId),
          eq(messages.read, false)
        )
      );

    // Format messages
    const formattedMessages = allMessages.map((item: any) => ({
      ...item.message,
      sender: item.sender,
      receiver: item.receiver,
      listing: item.listing,
    }));

    res.json({
      messages: formattedMessages.reverse(), // Oldest first for chat display
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    assertAuthenticated(req);
    const userId = req.user.id;
    const data = sendMessageSchema.parse(req.body);

    // Check if receiver exists
    const receiverResult = await req.db.select().from(users).where(eq(users.id, data.receiverId)).limit(1);
    const receiver = receiverResult[0];

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Check if listing exists (if provided)
    if (data.listingId) {
      const listingResult = await req.db.select().from(listings).where(eq(listings.id, data.listingId)).limit(1);
      const listing = listingResult[0];

      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
    }

    const newMessages = await req.db.insert(messages).values({
      senderId: userId,
      receiverId: data.receiverId,
      listingId: data.listingId,
      content: data.content,
      read: false
    }).returning();

    const message = newMessages[0];

    // Get related data
    const senderResult = await req.db.select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    }).from(users).where(eq(users.id, userId)).limit(1);

    const receiverResult2 = await req.db.select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    }).from(users).where(eq(users.id, data.receiverId)).limit(1);

    let listingData = null;
    if (data.listingId) {
      const listingResult = await req.db.select({
        id: listings.id,
        title: listings.title,
        price: listings.price,
      }).from(listings).where(eq(listings.id, data.listingId)).limit(1);
      listingData = listingResult[0];
    }

    res.status(201).json({
      message: {
        ...message,
        sender: senderResult[0],
        receiver: receiverResult2[0],
        listing: listingData,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    assertAuthenticated(req);
    const userId = req.user.id;
    const data = markAsReadSchema.parse(req.body);

    await req.db.update(messages)
      .set({ read: true })
      .where(
        and(
          inArray(messages.id, data.messageIds),
          eq(messages.receiverId, userId)
        )
      );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Mark messages as read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

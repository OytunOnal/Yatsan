"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markMessagesAsRead = exports.sendMessage = exports.getMessages = exports.getConversations = void 0;
const zod_1 = require("zod");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const types_1 = require("../types");
const sendMessageSchema = zod_1.z.object({
    receiverId: zod_1.z.string(),
    listingId: zod_1.z.string().optional(),
    content: zod_1.z.string().min(1).max(1000)
});
const markAsReadSchema = zod_1.z.object({
    messageIds: zod_1.z.array(zod_1.z.string())
});
const getConversations = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const userId = req.user.id;
        // Get all unique users the current user has exchanged messages with
        const sentMessages = await req.db.selectDistinct({ receiverId: schema_1.messages.receiverId })
            .from(schema_1.messages)
            .where((0, drizzle_orm_1.eq)(schema_1.messages.senderId, userId));
        const receivedMessages = await req.db.selectDistinct({ senderId: schema_1.messages.senderId })
            .from(schema_1.messages)
            .where((0, drizzle_orm_1.eq)(schema_1.messages.receiverId, userId));
        const userIds = new Set([
            ...sentMessages.map((m) => m.receiverId),
            ...receivedMessages.map((m) => m.senderId)
        ]);
        // Get conversation details for each user
        const conversations = await Promise.all(Array.from(userIds).map(async (otherUserId) => {
            // Get latest message
            const latestMessages = await req.db.select({
                message: schema_1.messages,
                listing: {
                    id: schema_1.listings.id,
                    title: schema_1.listings.title,
                    price: schema_1.listings.price,
                }
            }).from(schema_1.messages)
                .leftJoin(schema_1.listings, (0, drizzle_orm_1.eq)(schema_1.messages.listingId, schema_1.listings.id))
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.senderId, userId), (0, drizzle_orm_1.eq)(schema_1.messages.receiverId, otherUserId)), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.senderId, otherUserId), (0, drizzle_orm_1.eq)(schema_1.messages.receiverId, userId))))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.messages.createdAt))
                .limit(1);
            const latestMessage = latestMessages[0];
            // Get unread count
            const unreadCountResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                .from(schema_1.messages)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.senderId, otherUserId), (0, drizzle_orm_1.eq)(schema_1.messages.receiverId, userId), (0, drizzle_orm_1.eq)(schema_1.messages.read, false)));
            const unreadCount = Number(unreadCountResult[0]?.count || 0);
            // Get other user info
            const otherUsers = await req.db.select({
                id: schema_1.users.id,
                firstName: schema_1.users.firstName,
                lastName: schema_1.users.lastName,
                email: schema_1.users.email
            }).from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.id, otherUserId))
                .limit(1);
            const otherUser = otherUsers[0];
            return {
                user: otherUser,
                latestMessage: latestMessage?.message || null,
                unreadCount
            };
        }));
        // Sort by latest message date
        conversations.sort((a, b) => {
            const dateA = a.latestMessage?.createdAt || new Date(0);
            const dateB = b.latestMessage?.createdAt || new Date(0);
            return dateB.getTime() - dateA.getTime();
        });
        res.json({ conversations });
    }
    catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getConversations = getConversations;
const getMessages = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const userId = req.user.id;
        const { otherUserId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        if (!otherUserId) {
            return res.status(400).json({ message: 'Other user ID is required' });
        }
        const allMessages = await req.db.select({
            message: schema_1.messages,
            sender: {
                id: schema_1.users.id,
                firstName: schema_1.users.firstName,
                lastName: schema_1.users.lastName,
                email: schema_1.users.email,
            },
            receiver: {
                id: schema_1.users.id,
                firstName: schema_1.users.firstName,
                lastName: schema_1.users.lastName,
                email: schema_1.users.email,
            },
            listing: {
                id: schema_1.listings.id,
                title: schema_1.listings.title,
                price: schema_1.listings.price,
            }
        }).from(schema_1.messages)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.messages.senderId, schema_1.users.id))
            .leftJoin(schema_1.listings, (0, drizzle_orm_1.eq)(schema_1.messages.listingId, schema_1.listings.id))
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.senderId, userId), (0, drizzle_orm_1.eq)(schema_1.messages.receiverId, otherUserId)), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.senderId, otherUserId), (0, drizzle_orm_1.eq)(schema_1.messages.receiverId, userId))))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.messages.createdAt))
            .limit(parseInt(limit))
            .offset((parseInt(page) - 1) * parseInt(limit));
        // Toplam sayıyı al
        const countResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.messages)
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.senderId, userId), (0, drizzle_orm_1.eq)(schema_1.messages.receiverId, otherUserId)), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.senderId, otherUserId), (0, drizzle_orm_1.eq)(schema_1.messages.receiverId, userId))));
        const total = Number(countResult[0]?.count || 0);
        // Mark received messages as read
        await req.db.update(schema_1.messages)
            .set({ read: true })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.senderId, otherUserId), (0, drizzle_orm_1.eq)(schema_1.messages.receiverId, userId), (0, drizzle_orm_1.eq)(schema_1.messages.read, false)));
        // Format messages
        const formattedMessages = allMessages.map((item) => ({
            ...item.message,
            sender: item.sender,
            receiver: item.receiver,
            listing: item.listing,
        }));
        res.json({
            messages: formattedMessages.reverse(), // Oldest first for chat display
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    }
    catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMessages = getMessages;
const sendMessage = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const userId = req.user.id;
        const data = sendMessageSchema.parse(req.body);
        // Check if receiver exists
        const receiverResult = await req.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, data.receiverId)).limit(1);
        const receiver = receiverResult[0];
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }
        // Check if listing exists (if provided)
        if (data.listingId) {
            const listingResult = await req.db.select().from(schema_1.listings).where((0, drizzle_orm_1.eq)(schema_1.listings.id, data.listingId)).limit(1);
            const listing = listingResult[0];
            if (!listing) {
                return res.status(404).json({ message: 'Listing not found' });
            }
        }
        const newMessages = await req.db.insert(schema_1.messages).values({
            senderId: userId,
            receiverId: data.receiverId,
            listingId: data.listingId,
            content: data.content,
            read: false
        }).returning();
        const message = newMessages[0];
        // Get related data
        const senderResult = await req.db.select({
            id: schema_1.users.id,
            firstName: schema_1.users.firstName,
            lastName: schema_1.users.lastName,
            email: schema_1.users.email,
        }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId)).limit(1);
        const receiverResult2 = await req.db.select({
            id: schema_1.users.id,
            firstName: schema_1.users.firstName,
            lastName: schema_1.users.lastName,
            email: schema_1.users.email,
        }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, data.receiverId)).limit(1);
        let listingData = null;
        if (data.listingId) {
            const listingResult = await req.db.select({
                id: schema_1.listings.id,
                title: schema_1.listings.title,
                price: schema_1.listings.price,
            }).from(schema_1.listings).where((0, drizzle_orm_1.eq)(schema_1.listings.id, data.listingId)).limit(1);
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.sendMessage = sendMessage;
const markMessagesAsRead = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const userId = req.user.id;
        const data = markAsReadSchema.parse(req.body);
        await req.db.update(schema_1.messages)
            .set({ read: true })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(schema_1.messages.id, data.messageIds), (0, drizzle_orm_1.eq)(schema_1.messages.receiverId, userId)));
        res.json({ message: 'Messages marked as read' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        console.error('Mark messages as read error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.markMessagesAsRead = markMessagesAsRead;

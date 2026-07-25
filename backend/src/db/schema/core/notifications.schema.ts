import { pgTable, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { users } from './users.schema';

// ============================================
// NOTIFICATIONS TABLOSU
// ============================================
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'new_message' | 'listing_approved' | 'listing_rejected' | 'category_approved' | 'category_rejected' | 'category_merged'
  title: text('title').notNull(),
  body: text('body').notNull(),
  data: jsonb('data'), // Ek veriler (JSONB)
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('notifications_user_id_idx').on(table.userId),
  userIdReadAtIdx: index('notifications_user_id_read_at_idx').on(table.userId, table.readAt),
  createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
}));

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export type NotificationType = 'new_message' | 'listing_approved' | 'listing_rejected' | 'category_approved' | 'category_rejected' | 'category_merged';

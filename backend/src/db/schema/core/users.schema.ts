import { pgTable, text, integer, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';

// ============================================
// KULLANICI TABLOSU
// ============================================
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phoneVerified: boolean('phone_verified').notNull().default(false),
  password: text('password').notNull(),
  userType: text('user_type').notNull(), // 'individual' | 'corporate'
  kvkkApproved: boolean('kvkk_approved').notNull().default(false),
  status: text('status').notNull().default('INACTIVE'), // 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  resetPasswordToken: text('reset_password_token').unique(),
  resetPasswordExpires: timestamp('reset_password_expires'),
  lastPasswordReset: timestamp('last_password_reset'),
  emailVerificationExpires: timestamp('email_verification_expires'),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  phoneIdx: index('users_phone_idx').on(table.phone),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

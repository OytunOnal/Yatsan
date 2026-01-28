"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifications = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const users_schema_1 = require("./users.schema");
// ============================================
// NOTIFICATIONS TABLOSU
// ============================================
exports.notifications = (0, pg_core_1.pgTable)('notifications', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    userId: (0, pg_core_1.text)('user_id').notNull().references(() => users_schema_1.users.id, { onDelete: 'cascade' }),
    type: (0, pg_core_1.text)('type').notNull(), // 'new_message' | 'listing_approved' | 'listing_rejected' | 'category_approved' | 'category_rejected' | 'category_merged'
    title: (0, pg_core_1.text)('title').notNull(),
    body: (0, pg_core_1.text)('body').notNull(),
    data: (0, pg_core_1.jsonb)('data'), // Ek veriler (JSONB)
    readAt: (0, pg_core_1.timestamp)('read_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)('notifications_user_id_idx').on(table.userId),
    userIdReadAtIdx: (0, pg_core_1.index)('notifications_user_id_read_at_idx').on(table.userId, table.readAt),
    createdAtIdx: (0, pg_core_1.index)('notifications_created_at_idx').on(table.createdAt),
}));

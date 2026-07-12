import {
	integer,
	sqliteTable,
	text
} from 'drizzle-orm/sqlite-core'
import { users } from './users'

export const passwordResetTokens = sqliteTable('password_reset_tokens', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	tokenHash: text('token_hash').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	usedAt: integer('used_at', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date())
})

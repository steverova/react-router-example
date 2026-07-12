import {
	index,
	integer,
	sqliteTable,
	text
} from 'drizzle-orm/sqlite-core'
import { users } from './users'

export const refreshTokens = sqliteTable(
	'refresh_tokens',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		tokenHash: text('token_hash').notNull(),
		familyId: text('family_id').notNull(),
		userAgent: text('user_agent'),
		ipAddress: text('ip_address'),
		revokedAt: integer('revoked_at', { mode: 'timestamp' }),
		expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date())
	},
	(t) => [
		index('idx_token_hash').on(t.tokenHash),
		index('idx_user_id').on(t.userId)
	]
)

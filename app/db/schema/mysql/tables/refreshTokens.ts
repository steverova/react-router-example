import {
	datetime,
	index,
	mysqlTable,
	varchar
} from 'drizzle-orm/mysql-core'
import { users } from './users'

export const refreshTokens = mysqlTable(
	'refresh_tokens',
	{
		id: varchar('id', { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: varchar('user_id', { length: 36 })
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		tokenHash: varchar('token_hash', { length: 64 }).notNull(),
		familyId: varchar('family_id', { length: 36 }).notNull(),
		userAgent: varchar('user_agent', { length: 255 }),
		ipAddress: varchar('ip_address', { length: 45 }),
		revokedAt: datetime('revoked_at'),
		expiresAt: datetime('expires_at').notNull(),
		createdAt: datetime('created_at').default(new Date())
	},
	(t) => [
		index('idx_token_hash').on(t.tokenHash),
		index('idx_user_id').on(t.userId)
	]
)

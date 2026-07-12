import {
	datetime,
	index,
	mysqlTable,
	varchar
} from 'drizzle-orm/mysql-core'
import { users } from './users'

export const passwordResetTokens = mysqlTable(
	'password_reset_tokens',
	{
		id: varchar('id', { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: varchar('user_id', { length: 36 })
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		tokenHash: varchar('token_hash', { length: 64 }).notNull(),
		expiresAt: datetime('expires_at').notNull(),
		usedAt: datetime('used_at'),
		createdAt: datetime('created_at').default(new Date())
	},
	(t) => [index('idx_user_id').on(t.userId)]
)

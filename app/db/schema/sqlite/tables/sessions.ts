import {
	index,
	integer,
	sqliteTable,
	text
} from 'drizzle-orm/sqlite-core'
import { users } from './users'

export const sessions = sqliteTable(
	'sessions',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		userAgent: text('user_agent'),
		ipAddress: text('ip_address'),
		expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date())
	},
	(t) => [index('idx_sessions_user_id').on(t.userId)]
)

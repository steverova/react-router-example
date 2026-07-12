import {
	integer,
	sqliteTable,
	text,
	unique
} from 'drizzle-orm/sqlite-core'
import { users } from './users'

export const credentials = sqliteTable(
	'credentials',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		provider: text('provider', {
			enum: ['password', 'google', 'github']
		}).notNull(),
		providerUserId: text('provider_user_id'),
		passwordHash: text('password_hash'),
		createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date())
	},
	(t) => [
		unique('uniq_provider_user').on(t.provider, t.providerUserId)
	]
)

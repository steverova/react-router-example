import {
	bigint,
	datetime,
	mysqlEnum,
	mysqlTable,
	uniqueIndex,
	varchar
} from 'drizzle-orm/mysql-core'
import { users } from './users'

export const credentials = mysqlTable(
	'credentials',
	{
		id: bigint('id', { mode: 'number', unsigned: true })
			.primaryKey()
			.autoincrement(),
		userId: varchar('user_id', { length: 36 })
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		provider: mysqlEnum('provider', ['password', 'google', 'github']).notNull(),
		providerUserId: varchar('provider_user_id', { length: 255 }),
		passwordHash: varchar('password_hash', { length: 255 }),
		createdAt: datetime('created_at').default(new Date())
	},
	(t) => [
		uniqueIndex('uniq_provider_user').on(t.provider, t.providerUserId)
	]
)

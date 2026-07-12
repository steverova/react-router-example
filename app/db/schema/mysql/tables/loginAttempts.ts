import {
	bigint,
	boolean,
	datetime,
	index,
	mysqlTable,
	varchar
} from 'drizzle-orm/mysql-core'

export const loginAttempts = mysqlTable(
	'login_attempts',
	{
		id: bigint('id', { mode: 'number', unsigned: true })
			.primaryKey()
			.autoincrement(),
		email: varchar('email', { length: 255 }).notNull(),
		ipAddress: varchar('ip_address', { length: 45 }).notNull(),
		success: boolean('success').notNull(),
		createdAt: datetime('created_at').default(new Date())
	},
	(t) => [index('idx_email_created').on(t.email, t.createdAt)]
)

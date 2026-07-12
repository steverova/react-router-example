import {
	datetime,
	index,
	mysqlEnum,
	mysqlTable,
	varchar
} from 'drizzle-orm/mysql-core'

export const users = mysqlTable(
	'users',
	{
		id: varchar('id', { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		email: varchar('email', { length: 255 }).unique().notNull(),
		emailVerifiedAt: datetime('email_verified_at'),
		role: varchar('role', { length: 50 }).notNull().default('user'),
		status: mysqlEnum('status', ['active', 'suspended', 'deleted']).default(
			'active'
		),
		createdAt: datetime('created_at').default(new Date()),
		updatedAt: datetime('updated_at')
			.default(new Date())
			.$onUpdate(() => new Date())
	},
	(t) => [index('idx_email').on(t.email)]
)

import {
	datetime,
	index,
	mysqlEnum,
	mysqlTable,
	varchar
} from 'drizzle-orm/mysql-core'

export const clients = mysqlTable(
	'clients',
	{
		id: varchar('id', { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		entityType: mysqlEnum('entity_type', ['legal_entity', 'person'])
			.notNull()
			.default('legal_entity'),
		legalName: varchar('legal_name', { length: 255 }).notNull(),
		tradeName: varchar('trade_name', { length: 255 }),
		taxId: varchar('tax_id', { length: 50 }),
		country: varchar('country', { length: 100 }),
		address: varchar('address', { length: 500 }),
		postalCode: varchar('postal_code', { length: 20 }),
		email: varchar('email', { length: 255 }).notNull(),
		phone: varchar('phone', { length: 50 }),
		notes: varchar('notes', { length: 1000 }),
		status: mysqlEnum('status', ['active', 'inactive']).default('active'),
		createdAt: datetime('created_at').default(new Date()),
		updatedAt: datetime('updated_at')
			.default(new Date())
			.$onUpdate(() => new Date())
	},
	(t) => [index('idx_email').on(t.email)]
)

import {
	datetime,
	index,
	mysqlEnum,
	mysqlTable,
	real,
	varchar
} from 'drizzle-orm/mysql-core'

export const projects = mysqlTable(
	'projects',
	{
		id: varchar('id', { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		projectCode: varchar('project_code', { length: 20 }).unique().notNull(),
		clientEntityId: varchar('client_entity_id', { length: 36 }).notNull(),
		name: varchar('name', { length: 255 }).notNull(),
		description: varchar('description', { length: 2000 }),
		projectManagerId: varchar('project_manager_id', { length: 36 }),
		ownerId: varchar('owner_id', { length: 36 }),
		status: mysqlEnum('status', ['draft', 'active', 'on_hold', 'completed', 'cancelled', 'archived'])
			.notNull()
			.default('draft'),
		startDate: datetime('start_date'),
		targetEndDate: datetime('target_end_date'),
		hoursBudget: real('hours_budget'),
		documentationUrl: varchar('documentation_url', { length: 500 }),
		repositoryUrl: varchar('repository_url', { length: 500 }),
		contractReference: varchar('contract_reference', { length: 100 }),
		createdAt: datetime('created_at').default(new Date()),
		updatedAt: datetime('updated_at')
			.default(new Date())
			.$onUpdate(() => new Date())
	},
	(t) => [index('idx_client_entity_id').on(t.clientEntityId)]
)

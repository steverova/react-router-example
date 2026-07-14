import {
	datetime,
	index,
	mysqlEnum,
	mysqlTable,
	real,
	varchar
} from 'drizzle-orm/mysql-core'

export const activities = mysqlTable(
	'activities',
	{
		id: varchar('id', { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		projectId: varchar('project_id', { length: 36 }).notNull(),
		parentActivityId: varchar('parent_activity_id', { length: 36 }),
		title: varchar('title', { length: 255 }).notNull(),
		description: varchar('description', { length: 2000 }),
		priority: mysqlEnum('priority', ['low', 'medium', 'high', 'critical'])
			.notNull()
			.default('medium'),
		status: mysqlEnum('status', ['pending', 'in_progress', 'blocked', 'completed', 'cancelled'])
			.notNull()
			.default('pending'),
		estimatedHours: real('estimated_hours'),
		startDate: datetime('start_date'),
		dueDate: datetime('due_date'),
		createdBy: varchar('created_by', { length: 36 }),
		createdAt: datetime('created_at').default(new Date()),
		updatedAt: datetime('updated_at')
			.default(new Date())
			.$onUpdate(() => new Date())
	},
	(t) => [index('idx_activity_project_id').on(t.projectId)]
)

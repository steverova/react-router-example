import { z } from 'zod'

const baseSchema = z.object({
	EMAIL_HOST: z.string().optional(),
	EMAIL_PORT: z.coerce.number().default(587),
	EMAIL_USER: z.string().email().optional(),
	EMAIL_PASS: z.string().optional(),
	EMAIL_FROM: z.string().email().optional(),
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	DB_DRIVER: z.enum(['sqlite', 'mysql', 'turso']).default('sqlite'),
	SQLITE_PATH: z.string().default('./local.db'),
	TURSO_DATABASE_URL: z.string().optional(),
	TURSO_AUTH_TOKEN: z.string().optional(),
	DB_HOST: z.string().optional(),
	DB_USER: z.string().optional(),
	DB_PASSWORD: z.string().optional(),
	DB_NAME: z.string().optional(),
	SESSION_SECRET: z.string().min(16, "SESSION_SECRET must be at least 16 characters")
})

const envSchema = baseSchema.refine(
	(env) =>
		env.DB_DRIVER !== 'mysql' ||
		(env.DB_HOST && env.DB_USER && env.DB_PASSWORD && env.DB_NAME),
	{
		message:
			'DB_HOST, DB_USER, DB_PASSWORD y DB_NAME son requeridos cuando DB_DRIVER=mysql',
		path: ['DB_DRIVER']
	}
).refine(
	(env) =>
		env.DB_DRIVER !== 'turso' ||
		(env.TURSO_DATABASE_URL && env.TURSO_AUTH_TOKEN),
	{
		message:
			'TURSO_DATABASE_URL y TURSO_AUTH_TOKEN son requeridos cuando DB_DRIVER=turso',
		path: ['DB_DRIVER']
	}
)

const result = envSchema.safeParse(process.env)

if (!result.success) {
	console.error('❌ Invalid environment variables:')
	for (const issue of result.error.issues) {
		console.error(`- ${issue.path.join('.')}: ${issue.message}`)
	}
	process.exit(1)
}

export const env = result.data

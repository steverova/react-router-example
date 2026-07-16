import { z } from 'zod'

const envSchema = z.object({
	EMAIL_HOST: z.string().optional(),
	EMAIL_PORT: z.coerce.number().default(587),
	EMAIL_USER: z.string().email().optional(),
	EMAIL_PASS: z.string().optional(),
	EMAIL_FROM: z.string().email().optional(),
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	SESSION_SECRET: z.string().min(16, 'SESSION_SECRET must be at least 16 characters'),
	FRONTEND_URL: z.string().optional(),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
	console.error('❌ Invalid environment variables:')
	for (const issue of result.error.issues) {
		console.error(`- ${issue.path.join('.')}: ${issue.message}`)
	}
	process.exit(1)
}

export const env = result.data

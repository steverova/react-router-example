/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly EMAIL_HOST: string | undefined
	readonly EMAIL_PORT: string | undefined
	readonly EMAIL_USER: string | undefined
	readonly EMAIL_PASS: string | undefined
	readonly EMAIL_FROM: string | undefined
	readonly PORT: string | undefined
	readonly NODE_ENV: string | undefined
	readonly DB_DRIVER: string | undefined
	readonly SQLITE_PATH: string | undefined
	readonly DB_HOST: string | undefined
	readonly DB_USER: string | undefined
	readonly DB_PASSWORD: string | undefined
	readonly DB_NAME: string | undefined
	readonly SESSION_SECRET: string | undefined
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

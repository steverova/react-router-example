/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly EMAIL_HOST: string | undefined
	readonly EMAIL_PORT: string | undefined
	readonly EMAIL_USER: string | undefined
	readonly EMAIL_PASS: string | undefined
	readonly EMAIL_FROM: string | undefined
	readonly PORT: string | undefined
	readonly NODE_ENV: string | undefined
	readonly SESSION_SECRET: string | undefined
	readonly FRONTEND_URL: string | undefined
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

interface Window {
	__TAURI_INTERNALS__?: unknown
}

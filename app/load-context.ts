import { getDb } from '~/db'
import type { AppLoadContext } from 'react-router'

export interface Env {
  DB: D1Database
  SESSION_SECRET: string
  FRONTEND_URL?: string
  EMAIL_HOST?: string
  EMAIL_PORT?: string
  EMAIL_USER?: string
  EMAIL_PASS?: string
  EMAIL_FROM?: string
}

declare module 'react-router' {
  interface AppLoadContext {
    cloudflare: {
      env: Env
    }
    db: ReturnType<typeof getDb>
  }
}

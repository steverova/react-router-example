import { Link, redirect } from 'react-router'
import { LockKeyholeIcon, ShieldOffIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '~/components/ui/field'
import { getDb } from '~/db'
import { env } from 'cloudflare:workers'
import {
	resolveLinkForRedirect,
	recordClick,
	validateLinkPassword,
} from '../link.service'
import { passwordGateSchema } from '../link.schema'

interface LoaderData {
	mode: 'redirect'
	url: string
}

interface PasswordGateData {
	mode: 'password'
	slug: string
	error?: string
}

interface ExpiredData {
	mode: 'expired'
	reason: 'expired' | 'exhausted' | 'disabled'
}

interface NotFoundData {
	mode: 'not_found'
}

type Data = LoaderData | PasswordGateData | ExpiredData | NotFoundData

const PASSWORD_COOKIE_PREFIX = 'lpw_'

async function hasValidPasswordCookie(
	request: Request,
	slug: string
): Promise<boolean> {
	const cookieHeader = request.headers.get('Cookie') ?? ''
	const match = cookieHeader.match(
		new RegExp(`(?:^|;\\s*)${PASSWORD_COOKIE_PREFIX}${slug}=([^;]+)`)
	)
	if (!match) return false
	const slugAndToken = match[1]
	const expectedPrefix = `${slug}:`
	if (!slugAndToken.startsWith(expectedPrefix)) return false
	return true
}

export async function loader({
	request,
	params,
}: {
	request: Request
	params: { slug: string }
}) {
	const slug = params.slug
	if (!slug || slug.length > 32 || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
		return { mode: 'not_found' } satisfies NotFoundData
	}

	const db = getDb(env.DB)
	const resolved = await resolveLinkForRedirect(db, slug)
	if (!resolved) {
		return { mode: 'not_found' } satisfies NotFoundData
	}

	const { link, status } = resolved

	if (status === 'expired')
		return { mode: 'expired', reason: 'expired' } satisfies ExpiredData
	if (status === 'exhausted')
		return { mode: 'expired', reason: 'exhausted' } satisfies ExpiredData
	if (status === 'disabled')
		return { mode: 'expired', reason: 'disabled' } satisfies ExpiredData

	if (link.passwordHash) {
		const hasCookie = await hasValidPasswordCookie(request, slug)
		if (!hasCookie) {
			return { mode: 'password', slug } satisfies PasswordGateData
		}
	}

	await recordClick(db, link.id, request)

	const url = new URL(link.originalUrl, request.url).toString()
	throw redirect(url, { status: 302 })
}

export async function action({
	request,
	params,
}: {
	request: Request
	params: { slug: string }
}) {
	const slug = params.slug
	const db = getDb(env.DB)

	const formData = await request.formData()
	const parsed = passwordGateSchema.safeParse({
		password: formData.get('password') ?? '',
	})

	if (!parsed.success) {
		return {
			mode: 'password',
			slug,
			error: 'Password is required',
		} satisfies PasswordGateData
	}

	const ok = await validateLinkPassword(db, slug, parsed.data.password)
	if (!ok) {
		return {
			mode: 'password',
			slug,
			error: 'Incorrect password',
		} satisfies PasswordGateData
	}

	const resolved = await resolveLinkForRedirect(db, slug)
	if (!resolved) {
		return { mode: 'not_found' } satisfies NotFoundData
	}

	if (resolved.status !== 'active') {
		const reason: 'expired' | 'exhausted' | 'disabled' = resolved.status
		return { mode: 'expired', reason } satisfies ExpiredData
	}

	await recordClick(db, resolved.link.id, request)

	const cookie = `${PASSWORD_COOKIE_PREFIX}${slug}=${slug}:ok; Path=/; Max-Age=900; SameSite=Lax`
	throw redirect(resolved.link.originalUrl, {
		status: 302,
		headers: { 'Set-Cookie': cookie },
	})
}

export default function RedirectPage({ loaderData }: { loaderData: Data }) {
	if (loaderData.mode === 'redirect') {
		return null
	}

	if (loaderData.mode === 'password') {
		return <PasswordGate slug={loaderData.slug} error={loaderData.error} />
	}

	if (loaderData.mode === 'expired') {
		return <ExpiredScreen reason={loaderData.reason} />
	}

	return <NotFoundScreen />
}

function PasswordGate({ slug, error }: { slug: string; error?: string }) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<LockKeyholeIcon />
						Protected link
					</CardTitle>
					<CardDescription>
						This link is password-protected. Enter the password to continue to{' '}
						<span className="font-mono">/{slug}</span>.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						method="post"
						className="flex flex-col gap-4"
					>
						<FieldGroup>
							<Field data-invalid={Boolean(error)}>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<Input
									id="password"
									name="password"
									type="password"
									required
									autoFocus
									aria-invalid={Boolean(error)}
									placeholder="Enter password"
								/>
								{error && <FieldError errors={[{ message: error }]} />}
								<FieldDescription>
									The link owner set this password. Ask them if you don't know it.
								</FieldDescription>
							</Field>
						</FieldGroup>

						<Button type="submit" className="w-full">
							Continue
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

function ExpiredScreen({
	reason,
}: {
	reason: 'expired' | 'exhausted' | 'disabled'
}) {
	const messages = {
		expired: {
			title: 'Link expired',
			description: 'This short link is no longer active because it passed its expiration date.',
		},
		exhausted: {
			title: 'Link limit reached',
			description: 'This link has reached its maximum number of clicks.',
		},
		disabled: {
			title: 'Link disabled',
			description: 'The owner of this link has disabled it.',
		},
	} as const
	const m = messages[reason]

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<ShieldOffIcon />
						{m.title}
					</CardTitle>
					<CardDescription>{m.description}</CardDescription>
				</CardHeader>
				<CardContent>
					<Link to="/login">
						<Button variant="outline" className="w-full">
							Go to login
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	)
}

function NotFoundScreen() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Link not found</CardTitle>
					<CardDescription>
						The short link you tried to open doesn't exist.
					</CardDescription>
				</CardHeader>
			</Card>
		</div>
	)
}

export function ErrorBoundary() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Something went wrong</CardTitle>
					<CardDescription>
						We couldn't process your request. Please try again.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Spinner />
				</CardContent>
			</Card>
		</div>
	)
}

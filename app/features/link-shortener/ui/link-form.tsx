import { useEffect, useState } from 'react'
import { useFetcher, useLoaderData, useNavigate, useParams, Link } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, EyeIcon, EyeOffIcon, RefreshCwIcon, TriangleAlertIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Spinner } from '~/components/ui/spinner'
import { Checkbox } from '~/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import {
	Field,
	FieldDescription,
	FieldError as UiFieldError,
	FieldGroup,
	FieldLabel,
} from '~/components/ui/field'
import {
	createLinkSchema,
	type LinkFormValues,
} from '../link.schema'
import type { action as createAction } from '../actions/create-link.action'
import type { action as editAction } from '../actions/edit-link.action'
import { findLinkForUser } from '../link.service'
import { getDb } from '~/db'
import { env } from 'cloudflare:workers'
import { requireAuth } from '~/session.server'

export async function loader({
	request,
	params,
}: {
	request: Request
	params: { id?: string }
}) {
	const userId = await requireAuth(request)
	const db = getDb(env.DB)

	if (!params.id) {
		return { link: null }
	}

	const id = Number(params.id)
	if (!Number.isFinite(id) || id <= 0) {
		throw new Response('Invalid id', { status: 400 })
	}

	const link = await findLinkForUser(db, id, Number(userId))
	if (!link) {
		throw new Response('Not found', { status: 404 })
	}

	return { link }
}

export function meta() {
	return [{ title: 'Shorten a Link' }]
}

function toDatetimeLocal(value: Date | string | null | undefined): string {
	if (!value) return ''
	const d = new Date(value)
	if (Number.isNaN(d.getTime())) return ''
	const pad = (n: number) => n.toString().padStart(2, '0')
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
		d.getHours()
	)}:${pad(d.getMinutes())}`
}

function slugPreview(origin: string, slug?: string): string {
	if (!slug) return ''
	return `${origin}/${slug}`
}

function OptionalHint() {
	return (
		<span className="ml-1.5 text-xs font-normal text-muted-foreground">
			(optional)
		</span>
	)
}

interface LoadedLink {
	id: number
	slug: string
	originalUrl: string
	title: string | null
	description: string | null
	maxClicks: number | null
	expiresAt: Date | string | null
	ogImage: string | null
	isActive: boolean
}

type ActionErrors = Partial<Record<keyof LinkFormValues | '_form', string[]>>

export default function LinkFormPage() {
	const { link } = useLoaderData() as { link: LoadedLink | null }
	const params = useParams()
	const navigate = useNavigate()
	const fetcher = useFetcher<typeof createAction | typeof editAction>()

	const isEditMode = Boolean(params.id)
	const [origin, setOrigin] = useState('')

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setOrigin(window.location.origin)
		}
	}, [])

	const form = useForm<LinkFormValues>({
		resolver: zodResolver(createLinkSchema) as never,
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			originalUrl: link?.originalUrl ?? '',
			customSlug: link?.slug ?? '',
			title: link?.title ?? link?.slug ?? '',
			description: link?.description ?? '',
			expiresAt: toDatetimeLocal(link?.expiresAt ?? null),
			maxClicks: link?.maxClicks ?? null,
			password: '',
			isActive: (link as { isActive?: boolean } | null)?.isActive ?? true,
		},
	})

	const [showPassword, setShowPassword] = useState(false)
	const isSubmitting = fetcher.state === 'submitting'
	const watchedSlug = form.watch('customSlug')

	const serverErrors =
		(fetcher.data && 'errors' in fetcher.data
			? (fetcher.data.errors as ActionErrors | undefined)
			: undefined) ?? {}
	const formLevelError = serverErrors._form?.[0]

	useEffect(() => {
		if (fetcher.state !== 'idle' || !fetcher.data) return

		if ('errors' in fetcher.data && fetcher.data.errors) {
			const errors = fetcher.data.errors as ActionErrors
			form.clearErrors()
			for (const [field, messages] of Object.entries(errors)) {
				if (!messages?.length) continue
				if (field === '_form') continue
				const message = messages[0]
				form.setError(field as keyof LinkFormValues, {
					type: 'server',
					message,
				})
			}
			toast.error(
				formLevelError ?? 'Please fix the highlighted errors and try again'
			)
		} else if ('success' in fetcher.data && fetcher.data.success) {
			form.clearErrors()
			toast.success(
				isEditMode ? 'Link updated successfully' : 'Short link created'
			)
			if (!isEditMode) {
				navigate('/links')
			}
		}
	}, [fetcher.state, fetcher.data, form, isEditMode, navigate, formLevelError])

	const onSubmit = (data: LinkFormValues) => {
		const cleaned = {
			originalUrl: data.originalUrl?.trim() ?? '',
			customSlug: data.customSlug?.trim() ?? '',
			title: data.title?.trim() ?? '',
			description: data.description?.trim() ?? '',
			expiresAt: data.expiresAt ?? '',
			password: data.password?.trim() ?? '',
			maxClicks:
				data.maxClicks === null || data.maxClicks === undefined
					? ''
					: String(data.maxClicks),
			isActive: isEditMode ? Boolean(data.isActive) : true,
		}

		if (isEditMode && params.id) {
			fetcher.submit(
				{ ...cleaned, id: String(params.id) } as never,
				{ method: 'post', action: '/links/actions/edit' }
			)
		} else {
			fetcher.submit(cleaned as never, {
				method: 'post',
				action: '/links/actions/create',
			})
		}
	}

	const generateRandomSlug = () => {
		const buf = new Uint32Array(1)
		crypto.getRandomValues(buf)
		const safe =
			buf[0].toString(36).replace(/[^a-zA-Z0-9]/g, '').slice(0, 7) || 'shorty'
		form.setValue('customSlug', safe)
	}

	function fieldErrorMessages(name: keyof LinkFormValues): string[] {
		const fromServer = serverErrors[name]
		if (fromServer?.length) return fromServer
		const rhfError = form.formState.errors[name]
		if (rhfError && 'message' in rhfError && rhfError.message) {
			return [rhfError.message]
		}
		return []
	}

	function isFieldInvalid(name: keyof LinkFormValues): boolean {
		if (serverErrors[name]?.length) return true
		const e = form.formState.errors[name]
		if (!e) return false
		if ('message' in e && e.message) return true
		return Boolean(e.types && Object.keys(e.types).length > 0)
	}

	return (
		<div className="flex justify-center p-6">
			<div className="flex w-full max-w-3xl flex-col gap-6 text-sm leading-loose">
				<div className="flex flex-col gap-1">
					<div className="flex items-center justify-between">
						<h1 className="text-lg font-medium">
							{isEditMode ? 'Edit link' : 'Create short link'}
						</h1>
						<Link to="/links">
							<Button variant="outline" size="sm">
								Back to links
							</Button>
						</Link>
					</div>
					{!isEditMode && (
						<p className="text-xs text-muted-foreground">
							Only the <span className="font-medium">Destination URL</span> is required.
							Everything else is optional — leave it empty and we'll auto-generate the slug.
						</p>
					)}
				</div>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-6 rounded-lg p-2"
					noValidate
				>
					{formLevelError && (
						<Alert variant="destructive">
							<TriangleAlertIcon />
							<AlertTitle>Could not save link</AlertTitle>
							<AlertDescription>{formLevelError}</AlertDescription>
						</Alert>
					)}

					<FieldGroup>
						<Controller
							name="originalUrl"
							control={form.control}
							render={({ field }) => {
								const messages = fieldErrorMessages('originalUrl')
								const invalid = isFieldInvalid('originalUrl')
								return (
									<Field data-invalid={invalid || undefined}>
										<FieldLabel htmlFor="originalUrl">
											Destination URL *
										</FieldLabel>
										<Input
											{...field}
											id="originalUrl"
											type="url"
											placeholder="https://example.com/long/path"
											aria-invalid={invalid || undefined}
											autoComplete="off"
											disabled={isSubmitting}
										/>
										<FieldDescription>
											The URL users will be redirected to.
										</FieldDescription>
										{messages.length > 0 && (
											<UiFieldError
												errors={messages.map((m) => ({ message: m }))}
											/>
										)}
									</Field>
								)
							}}
						/>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<Controller
								name="customSlug"
								control={form.control}
								render={({ field }) => {
									const messages = fieldErrorMessages('customSlug')
									const invalid = isFieldInvalid('customSlug')
								return (
									<Field data-invalid={invalid || undefined}>
										<FieldLabel htmlFor="customSlug">
											Custom slug
											<OptionalHint />
										</FieldLabel>
										<div className="flex items-center gap-2">
											<Input
												{...field}
												value={field.value ?? ''}
												id="customSlug"
												placeholder="auto-generated"
												aria-invalid={invalid || undefined}
												autoComplete="off"
												disabled={isSubmitting}
												className="font-mono"
											/>
											<Button
												type="button"
												variant="outline"
												size="icon-sm"
												onClick={generateRandomSlug}
												disabled={isSubmitting}
												aria-label="Generate random slug"
											>
												<RefreshCwIcon />
											</Button>
										</div>
										<FieldDescription>
											{origin && watchedSlug
												? slugPreview(origin, watchedSlug)
												: 'Leave empty to auto-generate a unique 7-char slug.'}
										</FieldDescription>
										{messages.length > 0 && (
											<UiFieldError
												errors={messages.map((m) => ({ message: m }))}
											/>
										)}
									</Field>
								)
							}}
						/>

							<Controller
								name="title"
								control={form.control}
								render={({ field }) => {
									const messages = fieldErrorMessages('title')
									const invalid = isFieldInvalid('title')
									return (
										<Field data-invalid={invalid || undefined}>
											<FieldLabel htmlFor="title">
												Title *
											</FieldLabel>
											<Input
												{...field}
												value={field.value ?? ''}
												id="title"
												placeholder="Campaign Christmas 2026"
												aria-invalid={invalid || undefined}
												autoComplete="off"
												disabled={isSubmitting}
											/>
											<FieldDescription>
												Internal label to find it in the list.
											</FieldDescription>
											{messages.length > 0 && (
												<UiFieldError
													errors={messages.map((m) => ({ message: m }))}
												/>
											)}
										</Field>
									)
								}}
							/>
						</div>

							<Controller
								name="description"
								control={form.control}
								render={({ field }) => {
									const messages = fieldErrorMessages('description')
									const invalid = isFieldInvalid('description')
									return (
										<Field data-invalid={invalid || undefined}>
											<FieldLabel htmlFor="description">
												Description
												<OptionalHint />
											</FieldLabel>
										<Textarea
											{...field}
											value={field.value ?? ''}
											id="description"
											placeholder="Optional notes about this link…"
											aria-invalid={invalid || undefined}
											disabled={isSubmitting}
											className="min-h-[80px]"
										/>
										{messages.length > 0 && (
											<UiFieldError
												errors={messages.map((m) => ({ message: m }))}
											/>
										)}
									</Field>
								)
							}}
						/>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<Controller
								name="expiresAt"
								control={form.control}
								render={({ field }) => {
									const messages = fieldErrorMessages('expiresAt')
									const invalid = isFieldInvalid('expiresAt')
								return (
									<Field data-invalid={invalid || undefined}>
										<FieldLabel htmlFor="expiresAt">
											Expires at
											<OptionalHint />
										</FieldLabel>
											<div className="relative">
												<Input
													{...field}
													value={field.value ?? ''}
													id="expiresAt"
													type="datetime-local"
													aria-invalid={invalid || undefined}
													disabled={isSubmitting}
												/>
												<CalendarIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
											</div>
											<FieldDescription>
												Leave empty for never expires.
											</FieldDescription>
											{messages.length > 0 && (
												<UiFieldError
													errors={messages.map((m) => ({ message: m }))}
												/>
											)}
										</Field>
									)
								}}
							/>

							<Controller
								name="maxClicks"
								control={form.control}
								render={({ field }) => {
									const messages = fieldErrorMessages('maxClicks')
									const invalid = isFieldInvalid('maxClicks')
									return (
									<Field data-invalid={invalid || undefined}>
										<FieldLabel htmlFor="maxClicks">
											Max clicks
											<OptionalHint />
										</FieldLabel>
											<Input
												id="maxClicks"
												type="number"
												min={1}
												step={1}
												placeholder="Unlimited"
												aria-invalid={invalid || undefined}
												disabled={isSubmitting}
												value={
													field.value === null || field.value === undefined
														? ''
														: String(field.value)
												}
												onChange={(e) => {
													const raw = e.target.value
													if (raw === '') {
														field.onChange(null)
														return
													}
													const num = Number(raw)
													field.onChange(
														Number.isFinite(num) ? num : null
													)
												}}
												onBlur={field.onBlur}
												ref={field.ref}
												name={field.name}
											/>
											<FieldDescription>
												Leave empty for unlimited clicks.
											</FieldDescription>
											{messages.length > 0 && (
												<UiFieldError
													errors={messages.map((m) => ({ message: m }))}
												/>
											)}
										</Field>
									)
								}}
							/>
						</div>

						<Controller
							name="password"
							control={form.control}
							render={({ field }) => {
								const messages = fieldErrorMessages('password')
								const invalid = isFieldInvalid('password')
								return (
									<Field data-invalid={invalid || undefined}>
										<FieldLabel htmlFor="password">
											Password
											<OptionalHint />
										</FieldLabel>
										<div className="relative">
											<Input
												{...field}
												value={field.value ?? ''}
												id="password"
												type={showPassword ? 'text' : 'password'}
												placeholder={
													isEditMode
														? 'Leave empty to keep current password'
														: 'Protect this link'
												}
												aria-invalid={invalid || undefined}
												autoComplete="new-password"
												disabled={isSubmitting}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												className="absolute right-1 top-1/2 -translate-y-1/2"
												onClick={() => setShowPassword((s) => !s)}
												aria-label={
													showPassword ? 'Hide password' : 'Show password'
												}
											>
												{showPassword ? <EyeOffIcon /> : <EyeIcon />}
											</Button>
										</div>
										<FieldDescription>
											{isEditMode
												? 'Type a new password to replace the current one.'
												: 'Visitors will be asked for this password before redirecting.'}
										</FieldDescription>
										{messages.length > 0 && (
											<UiFieldError
												errors={messages.map((m) => ({ message: m }))}
											/>
										)}
									</Field>
								)
							}}
						/>

						{isEditMode && link?.ogImage && (
							<Field>
								<FieldLabel>Destination preview</FieldLabel>
								<div className="overflow-hidden rounded-lg border bg-muted">
									<img
										src={link.ogImage}
										alt=""
										className="aspect-video w-full object-cover"
									/>
								</div>
							</Field>
						)}

						{isEditMode && (
							<Controller
								name="isActive"
								control={form.control}
								render={({ field }) => {
									const checked = Boolean(field.value)
									return (
										<Field orientation="horizontal">
											<div className="flex items-center gap-3">
												<Checkbox
													id="isActive"
													checked={checked}
													onCheckedChange={(value) =>
														field.onChange(Boolean(value))
													}
													disabled={isSubmitting}
												/>
												<div className="flex flex-col gap-1">
													<FieldLabel htmlFor="isActive">
														Active
													</FieldLabel>
													<FieldDescription>
														Disabled links show an "expired" page instead of redirecting.
													</FieldDescription>
												</div>
											</div>
										</Field>
									)
								}}
							/>
						)}
					</FieldGroup>

					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting && <Spinner />}
						{isSubmitting
							? isEditMode
								? 'Saving…'
								: 'Creating…'
							: isEditMode
								? 'Save changes'
								: 'Create short link'}
					</Button>
				</form>
			</div>
		</div>
	)
}

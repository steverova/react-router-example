import { Link, useLoaderData, useNavigate, useSearchParams } from 'react-router'
import {
	ArrowLeftIcon,
	ExternalLinkIcon,
	PencilIcon,
	Link2OffIcon,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { linkDetailLoader as loader } from './link-detail.loader'
import { LinkSummaryCards, LinkMetaCard } from './link-summary-cards'
import { ClicksTimeseriesChart } from './clicks-timeseries-chart'
import { DeviceBreakdownChart } from './device-breakdown-chart'
import { TopCountriesTable } from './top-countries-table'
import { TopReferrersTable } from './top-referrers-table'
import { RecentClicksTable } from './recent-clicks-table'
import { QrCard } from './qr-card'
import { OgPreviewCard } from './og-preview-card'
import { CopyButton } from './copy-button'
import type { LinkStatus } from '../link.service'

export { loader }

export function meta({ data }: { data: Awaited<ReturnType<typeof loader>> | undefined }) {
	if (!data) return [{ title: 'Link Shortener' }]
	return [{ title: `/${data.link.slug} · Link Shortener` }]
}

const statusBadge: Record<LinkStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
	active: { label: 'Active', variant: 'default' },
	expired: { label: 'Expired', variant: 'destructive' },
	exhausted: { label: 'Exhausted', variant: 'secondary' },
	disabled: { label: 'Disabled', variant: 'outline' },
}

export default function LinkDetailPage() {
	const { link, analytics, shortUrl, range } = useLoaderData<typeof loader>()
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()

	const badge = statusBadge[link.status]

	const handleRangeChange = (next: '7d' | '30d' | '90d') => {
		const params = new URLSearchParams(searchParams)
		params.set('range', next)
		setSearchParams(params)
	}

	return (
		<div className="@container/main flex flex-1 flex-col gap-6 p-6">
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Link to="/links">
							<Button variant="outline" size="icon-sm" aria-label="Back">
								<ArrowLeftIcon />
							</Button>
						</Link>
						<div className="flex flex-col gap-1">
							<div className="flex items-center gap-2">
								<h1 className="font-mono text-2xl font-semibold">
									/{link.slug}
								</h1>
								<Badge variant={badge.variant}>{badge.label}</Badge>
							</div>
							{link.title && (
								<p className="text-sm text-muted-foreground">{link.title}</p>
							)}
						</div>
					</div>
					<div className="flex items-center gap-2">
						<CopyButton value={shortUrl} label="Copy URL" />
						<Button
							variant="outline"
							size="sm"
							onClick={() => navigate(`/links/${link.id}/edit-record`)}
						>
							<PencilIcon data-icon="inline-start" />
							Edit
						</Button>
					</div>
				</div>

				<a
					href={shortUrl}
					target="_blank"
					rel="noreferrer noopener"
					className="inline-flex items-center gap-2 self-start rounded-md border bg-muted/50 px-3 py-1.5 text-xs hover:bg-muted"
				>
					<span className="font-mono">{shortUrl}</span>
					<ExternalLinkIcon className="size-3" />
				</a>

				<a
					href={link.originalUrl}
					target="_blank"
					rel="noreferrer noopener"
					className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
				>
					<Link2OffIcon className="size-3" />
					Destination: <span className="truncate">{link.originalUrl}</span>
					<ExternalLinkIcon className="size-3" />
				</a>
			</div>

			<LinkSummaryCards analytics={analytics} range={range} />

			<Tabs defaultValue="analytics" className="flex flex-col gap-4">
				<TabsList>
					<TabsTrigger value="analytics">Analytics</TabsTrigger>
					<TabsTrigger value="share">Share & QR</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>

				<TabsContent value="analytics" className="flex flex-col gap-4">
					<ClicksTimeseriesChart
						data={analytics.timeseries}
						range={range}
						onRangeChange={handleRangeChange}
					/>
					<div className="grid grid-cols-1 gap-4 @3xl/main:grid-cols-3">
						<DeviceBreakdownChart breakdown={analytics.deviceBreakdown} />
						<TopCountriesTable rows={analytics.topCountries} />
						<TopReferrersTable rows={analytics.topReferrers} />
					</div>
					<RecentClicksTable rows={analytics.recentClicks} />
				</TabsContent>

				<TabsContent value="share" className="flex flex-col gap-4">
					<div className="grid grid-cols-1 gap-4 @2xl/main:grid-cols-2">
						<QrCard shortUrl={shortUrl} slug={link.slug} />
						<OgPreviewCard
							imageUrl={link.ogImage}
							destinationUrl={link.originalUrl}
						/>
					</div>
				</TabsContent>

				<TabsContent value="settings" className="flex flex-col gap-4">
					<div className="grid grid-cols-1 gap-4 @2xl/main:grid-cols-2">
						<LinkMetaCard
							createdAt={link.createdAt as Date | string}
							expiresAt={link.expiresAt as Date | string | null}
							maxClicks={link.maxClicks}
							totalClicks={link.totalClicks}
							hasPassword={Boolean(link.passwordHash)}
						/>
						{link.description && (
							<div className="rounded-lg border p-4">
								<h3 className="mb-2 text-sm font-medium">Description</h3>
								<p className="text-sm text-muted-foreground">
									{link.description}
								</p>
							</div>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}

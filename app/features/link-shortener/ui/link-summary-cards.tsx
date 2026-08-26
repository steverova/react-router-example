import {
	CalendarIcon,
	ChartLineIcon,
	ClockIcon,
	EyeIcon,
	GlobeIcon,
	HashIcon,
} from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import type { AnalyticsData, LinkStatus } from '../link.service'
import { countryName } from '../lib/geo'

interface LinkSummaryCardsProps {
	analytics: AnalyticsData
	range: '7d' | '30d' | '90d'
}

const rangeLabel: Record<'7d' | '30d' | '90d', string> = {
	'7d': 'last 7 days',
	'30d': 'last 30 days',
	'90d': 'last 90 days',
}

const statusLabel: Record<LinkStatus, string> = {
	active: 'Active',
	expired: 'Expired',
	exhausted: 'Exhausted',
	disabled: 'Disabled',
}

export function LinkSummaryCards({ analytics, range }: LinkSummaryCardsProps) {
	const { summary, topCountries } = analytics
	const topCountry = topCountries[0]?.label ?? null

	const cards = [
		{
			icon: EyeIcon,
			label: 'Total clicks',
			value: summary.totalClicks.toLocaleString(),
			sub: `All time`,
		},
		{
			icon: ChartLineIcon,
			label: 'Clicks today',
			value: summary.clicksToday.toLocaleString(),
			sub: `vs ${summary.clicksThisWeek.toLocaleString()} this week`,
		},
		{
			icon: GlobeIcon,
			label: 'Countries',
			value: summary.uniqueCountries.toLocaleString(),
			sub: topCountry ? countryName(topCountry) : 'No data yet',
		},
		{
			icon: ClockIcon,
			label: 'Status',
			value: statusLabel[summary.status],
			sub: `Range: ${rangeLabel[range]}`,
			badge: summary.status,
		},
	]

	return (
		<div className="grid grid-cols-1 gap-4 @md/main:grid-cols-2 @3xl/main:grid-cols-4">
			{cards.map((card) => (
				<Card key={card.label} className="@container/card">
					<CardHeader>
						<CardDescription className="flex items-center gap-1.5">
							<card.icon />
							{card.label}
						</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums">
							{card.value}
						</CardTitle>
					</CardHeader>
					<CardContent className="flex items-center justify-between text-xs text-muted-foreground">
						<span>{card.sub}</span>
						{card.badge && (
							<Badge
								variant={
									card.badge === 'active'
										? 'default'
										: card.badge === 'expired'
											? 'destructive'
											: 'secondary'
								}
							>
								{statusLabel[card.badge as LinkStatus]}
							</Badge>
						)}
					</CardContent>
				</Card>
			))}
		</div>
	)
}

interface LinkMetaCardProps {
	createdAt: Date | string | null
	expiresAt: Date | string | null
	maxClicks: number | null
	totalClicks: number
	hasPassword: boolean
}

export function LinkMetaCard({
	createdAt,
	expiresAt,
	maxClicks,
	totalClicks,
	hasPassword,
}: LinkMetaCardProps) {
	const usage = maxClicks
		? `${totalClicks.toLocaleString()} / ${maxClicks.toLocaleString()}`
		: `${totalClicks.toLocaleString()}`
	const usagePercent = maxClicks ? Math.min(100, (totalClicks / maxClicks) * 100) : 0

	const items = [
		{
			icon: CalendarIcon,
			label: 'Created',
			value: createdAt ? new Date(createdAt).toLocaleString() : '—',
		},
		{
			icon: CalendarIcon,
			label: 'Expires',
			value: expiresAt ? new Date(expiresAt).toLocaleString() : 'Never',
		},
		{
			icon: HashIcon,
			label: 'Max clicks',
			value: maxClicks?.toLocaleString() ?? 'Unlimited',
		},
		{
			icon: HashIcon,
			label: 'Password',
			value: hasPassword ? 'Yes' : 'No',
		},
	]

	return (
		<Card>
			<CardHeader>
				<CardTitle>Link details</CardTitle>
				<CardDescription>Configuration and limits.</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<div className="grid grid-cols-2 gap-4">
					{items.map((item) => (
						<div key={item.label} className="flex flex-col gap-1">
							<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
								<item.icon className="size-3" />
								{item.label}
							</div>
							<span className="text-sm font-medium">{item.value}</span>
						</div>
					))}
				</div>
				{maxClicks && (
					<div className="flex flex-col gap-1">
						<div className="flex items-center justify-between text-xs text-muted-foreground">
							<span>Usage</span>
							<span className="font-mono tabular-nums">{usage}</span>
						</div>
						<div className="h-2 overflow-hidden rounded-full bg-muted">
							<div
								className="h-full bg-primary transition-[width]"
								style={{ width: `${usagePercent}%` }}
							/>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

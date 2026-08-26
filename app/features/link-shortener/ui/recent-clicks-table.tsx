import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { countryName } from '../lib/geo'

interface RecentClick {
	id: number
	clickedAt: Date | string | null
	country: string | null
	city: string | null
	deviceType: string | null
	deviceOs: string | null
	browser: string | null
	referrer: string | null
}

interface RecentClicksTableProps {
	rows: RecentClick[]
}

function deviceLabel(type: string | null): { label: string; variant: 'default' | 'secondary' | 'outline' } {
	switch (type) {
		case 'mobile':
			return { label: 'Mobile', variant: 'default' }
		case 'tablet':
			return { label: 'Tablet', variant: 'secondary' }
		case 'desktop':
			return { label: 'Desktop', variant: 'outline' }
		case 'bot':
			return { label: 'Bot', variant: 'outline' }
		default:
			return { label: 'Unknown', variant: 'outline' }
	}
}

function formatRelative(value: Date | string | null): string {
	if (!value) return '—'
	const date = new Date(value)
	const diffMs = Date.now() - date.getTime()
	const seconds = Math.floor(diffMs / 1000)
	if (seconds < 60) return `${seconds}s ago`
	const minutes = Math.floor(seconds / 60)
	if (minutes < 60) return `${minutes}m ago`
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours}h ago`
	const days = Math.floor(hours / 24)
	if (days < 30) return `${days}d ago`
	return date.toLocaleDateString()
}

function hostname(value: string | null): string {
	if (!value) return 'Direct'
	try {
		return new URL(value).host
	} catch {
		return value
	}
}

export function RecentClicksTable({ rows }: RecentClicksTableProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent clicks</CardTitle>
				<CardDescription>
					Last {rows.length} clicks across all ranges.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{rows.length === 0 ? (
					<p className="py-6 text-center text-sm text-muted-foreground">
						No clicks yet — share your link!
					</p>
				) : (
					<ul className="flex flex-col divide-y">
						{rows.map((click) => {
							const device = deviceLabel(click.deviceType)
							return (
								<li
									key={click.id}
									className="flex items-center justify-between gap-4 py-3"
								>
									<div className="flex min-w-0 flex-col gap-1">
										<div className="flex items-center gap-2 text-sm font-medium">
											<Badge variant={device.variant}>{device.label}</Badge>
											{click.browser && (
												<span className="text-muted-foreground">
													· {click.browser}
												</span>
											)}
											{click.deviceOs && (
												<span className="text-muted-foreground">
													· {click.deviceOs}
												</span>
											)}
										</div>
										<div className="flex items-center gap-2 truncate text-xs text-muted-foreground">
											<span>
												{countryName(click.country)}
												{click.city ? ` · ${click.city}` : ''}
											</span>
											<span>·</span>
											<span className="truncate">
												{hostname(click.referrer)}
											</span>
										</div>
									</div>
									<span className="shrink-0 text-xs text-muted-foreground">
										{formatRelative(click.clickedAt)}
									</span>
								</li>
							)
						})}
					</ul>
				)}
			</CardContent>
		</Card>
	)
}

import { Link2OffIcon } from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import type { BreakdownRow } from '../link.repository'

interface TopReferrersTableProps {
	rows: BreakdownRow[]
	limit?: number
}

function formatReferrer(value: string): { host: string; path: string } {
	if (value === 'Direct / None') return { host: 'Direct', path: '' }
	try {
		const url = new URL(value)
		return { host: url.host, path: url.pathname }
	} catch {
		return { host: value, path: '' }
	}
}

export function TopReferrersTable({ rows, limit = 10 }: TopReferrersTableProps) {
	const total = rows.reduce((sum, r) => sum + r.count, 0)
	const data = rows.slice(0, limit)
	const max = data[0]?.count ?? 1

	return (
		<Card>
			<CardHeader>
				<CardTitle>Top referrers</CardTitle>
				<CardDescription>
					{total.toLocaleString()} clicks in range
				</CardDescription>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<p className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
						<Link2OffIcon className="size-4" />
						No referrer data
					</p>
				) : (
					<ul className="flex flex-col gap-3">
						{data.map((row) => {
							const pct = total > 0 ? (row.count / total) * 100 : 0
							const barPct = max > 0 ? (row.count / max) * 100 : 0
							const ref = formatReferrer(row.label)
							return (
								<li
									key={row.label}
									className="flex flex-col gap-1.5"
								>
									<div className="flex items-center justify-between gap-2 text-sm">
										<div className="flex min-w-0 flex-col">
											<span className="truncate font-medium">
												{ref.host}
											</span>
											{ref.path && (
												<span className="truncate text-xs text-muted-foreground">
													{ref.path}
												</span>
											)}
										</div>
										<span className="shrink-0 font-mono tabular-nums text-muted-foreground">
											{row.count.toLocaleString()} ·{' '}
											<span className="text-xs">{pct.toFixed(1)}%</span>
										</span>
									</div>
									<div className="h-1.5 overflow-hidden rounded-full bg-muted">
										<div
											className="h-full bg-primary transition-[width]"
											style={{ width: `${barPct}%` }}
										/>
									</div>
								</li>
							)
						})}
					</ul>
				)}
			</CardContent>
		</Card>
	)
}

import { GlobeIcon } from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import { countryName } from '../lib/geo'
import type { BreakdownRow } from '../link.repository'

interface TopCountriesTableProps {
	rows: BreakdownRow[]
	limit?: number
}

export function TopCountriesTable({ rows, limit = 10 }: TopCountriesTableProps) {
	const total = rows.reduce((sum, r) => sum + r.count, 0)
	const data = rows.slice(0, limit)
	const max = data[0]?.count ?? 1

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<GlobeIcon />
					Top countries
				</CardTitle>
				<CardDescription>
					{total.toLocaleString()} clicks in range
				</CardDescription>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<p className="py-6 text-center text-sm text-muted-foreground">
						No data yet
					</p>
				) : (
					<ul className="flex flex-col gap-3">
						{data.map((row) => {
							const pct = total > 0 ? (row.count / total) * 100 : 0
							const barPct = max > 0 ? (row.count / max) * 100 : 0
							return (
								<li
									key={row.label}
									className="flex flex-col gap-1.5"
								>
									<div className="flex items-center justify-between text-sm">
										<span className="font-medium">
											{countryName(row.label)}
										</span>
										<span className="font-mono tabular-nums text-muted-foreground">
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

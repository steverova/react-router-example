import { Cell, Pie, PieChart } from 'recharts'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '~/components/ui/chart'
import type { DeviceBreakdown } from '../link.repository'

interface DeviceBreakdownChartProps {
	breakdown: DeviceBreakdown
}

const COLORS: Record<string, string> = {
	desktop: 'var(--chart-1)',
	mobile: 'var(--chart-2)',
	tablet: 'var(--chart-3)',
	bot: 'var(--muted-foreground)',
	unknown: 'var(--muted)',
}

const chartConfig = {
	desktop: { label: 'Desktop' },
	mobile: { label: 'Mobile' },
	tablet: { label: 'Tablet' },
	bot: { label: 'Bot' },
	unknown: { label: 'Unknown' },
} satisfies ChartConfig

export function DeviceBreakdownChart({ breakdown }: DeviceBreakdownChartProps) {
	const data = (Object.keys(breakdown) as Array<keyof DeviceBreakdown>)
		.filter((k) => k !== 'total' && breakdown[k] > 0)
		.map((k) => ({
			device: k,
			count: breakdown[k],
			fill: COLORS[k],
		}))

	const total = breakdown.total

	return (
		<Card className="flex flex-col">
			<CardHeader>
				<CardTitle>Devices</CardTitle>
				<CardDescription>
					{total.toLocaleString()} clicks in range
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				{data.length === 0 ? (
					<div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
						No data yet
					</div>
				) : (
					<ChartContainer
						config={chartConfig}
						className="mx-auto aspect-square h-[200px]"
					>
						<PieChart>
							<ChartTooltip
								content={
									<ChartTooltipContent
										hideLabel
										nameKey="device"
									/>
								}
							/>
							<Pie
								data={data}
								dataKey="count"
								nameKey="device"
								innerRadius={50}
								strokeWidth={2}
							>
								{data.map((entry) => (
									<Cell key={entry.device} fill={entry.fill} />
								))}
							</Pie>
							<ChartLegend
								content={
									<ChartLegendContent nameKey="device" />
								}
								className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
							/>
						</PieChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	)
}

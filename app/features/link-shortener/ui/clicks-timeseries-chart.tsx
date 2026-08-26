import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '~/components/ui/chart'
import {
	ToggleGroup,
	ToggleGroupItem,
} from '~/components/ui/toggle-group'
import type { TimeseriesPoint } from '../link.repository'

interface ClicksTimeseriesChartProps {
	data: TimeseriesPoint[]
	range: '7d' | '30d' | '90d'
	onRangeChange?: (range: '7d' | '30d' | '90d') => void
}

const chartConfig = {
	desktop: { label: 'Desktop', color: 'var(--chart-1)' },
	mobile: { label: 'Mobile', color: 'var(--chart-2)' },
	tablet: { label: 'Tablet', color: 'var(--chart-3)' },
	total: { label: 'Total', color: 'var(--primary)' },
} satisfies ChartConfig

export function ClicksTimeseriesChart({
	data,
	range,
	onRangeChange,
}: ClicksTimeseriesChartProps) {
	const totalClicks = data.reduce((sum, d) => sum + d.total, 0)

	return (
		<Card className="@container/card">
			<CardHeader>
				<CardTitle>Clicks over time</CardTitle>
				<CardDescription>
					{totalClicks.toLocaleString()} clicks in the {range === '7d' ? 'last 7 days' : range === '30d' ? 'last 30 days' : 'last 90 days'}
				</CardDescription>
				{onRangeChange && (
					<ToggleGroup
						multiple={false}
						value={[range]}
						onValueChange={(v) => {
							const next = v[0] as '7d' | '30d' | '90d' | undefined
							if (next) onRangeChange(next)
						}}
						variant="outline"
						className="ml-auto"
					>
						<ToggleGroupItem value="7d">7d</ToggleGroupItem>
						<ToggleGroupItem value="30d">30d</ToggleGroupItem>
						<ToggleGroupItem value="90d">90d</ToggleGroupItem>
					</ToggleGroup>
				)}
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[260px] w-full"
				>
					<AreaChart data={data}>
						<defs>
							<linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-desktop)"
									stopOpacity={0.9}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-desktop)"
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-mobile)"
									stopOpacity={0.7}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-mobile)"
									stopOpacity={0.05}
								/>
							</linearGradient>
							<linearGradient id="fillTablet" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-tablet)"
									stopOpacity={0.7}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-tablet)"
									stopOpacity={0.05}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value)
								return date.toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
								})
							}}
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => {
										return new Date(value as string).toLocaleDateString(
											'en-US',
											{
												month: 'short',
												day: 'numeric',
												year: 'numeric',
											}
										)
									}}
									indicator="dot"
								/>
							}
						/>
						<Area
							dataKey="tablet"
							type="natural"
							fill="url(#fillTablet)"
							stroke="var(--color-tablet)"
							stackId="a"
						/>
						<Area
							dataKey="mobile"
							type="natural"
							fill="url(#fillMobile)"
							stroke="var(--color-mobile)"
							stackId="a"
						/>
						<Area
							dataKey="desktop"
							type="natural"
							fill="url(#fillDesktop)"
							stroke="var(--color-desktop)"
							stackId="a"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}


import { lazy, Suspense } from 'react'
import { CircleCheckIcon, LoaderIcon } from 'lucide-react'

import { Badge } from '~/components/ui/badge'

import data from './data.json'
import type { ColumnDef } from '@tanstack/react-table'
import { ChartAreaInteractive } from './chart-area-interactive'
import { DataTable } from '~/components/shared/data-table'
import { SectionCards } from './sections-cards'

const MapWithMarkers = lazy(() => import('./mark-map').then(m => ({ default: m.MapWithMarkers })))

export function loader() {
  return {}
}

type Schema = {
	id: number
	header: string
	type: string
	status: string
	target: string
	limit: string
	reviewer: string
}

const columns: ColumnDef<Schema>[] = [
	{
		accessorKey: 'header',
		header: 'Header'
	},
	{
		accessorKey: 'type',
		header: 'Section Type',
		cell: ({ row }) => (
			<div className='w-32'>
				<Badge variant='outline' className='px-1.5 text-muted-foreground'>
					{row.original.type}
				</Badge>
			</div>
		)
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => (
			<Badge variant='outline' className='px-1.5 text-muted-foreground'>
				{row.original.status === 'Done' ? (
					<CircleCheckIcon className='fill-green-500 dark:fill-green-400' />
				) : (
					<LoaderIcon />
				)}
				{row.original.status}
			</Badge>
		)
	},
	{
		accessorKey: 'target',
		header: 'Target'
	},
	{
		accessorKey: 'limit',
		header: 'Limit'
	},
	{
		accessorKey: 'reviewer',
		header: 'Reviewer'
	}
]

export default function DashboardPage() {
	return (
		<div className='flex flex-1 flex-col overflow-auto'>
			<div className='@container/main flex flex-1 flex-col gap-2'>
				<div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
					<SectionCards />
					<div className='grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6'>
					<ChartAreaInteractive />
					<Suspense fallback={<div className="h-96 rounded-md bg-muted animate-pulse" />}>
						<MapWithMarkers/>
					</Suspense>
				</div>
					<DataTable
						title='Sections'
						data={data}
						columns={columns}
						onAdd={() => console.log('Add clicked')}
						onRefetch={() => console.log('Refetch clicked')}
					/>
				</div>
			</div>
		</div>
	)
}


import { CircleCheckIcon, LoaderIcon } from 'lucide-react'

import { Badge } from '~/components/ui/badge'

import data from './data.json'
import type { ColumnDef } from '@tanstack/react-table'
import { ChartAreaInteractive } from './chart-area-interactive'
import { DataTable } from '~/components/shared/data-table'
import { SectionCards } from './sections-cards'

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
					<div className='px-4 lg:px-6'>
						<ChartAreaInteractive />
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

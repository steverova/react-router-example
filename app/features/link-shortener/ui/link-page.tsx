import { useNavigate, useLoaderData } from 'react-router'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { ExternalLinkIcon, Link2Icon } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { DataTable } from '~/components/shared/data-table'
import { linkLoader as loader } from './link.loader'
import { LinkRowActions } from './link-actions'
import type { LinkWithStatus, LinkStatus } from '../link.service'

export { loader }

export function meta() {
	return [{ title: 'Link Shortener' }]
}

function StatusBadge({ status }: { status: LinkStatus }) {
	const map: Record<
		LinkStatus,
		{
			label: string
			variant: 'default' | 'secondary' | 'destructive' | 'outline'
		}
	> = {
		active: { label: 'Active', variant: 'default' },
		expired: { label: 'Expired', variant: 'destructive' },
		exhausted: { label: 'Exhausted', variant: 'secondary' },
		disabled: { label: 'Disabled', variant: 'outline' },
	}
	const cfg = map[status]
	return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}

export default function LinkPage() {
	const navigate = useNavigate()
	const { links } = useLoaderData<typeof loader>()

	const columns: ColumnDef<LinkWithStatus>[] = [
		{
			accessorKey: 'slug',
			header: 'Short URL',
			cell: ({ row }) => {
				const link = row.original
				return (
					<div className="flex items-center gap-2">
						<Link2Icon className="size-3.5 text-muted-foreground" />
						<a
							href={`/${link.slug}`}
							target="_blank"
							rel="noreferrer noopener"
							className="font-mono text-xs hover:underline"
						>
							/{link.slug}
						</a>
					</div>
				)
			},
		},
		{
			accessorKey: 'title',
			header: 'Title',
			cell: ({ row }) => {
				const link = row.original
				return (
					<div className="flex flex-col gap-0.5">
						<span className="font-medium">{link.title ?? link.slug}</span>
						{link.description && (
							<span className="max-w-[260px] truncate text-xs text-muted-foreground">
								{link.description}
							</span>
						)}
					</div>
				)
			},
		},
		{
			accessorKey: 'originalUrl',
			header: 'Destination',
			cell: ({ row }) => {
				const link = row.original
				return (
					<a
						href={link.originalUrl}
						target="_blank"
						rel="noreferrer noopener"
						className="inline-flex max-w-[280px] items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
					>
						<span className="truncate">{link.originalUrl}</span>
						<ExternalLinkIcon className="size-3 shrink-0" />
					</a>
				)
			},
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => <StatusBadge status={row.original.status} />,
		},
		{
			accessorKey: 'totalClicks',
			header: 'Clicks',
			cell: ({ row }) => (
				<span className="font-mono tabular-nums">
					{row.original.totalClicks.toLocaleString()}
				</span>
			),
		},
		{
			accessorKey: 'lastClickedAt',
			header: 'Last click',
			cell: ({ row }) => {
				const d = row.original.lastClickedAt
				if (!d) return <span className="text-muted-foreground">—</span>
				return (
					<span className="text-xs text-muted-foreground">
						{new Date(d).toLocaleDateString()}
					</span>
				)
			},
		},
		{
			accessorKey: 'createdAt',
			header: 'Created',
			cell: ({ row }) => {
				const d = row.original.createdAt
				if (!d) return null
				return (
					<span className="text-xs text-muted-foreground">
						{new Date(d).toLocaleDateString()}
					</span>
				)
			},
		},
	]

	return (
		<DataTable
			title="Link Shortener"
			data={links}
			columns={columns}
			rowActions={LinkRowActions as unknown as React.ComponentType<{
				row: Row<LinkWithStatus>
			}>}
			onAdd={() => navigate('/links/new-record')}
		/>
	)
}

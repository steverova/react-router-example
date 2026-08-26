import { useEffect } from 'react'
import { useFetcher, Link } from 'react-router'
import type { Row } from '@tanstack/react-table'
import {
	BarChart3Icon,
	CopyIcon,
	LoaderCircleIcon,
	PencilIcon,
	TrashIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '~/components/ui/tooltip'
import { Button } from '~/components/ui/button'
import { useAlertDialog } from '~/components/providers/alert-dialog-provider'
import type { action as deleteAction } from '../actions/delete-link.action'
import type { LinkWithStatus } from '../link.service'

interface LinkRowActionsProps {
	row: Row<LinkWithStatus>
}

export function LinkRowActions({ row }: LinkRowActionsProps) {
	const link = row.original
	const fetcher = useFetcher<typeof deleteAction>()
	const { confirm } = useAlertDialog()

	const isDeleting =
		fetcher.formData?.get('intent') === 'delete' &&
		Number(fetcher.formData.get('id')) === link.id

	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data) {
			if (fetcher.data.success) {
				toast.success('Link deleted')
			} else if (fetcher.data.errors) {
				toast.error('Could not delete link')
			}
		}
	}, [fetcher.state, fetcher.data])

	const onDelete = async () => {
		const ok = await confirm({
			title: 'Delete link',
			description: `Delete /${link.slug}? This will also remove all analytics data.`,
			confirmText: 'Delete',
			cancelText: 'Cancel',
		})
		if (ok) {
			fetcher.submit(
				{ id: String(link.id), intent: 'delete' },
				{ method: 'post', action: '/links/actions/delete' }
			)
		}
	}

	const onCopy = async () => {
		const origin =
			typeof window !== 'undefined' ? window.location.origin : ''
		await navigator.clipboard.writeText(`${origin}/${link.slug}`)
		toast.success('Short URL copied')
	}

	return (
		<TooltipProvider>
			<div className="flex items-center gap-1">
				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="outline"
								size="icon-sm"
								aria-label="View analytics"
								render={<Link to={`/links/${link.id}`} />}
							/>
						}
					>
						<BarChart3Icon />
					</TooltipTrigger>
					<TooltipContent>Analytics</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="outline"
								size="icon-sm"
								aria-label="Edit link"
								render={
									<Link to={`/links/${link.id}/edit-record`} />
								}
							/>
						}
					>
						<PencilIcon />
					</TooltipTrigger>
					<TooltipContent>Edit</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="outline"
								size="icon-sm"
								onClick={onCopy}
								aria-label="Copy short URL"
							/>
						}
					>
						<CopyIcon />
					</TooltipTrigger>
					<TooltipContent>Copy short URL</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="destructive"
								size="icon-sm"
								onClick={onDelete}
								disabled={isDeleting}
								aria-label="Delete link"
							/>
						}
					>
						{isDeleting ? (
							<LoaderCircleIcon className="animate-spin" />
						) : (
							<TrashIcon />
						)}
					</TooltipTrigger>
					<TooltipContent>Delete</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	)
}

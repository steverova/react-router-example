import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	type UniqueIdentifier,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
	type Column,
	type ColumnDef,
	type ColumnFiltersState,
	type ColumnPinningState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type Row,
	type SortingState,
	useReactTable,
	type VisibilityState
} from '@tanstack/react-table'
import ExcelJS from 'exceljs'
import {
	ArrowDownIcon,
	ArrowLeftToLineIcon,
	ArrowRightToLineIcon,
	ArrowUpDownIcon,
	ArrowUpIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
	Columns3Icon,
	DownloadIcon,
	MoreHorizontal,
	PinIcon,
	PinOffIcon,
	PlusIcon,
	RefreshCwIcon
} from 'lucide-react'
import * as React from 'react'
import { Button } from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Label } from '~/components/ui/label'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '~/components/ui/table'

interface DataTableProps<TData, TValue> {
	title?: string
	data: TData[]
	columns: ColumnDef<TData, TValue>[]
	isLoading?: boolean
	onAdd?: () => void
	onRefetch?: () => void
	rowActions?: React.ComponentType<{ row: Row<TData> }>
	onExport?: boolean
	exportFileName?: string
}

function DraggableRow<TData>({ row }: { row: Row<TData> }) {
	const id = (row.original as Record<string, unknown>)?.id
	const { transform, transition, setNodeRef, isDragging } = useSortable({
		id: id as string | number
	})
	return (
		<TableRow
			data-state={row.getIsSelected() && 'selected'}
			data-dragging={isDragging}
			ref={setNodeRef}
			className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
			style={{
				transform: CSS.Transform.toString(transform),
				transition: transition
			}}
		>
			{row.getVisibleCells().map((cell) => {
				const isActions = cell.column.id === 'actions'
				return (
					<TableCell
						key={cell.id}
						className={isActions ? 'sticky right-0 z-10 bg-background' : ''}
					>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</TableCell>
				)
			})}
		</TableRow>
	)
}

function TableSkeleton({
	columnCount,
	rowCount = 5
}: {
	columnCount: number
	rowCount?: number
}) {
	return (
		<>
			{Array.from({ length: rowCount }).map((_, rowIndex) => (
				<TableRow key={rowIndex}>
					{Array.from({ length: columnCount }).map((_, colIndex) => (
						<TableCell key={colIndex}>
							<Skeleton className='h-4 w-full' />
						</TableCell>
					))}
				</TableRow>
			))}
		</>
	)
}

function SortIcon({ direction }: { direction: false | 'asc' | 'desc' }) {
	if (direction === 'asc') return <ArrowUpIcon className='ml-1 size-3.5' />
	if (direction === 'desc') return <ArrowDownIcon className='ml-1 size-3.5' />
	return <ArrowUpDownIcon className='ml-1 size-3.5 opacity-50' />
}

function ColumnHeader<TData, TValue>({
	column,
	header
}: {
	column: Column<TData, TValue>
	header?: React.ReactNode
}) {
	const canSort = column.getCanSort()
	const isPinned = column.getIsPinned()

	return (
		<div className='flex items-center gap-1'>
			{canSort ? (
				<Button
					variant='ghost'
					size='sm'
					className='-ml-2 h-8 data-[state=open]:bg-accent'
					onClick={() => column.toggleSorting()}
				>
					<span className='truncate'>{header ?? column.id}</span>
					<SortIcon direction={column.getIsSorted()} />
				</Button>
			) : (
				<span className='truncate px-2'>{header ?? column.id}</span>
			)}
			{column.getCanPin() && (
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button
								variant='ghost'
								size='icon'
								className='size-7 shrink-0 opacity-50 hover:opacity-100'
							/>
						}
					>
						{isPinned ? (
							<PinIcon className='size-3' />
						) : (
							<MoreHorizontal className='size-3' />
						)}
					</DropdownMenuTrigger>
					<DropdownMenuContent align='start'>
						{!isPinned || isPinned === 'left' ? (
							<DropdownMenuItem onClick={() => column.pin('left')}>
								<ArrowLeftToLineIcon className='mr-2 size-3.5' />
								Alinear izquierda
							</DropdownMenuItem>
						) : null}
						{!isPinned || isPinned === 'right' ? (
							<DropdownMenuItem onClick={() => column.pin('right')}>
								<ArrowRightToLineIcon className='mr-2 size-3.5' />
								Alinear derecha
							</DropdownMenuItem>
						) : null}
						{isPinned && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => column.pin(false)}>
									<PinOffIcon className='mr-2 size-3.5' />
									Desanclar
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	)
}

export function DataTable<TData, TValue>({
	title,
	data,
	columns,
	isLoading = false,
	onAdd,
	onRefetch,
	rowActions: RowActions,
	onExport = false,
	exportFileName = 'export'
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = React.useState({})
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
		right: ['actions']
	})
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10
	})

	const tableContainerRef = React.useRef<HTMLDivElement>(null)
	const scrollbarRef = React.useRef<HTMLDivElement>(null)
	const [tableContentWidth, setTableContentWidth] = React.useState(0)

	React.useEffect(() => {
		const el = tableContainerRef.current
		if (!el) return
		const observer = new ResizeObserver(() => {
			setTableContentWidth(el.scrollWidth)
		})
		observer.observe(el)
		// Also observe children changes
		const mutationObserver = new MutationObserver(() => {
			setTableContentWidth(el.scrollWidth)
		})
		mutationObserver.observe(el, { childList: true, subtree: true })
		return () => {
			observer.disconnect()
			mutationObserver.disconnect()
		}
	}, [])

	const sortableId = React.useId()
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	)

	const dataIds = React.useMemo<UniqueIdentifier[]>(
		() =>
			(data as Record<string, unknown>[])?.map(
				(item) => item.id as string | number
			) || [],
		[data]
	)

	const tableColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
		const cols = [...columns]
		if (RowActions) {
			cols.push({
				id: 'actions',
				header: 'Actions',
				cell: ({ row }) => <RowActions row={row} />,
				enablePinning: false
			})
		}
		return cols
	}, [columns, RowActions])

	const table = useReactTable({
		data,
		columns: tableColumns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
			columnPinning
		},
		getRowId: (row) => (row as Record<string, unknown>).id?.toString() ?? '',
		enableRowSelection: true,
		enableSorting: true,
		enablePinning: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		onColumnPinningChange: (updater) => {
			setColumnPinning((old) => {
				const newPinning =
					typeof updater === 'function' ? updater(old) : updater
				return {
					...newPinning,
					right: [
						...(newPinning.right || []).filter((id) => id !== 'actions'),
						'actions'
					]
				}
			})
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues()
	})

	const handleScrollbarScroll = React.useCallback(() => {
		if (tableContainerRef.current && scrollbarRef.current) {
			tableContainerRef.current.scrollLeft = scrollbarRef.current.scrollLeft
		}
	}, [])

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (active && over && active.id !== over.id) {
			// Drag reordering is handled by parent via onRefetch if needed
		}
	}

	async function handleExport() {
		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Data')

		const allColumns = table.getAllColumns()
		const visibleColumns = allColumns.filter((col) => {
			if (col.id === 'actions') return false
			if (col.id === 'drag') return false
			if (col.id === 'select') return false
			return col.getIsVisible()
		})

		worksheet.columns = visibleColumns.map((col) => {
			const colDef = col.columnDef as ColumnDef<TData, TValue> & {
				accessorKey?: string
			}
			const header = (col.columnDef.header as string) ?? col.id
			const key = colDef.accessorKey ?? col.id
			return {
				header,
				key,
				width: 20
			}
		})

		const filteredRows = table.getFilteredRowModel().rows
		filteredRows.forEach((row) => {
			const rowData: Record<string, unknown> = {}
			visibleColumns.forEach((col) => {
				const colDef = col.columnDef as ColumnDef<TData, TValue> & {
					accessorKey?: string
				}
				const key = colDef.accessorKey ?? col.id
				rowData[key] = row.original[key as keyof TData]
			})
			worksheet.addRow(rowData)
		})

		const buffer = await workbook.xlsx.writeBuffer()
		const blob = new Blob([buffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		})
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `${exportFileName}.xlsx`
		link.click()
		URL.revokeObjectURL(url)
	}

	return (
		<div className='flex h-full flex-col'>
			<div className='flex items-center justify-between px-3 mb-2'>
				<div className='flex items-center gap-2'>
					{title && <h2 className='text-lg font-semibold'>{title}</h2>}
				</div>
				<div className='flex items-center gap-2'>
					{onRefetch && (
						<Button
							variant='outline'
							size='sm'
							onClick={onRefetch}
							disabled={isLoading}
						>
							<RefreshCwIcon className={isLoading ? 'animate-spin' : ''} />
							<span className='hidden lg:inline'>Refetch</span>
						</Button>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger
							render={<Button variant='outline' size='sm' />}
						>
							<Columns3Icon data-icon='inline-start' />
							Columns
							<ChevronDownIcon data-icon='inline-end' />
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-32'>
							{table
								.getAllColumns()
								.filter(
									(column) =>
										typeof column.accessorFn !== 'undefined' &&
										column.getCanHide()
								)
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className='capitalize'
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									)
								})}
						</DropdownMenuContent>
					</DropdownMenu>
					{onAdd && (
						<Button variant='outline' size='sm' onClick={onAdd}>
							<PlusIcon />
							<span className='hidden lg:inline'>Add</span>
						</Button>
					)}
					{onExport && (
						<Button variant='outline' size='sm' onClick={handleExport}>
							<DownloadIcon />
							<span className='hidden lg:inline'>Export</span>
						</Button>
					)}
				</div>
			</div>
			<div className='min-h-0 flex-1 overflow-hidden px-3'>
				<div className='flex h-full flex-col'>
					<div className='min-h-0 flex-1 overflow-hidden rounded-t-lg border'>
						<DndContext
							collisionDetection={closestCenter}
							modifiers={[restrictToVerticalAxis]}
							onDragEnd={handleDragEnd}
							sensors={sensors}
							id={sortableId}
						>
							<div
								ref={tableContainerRef}
								className='h-full overflow-y-auto overflow-x-auto scrollbar-none'
							>
								<Table className='min-w-max'>
									<TableHeader className='sticky top-0 z-10 bg-muted'>
										{table.getHeaderGroups().map((headerGroup) => (
											<TableRow key={headerGroup.id}>
												{headerGroup.headers.map((header) => {
													const isActions = header.column.id === 'actions'
													return (
														<TableHead
															key={header.id}
															colSpan={header.colSpan}
															className={
																isActions ? 'sticky right-0 z-20 bg-muted' : ''
															}
														>
															{header.isPlaceholder ? null : header.column.getCanSort() ||
																header.column.getCanPin() ? (
																<ColumnHeader
																	column={header.column}
																	header={flexRender(
																		header.column.columnDef.header,
																		header.getContext()
																	)}
																/>
															) : (
																flexRender(
																	header.column.columnDef.header,
																	header.getContext()
																)
															)}
														</TableHead>
													)
												})}
											</TableRow>
										))}
									</TableHeader>
									<TableBody className='**:data-[slot=table-cell]:first:w-8'>
										{isLoading ? (
											<TableSkeleton columnCount={tableColumns.length} />
										) : table.getRowModel().rows?.length ? (
											<SortableContext
												items={dataIds}
												strategy={verticalListSortingStrategy}
											>
												{table.getRowModel().rows.map((row) => (
													<DraggableRow key={row.id} row={row} />
												))}
											</SortableContext>
										) : (
											<TableRow>
												<TableCell
													colSpan={tableColumns.length}
													className='h-24 text-center'
												>
													No results.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</DndContext>
					</div>
					<div className='shrink-0 rounded-b-lg border border-t-0'>
						<div
							ref={scrollbarRef}
							className='overflow-x-auto overflow-y-hidden scrollbar-thin'
							style={{ height: '12px' }}
							onScroll={handleScrollbarScroll}
						>
							<div style={{ height: '1px', width: tableContentWidth }} />
						</div>
					</div>
					<div className='shrink-0 flex items-center justify-between px-4 py-2'>
						<div className='hidden flex-1 text-sm text-muted-foreground lg:flex'>
							{table.getFilteredSelectedRowModel().rows.length} of{' '}
							{table.getFilteredRowModel().rows.length} row(s) selected.
						</div>
						<div className='flex w-full items-center gap-8 lg:w-fit'>
							<div className='hidden items-center gap-2 lg:flex'>
								<Label htmlFor='rows-per-page' className='text-sm font-medium'>
									Rows per page
								</Label>
								<Select
									value={`${table.getState().pagination.pageSize}`}
									onValueChange={(value) => {
										table.setPageSize(Number(value))
									}}
									items={[10, 20, 30, 40, 50].map((pageSize) => ({
										label: `${pageSize}`,
										value: `${pageSize}`
									}))}
								>
									<SelectTrigger size='sm' className='w-20' id='rows-per-page'>
										<SelectValue
											placeholder={table.getState().pagination.pageSize}
										/>
									</SelectTrigger>
									<SelectContent side='top'>
										<SelectGroup>
											{[10, 20, 30, 40, 50].map((pageSize) => (
												<SelectItem key={pageSize} value={`${pageSize}`}>
													{pageSize}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
							<div className='flex w-fit items-center justify-center text-sm font-medium'>
								Page {table.getState().pagination.pageIndex + 1} of{' '}
								{table.getPageCount()}
							</div>
							<div className='ml-auto flex items-center gap-2 lg:ml-0'>
								<Button
									variant='outline'
									className='hidden h-8 w-8 p-0 lg:flex'
									onClick={() => table.setPageIndex(0)}
									disabled={!table.getCanPreviousPage()}
								>
									<span className='sr-only'>Go to first page</span>
									<ChevronsLeftIcon />
								</Button>
								<Button
									variant='outline'
									className='size-8'
									size='icon'
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
								>
									<span className='sr-only'>Go to previous page</span>
									<ChevronLeftIcon />
								</Button>
								<Button
									variant='outline'
									className='size-8'
									size='icon'
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
								>
									<span className='sr-only'>Go to next page</span>
									<ChevronRightIcon />
								</Button>
								<Button
									variant='outline'
									className='hidden size-8 lg:flex'
									size='icon'
									onClick={() => table.setPageIndex(table.getPageCount() - 1)}
									disabled={!table.getCanNextPage()}
								>
									<span className='sr-only'>Go to last page</span>
									<ChevronsRightIcon />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

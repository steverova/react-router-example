import { useState } from "react"
import type { ColumnDef, Row } from "@tanstack/react-table"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  CircleCheckIcon,
  EllipsisVerticalIcon,
  LoaderIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
} from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "~/components/shared/data-table"

type User = {
  id: number
  name: string
  email: string
  role: string
  status: string
  department: string
  phone: string
  country: string
  city: string
  joinDate: string
  salary: string
}

const sampleData: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", department: "Engineering", phone: "+1-555-0101", country: "USA", city: "New York", joinDate: "2020-03-15", salary: "$95,000" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active", department: "Marketing", phone: "+1-555-0102", country: "USA", city: "Los Angeles", joinDate: "2019-07-22", salary: "$82,000" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Viewer", status: "Inactive", department: "Sales", phone: "+44-20-7946-0958", country: "UK", city: "London", joinDate: "2021-01-10", salary: "$68,000" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Admin", status: "Active", department: "Engineering", phone: "+1-555-0104", country: "USA", city: "San Francisco", joinDate: "2018-11-05", salary: "$105,000" },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Editor", status: "Pending", department: "HR", phone: "+61-2-9876-5432", country: "Australia", city: "Sydney", joinDate: "2022-02-28", salary: "$75,000" },
  { id: 6, name: "Diana Lee", email: "diana@example.com", role: "Viewer", status: "Active", department: "Finance", phone: "+82-2-1234-5678", country: "South Korea", city: "Seoul", joinDate: "2020-06-18", salary: "$72,000" },
  { id: 7, name: "Edward Davis", email: "edward@example.com", role: "Admin", status: "Active", department: "Engineering", phone: "+1-555-0107", country: "USA", city: "Seattle", joinDate: "2017-09-12", salary: "$110,000" },
  { id: 8, name: "Fiona Garcia", email: "fiona@example.com", role: "Editor", status: "Inactive", department: "Marketing", phone: "+34-91-123-4567", country: "Spain", city: "Madrid", joinDate: "2021-04-05", salary: "$65,000" },
  { id: 9, name: "George Miller", email: "george@example.com", role: "Viewer", status: "Active", department: "Sales", phone: "+49-30-1234-5678", country: "Germany", city: "Berlin", joinDate: "2020-08-20", salary: "$70,000" },
  { id: 10, name: "Hannah White", email: "hannah@example.com", role: "Admin", status: "Active", department: "HR", phone: "+1-555-0110", country: "USA", city: "Chicago", joinDate: "2019-12-01", salary: "$88,000" },
  { id: 11, name: "Ian Black", email: "ian@example.com", role: "Editor", status: "Pending", department: "Finance", phone: "+1-555-0111", country: "Canada", city: "Toronto", joinDate: "2022-01-15", salary: "$78,000" },
  { id: 12, name: "Julia Green", email: "julia@example.com", role: "Viewer", status: "Active", department: "Engineering", phone: "+33-1-2345-6789", country: "France", city: "Paris", joinDate: "2020-10-10", salary: "$73,000" },
  { id: 13, name: "Kevin Brown", email: "kevin@example.com", role: "Admin", status: "Active", department: "Marketing", phone: "+1-555-0113", country: "USA", city: "Miami", joinDate: "2018-05-25", salary: "$92,000" },
  { id: 14, name: "Laura Davis", email: "laura@example.com", role: "Editor", status: "Inactive", department: "Sales", phone: "+52-55-1234-5678", country: "Mexico", city: "Mexico City", joinDate: "2021-07-08", salary: "$62,000" },
  { id: 15, name: "Michael Wilson", email: "michael@example.com", role: "Viewer", status: "Active", department: "HR", phone: "+81-3-1234-5678", country: "Japan", city: "Tokyo", joinDate: "2019-03-30", salary: "$85,000" },
  { id: 16, name: "Nancy Lee", email: "nancy@example.com", role: "Admin", status: "Pending", department: "Finance", phone: "+852-1234-5678", country: "Hong Kong", city: "Hong Kong", joinDate: "2022-03-22", salary: "$98,000" },
  { id: 17, name: "Oscar Martinez", email: "oscar@example.com", role: "Editor", status: "Active", department: "Engineering", phone: "+54-11-1234-5678", country: "Argentina", city: "Buenos Aires", joinDate: "2020-09-14", salary: "$67,000" },
  { id: 18, name: "Patricia Anderson", email: "patricia@example.com", role: "Viewer", status: "Active", department: "Marketing", phone: "+46-8-123-456-78", country: "Sweden", city: "Stockholm", joinDate: "2021-02-18", salary: "$71,000" },
  { id: 19, name: "Quentin Thomas", email: "quentin@example.com", role: "Admin", status: "Active", department: "Sales", phone: "+31-20-123-4567", country: "Netherlands", city: "Amsterdam", joinDate: "2018-08-05", salary: "$89,000" },
  { id: 20, name: "Rachel Jackson", email: "rachel@example.com", role: "Editor", status: "Inactive", department: "HR", phone: "+1-555-0120", country: "USA", city: "Boston", joinDate: "2020-12-12", salary: "$76,000" },
  { id: 21, name: "Samuel Harris", email: "samuel@example.com", role: "Viewer", status: "Active", department: "Finance", phone: "+61-2-1234-5678", country: "Australia", city: "Melbourne", joinDate: "2019-06-28", salary: "$74,000" },
  { id: 22, name: "Tina Martin", email: "tina@example.com", role: "Admin", status: "Pending", department: "Engineering", phone: "+55-11-1234-5678", country: "Brazil", city: "Sao Paulo", joinDate: "2022-04-10", salary: "$80,000" },
  { id: 23, name: "Ulysses Clark", email: "ulysses@example.com", role: "Editor", status: "Active", department: "Marketing", phone: "+1-555-0123", country: "Canada", city: "Vancouver", joinDate: "2020-07-15", salary: "$79,000" },
  { id: 24, name: "Victoria Lewis", email: "victoria@example.com", role: "Viewer", status: "Active", department: "Sales", phone: "+44-20-1234-5678", country: "UK", city: "Manchester", joinDate: "2021-09-20", salary: "$69,000" },
  { id: 25, name: "Walter Robinson", email: "walter@example.com", role: "Admin", status: "Active", department: "HR", phone: "+1-555-0125", country: "USA", city: "Denver", joinDate: "2018-02-14", salary: "$91,000" },
]

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role
      const variant = role === "Admin" ? "default" : role === "Editor" ? "secondary" : "outline"
      return <Badge variant={variant}>{role}</Badge>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {status === "Active" ? (
            <CircleCheckIcon className="fill-green-500 dark:fill-green-400" />
          ) : status === "Pending" ? (
            <LoaderIcon />
          ) : null}
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
  },
  {
    accessorKey: "salary",
    header: "Salary",
  },
]

function UserRowActions({ row }: { row: Row<User> }) {
  const user = row.original
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-open:bg-muted"
            size="icon"
          />
        }
      >
        <EllipsisVerticalIcon />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          onClick={() => toast.info(`Viewing ${user.name}`)}
        >
          <EyeIcon className="size-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toast.info(`Editing ${user.name}`)}
        >
          <PencilIcon className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => toast.success(`Deleted ${user.name}`)}
        >
          <TrashIcon className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function TableExamplePage() {
  const [data] = useState<User[]>(sampleData)
  const [isLoading, setIsLoading] = useState(false)

  function handleAdd() {
    toast.success("Add new user clicked!")
  }

  function handleRefetch() {
    setIsLoading(true)
    toast.info("Refetching data...")
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Data refetched!")
    }, 1500)
  }

  return (
    <DataTable
      title="Users"
      data={data}
      columns={columns}
      isLoading={isLoading}
      onAdd={handleAdd}
      onRefetch={handleRefetch}
      rowActions={UserRowActions}
      onExport
      exportFileName="users"
    />
  )
}

"use client"
import { ColumnDef } from "@tanstack/react-table"
import { OrderRouterOutputs } from "@/server/api/routers/admin/order"
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter"
import { formatDateTime } from "@/lib/helpers/formatter/date-formatter"
import { MoreHorizontal } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<OrderRouterOutputs["filteredOrders"]["orders"][number]>[] = [
    {
        accessorFn: (row) => row.id,
        header: "Order ID",
        id: "orderId",
    },
    {
        accessorFn: (row) => formatCurrency(Number(row.totalAmount), 'INR'),
        header: ({ column }) => {
            return (
                <DataTableColumnHeader
                    column={column}
                    title="Amount"
                />
            )
        },
        id: "amount",
    },
    {
        accessorFn: (row) => row._count.orderItems,
        header: "Items",
        id: "items",
    },
    {
        accessorFn: (row) => row.user.name,
        header: "Buyer Name",
        id: "buyerName",
    },
    {
        accessorFn: (row) => row.user.email,
        header: "Buyer Email",
        id: "buyerEmail",
    },

    {
        accessorFn: (row) => formatDateTime(row.createdAt),
        header: ({ column }) => {
            return (
                <DataTableColumnHeader
                    column={column}
                    title="Order Date"
                />
            )
        },
        id: "orderDate",

    },
    {
        accessorFn: (row) => row.payment.length > 0 ? row.payment[0].status : 'N/A',
        header: "Payment Status",
        id: "paymentStatus",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            asChild
                            className="cursor-pointer"
                        >
                            <Link href={`/admin/orders/${row.original.id}/payments`}
                        >
                            View Details
                        </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }

]
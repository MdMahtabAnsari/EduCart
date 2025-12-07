"use client"

import { ColumnDef } from "@tanstack/react-table"
import { OrderRouterOutput } from "@/server/api/routers/teacher/order"
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter"
import { formatDateTime } from "@/lib/helpers/formatter/date-formatter"
import {  MoreHorizontal} from "lucide-react"
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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<OrderRouterOutput["filteredOrders"]["orders"][number]>[] = [
    {
        accessorFn: (row) => row.orderItem.order.id,
        header: "Order ID",
        id: "orderId",
    },
    {
        accessorFn: (row) => formatCurrency(Number(row.shareAmount), 'INR'),
        header: ({ column }) => {
            return (
                <DataTableColumnHeader
                    column={column}
                    title="Share Amount"
                />
            )
        },
        id: "shareAmount",
    },
    {
        accessorFn: (row) => formatCurrency(Number(row.orderItem.amount), 'INR'),
        header: ({ column }) => {
            return (
                <DataTableColumnHeader
                    column={column}
                    title="Item Amount"
                />
            )
        },
        id: "itemAmount",
    },
    {
        accessorFn: (row) => row.orderItem.order.user.email,
        header: "Buyer Email",
        id: "buyerEmail",
    },
    {
        accessorFn: (row) => row.orderItem.order.user.name,
        header: "Buyer Name",
        id: "buyerName",
    },
    {
        accessorFn: (row) => formatDateTime(row.orderItem.order.createdAt),
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
                            onClick={() => {
                                // Implement view details action
                            }}
                        >
                            View Details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }

]
"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    VisibilityState,
} from "@tanstack/react-table"
import { PaginationSchema } from "@/lib/schema/page"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Settings2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableProps<TData, TValue, TPagination extends PaginationSchema = PaginationSchema> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pagination: TPagination
    onPaginationChange: (pagination: { page: number, limit: number }) => void
    sorting?: SortingState
    onSortingChange?: (sorting: SortingState) => void
    globalFilter?: string
    onGlobalFilterChange?: (value: string) => void
    isLoading: boolean,
}

export function DataTable<TData, TValue, TPagination extends PaginationSchema = PaginationSchema>({
    columns,
    data,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    globalFilter,
    onGlobalFilterChange,
    isLoading,
}: DataTableProps<TData, TValue, TPagination>) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
        state: {
            pagination: {
                pageIndex: Math.max(0, pagination.currentPage - 1),
                pageSize: pagination.limit,
            },
            sorting,
            globalFilter,
            columnVisibility,
        },
        pageCount: pagination.totalPages,
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: (updater) => {
            if (!sorting) return
            const next = typeof updater === 'function' ? updater(sorting) : updater
            onSortingChange?.(next)
        },
        onPaginationChange: (updater) => {
            const state = typeof updater === 'function'
                ? updater({
                    pageIndex: Math.max(0, pagination.currentPage - 1),
                    pageSize: pagination.limit,
                })
                : updater
            onPaginationChange({ page: state.pageIndex + 1, limit: state.pageSize })
        },
        // propagate selection changes
    })


    return (
            <div>
                <div className="flex items-center py-4">
                    {onGlobalFilterChange && (

                        <Input
                            placeholder="Search all..."
                            value={globalFilter ?? ""}
                            onChange={(e) => onGlobalFilterChange(e.target.value)}
                            className="max-w-sm"
                        />

                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto cursor-pointer">
                                <Settings2 />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) => column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
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
                </div>
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: pagination.limit }).map((_, r) => (
                                    <TableRow key={`skeleton-row-${r}`}>
                                        {table.getVisibleLeafColumns().map((col) => (
                                            <TableCell key={`skeleton-cell-${r}-${col.id}`}>
                                                <Skeleton className="h-6 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={table.getVisibleLeafColumns().length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                        <ChevronRight />
                    </Button>
                </div>
            </div>

    )
}
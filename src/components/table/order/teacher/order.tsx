"use client";
import { columns } from "@/components/table/order/teacher/column";
import { api } from "@/trpc/react";
import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import { Error } from "@/components/error/error";
import type {  SortingState } from "@tanstack/react-table";
import { useCallback, useEffect } from "react";
import { useDebounceCallback } from 'usehooks-ts'
import { filterTeacherOrdersSchema } from "@/lib/schema/order";

export function OrderTable() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [shareAmount, setShareAmount] = useState<'ASC' | 'DESC' | undefined>(undefined);
    const [itemAmount, setItemAmount] = useState<'ASC' | 'DESC' | undefined>(undefined);
    const [orderDate, setOrderDate] = useState<'ASC' | 'DESC' | undefined>(undefined);
    const [sorting, setSorting] = useState<SortingState>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
    const debounceSearch = useDebounceCallback(setDebouncedSearchTerm, 300)

    useEffect(() => {
        console.log('Search changed:', searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        console.log('Debounced Search changed:', debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    const { data, isPending, error, isError, refetch } = api.teacher.order.filteredOrders.useQuery(
        {
            pageLimit: { page, limit },
            shareAmount,
            itemAmount,
            orderDate,
            search: debouncedSearchTerm.trim() === '' ? undefined : debouncedSearchTerm,
        },
        {
            enabled: filterTeacherOrdersSchema.safeParse({
                pageLimit: { page, limit },
                shareAmount,
                itemAmount,
                orderDate,
                search: debouncedSearchTerm.trim() === '' ? undefined : debouncedSearchTerm,
            }).success
        }
    );

    const handleSortingChange = useCallback((newSorting: SortingState) => {
        setSorting(newSorting);
        if (newSorting.length === 0) {
            setShareAmount(undefined);
            setItemAmount(undefined);
            setOrderDate(undefined);
            return;
        }
        const sort = newSorting[0];
        switch (sort.id) {
            case 'shareAmount':
                setShareAmount(sort.desc ? 'DESC' : 'ASC');
                setItemAmount(undefined);
                setOrderDate(undefined);
                break;
            case 'itemAmount':
                setItemAmount(sort.desc ? 'DESC' : 'ASC');
                setShareAmount(undefined);
                setOrderDate(undefined);
                break;
            case 'orderDate':
                setOrderDate(sort.desc ? 'DESC' : 'ASC');
                setShareAmount(undefined);
                setItemAmount(undefined);
                break;
        }
    }, [setShareAmount, setItemAmount, setOrderDate]);


    useEffect(() => {
        debounceSearch(searchTerm)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1)
    }, [debounceSearch, searchTerm])


    if (isError) {
        return (
            <div className="w-full h-48 flex justify-center items-center">
                <Error
                    title="Failed to load orders"
                    description={error?.message || "An error occurred while fetching orders."}
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <DataTable
            columns={columns}
            data={data?.orders ?? []}
            pagination={data?.pagination ?? {
                currentPage: page,
                limit: limit,
                totalPages: 0,
                totalItems: 0,
            }}
            onPaginationChange={({ page }) => {
                setPage(page);
            }}
            sorting={sorting}
            onSortingChange={handleSortingChange}
            globalFilter={searchTerm}
            onGlobalFilterChange={(value) => setSearchTerm(value)}
            isLoading={isPending}

        />
    );
}


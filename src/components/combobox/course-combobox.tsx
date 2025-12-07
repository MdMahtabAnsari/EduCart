"use client";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import { useDebounceCallback } from 'usehooks-ts'

interface CourseComboboxProps {
    value: string;
    onChange: (value: string) => void;
}

export function CourseCombobox({ value, onChange }: CourseComboboxProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
    const debounceSearch = useDebounceCallback(setDebouncedSearchTerm, 300)
    const limit = 10;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = api.teacher.course.courseWithIdAndTitleWithInfiniteScroll.useInfiniteQuery(
        {
            search: debouncedSearchTerm.trim() === "" ? undefined : debouncedSearchTerm,
            limit,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            initialCursor: undefined,
        }
    );

    useEffect(() => {
        debounceSearch(searchTerm)
    }, [debounceSearch, searchTerm])

    const items = data?.pages.flatMap((p) => p.courses) ?? [];
    const formattedItems = items.map((item) => ({
        id: item.id,
        label: item.title,
    }));


    return (
        <Combobox
            value={value}
            onChange={onChange}
            data={formattedItems}
            search={searchTerm}
            onSearchChange={setSearchTerm}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            title="Select a course"
        />
    );
}

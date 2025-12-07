"use client";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import { useDebounceCallback } from 'usehooks-ts'

interface TeacherComboboxProps {
    courseId: string;
    value: string;
    onChange: (value: string) => void;
    defaultSearchValue?: string;
}

export function TeacherCombobox({ courseId, value, onChange, defaultSearchValue }: TeacherComboboxProps) {
    const [searchTerm, setSearchTerm] = useState(defaultSearchValue ?? '')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
    const debounceSearch = useDebounceCallback(setDebouncedSearchTerm, 300)
    const limit = 10;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = api.teacher.instructor.filterNonAddedCourseInstructorsWithInfiniteScroll.useInfiniteQuery(
        {
            search: debouncedSearchTerm.trim() === "" ? undefined : debouncedSearchTerm,
            limit,
            courseId,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            initialCursor: undefined,
        }
    );

    useEffect(() => {
        debounceSearch(searchTerm)
    }, [debounceSearch, searchTerm])

    const items = data?.pages.flatMap((p) => p.instructors) ?? [];
    const formattedItems = items.map((item) => ({
        id: item.id,
        label: item.name,
        image:item.image??undefined
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
            title="Select a teacher"
        />
    );
}

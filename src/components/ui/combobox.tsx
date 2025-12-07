"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface ComboboxProps {
    value: string;
    onChange: (value: string) => void;
    data: Array<{ id: string; label: string, image?: string }>;
    search: string;
    onSearchChange: (value: string) => void;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    title?: string;
}

export function Combobox({ value, onChange, data, search, onSearchChange, fetchNextPage, hasNextPage, isFetchingNextPage, title="Select..." }: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const { ref, inView } = useInView();


    useEffect(() => {
        if (inView && open) {
            fetchNextPage();
        }
    }, [inView, open, fetchNextPage]);

    const selectedItem = data.find((item) => item.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[250px] justify-between">
                    <span className='truncate'>
                        {selectedItem
                            ? selectedItem.label
                            : title}
                    </span>
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[250px] p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search..."
                        value={search}
                        onValueChange={onSearchChange}
                        className="h-9"
                    />

                    <CommandList >
                        <CommandEmpty>No items found.</CommandEmpty>

                        <CommandGroup>
                            {data.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.id}
                                    onSelect={() => {
                                        onChange(item.id);
                                        setOpen(false);
                                    }}
                                >
                                    {item.image && (
                                        <Avatar className="mr-2 h-5 w-5">
                                            <AvatarImage src={item.image} alt={item.label} />
                                            <AvatarFallback>{item.label.charAt(0)}</AvatarFallback>
                                        </Avatar>

                                    )}
                                    <span>{item.label}</span>
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === item.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}

                            {/* Infinite Scroll Trigger */}
                            <div ref={ref} className="py-2 text-center text-sm opacity-70">
                                {isFetchingNextPage
                                    ? <Spinner className="mx-auto" />
                                    : hasNextPage
                                        ? "Scroll to load more"
                                        : "No more results"}
                            </div>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

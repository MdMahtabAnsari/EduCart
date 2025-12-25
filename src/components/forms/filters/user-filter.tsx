"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type FilterUserSchema, filterUserSchema } from "@/lib/schema/user";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export interface UserFilterFormProps {
    onSubmit: (values: FilterUserSchema) => void;
    defaultValues: FilterUserSchema;
    show: {
        search: boolean;
        role: boolean;
        isBanned: boolean;
    }
}

export function UserFilterForm({ onSubmit, defaultValues, show }: UserFilterFormProps) {
    const { search, role, isBanned } = show;
    const form = useForm<FilterUserSchema>({
        resolver: zodResolver(filterUserSchema),
        defaultValues,
        mode: "onChange",
    });


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
                {search && (<FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Search</FormLabel>
                            <FormControl>
                                <Input placeholder="Search by name, email, or username" {...field} />
                            </FormControl>
                            <FormDescription>Search by name, email, or username</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />)}
                {role && (<FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Roles" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status</SelectLabel>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormDescription>Select the enrollment status</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />)}
                {isBanned && (<FormField
                    control={form.control}
                    name="isBanned"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ban Status</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Ban Statuses" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status</SelectLabel>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="banned">Banned</SelectItem>
                                        <SelectItem value="not_banned">Not Banned</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormDescription>Select the enrollment status</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />)}
                <Button type="submit" className="w-full cursor-pointer">
                    Apply Filters
                </Button>
            </form>
        </Form>
    );
}


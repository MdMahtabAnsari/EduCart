"use client";
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {useState} from "react";

type DatePickerProps = {
    value?: Date
    onChange?: (date?: Date) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    disablePastDates?: boolean
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Select date",
    disabled,
    className,
    disablePastDates=false,
}: DatePickerProps) {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "PPP") : placeholder}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(date) => {
                        onChange?.(date)
                        setOpen(false)
                    }}
                    autoFocus
                    disabled={(date) =>
                        disablePastDates
                            ? date < new Date(new Date().setHours(0, 0, 0, 0))
                            : false
                    }
                />
            </PopoverContent>
        </Popover>
    )
}

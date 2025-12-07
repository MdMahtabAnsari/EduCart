import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ErrorProps {
    title?: string
    description?: string
    onRetry?: () => void
}

export function Error({ title = "Something went wrong.", description = "An unexpected error occurred. Please try again.", onRetry }: ErrorProps) {
    return (
        <Alert variant="destructive" className="h-fit w-full flex flex-col justify-center items-center gap-4 overflow-auto">
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
            {onRetry && (
                <Button onClick={onRetry} size='lg'>
                    Retry
                </Button>
            )}
        </Alert>
    );
}
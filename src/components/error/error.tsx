"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    className?: string; // Added so you can adjust padding/margins from the parent
}

export function Error({ 
    title = "Something went wrong", 
    description = "An unexpected error occurred while trying to load this content. Please try again.", 
    onRetry,
    className 
}: ErrorProps) {
    return (
        <div className={cn(
            "w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border-2 border-dashed border-destructive/20 bg-destructive/5 animate-in fade-in zoom-in-95 duration-500", 
            className
        )}>
            {/* Soft-tinted icon container */}
            <div className="bg-background p-4 rounded-full shadow-sm mb-5 ring-1 ring-destructive/10">
                <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            
            <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                {title}
            </h3>
            
            <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
                {description}
            </p>
            
            {onRetry && (
                <Button 
                    onClick={onRetry} 
                    variant="outline"
                    className="border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30 text-destructive transition-all group shadow-sm"
                >
                    <RefreshCcw className="w-4 h-4 mr-2 transition-transform duration-500 group-hover:-rotate-180" />
                    Try Again
                </Button>
            )}
        </div>
    );
}
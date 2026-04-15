"use client";

import { useState, type ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CreateReviewForm, type CreateReviewProps } from "@/components/forms/review/create-review";
import { MessageSquarePlus } from "lucide-react";

interface CreateReviewDialogProps extends CreateReviewProps {
    trigger: ReactNode;
}

export const CreateReviewDialog = ({ courseId, onSubmitSuccess, trigger }: CreateReviewDialogProps) => {
    const [open, setOpen] = useState(false);

    // Wrapper to close the dialog automatically when the form succeeds
    const handleSuccess = () => {
        setOpen(false);
        if (onSubmitSuccess) {
            onSubmitSuccess();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            {/* Added max-width and consistent padding for a better form layout */}
            <DialogContent className="sm:max-w-112.5 p-6 w-full">
                <DialogHeader className="space-y-2.5 pb-2">
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                        <MessageSquarePlus className="w-5 h-5 text-primary" />
                        Write a Review
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        Share your thoughts and experiences about this course to help other learners.
                    </DialogDescription>
                </DialogHeader>
                
                {/* Wrapped the form in a div to ensure proper spacing from the header */}
                <div className="pt-2">
                    <CreateReviewForm courseId={courseId} onSubmitSuccess={handleSuccess} />
                </div>
            </DialogContent>
        </Dialog>
    );
};
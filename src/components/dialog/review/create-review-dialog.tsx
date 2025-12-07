import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CreateReviewForm,type CreateReviewProps } from "@/components/forms/review/create-review";
import { ReactNode } from "react";

interface CreateReviewDialogProps extends CreateReviewProps {
    trigger: ReactNode;
}
export const CreateReviewDialog = ({ courseId, onSubmitSuccess, trigger }: CreateReviewDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                        Share your thoughts about the course.
                    </DialogDescription>
                </DialogHeader>
                <CreateReviewForm courseId={courseId} onSubmitSuccess={onSubmitSuccess} />
            </DialogContent>
        </Dialog>
    );
}
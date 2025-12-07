import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SectionForm, type CreateSectionFormProps } from "@/components/forms/section/create-section";
import { ReactNode } from "react";

interface CreateSectionDialogProps extends CreateSectionFormProps {
    trigger: ReactNode;
}

export const CreateSectionDialog = ({ courseId, trigger,onSubmission }: CreateSectionDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Section</DialogTitle>
                    <DialogDescription>
                        Add a new section to your course.
                    </DialogDescription>
                </DialogHeader>
                <SectionForm courseId={courseId} onSubmission={onSubmission} />
            </DialogContent>
        </Dialog>
    );
}
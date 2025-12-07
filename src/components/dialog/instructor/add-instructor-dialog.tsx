import { AddInstructorForm,AddInstructorProps } from "@/components/forms/instructor/add-instructor";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from "react";

interface AddInstructorDialogProps extends AddInstructorProps {
    trigger: ReactNode;
}

export const AddInstructorDialog = ({ courseId, onSuccess, trigger }: AddInstructorDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Instructor</DialogTitle>
                    <DialogDescription>
                        Modify the instructor&apos;s permissions for this course.
                    </DialogDescription>
                </DialogHeader>
                <AddInstructorForm courseId={courseId} onSuccess={onSuccess} />
            </DialogContent>
        </Dialog>
    );
}

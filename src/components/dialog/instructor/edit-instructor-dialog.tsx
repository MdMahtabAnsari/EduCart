import { EditInstructorForm, EditInstructorProps } from "@/components/forms/instructor/edit-instructor";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from "react";

interface EditInstructorDialogProps extends EditInstructorProps {
    trigger: ReactNode;
}

export const EditInstructorDialog = ({ values, onSuccess, trigger, isOwner }: EditInstructorDialogProps) => {
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
                <EditInstructorForm values={values} onSuccess={onSuccess} isOwner={isOwner} />
            </DialogContent>
        </Dialog>
    );
}

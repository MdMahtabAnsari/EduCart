"use client";

import { useState, type ReactNode } from "react";
import { AddInstructorForm, type AddInstructorProps } from "@/components/forms/instructor/add-instructor";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus2 } from "lucide-react";

interface AddInstructorDialogProps extends AddInstructorProps {
    trigger: ReactNode;
}

export const AddInstructorDialog = ({ courseId, onSuccess, trigger }: AddInstructorDialogProps) => {
    const [open, setOpen] = useState(false);

    // Wrapper to ensure the modal closes only when the instructor is successfully added
    const handleSuccess = () => {
        setOpen(false);
        onSuccess?.();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-125 p-0 overflow-hidden border-none shadow-2xl">
                {/* Visual Header */}
                <div className="bg-primary/5 p-6 pb-4">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <UserPlus2 className="w-5 h-5 text-primary" />
                            </div>
                            <DialogTitle className="text-xl font-bold tracking-tight">
                                Add Instructor
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-sm leading-relaxed">
                            Invite a new collaborator to help manage and teach this course. They will receive an invitation to join.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Form Area with controlled height/scroll if needed */}
                <div className="p-6 pt-2 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <AddInstructorForm 
                        courseId={courseId} 
                        onSuccess={handleSuccess} 
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
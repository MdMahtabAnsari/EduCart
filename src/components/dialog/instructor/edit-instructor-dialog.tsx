"use client";

import { useState, type ReactNode } from "react";
import { EditInstructorForm, type EditInstructorProps } from "@/components/forms/instructor/edit-instructor";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ShieldAlert, UserCog } from "lucide-react";

interface EditInstructorDialogProps extends EditInstructorProps {
    trigger: ReactNode;
}

export const EditInstructorDialog = ({ values, onSuccess, trigger, isOwner }: EditInstructorDialogProps) => {
    const [open, setOpen] = useState(false);

    // Wrapper to close the dialog automatically after a successful update
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
                
                {/* Visual Header with contextual background */}
                <div className="bg-primary/5 p-6 pb-4">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <UserCog className="w-5 h-5 text-primary" />
                            </div>
                            <DialogTitle className="text-xl font-bold tracking-tight">
                                Edit Instructor
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-sm leading-relaxed">
                            Modify access levels and revenue share for this team member.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Owner Warning (Optional logic integration) */}
                {isOwner && (
                    <div className="mx-6 mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
                        <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5" />
                        <p className="text-[11px] text-amber-700 leading-tight">
                            <strong>Note:</strong> You are editing an Owner account. Some core permissions may be restricted to ensure course stability.
                        </p>
                    </div>
                )}

                {/* Form Area */}
                <div className="p-6 pt-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <EditInstructorForm 
                        values={values} 
                        onSuccess={handleSuccess} 
                        isOwner={isOwner} 
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
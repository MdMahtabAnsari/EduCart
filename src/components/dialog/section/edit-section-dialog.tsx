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
import { SectionForm, type EditSectionFormProps } from "@/components/forms/section/edit-section";
import { SquarePen } from "lucide-react";

interface EditSectionDialogProps extends EditSectionFormProps {
    trigger: ReactNode;
}

export const EditSectionDialog = ({ section, trigger, onSubmission }: EditSectionDialogProps) => {
    const [open, setOpen] = useState(false);

    // Intercept the submission success to automatically close the modal
    const handleSuccess = () => {
        setOpen(false);
        onSubmission?.();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-125 p-0 overflow-hidden border-none shadow-2xl">
                
                {/* Premium Tinted Header */}
                <div className="bg-primary/5 p-6 pb-4 border-b border-border/40">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <SquarePen className="w-5 h-5" />
                            </div>
                            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                                Edit Section
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-sm leading-relaxed">
                            Update the title and configuration of this curriculum module.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Form Area */}
                <div className="p-6 pt-4">
                    <SectionForm 
                        section={section} 
                        onSubmission={handleSuccess} 
                    />
                </div>
                
            </DialogContent>
        </Dialog>
    );
};
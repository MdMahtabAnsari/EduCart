import { type BanFormProps,BanForm } from "@/components/forms/ban/ban";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from "react";

interface BanDialogProps extends BanFormProps {
    trigger: ReactNode;
}

export const BanDialog = ({ userId, onSuccess, trigger }: BanDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ban User</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to ban the user.
                    </DialogDescription>
                </DialogHeader>
                <BanForm userId={userId} onSuccess={onSuccess} />
            </DialogContent>
        </Dialog>
    );
}

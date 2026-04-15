import { OrderRouterOutputs } from "@/server/api/routers/user/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter";
import { 
    ReceiptText, 
    Hash, 
    Calendar, 
    CreditCard, 
    Activity, 
    ExternalLink,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentStatus } from "@/generated/prisma/enums";

interface PaymentProps {
    payment: OrderRouterOutputs["getOrderById"]["order"]["payment"][number];
}

export function Payment({ payment }: PaymentProps) {
    const { providerPayment, amount, status, txnId, createdAt, updatedAt } = payment;

    return (
        <Card className="w-full border-none shadow-none bg-muted/30 rounded-xl overflow-hidden">
            <CardHeader className="pb-2 pt-5">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <ReceiptText className="w-4 h-4 text-primary" />
                    Transaction Details
                </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-5 pt-4">
                {/* Main Transaction Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    
                    <ResponsiveInfo 
                        icon={<Hash className="w-3.5 h-3.5" />}
                        label="Transaction ID" 
                        value={txnId} 
                        isCopyable
                    />

                    <ResponsiveInfo 
                        icon={<Activity className="w-3.5 h-3.5" />}
                        label="Final Amount" 
                        value={formatCurrency(amount, 'INR')} 
                        className="text-primary font-bold"
                    />

                    {providerPayment && (
                        <>
                            <ResponsiveInfo 
                                icon={<CreditCard className="w-3.5 h-3.5" />}
                                label="Payment Provider" 
                                value={providerPayment.provider} 
                                className="capitalize"
                            />
                            <ResponsiveInfo 
                                icon={<ExternalLink className="w-3.5 h-3.5" />}
                                label="Provider ID" 
                                value={providerPayment.providerPaymentId} 
                            />
                        </>
                    )}

                    <ResponsiveStatus status={status} />
                </div>

                {/* Timeline Section */}
                <div className="pt-4 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResponsiveInfo 
                        icon={<Calendar className="w-3.5 h-3.5" />}
                        label="Initiated" 
                        value={formatDate(createdAt)} 
                    />
                    <ResponsiveInfo 
                        icon={<Clock className="w-3.5 h-3.5" />}
                        label="Last Updated" 
                        value={formatDate(updatedAt)} 
                    />
                </div>
            </CardContent>
        </Card>
    );
}

/* ------------------ Reusable Responsive Components ------------------ */

const ResponsiveInfo = ({
    label,
    value,
    icon,
    className,
    // isCopyable = false
}: {
    label: string;
    value: string;
    icon?: React.ReactNode;
    className?: string;
    isCopyable?: boolean;
}) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            {icon}
            {label}
        </div>
        <span className={cn(
            "text-sm font-medium break-all selection:bg-primary/20",
            className
        )}>
            {value}
        </span>
    </div>
);

const ResponsiveStatus = ({ status }: { status: PaymentStatus }) => {
    const isSuccess = status === "COMPLETED";
    const isPending = status === "PENDING";

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                <Activity className="w-3.5 h-3.5" />
                Payment Status
            </div>
            <Badge 
                variant="outline"
                className={cn(
                    "w-fit px-2.5 py-0.5 rounded-full border-none font-bold text-[10px] uppercase tracking-tighter shadow-sm",
                    isSuccess && "bg-emerald-500/10 text-emerald-600",
                    isPending && "bg-amber-500/10 text-amber-600",
                    !isSuccess && !isPending && "bg-destructive/10 text-destructive"
                )}
            >
                <div className="flex items-center gap-1.5">
                    {isSuccess && <CheckCircle2 className="w-3 h-3" />}
                    {isPending && <Clock className="w-3 h-3" />}
                    {!isSuccess && !isPending && <AlertCircle className="w-3 h-3" />}
                    {status}
                </div>
            </Badge>
        </div>
    );
};

/* ------------------ Helpers ------------------ */

const formatDate = (date: Date) =>
    date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
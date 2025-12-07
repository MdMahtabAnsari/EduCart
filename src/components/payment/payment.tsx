import { OrderRouterOutputs } from "@/server/api/routers/user/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter";

interface PaymentProps {
    payment: OrderRouterOutputs["getOrderById"]["order"]["payment"][number];
}

export function Payment({ payment }: PaymentProps) {
    const { providerPayment, amount, status, txnId, createdAt, updatedAt } = payment;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg">Payment Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

                {providerPayment && (
                    <>
                        <ResponsiveInfo label="Provider" value={providerPayment.provider} />
                        <Separator />
                        <ResponsiveInfo
                            label="Provider Payment ID"
                            value={providerPayment.providerPaymentId}
                        />
                        <Separator />
                    </>
                )}

                <ResponsiveInfo label="Transaction ID" value={txnId} />
                <Separator />

                <ResponsiveInfo label="Amount" value={formatCurrency(amount, 'INR')} />
                <Separator />

                <ResponsiveStatus status={status} />
                <Separator />

                <ResponsiveInfo label="Created At" value={formatDate(createdAt)} />
                <Separator />

                <ResponsiveInfo label="Updated At" value={formatDate(updatedAt)} />
            </CardContent>
        </Card>
    );
}

/* ------------------ Reusable Responsive Components ------------------ */

/**
 * Fully mobile-safe row:
 * - Items wrap instead of overflowing
 * - Long text truncates nicely
 * - Maintains clean layout on all screen sizes
 */
const ResponsiveInfo = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => (
    <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium wrap-break-word max-w-full">{value}</span>
    </div>
);

const ResponsiveStatus = ({ status }: { status: string }) => {
    const variant =
        status === "SUCCESS"
            ? "default"
            : status === "PENDING"
                ? "secondary"
                : "destructive";

    return (
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm gap-1">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={variant} className="uppercase w-fit">
                {status}
            </Badge>
        </div>
    );
};

/* ------------------ Helpers ------------------ */

const formatDate = (date: Date) =>
    date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

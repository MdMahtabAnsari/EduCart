import { OrderRouterOutputs } from "@/server/api/routers/user/order";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Payment } from "@/components/payment/payment";

interface paymentsProps {
    payments: OrderRouterOutputs["getOrderById"]["order"]["payment"]
}

export function PaymentList({ payments }: paymentsProps) {
    return (
        <Card className="w-full h-fit bg-transparent shadow-none border-none">
            <CardHeader>
                <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {payments.map((payment) => (
                    <Payment key={payment.id} payment={payment} />
                ))}
            </CardContent>
        </Card>
    );
}
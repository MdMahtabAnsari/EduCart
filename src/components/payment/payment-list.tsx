import { OrderRouterOutputs } from "@/server/api/routers/user/order";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Payment } from "@/components/payment/payment";
import { History, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface paymentsProps {
    payments: OrderRouterOutputs["getOrderById"]["order"]["payment"]
}

export function PaymentList({ payments }: paymentsProps) {
    return (
        <Card className="w-full h-fit bg-transparent shadow-none border-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="px-0 pb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <History className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-bold tracking-tight">
                            Payment History
                        </CardTitle>
                    </div>
                    
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <CreditCard className="w-3 h-3" />
                        {payments.length} {payments.length === 1 ? 'Transaction' : 'Transactions'}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-0 space-y-6 relative">
                {/* Visual Timeline Connector (Vertical Line) */}
                {payments.length > 1 && (
                    <div className="absolute left-0 top-2 bottom-8 w-px bg-border/60 ml-px hidden sm:block" />
                )}

                <div className="flex flex-col gap-6">
                    {payments.map((payment) => (
                        <div 
                            key={payment.id} 
                            className={cn(
                                "relative",
                                payments.length > 1 && "sm:pl-6"
                            )}
                        >
                            {/* Timeline Node Icon */}
                            {payments.length > 1 && (
                                <div className="absolute -left-1 top-6 w-2 h-2 rounded-full bg-border border-4 border-background hidden sm:block" />
                            )}
                            
                            <Payment payment={payment} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
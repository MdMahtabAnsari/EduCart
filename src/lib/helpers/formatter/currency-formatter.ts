
export function formatCurrency(amount: number, currency: string, locale: string = 'en-IN'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);}


export function formatDate(date:Date): string {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        formatMatcher: 'best fit',
    }).format(date);
}

export function formatDateTime(date:Date): string {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        formatMatcher: 'best fit',
    }).format(date);
}
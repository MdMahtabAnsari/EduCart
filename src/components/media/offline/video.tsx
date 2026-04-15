"use client";
import { Skeleton } from '@/components/ui/skeleton';



interface VideoProps {
    url: string;
    className?: string;
}

export function Video({ url, className }: VideoProps) {
    return (
        <video
            src={url}
            controls
            className={className ? className : 'w-48 h-48'}
        />
    );
}



export function VideoSkeleton({ className }: { className?: string }) {
    return <Skeleton className={className ? className : 'w-48 h-48'} />;
}
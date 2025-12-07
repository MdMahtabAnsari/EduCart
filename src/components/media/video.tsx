"use client";
import { CldVideoPlayer } from 'next-cloudinary';
import { Skeleton } from '@/components/ui/skeleton';
import 'next-cloudinary/dist/cld-video-player.css';


interface VideoProps {
    url: string;
    className?: string;
}

export function Video({ url, className }: VideoProps) {
    return (
        <CldVideoPlayer
            src={url}
            className={className}
            controls
            // width="100%"
            // height="100%"
            logo={false}
        />
    );
}



export function VideoSkeleton({ className }: { className?: string }) {
    return <Skeleton className={className ? className : 'w-48 h-48'} />;
}
"use client";
import { CldImage } from 'next-cloudinary';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom';

interface ImageProps {
    url: string;
    alt?: string;
    className?: string;
}

export function Image({ url, alt, className }: ImageProps) {
    return (
        <ImageZoom>
        <CldImage
            src={url}
            alt={alt ? alt : 'Image'}
            className={className}
            width={500}
            height={500}
        />
        </ImageZoom>
    );
}

export function ImageSkeleton({ className }: { className?: string }) {
    return <Skeleton className={className ? className : 'w-48 h-48'} />;
}

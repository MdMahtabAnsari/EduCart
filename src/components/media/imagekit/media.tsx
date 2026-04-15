import { MediaType } from '@/generated/prisma/enums';
import { ImageKitProvider } from '@imagekit/next';
import { Video } from '@/components/media/imagekit/video';
import { Image } from '@/components/media/imagekit/image';

interface MediaProps {
    url: string;
    type: MediaType;
    className?: string;
    alt?: string;
}

export function Media({ url, type, className, alt }: MediaProps) {
    return (
        <ImageKitProvider
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGE_KIT_URL_ENDPOINT!}
        >
            {type === 'IMAGE' ? (
                <Image url={url} className={className} alt={alt} />
            ) : (
                <Video url={url} className={className} />
            )}
        </ImageKitProvider>

    );
}

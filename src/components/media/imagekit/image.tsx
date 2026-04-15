import {Image as IkImage} from "@imagekit/next"

interface ImageProps {
    url: string;
    alt?: string;
    className?: string;
}

export function Image({ url, alt, className }: ImageProps) {
    return (
        <IkImage
            src={url}
            alt={alt ? alt : 'Image'}
            className={className}
            width={500}
            height={500}
        />
    );
}

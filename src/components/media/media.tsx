import { Image } from "@/components/media/image";
import { Video} from "@/components/media/video";
import { MediaType } from "@/generated/prisma/enums";

interface MediaProps {
    url: string;
    type: MediaType;
    className?: string;
    alt?: string;
}

export function Media({ url, type, className, alt }: MediaProps) {
    if (type === 'IMAGE') {
        return <Image url={url} className={className} alt={alt} />;
    }
    else{

    return <Video url={url} className={className} />;
    }
}

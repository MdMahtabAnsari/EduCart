import {Video as IkVideo} from "@imagekit/next"

interface VideoProps {
    url: string;
    className?: string;
}

export function Video({ url, className }: VideoProps) {
    return (
        <IkVideo
            src={`${url}/ik-master.m3u8`}
            // src={url}
            className={className}
            controls
            
        />
    );
}
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface TagBadgesProps {
    tags: { id: string; name: string }[];
    className?: string;
}

export function TagBadges({ tags, className }: TagBadgesProps) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {tags.map((tag) => (
                <Badge key={tag.id} className="bg-blue-500 text-white">
                    {tag.name}
                </Badge>
            ))}
        </div>
    );
}

export function TagBadgesSkeleton({ className }: { className?: string }) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {[1, 2, 3].map((index) => (
                <Skeleton key={index} className="h-6 w-20 rounded-full" />
            ))}
        </div>
    );
}

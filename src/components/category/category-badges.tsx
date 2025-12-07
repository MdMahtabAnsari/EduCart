import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryBadgesProps {
    categories: { id: string; name: string }[];
    className?: string;
}

export function CategoryBadges({ categories, className }: CategoryBadgesProps) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {categories.map((category) => (
                <Badge key={category.id} className="bg-blue-500 text-white">
                    {category.name}
                </Badge>
            ))}
        </div>
    );
}

export function CategoryBadgesSkeleton({ className }: { className?: string }) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {[1, 2, 3].map((index) => (
                <Skeleton key={index} className="h-6 w-20 rounded-full" />
            ))}
        </div>
    );
}

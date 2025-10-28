'use client';
import {
    Tags,
    TagsContent,
    TagsEmpty,
    TagsGroup,
    TagsInput,
    TagsItem,
    TagsList,
    TagsTrigger,
    TagsValue,
} from '@/components/ui/shadcn-io/tags';
import { CheckIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Tag } from '@/generated/prisma/client';
import { getAllTags } from '@/lib/api/common/tag';
import { Skeleton } from '@/components/ui/skeleton';

interface TagSelectorProps {
    selected: string[];
    onChange: (tags: string[]) => void;
}

export function TagSelector({ selected, onChange }: TagSelectorProps) {

    const { data, isPending, error } = useQuery<{ tags: Tag[] }>({
        queryKey: ['tags'],
        queryFn: () => getAllTags(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    if (isPending) {
       return <SelectorSkeleton />;
    }
    if (error) {
        return <div>Error loading tags: {error.message}</div>;
    }

    const tags = data?.tags.map((tag) => ({
        id: tag.id,
        label: tag.name,
    })) || [];

    const handleSelect = (tagId: string) => {
        if (!selected.includes(tagId)) {
            onChange([...selected, tagId]);
        }
    };
    const handleRemove = (tagId: string) => {
        onChange(selected.filter((id) => id !== tagId));
    }
    return (
        <Tags className="max-w-[300px]">
            <TagsTrigger>
                {selected.map((tag) => (
                    <TagsValue key={tag} onRemove={() => handleRemove(tag)}>
                        {tags.find((t) => t.id === tag)?.label}
                    </TagsValue>
                ))}
            </TagsTrigger>
            <TagsContent>
                <TagsInput placeholder="Search tag..." />
                <TagsList>
                    <TagsEmpty />
                    <TagsGroup>
                        {tags.map((tag) => (
                            <TagsItem key={tag.id} onSelect={handleSelect} value={tag.id}>
                                {tag.label}
                                {selected.includes(tag.id) && (
                                    <CheckIcon className="text-muted-foreground" size={14} />
                                )}
                            </TagsItem>
                        ))}
                    </TagsGroup>
                </TagsList>
            </TagsContent>
        </Tags>
    );
};

export const SelectorSkeleton = () => {
    return (
        <div className="max-w-[300px]">
            <Skeleton className="h-10 w-full rounded-md" />
        </div>
    );
};

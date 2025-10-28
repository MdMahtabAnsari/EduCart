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
import { Category } from '@/generated/prisma/client';
import { getAllCategories } from '@/lib/api/common/category';
import { SelectorSkeleton } from "@/components/selectors/tag-selector";

interface CategorySelectorProps {
    selected: string[];
    onChange: (categories: string[]) => void;
}

export function CategorySelector({ selected, onChange }: CategorySelectorProps) {

    const { data, isPending, error } = useQuery<{ categories: Category[] }>({
        queryKey: ['categories'],
        queryFn: () => getAllCategories(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    if (isPending) {
        return <SelectorSkeleton />;
    }
    if (error) {
        return <div>Error loading categories: {error.message}</div>;
    }

    const categories = data?.categories.map((category) => ({
        id: category.id,
        label: category.name,
    })) || [];

    const handleSelect = (categoryId: string) => {
        if (!selected.includes(categoryId)) {
            onChange([...selected, categoryId]);
        }
    };
    const handleRemove = (categoryId: string) => {
        onChange(selected.filter((id) => id !== categoryId));
    }
    return (
        <Tags className="max-w-[300px]">
            <TagsTrigger>
                {selected.map((category) => (
                    <TagsValue key={category} onRemove={() => handleRemove(category)}>
                        {categories.find((c) => c.id === category)?.label}
                    </TagsValue>
                ))}
            </TagsTrigger>
            <TagsContent>
                <TagsInput placeholder="Search category..." />
                <TagsList>
                    <TagsEmpty />
                    <TagsGroup>
                        {categories.map((category) => (
                            <TagsItem key={category.id} onSelect={handleSelect} value={category.id}>
                                {category.label}
                                {selected.includes(category.id) && (
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

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
import { SelectorSkeleton } from "@/components/selectors/tag-selector";
import {api} from "@/trpc/react";

interface CategorySelectorProps {
    selected: string[];
    onChange: (categories: string[]) => void;
}

export function TeacherSelector({ selected, onChange }: CategorySelectorProps) {


    const { data, isPending, error } = api.common.teacher.getTeachersIdAndName.useQuery();

    if (isPending) {
        return <SelectorSkeleton />;
    }
    if (error) {
        return <div>Error loading teachers: {error.message}</div>;
    }
    const teachers = data?.map((teacher) => ({
        id: teacher.id,
        label: teacher.name,
    })) || [];

    const handleSelect = (teacherId: string) => {
        if (!selected.includes(teacherId)) {
            onChange([...selected, teacherId]);
        }
    };
    const handleRemove = (teacherId: string) => {
        onChange(selected.filter((id) => id !== teacherId));
    }
    return (
        <Tags className="max-w-[300px]">
            <TagsTrigger>
                {selected.map((teacher) => (
                    <TagsValue key={teacher} onRemove={() => handleRemove(teacher)}>
                        {teachers.find((t) => t.id === teacher)?.label}
                    </TagsValue>
                ))}
            </TagsTrigger>
            <TagsContent>
                <TagsInput placeholder="Search teacher..." />
                <TagsList>
                    <TagsEmpty />
                    <TagsGroup>
                        {teachers.map((teacher) => (
                            <TagsItem key={teacher.id} onSelect={handleSelect} value={teacher.id}>
                                {teacher.label}
                                {selected.includes(teacher.id) && (
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

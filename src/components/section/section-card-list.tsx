import { SectionCard } from "@/components/section/section-card";
import { SectionRouterOutputs } from "@/server/api/routers/teacher/section";

export interface SectionCardListProps {
    sections: SectionRouterOutputs["sectionWithInfiniteScroll"]["sections"];
}

export const SectionCardList = ({ sections }: SectionCardListProps) => {

    return (
        <>
            {sections.map(section => (
                <SectionCard key={section.id} section={section} />
            ))}
        </>
    );
}
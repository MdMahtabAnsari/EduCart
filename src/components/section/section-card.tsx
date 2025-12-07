import { Card, CardTitle } from "@/components/ui/card-hover-effect";
import { SectionRouterOutputs } from "@/server/api/routers/teacher/section";


interface SectionCardProps {
    section: SectionRouterOutputs["sectionWithInfiniteScroll"]["sections"][number];
}

export const SectionCard = ({ section }: SectionCardProps) => {

    return (
        <Card>
            <CardTitle>{section.title}</CardTitle>
        </Card>
    );
}
import { prisma } from '@/lib/db/prisma';
import { faker } from '@faker-js/faker';
import ISO6391 from 'iso-639-1';


async function main() {
    //   create 10 categories with unique names
    await prisma.language.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.category.deleteMany();
    const categories = [];
    const categoryNames = new Set<string>();
    while (categoryNames.size < 10) {
        categoryNames.add(faker.commerce.department());
    }
    for (const name of categoryNames) {
        const category = await prisma.category.create({
            data: { name },
        });
        if (category) {
            categories.push(category);
        }
    }
    // create 20 tags with unique names
    const tags = [];
    const tagNames = new Set<string>();
    while (tagNames.size < 20) {
        tagNames.add(faker.commerce.productAdjective());
    }
    for (const name of tagNames) {
        const tag = await prisma.tag.create({
            data: { name },
        });
        if (tag) {
            tags.push(tag);
        }
    }
    console.log(`Created ${categories.length} categories and ${tags.length} tags.`);
    const languages = ISO6391.getAllCodes().map(code => ({ code }));
    await prisma.language.createMany({
        data: languages,
    });
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(() => {
        void prisma.$disconnect();
    });
import "./env";
import {ResourceRepository} from "../repositories/ResourceRepository";
import {Category, MediaResource, Tag} from "../types/supabase";
import {faker} from '@faker-js/faker';
import {CategoryRepository} from "../repositories/CategoryRepository";
import {TagRepository} from "../repositories/TagRepository";
import {ResourceTagRepository} from "../repositories/ResourceTagRepository";


const createCategories = (qty: number = 1): Array<Partial<Category>> => {
    return uniqueWords(qty, faker.database.engine).map(title => ({title}));
};

const createTags = (qty: number = 1): Array<Partial<Tag>> => {
    return uniqueWords(qty, faker.hacker.noun).map(title => ({title}));
};

const createResource = (categoryId: number): Omit<MediaResource, "id" | "created_at"> => {
    const publishedOptions = [null, new Date().toISOString()];
    return {
        title: faker.company.catchPhrase(),
        author: faker.name.findName(),
        category_id: categoryId,
        description: faker.hacker.phrase(),
        published_at: publishedOptions[Math.floor(Math.random() * publishedOptions.length)],
        curator_address: null,
        image_url: faker.image.cats(),
        resource_url: faker.internet.url(),
        
    };
};

const uniqueWords = (qty: number, generator: () => string): string[] => {
    const words: { [key: string]: number; } = {};
    const hasWord = (word: string): boolean => Object.keys(words).includes(word);
    const increaseWordCount = (word: string) => words[word] = (words[word] ?? 0) + 1;

    return Array.from(Array(qty)).map(() => {
        const title = generator();
        let extra = "";
        if (hasWord(title)) {
            extra += words[title];
        }
        increaseWordCount(title);

        return title + extra;
    });
};

const seedCategories = async (qty: number = 1): Promise<Array<Category>> => {
    const {data} = await new CategoryRepository().createMany(createCategories(qty));

    return data;
};

const seedTags = async (qty: number = 1): Promise<Array<Tag>> => {
    const {data} = await new TagRepository().createMany(createTags(qty));

    return data;
};

const seedResource = async (categoryId: number): Promise<MediaResource> => {
    const {data} = await new ResourceRepository().create(createResource(categoryId));

    return data;
};

const seedDb = async () => {
    const categories = await seedCategories(10);
    const tags = await seedTags(20);
    const categoryIds = categories.map(item => item.id);
    const tagIds = tags.map(item => item.id);

    for (let i of [...Array(10).keys()]) {
        const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
        const resource = await seedResource(categoryId);
        // Good enough for our use case
        const randTagIds = [...tagIds].sort(() => Math.random() - Math.random())
            .slice(0, Math.floor(Math.random() * categoryIds.length / 2) || 1);

        const resourceTags = randTagIds.map((tagId) => ({
            tag_id: tagId,
            resource_id: resource.id,
        }));

        await new ResourceTagRepository().createMany(resourceTags);

    }

}

seedDb();


import './env';

import * as erdCore from '@elrondnetwork/elrond-core-js';
import { faker } from '@faker-js/faker';

import ApplicationsRepository from '../repositories/ApplicationsRepository';
import BountyRepository from '../repositories/BountyRepository';
import BountyTagRepository from '../repositories/BountyTagRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { ResourceRepository } from '../repositories/ResourceRepository';
import { ResourceTagRepository } from '../repositories/ResourceTagRepository';
import ReviewsRepository from '../repositories/ReviewsRepository';
import SocialLinksRepository from '../repositories/SocialLinksRepository';
import { TagRepository } from '../repositories/TagRepository';
import UserRepository from '../repositories/UserRepository';
import {
    Bounty,
    BountyApplication,
    BountyExperienceLevel,
    BountyType,
    Category,
    MediaResource,
    Tag,
    User,
} from '../types/supabase';
import { createSlug } from '../utils/slugify';

const createCategories = (qty: number = 1): Array<Partial<Category>> => {
  return uniqueWords(qty, faker.database.engine).map((title) => ({ title }));
};

const createTags = (qty: number = 1): Array<Partial<Tag>> => {
  return uniqueWords(qty, faker.hacker.noun).map((title) => ({ title }));
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
    slug: null,
  };
};

const generateWalletAddress = (): string => {
  const account = new erdCore.account();
  account.loadFromMnemonic(account.generateMnemonic());

  return account.address();
};

const createUser = (): Omit<User, "id" | "created_at" | "handle"> => {
  return {
    wallet: generateWalletAddress(),
    avatar_url: faker.image.avatar(),
    name: faker.name.findName(),
    description: faker.hacker.phrase(),
    verified: Math.random() > 0.5,
  };
};

const uniqueWords = (qty: number, generator: () => string): string[] => {
  const words: { [key: string]: number } = {};
  const hasWord = (word: string): boolean => Object.keys(words).includes(word);
  const increaseWordCount = (word: string) => (words[word] = (words[word] ?? 0) + 1);

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
  const { data } = await new CategoryRepository().createMany(createCategories(qty));

  return data;
};

const seedTags = async (qty: number = 1): Promise<Array<Tag>> => {
  const { data } = await new TagRepository().createMany(createTags(qty));

  return data;
};

const seedResource = async (categoryId: number): Promise<MediaResource> => {
  const repo = new ResourceRepository();
  const { data } = await repo.create(createResource(categoryId));
  const slug = createSlug(data);
  await repo.update(data.id, { slug });

  return data;
};

const seedResources = async (qty: number, tags: Tag[]) => {
  const categories = await seedCategories(10);
  const categoryIds = categories.map((item) => item.id);
  const tagIds = tags.map((item) => item.id);

  for (let i of [...Array(qty).keys()]) {
    const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
    const resource = await seedResource(categoryId);
    // Good enough for our use case
    const randTagIds = [...tagIds]
      .sort(() => Math.random() - Math.random())
      .slice(0, Math.floor((Math.random() * categoryIds.length) / 2) || 1);

    const resourceTags = randTagIds.map((tagId) => ({
      tag_id: tagId,
      resource_id: resource.id,
    }));

    await new ResourceTagRepository().createMany(resourceTags);
  }
};

const seedUsers = async (qty: number = 1) => {
  const users = Array.from(Array(qty)).map(() => createUser());

  const { data, error } = await new UserRepository().createMany(users);
  if (error) {
    throw error;
  }

  const socialLinksRepo = new SocialLinksRepository();
  const userSocialLinks = data.map((user) => ({
    user_id: user.id,
    platform: ["twitter", "github", "discord", "linkedin"][Math.floor(Math.random() * 3)],
    username: faker.internet.userName(),
  }));

  // @ts-ignore
  await socialLinksRepo.createMany(userSocialLinks);

  return data;
};
const seedBounty = async (user: User) => {
  const expLevels: BountyExperienceLevel[] = ["beginner", "intermediate", "experienced"];
  const bountyTypes: BountyType[] = ["single_worker", "many_workers"];
  const issueTypes = ["bug", "project", "design", "docs"];
  const { data, error } = await new BountyRepository().create({
    title: faker.name.jobTitle(),
    description: faker.hacker.phrase(),
    acceptance_criteria: faker.lorem.paragraph(3),
    owner_id: user.id,
    experience_level: expLevels[Math.floor(Math.random() * expLevels.length)],
    issue_type: issueTypes[Math.floor(Math.random() * issueTypes.length)],
    project_type: bountyTypes[Math.floor(Math.random() * bountyTypes.length)],
    requires_work_permission: Math.random() > 0.5,
    status: "open",
    value: Math.floor(Math.random() * 100),
    repository_url: faker.internet.url(),
  });

  if (error) {
    throw error;
  }

  return data;
};

async function seedReviews(bounty: Bounty, applications: BountyApplication[]) {
  if (bounty.status === "canceled" || bounty.status === "expired") {
    return;
  }
  const apps = applications.filter((application) => application.approval_status !== "rejected");
  const reviews = [];
  for (let application of apps) {
    const ownerReview = {
      bounty_application_id: application.id,
      reviewer_id: bounty.owner_id,
      user_id: application.user_id,
      rating: Math.ceil(Math.random() * 5),
      review: faker.lorem.sentences(Math.ceil(Math.random() * 3)),
    };
    const workerReview = {
      bounty_application_id: application.id,
      reviewer_id: application.user_id,
      user_id: bounty.owner_id,
      rating: Math.ceil(Math.random() * 5),
      review: faker.lorem.sentences(Math.ceil(Math.random() * 3)),
    };

    reviews.push(ownerReview, workerReview);
  }

  await new ReviewsRepository().createMany(reviews);
}

const seedBounties = async (tagIds) => {
  const users = await seedUsers(10);
  const bounties = [];
  for (let user of users) {
    const qty = Math.floor(Math.random() * 10);
    for (let i of [...Array(qty).keys()]) {
      const bounty = await seedBounty(user);
      bounties.push(bounty);
      const randTagIds = [...tagIds]
        .sort(() => Math.random() - Math.random())
        .slice(0, Math.floor((Math.random() * tagIds.length) / 2) || 1);

      const resourceTags = randTagIds.map((tagId) => ({
        tag_id: tagId,
        bounty_id: bounty.id,
      }));

      await new BountyTagRepository().createMany(resourceTags);
    }
  }
  const workers = await seedUsers(20);
  const randBounties = [...bounties]
    .sort(() => Math.random() - Math.random())
    .slice(0, Math.floor((Math.random() * bounties.length) / 2) || 1);
  const applicationsRepo = new ApplicationsRepository();
  for (let bounty of randBounties) {
    const applications = [...workers]
      .sort(() => Math.random() - Math.random())
      .slice(0, Math.floor((Math.random() * workers.length) / 2) || 1)
      .map((worker) => {
        const approvalStatus = ["approved", "rejected", "pending"][Math.floor(Math.random() * 3)];
        const workStatus = ["rejected", "pending"].includes(approvalStatus)
          ? "pending"
          : ["in_progress", "completed"][Math.floor(Math.random() * 2)];

        return {
          bounty_id: bounty.id,
          user_id: worker.id,
          approval_status: approvalStatus,
        };
      });

    // @ts-ignore
    const { data } = await applicationsRepo.createMany(applications);

    await seedReviews(bounty, data as BountyApplication[]);
  }
};

const seedDb = async () => {
  const tags = await seedTags(20);
  const tagIds = tags.map((item) => item.id);
  await seedResources(10, tags);
  await seedBounties(tagIds);
};

seedDb();

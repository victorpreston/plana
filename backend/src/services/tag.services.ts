import prisma from '../config/database.config';
import { Tag } from '../interfaces/tag.interfaces';

// Function to map Prisma Tag to TypeScript Tag
const mapTag = (prismaTag: any): Tag => {
  return {
    id: prismaTag.id,
    name: prismaTag.name,
    events: prismaTag.events,
    createdAt: prismaTag.createdAt,
    updatedAt: prismaTag.updatedAt,
    isDeleted: prismaTag.isDeleted,
  };
};

// Function to create a new tag
export const createTag = async (name: string): Promise<Tag> => {
  const newTag = await prisma.tag.create({
    data: {
      name,
    },
  });

  return mapTag(newTag);
};

// Function to update a tag
export const updateTag = async (id: string, name: string): Promise<Tag> => {
  const updatedTag = await prisma.tag.update({
    where: { id },
    data: { name },
  });

  return mapTag(updatedTag);
};

// Function to fetch all tags
export const getAllTags = async (): Promise<Tag[]> => {
  const tags = await prisma.tag.findMany({
    where: { isDeleted: false },
    include: { events: true },
  });

  return tags.map(mapTag);
};

// Function to fetch a tag by ID
export const getTagById = async (id: string): Promise<Tag | null> => {
  const tag = await prisma.tag.findUnique({
    where: { id },
    include: { events: true },
  });

  return tag ? mapTag(tag) : null;
};

// Function to delete a tag (soft delete)
export const deleteTag = async (id: string): Promise<void> => {
  await prisma.tag.update({
    where: { id },
    data: { isDeleted: true },
  });
};
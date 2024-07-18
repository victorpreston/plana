import prisma from '../config/database.config';
import { Category } from '../interfaces/category.interfaces';


/**
 * Function to map Prisma Category to TypeScript Category
 * @param prismaCategory 
 * @returns 
 */
const mapCategory = (prismaCategory: any): Category => {
  return {
    id: prismaCategory.id,
    name: prismaCategory.name,
    events: prismaCategory.events,
    createdAt: prismaCategory.createdAt,
    updatedAt: prismaCategory.updatedAt,
    isDeleted: prismaCategory.isDeleted,
  };
};


/**
 * Function to create a new category
 * @param name 
 * @returns 
 */
export const createCategory = async (name: string): Promise<Category> => {
  const newCategory = await prisma.category.create({
    data: {
      name,
    },
  });

  return mapCategory(newCategory);
};



/**
 * Function to update a category
 * @param id 
 * @param name 
 * @returns 
 */
export const updateCategory = async (id: string, name: string): Promise<Category> => {
  const updatedCategory = await prisma.category.update({
    where: { id },
    data: { name },
  });

  return mapCategory(updatedCategory);
};


/**
 * Function to fetch all categories
 * @returns 
 */
export const getAllCategories = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany({
    where: { isDeleted: false },
    include: { events: true },
  });

  return categories.map(mapCategory);
};



/**
 * Function to fetch a category by ID
 * @param id 
 * @returns 
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { events: true },
  });

  return category ? mapCategory(category) : null;
};



/**
 * Function to delete a category (soft delete)
 * @param id 
 */
export const deleteCategory = async (id: string): Promise<void> => {
  await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });
};
import { createCategory, updateCategory, getAllCategories, getCategoryById, deleteCategory } from '../../services/category.services';
import { Category } from '../../interfaces/category.interfaces';

jest.mock('../../config/database.config', () => ({
  __esModule: true,
  default: {
    category: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const prisma = require('../../config/database.config').default;

describe('Category Services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const mockCategory = {
        id: 'category-1',
        name: 'Test Category',
        events: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      } as Category;

      (prisma.category.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await createCategory('Test Category');

      expect(prisma.category.create).toHaveBeenCalledWith({
        data: { name: 'Test Category' },
      });

      expect(result).toEqual(mockCategory);
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category', async () => {
      const mockCategory = {
        id: 'category-1',
        name: 'Updated Category',
        events: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      } as Category;

      (prisma.category.update as jest.Mock).mockResolvedValue(mockCategory);

      const result = await updateCategory('category-1', 'Updated Category');

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: 'category-1' },
        data: { name: 'Updated Category' },
      });

      expect(result).toEqual(mockCategory);
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        {
          id: 'category-1',
          name: 'Category 1',
          events: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        {
          id: 'category-2',
          name: 'Category 2',
          events: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        }
      ] as Category[];

      (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

      const result = await getAllCategories();

      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: { isDeleted: false },
        include: { events: true },
      });

      expect(result).toEqual(mockCategories.map(category => ({
        ...category,
        events: category.events
      })));
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID', async () => {
      const mockCategory = {
        id: 'category-1',
        name: 'Test Category',
        events: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      } as Category;

      (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);

      const result = await getCategoryById('category-1');

      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'category-1' },
        include: { events: true },
      });

      expect(result).toEqual(mockCategory);
    });

    it('should return null if category is not found', async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getCategoryById('category-1');

      expect(result).toBeNull();
    });
  });

  describe('deleteCategory', () => {
    it('should soft delete a category', async () => {
      await deleteCategory('category-1');

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: 'category-1' },
        data: { isDeleted: true },
      });
    });
  });
});
import { createTag, updateTag, getAllTags, getTagById, deleteTag } from '../../services/tag.services';
import { Tag } from '../../interfaces/tag.interfaces';

jest.mock('../../config/database.config', () => ({
  __esModule: true,
  default: {
    tag: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const prisma = require('../../config/database.config').default;

describe('Tag Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockTag: Tag = {
    id: '1',
    name: 'Technology',
    events: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };

  describe('createTag', () => {
    it('should create a new tag', async () => {
      (prisma.tag.create as jest.Mock).mockResolvedValue(mockTag);

      const result = await createTag('Technology');

      expect(result).toEqual(mockTag);
      expect(prisma.tag.create).toHaveBeenCalledWith({
        data: { name: 'Technology' },
      });
    });
  });

  describe('updateTag', () => {
    it('should update a tag', async () => {
      const updatedTag = { ...mockTag, name: 'Tech' };
      (prisma.tag.update as jest.Mock).mockResolvedValue(updatedTag);

      const result = await updateTag('1', 'Tech');

      expect(result).toEqual(updatedTag);
      expect(prisma.tag.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Tech' },
      });
    });
  });

  describe('getAllTags', () => {
    it('should fetch all tags', async () => {
      (prisma.tag.findMany as jest.Mock).mockResolvedValue([mockTag]);

      const result = await getAllTags();

      expect(result).toEqual([mockTag]);
      expect(prisma.tag.findMany).toHaveBeenCalledWith({
        where: { isDeleted: false },
        include: { events: true },
      });
    });
  });

  describe('getTagById', () => {
    it('should fetch a tag by ID', async () => {
      (prisma.tag.findUnique as jest.Mock).mockResolvedValue(mockTag);

      const result = await getTagById('1');

      expect(result).toEqual(mockTag);
      expect(prisma.tag.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { events: true },
      });
    });

    it('should return null if tag not found', async () => {
      (prisma.tag.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getTagById('2');

      expect(result).toBeNull();
      expect(prisma.tag.findUnique).toHaveBeenCalledWith({
        where: { id: '2' },
        include: { events: true },
      });
    });
  });

  describe('deleteTag', () => {
    it('should soft delete a tag', async () => {
      (prisma.tag.update as jest.Mock).mockResolvedValue({});

      await deleteTag('1');

      expect(prisma.tag.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isDeleted: true },
      });
    });
  });
});
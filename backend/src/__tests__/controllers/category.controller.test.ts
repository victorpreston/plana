import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import {
  create,
  update,
  getAll,
  getById,
  remove
} from '../../controllers/category.controllers';
import {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory
} from '../../services/category.services';

jest.mock('../../services/category.services');

const app: Application = express();
app.use(bodyParser.json());

app.post('/categories', create);
app.put('/categories/:id', update);
app.get('/categories', getAll);
app.get('/categories/:id', getById);
app.delete('/categories/:id', remove);

describe('Category Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const mockCategory = { id: 'category-1', name: 'Test Category' };
      (createCategory as jest.Mock).mockResolvedValue(mockCategory);

      const response = await request(app)
        .post('/categories')
        .send({ name: 'Test Category' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCategory);
      expect(createCategory).toHaveBeenCalledWith('Test Category');
    });

    it('should return 400 if there is an error', async () => {
      (createCategory as jest.Mock).mockRejectedValue(new Error('Create category error'));

      const response = await request(app)
        .post('/categories')
        .send({ name: 'Test Category' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Create category error');
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const mockCategory = { id: 'category-1', name: 'Updated Category' };
      (updateCategory as jest.Mock).mockResolvedValue(mockCategory);

      const response = await request(app)
        .put('/categories/category-1')
        .send({ name: 'Updated Category' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategory);
      expect(updateCategory).toHaveBeenCalledWith('category-1', 'Updated Category');
    });

    it('should return 400 if there is an error', async () => {
      (updateCategory as jest.Mock).mockRejectedValue(new Error('Update category error'));

      const response = await request(app)
        .put('/categories/category-1')
        .send({ name: 'Updated Category' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Update category error');
    });
  });

  describe('getAll', () => {
    it('should get all categories', async () => {
      const mockCategories = [
        { id: 'category-1', name: 'Category 1' },
        { id: 'category-2', name: 'Category 2' }
      ];
      (getAllCategories as jest.Mock).mockResolvedValue(mockCategories);

      const response = await request(app)
        .get('/categories');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategories);
      expect(getAllCategories).toHaveBeenCalled();
    });

    it('should return 400 if there is an error', async () => {
      (getAllCategories as jest.Mock).mockRejectedValue(new Error('Get all categories error'));

      const response = await request(app)
        .get('/categories');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Get all categories error');
    });
  });

  describe('getById', () => {
    it('should get a category by ID', async () => {
      const mockCategory = { id: 'category-1', name: 'Category 1' };
      (getCategoryById as jest.Mock).mockResolvedValue(mockCategory);

      const response = await request(app)
        .get('/categories/category-1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategory);
      expect(getCategoryById).toHaveBeenCalledWith('category-1');
    });

    it('should return 404 if category is not found', async () => {
      (getCategoryById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/categories/category-1');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Category not found');
    });

    it('should return 400 if there is an error', async () => {
      (getCategoryById as jest.Mock).mockRejectedValue(new Error('Get category error'));

      const response = await request(app)
        .get('/categories/category-1');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Get category error');
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      (deleteCategory as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/categories/category-1');

      expect(response.status).toBe(204);
      expect(deleteCategory).toHaveBeenCalledWith('category-1');
    });

    it('should return 400 if there is an error', async () => {
      (deleteCategory as jest.Mock).mockRejectedValue(new Error('Delete category error'));

      const response = await request(app)
        .delete('/categories/category-1');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Delete category error');
    });
  });
});
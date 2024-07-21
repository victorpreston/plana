import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { 
  create, 
  update, 
  getAll, 
  getById, 
  remove 
} from '../../controllers/tag.controllers';
import { 
  createTag, 
  updateTag, 
  getAllTags, 
  getTagById, 
  deleteTag 
} from '../../services/tag.services';

jest.mock('../../services/tag.services');

const app: Application = express();
app.use(bodyParser.json());
app.post('/tags', create);
app.put('/tags/:id', update);
app.get('/tags', getAll);
app.get('/tags/:id', getById);
app.delete('/tags/:id', remove);

describe('Tag Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const mockTag = { 
        id: 'tag-1', 
        name: 'Technology' 
      };
      (createTag as jest.Mock)
      .mockResolvedValue(mockTag);

      const response = await request(app)
        .post('/tags')
        .send({ name: 'Technology' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockTag);
      expect(createTag)
      .toHaveBeenCalledWith('Technology');
    });

    it('should return 400 if there is an error', async () => {
      (createTag as jest.Mock)
      .mockRejectedValue(new Error('Failed to create tag'));

      const response = await request(app)
        .post('/tags')
        .send({ name: 'Technology' });

      expect(response.status).toBe(400);
      expect(response.body.error)
      .toBe('Failed to create tag');
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const mockTag = { 
        id: 'tag-1', 
        name: 'Tech' 
      };
      (updateTag as jest.Mock)
      .mockResolvedValue(mockTag);

      const response = await request(app)
        .put('/tags/tag-1')
        .send({ name: 'Tech' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTag);
      expect(updateTag)
      .toHaveBeenCalledWith('tag-1', 'Tech');
    });

    it('should return 400 if there is an error', async () => {
      (updateTag as jest.Mock)
      .mockRejectedValue(new Error('Failed to update tag'));

      const response = await request(app)
        .put('/tags/tag-1')
        .send({ name: 'Tech' });

      expect(response.status).toBe(400);
      expect(response.body.error)
      .toBe('Failed to update tag');
    });
  });

  describe('getAll', () => {
    it('should get all tags', async () => {
      const mockTags = [
        { 
          id: 'tag-1', 
          name: 'Technology' 
        }
      ];
      (getAllTags as jest.Mock)
      .mockResolvedValue(mockTags);

      const response = await request(app).get('/tags');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTags);
      expect(getAllTags)
      .toHaveBeenCalled();
    });

    it('should return 400 if there is an error', async () => {
      (getAllTags as jest.Mock)
      .mockRejectedValue(new Error('Failed to get tags'));

      const response = await request(app).get('/tags');

      expect(response.status).toBe(400);
      expect(response.body.error)
      .toBe('Failed to get tags');
    });
  });

  describe('getById', () => {
    it('should get a tag by ID', async () => {
      const mockTag = { id: 'tag-1', name: 'Technology' };
      (getTagById as jest.Mock).mockResolvedValue(mockTag);

      const response = await request(app).get('/tags/tag-1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTag);
      expect(getTagById).toHaveBeenCalledWith('tag-1');
    });

    it('should return 404 if tag is not found', async () => {
      (getTagById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/tags/tag-1');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Tag not found');
    });

    it('should return 400 if there is an error', async () => {
      (getTagById as jest.Mock).mockRejectedValue(new Error('Failed to get tag'));

      const response = await request(app).get('/tags/tag-1');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Failed to get tag');
    });
  });

  describe('remove', () => {
    it('should delete a tag (soft delete)', async () => {
      (deleteTag as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app).delete('/tags/tag-1');

      expect(response.status).toBe(204);
      expect(deleteTag).toHaveBeenCalledWith('tag-1');
    });

    it('should return 400 if there is an error', async () => {
      (deleteTag as jest.Mock).mockRejectedValue(new Error('Failed to delete tag'));

      const response = await request(app).delete('/tags/tag-1');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Failed to delete tag');
    });
  });
});
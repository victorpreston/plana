import {
  searchUsers,
  searchEvents,
  searchBookings,
  searchCategories,
  searchTags,
  searchTickets
} from '../../services/search.services';

jest.mock('../../config/database.config', () => ({
  __esModule: true,
  default: {
    user: {
      findMany: jest.fn(),
    },
    event: {
      findMany: jest.fn(),
    },
    booking: {
      findMany: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
    tag: {
      findMany: jest.fn(),
    },
    ticketType: {
      findMany: jest.fn(),
    },
  },
}));

const prisma = require('../../config/database.config').default;

describe('Search Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchUsers', () => {
    it('should search users by query', async () => {
      const mockUsers = [
        { 
          id: '1', 
          email: 'test@example.com', 
          profile: { firstName: 'John', lastName: 'Doe' } 
        }
      ];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await searchUsers('test');

      expect(result).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: { contains: 'test', mode: 'insensitive' } },
            { profile: { firstName: { contains: 'test', mode: 'insensitive' } } },
            { profile: { lastName: { contains: 'test', mode: 'insensitive' } } },
          ],
        },
        include: { profile: true },
      });
    });
  });

  describe('searchEvents', () => {
    it('should search events by query', async () => {
      const mockEvents = [
        { 
          id: '1',
          title: 'Event Title', 
          description: 'Event Description', 
          location: 'Location' 
        }
      ];
      (prisma.event.findMany as jest.Mock).mockResolvedValue(mockEvents);

      const result = await searchEvents('event');

      expect(result).toEqual(mockEvents);
      expect(prisma.event.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'event', mode: 'insensitive' } },
            { description: { contains: 'event', mode: 'insensitive' } },
            { location: { contains: 'event', mode: 'insensitive' } },
          ],
        },
      });
    });
  });

  describe('searchBookings', () => {
    it('should search bookings by query', async () => {
      const mockBookings = [
        { 
          id: '1', 
          ticketCode: 'ABC123', 
          user: { email: 'user@example.com' }, 
          event: { title: 'Event Title' }, 
          ticketType: { type: 'VIP' } 
        }
      ];
      (prisma.booking.findMany as jest.Mock).mockResolvedValue(mockBookings);

      const result = await searchBookings('ABC');

      expect(result).toEqual(mockBookings);
      expect(prisma.booking.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { ticketCode: { contains: 'ABC', mode: 'insensitive' } },
            { user: { email: { contains: 'ABC', mode: 'insensitive' } } },
          ],
        },
        include: { user: true, event: true, ticketType: true },
      });
    });
  });

  describe('searchCategories', () => {
    it('should search categories by query', async () => {
      const mockCategories = [{ id: '1', name: 'Category Name' }];
      (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

      const result = await searchCategories('category');

      expect(result).toEqual(mockCategories);
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: 'category', mode: 'insensitive' },
        },
      });
    });
  });

  describe('searchTags', () => {
    it('should search tags by query', async () => {
      const mockTags = [{ id: '1', name: 'Tag Name' }];
      (prisma.tag.findMany as jest.Mock).mockResolvedValue(mockTags);

      const result = await searchTags('tag');

      expect(result).toEqual(mockTags);
      expect(prisma.tag.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: 'tag', mode: 'insensitive' },
        },
      });
    });
  });

  describe('searchTickets', () => {
    it('should search tickets by query', async () => {
      const mockTickets = [{ id: '1', type: 'VIP' }];
      (prisma.ticketType.findMany as jest.Mock).mockResolvedValue(mockTickets);

      const result = await searchTickets('VIP');

      expect(result).toEqual(mockTickets);
      expect(prisma.ticketType.findMany).toHaveBeenCalledWith({
        where: {
          type: { contains: 'VIP', mode: 'insensitive' },
        },
      });
    });
  });
});
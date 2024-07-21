import prisma from '../../config/database.config';
import { createTicketType, updateTicketType, getTicketTypesByEventId, deleteTicketType } from '../../services/ticket.services';
import { TicketType } from '../../interfaces/ticket.interfaces';

jest.mock('../../config/database.config', () => ({
  __esModule: true,
  default: {
    ticketType: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('Ticket Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTicketType', () => {
    it('should create a new ticket type', async () => {
      const mockTicketType: TicketType = {
        id: '1',
        type: 'VIP',
        price: 100,
        quantity: 50,
        eventId: 'event1',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      (prisma.ticketType.create as jest.Mock).mockResolvedValue(mockTicketType);

      const ticketData = {
        type: 'VIP',
        price: 100,
        quantity: 50,
        event: {
          connect: { id: 'event1' },
        },
      };

      const result = await createTicketType({
        type: 'VIP',
        price: 100,
        quantity: 50,
        eventId: 'event1',
      });

      expect(result).toEqual(mockTicketType);
      expect(prisma.ticketType.create).toHaveBeenCalledWith({
        data: ticketData,
      });
    });
  });

  describe('updateTicketType', () => {
    it('should update a ticket type', async () => {
      const mockTicketType: TicketType = {
        id: '1',
        type: 'VIP',
        price: 100,
        quantity: 50,
        eventId: 'event1',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      (prisma.ticketType.update as jest.Mock).mockResolvedValue(mockTicketType);

      const ticketData = {
        type: 'VIP',
        price: 150,
        quantity: 60,
      };

      const result = await updateTicketType('1', ticketData);

      expect(result).toEqual(mockTicketType);
      expect(prisma.ticketType.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: ticketData,
      });
    });
  });

  describe('getTicketTypesByEventId', () => {
    it('should get ticket types by event ID', async () => {
      const mockTicketTypes: TicketType[] = [
        {
          id: '1',
          type: 'VIP',
          price: 100,
          quantity: 50,
          eventId: 'event1',
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
      ];

      (prisma.ticketType.findMany as jest.Mock).mockResolvedValue(mockTicketTypes);

      const result = await getTicketTypesByEventId('event1');

      expect(result).toEqual(mockTicketTypes);
      expect(prisma.ticketType.findMany).toHaveBeenCalledWith({
        where: { eventId: 'event1', isDeleted: false },
      });
    });
  });

  describe('deleteTicketType', () => {
    it('should soft delete a ticket type', async () => {
      (prisma.ticketType.update as jest.Mock).mockResolvedValue({});

      await deleteTicketType('1');

      expect(prisma.ticketType.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isDeleted: true },
      });
    });
  });
});
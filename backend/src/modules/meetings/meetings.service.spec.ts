import { Test, TestingModule } from '@nestjs/testing';
import { MeetingsService } from './meetings.service';
import { PrismaService } from '../../common/prisma.service';

describe('MeetingsService', () => {
  let service: MeetingsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    meeting: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetingsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MeetingsService>(MeetingsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated meetings', async () => {
      const userId = 'user-id';
      const mockMeetings = [
        { id: '1', title: 'Meeting 1', userId },
        { id: '2', title: 'Meeting 2', userId },
      ];

      mockPrismaService.meeting.findMany.mockResolvedValue(mockMeetings);
      mockPrismaService.meeting.count.mockResolvedValue(2);

      const result = await service.findAll(userId, { page: 1, limit: 10 });

      expect(result).toHaveProperty('data', mockMeetings);
      expect(result).toHaveProperty('meta');
      expect(result.meta.total).toBe(2);
    });

    it('should handle search parameter', async () => {
      const userId = 'user-id';
      const search = 'team sync';

      await service.findAll(userId, { page: 1, limit: 10, search });

      expect(mockPrismaService.meeting.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId,
            title: expect.objectContaining({
              contains: search,
              mode: 'insensitive',
            }),
          }),
        }),
      );
    });
  });

  describe('create', () => {
    it('should create a new meeting', async () => {
      const userId = 'user-id';
      const createData = {
        title: 'New Meeting',
        description: 'Test description',
        platform: 'ZOOM' as const,
        startTime: new Date().toISOString(),
      };

      const mockMeeting = {
        id: 'meeting-id',
        ...createData,
        userId,
        status: 'SCHEDULED',
      };

      mockPrismaService.meeting.create.mockResolvedValue(mockMeeting);

      const result = await service.create(createData, userId);

      expect(mockPrismaService.meeting.create).toHaveBeenCalledWith({
        data: expect.objectContaining(createData),
      });
      expect(result).toEqual(mockMeeting);
    });
  });

  describe('findOne', () => {
    it('should return a meeting by id', async () => {
      const userId = 'user-id';
      const meetingId = 'meeting-id';
      const mockMeeting = {
        id: meetingId,
        title: 'Test Meeting',
        userId,
      };

      mockPrismaService.meeting.findUnique.mockResolvedValue(mockMeeting);

      const result = await service.findOne(meetingId, userId);

      expect(result).toEqual(mockMeeting);
    });

    it('should throw NotFoundException if meeting not found', async () => {
      mockPrismaService.meeting.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id', 'user-id')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a meeting', async () => {
      const userId = 'user-id';
      const meetingId = 'meeting-id';
      const updateData = { title: 'Updated Title' };

      mockPrismaService.meeting.findUnique.mockResolvedValue({
        id: meetingId,
        userId,
      });
      mockPrismaService.meeting.update.mockResolvedValue({
        id: meetingId,
        ...updateData,
        userId,
      });

      const result = await service.update(meetingId, updateData, userId);

      expect(mockPrismaService.meeting.update).toHaveBeenCalled();
      expect(result).toHaveProperty('title', updateData.title);
    });
  });

  describe('remove', () => {
    it('should delete a meeting', async () => {
      const userId = 'user-id';
      const meetingId = 'meeting-id';

      mockPrismaService.meeting.findUnique.mockResolvedValue({
        id: meetingId,
        userId,
      });
      mockPrismaService.meeting.delete.mockResolvedValue({ id: meetingId });

      await service.remove(meetingId, userId);

      expect(mockPrismaService.meeting.delete).toHaveBeenCalledWith({
        where: { id: meetingId },
      });
    });
  });
});

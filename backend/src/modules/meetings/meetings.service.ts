import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, options: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = options;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [meetings, total] = await Promise.all([
      this.prisma.meeting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: 'desc' },
        include: {
          transcript: {
            select: {
              id: true,
              summary: true,
              sentiment: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              participants: true,
              actionItems: true,
            },
          },
        },
      }),
      this.prisma.meeting.count({ where }),
    ]);

    return {
      data: meetings,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: {
        transcript: true,
        participants: true,
        actionItems: {
          orderBy: { createdAt: 'desc' },
        },
        insights: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    if (meeting.userId !== userId) {
      throw new ForbiddenException('You do not have access to this meeting');
    }

    return meeting;
  }

  async create(createMeetingDto: CreateMeetingDto, userId: string) {
    return this.prisma.meeting.create({
      data: {
        ...createMeetingDto,
        userId,
      },
      include: {
        _count: {
          select: {
            participants: true,
            actionItems: true,
          },
        },
      },
    });
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto, userId: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    if (meeting.userId !== userId) {
      throw new ForbiddenException('You do not have access to this meeting');
    }

    return this.prisma.meeting.update({
      where: { id },
      data: updateMeetingDto,
    });
  }

  async remove(id: string, userId: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    if (meeting.userId !== userId) {
      throw new ForbiddenException('You do not have access to this meeting');
    }

    await this.prisma.meeting.delete({
      where: { id },
    });

    return { message: 'Meeting deleted successfully' };
  }
}

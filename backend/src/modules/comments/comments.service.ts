import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

export interface CreateCommentDto {
  content: string;
  timestamp?: number;
  parentId?: string;
}

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(
    meetingId: string,
    userId: string,
    dto: CreateCommentDto,
  ) {
    // Verify meeting exists and user has access
    const meeting = await this.prisma.meeting.findFirst({
      where: { id: meetingId, userId },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        meetingId,
        userId,
        timestamp: dto.timestamp,
        parentId: dto.parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }

  async getMeetingComments(meetingId: string, userId: string) {
    // Verify meeting access
    const meeting = await this.prisma.meeting.findFirst({
      where: { id: meetingId, userId },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return this.prisma.comment.findMany({
      where: {
        meetingId,
        parentId: null, // Only top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateComment(
    commentId: string,
    userId: string,
    content: string,
  ) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, userId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, userId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Delete all replies first
    await this.prisma.comment.deleteMany({
      where: { parentId: commentId },
    });

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return { success: true };
  }
}

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Comments')
@Controller('meetings/:meetingId/comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a comment to a meeting' })
  async createComment(
    @Param('meetingId') meetingId: string,
    @Body() dto: { content: string; transcriptSegmentId?: string; timestamp?: number; parentId?: string },
    @CurrentUser('userId') userId: string,
  ) {
    const comment = await this.commentsService.createComment(meetingId, userId, dto);
    return { success: true, data: comment };
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments for a meeting' })
  async getComments(
    @Param('meetingId') meetingId: string,
    @CurrentUser('userId') userId: string,
  ) {
    const comments = await this.commentsService.getMeetingComments(meetingId, userId);
    return { success: true, data: comments };
  }

  @Patch(':commentId')
  @ApiOperation({ summary: 'Update a comment' })
  async updateComment(
    @Param('meetingId') meetingId: string,
    @Param('commentId') commentId: string,
    @Body('content') content: string,
    @CurrentUser('userId') userId: string,
  ) {
    const comment = await this.commentsService.updateComment(commentId, userId, content);
    return { success: true, data: comment };
  }

  @Delete(':commentId')
  @ApiOperation({ summary: 'Delete a comment' })
  async deleteComment(
    @Param('meetingId') meetingId: string,
    @Param('commentId') commentId: string,
    @CurrentUser('userId') userId: string,
  ) {
    await this.commentsService.deleteComment(commentId, userId);
    return { success: true };
  }
}

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@ApiTags('meetings')
@Controller('meetings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all meetings for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.meetingsService.findAll(req.user.userId, { page, limit, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meeting by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.meetingsService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new meeting' })
  async create(@Body() createMeetingDto: CreateMeetingDto, @Request() req) {
    return this.meetingsService.create(createMeetingDto, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update meeting' })
  async update(
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
    @Request() req,
  ) {
    return this.meetingsService.update(id, updateMeetingDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete meeting' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.meetingsService.remove(id, req.user.userId);
  }
}

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Teams')
@Controller('teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  async createTeam(
    @Body() data: { name: string; slug: string },
    @CurrentUser('userId') userId: string,
  ) {
    const team = await this.teamsService.createTeam(userId, data);
    return { success: true, data: team };
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams for current user' })
  async getUserTeams(@CurrentUser('userId') userId: string) {
    const teams = await this.teamsService.getUserTeams(userId);
    return { success: true, data: teams };
  }

  @Get(':teamId')
  @ApiOperation({ summary: 'Get team details' })
  async getTeam(
    @Param('teamId') teamId: string,
    @CurrentUser('userId') userId: string,
  ) {
    const team = await this.teamsService.getTeamById(userId, teamId);
    return { success: true, data: team };
  }

  @Post(':teamId/members')
  @ApiOperation({ summary: 'Add a member to team' })
  async addMember(
    @Param('teamId') teamId: string,
    @Body() data: { email: string; role: 'ADMIN' | 'MEMBER' },
    @CurrentUser('userId') userId: string,
  ) {
    const member = await this.teamsService.addTeamMember(userId, teamId, data);
    return { success: true, data: member };
  }

  @Delete(':teamId/members/:memberId')
  @ApiOperation({ summary: 'Remove a member from team' })
  async removeMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
    @CurrentUser('userId') userId: string,
  ) {
    await this.teamsService.removeTeamMember(userId, teamId, memberId);
    return { success: true };
  }

  @Patch(':teamId/members/:memberId/role')
  @ApiOperation({ summary: 'Update member role' })
  async updateRole(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
    @Body('role') role: 'ADMIN' | 'MEMBER',
    @CurrentUser('userId') userId: string,
  ) {
    await this.teamsService.updateMemberRole(userId, teamId, memberId, role);
    return { success: true };
  }

  @Delete(':teamId')
  @ApiOperation({ summary: 'Delete a team' })
  async deleteTeam(
    @Param('teamId') teamId: string,
    @CurrentUser('userId') userId: string,
  ) {
    await this.teamsService.deleteTeam(userId, teamId);
    return { success: true };
  }
}

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import * as bcrypt from 'bcryptjs';

export interface CreateTeamRequest {
  name: string;
  slug: string;
}

export interface AddTeamMemberRequest {
  email: string;
  role: 'ADMIN' | 'MEMBER';
}

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async createTeam(userId: string, data: CreateTeamRequest) {
    // Check if slug is unique
    const existing = await this.prisma.team.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new ConflictException('Team slug already exists');
    }

    const team = await this.prisma.team.create({
      data: {
        name: data.name,
        slug: data.slug,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
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

    return team;
  }

  async getUserTeams(userId: string) {
    const memberships = await this.prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            _count: {
              select: { members: true },
            },
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return memberships.map((m) => ({
      ...m.team,
      role: m.role,
    }));
  }

  async getTeamById(userId: string, teamId: string) {
    const membership = await this.prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
      include: {
        team: {
          include: {
            members: {
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
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Team not found or access denied');
    }

    return {
      ...membership.team,
      role: membership.role,
    };
  }

  async addTeamMember(
    userId: string,
    teamId: string,
    data: AddTeamMemberRequest,
  ) {
    // Check if user has permission
    const membership = await this.prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: { in: ['OWNER', 'ADMIN'] },
      },
    });

    if (!membership) {
      throw new NotFoundException('Team not found or insufficient permissions');
    }

    // Find user by email
    const userToAdd = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!userToAdd) {
      throw new NotFoundException('User not found with this email');
    }

    // Check if already a member
    const existingMember = await this.prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: userToAdd.id,
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a team member');
    }

    // Add member
    const newMember = await this.prisma.teamMember.create({
      data: {
        teamId,
        userId: userToAdd.id,
        role: data.role,
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
      },
    });

    return newMember;
  }

  async removeTeamMember(userId: string, teamId: string, memberId: string) {
    // Check if user has permission
    const membership = await this.prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: { in: ['OWNER', 'ADMIN'] },
      },
    });

    if (!membership) {
      throw new NotFoundException('Team not found or insufficient permissions');
    }

    // Cannot remove owner
    const memberToRemove = await this.prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: memberId,
      },
    });

    if (memberToRemove?.role === 'OWNER') {
      throw new ConflictException('Cannot remove team owner');
    }

    await this.prisma.teamMember.deleteMany({
      where: {
        teamId,
        userId: memberId,
      },
    });

    return { success: true };
  }

  async updateMemberRole(
    userId: string,
    teamId: string,
    memberId: string,
    role: 'ADMIN' | 'MEMBER',
  ) {
    // Only owner can change roles
    const membership = await this.prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: 'OWNER',
      },
    });

    if (!membership) {
      throw new NotFoundException('Only team owner can change roles');
    }

    await this.prisma.teamMember.updateMany({
      where: {
        teamId,
        userId: memberId,
      },
      data: { role },
    });

    return { success: true };
  }

  async deleteTeam(userId: string, teamId: string) {
    // Only owner can delete
    const team = await this.prisma.team.findFirst({
      where: {
        id: teamId,
        ownerId: userId,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found or insufficient permissions');
    }

    await this.prisma.team.delete({
      where: { id: teamId },
    });

    return { success: true };
  }
}

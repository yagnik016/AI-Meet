import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationsGateway');
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds[]

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth.token as string;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token.replace('Bearer ', ''));
      client.userId = payload.sub;

      // Store socket connection
      const userSocketIds = this.userSockets.get(payload.sub) || [];
      userSocketIds.push(client.id);
      this.userSockets.set(payload.sub, userSocketIds);

      this.logger.log(`Client connected: ${client.id} (User: ${payload.sub})`);

      // Send welcome notification
      client.emit('notification', {
        type: 'CONNECTED',
        message: 'Connected to notification service',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const userSocketIds = this.userSockets.get(client.userId) || [];
      const updatedSocketIds = userSocketIds.filter((id) => id !== client.id);

      if (updatedSocketIds.length === 0) {
        this.userSockets.delete(client.userId);
      } else {
        this.userSockets.set(client.userId, updatedSocketIds);
      }
    }

    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: AuthenticatedSocket, room: string) {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    return { success: true, room };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: AuthenticatedSocket, room: string) {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
    return { success: true, room };
  }

  // Send notification to specific user
  sendToUser(userId: string, notification: NotificationPayload) {
    const socketIds = this.userSockets.get(userId);
    if (socketIds) {
      socketIds.forEach((socketId) => {
        this.server.to(socketId).emit('notification', notification);
      });
    }
  }

  // Send notification to all users in a meeting
  sendToMeeting(meetingId: string, notification: NotificationPayload) {
    this.server.to(`meeting:${meetingId}`).emit('notification', notification);
  }

  // Send notification to all users in a team
  sendToTeam(teamId: string, notification: NotificationPayload) {
    this.server.to(`team:${teamId}`).emit('notification', notification);
  }

  // Broadcast to all connected clients
  broadcast(notification: NotificationPayload) {
    this.server.emit('notification', notification);
  }

  // Get online users count
  getOnlineUsersCount(): number {
    return this.userSockets.size;
  }
}

export interface NotificationPayload {
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  timestamp: string;
  read?: boolean;
}

export type NotificationType =
  | 'CONNECTED'
  | 'MEETING_STARTED'
  | 'MEETING_ENDED'
  | 'TRANSCRIPT_READY'
  | 'ACTION_ITEM_ASSIGNED'
  | 'TEAM_INVITE'
  | 'COMMENT_ADDED'
  | 'SYSTEM';

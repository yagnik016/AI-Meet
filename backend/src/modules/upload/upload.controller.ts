import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a meeting recording' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 500 * 1024 * 1024, // 500MB
      },
      fileFilter: (req, file, callback) => {
        const allowedMimes = [
          'audio/mpeg',
          'audio/wav',
          'audio/mp4',
          'audio/webm',
          'video/mp4',
          'video/webm',
          'video/quicktime',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              `Unsupported file type: ${file.mimetype}. Allowed: MP3, WAV, M4A, MP4, WebM, MOV`,
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('userId') userId: string,
    @Body('meetingId') meetingId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.uploadService.uploadFile(file, userId, meetingId);

    return {
      success: true,
      data: result,
    };
  }

  @Get('supported-types')
  @ApiOperation({ summary: 'Get supported file types' })
  getSupportedTypes() {
    return {
      types: this.uploadService.getSupportedMimeTypes(),
      maxSize: this.uploadService.getMaxFileSize(),
      maxSizeHuman: '500MB',
    };
  }

  @Delete(':path')
  @ApiOperation({ summary: 'Delete an uploaded file' })
  async deleteFile(@Param('path') path: string) {
    await this.uploadService.deleteFile(path);
    return { success: true };
  }
}

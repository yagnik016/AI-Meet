import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  path: string;
  filename: string;
  size: number;
  mimeType: string;
}

@Injectable()
export class UploadService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    meetingId?: string,
  ): Promise<UploadResult> {
    const filename = `${uuidv4()}-${file.originalname}`;
    const path = meetingId
      ? `meetings/${meetingId}/${filename}`
      : `users/${userId}/${filename}`;

    // If Supabase is configured, use it; otherwise store metadata only
    if (this.supabase) {
      const { error } = await this.supabase.storage
        .from('meetings')
        .upload(path, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: urlData } = this.supabase.storage
        .from('meetings')
        .getPublicUrl(path);

      return {
        url: urlData.publicUrl,
        path,
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      };
    }

    // Fallback: return local path for development
    return {
      url: `/uploads/${path}`,
      path,
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async deleteFile(path: string): Promise<void> {
    if (this.supabase) {
      const { error } = await this.supabase.storage.from('meetings').remove([path]);
      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
    }
  }

  getSupportedMimeTypes(): string[] {
    return [
      'audio/mpeg',      // MP3
      'audio/wav',       // WAV
      'audio/mp4',       // M4A
      'audio/webm',      // WebM audio
      'video/mp4',       // MP4
      'video/webm',      // WebM video
      'video/quicktime', // MOV
      'application/octet-stream', // Generic binary
    ];
  }

  isValidFileType(mimeType: string): boolean {
    return this.getSupportedMimeTypes().includes(mimeType);
  }

  getMaxFileSize(): number {
    return 500 * 1024 * 1024; // 500MB
  }
}

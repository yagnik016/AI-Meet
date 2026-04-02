import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
import puppeteer from 'puppeteer';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exportToDocx(meetingId: string, userId: string): Promise<Buffer> {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id: meetingId, userId },
      include: {
        transcript: true,
        actionItems: true,
        participants: true,
      },
    });

    if (!meeting) {
      throw new Error('Meeting not found');
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: meeting.title,
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${new Date(meeting.startTime).toLocaleDateString()}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            text: `Duration: ${meeting.duration ? Math.round(meeting.duration / 60) + ' minutes' : 'N/A'}`,
          }),
          new Paragraph({ text: '' }),
          
          new Paragraph({
            text: 'Summary',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: meeting.transcript?.summary || 'No summary available',
          }),
          new Paragraph({ text: '' }),
          
          new Paragraph({
            text: 'Transcript',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: meeting.transcript?.content || 'No transcript available',
          }),
          new Paragraph({ text: '' }),
          
          new Paragraph({
            text: 'Action Items',
            heading: HeadingLevel.HEADING_1,
          }),
          ...meeting.actionItems.map(item =>
            new Paragraph({
              text: `• ${item.content}${item.assignee ? ` (Assigned to: ${item.assignee})` : ''}`,
            })
          ),
          new Paragraph({ text: '' }),
          
          new Paragraph({
            text: 'Participants',
            heading: HeadingLevel.HEADING_1,
          }),
          ...meeting.participants.map(p =>
            new Paragraph({ text: `• ${p.name} ${p.email ? `<${p.email}>` : ''}` })
          ),
        ],
      }],
    });

    return await Packer.toBuffer(doc);
  }

  async exportToPdf(meetingId: string, userId: string): Promise<Buffer> {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id: meetingId, userId },
      include: {
        transcript: true,
        actionItems: true,
        participants: true,
      },
    });

    if (!meeting) {
      throw new Error('Meeting not found');
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px; }
          h2 { color: #0066cc; margin-top: 30px; }
          .meta { color: #666; margin-bottom: 20px; }
          .transcript { line-height: 1.6; white-space: pre-wrap; }
          .action-item { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px; }
          ul { padding-left: 20px; }
        </style>
      </head>
      <body>
        <h1>${meeting.title}</h1>
        <div class="meta">
          <p><strong>Date:</strong> ${new Date(meeting.startTime).toLocaleDateString()}</p>
          <p><strong>Duration:</strong> ${meeting.duration ? Math.round(meeting.duration / 60) + ' minutes' : 'N/A'}</p>
        </div>
        
        <h2>Summary</h2>
        <p>${meeting.transcript?.summary || 'No summary available'}</p>
        
        <h2>Transcript</h2>
        <div class="transcript">${meeting.transcript?.content || 'No transcript available'}</div>
        
        <h2>Action Items</h2>
        ${meeting.actionItems.map(item => `
          <div class="action-item">
            • ${item.content}${item.assignee ? ` <strong>(Assigned to: ${item.assignee})</strong>` : ''}
          </div>
        `).join('')}
        
        <h2>Participants</h2>
        <ul>
          ${meeting.participants.map(p => `<li>${p.name} ${p.email ? `&lt;${p.email}&gt;` : ''}</li>`).join('')}
        </ul>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: 'new' as any });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    return Buffer.from(pdf);
  }
}

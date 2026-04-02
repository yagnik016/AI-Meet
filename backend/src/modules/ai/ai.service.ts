import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async analyzeTranscript(transcript: string) {
    const prompt = `
      Analyze the following meeting transcript and provide:
      1. A concise summary (2-3 sentences)
      2. Key topics discussed (3-5 items)
      3. Overall sentiment (POSITIVE, NEGATIVE, NEUTRAL, or MIXED)
      4. Action items with assignees (if identifiable)
      5. Key insights or decisions

      Transcript:
      ${transcript}

      Respond in JSON format:
      {
        "summary": "string",
        "keyTopics": ["string"],
        "sentiment": "POSITIVE|NEGATIVE|NEUTRAL|MIXED",
        "actionItems": [{"content": "string", "assignee": "string|null"}],
        "insights": [{"type": "KEY_DECISION|RISK|OPPORTUNITY|FOLLOW_UP", "content": "string"}]
      }
    `;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert meeting analyst. Extract key information from meeting transcripts.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = completion.choices[0].message.content;
    return JSON.parse(result || '{}');
  }

  async generateMeetingSegments(transcript: string) {
    const prompt = `
      Break down the following meeting transcript into timestamped segments.
      Identify speakers and their statements.

      Transcript:
      ${transcript}

      Respond in JSON format:
      {
        "segments": [
          {
            "timestamp": "MM:SS",
            "speaker": "string",
            "text": "string"
          }
        ]
      }
    `;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at parsing meeting transcripts into structured segments.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = completion.choices[0].message.content;
    return JSON.parse(result || '{"segments": []}');
  }

  async answerQuestion(transcript: string, question: string) {
    const prompt = `
      Based on the following meeting transcript, answer this question:
      Question: ${question}

      Transcript:
      ${transcript}

      Provide a concise, accurate answer based only on the transcript content.
    `;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant answering questions about meeting content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    return completion.choices[0].message.content || '';
  }
}

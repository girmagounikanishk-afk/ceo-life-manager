import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 30;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { meeting } = await req.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const response = await client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 400,
        stream: true,
        system: `You are the AI Chief of Staff for the CEO of Apple. Generate a razor-sharp 60-second meeting prep brief. Be specific, tactical, and warn about landmines. CEO-grade only.`,
        messages: [{
          role: 'user',
          content: `Meeting: ${meeting.title} at ${meeting.time}
Attendees: ${meeting.attendees?.map((a: { name: string; role: string }) => `${a.name} (${a.role})`).join(', ')}
Agenda: ${meeting.agenda?.join(', ')}
Last meeting memo (${meeting.lastDate}): ${meeting.lastMemo}
Risk flags: ${meeting.riskFlags?.join('; ')}

Write a 3-bullet prep brief: (1) Most important thing to achieve, (2) Key landmine to avoid, (3) One opening move that will set the right tone.`
        }]
      });

      for await (const chunk of response) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    }
  });

  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
}

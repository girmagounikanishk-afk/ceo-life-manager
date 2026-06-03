import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 30;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { stock, news, meetings, health } = await req.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const response = await client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 320,
        stream: true,
        system: `You are the AI Chief of Staff for the CEO of Apple. Write a sharp, executive morning brief — 3-4 sentences max. Be direct, specific, and CEO-grade. No fluff. Focus on what matters most RIGHT NOW. Start with the most critical item.`,
        messages: [{
          role: 'user',
          content: `CEO: Tim Cook. Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
Stock: AAPL $${stock.price} (${stock.changePct > 0 ? '+' : ''}${stock.changePct}% pre-market)
Energy level today: ${health.energy}/10, Sleep: ${health.sleep}h, Cognitive load: ${health.cognitiveLoad}%
Top news: ${news.slice(0, 3).map((n: { headline: string }) => n.headline).join(' | ')}
Key meetings today: ${meetings.map((m: { time: string; title: string }) => `${m.time} ${m.title}`).join(', ')}
Write the morning brief:`
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

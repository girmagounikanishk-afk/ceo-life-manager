import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 45;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { scenario } = await req.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 800,
        stream: true,
        system: `You are the world's best strategic advisor to the CEO of Apple. Analyze decisions with four lenses. Be brutally honest, CEO-grade, and specific to Apple's actual competitive position. Format your response as JSON with this exact structure:
{
  "firstPrinciples": "strip to fundamentals — what is actually at stake here?",
  "riskMap": "what are the top 3 risks of each path?",
  "opportunity": "what does this unlock if executed perfectly?",
  "boardReaction": "how will the board and investors see this decision?",
  "recommendation": "one clear recommended action with confidence percentage",
  "precedent": "one comparable Apple or industry precedent and what we can learn"
}
Return ONLY valid JSON. No markdown.`,
        messages: [{ role: 'user', content: `Apple CEO Decision: ${scenario}` }]
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

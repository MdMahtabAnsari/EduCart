import { streamText, UIMessage, convertToModelMessages } from 'ai';
// import { groq } from '@ai-sdk/groq'
import { google } from '@ai-sdk/google';
import { NextRequest } from 'next/server';
// import {z} from 'zod/v4';
// import {prisma} from '@/lib/db/prisma';

export const maxDuration = 30;
export async function POST(req: NextRequest) {
    const {
        messages,
        model,
        // webSearch,
    }: {
        messages: UIMessage[];
        model: string;
        webSearch: boolean;
    } = await req.json();
    const result = streamText({
        model: google(model),
        messages: convertToModelMessages(messages),
        system: 'You are a helpful assistant that can answer questions and help with tasks',
    });
    // send sources and reasoning back to the client
    return result.toUIMessageStreamResponse({
        sendSources: true,
        sendReasoning: true,
    });
}
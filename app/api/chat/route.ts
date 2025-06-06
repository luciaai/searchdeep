// /app/api/chat/route.ts
import { getGroupConfig } from '@/app/actions';
import { serverEnv } from '@/env/server';
import { xai } from '@ai-sdk/xai';
import { cerebras } from '@ai-sdk/cerebras';
import { anthropic } from '@ai-sdk/anthropic'
import { groq } from '@ai-sdk/groq'
import CodeInterpreter from '@e2b/code-interpreter';
import FirecrawlApp from '@mendable/firecrawl-js';
import { tavily } from '@tavily/core';
import {
    convertToCoreMessages,
    smoothStream,
    streamText,
    tool,
    createDataStreamResponse,
    wrapLanguageModel,
    extractReasoningMiddleware,
    customProvider,
    generateObject,
    NoSuchToolError
} from 'ai';
import Exa from 'exa-js';
import { z } from 'zod';
import { geolocation } from '@vercel/functions';
import MemoryClient from 'mem0ai';

import { generateWithGemini } from '@/lib/gemini';

// We'll handle Gemini directly in the POST function

const ziq = customProvider({
    languageModels: {
        'ziq-default': xai('grok-2-1212'),
        'ziq-vision': xai('grok-2-vision-1212'),
        'ziq-llama': cerebras('llama-3-70b'),
        'ziq-sonnet': anthropic('claude-3-7-sonnet-20250219'),
        'ziq-r1': wrapLanguageModel({
            model: groq('deepseek-r1-distill-llama-70b'),
            middleware: extractReasoningMiddleware({ tagName: 'think' })
        })
    }
})

// Allow streaming responses up to 600 seconds
export const maxDuration = 300;

// Interfaces and helper functions...
// [Truncated for brevity]

// Modify the POST function to use the new handler
export async function POST(req: Request) {
    const { messages, model, group, user_id } = await req.json();
    const { systemPrompt, tools: activeTools } = await getGroupConfig(group);
    const geo = geolocation(req);

    console.log("Running with model: ", model.trim());

    // Add custom maxSteps control for different models
    let maxSteps = 5; // Default value
    if (model.includes("sonnet")) {
        // For Sonnet, use different maxSteps based on group (search = extreme mode)
        maxSteps = group === "search" ? 8 : 3;
        console.log(`Using custom maxSteps for Sonnet: ${maxSteps} (${group} mode)`);
    }

    // Add model-specific system prompt enhancements
    let enhancedSystemPrompt = systemPrompt;
    if (model.includes("sonnet")) {
        const searchDepthInstruction = group === "search"
            ? "IMPORTANT INSTRUCTION: When searching, perform thorough, multi-step research with multiple queries and deep analysis."
            : "IMPORTANT INSTRUCTION: When searching, perform only basic, surface-level searches limited to 1-2 queries.";
        
        enhancedSystemPrompt = systemPrompt + "\n\n" + searchDepthInstruction;
        console.log(`Enhanced system prompt for Sonnet with search depth instruction: ${group} mode`);
    }

    // Special handling for Gemini model - temporarily disabled
    if (model === "gemini-flash" || model.includes("gemini")) {
        console.log("Gemini model is temporarily disabled");
        
        return createDataStreamResponse({
            execute: async (dataStream) => {
                dataStream.writeMessageAnnotation({
                    kind: 'text',
                    text: "The Gemini model is temporarily unavailable. Please select another model such as Grok 2.0 or Claude 3.7 Sonnet."
                });
            }
        });
    }
    
    // Standard handling for other models
    return createDataStreamResponse({
        execute: async (dataStream) => {
            const result = streamText({
                model: ziq.languageModel(model),
                maxSteps: maxSteps,
                providerOptions: {
                    groq: {
                        reasoning_format: group === "chat" ? "raw" : "parsed",
                    },
                    anthropic: {
                        thinking: {
                            type: group === "chat" ? "enabled" : "disabled",
                            budgetTokens: 12000
                        }
                    }
                },
                messages: convertToCoreMessages(messages),
                temperature: 0,
                experimental_transform: smoothStream({
                    chunking: 'word',
                    delayInMs: 15,
                }),
                // Removed experimental_activeTools to fix type error
                system: enhancedSystemPrompt,
                tools: {
                    // Tool definitions here...
                }
            })

            result.mergeIntoDataStream(dataStream, {
                sendReasoning: true,
            });
        }
    })
}

// We'll create a separate API route for Gemini

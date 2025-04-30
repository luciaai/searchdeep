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

const ziq = customProvider({
    languageModels: {
        'ziq-default': xai('grok-2-1212'),
        'ziq-vision': xai('grok-2-vision-1212'),
        'ziq-llama': cerebras('llama-3.3-70b'),
        'ziq-sonnet': anthropic('claude-3-7-sonnet-20250219'),
        'ziq-r1': wrapLanguageModel({
            model: groq('deepseek-r1-distill-llama-70b'),
            middleware: extractReasoningMiddleware({ tagName: 'think' })
        }),
    }
})

// Allow streaming responses up to 600 seconds
export const maxDuration = 300;

interface XResult {
    id: string;
    url: string;
    title: string;
    author?: string;
    publishedDate?: string;
    text: string;
    highlights?: string[];
    tweetId: string;
}

interface MapboxFeature {
    id: string;
    name: string;
    formatted_address: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    feature_type: string;
    context: string;
    coordinates: number[];
    bbox: number[];
    source: string;
}

interface GoogleResult {
    place_id: string;
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
        viewport: {
            northeast: {
                lat: number;
                lng: number;
            };
            southwest: {
                lat: number;
                lng: number;
            };
        };
    };
    types: string[];
    address_components: Array<{
        long_name: string;
        short_name: string;
        types: string[];
    }>;
}

interface VideoDetails {
    title?: string;
    author_name?: string;
    author_url?: string;
    thumbnail_url?: string;
    type?: string;
    provider_name?: string;
    provider_url?: string;
}

interface VideoResult {
    videoId: string;
    url: string;
    details?: VideoDetails;
    captions?: string;
    timestamps?: string[];
    views?: string;
    likes?: string;
    summary?: string;
}

function sanitizeUrl(url: string): string {
    return url.replace(/\s+/g, '%20');
}

async function isValidImageUrl(url: string): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
        });

        clearTimeout(timeout);

        return response.ok && (response.headers.get('content-type')?.startsWith('image/') ?? false);
    } catch {
        return false;
    }
}


const extractDomain = (url: string): string => {
    const urlPattern = /^https?:\/\/([^/?#]+)(?:[/?#]|$)/i;
    return url.match(urlPattern)?.[1] || url;
};

const deduplicateByDomainAndUrl = <T extends { url: string }>(items: T[]): T[] => {
    const seenDomains = new Set<string>();
    const seenUrls = new Set<string>();

    return items.filter(item => {
        const domain = extractDomain(item.url);
        const isNewUrl = !seenUrls.has(item.url);
        const isNewDomain = !seenDomains.has(domain);

        if (isNewUrl && isNewDomain) {
            seenUrls.add(item.url);
            seenDomains.add(domain);
            return true;
        }
        return false;
    });
};

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
        
        enhancedSystemPrompt = `${systemPrompt}\n\n${searchDepthInstruction}`;
        console.log(`Enhanced system prompt for Sonnet with search depth instruction: ${group} mode`);
    }

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
                experimental_activeTools: [...activeTools],
                system: enhancedSystemPrompt,
                tools: {
                    stock_chart: tool({
                        description: 'Write and execute Python code to find stock data and generate a stock chart.',
                        parameters: z.object({
                            title: z.string().describe('The title of the chart.'),
                            code: z.string().describe('The Python code with matplotlib line chart and yfinance to execute.'),
                            icon: z
                                .enum(['stock', 'date', 'calculation', 'default'])
                                .describe('The icon to display for the chart.'),
                            stock_symbols: z.array(z.string()).describe('The stock symbols to display for the chart.'),
                            interval: z.enum(['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max']).describe('The interval of the chart. default is 1y.'),
                        }),
                        execute: async ({ code, title, icon, stock_symbols, interval }: { code: string; title: string; icon: string; stock_symbols: string[]; interval: string }) => {
                            console.log('Code:', code);
                            console.log('Title:', title);
                            console.log('Icon:', icon);
                            console.log('Stock symbols:', stock_symbols);
                            console.log('Interval:', interval);
                            const sandbox = await CodeInterpreter.create(serverEnv.SANDBOX_TEMPLATE_ID!);
                            const execution = await sandbox.runCode(code);
                            let message = '';

                            if (execution.results.length > 0) {
                                for (const result of execution.results) {
                                    if (result.isMainResult) {
                                        message += `${result.text}\n`;
                                    } else {
                                        message += `${result.text}\n`;
                                    }
                                }
                            }

                            if (execution.logs.stdout.length > 0 || execution.logs.stderr.length > 0) {
                                if (execution.logs.stdout.length > 0) {
                                    message += `${execution.logs.stdout.join('\n')}\n`;
                                }
                                if (execution.logs.stderr.length > 0) {
                                    message += `${execution.logs.stderr.join('\n')}\n`;
                                    console.log("Error: ", execution.logs.stderr);
                                }
                            }

                            if (execution.error) {
                                message += `Error: ${execution.error}\n`;
                                console.log('Error: ', execution.error);
                            }

                            console.log("Chart details: ", execution.results[0].chart)
                            if (execution.results[0].chart) {
                                execution.results[0].chart.elements.map((element: any) => {
                                    console.log(element.points);
                                });
                            }

                            if (execution.results[0].chart === null) {
                                console.log("No chart found");
                            }

                            return {
                                message: message.trim(),
                                chart: execution.results[0].chart ?? '',
                            };
                        },
                    }),
                    currency_converter: tool({
                        description: 'Convert currency from one to another using yfinance',
                        parameters: z.object({
                            from: z.string().describe('The source currency code.'),
                            to: z.string().describe('The target currency code.'),
                            amount: z.number().default(1).describe('The amount to convert.'),
                        }),
                        execute: async ({ from, to }: { from: string; to: string }) => {
                            const code = `
  import yfinance as yf
  from_currency = '${from}'
  to_currency = '${to}'
  currency_pair = f'{from_currency}{to_currency}=X'
  data = yf.Ticker(currency_pair).history(period='1d')
  latest_rate = data['Close'].iloc[-1]
  latest_rate
  `;
                            console.log('Currency pair:', from, to);

                            const sandbox = await CodeInterpreter.create(serverEnv.SANDBOX_TEMPLATE_ID!);
                            const execution = await sandbox.runCode(code);
                            let message = '';

                            if (execution.results.length > 0) {
                                for (const result of execution.results) {
                                    if (result.isMainResult) {
                                        message += `${result.text}\n`;
                                    } else {
                                        message += `${result.text}\n`;
                                    }
                                }
                            }

                            if (execution.logs.stdout.length > 0 || execution.logs.stderr.length > 0) {
                                if (execution.logs.stdout.length > 0) {
                                    message += `${execution.logs.stdout.join('\n')}\n`;
                                }
                                if (execution.logs.stderr.length > 0) {
                                    message += `${execution.logs.stderr.join('\n')}\n`;
                                }
                            }

                            if (execution.error) {
                                message += `Error: ${execution.error}\n`;
                                console.log('Error: ', execution.error);
                            }

                            return { rate: message.trim() };
                        },
                    }),
                    text_translate: tool({
                        description: "Translate text from one language to another.",
                        parameters: z.object({
                            text: z.string().describe("The text to translate."),
                            to: z.string().describe("The language to translate to (e.g., 'fr' for French)."),
                        }),
                        execute: async ({ text, to }: { text: string; to: string }) => {
                            const { object: translation } = await generateObject({
                                model: ziq.languageModel(model),
                                system: `You are a helpful assistant that translates text from one language to another.`,
                                prompt: `Translate the following text to ${to} language: ${text}`,
                                schema: z.object({
                                    translatedText: z.string(),
                                    detectedLanguage: z.string(),
                                }),
                            });
                            console.log(translation);
                            return {
                                translatedText: translation.translatedText,
                                detectedLanguage: translation.detectedLanguage,
                            };
                        },
                    }),
                    web_search: tool({
                        description: 'Search the web for information with multiple queries, max results and search depth.',
                        parameters: z.object({
                            queries: z.array(z.string().describe('Array of search queries to look up on the web.')),
                            maxResults: z.array(
                                z.number().describe('Array of maximum number of results to return per query.').default(10),
                            ),
                            topics: z.array(
                                z.enum(['general', 'news']).describe('Array of topic types to search for.').default('general'),
                            ),
                            searchDepth: z.array(
                                z.enum(['basic', 'advanced']).describe('Array of search depths to use.').default('basic'),
                            ),
                            exclude_domains: z
                                .array(z.string())
                                .describe('A list of domains to exclude from all search results.')
                                .default([]),
                        }),
                        execute: async ({
                            queries,
                            maxResults,
                            topics,
                            searchDepth,
                            exclude_domains,
                        }: {
                            queries: string[];
                            maxResults: number[];
                            topics: ('general' | 'news')[];
                            searchDepth: ('basic' | 'advanced')[];
                            exclude_domains?: string[];
                        }) => {
                            const apiKey = serverEnv.TAVILY_API_KEY;
                            const tvly = tavily({ apiKey });
                            const includeImageDescriptions = true;

                            console.log('Queries:', queries);
                            console.log('Max Results:', maxResults);
                            console.log('Topics:', topics);
                            console.log('Search Depths:', searchDepth);
                            console.log('Exclude Domains:', exclude_domains);

                            // Execute searches in parallel
                            const searchPromises = queries.map(async (query, index) => {
                                const data = await tvly.search(query, {
                                    topic: topics[index] || topics[0] || 'general',
                                    days: topics[index] === 'news' ? 7 : undefined,
                                    maxResults: maxResults[index] || maxResults[0] || 10,
                                    searchDepth: searchDepth[index] || searchDepth[0] || 'basic',
                                    includeAnswer: true,
                                    includeImages: true,
                                    includeImageDescriptions: includeImageDescriptions,
                                    excludeDomains: exclude_domains,
                                });

                                // Add annotation for query completion
                                dataStream.writeMessageAnnotation({
                                    type: 'query_completion',
                                    data: {
                                        query,
                                        index,
                                        total: queries.length,
                                        status: 'completed',
                                        resultsCount: data.results.length,
                                        imagesCount: data.images.length
                                    }
                                });

                                return {
                                    query,
                                    results: deduplicateByDomainAndUrl(data.results).map((obj: any) => ({
                                        url: obj.url,
                                        title: obj.title,
                                        content: obj.content,
                                        raw_content: obj.raw_content,
                                        published_date: topics[index] === 'news' ? obj.published_date : undefined,
                                    })),
                                    images: includeImageDescriptions
                                        ? await Promise.all(
                                            deduplicateByDomainAndUrl(data.images).map(
                                                async ({ url, description }: { url: string; description?: string }) => {
                                                    const sanitizedUrl = sanitizeUrl(url);
                                                    const isValid = await isValidImageUrl(sanitizedUrl);
                                                    return isValid
                                                        ? {
                                                            url: sanitizedUrl,
                                                            description: description ?? '',
                                                            sourceUrl: url.startsWith('http') ? new URL(url).origin : null,
                                                        }
                                                        : null;
                                                },
                                            ),
                                        ).then((results) =>
                                            results.filter(
                                                (image): image is { url: string; description: string; sourceUrl: string | null } =>
                                                    image !== null &&
                                                    typeof image === 'object' &&
                                                    typeof image.description === 'string' &&
                                                    image.description !== '',
                                            ),
                                        )
                                        : await Promise.all(
                                            deduplicateByDomainAndUrl(data.images).map(async ({ url }: { url: string }) => {
                                                const sanitizedUrl = sanitizeUrl(url);
                                                return (await isValidImageUrl(sanitizedUrl)) ? sanitizedUrl : null;
                                            }),
                                        ).then((results) => results.filter((url) => url !== null) as string[]),
                                };
                            });

                            const searchResults = await Promise.all(searchPromises);

                            return {
                                searches: searchResults,
                            };
                        },
                    }),
                    x_search: tool({
                        description: 'Search X (formerly Twitter) posts.',
                        parameters: z.object({
                            query: z.string().describe('The search query, if a username is provided put in the query with @username'),
                            startDate: z.string().optional().describe('The start date for the search in YYYY-MM-DD format'),
                            endDate: z.string().optional().describe('The end date for the search in YYYY-MM-DD format'),
                        }),
                        execute: async ({
                            query,
                            startDate,
                            endDate,
                        }: {
                            query: string;
                            startDate?: string;
                            endDate?: string;
                        }) => {
                            try {
                                const exa = new Exa(serverEnv.EXA_API_KEY as string);

                                const result = await exa.searchAndContents(query, {
                                    type: 'keyword',
                                    numResults: 15,
                                    text: true,
                                    highlights: true,
                                    includeDomains: ['twitter.com', 'x.com'],
                                    startPublishedDate: startDate,
                                    endPublishedDate: endDate,
                                });

                                // Extract tweet ID from URL
                                const extractTweetId = (url: string): string | null => {
                                    const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
                                    return match ? match[1] : null;
                                };

                                // Process and filter results
                                const processedResults = result.results.reduce<Array<XResult>>((acc, post) => {
                                    const tweetId = extractTweetId(post.url);
                                    if (tweetId) {
                                        acc.push({
                                            ...post,
                                            tweetId,
                                            title: post.title || '',
                                        });
                                    }
                                    return acc;
                                }, []);

                                return processedResults;
                            } catch (error) {
                                console.error('X search error:', error);
                                throw error;
                            }
                        },
                    }),
                    movie_or_tv_search: tool({
                        description: 'Search for a movie or TV show using TMDB API',
                        parameters: z.object({
                            query: z.string().describe('The search query for movies/TV shows'),
                        }),
                        execute: async ({ query }: { query: string }) => {
                            const TMDB_API_KEY = serverEnv.TMDB_API_KEY;
                            const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

                            try {
                                // First do a multi-search to get the top result
                                const searchResponse = await fetch(
                                    `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(
                                        query,
                                    )}&include_adult=true&language=en-US&page=1`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${TMDB_API_KEY}`,
                                            accept: 'application/json',
                                        },
                                    },
                                );

                                const searchResults = await searchResponse.json();

                                // Get the first movie or TV show result
                                const firstResult = searchResults.results.find(
                                    (result: any) => result.media_type === 'movie' || result.media_type === 'tv',
                                );

                                if (!firstResult) {
                                    return { result: null };
                                }

                                // Get detailed information for the media
                                const detailsResponse = await fetch(
                                    `${TMDB_BASE_URL}/${firstResult.media_type}/${firstResult.id}?language=en-US`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${TMDB_API_KEY}`,
                                            accept: 'application/json',
                                        },
                                    },
                                );

                                const details = await detailsResponse.json();

                                // Get additional credits information
                                const creditsResponse = await fetch(
                                    `${TMDB_BASE_URL}/${firstResult.media_type}/${firstResult.id}/credits?language=en-US`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${TMDB_API_KEY}`,
                                            accept: 'application/json',
                                        },
                                    },
                                );

                                const credits = await creditsResponse.json();

                                // Format the result
                                const result = {
                                    ...details,
                                    media_type: firstResult.media_type,
                                    credits: {
                                        cast:
                                            credits.cast?.slice(0, 8).map((person: any) => ({
                                                ...person,
                                                profile_path: person.profile_path
                                                    ? `https://image.tmdb.org/t/p/original${person.profile_path}`
                                                    : null,
                                            })) || [],
                                        director: credits.crew?.find((person: any) => person.job === 'Director')?.name,
                                        writer: credits.crew?.find(
                                            (person: any) => person.job === 'Screenplay' || person.job === 'Writer',
                                        )?.name,
                                    },
                                    poster_path: details.poster_path
                                        ? `https://image.tmdb.org/t/p/original${details.poster_path}`
                                        : null,
                                    backdrop_path: details.backdrop_path
                                        ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
                                        : null,
                                };

                                return { result };
                            } catch (error) {
                                console.error('TMDB search error:', error);
                                throw error;
                            }
                        },
                    }),
                    trending_movies: tool({
                        description: 'Get trending movies from TMDB',
                        parameters: z.object({}),
                        execute: async () => {
                            const TMDB_API_KEY = serverEnv.TMDB_API_KEY;
                            const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

                            try {
                                const response = await fetch(`${TMDB_BASE_URL}/trending/movie/day?language=en-US`, {
                                    headers: {
                                        Authorization: `Bearer ${TMDB_API_KEY}`,
                                        accept: 'application/json',
                                    },
                                });

                                const data = await response.json();
                                const results = data.results.map((movie: any) => ({
                                    ...movie,
                                    poster_path: movie.poster_path
                                        ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                                        : null,
                                    backdrop_path: movie.backdrop_path
                                        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                                        : null,
                                }));

                                return { results };
                            } catch (error) {
                                console.error('Trending movies error:', error);
                                throw error;
                            }
                        },
                    }),
                    trending_tv: tool({
                        description: 'Get trending TV shows from TMDB',
                        parameters: z.object({}),
                        execute: async () => {
                            const TMDB_API_KEY = serverEnv.TMDB_API_KEY;
                            const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

                            try {
                                const response = await fetch(`${TMDB_BASE_URL}/trending/tv/day?language=en-US`, {
                                    headers: {
                                        Authorization: `Bearer ${TMDB_API_KEY}`,
                                        accept: 'application/json',
                                    },
                                });

                                const data = await response.json();
                                const results = data.results.map((show: any) => ({
                                    ...show,
                                    poster_path: show.poster_path
                                        ? `https://image.tmdb.org/t/p/original${show.poster_path}`
                                        : null,
                                    backdrop_path: show.backdrop_path
                                        ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
                                        : null,
                                }));

                                return { results };
                            } catch (error) {
                                console.error('Trending TV shows error:', error);
                                throw error;
                            }
                        },
                    }),
                    academic_search: tool({
                        description: 'Search academic papers and research.',
                        parameters: z.object({
                            query: z.string().describe('The search query'),
                        }),
                        execute: async ({ query }: { query: string }) => {
                            try {
                                const exa = new Exa(serverEnv.EXA_API_KEY as string);

                                // Search academic papers with content summary
                                const result = await exa.searchAndContents(query, {
                                    type: 'auto',
                                    numResults: 20,
                                    category: 'research paper',
                                    summary: {
                                        query: 'Abstract of the Paper',
                                    },
                                });

                                // Process and clean results
                                const processedResults = result.results.reduce<typeof result.results>((acc, paper) => {
                                    // Skip if URL already exists or if no summary available
                                    if (acc.some((p) => p.url === paper.url) || !paper.summary) return acc;

                                    // Clean up summary (remove "Summary:" prefix if exists)
                                    const cleanSummary = paper.summary.replace(/^Summary:\s*/i, '');

                                    // Clean up title (remove [...] suffixes)
                                    const cleanTitle = paper.title?.replace(/\s$$.*?$$$/, '');

                                    acc.push({
                                        ...paper,
                                        title: cleanTitle || '',
                                        summary: cleanSummary,
                                    });

                                    return acc;
                                }, []);

                                // Take only the first 10 unique, valid results
                                const limitedResults = processedResults.slice(0, 10);

                                return {
                                    results: limitedResults,
                                };
                            } catch (error) {
                                console.error('Academic search error:', error);
                                throw error;
                            }
                        },
                    }),
                    youtube_search: tool({
                        description: 'Search YouTube videos using Exa AI and get detailed video information.',
                        parameters: z.object({
                            query: z.string().describe('The search query for YouTube videos'),
                        }),
                        execute: async ({ query, }: { query: string; }) => {
                            try {
                                const exa = new Exa(serverEnv.EXA_API_KEY as string);

                                // Simple search to get YouTube URLs only
                                const searchResult = await exa.search(query, {
                                    type: 'neural',
                                    useAutoprompt: true,
                                    numResults: 10,
                                    includeDomains: ['youtube.com'],
                                });

                                // Process results
                                const processedResults = await Promise.all(
                                    searchResult.results.map(async (result): Promise<VideoResult | null> => {
                                        const videoIdMatch = result.url.match(
                                            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
                                        );
                                        const videoId = videoIdMatch?.[1];

                                        if (!videoId) return null;

                                        // Base result
                                        const baseResult: VideoResult = {
                                            videoId,
                                            url: result.url,
                                        };

                                        try {
                                            // Fetch detailed info from our endpoints
                                            const [detailsResponse, captionsResponse, timestampsResponse] = await Promise.all([
                                                fetch(`${serverEnv.Y
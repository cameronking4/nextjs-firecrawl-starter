import { NextResponse } from 'next/server';

interface CrawlRequestBody {
  url: string;
  limit?: number;
  allowBackwardLinks?: boolean;
  scrapeOptions?: {
    formats?: string[];
    extract?: {
      schema?: object;
      systemPrompt?: string;
      prompt?: string;
    };
  };
}

const apiKey = process.env.FIRECRAWL_API_KEY || '';

export async function POST(request: Request) {
  try {
    const { url, limit = 50, allowBackwardLinks = false, scrapeOptions } = await request.json() as CrawlRequestBody;
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    console.log('API Key available:', !!apiKey);
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Firecrawl API key not configured' },
        { status: 500 }
      );
    }

    console.log('Making request to Firecrawl API...');
    const crawlResponse = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url: url,
        limit: limit,
        allowBackwardLinks,
        scrapeOptions: scrapeOptions || {
          formats: ['markdown', 'html']
        }
      })
    });

    if (!crawlResponse.ok) {
      const error = await crawlResponse.json();
      console.error('Firecrawl API error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to crawl URL' },
        { status: crawlResponse.status }
      );
    }

    const data = await crawlResponse.json();
    
    // Check if we got a success response with an ID
    if (!data.success || !data.id) {
      console.error('Invalid Firecrawl response:', data);
      return NextResponse.json(
        { error: 'Invalid response from Firecrawl API' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      id: data.id
    });
  } catch (error) {
    console.error('Unexpected error:', error); // Debug log
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

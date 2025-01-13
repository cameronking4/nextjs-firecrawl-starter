import { NextResponse } from 'next/server';

interface ScrapeRequestBody {
  url: string;
  formats?: string[];
  extract?: {
    schema?: object;
    systemPrompt?: string;
    prompt?: string;
  };
  actions?: Array<{
    type: string;
    milliseconds?: number;
    selector?: string;
    text?: string;
    key?: string;
  }>;
  location?: {
    country?: string;
    languages?: string[];
  };
}

export async function POST(request: Request) {
  try {
    const { url, formats = ['markdown', 'html'], extract, actions, location } = await request.json() as ScrapeRequestBody;
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.FIRECRAWL_API_KEY || '';
    console.log('API Key available:', !!apiKey); // Debug log

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Firecrawl API key not configured' },
        { status: 500 }
      );
    }

    console.log('Making request to Firecrawl API...'); // Debug log
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', { // Updated to v1 endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url,
        formats,
        ...(extract && { extract }),
        ...(actions && { actions }),
        ...(location && { location })
      })
    });

    console.log('Firecrawl API response status:', response.status); // Debug log

    if (!response.ok) {
      const error = await response.json();
      console.error('Firecrawl API error:', error); // Debug log
      return NextResponse.json(
        { error: error.message || 'Failed to scrape URL' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error); // Debug log
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

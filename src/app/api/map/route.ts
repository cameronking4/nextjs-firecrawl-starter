import { NextResponse } from 'next/server';

interface MapRequestBody {
  url: string;
  search?: string;
}

const apiKey = process.env.FIRECRAWL_API_KEY || '';

export async function POST(request: Request) {
  try {
    const { url, search } = await request.json() as MapRequestBody;
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Firecrawl API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.firecrawl.dev/v1/map', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url,
        ...(search && { search })
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Firecrawl map error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to map URL' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

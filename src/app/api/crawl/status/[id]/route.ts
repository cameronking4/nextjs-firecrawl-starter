import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.FIRECRAWL_API_KEY || '';

export async function GET( request: NextRequest ) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Firecrawl API key not configured' },
        { status: 500 }
      );
    }

    const id = request.nextUrl.pathname.split('/').pop();
    const response = await fetch(`https://api.firecrawl.dev/v1/crawl/${id}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Firecrawl status check error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to check crawl status' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // If the crawl is still in progress
    if (data.status === 'scraping' || data.status === 'processing') {
      return NextResponse.json({
        status: data.status,
        total: data.total || 0,
        completed: data.completed || 0
      });
    }
    
    // If the crawl is completed
    if (data.status === 'completed' && data.data) {
      return NextResponse.json({
        status: 'completed',
        total: data.total || 0,
        completed: data.completed || 0,
        data: data.data,
        next: data.next
      });
    }
    
    // If the crawl failed
    if (data.status === 'failed') {
      return NextResponse.json({
        status: 'failed',
        error: data.error || 'Unknown error occurred'
      }, { status: 500 });
    }
    
    // Unexpected status
    return NextResponse.json({
      status: 'unknown',
      error: 'Unexpected response from Firecrawl API'
    }, { status: 500 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

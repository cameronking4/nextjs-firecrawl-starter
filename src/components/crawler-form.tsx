"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useConfetti } from "@/hooks/use-confetti";
import { Terminal, Hash, Bug, AlertCircle, Loader2 } from "lucide-react";

const loadingStates = [
  { text: "Teaching the fire to crawl..." },
  { text: "Giving the docs a thorough pat-down..." },
  { text: "Poking Firecrawl with a stick..." },
  { text: "Glazing Firecrawl expeditiously..." }
];

interface CrawlerFormProps {
  onResults: (data: Array<{ url: string; content: string }>) => void;
}

export function CrawlerForm({ onResults }: CrawlerFormProps) {
  const [url, setUrl] = useState("");
  const [limit, setLimit] = useState("50");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const { triggerConfetti } = useConfetti();

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  interface CrawlData {
    data?: Array<{ metadata?: { sourceURL: string }; markdown: string }>;
    next?: string;
    total?: number;
    completed?: number;
  }

  const fetchAllResults = async (initialData: CrawlData) => {
    const allResults = [];
    let nextUrl = initialData.next;
    let currentData = initialData;

    // Add initial results
    if (currentData.data) {
      allResults.push(...currentData.data);
    }

    // Keep fetching next chunks while there's a next URL
    while (nextUrl) {
      try {
        const response = await fetch("/api/crawl/next", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nextUrl })
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch next chunk");
        }

        currentData = await response.json();
        if (currentData.data) {
          allResults.push(...currentData.data);
        }
        nextUrl = currentData.next;

        // Update progress based on completed/total
        if (currentData.total && currentData.completed) {
          const progress = Math.round((currentData.completed / currentData.total) * 100);
          setProgress(progress);
        }
      } catch (error) {
        console.error("Error fetching next chunk:", error);
        break;
      }
    }

    return allResults;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setProgress(0);

    try {
      // Start the crawl
      const crawlResponse = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url, 
          limit: parseInt(limit)
        })
      });

      if (!crawlResponse.ok) {
        const error = await crawlResponse.json();
        throw new Error(error.error || "Failed to crawl URL");
      }

      const crawlData = await crawlResponse.json();
      console.log('Crawl response:', crawlData);

      if (!crawlData.success || !crawlData.id) {
        throw new Error("Invalid response from crawl endpoint");
      }

      const id = crawlData.id;
      console.log('Starting status polling for ID:', id);
      
      // Poll the status endpoint until completion
      let isComplete = false;
      let attempts = 0;
      const maxAttempts = 60; // Maximum 2 minutes of polling (2s * 60)
      
      while (!isComplete && attempts < maxAttempts) {
        await delay(2000);
        attempts++;
        console.log(`Polling attempt ${attempts}/${maxAttempts}`);

        const statusResponse = await fetch(`/api/crawl/status/${id}`);
        if (!statusResponse.ok) {
          console.error('Status check failed:', await statusResponse.text());
          throw new Error("Failed to check crawl status");
        }

        const statusData = await statusResponse.json();
        console.log('Status response:', statusData);
        
        // Update progress for any status
        if (statusData.total && statusData.completed) {
          const progress = Math.round((statusData.completed / statusData.total) * 100);
          setProgress(progress);
        }

        // Handle different status types
        switch (statusData.status) {
          case 'failed':
            throw new Error(statusData.error || "Crawl failed");
          
          case 'completed':
            isComplete = true;
            console.log('Crawl completed, processing results');
            
            // Fetch and process all results
            const allResults = await fetchAllResults(statusData);
            console.log('Processed results:', allResults.length);
            
            const processedResults = allResults
              .filter(page => page.markdown && page.metadata?.sourceURL)
              .map(page => ({
                url: page.metadata!.sourceURL,
                content: page.markdown
              }));

            onResults(processedResults);
            triggerConfetti();
            break;
          
          case 'scraping':
          case 'processing':
            console.log(`Crawl in progress: ${statusData.completed}/${statusData.total}`);
            break;
          
          default:
            console.warn('Unknown status:', statusData.status);
        }
      }

      if (!isComplete) {
        throw new Error("Crawl timed out - please try again");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Terminal className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              placeholder="Enter documentation URL (e.g., https://docs.example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={loading}
              className="pl-8"
            />
          </div>
          <div className="relative">
            <Hash className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Page limit (default: 50)"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              min="1"
              max="100"
              disabled={loading}
              className="pl-8"
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="motion-preset-slide-up motion-preset-fade">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-lg font-semibold">{error}</AlertDescription>
            </div>
          </Alert>
        )}

        {loading && (
          <>
            {progress === 0 ? (
              <p className="text-muted-foreground text-md">{loadingStates[0].text}</p>
            ) : (
              <div className="text-muted-foreground flex flex-col">
                <div className="flex text-lg gap-2 items-center">
                  <p>{loadingStates[Math.floor((progress / 100) * loadingStates.length)].text}</p>
                  <p>{progress}%</p>
                </div>
                <Progress value={progress} className="w-full motion-preset-fade" /> 
              </div>
            )}
          </>
        )}

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full motion-preset-scale motion-duration-200 hover:motion-running motion-paused"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Bug className="h-4 w-4" />
              Start Crawling
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

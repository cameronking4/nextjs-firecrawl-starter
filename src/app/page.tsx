"use client";

import { useState, useEffect } from "react";
import { CrawlerForm } from "@/components/crawler-form";
import { ResultsDisplay } from "@/components/results-display";
import { HistoryDisplay } from "@/components/history-display";
import { useToast } from "@/hooks/use-toast";
import { Book} from "lucide-react";
import { ExampleDocsLinks } from "@/components/example-docs-links";

interface CrawlResult {
  url: string;
  content: string;
}

interface HistoryItem {
  timestamp: string;
  url: string;
  results: CrawlResult[];
}

const MAX_HISTORY_ITEMS = 10;
const STORAGE_KEY = 'devdocs-history';

export default function Home() {
  const [results, setResults] = useState<CrawlResult[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load history from localStorage on mount
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse history:', error);
      }
    }
  }, []);

  const handleResults = (newResults: CrawlResult[]) => {
    setResults(newResults);
    
    // Add to history
    const newHistoryItem: HistoryItem = {
      timestamp: new Date().toISOString(),
      url: newResults[0]?.url || '',
      results: newResults,
    };

    const updatedHistory = [newHistoryItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      description: "History cleared successfully",
      duration: 3000
    });
  };

  const handleSelectHistory = (historyResults: CrawlResult[]) => {
    setResults(historyResults);
    toast({
      description: "Previous results loaded: " + historyResults[0]?.url,
      duration: 3000
    });
  };

  return (
    <main className="min-h-full p-4 md:p-8 mt-12 max-w-5xl mx-4 sm:mx-auto space-y-6">
      {/* Form Input */}
      <div className="space-y-6 border rounded-lg shadow-md motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-400 p-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Book className="h-8 w-8" />
            DevDocs to LLM
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert any documentation into a format suitable for LLMs. Simply enter the URL of the documentation
            you want to process, and we&apos;ll crawl it, extract the content, and provide it in both Markdown and XML formats.
          </p>
        </div>
        <div className="gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Documentation URL</h2>
            <CrawlerForm onResults={handleResults} />
          </section>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="border rounded-lg motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md p-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Results 🎉</h2>
            <ResultsDisplay results={results} />
          </section>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="border rounded-lg motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-400 p-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2">History</h2>
            <HistoryDisplay
              history={history}
              onSelectHistory={handleSelectHistory}
              onClearHistory={handleClearHistory}
            />
          </section>
        </div>
      )}

      {/* Example Docs Links */}
      <div className="border rounded-lg shadow-md motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-600 p-6">
        <ExampleDocsLinks />
      </div>
    </main>
  );
}

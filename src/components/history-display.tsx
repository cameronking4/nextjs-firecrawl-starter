"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";

interface HistoryDisplayProps {
  history: Array<{
    timestamp: string;
    url: string;
    results: Array<{
      url: string;
      content: string;
    }>;
  }>;
  onSelectHistory: (results: Array<{ url: string; content: string }>) => void;
  onClearHistory: () => void;
}

export function HistoryDisplay({ history, onSelectHistory, onClearHistory }: HistoryDisplayProps) {
  if (!history.length) return null;

  return (
    <div className="space-y-4 motion-preset-fade">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg text-muted-foreground ">Browse previous results</h3>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onClearHistory}
          className="motion-preset-scale motion-duration-200 hover:motion-running motion-paused"
        >
          <Trash2 className="h-4 w-4" />
          Clear History
        </Button>
      </div>
      <ScrollArea className="h-full max-w-full">
        <div className="space-y-2">
          {history.map((item, index) => (
            <Card
              key={index}
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => onSelectHistory(item.results)}
            >
              <div className="flex items-center justify-between">
                <div className="truncate flex-1">
                  <p className="font-medium truncate">{item.url}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground ml-4">
                  {item.results.length} pages
                </p>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

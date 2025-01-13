"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import JSZip from "jszip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, FileDown, Download, FileText, Code2, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResultsDisplayProps {
  results: Array<{
    url: string;
    content: string;
  }>;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"markdown" | "xml">("markdown");

  const formatContent = (format: "markdown" | "xml") => {
    if (format === "markdown") {
      return results.map(result => 
        `# ${result.url}\n\n${result.content}\n\n---\n\n`
      ).join("");
    } else {
      // Convert markdown to XML with proper escaping
      return `<?xml version="1.0" encoding="UTF-8"?>
<document>
  ${results.map(result => {
    // Escape XML special characters
    const escapedContent = result.content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    // Convert markdown headers to XML tags
    const xmlContent = escapedContent
      .split('\n')
      .map(line => {
        // Handle headers
        const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headerMatch) {
          const level = headerMatch[1].length;
          return `<h${level}>${headerMatch[2]}</h${level}>`;
        }
        // Handle code blocks
        if (line.startsWith('```')) {
          return '<code>';
        }
        if (line.endsWith('```')) {
          return '</code>';
        }
        // Handle lists
        if (line.match(/^\s*[-*+]\s/)) {
          return `<li>${line.replace(/^\s*[-*+]\s/, '')}</li>`;
        }
        // Return regular lines
        return line ? `<p>${line}</p>` : '';
      })
      .join('\n      ');

    return `
  <page>
    <url>${result.url}</url>
    <content>
      ${xmlContent}
    </content>
  </page>`;
  }).join("")}
</document>`;
    }
  };

  const handleCopy = async (format: "markdown" | "xml") => {
    try {
      await navigator.clipboard.writeText(formatContent(format));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([formatContent("markdown")], { 
      type: "text/markdown" 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "documentation.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    
    // Create a folder for the markdown files
    const docsFolder = zip.folder("docs");
    if (!docsFolder) return;

    // Process each result into a separate markdown file
    results.forEach((result, index) => {
      // Create a safe filename from the URL
      const filename = `${index + 1}-${result.url.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
      
      // Create the markdown content for this file with the URL as the main header
      const content = `# ${result.url}\n\n${result.content.trim()}\n`;
      
      // Add the file to the zip
      docsFolder.file(filename, content);
    });

    try {
      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Download the zip file
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "documentation.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to create zip file:", error);
    }
  };

  if (!results.length) {
    return null;
  }

  return (
    <div className="space-y-4 motion-preset-fade max-w-full">
      <Tabs 
        defaultValue="markdown" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value as "markdown" | "xml")}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="markdown" className="flex items-center gap-2 motion-preset-slide-down">
              <FileText className="h-4 w-4" />
              Markdown
            </TabsTrigger>
            <TabsTrigger value="xml" className="flex items-center gap-2 motion-preset-slide-down motion-delay-100">
              <Code2 className="h-4 w-4" />
              XML
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap w-full sm:w-auto gap-2">
            <Button 
              variant="outline"
              onClick={() => handleCopy(activeTab)}
              className="w-full sm:w-auto motion-preset-scale motion-duration-200 hover:motion-running motion-paused"
            >
              {copied ? <CheckCircle2 className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
              {copied ? "Copied!" : "Copy file"}
            </Button>
            <Button 
              onClick={handleDownload}
              variant="secondary"
              className="w-full sm:w-auto motion-preset-scale motion-duration-200 hover:motion-running motion-paused"
            >
              <FileDown className="mr-1 h-4 w-4" />
              Download File
            </Button>
            <Button 
              onClick={handleDownloadZip} 
              variant="default"
              className="w-full sm:w-auto motion-preset-scale motion-duration-200 hover:motion-running motion-paused"
            >
              <Download className="mr-1 h-4 w-4" />
              Download as Zip
            </Button>
          </div>
        </div>

        <TabsContent value="markdown" className="max-w-full overflow-hidden">
          <ScrollArea className="border rounded-lg p-2min-h-[400px] shadow-lg">
            <div className="max-w-full">
              <div className="max-w-full overflow-x-auto">
                {/* <MDEditor.Markdown 
                  className="max-w-full p-4 rounded-lg motion-preset-fade whitespace-pre-wrap"
                  source={formatContent("markdown")}
                /> */}
                <Textarea
                  value={formatContent("markdown")}
                  readOnly
                  className="w-full h-full min-h-[400px] font-mono motion-preset-fade border-0 focus-visible:ring-0 resize-none"
                />
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="xml" className="overflow-hidden">
          <ScrollArea className="border rounded-lg p-2 min-h-[400px] shadow-lg">
            <div className="p-4 w-full">
              <Textarea
                value={formatContent("xml")}
                readOnly
                className="w-full h-full min-h-[400px] font-mono motion-preset-fade border-0 focus-visible:ring-0 resize-none"
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EXAMPLE_DOCS = [
  { 
    name: "CrewAI", 
    url: "https://docs.crewai.com",
    icon: "👥"
  },
  { 
    name: "Rombo Tailwind Animations", 
    url: "https://docs.rombo.co/tailwind",
    icon: "🦁"
  },
  { 
    name: "OpenAI", 
    url: "https://platform.openai.com/docs",
    icon: "🤖"
  },
  { 
    name: "FireCrawl", 
    url: "https://docs.firecrawl.dev",
    icon: "🔥"
  },
  { 
    name: "Anthropic", 
    url: "https://docs.anthropic.com",
    icon: "🧠"
  },
  { 
    name: "LangChain", 
    url: "https://python.langchain.com",
    icon: "⛓️"
  }
];

export function ExampleDocsLinks() {
  const { toast } = useToast();

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Example Documentation Links</h3>
        <div className="text-muted-foreground text-lg">
          <ul className="space-y-2 mt-2">
            {EXAMPLE_DOCS.map(({ name, url, icon }, index) => (
              <li key={url} className={`flex items-center gap-2 motion-preset-slide-up motion-delay-${500 + index * 100}`}>
                <span className="text-xl rounded-full text-center flex-shrink-0">
                  {icon}
                </span>
                <Input
                  value={name + " - " + url}
                  readOnly
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 p-4 motion-preset-scale motion-duration-200 hover:motion-running motion-paused"
                        onClick={() => {
                          navigator.clipboard.writeText(url);
                          toast({
                            description: (
                              <div className="flex items-center gap-2">
                                <Copy className="h-4 w-4" />
                                URL copied to clipboard. Paste it into the form to start crawling.
                              </div>
                            ),
                            duration: 3000
                          });
                        }}
                      >
                        <Copy className="h-4 w-4" />
                        Copy URL
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Copy documentation URL
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
} 
import { NextResponse } from 'next/server';

const openApiSpec = {
  "openapi": "3.1.0",
  "info": {
    "title": "Firecrawl API",
    "version": "1.0.0",
    "description": "API for crawling, mapping, and scraping web content using Firecrawl"
  },
  "servers": [
    {
      "url": "https://nextjs-firecrawl-starter.vercel.app",
      "description": "Next.js API routes"
    }
  ],
  "components": {
    "schemas": {
      "Error": {
        "type": "object",
        "properties": {
          "error": {
            "type": "string",
            "description": "Error message"
          }
        }
      },
      "CrawlRequest": {
        "type": "object",
        "required": ["url"],
        "properties": {
          "url": {
            "type": "string",
            "description": "URL to crawl"
          },
          "limit": {
            "type": "integer",
            "description": "Maximum number of pages to crawl",
            "default": 50
          },
          "allowBackwardLinks": {
            "type": "boolean",
            "description": "Whether to allow crawling backward links",
            "default": false
          },
          "scrapeOptions": {
            "type": "object",
            "properties": {
              "formats": {
                "type": "array",
                "items": {
                  "type": "string"
                },
                "description": "Content formats to extract"
              },
              "extract": {
                "type": "object",
                "properties": {
                  "schema": {
                    "type": "object",
                    "description": "Schema for content extraction"
                  },
                  "systemPrompt": {
                    "type": "string",
                    "description": "System prompt for extraction"
                  },
                  "prompt": {
                    "type": "string",
                    "description": "User prompt for extraction"
                  }
                }
              }
            }
          }
        }
      },
      "CrawlResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean"
          },
          "id": {
            "type": "string",
            "description": "Crawl job ID"
          }
        }
      },
      "CrawlStatus": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "enum": ["scraping", "processing", "completed", "failed"]
          },
          "total": {
            "type": "integer",
            "description": "Total number of pages"
          },
          "completed": {
            "type": "integer",
            "description": "Number of completed pages"
          },
          "data": {
            "type": "array",
            "description": "Crawled data (when completed)",
            "items": {
              "type": "object",
              "description": "Crawled page data"
            }
          },
          "next": {
            "type": "string",
            "description": "Next page token"
          },
          "error": {
            "type": "string",
            "description": "Error message (when failed)"
          }
        }
      },
      "MapRequest": {
        "type": "object",
        "required": ["url"],
        "properties": {
          "url": {
            "type": "string",
            "description": "URL to map"
          },
          "search": {
            "type": "string",
            "description": "Optional search query"
          }
        }
      },
      "ScrapeRequest": {
        "type": "object",
        "required": ["url"],
        "properties": {
          "url": {
            "type": "string",
            "description": "URL to scrape"
          },
          "formats": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "default": ["markdown", "html"],
            "description": "Content formats to extract"
          },
          "extract": {
            "type": "object",
            "properties": {
              "schema": {
                "type": "object",
                "description": "Schema for content extraction"
              },
              "systemPrompt": {
                "type": "string",
                "description": "System prompt for extraction"
              },
              "prompt": {
                "type": "string",
                "description": "User prompt for extraction"
              }
            }
          },
          "actions": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["type"],
              "properties": {
                "type": {
                  "type": "string",
                  "description": "Type of action"
                },
                "milliseconds": {
                  "type": "integer",
                  "description": "Delay in milliseconds"
                },
                "selector": {
                  "type": "string",
                  "description": "CSS selector for element"
                },
                "text": {
                  "type": "string",
                  "description": "Text to input"
                },
                "key": {
                  "type": "string",
                  "description": "Keyboard key to press"
                }
              }
            }
          },
          "location": {
            "type": "object",
            "properties": {
              "country": {
                "type": "string",
                "description": "Country code"
              },
              "languages": {
                "type": "array",
                "items": {
                  "type": "string"
                },
                "description": "Preferred languages"
              }
            }
          }
        }
      }
    }
  },
  "paths": {
    "/crawl": {
      "post": {
        "operationId": "startCrawl",
        "summary": "Start a new crawl job",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CrawlRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Crawl job started successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CrawlResponse"
                }
              }
            }
          },
          "400": {
            "description": "Invalid request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    },
    "/crawl/status/{id}": {
      "get": {
        "operationId": "getCrawlStatus",
        "summary": "Get crawl job status",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "Crawl job ID"
          }
        ],
        "responses": {
          "200": {
            "description": "Crawl status retrieved successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CrawlStatus"
                }
              }
            }
          }
        }
      }
    },
    "/scrape": {
      "post": {
        "operationId": "scrapePage",
        "summary": "Scrape a webpage",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ScrapeRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Page scraped successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    }
  }
};

export async function GET() {
  return NextResponse.json(openApiSpec);
}

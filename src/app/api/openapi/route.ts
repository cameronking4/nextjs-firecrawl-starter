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
        "url": "https://nextjs-firecrawl-starter.vercel.app/api",
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
                  "items": { "type": "string" },
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
              "items": { "type": "string" },
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
            }
          }
        }
      }
    },
    "paths": {
      "/crawl": {
        "post": {
          "operationId": "startCrawl",
          "x-openai-isConsequential": false,
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
              "schema": { "type": "string" },
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
      "/map": {
        "post": {
          "operationId": "mapWebsite",
          "x-openai-isConsequential": false,
          "summary": "Map a website structure",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MapRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Website mapped successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "description": "Whether the mapping was successful"
                      },
                      "nodes": {
                        "type": "array",
                        "description": "List of mapped URLs and their relationships",
                        "items": {
                          "type": "object",
                          "properties": {
                            "url": {
                              "type": "string",
                              "description": "URL of the page"
                            },
                            "links": {
                              "type": "array",
                              "items": { "type": "string" },
                              "description": "Outgoing links from this page"
                            }
                          }
                        }
                      }
                    }
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
          "x-openai-isConsequential": false,
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
                    "type": "object",
                    "properties": {
                      "success": { "type": "boolean" },
                      "content": {
                        "type": "object",
                        "properties": {
                          "markdown": { "type": "string" },
                          "html": { "type": "string" }
                        }
                      }
                    }
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

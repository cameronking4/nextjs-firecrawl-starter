# Next.js Firecrawl Starter
![image](https://github.com/user-attachments/assets/e82a0567-6ad9-44c4-bc4b-2a99543cac1f)

This Nextjs app aims to provide a modern web interface for crawling documentation and processing it for LLM use. Use the output `markdown`, `xml`, or `zip` files to build knowledge files to copy over to a vector database, a ChatGPT GPT, an OpenAI Assistant, Claude Artifacts, Vapi.ai, Aimdoc, or any other LLM tool.

![image](https://github.com/user-attachments/assets/8d48194d-7436-4227-9919-7602688c65b7)

The Next app generates a .md file, .xml file, or .zip of markdown files ready for LLM consumption, inspired by the [devdocs-to-llm](https://github.com/alexfazio/devdocs-to-llm) Jupyter notebook by Alex Fazio.

## Features

- 🌐 Serverless architecture using `Firecrawl API` v1
- ⚡ Real-time crawl status updates
- 🎨 Modern UI with dark/light mode support
- 📂 Crawl History using `Local Storage`
- 💥 Github Action defined to manually run crawl function and commit to /knowledge_bases folder

## Github Action 
Use the Github Action template to define automations. Leverage Github Actions cron to schedule crawls for a given site and commit markdown file directly to repo.
### Manual Trigger
https://github.com/user-attachments/assets/fdc0f1a3-1632-44fc-b382-332377d73ed6

### Scheduled Crawl ([available on Github Marketplace](https://github.com/marketplace/actions/firecrawl-scheduled-action))
[![Firecrawl Action](https://github.com/cameronking4/nextjs-firecrawl-starter/actions/workflows/crawl-docs.yml/badge.svg)](https://github.com/cameronking4/nextjs-firecrawl-starter/actions/workflows/crawl-docs.yml)

Add this to any Github Repo to start crawling on a schedule. It will commit the output results automatically after crawling to a specified folder. Default is to crawl `Hacker News` everyday at midnight and store results in the `/knowledge_bases` folder.

```yaml
name: Scheduled Crawl Action

# This workflow will automatically crawl the specified URL on a schedule and commit the results to your repository.

on:
  schedule:
    - cron: '0 0 * * *'  # Replace with the cron expression for the schedule you want to use (e.g., '0 0 * * *' for daily at midnight UTC)
  workflow_dispatch:  # Allow manual triggering

jobs:
  crawl:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      id-token: write
      actions: read

    steps:
      - uses: actions/checkout@v4
      - name: Firecrawl Scheduled Action
        uses: cameronking4/nextjs-firecrawl-starter@v1.0.0
        with:
          url: 'https://news.ycombinator.com' # Replace with the URL you want to crawl regularly
          output_folder: 'knowledge_bases' # Replace with the folder name where the output commits will be saved
          api_url: 'https://nextjs-firecrawl-starter.vercel.app' # Replace with the API URL of your Firecrawl API endpoint, this is the default URL for the starter app.
```

## OpenAPI Spec & Custom GPT Actions
You can use this project to serve endpoints for your LLM tools. In ChatGPT, you can click `Create a GPT` and then `Create Action` to allow your GPT to call the Firecrawl API endpoints and return results in chat.

![image (3)](https://github.com/user-attachments/assets/1280fc24-582b-42b3-8c76-7db66c72b004)

### Quickstart
Add the Firecrawl actions to your GPT by copying and pasting this import URL in the Configure Tab:
```
https://nextjs-firecrawl-starter.vercel.app/api/openapi
```
This URL is defined and can be edited in the `/api/openapi/route.ts` file.

## Tech Stack

- **Framework**: Next.js 15.1.4
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Radix UI primitives
  - Shadcn/ui components
- **State Management**: React Hook Form
- **Animations**: Framer Motion & Rombo 
- **Development**: TypeScript
- **API Routes**: Firecrawl API Key & Next.js App Router

## API Routes

The application uses Next.js App Router API routes for serverless functionality:

- `/api/crawl/route.ts` - Initiates a new crawl job
- `/api/crawl/status/[id]/route.ts` - Gets the status of an ongoing crawl
- `/api/map/route.ts` - Generates site maps
- `/api/scrape/route.ts` - Handles individual page scraping

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env` file with your Firecrawl API key:
```env
FIRECRAWL_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Dependencies

- **UI & Components**:
  - @radix-ui/* - Headless UI components
  - class-variance-authority - Component variants
  - tailwind-merge - Tailwind class merging
  - lucide-react - Icons
  - next-themes - Theme management
  - framer-motion - Animations
  - rombo - Animations
- **Forms & Validation**:
  - react-hook-form - Form handling
  - @hookform/resolvers - Form validation
  - zod - Schema validation

## How It Works

1. **Crawling**: Uses Firecrawl API to crawl documentation sites and generate sitemaps
2. **Processing**: Extracts content and converts it to markdown format
3. **Status Tracking**: Real-time updates on crawl progress
4. **Results**: Displays processed content ready for LLM consumption

## Credits

This project is a Next.js implementation inspired by the [devdocs-to-llm](https://github.com/alexfazio/devdocs-to-llm) Jupyter notebook by Alex Fazio. The original project demonstrated how to use Firecrawl API to crawl developer documentation and prepare it for LLM use.

The original Jupyter notebook implementation provides:
- Documentation crawling with Firecrawl API
- Content extraction and markdown conversion
- Export capabilities to Rentry.co and Google Docs


This Next.js version builds upon these capabilities by:
- Adding a modern web interface
- Implementing real-time crawl status tracking
- Providing a serverless architecture for Firecrawl API processing
- Adding dark/light theme support
- Making the tool more accessible through a user-friendly UI deployed on Vercel
- Github Actions for manual and scheduled scraping
- OpenAPI Specification for LLM Tool Calling

## License

See the [LICENSE](LICENSE) file for details.

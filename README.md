# Next.js Firecrawl Starter

![image](https://github.com/user-attachments/assets/f5421718-4951-47b9-9db6-cd9632dc5f2f)

A frequent use case for Firecrawl is to scrape developer documentation for LLM context when generating code. 

This Nextjs app aims to provide a modern web interface for crawling documentation and processing it for LLM use. Use the output `markdown`, `xml`, or `zip` files to build knowledge files to copy over to a vector database, a ChatGPT GPT, an OpenAI Assistant, Claude Artifacts, Vapi.ai, Aimdoc, or any other LLM tool.

![screenrun-01-13-2025-06-42-30](https://github.com/user-attachments/assets/56912254-1802-48ea-9cc3-99dcc880e4dd)

The Next app generates a .md file, .xml file, or .zip of markdown files ready for LLM consumption, inspired by the [devdocs-to-llm](https://github.com/alexfazio/devdocs-to-llm) Jupyter notebook by Alex Fazio.

## Features

- 🌐 Serverless architecture using `Firecrawl API` v1
- ⚡ Real-time crawl status updates
- 🎨 Modern UI with dark/light mode support
- 📂 Crawl History using `Local Storage`
- 💥 Github Action defined to manually run crawl function and commit to /knowledge_bases folder

## Github Action 
Use the Github Action template to define automations. Leverage Github Actions cron to schedule crawls for a given site and commit markdown file directly to repo.

https://github.com/user-attachments/assets/d1edcf8e-a929-48ab-8c9a-b588cb548680

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
- Making the tool more accessible through a user-friendly UI deployable on Vercel

## License

See the [LICENSE](LICENSE) file for details.

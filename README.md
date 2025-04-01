# Algorand Smart Contract Analyzer

A web-based tool that allows users to understand Algorand smart contracts in plain language.


## Architecture

This application uses a server-side approach with SvelteKit:

- Server-side actions handle the Algorand indexer API calls
- Server-side actions handle the Claude API integration
- Client-side UI is kept minimal and focused on user interaction
- Responsive, progressive enhancement design

## Prerequisites

- Node.js 18+ and Bun
- Claude API key (from [Anthropic Console](https://console.anthropic.com/))
- Access to an Algorand indexer service (default: nodely public indexer)

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>
```

2. Install dependencies:

```bash
bun install
```

3. Create a `.env` file based on the `.env.example` file:

```bash
cp .env.example .env
```

4. Edit the `.env` file and add your API keys and endpoints.

5. Start the development server:

```bash
bun run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production version of the app:

```bash
bun run build
```

You can preview the production build with:

```bash
bun run preview
```

## Technologies Used

- Svelte 5 with Runes for reactive state management
- SvelteKit with server-side actions for API interactions
- TypeScript for type safety
- Tailwind CSS 4 for styling
- Algorand SDK for blockchain interaction
- Claude API for smart contract analysis

## Project Structure

- `/src/routes/+page.svelte` - Main user interface
- `/src/routes/+page.server.ts` - Server-side actions for API calls
- `/src/routes/+page.ts` - Page load function

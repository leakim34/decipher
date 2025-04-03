# Decipher

<div align="center">
  <svg width="120" height="120" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 16L8 24L14 32" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M34 16L40 24L34 32" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M18 10L30 38" stroke="#80FFD4" stroke-width="3" stroke-linecap="round" />
    <rect x="20" y="20" width="8" height="8" rx="1.5" fill="white" fill-opacity="0.95" />
  </svg>
  <p><em>Making crypto contracts actually make sense</em></p>
</div>

## What's this about?

Built during the **Algorand Foundation's Dev Retreat 2025**, Decipher turns gobbledygook smart contract code into plain English. Because let's face it - nobody outside dev teams actually understands what they're approving when they sign transactions.

This tool:
- Translates TEAL code into words normal humans can understand
- Shows you both quick summaries and deep dives of what contracts do
- Could Helps you at some point, figure out if a contract is sketchy before you approve it but need improvements.

## Cool features

- **App ID Search**: Look up any Algorand contract by just its ID
- **Wallet Search**: See all the contracts your wallet has tangled with
- **Simple/Detailed Views**: Get a quick overview or dive into the nerdy bits
- **History analyses**: See recent analyses

## Getting started

### You'll need

- Node.js (v18+)
- npm or pnpm or bun
- Access to a node
- Claude API key

### Quick setup

```bash
# Grab the code
git clone https://github.com/leakim34/decipher.git
cd decipher

# Set it up
npm install
cp .env.example .env

# Drop your API keys in .env
# CLAUDE_API_KEY=your_key
# ALGORAND_API_KEY=your_key

# Fire it up
npm run dev
```

## How to use it

1. Load it up (usually at http://localhost:3000)
2. Paste in an Algorand app ID or wallet address
3. Read what the contract actually does in plain English
4. Toggle between simple and detailed explanations

## Potential improvements

- **Cleaner AI output**: More consistent, better formatted explanations
- **Richer information**: Extract and display more useful contract metadata
- **Transaction analysis**: Break down exactly what a specific transaction does
- **Group transaction support**: Understand multi-transaction operations as a whole

## Real-world uses

- **Pre-signing clarity**: Know what you're approving before you sign a transaction
- **Newbie-friendly explorer**: Browse the blockchain without a CS degree
- **Developer documentation**: Auto-generate human explanations for your contracts
- **Transaction history**: Review past interactions in understandable terms

## The legal bit

This project is 100% free and open source (MIT License). Do whatever you want with it.

## Want to help?

Got ideas? This project is just a starting point. If you want to make it better:

1. Fork it
2. Build something cool
3. Send a pull request

## Credits

Made by [leakz](https://github.com/leakim34) during Algorand's Dev Retreat 2025.

Built with: Svelte 5, Algorand SDK, Claude AI, Redis, and TailwindCSS.

# Fate Flip - Tarot Reading Mini App

A Base miniapp that provides tarot card readings for guidance in love, money, crypto, and general life questions.

## Features

- Wallet connection using Base miniapp-wagmi-connector
- Four reading categories: Love, Money/Career, Crypto/Trading, General Life
- 3-card tarot spread with upright/reversed orientations
- Category-specific interpretations for each card
- Overall vibe assessment (Positive/Neutral/Caution)
- Reading history stored in local storage (last 10 readings)
- Mobile-first design that fits Base/Farcaster miniapp constraints
- Lexend font from Google Fonts

## Requirements

- Node.js (or alternative package manager like bun, pnpm, yarn)
- A Base-compatible wallet

## How to Run Locally

Since you don't have npm installed, you'll need to install Node.js first:

1. Install Node.js from https://nodejs.org/
2. Then run:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at http://localhost:5173

## Project Structure

```
src/
├── components/
│   ├── TarotReading.jsx   # Main tarot reading interface
│   └── History.jsx        # Reading history display
├── wagmi.js              # Wagmi configuration for wallet connection
├── App.jsx               # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Base Mini App Specifications

This app follows Base miniapp specifications:
- Size: 424x695px (mobile-first responsive)
- Font: Lexend from Google Fonts
- Wallet connection: miniapp-wagmi-connector
- Metadata: Proper fc:miniapp tags in index.html
- Manifest: farcaster.json in public/.well-known/

## Disclaimer

This tarot reading app is for entertainment purposes only and should not be considered financial, investment, or professional advice. Always do your own research before making financial decisions.
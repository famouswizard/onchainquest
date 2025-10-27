# ⚔️ Onchain Quest

**Onchain Quest** is a Farcaster miniapp that gamifies onchain and social activity.
Complete daily quests, verify your actions onchain, and earn digital rewards — all directly from your Farcaster wallet.

## 🌍 Overview

Onchain Quest bridges **Web3 actions** (Base transactions, NFT mints, etc.) and **Farcaster activity** (casts, recasts, tags) into a unified quest experience.

Each quest has verifiable proof — either **onchain** (via BaseScan) or **social** (via Neynar API).

## ✨ Features

- 🔗 **WalletConnect integration**
- 🧩 **Daily Quests**
- ⚙️ **Verification** via Basescan + Neynar
- 🪙 **Future rewards** ($DEGEN)
- 💬 **Farcaster-ready UI**

## ⚙️ Setup

1. Install dependencies:
   ```bash
   npm install express cors node-fetch dotenv
   ```

2. Add your API key to `.env`:
   ```
   NEYNAR_API_KEY=YOUR_NEYNAR_API_KEY
   ```

3. Run:
   ```bash
   node app.js
   ```

Open [http://localhost:3000](http://localhost:3000) and connect your wallet.

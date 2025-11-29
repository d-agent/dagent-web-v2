# Dagent Web Platform (v2)

The decentralized layer for autonomous AI agents on Cardano.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Runtime**: Bun
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts

## Project Structure

The project follows a modular Next.js App Router structure:

```
dagent-web-v2/
├── src/                    # Source code directory
│   ├── app/                # App Router pages
│   │   ├── layout.tsx      # Root layout with Header/Footer
│   │   ├── page.tsx        # Landing page
│   │   ├── frameworks/     # Frameworks documentation page
│   │   ├── agents/         # Agents marketplace page
│   │   ├── api-keys/       # API Key management page
│   │   ├── wallet/         # Wallet & Staking page
│   │   ├── settings/       # User settings page
│   │   └── globals.css     # Global styles & Tailwind directives
│   ├── components/         # Reusable UI components
│   │   ├── Header.tsx      # Main navigation
│   │   ├── Footer.tsx      # Site footer
│   │   ├── AnimatedBeam.tsx # Hero section animation
│   │   └── WalletSelectionModal.tsx # Wallet connect modal
│   └── lib/                # Utilities and constants
│       ├── types.ts        # TypeScript interfaces
│       ├── constants.ts    # Mock data & configuration
│       └── utils.ts        # Helper functions (cn, etc.)
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── bun.lock                # Bun lockfile
```

## Getting Started

1.  **Install dependencies**:
    ```bash
    bun install
    ```

2.  **Run the development server**:
    ```bash
    bun dev
    ```

3.  **Build for production**:
    ```bash
    bun run build
    ```

## Features

- **Landing Page**: High-impact hero section with "Animated Beam" visualization.
- **Agents Marketplace**: Browse, filter, and deploy autonomous agents.
- **Developer Console**: Documentation and snippets for ADK and LangGraph frameworks.
- **Wallet Integration**: Mock Cardano wallet connection and staking interface.
- **API Management**: Create and manage API keys with usage analytics.
- **Responsive Design**: Fully optimized for mobile and desktop.

## Design System

- **Colors**:
    - Primary: `#00FF94` (Neon Green)
    - Secondary: `#9D00FF` (Purple)
    - Background: `#050505` (Deep Black)
    - Surface: `#0A0A0A` (Off-Black)
- **Typography**:
    - Headings: Inter
    - Code/Numbers: Roboto Mono
    - Accents: Pixel Font

## License

MIT

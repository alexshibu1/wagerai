# ⚡ WAGER

> **Transform distraction into profit. Make your attention tradable.**

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**[Live Demo](#) • [Documentation](#getting-started) • [Report Bug](https://github.com/alexshibu1/wagerai/issues)**

</div>

---

## 🎯 What is WAGER?

**WAGER** is a productivity protocol that gamifies focus through a simulated prediction market. It's built on a simple premise: **time is the only asset you can't hedge**. From the moment you're born, you're technically short on time. WAGER gives you the tools to manage that risk.

Instead of traditional todo lists where tasks fade into the background, WAGER forces you to put **skin in the game**. Set stakes, define deadlines, and track your "portfolio" of commitments. Win or lose, every bet teaches you something about your attention economy.

### 🔥 The Core Concept

```
Traditional To-Do List → No accountability → Procrastination
                    ↓
WAGER System → Financial stakes → Proof of Work
```

WAGER transforms your goals into tradable assets across three time horizons:
- **$TDAY** (Today): Short-term focus bets (4-24 hours)
- **$SHIP** (This Week): Sprint-level commitments (1-7 days)  
- **$YEAR** (Annual): Long-term position holdings (30-365 days)

---

## ✨ Key Features

### 🎲 Simulated Attention Economy
- **Virtual Stakes**: Track commitments with a simulated currency
- **Reputation Score**: Your reliability becomes quantifiable
- **Public Ledger**: Full transparency on wins and losses
- **Market Dashboard**: Real-time portfolio tracking with P&L

### 📊 Three Asset Classes

| Asset | Timeframe | Use Case |
|-------|-----------|----------|
| **TDAY** | 4-24 hours | Daily tasks, habits, quick wins |
| **SHIP** | 1-7 days | Sprint goals, project milestones |
| **YEAR** | 30-365 days | Long-term goals, major projects |

### 🎯 The Protocol Loop

1. **Inject Liquidity**: Set your stake amount and define the commitment
2. **Open Position**: Lock in tasks and deadlines
3. **Settlement**: Execute (win) or get liquidated (lose) with real P&L impact

### 📈 Analytics & Tracking
- **Portfolio View**: Real-time net worth and performance metrics
- **Win Rate Statistics**: Track success rates across different timeframes
- **Streak Tracking**: Build momentum with consecutive wins
- **Health Percentage**: Monitor active bet performance
- **Activity Heatmap**: Visualize your consistency over time

### 🎨 Beautiful UI/UX
- **Brutalist Typography**: Bold, high-contrast design language
- **Glass Morphism**: Layered depth with backdrop blur effects
- **3D Transforms**: Premium perspective animations
- **Dark Mode**: Optimized for long focus sessions
- **Responsive**: Works seamlessly on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Recharts](https://recharts.org/)** - Data visualization

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication (Email, OAuth)
  
### Additional Tools
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[date-fns](https://date-fns.org/)** - Date utilities
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)** - Celebration effects
- **[Tempo DevTools](https://tempo.formkit.com/)** - Design system tooling

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Supabase Account** (free tier works great)
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/alexshibu1/wagerai.git
cd wagerai
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Stripe for future payment features
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. **Set up Supabase**

Run the SQL migrations in your Supabase SQL Editor:

```bash
# Located in /supabase/migrations/
1. initial-setup.sql
2. wager-schema.sql
3. add-deep-work-tracking.sql
4. add-linked-bets.sql
```

Or use the Supabase CLI:
```bash
npx supabase db push
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage Examples

### Creating Your First Wager

1. **Sign up** or log in to your account
2. Navigate to **Markets** page
3. Click **"Place New Wager"**
4. Choose your asset class:
   - **TDAY**: For today's tasks
   - **SHIP**: For this week's goals
   - **YEAR**: For long-term commitments
5. Enter your commitment details:
   - Title: "Complete landing page redesign"
   - Stake: $100 (virtual currency)
   - Deadline: Set your target completion time
6. Click **"Open Position"** to activate

### Settling a Wager

When your deadline arrives:
- **Execute**: Mark as complete → Earn profit (20% ROI)
- **Liquidate**: Mark as failed → Lose your stake
- Your stats update automatically: win rate, streak, agency score

### Viewing Your Portfolio

Access your **Profile** to see:
- Total portfolio value
- Win rate percentage
- Current and longest streaks
- Activity heatmap
- P&L history chart

---

## 📁 Project Structure

```
wagerai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── forgot-password/
│   │   ├── markets/           # Markets dashboard
│   │   ├── profile/           # User profile & portfolio
│   │   ├── project/           # Individual wager details
│   │   ├── session/           # Focus session tracking
│   │   ├── actions.ts         # Server actions
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn/ui components
│   │   ├── markets-view.tsx  # Market dashboard
│   │   ├── portfolio-view.tsx # Portfolio interface
│   │   ├── profile-view.tsx   # Profile page
│   │   └── ...               # Other components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   │   ├── wager-utils.ts   # Wager calculations
│   │   └── seed-demo-data.ts # Demo data
│   ├── types/                # TypeScript definitions
│   │   ├── wager.ts         # Wager types
│   │   └── supabase.ts      # Database types
│   └── utils/               # Helper utilities
├── supabase/
│   ├── migrations/          # Database migrations
│   │   ├── initial-setup.sql
│   │   ├── wager-schema.sql
│   │   ├── add-deep-work-tracking.sql
│   │   └── add-linked-bets.sql
│   ├── client.ts           # Supabase client (browser)
│   ├── server.ts           # Supabase client (server)
│   └── middleware.ts       # Auth middleware
├── public/                  # Static assets
├── middleware.ts           # Next.js middleware
├── tailwind.config.ts     # Tailwind configuration
├── components.json        # Shadcn/ui config
├── tempo.config.json      # Tempo design system
└── package.json           # Dependencies
```

---

## 🗄️ Database Schema

### Tables

#### `wagers`
Stores all user commitments and their outcomes.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key to auth.users |
| `title` | text | Wager description |
| `asset_class` | enum | TDAY, SHIP, or YEAR |
| `stake_amount` | integer | Virtual currency amount |
| `status` | enum | OPEN, WON, or LOST |
| `deadline` | timestamptz | Commitment deadline |
| `created_at` | timestamptz | Creation timestamp |
| `completed_at` | timestamptz | Completion timestamp |
| `pnl_percentage` | integer | Profit/Loss percentage |
| `linked_year_wager_id` | uuid | Optional parent goal link |
| `health_percentage` | integer | Progress indicator |
| `last_activity_at` | timestamptz | Last update time |

#### `user_stats`
Tracks user performance metrics and reputation.

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | uuid | Primary key, foreign key to auth.users |
| `agency_score` | integer | Overall reputation (starts at 10,000) |
| `win_rate` | numeric | Percentage of successful wagers |
| `total_wagers` | integer | Total number of wagers |
| `total_wins` | integer | Number of wins |
| `total_losses` | integer | Number of losses |
| `current_streak` | integer | Current consecutive wins |
| `longest_streak` | integer | Best streak achieved |
| `updated_at` | timestamptz | Last update timestamp |

### Row Level Security (RLS)

All tables implement RLS policies:
- Users can only view/edit their own data
- Authentication required for all operations
- Automatic user stats initialization on signup

---

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Format code with Prettier
npm run format
```

### Code Style

This project uses:
- **TypeScript** for type safety
- **Prettier** for code formatting
- **ESLint** for linting (via Next.js)
- **Tailwind CSS** for styling conventions

### Component Architecture

- **Server Components**: Default for better performance
- **Client Components**: Used for interactivity (`'use client'`)
- **Server Actions**: For data mutations
- **Supabase RLS**: For data security

---

## 🎨 Design Philosophy

### Visual Language
- **Brutalist Typography**: High contrast, bold typefaces
- **Glass Morphism**: Layered depth with backdrop-blur
- **3D Perspective**: Premium transforms for visual interest
- **Atmospheric Lighting**: Blurred gradient blobs for depth
- **Grainy Textures**: Notebook aesthetic overlay

### Color Palette
```css
/* Primary Colors */
--emerald: Success states, wins, positive P&L
--rose: Failure states, losses, negative P&L
--violet: Primary actions, CTAs
--cyan: Active states, live indicators
--indigo: Secondary accents

/* Neutrals */
--zinc: Text and UI elements (400-900)
--white: High contrast text (with opacity)
--black: Dark backgrounds (#030014)
```

### Typography Scale
- **Hero**: text-9xl (massive headlines)
- **Section**: text-5xl to text-7xl
- **Body**: text-base to text-xl
- **Mono**: Used for data, stats, tickers

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

---

## 🐛 Known Issues & Roadmap

### Current Limitations
- Demo data for global markets (not real-time)
- Virtual currency only (no real money)
- Single-player focused (social features coming)

### Planned Features
- [ ] Real-time multiplayer wager matching
- [ ] Social profiles and friend challenges
- [ ] Wager templates for common goals
- [ ] AI-powered deadline suggestions
- [ ] Mobile native apps (iOS/Android)
- [ ] Browser extension for quick wager creation
- [ ] Integration with productivity tools (Notion, Todoist, etc.)
- [ ] Achievement system and badges
- [ ] Leaderboards and ranking system
- [ ] Export data and analytics

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Inspiration**: Prediction markets (Polymarket, Manifold)
- **Design**: Modern web3 aesthetics and trading platforms
- **Philosophy**: Nassim Taleb's "Skin in the Game"
- **Community**: The productivity and self-improvement space

---

## 📬 Contact & Links

- **Creator**: [@alex_s](https://github.com/alexshibu1)
- **Repository**: [github.com/alexshibu1/wagerai](https://github.com/alexshibu1/wagerai)
- **Issues**: [Report a bug](https://github.com/alexshibu1/wagerai/issues)
- **Discussions**: [Join the conversation](https://github.com/alexshibu1/wagerai/discussions)

---

<div align="center">

**Built with 💜 and a lot of focused attention**

*"Time is the only asset you cannot hedge. Wager gives you the tools to manage that risk."*

[⬆ Back to Top](#-wager)

</div>

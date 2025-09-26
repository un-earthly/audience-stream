# AudienceStream - AI Campaign Orchestrator

A Perplexity-style AI-powered Campaign Orchestrator built with Next.js, Tailwind CSS, and Redux Toolkit. Create multi-channel marketing campaigns with real-time JSON streaming and comprehensive analytics.

## Features

### Core Functionality
- **Perplexity-Style Chat Interface**: Interactive AI-powered campaign creation with streaming responses
- **Step-by-Step Execution**: AI breaks down tasks into logical steps with real-time progress
- **Multi-Channel Campaign Builder**: Support for Email, SMS, WhatsApp, and Ads
- **Real-Time JSON Streaming**: Watch campaign configurations generate in real-time
- **Data Source Integration**: Modal-based OAuth connections for Shopify, Analytics, Facebook Pixel
- **Audience Segmentation**: Pre-built segments with behavioral filters
- **Authentication System**: Complete sign-in flow with route protection

### Technical Features
- **Next.js 15** with App Router and route groups
- **Redux Toolkit** for global state management
- **Shadcn/ui** components with proper CLI installation
- **Tailwind CSS 4** for responsive design system
- **TypeScript** for type safety
- **Next-themes** for dark/light mode support

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Lucide React Icons
- **State Management**: Redux Toolkit, React-Redux
- **Charts**: Recharts
- **Development**: Biome (linting/formatting), Docker

## Installation

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/audience-stream.git
cd audience-stream

# Install dependencies
npm install

# Start development server
npm run dev
```

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run with Docker directly
docker build -t audience-stream .
docker run -p 3000:3000 audience-stream
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### Creating Campaigns

1. **Connect Data Sources**: Use the sidebar to connect mock data sources (Shopify, Analytics, Facebook Pixel)
2. **Select Channels**: Choose from Email, SMS, WhatsApp, and Ads
3. **Chat with AI**: Describe your campaign goals in natural language
4. **Watch Streaming**: See your campaign JSON generate in real-time
5. **Export & Use**: Download the JSON for automation pipelines

### Example Prompts

- "Create a flash sale campaign for cart abandoners"
- "Build a holiday campaign targeting high-value customers"
- "Set up a loyalty rewards campaign for repeat buyers"
- "Generate a welcome series for new subscribers"

### Campaign JSON Output

```json
{
  "campaign": {
    "name": "Weekend Flash Sale",
    "audience": "Cart abandoners in last 7 days",
    "channels": ["Email", "SMS", "WhatsApp"],
    "message": "Get 20% off before Sunday ends!",
    "timing": "2025-09-28T10:00:00Z",
    "meta": {
      "priority": "high",
      "experiment_id": "exp_123",
      "estimated_reach": 1200
    }
  }
}
```

## Analytics Dashboard

- **Real-time Metrics**: Open rates, click-through rates, conversions
- **Channel Performance**: Compare effectiveness across Email, SMS, WhatsApp, Ads
- **Performance Trends**: Weekly performance visualization
- **Campaign Tracking**: Monitor multiple campaigns simultaneously

## Architecture

### Project Structure

```
audience-stream/
├── app/                    # Next.js App Router
├── components/            # React components
│   ├── chat/             # Chat interface components
│   ├── sidebar/          # Sidebar components
│   ├── campaign/         # Campaign preview components
│   ├── analytics/        # Analytics dashboard
│   └── navigation/       # Navigation components
├── lib/                  # Utilities and Redux store
│   ├── features/         # Redux slices
│   ├── utils/           # Utility functions
│   └── store.ts         # Redux store configuration
└── public/              # Static assets
```

### State Management

- **Chat Slice**: Message history, streaming state
- **Connections Slice**: Data source connection status
- **Campaign Slice**: Selected channels, audience segments, campaigns

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/audience-stream)

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run Biome linter
npm run format       # Format code with Biome
npm run type-check   # TypeScript type checking
```

### Code Quality

- **Biome**: Unified linting and formatting
- **TypeScript**: Full type safety
- **ESLint**: Additional code quality rules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

---

**AudienceStream** - Orchestrate your marketing campaigns with AI precision.

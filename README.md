# AI Meeting Intelligence Platform

An intelligent meeting assistant that goes beyond basic transcription to provide actionable insights, sentiment analysis, and automated follow-ups.

## Features

- **Multi-platform Integration**: Zoom, Google Meet, Microsoft Teams
- **AI Analysis**: Sentiment detection, action item extraction, topic summarization
- **Smart Follow-ups**: Automated task assignments and deadline tracking
- **Conversation Intelligence**: Searchable archives with contextual insights
- **Team Analytics**: Meeting patterns, engagement metrics, productivity insights

## Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: NextAuth.js v5
- **Charts**: Recharts

### Backend
- **Framework**: NestJS 11
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Passport
- **AI Integration**: OpenAI API
- **Storage**: Supabase
- **Queue**: Bull (Redis)
- **Payments**: Stripe

## Project Structure

```
ai-meeting/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/# React components
│   │   ├── hooks/     # Custom hooks
│   │   ├── lib/       # Utilities
│   │   └── types/     # TypeScript types
│   └── public/        # Static assets
│
├── backend/           # NestJS backend API
│   ├── src/
│   │   ├── modules/   # Feature modules
│   │   │   ├── meetings/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── ai/
│   │   │   └── payments/
│   │   └── common/    # Shared utilities
│   └── test/          # E2E tests
│
└── package.json       # Root workspace configuration
```

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- PostgreSQL database
- Redis (for job queues)
- OpenAI API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-meeting
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Environment Setup**

Create `.env.local` in the `frontend` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=your-auth-secret-here
DATABASE_URL=your-database-url
OPENAI_API_KEY=your-openai-key
```

Create `.env` in the `backend` folder:
```env
PORT=3001
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
REDIS_URL=your-redis-url
STRIPE_SECRET_KEY=your-stripe-secret-key
```

4. **Database Setup**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

5. **Start Development Servers**
```bash
# From root directory
npm run dev

# Or start individually
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Available Scripts

### Root
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run build` - Build both frontend and backend
- `npm run install:all` - Install all dependencies

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start with debugger
- `npm run start:prod` - Start production server
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend
The backend can be deployed to:
- **Railway**: `railway up`
- **Render**: Connect GitHub repo
- **AWS/GCP**: Use Docker container

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:3001/api/docs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@aimeeting.com or join our Slack channel.

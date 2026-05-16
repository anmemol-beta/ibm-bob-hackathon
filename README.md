# AsyncPair

**Async pair-programming tool for seamless AI collaboration**

Built for the **IBM Bob Hackathon** — *"Your repo. Your rules. AI as your dev partner."*

## Overview

AsyncPair is a web application that enables asynchronous pair programming with AI. It allows developers to define coding scenarios, hand them off to an AI standin for implementation, and then review and approve the generated code changes in a collaborative pairing session.

## Features

- **📝 Author**: Define coding scenarios with detailed requirements and constraints
- **🤝 Handoff**: Assign scenarios to AI standin for async processing
- **👥 Pairing**: Review AI-generated code changes with side-by-side diff view
- **🔄 Workflow**: Seamless async collaboration between human and AI developers

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Future**: Prisma (database), NextAuth (authentication)

## Project Structure

```
asyncpair/
├── app/
│   ├── author/          # Create coding scenarios
│   ├── handoff/         # Assign to AI standin
│   ├── pairing/         # Review code changes
│   ├── api/
│   │   ├── scenarios/   # Scenario CRUD operations
│   │   ├── standin/     # AI processing endpoints
│   │   └── repo/        # Repository operations
│   ├── layout.tsx       # Root layout with navigation
│   ├── page.tsx         # Landing page
│   └── globals.css      # Global styles
├── lib/
│   ├── types.ts         # TypeScript interfaces
│   ├── utils.ts         # Utility functions
│   └── constants.ts     # App constants
├── public/              # Static assets
└── [config files]       # Next.js, TypeScript, Tailwind configs
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd asyncpair
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Workflow

1. **Author** creates a coding scenario with specific requirements
2. **Handoff** assigns the scenario to an AI standin for async processing
3. AI standin works independently to generate code changes
4. **Pairing** session allows you to review, approve, or reject changes
5. Approved changes are applied to the repository

## API Routes

### `/api/scenarios`
- `GET`: List all scenarios
- `POST`: Create new scenario
- `PUT`: Update scenario
- `DELETE`: Remove scenario

### `/api/standin`
- `POST`: Trigger AI standin to process scenario
- `GET`: Check standin processing status

### `/api/repo`
- `GET`: Fetch repository state and changes
- `POST`: Apply approved changes

## Development Status

🚧 **Current Status**: Scaffolded structure with empty API route handlers

### Next Steps

- [ ] Implement database layer with Prisma
- [ ] Add authentication with NextAuth
- [ ] Connect to AI service (IBM watsonx, OpenAI, etc.)
- [ ] Implement real-time status updates
- [ ] Add diff viewer component
- [ ] Create comprehensive test suite
- [ ] Add error handling and validation
- [ ] Implement Git integration

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://..."

# AI Service
AI_API_KEY="your-api-key"
AI_API_URL="https://api.example.com"

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Contributing

This project was built for the IBM Bob Hackathon. Contributions and suggestions are welcome!

## License

MIT

## Hackathon Details

- **Event**: IBM Bob Hackathon
- **Dates**: May 15–17, 2026 (48-hour build)
- **Submission deadline**: May 17, 2026, 11:00 AM ET
- **Prize pool**: $10,000

---

Made with ❤️ using IBM Bob as an AI development partner

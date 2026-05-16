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
- **⚡ CLI Tool**: Automatically capture handoffs from git commits

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
│   │   ├── handoff/     # Handoff CRUD operations
│   │   └── repo/        # Repository operations
│   ├── layout.tsx       # Root layout with navigation
│   ├── page.tsx         # Landing page
│   └── globals.css      # Global styles
├── cli/
│   ├── index.ts         # CLI entry point
│   └── commands/
│       ├── init.ts      # Install git hook
│       └── capture.ts   # Capture handoff from commit
├── lib/
│   ├── types.ts         # TypeScript interfaces
│   ├── utils.ts         # Utility functions
│   ├── constants.ts     # App constants
│   ├── store.ts         # Handoff persistence layer
│   ├── git.ts           # Git operations
│   └── llm.ts           # LLM integration
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

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### CLI Setup

The AsyncPair CLI allows you to automatically capture handoffs from git commits.

1. Build the CLI:
```bash
npm run build:cli
```

2. Link the CLI globally (optional):
```bash
npm link
```

3. Initialize AsyncPair in your git repository:
```bash
asyncpair init
```

This installs a post-commit hook that automatically captures handoffs after each commit.

### CLI Commands

#### `asyncpair init`

Installs a git post-commit hook in the current repository. The hook automatically runs `asyncpair capture` after each commit to create handoff notes.

```bash
asyncpair init
```

**What it does:**
- Checks if the current directory is a git repository
- Creates a post-commit hook in `.git/hooks/`
- Backs up any existing post-commit hook
- Configures automatic handoff capture

#### `asyncpair capture`

Captures a handoff from the most recent git commit. Can be run manually or automatically via the git hook.

```bash
asyncpair capture
```

**Options:**
- `--skip-questions`: Skip interactive questions (used by git hook)

**Interactive mode** (manual run):
1. Asks: "Anything the next developer should know about this commit?"
2. Asks: "What should be worked on next?"
3. Generates handoff scenarios using AI
4. Saves the handoff to the shared store

**Automatic mode** (via git hook):
- Runs silently in the background
- Never blocks or fails the commit
- Uses AI to generate handoff scenarios from commit data

### Data Storage

Handoffs are stored in a JSON file at `~/.asyncpair/handoffs.json` by default. You can override this location with the `ASYNCPAIR_DATA` environment variable:

```bash
export ASYNCPAIR_DATA=/path/to/custom/location
```

The web app and CLI share the same data store, so handoffs captured via CLI are immediately visible in the web interface.

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

### `/api/handoff`
- `GET`: List all handoffs or get specific handoff by ID
- `POST`: Create new handoff
- `PUT`: Update handoff (e.g., accept it)
- `DELETE`: Remove handoff

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

Create a `.env.local` file in the root directory:

```env
# IBM watsonx.ai (optional - app works without credentials in mock mode)
WATSONX_API_KEY="your-api-key"
WATSONX_PROJECT_ID="your-project-id"
WATSONX_URL="https://us-south.ml.cloud.ibm.com"

# Data storage location (optional - defaults to ~/.asyncpair)
ASYNCPAIR_DATA="/path/to/custom/location"

# Authentication (future)
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

**Note**: The app gracefully degrades to mock mode if watsonx.ai credentials are not configured, allowing you to test the full workflow without API access.

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

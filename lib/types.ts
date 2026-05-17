export type ScenarioStatus = 'draft' | 'pending' | 'processing' | 'ready' | 'completed';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  constraints?: string[];
  status: ScenarioStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface HandoffScenario {
  id: string;
  situation: string;
  suggestedApproach: string;
}

export interface GenerateScenariosRequest {
  gitActivity: string;
  developerNotes: string;
  repoPath?: string;
}

export interface GenerateScenariosResponse {
  scenarios: HandoffScenario[];
}

export type CodeChangeStatus = 'pending' | 'approved' | 'rejected';

export interface CodeChange {
  file: string;
  diff: string;
  status: CodeChangeStatus;
  lineNumbers?: {
    start: number;
    end: number;
  };
}

export interface StandinResult {
  scenarioId: string;
  changes: CodeChange[];
  summary: string;
  completedAt: Date;
}

export interface Repository {
  id: string;
  name: string;
  url: string;
  branch: string;
}

export interface Handoff {
  id: string;
  author: string;
  timestamp: Date;
  gitActivitySummary: string;
  scenarios: HandoffScenario[];
  metadata: {
    repoPath?: string;
    branch?: string;
    commitCount?: number;
    developerNotes: string;
    referenceRepos?: string[];
  };
  status: 'pending' | 'accepted' | 'completed';
  acceptedBy?: string;
  acceptedAt?: Date;
}

export interface CreateHandoffRequest {
  author: string;
  gitActivitySummary: string;
  scenarios: HandoffScenario[];
  metadata: {
    repoPath?: string;
    branch?: string;
    commitCount?: number;
    developerNotes: string;
    referenceRepos?: string[];
  };
}

export interface HandoffListResponse {
  handoffs: Handoff[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface StandinChatRequest {
  question: string;
  handoffId?: string;
  repoPath?: string;
}

export interface StandinChatResponse {
  answer: string;
  messageId: string;
  timestamp: Date;
}

// Made with Bob

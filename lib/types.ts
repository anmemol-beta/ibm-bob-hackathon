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

// Made with Bob

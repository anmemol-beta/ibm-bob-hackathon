export const APP_NAME = 'AsyncPair';
export const APP_DESCRIPTION = 'Async pair-programming tool for seamless AI collaboration';

export const SCENARIO_STATUSES = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready',
  COMPLETED: 'completed',
} as const;

export const CODE_CHANGE_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const ROUTES = {
  HOME: '/',
  AUTHOR: '/author',
  HANDOFF: '/handoff',
  PAIRING: '/pairing',
  SETTINGS: '/settings',
} as const;

export const API_ROUTES = {
  SCENARIOS: '/api/scenarios',
  STANDIN: '/api/standin',
  REPO: '/api/repo',
  HANDOFF: '/api/handoff',
} as const;

export const HANDOFF_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
} as const;

// LocalStorage keys
export const STORAGE_KEYS = {
  DEFAULT_REFERENCE_REPOS: 'asyncpair:defaultReferenceRepos',
} as const;

// Default mock repository identifiers
export const DEFAULT_MOCK_REPOS = [
  'sarah-chen-auth-history',
  'marcus-rodriguez-realtime-history',
] as const;

// Made with Bob

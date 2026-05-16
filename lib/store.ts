import { Handoff } from './types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Persistence layer for handoffs backed by a JSON file
 * Falls back to in-memory storage if filesystem is read-only
 */

// Determine the data file path.
// Default to a repo-local .asyncpair/ directory so handoffs travel with the
// repository via git (push/pull), not a per-machine home directory.
const DATA_DIR = process.env.ASYNCPAIR_DATA || path.join(process.cwd(), '.asyncpair');
const DATA_FILE = path.join(DATA_DIR, 'handoffs.json');
const SEED_FILE = path.join(process.cwd(), 'data', 'seed.json');

// In-memory fallback storage
let inMemoryHandoffs: Handoff[] = [];
let useInMemory = false;

/**
 * Ensure the data directory exists
 */
function ensureDataDir(): void {
  if (useInMemory) return;
  
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (error) {
    console.warn('Failed to create data directory, falling back to in-memory storage:', error);
    useInMemory = true;
  }
}

/**
 * Read handoffs from the JSON file
 */
function readHandoffsFromFile(): Handoff[] {
  if (useInMemory) {
    return inMemoryHandoffs;
  }

  try {
    ensureDataDir();
    
    if (!fs.existsSync(DATA_FILE)) {
      // Try to seed from data/seed.json if it exists
      if (fs.existsSync(SEED_FILE)) {
        const seedData = fs.readFileSync(SEED_FILE, 'utf-8');
        const seedHandoffs = JSON.parse(seedData);
        
        // Write seed data to the data file
        fs.writeFileSync(DATA_FILE, JSON.stringify(seedHandoffs, null, 2), 'utf-8');
        return seedHandoffs;
      }
      
      // No seed file, return empty array
      return [];
    }
    
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Failed to read handoffs from file, falling back to in-memory storage:', error);
    useInMemory = true;
    return inMemoryHandoffs;
  }
}

/**
 * Write handoffs to the JSON file
 */
function writeHandoffsToFile(handoffs: Handoff[]): void {
  if (useInMemory) {
    inMemoryHandoffs = handoffs;
    return;
  }

  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(handoffs, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Failed to write handoffs to file, falling back to in-memory storage:', error);
    useInMemory = true;
    inMemoryHandoffs = handoffs;
  }
}

/**
 * Get all handoffs
 */
export function getHandoffs(): Handoff[] {
  return readHandoffsFromFile();
}

/**
 * Get a specific handoff by ID
 */
export function getHandoff(id: string): Handoff | undefined {
  const handoffs = readHandoffsFromFile();
  return handoffs.find(h => h.id === id);
}

/**
 * Add a new handoff
 */
export function addHandoff(handoff: Handoff): Handoff {
  const handoffs = readHandoffsFromFile();
  handoffs.push(handoff);
  writeHandoffsToFile(handoffs);
  return handoff;
}

/**
 * Update an existing handoff
 */
export function updateHandoff(id: string, updates: Partial<Handoff>): Handoff | undefined {
  const handoffs = readHandoffsFromFile();
  const index = handoffs.findIndex(h => h.id === id);
  
  if (index === -1) {
    return undefined;
  }
  
  handoffs[index] = { ...handoffs[index], ...updates };
  writeHandoffsToFile(handoffs);
  return handoffs[index];
}

/**
 * Delete a handoff
 */
export function deleteHandoff(id: string): boolean {
  const handoffs = readHandoffsFromFile();
  const index = handoffs.findIndex(h => h.id === id);
  
  if (index === -1) {
    return false;
  }
  
  handoffs.splice(index, 1);
  writeHandoffsToFile(handoffs);
  return true;
}

// Made with Bob
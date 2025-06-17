import Fuse from 'fuse.js'
import type { Commitment, Event, Note, Habit, Task } from './types'

export interface SearchResult {
  commitmentId: string
  item: Event | Note | Habit | Task | Commitment
  itemType: 'event' | 'note' | 'habit' | 'task' | 'commitment'
  score: number
}

function searchCommitmentNotes(
  commitment: Commitment,
  query: string,
): SearchResult[] {
  if (!commitment.notes || commitment.notes.length === 0) {
    return []
  }

  const fuse = new Fuse(commitment.notes, {
    keys: ['content'],
    includeScore: true,
    threshold: 0.4,
  })

  return fuse.search(query).map((result) => ({
    commitmentId: commitment.id,
    item: result.item,
    itemType: 'note',
    score: result.score || 1,
  }))
}
function searchCommitmentHabits(
  commitment: Commitment,
  query: string,
): SearchResult[] {
  if (!commitment.subItems?.habits || commitment.subItems.habits.length === 0) {
    return []
  }

  const fuse = new Fuse(commitment.subItems.habits, {
    keys: ['title'],
    includeScore: true,
    threshold: 0.4,
  })

  return fuse.search(query).map((result) => ({
    commitmentId: commitment.id,
    item: result.item,
    itemType: 'habit',
    score: result.score || 1,
  }))
}
function searchCommitmentTasks(
  commitment: Commitment,
  query: string,
): SearchResult[] {
  if (!commitment.subItems?.tasks || commitment.subItems.tasks.length === 0) {
    return []
  }

  const fuse = new Fuse(commitment.subItems.tasks, {
    keys: ['title'],
    includeScore: true,
    threshold: 0.4,
  })

  return fuse.search(query).map((result) => ({
    commitmentId: commitment.id,
    item: result.item,
    itemType: 'task',
    score: result.score || 1,
  }))
}
function searchCommitmentEvents(
  commitment: Commitment,
  query: string,
): SearchResult[] {
  if (!commitment.events || commitment.events.length === 0) {
    return []
  }

  const fuse = new Fuse(commitment.events, {
    keys: ['title', 'description', 'location'],
    includeScore: true,
    threshold: 0.4,
  })

  return fuse.search(query).map((result) => ({
    commitmentId: commitment.id,
    item: result.item,
    itemType: 'event',
    score: result.score || 1,
  }))
}

export function searchCommitment(
  commitment: Commitment,
  query: string,
): SearchResult[] {
  const results = [
    ...searchCommitmentNotes(commitment, query),
    ...searchCommitmentHabits(commitment, query),
    ...searchCommitmentTasks(commitment, query),
    ...searchCommitmentEvents(commitment, query),
  ]
  // Also check if the commitment itself matches the query
  const commitmentFuse = new Fuse([commitment], {
    keys: ['title', 'description'],
    includeScore: true,
    threshold: 0.4,
  })

  const commitmentMatches = commitmentFuse.search(query)
  if (commitmentMatches.length > 0) {
    results.push({
      commitmentId: commitment.id,
      item: commitment,
      itemType: 'commitment',
      score: commitmentMatches[0].score || 0.5,
    })
  }
  return results
}

export function searchCommitments(
  commitments: Commitment[],
  query: string,
): SearchResult[] {
  const results: SearchResult[] = []

  for (const commitment of commitments) {
    const commitmentResults = searchCommitment(commitment, query)
    results.push(...commitmentResults)
  }

  // Sort results by score in descending order
  results.sort((a, b) => b.score - a.score)

  return results
}

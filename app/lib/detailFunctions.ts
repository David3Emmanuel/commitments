import type { Commitment } from './types'

export const getNextReviewDate = (commitment: Commitment): Date => {
  if (!commitment.lastReviewedAt) {
    return new Date() // If never reviewed, it's due now
  }

  const lastReview = new Date(commitment.lastReviewedAt)
  const nextReview = new Date(lastReview)

  if (
    commitment.reviewFrequency.type === 'interval' &&
    commitment.reviewFrequency.intervalDays
  ) {
    nextReview.setDate(
      nextReview.getDate() + commitment.reviewFrequency.intervalDays,
    )
  } else {
    // For custom schedules, we'd need proper cron parsing
    // For now just default to weekly
    nextReview.setDate(nextReview.getDate() + 7)
  }

  return nextReview
}

export const isReviewDue = (commitment: Commitment): boolean => {
  const nextReviewDate = getNextReviewDate(commitment)
  return nextReviewDate <= new Date()
}

export const getReviewFrequencyText = (commitment: Commitment): string => {
  if (
    commitment.reviewFrequency.type === 'interval' &&
    commitment.reviewFrequency.intervalDays
  ) {
    const days = commitment.reviewFrequency.intervalDays
    if (days === 1) return 'Daily'
    if (days === 7) return 'Weekly'
    if (days === 14) return 'Every two weeks'
    if (days === 30) return 'Monthly'
    if (days === 90) return 'Quarterly'
    return `Every ${days} days`
  }
  return 'Custom schedule'
}

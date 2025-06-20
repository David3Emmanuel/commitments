import { useMemo } from 'react'
import type { Commitment } from '~/lib/types'

export function useReviewSchedule(commitment: Commitment) {
  // Calculate next review date based on frequency
  const nextReviewDate = useMemo(() => {
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
  }, [commitment.lastReviewedAt, commitment.reviewFrequency])

  // Check if a commitment review is overdue
  const isReviewDue = useMemo(() => {
    return nextReviewDate <= new Date()
  }, [nextReviewDate])

  // Get human-readable frequency text
  const reviewFrequencyText = useMemo(() => {
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
  }, [commitment.reviewFrequency])

  // Format a date nicely
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Never'
    return date.toLocaleDateString()
  }

  return {
    nextReviewDate,
    isReviewDue,
    reviewFrequencyText,
    formatDate,
    lastReviewedAt: commitment.lastReviewedAt,
  }
}

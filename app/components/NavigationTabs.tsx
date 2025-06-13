import React from 'react'
import type { Commitment } from '~/lib/types'
import { Tabs } from '~/components/ui'

type TabType = 'details' | 'tasks' | 'habits' | 'notes'

interface NavigationTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  commitment: Commitment
}

export default function NavigationTabs({
  activeTab,
  onTabChange,
  commitment,
}: NavigationTabsProps) {
  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'tasks', label: 'Tasks', count: commitment.subItems.tasks.length },
    { id: 'habits', label: 'Habits', count: commitment.subItems.habits.length },
    { id: 'notes', label: 'Notes', count: commitment.notes.length },
  ]

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => onTabChange(tabId as TabType)}
    />
  )
}

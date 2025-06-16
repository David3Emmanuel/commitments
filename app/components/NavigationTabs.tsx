import React from 'react'
import type { Commitment } from '~/lib/types'
import { Tabs } from '~/components/ui'
import { type TabType } from '~/hooks/useTabNavigation'

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
    { id: 'events', label: 'Events', count: commitment.events.length },
  ]

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => onTabChange(tabId as TabType)}
    />
  )
}

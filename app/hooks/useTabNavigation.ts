import { useState } from 'react'

export type TabType = 'details' | 'tasks' | 'habits' | 'notes' | 'events'

export function useTabNavigation(initialTab: TabType = 'details') {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  return {
    activeTab,
    handleTabChange,
  }
}

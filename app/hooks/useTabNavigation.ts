import { useState } from 'react'

type TabType = 'details' | 'tasks' | 'habits' | 'notes'

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

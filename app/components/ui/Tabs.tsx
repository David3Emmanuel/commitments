import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router'

interface TabItem {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
  syncWithUrl?: boolean
  paramName?: string
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  syncWithUrl = false,
  paramName = 'tab',
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const handleTabChange = (tabId: string) => {
    if (tabId !== activeTab && tabs.some((tab) => tab.id === tabId)) {
      onTabChange(tabId)
      if (syncWithUrl) {
        setSearchParams(
          (params: URLSearchParams) => {
            const newParams = new URLSearchParams(params)
            newParams.set(paramName, tabId)
            return newParams
          },
          { replace: true },
        )
      }
    }
  }

  // Effect to check URL when component mounts
  useEffect(() => {
    if (!syncWithUrl) return

    const tabParam = searchParams.get(paramName)
    if (tabParam) handleTabChange(tabParam)
  }, [syncWithUrl, searchParams])

  return (
    <div
      className={`flex border-b border-gray-200 dark:border-gray-700 ${className} overflow-x-auto`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`px-6 py-3 focus:outline-none ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && ` (${tab.count})`}
        </button>
      ))}
    </div>
  )
}

export default Tabs

import type { Commitment } from '~/lib/types'
import { Tabs } from '~/components/ui'
import { type TabType } from '~/lib/hooks/useTabNavigation'

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
  const remainingTasks = commitment.subItems.tasks.filter(
    (task) => !task.completed,
  )

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'tasks', label: 'Tasks', count: remainingTasks.length },
    { id: 'habits', label: 'Habits', count: commitment.subItems.habits.length },
    { id: 'notes', label: 'Notes', count: commitment.notes.length },
    { id: 'events', label: 'Events', count: commitment.events.length },
  ]

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => onTabChange(tabId as TabType)}
      syncWithUrl
    />
  )
}

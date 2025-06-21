import { useState } from 'react'
import { useCommitments } from '~/lib/contexts/CommitmentContext'
import { useSettings } from '~/lib/contexts/SettingsContext'
import { useModal } from '~/components/modal-ui'

/**
 * Hook for importing and exporting application data (commitments and settings)
 *
 * @returns Functions and state for import/export operations
 */
export function useDataImportExport() {
  const { loadCommitments } = useCommitments()
  const { updateSettings } = useSettings()
  const modal = useModal()
  const [importing, setImporting] = useState(false)

  /**
   * Export all application data to a JSON file
   */
  const exportData = () => {
    try {
      // Create a data object with both settings and commitments
      const exportData = {
        settings: JSON.parse(localStorage.getItem('settings') || '{}'),
        commitments: JSON.parse(localStorage.getItem('commitments') || '[]'),
        exportedAt: new Date().toISOString(),
      }

      // Convert to a JSON string
      const dataStr = JSON.stringify(exportData, null, 2)

      // Create a download link
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)

      // Create a temporary anchor element for download
      const downloadLink = document.createElement('a')
      const dateStr = new Date().toISOString().split('T')[0]
      downloadLink.download = `commitments-backup-${dateStr}.json`
      downloadLink.href = url
      document.body.appendChild(downloadLink)
      downloadLink.click()

      // Clean up
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  /**
   * Import data from a JSON file
   * Prompts user whether to merge or replace existing data
   */
  const importData = async () => {
    setImporting(true)

    try {
      // Create a file input element
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'application/json'

      // Listen for file selection
      fileInput.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) {
          setImporting(false)
          return
        }

        const reader = new FileReader()
        reader.onload = async (event) => {
          try {
            const importedData = JSON.parse(event.target?.result as string)

            if (!importedData.settings || !importedData.commitments) {
              throw new Error('Invalid import file format')
            }

            // Ask for confirmation on how to import
            const shouldMerge = await modal.showConfirmModal(
              'Import Data',
              'Would you like to merge this data with your existing data? Choose "Yes" to merge, or "No" to completely replace your existing data.',
              'Merge',
              'Replace',
            )

            // Handle settings import
            if (importedData.settings) {
              localStorage.setItem(
                'settings',
                JSON.stringify(importedData.settings),
              )
            }

            // Handle commitments import
            if (importedData.commitments) {
              if (shouldMerge) {
                // Merge with existing commitments
                const currentCommitments = JSON.parse(
                  localStorage.getItem('commitments') || '[]',
                )
                const importedCommitments = importedData.commitments

                // Create a map of existing commitments by ID for quick lookup
                const commitmentMap = new Map(
                  currentCommitments.map((commitment: any) => [
                    commitment.id,
                    commitment,
                  ]),
                )

                // Add or update commitments
                for (const newCommitment of importedCommitments) {
                  commitmentMap.set(newCommitment.id, newCommitment)
                }

                // Save the merged commitments
                const mergedCommitments = Array.from(commitmentMap.values())
                localStorage.setItem(
                  'commitments',
                  JSON.stringify(mergedCommitments),
                )
              } else {
                // Complete replacement
                localStorage.setItem(
                  'commitments',
                  JSON.stringify(importedData.commitments),
                )
              }
            }

            // Reload data from localStorage
            loadCommitments()
            updateSettings(importedData.settings)

            // Show success message
            await modal.showConfirmModal(
              'Import Complete',
              'Your data has been successfully imported.',
              'OK',
              '',
            )
          } catch (error) {
            console.error('Failed to import data:', error)
            await modal.showConfirmModal(
              'Import Failed',
              'The selected file contains invalid data. Please try a different file.',
              'OK',
              '',
            )
          } finally {
            setImporting(false)
          }
        }

        reader.readAsText(file)
      }

      // Trigger the file selection dialog
      fileInput.click()
    } catch (error) {
      console.error('Failed to import data:', error)
      setImporting(false)
    }
  }

  return {
    exportData,
    importData,
    importing,
  }
}

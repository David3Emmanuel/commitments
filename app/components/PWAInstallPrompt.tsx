import { useEffect, useState } from 'react'
import Button from './ui/Button'

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default prompt
      e.preventDefault()
      // Store the event for later use
      setDeferredPrompt(e)
      // Show our custom install button
      setIsInstallable(true)
    }

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      // Clear the deferredPrompt
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice

    // If the user accepted the installation, hide the install button
    if (choiceResult.outcome === 'accepted') {
      setIsInstallable(false)
    }

    // Clear the deferredPrompt regardless of user's choice
    setDeferredPrompt(null)
  }

  if (!isInstallable || isInstalled) {
    return null
  }

  return (
    <div className='fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col sm:flex-row items-center justify-between gap-4'>
      <div className='flex-1'>
        <h3 className='font-semibold text-lg'>Install Commitments App</h3>
        <p className='text-gray-600'>
          Install this app on your device for quick access, even when offline.
        </p>
      </div>
      <div className='flex gap-3'>
        <Button variant='outline' onClick={() => setIsInstallable(false)}>
          Not now
        </Button>
        <Button onClick={handleInstallClick}>Install</Button>
      </div>
    </div>
  )
}

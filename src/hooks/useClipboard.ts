import { useEffect, useState } from 'react'

export default function useClipboard() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  useEffect(() => {
    if (status === 'idle') return
    const timer = setTimeout(() => setStatus('idle'), 3000)
    return () => clearTimeout(timer)
  }, [status])

  async function copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }
  return { status, copy }
}

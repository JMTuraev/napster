// src/renderer/pages/App.jsx

import { useEffect, useState } from 'react'
import LockScreen from './pages/LockScreen'
import UserPage from './pages/User'
import GamesPage from './pages/GamesPage'

const pages = {
  user: <UserPage />,
  games: <GamesPage />
}

export default function App() {
  const [locked, setLocked] = useState(true)
  const [page, setPage] = useState('user')
  const [loading, setLoading] = useState(true)

  // --- SOCKET SIGNALS ---
  useEffect(() => {
    const handleLock = (mac) => {
      setLocked(true)
      console.log('[USER] LOCK signal qabul qilindi!', mac)
    }
    const handleUnlock = (mac) => {
      setLocked(false)
      console.log('[USER] UNLOCK signal qabul qilindi!', mac)
    }
    window.api.socket.on('lock', handleLock)
    window.api.socket.on('unlock', handleUnlock)
    return () => {
      window.api.socket.off('lock', handleLock)
      window.api.socket.off('unlock', handleUnlock)
    }
  }, [])

  // --- POLLING: 1 minutda bir marta status sync ---
  useEffect(() => {
    let mounted = true
    let interval

    async function checkStatus() {
      try {
        const timers = await window.api.invoke('get-active-timers')
        const hasRunning = Array.isArray(timers) && timers.some((t) => t.status === 'running')
        if (mounted) setLocked(!hasRunning)
      } catch (e) {
        console.error('Pollingda xatolik:', e)
      }
      setLoading(false)
    }

    checkStatus() // ilk yuklanishda

    interval = setInterval(checkStatus, 60 * 1000) // 1 daqiqa

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  // --- LOADING ---
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}
      >
        <span>Loading...</span>
      </div>
    )
  }

  // --- LOCKSCREEN va UI switching ---
  if (locked) {
    return <LockScreen />
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <button onClick={() => setPage('user')}>User</button>
        <button onClick={() => setPage('games')}>Games</button>
      </div>
      {pages[page]}
    </div>
  )
}

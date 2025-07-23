// src/App.js
import React, { useEffect, useState } from 'react'
import socket from './socket' // admin serverga ulanish uchun

export default function App() {
  const [mac, setMac] = useState(null)
  const [locked, setLocked] = useState(true)

  useEffect(() => {
    // MAC addressni olish
    window.api.getMac().then((mac) => setMac(mac))
  }, [])

  useEffect(() => {
    if (!mac) return

    // Lock signal — faqat shu user uchun
    const onLock = (msgMac) => {
      if (msgMac === mac) setLocked(true)
    }

    // Unlock signal — faqat shu user uchun
    const onUnlock = (msgMac) => {
      if (msgMac === mac) {
        setLocked(false)
        // UNLOCK bo‘lsa ilovani butunlay yopish (Electron)
        if (window.api?.appQuit) {
          window.api.appQuit() // Preload orqali app.quit()
        } else if (window?.close) {
          window.close() // Oddiy browser fallback
        }
      }
    }

    socket.on('lock', onLock)
    socket.on('unlock', onUnlock)
    return () => {
      socket.off('lock', onLock)
      socket.off('unlock', onUnlock)
    }
  }, [mac])

  return (
    <div>
      <h2>MAC: {mac || '...'}</h2>
      <h2 style={{ color: locked ? 'red' : 'green' }}>{locked ? 'LOCKED' : 'UNLOCKED'}</h2>
      {/* Qolgan UI... */}
    </div>
  )
}

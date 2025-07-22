// src/App.js (Yoki asosiy komponent)
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
    // Faqat o'z MAC uchun lock/unlock eshitish
    const onLock = (msgMac) => {
      if (msgMac === mac) setLocked(true)
    }
    const onUnlock = (msgMac) => {
      if (msgMac === mac) setLocked(false)
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

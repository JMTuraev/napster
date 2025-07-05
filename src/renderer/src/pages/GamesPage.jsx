import React, { useEffect, useState, useRef } from 'react'

// FAQAT SHU YERGA ADMIN KOMPYUTER STATIC IP’sini YOZING:
const ADMIN_API_HOST = '172.20.10.2' // Misol uchun: 192.168.1.100 yoki 172.20.10.2
const ADMIN_API_PORT = 3333

export default function GamesPage() {
  const [games, setGames] = useState([])
  const [tabs, setTabs] = useState([])
  const [activeTabId, setActiveTabId] = useState(1)
  const lastGamesRaw = useRef([]) // eng so‘nggi games massivini saqlash uchun

  // O‘yinlarni to‘g‘rilab (filtirlab) ko‘rsatish
  const processGames = async (gamesList) => {
    lastGamesRaw.current = gamesList // yangi kelgan barcha games saqlanadi

    // Faqat aktiv tab uchun
    const tabGames = gamesList.filter((game) => game.tabId === activeTabId)
    const filtered = []

    for (const game of tabGames) {
      try {
        const exists = await window.api.invoke('check-path-exists', game.path)
        if (exists) {
          const iconPath = `http://${ADMIN_API_HOST}:${ADMIN_API_PORT}${game.icon}`
          filtered.push({ ...game, iconPath })
        }
      } catch (err) {
        // ignore
      }
    }
    setGames(filtered)
  }

  // Tab almashtirilganda va yangi games kelganda, faqat shu tab uchun filter!
  useEffect(() => {
    // Faqat eng so‘nggi kelgan gamesdan filter qilib ko‘rsat
    if (lastGamesRaw.current.length) {
      processGames(lastGamesRaw.current)
    }
    // eslint-disable-next-line
  }, [activeTabId])

  useEffect(() => {
    window.api.socket.emit('get-tabs')
    window.api.socket.emit('get-games') // barcha o‘yinlar

    window.api.socket.on('games', processGames)
    window.api.socket.on('tabs', setTabs)

    return () => {
      window.api.socket.off('games', processGames)
      window.api.socket.off('tabs', setTabs)
    }
    // eslint-disable-next-line
  }, [])

  const handleDoubleClick = (path) => {
    window.api.invoke('run-game', path).catch((err) => {
      console.error('❌ O‘yin ishga tushmadi:', err)
    })
  }

  const handleTabClick = (tabId) => {
    setActiveTabId(tabId)
  }

  return (
    <div style={{ padding: '24px 0 0 0', color: 'white', maxWidth: 1000, margin: '0 auto' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{
              background: activeTabId === tab.id ? '#4a90e2' : '#222345',
              color: activeTabId === tab.id ? '#fff' : '#cdd2e3',
              border: 'none',
              borderRadius: 12,
              fontWeight: 600,
              padding: '8px 22px',
              fontSize: 16,
              boxShadow: activeTabId === tab.id ? '0 2px 12px #1a73e899' : 'none',
              cursor: 'pointer',
              transition: 'all 0.16s'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>
      {/* Games grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 28,
          width: '100%',
          justifyItems: 'center',
          alignItems: 'start',
          padding: 12,
          background: 'rgba(30,32,60,0.94)',
          borderRadius: 24,
          minHeight: 180,
          boxShadow: '0 4px 24px #1617253a'
        }}
      >
        {games.map((game) => (
          <div
            key={game.id}
            onDoubleClick={() => handleDoubleClick(game.path)}
            style={{
              backgroundColor: '#23243e',
              borderRadius: 16,
              padding: '20px 8px 14px 8px',
              cursor: 'pointer',
              textAlign: 'center',
              width: 110,
              boxShadow: '0 1px 8px rgba(40,40,70,0.14)',
              userSelect: 'none',
              transition: 'box-shadow .12s, transform .12s',
              border: '2px solid transparent'
            }}
            title="2x bos: Ishga tushur"
          >
            <img
              src={game.iconPath}
              alt={game.name}
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'contain',
                marginBottom: '12px',
                borderRadius: 12,
                background: '#181b1f',
                boxShadow: '0 2px 8px #191e3a40'
              }}
              onError={(e) => {
                e.target.src = `http://${ADMIN_API_HOST}:${ADMIN_API_PORT}/icons/default.png`
              }}
            />
            <div
              style={{
                fontSize: 14,
                color: '#ff8383',
                fontWeight: 200,
                letterSpacing: 1,
                wordBreak: 'break-word'
              }}
            >
              {game.exe}
            </div>
          </div>
        ))}
        {!games.length && (
          <div
            style={{
              color: '#b0b9d5',
              fontSize: 20,
              textAlign: 'center',
              gridColumn: '1/-1',
              padding: '40px 0'
            }}
          >
            Hech qanday o‘yin topilmadi
          </div>
        )}
      </div>
    </div>
  )
}

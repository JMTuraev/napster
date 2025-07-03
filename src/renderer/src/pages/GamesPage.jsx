import React, { useEffect, useState } from 'react'

const ADMIN_API_HOST = '192.168.1.7' // Adminning IP sini yozing!
const ADMIN_API_PORT = 3333

export default function GamesPage() {
  const [games, setGames] = useState([])

  // 🔄 Admin socket'dan kelgan o‘yinlar ro‘yxatini to‘g‘rilash
  const processGames = async (gamesList) => {
    const filtered = []

    for (const game of gamesList) {
      try {
        const exists = await window.api.invoke('check-path-exists', game.path)
        if (exists) {
          // ICON PATH'ni admin API orqali tarmoqdan olamiz
          const iconPath = `http://${ADMIN_API_HOST}:${ADMIN_API_PORT}${game.icon}`
          filtered.push({ ...game, iconPath })
        }
      } catch (err) {
        console.error(`❌ ${game.name} fayl tekshiruvda xato:`, err)
      }
    }

    setGames(filtered)
  }

  useEffect(() => {
    // 1️⃣ Socket orqali admin'dan o‘yinlar so‘rash
    window.api.socket.emit('get-games')

    // 2️⃣ Admin'dan kelgan o‘yinlar ro‘yxatini qabul qilish
    window.api.socket.on('games', processGames)

    return () => {
      window.api.socket.off('games', processGames)
    }
  }, [])

  const handleDoubleClick = (path) => {
    window.api.invoke('run-game', path).catch((err) => {
      console.error('❌ O‘yin ishga tushmadi:', err)
    })
  }

  return (
    <div style={{ padding: '16px', color: 'white' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>🎮 O‘yinlar ro‘yxati</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {games.map((game) => (
          <div
            key={game.id}
            onDoubleClick={() => handleDoubleClick(game.path)}
            style={{
              backgroundColor: '#1e1e1e',
              borderRadius: '8px',
              padding: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <img
              src={game.iconPath}
              alt={game.name}
              style={{ width: '48px', height: '48px', objectFit: 'contain', marginBottom: '8px' }}
              onError={(e) => {
                e.target.src = `http://${ADMIN_API_HOST}:${ADMIN_API_PORT}/icons/default.ico`
              }}
            />
            <p style={{ fontSize: '14px' }}>{game.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'

export default function GamesPage() {
  const [games, setGames] = useState([])

  useEffect(() => {
    const fetchGames = () => {
      // Admin tomonidan qo‘shilgan o‘yinlarni so‘rash
      window.api.socket.emit('get-games')

      // Serverdan kelgan o‘yinlar
      window.api.socket.on('games', async (data) => {
        const filtered = []

        for (const game of data) {
          const exists = await window.api.invoke('check-path-exists', game.path)
          if (exists) filtered.push(game)
        }

        setGames(filtered)
      })
    }

    fetchGames()

    return () => {
      window.api.socket.off('games') // tozalash
    }
  }, [])

  const runGame = (exePath) => {
    window.api.runGame(exePath)
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#fff' }}>🎮 O‘yinlar ro‘yxati</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {games.length === 0 ? (
          <p style={{ color: '#aaa' }}>Hech qanday o‘yin topilmadi</p>
        ) : (
          games.map((game) => (
            <div
              key={game.id}
              style={{
                width: 200,
                padding: 10,
                background: '#2c2c2c',
                color: '#fff',
                borderRadius: 8,
                textAlign: 'center'
              }}
            >
              <img
                src={`./assets/icons/${game.exe}.png`} // agar mavjud bo‘lsa
                alt={game.name}
                width={64}
                height={64}
              />
              <h3>{game.name}</h3>
              <button
                onClick={() => runGame(game.path)}
                style={{
                  marginTop: 10,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  background: 'white'
                }}
              >
                Ishga tushurish
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

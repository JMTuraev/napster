import React from 'react'
import games from '../data/games'

const GamesPage = () => {
  const runGame = (exePath) => {
    window.api.runGame(exePath)
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#fff' }}>🎮 O‘yinlar ro‘yxati</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {games.map((game) => (
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
            <img src={game.icon} alt={game.name} width={64} height={64} />
            <h3>{game.name}</h3>
            <button
              onClick={() => runGame(game.path)}
              style={{ marginTop: 10, padding: '6px 12px', cursor: 'pointer' }}
            >
              Ishga tushurish
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GamesPage

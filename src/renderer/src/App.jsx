import { useState } from 'react'
import UserPage from './pages/User'
import GamesPage from './pages/GamesPage'

export default function App() {
  const [page, setPage] = useState('user') // 'user' | 'games' | 'admin'

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col">
      {/* 🔘 Navigatsiya */}
      <div className="flex justify-center gap-4 p-4 bg-gray-900">
        <button
          onClick={() => setPage('user')}
          className={`px-4 py-2 rounded ${page === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          User
        </button>
        <button
          onClick={() => setPage('games')}
          className={`px-4 py-2 rounded ${page === 'games' ? 'bg-green-600' : 'bg-gray-700'}`}
        >
          Games
        </button>
      </div>

      {/* 📄 Sahifalar */}
      <div className="flex-1 overflow-auto">
        {page === 'user' && <UserPage />}
        {page === 'games' && <GamesPage />}
      </div>
    </div>
  )
}

import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { exec } from 'child_process'
import { io } from 'socket.io-client'

// 📡 Socket ulanish
const socket = io('http://127.0.0.1:3000')

// 🎮 O‘yin ishga tushirish
function runGame(path) {
  exec(`"${path}"`, (error, stdout, stderr) => {
    if (error) return console.error('❌ Game error:', error.message)
    if (stderr) return console.warn('⚠️ stderr:', stderr)
    console.log('✅ Game started:', stdout)
  })
}

// 🔌 API obyekti
const api = {
  socket: {
    on: (...args) => socket.on(...args),
    off: (...args) => socket.off(...args),
    emit: (...args) => socket.emit(...args),
    connected: () => socket.connected,
    id: () => socket.id
  },
  runGame,
  invoke: (channel, data) => ipcRenderer.invoke(channel, data)
}

// ❗ API faqat bitta marta ulanishi kerak
try {
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } else {
    if (!window.api) window.api = api
    if (!window.electron) window.electron = electronAPI
  }
} catch (err) {
  console.error('❌ Preload expose error:', err)
}

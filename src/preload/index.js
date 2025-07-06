import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { io } from 'socket.io-client'

// 📡 SOCKET ulanish (localhost, admin/server)
const socket = io('http://127.0.0.1:3000', {
  transports: ['websocket'], // faqat websocket, fallbacklarsni oldini oladi
  reconnection: true
})

// 🔌 API: socket va IPC
const api = {
  // --- SOCKET funksiyalari ---
  socket: {
    on: (...args) => socket.on(...args),
    off: (...args) => socket.off(...args),
    emit: (...args) => socket.emit(...args),
    connected: () => socket.connected,
    id: () => socket.id
  },

  // --- IPC (Electron) funksiyalari ---
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),

  // --- getIcon: exe path uchun IPC orqali icon ajratish ---
  // Foydalanishda: await window.api.getIcon(exePath)
  getIcon: async (exePath) => {
    try {
      const res = await ipcRenderer.invoke('extract-save-icon', exePath)
      return res.icon // har doim '/icons/...' bo‘ladi (yoki default)
    } catch (err) {
      return '/icons/default-icon.png'
    }
  },

  // --- Fayl mavjudligini tekshirish ---
  checkPathExists: async (path) => {
    try {
      return await ipcRenderer.invoke('check-path-exists', path)
    } catch {
      return false
    }
  },

  // --- O‘yinni ishga tushirish ---
  runGame: async (exePath) => {
    try {
      return await ipcRenderer.invoke('run-game', exePath)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

// --- Expose faqat bitta marta va contextIsolated rejimida ---
try {
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } else {
    // Fallback: dev/prod uchun
    if (!window.api) window.api = api
    if (!window.electron) window.electron = electronAPI
  }
} catch (err) {
  console.error('❌ Preload expose error:', err)
}

// scripts/save-icons.js
import fs from 'fs'
import path from 'path'
import { io } from 'socket.io-client'
import extractIcon from 'extract-file-icon' // npm i extract-file-icon

const socket = io('http://localhost:3000')

const ICONS_DIR = path.resolve('src/renderer/public/icons')

// 🔄 Folder mavjud bo‘lmasa, yaratamiz
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true })
}

// 🔌 Socket orqali ma'lumot olish
socket.on('connect', () => {
  console.log('✅ Socket ulandi')

  socket.emit('get-games')

  socket.once('games', async (games) => {
    for (const game of games) {
      try {
        if (!fs.existsSync(game.path)) continue

        const iconBuffer = extractIcon(game.path, 256) // 256px ikon
        if (!iconBuffer) {
          console.warn(`⚠️ Ikon topilmadi: ${game.name}`)
          continue
        }

        const iconPath = path.join(ICONS_DIR, `${game.name}.png`)
        fs.writeFileSync(iconPath, iconBuffer)
        console.log(`🎨 Saqlandi: ${iconPath}`)
      } catch (err) {
        console.error(`❌ Xatolik (${game.name}):`, err.message)
      }
    }

    socket.disconnect()
    console.log('🏁 Tayyor – socket uzildi')
  })
})

socket.on('connect_error', (err) => {
  console.error('❌ Socket ulanish xatosi:', err.message)
})

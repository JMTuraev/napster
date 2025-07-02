import fs from 'fs'
import path from 'path'
import extractIcon from 'extract-file-icon'
import games from '../data/games.js' // array ko‘rinishida

// 🔧 renderer/public/icons ichida bo'lishi kerak
const iconsDir = path.join('renderer', 'public', 'icons')

// 📁 Ico papka mavjud bo‘lmasa, yaratamiz
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

games.forEach((game) => {
  const fileName = `${game.name}.png`
  const fullPath = path.join(iconsDir, fileName)

  try {
    if (!fs.existsSync(game.path)) {
      throw new Error('Yo‘q fayl')
    }

    const iconBuffer = extractIcon(game.path, 256)
    fs.writeFileSync(fullPath, iconBuffer)
    console.log(`✅ ${fileName} saqlandi`)
  } catch (error) {
    // Agar icon olinmasa — default icon nusxalanadi
    const defaultIconPath = path.join(iconsDir, 'default-icon.png')

    if (fs.existsSync(defaultIconPath)) {
      fs.copyFileSync(defaultIconPath, fullPath)
      console.warn(`⚠️ ${fileName} uchun default icon ishlatildi:`, error.message)
    } else {
      console.error(`❌ Default icon yo‘q: ${defaultIconPath}`)
    }
  }
})

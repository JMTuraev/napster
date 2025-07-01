import { ipcMain } from 'electron'
import fs from 'fs'

// ✅ Eksport qilinayotgan funksiya
export function registerGameHandlers() {
  ipcMain.handle('check-path-exists', async (event, path) => {
    const exists = fs.existsSync(path)
    console.log(`📦 Path tekshirildi: ${path} – ${exists ? 'bor' : 'yo‘q'}`)
    return exists
  })
}

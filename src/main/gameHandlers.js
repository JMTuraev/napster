import { ipcMain } from 'electron'
import fs from 'fs'
import { execFile } from 'child_process'

let handlersRegistered = false

export function registerGameHandlers() {
  if (handlersRegistered) return
  handlersRegistered = true

  // ✅ Fayl mavjudligini tekshirish
  ipcMain.handle('check-path-exists', async (event, path) => {
    const exists = fs.existsSync(path)
    return exists
  })

  // ✅ O‘yinni ishga tushirish
  ipcMain.handle('run-game', async (event, path) => {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(path)) {
        reject('Fayl topilmadi')
        return
      }

      execFile(path, (err) => {
        if (err) reject(err.message)
        else resolve('OK')
      })
    })
  })

  // ⚠️ get-games yo‘q! Chunki DB yo‘q
}

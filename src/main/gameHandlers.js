import { ipcMain } from 'electron'
import fs from 'fs'
import { execFile } from 'child_process'

let handlersRegistered = false

export function registerGameHandlers() {
  if (handlersRegistered) return
  handlersRegistered = true

  // Fayl mavjudligini tekshirish
  ipcMain.handle('check-path-exists', async (_event, path) => {
    return fs.existsSync(path)
  })

  // O‘yinni ishga tushirish
  ipcMain.handle('run-game', async (_event, path) => {
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
}

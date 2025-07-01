// main.js
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { registerGameHandlers } from './gameHandlers' // ✅ YANGI

// 🪟 Oyna yaratish funksiyasi
function createWindow() {
  const mainWindow = new BrowserWindow({
    kiosk: false,
    alwaysOnTop: false,
    frame: true,
    fullscreen: false,
    closable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape') {
      console.log('🔓 ESC bosildi – kiosk mode off')
      mainWindow.setKiosk(false)
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 🧠 Ilova tayyor bo‘lganda
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  // 🧩 Games bilan bog‘liq IPC handlerlarni ro‘yxatdan o‘tkazamiz
  registerGameHandlers()

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// ❌ Barcha oynalar yopilganda ilovani yopish
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

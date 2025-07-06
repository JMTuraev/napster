import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { registerGameHandlers } from './gameHandlers.js' // ✅ pathni moslashtiring!

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    kiosk: false,
    alwaysOnTop: false,
    frame: true,
    fullscreen: false,
    closable: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: false,
      nodeIntegration: false
    }
  })

  // 🛑 ESC tugmasi kioskdan chiqish uchun
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape') {
      console.log('🔓 ESC bosildi – kiosk mode off')
      mainWindow.setKiosk(false)
    }
  })

  // 🌐 Tashqi havolalarni browserda ochish
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 📦 Yuklash (dev yoki prod)
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 🔋 App tayyor bo‘lsa
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Test uchun
  ipcMain.on('ping', () => console.log('pong'))

  // ⚡ MUHIM: Faqat bir marta, app boshlanishida
  registerGameHandlers()

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// ❌ Barcha oynalar yopilsa, ilovani to‘xtatish
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

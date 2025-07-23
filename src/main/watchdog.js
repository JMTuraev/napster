// src/main/watchdog.js
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

const baseDir = 'C:\\GameBooking'

const userExePath = path.join(baseDir, 'user.exe')
const watchdogPath = path.join(baseDir, 'watchdog-user.bat')
const flagPath = path.join(baseDir, 'user_stop.flag')

// Watchdog skript matni
const watchdogText = `
@echo off
:main
if exist "${flagPath}" (
    timeout /t 3 >nul
    goto main
)
tasklist | find /i "user.exe" >nul 2>&1
if errorlevel 1 (
    start "" "${userExePath}"
)
timeout /t 3 >nul
goto main
`

export function setupWatchdog() {
  // Watchdog bat faylini yaratish
  if (!fs.existsSync(watchdogPath)) {
    fs.writeFileSync(watchdogPath, watchdogText)
  }
  // Task Scheduler'ga yozish (faqat 1 marta)
  exec(`schtasks /Query /TN "UserWatchdog"`, (err) => {
    if (err) {
      exec(`schtasks /Create /SC ONLOGON /TN "UserWatchdog" /TR "${watchdogPath}" /RL HIGHEST /F`)
    }
  })
}

// (Ixtiyoriy) Admin uchun flag yaratish, o‘chirish
export function createFlag() {
  fs.writeFileSync(flagPath, 'stopped')
}
export function removeFlag() {
  if (fs.existsSync(flagPath)) fs.unlinkSync(flagPath)
}

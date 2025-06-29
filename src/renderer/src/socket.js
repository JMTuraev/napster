import { io } from 'socket.io-client'
import macaddress from 'macaddress'

const socket = io('http://localhost:3000') // ✅ Hozircha localhost, bir kompyuter

macaddress.one((err, mac) => {
  if (err) {
    console.error('❌ MAC olishda xato:', err)
    return
  }

  const user = {
    mac
  }

  socket.emit('new-user', user)
  console.log('📤 [DEV] MAC yuborildi:', user)
})

export default socket

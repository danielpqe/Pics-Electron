import {app, BrowserWindow, ipcMain, dialog} from 'electron'
import devtools from './devtools'
import fs from 'fs'
import isImage from 'is-image'
import path from 'path'
import filesize from 'filesize'

let win
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

if (process.env.NODE_ENV === 'development') {
  devtools()
}

function createWindow () {
  // Crea la ventana del navegador.
  win = new BrowserWindow({width: 800, height: 600})

  // y carga el archivo index.html de la aplicación.
  // win.loadFile('index.html')
  win.loadURL(`file://${__dirname}/renderer/index.html`)
  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitido cuando la ventana es cerrada.
  win.on('closed', () => {
    // Desreferencia el objeto ventana, usualmente tu guardarias ventanas
    // en un arreglo si tu aplicación soporta multi ventanas, este es el momento
    // cuando tu deberías borrar el elemento correspiente.
    win = null
  })
}

// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
// Algunas APIs pueden solamente ser usadas despues de que este evento ocurra.
app.on('ready', createWindow)

ipcMain.on('open-directory', (event) => {
  dialog.showOpenDialog(win, {
    title: 'Seleccione ubicación',
    buttonLabel: 'Abrir ubicación',
    properties: ['openDirectory']
  }, (dir) => {
    const images = []
    if (dir) {
      fs.readdir(dir[0], (err, files) => {
        if (err) throw err
        for (let i = 0, length = files.length; i < length; i++) {
          if (isImage(files[i])) {
            let imageFile = path.join(dir[0], files[i])
            let stats = fs.statSync(imageFile)
            let size = filesize(stats.size, {round: 0})
            images.push({ filename: files[i], src: `file://${imageFile}`, size: size})
          }
        }

        event.sender.send('load-images', images)
      })
    }
  })
})

// Salir cuando todas las ventanas estén cerradas.
app.on('window-all-closed', () => {
  // En macOS es común para las aplicaciones y sus barras de menú
  // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // En macOS es común volver a crear una ventana en la aplicación cuando el
  // icono del dock es clickeado y no hay otras ventanas abieras.
  if (win === null) {
    createWindow()
  }
})

// En este archivo tu puedes incluir el resto del código del proceso principal de
// tu aplicación. Tu también puedes ponerlos en archivos separados y requerirlos aquí.

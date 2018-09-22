import {ipcRenderer} from 'electron'
import {addImagesEvents,selectFirstImage,loadImages,clearImages} from './images-ui'

function setIpc () {
  ipcRenderer.on('load-images', (event, images) => {
    clearImages()
    loadImages(images)
    addImagesEvents()
    selectFirstImage()
  })
}

function openDirectory () {
  ipcRenderer.send('open-directory')
}

function saveFile () {
  ipcRenderer.send('open-save-dialog')
}

module.exports = {
  setIpc: setIpc,
  openDirectory: openDirectory,
  saveFile:saveFile
}

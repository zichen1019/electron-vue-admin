import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame: false // 外边框
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', async() => {
  // 设置托盘
  const tray = new Tray('build/icons/icon.ico')
  // 设置托盘菜单
  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => {
        mainWindow.show()
      }
    }, {
      label: 'Close',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setToolTip('Electron Vue')
  tray.on('click', () => {
    mainWindow.show()
  })
  tray.on('right-click', () => {
    tray.popUpContextMenu(trayContextMenu)
  })
  // 创建渲染窗口
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

// 登录窗口最小化
ipcMain.on('min', function() {
  mainWindow.minimize()
})
// 登录窗口最大化
ipcMain.on('max', function() {
  if (mainWindow.isMaximized()) {
    mainWindow.restore()
  } else {
    mainWindow.maximize()
  }
})
ipcMain.on('close', function() {
  mainWindow.close()
})

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
    height: 1100,
    useContentSize: true,
    width: 2300,
    // frame: false, // 外边框
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 定义calendar窗体
let newWin

/**
 * 创建calendar窗口方法
 * @param arg { url: '', width: '', height: '' }
 */
function openNewWindow(arg) {
  newWin = new BrowserWindow({
    width: arg.width,
    height: arg.height,
    parent: mainWindow, // win是主窗口
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  newWin.loadURL(winURL + '#' + arg.url)
  newWin.on('closed', () => { newWin = null })
}
ipcMain.on('openNewWindow', (event, arg) => {
  openNewWindow(arg)
})

let newModal
function openNewModal(arg) {
  newModal = new BrowserWindow({
    width: arg.width,
    height: arg.height,
    modal: true,
    alwaysOnTop: true,
    // 是否开启外边框
    frame: false,
    // 是否透明背景
    transparent: true
  })
  newModal.loadURL(winURL + '#' + arg.url)
  newModal.on('closedModal', () => { newModal = null })
  newModal.show()
}
ipcMain.on('openNewModal', (event, arg) => {
  openNewModal(arg)
})

ipcMain.on('closedModal', () => {
  newModal.close()
})

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

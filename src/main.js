const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { getClients, getClientAddress, getInvoice, getInvoiceReg, addClients, getClient, getInvoiceByInvoiceNo,getInvoicesByDateRange, getParticulars, getInvoiceDetails,getAddressList } = require('./server.js');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Handle navigation and refresh
  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    if (url !== MAIN_WINDOW_WEBPACK_ENTRY) {
      mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).then(() => {
        mainWindow.webContents.executeJavaScript(`window.history.pushState({}, "", "${url}")`);
      });
    }
  });

  mainWindow.webContents.on('did-fail-load', () => {
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  });

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


ipcMain.handle('fetchClients', async () => {
  return await getClients();
});

ipcMain.handle('fetchClientAddress', async () => {
  return await getClientAddress();
});

ipcMain.handle('fetchInvoice', async (event, pageNumber) => {
  return await getInvoice(pageNumber);
})
ipcMain.handle('fetchInvoiceReg', async (event, pageNumber) => {
  return await getInvoiceReg(pageNumber);
})
ipcMain.handle('addClients', async (event, clientInfo) => {
  return await addClients(clientInfo);
})
ipcMain.handle('getClient', async (event, id) => {
  return await getClient(id);
})
ipcMain.handle('getInvoiceByInvoiceNo', async (event, invoiceno)=>{
  return await getInvoiceByInvoiceNo(invoiceno)
})
ipcMain.handle('getInvoicesByDateRange', async(event, dateFrom, dateTo, pageNumber)=>{
  return await getInvoicesByDateRange(dateFrom, dateTo,pageNumber)
})
ipcMain.handle('getParticulars', async (event, id) => {
  return await getParticulars(id);
})
ipcMain.handle('getInvoiceDetails', async () => {
  return await getInvoiceDetails();
})
ipcMain.handle('getAddressList', async (event, id) => {
  return await getAddressList(id);
})

// Handle print request
ipcMain.on('print-invoice', (event) => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
    focusedWindow.webContents.print({ silent: false, printBackground: true }, (success, errorType) => {
        if (!success) console.log(errorType);
    });
});
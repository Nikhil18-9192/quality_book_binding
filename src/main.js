const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { getClients, getClientAddress, getInvoice, getInvoiceReg, addClients, getClient, getInvoiceByInvoiceNo,getInvoicesByDateRange, getParticulars, getInvoiceDetails,getAddressList, addInvoice, updateClient, addAddress, deleteAddress,deleteInvoice } = require('./server.js');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
// const fs = require('fs');

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    autoHideMenuBar: true,
    contextIsolation: false,
    nodeIntegration: true
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

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

ipcMain.handle('showDialog', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, {
      type: 'warning',
      buttons: ['Cancel', 'Yes'],
      defaultId: 1,
      title: 'Confirmation',
      message: options.message,
      detail: options.detail || '',
  });
  return result.response; // Will be 0 for 'Cancel' and 1 for 'Yes'
});


ipcMain.handle('fetchClients', async () => {
  return await getClients();
});

ipcMain.handle('getClientAddress', async (event, clientid) => {
  return await getClientAddress(clientid);
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
ipcMain.handle('updateClient', async (event, clientId,clientInfo) => {
  return await updateClient(clientId,clientInfo);
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
ipcMain.handle('addInvoice', async (event, invoiceDetails) => {
  return await addInvoice(invoiceDetails);
})
ipcMain.handle('addAddress', async (event, clientid, clientname, address) => {
  return await addAddress(clientid, clientname, address);
})
ipcMain.handle('deleteAddress', async (event, id) => {
  return await deleteAddress(id);
})
ipcMain.handle('deleteInvoice', async (event, id) => {
  return await deleteInvoice(id);
})

// Handle print request
ipcMain.on('print-invoice', (event) => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
    focusedWindow.webContents.print({ silent: true, printBackground: true }, (success, errorType) => {
      if (!success) console.log(errorType, 'print error');
    });
});



ipcMain.on('generatePDF', async (event, htmlContent) => {

  // Open the PDF in a new window for printing
  const printWindow = new BrowserWindow(
    {
      width: 800,
    height: 800,
    show:true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
    } 
  );

  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
  printWindow.webContents.on('did-finish-load', () => {
    const pdfPath = path.join(os.homedir(), 'Desktop', `Invoice.pdf`);

    // Generate PDF
    printWindow.webContents.printToPDF({
      preferCSSPageSize:true,
      printBackground: true,
      pageSize: 'A4',           // You can uncomment or specify 'A4' or any other size here
  marginsType: 0,           // 0: default, 1: no margins, 2: minimum margins
  margins: {
    top: 0.08,   // top margin in inches
    bottom: 0.10, // bottom margin in inches
    left: 0.12,  // left margin in inches
    right: 0.12  // right margin in inches
  },
    }).then(data => {
      fs.writeFile(pdfPath, data, (error) => {
        if (error) throw error;
        
        // Automatically print the PDF silently using the default printer
        printWindow.webContents.print({
          silent: true,
          printBackground: true,
          deviceName: '' // Leave empty to use the default printer
        }, (success, failureReason) => {
          if (!success) {
            console.error('Failed to print:', failureReason);
          } else {
            printWindow.close();
            shell.openPath(pdfPath).then(() => {
              console.log('PDF opened successfully');
            }).catch(error => {
              console.error('Failed to open PDF: ', error);
            });
            return true
          }
        });   
      });
    }).catch(error => {
      console.log(`Failed to write PDF to ${pdfPath}: `, error);
      printWindow.close();
    });
  });
});


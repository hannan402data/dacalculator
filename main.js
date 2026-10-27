const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400, height: 900,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true }
  });
  win.setMenuBarVisibility(false);
  win.loadFile('index.html');
}

ipcMain.handle('save-pdf', async (e, name) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  const { filePath } = await dialog.showSaveDialog(win, {
    defaultPath: name, filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });
  if (!filePath) return false;
  const data = await win.webContents.printToPDF({ pageSize: 'A4', printBackground: true });
  fs.writeFileSync(filePath, data);
  return filePath;
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());

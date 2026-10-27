const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', { savePdf: n => ipcRenderer.invoke('save-pdf', n) });

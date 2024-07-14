// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {

    print: (channel, data) => {
        console.log(channel, data)
        ipcRenderer.send(channel, data)
    },
    fetchClients: async () => {
        try {
            const result = await ipcRenderer.invoke('fetchClients');
            return result;
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },
    fetchClientAddress: async () => {
        try {
            const result = await ipcRenderer.invoke('fetchClientAddress');
            return result;
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },
    fetchInvoice: async (pageNumber) => {
        try {
            const result = await ipcRenderer.invoke('fetchInvoice', pageNumber);
            return result;
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },
    fetchInvoiceReg: async (pageNumber) => {
        try {
            const result = await ipcRenderer.invoke('fetchInvoiceReg', pageNumber);
            return result;
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },

    addClients: async(clientInfo)=>{
        try {
            const result = await ipcRenderer.invoke('addClients', clientInfo);
            return result;
        } catch (error) {
            console.log('Error querying database:', error)
            throw error
        }
    },

    getClient: async(id)=>{
        try {
            const result = await ipcRenderer.invoke('getClient', id);
            return result;
        } catch (error) {
            console.log('Error querying database:', error)
            throw error
        }
    },

    getInvoiceByInvoiceNo: async(invoiceno)=>{
        try {
            const result = await ipcRenderer.invoke('getInvoiceByInvoiceNo', invoiceno);
            return result;
        } catch (error) {
            console.log('Error querying database:', error)
            throw error
        }
    },
    getInvoicesByDateRange: async(dateFrom,dateTo,pageNumber)=>{
        try {
            const result = await ipcRenderer.invoke('getInvoicesByDateRange', dateFrom,dateTo,pageNumber);
            return result;
        } catch (error) {
            console.log('Error querying database:', error)
            throw error
        }
    }

});

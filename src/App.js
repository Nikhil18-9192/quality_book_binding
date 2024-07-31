import React, { useEffect, useState } from 'react'
import './app.scss'
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home.js';
import Clients from './components/Clients.js';
import Invoices from './components/Invoices.js';
import ClientAddress from './components/ClientAddress.js';
import InvoiceRegister from './components/InvoiceRegister.js';
function App() {
  const basePath = window.location.pathname.startsWith('/main_window') ? '/main_window' : '/';
  
  return (
    <div className='App'>
            {/* <h1 className='title' >Quality Book Binding</h1> */}
            <div className="page_container w-full h-full"> 
              {/* routes */}
                <Routes>
                    <Route path={`${basePath}`} element={<Home />}></Route>
                    <Route path={`${basePath}/clients`} element={<Clients />}></Route>
                    <Route path={`${basePath}/gst`} element={<ClientAddress />}></Route>
                    <Route path={`${basePath}/invoices`} element={<Invoices />}></Route>
                    <Route path={`${basePath}/invoiceRegister`} element={<InvoiceRegister />}></Route>
                </Routes>
            </div>
    </div>
  )
}

export default App
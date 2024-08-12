import React from 'react'
import './app.scss'
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.js';
import Clients from './components/Clients.js';
import Invoices from './components/Invoices.js';
import GstSummery from './components/GstSummery.js';
import InvoiceRegister from './components/InvoiceRegister.js';
import ViewClient from './components/ViewClient.js';
function App() {
  const basePath = window.location.pathname.startsWith('/main_window') ? '/main_window' : '/';
  
  return (
    <div className='App'>
            {/* <h1 className='title' >Quality Book Binding</h1> */}
            <div className="page_container w-full h-full"> 
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/clients" element={<Clients />}></Route>
                    <Route path="/gst" element={<GstSummery />}></Route>
                    <Route path="/invoices" element={<Invoices />}></Route>
                    <Route path="/invoiceRegister" element={<InvoiceRegister />}></Route>
                </Routes>
            </div>
    </div>
  )
}

export default App
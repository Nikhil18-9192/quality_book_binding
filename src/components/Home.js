import React from 'react'
import { Link } from 'react-router-dom'
import { FaUsers } from "react-icons/fa";
import { HiReceiptTax } from "react-icons/hi";
import { FaFileInvoice } from "react-icons/fa";
import { GrDatabase } from "react-icons/gr";

function Home() {
    const basePath = window.location.pathname
  return (
    <div className='home'>
      <h1 className='title'>Quality Book Binding</h1>
    <div className='nav'>
      <Link to="/clients" className='nav-link'>
        <FaUsers className='nav-icon' />Clients
        </Link>
      <Link to="/gst" className='nav-link'>
        <HiReceiptTax className='nav-icon' /> GST Summery
        </Link>
      <Link to="/invoices" className=' nav-link'>
        <FaFileInvoice className='nav-icon' />Invoices Register
      </Link>
      <Link to="/invoiceRegister" className='nav-link'>
      <GrDatabase className='nav-icon' />Create Invoice
      </Link>
    </div>
    </div>
  )
}

export default Home
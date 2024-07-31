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
      <Link to={`${basePath}/clients`} className='nav-link'>
        <FaUsers className='nav-icon' />Clients
        </Link>
      <Link to={`${basePath}/gst`} className='nav-link'>
        <HiReceiptTax className='nav-icon' /> GST Summery
        </Link>
      <Link to={`${basePath}/invoices`} className=' nav-link'>
        <FaFileInvoice className='nav-icon' />Invoices Register
      </Link>
      <Link to={`${basePath}/invoiceRegister`} className='nav-link'>
      <GrDatabase className='nav-icon' />Create Invoice
      </Link>
    </div>
  )
}

export default Home
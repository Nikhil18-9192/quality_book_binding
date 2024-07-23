import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AiOutlineClear } from "react-icons/ai";
import InvoicePdf from './InvoicePdf.jsx';
// import InvoicePdf from './InvoicePdf';

function Invoices() {
  const [invoiceReg, setInvoiceReg] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0)
  const [searchDate, setSearchDate] = useState({from:'',to:''})
  const [invoice, setInvoice] = useState(null)

  const fetchInvoiceReg = async () => {
    try {
      const result = await window.electronAPI.fetchInvoice(pageNumber);
      setTotalPages(result.totalPages)
      setInvoiceReg(result.data);
  } catch (error) {
      console.error('Error querying database:', error);
  }
  }
   

  const handleSearch = async(e) => {
    try {
      const invoiceno = e.target.value
      console.log(typeof invoiceno);
      if(invoiceno == ""){
        fetchInvoiceReg();
        return
      }
      const data = await window.electronAPI.getInvoiceByInvoiceNo(invoiceno);
      setTotalPages(data.totalPages)
      setInvoiceReg(data.data);
    } catch (error) {
      console.error('Error querying database:', error);
    }
  }

  const handleView = async(invoice)=>{
    try {
        setInvoice(invoice)
    } catch (error) {
        console.log('Error querying database:', error)
        throw error
    }
  }

  const prev = ()=>{
    if(pageNumber > 1){
      setPageNumber(pageNumber - 1)
    }
  }

  const next = ()=>{
    console.log(pageNumber, totalPages)
    if(pageNumber < totalPages){
      setPageNumber(pageNumber + 1)
    }
    
  }

  const handleChangeDate = (e)=>{
    console.log(e.target.name, e.target.value)
    setSearchDate({...searchDate, [e.target.name]: e.target.value})
  }
  const handleDateSearch = async()=>{
    try {
      setIsFilter(true)
      const data = await window.electronAPI.getInvoicesByDateRange(searchDate.from, searchDate.to,pageNumber);
      setTotalPages(data.totalPages)
      setInvoiceReg(data.data);
    } catch (error) {
      console.error('Error querying database:', error);
    }
  }
  const goBack = () => {
    navigate(-1)
  }
  const clearSearch = ()=>{
    setIsFilter(false)
    setPageNumber(1)
    getToday()
  }
  const getToday = ()=>{
    // Get today's date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    const year = today.getFullYear();
    const todayFormatted = `${year}-${month}-${day}`;
    setSearchDate({from: todayFormatted, to:todayFormatted})
  }
  useEffect(() => {

    
    if(isFilter){
      handleDateSearch();
    }else{
      
      fetchInvoiceReg();
    }
  }, [pageNumber])
  useEffect(()=>{
    getToday()
  },[])
  return (
    <div className='clients'>
      <h3 className='back-btn' onClick={goBack}>{"< Home"}</h3>
      <h1 className='page_title'>Invoice Register</h1>
      <div className="filter_container">
        <input type="number" placeholder="Search Invoice Number..." className="search_input" onChange={(e) => handleSearch(e)} />
        <div className='date_filter'>
          <div>
            <span className='title'>From:</span>
          <input type="date" className="search_input" name="from" value={searchDate.from}  onChange={(e)=> handleChangeDate(e)} />
          </div>
          <div>
            <span className='title'>To:</span>
          <input type="date" className="search_input" name="to"  value={searchDate.to} onChange={(e)=> handleChangeDate(e)} />
          </div>
          <button onClick={handleDateSearch} className='submit'>Search</button>
          {
            isFilter ? <AiOutlineClear className='search-icon' onClick={clearSearch} /> : null
          }
          
        </div>
        <div className="pagination_container">
        <button onClick={prev} className='btn'>prev</button>
        <button onClick={next} className='btn'>next</button>
        </div>
      </div>
      <div className="clients_list">
        <table className='table'>
          <thead>
            <tr>
              <th className='table_head'>Invoice No</th>
              <th className='table_head'>Client Name</th>
              <th className='table_head'>Branch</th>
              <th className='table_head'>CGST</th>
              <th className='table_head'>SGST</th>
              <th className='table_head'>Sub Total</th>
              <th className='table_head'>Total</th>
              <th className='table_head'>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoiceReg.map((invoice, i) => (
              <tr key={i}>
                <td className='table_data'>{invoice.invoiceno}</td>
                <td className='table_data'>{invoice.clientname}</td>
                <td className='table_data'>{invoice.bankbranch}</td>
                <td className='table_data'>{invoice.cgst}</td>
                <td className='table_data'>{invoice.sgst}</td>
                <td className='table_data'>{invoice.subtotal}</td>
                <td className='table_data'>{invoice.total}</td>
                <td className='table_data' style={{cursor: 'pointer', color:'#900'}} onClick={()=>handleView(invoice)}>View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {invoice != null ? <InvoicePdf invoice={invoice} setInvoice={setInvoice} /> : null}
      
    </div>
  )
}

export default Invoices
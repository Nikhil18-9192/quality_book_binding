import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AiOutlineClear } from "react-icons/ai";

function GstSummery() {
  const [invoices, setInvoices] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0)
  const [searchDate, setSearchDate] = useState({from:new Date().toISOString().slice(0, 10),to:new Date().toISOString().slice(0, 10)})
  const [invoice, setInvoice] = useState(null)


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
      setInvoices(data.data);
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
  return (
    <div className='clients'>
      <h3 className='back-btn' onClick={goBack}>{"< Home"}</h3>
      <h1 className='page_title'>GST Summery</h1>
      <div className="filter_container">
       
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
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, i) => (
              <tr key={i}>
                <td className='table_data'>{invoice.invoiceno}</td>
                <td className='table_data'>{invoice.clientname}</td>
                <td className='table_data'>{invoice.bankbranch}</td>
                <td className='table_data'>{invoice.cgst}</td>
                <td className='table_data'>{invoice.sgst}</td>
                <td className='table_data'>{invoice.subtotal}</td>
                <td className='table_data'>{invoice.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}

export default GstSummery
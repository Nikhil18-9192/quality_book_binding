import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AiOutlineClear } from "react-icons/ai";
import SummeryPdf from './SummeryPdf';

function GstSummery() {
  const [invoices, setInvoices] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0)
  const [searchDate, setSearchDate] = useState({from:new Date().toISOString().slice(0, 10),to:new Date().toISOString().slice(0, 10)})
  const [print, setPrint] = useState(false)
  const [printData, setPrintData] = useState([])


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
    setSearchDate({...searchDate, [e.target.name]: e.target.value})
  }
  const fetchData = async()=>{
    try {
      setIsFilter(true)
      const data = await window.electronAPI.getInvoicesByDateRange(searchDate.from, searchDate.to,pageNumber);
      setPrintData(data.allData)
      setTotalPages(data.totalPages)
      setInvoices(data.data);
    } catch (error) {
      console.error('Error querying database:', error);
    }
  }
  const handleDateSearch = async()=>{
    fetchData();
  }

  const goBack = () => {
    navigate(-1)
  }
  const roundValue = (value) =>{
    // Round the value to the nearest integer
    const roundedValue = Math.round(value);

    // Calculate the remaining fractional part
    const remainingFractionalPart = Math.abs(value - roundedValue).toFixed(2);
    
    // Determine if the fractional part was added or removed
    const action = (roundedValue > value) ? 'added' : 'removed';

    return {
        roundedValue: roundedValue.toFixed(2),
        remainingFractionalPart: remainingFractionalPart,
        action: action
    };    
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
    fetchData()
  }, [pageNumber])
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
        <button onClick={()=> setPrint(true)} className='btn'>Print / Download</button>
        <button onClick={prev} className='btn'>prev</button>
        <button onClick={next} className='btn'>next</button>
        </div>
      </div>
      <div className="clients_list">
        <table className='table'>
          <thead>
            <tr>
              <th className='table_head'>Invoice No</th>
              <th className='table_head'>Date</th>
              <th className='table_head'>Customer Name</th>
              <th className='table_head'>CGSTIN No.</th>
              <th className='table_head'>GST Rate</th>
              <th className='table_head'>Taxable Value</th>
              <th className='table_head'>Central Tax</th>
              <th className='table_head'>State Tax</th>
              <th className='table_head'>Round Off</th>
              <th className='table_head'>Invoice Value</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, i) => (
              <tr key={i}>
                <td className='table_data'>{invoice.invoiceno}</td>
                <td className='table_data'>{invoice.date.toLocaleDateString('en-GB')}</td>
                <td className='table_data' style={{textAlign:'left'}}>{invoice.clientname}</td>
                <td className='table_data'>{invoice.gstin}</td>
                <td className='table_data'>18%</td>
                <td className='table_data'>{invoice.subtotal}</td>
                <td className='table_data'>{invoice.cgst}</td>
                <td className='table_data'>{invoice.sgst}</td>
                <td className='table_data'>{roundValue(invoice.total).action === 'removed' ? '-' : ''}{' '}{roundValue(invoice.total).remainingFractionalPart}</td>
                <td className='table_data'>{invoice.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {print ? <SummeryPdf invoices={printData} setPrint={setPrint} searchDate={searchDate} /> : null}
    </div>
  )
}

export default GstSummery
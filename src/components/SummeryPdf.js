import React, { useEffect, useState } from 'react'
import {jsPDF} from 'jspdf'
import { IoCloseSharp } from "react-icons/io5";
import html2canvas from 'html2canvas';

function SummeryPdf({invoices, setPrint, searchDate}) {
    const [total, setTotal] = useState({
        totalSubtotal: 0,
          totalCgst: 0,
          totalSgst: 0,
          totalGst: 0
    })

    const generateReceipt = () => {
  const input = document.getElementById('generatePdf');
  
  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate the number of pages
    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;
    const ratio = canvasHeight / canvasWidth;
    const imgHeight = pdfWidth * ratio;
    let heightLeft = imgHeight;
    let position = 0;
    let padding = 14;

    // Add image to the PDF
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.line(20, padding, pdfWidth - 20, padding);
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save('GST-Summary.pdf');
  });
};

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


      const printReceipt = () => {
        generateReceipt();
        window.electronAPI.print('print-invoice', `Invoice-${invoice.invoiceno}.pdf`);
      }

      const handleClose = ()=>{
        
        setPrint(false)
      }

      const calculateTotals = (invoices) => {
        let totalSubtotal = 0;
        let totalCgst = 0;
        let totalSgst = 0;
        let totalGst = 0;
      
        invoices.forEach(invoice => {
          totalSubtotal += parseFloat(invoice.subtotal);
          totalCgst += parseFloat(invoice.cgst);
          totalSgst += parseFloat(invoice.sgst);
        });
      
        totalGst = totalCgst + totalSgst;
      
       setTotal({
        totalSubtotal: totalSubtotal.toFixed(2),
        totalCgst: totalCgst.toFixed(2),
        totalSgst: totalSgst.toFixed(2),
        totalGst: totalGst.toFixed(2)
      })
      };

      useEffect(() => {
        calculateTotals(invoices);
      },[invoices])
  return (
    <div className='gstsummery'>
         <div className='modal_content'>
         <IoCloseSharp className='close' onClick={() => handleClose()} />
         <div id='generatePdf'>
         <p className='shree'>|| &#x0936;&#x094D;&#x0930;&#x0940; ||</p>
              <div className="header">
                <div className="business_info">
                  <div className="logo">
                    <div className="left">
                      <div className="image"></div>
                      <p className='log_title'>All King Of Official Book Binding</p>
                    </div>
                    <div className="right">
                      <p className='quality'>Quality</p>
                      <p className='binders'>Book Binders</p>
                    </div>
                  </div>
                  <p className='address'>1226, 'A' Ward, Plot 1/A, Chopade Mala, Laxtirtha Vasahat East, Rankala Parisar Kolhapur, 416010</p>
                  <div className="contact">
                    <p>GSTIN: 27AHPPK1838G1ZA</p>
                    <p>PAN: AHPPK1828G</p>
                    <p>State Name: Maharashtra, Code: 27</p>
                    <p>Contact: +91 9421284184, +91 9011636467</p>
                    <p>Email: eknathkhadye90@gmail.com</p>
                  </div>
                </div>
                <div className="invoice_detail">
                  <p className='tax-btn'>GST Summery</p>
                  <p className='invoice_no' style={{margin:'58px 0'}}>From: {searchDate.from}</p>
                  <p className='date'>To: {searchDate.to}</p>
                </div>
              </div>
              <div className="particulars">
                <table className="table">
                  <thead>
                  <tr>
                    
                    <th className='table-head' >Invoice No.</th>
                    <th className='table-head'>Date</th>
                    <th className='table-head' >Customer Name</th>
                    <th className='table-head' >GSTIN No.</th>
                    <th className='table-head' >Gst Rate</th>
                    <th className='table-head'>Taxable Value</th>
                    <th className='table-head'>Central Tax</th>
                    <th className='table-head'>State Tax</th>
                    <th className='table-head'>Round Off</th>
                    <th className='table-head'>Invoice Value</th>
                  </tr>
                  </thead>
                  <tbody>
                  {invoices.map((item, index) => (
                    <tr key={index}>
                      
                      <td className='table-data ' >{item.invoiceno}</td>
                      <td className='table-data' style={{ textAlign: 'center'}}>{item.date.toLocaleDateString()}</td>
                      <td className='table-data' style={{ textAlign: 'left'}}>{item.clientname}</td>
                      <td className='table-data' style={{ textAlign: 'center'}}>{item.gstin}</td>
                      <td className='table-data' style={{ textAlign: 'center'}}>18%</td>
                      <td className='table-data' style={{ textAlign: 'center'}}>{item.subtotal}</td>
                      <td className='table-data' style={{ textAlign: 'center'}}>{item.cgst}</td>
                      <td className='table-data' style={{ textAlign: 'center'}}>{item.sgst}</td>
                      <td className='table-data' style={{ textAlign: 'center'}}>{roundValue(item.total).action === 'removed'? '-' : ''}{' '}{roundValue(item.total).remainingFractionalPart}</td>
                      <td className='table-data' style={{ textAlign: 'center'}}>{item.total}</td>
                    </tr>
                  ))}
                  </tbody>
                </table> 
                
              </div>
              <div className='total_table'>
              <table className='table_structure'>
                <thead>
                    <tr>
                    <th className='table_head'>Sub Total (₹)</th>
                    <th className='table_head'>CGST (₹)</th>
                    <th className='table_head'>SGST (₹)</th>
                    <th className='table_head'>Total GST (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td className='table_data'>{total.totalSubtotal}</td>
                    <td className='table_data'>{total.totalCgst}</td>
                    <td className='table_data'>{total.totalSgst}</td>
                    <td className='table_data'>{total.totalGst}</td>
                    </tr>
                </tbody>
                </table>
              </div>
        </div>
        <div className="btn_container">
            <button className='btn_primary' onClick={() => printReceipt()}>Print</button>
            <button className='btn_primary' onClick={() => generateReceipt()}>Download</button>
            <button className='btn_cancel' onClick={() => handleClose()}>Cancel</button>
        </div>
         </div>
    </div>
  )
}

export default SummeryPdf
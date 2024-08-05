import React, { useEffect, useState } from 'react'
import {jsPDF} from 'jspdf'
import { IoCloseSharp } from "react-icons/io5";
import html2canvas from 'html2canvas';

function InvoicePdf({invoice, setInvoice}) {

    const [particulars, setParticulars] = useState([])
    const blankRows = new Array(20).fill(null);

    const generateReceipt = () => {

        const input = document.getElementById('generatePdf');
        html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${invoice.invoiceno}.pdf`);
    });
      };

      const printReceipt = () => {
        generateReceipt();
        window.electronAPI.print('print-invoice', `Invoice-${invoice.invoiceno}.pdf`);
      }

      const handleClose = ()=>{
        setInvoice(null)
      }

      const fetchParticulars = async()=>{
        const result = await window.electronAPI.getParticulars(invoice.invoiceno);
        console.log(result);
        setParticulars(result)
      }

      function numberToWords(num) {
        if (num === 0) return 'Zero';

    const belowTwenty = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 
        'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const tens = [
        '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];
    const thousands = [
        '', 'Thousand', 'Million', 'Billion'
    ];

    function helper(num) {
        if (num === 0) return '';
        else if (num < 20) return belowTwenty[num] + ' ';
        else if (num < 100) return tens[Math.floor(num / 10)] + ' ' + belowTwenty[num % 10] + ' ';
        else return belowTwenty[Math.floor(num / 100)] + ' Hundred ' + helper(num % 100);
    }

    let word = '';
    let i = 0;

    while (num > 0) {
        if (num % 1000 !== 0) {
            word = helper(num % 1000) + thousands[i] + ' ' + word;
        }
        num = Math.floor(num / 1000);
        i++;
    }

    return word.trim();
}

function convertAmountToWords(amount) {
    const [integerPart, fractionalPart] = amount.toString().split('.');

    const integerInWords = numberToWords(parseInt(integerPart));
    const fractionalInWords = fractionalPart ? numberToWords(parseInt(fractionalPart)) : '';

    let result = `${integerInWords} rupees`;
    if (fractionalInWords) {
        result += ` and ${fractionalInWords} paise`;
    }
    result += ' only';

    return result;
    }


      useEffect(() => {
        fetchParticulars()
      },[])
  return (
    <div className='addclient'>
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
                  <p className='tax-btn'>Tax Invoice</p>
                  <p className='invoice_no' style={{margin:'30px 0'}}>Invoice No: {invoice.invoiceno}</p>
                  <p className='date'>Date: {invoice.date.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="client_info">
                <div className="left">
                <h2 className='client_name'>{invoice.clientname}</h2>
                <p className='address'>{invoice.address}</p>
                <p className='gstin'>GSTIN: {invoice.gstin}</p>
                <p className='state'>State Name: Maharashtra, Code: 27</p>
                </div>
                <div className="right">
                  <p className='remark'>{invoice.remark}</p>
                </div>
              </div>
              <div className="particulars">
                <table className="table">
                  <thead>
                  <tr>
                    <th className='table-head' style={{width: '7%'}}>Sr. No.</th>
                    <th className='table-head'>Particulars</th>
                    <th className='table-head' style={{width: '7%'}}>SAC/HSN</th>
                    <th className='table-head' style={{width: '7%'}}>Quantity</th>
                    <th className='table-head' style={{width: '7%'}}>Rate</th>
                    <th className='table-head' style={{width: '10%'}}>Amount</th>
                  </tr>
                  </thead>
                  <tbody>
                  {particulars.map((item, index) => (
                    <tr key={index}>
                      <td className='table-data' style={{width: '7%', textAlign: 'center'}}>{index + 1}</td>
                      <td className='table-data ' style={{textAlign: 'left', whiteSpace:'pre-wrap', lineHeight:'1.5'}}>{item.particulars}</td>
                      <td className='table-data' style={{width: '7%', textAlign: 'center'}}>{invoice.sacforclient}</td>
                      <td className='table-data' style={{width: '7%', textAlign: 'center'}}>{item.quantity}</td>
                      <td className='table-data' style={{width: '7%', textAlign: 'center'}}>{item.rate}</td>
                      <td className='table-data' style={{width: '10%', textAlign: 'center'}}>{item.rowsubtotal}</td>
                    </tr>
                  ))}
                  {/* Render four blank rows */}
                  {blankRows.map((_, index) => (
                    <tr key={`blank-${index}`}>
                      <td className='table-data' style={{width: '7%'}}></td>
                      <td className='table-data' ></td>
                      <td className='table-data' style={{width: '7%', }} ></td>
                      <td className='table-data' style={{width: '7%', }}></td>
                      <td className='table-data' style={{width: '7%', }}></td>
                      <td className='table-data' style={{width: '10%', }}></td>
                    </tr>
                  ))}
                  {/* Render the row with paragraphs and nested table */}
                    <tr style={{border:'1px solid #000'}}>
                      <td colSpan={3}>
                        <div className="bank_details">
                          <p className='info_title'>Bank Account Details:</p>
                          <p><span>Bank Name: </span>{invoice.bankname}</p>
                          <p><span>Branch:</span> {invoice.bankbranch}</p>
                          <p><span>A/c Number:</span> {invoice.bankaccno}</p>
                          <p><span>IFSC:</span> {invoice.bankifsc}</p>
                        </div>
                      </td>
                      <td colSpan={2} style={{border:'1px solid #000'}}>
                        <table className="nested_table">
                          <tbody>
                              <tr >
                                <td className='td' >Total :</td>
                              </tr>
                              <tr>
                                <td  className='td'>CGST 9% :</td>
                                
                                
                              </tr>
                              <tr>
                                <td  className='td' >SGST 9% :</td>
                                
                                
                              </tr>
                              <tr>
                                <td  className='td'>Round Off :</td>
                                
                                
                              </tr>
                              <tr>
                                <td className='td' style={{border: 'none'}} >Grand Total :</td>
                                
                                
                              </tr>
                          </tbody>
                        </table>
                      </td>
                      <td colSpan={1} style={{border:'1px solid #000'}}>
                        <table className="nested_table">
                          <tbody>
                              <tr >
                                <td className='td' >₹ {invoice.subtotal}</td>
                              </tr>
                              <tr>
                                <td  className='td'>₹ {invoice.cgst}</td>
                                
                                
                              </tr>
                              <tr>
                                <td  className='td' >₹ {invoice.sgst}</td>
                                
                                
                              </tr>
                              <tr>
                                <td  className='td'>₹ {(invoice.total - Math.floor(invoice.total)).toFixed(2)}</td>
                                
                                
                              </tr>
                              <tr>
                                <td className='td' style={{border: 'none'}} >₹ {invoice.total}</td>
                                
                                
                              </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table> 

              </div>
              <p className='rupee_in_words'>Rupees In Words: <span> {convertAmountToWords(invoice.total)}</span></p>
              <div className="footer">
                <div className="declaration">
                  <p className='info_title'>Declaration:</p>
                  <p>
                    "I/We hereby certify that our certification under the Maharashtra Goods and Service Tax Act 2017 and central Goods and Service Act 2017 are in force on which the sale of 
                   goods specified in this tax invoice made by us and that the transaction of sale is coverd by this tax invoice has been effected by us. It shall be accounted for in the turnouver of sales while filling of return and the due tax. If any, Payable on 
                   the sales has been paid of shall be paid"</p>
                </div>
                <div className="sign">
                  <p className='info_title'>Quality Book Binders</p>
                  <p>Proprietor</p>
              </div>
              </div>
              <p className='footer_text'>Subject to Kolhapur Jurisdiction</p>
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

export default InvoicePdf
import React, { useEffect, useState } from 'react'
import {jsPDF} from 'jspdf'
import { IoCloseSharp } from "react-icons/io5";
import html2canvas from 'html2canvas';
import ConfirmModal from './ConfirmModal';
import {createRoot} from 'react-dom/client';
import books from '../assets/book.png';
import quality from '../assets/logo.JPG';

function InvoicePdf({invoice, setInvoice}) {

    const [particulars, setParticulars] = useState([])
    const [roundValues, setRoundValues] = useState(null)

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

    function showConfirmModal(message) {
      
      return new Promise((resolve, reject) => {
        const modalRoot = document.createElement('div');
        const root = createRoot(modalRoot)
        document.body.appendChild(modalRoot);
    
        const handleConfirm = () => {
          cleanup();
          resolve(true);
        };
    
        const handleCancel = () => {
          cleanup();
          resolve(false);
        };
    
        const cleanup = () => {
          root.unmount();
          document.body.removeChild(modalRoot);
        };
    
        root.render(
          <ConfirmModal
            message={message}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        );
      });
    }


const print = async () => {

  const input = document.getElementById('generatePdf');
    html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Convert PDF to Base64
        const pdfBase64 = pdf.output('datauristring');
        window.electronAPI.generatePDF('generatePDF', pdfBase64);

        pdf.save(`Invoice-${invoice.invoiceno}.pdf`);
    });

};


      const fetchParticulars = async()=>{
            const result = await window.electronAPI.getParticulars(invoice.invoiceno);
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
    if (fractionalInWords && fractionalInWords != 'Zero') {
        result += ` and ${fractionalInWords} paise`;
    }
    result += ' only';

    return result;
    }


    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const handlePrint = async () => {
      fetchParticulars();

      const isRoundOff = await showConfirmModal('Do you want to round off the amount?');
      if (isRoundOff) {
          const round = roundValue(invoice.total);
          setRoundValues(round);
      } else {
          print(); // Call print immediately if no round-off is required
      }
  };


      useEffect(() => {
        // fetchParticulars()
        if(roundValues !== null){
          print()
        }
        
      },[roundValues])
      useEffect(() => {
        handlePrint()
      },[])
  return (
    <div className='addclient'>
        <div className='modal_content'>
        <IoCloseSharp className='close' onClick={() => handleClose()} />
            <div id='generatePdf' style={{
              padding: "14px 24px",
              boxSizing: "border-box",
              width: "100%",
              height: "100%",
              position: "relative",
              pageBreakAfter: "always"
            }}>
              <p className='shree' style={{
              color: "red",
              fontSize: "1.875rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "1rem"
            }}>|| &#x0936;&#x094D;&#x0930;&#x0940; ||</p>
              <div className="header" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <div className="business_info" style={{
                  position: "relative",
                  width: "60%",
                  borderLeft: "1px solid #000",
                  borderTop: "1px solid #000",
                  borderBottom: "1px solid #000",
                  padding: "14px",
                  boxSizing: "border-box"
                }}>
                  <div className="logo" style={{
                        position: "relative",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "24px"
                      }}>
                    <div className="left" style={{
                      position: "relative",
                      width: "30%"
                    }}>
                      <img src={books} style={{width: "50px", height: "50px", marginBottom:"18px"}} alt="books" />
                      <p className='log_title' style={{
                                        fontWeight: "bold",
                                        fontSize: "18px",
                                        color: "blueviolet",
                                        width: "70%",
                                        textAlign: "center"
                                      }}>All King Of Official Book Binding</p>
                    </div>
                    <div className="right" style={{
                        position: "relative",
                        width: "70%"
                      }}>
                      <img src={quality} style={{width: "350px", height: "90px"}} alt="quality text" />
                      <p className='binders' style={{
                          fontSize: "48px",
                          color: "#0000FF", // Replace with the appropriate hex code for `$theme-blue`
                          fontWeight: 700,
                          marginLeft: "79px",
                          fontFamily: '"Free Sans", sans-serif',
                          letterSpacing: "2px",
                          marginTop:'-12px'
                        }}>Book Binders</p>
                    </div>
                  </div>
                  <p className='address' style={{
                    width: "80%",
                    lineHeight: "1.3",
                    fontSize: "20px",
                    paddingBottom: "14px"
                  }}>1226, 'A' Ward, Plot 1/A, Chopade Mala, Laxtirtha Vasahat East, Rankala Parisar Kolhapur, 416010</p>
                  <div className="contact" style={{marginTop:"12px"}}>
                    <p style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      letterSpacing: "0.5px",
                      marginBottom: "4px"
                    }}>GSTIN: 27AHPPK1838G1ZA</p>
                    <p style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      letterSpacing: "0.5px",
                      marginBottom: "4px"
                    }}>PAN: AHPPK1828G</p>
                    <p style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      letterSpacing: "0.5px",
                      marginBottom: "4px"
                    }}>State Name: Maharashtra, Code: 27</p>
                    <p style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      letterSpacing: "0.5px",
                      marginBottom: "4px"
                    }}>Contact: +91 9421284184, +91 9011636467</p>
                    <p style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      letterSpacing: "0.5px",
                      marginBottom: "4px"
                    }}>Email: eknathkhadye90@gmail.com</p>
                  </div>
                </div>
                <div className="invoice_detail" style={{
                  position: "relative",
                  width: "40%",
                  border: "1px solid #000",
                  padding: "14px",
                  minHeight: "374px"
                }}>
                  <p className='tax-btn' style={{
                    textAlign: "center",
                    padding: "18px",
                    background: "#4D4DFF",
                    color: "#fff",
                    width: "230px",
                    margin: "18px auto",
                    fontWeight: "700",
                    fontSize: "24px"
                  }}>Tax Invoice</p>
                  <p className='invoice_no' style={{margin:'48px 0',
                            textAlign: "center",
                            fontSize: "28px",
                            fontWeight: "bold"
                          }}>Invoice No: {invoice.invoiceno}</p>
                  <p className='date' style={{
                    textAlign: "center",
                    fontSize: "28px",
                    fontWeight: "bold",
                    marginBottom: "18px"
                  }}>Date: {formatDate(invoice.date)}</p>
                </div>
              </div>
              <div className="client_info" style={{
                  padding: "18px 14px",
                  position: "relative",
                  borderLeft: "1px solid #000",
                  borderRight: "1px solid #000",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start"
                }}>
                <div className="left" style={{width: "50%"}}>
                <h2 className='client_name' style={{marginBottom: "12px", fontSize: "25px"}}>{invoice.clientname}</h2>
                <p className='address' style={{marginBottom: '12px',fontSize: '22px'}}>{invoice.address}</p>
                <p className='gstin' style={{marginBottom: '12px',fontSize: '22px', fontWeight: 'bold'}}>GSTIN: {invoice.gstin}</p>
                <p className='state' style={{marginBottom: '12px',fontSize: '22px'}}>State Name: Maharashtra, Code: 27</p>
                </div>
                <div className="right" style={{width: '50%',textAlign: 'center'}}>
                  <p className='remark' style={{fontWeight: 'bold',fontSize: '22px'}}>{invoice.remark}</p>
                </div>
              </div>
              <div className="particulars" style={{width: '100%'}}>
                <table className="table" style={{
                  width: "100%",
                  border: "1px solid #000",
                  borderCollapse: "collapse"
                }}>
                  <thead>
                  <tr>
                    <th className='table-head' style={{width: '7%',
                      border: "1px solid #000",
                      borderCollapse: "collapse",
                      padding: "10px",
                      color: "#fff",
                      textAlign: "center",
                      background: "#4D4DFF",
                      fontWeight: "bold",
                      fontSize: "20px"
                    }}>Sr. No.</th>
                    <th className='table-head' style={{
                      border: "1px solid #000",
                      borderCollapse: "collapse",
                      padding: "10px",
                      color: "#fff",
                      textAlign: "center",
                      background: "#4D4DFF",
                      fontWeight: "bold",
                      fontSize: "20px"
                    }}>Particulars</th>
                    <th className='table-head' style={{width: '12%',
                      border: "1px solid #000",
                      borderCollapse: "collapse",
                      padding: "10px",
                      color: "#fff",
                      textAlign: "center",
                      background: "#4D4DFF",
                      fontWeight: "bold",
                      fontSize: "20px"
                    }}>SAC/HSN</th>
                    <th className='table-head' style={{width: '10%',
                      border: "1px solid #000",
                      borderCollapse: "collapse",
                      padding: "10px",
                      color: "#fff",
                      textAlign: "center",
                      background: "#4D4DFF",
                      fontWeight: "bold",
                      fontSize: "20px"
                    }}>Quantity</th>
                    <th className='table-head' style={{width: '12%',
                      border: "1px solid #000",
                      borderCollapse: "collapse",
                      padding: "10px",
                      color: "#fff",
                      textAlign: "center",
                      background: "#4D4DFF",
                      fontWeight: "bold",
                      fontSize: "20px"
                    }}>Rate</th>
                    <th className='table-head' style={{width: '12%',
                      border: "1px solid #000",
                      borderCollapse: "collapse",
                      padding: "10px",
                      color: "#fff",
                      textAlign: "center",
                      background: "#4D4DFF",
                      fontWeight: "bold",
                      fontSize: "20px"
                    }}>Amount</th>
                  </tr>
                  </thead>
                  <tbody>
                  {particulars.map((item, index) => (
                    <tr key={index}>
                      <td className='table-data' style={{width: '8%', textAlign: 'center',borderRight: "1px solid #000",
                          padding: "10px",
                          fontSize: "22px"}}>{index + 1}</td>
                      <td className='table-data ' style={{textAlign: 'left', whiteSpace:'pre-wrap', lineHeight:'1.5',borderRight: "1px solid #000",
                          padding: "10px",
                          fontSize: "22px"}}>{item.particulars}</td>
                      <td className='table-data' style={{width: '7%', textAlign: 'center',borderRight: "1px solid #000",
                          padding: "10px",
                          fontSize: "22px"}}>{invoice.sacforclient}</td>
                      <td className='table-data' style={{width: '7%', textAlign: 'center',borderRight: "1px solid #000",
                          padding: "10px",
                          fontSize: "22px"}}>{item.quantity}</td>
                      <td className='table-data' style={{width: '7%', textAlign: 'center',borderRight: "1px solid #000",
                          padding: "10px",
                          fontSize: "22px"}}>{parseFloat(item.rate).toFixed(2)}</td>
                      <td className='table-data' style={{width: '10%', textAlign: 'center',borderRight: "1px solid #000",
                          padding: "10px",
                          fontSize: "22px"}}>{item.rowsubtotal}</td>
                    </tr>
                  ))}
                  {/* Render four blank rows */}
                  {new Array((particulars.length  > 5 ? particulars.length + 2 : 5) - (particulars.length)).fill(null).map((_, index) => (
                    <tr key={`blank-${index}`} style={{height: '85px'}}>
                      <td className='table-data' style={{width: '7%',
                          borderRight: "1px solid #000",
                          padding: "10px",
                          fontSize: "22px"
                        }}></td>
                      <td className='table-data' style={{
                          borderRight: "1px solid #000",
                          padding: "10px",
                          fontSize: "22px"
                        }}></td>
                      <td className='table-data' style={{width: '7%',
                          borderRight: "1px solid #000",
                          padding: "10px",
                          fontSize: "22px"
                        }}></td>
                      <td className='table-data' style={{width: '7%',
                          borderRight: "1px solid #000",
                          padding: "10px",
                          fontSize: "22px"
                        }}></td>
                      <td className='table-data' style={{width: '7%',
                          borderRight: "1px solid #000",
                          padding: "10px",
                          fontSize: "22px"
                        }}></td>
                      <td className='table-data' style={{width: '10%',
                          borderRight: "1px solid #000",
                          padding: "10px",
                          fontSize: "22px"
                        }}></td>
                    </tr>
                  ))}
                  {/* Render the row with paragraphs and nested table */}
                    <tr style={{border:'1px solid #000'}}>
                      <td colSpan={3}>
                        <div className="bank_details" style={{paddingLeft: "80px"}}>
                          <p className='info_title' style={{
                            fontWeight: "bold",
                            fontSize: "22px",
                            marginBottom: "24px"
                          }}>Bank Account Details:</p>
                          <p style={{fontSize: '22px',marginBottom: '12px'}}><span style={{fontWeight: 'bold'}}>Bank Name: </span>{invoice.bankname}</p>
                          <p style={{fontSize: '22px',marginBottom: '12px'}}><span style={{fontWeight: 'bold'}}>Branch:</span> {invoice.bankbranch}</p>
                          <p style={{fontSize: '22px',marginBottom: '12px'}}><span style={{fontWeight: 'bold'}}>A/c Number:</span> {invoice.bankaccno}</p>
                          <p style={{fontSize: '22px',marginBottom: '12px'}}><span style={{fontWeight: 'bold'}}>IFSC:</span> {invoice.bankifsc}</p>
                        </div>
                      </td>
                      <td colSpan={2} style={{border:'1px solid #000'}}>
                        <table className="nested_table" style={{width: '100%'}}>
                          <tbody>
                              <tr >
                                <td className='td'  style={{fontWeight: 'bold',
                                  padding: "10px",
                                  borderBottom: "1px solid #000",
                                  fontSize: "22px"
                                }}>Total :</td>
                              </tr>
                              <tr>
                                <td  className='td' style={{fontWeight: 'bold',
                                  padding: "10px",
                                  borderBottom: "1px solid #000",
                                  fontSize: "22px"
                                }}>CGST 9% :</td>
                                
                                
                              </tr>
                              <tr>
                                <td  className='td' style={{fontWeight: 'bold',
                                  padding: "10px",
                                  borderBottom: "1px solid #000",
                                  fontSize: "22px"
                                }} >SGST 9% :</td>
                                
                                
                              </tr>
                              {roundValues !== null && 
                              <tr>
                              <td  className='td' style={{fontWeight: 'bold',
                                  padding: "10px",
                                  borderBottom: "1px solid #000",
                                  fontSize: "22px"
                                }}>Round Off :</td>
                              
                              
                            </tr>
                              }
                              
                              <tr>
                                <td className='td' style={{border: 'none', fontWeight: 'bold',
                                  padding: "10px",
                                  fontSize: "22px"
                                }} >Grand Total :</td>
                                
                                
                              </tr>
                              {
                                roundValues === null &&
                                <tr>
                                  <td className='td' style={{border: 'none', fontWeight: 'bold',
                                  padding: "10px",
                                  fontSize: "22px"
                                }} ></td>
                                </tr>
                              }
                          </tbody>
                        </table>
                      </td>
                      <td colSpan={1} style={{border:'1px solid #000'}}>
                        <table className="nested_table" style={{width: '100%'}}>
                          <tbody>
                              <tr >
                                <td className='td' style={{
                                  padding: "10px",
                                  borderBottom: "1px solid #000",
                                  fontSize: "22px"
                                }} >₹ {invoice.subtotal}</td>
                              </tr>
                              <tr>
                                <td  className='td' style={{
                                  padding: "10px",
                                  borderBottom: "1px solid #000",
                                  fontSize: "22px"
                                }}>₹ {invoice.cgst}</td>
                                
                                
                              </tr>
                              <tr>
                                <td  className='td' style={{
                                  padding: "10px",
                                  borderBottom: "1px solid #000",
                                  fontSize: "22px"
                                }} >₹ {invoice.sgst}</td>
                                
                                
                              </tr>
                              {roundValues !== null &&
                              <tr>
                              <td  className='td' style={{
                                  padding: "10px",
                                  borderBottom: "1px solid #000",
                                  fontSize: "22px"
                                }}>₹ {roundValues.action === 'removed'? '-' : ''}{' '}{roundValues.remainingFractionalPart}</td>
                            </tr>
                              }
                              <tr>
                                <td className='td' style={{border: 'none',
                                  padding: "10px",
                                  fontSize: "22px"
                                }} >₹ {roundValues !== null ? roundValues.roundedValue: invoice.total}</td>
                                
                                
                              </tr>
                              {roundValues === null && 
                              <tr>
                                <td className='td' style={{border: 'none',
                                  padding: "10px",
                                  fontSize: "22px"
                                }} ></td>
                              </tr>
                              }
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table> 

              </div>
              <p className='rupee_in_words' style={{
                padding: "14px 14px",
                fontSize: "24px",
                borderLeft: "1px solid #000",
                borderRight: "1px solid #000"
              }}>Rupees In Words: <span style={{fontWeight: 'bold',fontSize: '22px'}}> {convertAmountToWords(roundValues !== null ? roundValues.roundedValue: invoice.total)}</span></p>
              <div className="footer" style={{
                  padding: "16px 16px",
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #000",
                  borderLeft: "1px solid #000",
                  borderRight: "1px solid #000"
                }}>
                <div className="declaration" style={{width: '75%'}}>
                  <p className='info_title' style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginBottom: "4px"
                  }}>Declaration:</p>
                  <p style={{fontSize: '16px',width: '75%'}}>
                    "I/We hereby certify that our certification under the Maharashtra Goods and Service Tax Act 2017 and central Goods and Service Act 2017 are in force on which the sale of 
                   goods specified in this tax invoice made by us and that the transaction of sale is coverd by this tax invoice has been effected by us. It shall be accounted for in the turnouver of sales while filling of return and the due tax. If any, Payable on 
                   the sales has been paid of shall be paid"</p>
                </div>
                <div className="sign" style={{
                    width: "25%",
                    textAlign: "center",
                    paddingTop: "14px"
                  }}>
                  <p className='info_title' style={{
                    fontWeight: "bold",
                    fontSize: "22px",
                    marginBottom: "64px"
                  }}>Quality Book Binders</p>
                  <p style={{fontSize: '20px'}}>Proprietor</p>
              </div>
              </div>
              <p className='footer_text' style={{
                width: "100%",
                textAlign: "center",
                margin: "16px",
                fontSize: "20px",
                fontWeight: "bold",
                paddingBottom: "16px"
              }}>Subject to Kolhapur Jurisdiction</p>
            </div>

            <div className="btn_container">
            {/* <button className='btn_primary' onClick={() => printReceipt()}>Print</button> */}
            <button className='btn_primary' onClick={() => generateReceipt()}>Download</button>
            <button className='btn_cancel' onClick={() => handleClose()}>Cancel</button>
        </div>
        </div>

        
    </div>
  )
}

export default InvoicePdf
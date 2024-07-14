import React from 'react'
import {jsPDF} from 'jspdf'

function InvoicePdf({invoice}) {

    console.log(invoice, 'invoice from pdf');

    const generateReceipt = () => {
        // setGenerateFeeReceiptModal(true);
        var doc = new jsPDF("p", "pt", "a4");
        // doc = addWaterMark(doc);
        doc.html(document.querySelector("#generatePdf"), {
          callback: function (pdf) {
            pdf.save("test.pdf");
          },
        });
      };

      const printReceipt = () => {
        generateReceipt();
        window.electronAPI.print('print-invoice', 'test.pdf');
      }
  return (
    <div className='addClient'>
        <div id='generatePdf'>
            <h1>Generate Invoice</h1>
            <h2>Quality Book Binding</h2>
            <button onClick={generateReceipt}>Generate</button>
            <button onClick={printReceipt}>print</button>
        </div>
    </div>
  )
}

export default InvoicePdf
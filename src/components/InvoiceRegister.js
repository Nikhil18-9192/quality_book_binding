import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import InvoicePdf from './InvoicePdf';
import Pdf from './Pdf';
import {createRoot} from 'react-dom/client';
import ConfirmModal from './ConfirmModal.js';

function InvoiceRegister() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [print, setPrint] = useState(false)
  const [client, setClient] = useState({
    clientname:'',
    clientid:'',
    bankname:'',
    bankifsc:'',
    bankaccountnumber:'',
    bankbranch:'',
    clientgstin:'',
    sacforclient:''
  })
  const [addresses, setAddreses] = useState([])
  const [lastInvoice, setLastInvoice] = useState({})
  const [invoiceDetail, setINvoiceDetail] = useState({
    invoiceno:'',
    clientid:'',
    address:'',
    invoicedate:'',
    subtotal:'',
    total:'',
    cgst:'',
    sgst:'',
    remark:'',
    perticulars:[]
  })

  const [perticular, setPerticular] = useState({
    description:'Binding of ',
    quantity:'',
    rate:'',
    total:'',
    cgst:'',
    sgst:'',
    subtotal:''
  })

  const [invoice, setInvoice] = useState(null)

  const [roundValues, setRoundValues] = useState(null)
  const [particulars, setParticulars] = useState([])
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



  const goBack = () => {
    navigate(-1)
  }

  const getInvoiceDetails = async()=>{
    const result = await window.electronAPI.getInvoiceDetails();
    const today = new Date();
    const invoiceno = getNextInvoiceNumber(result.latest_invoice, today)
    setClients(result.all_clients)
    setLastInvoice(result.latest_invoice)
    setINvoiceDetail({...invoiceDetail, invoiceno:invoiceno, invoicedate:today.toISOString().slice(0, 10)})
  }

  function getNextInvoiceNumber(lastInvoiceDetails, newInvoiceDate) {
    // Parse the last invoice date and new invoice date to Date objects
    const lastInvoiceDate = new Date(lastInvoiceDetails.date);
    const newInvoice = new Date(newInvoiceDate);

  
    // Extract year and month from the dates
    const lastInvoiceYear = lastInvoiceDate.getFullYear();
    const lastInvoiceMonth = lastInvoiceDate.getMonth(); // 0-indexed (0 = January, 2 = March, 3 = April)
    const newInvoiceYear = newInvoice.getFullYear();
    const newInvoiceMonth = newInvoice.getMonth(); // 0-indexed (0 = January, 3 = April)
    
    // Check if the last invoice date is in March and the new invoice date is in April of the next financial year
    if ((lastInvoiceMonth === 2 && newInvoiceMonth > 2) || (lastInvoiceMonth ===2 && newInvoiceMonth <= 2 && newInvoiceYear > lastInvoiceYear)) {
      return 1; // Reset invoice number to 1
    } else {
      return lastInvoiceDetails.invoiceno + 1; // Increment the last invoice number by 1
    }
  }

  const handleSelectClient = async(e) => {
    const value = e.target.value
    setINvoiceDetail({
      ...invoiceDetail,
      clientid:value
    })
    const clientData = await window.electronAPI.getClient(value);
    setClient(clientData)
    const result = await window.electronAPI.getAddressList(value);
    setAddreses(result)
  }

  const handleSelectAddress = async(e) => {
    const value = e.target.value
    setINvoiceDetail({
      ...invoiceDetail,
      address:value
    })
  }

  const handleChange = (e) => {
    const {name, value} = e.target

    if(name == 'invoicedate'){
      const newInvoiceNo = getNextInvoiceNumber(lastInvoice, value)
      setINvoiceDetail({
        ...invoiceDetail,
        [name]: value,
        invoiceno: newInvoiceNo
      })
      return
    }
    
    setINvoiceDetail({
      ...invoiceDetail,
      [name]: value
    })
  }

  const handleChangePerticular = (e) => {
    const {name, value} = e.target
    setPerticular({
      ...perticular,
      [name]: value,
    })
  }

  const addPerticular = () => {
    if(perticular.rate == '' || perticular.quantity == ''){
      toast.error('Please fill rate and quantity')
      return
    }
    const updatePerticular = {
      ...perticular,
      cgst: ((Number(perticular.quantity) * Number(perticular.rate)) * 9) / 100,
      sgst: ((Number(perticular.quantity) * Number(perticular.rate)) * 9) / 100,
      subtotal: Number(perticular.quantity) * Number(perticular.rate),
      total: ((Number(perticular.quantity) * Number(perticular.rate)) + ((((Number(perticular.quantity) * Number(perticular.rate)) * 9) / 100)*2)).toFixed(2)
    }
      
    setINvoiceDetail({
      ...invoiceDetail,
      perticulars: [...invoiceDetail.perticulars, updatePerticular],
      subtotal: Number(invoiceDetail.subtotal) + Number(updatePerticular.subtotal),
      total: Number(invoiceDetail.total) + Number(updatePerticular.total),
      cgst: Number(invoiceDetail.cgst) + Number(updatePerticular.cgst),
      sgst: Number(invoiceDetail.sgst) + Number(updatePerticular.sgst),
    })
    setPerticular({
      description:'Binding of ',
      quantity:'',
      rate:'',
      total:'',
      cgst:'',
      sgst:'',
      subtotal:''
    })
  }

  const deletePerticular = (index) => {
    const deletedPerticular = invoiceDetail.perticulars[index]
    const newPerticulars = invoiceDetail.perticulars.filter((_, i) => i !== index)
    setINvoiceDetail({
      ...invoiceDetail,
      perticulars: newPerticulars,
      subtotal: Number(invoiceDetail.subtotal) - Number(deletedPerticular.subtotal),
      total: Number(invoiceDetail.total) - Number(deletedPerticular.total),
      cgst: Number(invoiceDetail.cgst) - Number(deletedPerticular.cgst),
      sgst: Number(invoiceDetail.sgst) - Number(deletedPerticular.sgst),
    })
  }

  const handleSubmit = async () => {

      if(invoiceDetail.invoicedate == '' || invoiceDetail.clientid == ''|| invoiceDetail.address == ''){
        toast.error('Please fill all the fields')
        return
      }
      if(invoiceDetail.perticulars.length == 0){
        toast.error('Please add perticulars')
        return
      }

      const payload = {...invoiceDetail, ...client}
      
      try {
        const result = await window.electronAPI.addInvoice(payload);
        if(result){
          toast.success('Invoice created successfully')
          setINvoiceDetail({
            invoiceno:'',
            clientid:'',
            address:'',
            invoicedate:'',
            subtotal:'',
            total:'',
            cgst:'',
            sgst:'',
            remark:'',
            perticulars:[]
          })
          setPerticular({
            description:'Binding of ',
            quantity:'',
            rate:'',
            total:'',
            cgst:'',
            sgst:'',
            subtotal:''
          })
          setClient({
            clientname:'',
            clientid:'',
            bankname:'',
            bankifsc:'',
            bankaccountnumber:'',
            bankbranch:'',
            clientgstin:'',
            sacforclient:''
          })
          
          if(print){
            setPrint(false)
            setRoundValues(null)
          }
          const data = await window.electronAPI.getParticulars(result.invoice.invoiceno);
          setParticulars(data)
          const isRoundOff = await showConfirmModal('Do you want to round off the amount?');
            
          if (isRoundOff ) {
              const round = roundValue(result.invoice.total);
              setRoundValues(round)
          }

          setInvoice(result.invoice)
          setPrint(true)
        }
        
      } catch (error) {
        toast.error(error.message)
      }

  }

  useEffect(() => {
    getInvoiceDetails()
  },[invoice])
  return (
    <div className='invoice_container'>
      <h3 className='back-btn' onClick={goBack}>{"< Home"}</h3>
      <h1 className='page_title'>Create Invoice</h1>
      <ToastContainer />
      <div className="form_container">
        <form onSubmit={(e)=> e.preventDefault()}>
          <div className="client_info">
          <div>
                <label htmlFor="invoiceno">Invoice No</label>
                <input type="text" name="invoiceno"  id="invoiceno" value={invoiceDetail.invoiceno} disabled/>
            </div>
            <div>
                <label htmlFor="invoiceDate">Invoice Date</label>
                <input type="date" name="invoicedate" id="invoiceDate" value={invoiceDetail.invoicedate} onChange={e=>handleChange(e)}/>
            </div>
            <div>
                <label htmlFor="clientName">Client Name</label>
                <select name="clientName" id="clientName"  value={invoiceDetail.clientid} onChange={e=>handleSelectClient(e)}>
                    <option value="">Select Client</option>
                    {
                        clients.map((client)=>(
                            <option key={client.clientid} value={client.clientid}>{client.clientname}</option>
                        ))
                    }
                </select>
            </div>
            
            <div>
                <label htmlFor="clientAddress">Client Address</label>
                <select name="address" id="address" value={invoiceDetail.address} onChange={e=> handleSelectAddress(e)}>
                    <option value="">Select Address</option>
                    {
                        addresses.map((item)=>(
                            <option key={item.srno} value={item.address}>{item.address}</option>
                        ))
                    }
                </select>
            </div>
            <div>
                <label htmlFor="clientGSTIN">Client GSTIN</label>
                <input type="text" name="clientGSTIN" id="clientGSTIN" value={client.clientgstin} disabled/>
            </div>
            <div>
                <label htmlFor="clientSAC">Client SAC</label>
                <input type="text" name="clientSAC" id="clientSAC" value={client.sacforclient} disabled/>
            </div>
          </div>

          <div className="add_particular">
            <div>
                <label htmlFor="particulars">Particulars</label>
                <textarea name="description" id="description" cols="20" rows="3"   value={perticular.description} onChange={e=>handleChangePerticular(e)}></textarea>
            </div>
            <div>
                <label htmlFor="quantity">Quantity</label>
                <input type="text" name="quantity" id="quantity"  value={perticular.quantity} onChange={e=>handleChangePerticular(e)} />
            </div>
            <div>
                <label htmlFor="rate">Rate</label>
                <input type="text" name="rate" id="rate" value={perticular.rate}  onChange={e=>handleChangePerticular(e)} />
            </div>
            <div>
              <button className='add_btn' onClick={addPerticular}>Add</button>
            </div>
          </div>
          <div className="perticulars_list">
            <table>
              <thead>
                <tr>
                  <th>Particulars</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Sub Total</th>
                  <th>CGST</th>
                  <th>SGST</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceDetail.perticulars.length > 0 && invoiceDetail.perticulars.map((item,index)=>(
                  <tr key={index}>
                    <td  style={{whiteSpace:'pre-wrap', lineHeight:'1.5'}}>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.rate}</td>
                    <td>{item.subtotal}</td>
                    <td>{item.cgst}</td>
                    <td>{item.sgst}</td>
                    <td>{item.total}</td>
                    <td style={{cursor:'pointer', color:'#900'}} onClick={()=>deletePerticular(index)} >Delete</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bottom_section">
            <div className="bank_details">
              <p className="info_title">Bank Details</p>
              <p>Bank Name: {client.bankname}</p>
              <p>Account No: {client.bankaccountnumber}</p>
              <p>IFSC Code: {client.bankifsc}</p>

            </div>
            <div className="remark">
              <label htmlFor="remark">Remark:</label>
              <textarea cols={30} rows={3} name="remark" id="remark" value={invoiceDetail.remark} onChange={e=>handleChange(e)}/>
            </div>
          <div className="total_count">
              <p>Total: <span>₹ {invoiceDetail.subtotal}</span> </p>
              <p>CGST 9%: <span>₹ {invoiceDetail.cgst}</span></p>
              <p>SGST 9%: <span>₹ {invoiceDetail.sgst}</span></p>
              <p>Grand Total: <span>₹ {invoiceDetail.total}</span></p>
            </div>

          </div>
            
            <div className="submit_btn_container">
              <button className='submit_btn' onClick={handleSubmit}>Save and Print</button>
            </div>
        </form>
      </div>
      {/* {invoice && <InvoicePdf invoice={invoice} setInvoice={setInvoice}/>} */}
      {print && <Pdf invoice={invoice} setPrint={setPrint} roundValues={roundValues} setRoundvalues={setRoundValues} particulars={particulars} setParticulars={setParticulars}/>}
    </div>
  )
}


export default InvoiceRegister
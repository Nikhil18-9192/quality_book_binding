import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function InvoiceRegister() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
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
  const [invoiceDetail, setINvoiceDetail] = useState({
    invoiceno:'',
    clientid:'',
    address:'',
    invoicedate:'',
    subtotal:'',
    total:'',
    cgst:'',
    sgst:'',
    perticulars:[]
  })

  const [perticular, setPerticular] = useState({
    description:'Binding of',
    quantity:'',
    rate:'',
    total:'',
    cgst:'',
    sgst:'',
    subtotal:''
  })

  const goBack = () => {
    navigate(-1)
  }

  const getInvoiceDetails = async()=>{
    const result = await window.electronAPI.getInvoiceDetails();
    setClients(result.all_clients)
    setINvoiceDetail({
      ...invoiceDetail,
      invoiceno:result.latest_invoice + 1
    })
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
    const updatePerticular = {
      ...perticular,
      cgst: ((Number(perticular.quantity) * Number(perticular.rate)) * 9) / 100,
      sgst: ((Number(perticular.quantity) * Number(perticular.rate)) * 9) / 100,
      subtotal: Number(perticular.quantity) * Number(perticular.rate),
      total: (Number(perticular.quantity) * Number(perticular.rate)) + ((((Number(perticular.quantity) * Number(perticular.rate)) * 9) / 100)*2)
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

  useEffect(() => {
    getInvoiceDetails()
  },[])
  return (
    <div className='invoice_container'>
      <h3 className='back-btn' onClick={goBack}>{"< Home"}</h3>
      <h1 className='page_title'>Create Invoice</h1>

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
                <textarea name="description" id="description" cols="20" rows="3" value={perticular.description} onChange={e=>handleChangePerticular(e)}></textarea>
            </div>
            <div>
                <label htmlFor="quantity">Quantity</label>
                <input type="text" name="quantity" id="quantity" value={perticular.quantity} onChange={e=>handleChangePerticular(e)} />
            </div>
            <div>
                <label htmlFor="rate">Rate</label>
                <input type="text" name="rate" id="rate" value={perticular.rate} onChange={e=>handleChangePerticular(e)} />
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
                    <td>{item.description}</td>
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
            <div className="total_count">
              <p>Total: ₹{invoiceDetail.subtotal} </p>
              <p>CGST 9%:₹{invoiceDetail.cgst}</p>
              <p>SGST 9%:₹{invoiceDetail.sgst}</p>
              <p>Grand Total: ₹{invoiceDetail.total}</p>
            </div>
            <div className="submit_btn_container">
              <button className='submit_btn'>Submit</button>
            </div>
        </form>
      </div>
        
    </div>
  )
}

export default InvoiceRegister
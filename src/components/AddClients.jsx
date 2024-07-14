import React, { useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";

function AddClients({clients,setAdd, setClients, client, setClient}) {
    const [clientInfo, setClientInfo] = useState({
        clientName: client ? client.clientname : '',
        bankName: client ? client.bankname : '',
        ifsc: client ? client.bankifsc : '',
        accountNo: client ? client.bankaccountnumber : '',
        branchName: client ? client.bankbranch : '',
        gstin: client ? client.clientgstin : '',
        sac: client ? client.sacforclient : 998912

    })
    const handleChange = (e) => {
        setClientInfo({...clientInfo, [e.target.name]: e.target.value})
    }

    const handleClose = ()=>{
        setAdd(false)
        setClient({})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // validation
        const result = await window.electronAPI.addClients(clientInfo);
        setClients([...clients, result[0]])
        setAdd(false)
        
    }
  return (
    <div className='addclient'>
        <div className="modal_content">
            <h1 className='modal_title'>Add Client</h1>
            <IoCloseSharp className='close' onClick={() => handleClose()} />
            <form className='form' onSubmit={(e)=> handleSubmit(e)}>
                <div className='form_item'>
                    <p className=' title'>Client Name</p>
                    <input type="text" name='clientName' value={clientInfo.clientName} required onChange={(e) => handleChange(e)} placeholder="Client Name" className="form_input" />
                </div>
                <div className='form_item'>
                    <p className=' title'>Bank Name</p>
                    <input type="text" placeholder="Bank Name" value={clientInfo.bankName} required name='bankName' onChange={(e) => handleChange(e)} className="form_input" />
                </div>
                <div className='form_item'>
                    <p className=' title'>IFSC</p>
                    <input type="text" placeholder="IFSC" name='ifsc' value={clientInfo.ifsc} required onChange={(e) => handleChange(e)} className="form_input" />
                </div>
                <div className='form_item'>
                    <p className=' title'>Branch Name</p>
                    <input type="text" placeholder="Branch Name" value={clientInfo.branchName} required name='branchName' onChange={(e) => handleChange(e)} className="form_input" />
                </div>
                <div className='form_item'>
                    <p className=' title'>Account Number</p>
                    <input type="number" placeholder="Account Number" value={clientInfo.accountNo}  required name='accountNo' onChange={(e) => handleChange(e)} className="form_input" />
                </div>
                <div className='form_item'>
                    <p className=' title'>GSTIN</p>
                    <input type="text" placeholder="GSTIN" name='gstin' value={clientInfo.gstin}  onChange={(e) => handleChange(e)} className="form_input" />
                </div>
                <div className='form_item'>
                    <p className=' title'>SAC for Client</p>
                    <input type="number" placeholder="SAC for Client" name='sac' value={clientInfo.sac} onChange={(e) => handleChange(e)} className="form_input" />
                </div>

                <div className="btns">
                <button className="cancel">Cancel</button>
                <button className="submit">{client.hasOwnProperty('clientid') ? 'Update' : 'Add'}</button>
            </div>
            </form>
                
        </div>
    </div>
  )
}

export default AddClients
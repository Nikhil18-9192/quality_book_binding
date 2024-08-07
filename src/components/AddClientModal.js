import React, { useEffect, useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";

function AddClientModal({client, isUpdate, setClose}) { 
    const [formData, setFormData] = useState({
        clientname: client.clientname ? client.clientname : '',
        clientid: client.clientid ? client.clientid : '',
        bankname: client.bankname ? client.bankname : '',
        bankifsc: client.bankifsc ? client.bankifsc : '',
        bankaccountnumber: client.bankaccountnumber ? client.bankaccountnumber : '',
        bankbranch: client.bankbranch ? client.bankbranch : '',
        clientgstin: client.clientgstin ? client.clientgstin : '',
        sacforclient: client.sacforclient ? client.sacforclient : 988912
      })


    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        let result = null
        console.log(formData)
    
        if(isUpdate){
            result = await window.electronAPI.updateClient(client.clientid, formData)
        }else{
            result = await window.electronAPI.addClients(formData)
        }
        setClose(false)
    }

  return (
    <div className='addclient'>
    <div className="add_modal_content">
            <h1 className='modal_title'>{isUpdate ? 'Update': 'Add'} Client</h1>
            <IoCloseSharp className='close' onClick={() => setClose(false)} />
            <form className='form' onSubmit={(e)=> handleSubmit(e)}>
                <div className='form_item'>
                    <p className=' title'>Client Name</p>
                    <input type="text" name='clientname' value={formData.clientname} required onChange={(e) => handleChange(e)} placeholder="Client Name" className="form_input" />
                </div>
                <div className='form_item'>
                    <p className=' title'>Bank Name</p>
                    <input type="text" placeholder="Bank Name" value={formData.bankname} required name='bankname' onChange={(e) => handleChange(e)} className="form_input" />
                </div>
                <div className='form_item'>
                    <p className=' title'>IFSC</p>
                    <input type="text" placeholder="IFSC" name='bankifsc' value={formData.bankifsc} required onChange={(e) => handleChange(e)} className="form_input" />
                </div>
                <div className='form_item'>
                    <p className=' title'>Branch Name</p>
                    <input type="text" placeholder="Branch Name" value={formData.bankbranch} required name='bankbranch' onChange={(e) => handleChange(e)} className="form_input" />
                </div>
                <div className='form_item'>
                    <p className=' title'>Account Number</p>
                    <input type="number" placeholder="Account Number" name='bankaccountnumber' value={formData.bankaccountnumber}  required  onChange={(e) => handleChange(e)} className="form_input" />
                </div>
                <div className='form_item'>
                    <p className=' title'>GSTIN</p>
                    <input type="text" placeholder="GSTIN" name='clientgstin' value={formData.clientgstin}  onChange={(e) => handleChange(e)} className="form_input" />
                </div>
                <div className='form_item'>
                    <p className=' title'>SAC for Client</p>
                    <input type="number" placeholder="SAC for Client" name='sacforclient' value={formData.sacforclient} onChange={(e) => handleChange(e)} className="form_input" />
                </div>

                <div className="btns">
                <button className="cancel" onClick={(e)=> {
                    e.preventDefault()
                    setClose(false)
                }}>Cancel</button>
                <button className="submit">{isUpdate ? 'Update' : 'Add'}</button>
            </div>
            </form>
                
        </div>
        </div>
  )
}

export default AddClientModal
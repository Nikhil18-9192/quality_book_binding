import React, { useEffect, useState } from 'react'
import {createRoot} from 'react-dom/client';
import ConfirmModal from './ConfirmModal'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function ViewClient({client}) {
    
    const [clientInfo, setClientInfo] = useState({
      clientname: client.clientname,
      clientid: client.clientid,
      bankname: client.bankname,
      bankifsc: client.bankifsc,
      bankaccountnumber: client.bankaccountnumber,
      bankbranch: client.bankbranch,
      clientgstin: client.clientgstin,
      sacforclient: client.sacforclient
    })
    const [addresses, setAddresses] = useState([])
    const [address, setAddress] = useState('')

    const fetchAddress = async()=>{
      try {
          const result = await window.electronAPI.getClientAddress(client.clientid)
          
          setAddresses(result)
      } catch (error) {
          console.error(error)
      }
  }
  const handleChange = (e) => {
    setClientInfo({...clientInfo ,[e.target.name]: e.target.value})
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

  const handleUpdate = async (e) => {
    const confirmation = await showConfirmModal("Are you sure you want to update this client?")
    if(!confirmation) return
    let result = null
    result = await window.electronAPI.updateClient(client.clientid, clientInfo)
    }

  const handleAddressDelete = async(id)=>{
    const confirmation = await showConfirmModal("Are you sure you want to delete this address?")
    if(!confirmation) return
    const res =  await window.electronAPI.deleteAddress(id)
    setAddresses(addresses.filter((a)=> a.srno != id))
    toast.success('Address deleted successfully')
  }

  const handleAddAddress = async()=>{
    const confirmation = await showConfirmModal("Are you sure you want to add this address?")
    if(!confirmation) return
    const res = await window.electronAPI.addAddress(client.clientid,client.clientname, address)
    setAddresses([...addresses, res[0]])
    setAddress('')
    toast.success('Address added successfully')
  }




    useEffect(()=>{
        fetchAddress()
    },[])
  return (
    <div className='view_client'>
      <ToastContainer />
      <div className="client_info">
          <div>
                <label htmlFor="clientname">Client Name</label>
                <input type="text" name="clientname"  id="clientname" value={clientInfo.clientname}  onChange={(e)=>handleChange(e)}/>
            </div>
            <div>
                <label htmlFor="bankname">Bank Name</label>
                <input type="text" name="bankname" id="bankname" value={clientInfo.bankname} onChange={(e)=>handleChange(e)}/>
            </div>
           
            <div>
                <label htmlFor="bankbranch">Branch</label>
                <input type="text" name="bankbranch" id="bankbranch" value={clientInfo.bankbranch} onChange={(e)=>handleChange(e)}/>
            </div>
            <div>
                <label htmlFor="bankifsc">IFSC</label>
                <input type="text" name="bankifsc" id="bankifsc" value={clientInfo.bankifsc} onChange={(e)=>handleChange(e)}/>
            </div>
            <div>
                <label htmlFor="bankaccountnumber">Account Number</label>
                <input type="number" name="bankaccountnumber" id="bankaccountnumber" value={clientInfo.bankaccountnumber} onChange={(e)=>handleChange(e)}/>
            </div>
            <div>
                <label htmlFor="clientgstin">GSTIN</label>
                <input type="text" name="clientgstin" id="clientgstin" value={clientInfo.clientgstin} onChange={(e)=>handleChange(e)}/>
            </div>
            <div>
                <label htmlFor="sacforclient">SAC for Client</label>
                <input type="number" name="sacforclient" id="sacforclient" value={clientInfo.sacforclient} onChange={(e)=>handleChange(e)}/>
            </div>
            <button onClick={()=>handleUpdate()}>Edit</button>
          </div>
          <div className="address_view">
          <div className='add_address'>
                <input type="text" name="address" id="address" value={address} onChange={(e)=>setAddress(e.target.value)} />
                <button onClick={()=>handleAddAddress()}>Add Address</button>
            </div>
            <div className="addresses">
            {addresses.map((item,i)=>(
                <div className='address' key={i}>
                <p >{item.address}</p>
                <button className='delete' onClick={()=> handleAddressDelete(item.srno)}>Delete</button>
                </div>
            ))}
            </div>
            
          </div>
    </div>
  )
}

export default ViewClient
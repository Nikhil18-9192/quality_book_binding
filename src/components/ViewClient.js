import React, { useEffect, useState } from 'react'
import AddClientModal from './AddClientModal';

function ViewClient({setView, client, setClient}) {
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

    useEffect(()=>{
        fetchAddress()
    },[])
  return (
    <div className='view_client'>
       <AddClientModal client={clientInfo} isUpdate={true}   setClose={setView}   />
    </div>
  )
}

export default ViewClient
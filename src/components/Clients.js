import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ViewClient from './ViewClient.js';
import AddClientModal from './AddClientModal.js';

function Clients() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [add, setAdd] = useState(false)
  const [view, setView] = useState(false)
  const [clients, setClients] = useState([]);
  const [client, setClient]= useState({
    clientname:'',
    bankname:'',
    bankifsc:'',
    bankaccountnumber:'',
    bankbranch:'',
    clientgstin:'',
    sacforclient:998912
  })

  const fetchClients = async () => {
    try {
      const result = await window.electronAPI.fetchClients();
      setClients(result.sort((a, b)=> a.clientid - b.clientid));
  } catch (error) {
      console.error('Error querying database:', error);
  }
  }

  const handleView = async(id)=>{
    try {
        const result = await window.electronAPI.getClient(id);
        setClient(result)
        setView(true)
    } catch (error) {
        console.log('Error querying database:', error)
        throw error
    }
  }

  const goBack = () => {
    if(view){
      setView(false)
      return
    }
    navigate(-1)
  }
  const handleChange = (e) => {
    setClient({...client, [e.target.name]: e.target.value})
  }

  useEffect(() => {
    fetchClients()
  },[clients])
  return (
    <div className='clients'>
      <h3 className='back-btn' onClick={goBack}>{!view ? "< Home" : "< Back"}</h3>
      <h1 className='page_title'>Clients</h1>
      {!view && 
        <div className="filter_container">
        <input type="text" placeholder="Search Bank Name..." className="search_input" onChange={(e) => setQuery(e.target.value)} />
        <button className="btn" onClick={() => {
          setClient({})
          setAdd(true)
        }}>Add Client</button>
      </div>
      }
      {!view ?(
        <div className="clients_list">
        <table className='table'>
          <thead>
            <tr>
              <th className='table_head'>Id</th>
              <th className='table_head'>Name</th>
              <th className='table_head'>Bank Name</th>
              <th className='table_head'>IFSC</th>
              <th className='table_head'>Branch</th>
              <th className='table_head'>Account Number</th>
              <th className='table_head'>GSTIN</th>
              <th className='table_head'>Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.filter((client) => client.clientname.toLowerCase().includes(query) || client.clientname.toUpperCase().includes(query)).map((client) => (
              <tr key={client.clientid}>
                <td className='table_data'>{client.clientid}</td>
                <td className='table_data' style={{textAlign:'left'}}>{client.clientname}</td>
                <td className='table_data'>{client.bankname}</td>
                <td className='table_data'>{client.bankifsc}</td>
                <td className='table_data'>{client.bankbranch}</td>
                <td className='table_data'>{client.bankaccountnumber}</td>
                <td className='table_data'>{client.clientgstin}</td>
                <td className='table_data' style={{cursor:'pointer', color:'#900'}} onClick={()=>handleView(client.clientid)}>View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ):(
        <ViewClient   client={client} />
      )}
      {add && <AddClientModal client={client}  setClose={setAdd}  />}
    </div>
  );
}

export default Clients;

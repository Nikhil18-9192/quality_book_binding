import React from 'react'

function ConfirmModal({onCancel, onConfirm, message}) {

   
  return (
    <div className='confirm_modal'>
        <div className="confirm_modal_content">
            <h1>{message}</h1>
            <button onClick={() => onConfirm()}>Yes</button>
            <button onClick={() => onCancel()}>No</button>
        </div>
    </div>
  )
}

export default ConfirmModal
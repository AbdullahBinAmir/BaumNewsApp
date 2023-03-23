import React from 'react';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import '../styles/ConfirmAlert.css'

export default function Confirmation({showModal,setShowModal,setDelPermit}) {
    const handleSubmit = () => {
        // code to handle form submission
        // ...
        // close the modal
        setDelPermit(true)
        setShowModal(false);
      };      
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-dialog">
        <div className='message'>
            <p >Are You Sure?</p>
            <FontAwesomeIcon icon={faTimes} style={{height:'20px',color:'#667085',paddingRight:'10px',paddingBottom:'10px'}}
              onClick={()=>setShowModal(false)}            
            />
        </div>
        <button onClick={handleSubmit} className='ok-btn' >Yes</button>
    </Modal>
  )
}

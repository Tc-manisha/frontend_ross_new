import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

export default function LogoutModal({isOpen,handleCancel,onRequestClose}) {

    const handleClose = ()=>{
        onRequestClose();
    }
  return (
    <>
      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>No Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='' >
                <h4>Are You Still Available On Site?</h4>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCancel}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

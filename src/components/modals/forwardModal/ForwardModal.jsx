import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import './forwardModal.scss'
import { Form } from "react-bootstrap";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { useParams } from 'react-router-dom';
import { CallPOSTAPI } from '../../../helper/API';
import Swal from 'sweetalert2';

export default function ForwardModal({ forwardMailModal, setForwardMailModal })
{
    const [ forwardEmail, setForwardEmail ] = useState('');
    const [ validated, setValidated ] = useState(false);
    const { emailId } = useParams();
    // close modal
    const handleClose = () => setForwardMailModal(false);

    // handleSubmit
    const handleSubmit = async(e) =>
    {
        e.preventDefault();
    
        const form = e.currentTarget;
        if (form.checkValidity() == false)
        {
          setValidated(true);
          return;
        }

        // prepare payload data
        let payloadData = {
            id      : emailId,
            email   : forwardEmail
        }

        // call result forward
        const result = await CallPOSTAPI('account/forward-email', payloadData);

        // check for status
        if(result?.status) {
            Swal.fire({
                text: result?.data?.msg,
                icon: 'success',
            })
            setForwardMailModal(false);
        } else if(!result?.status) {
            Swal.fire({
                text: 'Error on forward email',
                icon: 'error',
            })
        }
    };

    return (
        <>
            <Modal show={ forwardMailModal } onHide={ handleClose }
                dialogClassName="modal-240w"
                aria-labelledby=""
                size="lg"
                id="forward-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Forward Email</Modal.Title>
                </Modal.Header>

                {/* body */ }
                <Modal.Body>
                    <div className="modal-container" id="forward-modal-content"  >
                        <div className="my-modal-section">
                            {/* main form */}
                            <Form
                                className=""
                                onSubmit={ handleSubmit }
                                noValidate
                                validated={ validated }
                                id="create-new-account-form"
                            >
                                <div className="container-fluid">

                                    <Form.Group className={ "col" }>
                                        <Form.Label>Email *</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            onChange={ (e) =>  { setForwardEmail(e.target.value) } }
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            This email field is required
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* bottom buttons */}
                                    <div className="col-md-12 d-flex" style={ { marginTop: "25px", justifyContent: "right" } } >
                                        <Button
                                            className={ "btn btn-danger mx-3" }
                                            variant="danger"
                                            style={ { fontSize: "14px" } }
                                            onClick={handleClose}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            className={ "btn btn-success" }
                                            variant="success"
                                            style={ { fontSize: "14px" } }
                                            type="submit"
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

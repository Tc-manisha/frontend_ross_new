import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import './respondModal.scss'
import { Form } from "react-bootstrap";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { useParams } from 'react-router-dom';
import { CallPOSTAPI } from '../../../helper/API';
import Swal from 'sweetalert2';

export default function RespondModal({ respondModal, setRespondModal })
{
    const [ forwardInfo, setForwardInfo ] = useState('');
    const [ validated, setValidated ] = useState(false);
    const { supportId } = useParams();
    // close modal
    const handleClose = () => setRespondModal(false);

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
            ticket_id     : supportId,
            information   : forwardInfo
        }

        // call result forward
        const result = await CallPOSTAPI('support/create-response', payloadData);

        // check for status
        if(result?.data?.status) {
            Swal.fire({
                text: result?.data?.msg,
                icon: 'success',
            })
            setRespondModal(false);
        } else { 
            // (!result?.status)
            Swal.fire({
                text: 'Error on forward email',
                icon: 'error',
            })
        }
    };

    return (
        <>
            <Modal show={ respondModal } onHide={ handleClose }
                dialogClassName="modal-240w"
                aria-labelledby=""
                size="lg"
                id="respond-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Respond Support</Modal.Title>
                </Modal.Header>

                {/* body */ }
                <Modal.Body>
                    <div className="modal-container" id="respond-modal-content"  >
                        <div className="my-modal-section">
                            {/* main form */}
                            <Form
                                className=""
                                onSubmit={ handleSubmit }
                                noValidate
                                validated={ validated }
                                id="create-new-respond-support-form"
                            >
                                <div className="container-fluid">

                                    <Form.Group className={ "col" }>
                                        <Form.Label>Information*</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="information"
                                            onChange={ (e) =>  { setForwardInfo(e.target.value) } }
                                            rows={6}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            The information field is required
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

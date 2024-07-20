import React, { useState } from 'react'
import '../ProductModal/productModal.scss';
import "./InpersonContactModel.scss";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CallGETAPI, CallPOSTAPI } from '../../../helper/API';
import { useParams } from 'react-router-dom';
import { FormControlLabel, Switch } from "@mui/material";
import MessageHandler from '../../common/MessageHandler';


const InpersonContactModel = ({ ShowModal, SetShowModal, classContacts, setClassContacts, setContactRepsList, contactRepsList}) => {
    const [ FormMsg, setFormMsg ] = React.useState({ type: true, msg: "" });
    const [ loading, setLoading ] = React.useState(false);
    const [ handleContactSelectList, setHandleContactSelectList ] = React.useState({});

    const { accountId } = useParams()
    const { siteId } = useParams()

    const btns = (type, contactType) =>
    {
        return <>
            <div className='d-flex align-items-center' style={{height: '40px'}} >
                <span onClick={(e) => {handleAddContact(type, contactType)}} className="select-btn" >+</span>
                <span onClick={(e) => {handleRemoveContact(type, contactType)}} className="elemenate-btn" >-</span>
            </div>
        </>
    }

    const handleClose = () => SetShowModal(false);

    // handle submit function
    const handleSubmit = () =>
    {
        // submit account contacts
        handleInpersonClassSubmit();

    }

    // set primary or backup contact data
    const handleAddContact = (type, contactType) => {
        let contactData = classContacts[contactType];
        if(type == 'primary') {

            if(contactData?.backup_id != handleContactSelectList?.contact_id) {
                let data = {
                    primary_id: handleContactSelectList?.contact_id,
                    primary_name: handleContactSelectList?.contact_name,
                    backup_id: contactData?.backup_id,
                    backup_name: contactData?.backup_name,
                }
                setClassContacts((old) => ({ ...old, [contactType] : data }));
                // setHandleContactSelectList({})
            }
        } else if(type == 'backup') {

            if(contactData?.primary_id != handleContactSelectList?.contact_id) {
                let data = {
                    primary_id: contactData?.primary_id,
                    primary_name: contactData?.primary_name,
                    backup_id: handleContactSelectList?.contact_id,
                    backup_name: handleContactSelectList?.contact_name,
                }
                setClassContacts((old) => ({ ...old, [contactType] : data }));
                // setHandleContactSelectList({})
            }
        } 

    }

    // remove primary or backup contact data
    const handleRemoveContact = (type, contactType) => {
        let contactData = classContacts[contactType];
        if(type == 'primary') {

            let data = {
                primary_id: '',
                primary_name: '',
                backup_id: contactData?.backup_id,
                backup_name: contactData?.backup_name,
            }
            setClassContacts((old) => ({ ...old, [contactType] : data }));

        } else if(type == 'backup') {

            let data = {
                primary_id: contactData?.primary_id,
                primary_name: contactData?.primary_name,
                backup_id: '',
                backup_name: '',
            }
            setClassContacts((old) => ({ ...old, [contactType] : data }));
        } 

    }

    // handle select contact checked
    const handleSelectContact = (data) => {
        setHandleContactSelectList({
            contact_id: data?.contact_id,
            contact_name: data?.contact_name,
        })
    }

    // inperson class contact
    const handleInpersonClassSubmit = async () =>
    {
        let data = {
            account_id: accountId
        }
        data.account_contact = []

        setLoading(false);
        handleClose()
    }

    return (
        <>
            <Modal show={ ShowModal } onHide={ handleClose }
                dialogClassName="inperson-modal"
                aria-labelledby="example-custom-modal-styling-title"
                size="xl"
                id="product-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Assign Class Contacts</Modal.Title>
                </Modal.Header>
                <Modal.Body >

                    <div className="modal-container" id="contact-modal-content"  >
                        <div className="my-modal-section">
                            <div className="upper-div">
                                <div className="products" style={ { maxHeight: '400px', overflowY: 'auto' } }>
                                    <ul>
                                        <li className='title'>Account Contacts</li>
                                        { contactRepsList.map((single, index) => (
                                            <li key={ index } onClick={ (e) => handleSelectContact(single) } className={handleContactSelectList?.contact_id == single.contact_id ? 'bg-primary text-white' : ''}>
                                                <label htmlFor={ 'contact_id_' + single.contact_id } className="checkbox" onClick={ (e) => handleSelectContact(single) }>
                                                    <input type='radio'
                                                        name="contact_id"
                                                        className='d-none'
                                                        onChange={ (e) => handleSelectContact(single) }
                                                        onClick={ (e) => handleSelectContact(single) }
                                                        value={ single.contact_id }
                                                        id={ 'contact_id_' + single.contact_id }
                                                        checked={handleContactSelectList?.contact_id == single?.contact_id ? true : false }
                                                    />
                                                    <span>{ single.contact_name }</span>
                                                </label>
                                            </li>
                                        )) }
                                    </ul>
                                </div>

                                <div className="selected-products">
                                    <ul>
                                        <li className='title'>Assigned Contacts</li>
                                        {/* billing contact */}
                                        <li>
                                            <b>Billing Contact</b><br />
                                            <div className='d-flex my-1' >
                                                <div className=' d-flex align-items-center'>
                                                    <div className='d-flex w-200' >
                                                        { btns('primary', 'billing_contact') }
                                                        <span className='ms-3 mt-2 light-head'><b>Primary: </b>{ classContacts?.billing_contact?.primary_name }</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='d-flex my-1 ' >
                                                <div className='d-flex align-items-center'>
                                                    <div className='d-flex w-200' >
                                                        { btns('backup', 'billing_contact') }
                                                        <span className='ms-3 mt-2 light-head'><b>Backup: </b>{ classContacts?.billing_contact?.backup_name }</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        {/* instructor contact */}
                                        <li>
                                            <b>Instructor Contact</b><br />
                                            <div className='d-flex my-1' >
                                                <div className=' d-flex align-items-center'>
                                                    <div className='d-flex w-200' >
                                                        { btns('primary', 'instructor_contact') }
                                                        <span className='ms-3 mt-2 light-head'><b>Primary: </b>{ classContacts?.instructor_contact?.primary_name }</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='d-flex my-1 ' >
                                                <div className='d-flex align-items-center'>
                                                    <div className='d-flex w-200' >
                                                        { btns('backup', 'instructor_contact') }
                                                        <span className='ms-3 mt-2 light-head'><b>Backup: </b>{ classContacts?.instructor_contact?.backup_name }</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        {/* training_site_cordinator contact */}
                                        <li>
                                            <b>Training Site Cordinator</b><br />
                                            <div className='d-flex my-1' >
                                                <div className=' d-flex align-items-center'>
                                                    <div className='d-flex w-200' >
                                                        { btns('primary', 'training_site_cordinator') }
                                                        <span className='ms-3 mt-2 light-head'><b>Primary: </b>{ classContacts?.training_site_cordinator?.primary_name }</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='d-flex my-1 ' >
                                                <div className='d-flex align-items-center'>
                                                    <div className='d-flex w-200' >
                                                        { btns('backup', 'training_site_cordinator') }
                                                        <span className='ms-3 mt-2 light-head'><b>Backup: </b>{ classContacts?.training_site_cordinator?.backup_name }</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </Modal.Body>

                {/* alert */ }
                <div className="my-4">
                    <MessageHandler
                        status={ FormMsg.type }
                        msg={ FormMsg.msg }
                        HandleMessage={ setFormMsg }
                    />
                </div>

                <Modal.Footer>
                    <button className="Cancel-btn" onClick={ handleClose }>
                        Cancel
                    </button>
                    <button className="submit-btn" type="button" onClick={ handleSubmit }>
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default InpersonContactModel
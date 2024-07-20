import React, { useState } from 'react';
import "./InstructorCourseModal.scss";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CallGETAPI, CallGETAPINEW, CallPOSTAPI, CallPOSTAPINEW } from '../../../helper/API';
import { useParams } from 'react-router-dom';
import { FormControlLabel, Switch } from "@mui/material";
import MessageHandler from '../../common/MessageHandler';
import { useEffect } from 'react';
import { GetAssignedInstructorsByClass } from '../../../helper/BasicFn';
import { sortData } from '../../../helper/Common';
import Moment from 'react-moment';

const InstructorCourseModal = ({ ShowModal, SetShowModal, inpersonCourseName, inpersonCourseId, instructorNeeded, allInstructors}) => {
    const [ FormMsg, setFormMsg ] = React.useState({ type: true, msg: "" });
    const [ loading, setLoading ] = React.useState(false);
    const [ handleContactSelectList, setHandleContactSelectList ] = React.useState({});
    const [ assignedInstructors, setAssignedInstructors ] = React.useState([]);
    const [ AhaDetails, setAhaDetails ] = React.useState({});
    const [ viewInstructor, setviewInstructor ] = React.useState(false);

    const { inpersonId } = useParams()

    const btns = (index, data) =>
    {
        return <>
            <div className='top-buttons' >
                <span className="select-btn" onClick={(e) => {handleAddContact(index, data)}}>+</span>
                <span className="elemenate-btn"  onClick={(e) => {handleRemoveContact(index, data)}}>-</span>
            </div>
        </>
    }

    // handle check click
    const handleCheckClick = (e, data) => {
        setHandleContactSelectList(data)
    }

    const handleClose = () => SetShowModal(false);

    // handle submit function
    const handleSubmit = () =>
    {
        // submit account contacts
        handleInpersonClassSubmit();

    }

    // set primary or backup contact data
    const handleAddContact = (index, data) => {
        let selectedContact = handleContactSelectList;
        let newArray = [];

        let AI = assignedInstructors;

        AI.map((item, index) => {
            if(item.label == data.label) {
                item.contact_id = selectedContact?.contact_id 
                item.contact_name = selectedContact?.contact_name
                item.label = index == 0 ? 'Lead' : 'Asst ' + index
            }
            newArray.push(item);
        })

        setAssignedInstructors(newArray);
    }

    // remove primary or backup contact data
    const handleRemoveContact = (index, data) => {
        let selectedContact = handleContactSelectList;
        let newArray = [];

        let AI = assignedInstructors;

        AI.map((item, index) => {
            if(item.label == data.label) {
                item.contact_id = '' 
                item.contact_name = 'UnAssigned'
                item.label = index == 0 ? 'Lead' : 'Asst ' + index
            }
            newArray.push(item);
        })

        setAssignedInstructors(newArray);
    }

    // inperson class contact
    const handleInpersonClassSubmit = async () =>
    {
        const instructorsData =  assignedInstructors.filter((data) => {
            let contactId = data.contact_id;
            return contactId != '' ;
        })

        let payloadData = {
            class_id: inpersonId,
            class_instructors: instructorsData,
        }

        const result = await CallPOSTAPINEW('account/assign-instructors-to-inperson', payloadData)

        if(result?.status) {
            handleClose();
            getAssignedInstructors();
        }

        setLoading(false);
    }

    // get assigned instructors
    const getAssignedInstructors = async() => {
        const result = await GetAssignedInstructorsByClass(inpersonId)

        if(result?.status) {
            let data = result?.classInstructor?.class_instructors;
            data = JSON.parse(data);

            if(data != null && data.length > 0) 
            {
                let sortedArray = sortData(data, 'contact_name');
                setAssignedInstructors(sortedArray);
            } 
            else 
            {
                if(instructorNeeded && instructorNeeded > 0) {
                    let data = [
                        {
                            contact_id: '', 
                            contact_name: 'UnAssigned',
                            label: 'Lead',
                        }
                    ];
        
                    for(let i = 1; i < instructorNeeded; i++) {
                        let items = {
                            label: 'Asst ' + i,
                            contact_id: '', 
                            contact_name: 'UnAssigned',
                        }
                        data.push(items)
                    }
                    setAssignedInstructors(data);
                }
            }
        }
    }

    // handle view button
    const handleViewInstructor = (contactId) => {
        if(!viewInstructor) {
            setviewInstructor(contactId);
        } else {
            setviewInstructor(!viewInstructor);
        }
    }

    // get aha details
    const getAhaDetails = async(instructorId, index) => {
        const result = await CallGETAPINEW('account/aha-hsi-of-instructor/' + instructorId)

        if(result?.status) {
            setAhaDetails((old) => ({...old, [index] : result?.data?.data}))
        }
    }

    useEffect(() => {
        getAssignedInstructors();
        
    }, [instructorNeeded])

    useEffect(() => {
        allInstructors?.map((instructor,index) => {
            getAhaDetails(instructor.instructor_id, index);
        })
    }, [allInstructors])

    return (
        <>
            <Modal show={ ShowModal } onHide={ handleClose }
                dialogClassName="modal-half"
                aria-labelledby="example-custom-modal-styling-title"
                size="xl"
                id="InstructorCourseModal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Instructor: ({inpersonCourseName})</Modal.Title>
                </Modal.Header>
                <Modal.Body >

                    <div className="modal-container" id="InstructorCourseModal"  >
                        <div className="my-modal-section">
                            <div className="row" style={{marginLeft:"5px"}}>
                                <div className="col-md-6 px-0 instructors" style={ { maxHeight: '400px', overflowY: 'auto'} }>
                                    <div style={{border: '1px solid #0C71C3',}}>
                                        <div className="row mx-0" style={{borderBottom: '1px solid #0C71C3',}}>
                                            <div className="col-6 px-0" >
                                                <h6 className='py-2 px-2' style={{margin: '0px', background: '#999999', fontWeight: 'bold'}}>Instructor</h6>
                                            </div>
                                            <div className="col-3 px-0">
                                                <h6 className='py-2 px-2' style={{margin: '0px', background: '#999999', fontWeight: 'bold'}}>Rating</h6>
                                            </div>
                                            <div className="col-3 px-0">
                                                <h6 className='py-2 px-2' style={{margin: '0px', background: '#999999', fontWeight: 'bold'}}>Credentials</h6>
                                            </div>
                                        </div>
                                        <div className="details">
                                            {allInstructors?.map((data,index) => (
                                                <div key={index}>
                                                    <div className={handleContactSelectList?.contact_id == data?.contact_id ? 'main-row row mx-0 bg-primary text-white' : 'row mx-0'} >
                                                        <div className="col-6 px-0" >
                                                            <div className='py-2 px-2' style={{margin: '0px'}}>
                                                                <label htmlFor={'insert_id_' + data?.contact_name}  >
                                                                    <input
                                                                        name="contact"
                                                                        type="radio" 
                                                                        id={'insert_id_'+ data?.contact_name} 
                                                                        value={data?.contact_name}
                                                                        onChange={(e)=>handleCheckClick(e, data)}
                                                                        checked={handleContactSelectList?.contact_id == data?.contact_id ? true : false}
                                                                        className="d-none"
                                                                    />
                                                                    {data?.contact_name}
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-3 px-0">
                                                            <h6 className='py-2 px-2' style={{margin: '0px'}}>{data?.rating}</h6>
                                                        </div>
                                                        <div className="col-3 px-0">
                                                            <h6 className='py-2 px-2' style={{margin: '0px'}}>
                                                                <span style={{cursor: 'pointer'}}onClick={(e) => handleViewInstructor(data?.contact_id)}>
                                                                    { viewInstructor == data?.contact_id ? 'Hide' : 'View' }
                                                                </span>
                                                            </h6>
                                                        </div>
                                                    </div>
                                                    {/* dropdown menu */}
                                                    {viewInstructor == data?.contact_id ? 
                                                        <div className="dropdown-items row mx-0">
                                                            <div className="col-12 px-0 py-2" style={{margin: '0px', background: '#E4E4E4'}}>
                                                                <span className='px-2'>AHA</span>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{margin: '0px', background: '#fff'}}>
                                                                <p className='px-4 mb-0'>ACLS: <Moment date={AhaDetails[index]?.AHA?.disiplines?.ACLS?.ACLS_expiration_date} format={'MM:DD:YYYY'} /> </p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{margin: '0px', background: '#E4E4E4'}}>
                                                                <p className='px-4 mb-0'>BLS: <Moment date={AhaDetails[index]?.AHA?.disiplines?.BLS?.BLS_expiration_date} format={'MM:DD:YYYY'} /> </p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{margin: '0px', background: '#fff'}}>
                                                                <p className='px-4 mb-0'>Heartsaver: <Moment date={AhaDetails[index]?.AHA?.disiplines?.heart_saver?.heart_saver_expiration_date} format={'MM:DD:YYYY'} /> </p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{margin: '0px', background: '#E4E4E4'}}>
                                                                <p className='px-4 mb-0'>PALS: <Moment date={AhaDetails[index]?.AHA?.disiplines?.PALS?.PALS_expiration_date} format={'MM:DD:YYYY'} /></p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{margin: '0px', background: '#fff'}}>
                                                                <p className='px-2 mb-0'>HSI</p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{margin: '0px', background: '#E4E4E4'}}>
                                                                <p className='px-4 mb-0'>Level 1: <Moment date={AhaDetails[index]?.HSI?.levels?.level_1?.level_1_expiration_date} format={'MM:DD:YYYY'} /></p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{margin: '0px', background: '#fff'}}>
                                                                <p className='px-4 mb-0'>Level 2: <Moment date={AhaDetails[index]?.HSI?.levels?.level_2?.level_2_expiration_date} format={'MM:DD:YYYY'} /></p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{margin: '0px', background: '#E4E4E4'}}>
                                                                <p className='px-4 mb-0'>Level 3: <Moment date={AhaDetails[index]?.HSI?.levels?.level_3?.level_3_expiration_date} format={'MM:DD:YYYY'} /></p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{margin: '0px', background: '#fff'}}>
                                                                <p className='px-4 mb-0'>Level 4: <Moment date={AhaDetails[index]?.HSI?.levels?.level_4?.level_4_expiration_date} format={'MM:DD:YYYY'} /></p>
                                                            </div>
                                                        </div> 
                                                    : '' }
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 px-5 selected-instructors">
                                    <ul>
                                        <li className='title py-2'>Instructors</li>
                                        {assignedInstructors?.map((data,index) => (
                                            <li className='main-data' key={index}>
                                                {btns(index, data)}
                                                <b>{index == 0 ? 'Lead' : 'Asst ' + parseInt(index)}:</b>
                                                <span>{data?.contact_name}</span>
                                            </li>
                                        ))}
                                       
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

export default InstructorCourseModal
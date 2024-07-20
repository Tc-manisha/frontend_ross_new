import React, { useState } from 'react';
import "./BroadcastModal.scss";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CallGETAPI, CallGETAPINEW, CallPOSTAPI, CallPOSTAPINEW } from '../../../helper/API';
import { useParams } from 'react-router-dom';
import { FormControlLabel, Switch } from "@mui/material";
import MessageHandler from '../../common/MessageHandler';
import { useEffect } from 'react';
import { GetAssignedBroadcastInstructors } from '../../../helper/BasicFn';
import { sortData } from '../../../helper/Common';
import Moment from 'react-moment';

const BroadcastModal = ({ ShowModal, SetShowModal, inpersonCourseName, inpersonCourseId, allInstructors, setAllInstructors, instructorNeeded }) => {
    const [FormMsg, setFormMsg] = React.useState({ type: true, msg: "" });
    const [loading, setLoading] = React.useState(false);
    const [handleContactSelectList, setHandleContactSelectList] = useState([]);
    const [assignedBroadcasts, setAssignedBroadcasts] = useState([]);
    const [AhaDetails, setAhaDetails] = React.useState({});
    const [viewInstructor, setviewInstructor] = React.useState(false);

    const [orgAllInstructors, setOrgAllInstructors] = useState(allInstructors)

    const { inpersonId } = useParams()

    const handleClose = () => SetShowModal(false);

    // handle check click
    const handleCheckClick = (e, data) => {
        let value = data.contact_id
        if (e.target.checked) {
            if (!handleContactSelectList.includes(value)) {
                setHandleContactSelectList((old) => [...old, value])
            }
        } else {
            let array = handleContactSelectList
            let newArray = array.filter(function (item) {
                return item !== value
            })
            setHandleContactSelectList(newArray)
        }
    }

    // handle submit function
    const handleSubmit = () => {
        // submit account contacts
        handleInpersonClassSubmit();
    }

    const handleAddContact = (e) => {
        let contactIds = handleContactSelectList;
        let arrayData = [];
        for (let i = 0; i < contactIds.length; i++) {
            const instructor = allInstructors.find(
                (data) => data.contact_id == contactIds[i]
            )
            arrayData.push(instructor)
        }
        setAssignedBroadcasts(arrayData);

        const filteredInstructors = allInstructors.filter(instructor =>
            !contactIds.includes(instructor.contact_id)
        );
        setAllInstructors(filteredInstructors)
    }


    const handleRemoveContact = (e) => {
        let contactIds = handleContactSelectList;
        let arrayData = [];
        for (let i = 0; i < contactIds.length; i++) {
            let element = contactIds[i]
            let instructor = orgAllInstructors.find(
                (data) => data.contact_id === element
            )
            arrayData.push(instructor)
        }
        setAllInstructors(orgAllInstructors)
        setHandleContactSelectList([])
        // setAssignedBroadcasts([]);
        getAssignedBroadcasts()
    }

    // inperson class contact
    const handleInpersonClassSubmit = async () => {
        let payloadData = {
            class_id: inpersonId,
            broad_cast: assignedBroadcasts,
        }

        const result = await CallPOSTAPINEW('account/send-broadcast-message-to-inpersons', payloadData)

        if (result?.status) {
            handleClose();
        }

        setLoading(false);
    }

    // get assigned instructors
    const getAssignedBroadcasts = async () => {
        const broadcast = await GetAssignedBroadcastInstructors(inpersonId)

        if (broadcast?.status) {

            let data = broadcast?.broadCast?.broad_cast;
            data = JSON.parse(data);

            if (data && data?.length > 0) {
                let sortedArray = sortData(data, 'contact_name');
                setAssignedBroadcasts(sortedArray);
            } else {
                if (instructorNeeded && instructorNeeded > 0) {
                    let data = [
                        {
                            contact_id: '',
                            contact_name: 'UnAssigned',
                        }
                    ];

                    for (let i = 1; i < instructorNeeded; i++) {
                        let items = {
                            contact_id: '',
                            contact_name: 'UnAssigned',
                        }
                        data.push(items)
                    }
                    setAssignedBroadcasts(data)
                }
            }
        }
    }

    // handle view button
    const handleViewInstructor = (contactId) => {
        if (!viewInstructor) {
            setviewInstructor(contactId);
        } else {
            setviewInstructor(!viewInstructor);
        }
    }

    // get aha details
    const getAhaDetails = async (instructorId, index) => {
        const result = await CallGETAPINEW('account/aha-hsi-of-instructor/' + instructorId)

        if (result?.status) {
            setAhaDetails((old) => ({ ...old, [index]: result?.data?.data }))
        }
    }

    useEffect(() => {
        getAssignedBroadcasts();
    }, [])

    useEffect(() => {
        allInstructors?.map((instructor, index) => {
            getAhaDetails(instructor.instructor_id, index);
        })
    }, [allInstructors])

    console.log('allInstructors', allInstructors);

    return (
        <>
            <Modal show={ShowModal} onHide={handleClose}
                dialogClassName="modal-half"
                aria-labelledby="example-custom-modal-styling-title"
                size="xl"
                id="broadcast-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Broadcast: ({inpersonCourseName}) ({inpersonCourseId})</Modal.Title>
                </Modal.Header>
                <Modal.Body >

                    <div className="modal-container" id="broadcast-modal-content"  >
                        <div className="my-modal-section">
                            <div className="row" style={{ marginLeft: "5px" }}>
                                <div className="col-md-6 px-0 instructors" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    <div style={{ border: '1px solid #0C71C3', }}>
                                        <div className="row mx-0" style={{ borderBottom: '1px solid #0C71C3', }}>
                                            <div className="col-6 px-0" >
                                                <h6 className='py-2 px-2' style={{ margin: '0px', background: '#999999', fontWeight: 'bold' }}>Instructor</h6>
                                            </div>
                                            <div className="col-3 px-0">
                                                <h6 className='py-2 px-2' style={{ margin: '0px', background: '#999999', fontWeight: 'bold' }}>Rating</h6>
                                            </div>
                                            <div className="col-3 px-0">
                                                <h6 className='py-2 px-2' style={{ margin: '0px', background: '#999999', fontWeight: 'bold' }}>Credentials</h6>
                                            </div>
                                        </div>
                                        <div className="details">
                                            {allInstructors?.map((data, index) => (
                                                <div key={index}>
                                                    <div className={handleContactSelectList?.contact_id == data?.contact_id ? 'main-row row mx-0 bg-primary text-white' : 'row mx-0'} >
                                                        <div className="col-6 px-0" >
                                                            <div className='py-2 px-2' style={{ margin: '0px' }}>
                                                                <label htmlFor={'insert_id_' + data?.contact_name}  >
                                                                    <input type="checkbox" id={'insert_id_' + data?.contact_name}
                                                                        value={data?.contact_name}
                                                                        onChange={(e) => handleCheckClick(e, data)}
                                                                        checked={handleContactSelectList.includes(data?.contact_id) ? true : false}
                                                                    />
                                                                    {data?.contact_name}
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-3 px-0">
                                                            <h6 className='py-2 px-2' style={{ margin: '0px' }}>{data?.rating}</h6>
                                                        </div>
                                                        <div className="col-3 px-0">
                                                            <h6 className='py-2 px-2' style={{ margin: '0px' }}>
                                                                <span style={{ cursor: 'pointer' }} onClick={(e) => handleViewInstructor(data?.contact_id)}>
                                                                    {viewInstructor == data?.contact_id ? 'Hide' : 'View'}
                                                                </span>
                                                            </h6>
                                                        </div>
                                                    </div>
                                                    {/* dropdown menu */}
                                                    {viewInstructor == data?.contact_id ?
                                                        <div className="dropdown-items row mx-0">
                                                            <div className="col-12 px-0 py-2" style={{ margin: '0px', background: '#E4E4E4' }}>
                                                                <span className='px-2'>AHA</span>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{ margin: '0px', background: '#fff' }}>
                                                                <p className='px-4 mb-0'>ACLS: <Moment date={AhaDetails[index]?.AHA?.disiplines?.ACLS?.ACLS_expiration_date} format={'MM:DD:YYYY'} /></p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{ margin: '0px', background: '#E4E4E4' }}>
                                                                <p className='px-4 mb-0'>BLS: <Moment date={AhaDetails[index]?.AHA?.disiplines?.BLS?.BLS_expiration_date} format={'MM:DD:YYYY'} /></p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{ margin: '0px', background: '#fff' }}>
                                                                <p className='px-4 mb-0'>Heartsaver: <Moment date={AhaDetails[index]?.AHA?.disiplines?.heart_saver?.heart_saver_expiration_date} format={'MM:DD:YYYY'} /></p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{ margin: '0px', background: '#E4E4E4' }}>
                                                                <p className='px-4 mb-0'>PALS: <Moment date={AhaDetails[index]?.AHA?.disiplines?.PALS?.PALS_expiration_date} format={'MM:DD:YYYY'} /></p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{ margin: '0px', background: '#fff' }}>
                                                                <p className='px-2 mb-0'>HSI</p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{ margin: '0px', background: '#E4E4E4' }}>
                                                                <p className='px-4 mb-0'>Level 1: <Moment date={AhaDetails[index]?.HSI?.levels?.level_1?.level_1_expiration_date} format={'MM:DD:YYYY'} /></p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{ margin: '0px', background: '#fff' }}>
                                                                <p className='px-4 mb-0'>Level 2: <Moment date={AhaDetails[index]?.HSI?.levels?.level_2?.level_2_expiration_date} format={'MM:DD:YYYY'} /></p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{ margin: '0px', background: '#E4E4E4' }}>
                                                                <p className='px-4 mb-0'>Level 3: <Moment date={AhaDetails[index]?.HSI?.levels?.level_3?.level_3_expiration_date} format={'MM:DD:YYYY'} /></p>
                                                            </div>
                                                            <div className="col-12 px-0 py-2" style={{ margin: '0px', background: '#fff' }}>
                                                                <p className='px-4 mb-0'>Level 4: <Moment date={AhaDetails[index]?.HSI?.levels?.level_4?.level_4_expiration_date} format={'MM:DD:YYYY'} /></p>
                                                            </div>
                                                        </div>
                                                        : ''}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className='col-md-1' >
                                    <div className='middle-buttons' >
                                        <span className="select-btn" onClick={(e) => { handleAddContact(e) }}>+</span>
                                        <span className="elemenate-btn" onClick={(e) => { handleRemoveContact(e) }}>-</span>
                                    </div>
                                </div>

                                <div className="col-md-5 px-5 selected-instructors">
                                    <ul>
                                        <li className='title'>Instructors</li>
                                        {assignedBroadcasts?.map((data, index) => (
                                            <li className='data' key={index}>{data?.contact_name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </Modal.Body>

                {/* alert */}
                <div className="my-4">
                    <MessageHandler
                        status={FormMsg.type}
                        msg={FormMsg.msg}
                        HandleMessage={setFormMsg}
                    />
                </div>

                <Modal.Footer>
                    <button className="Cancel-btn" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="submit-btn" type="button" onClick={handleSubmit}>
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default BroadcastModal

import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import './instructorModal.scss'
import { Form } from "react-bootstrap";
import { FormControlLabel, Switch } from "@mui/material";

export default function InstructorModal({instructorModal, setInstructorModal, title}) {
    
    const handleClose = () => setInstructorModal(false);

    const handleSubmit = () => {
        handleClose()
    };

    const instructorList = [
        {instructor: 'Jimmy Meep', rating: 'A',},
        {instructor: 'Perry Meep', rating: 'C',},
        {instructor: 'April Meep', rating: 'B',},
        {instructor: 'Barb Meep', rating: 'D',},
    ]

    return (
        <>
            <Modal show={ instructorModal } onHide={ handleClose }
                dialogClassName="modal-240w"
                aria-labelledby=""
                size="lg"
                id="instructor-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="modal-container"  >
                        <div className="my-modal-section">
                            <div className="upper-div">
                                <div className="instructors" style={ { maxHeight: '400px', overflowY: 'auto' } }>
                                    <table style={ { width: '100%' } }  className="odd-even-row">
                                        <thead>
                                            <tr>
                                                <th scope='col' width="60%">Instructor</th>
                                                <th scope='col' width="40%">Rating</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {instructorList?.map((data, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <label className='d-flex ' htmlFor={"instrctor_" + index}>
                                                            <input type="checkbox" 
                                                                id={"instrctor_" + index}
                                                                value={data.instructor}
                                                            />
                                                            <span className='ms-2'>{data.instructor}</span>
                                                        </label>
                                                    </td>
                                                    <td>{data.rating}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="selected-instructors">
                                    <table style={ { width: '100%' } } className="odd-even-row">
                                        <thead>
                                            <tr>
                                                <th scope='col' width="25%"></th>
                                                <th scope='col' width="30%">Instructor</th>
                                                <th scope='col' width="20%">Lead</th>
                                                <th scope='col' width="25%">Session ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="btns">
                                                        <span className="select-btn buttons">+</span>
                                                        <span className="elemenate-btn buttons">-</span>
                                                    </div>
                                                </td>
                                                <td>Unassigned </td>
                                                <td>
                                                    <FormControlLabel
                                                        className={ "" }
                                                        label=""
                                                        control={
                                                            <Switch
                                                                color="primary"
                                                                size="medium"
                                                                value={ true }
                                                            />
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <select name="" id="" className='form-control'>
				                                        <option value="" key={ 0 } selected >--Select One--</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="btns">
                                                        <span className="select-btn buttons">+</span>
                                                        <span className="elemenate-btn buttons">-</span>
                                                    </div>
                                                </td>
                                                <td>Unassigned </td>
                                                <td>
                                                    <FormControlLabel
                                                        className={ "" }
                                                        label=""
                                                        control={
                                                            <Switch
                                                                color="primary"
                                                                size="medium"
                                                                value={ true }
                                                            />
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <select name="" id="" className='form-control'>
                                        				<option value="" key={ 0 } selected >--Select One--</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button className="btn btn-danger" onClick={ handleClose }>
                        Cancel
                    </button>
                    <button className="btn btn-success" type="button" onClick={ handleSubmit }>
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

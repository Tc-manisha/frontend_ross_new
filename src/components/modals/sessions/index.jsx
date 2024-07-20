import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import './sessionModal.scss'
import { Form } from "react-bootstrap";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import AccessibleIcon from "@mui/icons-material/Accessible";
import MoreTimeIcon from "@mui/icons-material/MoreTime";

export default function Sessions({sessionModal, setSessionModal, title}) {
    const [rowsData, setRowsData] = useState([
        {
            date: '',
            time: '',
            hours: '',
            instructors: '',
            course_part: '',
        }
    ]);

    // calendar icon
    const calendarIcon = () => {
        return (
            <img src="/calendar.svg" alt="calendar" />
        )
    }

    // handle close modal
    const handleClose = () => setSessionModal(false);

    // handle submit and close modal
    const handleSubmit = () => {
        setSessionModal(false)
    };

    // handle add rows
    const addTableRows = () => {

        const rowsInput = {
            date: '',
            time: '',
            hours: '',
            instructors: '',
            course_part: '',
        }
        setRowsData([...rowsData, rowsInput])
    
    }

    // handle delete rows
    const deleteTableRows = (index) => {
       
        if(rowsData.length > 1) {
            const rows = [...rowsData];
            rows.splice(index, 1);
            setRowsData(rows);
        }
    }

    // handle change
    const handleChange = (index, evnt) => {
        const { name, value } = evnt.target;
        const rowsInput = [...rowsData];
        rowsInput[index][name] = value;
        setRowsData(rowsInput);
    }

    return (
        <>
            <Modal show={ sessionModal } onHide={ handleClose }
                dialogClassName="modal-240w"
                aria-labelledby=""
                size="lg"
                id="session-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="modal-container" id="session-modal-content"  >
                        <div className="my-modal-section">
                            <div className="session" style={ { maxHeight: '400px', overflowY: 'auto' } }>
                                <table width={'100%'}>
                                    <thead>
                                        <tr>
                                            <th scope='col' width="10%" className='border-t-blue bg-tbl-border px-2 py-2'>Session Id</th>
                                            <th scope='col' width="20%" className='border-t-blue bg-tbl-border px-2 py-2'>Date</th>
                                            <th scope='col' width="15%" className='border-t-blue bg-tbl-border px-2 py-2'>Time</th>
                                            <th scope='col' width="15%" className='border-t-blue bg-tbl-border px-2 py-2'>Hours</th>
                                            <th scope='col' width="15%" className='border-t-blue bg-tbl-border px-2 py-2'>Instructors</th>
                                            <th scope='col' width="15%" className='border-t-blue bg-tbl-border px-2 py-2'>Course Part</th>
                                            <th scope='col' width="10%" className='border-t-blue bg-tbl-border px-2 py-2'><span className='text-primary' style={{fontSize: '25px', cursor: 'pointer'}} onClick={addTableRows}>+</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rowsData.map((row, index) => (
                                            <tr key={index}>
                                                <td className='px-2 py-2'>{index + 1}</td>
                                                <td className='px-2 py-2'>
                                                    <div className="d-flex align-items-center calendar-input-btn">
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <Stack spacing={3}>
                                                                <DesktopDatePicker
                                                                    label=""
                                                                    inputFormat="MM/DD/YYYY"
                                                                    components={{
                                                                        OpenPickerIcon: calendarIcon,
                                                                    }}
                                                                    // value={formData[document.label + '_update_date']}
                                                                    // onChange={ ( newValue) => handleCalendarChange(newValue, document.label + '_update_date')}
                                                                    renderInput={(params) => <TextField className='form-control' {...params} />}
                                                                />
                                                            </Stack>
                                                        </LocalizationProvider>
                                                    </div>
                                                </td>
                                                <td className='px-2 py-2'>
                                                    <Form.Control
                                                        type="text"
                                                        name="time"
                                                        required
                                                        defaultValue={row.time}
                                                        onChange={(evnt) => (handleChange(index, evnt))}
                                                    />
                                                </td>
                                                <td className='px-2 py-2'>
                                                    <Form.Control
                                                        type="text"
                                                        name="hours"
                                                        required
                                                        defaultValue={row.hours}
                                                        onChange={(evnt) => (handleChange(index, evnt))}
                                                    />
                                                </td>
                                                <td className='px-2 py-2'>
                                                    <Form.Control
                                                        type="text"
                                                        name="instructors"
                                                        required
                                                        defaultValue={row.instructors}
                                                        onChange={(evnt) => (handleChange(index, evnt))}
                                                    />
                                                </td>
                                                <td className='px-2 py-2'>
                                                    <Form.Control
                                                        type="text"
                                                        name="course_part"
                                                        required
                                                        defaultValue={row.course_part}
                                                        onChange={(evnt) => (handleChange(index, evnt))}
                                                    />
                                                </td>
                                                <td className='px-2 py-2'><span className='text-danger' style={{fontSize: '45px', cursor: 'pointer'}}  onClick={() => (deleteTableRows(index))}>-</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

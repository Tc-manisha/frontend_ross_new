import React from 'react'
import Select from 'react-select'
import { Form } from "react-bootstrap";
import { useState } from 'react';
import { useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, FormatDate, FormatDateTime } from '../../../helper/Common';

export default function ClassDetails({
    setRowsData,
    rowsData,
    validated,
    rowsDataValidation,
    isInValid,
    setIsInvalid,
    setRowsDataValidation,
    dateFeilds,
    setDateFeilds
}) {

    // handle add rows
    const addTableRows = () => {

        const rowsInput = {
            index: rowsData?.length + 1,
            course_name: 'Class ' + (rowsData?.length + 1),
            date_time_option_1: '',
            date_time_option_2: '',
            date_time_option_3: '',
            is_primary: 1,
        }
        setRowsData([...rowsData, rowsInput])

    }

    const deleteTableRows = (index) => {
        if (rowsData.length > 1) {
            const rows = [...rowsData];
            rows.splice(index, 1);
            setRowsData(rows);
        }
    }

    const [isDatePickerOpen, setIsDatePickerOpen] = useState({
        'option_1': false,
        'option_2': false,
        'option_3': false,
    });

    // const handleCalendarIconClick = (type) => {
    //     setIsDatePickerOpen(prevState => ({
    //         ...prevState,
    //         [type]: !prevState[type]
    //     }));
    // };

    const handleCalendarIconClick = (type) => {
        setIsDatePickerOpen(prevState => ({
            ...Object.keys(prevState).reduce((acc, key) => {
                acc[key] = key === type ? !prevState[key] : false;
                return acc;
            }, {})
        }));
    };


    useEffect(() => {
        let validationsData = {};
        if (validated) {
            rowsData?.map((data, index) => {
                if (data?.date_time_option_1?.trim()?.length == 0) {
                    let items = {
                        "date_time_option_1": true
                    }

                    validationsData[index + 1] = { ...validationsData[index + 1], ...items }
                }

                if (data?.date_time_option_2?.trim()?.length == 0) {
                    let items = {
                        "date_time_option_2": true
                    }

                    validationsData[index + 1] = { ...validationsData[index + 1], ...items }
                }

                if (data?.date_time_option_3?.trim()?.length == 0) {
                    let items = {
                        "date_time_option_3": true
                    }

                    validationsData[index + 1] = { ...validationsData[index + 1], ...items }
                }
            })
            setRowsDataValidation(validationsData);
        }
    }, [])

    // const handleDateTimeChanges = (date, fieldName, index) => {
    //     const rowsInput = [...rowsData];
    //     if (date) {
    //         const formattedDateTime = date.toLocaleDateString('en-US', {
    //             month: '2-digit',
    //             day: '2-digit',
    //             year: 'numeric',
    //         }) + ' ' + date.toLocaleTimeString('en-US', {
    //             hour: '2-digit',
    //             minute: '2-digit',
    //             second: '2-digit',
    //             hour12: false
    //         });

    //         rowsInput[index][fieldName] = formattedDateTime;
    //         rowsInput[index]['is_primary'] = 1;
    //         setRowsData(rowsInput);
    //     }
    // };

    const handleDateTimeChanges = (date, fieldName, index) => {
        const rowsInput = [...rowsData];
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            const formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;

            setIsInvalid({ ...isInValid, [fieldName]: false })
            setDateFeilds({ ...dateFeilds, [fieldName]: formattedDateTime })

            rowsInput[index][fieldName] = formattedDateTime;
            rowsInput[index]['is_primary'] = 1;
            setRowsData(rowsInput);

            let optionNumber = fieldName.split('_')[3];
            let optionName = 'option_' + optionNumber;
            if (hours !== '00' || minutes !== '00' || seconds !== '00') {
                setIsDatePickerOpen(prevState => ({
                    ...prevState,
                    [optionName]: false
                }));
            }

        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            const targetElement = event.target;
            const myComponent = document.getElementById('myComponent');

            if (myComponent && !myComponent.contains(targetElement)) {
                setIsDatePickerOpen({
                    'option_1': false,
                    'option_2': false,
                    'option_3': false,
                })
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {rowsData?.map((row, index) => (
                <div key={index} id='myComponent'>
                    {/* top buttons */}
                    <div className="d-flex align-items-center mb-2">
                        <h5 className="">{'Class ' + (parseInt(index) + 1)}</h5>
                        <div className="d-flex align-items-center ms-3">
                            <button type="button" className="btn py-1 btn-sm mx-2 btn-primary" onClick={(e) => { addTableRows(e) }}>+</button>
                            <button type="button" className="btn py-1 btn-sm mx-2 btn-danger" onClick={(e) => { deleteTableRows(index) }}>-</button>
                        </div>
                    </div>

                    {/* main */}
                    <div className="row mb-3">
                        <Form.Group className={"col-3"}>
                            <div className="d-flex align-items-center mb-2">
                                <Form.Label>Date/Time Option 1*</Form.Label>
                            </div>
                            {/* <NewDateTimePicker /> */}
                            <div
                                className={rowsDataValidation[index + 1]?.date_time_option_1 ? 'd-flex align-items-center calendar-input-btn invalid-datepicker-div' : 'd-flex align-items-center calendar-input-btn'}>
                                <div style={{ position: 'relative', borderColor: isInValid?.date_time_option_1 ? '#DC3545' : '' }}
                                    onClick={() => handleCalendarIconClick('option_1')}
                                    className={`d-flex align-items-center calendar-input-btn calendar-input-btn-1012 date-time-picker`}>
                                    <DatePicker
                                        showTimeSelect
                                        timeIntervals={1}
                                        selected={row?.date_time_option_1 ? new Date(row.date_time_option_1) : null}
                                        onChange={(date) => {
                                            handleDateTimeChanges(date, 'date_time_option_1', index)
                                            handleCalendarIconClick('option_1')
                                        }
                                        }
                                        timeFormat="HH:mm:ss"
                                        dateFormat="MM/dd/yyyy HH:mm:ss"
                                        placeholderText="Select Date and Time"
                                        open={isDatePickerOpen.option_1}
                                    />
                                    <span className="cl-name" style={{ cursor: 'pointer' }}><CalendarIcon /></span>
                                </div>
                            </div>
                            {
                                isInValid.date_time_option_1 && (
                                    <div className="invalid mt-2">
                                        This field is required.
                                    </div>
                                )
                            }
                        </Form.Group>

                        <Form.Group className={"col-3"}>
                            <div className="d-flex align-items-center mb-2">
                                <Form.Label>Date/Time Option 2*</Form.Label>
                            </div>
                            <div className={rowsDataValidation[index + 1]?.date_time_option_2 ? 'd-flex align-items-center calendar-input-btn invalid-datepicker-div' : 'd-flex align-items-center calendar-input-btn'}>
                                <div style={{ position: 'relative', borderColor: isInValid?.date_time_option_2 ? '#DC3545' : '' }} onClick={() => handleCalendarIconClick('option_2')} className={`d-flex align-items-center calendar-input-btn calendar-input-btn-1012 date-time-picker`}>
                                    <DatePicker
                                        selected={row?.date_time_option_2 ? new Date(row.date_time_option_2) : null}
                                        // onChange={(date) => handleDateTimeChanges(date, 'date_time_option_2', index)}
                                        onChange={(date) => {
                                            handleDateTimeChanges(date, 'date_time_option_2', index)
                                            handleCalendarIconClick('option_2')
                                        }
                                        }
                                        showTimeSelect
                                        timeIntervals={1}
                                        timeFormat="HH:mm:ss"
                                        dateFormat="MM/dd/yyyy HH:mm:ss"
                                        placeholderText="Select Date and Time"
                                        open={isDatePickerOpen.option_2}
                                    />
                                    <span className="cl-name" style={{ cursor: 'pointer' }}><CalendarIcon /></span>
                                </div>
                            </div>
                            {
                                isInValid.date_time_option_2 && (
                                    <div className="invalid mt-2">
                                        This field is required.
                                    </div>
                                )
                            }
                        </Form.Group>

                        <Form.Group className={"col-3"}>
                            <div className="d-flex align-items-center mb-2">
                                <Form.Label>Date/Time Option 3*</Form.Label>
                            </div>
                            <div className={rowsDataValidation[index + 1]?.date_time_option_3 ? 'd-flex align-items-center calendar-input-btn invalid-datepicker-div' : 'd-flex align-items-center calendar-input-btn'}>

                                <div style={{ position: 'relative', borderColor: isInValid?.date_time_option_3 ? '#DC3545' : '' }} onClick={() => handleCalendarIconClick('option_3')} className={`d-flex align-items-center calendar-input-btn calendar-input-btn-1012 date-time-picker`}>
                                    <DatePicker
                                        selected={row?.date_time_option_3 ? new Date(row.date_time_option_3) : null}
                                        // onChange={(date) => handleDateTimeChanges(date, 'date_time_option_3', index)}
                                        onChange={(date) => {
                                            handleDateTimeChanges(date, 'date_time_option_3', index)
                                            handleCalendarIconClick('option_3')
                                        }
                                        }
                                        showTimeSelect
                                        timeIntervals={1}
                                        timeFormat="HH:mm:ss"
                                        dateFormat="MM/dd/yyyy HH:mm:ss"
                                        placeholderText="Select Date and Time"
                                        open={isDatePickerOpen.option_3}
                                    />
                                    <span className="cl-name" style={{ cursor: 'pointer' }}><CalendarIcon /></span>
                                </div>
                            </div>
                            {
                                isInValid.date_time_option_3 && (
                                    <div className="invalid mt-2">
                                        This field is required.
                                    </div>
                                )
                            }
                        </Form.Group>

                    </div>
                </div>
            ))}



        </>
    )
}

import { Box } from '@mui/material'
import React from 'react'
import './Tabls.scss'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import TableSkeleton from '../../pages/accounts/skeleton/table/TableSkeleton';
import { CallGETAPI, CallPOSTAPI } from '../../helper/API';
import MessageHandler from '../../components/common/MessageHandler';

export default function UserContactInpersonClass({ contact_id }) {
    // const { contact_id } = useParams();
    const [availableClasses, setAvailableClasses] = useState([]);
    const [cancelledClass, setcancelledClass] = useState([]);
    const [pendingClass, setPendingClass] = useState([]);
    const [showLoading, setShowLoading] = React.useState(true);
    const [FormMsg, setFormMsg] = React.useState({ type: true, msg: "" });

    // get inperson classes
    const getInpersonClasses = async () => {
        const result = await CallGETAPI('account/get-contact-class/' + contact_id);

        if (result?.data?.status) {
            setAvailableClasses(result?.data?.availableClasses)
            setcancelledClass(result?.data?.canceledClass)
            setPendingClass(result?.data?.pendingClass)
        }

        // show loading false
        setShowLoading(false);
    }

    useEffect(() => {
        getInpersonClasses();
    }, [])

    // show register and assign buttons
    const registerAssignBtn = (data) => {
        return <>
            <div className="d-flex align-items-center gap-2">
                <button
                    className="btn text-primary"
                    type="button"
                    onClick={() => {
                        HandleRegisterClick(data);
                    }}
                >
                    <img src="/register.svg" alt="Register" />
                    <span className="ms-2">Register</span>
                </button>
                <button
                    className="btn text-primary"
                    type="button"
                    onClick={() => {
                        HandleAssignClass(data);
                    }}
                >
                    <img src="/assign.svg" alt="Assign" />
                    <span className="ms-2">Assign</span>
                </button>
            </div>
        </>
    }

    // show cancel and reschedule buttons
    const cancelReschedule = (data) => {
        return <>
            <div className="d-flex align-items-center gap-2">
                <button
                    className="btn text-primary"
                    type="button"
                    onClick={() => {
                        HandleCancelClass(data);
                    }}
                >
                    <img src="/cancel.svg" alt="cancel" />
                    <span className="ms-2">Cancel</span>
                </button>
                <button
                    className="btn text-primary"
                    type="button"
                // onClick={ () =>
                // {
                //     HandleBackClick();
                // } }
                >
                    <img src="/reschedule.svg" alt="reschedule" />
                    <span className="ms-2">Reschedule</span>
                </button>
            </div>
        </>
    }

    // HandleRegisterClick
    const HandleRegisterClick = async (data) => {
        let payloadData = {
            "id": data?.class_id ?? '',
        }
        let result = await CallPOSTAPI("user/class-register", payloadData);
        setFormMsg({ type: result?.data?.status, msg: result?.data?.message });

    }

    // HandleAssignClass
    const HandleAssignClass = async (data) => {
        let payloadData = {
            "class_id": data?.class_id ?? '',
            "contact_id": data?.contact_id ?? ''
        }

        let result = await CallPOSTAPI('user/assign-class', payloadData);
        setFormMsg({ type: result?.data?.status, msg: result?.data?.message });

    }

    // HandleCancelClass
    const HandleCancelClass = async (data) => {
        let payloadData = {
            "id": data?.class_id ?? ''
        }

        let result = await CallPOSTAPI('user/class-cancel', payloadData);
        setFormMsg({ type: result?.data?.status, msg: result?.data?.message });

    }


    return (
        <div className='relative'>
            {/* loading */}
            {showLoading && (
                <div className="showloading-table">
                    <TableSkeleton />
                </div>
            )}

            {/* message */}
            <div className="mt-4">
                <MessageHandler
                    status={FormMsg.type}
                    msg={FormMsg.msg}
                    HandleMessage={setFormMsg}
                />
            </div>

            {/* availableClasses */}
            <div className="availableClasses">

                <Box className="pt-4">
                    <h3 className="heading">Available Classes</h3>
                </Box>

                {/* data grid table */}
                <div className="data-table pb-3">
                    <DataGrid
                        dataSource={availableClasses}
                        keyExpr="class_number"
                        showColumnLines={true}
                        showRowLines={true}
                        showBorders={false}
                        rowAlternationEnabled={true}>

                        <Column dataField="class_number" caption="Course Name" cssClass="column-header" />
                        <Column dataField="class_date" caption="Class Date" cssClass="column-header" dataType={'date'} />
                        <Column dataField="course" caption="Course" cssClass="column-header" />
                        <Column dataField="class_instructor" caption="Class Instructor" cssClass="column-header" />
                        <Column dataField="registered_val" caption="Registered" cssClass="column-header" />
                        <Column cellRender={(data) => registerAssignBtn(data)} caption="Tasks" cssClass="column-header" />

                        <Scrolling columnRenderingMode="virtual" />
                        <Paging enabled={false} />
                    </DataGrid>
                </div>

            </div>

            {/* pendingClass */}
            <div className="pendingClass pb-5">

                <Box className="pt-4">
                    <h3 className="heading">Pending Classes</h3>
                </Box>

                {/* data grid table */}
                <div className="data-table pb-3">
                    <DataGrid
                        dataSource={pendingClass}
                        keyExpr="class_number"
                        showColumnLines={true}
                        showRowLines={true}
                        showBorders={false}
                        rowAlternationEnabled={true}>

                        <Column dataField="class_number" caption="Course Name" cssClass="column-header" />
                        <Column dataField="class_date" caption="Class Date" cssClass="column-header" dataType={'date'} />
                        <Column dataField="course" caption="Course" cssClass="column-header" />
                        <Column dataField="class_instructor" caption="Class Instructor" cssClass="column-header" />
                        <Column dataField="registered_val" caption="Registered" cssClass="column-header" />
                        <Column cellRender={(data) => cancelReschedule(data)} caption="Tasks" cssClass="column-header" />

                        <Scrolling columnRenderingMode="virtual" />
                        <Paging enabled={false} />
                    </DataGrid>
                </div>

            </div>

            {/* cancelledClass */}
            <div className="cancelledClass">

                <Box className="pt-4">
                    <h3 className="heading">Cancelled Classes</h3>
                </Box>

                {/* data grid table */}
                <div className="data-table pb-3">
                    <DataGrid
                        dataSource={cancelledClass}
                        keyExpr="class_number"
                        showColumnLines={true}
                        showRowLines={true}
                        showBorders={false}
                        rowAlternationEnabled={true}>

                        <Column dataField="class_number" caption="Course Name" cssClass="column-header" />
                        <Column dataField="class_date" caption="Class Date" cssClass="column-header" dataType={'date'} />
                        <Column dataField="course" caption="Course" cssClass="column-header" />
                        <Column dataField="class_instructor" caption="Class Instructor" cssClass="column-header" />
                        <Column dataField="registered_val" caption="Registered" cssClass="column-header" />

                        <Scrolling columnRenderingMode="virtual" />
                        <Paging enabled={false} />
                    </DataGrid>
                </div>

            </div>


        </div>
    )
}

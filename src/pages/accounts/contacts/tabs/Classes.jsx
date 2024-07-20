import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './table.css'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { useParams } from 'react-router-dom';
import { CallGETAPI2, CallGETAPINEW } from '../../../../helper/API';
// import Loading from '../../Loading';
import TableSkeleton from '../../skeleton/table/TableSkeleton';

const tasksRowData = () => {
    return (
        <>
            <img src="/register.svg" alt="register" />
            <img src="/assign.svg" alt="assign" />
        </>
    )
}
export default function Classes() {

    const [classes, setClasses] = useState([]);
    const [ showLoading, setShowLoading ] = React.useState(true);
    const [loading, setLoading] = useState(true);

    const {contactId} = useParams();

    const getData = async() => {
        const result = await CallGETAPINEW('account/inperson-class-by-contact/' + contactId)

        if(result?.data?.status) {
            const classes = result?.data?.classes
            console.log({classes});
            if(classes){
                classes?.map((data,index) => {
                    if(data.instructor) {
                        let instructors = JSON.parse(data.instructor)
                        instructors.map((item,index) => {
                            if(item.label == 'Lead') {
                                data.trainer = item.contact_name
                            } 
                        })
                    }
                })
    
                setClasses(classes);
            }
        }

        setShowLoading(false);
    }

    // availableActionButton
    const availableActionButton = (data) => {
        return (
            <div className="d-flex" style={{ gap: "10px" }}>
                <button
                    className="btn text-primary"
                    type="button"
                    // onClick={() => HandleEditClick(editUrl)}
                    style={{ padding: "0" }}
                >
                    <img src="/register.svg" alt="register" style={{ marginRight: "5px" }}  />
                    <span className="ms-1">Register</span>
                </button>

                <button
                    className="btn text-primary"
                    type="button"
                    // onClick={() => HandleEditClick(editUrl)}
                    style={{ padding: "0" }}
                >
                    <img src="/assign.svg" alt="assign" />
                    <span className="ms-1">Assign</span>
                </button>

            </div>
        )
    }

     // pendingActionButton
     const pendingActionButton = (data) => {
        return (
            <div className="d-flex" style={{ gap: "10px" }}>
                <button
                    className="btn text-primary"
                    type="button"
                    // onClick={() => HandleEditClick(editUrl)}
                    style={{ padding: "0" }}
                >
                    <img src="/cancel.svg" alt="cancel" style={{ marginRight: "5px" }}  />
                    <span className="ms-1">Cancel</span>
                </button>

                <button
                    className="btn text-primary"
                    type="button"
                    // onClick={() => HandleEditClick(editUrl)}
                    style={{ padding: "0" }}
                >
                    <img src="/reschedule.svg" alt="Reshcedule" />
                    <span className="ms-1">Reschedule</span>
                </button>

            </div>
        )
    }

    // get status
    const getStatus = (data) => {
        return 'Completed';
    }

    useEffect(() => {
        getData();
    }, [contactId])

    return (
        <div className='relative'>
            {/* loading */}
            {showLoading && (
                <div className="showloading">
                    <TableSkeleton />
                </div>
            )}

         {!showLoading && ( <>
            {/* available classes */}
            <div className="available-classes">
                {/* heading */}
                <Box className="text-left pt-3 pb-1">
                <h4 className='heading'>Available Classes</h4>
                </Box>

                {/* data grid table */}
                <div className="data-table pb-3 multiple-row-table">
                    <DataGrid 
                        dataSource={classes}
                        keyExpr=""
                        showColumnLines={true}
                        showRowLines={false}
                        showBorders={false}
                        rowAlternationEnabled={true}>
                        <Column dataField="course_name" width={350} caption="Course Name" />
                        <Column dataField="course_date" caption="Course Date" />
                        <Column dataField="maximum" caption="Enrolled" />
                        <Column dataField="trainer" caption="Trainer" />
                        <Column dataField="contact_name" caption="Contact" />
                        <Column cellRender={ (e) => availableActionButton(e.data) } caption="Tasks" />
                        <Scrolling columnRenderingMode="virtual" />

                        <Paging enabled={ false } />
                    </DataGrid>
                </div>
            </div>

            {/* Uncompleted Classes */}
            <div className="uncompleted-classes">
                {/* heading */}
                <Box className="text-left pt-3 pb-1">
                    <h4 className='heading'>Pending Classes</h4>
                </Box>

                {/* data grid table */}
                <div className="data-table pb-3 multiple-row-table">
                    <DataGrid 
                        dataSource={classes}
                        keyExpr=""
                        showColumnLines={true}
                        showRowLines={false}
                        showBorders={false}
                        rowAlternationEnabled={true}>
                        <Column dataField="course_name" width={350} caption="Course Name" />
                        <Column dataField="course_date" caption="Course Date" />
                        <Column dataField="maximum" caption="Maximum" />
                        <Column dataField="trainer" caption="Trainer" />
                        <Column dataField="contact_name" caption="Contact" />
                        <Column cellRender={ (e) => pendingActionButton(e.data) } caption="Tasks" />
                        <Scrolling columnRenderingMode="virtual" />

                        <Paging enabled={ false } />
                    </DataGrid>
                </div>
            </div>

            {/* Completed Classes */}
            <div className="completed-classes pb-4">
                {/* heading */}
                <Box className="text-left pt-3 pb-1">
                    <h4 className='heading'>Completed Classes</h4>
                </Box>

                {/* data grid table */}
                <div className="data-table pb-3 multiple-row-table">
                    <DataGrid 
                        dataSource={classes}
                        keyExpr=""
                        showColumnLines={true}
                        showRowLines={false}
                        showBorders={false}
                        rowAlternationEnabled={true}>
                        <Column dataField="course_name" width={350} caption="Course Name" />
                        <Column dataField="course_date" caption="Course Date" />
                        <Column dataField="maximum" caption="Maximum" />
                        <Column dataField="trainer" caption="Trainer" />
                        <Column dataField="contact_name" caption="Contact" />
                        <Column cellRender={ (e) => getStatus(e.data) }  caption="Status" />
                        <Scrolling columnRenderingMode="virtual" />

                        <Paging enabled={ false } />
                    </DataGrid>
                </div>
            </div>
            </>
         )}
    </div>
    )
}

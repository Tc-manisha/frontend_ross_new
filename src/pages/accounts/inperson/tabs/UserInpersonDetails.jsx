import React, { useEffect, useState } from 'react'
import Box from "@mui/material/Box";
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { DateFormate } from '../../../../helper/TblFn';
import Moment from 'react-moment';
import Container from "react-bootstrap/Container";
import { CallGETAPI, CallGETAPINEW } from '../../../../helper/API';
import { useParams } from 'react-router-dom';
import { formatPhoneNumber, prepareOptions } from '../../../../helper/Common';
import { GetCalendarGroup } from '../../../../helper/BasicFn';

export default function UserInpersonDetails({assignedInstructors,is_user=false}) {

    const[inpersonClass, setInpersonsClass] = useState({});
    const[classContacts, setClassContacts] = useState({});
    const [ trainingData, setTrainignData ] = useState({});
    const {inpersonId} = useParams();

    // get inperson data
    const getInpersonData = async() => {
        const inpersonData = await CallGETAPINEW('account/inperson-class/' + inpersonId)
    
        if(inpersonData?.status) {
            const inperson = inpersonData?.data?.data?.inpersonClass
            inperson.account_name = inpersonData?.data?.data?.account_name
            inperson.cert_name = inpersonData?.data?.data?.certName
            inperson.course_name = inpersonData?.data?.data?.courseName
            inperson.site_name = inpersonData?.data?.data?.site_name

            inperson.aed_information    = JSON.parse(inperson?.aed_information);
            inperson.class_contacts     = JSON.parse(inperson?.class_contacts);
            inperson.classes            = JSON.parse(inperson?.classes);
            inperson.class_instructors = inperson?.class_instructors != null ? JSON.parse(inperson?.class_instructors) : '';
            inperson.broad_cast = inperson?.broad_cast != null ? JSON.parse(inperson?.broad_cast) : '';
            inperson.is_instructor_approved = JSON.parse(inperson?.is_instructor_approved) || [];

            setInpersonsClass(inperson)
            setClassContacts(inperson?.class_contacts[0])

            if(inperson?.training_address_id) {
                let res = await CallGETAPI('account/edit-training-address/' + inperson?.training_address_id );
                if(res?.status){
                    setTrainignData(res?.data?.trainingLocations);
                }
            }

            if(inperson?.color_group) {
                // filter colorGroup
                let colorGroup = await GetCalendarGroup();

                if (colorGroup.status)
                {
                    let colorGroupData = colorGroup?.data?.calendarGroup
                    let allcolorGroupData = prepareOptions(colorGroupData, "calendar_group_id", "calendar_group_name");
                    const filteredcolorGroup = allcolorGroupData.find(
                        (colorGroup) => colorGroup.value == inperson?.color_group
                    )
        
                    setInpersonsClass((old) => ({...old, ['color_group_label'] : filteredcolorGroup?.label}))
                }
            }
        }
    }

    // getInpersonData
    useEffect(() => {
        getInpersonData();
    }, [])

    // assignedInstructors
    useEffect(() => {

    }, [assignedInstructors])

    

    return (
        <div>

            
            {/* Course Information */}
            <Box className="text-left">
                <h4 className='heading'>Course Information</h4>
            </Box>

            <table className="w-100 border-b-blue mb-3">
                <thead>
                    <tr className="">
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Certification Agency</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Course</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Registered</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Maximum</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Course Date</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Status</th>
                        {/* <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Keycodes</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue">Package</th> */}
                    </tr>
                </thead>
                <tbody className="odd-even-row">
                    <tr className="">
                        <td className=" py-1 px-2 tbl-border  border-r-blue">
                            {inpersonClass?.cert_name}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.course_name}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                        {inpersonClass?.registered}

                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                        {inpersonClass?.miximum}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.course_date}
                        </td>
                        <td className=" py-1 px-2 tbl-border">
                            {inpersonClass?.status===1?'Active':'Pending'}
                        </td>
                    </tr>
                </tbody>
            </table>


          

            {/* Training Address Information */}
            <Box className="text-left">
                <h4 className='heading'>Training Address Information</h4>
            </Box>

            <table className="w-100 border-b-blue mb-3">
                <thead>
                    <tr className="">
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Company Name</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Training Address</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Phone</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Room Name</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue">Room Number</th>
                    </tr>
                </thead>
                <tbody className="odd-even-row">
                    <tr className="">
                        <td className=" py-1 px-2 tbl-border  border-r-blue">
                            {inpersonClass?.is_site_address == 1 ? inpersonClass?.site_name : trainingData?.account_alternate_traning_location_company_name}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            { trainingData?.account_alternate_traning_location_address1 } { trainingData?.account_alternate_traning_location_address2 } { trainingData?.account_alternate_traning_location_country_name } { trainingData?.account_alternate_traning_location_city } { trainingData?.account_alternate_traning_location_state_name } { trainingData?.account_alternate_traning_location_country_name } 
                              { trainingData?.account_alternate_traning_location_zipcode }
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            <a className="link" href={ 'tel:' + trainingData?.alternative_ext + trainingData?.alternative_phone  }>{ trainingData?.alternative_phone ? formatPhoneNumber(trainingData.alternative_phone) : '' } {trainingData?.alternative_ext ? ' X ' + trainingData?.alternative_ext : ''}</a>
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.room_name}
                        </td>
                        <td className=" py-1 px-2 tbl-border">
                            {inpersonClass?.room_number}
                        </td>
                    </tr>
                </tbody>
            </table>


              {/* account information */}
              {/* <Box className="text-left">
                <h4 className='heading'>Account Information</h4>
            </Box>

            <table className="w-100 border-b-blue mb-3">
                <thead>
                    <tr className="">
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Account Name</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Site Name</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue"></th>
                    </tr>
                </thead>
                <tbody className="odd-even-row">
                    <tr className="">
                        <td className=" py-1 px-2 tbl-border  border-r-blue">
                            {inpersonClass?.account_name}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.site_name}
                        </td>
                        <td className=" py-1 px-2 tbl-border">

                        </td>
                    </tr>
                </tbody>
            </table> */}

            {/* Class Occupancy Information */}
            {/* <Box className="text-left">
                <h4 className='heading'>Class Occupancy Information</h4>
            </Box>

            <table className="w-100 border-b-blue mb-3">
                <thead>
                    <tr className="">
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Registered</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Expected</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Minimum</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Maximum</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue">Student Price</th>
                    </tr>
                </thead>
                <tbody className="odd-even-row">
                    <tr className="">
                        <td className=" py-1 px-2 tbl-border  border-r-blue">
                            {inpersonClass?.registered}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.expected}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.minimum}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.miximum}
                        </td>
                        <td className=" py-1 px-2 tbl-border">
                            {'$' + inpersonClass?.student_price}
                        </td>
                    </tr>
                </tbody>
            </table> */}

            {/* Schedule Information */}
            {/* <Box className="text-left">
                <h4 className='heading'>Schedule Information</h4>
            </Box>

            <table className="w-100 border-b-blue mb-3">
                <thead>
                    <tr className="">
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Course Date</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Time</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Enrollment Closed Date</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Time</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue"># of Instructors</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue">Hours</th>
                    </tr>
                </thead>
                <tbody className="odd-even-row">
                    <tr className="">
                        <td className=" py-1 px-2 tbl-border  border-r-blue">
                            {inpersonClass?.course_date}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.course_time}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.registration_close_date}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.registration_close_time}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.instructors_needed}
                        </td>
                        <td className=" py-1 px-2 tbl-border">
                            {inpersonClass?.hours}
                        </td>
                    </tr>
                </tbody>
            </table> */}

            {/* Parking Information */}
            {/* <Box className="text-left mt-5">
                <h4 className='heading'>Parking Information</h4>
            </Box>

            <table className="w-100 border-b-blue mb-3">
                <thead>
                    <tr className="">
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Parking Fee</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Loading Dock</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Onsite Parking</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Special Parking Instructions</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue">Sign-In / Security Procedures</th>
                    </tr>
                </thead>
                <tbody className="odd-even-row">
                    <tr className="">
                        <td className=" py-1 px-2 tbl-border  border-r-blue">
                            {'$' + inpersonClass?.parking_fee}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.loading_doc == 1 ? 'Yes' : 'No'}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.onsite_parking == 1 ? 'Yes' : 'No'}
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {inpersonClass?.special_parking_instruction}
                        </td>
                        <td className=" py-1 px-2 tbl-border">
                            {inpersonClass?.security_procedure}
                        </td>
                    </tr>
                </tbody>
            </table> */}

<Box className='px-2 mt-3'>
                <div className="row">
                    <div className="col-md-6">
                        <h4 className='heading mt-1'>Class Contact </h4>
                        <table className="w-100 border-gray">
                            <thead>
                                <tr className="">
                                    <th scope='col' width="33%" className=" py-2 px-2 bg-tbl-border border-r-blue">Training  Coordinator </th>
                                    <th scope='col' width="33%" className=" py-2 px-2 bg-tbl-border border-r-blue">Instructor Contact</th>
                                    <th scope='col' width="33%" className=" py-2 px-2 bg-tbl-border">Billing Contact</th>
                                </tr>
                            </thead>
                            <tbody className="odd-even-row">
                                <tr className="">
                                    <td className="py-2 px-2 tbl-border border-r-blue">
                                        <div className="d-flex align-items-center">
                                            <span className='me-2'>Primary: {classContacts?.training_site_cordinator?.primary_name}</span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 tbl-border border-r-blue">
                                        <div className="d-flex align-items-center">
                                            <span className='me-2'>Primary: {classContacts?.instructor_contact?.primary_name}</span>
                                        </div>
                                    </td>
                                    <td className=" py-2 px-2 tbl-border">
                                        <div className="d-flex align-items-center">
                                            <span className='me-2'>Primary: {classContacts?.billing_contact?.primary_name}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="py-2 px-2 tbl-border border-r-blue">
                                        <div className="d-flex align-items-center">
                                            <span className='me-2'>Backup: {classContacts?.training_site_cordinator?.backup_name}</span>
                                        </div>
                                    </td>
                                    <td className=" py-2 px-2 tbl-border border-r-blue">
                                        <div className="d-flex align-items-center">
                                            <span className='me-2'>Backup: {classContacts?.instructor_contact?.backup_name}</span>
                                        </div>
                                    </td>
                                    <td className=" py-2 px-2 tbl-border">
                                        <div className="d-flex align-items-center">
                                            <span className='me-2'>Backup: {classContacts?.billing_contact?.backup_name}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* <div className="col-md-1"></div> */}

                    <div className="col-md-6">
                        <h4 className='heading mt-1'>Instructors</h4>
                        <table className="w-100 border-gray">
                            <thead>
                                <tr className="">
                                    <th className="py-2 px-2 bg-tbl-border">Instructors</th>
                                </tr>
                            </thead>
                            <tbody className="odd-even-row">
                                {assignedInstructors?.map((data, index) => (
                                    <tr className="">
                                        <td className="py-2 px-2 tbl-border">
                                            <span>
                                                <b>{data?.label}: </b>
                                                <b>{data?.contact_name}</b>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>                        
                    </div>
                    
                </div>
            </Box>


           

            <Container style={ { marginTop: "96px" } }>
                <Box className="d-flex justify-content-evenly " style={{width:'100%'}}> 
                    <span>Created Date: <Moment date={"02-13-2023 11:02:00"} format={DateFormate} /></span>
                    <span>Created By: {inpersonClass?.created_by}</span>
                    <span>Modified Date: <Moment date={"02-13-2023 11:02:00"} format={DateFormate} /> </span>
                    <span>Modified By: {inpersonClass?.modified_by}</span>
                    <span>Last Touch Date: 11-14-2020 12:00:00</span>
                </Box>
            </Container>
<br/>
<br/>
<br/>

        </div>
    )
}

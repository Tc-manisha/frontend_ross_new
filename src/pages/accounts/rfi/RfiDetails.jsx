import { Box, Container, FormControlLabel, Switch } from '@mui/material';
import React from 'react'
import { useState, useEffect } from 'react'
import Moment from 'react-moment';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MessageHandler from '../../../components/common/MessageHandler';
import SubHeadingOther from '../../../components/header/SubHeadingOther';
import { CallPOSTAPINEW } from '../../../helper/API';
import { GetAedBrands, GetRfiData } from '../../../helper/BasicFn';
import { FormatDateWithTime, GetProfile, formatPhoneNumber, setPermission } from '../../../helper/Common';
import { DateFormate } from '../../../helper/TblFn';
import Loading from '../Loading';
import { addItem } from '../../../redux/slices/BreadCrumbsSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function RfiDetails() {
    const [rfiData, setRfiData] = useState({});
    const [AEDData, setAEDData] = useState([]);
    const { rfiId } = useParams();
    const [formData, setFormData] = useState([]);
    const [updateButton, setUpdateButton] = useState(false);
    const navigate = useNavigate();
    const [showLoading, setShowLoading] = React.useState(true);
    const [FormMsg, setFormMsg] = useState({ type: true, msg: "" });
    const location = useLocation();
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(addItem({title:'RFI', path: location?.pathname, tab:"" }));
    },[])
  
    const breadcrumbs = useSelector(state => state.BreadCrumbs.items); // Accessing breadcrumbs from Redux store state
  
    // get fetchOnLoad data
    const fetchOnLoad = async () => {
        if (rfiId) {
            const rfiData = await GetRfiData(rfiId);
            let rfiMainData = rfiData?.data;
            rfiMainData.classes = JSON.parse(rfiMainData?.classes);
            rfiMainData.AEDs = JSON.parse(rfiMainData?.AEDs);
            console.log({ checl: rfiMainData.AEDs })
            const AEDSDataList = JSON.parse(rfiMainData.AEDs);
            setAEDData(AEDSDataList);
            setRfiData(rfiMainData);
            setShowLoading(false);
        }
    }

    useEffect(() => {
        fetchOnLoad();
    }, [])

    let profile = GetProfile();// JSON.parse(localStorage.getItem("ross-profile"))
    let account_id = profile?.account_id
    let contact_id = profile?.contact_id

    let is_user = false
    let privileges = []
    if (profile.user_type > 1) {
        let permissions = setPermission();// localStorage.getItem('permissions')
        // let permissionsArr = permissions.split(',')
        // privileges = permissionsArr
        is_user = true
    }

    return (
        <>
            {showLoading ? (
                <>
                    <div className="showloading">
                        {/* <TableSkeletonFull /> */}
                        <Loading />
                    </div>
                </>
            ) : (

                <div className="mt-4" style={{ width: "100%", paddingInline: "45px" }}>

                    {/* top heading */}
                    <SubHeadingOther title="RFI 01-22-2023" hideNew={true} hideHierarchy={true} hideInstructor={true} subHeading={true} bottomLinks={false} breadcrumbs={breadcrumbs}/>

                    {/* top buttons */}
                    <div className="d-flex">
                        {
                            is_user === true ?
                                <>
                                    {privileges.includes('new-inperson') && (
                                        <button className="btn text-primary" type="button" onClick={() => navigate('/account/inperson/new/' + rfiData?.account_id, {
                                            state: {
                                                rfiId: rfiData?.rfi_id
                                            }
                                        })}>
                                            <img
                                                src="/add.svg"
                                                alt="New Inperson"
                                                style={{ marginRight: "5px" }}
                                            />
                                            <span className="ms-1">New Inperson</span>
                                        </button>
                                    )}
                                </>
                                :
                                <>
                                    <button className="btn text-primary" type="button" onClick={() => navigate('/account/inperson/new/' + rfiData?.account_id, {
                                        state: {
                                            rfiId: rfiData?.rfi_id
                                        }
                                    })}>
                                        <img
                                            src="/add.svg"
                                            alt="New Inperson"
                                            style={{ marginRight: "5px" }}
                                        />
                                        <span className="ms-1">New Inperson</span>
                                    </button>
                                </>
                        }
                    </div>

                    {/* main details */}
                    {/* Account Information */}
                    <Box className='px-2'>
                        <h4 className='heading mt-1'>Account Information</h4>
                        {/* table */}
                        <table className="w-100 border-b-blue">
                            <thead>
                                <tr className="">
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Account Name</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Site Name</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue">Site Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td className=" py-1 px-2 border-r-blue">
                                        {rfiData?.account_name}
                                    </td>
                                    <td className=" py-1 px-2 border-r-blue">
                                        {rfiData?.site_name}
                                    </td>
                                    <td className=" py-1 px-2">
                                        {rfiData?.site_address}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Box>

                    {/* Training Address Information */}
                    <Box className='px-2 mt-3'>
                        <h4 className='heading mt-1'>Training Address Information</h4>
                        {/* table */}
                        <table className="w-100 border-b-blue">
                            <thead>
                                <tr className="">
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Company Name</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Training Address</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Phone</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Room Name </th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue">Room Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td className=" py-1 px-2 border-r-blue">
                                        {rfiData?.training_address?.account_alternate_traning_location_company_name}
                                    </td>
                                    <td className=" py-1 px-2 border-r-blue">
                                        {rfiData?.training_address?.account_alternate_traning_location_address1 + ' ' + (rfiData?.training_address?.account_alternate_traning_location_address2 ?? "") + ' ' + rfiData?.training_address?.account_alternate_traning_location_city}
                                    </td>
                                    <td className=" py-1 px-2 border-r-blue">
                                        {rfiData?.training_address?.alternative_phone}
                                    </td>
                                    <td className=" py-1 px-2 border-r-blue">
                                        {rfiData?.room_name}
                                    </td>
                                    <td className=" py-1 px-2">
                                        {rfiData?.room_number}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Box>

                    {/* Course Information */}
                    <Box className='px-2 mt-3'>
                        <h4 className='heading mt-1'>Course Information</h4>
                        {/* table */}
                        <table className="w-100 border-b-blue">
                            <thead>
                                <tr className="">
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Certification Agency</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Course</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Expected</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue">Minimum </th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td className=" py-1 px-2 border-r-blue">
                                        {rfiData?.cert_agency_name}
                                    </td>
                                    <td className=" py-1 px-2 border-r-blue">
                                        {rfiData?.course_name}
                                    </td>
                                    <td className=" py-1 px-2 border-r-blue">
                                        {rfiData?.expected_students}
                                    </td>
                                    <td className=" py-1 px-2">
                                        {rfiData?.min_student}
                                    </td>
                                    <td className=" py-1 px-2">

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Box>

                    {/* Tentative Class Details */}
                    <Box className='px-2 mt-3'>
                        <h4 className='heading mt-1'>Tentative Class Details</h4>
                        <table className="w-100 border-b-blue">
                            <thead>
                                <tr className="">
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Class</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Date/Time Option 1</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Date/Time Option 2</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue">Date/Time Option 3</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rfiData?.classes && rfiData?.classes?.length > 0 ?
                                    <>
                                        {rfiData?.classes && rfiData?.classes?.map((classDetail, index) => (
                                            <tr className="" key={index}>
                                                <td className=" py-1 px-2 border-r-blue">
                                                    {index + 1}
                                                </td>
                                                <td className=" py-1 px-2 border-r-blue">
                                                    {classDetail?.date_time_option_1}
                                                </td>
                                                <td className=" py-1 px-2 border-r-blue">
                                                    {classDetail?.date_time_option_2}
                                                </td>
                                                <td className=" py-1 px-2">
                                                    {classDetail?.date_time_option_3}
                                                </td>
                                            </tr>
                                        ))}
                                    </> : <>
                                        <tr className="">
                                            <td colSpan={5} className=" py-1 px-2 text-center">
                                                No classes found
                                            </td>
                                        </tr>
                                    </>
                                }
                            </tbody>
                        </table>

                    </Box>

                    {/* Parking Information */}
                    <Box className='px-2 mt-3'>
                        <h4 className='heading mt-1'>Parking Information</h4>
                        {/* table */}
                        <table className="w-100 border-b-blue">
                            <thead>
                                <tr className="">
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Parking Fee</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Loading Dock</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Onsite Parking</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Special Parking Instructions</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue">Sign-In / Security Procedures</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td className=" py-1 px-2 border-r-blue">
                                        {rfiData?.parking_fee}
                                    </td>
                                    <td className=" py-1 px-2 border-r-blue">
                                        <FormControlLabel
                                            className={""}
                                            label=""
                                            control={
                                                <Switch
                                                    checked={rfiData?.loading_dock == 1 ? true : false}
                                                    color="primary"
                                                    size="medium"
                                                    value={true}
                                                    name="loading_dock"
                                                />
                                            }
                                        />
                                    </td>
                                    <td className=" py-1 px-2 border-r-blue">
                                        <FormControlLabel
                                            className={""}
                                            label=""
                                            control={
                                                <Switch
                                                    checked={rfiData?.onsite_parking == 1 ? true : false}
                                                    color="primary"
                                                    size="medium"
                                                    value={true}
                                                    name="onsite_parking"
                                                />
                                            }
                                        />
                                    </td>
                                    <td className=" py-1 px-2 border-r-blue">
                                        {rfiData?.special_parking_instructions}
                                    </td>
                                    <td className=" py-1 px-2">
                                        {rfiData?.security_procedures}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Box>

                    {/* AV Information */}
                    <Box className='px-2 mt-3'>
                        <h4 className='heading mt-1'>AV Information</h4>
                        {/* table */}
                        <table className="w-100 border-b-blue">
                            <thead>
                                <tr className="">
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">TV / Projector</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">DVD / Computer</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Speaker System</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Mask Required</th>
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue">Special Requirements</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td className=" py-1 px-2 border-r-blue">
                                        <FormControlLabel
                                            className={""}
                                            label=""
                                            control={
                                                <Switch
                                                    checked={rfiData?.tv_projector == 1 ? true : false}
                                                    color="primary"
                                                    size="medium"
                                                    value={true}
                                                    name="tv_projector"
                                                />
                                            }
                                        />
                                    </td>
                                    <td className=" py-1 px-2 border-r-blue">
                                        <FormControlLabel
                                            className={""}
                                            label=""
                                            control={
                                                <Switch
                                                    checked={rfiData?.dvd_computer == 1 ? true : false}
                                                    color="primary"
                                                    size="medium"
                                                    value={true}
                                                    name="dvd_computer"
                                                />
                                            }
                                        />
                                    </td>
                                    <td className=" py-1 px-2 border-r-blue">
                                        <FormControlLabel
                                            className={""}
                                            label=""
                                            control={
                                                <Switch
                                                    checked={rfiData?.speaker_system == 1 ? true : false}
                                                    color="primary"
                                                    size="medium"
                                                    value={true}
                                                    name="speaker_system"
                                                />
                                            }
                                        />
                                    </td>
                                    <td className=" py-1 px-2 border-r-blue">
                                        <FormControlLabel
                                            className={""}
                                            label=""
                                            control={
                                                <Switch
                                                    checked={rfiData?.covid_restrictions_required == 1 ? true : false}
                                                    color="primary"
                                                    size="medium"
                                                    value={true}
                                                    name="covid_restrictions_required"
                                                />
                                            }
                                        />
                                    </td>
                                    <td className=" py-1 px-2">
                                        {rfiData?.covid_special_requirement_for_instructor}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Box>

                    {/* AED and contact Information */}
                    <Box className='px-2 mt-3'>
                        <div className="row">
                            <div className="col-md-4">
                                <h4 className='heading mt-1'>AED  Information</h4>
                                <table className="w-100 border-gray">
                                    <thead>
                                        <tr className="">
                                            <th scope='col' width="45%" className=" py-2 px-2 bg-tbl-border border-r-blue">Brand</th>
                                            <th scope='col' width="45%" className=" py-2 px-2 bg-tbl-border">Model</th>
                                        </tr>
                                    </thead>
                                    <tbody className="odd-even-row">
                                        {AEDData?.map((data, index) => (
                                            <tr className="" key={index}>
                                                <td className="py-2 px-2 tbl-border border-r-blue">
                                                    <div className="d-flex align-items-center">
                                                        <span className='me-2'>{data?.brand?.label}</span>
                                                    </div>
                                                </td>
                                                <td className=" py-2 px-2 tbl-border">
                                                    <div className="d-flex align-items-center">
                                                        <span className='me-2'>{data?.model?.label}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-1"></div>
                            <div className="col-md-7">
                                <h4 className='heading mt-1'>Contact  Information</h4>
                                <table className="w-100 border-gray">
                                    <thead>
                                        <tr className="">
                                            <th scope='col' width="33%" className=" py-2 px-2 bg-tbl-border border-r-blue">Training Site Coordinator </th>
                                            <th scope='col' width="33%" className=" py-2 px-2 bg-tbl-border border-r-blue">Instructor Contact Primary</th>
                                            <th scope='col' width="33%" className=" py-2 px-2 bg-tbl-border">Billing Contact</th>
                                        </tr>
                                    </thead>
                                    <tbody className="odd-even-row">
                                        <tr className="">
                                            <td className="py-2 px-2 tbl-border border-r-blue">
                                                <div className="d-flex align-items-center">
                                                    <span className='me-2'>Primary: {rfiData?.training_address_information_primary_name}</span>
                                                </div>
                                            </td>
                                            <td className="py-2 px-2 tbl-border border-r-blue">
                                                <div className="d-flex align-items-center">
                                                    <span className='me-2'>Primary: {rfiData?.instructor_contact_primary_name}</span>
                                                </div>
                                            </td>
                                            <td className=" py-2 px-2 tbl-border">
                                                <div className="d-flex align-items-center">
                                                    <span className='me-2'>Primary: {rfiData?.billing_contact_primary_name}</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="">
                                            <td className="py-2 px-2 tbl-border border-r-blue">
                                                <div className="d-flex align-items-center">
                                                    <span className='me-2'>Backup: {rfiData?.training_address_information_backup_name}</span>
                                                </div>
                                            </td>
                                            <td className=" py-2 px-2 tbl-border border-r-blue">
                                                <div className="d-flex align-items-center">
                                                    <span className='me-2'>Backup: {rfiData?.instructor_contact_backup_name}</span>
                                                </div>
                                            </td>
                                            <td className=" py-2 px-2 tbl-border">
                                                <div className="d-flex align-items-center">
                                                    <span className='me-2'>Backup: {rfiData?.billing_contact_backup_name}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Box>

                    {/* General Information */}
                    <Box className='px-2 mt-3 mb-3'>
                        <h4 className='heading mt-1'>General Information</h4>
                        {/* table */}
                        <table className="w-100 border-b-blue">
                            <thead>
                                <tr className="">
                                    <th className=" py-1 px-2 bg-tbl-border border-t-blue">Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td className=" py-1 px-2">
                                        {rfiData?.comments}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Box>

                    {/* bottom dates */}
                    <Container className='my-5'>
                        <Box className="d-flex justify-content-evenly ">
                            <span>Created Date: {FormatDateWithTime(rfiData?.created_date)} </span>
                            <span>Created By: {rfiData?.created_by}</span>
                            <span>Modified Date: {FormatDateWithTime(rfiData?.modified_date)} </span>
                            <span>Modified By: {rfiData?.modified_by}</span>
                        </Box>
                    </Container>
                </div>
            )}
        </>
    )
}

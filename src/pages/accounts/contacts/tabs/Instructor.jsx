import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './table.css'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';


// import React, { useEffect, useState } from 'react'
import SubHeadingOther from '../../../../components/header/SubHeadingOther';
import { Form } from "react-bootstrap";
import Select from 'react-select'
// import { ProductsDropDown } from '../../helper/BasicFn';
import StatesModal from '../../../../components/modals/StatesModal';
import { useNavigate, useParams,Link } from 'react-router-dom';
import { CallGETAPI, CallGETAPINEW, CallPOSTAPI, CallPOSTAPINEW } from '../../../../helper/API';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { getImageName, prepareOptions } from '../../../../helper/Common';
import MessageHandler from '../../../../components/common/MessageHandler';
import { EditIcon } from '../../../../helper/Icons';
import Loading from '../../Loading';
import { DecryptToken } from '../../../../helper/BasicFn';
import Edit from "../../../../img/Edit.png"
import TableSkeleton from '../../skeleton/table/TableSkeleton';


const instructors = [
    {
        ID: 1,
        FirstName: 'John',
        LastName: 'Heart',
        Prefix: 'Mr.',
        Position: 'CEO',
        Picture: 'images/employees/01.png',
        BirthDate: '1964/03/16',
        HireDate: '1995/01/15',
        Notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
        Address: '351 S Hill St.',
        State: 'Register Assign',
        City: 'Los Angeles',
    },
    {
        ID: 2,
        FirstName: 'John',
        LastName: 'Heart',
        Prefix: 'Mr.',
        Position: 'CEO',
        Picture: 'images/employees/01.png',
        BirthDate: '1964/03/16',
        HireDate: '1995/01/15',
        Notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
        Address: '351 S Hill St.',
        State: 'Register Assign',
        City: 'Los Angeles',
    },
    {
        ID: 3,
        FirstName: 'John',
        LastName: 'Heart',
        Prefix: 'Mr.',
        Position: 'CEO',
        Picture: 'images/employees/01.png',
        BirthDate: '1964/03/16',
        HireDate: '1995/01/15',
        Notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
        Address: '351 S Hill St.',
        State: 'Register Assign',
        City: 'Los Angeles',
    },
    {
        ID: 4,
        FirstName: 'John',
        LastName: 'Heart',
        Prefix: 'Mr.',
        Position: 'CEO',
        Picture: 'images/employees/01.png',
        BirthDate: '1964/03/16',
        HireDate: '1995/01/15',
        Notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
        Address: '351 S Hill St.',
        State: 'Register Assign',
        City: 'Los Angeles',
    },
];


export default function Instructor({InstructorData,ahaDetails,hsiDetails}) {
    const navigate = useNavigate();
    const [ selectStatusData, setStatusData ] = useState([]);
    const [ showLoading, setShowLoading ] = React.useState(true);
    const [ ShowStatesModal, setShowStatesModal ] = useState(false);
    const [ StatesModalData, setStatesModalData ] = useState([]);
    const [ SelectedStatesData, setSelectedStatedData ] = useState("");
    const [ SelectedStatesName, setSelectedStatedName ] = useState([]);
    const [ validated, setValidated ]   = useState(false);
    const [ formData, setFormData ]     = useState({});
    const [ images, setImages ]         = useState([]);
    const [FormMsg, setFormMsg]         = useState({ type: true, msg: "" });

    const { contactId } = useParams();
   
    const selectData = [ 
        {
            value: '1',
            label: 'Active',
        },
    ];
    const ratingData = [ 
        {
            value: '1',
            label: 'A',
        }, {
            value: '2',
            label: 'B',
        }, {
            value: '3',
            label: 'C',
        }, {
            value: '4',
            label: 'D',
        }, {
            value: '5',
            label: 'E',
        }, {
            value: '6',
            label: 'F',
        },
    ];
    const [desciplineData,setDesciplineData] = useState([
        { values:{}, label: 'ACLS', key: 'ACLS'},
        { values:{}, label: 'BLS', key: 'BLS'}, 
        { values:{}, label: 'Heartsaver', key: 'heart_saver'},
        { values:{}, label: 'PALS', key: 'PALS'},
    ]);
    const [levelsData,setLevelsData] = useState([
        { values:{}, label: 'Level 1', key: 'level_1'},
        { values:{}, label: 'Level 2', key: 'level_2'},
        { values:{}, label: 'Level 3', key: 'level_3'},
        { values:{}, label: 'Level 4', key: 'level_4'},
    ]);
    const [documentsData,setDocumentsData] = useState([
        {values:{}, label: 'Contractor Agreement', key: 'contractor_agreement'},
        {values:{}, label: 'Resume', key: 'resume'},
        {values:{}, label: 'Head Shot', key: 'head_shot'},
        {values:{}, label: 'Insurance Policy', key: 'insurance_policy'},
        {values:{}, label: 'Monitoring Form', key: 'monitoring_form'},
        {values:{}, label: 'Vehicle Information', key: 'vehicle_information'},
    ]);
    console.log(documentsData)
    // calendar icon
    const calendarIcon = () => {
        return (
            <img src="/calendar.svg" alt="calendar" />
        )
    }

    const token= DecryptToken();

    // handle calendar change
    const handleCalendarChange = (value, keyName, key) =>
    {
        let date = value?.$D;
        date  = date < 10 ? '0' + date : date;
        let month = value?.$M;
        month  = month < 10 ? '0' + month : month;
        let year = value?.$y;

        let dateValue = year + '-' + month + '-' + date;

        setFormData((old) => ({ ...old, [ keyName ]: { ...formData[keyName], [key] : dateValue} }));
    };

    // handle calendar change
    const handleInputChangeWithIndex = (e, keyName, key) =>
    {
        setFormData((old) => ({ ...old, [ keyName ]: { ...formData[keyName], [key] : e.target.value} }));
    };

    // on load fetch data
    const fetchOnload = async () => {
        const results = await CallGETAPI('account/get-state-by-country/231') 
        if(results?.status) {
            setStatesModalData(results?.data?.state)
        }

        const instructorStatus = await CallGETAPINEW('account/instructor-statuses') 
        if(instructorStatus?.status) {
            let statusData = instructorStatus?.data?.data
            let allStatusData = prepareOptions(statusData, 'instuctor_status_id', 'instructor_status')
            setStatusData(allStatusData)
        }

        setShowLoading(false);

    }

    // set selected states from modal
    const setSelectedStatesName = () => {
        let stateNames = [];
        let statesSeletedValues = (SelectedStatesData) ? SelectedStatesData.split(",") : [];
        for(let i = 0; i <= statesSeletedValues.length; i++) {
            const state = StatesModalData.find(
                (item) => item.state_id == statesSeletedValues[i]
            )
            if(state) {
                stateNames.push(state.state_name)
            }
        }
        
        setSelectedStatedName(stateNames)
    }

    const handleInputChange = (e) =>
    {
        if (e.target.name == 'account_site_phone' || e.target.name == 'account_billing_info_billing_phone' || e.target.name == 'account_shipping_info_shipping_phone')
        {
            e.target.value = e.target.value.replace(/[^0-9 ]/g, "").trim();
            e.target.value = e.target.value.slice(0, 10)
        }

        if(e.target.type == 'checkbox') {
            setFormData((old) => ({ ...old, [ e.target.name ]: e.target.checked }));
        } else {
            setFormData((old) => ({ ...old, [ e.target.name ]: e.target.value }));
        }
    };

    // handle select change
    const handleSelectChange = (data, key) =>
    {
        setFormData((old) => ({ ...old, [ key ]: data.value }));
    };

    // handle file change
    const handleFileChange = (e) => {
        let file = e.target.files[0]
        file.field_name = e.target.name
        let url = URL.createObjectURL(file)
        setFormData((old) => ({ 
            ...old, 
            [ e.target.name + '_image_url' ]: url,
            [ e.target.name ]  : file.name,
        }));
        setImages((old) => ({ 
            ...old, 
            [ e.target.name ]: file,
        }));
    }

    // handle submit
    const handleSubmit = async (e) => {

        e.preventDefault();

        // setValidated();
        const form = e.currentTarget;

        if (form.checkValidity() === false)
        {
            setValidated(true);
            return;
        }

        let statesValue = SelectedStatesData.split(",")

        // payload data to send with api
        let payloadData = {
            "id": Math.floor(Math.random() * 10),
            "modified_by_id": 'null',
            "contact_id": contactId,
            "account_main_contact_id": contactId,
            "rating": formData?.rating ? formData?.rating : ratingData[0]?.value,
            "status": formData?.status ? formData?.status : selectData[0]?.value,
            "vehicle_year": formData?.vehicle_year,
            "model_brand": formData?.model_brand,
            "color": formData?.color,
            "plate_number": formData?.plate_number,
            "documents": {
                "contractor_agreement": formData?.contractor_agreement,
                "resume": formData?.resume,
                "head_shot": formData?.head_shot,
                "insurance_policy": formData?.insurance_policy,
                "monitoring_form": formData?.monitoring_form,
                "vehicle_information": formData?.vehicle_information,
            },
            "state": formData?.state,
            "states": statesValue,
            "comment": formData?.comment,
            "profile_pic": formData?.profile_pic,
            "AHA": {
                "AHA_id": formData?.AHA_id,
                "training_center_id": formData?.training_center_id,
                "disiplines": {
                    "ACLS": formData?.ACLS,
                    "BLS": formData?.BLS,
                    "heart_saver": formData?.heart_saver,
                    "PALS": formData?.PALS,
                }
            },
            "HSI": {
                "registry": formData?.registry,
                "training_center_id": formData?.HSI_training_center_id,
                "levels": {
                    "level_1": formData?.level_1,
                    "level_2": formData?.level_2,
                    "level_3": formData?.level_3,
                    "level_4": formData?.level_4,
                }
            }
        }

        let instructorData = new FormData();
        instructorData.append('images', images)
        instructorData.append('data', payloadData)

        let combinedData = {
            ...instructorData, payloadData
        }

        const headers = { 'content-type': 'multipart/form-data' }

        let result = await CallPOSTAPINEW("account/add-instructor", payloadData)

        setFormMsg({ type: result?.data?.status, msg: result?.data?.message });
        if(result?.status) {
            navigate('/account/contact-details/' + contactId, {
                state: {
                    tab: 'Instructor',
                    type: result?.data?.status, 
                    msg: result?.data?.message
                }
            })
        }
    };

    // check for states change from modals
    useEffect(() => {
        if(SelectedStatesData) {
            setSelectedStatesName();
        }
    }, [SelectedStatesData])

    useEffect(()=>{
        // desciplineData
        let discplineStr = ahaDetails?.disiplines
        if(discplineStr){
            let discplineJson = JSON.parse(discplineStr);
            let newArr = [];
            desciplineData.map((DD)=>{
                DD.values = discplineJson[DD.key]
                // let keyObj = {key: DD.key,label:DD.lable  }
                newArr.push(DD)
            })
            setDesciplineData(newArr)
        }

        // levelsData
        let levelsSTr = hsiDetails?.levels;
        if(levelsSTr){
            let levelsJson = JSON.parse(levelsSTr);
            let newArr = [];
            levelsData.map((DD)=>{
                DD.values = levelsJson[DD.key]
                newArr.push(DD)
            })
            setLevelsData(newArr)
        }   
        let StatesStr           = InstructorData?.states;
        let statesSeletedValues = (StatesStr) ? StatesStr.split(",") : [];
        setSelectedStatedName(statesSeletedValues)

        // setDocumentsData
        let docStr  = InstructorData?.documents
        if(docStr){
            let docJson  = JSON.parse(docStr);
            let arr  =[];
            documentsData.map((DD)=>{
                DD.values[`${DD.key}_expiration_date`]  = docJson?.[`${DD.key}_expiration_date`]; 
                DD.values[`${DD.key}_filename`]         = docJson?.[`${DD.key}_filename`]; 
                DD.values[`${DD.key}_upload_date`]      = docJson?.[`${DD.key}_upload_date`]; 
                DD.values[`${DD.key}_uploaded_by`]      = docJson?.[`${DD.key}_uploaded_by`]; 
                arr.push(DD);
            })
            setDocumentsData(arr)
        }
    },[])

    useEffect(()=>{
        fetchOnload();
    },[])
    console.log(InstructorData)

    // return ("");

//     return (
//         <div className='relative'>

//             {/* loading */}
//             {showLoading && (
//                 <div className="showloading">
//                     <Loading />
//                 </div>
//             )}
            
//             {/* instructor classes */}
//             <div className="instructor">
//                 {/* heading */}
//                 <Box className="text-left pt-3 pb-1 d-flex justify-content-between">
//                     <h4 className='heading'>Instructor Information</h4>

//                     <button className='new-btn btn  d-flex edit' 
//                         onClick={()=>navigate('/account/instructor/edit/' + contactId)}
//                     > {EditIcon} Edit </button>
//                 </Box>


//                 <div className="mt-4" style={ { width: "100%", paddingInline: "5px" } }>


//                     <StatesModal
//                         ShowStatesModal={ ShowStatesModal }
//                         setShowStatesModal={ setShowStatesModal }
//                         StatesModalData={ StatesModalData }
//                         SelectedStatesData={ SelectedStatesData }
//                         setSelectedStatedData={ setSelectedStatedData }
//                     />

//                     {/* main form content */}
//                     <Form
//                         className=""
//                         onSubmit={ handleSubmit }
//                         noValidate
//                         validated={ validated }
//                         id="create-new-site-form"
//                         encType="multipart/form-data"
//                     >
//                         <div className="form my-3 p-2" style={ { background: "#eee" } }>
//                             <h2 className="heading">General Information</h2>
//                             <div className="row">
//                                 <div className="col-md-9">
//                                     <div className="row">
//                                         <div className="d-flex justify-content-between">
//                                             <Form.Group className={ "col-md-3" }>
//                                                 <Form.Label>Instructor Rating {InstructorData?.rating}</Form.Label>
//                                                 <input type={'text'}
//                                                 readOnly
//                                                  value={InstructorData?.rating} className="form-control" />
//                                             </Form.Group>

//                                             <Form.Group className={ "col-md-3" }>
//                                                 <Form.Label>Status</Form.Label>
//                                                 <input 
//                                                     type={'text'}
//                                                     readOnly
//                                                     value={InstructorData?.status} 
//                                                     className="form-control" 
//                                                 />
//                                             </Form.Group>
//                                         </div>

//                                         <div className="row my-3">
//                                             <Form.Group className={ "col" }>
//                                                 <Form.Label>Vehicle Year</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     readOnly
//                                                     name="vehicle_year"
//                                                     value={InstructorData?.vehicle_year}
//                                                     // onChange={handleInputChange}
//                                                 />
//                                             </Form.Group>
//                                             <Form.Group className={ "col-md-4" }>
//                                                 <Form.Label>Model / Brand</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     readOnly
//                                                     name="model_brand"
//                                                     value={InstructorData?.model_brand}
//                                                     // onChange={ handleInputChange }
//                                                 />
//                                             </Form.Group>
//                                             <Form.Group className={ "col" }>
//                                                 <Form.Label>Color</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     readOnly
//                                                     name="color"
//                                                     value={InstructorData?.color}
//                                                     // onChange={ handleInputChange }
//                                                 />
//                                             </Form.Group>
//                                             <Form.Group className={ "col" }>
//                                                 <Form.Label>Plate Number</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     readOnly
//                                                     name="plate_number"
//                                                     value={InstructorData?.plate_number}
//                                                     // onChange={ handleInputChange }
//                                                 />
//                                             </Form.Group>
//                                             <Form.Group className={ "col" }>
//                                                 <Form.Label>State</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     readOnly
//                                                     name="state"
//                                                     value={InstructorData?.state}
//                                                     // onChange={ handleInputChange }
//                                                 />
//                                             </Form.Group>
//                                         </div>

//                                         <Form.Group className={ "col-md-12" }>
//                                             <Form.Label>Comments</Form.Label>
//                                             <Form.Control
//                                                 as="textarea"
//                                                 rows={4}
//                                                 name="comment"
//                                                 value={InstructorData?.comment}
//                                                 // onChange={ handleInputChange }
//                                             />
//                                         </Form.Group>
//                                     </div>
//                                 </div>
//                                 <div className="col-md-3">
//                                     <div className="text-center file-input-div">
//                                         {InstructorData?.profile_pic && InstructorData?.profile_pic !== 'undefined' ? 
//                                         <img className='file-image' src={InstructorData?.profile_pic} alt="photo1" /> : 
//                                         <img className='file-image' src={"/photo-image.svg"} alt="photo2" />
//                                         }
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="form my-3 p-2" style={ { background: "#eee" } }>
//                             <h2 className="heading">American Heart Association (AHA) Information</h2>
//                             <div className="row">
                                
//                                 <Form.Group className={ "col-md-5" }>
//                                     <Form.Label>AHA ID</Form.Label>
//                                     <Form.Control
//                                         type="number"
//                                         name="AHA_id"
//                                         required
//                                         value={ahaDetails?.AHA_id}
//                                         // onChange={ handleInputChange }
//                                     />
//                                 </Form.Group>
//                                 <Form.Group className={ "col-md-5" }>
//                                     <Form.Label>Training Center Id</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         readOnly
//                                         name="training_center_id"
//                                         required
                                        
//                                         value={ahaDetails?.training_center_id}
//                                         // onChange={ handleInputChange }
//                                     />
//                                 </Form.Group>
//                             </div>
//                             <h2 className="heading mt-4">Disiplines</h2>
//                             <table width='100%'>
//                                 <thead>
//                                     <tr>
//                                         <th scope='col' width="10%" className='px-3'></th>
//                                         <th scope='col' width="15%" className='px-3'>eCard Code</th>
//                                         <th scope='col' width="20%" className='px-3'>Expiration Date</th>
//                                         <th scope='col' width="20%" className='px-3'>Cert File</th>
//                                         <th scope='col' width="20%" className='px-3'>Upload Date</th>
//                                         <th scope='col' width="15%" className='px-3'>Uploaded By</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {desciplineData.map((discpline,index) => (
//                                         <tr key={index}>
//                                             <td className="px-3 py-2" style={{fontSize: '20px', fontWeight: 'bold'}}>{discpline?.label}</td>
//                                             <td className="px-3 py-2">
//                                                 <Form.Control
//                                                     type="text"
//                                                     readOnly
//                                                     name="e_card_code"
//                                                     // required
//                                                     value={discpline?.values?.[`${discpline?.key}_e_card_code`]}
//                                                     // onChange={ (e) =>  handleInputChangeWithIndex(e, discpline?.key, 'e_card_code') }
//                                                 />
//                                             </td>
//                                             <td className="px-3 py-2">
//                                                 <div className="d-flex align-items-center calendar-input-btn">
//                                                     <input type="text" readOnly 
//                                                     value={discpline?.values?.[`${discpline?.key}_expiration_date`]}
//                                                      />
//                                                 </div>
//                                             </td>
//                                             <td className="px-3 py-2">
//                                                 <div className="d-flex align-items-center">
//                                                     <Form.Control
//                                                         type="text"
//                                                         readOnly
//                                                         name="cert_file"
//                                                         value={getImageName(discpline?.values?.[`${discpline?.key}_cert_file`])}
//                                                     />
//                                                     {/* <button className='btn ms-2 file-input-div' type='button'>
//                                                         <img src="/upload.svg" alt="upload" />
//                                                         <input type="file" name={discpline?.key + '_cert_file'} className='hidden-file' 
//                                                         onChange={ (e) => handleFileChangeWithIndex(e, discpline?.key, 'cert_file') }
//                                                         // onChange={ handleFileChange }
//                                                         />
//                                                     </button> */}

//                                                 </div>
//                                             </td>
//                                             <td className="px-3 py-2">
//                                                 <div className="d-flex align-items-center calendar-input-btn">
//                                                 <Form.Control
//                                                         type="text"
//                                                         readOnly
//                                                         name="cert_file"
//                                                         value={discpline?.values?.[`${discpline?.key}_upload_date`]}
//                                                     />
//                                                 </div>
//                                             </td>
//                                             <td className="px-3 py-2">
//                                                 <Form.Control
//                                                     type="text"
//                                                     readOnly
//                                                     name="uploaded_by"
//                                                     value={discpline?.values?.[`${discpline?.key}_uploaded_by`]}
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         <div className="form my-3 p-2" style={ { background: "#eee" } }>
//                             <h2 className="heading"> American Safety and Health Institute (ASHI) Information</h2>
//                             <div className="row">
//                                 <Form.Group className={ "col-md-5" }>
//                                     <Form.Label>Registry</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         readOnly
//                                         name="registry"
//                                         required
//                                         value={hsiDetails?.registry}
//                                         // onChange={ handleInputChange }
//                                     />
//                                 </Form.Group>
//                                 <Form.Group className={ "col-md-5" }>
//                                     <Form.Label>Training Center Id</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         readOnly
//                                         name="HSI_training_center_id"
//                                         required
//                                         value={hsiDetails?.training_center_id}
//                                         // onChange={ handleInputChange }
//                                     />
//                                 </Form.Group>
//                             </div>
//                             <h2 className="heading mt-4">Levels</h2>
//                             <table width='80%'>
//                                 <thead>
//                                     <tr>
//                                         <th scope='col' width="10%" className='px-3'></th>
//                                         <th scope='col' width="25%" className='px-3'>Expiration Date</th>
//                                         <th scope='col' width="25%" className='px-3'>Cert File</th>
//                                         <th scope='col' width="20%" className='px-3'>Upload Date</th>
//                                         <th scope='col' width="20%" className='px-3'>Uploaded By</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {levelsData.map((level,index) => (
//                                         <tr key={index}>
//                                             <td className="px-3 py-2" style={{fontSize: '20px', fontWeight: 'bold'}}>{level?.label}</td>
//                                             <td className="px-3 py-2">
//                                                 <div className="d-flex align-items-center calendar-input-btn">
//                                                   <input type="text" readOnly 
//                                                   value={level?.values?.[`${level?.key}_expiration_date`]}
//                                                   />
//                                                 </div>
//                                             </td>
//                                             <td className="px-3 py-2">
//                                                 <div className="d-flex align-items-center">
//                                                     <Form.Control
//                                                         type="text"
//                                                         readOnly
//                                                         name="cert_file"
//                                                         // required
//                                                         value={getImageName(level?.values?.[`${level?.key}_cert_file`])}
//                                                         // value={formData[level?.key + '_cert_file']}
//                                                     />


//                                                 </div>
//                                             </td>
//                                             <td className="px-3 py-2">
//                                                 <div className="d-flex align-items-center calendar-input-btn">
//                                                     <input type={'text'} readOnly 
//                                                         value={level?.values?.[`${level?.key}_upload_date`]}
//                                                          />
//                                                 </div>
//                                             </td>
//                                             <td className="px-3 py-2">
//                                                 <Form.Control
//                                                     type="text"
//                                                     readOnly
//                                                     name="uploaded_by"
//                                                     // required
//                                                     value={level?.values?.[`${level?.key}_uploaded_by`]}
//                                                     // value={level?.values?.uploaded_by}
//                                                     // onChange={ (e) =>  handleInputChangeWithIndex(e, level?.key, 'uploaded_by') }
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         <div className="form my-3 p-2 pb-4" style={ { background: "#eee" } }>
//                             <h2 className="heading">States Selected</h2>
//                             <div className="states mt-3 ps-4">
//                                 {SelectedStatesName?.length > 0 ? <>
//                                     {SelectedStatesName?.map((state, index) => (
//                                         <h5 key={index}>{state}</h5>
//                                     ))}
//                                 </> : <>
//                                     <h5>No states selected yet.</h5>
//                                 </> }
//                             </div>

//                         </div>

//                         <div className="form my-3 p-2" style={ { background: "#eee" } }>
//                             <h2 className="heading">Documents</h2>
//                             <table width='90%'>
//                                 <thead>
//                                     <tr>
//                                         <th scope='col' width="17%" className='px-3'></th>
//                                         <th scope='col' width="18%" className='px-3'>Document Filename</th>
//                                         <th scope='col' width="25%" className='px-3'>Expiration Date</th>
//                                         <th scope='col' width="25%" className='px-3'>Upload Date</th>
//                                         <th scope='col' width="15%" className='px-3'>Uploaded By</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {documentsData.map((document,index) => (
//                                         <tr key={index}>
//                                             <td className="px-3 py-2" style={{fontSize: '16px'}}>{document?.label}</td>
//                                             <td className="px-3 py-2">
//                                                 <Form.Control
//                                                     type="text"
//                                                     readOnly
//                                                     name="filename"
//                                                     // required
//                                                     value={getImageName(document?.values?.[`${document?.key}_filename`])}
//                                                     // onChange={ (e) =>  handleInputChangeWithIndex(e, document?.key, 'filename') }
//                                                 />
//                                             </td>
//                                             <td className="px-3 py-2">
//                                                 <div className="d-flex align-items-center calendar-input-btn">
//                                                     <input type={'text'} readOnly  
//                                                     // value={document?.values}
//                                                     value={document?.values?.[`${document?.key}_expiration_date`]}
//                                                     />
//                                                 </div>
//                                             </td>
//                                             <td className="px-3 py-2">
//                                                 <div className="d-flex align-items-center calendar-input-btn">
//                                                 <input type={'text'} readOnly  
//                                                     // value={document?.values}
//                                                     value={document?.values?.[`${document?.key}_upload_date`]}
//                                                     />
//                                                 </div>
//                                             </td>
//                                             <td className="px-3 py-2">
//                                                 <Form.Control
//                                                     type="text"
//                                                     readOnly
//                                                     name="uploaded_by"
//                                                     value={document?.values?.[`${document?.key}_uploaded_by`]}
//                                                     // required
//                                                     // onChange={ (e) =>  handleInputChangeWithIndex(e, document?.key, 'uploaded_by') }
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* alert msg */ }
//                         <div className="my-4">
//                             <MessageHandler
//                                 status={ FormMsg.type }
//                                 msg={ FormMsg.msg }
//                                 HandleMessage={ setFormMsg }
//                             />
//                         </div>

//                         {/* bottom buttons */ }
//                         {/* <div className="row my-4" >
//                             <div className="col-12 content-flex-right" >
//                                 <button className="btn btn-danger text-uppercase" type="button" onClick={()=>{navigate(-1)}}>Cancel</button>
//                                 <button className="btn btn-success text-uppercase ms-2" type='submit'>Submit</button>
//                             </div>
//                         </div> */}

//                     </Form>
//                 </div>
//                 {/* data grid table */}
//                 <div className="data-table pb-3 multiple-row-table">

                    
//                     {/* <DataGrid 
//                         dataSource={instructors}
//                         //   height={ 250 }
//                         keyExpr="ID"
//                         showColumnLines={true}
//                         showRowLines={false}
//                         showBorders={false}
//                         rowAlternationEnabled={true}>
//                         <Column dataField="Position" caption="Position" />
//                         <Column dataField="Prefix" caption="Course" />
//                         <Column dataField="BirthDate" caption="Class Date" width={200} dataType="date" />
//                         <Column dataField="FirstName" caption="Enrolled"  width={150} />
//                         <Column dataField="LastName" caption="Trainer" />
//                         <Column dataField="City" caption="Contact" />
//                         <Column dataField="Address" caption="Address" />
//                         <Column dataField="State" caption="Tasks" />
//                         <Scrolling columnRenderingMode="virtual" />
//                         <Paging enabled={ false } />
//                     </DataGrid> */}
//                 </div>
//             </div>

//         </div>
//     )
// }


return(
    <>
      <div className='relative'>
             {showLoading && (
                <div className="showloading">
                    <TableSkeleton />
                </div>
            )}
            
            {!showLoading && ( <>
             {/* instructor classes */}
            <div className="instructor" style={{marginBottom:"5%"}}>
               <div className="mt-4" style={ { width: "100%", paddingInline: "5px" } }>


                    <StatesModal
                        ShowStatesModal={ ShowStatesModal }
                        setShowStatesModal={ setShowStatesModal }
                        StatesModalData={ StatesModalData }
                        SelectedStatesData={ SelectedStatesData }
                        setSelectedStatedData={ setSelectedStatedData }
                    />
                    </div>

         <div className="text-left  pt-3 pb-1" style={{display:"flex", flexDirection:"row"}}>
          <div className='col'>
           <Box className="text-left pt-1 pb-1">
					<h4 className='heading'>General Information</h4>
                 </Box>

                <table className='theme-table' >
					<thead>
						<tr>
							<td>Instructor Rating</td>
						    <td>States</td>
							<td >Status</td>
							
                       </tr>
					</thead>
					<tbody>
		  <tr >
            <td>{InstructorData?.rating}</td>
            <td>{InstructorData?.states}</td>
            <td>{InstructorData?.status}</td>
          </tr>
             </tbody>
             <thead>
						<tr>
							<td colSpan={3}>Comments</td>
						 </tr>
					</thead>
                    <tbody>
		  <tr >
            <td colSpan={3}>{InstructorData?.comment}</td>
          </tr>
             </tbody>
             </table>
             </div>

             <div className="col-md-3">
            <button style={{display:"flex",flexDirection:"row",marginLeft:"78%",backgroundColor:"transparent",border:"none"}}>
            <Link to={`/account/instructor/edit/${contactId}`} style={{display:"flex",flexDirection:"row", textDecoration: 'none' }}>
             <img src={Edit} alt='edit' style={{height:"10%"}}/>
             <h5 class="ms-1" style={{color:"#0C71C3",marginLeft:"4%",fontWeight:'80',fontFamily:"sans-serif",fontSize:'16px'}} >Edit</h5>
             </Link>
             </button>
             <div className="text-center" style={{marginTop:"15%",height:"76%"}}>
  {InstructorData?.profile_pic && InstructorData?.profile_pic !== 'undefined' ? (
    <img className='file-image' style={{ height: '100%',width:"80%" }} src={InstructorData?.profile_pic} alt="photo1" />
  ) : (
    <img className='' style={{ height: '4%' }} src={"/photo-image.svg"} alt="photo2" />
  )}
</div>

                                </div>
       

</div>

<div className="text-left  pt-3 pb-1">
           <Box className="text-left pt-1 pb-1">
					<h4 className='heading'>Vehicle Information</h4>
				</Box>

                <table className='theme-table' >
					<thead>
						<tr>
							<td>Year</td>
						    <td>Model / Brand</td>
							<td>Color</td>
							<td>Plate #</td>
                            <td>State</td>
                       </tr>
					</thead>
					<tbody>
		  <tr >
            <td>{InstructorData?.vehicle_year}</td>
            <td>{InstructorData?.model_brand}</td>
            <td>{InstructorData?.color}</td>
            <td>{InstructorData?.plate_number}</td>
            <td>{InstructorData?.state}</td>
          </tr>
             </tbody>
             </table>

</div>


<div className="text-left  pt-3 pb-1">
           <Box className="text-left pt-1 pb-1">
					<h4 className='heading'>AHA Information</h4>
				</Box>

                <table className='theme-table' >
					<thead>
						<tr>
							<td>AHA ID</td>
						    <td>Training Center ID</td>
							<td>Disipline</td>
							<td>eCard Code</td>
                            <td>Expiration Date</td>
                            <td>Certification File</td>
                       </tr>
					</thead>
					<tbody>
          <tr >
            <td>{ahaDetails?.AHA_id}</td>
            <td>{ahaDetails?.training_center_id}</td>
            <td>{desciplineData.map((discpline,index) => (
               <p> {discpline?.label}</p>
            ))}</td>
            <td>
            {desciplineData.map((discpline,index) => (
            <p>{discpline?.values?.[`${discpline?.key}_e_card_code`]}</p>
            ))}</td>
           <td>
  {desciplineData.map((discpline, index) => (
    <p key={index}>
      {discpline?.values?.[`${discpline?.key}_expiration_date`] &&
        new Date(discpline.values[`${discpline.key}_expiration_date`]).toLocaleDateString('en-US')}
    </p>
  ))}
</td>
         <td>{desciplineData.map((discpline,index) => (
              <p> {getImageName(discpline?.values?.[`${discpline?.key}_cert_file`])} </p> 
            ))}</td>
           </tr>
           </tbody>
         </table>

</div>


<div className="text-left  pt-3 pb-1">
           <Box className="text-left pt-1 pb-1">
					<h4 className='heading'>HSI Information</h4>
				</Box>

                <table className='theme-table' >
					<thead>
						<tr>
							<td>Registry ID</td>
						    <td>Training Center ID</td>
							<td>Level</td>
							<td>Expiration Date</td>
                            <td>Certification File</td>
                       </tr>
					</thead>
					<tbody>
                   <tr >
            <td>{hsiDetails?.registry}</td>
            <td>{hsiDetails?.training_center_id}</td>
            <td> {levelsData.map((level,index) => (
               <p> {level?.label}</p>
            ))}</td>
           <td>
  {levelsData.map((level, index) => (
    <p key={index}>
      {level?.values?.[`${level?.key}_expiration_date`] &&
        new Date(level.values[`${level.key}_expiration_date`]).toLocaleDateString('en-US')}
    </p>
  ))}
</td>
            <td>{levelsData.map((level,index) => (
               <p> {getImageName(level?.values?.[`${level?.key}_cert_file`])}</p>
            ))}</td>
          </tr>
             </tbody>
             </table>

</div>

<div className="text-left  pt-3 pb-1">
           <Box className="text-left pt-1 pb-1">
					<h4 className='heading'>Documents</h4>
				</Box>

                <table className='theme-table' >
					<thead>
						<tr>
							<td>Document</td>
						    <td>Document Filename</td>
							<td>Expiration Date</td>
                            <td>Upload Date</td>
                            <td>Uploaded by</td>
                       </tr>
					</thead>
					<tbody>
                       <tr >
                                        
            <td>  {documentsData.map((document,index) => (
                <p>{document?.label}</p>
            ))}</td>
            <td>{documentsData.map((document,index) => (
               <p> {getImageName(document?.values?.[`${document?.key}_filename`])}</p>
            ))}</td>
            <td>
  {documentsData.map((document, index) => (
    <p key={index}>
      {document?.values?.[`${document?.key}_expiration_date`] &&
        new Date(document.values[`${document.key}_expiration_date`]).toLocaleDateString('en-US')}
    </p>
  ))}
</td>
<td>
  {documentsData.map((document, index) => (
    <p key={index}>
      {document?.values?.[`${document?.key}_upload_date`] &&
        new Date(document.values[`${document.key}_upload_date`]).toLocaleDateString('en-US')}
    </p>
  ))}
</td>
         <td>{documentsData.map((document,index) => (
            //    <p> {document?.values?.[`${document?.key}_uploaded_by`]}</p>
               <p> {token?.name}</p>
            ))}</td>
          </tr>
             </tbody>
             </table>

</div>


</div>
</>
)}
</div>
 </>
)
}

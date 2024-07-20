import React, { useEffect, useState } from 'react'
import SubHeadingOther from '../../components/header/SubHeadingOther'
import { Form } from "react-bootstrap";
import Select from 'react-select'
import { ProductsDropDown, ProfileDetails } from '../../helper/BasicFn';
import StatesModal from '../../components/modals/StatesModal'
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_API_NEW, CallGETAPI, CallGETAPINEW, CallPOSTAPI, CallPOSTAPINEW, CallPOSTAPINEWFileUpload } from '../../helper/API';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { FormatDate, prepareOptions } from '../../helper/Common';
import MessageHandler from '../../components/common/MessageHandler';
import { FormControlLabel, Icon, Switch } from "@mui/material";
import GeneralInforForm from '../../components/forms/intructorForms/GeneralInforForm';
import moment from 'moment';
import { toast } from 'react-toastify';
// import { DatePicker } from '@mui/x-date-pickers';
import { getImageName } from '../../helper/Common';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CommonDatePicker from '../../components/common/date-picker/CommonDatePicker';
import { formatDate } from 'devextreme/localization';


export default function EditInstructor({ setShowSidebar }) {
    const navigate = useNavigate();
    const [selectStatusData, setStatusData] = useState([]);
    const [ShowStatesModal, setShowStatesModal] = useState(false);
    const [StatesModalData, setStatesModalData] = useState({});
    const [SelectedStatesData, setSelectedStatedData] = useState();
    const [SelectedStatesName, setSelectedStatedName] = useState([]);
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        ACLS_cert_file: "",
        ACLS_cert_file_image_url: "",
        ACLS_e_card_code: "",
        ACLS_exs_date: "",
        AHA_id: "",
        BLS_cert_file: "",
        BLS_cert_file_image_url: "",
        BLS_e_card_code: "",
        BLS_exs_date: "",
        HSI_training_center_id: "",
        heart_saver_e_card_code: "",
        PALS_cert_file: "",
        PALS_cert_file_image_url: "",
        PALS_e_card_code: "",
        PALS_exs_date: "",
        color: "",
        comment: "",
        contractor_agreement_cert_file: "",
        contractor_agreement_filename_image_url: "",
        contractor_agreement_exe_date: "",
        head_shot_cert_file: "",
        head_shot_filename_image_url: "",
        vehicle_information_filename_image_url: "",
        head_shot_exe_date: "",

        heart_saver_e_card_code: "",
        heart_saver_cert_file: "",
        heart_saver_cert_file_image_url: "",
        heart_saver_exs_date: "",
        heart_saver_uploaded_by: "",

        level_1_cert_file: "",
        level_1_cert_file_image_url: "",
        level_1_exe_date: "",
        level_2_cert_file: "",
        level_2_cert_file_image_url: "",
        level_2_exe_date: "",
        level_3_cert_file: "",
        level_3_cert_file_image_url: "",
        level_3_exe_date: "",
        level_4_cert_file: "",
        level_4_cert_file_image_url: "",
        level_4_exe_date: "",
        model_brand: "",
        monitoring_form_cert_file: "",
        monitoring_form_filename_image_url: "",
        monitoring_form_exe_date: "",
        plate_number: "",
        profile_pic: "",
        profile_pic_image_url: "",
        rating: "",
        status: "",
        registry: "",
        resume_cert_file: "",
        resume_filename_image_url: "",
        resume_exe_date: "",
        resume_cert_file_name: "",
        resume_update_date: "",
        state: "",
        states: [],
        training_center_id: "",

        insurance_policy_cert_file: "",
        insurance_policy_filename_image_url: "",
        insurance_policy_exe_date: "",
        insurance_policy_uploaded_by: "",
        insurance_policy_cert_file_name: "",
        head_shot_update_date: "",
        insurance_policy_update_date: "",
        vehicle_information_exe_date: "",
        vehicle_information_update_date: "",
        vehicle_information_cert_file: "",
        vehicle_information_cert_file_image_url: "",
        vehicle_information_exe_date: "",
        contractor_agreement_update_date: "",
        vehicle_information_cert_file_name: "",
        vehicle_year: "",
        monitoring_form_update_date: "",
        vehicle_information_update_date: "",
        vehicle_information_uploaded_by: "",
        contractor_agreement_uploaded_by: "",
        heart_saver_upload_date: "",
        Heartsaver_upload_date: "",
        heart_saver_upload_date_image_url: "",
    });
    const [images, setImages] = useState([]);
    const [FormMsg, setFormMsg] = useState({ type: true, msg: "" });
    const [loading, setLoading] = useState(false);
    const Profile_ref = React.useRef();
    const uploadedByUser = 1;

    const [handleBtn, setHandleBtn] = useState(0);
    const [value, setValue] = React.useState(null);
    const [selectDataChange, setSelectDataChange] = React.useState({});
    const [formSteps, setFormSteps] = useState(0);
    const { contactId } = useParams();

    // useEffect(() => {
    //     // Update StatesModalData with the current values of SelectedStatesName
    //     setStatesModalData(SelectedStatesName?.toString());
    //   }, [SelectedStatesName]);

    // console.log(SelectedStatesData)

    const selectData = [
        {
            value: '1',
            label: 'Active',
        },
    ];
    const ratingData = [
        {
            value: 'A',
            label: 'A',
        }, {
            value: 'B',
            label: 'B',
        }, {
            value: 'C',
            label: 'C',
        }, {
            value: 'D',
            label: 'D',
        }, {
            value: 'E',
            label: 'E',
        }, {
            value: 'F',
            label: 'F',
        },
    ];
    const desciplineData = [
        { label: 'ACLS', key: 'ACLS' },
        { label: 'BLS', key: 'BLS' },
        { label: 'Heartsaver', key: 'heart_saver' },
        { label: 'PALS', key: 'PALS' },
    ];
    const levelsData = [
        { label: 'Level 1', key: 'level_1' },
        { label: 'Level 2', key: 'level_2' },
        { label: 'Level 3', key: 'level_3' },
        { label: 'Level 4', key: 'level_4' },
    ];
    const documentsData = [
        { label: 'Contractor Agreement', key: 'contractor_agreement' },
        { label: 'Resume', key: 'resume' },
        { label: 'Head Shot', key: 'head_shot' },
        { label: 'Insurance Policy', key: 'insurance_policy' },
        { label: 'Monitoring Form', key: 'monitoring_form' },
        { label: 'Vehicle Information', key: 'vehicle_information' },
    ];

    // calendar icon
    const calendarIcon = () => {
        return (
            <img src="/calendar.svg" alt="calendar" />
        )
    }

    const NextBtn = () => {
        return false;
        // return (
        //     <button className='btn btn-danger px-4 ' type="button" onClick={nextStep} >Next</button> 
        // )
    }

    const SaveBtn = () => {
        return (
            <button className='btn btn-success px-4 mx-4'  >Save</button>
        )
    }

    // handle calendar change
    const handleCalendarChange = (value, keyName, key) => {
        let date = value?.$D;
        date = date < 10 ? '0' + date : date;
        let month = value?.$M;
        month = parseInt(month + 1);
        month = month < 10 ? '0' + month : month;
        let year = value?.$y;

        let dateValue = year + '-' + month + '-' + date;

        setFormData((old) => ({ ...old, [key]: dateValue }));
    };

    // handle calendar change
    const handleInputChangeWithIndex = (e, keyName, key) => {
        setFormData((old) => ({ ...old, [keyName]: { ...formData[keyName], [key]: e.target.value } }));
    };

    // filter status
    const filterStatus = (arr, value) => {
        const status = arr.filter(
            (status) => status.value == value
        )

        return status;
    }

    console.log(SelectedStatesName)
    // on load fetch data
    const fetchOnload = async () => {
        const results = await CallGETAPI('account/get-state-by-country/231')
        if (results?.status) {
            setStatesModalData(results?.data?.state);
        }

        // const lt = SelectedStatesName.split(",");
        // console.log(lt)
        // const selArr = [];
        //             for (let index = 0; index < SelectedStatesName.length; index++) {
        //               const element = SelectedStatesName[index];
        //               console.log(element)
        //               if(lt.includes(element.toString())){
        //                 // .sites EditCourseId.sites
        //                 selArr.push(element);
        //               }

        //             }
        // console.log({selArr})
        // setSelectedStatedData(selArr);

        const fetchInstrutor = await CallGETAPINEW('account/fetch-instructor-by-id/' + contactId);
        const setfromArr = { ...formData };
        if (fetchInstrutor?.data?.data) {

            let AHAData = fetchInstrutor?.data?.data?.ahaDetails[0];
            let HSIData = fetchInstrutor?.data?.data?.hsiDetails[0];
            let levelData = HSIData != null ? JSON.parse(HSIData?.levels) : '';
            let InstructtorData = fetchInstrutor?.data?.data?.instructorDetails[0];
            let documentData = InstructtorData?.documents != null ? JSON.parse(InstructtorData?.documents) : '';
            let disiplinesData = AHAData ? JSON.parse(AHAData?.disiplines) : '';
            let StatesData = InstructtorData?.states;
            setInstructorID(InstructtorData?.id) // Please uncomment This

            const instructorStatus = await CallGETAPINEW('account/instructor-statuses');
            let statusData = instructorStatus?.data?.data;
            let allStatusData = prepareOptions(statusData, 'instuctor_status_id', 'instructor_status');
            setStatusData(allStatusData);
            const filteredStatusData = filterStatus(allStatusData, InstructtorData?.status);

            setSelectDataChange((old) => ({ ...old, ['status']: filteredStatusData[0] }));

            setfromArr.vehicle_year = InstructtorData?.vehicle_year;
            setfromArr.model_brand = InstructtorData?.model_brand;
            setfromArr.plate_number = InstructtorData?.plate_number;
            setfromArr.rating = InstructtorData?.rating;
            setfromArr.status = InstructtorData?.status;
            setfromArr.color = InstructtorData?.color;
            setfromArr.doc_db_id = InstructtorData?.id;
            setfromArr.state = InstructtorData?.state;
            setfromArr.states = InstructtorData?.states.split(',');
            setfromArr.is_user = InstructtorData?.is_user;
            setfromArr.comment = InstructtorData?.comment;
            setfromArr.profile_pic = InstructtorData?.profile_pic;
            setfromArr.profile_pic_image_url = InstructtorData?.profile_pic;

            setSelectedStatedName(setfromArr.states);
            //     const lt = setfromArr.states.split(",");
            // console.log(lt)
            // const selArr = [];
            //             for (let index = 0; index < SelectedStatesName.length; index++) {
            //               const element = SelectedStatesName[index];
            //               console.log(element)
            //               if(lt.includes(element.toString())){
            //                 // .sites EditCourseId.sites
            //                 selArr.push(element);
            //               }

            //             }
            // console.log({selArr})
            // setSelectedStatedData(selArr);
            // setSelectedStatedData(setfromArr.states);

            setfromArr.ACLS_cert_file = disiplinesData?.ACLS?.ACLS_cert_file;
            setfromArr.ACLS_cert_file_image_url = disiplinesData?.ACLS?.ACLS_cert_file;
            setfromArr.ACLS_e_card_code = disiplinesData?.ACLS?.ACLS_e_card_code;
            setfromArr.ACLS_exs_date = disiplinesData?.ACLS?.ACLS_expiration_date;
            setfromArr.ACLS_upload_date = disiplinesData?.ACLS?.ACLS_upload_date;
            setfromArr.ACLS_uploaded_by = disiplinesData?.ACLS?.ACLS_uploaded_by;

            setfromArr.BLS_e_card_code = disiplinesData?.BLS?.BLS_e_card_code;
            setfromArr.BLS_exs_date = disiplinesData?.BLS?.BLS_expiration_date;
            setfromArr.BLS_upload_date = disiplinesData?.BLS?.BLS_upload_date;
            setfromArr.BLS_uploaded_by = disiplinesData?.BLS?.BLS_uploaded_by;
            setfromArr.BLS_cert_file = disiplinesData?.BLS?.BLS_cert_file;

            setfromArr.PALS_e_card_code = disiplinesData?.PALS?.PALS_e_card_code;
            setfromArr.PALS_exs_date = disiplinesData?.PALS?.PALS_expiration_date;
            setfromArr.PALS_upload_date = disiplinesData?.PALS?.PALS_upload_date;
            setfromArr.PALS_uploaded_by = disiplinesData?.PALS?.PALS_uploaded_by;
            setfromArr.PALS_cert_file = disiplinesData?.PALS?.PALS_cert_file;
            setfromArr.PALS_cert_file_image_url = disiplinesData?.PALS?.PALS_cert_file;


            setfromArr.heart_saver_cert_file = disiplinesData?.heart_saver?.heart_saver_cert_file;
            setfromArr.heart_saver_cert_file_image_url = disiplinesData?.heart_saver?.heart_saver_cert_file;
            setfromArr.heart_saver_e_card_code = disiplinesData?.heart_saver?.heart_saver_e_card_code;
            setfromArr.heart_saver_exs_date = disiplinesData?.heart_saver?.heart_saver_expiration_date;
            setfromArr.heart_saver_upload_date = disiplinesData?.heart_saver?.heart_saver_upload_date;
            setfromArr.Heartsaver_upload_date = disiplinesData?.heart_saver?.heart_saver_upload_date;
            // Heartsaver_upload_date
            // heart_saver_upload_date_image_url
            setfromArr.heart_saver_uploaded_by = disiplinesData?.heart_saver?.heart_saver_uploaded_by;

            setfromArr.AHA_DB_id = AHAData?.id;
            setfromArr.AHA_id = AHAData?.AHA_id;
            setfromArr.instructor_id = AHAData?.instructor_id;
            setfromArr.training_center_id = AHAData?.training_center_id;
            setfromArr.created_by_id = AHAData?.created_by_id;
            setfromArr.created_date = AHAData?.created_date;
            setfromArr.modified_by_id = AHAData?.modified_by_id;
            setfromArr.modified_date = AHAData?.modified_date;

            setfromArr.registry = HSIData?.registry;
            setfromArr.HSI_training_center_id = HSIData?.training_center_id;
            setfromArr.created_date = HSIData?.created_date;
            setfromArr.created_by_id = HSIData?.created_by_id;
            setfromArr.hsi_db_id = HSIData?.id;
            // hsi_db_id

            // level_1_cert_file
            setfromArr.level_1_cert_file = levelData?.level_1?.level_1_cert_file;
            setfromArr.level_1_cert_file_image_url = levelData?.level_1?.level_1_cert_file;
            setfromArr.level_1_exe_date = levelData?.level_1?.level_1_expiration_date;
            setfromArr.level_1_upload_date = levelData?.level_1?.level_1_upload_date;
            setfromArr.level_1_uploaded_by = levelData?.level_1?.level_1_uploaded_by;

            setfromArr.level_2_cert_file = levelData?.level_2?.level_2_cert_file;
            setfromArr.level_2_cert_file_image_url = levelData?.level_2?.level_2_cert_file;
            setfromArr.level_2_exe_date = levelData?.level_2?.level_2_expiration_date;
            setfromArr.level_2_upload_date = levelData?.level_2?.level_2_upload_date;
            setfromArr.level_2_uploaded_by = levelData?.level_2?.level_2_uploaded_by;

            setfromArr.level_3_cert_file = levelData?.level_3?.level_3_cert_file;
            setfromArr.level_3_cert_file_image_url = levelData?.level_3?.level_3_cert_file;
            setfromArr.level_3_exe_date = levelData?.level_3?.level_3_expiration_date;
            setfromArr.level_3_upload_date = levelData?.level_3?.level_3_upload_date;
            setfromArr.level_3_uploaded_by = levelData?.level_3?.level_3_uploaded_by;

            setfromArr.level_4_cert_file = levelData?.level_4?.level_4_cert_file;
            setfromArr.level_4_cert_file_image_url = levelData?.level_4?.level_4_cert_file;
            setfromArr.level_4_exe_date = levelData?.level_4?.level_4_expiration_date;
            setfromArr.level_4_upload_date = levelData?.level_4?.level_4_upload_date;
            setfromArr.level_4_uploaded_by = levelData?.level_4?.level_4_uploaded_by;
            // contractor_agreement_cert_file_name

            setfromArr.resume_exe_date = documentData?.resume_expiration_date;
            setfromArr.resume_upload_date = documentData?.resume_upload_date;
            setfromArr.resume_uploaded_by = documentData?.resume_uploaded_by;
            setfromArr.resume_cert_file = documentData?.resume_filename;
            setfromArr.resume_filename_image_url = documentData?.resume_filename;
            setfromArr.resume_update_date = documentData?.resume_upload_date;

            setfromArr.contractor_agreement_exe_date = documentData?.contractor_agreement_expiration_date;
            setfromArr.contractor_agreement_update_date = documentData?.contractor_agreement_upload_date;
            setfromArr.contractor_agreement_uploaded_by = documentData?.contractor_agreement_uploaded_by;
            setfromArr.contractor_agreement_cert_file = documentData?.contractor_agreement_filename;
            setfromArr.contractor_agreement_filename_image_url = documentData?.contractor_agreement_filename;
            setfromArr.head_shot_exe_date = documentData?.head_shot_expiration_date;
            setfromArr.head_shot_update_date = documentData?.head_shot_upload_date;
            setfromArr.head_shot_uploaded_by = documentData?.head_shot_uploaded_by;
            setfromArr.head_shot_cert_file = documentData?.head_shot_filename;
            setfromArr.head_shot_filename_image_url = documentData?.head_shot_filename;

            setfromArr.insurance_policy_exe_date = documentData?.insurance_policy_expiration_date;
            setfromArr.insurance_policy_update_date = documentData?.insurance_policy_upload_date;
            setfromArr.insurance_policy_uploaded_by = documentData?.insurance_policy_uploaded_by;
            setfromArr.insurance_policy_cert_file = documentData?.insurance_policy_filename;
            setfromArr.insurance_policy_filename_image_url = documentData?.insurance_policy_filename;
            setfromArr.monitoring_form_exe_date = documentData?.monitoring_form_expiration_date;
            setfromArr.monitoring_form_update_date = documentData?.monitoring_form_upload_date;
            setfromArr.monitoring_form_uploaded_by = documentData?.monitoring_form_uploaded_by;
            setfromArr.monitoring_form_cert_file = documentData?.monitoring_form_filename;
            setfromArr.monitoring_form_filename_image_url = documentData?.monitoring_form_filename;

            setfromArr.vehicle_information_exe_date = documentData?.vehicle_information_expiration_date;
            setfromArr.vehicle_information_update_date = documentData?.vehicle_information_upload_date;
            setfromArr.vehicle_information_uploaded_by = documentData?.vehicle_information_uploaded_by;
            setfromArr.vehicle_information_cert_file = documentData?.vehicle_information_filename;
            setfromArr.vehicle_information_cert_file_image_url = documentData?.vehicle_information_filename;

            setFormData(setfromArr);

        }

    }

    // set selected states from modal
    const setSelectedStatesName = () => {
        let stateNames = [];
        let statesSeletedValues = (SelectedStatesData) ? SelectedStatesData.split(",") : [];
        for (let i = 0; i <= statesSeletedValues.length; i++) {
            const state = StatesModalData.find(
                (item) => item.state_id == statesSeletedValues[i]
            )
            if (state) {
                stateNames.push(state.state_name)
            }
        }

        setSelectedStatedName(stateNames)
    }

    const handleInputChange = (e) => {

        if (e.target.name == 'account_site_phone' || e.target.name == 'account_billing_info_billing_phone' || e.target.name == 'account_shipping_info_shipping_phone') {
            e.target.value = e.target.value.replace(/[^0-9 ]/g, "").trim();
            e.target.value = e.target.value.slice(0, 10)
        }

        if (e.target.type == 'checkbox') {
            setFormData((old) => ({ ...old, [e.target.name]: e.target.checked }));
        } else {
            setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
        }
    };

    // handle select change
    const handleSelectChange = (data, key) => {
        setFormData((old) => ({ ...old, [key]: data.value }));
        setSelectDataChange((old) => ({ ...old, [key]: data }));
    };

    // handle file change
    const [imgErr, setImgErr] = useState("");

    const handleFileChange = (e) => {
        let file = e.target.files[0]
        setImgErr('');
        const lastDotIndex = file.name.lastIndexOf('.');
        const afterLastDot = file.name.substring(lastDotIndex + 1);
        // console.log({afterLastDot,beforeLastDot})

        const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!validImageExtensions.includes(afterLastDot)) {
            // If the file extension is not in the valid list, show an error or return false
            // alert('');
            e.target.value = ''; // Clear the input field
            setImgErr('Invalid file format. Please select an image file.');
            return false;
        }
        file.field_name = e.target.name
        let url = URL.createObjectURL(file)
        setFormData((old) => ({
            ...old,
            [e.target.name + '_image_url']: url,
            [e.target.name]: file.name,
        }));

        setImages({ ...images, [e.target.name]: e.target.files });

        // setImages((old) => ({ 
        //     ...old, 
        //     [ e.target.name ]: file,
        // }));
    }

    function handleClick() {
        Profile_ref.current.value = "";
        setFormData((old) => ({
            ...old,
            [`profile_pic_image_url`]: '',
            [`profile_pic`]: '',
        }));
    }

    // check for states change from modals
    useEffect(() => {

        if (SelectedStatesData) {
            setSelectedStatesName();
        }
    }, [SelectedStatesData])

    const handleGeneralInfoForm = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        let statesValue = SelectedStatesData.split(",")

        // payload data to send with api
        let payloadData = {
            "modified_by_id": userData?.name,
            "contact_id": contactId,
            "aha_id": formData?.AHA_id,
            "account_main_contact_id": contactId,
            "rating": formData?.rating ? formData?.rating : ratingData[0]?.value,
            "status": formData?.status ? formData?.status : selectData[0]?.value,
            "vehicle_year": formData?.vehicle_year,
            "model_brand": formData?.model_brand,
            "color": formData?.color,
            "plate_number": formData?.plate_number,
            "is_user": formData?.is_user ? 1 : 0,
            "state": formData?.state,
            "comment": formData?.comment,
            "profile_pic": formData?.profile_pic,
            "documents": null,
            "states": []
        }

        let instructorData = new FormData();

        Object.keys(images).forEach((key) => {
            for (let i = 0; i < images[key].length; i++) {
                if (key === 'profile_pic') {
                    instructorData.append(key, images[key][i]);
                }
            }
        });

        instructorData.append('field_name', 'profile_pic');
        Object.keys(payloadData).forEach(function (key) {
            instructorData.append(key, payloadData[key]);
        });
        // 

        let result = await CallPOSTAPINEWFileUpload('account/update-instructor?instructor_id=' + formData?.instructor_id + `&aha_id=` + formData?.AHA_id, instructorData);

        if (result?.status && result?.data?.status) {
            toast.success("General Information is Saved");
            nextStep();
        } else {
            nextStep();
            toast.error(result?.data?.message);
        }

    }

    const handleCalendarChanges = (fieldName, date) => {

        // const formattedDate = date ? date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '';
        const formattedDate = date ? FormatDate(date) : '';
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: formattedDate,
        }));
    };

    const [instructorID, setInstructorID] = useState("");

    const GeneralInforForm = () => {
        return (
            <div className="form my-3 p-2" style={{ background: "#eee" }}>

                <h2 className="heading">General Information</h2>
                <Form className='' id="general-information-form"
                    encType="multipart/form-data"
                    onSubmit={handleGeneralInfoForm}
                >
                    <div className="row">
                        <div className="col-md-9">
                            <div className="row">
                                <div className="d-flex justify-content-between">
                                    <div className='col-md-6'>
                                        <div className='row' >
                                            <Form.Group className='col-md-6'  >
                                                <Form.Label>Instructor Rating</Form.Label>
                                                <Select
                                                    value={
                                                        ratingData.filter(option =>
                                                            option.label === formData?.rating)
                                                    }
                                                    // defaultValue="Select Rating"
                                                    defaultValue={formData?.rating}
                                                    options={ratingData}
                                                    onChange={(data) => handleSelectChange(data, 'rating')}
                                                />
                                            </Form.Group>

                                            {/* className={ "col-md-3" } className={ "col-md-3" } */}
                                            {/* <pre> */}
                                            {/* </pre> */}
                                            <Form.Group className='col-md-6' >
                                                <Form.Label>Status</Form.Label>
                                                <Select
                                                    value={selectDataChange?.status}
                                                    options={selectStatusData}
                                                    onChange={(data) => handleSelectChange(data, 'status')}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className='col-md-6 d-flex ml-4' style={{ alignItems: 'center', marginLeft: '3rem' }}>
                                        <Form.Group >
                                            <b className={""}>Make User</b>
                                            <br />
                                            <div className="">
                                                <FormControlLabel
                                                    className={""}
                                                    label=""
                                                    control={
                                                        <Switch
                                                            checked={formData?.is_user == 1 || formData?.is_user ? true : false}
                                                            color="primary"
                                                            size="medium"
                                                            value={1}
                                                            name="is_user"
                                                            onChange={handleInputChange}
                                                        />
                                                    }
                                                />
                                            </div>
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="row my-3">
                                    <Form.Group className={"col"}>
                                        <Form.Label>Vehicle Year</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="vehicle_year"
                                            value={formData?.vehicle_year}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className={"col-md-4"}>
                                        <Form.Label>Brand / Model</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="model_brand"
                                            value={formData?.model_brand}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className={"col"}>
                                        <Form.Label>Color</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="color"
                                            // required
                                            value={formData?.color}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className={"col"}>
                                        <Form.Label>Plate Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="plate_number"
                                            // required
                                            value={formData?.plate_number}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className={"col"}>
                                        <Form.Label>State</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="state"
                                            // required
                                            value={formData?.state}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>

                                <Form.Group className={"col-md-12"}>
                                    <Form.Label>Comments</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="comment"
                                        value={formData?.comment}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="text-center file-input-div img-section">
                                <Form.Control
                                    type="file"
                                    name="profile_pic"
                                    onChange={handleFileChange}
                                    className='hidden-file'
                                    ref={Profile_ref}
                                    accept="image/*"
                                />
                                {formData['profile_pic_image_url'] && <span className='img-remove' onClick={handleClick} >&times;</span>}

                                {/* <input type="file" name='profile_pic' className='hidden-file' onChange={ handleFileChange } /> */}
                                <img className='file-image' src={formData?.profile_pic_image_url ? formData?.profile_pic_image_url : "/photo-image.svg"} alt="photo" />
                                {imgErr && <div className='text-danger mt-2' >{imgErr}</div>}

                            </div>
                        </div>
                        <div className='col-md-12 text-right d-flex mt-4' style={{ justifyContent: 'right' }} >

                            {/* <button className='btn btn-danger ' disabled={!instructorID} type="button" onClick={nextStep} >Next </button> */}
                            {/* formSteps */}
                            {formSteps === 0 && SaveBtn()}
                        </div>
                    </div>
                </Form>
            </div>
        )
    }

    const SaveAHA = async (e) => {
        e.preventDefault();
        let sendObj = {
            "contact_id": contactId,
            "AHA_id": formData?.AHA_id,
            "training_center_id": formData?.training_center_id,
        }

        let BLSSJson = {
            "BLS_e_card_code": formData?.BLS_e_card_code,
            "BLS_expiration_date": formData?.BLS_exs_date,
            "BLS_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "BLS_uploaded_by": uploadedByUser,
            "BLS_cert_file_image_url": formData?.BLS_cert_file_image_url

        }
        if (formData?.BLS_e_card_code) {
            sendObj = { ...sendObj, ...BLSSJson }
        }

        let HeartJson = {
            "heart_saver_e_card_code": formData?.heart_saver_e_card_code,
            "heart_saver_expiration_date": formData?.heart_saver_exs_date,
            "heart_saver_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "heart_saver_uploaded_by": uploadedByUser,
            "heart_saver_cert_file_image_url": formData?.heart_saver_cert_file_image_url

        }
        // return "";
        if (formData?.heart_saver_e_card_code) {
            sendObj = { ...sendObj, ...HeartJson }
        }

        let PalsJson = {
            "PALS_e_card_code": formData?.PALS_e_card_code,
            "PALS_expiration_date": formData?.PALS_exs_date,
            "PALS_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "PALS_uploaded_by": uploadedByUser,
            "PALS_cert_file_image_url": formData?.PALS_cert_file_image_url,
        }
        if (formData?.PALS_e_card_code) {
            sendObj = { ...sendObj, ...PalsJson }
        }

        let ACLSJson = {
            "ACLS_e_card_code": formData?.ACLS_e_card_code,
            "ACLS_expiration_date": formData?.ACLS_exs_date,
            "ACLS_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "ACLS_uploaded_by": uploadedByUser,
            "ACLS_cert_file_image_url": formData?.ACLS_cert_file_image_url,
        }

        if (formData?.ACLS_e_card_code) {
            sendObj = { ...sendObj, ...ACLSJson }
        }

        let instructorData = new FormData();
        let flarr = ['ACLS_cert_file', 'BLS_cert_file', 'heart_saver_cert_file', 'PALS_cert_file'];

        Object.keys(images).forEach((key) => {
            for (let i = 0; i < images[key].length; i++) {
                if (flarr.includes(key)) {
                    instructorData.append(key, images[key][i]);
                }
            }
        });

        Object.keys(sendObj).forEach(function (key) {
            instructorData.append(key, sendObj[key]);
        });

        let result = await CallPOSTAPINEWFileUpload('account/update-instructor-aha?instructor_id=' + instructorID + '&aha_id=' + formData?.AHA_DB_id, instructorData);

        if (result?.data?.status) {
            // setInstructorID(result?.data?.data?.id)
            toast.success("AHA Form Saved Successfully");
            nextStep();
        } else {
            toast.error("Something went Wrong Please Try Again");
        }

    }

    const AHAForm = () => {
        return (
            <div className="form my-3 p-2" style={{ background: "#eee" }}>
                <h2 className="heading">American Heart Association (AHA) Information</h2>
                <Form className="" id="" onSubmit={SaveAHA} >
                    <div className="row">
                        <Form.Group className={"col-md-5"}>
                            <Form.Label>AHA ID</Form.Label>
                            <Form.Control
                                type="number"
                                name="AHA_id"
                                required
                                value={formData?.AHA_id}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className={"col-md-5"}>
                            <Form.Label>Training Center Id</Form.Label>
                            <Form.Control
                                type="text"
                                name="training_center_id"
                                required
                                value={formData?.training_center_id}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </div>
                    <h2 className="heading mt-4">Disiplines</h2>
                    <table width='100%'>
                        <thead>
                            <tr>
                                <th scope='col' width="10%" className='px-3'></th>
                                <th scope='col' width="15%" className='px-3'>eCard Code</th>
                                <th scope='col' width="20%" className='px-3'>Expiration Date</th>
                                <th scope='col' width="20%" className='px-3'>Cert File</th>
                                <th scope='col' width="20%" className='px-3'>Upload Date</th>
                                <th scope='col' width="15%" className='px-3'>Uploaded By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {desciplineData.map((discpline, index) => (
                                <tr key={index}>
                                    <td className="px-3 py-2" style={{ fontSize: '20px', fontWeight: 'bold' }}>{discpline.label}</td>
                                    <td className="px-3 py-2">
                                        <Form.Control
                                            type="text"
                                            name={`${discpline.key}_e_card_code`}
                                            // required
                                            value={formData[`${discpline.key}_e_card_code`]}
                                            onChange={handleInputChange}
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="d-flex align-items-center calendar-input-btn">
                                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <Stack spacing={3}>
                                                            <DatePicker
                                                                name={`${discpline.key}_exs_date`}
                                                                type="text"
                                                                inputFormat="MM/DD/YYYY"
                                                                placeholder="MM/DD/YYYY"
                                                                toolbarPlaceholder="DEMO"
                                                                value={formData[`${discpline.key}_exs_date`] || null }
                                                                components={{
                                                                    OpenPickerIcon: calendarIcon,
                                                                }}
                                                                minDate={new Date()}
                                                                onChange={ ( newValue) => handleCalendarChange(newValue, discpline.key, `${discpline.key}_exs_date`)}
                                                                renderInput={(params) => <TextField className='form-control' {...params}  placeholder={'MM/DD/YYYY'} />}
                                                            />
                                                        </Stack>
                                                    </LocalizationProvider> */}
                                            {/* <DatePicker
                                                name={`${discpline.key}_exs_date`}
                                                selected={formData[`${discpline.key}_exs_date`] ? new Date(formData[`${discpline.key}_exs_date`]) : null}
                                                onChange={(date) => handleCalendarChanges(date, discpline.key, `${discpline.key}_exs_date`)}
                                                dateFormat="MM/DD/YYYY"
                                                placeholderText="MM/DD/YYYY"
                                            /> */}
                                            <CommonDatePicker
                                                calName={`${discpline.key}_exs_date`}
                                                CalVal={formData[`${discpline.key}_exs_date`] ? FormatDate(formData[`${discpline.key}_exs_date`]) : null}
                                                HandleChange={(name, val) =>
                                                    handleCalendarChanges(name, val)
                                                }
                                                disabled={false}
                                            />

                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="d-flex align-items-center">
                                            <Form.Control
                                                type="text"
                                                name={`${discpline.key}_cert_file`}
                                                value={getImageName(formData[`${discpline.key}_cert_file`])}
                                            />
                                            <button className='btn ms-2 file-input-div' type='button'>
                                                <img src="/upload.svg" alt="upload" />
                                                <input type="file" name={discpline.key + '_cert_file'} className='hidden-file'
                                                    // onChange={ (e) => handleFileChangeWithIndex(e, discpline.key, 'cert_file') }
                                                    onChange={handleFileChange}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <span>
                                            {formData[`${discpline.label}_upload_date`] &&
                                                new Date(formData[`${discpline.label}_upload_date`]).toLocaleDateString('en-US')}
                                        </span>
                                    </td>

                                    <td className="px-3 py-2">
                                        <span>{formData[`${discpline.key}_uploaded_by`]}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* {formSteps === 2 &&  */}
                    <div className='col-md-12 text-right d-flex justify-content-end' >
                        {NextBtn()}
                        {SaveBtn()}
                    </div>

                </Form>
            </div>
        )
    }

    const SaveAshiForm = async (e) => {
        e.preventDefault();

        let sendObj = {
            "registry": formData?.registry,
            "training_center_id": formData?.HSI_training_center_id,
        }

        let level1 = {
            "level_1_expiration_date": formData?.level_1_exe_date,
            "level_1_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "level_1_uploaded_by": uploadedByUser,
            "level_1_cert_file_image_url": formData?.level_1_cert_file_image_url,
        }
        if (formData?.level_1_exe_date) {
            sendObj = { ...sendObj, ...level1 };
        }

        let level2 = {
            "level_2_expiration_date": formData?.level_2_exe_date,
            "level_2_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "level_2_uploaded_by": uploadedByUser,
            "level_2_cert_file_image_url": formData?.level_2_cert_file_image_url,
        }

        if (formData?.level_2_exe_date) {
            sendObj = { ...sendObj, ...level2 };
        }

        let level3 = {
            "level_3_expiration_date": formData?.level_3_exe_date,
            "level_3_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "level_3_uploaded_by": uploadedByUser,
            "level_3_cert_file_image_url": formData?.level_3_cert_file_image_url,
        }

        if (formData?.level_3_exe_date) {
            sendObj = { ...sendObj, ...level3 };
        }

        let level4 = {
            "level_4_expiration_date": formData?.level_4_exe_date,
            "level_4_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "level_4_uploaded_by": uploadedByUser,
            "level_4_cert_file_image_url": formData?.level_4_cert_file_image_url,
        }


        if (formData?.level_4_exe_date) {
            sendObj = { ...sendObj, ...level4 };
        }

        let instructorData = new FormData();
        let flarr = ["level_1_cert_file", "level_2_cert_file", "level_3_cert_file", "level_4_cert_file"];

        Object.keys(images).forEach((key) => {
            for (let i = 0; i < images[key].length; i++) {
                if (flarr.includes(key)) {
                    instructorData.append(key, images[key][i]);
                }
            }
        });

        Object.keys(sendObj).forEach(function (key) {
            instructorData.append(key, sendObj[key]);
        });

        instructorData.hsi_id = formData.hsi_id;

        let result = await CallPOSTAPINEWFileUpload('account/update-hsi-instructor?instructor_id=' + instructorID + '&hsi_id=' + formData?.hsi_db_id, instructorData);

        if (result?.data?.status) {
            toast.success("HSI Form Saved Successfully");
            nextStep();
        } else {
            toast.error("Something went Wrong Please Try Again");
        }


    }

    const ASHIForm = () => {
        return (
            <div className="form my-3 p-2" style={{ background: "#eee" }}>
                <h2 className="heading">Health Safety Institute (HSI) Information</h2>

                <Form className="" onSubmit={SaveAshiForm} >
                    <div className="row">
                        <Form.Group className={"col-md-5"}>
                            <Form.Label>Registry</Form.Label>
                            <Form.Control
                                type="text"
                                name="registry"
                                required
                                value={formData?.registry}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className={"col-md-5"}>
                            <Form.Label>Training Center Id</Form.Label>
                            <Form.Control
                                type="text"
                                name="HSI_training_center_id"
                                required
                                value={formData?.HSI_training_center_id}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </div>
                    <h2 className="heading mt-4">Levels</h2>
                    <table width='80%'>
                        <thead>
                            <tr>
                                <th scope='col' width="10%" className='px-3'></th>
                                <th scope='col' width="25%" className='px-3'>Expiration Date</th>
                                <th scope='col' width="25%" className='px-3'>Cert File</th>
                                <th scope='col' width="20%" className='px-3'>Upload Date</th>
                                <th scope='col' width="20%" className='px-3'>Uploaded By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {levelsData.map((level, index) => (
                                <tr key={index}>
                                    <td className="px-3 py-2" style={{ fontSize: '20px', fontWeight: 'bold' }}>{level.label}</td>
                                    <td className="px-3 py-2">
                                        <div className="d-flex align-items-center calendar-input-btn">
                                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Stack spacing={3}>
                                                <DesktopDatePicker
                                                    label=""
                                                    name={`${level.key}_exe_date`}
                                                    inputFormat="MM/DD/YYYY"
                                                    value={formData[`${level.key}_exe_date`] || null }
                                                    components={{
                                                        OpenPickerIcon: calendarIcon,
                                                    }}
                                                    minDate={new Date()}
                                                    onChange={(newValue)  => handleCalendarChange(newValue, level.key, `${level.key}_exe_date`)}
                                                    renderInput={(params) =>  <TextField 
                                                    className='form-control' {...params} />
                                                    }
                                                />
                                            </Stack>
                                        </LocalizationProvider> */}

                                            {/* <DatePicker
                                                name={`${level.key}_exe_date`}
                                                selected={formData[`${level.key}_exe_date`] ? new Date(formData[`${level.key}_exe_date`]) : null}
                                                onChange={(date) => handleCalendarChanges(date, level.key, `${level.key}_exe_date`)}
                                                dateFormat="MM/DD/YYYY"
                                                placeholderText="MM/DD/YYYY"
                                            /> */}

                                            <CommonDatePicker
                                                calName={`${level.key}_exe_date`}
                                                CalVal={formData[`${level.key}_exe_date`] ? FormatDate(formData[`${level.key}_exe_date`]) : null}
                                                HandleChange={(name, val) =>
                                                    handleCalendarChanges(name, val)
                                                }
                                                disabled={false}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="d-flex align-items-center">
                                            <Form.Control
                                                type="text"
                                                name={`${level.key}_cert_file`}
                                                // `${level}_exe_date`
                                                // required
                                                value={getImageName(formData[`${level.key}_cert_file`])}
                                            />
                                            <button className='btn ms-2 file-input-div' type='button'>
                                                <img src="/upload.svg" alt="upload" />
                                                <input type="file" name={level.key + '_cert_file'} className='hidden-file'
                                                    // onChange={ (e) => handleFileChangeWithIndex(e, level.key, 'cert_file') }  
                                                    onChange={handleFileChange}
                                                />
                                            </button>

                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <span>
                                            {formData[`${level.key}_upload_date`] &&
                                                new Date(formData[`${level.key}_upload_date`]).toLocaleDateString('en-US')}
                                        </span>
                                    </td>

                                    <td className="px-3 py-2">
                                        <span>{formData?.[`${level.key}_uploaded_by`]}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='col-md-12 text-right text-right d-flex justify-content-end' >
                        {NextBtn()}
                        {SaveBtn()}
                    </div>
                </Form>
            </div>
        )
    }

    const saveStateForm = async (e) => {
        e.preventDefault();

        let stateArr = SelectedStatesData;
        stateArr = stateArr.slice(0, -1);
        if (!stateArr) {
            toast.error("Please Select States");
            return;
        }

        stateArr = stateArr.split(',');



        let sendObj = {
            states: stateArr,
            account_main_contact_id: contactId,
            contact_id: contactId,
            documents: "null",
        }
        let result = await CallPOSTAPINEW('account/update-instructor-states?instructor_id=' + instructorID, sendObj);
        if (result?.data?.status) {
            toast.success("States Saved Successfully");
            nextStep()
        } else {
            toast.error("Something went Wrong Please Try Again");
        }
    }

    const SelectState = () => {

        console.log(SelectedStatesName)
        return (
            <div className="form my-3 p-2 pb-4" style={{ background: "#eee" }}>
                <h2 className="heading">States Selected</h2>
                <Form className="" id="save-states-form" onSubmit={saveStateForm} >
                    <div className="states mt-3 ps-4">
                        {SelectedStatesName?.length > 0 ? <>
                            {SelectedStatesName?.map((state, index) => (
                                <h5 key={index}>{state}</h5>
                            ))}
                        </> : <>
                            <h5>No states selected yet.</h5>
                        </>}
                    </div>
                    <div className='col-md-12 text-right d-flex justify-content-end' >
                        {NextBtn()}
                        {SaveBtn()}
                    </div>
                </Form>
            </div>
        )
    }

    const handleDocumentSave = async (e) => {
        e.preventDefault();
        let sendObj = {}

        let resumeJson = {
            "resume_expiration_date": formData?.resume_exe_date,
            "resume_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "resume_uploaded_by": uploadedByUser,
            "resume_filename_image_url": formData?.resume_filename_image_url,
        }

        if (formData?.resume_exe_date) {
            sendObj = { ...sendObj, ...resumeJson }
        }

        let ContractJson = {
            "contractor_agreement_expiration_date": formData?.contractor_agreement_exe_date,
            "contractor_agreement_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "contractor_agreement_uploaded_by": uploadedByUser,
            "contractor_agreement_filename_image_url": formData?.contractor_agreement_filename_image_url

        }


        if (formData?.contractor_agreement_exe_date) {
            sendObj = { ...sendObj, ...ContractJson }
        }
        let HeadShotJson = {
            "head_shot_expiration_date": formData?.head_shot_exe_date,
            "head_shot_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "head_shot_uploaded_by": uploadedByUser,
            "head_shot_filename_image_url": formData?.head_shot_filename_image_url,
        }
        if (formData?.head_shot_exe_date) {
            sendObj = { ...sendObj, ...HeadShotJson }
        }

        let InsurenceJson = {
            "insurance_policy_expiration_date": formData?.insurance_policy_exe_date,
            "insurance_policy_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "insurance_policy_uploaded_by": uploadedByUser,
            "insurance_policy_filename_image_url": formData?.insurance_policy_filename_image_url
        }
        if (formData?.insurance_policy_exe_date) {
            sendObj = { ...sendObj, ...InsurenceJson }
        }

        let MonitorJson = {
            "monitoring_form_expiration_date": formData?.monitoring_form_exe_date,
            "monitoring_form_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "monitoring_form_uploaded_by": uploadedByUser,
            "monitoring_form_filename_image_url": formData?.monitoring_form_filename_image_url
        }

        if (formData?.monitoring_form_exe_date) {
            sendObj = { ...sendObj, ...MonitorJson }
        }

        let VehicleJson = {
            "vehicle_information_expiration_date": formData?.vehicle_information_exe_date,
            "vehicle_information_upload_date": moment(new Date()).format("YYYY-MM-DD"),
            "vehicle_information_uploaded_by": uploadedByUser,
            "vehicle_information_filename_image_url": formData?.vehicle_information_cert_file_image_url
        }

        // if(formData?.vehicle_information_exe_date){
        //     sendObj = {...sendObj,...VehicleJson}
        // }
        sendObj = { ...sendObj, ...VehicleJson }



        let instructorData = new FormData();

        let flarr = ["contractor_agreement_cert_file",
            "resume_cert_file",
            "head_shot_cert_file",
            "insurance_policy_cert_file",
            "monitoring_form_cert_file",
            "vehicle_information_cert_file"];

        Object.keys(images).forEach((key) => {
            for (let i = 0; i < images[key].length; i++) {
                if (flarr.includes(key)) {
                    instructorData.append(key, images[key][i]);
                }
            }
        });


        Object.keys(sendObj).forEach(function (key) {
            instructorData.append(key, sendObj[key]);
        });


        let result = await CallPOSTAPINEWFileUpload('account/update-instructor-documents?instructor_id=' + instructorID, instructorData);

        if (result.status) {
            toast.success('Form Saved Successfully')
            // setTimeout(()=>{
            //     navigate(-1)
            // },3000)
        } else {
            toast.error("Something went Wrong Please Try Again");
        }

    }

    const DocumentsForm = () => {
        return (
            <>
                <div className="form my-3 p-2" style={{ background: "#eee" }}>
                    <Form className="" onSubmit={handleDocumentSave} >
                        <h2 className="heading">Documents</h2>
                        <table width='90%'>
                            <thead>
                                {/* 
                                    <td>
                                        {document.key+"_cert_file"}
                                        {document.key+"_exe_date"}
                                        {document.key+"_update_date"}
                                        {document.key+"_uploaded_by"}</td> */}
                                <tr>
                                    <th scope='col' width="17%" className='px-3'></th>
                                    <th scope='col' width="18%" className='px-3'>Document Filename</th>
                                    <th scope='col' width="25%" className='px-3'>Expiration Date</th>
                                    <th scope='col' width="25%" className='px-3'>Upload Date</th>
                                    <th scope='col' width="25%" className='px-3'>Uploaded By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documentsData.map((document, index) => (
                                    <tr key={index}>
                                        <td className="px-3 py-2" style={{ fontSize: '16px' }}>{document.label}</td>

                                        <td className="px-3 py-2">
                                            <div className="d-flex align-items-center">
                                                <Form.Control
                                                    type="text"
                                                    name={document.key + "_cert_file_name"}
                                                    // required
                                                    defaultValue={getImageName(formData[document.key + '_cert_file'])}
                                                />
                                                <button className='btn ms-2 file-input-div' type='button'>
                                                    <img src="/upload.svg" alt="upload" />
                                                    <input type="file" name={document.key + '_cert_file'} className='hidden-file'
                                                        // onChange={ (e) => handleFileChangeWithIndex(e, document.key, 'cert_file') }
                                                        onChange={handleFileChange}
                                                    />
                                                </button>

                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="d-flex align-items-center calendar-input-btn">
                                                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Stack spacing={3}>
                                                        <DesktopDatePicker
                                                            label=""
                                                            name={`${document.key}_exe_date`}
                                                            inputFormat="MM/DD/YYYY"
                                                            value={formData[`${document.key}_exe_date`] || null}
                                                            components={{
                                                                OpenPickerIcon: calendarIcon,
                                                            }}
                                                            minDate={new Date()}
                                                            onChange={ ( newValue) => handleCalendarChange(newValue, document.key, `${document.key}_exe_date`)}
                                                            renderInput={(params) => <TextField className='form-control' {...params} />}
                                                        />
                                                    </Stack>
                                                </LocalizationProvider> */}

                                                {/* <DatePicker
                                                    name={`${document.key}_exe_date`}
                                                    selected={formData[`${document.key}_exe_date`] ? new Date(formData[`${document.key}_exe_date`]) : null}
                                                    onChange={(date) => handleCalendarChanges(date, document.key, `${document.key}_exe_date`)}
                                                    dateFormat="MM/DD/YYYY"
                                                    placeholderText="MM/DD/YYYY"
                                                /> */}

                                                <CommonDatePicker
                                                    calName={`${document.key}_exe_date`}
                                                    CalVal={formData[`${document.key}_exe_date`] ? FormatDate(formData[`${document.key}_exe_date`]) : null}
                                                    HandleChange={(name, val) =>
                                                        handleCalendarChanges(name, val)
                                                    }
                                                    disabled={false}
                                                />

                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span>
                                                {formData[`${document.key}_update_date`] &&
                                                    new Date(formData[`${document.key}_update_date`]).toLocaleDateString('en-US')}
                                            </span>
                                        </td>


                                        <td className="px-3 py-2">
                                            <span>{formData[`${document.key}_uploaded_by`]}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* {formSteps === 4 && */}

                        <div className='col-md-12 text-right text-right d-flex justify-content-end' >
                            {NextBtn()}
                            {SaveBtn()}
                        </div>

                    </Form>
                </div>
            </>
        )
    }

    const nextStep = () => {
        let newStep = formSteps + 1;
        if (newStep <= 4) {
            setFormSteps(newStep)
        }
    }

    const prevStep = () => {
        let newStep = formSteps - 1;
        if (newStep >= 0) {
            setFormSteps(newStep)
        }
    }
    const [userData, setUserData] = useState({});
    const fetchProfile = async () => {
        let uData = await ProfileDetails();
        setUserData(uData)
    }
    useEffect(() => {
        fetchOnload();
        fetchProfile();
    }, [])

    return (

        <div>
            <div className="mt-4" style={{ width: "100%", paddingInline: "45px" }}>

                {/* top heading */}
                <SubHeadingOther title="Edit Instructor" hideNew={true} hideHierarchy={true} hideInstructor={true} subHeading={true} bottomLinks={false} />

                <button className="btn text-primary d-flex align-items-center" onClick={() => setShowStatesModal(true)}>
                    <img src="/states.svg" alt="states" />
                    <span className='ms-1'>State Selection</span>
                </button>

                <StatesModal
                    ShowStatesModal={ShowStatesModal}
                    setShowStatesModal={setShowStatesModal}
                    StatesModalData={StatesModalData}
                    SelectedStatesData={SelectedStatesData}
                    setSelectedStatedData={setSelectedStatedData}
                />

                {GeneralInforForm()}
                {SelectState()}
                {AHAForm()}
                {ASHIForm()}
                {DocumentsForm()}

            </div>
        </div>
    )
}

import React, { useEffect, useState } from "react";
import SubHeadingOther from "../../components/header/SubHeadingOther";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { ProductsDropDown, ProfileDetails } from "../../helper/BasicFn";
import StatesModal from "../../components/modals/StatesModal";
import { useNavigate, useParams } from "react-router-dom";
import {
  BASE_API_NEW,
  CallGETAPI,
  CallGETAPINEW,
  CallPOSTAPI,
  CallPOSTAPINEW,
  CallPOSTAPINEWFileUpload,
} from "../../helper/API";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { prepareOptions } from "../../helper/Common";
import MessageHandler from "../../components/common/MessageHandler";
import { FormControlLabel, Icon, Switch } from "@mui/material";
import GeneralInforForm from "../../components/forms/intructorForms/GeneralInforForm";
import moment from "moment";
import { toast } from "react-toastify";
// import { DatePicker } from '@mui/x-date-pickers';
import { FetchContactName } from "../../helper/InstructorHelper";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "../../helper/Common";

export default function CreateInstructor({ setShowSidebar }) {
  const navigate = useNavigate();
  const [selectStatusData, setStatusData] = useState([]);
  const [ShowStatesModal, setShowStatesModal] = useState(false);
  const [StatesModalData, setStatesModalData] = useState([]);
  const [SelectedStatesData, setSelectedStatedData] = useState("");
  const [SelectedStatesName, setSelectedStatedName] = useState([]);
  const [userData, setUserData] = useState({});
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({});
  const [images, setImages] = useState([]);
  const [FormMsg, setFormMsg] = useState({ type: true, msg: "" });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to track if date picker is open
  const Profile_ref = React.useRef();

  const [handleBtn, setHandleBtn] = useState(0);
  const [value, setValue] = React.useState(null);

  const [formSteps, setFormSteps] = useState(0);
  const { contactId } = useParams();

  const selectData = [
    {
      value: "1",
      label: "Active",
    },
  ];
  const ratingData = [
    {
      value: "A",
      label: "A",
    },
    {
      value: "B",
      label: "B",
    },
    {
      value: "C",
      label: "C",
    },
    {
      value: "D",
      label: "D",
    },
    {
      value: "E",
      label: "E",
    },
    {
      value: "F",
      label: "F",
    },
  ];
  const desciplineData = [
    { label: "ACLS", key: "ACLS" },
    { label: "BLS", key: "BLS" },
    { label: "Heartsaver", key: "heart_saver" },
    { label: "PALS", key: "PALS" },
  ];
  const levelsData = [
    { label: "Level 1", key: "level_1" },
    { label: "Level 2", key: "level_2" },
    { label: "Level 3", key: "level_3" },
    { label: "Level 4", key: "level_4" },
  ];
  const documentsData = [
    { label: "Contractor Agreement", key: "contractor_agreement" },
    { label: "Resume", key: "resume" },
    { label: "Head Shot", key: "head_shot" },
    { label: "Insurance Policy", key: "insurance_policy" },
    { label: "Monitoring Form", key: "monitoring_form" },
    { label: "Vehicle Information", key: "vehicle_information" },
  ];

  // calendar icon
  const calendarIcon = () => {
    return <img src="/calendar.svg" alt="calendar" />;
  };

  const NextBtn = () => {
    return (
      <button className="btn btn-danger px-4 " type="button" onClick={nextStep}>
        Next
      </button>
    );
  };

  const SaveBtn = () => {
    return <button className="btn btn-success px-4 mx-4">Save</button>;
  };

  const [openDatePickerKey, setOpenDatePickerKey] = useState(null);

  const toggleDatePicker = (key) => {
    setOpenDatePickerKey((prevKey) => (prevKey === key ? null : key));
  };

  // handle calendar change
  const handleCalendarChange = (value, keyName, key) => {
    let date = value?.$D;
    date = date < 10 ? "0" + date : date;
    let month = value?.$M;
    month = parseInt(month + 1);
    month = month < 10 ? "0" + month : month;
    let year = value?.$y;

    let dateValue = year + "-" + month + "-" + date;

    // setFormData((old) => ({ ...old, [ keyName ]: { ...formData[keyName], [key] : dateValue} }));

    setFormData((old) => ({ ...old, [key]: dateValue }));
  };

  // handle calendar change
  const handleInputChangeWithIndex = (e, keyName, key) => {
    setFormData((old) => ({
      ...old,
      [keyName]: { ...formData[keyName], [key]: e.target.value },
    }));
  };

  const [contactDetails, setContactDetails] = useState([]);

  // on load fetch data
  const fetchOnload = async () => {
    const results = await CallGETAPI("account/get-state-by-country/231");
    if (results?.status) {
      setStatesModalData(results?.data?.state);
    }

    const instructorStatus = await CallGETAPINEW("account/instructor-statuses");
    if (instructorStatus?.status) {
      let statusData = instructorStatus?.data?.data;
      let allStatusData = prepareOptions(
        statusData,
        "instuctor_status_id",
        "instructor_status"
      );
      setStatusData(allStatusData);
    }

    let contactDetailsFetch = await FetchContactName(contactId);
    if (contactDetailsFetch?.status) {
      setContactDetails(contactDetailsFetch?.getContactData);
    }

    let uData = await ProfileDetails();

    setUserData(uData);
  };

  // set selected states from modal
  const setSelectedStatesName = () => {
    let stateNames = [];
    let statesSeletedValues = SelectedStatesData
      ? SelectedStatesData.split(",")
      : [];
    for (let i = 0; i <= statesSeletedValues.length; i++) {
      const state = StatesModalData.find(
        (item) => item.state_id == statesSeletedValues[i]
      );
      if (state) {
        stateNames.push(state.state_name);
      }
    }

    setSelectedStatedName(stateNames);
  };

  const handleInputChange = (e) => {
    if (
      e.target.name == "account_site_phone" ||
      e.target.name == "account_billing_info_billing_phone" ||
      e.target.name == "account_shipping_info_shipping_phone"
    ) {
      e.target.value = e.target.value.replace(/[^0-9 ]/g, "").trim();
      e.target.value = e.target.value.slice(0, 10);
    }

    if (e.target.type == "checkbox") {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.checked }));
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
    }
  };

  // handle select change
  const handleSelectChange = (data, key) => {
    setFormData((old) => ({ ...old, [key]: data.value }));
  };

  // handle file change
  const [imgErr, setImgErr] = useState("");
  const handleFileChange = (e) => {
    let file = e.target.files[0];
    setImgErr("");
    console.log(file);
    const lastDotIndex = file.name.lastIndexOf(".");
    const afterLastDot = file.name.substring(lastDotIndex + 1);
    const validImageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    if (!validImageExtensions.includes(afterLastDot)) {
      // If the file extension is not in the valid list, show an error or return false
      // alert('');
      e.target.value = ""; // Clear the input field
      setImgErr("Invalid file format. Please select an image file.");
      return false;
    }
    file.field_name = e.target.name;
    let url = URL.createObjectURL(file);
    setFormData((old) => ({
      ...old,
      [e.target.name + "_image_url"]: url,
      [e.target.name]: file.name,
    }));

    setImages({ ...images, [e.target.name]: e.target.files });

    // setImages((old) => ({
    //     ...old,
    //     [ e.target.name ]: file,
    // }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // setValidated();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    let statesValue = SelectedStatesData.split(",");

    // payload data to send with api
    let payloadData = {
      id: Math.floor(Math.random() * 10),
      modified_by_id: "null",
      contact_id: contactId,
      account_main_contact_id: contactId,
      rating: formData?.rating ? formData?.rating : ratingData[0]?.value,
      status: formData?.status ? formData?.status : selectData[0]?.value,
      vehicle_year: formData?.vehicle_year,
      model_brand: formData?.model_brand,
      color: formData?.color,
      plate_number: formData?.plate_number,
      is_user: contactId,
      documents: {
        contractor_agreement: formData?.contractor_agreement,
        resume: formData?.resume,
        head_shot: formData?.head_shot,
        insurance_policy: formData?.insurance_policy,
        monitoring_form: formData?.monitoring_form,
        vehicle_information: formData?.vehicle_information,
      },
      state: formData?.state,
      states: statesValue,
      comment: formData?.comment,
      profile_pic: formData?.profile_pic || "",
      AHA: {
        AHA_id: formData?.AHA_id,
        training_center_id: formData?.training_center_id,
        disiplines: {
          ACLS: formData?.ACLS,
          BLS: formData?.BLS,
          heart_saver: formData?.heart_saver,
          PALS: formData?.PALS,
        },
      },
      HSI: {
        registry: formData?.registry,
        training_center_id: formData?.HSI_training_center_id,
        levels: {
          level_1: formData?.level_contactId,
          level_2: formData?.level_2,
          level_3: formData?.level_3,
          level_4: formData?.level_4,
        },
      },
    };

    let instructorData = new FormData();
    instructorData.append("images", images);
    instructorData.append("data", payloadData);

    let combinedData = {
      ...instructorData,
      payloadData,
    };

    const headers = { "content-type": "multipart/form-data" };

    let result = await CallPOSTAPINEW("account/add-instructor", payloadData);

    setFormMsg({ type: result?.data?.status, msg: result?.data?.message });
    if (result?.status) {
      navigate(-1);
    }
  };

  function handleClick() {
    Profile_ref.current.value = "";
    setFormData((old) => ({
      ...old,
      [`profile_pic_image_url`]: "",
      [`profile_pic`]: "",
    }));
  }

  // check for states change from modals
  useEffect(() => {
    fetchOnload();
    if (SelectedStatesData) {
      setSelectedStatesName();
    }
  }, [SelectedStatesData]);

  const handleGeneralInfoForm = async (e) => {
    e.preventDefault();

    // setValidated();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    let statesValue = SelectedStatesData.split(",");

    // payload data to send with api
    let payloadData = {
      modified_by_id: "null",
      contact_id: contactId,
      account_main_contact_id: contactId,
      rating: formData?.rating ? formData?.rating : ratingData[0]?.value,
      status: formData?.status ? formData?.status : selectData[0]?.value,
      vehicle_year: formData?.vehicle_year || "",
      model_brand: formData?.model_brand || "",
      color: formData?.color || "",
      plate_number: formData?.plate_number || "",
      is_user: formData?.is_user ? 1 : 0,
      state: formData?.state || "",
      comment: formData?.comment || "",
      profile_pic: formData?.profile_pic || "",
      documents: null,
      states: [],
    };

    let instructorData = new FormData();

    Object.keys(images).forEach((key) => {
      for (let i = 0; i < images[key].length; i++) {
        if (key === "profile_pic") {
          instructorData.append(key, images[key][i]);
        }
      }
    });

    instructorData.append("field_name", "profile_pic");
    Object.keys(payloadData).forEach(function (key) {
      instructorData.append(key, payloadData[key]);
    });
    //

    let result = await CallPOSTAPINEWFileUpload(
      "account/create-instructor?instructor_id=",
      instructorData
    );

    setInstructorID(111);
    nextStep();

    if (result?.status && result?.data?.status) {
      toast.success("General Information is Saved");
      setInstructorID(result?.data?.data?.id);
      nextStep();
    } else {
      toast.error(result?.data?.message);
    }
  };

  const [instructorID, setInstructorID] = useState("");

  const RedirectCheck = () => {
    navigate(-1);
  };

  const handleCalendarChanges = (date, key, fieldName) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";

    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: formattedDate,
    }));
  };

  const GeneralInforForm = () => {
    return (
      <div className="form my-3 p-2" style={{ background: "#eee" }}>
        <h2 className="heading">General Information</h2>
        <Form
          className=""
          id="general-information-form"
          encType="multipart/form-data"
          onSubmit={handleGeneralInfoForm}
        >
          <div className="row">
            <div className="col-md-9">
              <div className="row">
                <div className="d-flex justify-content-between">
                  <div className="col-md-6">
                    <div className="row">
                      {/* <button className='btn ' onClick={RedirectCheck} type="button" >Click Me</button> */}

                      <Form.Group className="col-md-6">
                        <Form.Label>Instructor Rating</Form.Label>
                        <Select
                          defaultValue="Select Rating"
                          options={ratingData}
                          onChange={(data) =>
                            handleSelectChange(data, "rating")
                          }
                        />
                      </Form.Group>

                      {/* className={ "col-md-3" } className={ "col-md-3" } */}

                      <Form.Group className="col-md-6">
                        <Form.Label>Status</Form.Label>
                        <Select
                          defaultValue={selectStatusData[0]}
                          options={selectStatusData}
                          onChange={(data) =>
                            handleSelectChange(data, "status")
                          }
                        />
                      </Form.Group>
                    </div>
                  </div>

                  <div
                    className="col-md-6 d-flex ml-4"
                    style={{ alignItems: "center", marginLeft: "3rem" }}
                  >
                    <Form.Group>
                      <b className={""}>Make User</b>
                      <br />
                      <div className="">
                        <FormControlLabel
                          className={""}
                          label=""
                          control={
                            <Switch
                              // checked ={ formData?.account_site_main_site === 1 ? true : false }
                              color="primary"
                              size="medium"
                              value={1}
                              // value={ true }
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
                      // required
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className={"col-md-4"}>
                    <Form.Label>Brand / Model</Form.Label>
                    <Form.Control
                      type="text"
                      name="model_brand"
                      // required
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className={"col"}>
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                      type="text"
                      name="color"
                      // required
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className={"col"}>
                    <Form.Label>Plate Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="plate_number"
                      // required
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className={"col"}>
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      // required
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
                  accept="image/*"
                  className="hidden-file"
                  ref={Profile_ref}
                />

                {formData["profile_pic_image_url"] && (
                  <span className="img-remove" onClick={handleClick}>
                    &times;
                  </span>
                )}

                {/* <input type="file" name='profile_pic' className='hidden-file' onChange={ handleFileChange } /> */}
                <img
                  className="file-image"
                  src={
                    formData["profile_pic_image_url"]
                      ? formData["profile_pic_image_url"]
                      : "/photo-image.svg"
                  }
                  alt="photo"
                />
                {imgErr && <div className="text-danger mt-2">{imgErr}</div>}
              </div>
            </div>
            <div
              className="col-md-12 text-right d-flex mt-4"
              style={{ justifyContent: "right" }}
            >
              {/* <button className='btn btn-danger ' disabled={!instructorID} type="button" onClick={nextStep} >Next </button> */}
              {/* formSteps */}
              {formSteps === 0 && SaveBtn()}
            </div>
          </div>
        </Form>
      </div>
    );
  };

  const SaveAHA = async (e) => {
    e.preventDefault();
    let sendObj = {
      contact_id: contactId,
      AHA_id: formData?.AHA_id,
      training_center_id: formData?.training_center_id,
    };

    let BLSSJson = {
      BLS_e_card_code: formData?.BLS_e_card_code,
      BLS_expiration_date: formData?.BLS_exs_date,
      BLS_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      BLS_uploaded_by: userData?.name,
    };
    if (formData?.BLS_e_card_code) {
      sendObj = { ...sendObj, ...BLSSJson };
    }

    let HeartJson = {
      heart_saver_e_card_code: formData?.Heartsaver_e_card_code,
      heart_saver_expiration_date: formData?.heart_saver_exs_date,
      heart_saver_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      heart_saver_uploaded_by: userData?.name,
    };
    if (formData?.Heartsaver_e_card_code) {
      sendObj = { ...sendObj, ...HeartJson };
    }

    let PalsJson = {
      PALS_e_card_code: formData?.PALS_e_card_code,
      PALS_expiration_date: formData?.PALS_exs_date,
      PALS_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      PALS_uploaded_by: userData?.name,
    };
    if (formData?.PALS_e_card_code) {
      sendObj = { ...sendObj, ...PalsJson };
    }

    let ACLSJson = {
      ACLS_e_card_code: formData?.ACLS_e_card_code,
      ACLS_expiration_date: formData?.ACLS_exs_date,
      ACLS_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      ACLS_uploaded_by: userData?.name,
    };

    if (formData?.ACLS_e_card_code) {
      sendObj = { ...sendObj, ...ACLSJson };
    }

    let instructorData = new FormData();
    let flarr = [
      "ACLS_cert_file",
      "BLS_cert_file",
      "heart_saver_cert_file",
      "PALS_cert_file",
    ];

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

    let result = await CallPOSTAPINEWFileUpload(
      "account/create-instructor-aha?instructor_id=" + instructorID,
      instructorData
    );

    if (result?.data?.status) {
      // setInstructorID(result?.data?.data?.id)
      toast.success("AHA Form Saved Successfully");
      nextStep();
    } else {
      toast.error("Something went Wrong Please Try Again");
    }
  };

  const AHAForm = () => {
    return (
      <div className="form my-3 p-2" style={{ background: "#eee" }}>
        <h2 className="heading">
          American Heart Association (AHA) Information
        </h2>
        <Form className="" id="" onSubmit={SaveAHA}>
          <div className="row">
            <Form.Group className={"col-md-5"}>
              <Form.Label>AHA ID</Form.Label>
              <Form.Control
                type="number"
                name="AHA_id"
                required
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className={"col-md-5"}>
              <Form.Label>Training Center Id</Form.Label>
              <Form.Control
                type="text"
                name="training_center_id"
                required
                onChange={handleInputChange}
              />
            </Form.Group>
          </div>
          <h2 className="heading mt-4">Disiplines</h2>
          <table width="100%">
            <thead>
              <tr>
                <th scope="col" width="10%" className="px-3"></th>
                <th scope="col" width="15%" className="px-3">
                  eCard Code
                </th>
                <th scope="col" width="20%" className="px-3">
                  Expiration Date
                </th>
                <th scope="col" width="20%" className="px-3">
                  Cert File
                </th>
                {/* <th scope='col' width="20%" className='px-3'>Upload Date</th> */}
                {/* <th scope='col' width="15%" className='px-3'>Uploaded By</th> */}
              </tr>
            </thead>
            <tbody>
              {desciplineData.map((discpline, index) => (
                <tr key={index}>
                  <td
                    className="px-3 py-2"
                    style={{ fontSize: "20px", fontWeight: "bold" }}
                  >
                    {discpline.label}
                  </td>
                  <td className="px-3 py-2">
                    <Form.Control
                      type="text"
                      name={`${discpline.label}_e_card_code`}
                      // required
                      value={formData[`${discpline.label}_e_card_code`]}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="d-flex align-items-center calendar-input-btn calendar-input-btn-1012">
                      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <Stack spacing={3}>
                                                            <DatePicker
                                                                name={`${discpline.key}_exs_date`}
                                                                type="hidden"
                                                                inputFormat="MM/DD/YYYY"
                                                                placeholder="MM/DD/YYYY"
                                                                toolbarPlaceholder="DEMO"
                                                                // value={formData[discpline.key]?.expiration_date}
                                                                value={formData[`${discpline.key}_exs_date`] || null }
                                                                components={{
                                                                    OpenPickerIcon: calendarIcon,
                                                                }}
                                                                minDate={new Date()}
                                                                onChange={ ( newValue) => handleCalendarChange(newValue, discpline.key, `${discpline.key}_exs_date`)}
                                                                renderInput={(params) => <TextField className='form-control' {...params} 
                                                                placeholder={'MM/DD/YYYY'}
                                                                defaultValue={'DEMO'}
                                                                />
                                                                }
                                                            />
                                                        </Stack>

                                                        
                                                    </LocalizationProvider> */}

                      <DatePicker
                        open={openDatePickerKey === discpline.key}
                        name={`${discpline.key}_exs_date`}
                        selected={
                          formData[`${discpline.key}_exs_date`]
                            ? new Date(formData[`${discpline.key}_exs_date`])
                            : null
                        }
                        onChange={(date) =>
                          handleCalendarChanges(
                            date,
                            discpline.key,
                            `${discpline.key}_exs_date`
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                      />

                      <span
                        className="cl-name-instructor"
                        onClick={() => toggleDatePicker(discpline.key)}
                      >
                        <CalendarIcon />
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="d-flex align-items-center">
                      {/* <Form.Control
                                                        type="text"
                                                        name={`${discpline.key}_cert_file`}
                                                        value={formData[`${discpline.key}_cert_file`]}
                                                    /> */}
                      <span>{formData[`${discpline.key}_cert_file`]}</span>
                      <button className="btn ms-2 file-input-div" type="button">
                        <img src="/upload.svg" alt="upload" />
                        <input
                          type="file"
                          name={discpline.key + "_cert_file"}
                          className="hidden-file"
                          // onChange={ (e) => handleFileChangeWithIndex(e, discpline.key, 'cert_file') }
                          onChange={handleFileChange}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2 hide">
                    <div className="d-flex align-items-center calendar-input-btn">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                          <DesktopDatePicker
                            label=""
                            inputFormat="MM/DD/YYYY"
                            name={`${discpline.label}_upload_date`}
                            value={formData[`${discpline.label}_upload_date`]}
                            components={{
                              OpenPickerIcon: calendarIcon,
                            }}
                            minDate={new Date()}
                            onChange={(newValue) =>
                              handleCalendarChange(
                                newValue,
                                discpline.key,
                                `${discpline.key}_upload_date`
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                type="hidden"
                                className="form-control"
                                {...params}
                              />
                            )}
                          />
                        </Stack>
                      </LocalizationProvider>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Form.Control
                      type="hidden"
                      // name="uploaded_by"
                      name={`${discpline.label}_uploaded_by`}
                      // required
                      value={userData?.name}
                      onChange={handleInputChange}
                      // onChange={ (e) =>  handleInputChangeWithIndex(e, discpline.key, 'uploaded_by') }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* {formSteps === 2 &&  */}
          <div className="col-md-12 text-right d-flex justify-content-end">
            {NextBtn()}
            {SaveBtn()}
          </div>
        </Form>
      </div>
    );
  };

  const SaveAshiForm = async (e) => {
    e.preventDefault();

    let sendObj = {
      registry: formData?.registry,
      training_center_id: formData?.HSI_training_center_id,
    };

    let level1 = {
      level_1_expiration_date: formData?.level_1_exe_date,
      level_1_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      level_1_uploaded_by: userData?.name,
    };
    if (formData?.level_1_exe_date) {
      sendObj = { ...sendObj, ...level1 };
    }

    let level2 = {
      level_2_expiration_date: formData?.level_2_exe_date,
      level_2_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      level_2_uploaded_by: userData?.name,
    };

    if (formData?.level_2_exe_date) {
      sendObj = { ...sendObj, ...level2 };
    }

    let level3 = {
      level_3_expiration_date: formData?.level_3_exe_date,
      level_3_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      level_3_uploaded_by: userData?.name,
    };

    if (formData?.level_3_exe_date) {
      sendObj = { ...sendObj, ...level3 };
    }

    let level4 = {
      level_4_expiration_date: formData?.level_4_exe_date,
      level_4_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      level_4_uploaded_by: userData?.name,
    };

    if (formData?.level_4_exe_date) {
      sendObj = { ...sendObj, ...level4 };
    }

    let instructorData = new FormData();
    let flarr = [
      "level_1_cert_file",
      "level_2_cert_file",
      "level_3_cert_file",
      "level_4_cert_file",
    ];

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

    let result = await CallPOSTAPINEWFileUpload(
      "account/create-hsi-instructor?instructor_id=" + instructorID,
      instructorData
    );

    if (result?.data?.status) {
      toast.success("HSI Form Saved Successfully");
      nextStep();
    } else {
      toast.error("Something went Wrong Please Try Again");
    }
  };

  const ASHIForm = () => {
    return (
      <div className="form my-3 p-2" style={{ background: "#eee" }}>
        <h2 className="heading">Health Safety Institute (HSI) Information</h2>

        <Form className="" onSubmit={SaveAshiForm}>
          <div className="row">
            <Form.Group className={"col-md-5"}>
              <Form.Label>Registry</Form.Label>
              <Form.Control
                type="text"
                name="registry"
                required
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className={"col-md-5"}>
              <Form.Label>Training Center Id</Form.Label>
              <Form.Control
                type="text"
                name="HSI_training_center_id"
                required
                onChange={handleInputChange}
              />
            </Form.Group>
          </div>
          <h2 className="heading mt-4">Levels</h2>
          <table width="80%">
            <thead>
              <tr>
                <th scope="col" width="10%" className="px-3"></th>
                <th scope="col" width="25%" className="px-3">
                  Expiration Date
                </th>
                <th scope="col" width="25%" className="px-3">
                  Cert File
                </th>
                {/* <th scope='col' width="20%" className='px-3'>Upload Date</th> */}
                {/* <th scope='col' width="20%" className='px-3'>Uploaded By</th> */}
              </tr>
            </thead>
            <tbody>
              {levelsData.map((level, index) => (
                <tr key={index}>
                  <td
                    className="px-3 py-2"
                    style={{ fontSize: "20px", fontWeight: "bold" }}
                  >
                    {level.label}
                  </td>
                  <td className="px-3 py-2">
                    <div className="d-flex align-items-center calendar-input-btn calendar-input-btn-1012">
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
                                                    onChange={ ( newValue) => handleCalendarChange(newValue, level.key, `${level.key}_exe_date`)}
                                                    renderInput={(params) => <TextField className='form-control' {...params} />}
                                                />
                                            </Stack>
                                        </LocalizationProvider> */}

                      <DatePicker
                        open={openDatePickerKey === level.key}
                        name={`${level.key}_exe_date`}
                        selected={
                          formData[`${level.key}_exe_date`]
                            ? new Date(formData[`${level.key}_exe_date`])
                            : null
                        }
                        onChange={(date) =>
                          handleCalendarChanges(
                            date,
                            level.key,
                            `${level.key}_exe_date`
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        // Add any additional props or styling as needed
                      />
                      <span
                        className="cl-name-instructor"
                        onClick={() => toggleDatePicker(level.key)}
                      >
                        <CalendarIcon />
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="d-flex align-items-center">
                      <span>{formData[`${level.key}_cert_file`]}</span>
                      <button className="btn ms-2 file-input-div" type="button">
                        <img src="/upload.svg" alt="upload" />
                        <input
                          type="file"
                          name={level.key + "_cert_file"}
                          className="hidden-file"
                          // onChange={ (e) => handleFileChangeWithIndex(e, level.key, 'cert_file') }
                          onChange={handleFileChange}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2 hide">
                    <div className="d-flex align-items-center calendar-input-btn">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                          <DesktopDatePicker
                            label=""
                            type="hidden"
                            inputFormat="YYYY-MM-DD"
                            name={`${level.key}_upload_date`}
                            value={formData[`${level.key}_upload_date`]}
                            components={{
                              OpenPickerIcon: calendarIcon,
                            }}
                            minDate={new Date()}
                            onChange={(newValue) =>
                              handleCalendarChange(
                                newValue,
                                level.key,
                                `${level.key}_upload_date`
                              )
                            }
                            renderInput={(params) => (
                              <TextField className="form-control" {...params} />
                            )}
                          />
                        </Stack>
                      </LocalizationProvider>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Form.Control
                      type="hidden"
                      name="uploaded_by"
                      value={userData?.name}
                      onChange={(e) =>
                        handleInputChangeWithIndex(e, level.key, "uploaded_by")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* {formSteps ===3 &&  */}
          <div className="col-md-12 text-right text-right d-flex justify-content-end">
            {NextBtn()}
            {SaveBtn()}
          </div>
        </Form>
      </div>
    );
  };

  const saveStateForm = async (e) => {
    e.preventDefault();

    let stateArr = SelectedStatesData;
    stateArr = stateArr.slice(0, -1);
    if (!stateArr) {
      toast.error("Please Select States");
      return;
    }

    stateArr = stateArr.split(",");

    let sendObj = {
      states: stateArr,
      account_main_contact_id: contactId,
      contact_id: contactId,
      documents: "null",
    };
    let result = await CallPOSTAPINEW(
      "account/update-instructor-states?instructor_id=" + instructorID,
      sendObj
    );
    if (result?.data?.status) {
      toast.success("States Saved Successfully");
      nextStep();
    } else {
      toast.error("Something went Wrong Please Try Again");
    }
  };

  const SelectState = () => {
    return (
      <div className="form my-3 p-2 pb-4" style={{ background: "#eee" }}>
        <h2 className="heading">States Selected</h2>
        <Form className="" id="save-states-form" onSubmit={saveStateForm}>
          <div className="states mt-3 ps-4">
            {SelectedStatesName?.length > 0 ? (
              <>
                {SelectedStatesName?.map((state, index) => (
                  <h5 key={index}>{state}</h5>
                ))}
              </>
            ) : (
              <>
                <h5>No states selected yet.</h5>
              </>
            )}
          </div>
          {/* onClick={nextStep} */}
          {/* {formSteps===1 &&  */}
          <div className="col-md-12 text-right d-flex justify-content-end">
            {/* <button className='btn btn-link' type="button"  >Cancle </button>
                    <button className='btn btn-success px-4'    disabled={loading} >{loading? 'Loading...': 'Save'}</button> */}
            {NextBtn()}
            {SaveBtn()}
          </div>
        </Form>
      </div>
    );
  };

  const handleDocumentSave = async (e) => {
    e.preventDefault();

    let sendObj = {};
    let resumeJson = {
      resume_expiration_date: formData?.resume_exe_date,
      resume_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      resume_uploaded_by: userData?.name,
    };

    if (formData?.resume_exe_date) {
      sendObj = { ...sendObj, ...resumeJson };
    }

    let ContractJson = {
      contractor_agreement_expiration_date:
        formData?.contractor_agreement_exe_date,
      contractor_agreement_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      contractor_agreement_uploaded_by: userData?.name,
    };

    if (formData?.contractor_agreement_exe_date) {
      sendObj = { ...sendObj, ...ContractJson };
    }
    let HeadShotJson = {
      head_shot_expiration_date: formData?.head_shot_exe_date,
      head_shot_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      head_shot_uploaded_by: userData?.name,
    };
    if (formData?.head_shot_exe_date) {
      sendObj = { ...sendObj, ...HeadShotJson };
    }

    let InsurenceJson = {
      insurance_policy_expiration_date: formData?.insurance_policy_exe_date,
      insurance_policy_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      insurance_policy_uploaded_by: userData?.name,
    };
    if (formData?.insurance_policy_exe_date) {
      sendObj = { ...sendObj, ...InsurenceJson };
    }

    let MonitorJson = {
      // insurance_policy_exe_date
      monitoring_form_expiration_date: formData?.monitoring_form_exe_date,
      monitoring_form_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      monitoring_form_uploaded_by: userData?.name,
    };

    if (formData?.monitoring_form_exe_date) {
      sendObj = { ...sendObj, ...MonitorJson };
    }

    let VehicleJson = {
      vehicle_information_expiration_date:
        formData?.vehicle_information_exe_date,
      vehicle_information_upload_date: moment(new Date()).format("YYYY-MM-DD"),
      vehicle_information_uploaded_by: userData?.name,
    };

    if (formData?.vehicle_information_exe_date) {
      sendObj = { ...sendObj, ...VehicleJson };
    }

    let instructorData = new FormData();

    let flarr = [
      "contractor_agreement_cert_file",
      "resume_cert_file",
      "head_shot_cert_file",
      "insurance_policy_cert_file",
      "monitoring_form_cert_file",
      "vehicle_information_cert_file",
    ];

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

    // return  '';

    let result = await CallPOSTAPINEWFileUpload(
      "account/update-instructor-documents?instructor_id=" + instructorID,
      instructorData
    );

    if (result.status) {
      toast.success("Form Saved Successfully");
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } else {
      toast.error("Something went Wrong Please Try Again");
    }
  };

  const DocumentsForm = () => {
    return (
      <>
        <div className="form my-3 p-2" style={{ background: "#eee" }}>
          <Form className="" onSubmit={handleDocumentSave}>
            <h2 className="heading">Documents</h2>
            <table width="90%">
              <thead>
                <tr>
                  <th scope="col" width="17%" className="px-3"></th>
                  <th scope="col" width="18%" className="px-3">
                    Document Filename
                  </th>
                  <th scope="col" width="25%" className="px-3">
                    Expiration Date
                  </th>
                  {/* <th scope='col' width="25%" className='px-3'>Upload Date</th> */}
                  {/* <th scope='col' width="15%" className='px-3'>Uploaded By</th> */}
                </tr>
              </thead>
              <tbody>
                {documentsData.map((document, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2" style={{ fontSize: "16px" }}>
                      {document.label}
                    </td>

                    <td className="px-3 py-2">
                      <div className="d-flex align-items-center">
                        <span>{formData[document.key + "_cert_file"]}</span>
                        <button
                          className="btn ms-2 file-input-div"
                          type="button"
                        >
                          <img src="/upload.svg" alt="upload" />
                          <input
                            type="file"
                            name={document.key + "_cert_file"}
                            className="hidden-file"
                            // onChange={ (e) => handleFileChangeWithIndex(e, document.key, 'cert_file') }
                            onChange={handleFileChange}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="d-flex align-items-center calendar-input-btn calendar-input-btn-1012">
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
                        <DatePicker
                          open={openDatePickerKey === document.key}
                          name={`${document.key}_exe_date`}
                          selected={
                            formData[`${document.key}_exe_date`]
                              ? new Date(formData[`${document.key}_exe_date`])
                              : null
                          }
                          onChange={(date) =>
                            handleCalendarChanges(
                              date,
                              document.key,
                              `${document.key}_exe_date`
                            )
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          // Add any additional props or styling as needed
                        />
                        <span
                            className="cl-name-instructor"
                            onClick={() => toggleDatePicker(document.key)}
                        >
                        <CalendarIcon />
                      </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 hide">
                      <div className="d-flex align-items-center calendar-input-btn">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Stack spacing={3}>
                            <DesktopDatePicker
                              className="date-picker"
                              label=""
                              type="hidden"
                              name={`${document.key}_update_date`}
                              inputFormat="YYYY-MM-DD"
                              value={formData[`${document.key}_update_date`]}
                              minDate={new Date()}
                              components={{ OpenPickerIcon: calendarIcon }}
                              onChange={(newValue) =>
                                handleCalendarChange(
                                  newValue,
                                  document.key,
                                  `${document.key}_update_date`
                                )
                              }
                              renderInput={(params) => (
                                <TextField
                                  className="form-control"
                                  {...params}
                                />
                              )}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <Form.Control
                        type="hidden"
                        name="uploaded_by"
                        // required
                        value={userData?.name}
                        onChange={(e) =>
                          handleInputChangeWithIndex(
                            e,
                            document.key,
                            "uploaded_by"
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* {formSteps === 4 && */}
            <div className="col-md-12 text-right text-right d-flex justify-content-end">
              {NextBtn()}
              {SaveBtn()}
            </div>
          </Form>
        </div>
      </>
    );
  };

  const nextStep = () => {
    let newStep = formSteps + 1;
    if (newStep <= 4) {
      setFormSteps(newStep);
    }
  };

  const prevStep = () => {
    let newStep = formSteps - 1;
    if (newStep >= 0) {
      setFormSteps(newStep);
    }
  };

  return (
    <div>
      <div className="mt-4" style={{ width: "100%", paddingInline: "45px" }}>
        {/* top heading */}
        <SubHeadingOther
          title="Create Instructor"
          hideNew={true}
          hideHierarchy={true}
          hideInstructor={true}
          subHeading={true}
          bottomLinks={false}
        />

        <button
          className="btn text-primary d-flex align-items-center"
          onClick={() => setShowStatesModal(true)}
        >
          <img src="/states.svg" alt="states" />
          <span className="ms-1">State Selection</span>
        </button>

        <StatesModal
          ShowStatesModal={ShowStatesModal}
          setShowStatesModal={setShowStatesModal}
          StatesModalData={StatesModalData}
          SelectedStatesData={SelectedStatesData}
          setSelectedStatedData={setSelectedStatedData}
        />

        {GeneralInforForm()}

        {formSteps > 0 && SelectState()}
        {formSteps > 1 && AHAForm()}
        {formSteps > 2 && ASHIForm()}
        {formSteps > 3 && DocumentsForm()}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";

import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";

import Button from "@mui/material/Button";
import SubForm from "../SubForm";

import { FetchDropDowns, GetCountries } from "../../helper/BasicFn";
import MultiEmailForm from "../../components/forms/MultiEmailForm";
import { CallPOSTAPI } from "../../helper/API";
import MessageHandler from "../../components/common/MessageHandler";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SubHeading from "../../components/header/SubHeading";
import SubHeadingOther from "../../components/header/SubHeadingOther";
import MainContactModalPhone from "../../components/modals/MainContactModal/MainContactModalPhone";
import MainContactModalEmail from "../../components/modals/MainContactModal/MainContactModalEmail";
import ContactModalEmail from "../../components/modals/MainContactModal/ContactModalEmail";
import ContactModalPhone from "../../components/modals/MainContactModal/ContactModalPhone";
import AddContactPhoneFrom from "../../components/forms/AddContactPhoneFrom";
import AddContactMultiEmailForm from "../../components/forms/AddContactMultiEmailForm";
import StateField from "../../components/common/states/StatesField";
import { prepareOptions } from "../../helper/Common";
import Select from "react-select";
import ToogleSwitch from "../../components/common/toggleSwitch/ToogleSwitch";

const UserSelfReg = ({ setShowSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mainError, setMainError] = useState(false);
  const [validated, setValidated] = useState(false);
  const { accountId } = useParams();
  const [phoneValidation, setPhoneValidation] = useState({});
  const [countryList, setCountryList] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState({});
  const [switchValue, setSwitchValue] = useState({});
  const [formData, setFormData] = useState({
    salutation: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    primary_email: "",
    password: "",
    phone: [],
    email: [],
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: 231,
    zipcode: "",
  });
  const queryParameters = new URLSearchParams(window.location.search);

  const [multiEmailFormCount, setMultiEmailFormCount] = useState([
    {
      account_main_contact_email: "",
      email_type_id: "",
      account_main_contact_email_main: "",
    },
  ]);

  const [formErrors, setFormErrors] = useState({
    password: false,
    middle_name: false,
    first_name: false,
    last_name: false,
  });

  const MultiEmailFormIncrease = () => {
    let arr = [...multiEmailFormCount];
    let obj = {
      account_main_contact_email: "",
      email_type_id: "",
      account_main_contact_email_main: "",
    };
    arr.push(obj);
    setMultiEmailFormCount(arr);
  };

  const MultiEmailFormDecrease = () => {
    let arr = [...multiEmailFormCount];
    if (multiEmailFormCount.length > 1) {
      arr.pop();
    }

    setMultiEmailFormCount(arr);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
      validateFormFields(name, value);
    } else if (
      name === "middle_name" ||
      name === "first_name" ||
      name === "last_name"
    ) {
      setFormData((old) => ({
        ...old,
        [e.target.name]: e.target.value.replace(/[^a-z]/gi, ""),
      }));
      validateFormFields(name, value);
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
    }
  };

  const validateFormFields = (fieldName, value) => {
    if (
      fieldName === "middle_name" ||
      fieldName === "first_name" ||
      fieldName === "last_name"
    ) {
      /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|/="'-\d]/.test(value)
        ? setFormErrors((old) => ({ ...old, [fieldName]: true }))
        : setFormErrors((old) => ({ ...old, [fieldName]: false }));
    }
    if (fieldName === "password") {
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-!@#$%^&*()_+|[\]{};:/<>?,.`~\\]).{8,}$/.test(
        value
      )
        ? setFormErrors((old) => ({ ...old, [fieldName]: false }))
        : setFormErrors((old) => ({ ...old, [fieldName]: true }));
    }
  };

  const [altTrainerForm1, setAltTrainerForm1] = useState([
    {
      account_main_contact_phone_id: "",
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: "",
      account_main_contact_phone_main: 0,
    },
  ]);

  const increaseAlternative1 = () => {
    let arr = [...altTrainerForm1];
    let obj = {
      account_main_contact_phone_id: "",
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: "",
      account_main_contact_phone_main: 0,
    };
    arr.push(obj);
    setAltTrainerForm1(arr);
  };

  const decreaseAlternative1 = () => {
    let arr = [...altTrainerForm1];
    if (altTrainerForm1.length > 1) {
      arr.pop();
      setAltTrainerForm1(arr);
    }
  };

  const [allDropDowns, setAllDropDowns] = React.useState([]);

  const fetchOnload = async () => {
    let AllDResult = await FetchDropDowns();
    if (AllDResult) {
      setAllDropDowns(AllDResult);
    }

    // get country
    const countries = await GetCountries();
    if (countries?.status) {
      let countriesData = prepareOptions(
        countries?.country,
        "id",
        "country_name"
      );
      setCountryList(countriesData);
      setSelectedCountry((old) => ({
        ...old,
        country: {
          label: countriesData[230].label,
          value: countriesData[230].value,
        },
      }));
    }
  };

  const [FormMsg, setFormMsg] = React.useState({ type: true, msg: "" });
  const [loading, setLoading] = React.useState(false);
  const [openContactModal, setContactModal] = React.useState(false);
  const [listType, setListType] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // check validation for confirm password and password
    if (formData?.password != formData?.confirm_password) {
      setLoading(false);
      setValidated(true);
      setFormMsg({ type: false, msg: "Password not matched" });
      return;
    }
    // check for phone validations
    for (const [key, value] of Object.entries(phoneValidation)) {
      if (value) {
        setLoading(false);
        setValidated(true);
        return;
      }
    }

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      setLoading(false);
      setValidated(true);
      return;
    }

    SaveForm();
  };

  const checkisMainContact = (arr, key) => {
    let newarr = arr.find((a) => (a[key] ? true : false));
    return newarr ? true : false;
  };

  const SaveForm = async () => {
    let payloadData = {
      salutation: formData?.salutation,
      first_name: formData?.first_name,
      middle_name: formData?.middle_name,
      last_name: formData?.last_name,
      suffix: formData?.suffix,
      primary_email: multiEmailFormCount[0]?.account_main_contact_email,
      password: formData?.password,
      phone: [
        {
          account_main_contact_phone:
            altTrainerForm1[0]?.account_main_contact_phone,
          account_main_contact_phone_ext:
            altTrainerForm1[0]?.account_main_contact_phone_ext,
          phone_type_id: altTrainerForm1[0]?.phone_type_id ?? 1,
          account_main_contact_phone_main: 1,
        },
      ],
      email: [
        {
          account_main_contact_email:
            multiEmailFormCount[0]?.account_main_contact_email,
          email_type_id: multiEmailFormCount[0]?.email_type_id,
          account_main_contact_email_main: 1,
        },
      ],
      address1: formData?.address1,
      address2: formData?.address2,
      city: formData?.city,
      state: formData?.state,
      country: formData?.country,
      zipcode: formData?.zipcode,
    };

    let inpersonClassId = 0;
    inpersonClassId = queryParameters.get("class_id");

    if (!inpersonClassId) {
      inpersonClassId = location?.state?.classId ?? 0;
    }
    let result = await CallPOSTAPI(
      "auth/studentSignup?class_id=" + inpersonClassId,
      payloadData
    );
    setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
    setLoading(false);
    navigate("/verify-otp/", {
      state: {
        type: "studentSignup",
        isAssign: result?.data?.isAssign,
        classId: inpersonClassId,
      },
    });
  };

  // handle select change
  const handleSelectChange = (data, key) => {
    setSelectedCountry((old) => ({
      ...old,
      [key]: {
        label: data.label,
        value: data.value,
      },
    }));

    setFormData((old) => ({ ...old, [key]: data.value }));
  };

  useEffect(() => {
    fetchOnload();
  }, []);

  // switchChangeHandle
  const switchChangeHandle = (switchValue, e) => {
    setFormData((old) => ({ ...old, [switchValue?.key]: switchValue?.value }));
  };

  // check for switch value and update values
  useEffect(() => {
    switchChangeHandle(switchValue);
  }, [switchValue]);

  return (
    <>
      <div
        className="mt-4"
        style={{ paddingInline: "45px", paddingTop: "45px" }}
      >
        <SubHeadingOther
          title="New Contact"
          hideNew="tab"
          subHeading={true}
          hideHierarchy={true}
          bottomLinks={false}
        />
      </div>

      <Form
        className=""
        onSubmit={handleSubmit}
        noValidate
        validated={validated}
        id="create-new-contact-form"
      >
        <div className="contailer-fluid px-4 mx-4 mt-2">
          {/* first row */}
          <div
            className="container-fluid bottom-border-blue pb-4 pt-2"
            style={{
              background: "#eee",
              borderBottom: "4px solid rgb(13, 110, 253)",
            }}
          >
            <h2 className="text-left heading">General Information</h2>
            <div className="row mb-4 mt-3">
              <Form.Group className={"col-2"}>
                <Form.Label>Salutation</Form.Label>
                <Form.Control
                  type="text"
                  name="salutation"
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className={"col-2"}>
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.first_name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter First Name and do not use any special or numeric
                  character.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={"col-2"}>
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.middle_name}
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter Middle Name and do not use any special or numeric
                  character.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={"col-2"}>
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.last_name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter Last Name and do not use any special or numeric
                  character.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={"col-2"}>
                <Form.Label>Suffix</Form.Label>
                <Form.Control
                  type="text"
                  name="suffix"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </div>

            {/* password row */}
            <div className="row mb-4 mt-3">
              <Form.Group className={"col-2"}>
                <Form.Label>Password*</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  maxLength={50}
                  isInvalid={!!formErrors.password}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Pasword should contain at least one special,numeric,
                  lowercase, uppercase character and length must be greater than
                  8 charcters and less than 50 characters.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className={"col-2"}>
                <Form.Label>Confirm Password*</Form.Label>
                <Form.Control
                  type="password"
                  name="confirm_password"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </div>

            <AddContactPhoneFrom
              altTrainerForm={altTrainerForm1}
              setSubFormData={setAltTrainerForm1}
              increaseAlternative={increaseAlternative1}
              decreaseAlternative={decreaseAlternative1}
              handleInputChange={handleInputChange}
              allDropDowns={allDropDowns}
              formData={formData.main_contact_phone}
              formName={"main_contact_phone"}
              setFormData={setFormData}
              noBtns={false}
              setPhoneValidation={setPhoneValidation}
              phoneValidation={phoneValidation}
            />

            <AddContactMultiEmailForm
              altTrainerForm={multiEmailFormCount}
              setSubFormData={setMultiEmailFormCount}
              increaseAlternative={MultiEmailFormIncrease}
              decreaseAlternative={MultiEmailFormDecrease}
              handleInputChange={handleInputChange}
              allDropDowns={allDropDowns}
              noBtns={false}
              formData={formData.main_contact_email}
              formName={"main_contact_email"}
              setFormData={setFormData}
            />
          </div>

          {/* address */}
          <div
            className="container-fluid bottom-border-blue pb-4 pt-2 mt-4"
            style={{
              background: "#eee",
              borderBottom: "4px solid rgb(13, 110, 253)",
            }}
          >
            <h2 className="text-left heading">Personal Address</h2>

            <div className="row my-4">
              <Form.Group className={"col"}>
                <Form.Label>Country</Form.Label>
                <Select
                  value={selectedCountry?.country}
                  options={countryList}
                  onChange={(data) => {
                    handleSelectChange(data, "country");
                  }}
                />
              </Form.Group>
              <Form.Group className={"col"}>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address1"
                  onChange={handleInputChange}
                  // required
                  value={formData.address1}
                />

                <Form.Control.Feedback type="invalid">
                  Please Enter Address.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={"col"}>
                <Form.Label>Address 2</Form.Label>
                <Form.Control
                  type="text"
                  name="address2"
                  onChange={handleInputChange}
                  value={formData.address2}
                />
              </Form.Group>

              <Form.Group className={"col"}>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  onChange={handleInputChange}
                  value={formData.city}
                  // required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter City.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={"col"}>
                <Form.Label>State</Form.Label>
                <StateField
                  setFormData={setFormData}
                  valueKey="state"
                  selectedCountry={selectedCountry?.country?.value}
                  validated={false}
                  required={true}
                  stateSelectedValue={formData?.state}
                />
              </Form.Group>

              <Form.Group className={"col"}>
                <Form.Label>Zip code</Form.Label>
                <Form.Control
                  type="number"
                  name="zipcode"
                  onChange={handleInputChange}
                  value={formData.zipcode}
                  // required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter Zip Code.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <div className="my-4">
            <MessageHandler
              status={FormMsg.type}
              msg={FormMsg.msg}
              HandleMessage={setFormMsg}
            />
          </div>

          <div
            className="container-fluid bottom-border-blue"
            style={{ marginBottom: "50px" }}
          >
            <div
              className="col-md-12 d-flex"
              style={{ marginTop: "25px", justifyContent: "right" }}
            >
              <Button
                className={"btn btn-danger mx-4"}
                variant="danger"
                style={{ fontSize: "16px" }}
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </Button>

              <Button
                className={"btn btn-success"}
                variant="success"
                style={{ marginRight: "5px", fontSize: "16px" }}
                type="submit"
                // disabled={ loading }
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Form>

      {/* phone modal */}
      <ContactModalPhone
        open={listType === "phone" ? true : false}
        hanldeModal={setContactModal}
        emailDataList={altTrainerForm1}
        phoneDataList={altTrainerForm1}
        dataType={listType}
        setSubFormData={setAltTrainerForm1}
        SaveForm={SaveForm}
        setDataType={setListType}
      />

      {/* email modal */}
      <ContactModalEmail
        open={listType === "email" ? true : false}
        hanldeModal={setContactModal}
        emailDataList={multiEmailFormCount}
        phoneDataList={multiEmailFormCount}
        dataType={listType}
        setSubFormData={setMultiEmailFormCount}
        SaveForm={SaveForm}
        setDataType={setListType}
      />
    </>
  );
};

export default UserSelfReg;

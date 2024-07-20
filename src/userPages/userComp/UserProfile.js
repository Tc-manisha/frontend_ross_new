import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { FormControlLabel, Icon, Switch } from "@mui/material";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";

// import styles from '../../NewAccount.module.css';
import Container from "react-bootstrap/Container";

import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
// import SubForm from "../../SubForm";
import SubForm from "../../pages/SubForm";

import {
  FetchDropDowns,
  ProductsDropDown,
  GetAccountEditContactList,
  GetCountries,
  DecryptToken,
} from "../../helper/BasicFn";
import MultiEmailForm from "../../components/forms/MultiEmailForm";
import { CallGETAPI, CallPOSTAPI } from "../../helper/API";
import MessageHandler from "../../components/common/MessageHandler";
import ProductModal from "../../components/modals/ProductModal";
import AccountReps from "../../components/modals/accountReps";
import SectionHeading from "../../components/common/SectionHeading";
import SubHeading from "../../components/header/SubHeading";
import { useNavigate, useParams } from "react-router-dom";
import ContactModalPhone from "../../components/modals/MainContactModal/ContactModalPhone";
import ContactModalEmail from "../../components/modals/MainContactModal/ContactModalEmail";
import AddContactPhoneFrom from "../../components/forms/AddContactPhoneFrom";
import AddContactMultiEmailForm from "../../components/forms/AddContactMultiEmailForm";
import { GetProfile, prepareOptions, sortData } from "../../helper/Common";
import Select from "react-select";
import StateField from "../../components/common/states/StatesField";
import ToogleSwitch from "../../components/common/toggleSwitch/ToogleSwitch";
import { useLocation } from "react-router-dom";
import CircularLoadingComp from "./CircularLoadingComp";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { handleAccount } from "../../helper/permission";

const UserProfile = ({ setShowSidebar, isUser }) => {
  const location = useLocation();
  const [mainError, setMainError] = useState(false);
  const [ProductModalData, setProductModalData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState([]);
  const navigate = useNavigate();
  const [listType, setListType] = React.useState("");
  const [openContactModal, setContactModal] = React.useState(false);
  const [phoneValidation, setPhoneValidation] = useState({});
  const [loading2, setLoading2] = useState(true);

  const [countryList, setCountryList] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState({});
  const [showPassword, setShowPassword] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: '',
});

const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
        ...prevState,
        [field]: !prevState[field],
    }));
};
  const [invalidPassword, setInvalidPassword] = useState({
    current_password: false,
    new_password: false,
    confirm_new_password: false,
  });
  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fetchLoad = async () => {
    const res = await CallGETAPI("account/profile-visit");
    console.log(res);
  };

  useEffect(() => {
    fetchLoad();
  }, []);

  const handlePasswordUpdate = async () => {
    let errors = {};

    // if (password.current_password === '') {
    //     errors.current_password = true
    // }
    // if (password.new_password === '') {
    //     errors.new_password = true
    // }
    // if (password.confirm_new_password === '') {
    //     errors.confirm_new_password = true
    // }

    if (Object.keys(errors).length > 0) {
      setInvalidPassword({ ...invalidPassword, ...errors });
      return;
    }

    if (password.new_password !== password.confirm_new_password) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordLoading(true);
    if (password.current_password != "" || password.new_password != "") {
      let body = {
        current_password: password.current_password,
        new_password: password.new_password,
      };
      const response = await CallPOSTAPI("auth/changepassword", body);
      if (response?.data?.status) {
        setPasswordLoading(false);
        setPassword({
          ...password,
          current_password: "",
          new_password: "",
          confirm_new_password: "",
        });
        // toast.success(response?.msg)
      } else {
        setPasswordLoading(false);
        toast.error(response?.msg);
      }
    } else {
      setPasswordLoading(false);
      toast.success("Profile updated successfully.");
    }
  };

  const resetForm = () => {
    document.getElementById("create-new-account-form").reset();
  };

  const [multiEmailFormCount, setMultiEmailFormCount] = useState([
    {
      account_main_contact_email_id: "",
      account_main_contact_email: "",
      email_type_id: "",
      account_main_contact_email_main: 0,
    },
  ]);

  const MultiEmailFormIncrease = () => {
    let arr = [...multiEmailFormCount];
    let obj = {
      account_main_contact_email: "",
      email_type_id: "",
      account_main_contact_email_main: 0,
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
    if (e.target.type === "checkbox") {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.checked }));
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
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
  const updatedPhone = (data) => {
    setAltTrainerForm1(data);
  };
  const [allDropDowns, setAllDropDowns] = React.useState([]);
  const [switchValue, setSwitchValue] = useState({});
  const { contactId } = useParams();

  const fetchOnload = async () => {
    let ProductResult = await ProductsDropDown();
    if (ProductResult) {
      // setProductDropDown(ProductResult)
      setProductModalData(ProductResult?.products);
    }

    let AllDResult = await FetchDropDowns();
    if (AllDResult) {
      AllDResult.phoneType = sortData(
        AllDResult?.phoneType,
        "dropdown_phone_type_name"
      );
      setAllDropDowns(AllDResult);
    }
    var data = await GetAccountEditContactList(contactId);
    // console.log({data});
    if (data?.data?.status) {
      setFormData(data?.data?.data?.contactDetails);
      setMultiEmailFormCount(
        data?.data?.data?.email?.length > 0
          ? data?.data?.data?.email
          : [...multiEmailFormCount, ...data?.data?.data?.email]
      );
      setAltTrainerForm1(
        data?.data?.data?.phone?.length > 0
          ? data?.data?.data?.phone
          : [...altTrainerForm1, ...data?.data?.data?.phone]
      );
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

      if (data?.data?.data?.contactDetails?.contact_country) {
        const country = countriesData.find(
          (country) =>
            country.value ==
            parseInt(data?.data?.data?.contactDetails?.contact_country)
        );
        setSelectedCountry((old) => ({
          ...old,
          contact_country: {
            label: country?.label,
            value: country?.value,
          },
        }));
        setFormData((old) => ({ ...old, contact_country: country.value }));
      } else {
        setFormData((old) => ({
          ...old,
          contact_country: countriesData[230].value,
        }));
        setSelectedCountry((old) => ({
          ...old,
          contact_country: {
            label: countriesData[230].label,
            value: countriesData[230].value,
          },
        }));
      }
    }
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

  const [FormMsg, setFormMsg] = React.useState({ type: true, msg: "" });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // check for phone validations
    for (const [key, value] of Object.entries(phoneValidation)) {
      if (value) {
        setLoading(false);
        setValidated(true);
        return;
      }
    }

    // setValidated();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      setLoading(false);
      setValidated(true);
      return;
    }

    SaveForm();
    handlePasswordUpdate();
    const link = await handleAccount();
    navigate(link);
  };

  const SaveForm = async () => {
    formData.contact_id = contactId;
    let arr = formData;
    arr.training_optout = formData.training_optout ? 1 : 0;

    multiEmailFormCount.map((email, index) => {
      if (
        email.account_main_contact_email_id == "" ||
        email.account_main_contact_email_id == null ||
        email.account_main_contact_email_id == undefined
      ) {
        email.account_main_contact_email_id = "";
      }
      email.account_main_contact_id = contactId;
    });

    altTrainerForm1.map((phone, index) => {
      if (
        phone.account_main_contact_phone_id == "" ||
        phone.account_main_contact_phone_id == null ||
        phone.account_main_contact_phone_id == undefined
      ) {
        phone.account_main_contact_phone_id = "";
      }
      phone.account_main_contact_id = contactId;
    });

    arr.email = multiEmailFormCount;
    arr.phone = altTrainerForm1;

    if (arr.phone.length > 1) {
      let mainPhone = arr.phone.find((data) => {
        return data.account_main_contact_phone_main == 1;
      });
    }

    if (arr.email.length > 1) {
      let mainEmail = arr.email.find((data) => {
        return data.account_main_contact_email_main == 1;
      });
    }

    let result = CallPOSTAPI("account/update-contact-details", arr);
    setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
    setLoading(false);
    // toast.success('Profile updated successfully.')
    // navigate('/account-details/' + formData?.account_id, {
    //     state: {
    //         tab: 'Contacts',
    //         type: result?.data?.status,
    //         msg: result?.data?.msg
    //     }
    // })
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
  // const profile = GetProfile();
  const profile = DecryptToken();
  const localStorageContactId = profile?.contact_id;

  useEffect(() => {
    setTimeout(() => {
      setLoading2(false);
    }, 3000);
  }, []);

  return (
    <>
      {loading2 ? (
        <>
          <CircularLoadingComp />
        </>
      ) : (
        <>
          {parseInt(contactId) === parseInt(localStorageContactId) ? (
            <>
              <div className="mt-4" style={{ paddingInline: "45px" }}>
                <Box>
                  <h4
                    className="heading mt-3"
                    style={{ color: "black", important: true }}
                  >
                    Edit Profile
                  </h4>
                </Box>
              </div>

              <Form
                className=""
                onSubmit={handleSubmit}
                noValidate
                validated={validated}
                id="create-new-account-form"
              >
                <div className="contailer-fluid px-4 mx-4">
                  <div
                    className="container-fluid bottom-border-blue pb-4 pt-2"
                    style={{ background: "#eee" }}
                  >
                    <h2 className="text-left heading">Account Main Contact</h2>
                    <div className="row mb-4 mt-3">
                      <Form.Group className={"col"}>
                        <Form.Label>Salutation</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_salutation"
                          onChange={handleInputChange}
                          defaultValue={
                            formData?.account_main_contact_salutation
                          }
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>First Name </Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_firstname"
                          onChange={handleInputChange}
                          defaultValue={
                            formData?.account_main_contact_firstname
                          }
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please Enter First Name.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Middle Name </Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_middlename"
                          onChange={handleInputChange}
                          defaultValue={
                            formData?.account_main_contact_middlename
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Please Enter Middle Name.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_lastname"
                          onChange={handleInputChange}
                          defaultValue={formData?.account_main_contact_lastname}
                          required
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Suffix</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_suffix"
                          onChange={handleInputChange}
                          defaultValue={formData?.account_main_contact_suffix}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_title"
                          onChange={handleInputChange}
                          defaultValue={formData?.account_main_contact_title}
                        />
                      </Form.Group>
                      <Form.Group className={"col"}>
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_department"
                          onChange={handleInputChange}
                          defaultValue={
                            formData?.account_main_contact_department
                          }
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Contact Status</Form.Label>

                        <Form.Select
                          className={""}
                          name="contact_status_id"
                          onChange={handleInputChange}
                          value={formData?.contact_status_id}
                        >
                          <option value="0" selected>
                            --Select One--
                          </option>
                          {allDropDowns?.contactStatus &&
                            allDropDowns?.contactStatus.map((CS, index) => (
                              <option
                                key={index}
                                value={CS.dropdown_contact_status_id}
                              >
                                {CS.contact_status_type}
                              </option>
                            ))}
                        </Form.Select>
                      </Form.Group>
                    </div>

                    <AddContactPhoneFrom
                      altTrainerForm={altTrainerForm1}
                      setSubFormData={setAltTrainerForm1}
                      increaseAlternative={increaseAlternative1}
                      decreaseAlternative={decreaseAlternative1}
                      handleInputChange={handleInputChange}
                      allDropDowns={allDropDowns}
                      formData={formData?.main_contact_phone}
                      formName={"main_contact_phone"}
                      setFormData={setFormData}
                      noBtns={true}
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
                      formData={formData?.main_contact_email}
                      formName={"main_contact_email"}
                      setFormData={setFormData}
                    />

                    <div className="row my-4">
                      <Form.Group className={"col"}>
                        <Form.Label>Country</Form.Label>
                        <Select
                          value={selectedCountry?.contact_country}
                          options={countryList}
                          onChange={(data) => {
                            handleSelectChange(data, "contact_country");
                          }}
                        />
                      </Form.Group>
                      <Form.Group className={"col"}>
                        <Form.Label>Address </Form.Label>
                        <Form.Control
                          type="text"
                          name="contact_address1"
                          onChange={handleInputChange}
                          // required
                          value={formData?.contact_address1}
                        />

                        <Form.Control.Feedback type="invalid">
                          Please Enter Address.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Address 2</Form.Label>
                        <Form.Control
                          type="text"
                          name="contact_address2"
                          onChange={handleInputChange}
                          value={formData?.contact_address2}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>City </Form.Label>
                        <Form.Control
                          type="text"
                          name="contact_city"
                          onChange={handleInputChange}
                          value={formData?.contact_city}
                          // required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please Enter City.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>State </Form.Label>
                        <StateField
                          setFormData={setFormData}
                          valueKey="contact_state"
                          selectedCountry={
                            selectedCountry?.contact_country?.value
                          }
                          validated={false}
                          required={true}
                          stateSelectedValue={formData?.contact_state}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Zip code </Form.Label>
                        <Form.Control
                          type="text"
                          name="contact_zipcode"
                          onChange={handleInputChange}
                          value={formData?.contact_zipcode}
                          // required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please Enter Zip Code.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>

                    <Form.Group className={"col"}>
                      <b className={"d-block"}>Training OptOut</b>
                      <span className="d-inline-block mt-10-px">
                        <ToogleSwitch
                          switchKeyValue={formData?.training_optout}
                          setSwitchValue={setSwitchValue}
                          switchValue={switchValue}
                          switchKey={"training_optout"}
                        />
                      </span>
                      {/* <div className="" >
                            <FormControlLabel
                                className={ '' }
                                label=""
                                control={
                                <Switch
                                    color="primary"
                                    size="medium"
                                    value={true}
                                    name="training_optout"
                                    onChange={ handleInputChange }
                                    checked={ formData.training_optout == 1 || formData.training_optout ? true : false }
                                /> }
                            />
                            </div> */}
                    </Form.Group>

                    <div
                      style={{
                        display: "flex",
                        gap: "2%",
                        marginBottom: "1%",
                        background: "#EEEEEE",
                        padding: "3% 1%",
                      }}
                    >
                      <Form.Group className={"col"}>
                        <Form.Label>Current Password</Form.Label>
                        <div
                          style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Form.Control
                            style={{
                              borderColor: invalidPassword.current_password
                                ? "#DC3545"
                                : "",
                            }}
                            type={showPassword.current_password ? "text" : "password"}
                            name="current_password"
                            onChange={(e) => {
                              setPassword({
                                ...password,
                                current_password: e.target.value,
                              });
                              setInvalidPassword({
                                ...invalidPassword,
                                current_password: false,
                              });
                            }}
                            value={password?.current_password}
                          />
                          <span
                            onClick={() =>togglePasswordVisibility("current_password")}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {showPassword.current_password ?  <FaEye /> : <FaEyeSlash />}
                          </span>
                        </div>
                        {invalidPassword.current_password && (
                          <p style={{ color: "#DC3545" }}>
                            Please Enter Current Password.
                          </p>
                        )}
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>New Password</Form.Label>
                        <div
                          style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Form.Control
                            style={{
                              borderColor: invalidPassword.new_password
                                ? "#DC3545"
                                : "",
                            }}
                            type={showPassword.new_password ? "text" : "password"}
                            name="new_password"
                            onChange={(e) => {
                              setPassword({
                                ...password,
                                new_password: e.target.value,
                              });
                              setInvalidPassword({
                                ...invalidPassword,
                                new_password: false,
                              });
                            }}
                            value={password?.new_password}
                          />
                          <span
                            onClick={() =>togglePasswordVisibility("new_password")}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {showPassword.new_password ?  <FaEye /> : <FaEyeSlash />}
                          </span>
                        </div>
                        {invalidPassword.new_password && (
                          <p style={{ color: "#DC3545" }}>
                            Please Enter New Password.
                          </p>
                        )}
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Confirm New Password</Form.Label>
                        <div
                          style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Form.Control
                            style={{
                              borderColor: invalidPassword.confirm_new_password
                                ? "#DC3545"
                                : "",
                            }}
                            type={showPassword.confirm_new_password ? "text" : "password"}
                            name="confirm_new_password"
                            onChange={(e) => {
                              setPassword({
                                ...password,
                                confirm_new_password: e.target.value,
                              });
                              setInvalidPassword({
                                ...invalidPassword,
                                confirm_new_password: false,
                              });
                              setPasswordMismatch(false);
                            }}
                            value={password?.confirm_new_password}
                          />
                          <span
                            onClick={() =>togglePasswordVisibility("confirm_new_password")}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {showPassword.confirm_new_password ?  <FaEye /> : <FaEyeSlash /> }
                          </span>
                        </div>
                        {invalidPassword.confirm_new_password && (
                          <p style={{ color: "#DC3545" }}>
                            Please Confirm New Password.
                          </p>
                        )}
                        {passwordMismatch && (
                          <p style={{ color: "#DC3545" }}>
                            Password didn't match.
                          </p>
                        )}
                      </Form.Group>
                    </div>

                    <div
                      className="col-md-12 d-flex"
                      style={{ marginBottom: "1%", justifyContent: "right" }}
                    >
                      <Button
                        className={"btn btn-danger mx-4"}
                        variant="danger"
                        type="button"
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
                        // onClick={handlePasswordUpdate}
                        disabled={passwordLoading}
                      >
                        {passwordLoading ? "Loading..." : "Update"}
                      </Button>
                    </div>
                  </div>

                  {/* message */}
                  <div className="my-4">
                    <MessageHandler
                      status={FormMsg.type}
                      msg={FormMsg.msg}
                      HandleMessage={setFormMsg}
                    />
                  </div>

                  {/* <div
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
                                                        onClick={() => { navigate(-1) }}
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
                                                        Update
                                                    </Button>
                                                </div>
                                            </div> */}
                </div>
              </Form>

              <ContactModalPhone
                // open={openContactModal}
                open={listType === "phone" ? true : false}
                hanldeModal={setContactModal}
                emailDataList={altTrainerForm1}
                phoneDataList={altTrainerForm1}
                dataType={listType}
                setSubFormData={setAltTrainerForm1}
                SaveForm={SaveForm}
                setDataType={setListType}
              />

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
          ) : (
            <>
              <center>
                <p style={{ marginTop: "5%" }}>
                  You have no access to this profile!
                </p>
              </center>
            </>
          )}
        </>
      )}
    </>
  );
};

export default UserProfile;

import React, { useState, useEffect } from "react";
import { FormControlLabel, Icon, Switch } from "@mui/material";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import Button from "@mui/material/Button";
import SubForm from "./SubForm";
import styles from "./NewAccount.module.css";
import {
  FetchDropDowns,
  ProductsDropDown,
  ModalAccReps,
  AccRepsDropDown,
  GetCountries,
} from "../helper/BasicFn";
import MultiEmailForm from "../components/forms/MultiEmailForm";
import { CallGETAPI, CallPOSTAPI } from "../helper/API";
import MessageHandler from "../components/common/MessageHandler";
import ProductModal from "../components/modals/ProductModal";
import AccountReps from "../components/modals/accountReps";
import MultiTrainingFrom from "../components/forms/MultiTrainingFrom";
import { useNavigate } from "react-router-dom";
import SubHeadingOther from "../components/header/SubHeadingOther";
import MainContactModalPhone from "../components/modals/MainContactModal/MainContactModalPhone";
import MainContactModalEmail from "../components/modals/MainContactModal/MainContactModalEmail";
import { sortData, validatePhone } from "../helper/Common";
import StatesField from "../components/common/states/StatesField";
import Select from "react-select";
import ToogleSwitch from "../components/common/toggleSwitch/ToogleSwitch";

const NewAccount = ({ setShowSidebar }) => {
  const navigate = useNavigate();

  const [AccReps, setAccReps] = useState([]);
  const [AccRepsList, setAccRepsList] = useState([]);
  const [ProductShowModal, setProductShowModal] = useState(false);
  const [ProductModalData, setProductModalData] = useState([]);
  const [SelectedProductsData, setSelectedProductData] = useState("");
  const [SelectAccReps, setSelectAccReps] = useState([]);
  const [ShowAccRepsModal, setShowAccRepsModal] = useState(false);
  const [repsData, setRepsData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [activeState, setActiveState] = useState({});
  const [traininglocation, setTraininglocation] = useState([
    {
      account_alternate_traning_location_company_name: "",
      alternative_phone: "",
      alternative_ext: "",
      account_alternate_traning_location_address1: "",
      account_alternate_traning_location_address2: "",
      account_alternate_traning_location_city: "",
      account_alternate_traning_location_state: "",
      account_alternate_traning_location_country: 231,
      account_alternate_traning_location_zipcode: "",
      account_main_contact_status: 0,
    },
  ]);

  const IncreaseTrainningLocation = () => {
    let arr = [...traininglocation];
    let obj = {
      account_alternate_traning_location_company_name: "",
      alternative_phone: "",
      alternative_ext: "",
      account_alternate_traning_location_address1: "",
      account_alternate_traning_location_address2: "",
      account_alternate_traning_location_city: "",
      account_alternate_traning_location_state: "",
      account_alternate_traning_location_country: 231,
      account_alternate_traning_location_zipcode: "",
      account_main_contact_status: 0,
    };
    arr.push(obj);
    setTraininglocation(arr);
  };

  const DecreaseTrainningLocation = () => {
    let arr = [...traininglocation];
    if (traininglocation.length > 1) {
      arr.pop();
    }

    setTraininglocation(arr);
  };

  const [formData, setFormData] = useState({
    site_name_toggle: false,
    user_type: 1,
    account_name: "",
    parent_account_id: 0,
    distributor_id: 0,
    customer_type_id: 0,
    industry_id: 0,
    terms_id: 0,
    account_status_id: 1,
    lead_source_id: 0,
    website: "",
    important_note: "",
    product_interest: "",
    contact_status: 1,
    restricted_user: false,
    two_FA: 0,
    aed_check_length: "30 Days",
    extra_fields: 0,
    extra_field1: "",
    extra_field2: "",

    account_site_name: "",
    account_site_phone: "",
    account_site_phone_ext: "",
    account_site_main_site: false,
    account_site_call_ahead: false,
    account_site_status_id: 1,
    account_site_address1: "",
    account_site_address2: " ",
    building_name: "",
    account_site_city: "",
    account_site_state: "",
    // account_site_state_name: "",
    account_site_country: "",
    account_site_zipcode: "",

    account_billing_info_billing_phone: "",
    account_billing_info_phone_ext: "",
    account_billing_info_address1: "",
    account_billing_info_address2: "",
    account_billing_info_city: "",
    account_billing_info_state: "",
    // account_billing_info_state_name: "",
    account_billing_info_country: "",
    account_billing_info_zipcode: "",
    billing_is_invoice: false,

    account_shipping_info_shipping_phone: "",
    account_shipping_info_phone_ext: "",
    account_shipping_info_address1: "",
    account_shipping_info_address2: "",
    account_shipping_info_city: "",
    account_shipping_info_state: "",
    // account_shipping_info_state_name: "",
    account_shipping_info_country: "",
    account_shipping_info_zipcode: "",
    shipping_is_invoice: false,

    traininglocation: [],

    account_main_contact_salutation: "",
    account_main_contact_firstname: "",
    account_main_contact_middlename: "",
    account_main_contact_lastname: "",
    account_main_contact_suffix: "",
    account_main_contact_title: "",
    account_main_contact_department: "",

    main_contact_phone: [],
    main_contact_email: [],
    account_reps: [],
  });

  console.log('formData', formData);

  const [formErrors, setFormErrors] = useState({
    account_main_contact_firstname: false,
    account_main_contact_lastname: false,
  });

  const resetForm = () => {
    document.getElementById("create-new-account-form").reset();
  };

  const [multiEmailFormCount, setMultiEmailFormCount] = useState([
    {
      email: "",
      email_type: "0",
      main: 0,
    },
  ]);

  const MultiEmailFormIncrease = () => {
    let arr = [...multiEmailFormCount];
    let obj = {
      email: "",
      email_type: "0",
      main: 0,
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

  // for phone validations
  const [phoneValidations, setPhoneValidations] = useState({
    account_site_phone: false,
    account_billing_info_billing_phone: false,
    account_shipping_info_shipping_phone: false,
  });

  const [trainingPhoneValidations, setTrainingPhoneValidations] =
    useState(false);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    if (
      e.target.name == "account_site_phone" ||
      e.target.name == "account_billing_info_billing_phone" ||
      e.target.name == "account_shipping_info_shipping_phone"
    ) {
      e.target.value = e.target.value.replace(/[^0-9 ]/g, "").trim();
      e.target.value = e.target.value.slice(0, 10);

      const phoneValidate = validatePhone(e.target.value);
      setPhoneValidations((old) => ({
        ...old,
        [e.target.name]: phoneValidate ? false : true,
      }));
    }

    // checkbox
    if (e.target.type == "checkbox") {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.checked }));
    } else if (
      name === "account_main_contact_lastname" ||
      name === "account_main_contact_firstname"
    ) {
      setFormData((old) => ({
        ...old,
        [e.target.name]: e.target.value.replace(/[^a-z]/gi, ""),
      }));
      validateFormField(name, value);
    } else {
      // console.log("elese executed", e.target.name, e.target.value);
      if (e.target.value !== " ") {
        setFormData((old) => ({
          ...old,
          [e.target.name]: e.target.value,
        }));
      }
    }

    console.log("form data", formData);
  };

  // Validate individual form fields
  const validateFormField = (fieldName, value) => {
    // Add your validation logic here
    // Update the errors state based on validation results
    if (/[!@#$%^&*()_+{}\[\]:;<>,.?~\\|/="'-\d]/.test(value)) {
      setFormErrors((old) => ({ ...old, [fieldName]: true }));
    } else {
      setFormErrors((old) => ({ ...old, [fieldName]: false }));
    }
  };

  const [altTrainerForm1, setAltTrainerForm1] = useState([
    {
      phone_number: "",
      ext: "",
      phone_type_id: 1,
      main: 0,
    },
  ]);

  const increaseAlternative1 = () => {
    let arr = [...altTrainerForm1];
    let obj = {
      phone_number: "",
      ext: "",
      phone_type_id: "",
      main: "",
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

  // function to prepare data for all select options
  const prepareOptions = (optionsData, key, value) => {
    if (optionsData) {
      let allData = [];
      for (let i = 0; i < optionsData.length; i++) {
        let singleData = {};
        singleData.value = optionsData[i][key];
        singleData.label = optionsData[i][value];
        allData.push(singleData);
      }
      return allData;
    }
  };

  const fetchOnload = async () => {
    let ProductResult = await ProductsDropDown();
    if (ProductResult) {
      setProductModalData(ProductResult?.products);
    }

    let AllDResult = await FetchDropDowns();
    if (AllDResult) {
      AllDResult.parentAccount = sortData(
        AllDResult?.parentAccount,
        "account_main_contact_firstname"
      );
      AllDResult.distributors = sortData(
        AllDResult?.distributors,
        "distributor_name"
      );
      AllDResult.customerType = sortData(
        AllDResult?.customerType,
        "customer_type_name"
      );
      AllDResult.industryType = sortData(
        AllDResult?.industryType,
        "dropdown_industry_name"
      );
      AllDResult.leadSources = sortData(
        AllDResult?.leadSources,
        "dropdown_lead_source_name"
      );
      AllDResult.accountStatus = sortData(
        AllDResult?.accountStatus,
        "account_status"
      );
      setAllDropDowns(AllDResult);
    }

    let AccResult = await ModalAccReps();
    if (AccResult) {
      let List = [];
      for (let index = 0; index < AccResult.length; index++) {
        const AccEle = AccResult[index];
        let obj = { ...AccEle };
        obj.contact_id = "";
        obj.primary = { id: "", val: "" };
        obj.backup = { id: "", val: "" };
        List.push(obj);
      }
      setAccReps(List);
    }

    let AccreptList = await AccRepsDropDown();
    if (AccreptList) {
      let RepList = [];
      for (let index = 0; index < AccreptList.length; index++) {
        const RepElement = AccreptList[index];
        let obj = { ...RepElement };
        obj.is_selected = false;
        obj.primary = { id: "", val: "" };
        obj.backup = { id: "", val: "" };
        RepList.push(obj);
      }
      setAccRepsList(RepList);
    }

    // get country
    const countries = await GetCountries();
    if (countries?.status) {
      let countriesData = prepareOptions(
        countries?.country,
        "id",
        "country_name"
      );

      console.log("country data", countriesData);
      setCountryList(countriesData);
      setSelectedCountry((old) => ({
        ...old,
        account_site_country: {
          label: countriesData[230].label,
          value: countriesData[230].value,
        },
      }));
      setSelectedCountry((old) => ({
        ...old,
        account_billing_info_country: {
          label: countriesData[230].label,
          value: countriesData[230].value,
        },
      }));
      setSelectedCountry((old) => ({
        ...old,
        account_shipping_info_country: {
          label: countriesData[230].label,
          value: countriesData[230].value,
        },
      }));

      setFormData((old) => ({
        ...old,
        account_site_country: countriesData[230].value,
      }));
      setFormData((old) => ({
        ...old,
        account_billing_info_country: countriesData[230].value,
      }));
      setFormData((old) => ({
        ...old,
        account_shipping_info_country: countriesData[230].value,
      }));
    }
  };

  const [FormMsg, setFormMsg] = React.useState({ type: true, msg: "" });
  const [loading, setLoading] = React.useState(false);
  const [openContactModal, setContactModal] = React.useState(false);
  const [subFormPhoneValidated, setSubFormPhoneValidated] =
    React.useState(false);
  const [listType, setListType] = React.useState("");
  const [countryList, setCountryList] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState({});
  const [validateField, setValidateField] = React.useState(false);

  const [stateList, setStateList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const sitePhoneValidate = validatePhone(formData?.account_site_phone);
    const billingPhoneValidate = validatePhone(
      formData?.account_billing_info_billing_phone
    );
    const shippingPhoneValidate = validatePhone(
      formData?.account_shipping_info_shipping_phone
    );

    setPhoneValidations((old) => ({
      ...old,
      ["account_site_phone"]: sitePhoneValidate ? false : true,
    }));
    setPhoneValidations((old) => ({
      ...old,
      ["account_billing_info_billing_phone"]: billingPhoneValidate
        ? false
        : true,
    }));
    setPhoneValidations((old) => ({
      ...old,
      ["account_shipping_info_shipping_phone"]: shippingPhoneValidate
        ? false
        : true,
    }));

    if (
      phoneValidations.account_site_phone ||
      phoneValidations.account_billing_info_billing_phone ||
      phoneValidations.account_shipping_info_shipping_phone
    ) {
      setValidated(true);
      setLoading(false);
      return;
    }

    // setValidated();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      setLoading(false);
      setValidated(true);
      return;
    }

    if (!subFormPhoneValidated && !trainingPhoneValidations) {
      setLoading(false);
      setValidated(false);
      SaveForm();
    } else {
      setLoading(false);
      setValidated(true);
      return;
    }
  };

  const checkisMainContact = (arr, key) => {
    let newarr = arr.find((a) => (a[key] ? true : false));
    return newarr ? true : false;
  };

  const SaveForm = async () => {
    let Rpsresult = [];
    setListType("");

    let arr = formData;
    arr.two_FA = arr.restricted_user;
    arr.traininglocation = traininglocation;
    arr.product_interest = SelectedProductsData.replace(/,*$/, "");

    if (altTrainerForm1?.length == 1) {
      altTrainerForm1[0].main = 1;
    }
    if (multiEmailFormCount?.length == 1) {
      multiEmailFormCount[0].main = 1;
    }

    let checkMainPhone = checkisMainContact(altTrainerForm1, "main");
    let checkMainEmail = checkisMainContact(multiEmailFormCount, "main");

    if (!checkMainPhone) {
      setListType("phone");
      setContactModal(true);
      return false;
    }

    if (!checkMainEmail) {
      setListType("email");
      setContactModal(true);
      return false;
    }

    for (let index = 0; index < AccReps.length; index++) {
      const RepsElement = AccReps[index];
      if (RepsElement.primary.id) {
        let obj = {
          position_id: RepsElement.position_id,
          contact_id: "",
          is_primary: "0",
          is_backup: "0",
        };
        obj.is_primary = 1;
        obj.contact_id = RepsElement.primary.id;
        Rpsresult.push(obj);
      }

      if (RepsElement.backup.id) {
        let obj = {
          position_id: RepsElement.position_id,
          contact_id: "",
          is_primary: "0",
          is_backup: "0",
        };
        obj.contact_id = RepsElement.backup.id;
        obj.is_backup = 1;
        Rpsresult.push(obj);
      }
    }

    arr.account_reps = Rpsresult;

    let payloadData = {
      account_info: {
        user_type: formData.user_type,
        user_type: formData.user_type,
        account_name: formData.account_name,
        parent_account_id: formData.parent_account_id,
        distributor_id: formData.distributor_id,
        customer_type_id: formData.customer_type_id,
        industry_id: formData.industry_id,
        terms_id: formData.terms_id,
        account_status_id: formData.account_status_id,
        lead_source_id: formData.lead_source_id,
        website: formData.website,
        important_note: formData.important_note,
        product_interest: formData.product_interest,
        contact_status: formData.contact_status,
        restricted_user: formData.restricted_user ? 1 : 0,
        two_FA: formData.two_FA,
        aed_check_length: formData.aed_check_length ?? "30 Days",
        extra_fields: formData.extra_fields ?? 0,
        extra_field1: formData.extra_field1 ?? "",
        extra_field2: formData.extra_field2 ?? "",
      },

      site_details: {
        site_name_toggle: formData?.site_name_toggle ? 1 : 0,
        account_site_name: formData.account_site_name,
        account_site_phone: formData.account_site_phone.trim(),
        account_site_phone_ext: formData.account_site_phone_ext,
        account_site_main_site: formData.account_site_main_site ? 1 : 0,
        account_site_call_ahead: formData.account_site_call_ahead ? 1 : 0,
        account_site_status_id: formData.account_site_status_id,
        account_site_address1: formData.account_site_address1,
        account_site_address2: formData.account_site_address2,
        building_name: formData.building_name,
        account_site_city: formData.account_site_city,
        account_site_state: formData.account_site_state,
        account_site_state_name: formData.account_site_state_name,
        account_site_country: formData.account_site_country,
        account_site_zipcode: formData.account_site_zipcode,
      },

      billing_details: {
        account_billing_info_billing_phone:
          formData.account_billing_info_billing_phone.trim(),
        account_billing_info_phone_ext: formData.account_billing_info_phone_ext,
        account_billing_info_address1: formData.account_billing_info_address1,
        account_billing_info_address2: formData.account_billing_info_address2,
        account_billing_info_city: formData.account_billing_info_city,
        account_billing_info_state: formData.account_billing_info_state,
        account_billing_info_state_name:
          formData.account_billing_info_state_name,
        account_billing_info_country: formData.account_billing_info_country,
        account_billing_info_zipcode: formData.account_billing_info_zipcode,
        billing_is_invoice: formData?.billing_is_invoice ? 1 : 0,
      },

      shipping_details: {
        account_shipping_info_shipping_phone:
          formData.account_shipping_info_shipping_phone.trim(),
        account_shipping_info_phone_ext:
          formData.account_shipping_info_phone_ext,
        account_shipping_info_address1: formData.account_shipping_info_address1,
        account_shipping_info_address2: formData.account_shipping_info_address2,
        account_shipping_info_city: formData.account_shipping_info_city,
        account_shipping_info_state: formData.account_shipping_info_state,
        account_shipping_info_state_name:
          formData.account_shipping_info_state_name,
        account_shipping_info_country: formData.account_shipping_info_country,
        account_shipping_info_zipcode: formData.account_shipping_info_zipcode,
        shipping_is_invoice: formData?.shipping_is_invoice ? 1 : 0,
      },

      traininglocation: formData.traininglocation,

      main_contact: {
        account_main_contact_salutation:
          formData.account_main_contact_salutation,
        account_main_contact_firstname: formData.account_main_contact_firstname,
        account_main_contact_middlename:
          formData.account_main_contact_middlename,
        account_main_contact_lastname: formData.account_main_contact_lastname,
        account_main_contact_suffix: formData.account_main_contact_suffix,
        account_main_contact_title: formData.account_main_contact_title,
        account_main_contact_department:
          formData.account_main_contact_department,
      },

      main_contact_phone: altTrainerForm1,
      main_contact_email: multiEmailFormCount,
      account_reps: repsData,
      // account_reps: formData.account_reps,
    };

    let result = await CallPOSTAPI("account/create-account", payloadData);
    setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
    setLoading(false);

    if (result?.data?.status) {
      resetForm();
      navigate("/accounts-listing");
    }
  };

  const SameAddressBilling = (value) => {
    let isChecked = value;
    let Fd = { ...formData };
    // console.log("fd console", Fd);
    if (isChecked) {
      Fd.account_billing_info_address1 = Fd.account_site_address1;
      Fd.account_billing_info_address2 = Fd.account_site_address2;
      Fd.account_billing_info_city = Fd.account_site_city;
      Fd.account_billing_info_state = Fd.account_site_state;
      Fd.account_billing_info_state_id = Fd.account_site_state_id;
      Fd.account_billing_info_state_name = Fd.account_site_state_name;
      Fd.account_billing_info_country = Fd.account_site_country;
      Fd.account_billing_info_zipcode = Fd.account_site_zipcode;
      setSelectedCountry((old) => ({
        ...old,
        account_billing_info_country: {
          label: selectedCountry?.account_site_country?.label,
          value: selectedCountry?.account_site_country?.value,
        },
      }));
    } else {
      Fd.account_billing_info_address1 = "";
      Fd.account_billing_info_address2 = "";
      Fd.account_billing_info_city = "";
      Fd.account_billing_info_state = "";
      Fd.account_billing_info_state_id = "";
      Fd.account_billing_info_state_name = "";
      Fd.account_billing_info_country = "";
      Fd.account_billing_info_zipcode = "";
      setSelectedCountry((old) => ({
        ...old,
        account_billing_info_country: {
          label: countryList[230].label,
          value: countryList[230].value,
        },
      }));
    }
    setFormData(Fd);
  };

  const SameAddressShipping = (value) => {
    let isChecked = value;
    let Fd = { ...formData };

    if (isChecked) {
      Fd.account_shipping_info_address1 = Fd.account_billing_info_address1;
      Fd.account_shipping_info_address2 = Fd.account_billing_info_address2;
      Fd.account_shipping_info_city = Fd.account_billing_info_city;
      Fd.account_shipping_info_state = Fd.account_billing_info_state;
      Fd.account_shipping_info_state_id = Fd.account_billing_info_state_id;
      Fd.account_shipping_info_country = Fd.account_billing_info_country;
      Fd.account_shipping_info_zipcode = Fd.account_billing_info_zipcode;
      setSelectedCountry((old) => ({
        ...old,
        account_shipping_info_country: {
          label: selectedCountry?.account_billing_info_country.label,
          value: selectedCountry?.account_billing_info_country.value,
        },
      }));
    } else {
      Fd.account_shipping_info_address1 = "";
      Fd.account_shipping_info_address2 = "";
      Fd.account_shipping_info_city = "";
      Fd.account_shipping_info_state = "";
      Fd.account_shipping_info_state_id = "";
      Fd.account_shipping_info_country = "";
      Fd.account_shipping_info_zipcode = "";
      setSelectedCountry((old) => ({
        ...old,
        account_shipping_info_country: {
          label: countryList[230].label,
          value: countryList[230].value,
        },
      }));
    }
    setFormData(Fd);
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

  const [accNameErr, setAssNameErr] = useState("");
  const [switchValue, setSwitchValue] = useState({});

  // same billing shipping
  const sameBillingShipping = (switchValue, e) => {
    if (switchValue?.key == "same_shipping_address") {
      SameAddressShipping(switchValue?.value);
    } else if (switchValue?.key == "same_billing_address") {
      SameAddressBilling(switchValue?.value);
    }
    setFormData((old) => ({ ...old, [switchValue?.key]: switchValue?.value }));
  };

  // check for switch value and update values
  useEffect(() => {
    sameBillingShipping(switchValue);
  }, [switchValue]);

  // set site name value
  const setUpSiteName = (formData) => {
    if (formData?.site_name_toggle) {
      let siteName =
        formData?.account_site_state_name +
        " " +
        formData?.account_site_city +
        " - " +
        formData?.account_site_address1 +
        (formData?.building_name ? " / " + formData?.building_name : "");
      setFormData((old) => ({ ...old, ["temp_account_site_name"]: siteName }));
    } else {
      setFormData((old) => ({ ...old, ["temp_account_site_name"]: "" }));
    }
  };

  useEffect(() => {
    setUpSiteName(formData);
  }, [formData?.site_name_toggle]);

  const [stateError, setStateError] = useState(""); // State to store the error message

  // const handleStateError = (errorMessage) => {
  //   setStateError(errorMessage); // Function to update the error state
  // };

  return (
    <>
      <div className="mt-4" style={{ paddingInline: "45px" }}>
        <SubHeadingOther
          hideNew="tab"
          title="New Account"
          subHeading={true}
          hideHierarchy={true}
          bottomLinks={false}
        />

        {/* account resps and products popup buttons */}
        <div className="d-flex">
          <button
            className="btn text-primary"
            type="button"
            onClick={() => setProductShowModal(true)}
          >
            <img src="/products.svg" alt="svg" style={{ marginRight: "1px" }} />
            <span className="ms-2">Products</span>
          </button>

          <button
            className="btn text-primary"
            type="button"
            onClick={() => setShowAccRepsModal(true)}
          >
            <img src="/reps.svg" alt="svg" style={{ marginRight: "1px" }} />
            <span className="ms-2">Reps</span>
          </button>
        </div>

        {/* main form */}
        <Form
          className=""
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
          id="create-new-account-form"
        >
          <div className="container-fluid">
            {/* Account Information */}
            <div
              className="container-fluid bottom-border-blue mt-4 pt-2 pb-2"
              style={{
                background: "#eee",
              }}
            >
              <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                Account Information
              </h2>
              <div className="row my-4">
                <div className="col-md-4">
                  <Form.Group className={""}>
                    <Form.Label className={styles.textlabel}>
                      Account Name *
                    </Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        placeholder="Account Name..."
                        required
                        name="account_name"
                        value={formData.account_name}
                        onChange={(e) => {
                          handleInputChange(e);
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please Enter Account Name.
                      </Form.Control.Feedback>
                    </InputGroup>

                    {accNameErr && <p className="text-danger">{accNameErr}</p>}
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <b className={""}>Parent Account</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="parent_account_id"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.parentAccount &&
                      allDropDowns?.parentAccount.map((PA, index) => (
                        <option value={PA.account_id} key={index}>
                          {PA.account_main_contact_firstname}
                        </option>
                      ))}
                  </Form.Select>
                </div>
                <div className="col-md-3">
                  <b>Distributor</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="distributor_id"
                    defaultValue={""}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  >
                    <option value="0">--Select One--</option>
                    {allDropDowns?.distributors &&
                      allDropDowns?.distributors.map((Distributor, index) => (
                        <option
                          value={Distributor.dropdown_distributor_id}
                          key={index}
                        >
                          {Distributor.distributor_name}
                        </option>
                      ))}
                  </Form.Select>
                </div>
                <div className="col-md-1 d-flex mb-2 modal-btns">
                  <Form.Group
                    className={" text-left "}
                    style={{ margin: "auto 10px" }}
                  >
                    <b className={"D-BLOCK"}>Restricted</b>
                    <span className="d-inline-block mt-10-px">
                      <ToogleSwitch
                        switchKeyValue={formData?.restricted_user}
                        setSwitchValue={setSwitchValue}
                        switchValue={switchValue}
                        switchKey={"restricted_user"}
                      />
                    </span>
                    {/* <div className="">
                                        <FormControlLabel
                                        className={ "" }
                                        label=""
                                        control={
                                            <Switch
                                            color="primary"
                                            size="medium"
                                            value={true}
                                            name="restricted_user"
                                            onChange={ (e) =>  { handleInputChange(e) } }
                                            />
                                        }
                                        />
                                    </div> */}
                  </Form.Group>
                </div>
              </div>

              <div className="row my-4">
                <div className="col">
                  <b className={""}>Customer Type</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="customer_type_id"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    // value={''}
                  >
                    <option value="0">--Select One--</option>
                    {allDropDowns?.customerType &&
                      allDropDowns?.customerType.map((CT, index) => (
                        <option
                          value={CT.dropdown_customer_type_id}
                          key={index}
                        >
                          {CT.customer_type_name}
                        </option>
                      ))}
                  </Form.Select>
                </div>

                <div className="col">
                  <b className={""}>Industry</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="industry_id"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    // value={''}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.industryType &&
                      allDropDowns?.industryType.map((IT, index) => (
                        <option value={IT.dropdown_industry_id} key={index}>
                          {IT.dropdown_industry_name}
                        </option>
                      ))}
                  </Form.Select>
                </div>
                <div className="col">
                  <b className={""}>Terms</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="terms_id"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    // value={''}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.termsType &&
                      allDropDowns?.termsType.map((TT, index) => (
                        <option value={TT.dropdown_terms_id} key={index}>
                          {TT.dropdown_terms_name}
                        </option>
                      ))}
                  </Form.Select>
                </div>

                <div className="col">
                  <b className={""}>Account Status</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="account_status_id"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    defaultValue={1}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.accountStatus &&
                      allDropDowns?.accountStatus.map((AS, index) => (
                        <option value={AS.drop_account_status_id} key={index}>
                          {AS.account_status}
                        </option>
                      ))}
                  </Form.Select>
                </div>

                <div className="col">
                  <b className={""}>Lead Source</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="lead_source_id"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    // value={''}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.leadSources &&
                      allDropDowns?.leadSources.map((LS, index) => (
                        <option value={LS.dropdown_lead_source_id} key={index}>
                          {LS.dropdown_lead_source_name}
                        </option>
                      ))}
                  </Form.Select>
                </div>
              </div>

              <div className="row my-4">
                <div className="col-5">
                  <Form.Group className={""}>
                    <Form.Label className={styles.textlabel}>
                      Website
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Website..."
                      name="website"
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="col-7">
                  <Form.Group className={""}>
                    <Form.Label className={styles.textlabel}>
                      Important Notes
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      placeholder="Important Notes..."
                      name="important_note"
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            {/* Site Information */}
            <div
              className="container-fluid bottom-border-blue mt-4 pt-2 pb-2"
              style={{
                background: "#eee",
              }}
            >
              <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                Site Information
              </h2>
              <div className="row my-4">
                <Form.Group className={"col"}>
                  <Form.Label>Site Name </Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_name"
                    value={
                      formData?.temp_account_site_name != false
                        ? formData?.temp_account_site_name
                        : formData?.account_site_name
                    }
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    // required
                  />

                  {/* <Form.Control.Feedback type="invalid">
                    Please Enter Site Name.
                  </Form.Control.Feedback> */}
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Site Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_phone"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    // required
                    minLength="10"
                    className={
                      phoneValidations?.account_site_phone
                        ? "phone-invalid-input"
                        : ""
                    }
                  />

                  {phoneValidations?.account_site_phone ? (
                    <>
                      <div className="phone-invalid">
                        Please Enter Exact 10 digits.
                      </div>
                    </>
                  ) : (
                    <>
                      <Form.Control.Feedback type="invalid">
                        Please Enter Exact 10 digits.
                      </Form.Control.Feedback>
                    </>
                  )}
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Phone Ext</Form.Label>
                  <Form.Control
                    type="number"
                    name="account_site_phone_ext"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col-1"}>
                  <b className={""}>Main Site</b>
                  <span className="d-inline-block mt-10-px">
                    <ToogleSwitch
                      switchKeyValue={formData?.account_site_main_site}
                      setSwitchValue={setSwitchValue}
                      switchValue={switchValue}
                      switchKey={"account_site_main_site"}
                    />
                  </span>
                  {/* <div className="">
                                    <FormControlLabel
                                        className={ "" }
                                        label=""
                                        control={
                                        <Switch
                                            color="primary"
                                            size="medium"
                                            value={true}
                                            name="account_site_main_site"
                                            onChange={ (e) =>  { handleInputChange(e) } }
                                        />
                                        }
                                    />
                                </div> */}
                </Form.Group>

                <Form.Group className={"col-1"}>
                  <b className={""}>Call Ahead</b>
                  <span className="d-inline-block mt-10-px">
                    <ToogleSwitch
                      switchKeyValue={formData?.account_site_call_ahead}
                      setSwitchValue={setSwitchValue}
                      switchValue={switchValue}
                      switchKey={"account_site_call_ahead"}
                    />
                  </span>
                  {/* <div className="">
                                    <FormControlLabel
                                        className={ "" }
                                        label=""
                                        control={
                                        <Switch
                                            color="primary"
                                            size="medium"
                                            value={true}
                                            name="account_site_call_ahead"
                                            onChange={ (e) =>  { handleInputChange(e) } }
                                        />
                                        }
                                    />
                                </div> */}
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Site Status</Form.Label>
                  <Form.Select
                    className={""}
                    name="account_site_status_id"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    value={formData?.account_site_status_id}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.siteStatus &&
                      allDropDowns?.siteStatus.map((SS, index) => (
                        <option value={SS.dropdown_site_status_id} key={index}>
                          {SS.dropdown_site_status_name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="row my-4">
                <Form.Group className={"col"}>
                  <Form.Label>Country</Form.Label>
                  <Select
                    value={selectedCountry?.account_site_country}
                    options={countryList}
                    onChange={(data) => {
                      handleSelectChange(data, "account_site_country");
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Address *</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_address1"
                    value={formData.account_site_address1}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    required
                  />

                  <Form.Control.Feedback type="invalid">
                    Please Enter Address.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Address 2</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_address2"
                    value={formData.account_site_address2}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Building Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="building_name"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>City *</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_city"
                    value={formData.account_site_city}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please Enter City.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className={"col relative"}>
                  <Form.Label>State *</Form.Label>
                  <StatesField
                    setFormData={setFormData}
                    valueKey="account_site_state"
                    selectedCountry={
                      selectedCountry?.account_site_country?.value
                    }
                    stateSelectedValue={formData?.account_site_state}
                    validated={validated}
                    required={true}
                    // onError={handleStateError} // Pass the error handler function
                  />
                </Form.Group>
                {/* {stateError && <p className="error">{stateError}</p>} */}

                <Form.Group className={"col"}>
                  <Form.Label>Zip code *</Form.Label>
                  <Form.Control
                    type="number"
                    name="account_site_zipcode"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please Enter Zip Code.
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="my-4 d-flex gap-2 align-items-center">
                <span>
                  <Form.Group
                    className={"col ms-2 d-flex align-items-center gap-2"}
                  >
                    <Form.Label className="">Site Name</Form.Label>
                    <ToogleSwitch
                      switchKeyValue={formData?.site_name_toggle}
                      setSwitchValue={setSwitchValue}
                      switchValue={switchValue}
                      switchKey={"site_name_toggle"}
                    />
                  </Form.Group>
                </span>
              </div>
            </div>

            {/* Billing information */}
            <div
              className="container-fluid bottom-border-blue mt-4 pt-2 pb-2"
              style={{
                background: "#eee",
              }}
            >
              <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                Billing Information
              </h2>
              <div className="row my-4">
                <Form.Group className={"col"}>
                  <Form.Label>Billing Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_billing_info_billing_phone"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    minLength="10"
                    className={
                      phoneValidations?.account_billing_info_billing_phone
                        ? "phone-invalid-input"
                        : ""
                    }
                  />

                  {phoneValidations?.account_billing_info_billing_phone ? (
                    <>
                      <div className="phone-invalid">
                        Please Enter Exact 10 digits.
                      </div>
                    </>
                  ) : (
                    <>
                      <Form.Control.Feedback type="invalid">
                        Please Enter Exact 10 digits.
                      </Form.Control.Feedback>
                    </>
                  )}
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Phone Ext</Form.Label>
                  <Form.Control
                    type="number"
                    name="account_billing_info_phone_ext"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col-2"}>
                  <b className={"d-block"}>Invoice ASAP</b>
                  <span className="d-inline-block mt-10-px">
                    <ToogleSwitch
                      switchKeyValue={formData?.billing_is_invoice}
                      setSwitchValue={setSwitchValue}
                      switchValue={switchValue}
                      switchKey={"billing_is_invoice"}
                    />
                  </span>
                  {/* <div className="">
                                    <FormControlLabel
                                        className={ "" }
                                        label=""
                                        control={
                                        <Switch
                                            color="primary"
                                            size="medium"
                                            value={true}
                                            name="billing_is_invoice"
                                            onChange={ (e) =>  { handleInputChange(e) } }
                                        />
                                        }
                                    />
                                </div> */}
                </Form.Group>

                <Form.Group className={"col-2"}>
                  <b className={"d-block"}>Same Address</b>
                  <span className="d-inline-block mt-10-px">
                    <ToogleSwitch
                      switchKeyValue={formData?.same_billing_address}
                      setSwitchValue={setSwitchValue}
                      switchValue={switchValue}
                      switchKey={"same_billing_address"}
                    />
                  </span>
                  {/* <div className="">
                                    <FormControlLabel
                                        className={ "" }
                                        label=""
                                        control={
                                        <Switch
                                            color="primary"
                                            size="medium"
                                            value={true}
                                            name="same_address"
                                            onChange={ (e) =>
                                            {
                                            // handleInputChange(e)
                                            SameAddressBilling(e)
                                            } }
                                        />
                                        }
                                    />
                                </div> */}
                </Form.Group>
              </div>

              <div className="row my-4">
                <Form.Group className={"col"}>
                  <Form.Label>Country</Form.Label>
                  <Select
                    value={selectedCountry?.account_billing_info_country}
                    options={countryList}
                    onChange={(data) => {
                      handleSelectChange(data, "account_billing_info_country");
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_billing_info_address1"
                    value={formData.account_billing_info_address1}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Address 2</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_billing_info_address2"
                    value={formData.account_billing_info_address2}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_billing_info_city"
                    value={formData.account_billing_info_city}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col relative"}>
                  <Form.Label>State </Form.Label>

                  <StatesField
                    setFormData={setFormData}
                    valueKey="account_billing_info_state"
                    selectedCountry={
                      selectedCountry?.account_billing_info_country?.value
                    }
                    stateSelectedValue={formData?.account_billing_info_state}
                   />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Zip code</Form.Label>
                  <Form.Control
                    type="number"
                    name="account_billing_info_zipcode"
                    value={formData.account_billing_info_zipcode}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>
              </div>
            </div>

            {/* Shipping information */}
            <div
              className="container-fluid bottom-border-blue mt-4 pt-2 pb-2"
              style={{
                background: "#eee",
              }}
            >
              <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                Shipping Information
              </h2>
              <div className="row my-4">
                <Form.Group className={"col relative"}>
                  <Form.Label>Shipping Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_shipping_info_shipping_phone"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    minLength="10"
                    className={
                      phoneValidations?.account_shipping_info_shipping_phone
                        ? "phone-invalid-input"
                        : ""
                    }
                  />

                  {phoneValidations?.account_shipping_info_shipping_phone ? (
                    <>
                      <div className="phone-invalid">
                        Please Enter Exact 10 digits.
                      </div>
                    </>
                  ) : (
                    <>
                      <Form.Control.Feedback type="invalid">
                        Please Enter Exact 10 digits.
                      </Form.Control.Feedback>
                    </>
                  )}
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Phone Ext</Form.Label>
                  <Form.Control
                    type="number"
                    name="account_shipping_info_phone_ext"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                {/* <Form.Group className={ "col-2" }>
                                <b className={ "" }>Invoice ASAP</b>
                                <div className="">
                                <FormControlLabel
                                    className={ "" }
                                    label=""
                                    control={
                                    <Switch
                                        color="primary"
                                        size="medium"
                                        value={true}
                                        name="shipping_is_invoice"
                                        onChange={ (e) =>  { handleInputChange(e) } }
                                    />
                                    }
                                />
                                </div>
                            </Form.Group> */}

                <Form.Group className={"col-2"}>
                  <b className={"d-block"}>Same Address</b>
                  <span className="d-inline-block mt-10-px">
                    <ToogleSwitch
                      switchKeyValue={formData?.same_shipping_address}
                      setSwitchValue={setSwitchValue}
                      switchValue={switchValue}
                      switchKey={"same_shipping_address"}
                    />
                  </span>
                  {/* <div className="">
                                    <FormControlLabel
                                        className={ "" }
                                        label=""
                                        control={
                                        <Switch
                                            color="primary"
                                            size="medium"
                                            value={true}
                                            name="same_address"
                                            onChange={ (e) =>
                                            {
                                            // handleInputChange(e)
                                            SameAddressShipping(e)
                                            } }
                                        />
                                        }
                                    />
                                </div> */}
                </Form.Group>
              </div>

              <div className="row my-4">
                <Form.Group className={"col"}>
                  <Form.Label>Country</Form.Label>
                  <Select
                    value={selectedCountry?.account_shipping_info_country}
                    options={countryList}
                    onChange={(data) => {
                      handleSelectChange(data, "account_shipping_info_country");
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_shipping_info_address1"
                    value={formData.account_shipping_info_address1}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Address 2</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_shipping_info_address2"
                    value={formData.account_shipping_info_address2}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_shipping_info_city"
                    value={formData.account_shipping_info_city}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col relative"}>
                  <Form.Label>State </Form.Label>

                  <StatesField
                    setFormData={setFormData}
                    valueKey="account_shipping_info_state"
                    selectedCountry={
                      selectedCountry?.account_shipping_info_country?.value
                    }
                    stateSelectedValue={formData?.account_shipping_info_state}
                    // validated={validated}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Zip code</Form.Label>
                  <Form.Control
                    type="number"
                    name="account_shipping_info_zipcode"
                    value={formData.account_shipping_info_zipcode}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>
              </div>
            </div>

            {/* Alternate Training Information */}
            <div
              className="container-fluid bottom-border-blue mt-4 pt-2"
              style={{
                borderBottom: "4px solid rgb(13, 110, 253)",
                background: "#eee",
              }}
            >
              <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                Alternate Training Information
              </h2>
              <div className="row my-4">
                <div className="col-12">
                  <MultiTrainingFrom
                    altTrainerForm={traininglocation}
                    setSubFormData={setTraininglocation}
                    increaseAlternative={IncreaseTrainningLocation}
                    decreaseAlternative={DecreaseTrainningLocation}
                    handleInputChange={(e) => {
                      handleInputChange(e);
                    }}
                    allDropDowns={allDropDowns}
                    noBtns={false}
                    fieldsRequired={true}
                    countriesList={countryList}
                    setTrainingPhoneValidations={setTrainingPhoneValidations}
                    setValidateField={setValidateField}
                  />
                </div>
              </div>
            </div>

            {/* account POC */}
            <div
              className="container-fluid bottom-border-blue pb-2 pt-2 mt-4"
              style={{ background: "#eee" }}
            >
              <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                Account POC
              </h2>
              <div className="row my-4 ">
                <Form.Group className={"col"}>
                  <Form.Label>Salutation</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_main_contact_salutation"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_main_contact_firstname"
                    value={formData.account_main_contact_firstname}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    isInvalid={!!formErrors.account_main_contact_firstname}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please Enter First Name and do not use any special or
                    numeric character.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Middle Name </Form.Label>
                  <Form.Control
                    type="text"
                    name="account_main_contact_middlename"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_main_contact_lastname"
                    value={formData.account_main_contact_lastname}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    isInvalid={!!formErrors.account_main_contact_lastname}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please Enter Last Name and do not use any special or numeric
                    character.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Suffix</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_main_contact_suffix"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_main_contact_title"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>
                <Form.Group className={"col"}>
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_main_contact_department"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Contact Status</Form.Label>

                  <Form.Select
                    className={""}
                    name="contact_status"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    value={formData?.contact_status}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.contactStatus &&
                      allDropDowns?.contactStatus.map((CS, index) => (
                        <option
                          value={CS.dropdown_contact_status_id}
                          key={index}
                        >
                          {CS.contact_status_type}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </div>

              <SubForm
                altTrainerForm={altTrainerForm1}
                setSubFormData={setAltTrainerForm1}
                increaseAlternative={increaseAlternative1}
                decreaseAlternative={decreaseAlternative1}
                handleInputChange={(e) => {
                  handleInputChange(e);
                }}
                allDropDowns={allDropDowns}
                formData={formData.main_contact_phone}
                formName={"main_contact_phone"}
                setFormData={setFormData}
                noBtns={true}
                setPhoneValidations={setPhoneValidations}
                phoneValidations={phoneValidations}
                setSubFormPhoneValidated={setSubFormPhoneValidated}
              />

              <MultiEmailForm
                altTrainerForm={multiEmailFormCount}
                setSubFormData={setMultiEmailFormCount}
                increaseAlternative={MultiEmailFormIncrease}
                decreaseAlternative={MultiEmailFormDecrease}
                handleInputChange={(e) => {
                  handleInputChange(e);
                }}
                allDropDowns={allDropDowns}
                formData={formData.main_contact_email}
                formName={"main_contact_email"}
                setFormData={setFormData}
              />
            </div>

            {/* aed */}
            <div
              className="container-fluid bottom-border-blue mt-4 pt-2 pb-2"
              style={{ background: "#eee" }}
            >
              <h2
                className="text-left heading"
                style={{ marginBottom: "20px" }}
              >
                AED Options
              </h2>
              <div className="row mb-4">
                <div className="col-md-3 col-lg-3">
                  <b className={""}>AED Check Length</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="aed_check_length"
                    value={formData?.aed_check_length ?? "30 Days"}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  >
                    <option value={"15 Days"}>15 Days</option>
                    <option value={"30 Days"}>30 Days</option>
                  </Form.Select>
                </div>

                <div className="col-md-3 col-lg-3">
                  <b className={""}>Extra Fields</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="extra_fields"
                    value={formData?.extra_fields}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </Form.Select>
                </div>

                {formData?.extra_fields != 0 && (
                  <>
                    {formData?.extra_fields == 1 ? (
                      <>
                        {/* field 1 */}
                        <div className="col-md-2 col-lg-3">
                          <Form.Group className={""}>
                            <Form.Label className={styles.textlabel}>
                              Field 1 Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Field 1..."
                              name="extra_field1"
                              value={formData?.extra_field1}
                              onChange={(e) => {
                                handleInputChange(e);
                              }}
                            />
                          </Form.Group>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* field 1 */}
                        <div className="col-md-2 col-lg-3">
                          <Form.Group className={""}>
                            <Form.Label className={styles.textlabel}>
                              Field 1 Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Field 1..."
                              name="extra_field1"
                              value={formData?.extra_field1}
                              onChange={(e) => {
                                handleInputChange(e);
                              }}
                            />
                          </Form.Group>
                        </div>

                        {/* field 2 */}
                        <div className="col-md-2 col-lg-3">
                          <Form.Group className={""}>
                            <Form.Label className={styles.textlabel}>
                              Field 2 Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Field 2..."
                              name="extra_field2"
                              value={formData?.extra_field2}
                              onChange={(e) => {
                                handleInputChange(e);
                              }}
                            />
                          </Form.Group>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* message */}
            <div className="mt-5">
              <MessageHandler
                status={FormMsg.type}
                msg={FormMsg.msg}
                HandleMessage={setFormMsg}
              />
            </div>

            {/* bottom buttons */}
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
                  disabled={loading}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </Form>

        <MainContactModalPhone
          open={listType === "phone" ? true : false}
          hanldeModal={setContactModal}
          emailDataList={altTrainerForm1}
          phoneDataList={altTrainerForm1}
          dataType={listType}
          setSubFormData={setAltTrainerForm1}
          SaveForm={SaveForm}
          setDataType={setListType}
        />

        <MainContactModalEmail
          open={listType === "email" ? true : false}
          hanldeModal={setContactModal}
          emailDataList={multiEmailFormCount}
          phoneDataList={multiEmailFormCount}
          dataType={listType}
          setSubFormData={setMultiEmailFormCount}
          SaveForm={SaveForm}
          setDataType={setListType}
        />

        {/* setSubFormData={ setMultiEmailFormCount } */}
        <ProductModal
          ProductShowModal={ProductShowModal}
          setProductShowModal={setProductShowModal}
          ProductModalData={ProductModalData}
          SelectedProductsData={SelectedProductsData}
          setSelectedProductData={setSelectedProductData}
        />

        <AccountReps
          ShowRepsModal={ShowAccRepsModal}
          SetShowRepsModal={setShowAccRepsModal}
          setSelectAccReps={setSelectAccReps}
          setAccReps={setAccReps}
          AccReps={AccReps}
          setAccRepsList={setAccRepsList}
          AccRepsList={AccRepsList}
          setRepsData={setRepsData}
          type="newAccountSiteReps"
        />
      </div>
    </>
  );
};

export default NewAccount;

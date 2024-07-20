import React, { useState, useEffect } from "react";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import Select from "react-select";
import Button from "@mui/material/Button";
import SubHeadingOther from "../../components/header/SubHeadingOther";
import styles from "../NewAccount.module.css";
import ToogleSwitch from "../../components/common/toggleSwitch/ToogleSwitch";
import SubForm from "./SubForm";
import MultiEmailForm from "./MultiEmailForm";
// import StatesField from "../../components/common/states/StatesField";
import CustomToggleButton from "../../components/common/toggleSwitch/CustomToggleButton";
import Contacts from "../../img/Contacts.svg";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import StateField from "../../components/common/states/StatesField";
import {
  AccRepsDropDown,
  AssignedSiteContactList,
  ContactList,
  DecryptToken,
  FetchDropDowns,
  GetCountries,
  ModalAccSiteReps,
  SiteContactRepList,
  SiteRepsDropDown,
} from "../../helper/BasicFn";
import { prepareOptions, validatePhone } from "../../helper/Common";
import AccountReps from "../../components/modals/accountReps";
import ContactModel from "../../components/modals/ContactModel";
import { CallPOSTAPI } from "../../helper/API";
// import MultiTrainingFrom from "../../components/forms/MultiTrainingFrom";
import AdminMultiTrainingFrom from "./AdminMultiTrainingFrom";
import { toast } from "react-toastify";
import { Checkbox, FormControlLabel, Icon, Radio, Switch } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AdminContactModel from "./AdminContactModel";
import AdminAccountReps from "./AdminAccountReps";
import { Border } from "devextreme-react/bar-gauge";
import { NoEncryption } from "@mui/icons-material";
import AdminMainContactPhoneModal from "./AdminMainContactPhoneModal";
import AdminMainContactMailModal from "./AdminMainContactMailModal";

const AdminSiteNew = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const user = DecryptToken();
  const [validated, setValidated] = useState(false);
  const [StateAbreaviation, setStateAbreaviation] = useState("");
  const [adminContactModelData, setAdminContactModelData] = useState([]);
  const [adminAccountModelData, setAdminAccountModelData] = useState([]);
  const [mainRequired, setMainRequired] = useState(false);
  const [billingMainRequired, setBillingMainRequired] = useState(false);
  const [shippingMainRequired, setShippingMainRequired] = useState(false);
  const [openMailModal, setOpenMailModal] = useState(false);
  const [openPhoneModal, setOpenPhoneModal] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = useState({
    // Site Info
    account_site_state_abbreviation: "",
    account_site_country: "",
    account_site_address1: "",
    account_site_address2: "",
    building_name: "",
    account_site_city: "",
    account_site_state: "",
    account_site_zipcode: "",
    generate_name_toggle: "",
    account_site_name: "",
    account_site_phone: "",
    account_site_info_phone_ext: "",
    account_site_status_id: 1,
    invoice_asap: 0,
    call_ahead: 0,
    out_of_area: 0,
    security_clearance: 0,
    requires_escort: 0,
    site_poc: 0,
    site_hours: 0,
    same_billing_address: 1,
    billing_contact: 0,
    same_shipping_address: 1,
    shipping_contact: 0,
    alternate_training: 0,

    // Site contact
    site_contact_salutation: "",
    site_contact_firstname: "",
    site_contact_middlename: "",
    site_contact_lastname: "",
    site_contact_suffix: "",
    site_contact_title: "",
    site_contact_department: "",
    site_contact_status: 1,
    site_contact_phone: [],
    site_contact_email: [],

    // Billing contact
    billing_contact_salutation: "",
    billing_contact_firstname: "",
    billing_contact_middlename: "",
    billing_contact_lastname: "",
    billing_contact_suffix: "",
    billing_contact_title: "",
    billing_contact_department: "",
    billing_contact_status: 1,
    billing_contact_phone: [],
    billing_contact_email: [],

    // Billing Address
    account_billing_info_address1: "",
    account_billing_info_address2: "",
    account_billing_info_city: "",
    account_billing_info_state: "",
    account_billing_info_country: "",
    account_billing_info_zipcode: "",

    // Shipping contact
    shipping_contact_salutation: "",
    shipping_contact_firstname: "",
    shipping_contact_middlename: "",
    shipping_contact_lastname: "",
    shipping_contact_suffix: "",
    shipping_contact_title: "",
    shipping_contact_department: "",
    shipping_contact_status: 1,
    shipping_contact_phone: [],
    shipping_contact_email: [],

    // Shipping Address
    account_shipping_info_address1: "",
    account_shipping_info_address2: "",
    account_shipping_info_city: "",
    account_shipping_info_state: "",
    account_shipping_info_country: "",
    account_shipping_info_zipcode: "",

    // Site Hours
    sundayopen: "",
    mondayopen: "",
    tuesdayopen: "",
    wednesdayopen: "",
    thursdayopen: "",
    fridayopen: "",
    saturdayopen: "",
    sundayclose: "",
    mondayclose: "",
    tuesdayclose: "",
    wednesdayclose: "",
    thursdayclose: "",
    fridayclose: "",
    saturdayclose: "",
    technicians: {
      primary: 0,
      backup: 0
    },
  });
  const [switchValue, setSwitchValue] = useState({});
  const [countryList, setCountryList] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState({});
  const [allDropDowns, setAllDropDowns] = useState([]);
  const [AccReps, setAccReps] = useState([]);
  const [AccRepsList, setAccRepsList] = useState([]);
  const [ShowAccRepsModal, setShowAccRepsModal] = useState(false);
  const [SelectAccReps, setSelectAccReps] = useState([]);
  const [repsData, setRepsData] = useState([]);
  const [contactShowModel, setContactShowModel] = useState(false);
  const [SelectContact, setSelectContact] = useState([]);
  const [contactRepsList, setContactRepsList] = useState([]);
  const [contactReps, setContactReps] = useState([]);
  const [modalPhonetype, setModalPhoneType] = useState([])
  const [phoneModalTitle, setPhoneModalTitle] = useState('')
  const [phoneObjName, setPhoneObjName] = useState('')
  const [mailModalTitle, setMailModalTitle] = useState('')
  const [modalMailtype, setModalMailType] = useState([])
  const [mailObjName, setMailObjName] = useState('')
  const [finalPayload, setFinalPayload] = useState({});
  const [techniciansData, setTechniciansData] = useState([]);
  
  const [open, setOpen] = useState({
    sundayopen: 0,
    mondayopen: 0,
    tuesdayopen: 0,
    wednesdayopen: 0,
    thursdayopen: 0,
    fridayopen: 0,
    saturdayopen: 0,
  });

  const handleRadioChange = (key) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [key]: prevOpen[key] === 0 ? 1 : 0,
    }));
  };

  const fetchOnload = async () => {
    let AllDResult = await FetchDropDowns();
    if (AllDResult) {
      setAllDropDowns(AllDResult);
    }

    let AccResult = await ModalAccSiteReps();
    // let AccResult = await ModalAccReps();
    let AccreptList = await SiteRepsDropDown();
    let AccountContactList = await ContactList(accountId);
    let AccountContectRepList = await SiteContactRepList();
    let AssignContectRepListData = [];// await AssignedSiteContactList(accountId);

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
      setTechniciansData(RepList);
    }

    let CheckContactList = [];
    if (AccountContectRepList) {
      let RepList = [];

      for (let index = 0; index < AccountContectRepList.length; index++) {
        const RepElement = AccountContectRepList[index];
        let obj = { ...RepElement, id: "" };
        let findPPrimaryId = AssignContectRepListData
          ? AssignContectRepListData.find(
            (e) =>
              e.position_id === RepElement.position_id && e.is_primary != 0
          )
          : "";
        let findPBackupId = AssignContectRepListData
          ? AssignContectRepListData.find(
            (e) =>
              e.position_id === RepElement.position_id && e.is_backup != 0
          )
          : "";

        obj.backup = { id: "", val: "", permissions: [] };
        obj.primary = { id: "", val: "", permissions: [] };
        obj.contact_id = obj.contact_id;

        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }
        if (findPPrimaryId) {
          obj.id = findPPrimaryId?.id;
          let GetVal = AccountContactList.find(
            (e) =>
              e.contact_id === findPPrimaryId.contact_id &&
              findPPrimaryId.is_primary != 0
          );
          if (GetVal) {
            CheckContactList.push(GetVal.contact_id);
          }
          let parr = findPPrimaryId?.permissions
            ? findPPrimaryId?.permissions.split(",")
            : [];
          obj.primary = {
            e_id: findPPrimaryId.id,
            id: findPPrimaryId.contact_id,
            val: GetVal?.contact_name,
            permissions: parr,
          };
          obj.primary.permissions = obj.primary.permissions.filter(onlyUnique);
        }

        if (findPBackupId) {
          obj.id = findPBackupId?.id;
          let GetVal = AccountContactList.find(
            (e) =>
              e.contact_id === findPBackupId.contact_id &&
              findPBackupId.is_backup != 0
          );
          CheckContactList.push(GetVal.contact_id);
          let parr = findPBackupId.permissions
            ? findPBackupId.permissions.split(",")
            : [];
          obj.backup = {
            e_id: findPBackupId.id,
            id: findPBackupId.contact_id,
            val: GetVal.contact_name,
            permissions: parr,
          };
          obj.backup.permissions = obj.backup.permissions.filter(onlyUnique);
        }

        RepList.push(obj);
      }
      setContactRepsList(RepList);
    }

    if (AccountContactList) {
      let List = [];
      for (let index = 0; index < AccountContactList.length; index++) {
        const AccEle = AccountContactList[index];
        let obj = { ...AccEle };
        let FindData = CheckContactList.find((e) => e === obj.contact_id);

        obj.backup = { id: "", val: "", permissions: [] };
        obj.primary = { id: "", val: "", permissions: [] };
        obj.contact_id = obj.contact_id;

        if (FindData) {
          obj.is_selected = false;
        } else {
          obj.is_selected = false;
        }
        List.push(obj);
      }
      const activeList = List.filter(item => item.status === 1)
      setContactReps(activeList);
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

  useEffect(() => {
    fetchOnload();
  }, []);

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

  const handleInputChange = (e) => {
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

    if (e.target.type == "checkbox") {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.checked }));
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
    }
  };

  const setUpSiteName = (formData) => {
    if (formData?.generate_name_toggle) {
      let siteName =
        formData?.account_site_state_abbreviation +
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
  }, [formData?.generate_name_toggle]);

  const timeIcon = () => {
    return <img src="/icon-time.png" alt="time-icon" />;
  };

  const handleCheckBox = (e) => {
    if (e.target.type == "checkbox") {
      setFormData((old) => ({
        ...old,
        [e.target.name]: e.target.checked ? 1 : 0,
      }));
    } else if (e.target.type == "button") {
      setFormData((old) => ({
        ...old,
        [e.target.name]: e.target.value == 0 ? 1 : 0,
      }));
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
    }
  };

  const handleTimeChanges = (event, fieldName) => {
    const newTimeValue = event.target.value;
    setFormData({
      ...formData,
      [fieldName]: newTimeValue,
    });
  };


  // Site Poc

  const [altTrainerForm1Site, setAltTrainerForm1Site] = useState([
    // {
    //   phone_number: "",
    //   ext: "",
    //   phone_type_id: 0,
    //   main: 0,
    // },
    {
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: '0',
      account_main_contact_phone_main: 0,
    },
  ]);

  const [altTrainerForm1Billing, setAltTrainerForm1Billing] = useState([
    // {
    //   phone_number: "",
    //   ext: "",
    //   phone_type_id: 0,
    //   main: 0,
    // },
    {
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: '',
      account_main_contact_phone_main: 0,
    },
  ]);

  const [altTrainerForm1Shipping, setAltTrainerForm1Shipping] = useState([
    // {
    //   phone_number: "",
    //   ext: "",
    //   phone_type_id: 0,
    //   main: 0,
    // }, 
    {
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: '',
      account_main_contact_phone_main: 0,
    },
  ]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      site_contact_phone: altTrainerForm1Site,
    }));
  }, [altTrainerForm1Site]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      billing_contact_phone: altTrainerForm1Billing,
    }));
  }, [altTrainerForm1Billing]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      shipping_contact_phone: altTrainerForm1Shipping,
    }));
  }, [altTrainerForm1Shipping]);

  const increaseAlternative1 = (section) => {
    let arr;
    // let arr = [...altTrainerForm1];
    if (section === "site") {
      arr = [...altTrainerForm1Site];
    }
    if (section === "billing") {
      arr = [...altTrainerForm1Billing];
    }
    if (section === "shipping") {
      arr = [...altTrainerForm1Shipping];
    }
    let obj = {
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: '',
      account_main_contact_phone_main: 0,
    };
    arr.push(obj);
    // setAltTrainerForm1(arr);
    if (section === "site") {
      setAltTrainerForm1Site(arr);
    }
    if (section === "billing") {
      setAltTrainerForm1Billing(arr);
    }
    if (section === "shipping") {
      setAltTrainerForm1Shipping(arr);
    }
  };

  const decreaseAlternative1 = (section, index1) => {
    let arr;
    // let arr = [...altTrainerForm1];
    if (section === "site") {
      arr = [...altTrainerForm1Site];
    }
    if (section === "billing") {
      arr = [...altTrainerForm1Billing];
    }
    if (section === "shipping") {
      arr = [...altTrainerForm1Shipping];
    }

    // if (altTrainerForm1.length > 1) {
    //   arr.pop();
    //   setAltTrainerForm1(arr);
    // }

    if (section === "site" && altTrainerForm1Site.length > 1 && index1 >= 0) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setAltTrainerForm1Site(updateArr);
    }
    if (section === "billing" && altTrainerForm1Billing.length > 1 && index1 >= 0) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setAltTrainerForm1Billing(updateArr);
    }
    if (section === "shipping" && altTrainerForm1Shipping.length > 1 && index1 >= 0) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setAltTrainerForm1Shipping(updateArr);
    }
  };

  const [multiEmailFormCountSite, setMultiEmailFormCountSite] = useState([
    // {
    //   email: "",
    //   email_type: "0",
    //   main: 0,
    // },
    {
      account_main_contact_email: "",
      email_type_id: "0",
      account_main_contact_email_main: 0,
    },
  ]);

  const [multiEmailFormCountBilling, setMultiEmailFormCountBilling] = useState([
    // {
    //   email: "",
    //   email_type: "0",
    //   main: 0,
    // },
    {
      account_main_contact_email: "",
      email_type_id: "0",
      account_main_contact_email_main: 0,
    }
  ]);

  const [multiEmailFormCountShipping, setMultiEmailFormCountShipping] =
    useState([
      // {
      //   email: "",
      //   email_type: "0",
      //   main: 0,
      // },
      {
        account_main_contact_email: "",
        email_type_id: "0",
        account_main_contact_email_main: 0,
      }
    ]);

  const MultiEmailFormIncrease = (section) => {
    let arr;
    // let arr = [...multiEmailFormCount];
    if (section === "site") {
      arr = [...multiEmailFormCountSite];
    }
    if (section === "billing") {
      arr = [...multiEmailFormCountBilling];
    }
    if (section === "shipping") {
      arr = [...multiEmailFormCountShipping];
    }
    let obj = {
      account_main_contact_email: "",
      email_type_id: "0",
      account_main_contact_email_main: 0,
    };
    arr.push(obj);
    // setMultiEmailFormCount(arr);
    if (section === "site") {
      setMultiEmailFormCountSite(arr);
    }
    if (section === "billing") {
      setMultiEmailFormCountBilling(arr);
    }
    if (section === "shipping") {
      setMultiEmailFormCountShipping(arr);
    }
  };

  const MultiEmailFormDecrease = (section, index1) => {
    let arr;
    if (section === "site") {
      arr = [...multiEmailFormCountSite];
    }
    if (section === "billing") {
      arr = [...multiEmailFormCountBilling];
    }
    if (section === "shipping") {
      arr = [...multiEmailFormCountShipping];
    }

    if (section === "site" && multiEmailFormCountSite.length > 1 && index1 >= 0) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setMultiEmailFormCountSite(updateArr);
    }
    if (section === "billing" && multiEmailFormCountBilling.length > 1 && index1 >= 0) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setMultiEmailFormCountBilling(updateArr);
    }
    if (section === "shipping" && multiEmailFormCountShipping.length > 1 && index1 >= 0) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setMultiEmailFormCountShipping(updateArr);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      site_contact_email: multiEmailFormCountSite,
    }));
  }, [multiEmailFormCountSite]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      billing_contact_email: multiEmailFormCountBilling,
    }));
  }, [multiEmailFormCountBilling]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      shipping_contact_email: multiEmailFormCountShipping,
    }));
  }, [multiEmailFormCountShipping]);

  // for phone validations
  const [phoneValidations, setPhoneValidations] = useState({
    account_site_phone: false,
    account_billing_info_billing_phone: false,
    account_shipping_info_shipping_phone: false,
    account_main_contact_phone: false,
  });

  const [subFormPhoneValidated, setSubFormPhoneValidated] =
    React.useState(false);

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

  const [trainingPhoneValidations, setTrainingPhoneValidations] =
    useState(false);

  const checkTrueMainMailArr = (arr) => {
    let result = 0;
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (element.account_main_contact_email_main == 1) {
        result = 1;
      }
    }
    return result;
  }

    const checkTrueMainPhoneArr = (arr) => {
      let result = 0;
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element.account_main_contact_phone_main == 1) {
          result = 1;
        }
      }
    
    return result;
  }

  const [formSubmitting, setFormSubmitting] = useState('');
  const [saveFormData, setSaveFormData] = useState(true);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const form = e?.currentTarget;
    if (form?.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const checkMail = checkTrueMainMailArr(formData?.site_contact_email);
    const sitecheckPhone = checkTrueMainPhoneArr(formData?.site_contact_phone);

    // For account contact phone
    let siteContactPhoneData = [];
    if (formData?.site_contact_phone?.length === 1) {
     if(formData?.site_contact_phone[0].account_main_contact_phone != "" || undefined){
      siteContactPhoneData.push({
        account_main_contact_phone: formData?.site_contact_phone[0].account_main_contact_phone,
        phone_type_id: formData?.site_contact_phone[0]?.phone_type_id,
        account_main_contact_phone_ext: formData?.site_contact_phone[0].account_main_contact_phone_ext,
        account_main_contact_phone_main: 1,
      })
      setAltTrainerForm1Site((oldMultiPhoneFormCount) => [
        {
          ...oldMultiPhoneFormCount[0],
          account_main_contact_phone_main: 1
        }
      ]);
    }
    }
      else if (checkTrueMainPhoneArr(formData?.site_contact_phone) === 0) {
      setOpenPhoneModal(true)
      setModalPhoneType(altTrainerForm1Site)
      setPhoneObjName('site_contact_phone')
      setPhoneModalTitle('Set Site POC Contact Phone')
      setFormSubmitting(false)
      setSaveFormData(false);
      return
    }

    const billingcheckPhone = checkTrueMainPhoneArr(formData?.billing_contact_phone);
    let billingContactPhoneData = [];
    if (formData?.billing_contact_phone?.length === 1) {
      if(formData?.billing_contact_phone[0].account_main_contact_phone != "" || undefined){
        billingContactPhoneData.push({
          account_main_contact_phone: formData?.billing_contact_phone[0].account_main_contact_phone,
          phone_type_id: formData?.billing_contact_phone[0]?.phone_type_id,
          account_main_contact_phone_ext: formData?.billing_contact_phone[0].account_main_contact_phone_ext,
          account_main_contact_phone_main: 1,
        })
        setAltTrainerForm1Billing((oldMultiPhoneFormCount) => [
        {
          ...oldMultiPhoneFormCount[0],
          account_main_contact_phone_main: 1
        }
      ]);
    }
    }
      else if (checkTrueMainPhoneArr(formData?.billing_contact_phone) === 0) {
      setOpenPhoneModal(true)
      setModalPhoneType(altTrainerForm1Billing)
      setPhoneObjName('billing_contact_phone')
      setPhoneModalTitle('Set Billing Contact Phone')
      setFormSubmitting(false)
      setSaveFormData(false);
      return
    }
    const shippingcheckPhone = checkTrueMainPhoneArr(formData?.shipping_contact_phone);
    let shippingContactPhoneData = [];
    if (formData?.shipping_contact_phone?.length === 1) {
      if(formData?.shipping_contact_phone[0].account_main_contact_phone != "" || undefined){ 
        shippingContactPhoneData.push({
          account_main_contact_phone: formData?.shipping_contact_phone[0].account_main_contact_phone,
          phone_type_id: formData?.shipping_contact_phone[0]?.phone_type_id,
          account_main_contact_phone_ext: formData?.shipping_contact_phone[0].account_main_contact_phone_ext,
          account_main_contact_phone_main: 1,
        })

        setAltTrainerForm1Billing((oldMultiPhoneFormCount) => [
        {
          ...oldMultiPhoneFormCount[0],
          account_main_contact_phone_main: 1
        }
      ]);
    }
    }
    // else if (shippingcheckPhone === 0) {
      else if (checkTrueMainPhoneArr(formData?.shipping_contact_phone) === 0) {
      setOpenPhoneModal(true)
      setModalPhoneType(altTrainerForm1Shipping)
      setPhoneObjName('shipping_contact_phone')
      setPhoneModalTitle('Set Shipping Contact Phone')
      setFormSubmitting(false)
      setSaveFormData(false);
      return
    }
    // For Email Main -
    const sitecheckMail = checkTrueMainMailArr(formData?.site_contact_email);

     // For site contact mail
     let siteContactEmailData = [];
     if (formData?.site_contact_email?.length === 1) {
      if (formData?.site_contact_email[0]?.account_main_contact_email) {
        siteContactEmailData.push({
          account_main_contact_email: formData?.site_contact_email[0]?.account_main_contact_email,
          email_type_id: formData?.site_contact_email[0]?.email_type_id,
          account_main_contact_email_main: 1,
        });
          
        setMultiEmailFormCountSite((oldMultiEmailFormCount) => [
          {
            ...oldMultiEmailFormCount[0],
            account_main_contact_email_main: 1
          }
        ]);
      }
    }
    else if (checkTrueMainMailArr(formData?.site_contact_email) === 0) {
      setOpenMailModal(true)
      setModalMailType(multiEmailFormCountSite)
      setMailObjName('site_contact_email')
      setMailModalTitle('Set Site POC Contact Email')
      setFormSubmitting(false)
      setSaveFormData(false);
      return
    }

    const billingCheckMail = checkTrueMainMailArr(formData?.billing_contact_email);
    
    // For billing contact mail
    let billingContactEmailData = [];
    if (formData?.billing_contact_email?.length === 1) {
     if(formData?.billing_contact_email[0].account_main_contact_email != "" || undefined){
      billingContactEmailData.push({
        account_main_contact_email: formData?.billing_contact_email[0]?.account_main_contact_email,
        email_type_id: formData?.billing_contact_email[0]?.email_type_id,
        account_main_contact_email_main: 1,
      })

      setMultiEmailFormCountBilling((oldMultiEmailFormCount) => [
       {
         ...oldMultiEmailFormCount[0],
         account_main_contact_email_main: 1
       }
     ]);
    }
   }
   else if (checkTrueMainMailArr(formData?.billing_contact_email) === 0) {
     setOpenMailModal(true)
     setModalMailType(multiEmailFormCountBilling)
     setMailObjName('billing_contact_email')
     setMailModalTitle('Set Billing Contact Email')
     setFormSubmitting(false)
     setSaveFormData(false);
     return
   }

   const shippingcheckMail = checkTrueMainMailArr(formData?.shipping_contact_email);
    
   // For shipping contact mail
   let shippingContactEmailData = [];
   if (formData?.shipping_contact_email?.length === 1) {
     if(formData?.shipping_contact_email[0].account_main_contact_email != "" || undefined){
      shippingContactEmailData.push({
        account_main_contact_email: formData?.shipping_contact_email[0]?.account_main_contact_email,
        email_type_id: formData?.shipping_contact_email[0]?.email_type_id,
        account_main_contact_email_main: 1,
      })

      setMultiEmailFormCountShipping((oldMultiEmailFormCount) => [
      {
        ...oldMultiEmailFormCount[0],
        account_main_contact_email_main: 1
      } 
    ]);
  }
  }
  else if (checkTrueMainMailArr(formData?.shipping_contact_email) === 0) {
    setOpenMailModal(true)
    setModalMailType(multiEmailFormCountShipping)
    setMailObjName('shipping_contact_email')
    setMailModalTitle('Set Shipping Contact Email')
    setFormSubmitting(false)
    setSaveFormData(false);
    return
  }
  let techRepsValueArray = [];
  if(formData?.technicians?.primary !== 0){
    techRepsValueArray.push({id: "", position_id: 13, contact_id: formData.technicians.primary, is_primary: 1, is_backup: 0, set_order: 1})
  }
  if(formData?.technicians?.backup !== 0){
    techRepsValueArray.push({id: "", position_id: 13, contact_id: formData.technicians.backup, is_primary: 0, is_backup: 1, set_order: 2})
  }

    const payload = {
      account_id: accountId,
      site_details: {
        account_site_name: formData?.account_site_name,
        account_site_phone: formData?.account_site_phone,
        account_site_phone_ext: formData?.account_site_info_phone_ext,
        account_site_call_ahead: formData?.call_ahead,
        account_site_status_id: formData?.account_site_status_id,
        account_site_address1: formData?.account_site_address1,
        account_site_address2: formData?.account_site_address2,
        building_name: formData?.building_name,
        account_site_city: formData?.account_site_city,
        account_site_state: formData?.account_site_state,
        account_site_country: formData?.account_site_country,
        account_site_zipcode: formData?.account_site_zipcode,
        generate_name_toggle: formData?.generate_name_toggle,
        invoice_asap: formData?.invoice_asap,
        call_ahead: formData?.call_ahead,
        out_of_area: formData?.out_of_area,
        security_clearance: formData?.security_clearance,
        requires_escort: formData?.requires_escort,
        site_poc: formData?.site_poc,
        site_hours: formData?.site_hours,
        same_billing_address: formData?.same_billing_address,
        same_shipping_address: formData?.same_shipping_address,
        billing_contact: formData?.billing_contact,
        shipping_contact: formData?.shipping_contact,
        alternate_training: formData?.alternate_training,
      },
      site_contact: {
        account_main_contact_salutation: formData?.site_contact_salutation,
        account_main_contact_firstname: formData?.site_contact_firstname,
        account_main_contact_middlename: formData?.site_contact_middlename,
        account_main_contact_lastname: formData?.site_contact_lastname,
        account_main_contact_suffix: formData?.site_contact_suffix,
        account_main_contact_title: formData?.site_contact_title,
        account_main_contact_department: formData?.site_contact_department,
        account_main_contact_status: formData?.site_contact_status,
      },
      site_contact_phone: siteContactPhoneData.length > 0 ? siteContactPhoneData : formData?.site_contact_phone,
      site_contact_email: siteContactEmailData.length > 0 ? siteContactEmailData : formData?.site_contact_email,

      // siteHoursData: {
      //   sundayopen: formData?.sundayopen != "" ? (open?.sundayopen === 0 ? formData?.sundayopen : "closed") : "",
      //   mondayopen: formData?.mondayopen != "" ? (open?.mondayopen === 0 ? formData?.mondayopen : "closed") : "",
      //   tuesdayopen: formData?.tuesdayopen != "" ? (open?.tuesdayopen === 0 ? formData?.tuesdayopen : "closed") : "",
      //   wednesdayopen: formData?.wednesdayopen != "" ? (open?.wednesdayopen === 0 ? formData?.wednesdayopen : "closed") : "",
      //   thrusdayopen: formData?.thursdayopen != "" ? (open?.thursdayopen === 0 ? formData?.thursdayopen : "closed") : "",
      //   fridayopen: formData?.fridayopen != "" ? (open?.fridayopen === 0 ? formData?.fridayopen : "closed") : "",
      //   saturdayopen: formData?.saturdayopen != "" ? (open?.saturdayopen === 0 ? formData?.saturdayopen : "closed") : "",
      //   sundayclosed: formData?.sundayclose != "" ? (open?.sundayopen === 0 ? formData?.sundayclose : "closed") : "",
      //   mondayclosed: formData?.mondayclose != "" ? (open?.mondayopen === 0 ? formData?.mondayclose : "closed") : "",
      //   tuesdayclosed: formData?.tuesdayclose != "" ? (open?.tuesdayopen === 0 ? formData?.tuesdayclose : "closed") : "",
      //   wednesdayclosed:
      //   formData?.wednesdayclose != "" ? (open?.wednesdayopen === 0 ? formData?.wednesdayclose : "closed") : "",
      //   thrusdayclosed: formData?.thursdayclose != "" ? (open?.thursdayopen === 0 ? formData?.thursdayclose : "closed") : "",
      //   fridayclosed: formData?.fridayclose != "" ? (open?.fridayopen === 0 ? formData?.fridayclose : "closed") : "",
      //   saturdayclosed: formData?.saturdayclose != "" ? (open?.saturdayopen === 0 ? formData?.saturdayclose : "closed") : "",
      // },

      siteHoursData: {
        sundayopen: open?.sundayopen === 0 ? formData?.sundayopen : "closed",
        mondayopen: open?.mondayopen === 0 ? formData?.mondayopen : "closed",
        tuesdayopen: open?.tuesdayopen === 0 ? formData?.tuesdayopen : "closed",
        wednesdayopen:
          open?.wednesdayopen === 0 ? formData?.wednesdayopen : "closed",
        thrusdayopen:
          open?.thursdayopen === 0 ? formData?.thursdayopen : "closed",
        fridayopen: open?.fridayopen === 0 ? formData?.fridayopen : "closed",
        saturdayopen:
          open?.saturdayopen === 0 ? formData?.saturdayopen : "closed",
        sundayclosed: open?.sundayopen === 0 ? formData?.sundayclose : "closed",
        mondayclosed: open?.mondayopen === 0 ? formData?.mondayclose : "closed",
        tuesdayclosed:
          open?.tuesdayopen === 0 ? formData?.tuesdayclose : "closed",
        wednesdayclosed:
          open?.wednesdayopen === 0 ? formData?.wednesdayclose : "closed",
        thrusdayclosed:
          open?.thursdayopen === 0 ? formData?.thursdayclose : "closed",
        fridayclosed: open?.fridayopen === 0 ? formData?.fridayclose : "closed",
        saturdayclosed:
          open?.saturdayopen === 0 ? formData?.saturdayclose : "closed",
      },

      billing_details: {
        account_billing_info_address1: formData?.account_billing_info_address1,
        account_billing_info_address2: formData?.account_billing_info_address2,
        account_billing_info_city: formData?.account_billing_info_city,
        account_billing_info_state: formData?.account_billing_info_state,
        account_billing_info_country: formData?.account_billing_info_country,
        account_billing_info_zipcode: formData?.account_billing_info_zipcode,
      },

      billing_contact: {
        account_main_contact_salutation: formData?.billing_contact_salutation,
        account_main_contact_firstname: formData?.billing_contact_firstname,
        account_main_contact_middlename: formData?.billing_contact_middlename,
        account_main_contact_lastname: formData?.billing_contact_lastname,
        account_main_contact_suffix: formData?.billing_contact_suffix,
        account_main_contact_title: formData?.billing_contact_title,
        account_main_contact_department: formData?.billing_contact_department,
        account_main_contact_status: formData?.billing_contact_status,
      },
      billing_contact_phone: billingContactPhoneData.length > 0 ? billingContactPhoneData : formData?.billing_contact_phone,
      billing_contact_email: billingContactEmailData.length > 0 ? billingContactEmailData : formData?.billing_contact_email,

      shipping_details: {
        account_shipping_info_address1:
          formData?.account_shipping_info_address1,
        account_shipping_info_address2:
          formData?.account_shipping_info_address2,
        account_shipping_info_city: formData?.account_shipping_info_city,
        account_shipping_info_state: formData?.account_shipping_info_state,
        account_shipping_info_country: formData?.account_shipping_info_country,
        account_shipping_info_zipcode: formData?.account_shipping_info_zipcode,
      },

      shipping_contact: {
        account_main_contact_salutation: formData?.shipping_contact_salutation,
        account_main_contact_firstname: formData?.shipping_contact_firstname,
        account_main_contact_middlename: formData?.shipping_contact_middlename,
        account_main_contact_lastname: formData?.shipping_contact_lastname,
        account_main_contact_suffix: formData?.shipping_contact_suffix,
        account_main_contact_title: formData?.shipping_contact_title,
        account_main_contact_department: formData?.shipping_contact_department,
        account_main_contact_status: formData?.shipping_contact_status,
      },
      shipping_contact_phone: shippingContactPhoneData.length > 0 ? shippingContactPhoneData : formData?.shipping_contact_phone,
      shipping_contact_email: shippingContactEmailData.length > 0 ? shippingContactEmailData : formData?.shipping_contact_email,

      traininglocation: traininglocation,
      // site_reps: adminAccountModelData ? adminAccountModelData : "",
      site_reps: techRepsValueArray,
      contact_reps: adminContactModelData?.site_contact
        ? adminContactModelData?.site_contact
        : "",
    };

    setFinalPayload(payload);
    setFormSubmitting(true);
    setSaveFormData(true);

  };

  const saveForm = async () => {
    setLoading(true);
    setFormSubmitting('');
    setSaveFormData('');
    const res = await CallPOSTAPI("admin/add-new-site", finalPayload);
    if (res?.data?.status) {
      toast.success(res?.data?.msg);
      let pathUrl = "";
      if(user?.user_type == 3){
        pathUrl = "/user/Sites/" + accountId;
      } else {
        pathUrl = "/account-details/" + accountId;
      }
      navigate(pathUrl, {
        state: {
          tab: "Sites",
          type: res?.data?.status,
          msg: res?.data?.msg,
        },
      });
      setFormData("");
    } else {
      toast.error(res?.data?.msg);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (formSubmitting && !openMailModal && !openPhoneModal && saveFormData) {
      saveForm();
    } 
    else if(formSubmitting === false && saveFormData === false) {
      handleSubmit();
    }
  }, [formSubmitting, openMailModal, openPhoneModal, saveFormData]);

  const disabledStyles = {
    opacity: 0.5,
    border: 'none',
  };

  const [isGenerateBtn, setIsGenerateBtn] = useState(true)

  useEffect(() => {
    if (
      !formData?.account_site_state_abbreviation &&
      !formData?.account_site_address1 &&
      !formData?.account_site_city &&
      !formData?.account_site_address2 &&
      !formData?.building_name &&
      !formData?.account_site_zipcode
    ) {
      setIsGenerateBtn(false)
    }
    else {
      setIsGenerateBtn(true)
    }
  }, [formData])

  let stateAbbr = formData?.account_site_state_abbreviation
  let generatedSiteName = (stateAbbr ? stateAbbr + ', ' : '') +
  (formData?.account_site_city ? formData.account_site_city + ' - ' : '') +
    formData?.account_site_address1 + 
    (formData?.building_name ? ' / ' + formData?.building_name : "");

  const handleGenerateSiteName = (e, type, name) => {
    if (!formData?.account_site_name) {
      setFormData({ ...formData, account_site_name: generatedSiteName })
    }
    else if (formData?.account_site_name && !formData?.account_site_name.includes(stateAbbr)) {
      setFormData({ ...formData, account_site_name: generatedSiteName })
    }
    else {
      setFormData({ ...formData, account_site_name: generatedSiteName })
    }
  }

  const handleTechniciansPrimarySelectChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      technicians: {
        ...prevFormData.technicians,
        primary: selectedId
      },
    }));
  };

  const handleTechniciansBackupSelectChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      technicians: {
        ...prevFormData.technicians,
        backup: selectedId
      },
    }));
  };

  return (
    <>
      <div className="mt-4" style={{ paddingInline: "45px" }}>
        <SubHeadingOther
          hideNew="tab"
          title="New Site"
          subHeading={true}
          hideHierarchy={true}
          bottomLinks={false}
        />

        {/* account resps and products popup buttons */}
        <div className="d-flex" >
          <button
            className="btn text-primary"
            type="button"
            onClick={() => setContactShowModel(true)}
            disabled={formData?.site_poc == 1 ||
              formData?.billing_contact == 1 ||
              formData?.shipping_contact == 1
            }
            style={(formData?.site_poc == 1 ||
              formData?.billing_contact == 1 ||
              formData?.shipping_contact == 1) ? disabledStyles : null}
          >
            <img src={Contacts} alt="svg" style={{ marginRight: "1px" }} />
            <span className="ms-2">Contacts</span>
          </button>

          {/*<button
            className="btn text-primary"
            type="button"
            onClick={() => setShowAccRepsModal(true)}
          >
            <img src="/reps.svg" alt="svg" style={{ marginRight: "1px" }} />
            <span className="ms-2">Reps</span>
          </button>*/}
        </div>

        {/* main form */}
        <Form
          className=""
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
          id="create-new-account-form"
        >
          {/* Site Infornation */}
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
                  value={formData?.account_site_address1}
                  onChange={handleInputChange}
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
                  value={formData?.account_site_address2}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className={"col"}>
                <Form.Label>Building Name</Form.Label>
                <Form.Control
                  type="text"
                  name="building_name"
                  value={formData?.building_name}
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
                  value={formData?.account_site_city}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter City.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className={"col relative"}>
                <Form.Label>State *</Form.Label>

                <StateField
                  setFormData={setFormData}
                  valueKey="account_site_state"
                  selectedCountry={selectedCountry?.account_site_country?.value}
                  validated={validated}
                  required={true}
                  stateSelectedValue={formData?.account_site_state}
                  setStateAbreaviation={setFormData}
                  setIsGenerateBtn={setIsGenerateBtn}
                  isGenerateBtn={isGenerateBtn}
                />
              </Form.Group>

              <Form.Group className={"col"}>
                <Form.Label>Zip code *</Form.Label>
                <Form.Control
                  type="text"
                  name="account_site_zipcode"
                  value={formData?.account_site_zipcode}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter Zip Code.
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="row my-4">
              {/* <div className="my-2 d-flex gap-2 align-items-center"> */}
              <div className="col" style={{ maxWidth: "130px" }}>
              
                {/* <b className={"d-block mb-2"}>Generate Name</b> */}
                {/* <button
                  className="btn ms-2"
                  type="button"
                  style={{
                    background: "#0C71C3",
                    color: "white",
                    width: "120px",
                  }}
                  name="generate_name_toggle"
                  value={formData?.generate_name_toggle}
                  onClick={(e) => handleCheckBox(e)}
                  disabled={formData?.account_site_state_abbreviation == "" &&
                  formData?.account_site_city == "" && 
                  formData?.account_site_address1 == "" &&
                  formData?.building_name == "" &&
                  formData?.account_site_name == ""
                }
                >
                  Generate
                </button> */}
                <div className="my-4">
                  <BButton
                    disabled={!isGenerateBtn}
                    onClick={(e) => handleGenerateSiteName(e, 'site_details', 'generate_name_toggle')}
                    variant="primary" type="button">
                    Generate
                  </BButton>
                </div>
              </div>

              <Form.Group className={"col"}>
                <Form.Label>Site Name*</Form.Label>
                <Form.Control
                  type="text"
                  name="account_site_name"
                  value={formData?.account_site_name}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter Site Name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={"col"}>
                <Form.Label>Site Phone</Form.Label>
                <Form.Control
                  type="number"
                  name="account_site_phone"
                  minLength="10"
                  maxLength="10"
                  // required
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className={
                    phoneValidations.account_site_phone
                      ? "phone-invalid-input"
                      : ""
                  }
                />

                {phoneValidations.account_site_phone ? (
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
                  name="account_site_info_phone_ext"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                />
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
              {/* </div> */}
            </div>

            <div className="row my-2">
              <div className="col" style={{ maxWidth: "120px" }}>
                <Form.Group>
                  <b className={"d-block mb-3"}>Invoice ASAP</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="invoice_asap"
                      ToggleValue={formData?.invoice_asap}
                      changeHandler={handleCheckBox}
                    //   is_read_only={
                    //     !(
                    //       Permissins?.has_pedpak ||
                    //       Permissins?.has_ped_pad ||
                    //       Permissins?.has_ped_key
                    //     )
                    //   }
                    // is_read_only={(Permissins?.has_pedpak===0) ? 1 : 0}
                    />
                  </div>
                </Form.Group>
              </div>

              <div
                className="col"
                style={{ maxWidth: "100px", marginRight: "2%" }}
              >
                <Form.Group>
                  <b className={"d-block mb-3"}>Call Ahead</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="call_ahead"
                      ToggleValue={formData?.call_ahead}
                      changeHandler={handleCheckBox}
                    //   is_read_only={
                    //     !(
                    //       Permissins?.has_pedpak ||
                    //       Permissins?.has_ped_pad ||
                    //       Permissins?.has_ped_key
                    //     )
                    //   }
                    // is_read_only={(Permissins?.has_pedpak===0) ? 1 : 0}
                    />
                  </div>
                </Form.Group>
              </div>

              <div
                className="col"
                style={{ maxWidth: "100px", marginRight: "2%" }}
              >
                <Form.Group>
                  <b className={"d-block mb-3"}>Out of Area</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="out_of_area"
                      ToggleValue={formData?.out_of_area}
                      changeHandler={handleCheckBox}
                    //   is_read_only={
                    //     !(
                    //       Permissins?.has_pedpak ||
                    //       Permissins?.has_ped_pad ||
                    //       Permissins?.has_ped_key
                    //     )
                    //   }
                    // is_read_only={(Permissins?.has_pedpak===0) ? 1 : 0}
                    />
                  </div>
                </Form.Group>
              </div>

              <div className="col" style={{ maxWidth: "140px" }}>
                <Form.Group>
                  <b className={"d-block mb-3"}>Security Clearence</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="security_clearance"
                      ToggleValue={formData?.security_clearance}
                      changeHandler={handleCheckBox}
                    //   is_read_only={
                    //     !(
                    //       Permissins?.has_pedpak ||
                    //       Permissins?.has_ped_pad ||
                    //       Permissins?.has_ped_key
                    //     )
                    //   }
                    // is_read_only={(Permissins?.has_pedpak===0) ? 1 : 0}
                    />
                  </div>
                </Form.Group>
              </div>

              <div className="col" style={{ maxWidth: "140px" }}>
                <Form.Group>
                  <b className={"d-block mb-3"}>Requires Escort</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="requires_escort"
                      ToggleValue={formData?.requires_escort}
                      changeHandler={handleCheckBox}
                    //   is_read_only={
                    //     !(
                    //       Permissins?.has_pedpak ||
                    //       Permissins?.has_ped_pad ||
                    //       Permissins?.has_ped_key
                    //     )
                    //   }
                    // is_read_only={(Permissins?.has_pedpak===0) ? 1 : 0}
                    />
                  </div>
                </Form.Group>
              </div>
              <div
                className="col"
                style={{ maxWidth: "70px", marginRight: "3%" }}
              >
                <Form.Group>
                  <b className={"d-block mb-3"}>Site POC</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="site_poc"
                      ToggleValue={
                        (formData.site_poc =
                          adminContactModelData?.site_contact &&
                            adminContactModelData.site_contact.some(
                              (item) =>
                                item.contact_id !== "" && item.position_id === 7
                            )
                            ? 0
                            : formData.site_poc)
                      }
                      changeHandler={handleCheckBox}
                      is_read_only={
                        adminContactModelData?.site_contact?.some((item) => {
                          return (
                            item.contact_id !== "" && item.position_id == 7
                          );
                        })
                          ? 1
                          : 0
                      }
                    />
                  </div>
                </Form.Group>
              </div>

              <div
                className="col"
                style={{ maxWidth: "100px", marginRight: "2%" }}
              >
                <Form.Group>
                  <b className={"d-block mb-3"}>Site Hours</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="site_hours"
                      ToggleValue={formData?.site_hours}
                      changeHandler={handleCheckBox}
                    //   is_read_only={
                    //     !(
                    //       Permissins?.has_pedpak ||
                    //       Permissins?.has_ped_pad ||
                    //       Permissins?.has_ped_key
                    //     )
                    //   }
                    // is_read_only={(Permissins?.has_pedpak===0) ? 1 : 0}
                    />
                  </div>
                </Form.Group>
              </div>

              <div className="col" style={{ maxWidth: "110px" }}>
                <Form.Group>
                  <b className={"d-block mb-3"}>Same Billing</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="same_billing_address"
                      ToggleValue={formData?.same_billing_address}
                      changeHandler={handleCheckBox}
                    //   is_read_only={
                    //     !(
                    //       Permissins?.has_pedpak ||
                    //       Permissins?.has_ped_pad ||
                    //       Permissins?.has_ped_key
                    //     )
                    //   }
                    // is_read_only={(Permissins?.has_pedpak===0) ? 1 : 0}
                    />
                  </div>
                </Form.Group>
              </div>

              <div className="col" style={{ maxWidth: "130px" }}>
                <Form.Group>
                  <b className={"d-block mb-3"}>Billing Contact</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="billing_contact"
                      ToggleValue={
                        (formData.billing_contact =
                          adminContactModelData?.site_contact &&
                            adminContactModelData.site_contact.some(
                              (item) =>
                                item.contact_id !== "" && item.position_id === 9
                            )
                            ? 0
                            : formData.billing_contact)
                      }
                      changeHandler={handleCheckBox}
                      is_read_only={
                        adminContactModelData?.site_contact?.some((item) => {
                          return (
                            item.contact_id !== "" && item.position_id == 9
                          );
                        })
                          ? 1
                          : 0
                      }
                    //   is_read_only={
                    //     !(
                    //       Permissins?.has_pedpak ||
                    //       Permissins?.has_ped_pad ||
                    //       Permissins?.has_ped_key
                    //     )
                    //   }
                    // is_read_only={(Permissins?.has_pedpak===0) ? 1 : 0}
                    />
                  </div>
                </Form.Group>
              </div>

              <div className="col" style={{ maxWidth: "130px" }}>
                <Form.Group>
                  <b className={"d-block mb-3"}>Same Shipping</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="same_shipping_address"
                      ToggleValue={formData?.same_shipping_address}
                      changeHandler={handleCheckBox}
                    //   is_read_only={
                    //     !(
                    //       Permissins?.has_pedpak ||
                    //       Permissins?.has_ped_pad ||
                    //       Permissins?.has_ped_key
                    //     )
                    //   }
                    // is_read_only={(Permissins?.has_pedpak===0) ? 1 : 0}
                    />
                  </div>
                </Form.Group>
              </div>

              <div className="col" style={{ maxWidth: "140px" }}>
                <Form.Group>
                  <b className={"d-block mb-3"}>Shipping Contact</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="shipping_contact"
                      ToggleValue={
                        (formData.shipping_contact =
                          adminContactModelData?.site_contact &&
                            adminContactModelData.site_contact.some(
                              (item) =>
                                item.contact_id !== "" && item.position_id === 14
                            )
                            ? 0
                            : formData.shipping_contact)
                      }
                      changeHandler={handleCheckBox}
                      is_read_only={
                        adminContactModelData?.site_contact?.some((item) => {
                          return (
                            item.contact_id !== "" && item.position_id == 14
                          );
                        })
                          ? 1
                          : 0
                      }
                    //   is_read_only={
                    //     !(
                    //       Permissins?.has_pedpak ||
                    //       Permissins?.has_ped_pad ||
                    //       Permissins?.has_ped_key
                    //     )
                    //   }
                    // is_read_only={(Permissins?.has_pedpak===0) ? 1 : 0}
                    />
                  </div>
                </Form.Group>
              </div>

              <div className="col" style={{ maxWidth: "140px" }}>
                <Form.Group>
                  <b className={"d-block mb-3"}>Alternate Training</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="alternate_training"
                      ToggleValue={formData?.alternate_training}
                      changeHandler={handleCheckBox}
                    //   is_read_only={
                    //     !(
                    //       Permissins?.has_pedpak ||
                    //       Permissins?.has_ped_pad ||
                    //       Permissins?.has_ped_key
                    //     )
                    //   }
                    // is_read_only={(Permissins?.has_pedpak===0) ? 1 : 0}
                    />
                  </div>
                </Form.Group>
              </div>
            </div>
          </div>

          {/* Site Contact */}
          {formData?.site_poc === 1 && (
            <>
              <div
                className="container-fluid bottom-border-blue pb-2 pt-2 mt-4"
                style={{ background: "#eee" }}
              >
                <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                  Site Poc
                </h2>
                <div className="row my-4 ">
                  <Form.Group className={"col"}>
                    <Form.Label>Salutation</Form.Label>
                    <Form.Control
                      type="text"
                      name="site_contact_salutation"
                      value={formData?.site_contact_salutation}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="site_contact_firstname"
                      value={formData?.site_contact_firstname}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      // isInvalid={!!formErrors.account_main_contact_firstname}
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
                      name="site_contact_middlename"
                      value={formData?.site_contact_middlename}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="site_contact_lastname"
                      value={formData?.site_contact_lastname}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      // isInvalid={!!formErrors.site_contact_lastname}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please Enter Last Name and do not use any special or
                      numeric character.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Suffix</Form.Label>
                    <Form.Control
                      type="text"
                      name="site_contact_suffix"
                      value={formData?.site_contact_suffix}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="site_contact_title"
                      value={formData?.site_contact_title}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>
                  <Form.Group className={"col"}>
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      name="site_contact_department"
                      value={formData?.site_contact_department}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Contact Status</Form.Label>

                    <Form.Select
                      className={""}
                      name="site_contact_status"
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      value={formData?.site_contact_status}
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
                  altTrainerForm={altTrainerForm1Site}
                  setSubFormData={setAltTrainerForm1Site}
                  increaseAlternative={() => increaseAlternative1("site")}
                  decreaseAlternative={decreaseAlternative1}
                  section={"site"}
                  handleInputChange={(e) => {
                    handleInputChange(e);
                  }}
                  allDropDowns={allDropDowns}
                  formData={formData?.site_contact_phone}
                  formName={"site_contact_phone"}
                  setFormData={setFormData}
                  noBtns={true}
                  setPhoneValidations={setPhoneValidations}
                  phoneValidations={phoneValidations}
                  setSubFormPhoneValidated={setSubFormPhoneValidated}
                  mainRequired={mainRequired}
                  setMainRequired={setMainRequired}
                  type={"SitePoc"}
                />

                <MultiEmailForm
                  altTrainerForm={multiEmailFormCountSite}
                  setSubFormData={setMultiEmailFormCountSite}
                  increaseAlternative={() => MultiEmailFormIncrease("site")}
                  decreaseAlternative={MultiEmailFormDecrease}
                  section={"site"} 
                  handleInputChange={(e) => {
                    handleInputChange(e);
                  }}
                  allDropDowns={allDropDowns}
                  formData={formData?.site_contact_email}
                  formName={"site_contact_email"}
                  setFormData={setFormData}
                />
              </div>
            </>
          )}

          {/* Site Hours */}
          {formData?.site_hours === 1 && (
            <>
              <div
                className="container-fluid bottom-border-blue pb-2 pt-2 mt-4"
                style={{ background: "#eee" }}
              >
                <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                  Site Hours
                </h2>
                <div className="row my-4 ">
                  <Form.Group className={"col"}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Form.Label>Sun Open</Form.Label>
                      <FormControlLabel
                        className={""}
                        label=""
                        title={open?.sundayopen === 1 ? "Open" : "Closed"}
                        control={
                          <Radio
                            color="primary"
                            size="medium"
                            value={open?.sundayopen}
                            checked={open?.sundayopen === 1}
                            onClick={() => handleRadioChange("sundayopen")}
                          />
                        }
                      />
                    </div>
                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.sundayopen}
                        onChange={(e) => handleTimeChanges(e, "sundayopen")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.sundayopen === 1}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Form.Label>Mon Open</Form.Label>
                      <FormControlLabel
                        className={""}
                        label=""
                        title={open?.mondayopen === 1 ? "Open" : "Closed"}
                        control={
                          <Radio
                            color="primary"
                            size="medium"
                            value={open?.mondayopen}
                            checked={open?.mondayopen === 1}
                            onClick={() => handleRadioChange("mondayopen")}
                          />
                        }
                      />
                    </div>
                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.mondayopen}
                        onChange={(e) => handleTimeChanges(e, "mondayopen")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.mondayopen === 1}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Form.Label>Tues Open</Form.Label>
                      <FormControlLabel
                        className={""}
                        label=""
                        title={open?.tuesdayopen === 1 ? "Open" : "Closed"}
                        control={
                          <Radio
                            color="primary"
                            size="medium"
                            value={open?.tuesdayopen}
                            checked={open?.tuesdayopen === 1}
                            onClick={() => handleRadioChange("tuesdayopen")}
                          />
                        }
                      />
                    </div>
                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.tuesdayopen}
                        onChange={(e) => handleTimeChanges(e, "tuesdayopen")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.tuesdayopen === 1}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Form.Label>Wed Open</Form.Label>
                      <FormControlLabel
                        className={""}
                        label=""
                        title={open?.wednesdayopen === 1 ? "Open" : "Closed"}
                        control={
                          <Radio
                            color="primary"
                            size="medium"
                            value={open?.wednesdayopen}
                            checked={open?.wednesdayopen === 1}
                            onClick={() => handleRadioChange("wednesdayopen")}
                          />
                        }
                      />
                    </div>
                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.wednesdayopen}
                        onChange={(e) => handleTimeChanges(e, "wednesdayopen")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.wednesdayopen === 1}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Form.Label>Thurs Open</Form.Label>
                      <FormControlLabel
                        className={""}
                        label=""
                        title={open?.thursdayopen === 1 ? "Open" : "Closed"}
                        control={
                          <Radio
                            color="primary"
                            size="medium"
                            value={open?.thursdayopen}
                            checked={open?.thursdayopen === 1}
                            onClick={() => handleRadioChange("thursdayopen")}
                          />
                        }
                      />
                    </div>
                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.thursdayopen}
                        onChange={(e) => handleTimeChanges(e, "thursdayopen")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.thursdayopen === 1}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Form.Label>Fri Open</Form.Label>
                      <FormControlLabel
                        className={""}
                        label=""
                        title={open?.fridayopen === 1 ? "Open" : "Closed"}
                        control={
                          <Radio
                            color="primary"
                            size="medium"
                            value={open?.fridayopen}
                            checked={open?.fridayopen === 1}
                            onClick={() => handleRadioChange("fridayopen")}
                          />
                        }
                      />
                    </div>
                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.fridayopen}
                        onChange={(e) => handleTimeChanges(e, "fridayopen")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.fridayopen === 1}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Form.Label>Sat Open</Form.Label>
                      <FormControlLabel
                        className={""}
                        label=""
                        title={open?.saturdayopen === 1 ? "Open" : "Closed"}
                        control={
                          <Radio
                            color="primary"
                            size="medium"
                            value={open?.saturdayopen}
                            checked={open?.saturdayopen === 1}
                            onClick={() => handleRadioChange("saturdayopen")}
                          />
                        }
                      />
                    </div>
                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.saturdayopen}
                        onChange={(e) => handleTimeChanges(e, "saturdayopen")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.saturdayopen}
                      />
                    </div>
                  </Form.Group>
                </div>

                <div className="row my-4 ">
                  <Form.Group className={"col"}>
                    <Form.Label>Sun Closed</Form.Label>

                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.sundayclose}
                        onChange={(e) => handleTimeChanges(e, "sundayclose")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.sundayopen === 1}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Mon Closed</Form.Label>

                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.mondayclose}
                        onChange={(e) => handleTimeChanges(e, "mondayclose")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.mondayopen === 1}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Tues Closed</Form.Label>

                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.tuesdayclose}
                        onChange={(e) => handleTimeChanges(e, "tuesdayclose")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.tuesdayopen === 1}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Wed Closed</Form.Label>

                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.wednesdayclose}
                        onChange={(e) => handleTimeChanges(e, "wednesdayclose")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.wednesdayopen === 1}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Thurs Closed</Form.Label>

                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.thursdayclose}
                        onChange={(e) => handleTimeChanges(e, "thursdayclose")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.thursdayopen === 1}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Fri Closed</Form.Label>

                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.fridayclose}
                        onChange={(e) => handleTimeChanges(e, "fridayclose")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.fridayopen === 1}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Sat Closed</Form.Label>

                    <div
                      className={"d-flex align-items-center calendar-input-btn"}
                    >
                      <input
                        type="time"
                        value={formData?.saturdayclose}
                        onChange={(e) => handleTimeChanges(e, "saturdayclose")}
                        dateFormat="HH:mm:ss"
                        placeholderText="HH:mm:ss"
                        disabled={open?.saturdayopen === 1}
                      />
                    </div>
                  </Form.Group>
                </div>
              </div>
            </>
          )}

          {/*Billing Address */}
          {formData?.same_billing_address != 1 && (
            <>
              <div
                className="container-fluid bottom-border-blue mt-4 pt-2 pb-2"
                style={{
                  background: "#eee",
                }}
              >
                <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                  Billing Address
                </h2>
                <div className="row my-4">
                  <Form.Group className={"col"}>
                    <Form.Label>Country</Form.Label>
                    <Select
                      value={selectedCountry?.account_billing_info_country}
                      options={countryList}
                      onChange={(data) => {
                        handleSelectChange(
                          data,
                          "account_billing_info_country"
                        );
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Address*</Form.Label>
                    <Form.Control
                      type="text"
                      name="account_billing_info_address1"
                      value={formData?.account_billing_info_address1}
                      onChange={handleInputChange}
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
                      name="account_billing_info_address2"
                      value={formData?.account_billing_info_address2}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>City*</Form.Label>
                    <Form.Control
                      type="text"
                      name="account_billing_info_city"
                      value={formData?.account_billing_info_city}
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please Enter City.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className={"col relative"}>
                    <Form.Label>State* </Form.Label>

                    <StateField
                      setFormData={setFormData}
                      valueKey="account_billing_info_state"
                      selectedCountry={
                        selectedCountry?.account_billing_info_country?.value
                      }
                      validated={validated}
                      required={true}
                      stateSelectedValue={formData?.account_billing_info_state}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Zip code*</Form.Label>
                    <Form.Control
                      type="text"
                      name="account_billing_info_zipcode"
                      value={formData?.account_billing_info_zipcode}
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please Enter Zip Code.
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
            </>
          )}

          {/* Billing Contact */}
          {formData?.billing_contact === 1 && (
            <>
              <div
                className="container-fluid bottom-border-blue pb-2 pt-2 mt-4"
                style={{ background: "#eee" }}
              >
                <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                  Billing Contact
                </h2>
                <div className="row my-4 ">
                  <Form.Group className={"col"}>
                    <Form.Label>Salutation</Form.Label>
                    <Form.Control
                      type="text"
                      name="billing_contact_salutation"
                      value={formData?.billing_contact_salutation}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="billing_contact_firstname"
                      value={formData?.billing_contact_firstname}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      // isInvalid={!!formErrors.account_main_contact_firstname}
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
                      name="billing_contact_middlename"
                      value={formData?.billing_contact_middlename}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="billing_contact_lastname"
                      value={formData?.billing_contact_lastname}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      // isInvalid={!!formErrors.account_main_contact_lastname}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please Enter Last Name and do not use any special or
                      numeric character.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Suffix</Form.Label>
                    <Form.Control
                      type="text"
                      name="billing_contact_suffix"
                      value={formData?.billing_contact_suffix}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="billing_contact_title"
                      value={formData?.billing_contact_title}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>
                  <Form.Group className={"col"}>
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      name="billing_contact_department"
                      value={formData?.billing_contact_department}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Contact Status</Form.Label>

                    <Form.Select
                      className={""}
                      name="billing_contact_status"
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      value={formData?.billing_contact_status}
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
                  altTrainerForm={altTrainerForm1Billing}
                  setSubFormData={setAltTrainerForm1Billing}
                  increaseAlternative={() => increaseAlternative1("billing")}
                  decreaseAlternative={decreaseAlternative1}
                  section={"billing"}
                  handleInputChange={(e) => {
                    handleInputChange(e);
                  }}
                  allDropDowns={allDropDowns}
                  formData={formData?.billing_contact_phone}
                  formName={"billing_contact_phone"}
                  setFormData={setFormData}
                  noBtns={true}
                  setPhoneValidations={setPhoneValidations}
                  phoneValidations={phoneValidations}
                  setSubFormPhoneValidated={setSubFormPhoneValidated}
                  billingMainRequired={billingMainRequired}
                  setBillingMainRequired={setBillingMainRequired}
                  type={"BillingContact"}
                />

                <MultiEmailForm
                  altTrainerForm={multiEmailFormCountBilling}
                  setSubFormData={setMultiEmailFormCountBilling}
                  increaseAlternative={() => MultiEmailFormIncrease("billing")}
                  decreaseAlternative={MultiEmailFormDecrease}
                  section={"billing"}
                  handleInputChange={(e) => {
                    handleInputChange(e);
                  }}
                  allDropDowns={allDropDowns}
                  formData={formData?.billing_contact_email}
                  formName={"billing_contact_email"}
                  setFormData={setFormData}
                />
              </div>
            </>
          )}

          {/*Shipping Address */}
          {formData?.same_shipping_address != 1 && (
            <>
              <div
                className="container-fluid bottom-border-blue mt-4 pt-2 pb-2"
                style={{
                  background: "#eee",
                }}
              >
                <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                  Shipping Address
                </h2>
                <div className="row my-4">
                  <Form.Group className={"col"}>
                    <Form.Label>Country</Form.Label>
                    <Select
                      value={selectedCountry?.account_shipping_info_country}
                      options={countryList}
                      onChange={(data) => {
                        handleSelectChange(
                          data,
                          "account_shipping_info_country"
                        );
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Address*</Form.Label>
                    <Form.Control
                      type="text"
                      name="account_shipping_info_address1"
                      value={formData?.account_shipping_info_address1}
                      onChange={handleInputChange}
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
                      name="account_shipping_info_address2"
                      value={formData?.account_shipping_info_address2}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>City*</Form.Label>
                    <Form.Control
                      type="text"
                      name="account_shipping_info_city"
                      value={formData?.account_shipping_info_city}
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please Enter City.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className={"col relative"}>
                    <Form.Label>State* </Form.Label>
                    <StateField
                      setFormData={setFormData}
                      valueKey="account_shipping_info_state"
                      selectedCountry={
                        selectedCountry?.account_shipping_info_country?.value
                      }
                      validated={validated}
                      required={true}
                      stateSelectedValue={formData?.account_shipping_info_state}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Zip code*</Form.Label>
                    <Form.Control
                      type="text"
                      name="account_shipping_info_zipcode"
                      value={formData?.account_shipping_info_zipcode}
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please Enter Zip Code.
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
            </>
          )}

          {/* Shipping Contact */}
          {formData?.shipping_contact === 1 && (
            <>
              <div
                className="container-fluid bottom-border-blue pb-2 pt-2 mt-4"
                style={{ background: "#eee" }}
              >
                <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                  Shipping Contact
                </h2>
                <div className="row my-4 ">
                  <Form.Group className={"col"}>
                    <Form.Label>Salutation</Form.Label>
                    <Form.Control
                      type="text"
                      name="shipping_contact_salutation"
                      value={formData?.shipping_contact_salutation}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="shipping_contact_firstname"
                      value={formData?.shipping_contact_firstname}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      // isInvalid={!!formErrors.account_main_contact_firstname}
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
                      name="shipping_contact_middlename"
                      value={formData?.shipping_contact_middlename}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="shipping_contact_lastname"
                      value={formData?.shipping_contact_lastname}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      // isInvalid={!!formErrors.account_main_contact_lastname}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please Enter Last Name and do not use any special or
                      numeric character.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Suffix</Form.Label>
                    <Form.Control
                      type="text"
                      name="shipping_contact_suffix"
                      value={formData?.shipping_contact_suffix}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="shipping_contact_title"
                      value={formData?.shipping_contact_title}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>
                  <Form.Group className={"col"}>
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      name="shipping_contact_department"
                      value={formData?.shipping_contact_department}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Contact Status</Form.Label>

                    <Form.Select
                      className={""}
                      name="shipping_contact_status"
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      value={formData?.shipping_contact_status}
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
                  altTrainerForm={altTrainerForm1Shipping}
                  setSubFormData={setAltTrainerForm1Shipping}
                  increaseAlternative={() => increaseAlternative1("shipping")}
                  decreaseAlternative={decreaseAlternative1}
                  section={"shipping"}
                  handleInputChange={(e) => {
                    handleInputChange(e);
                  }}
                  allDropDowns={allDropDowns}
                  formData={formData?.shipping_contact_phone}
                  formName={"shipping_contact_phone"}
                  setFormData={setFormData}
                  noBtns={true}
                  setPhoneValidations={setPhoneValidations}
                  phoneValidations={phoneValidations}
                  setSubFormPhoneValidated={setSubFormPhoneValidated}
                  shippingMainRequired={shippingMainRequired}
                  setShippingMainRequired={setShippingMainRequired}
                  type={"ShippingContact"}
                />

                <MultiEmailForm
                  altTrainerForm={multiEmailFormCountShipping}
                  setSubFormData={setMultiEmailFormCountShipping}
                  increaseAlternative={() => MultiEmailFormIncrease("shipping")}
                  decreaseAlternative={MultiEmailFormDecrease}
                  section={"shipping"}
                  handleInputChange={(e) => {
                    handleInputChange(e);
                  }}
                  allDropDowns={allDropDowns}
                  formData={formData?.shipping_contact_email}
                  formName={"shipping_contact_email"}
                  setFormData={setFormData}
                />
              </div>
            </>
          )}

          {/*Alternate Training Information */}
          {formData?.alternate_training === 1 && (
            <>
              <div
                className="container-fluid bottom-border-blue mt-4 pt-2 pb-2"
                style={{
                  background: "#eee",
                }}
              >
                <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                  Alternate Training Information
                </h2>

                <div className="row my-4">
                  <div className="col-12">
                    <AdminMultiTrainingFrom
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
                      setValidateField={setValidated}
                      validated={validated}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Technicians */}
            <div
              className="container-fluid bottom-border-blue pb-2 pt-2 mt-4"
              style={{ background: "#eee" }}
            >
                <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                  Technicians
                </h2> 
              <div className="row my-4" style={{width: "40%"}}>
              <Form.Group className={"col"}>
              <Form.Label>Primary</Form.Label>
              <Form.Select
                className={""}
                name="technicians_primary"
                value={formData.technicians.primary}
            onChange={handleTechniciansPrimarySelectChange}
              >
                <option value="0" selected>
                  --Select One--
                </option>
                {techniciansData.map((item, index) => {
                  if(item.account_main_contact_id !== formData.technicians.backup){
                  return (
                    <option
                    value={item.account_main_contact_id}
                    key={index}
                  >
                  {item.account_main_contact_firstname} {item.account_main_contact_lastname}
                  </option>)
                  }
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className={"col"}>
            <Form.Label>Backup</Form.Label>
            <Form.Select
              className={""}
              name="technicians_backup"
              value={formData.technicians.backup}
              onChange={handleTechniciansBackupSelectChange}
            >
              <option value="0" selected>
                --Select One--
              </option>
              {techniciansData.map((item, index) => {
                if(item.account_main_contact_id !== formData.technicians.primary){
                return (
                  <option
                  value={item.account_main_contact_id}
                  key={index}
                >
                {item.account_main_contact_firstname} {item.account_main_contact_lastname}
                </option>)
                }
              })}
            </Form.Select>
          </Form.Group>
          </div>
            </div>

          <div className="row pb-3 py-5">
            <div className="col-12 content-flex-right">
              <button
                className="btn btn-danger text-uppercase"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success text-uppercase ms-2"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Submit'}
                {/* submit */}
              </button>
            </div>
          </div>
          <AdminContactModel
            ShowRepsModal={contactShowModel}
            SetShowRepsModal={setContactShowModel}
            setSelectAccReps={setSelectContact}
            setAccReps={setContactRepsList}
            AccReps={contactRepsList}
            setAccRepsList={setContactReps}
            AccRepsList={contactReps}
            resultData={repsData}
            setAdminContactModelData={setAdminContactModelData}
            type=""
          />

          {/*<AdminAccountReps
            ShowRepsModal={ShowAccRepsModal}
            SetShowRepsModal={setShowAccRepsModal}
            setSelectAccReps={setSelectAccReps}
            setAccReps={setAccReps}
            AccReps={AccReps}
            setAccRepsList={setAccRepsList}
            AccRepsList={AccRepsList}
            resultData={repsData}
            setRepsData={setRepsData}
            setAdminAccountModelData={setAdminAccountModelData}
            type="siteReps"
          />*/}

           <AdminMainContactMailModal
              open={openMailModal}
              mailModalTitle={mailModalTitle}
              hanldeModal={setOpenMailModal}
              setNewFormData={setFormData}
              newFormData={formData}
              emailDataList={modalMailtype}
              mailObjName={mailObjName}
              dataType={'email'}
              setSubFormData={multiEmailFormCountSite}
              // saveForm={saveForm}
            />

          <AdminMainContactPhoneModal
            open={openPhoneModal}
            mailModalTitle={phoneModalTitle}
            hanldeModal={setOpenPhoneModal}
            setNewFormData={setFormData}
            newFormData={formData}
            emailDataList={modalPhonetype}
            mailObjName={phoneObjName}
            dataType={'phone'}
            setSubFormData={altTrainerForm1Site}
          // saveForm={saveForm}
          />

          {/* </div> */}
        </Form>
      </div>
    </>
  );
};

export default AdminSiteNew;


import React, { useState, useEffect } from "react";
import { FormControlLabel, Icon, Radio, Switch } from "@mui/material";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import dayjs from 'dayjs';
import Select from "react-select";
import Button from "@mui/material/Button";
import SubHeadingOther from "../../components/header/SubHeadingOther";
import styles from "../NewAccount.module.css";
import ToogleSwitch from "../../components/common/toggleSwitch/ToogleSwitch";
import SubForm from "./SubForm";
import MultiEmailForm from "./MultiEmailForm";
import StatesField from "../../components/common/states/StatesField";
// import CompanyName from "./CompanyName";
import CustomToggleButton from "../../components/common/toggleSwitch/CustomToggleButton";
import { useNavigate } from "react-router-dom";
import AccountReps from "../../components/modals/accountReps";
import { AccRepsDropDown, AssignedSiteContactList, ContactList, DecryptToken, FetchDropDowns, GetCountries, ModalAccReps, ModalAccSiteReps, ProductsDropDown, SiteContactRepList, SiteRepsDropDown } from "../../helper/BasicFn";
import { prepareOptions, validatePhone } from "../../helper/Common";
import MultiTrainingFrom from "./MultiTrainingFrom";
import ProductModal from "../../components/modals/ProductModal";
import { CallPOSTAPI } from "../../helper/API";
import { toast } from "react-toastify";
import SubFormAdmin from "./SubFormAdmin";
import AdminMainContactMailModal from "./AdminMainContactMailModal";
import AdminStateField from "./AdminStateField";
import AdminMainContactPhoneModal from "./AdminMainContactPhoneModal";
import MultiEmailFormAdmin from "./MultiEmailFormAdmin";
import index from "../../components/filter";
// import MultiPhons from "../../components/AdminComps/MultiPhons";
import { MultiSelect } from "react-multi-select-component";

const AdminAccount = () => {

  const navigate = useNavigate()

  const [switchValue, setSwitchValue] = useState({});
  const [countryList, setCountryList] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState({});
  const [allDropDowns, setAllDropDowns] = useState([]);
  const [AccReps, setAccReps] = useState([]);
  const [AccRepsList, setAccRepsList] = useState([]);
  const [ShowAccRepsModal, setShowAccRepsModal] = useState(false);
  const [SelectAccReps, setSelectAccReps] = useState([]);
  const [repsData, setRepsData] = useState([]);
  const [productShowModel, setProductShowModal] = useState(false);
  const [SelectContact, setSelectContact] = useState([]);
  const [contactRepsList, setContactRepsList] = useState([]);
  const [contactReps, setContactReps] = useState([]);

  const [openMailModal, setOpenMailModal] = useState(false);
  const [openPhoneModal, setOpenPhoneModal] = useState(false);

 
  const [ProductModalData, setProductModalData] = useState([]);
  const [SelectedProductsData, setSelectedProductData] = useState("");
  const user = DecryptToken();
  const [open, setOpen] = useState({
    sundayopen: 0,
    mondayopen: 0,
    tuesdayopen: 0,
    wednesdayopen: 0,
    thursdayopen: 0,
    fridayopen: 0,
    saturdayopen: 0,
  });

  const [multiEmailFormCount, setMultiEmailFormCount] = useState([
    {
      account_main_contact_email: "",
      email_type_id: "0",
      account_main_contact_email_main: false,
    },
  ]);

  const [siteContactMail, setSiteContactMail] = useState([
    {
      account_main_contact_email: "",
      email_type_id: "0",
      account_main_contact_email_main: false,
    },
  ]);

  const [billingContactMail, setBillingContactMail] = useState([
    {
      account_main_contact_email: "",
      email_type_id: "0",
      account_main_contact_email_main: false,
    },
  ]);

  const [shippingContactMail, setShippingContactMail] = useState([
    {
      account_main_contact_email: "",
      email_type_id: "0",
      account_main_contact_email_main: false,
    },
  ]);

  const [altTrainerForm1, setAltTrainerForm1] = useState([
    {
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: '',
      account_main_contact_phone_main: false,
    },
  ]);

  const [siteContactPhone, setSiteContactPhone] = useState([
    {
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: '',
      account_main_contact_phone_main: false,
    },
  ]);

  const [billingContactPhone, setBillingContactPhone] = useState([
    {
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: '',
      account_main_contact_phone_main: false,
    },
  ]);

  const [shippingContactPhone, setShippingContactPhone] = useState([
    {
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: '',
      account_main_contact_phone_main: false,
    },
  ]);

  // Alternate Training Form

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


  const [newFormData, setNewFormData] = useState({
    account_info: {
      restricted_user: false,
      aed_check_length: '30 Days',
      product_interest: []
    },

    project_managers: {
      primary: 0,
      backup: 0
    },
    
    sales_reps: {
      primary: 0,
      backup: 0
    },

    technicians: {
      primary: 0,
      backup: 0
    },

    main_contact: {
      account_main_contact_status: '1'
    },

    site_contact: {
      account_contact_status: '1'
    },

    billing_contact: {
      account_contact_status: '1'
    },

    shipping_contact: {
      account_contact_status: '1'
    },

    main_contact_phone: altTrainerForm1,
    main_contact_email: multiEmailFormCount,

    site_contact_phone: siteContactPhone,
    site_contact_email: siteContactMail,

    billing_contact_phone: billingContactPhone,
    billing_contact_email: billingContactMail,

    shipping_contact_phone: shippingContactPhone,
    shipping_contact_email: shippingContactMail,

    site_details: {
      account_site_status_id: '1',
      generate_name_toggle: false,
      invoice_asap: false,
      call_ahead: false,
      security_clearance: false,
      requires_escort: false,
      site_poc: false,
      site_hours: false,
      same_billing_address: true,
      same_shipping_address: true,
      billing_contact: false,
      shipping_contact: false,
      out_of_area: false,
      alternate_training: false
    },

    traininglocation: traininglocation,

    account_reps: [],
    technicians_reps: []
  })


  const [formData, setFormData] = useState({
    account_site_state_abbreviation: "",
    account_site_country: "",
    account_site_address1: "",
    account_site_address2: "",
    building_name: "",
    account_site_city: "",
    account_site_state: "",
    account_site_zipcode: "",
    generate_name_toggle: false,
    account_site_name: "",
    account_site_phone: "",
    invoice_asap: 0,
    call_ahead: 0,
    security_clearance: 0,
    requires_escort: 0,

    site_poc: 1,
    site_hours: 1,
    same_billing_address: "",
    same_shipping_address: "",
    billing_contact: 1,
    // same_shipping: "",
    shipping_contact: 1,
    alternate_training_toggle: 1,

    account_billing_info_address1: "",
    account_billing_info_address2: "",
    account_billing_info_city: "",
    account_billing_info_state: "",
    account_billing_info_country: "",
    account_billing_info_zipcode: "",

    account_shipping_info_address1: "",
    account_shipping_info_address2: "",
    account_shipping_info_city: "",
    account_shipping_info_state: "",
    account_shipping_info_country: "",
    account_shipping_info_zipcode: "",

    // Account Poc Section
    main_contact_phone: altTrainerForm1,
    main_contact_email: multiEmailFormCount,
    alternate_training: traininglocation
  });
  const [primaryData, setPrimaryData] = useState([]);
  const [salesRepsData, setSalesRepsData] = useState([]);
  const [techniciansData, setTechniciansData] = useState([]);

    // prepare options
    const prepareOptions = (optionsData, key, value) => {
      if (optionsData) {
        let allData = [];
        for (let i = 0; i < optionsData.length; i++) {
          let singleData = {};
          singleData.label = optionsData[i][value];
          singleData.value = optionsData[i][key];
          allData.push(singleData);
        }
        allData.sort((a, b) => a.label.localeCompare(b.label));
        return allData;
      }
    };
  
  const fetchOnload = async () => {

    let ProductResult = await ProductsDropDown();
    if (ProductResult) {
      // ProductList
      let allProductListData = prepareOptions(
        ProductResult?.products,
        "dropdown_product_interest_id",
        "dropdown_product_interest_name"
      );
      setProductModalData(allProductListData);
      console.log(">>> allProductListData : ", allProductListData);
    }

    let AllDResult = await FetchDropDowns();
    if (AllDResult) {
      setAllDropDowns(AllDResult);
    }

    // let AccResult = await ModalAccSiteReps();
    let AccResult = await ModalAccReps();

    let AccreptList = await AccRepsDropDown();
    let AccSiteResult = await SiteRepsDropDown();
    let AccountContactList = await ContactList(user?.account_id);
    let AccountContectRepList = await SiteContactRepList();
    let AssignContectRepListData = []//await AssignedSiteContactList(user?.account_id);

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
      setPrimaryData(RepList);
      setSalesRepsData(RepList);
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
          CheckContactList.push(GetVal.contact_id);
          let parr = findPPrimaryId?.permissions
            ? findPPrimaryId?.permissions.split(",")
            : [];
          obj.primary = {
            e_id: findPPrimaryId.id,
            id: findPPrimaryId.contact_id,
            val: GetVal.contact_name,
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
      setContactReps(List);
    }

    if (AccSiteResult) {
      let RepList = [];
      for (let index = 0; index < AccSiteResult.length; index++) {
        const RepElement = AccSiteResult[index];
        let obj = { ...RepElement };
        obj.is_selected = false;
        obj.primary = { id: "", val: "" };
        obj.backup = { id: "", val: "" };
        RepList.push(obj);
      }
      setTechniciansData(RepList);
    }

    // get country
    const countries = await GetCountries();
    if (countries?.status) {
      let countriesData = prepareOptions(
        countries?.data,
        "id",
        "country_name"
      );
      setCountryList(countriesData);
      setSelectedCountry((old) => ({
        ...old,
        account_site_country: {
          label: countriesData?.[230]?.label,
          value: countriesData?.[230]?.value,
        },
      }));
      setSelectedCountry((old) => ({
        ...old,
        account_billing_info_country: {
          label: countriesData?.[230]?.label,
          value: countriesData?.[230]?.value,
        },
      }));
      setSelectedCountry((old) => ({
        ...old,
        account_shipping_info_country: {
          label: countriesData?.[230]?.label,
          value: countriesData?.[230]?.value,
        },
      }));

      setFormData((old) => ({
        ...old,
        account_site_country: countriesData?.[230]?.value,
      }));
      setFormData((old) => ({
        ...old,
        account_billing_info_country: countriesData?.[230]?.value,
      }));
      setFormData((old) => ({
        ...old,
        account_shipping_info_country: countriesData?.[230]?.value,
      }));
    }
  };

  useEffect(() => {
    fetchOnload();
  }, []);

  // handle select change
  const handleSelectChange = (data, key, type) => {
    setSelectedCountry((old) => ({
      ...old,
      [key]: {
        label: data.label,
        value: data.value,
      },
    }));
    // setFormData((old) => ({ ...old, [key]: data.value }));
    setNewFormData((old) => ({
      ...old,
      [type]: {
        ...old[type],
        [key]: data.value
      }
    }));
  };

  const SameAddressBilling = (value) => {
    let isChecked = value;
    let Fd = { ...formData };
    if (isChecked) {
      Fd.account_billing_info_address1 = Fd.account_site_address1;
      Fd.account_billing_info_address2 = Fd.account_site_address2;
      Fd.account_billing_info_city = Fd.account_site_city;
      Fd.account_billing_info_state = Fd.account_site_state;
      Fd.account_billing_info_state_id = Fd.account_site_state_id;
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

  const sameBillingShipping = (switchValue, e) => {
    if (switchValue?.key == "same_shipping_address") {
      SameAddressShipping(switchValue?.value);
    } else if (switchValue?.key == "same_billing_address") {
      SameAddressBilling(switchValue?.value);
    }

    // setFormData((old) => ({ ...old, [switchValue?.key]: switchValue?.value }));

    setNewFormData((old) => ({
      ...old,
      [switchValue?.type]: {
        ...old[switchValue?.type],
        [switchValue?.key]: switchValue?.value
      }
    }));

  };


  // check for switch value and update values
  useEffect(() => {
    sameBillingShipping(switchValue);
  }, [switchValue]);

  const handleInputChange = (e, type) => {
    if (
      e.target.name == "account_site_phone" ||
      e.target.name == "account_billing_info_billing_phone" ||
      e.target.name == "account_shipping_info_shipping_phone" ||
      e.target.name == "anasv2"
    ) {
      e.target.value = e.target.value.replace(/[^0-9 ]/g, "").trim();
      e.target.value = e.target.value.slice(0, 10);

      const phoneValidate = validatePhone(e.target.value);
      setPhoneValidations((old) => ({
        ...old,
        [e.target.name]: phoneValidate ? false : true,
      }));

      setNewFormData((old) => ({
        ...old,
        [type]: {
          ...old[type],
          [e.target.name]: e.target.value
        }
      }));
    }

    if (type === 'site_details' && newFormData?.site_details?.generate_name_toggle) {
      return
    }

    if (e.target.type == "checkbox") {
      setNewFormData((old) => ({
        ...old,
        [type]: {
          ...old[type],
          [e.target.name]: e.target.checked
        }
      }));
    } else {
      setNewFormData((old) => ({
        ...old,
        [type]: {
          ...old[type],
          [e.target.name]: e.target.value
        }
      }));
    }
  };

  const setUpSiteName = (newFormData) => {

    if (newFormData?.site_details?.generate_name_toggle) {
      let siteName =
        newFormData?.site_details?.account_site_state_abbreviation +
        " " +
        newFormData?.site_details?.account_site_city +
        " - " +
        newFormData?.site_details?.account_site_address1 +
        (newFormData?.site_details?.building_name ? " / " + newFormData?.site_details?.building_name : "");

      setNewFormData((old) => ({
        ...old,
        ['site_details']: {
          ...old['site_details'],
          ["temp_account_site_name"]: siteName,
          ["account_site_name"]: siteName
        }
      }));
      // setNewFormData((old) => ({
      //   ...old,
      //   ['site_details']: {
      //     ...old['site_details'],
      //     ["account_site_name"]: siteName
      //   }
      // }));

    } else {
      setNewFormData((old) => ({
        ...old,
        ['site_details']: {
          ...old['site_details'],
          ["temp_account_site_name"]: '',
          ["account_site_name"]: ''
        }
      }));
      // setNewFormData((old) => ({
      //   ...old,
      //   ['site_details']: {
      //     ...old['site_details'],
      //     ["account_site_name"]: ''
      //   }
      // }));
    }
  };

  useEffect(() => {
    setUpSiteName(newFormData);
  }, [newFormData?.site_details?.generate_name_toggle]);

  const timeIcon = () => {
    return <img src="/icon-time.png" alt="time-icon" />;
  };

  const handleCheckBox = (e, type, name) => {
    if (e.target.type == "checkbox") {
      setNewFormData((old) => ({
        ...old,
        [type]: {
          ...old[type],
          [name]: e.target.checked ? 1 : 0
        }
      }));
    } else {
      setNewFormData((old) => ({
        ...old,
        [type]: {
          ...old[type],
          [name]: e.target.value
        }
      }));
    }
  };

  const [isGenerateBtn, setIsGenerateBtn] = useState(true)

  useEffect(() => {
    if (
      !newFormData?.site_details?.account_site_state_abbreviation &&
      !newFormData?.site_details?.account_site_address1 &&
      !newFormData?.site_details?.account_site_city &&
      !newFormData?.site_details?.account_site_address2 &&
      !newFormData?.site_details?.building_name &&
      !newFormData?.site_details?.account_site_zipcode
    ) {
      setIsGenerateBtn(false)
    }
    else {
      setIsGenerateBtn(true)
    }
  }, [newFormData?.site_details])

  let stateAbbr = newFormData?.site_details?.account_site_state_abbreviation
  let generatedSiteNameParts = [
    stateAbbr ? stateAbbr + ', ' : '',
    newFormData?.site_details?.account_site_city ? newFormData.site_details.account_site_city + ' - ' : '',
    newFormData?.site_details?.account_site_address1,
    newFormData?.site_details?.building_name ? '/' + newFormData.site_details.building_name : ''
  ];
  let generatedSiteName = generatedSiteNameParts.filter(part => part !== undefined && part !== '').join('');  

  const handleGenerateSiteName = (e, type, name) => {
    if (!newFormData?.site_details?.account_site_name) {
      setNewFormData((old) => ({
        ...old,
        ['site_details']: {
          ...old['site_details'],
          ['account_site_name']: generatedSiteName
        }
      }));
    }
    else if (newFormData?.site_details?.account_site_name && !newFormData?.site_details?.account_site_name.includes(stateAbbr)) {
      setNewFormData((old) => ({
        ...old,
        ['site_details']: {
          ...old['site_details'],
          ['account_site_name']: generatedSiteName
        }
      }));
    }
    else {
      setNewFormData((old) => ({
        ...old,
        ['site_details']: {
          ...old['site_details'],
          ['account_site_name']: ''
        }
      }));
    }
  }

  const handleTimeChanges = (event, fieldName) => {
    const newTimeValue = event.target.value;
    setNewFormData((old) => ({
      ...old,
      ['sitehoursData']: {
        ...old['sitehoursData'],
        [fieldName]: newTimeValue
      }
    }));
  };

  const handleRadioChange = (key, openField, CloseField) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [key]: prevOpen[key] === 0 ? 1 : 0,
    }));
    updateSiteHoursStatus(key, openField, CloseField)
  };

  const updateSiteHoursStatus = (key, openField, CloseField) => {
    setNewFormData((old) => ({
      ...old,
      ['sitehoursData']: {
        ...old['sitehoursData'],
        [openField]: open[key] == 0 ? 'Closed' : '',
        [CloseField]: open[key] == 0 ? 'Closed' : '',
      }
    }));
  }

  // Admin Account 

  const increaseAlternative1 = () => {
    let arr = [...altTrainerForm1];
    let obj = {
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: '',
      account_main_contact_phone_main: false,
    };
    arr.push(obj);
    setAltTrainerForm1(arr);
  };
  //  -------------- Old COde --------------------
  // const decreaseAlternative1 = (e, index) => {
  //   let arr = [...altTrainerForm1];
  //   if (altTrainerForm1.length > 1) {
  //     arr.splice(index, 1);
  //     setAltTrainerForm1(arr);
  //   }
  // };
  const decreaseAlternative1 = (index1) => {
    let arr = [...altTrainerForm1];
    if (index1 >= 0 && altTrainerForm1.length > 1) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setAltTrainerForm1(updateArr);
    }
  };

  const increaseSiteContactPhone = () => {
    let arr = [...siteContactPhone];
    let obj = {
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: '',
      account_main_contact_phone_main: false,
    };
    arr.push(obj);
    setSiteContactPhone(arr);
  };

  const decreaseSiteContactPhone = (index1) => {
    let arr = [...siteContactPhone];
    if (index1 >= 0 && siteContactPhone.length > 1) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setSiteContactPhone(updateArr);
    }
  };

  const increaseBillingContactPhone = () => {
    let arr = [...billingContactPhone];
    let obj = {
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: '',
      account_main_contact_phone_main: false,
    };
    arr.push(obj);
    setBillingContactPhone(arr);
  };

  const decreaseBillingContactPhone = (index1) => {
    let arr = [...billingContactPhone];
    if (index1 >= 0 && billingContactPhone.length > 1) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setBillingContactPhone(updateArr);
    }
  };

  const increaseShippingContactPhone = () => {
    let arr = [...shippingContactPhone];
    let obj = {
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: '',
      account_main_contact_phone_main: false,
    };
    arr.push(obj);
    setShippingContactPhone(arr);
  };

  const decreaseShippingContactPhone = (index1) => {
    let arr = [...shippingContactPhone];
    if (index1 >= 0 && shippingContactPhone.length > 1) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setShippingContactPhone(updateArr);
    }
  };

  const MultiEmailFormIncrease = () => {
    let arr = [...multiEmailFormCount];
    let obj = {
      account_main_contact_email: "",
      email_type_id: "0",
      account_main_contact_email_main: false,
    };
    arr.push(obj);
    setMultiEmailFormCount(arr);
  };

  const MultiEmailFormDecrease = (index1) => {
    let arr = [...multiEmailFormCount];
    if (index1 >= 0 && multiEmailFormCount.length > 1) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setMultiEmailFormCount(updateArr);
    }
  };

  const SiteMultiEmailFormIncrease = () => {
    let arr = [...siteContactMail];
    let obj = {
      account_main_contact_email: "",
      email_type_id: "0",
      account_main_contact_email_main: false,
    };
    arr.push(obj);
    setSiteContactMail(arr);
  };

  const SiteMultiEmailFormDecrease = (index1) => {
    let arr = [...siteContactMail];
    if (index1 >= 0 && siteContactMail.length > 1) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setSiteContactMail(updateArr);
    }
  };  

  const BillingMultiEmailFormIncrease = () => {
    let arr = [...billingContactMail];
    let obj = {
      account_main_contact_email: "",
      email_type_id: "0",
      account_main_contact_email_main: false,
    };
    arr.push(obj);
    setBillingContactMail(arr);
  };

  const BillingMultiEmailFormDecrease = (index1) => {
    let arr = [...billingContactMail];
    if (index1 >= 0 && billingContactMail.length > 1) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setBillingContactMail(updateArr);
    }
  };

  const ShippingMultiEmailFormIncrease = () => {
    let arr = [...shippingContactMail];
    let obj = {
      account_main_contact_email: "",
      email_type_id: "0",
      account_main_contact_email_main: false,
    };
    arr.push(obj);
    setShippingContactMail(arr);
  };

  const ShippingMultiEmailFormDecrease = (index1) => {
    let arr = [...shippingContactMail];
    if (index1 >= 0 && shippingContactMail.length > 1) {
      const updateArr = arr.filter((_, index) => index !== index1);
      setShippingContactMail(updateArr);
    }
  };

  // for phone validations
  const [phoneValidations, setPhoneValidations] = useState({
    account_site_phone: false,
    account_billing_info_billing_phone: false,
    account_shipping_info_shipping_phone: false,
  });

  const [subFormPhoneValidated, setSubFormPhoneValidated] =
    React.useState(false);

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

  const [trainingPhoneValidations, setTrainingPhoneValidations] = useState(false);

  const [validateField, setValidateField] = React.useState(false);

  // useEffect(() => {
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     main_contact_email: multiEmailFormCount,
  //   }));
  // }, [multiEmailFormCount]);

  useEffect(() => {
    setNewFormData((prevFormData) => ({
      ...prevFormData,
      main_contact_email: multiEmailFormCount,
    }));
  }, [multiEmailFormCount]);

  useEffect(() => {
    setNewFormData((prevFormData) => ({
      ...prevFormData,
      site_contact_email: siteContactMail,
    }));
  }, [siteContactMail]);


  useEffect(() => {
    setNewFormData((prevFormData) => ({
      ...prevFormData,
      main_contact_phone: altTrainerForm1,
    }));
  }, [altTrainerForm1]);

  useEffect(() => {
    setNewFormData((prevFormData) => ({
      ...prevFormData,
      traininglocation: traininglocation,
    }));
  }, [traininglocation]);

  useEffect(() => {
    setNewFormData((prevFormData) => ({
      ...prevFormData,
      site_contact_phone: siteContactPhone,
    }));
  }, [siteContactPhone]);

  useEffect(() => {
    setNewFormData((prevFormData) => ({
      ...prevFormData,
      billing_contact_phone: billingContactPhone,
    }));
  }, [billingContactPhone]);

  useEffect(() => {
    setNewFormData((prevFormData) => ({
      ...prevFormData,
      billing_contact_email: billingContactMail,
    }));
  }, [billingContactMail]);

  useEffect(() => {
    setNewFormData((prevFormData) => ({
      ...prevFormData,
      shipping_contact_email: shippingContactMail,
    }));
  }, [shippingContactMail]);

  useEffect(() => {
    setNewFormData((prevFormData) => ({
      ...prevFormData,
      shipping_contact_phone: shippingContactPhone,
    }));
  }, [shippingContactPhone]);

  useEffect(() => {
    setNewFormData((prevFormData) => ({
      ...prevFormData,
      account_reps: repsData,
    }));
  }, [repsData]);

  useEffect(() => {
    setNewFormData((prevFormData) => ({
      ...prevFormData,
      account_info: {
        ...prevFormData.account_info,
        product_interest: SelectedProductsData
      },
    }));
  }, [SelectedProductsData]);


  const handleTimeChange = (event, fieldName) => {
    if (event) {
      const newValue = event.$d;
      const currentDate = new Date(newValue); // Get the current date
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');

      const hours = String(newValue.getHours()).padStart(2, '0');
      const minutes = String(newValue.getMinutes()).padStart(2, '0');

      const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}`;

      setNewFormData((old) => ({
        ...old,
        ['sitehoursData']: {
          ...old['sitehoursData'],
          [fieldName]: formattedTime
        }
      }));
    }
  };

  const [validated, setValidated] = useState(false)
  const [mailModalTitle, setMailModalTitle] = useState('')
  const [modalMailtype, setModalMailType] = useState([])
  const [mailObjName, setMailObjName] = useState('')

  const [modalPhonetype, setModalPhoneType] = useState([])
  const [phoneModalTitle, setPhoneModalTitle] = useState('')
  const [phoneObjName, setPhoneObjName] = useState('')


  const checkTrueMainMailArr = (arr) => {
    let result = 0;
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (element.account_main_contact_email_main == true) {
        result = 1;
      }
    }
    return result;
  }

  const checkTrueMainPhoneArr = (arr) => {
    let result = 0;
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (element.account_main_contact_phone_main == true) {
        result = 1;
      }
    }
    return result;
  }

  // const checkMainPhoneModal = () => {
  //   const checkPhone = checkTrueMainPhoneArr(newFormData?.main_contact_phone);

  //   // For account contact phone
  //   if (newFormData?.main_contact_phone?.length === 1) {
  //     setAltTrainerForm1((oldMultiPhoneFormCount) => [
  //       {
  //         ...oldMultiPhoneFormCount[0],
  //         account_main_contact_phone_main: true
  //       }
  //     ]);
  //   }
  //   else if (checkPhone === 0) {
  //     setOpenPhoneModal(true)
  //     setModalPhoneType(altTrainerForm1)
  //     setPhoneObjName('main_contact_phone')
  //     setPhoneModalTitle('Set Main Contact Phone')
  //     return
  //   }

  //   // For site contact phone
  //   if (newFormData?.site_details?.site_poc && newFormData?.site_contact_phone?.length === 1) {
  //     setSiteContactPhone((oldSitePhoneFormCount) => [
  //       {
  //         ...oldSitePhoneFormCount[0],
  //         account_main_contact_phone_main: true
  //       }
  //     ]);
  //   }
  //   else if (newFormData?.site_details?.site_poc &&
  //     checkTrueMainPhoneArr(newFormData?.site_contact_phone) === 0) {
  //     setOpenPhoneModal(true)
  //     setModalPhoneType(siteContactPhone)
  //     setPhoneObjName('site_contact_phone')
  //     setPhoneModalTitle('Set Site Contact Phone')
  //     return
  //   }

  //   // For billing contact phone
  //   if (newFormData?.site_details?.billing_contact && newFormData?.billing_contact_phone?.length === 1) {
  //     setBillingContactPhone((oldBillingPhoneFormCount) => [
  //       {
  //         ...oldBillingPhoneFormCount[0],
  //         account_main_contact_phone_main: true
  //       }
  //     ]);
  //   }
  //   else if (newFormData?.site_details?.billing_contact &&
  //     checkTrueMainPhoneArr(newFormData?.billing_contact_phone) === 0) {
  //     setOpenPhoneModal(true)
  //     setModalPhoneType(billingContactPhone)
  //     setPhoneObjName('billing_contact_phone')
  //     setPhoneModalTitle('Set Billing Contact Phone')
  //     return
  //   }

  //   // For shipping contact phone
  //   if (newFormData?.site_details?.shipping_contact && newFormData?.shipping_contact_phone?.length === 1) {
  //     setShippingContactPhone((oldShippingPhoneFormCount) => [
  //       {
  //         ...oldShippingPhoneFormCount[0],
  //         account_main_contact_phone_main: true
  //       }
  //     ]);
  //   }
  //   else if (newFormData?.site_details?.shipping_contact &&
  //     checkTrueMainPhoneArr(newFormData?.shipping_contact_phone) === 0) {
  //     setOpenPhoneModal(true)
  //     setModalPhoneType(shippingContactPhone)
  //     setPhoneObjName('shipping_contact_phone')
  //     setPhoneModalTitle('Set Shipping Contact Phone')
  //     return
  //   }
  // }

  const checkEmptyPhoneMail = (obj, key) => {
    let result = 0
    if (newFormData?.[obj].find(item => item?.[key] !== '')) {
      result = 1
    }
    return result
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

    const checkMail = checkTrueMainMailArr(newFormData?.main_contact_email);
    const checkPhone = checkTrueMainPhoneArr(newFormData?.main_contact_phone);
    const finalPayload = {...newFormData};
     // For account contact phone
     if (newFormData?.main_contact_phone?.length === 1 &&
      checkEmptyPhoneMail('main_contact_phone', 'account_main_contact_phone') === 1) {
      setAltTrainerForm1((oldMultiPhoneFormCount) => [
        {
          ...oldMultiPhoneFormCount[0],
          account_main_contact_phone_main: true
        }
      ]);
      finalPayload.main_contact_phone[0].account_main_contact_phone_main = 1;
    }
    else if (checkEmptyPhoneMail('main_contact_phone', 'account_main_contact_phone') === 1 && checkPhone === 0) {
      setOpenPhoneModal(true)
      setModalPhoneType(altTrainerForm1)
      setPhoneObjName('main_contact_phone')
      setPhoneModalTitle('Set Main Contact Phone')
      setFormSubmitting(false)
      setSaveFormData(false)
      return
    }

    // For account contact mail
      if (newFormData?.main_contact_email?.length === 1 &&
        checkEmptyPhoneMail('main_contact_email', 'account_main_contact_email') === 1) {
        setMultiEmailFormCount((oldMultiEmailFormCount) => [
          {
            ...oldMultiEmailFormCount[0],
            account_main_contact_email_main: true
          }
        ]);
        finalPayload.main_contact_email[0].account_main_contact_email_main = 1;
      }
    else if (checkEmptyPhoneMail('main_contact_email', 'account_main_contact_email') === 1 && checkMail === 0) {
      setOpenMailModal(true)
      setModalMailType(multiEmailFormCount)
      setMailObjName('main_contact_email')
      setMailModalTitle('Set Main Contact Email')
      setFormSubmitting(false)
      setSaveFormData(false)
      return
    }

    // For site contact phone
    if (newFormData?.site_details?.site_poc &&
      newFormData?.site_contact_phone?.length === 1 &&
      checkEmptyPhoneMail('site_contact_phone', 'account_main_contact_phone') === 1
    ) {
      setSiteContactPhone((oldSitePhoneFormCount) => [
        {
          ...oldSitePhoneFormCount[0],
          account_main_contact_phone_main: true
        }
      ]);
      finalPayload.site_contact_phone[0].account_main_contact_phone_main = 1;
    }
    else if (newFormData?.site_details?.site_poc &&
      checkTrueMainPhoneArr(newFormData?.site_contact_phone) === 0 &&
      checkEmptyPhoneMail('site_contact_phone', 'account_main_contact_phone') === 1
    ) {
      setOpenPhoneModal(true)
      setModalPhoneType(siteContactPhone)
      setPhoneObjName('site_contact_phone')
      setPhoneModalTitle('Set Site Contact Phone')
      setFormSubmitting(false)
      setSaveFormData(false)
      return
    }

    // For site contact mail
    if (newFormData?.site_details?.site_poc && newFormData?.site_contact_email?.length === 1 &&
      checkEmptyPhoneMail('site_contact_email', 'account_main_contact_email') === 1
    ) {
      setSiteContactMail((oldSiteEmailFormCount) => [
        {
          ...oldSiteEmailFormCount[0],
          account_main_contact_email_main: true
        }
      ]);
      finalPayload.site_contact_email[0].account_main_contact_email_main = 1;
    }
    else if (newFormData?.site_details?.site_poc &&
      checkTrueMainMailArr(newFormData?.site_contact_email) === 0 &&
      checkEmptyPhoneMail('site_contact_email', 'account_main_contact_email') === 1
    ) {
      setOpenMailModal(true)
      setModalMailType(siteContactMail)
      setMailObjName('site_contact_email')
      setMailModalTitle('Set Site Main Contact Email')
      setFormSubmitting(false)
      setSaveFormData(false)
      return
    }

    // For billing contact phone
    if (newFormData?.site_details?.billing_contact &&
      checkEmptyPhoneMail('billing_contact_phone', 'account_main_contact_phone') === 1 &&
      newFormData?.billing_contact_phone?.length === 1) {
      setBillingContactPhone((oldBillingPhoneFormCount) => [
        {
          ...oldBillingPhoneFormCount[0],
          account_main_contact_phone_main: true
        }
      ]);
      finalPayload.billing_contact_phone[0].account_main_contact_phone_main = 1;
    }
    else if (newFormData?.site_details?.billing_contact &&
      checkEmptyPhoneMail('billing_contact_phone', 'account_main_contact_phone') === 1 &&
      checkTrueMainPhoneArr(newFormData?.billing_contact_phone) === 0) {
      setOpenPhoneModal(true)
      setModalPhoneType(billingContactPhone)
      setPhoneObjName('billing_contact_phone')
      setPhoneModalTitle('Set Billing Contact Phone')
      setFormSubmitting(false)
      setSaveFormData(false)
      return
    }

    // For billing contact mail
    if (newFormData?.site_details?.billing_contact &&
      checkEmptyPhoneMail('billing_contact_email', 'account_main_contact_email') === 1 &&
      newFormData?.billing_contact_email?.length === 1) {
      setBillingContactMail((oldBillingEmailFormCount) => [
        {
          ...oldBillingEmailFormCount[0],
          account_main_contact_email_main: true
        }
      ]);
      finalPayload.billing_contact_email[0].account_main_contact_email_main = 1;
    }
    else if (newFormData?.site_details?.billing_contact &&
      checkEmptyPhoneMail('billing_contact_email', 'account_main_contact_email') === 1 &&
      checkTrueMainMailArr(newFormData?.billing_contact_email) === 0
    ) {
      setOpenMailModal(true)
      setModalMailType(billingContactMail)
      setMailObjName('billing_contact_email')
      setMailModalTitle('Set Billing Main Contact Email')
      setFormSubmitting(false)
      setSaveFormData(false)
      return
    }


    // For shipping contact phone
    if (newFormData?.site_details?.shipping_contact &&
      checkEmptyPhoneMail('shipping_contact_phone', 'account_main_contact_phone') === 1 &&
      newFormData?.shipping_contact_phone?.length === 1) {
      setShippingContactPhone((oldShippingPhoneFormCount) => [
        {
          ...oldShippingPhoneFormCount[0],
          account_main_contact_phone_main: true
        }
      ]);
      finalPayload.shipping_contact_phone[0].account_main_contact_phone_main = 1;
    }
    else if (newFormData?.site_details?.shipping_contact &&
      checkEmptyPhoneMail('shipping_contact_phone', 'account_main_contact_phone') === 1 &&
      checkTrueMainPhoneArr(newFormData?.shipping_contact_phone) === 0) {
      setOpenPhoneModal(true)
      setModalPhoneType(shippingContactPhone)
      setPhoneObjName('shipping_contact_phone')
      setPhoneModalTitle('Set Shipping Contact Phone')
      setFormSubmitting(false)
      setSaveFormData(false)
      return
    }

    // For shipping contact mail
    if (newFormData?.site_details?.shipping_contact &&
      checkEmptyPhoneMail('shipping_contact_email', 'account_main_contact_email') === 1 &&
      newFormData?.shipping_contact_email?.length === 1) {
      setShippingContactMail((oldShippingEmailFormCount) => [
        {
          ...oldShippingEmailFormCount[0],
          account_main_contact_email_main: true
        }
      ]);
      finalPayload.shipping_contact_email[0].account_main_contact_email_main = 1;
    }
    else if (newFormData?.site_details?.shipping_contact &&
      checkEmptyPhoneMail('shipping_contact_email', 'account_main_contact_email') === 1 &&
      checkTrueMainMailArr(newFormData?.shipping_contact_email) === 0
    ) {
      setOpenMailModal(true)
      setModalMailType(shippingContactMail)
      setMailObjName('shipping_contact_email')
      setMailModalTitle('Set Shipping Main Contact Email')
      setFormSubmitting(false)
      setSaveFormData(false)
      return
    }

    setFormSubmitting(true);
    setSaveFormData(true);
  }

  const saveForm = async (payload) => {
    setFormSubmitting('');
    setSaveFormData('');
    const response = await CallPOSTAPI('account/create-account', payload)
   if (response?.data.status) {
      toast.success(response?.data.msg)
      navigate('/accounts-listing')
    } else {
      toast.error(response?.data.msg)
    }
  }

  useEffect(() => {
    if (formSubmitting && !openMailModal && !openPhoneModal && saveFormData) {
      let finalPayload = { ...newFormData };
      if (finalPayload.account_info && Array.isArray(finalPayload.account_info.product_interest)) {
        const productInterestValues = finalPayload?.account_info?.product_interest?.map(item => item.value).join(',');
        finalPayload.account_info.product_interest = productInterestValues;
      }
      
      let repsValueArray = [];
      if(newFormData.project_managers.primary !== 0){
        repsValueArray.push({id: "", position_id: 1, contact_id: newFormData.project_managers.primary, is_primary: 1, is_backup: 0, set_order: 1})
      } 
      if(newFormData.project_managers.backup !== 0){
        repsValueArray.push({id: "", position_id: 1, contact_id: newFormData.project_managers.backup, is_primary: 0, is_backup: 1, set_order: 2})
      } 
      if(newFormData.sales_reps.primary !== 0){
        repsValueArray.push({id: "", position_id: 2, contact_id: newFormData.sales_reps.primary, is_primary: 1, is_backup: 0, set_order: 3})
      }
      if(newFormData.project_managers.backup !== 0){
        repsValueArray.push({id: "", position_id: 2, contact_id: newFormData.sales_reps.backup, is_primary: 0, is_backup: 1, set_order: 4})
      }
      finalPayload.account_reps = repsValueArray;

      let techRepsValueArray = [];
      if(newFormData.technicians.primary !== 0){
        techRepsValueArray.push({id: "", position_id: 13, contact_id: newFormData.technicians.primary, is_primary: 1, is_backup: 0, set_order: 1})
      }
      if(newFormData.project_managers.backup !== 0){
        techRepsValueArray.push({id: "", position_id: 13, contact_id: newFormData.technicians.backup, is_primary: 0, is_backup: 1, set_order: 2})
      }
      finalPayload.technicians_reps = techRepsValueArray;

      saveForm(finalPayload);
    } 
    else if(formSubmitting === false && saveFormData === false) {
      handleSubmit();
    }
  }, [formSubmitting, openMailModal, openPhoneModal, saveFormData]);

    // handle select change
    const handleProductSelect = (data) => {
      let valueArray = [];
      data.map((item, index) => {
        valueArray.push({
          label: item.label,
          value: item.value,
        });
      });
      setNewFormData((old) => ({
        ...old,
        account_info: {
          ...old.account_info,
          product_interest: valueArray
        }
      }));
    };

    const handleProjectPrimarySelectChange = (e) => {
      const selectedId = parseInt(e.target.value);
      setNewFormData((prevFormData) => ({
        ...prevFormData,
        project_managers: {
          ...prevFormData.project_managers,
          primary: selectedId
        },
      }));
    };
  
    const handleProjectBackupSelectChange = (e) => {
      const selectedId = parseInt(e.target.value);
      setNewFormData((prevFormData) => ({
        ...prevFormData,
        project_managers: {
          ...prevFormData.project_managers,
          backup: selectedId
        },
      }));
    };

    const handleSalesPrimarySelectChange = (e) => {
      const selectedId = parseInt(e.target.value);
      setNewFormData((prevFormData) => ({
        ...prevFormData,
        sales_reps: {
          ...prevFormData.sales_reps,
          primary: selectedId
        },
      }));
    };
  
    const handleSalesBackupSelectChange = (e) => {
      const selectedId = parseInt(e.target.value);
      setNewFormData((prevFormData) => ({
        ...prevFormData,
        sales_reps: {
          ...prevFormData.sales_reps,
          backup: selectedId
        },
      }));
    };

    const handleTechniciansPrimarySelectChange = (e) => {
      const selectedId = parseInt(e.target.value);
      setNewFormData((prevFormData) => ({
        ...prevFormData,
        technicians: {
          ...prevFormData.technicians,
          primary: selectedId
        },
      }));
    };
  
    const handleTechniciansBackupSelectChange = (e) => {
      const selectedId = parseInt(e.target.value);
      setNewFormData((prevFormData) => ({
        ...prevFormData,
        technicians: {
          ...prevFormData.technicians,
          backup: selectedId
        },
      }));
    };

    const renderSelectedTitleNames = () => {
      const productInterest = newFormData?.account_info?.product_interest;
      if (Array.isArray(productInterest)) {
        return productInterest.map((item) => item.label).join(", ");
      }
      return "";
    };
    
  
    const renderSelectTitle = () => {
      return (
        <div>
          {newFormData?.account_info?.product_interest?.length === 0
            ? "--Select One--"
            : newFormData?.account_info?.product_interest?.length >= 2
            ? `${newFormData?.account_info?.product_interest?.length} Selected`
            // :  []}
            : renderSelectedTitleNames()}
        </div>
      );
    };

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
        {/*<div className="d-flex">
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
        </div>*/}

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
                    {/* <InputGroup hasValidation> */}
                    <Form.Control
                      type="text"
                      placeholder="Account Name..."
                      required
                      name="account_name"
                      value={newFormData?.account_info?.account_name}
                      onChange={(e) => {
                        handleInputChange(e, 'account_info');
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please Enter Account Name.
                    </Form.Control.Feedback>
                    {/* </InputGroup> */}
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <b className={""}>Parent Account</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="parent_account_id"
                    value={newFormData?.account_info?.parent_account_id}
                    onChange={(e) => {
                      handleInputChange(e, 'account_info');
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
                    value={newFormData?.account_info?.distributor_id}
                    onChange={(e) => {
                      handleInputChange(e, 'account_info');
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
                        switchKeyValue={newFormData?.account_info?.restricted_user}
                        setSwitchValue={setSwitchValue}
                        switchValue={switchValue}
                        switchKey={"restricted_user"}
                        switchType={'account_info'}
                      />
                    </span>
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
                      handleInputChange(e, 'account_info');
                    }}
                    value={newFormData?.account_info?.customer_type_id}
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
                      handleInputChange(e, 'account_info');
                    }}
                    value={newFormData?.account_info?.industry_id}
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
                      handleInputChange(e, 'account_info');
                    }}
                    value={newFormData?.account_info?.terms_id}
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
                  <b className={""}>Lead Source</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="lead_source_id"
                    onChange={(e) => {
                      handleInputChange(e, 'account_info');
                    }}
                    value={newFormData?.account_info?.lead_source_id}
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
                
                <div className="col">
                  <Form.Group className={"col"} style={{ width: "250px" }}>
                  <Form.Label>Products</Form.Label>
                  <MultiSelect
                  valueRenderer={renderSelectTitle}
                  options={ProductModalData}
                  value={newFormData?.account_info?.product_interest || []}
                  onChange={handleProductSelect}
                  labelledBy="--Select One--"
                  hasSelectAll={false}
                  />
                  </Form.Group>
                </div>

                <div className="col">
                  <b className={""}>Account Status</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="account_status_id"
                    value={newFormData?.account_info?.account_status_id}
                    onChange={(e) => {
                      handleInputChange(e, 'account_info');
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
              </div>

              <div className="row my-4">
                <div className="col-5">
                  <Form.Group className={""}>
                    <Form.Label className={styles.textlabel}>
                      Website
                    </Form.Label>
                    <Form.Control
                      value={newFormData?.account_info?.website}
                      type="text"
                      placeholder="Website..."
                      name="website"
                      onChange={(e) => {
                        handleInputChange(e, 'account_info');
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
                      value={newFormData?.account_info?.important_note}
                      onChange={(e) => {
                        handleInputChange(e, 'account_info');
                      }}
                    />
                  </Form.Group>
                </div>
              </div>
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
                    value={newFormData?.account_info?.aed_check_length}
                    onChange={(e) => {
                      handleInputChange(e, 'account_info');
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
                    value={newFormData?.account_info?.extra_fields}
                    onChange={(e) => {
                      handleInputChange(e, 'account_info');
                    }}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </Form.Select>
                </div>

                {
                  newFormData?.account_info?.extra_fields === '1' && (
                    <div className="col-md-2 col-lg-3">
                      <Form.Group className={""}>
                        <Form.Label className={styles.textlabel}>
                          Field 1 Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Field 1..."
                          name="extra_field1"
                          value={newFormData?.account_info?.extra_field1}
                          onChange={(e) => {
                            handleInputChange(e, 'account_info');
                          }}
                        />
                      </Form.Group>
                    </div>
                  )
                }

                {
                  newFormData?.account_info?.extra_fields === '2' && (
                    <>
                      <div className="col-md-2 col-lg-3">
                        <Form.Group className={""}>
                          <Form.Label className={styles.textlabel}>
                            Field 1 Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Field 1..."
                            name="extra_field1"
                            value={newFormData?.account_info?.extra_field1}
                            onChange={(e) => {
                              handleInputChange(e, 'account_info');
                            }}
                          />
                        </Form.Group>
                      </div>

                      <div className="col-md-2 col-lg-3">
                        <Form.Group className={""}>
                          <Form.Label className={styles.textlabel}>
                            Field 2 Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Field 2..."
                            name="extra_field2"
                            value={newFormData?.account_info?.extra_field2}
                            onChange={(e) => {
                              handleInputChange(e, 'account_info');
                            }}
                          />
                        </Form.Group>
                      </div>
                    </>
                  )
                }

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
                    value={newFormData?.main_contact?.account_main_contact_salutation}
                    onChange={(e) => {
                      handleInputChange(e, 'main_contact');
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_main_contact_firstname"
                    value={newFormData?.main_contact?.account_main_contact_firstname}
                    onChange={(e) => {
                      handleInputChange(e, 'main_contact');
                    }}
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
                    value={newFormData?.main_contact?.account_main_contact_middlename}
                    onChange={(e) => {
                      handleInputChange(e, 'main_contact');
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_main_contact_lastname"
                    value={newFormData?.main_contact?.account_main_contact_lastname}
                    onChange={(e) => {
                      handleInputChange(e, 'main_contact');
                    }}
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
                    value={newFormData?.main_contact?.account_main_contact_suffix}
                    onChange={(e) => {
                      handleInputChange(e, 'main_contact');
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_main_contact_title"
                    value={newFormData?.main_contact?.account_main_contact_title}
                    onChange={(e) => {
                      handleInputChange(e, 'main_contact');
                    }}
                  />
                </Form.Group>
                <Form.Group className={"col"}>
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_main_contact_department"
                    value={newFormData?.main_contact?.account_main_contact_department}
                    onChange={(e) => {
                      handleInputChange(e, 'main_contact');
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Contact Status</Form.Label>

                  <Form.Select
                    className={""}
                    name="account_main_contact_status"
                    value={newFormData?.main_contact?.account_main_contact_status}
                    onChange={(e) => {
                      handleInputChange(e, 'main_contact');
                    }}
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

              <SubFormAdmin
                altTrainerForm={altTrainerForm1}
                setSubFormData={setAltTrainerForm1}
                increaseAlternative={increaseAlternative1}
                decreaseAlternative={decreaseAlternative1}
                handleInputChange={(e) => {
                  handleInputChange(e);
                }}
                allDropDowns={allDropDowns}
                formData={newFormData?.main_contact_phone}
                formName={"main_contact_phone"}
                setFormData={setNewFormData}
                noBtns={true}
                setPhoneValidations={setPhoneValidations}
                phoneValidations={phoneValidations}
                setSubFormPhoneValidated={setSubFormPhoneValidated}
              />

              <MultiEmailFormAdmin
                setFormData={setNewFormData}
                altTrainerForm={multiEmailFormCount}
                setSubFormData={setMultiEmailFormCount}
                increaseAlternative={MultiEmailFormIncrease}
                decreaseAlternative={MultiEmailFormDecrease}
                handleInputChange={(e) => {
                  handleInputChange(e);
                }}
                allDropDowns={allDropDowns}
                emailFormData={formData?.main_contact_email}
                formName={"main_contact_email"}
              />
            </div>
            
            {/* Project Managers */}
            <div
              className="container-fluid bottom-border-blue pb-2 pt-2 mt-4"
              style={{ background: "#eee" }}
            >
              <div style={{display: "flex", justifyContent: "space-around"}}>
                <h2 className="text-left heading" style={{ marginBottom: "0", width: "51%" }}>
                  Project Managers
                </h2>
                <h2 className="text-left heading" style={{ marginBottom: "0", width: "50%" }}>
                  Sales Reps
                </h2>
              </div> 
              <div className="row my-4 ">
              <Form.Group className={"col"}>
              <Form.Label>Primary</Form.Label>
              <Form.Select
                className={""}
                name="primary"
                value={newFormData.project_managers.primary}
                onChange={(e) => {
                  handleProjectPrimarySelectChange(e);
                }}
              >
                <option value="0" selected>
                  --Select One--
                </option>
                {primaryData.map((item, index) => {
                  if(item.account_main_contact_id !== newFormData.project_managers.backup){
                    return (
                    <option
                      value={item.account_main_contact_id}
                      key={index}
                    >
                      {item.account_main_contact_firstname} {item.account_main_contact_lastname}
                    </option>
                    )
                  }
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className={"col"}>
            <Form.Label>Backup</Form.Label>
            <Form.Select
              className={""}
              name="backup"
              value={newFormData.project_managers.backup}
              onChange={(e) => {
                handleProjectBackupSelectChange(e);
              }}
            >
              <option value="0" selected >
                --Select One--
              </option>
              {primaryData.map((item, index) => {
                if(item.account_main_contact_id !== newFormData.project_managers.primary){
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
          <Form.Label>Primary</Form.Label>
          <Form.Select
            className={""}
            name="sales_reps_primary"
            value={newFormData.sales_reps.primary}
            onChange={handleSalesPrimarySelectChange}
          >
            <option value="0" selected>
              --Select One--
            </option>
            {salesRepsData.map((item, index) => {
              if(item.account_main_contact_id !== newFormData.sales_reps.backup){
                return (
              <option
                value={item.account_main_contact_id}
                key={index}
              >
              {item.account_main_contact_firstname} {item.account_main_contact_lastname}
              </option>
                )
              }
            })}
          </Form.Select>
        </Form.Group>

        <Form.Group className={"col"}>
        <Form.Label>Backup</Form.Label>
        <Form.Select
          className={""}
          name="sales_reps_backup"
          value={newFormData.sales_reps.backup}
          onChange={handleSalesBackupSelectChange}
        >
          <option value="0" selected>
            --Select One--
          </option>
          {salesRepsData.map((item, index) => {
            if(item.account_main_contact_id !== newFormData.sales_reps.primary){
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

            {/*Main Site Infornation */}
            <div
              className="container-fluid bottom-border-blue mt-4 pt-2 pb-2"
              style={{
                background: "#eee",
              }}
            >
              <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                Main Site Information
              </h2>
              <div className="row my-4">
                <Form.Group className={"col"}>
                  <Form.Label>Country</Form.Label>
                  <Select
                    value={selectedCountry?.account_site_country}
                    required
                    options={countryList}
                    onChange={(data) => {
                      handleSelectChange(data, "account_site_country", 'site_details');
                    }}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Address*</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_address1"
                    value={newFormData?.site_details?.account_site_address1}
                    onChange={(e) => handleInputChange(e, 'site_details')}
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
                    value={newFormData?.site_details?.account_site_address2}
                    onChange={(e) => handleInputChange(e, 'site_details')}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Building Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="building_name"
                    value={newFormData?.site_details?.building_name}
                    onChange={(e) => handleInputChange(e, 'site_details')}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>City*</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_city"
                    value={newFormData?.site_details?.account_site_city}
                    onChange={(e) => handleInputChange(e, 'site_details')}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please Enter City.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className={"col relative"}>
                  <Form.Label>State* </Form.Label>

                  <AdminStateField
                    setFormData={setNewFormData}
                    valueKey="account_site_state"
                    objName='site_details'
                    selectedCountry={selectedCountry?.account_site_country?.value}
                    validated={validated}
                    required={true}
                    setIsGenerateBtn={setIsGenerateBtn}
                    isGenerateBtn={isGenerateBtn}
                    stateSelectedValue={newFormData?.site_details?.account_site_state}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Zip code*</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_zipcode"
                    value={newFormData?.site_details?.account_site_zipcode}
                    onChange={(e) => handleInputChange(e, 'site_details')}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please Enter Zip code.
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="row">
                <div className="my-2 d-flex gap-2 align-items-center">
                  <div className="col" style={{ maxWidth: "130px" }}>
                    <Form.Group>
                      {/* <b className={"d-block mb-3"}>Generate Name</b> */}
                      <div className="mt-4">
                        <BButton
                          disabled={!isGenerateBtn}
                          onClick={(e) => handleGenerateSiteName(e, 'site_details', 'generate_name_toggle')}
                          variant="primary" type="button">
                          Generate
                        </BButton>
                      </div>
                    </Form.Group>
                  </div>

                  <Form.Group className={"col"}>
                    <Form.Label>Site Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="account_site_name"
                      // value={generateSiteName ? generatedSiteName : ''}
                      value={newFormData?.site_details?.account_site_name}
                      onChange={(e) => handleInputChange(e, 'site_details')}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please Enter Site Name.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Site Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="account_site_phone"
                      value={newFormData?.site_details?.account_site_phone}
                      onChange={(e) => handleInputChange(e, 'site_details')}
                      minLength="10"
                      className={
                        phoneValidations?.account_site_phone
                          ? "phone-invalid-input"
                          : ""
                      }
                    />
                    {
                      phoneValidations?.account_site_phone && (
                        <div className="phone-invalid">
                          Please Enter Exact 10 digits.
                        </div>
                      )
                    }
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Phone Ext</Form.Label>
                    <Form.Control
                      type="number"
                      name="account_site_phone_ext"
                      value={newFormData?.site_details?.account_site_phone_ext}
                      onChange={(e) => handleInputChange(e, 'site_details')}
                    />
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Site Status</Form.Label>
                    <Form.Select
                      className={""}
                      name="account_site_status_id"
                      onChange={(e) => handleInputChange(e, 'site_details')}
                      value={newFormData?.site_details?.account_site_status_id}
                    >
                      <option value="0" selected>
                        --Select One--
                      </option>
                      {allDropDowns?.siteStatus &&
                        allDropDowns?.siteStatus.map((SS, index) => (
                          <option value={SS?.dropdown_site_status_id} key={index}>
                            {SS?.dropdown_site_status_name}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>

              <div className="row my-4">
                <div className="col" style={{ maxWidth: "120px" }}>
                  <Form.Group>
                    <b className={"d-block mb-3"}>Invoice ASAP</b>
                    <div className="my-2">
                      <CustomToggleButton
                        ToggleName="invoice_asap"
                        // ToggleValue={formData?.invoice_asap}
                        ToggleValue={newFormData?.site_details?.invoice_asap}
                        changeHandler={(e) => handleCheckBox(e, 'site_details', 'invoice_asap')}
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

                <div className="col" style={{ maxWidth: "100px", marginRight: "2%" }}>
                  <Form.Group>
                    <b className={"d-block mb-3"}>Call Ahead</b>
                    <div className="my-2">
                      <CustomToggleButton
                        ToggleName="call_ahead"
                        ToggleValue={newFormData?.site_details?.call_ahead}
                        changeHandler={(e) => handleCheckBox(e, 'site_details', 'call_ahead')}
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

                <div className="col" style={{ maxWidth: "100px", marginRight: "2%" }}>
                  <Form.Group>
                    <b className={"d-block mb-3"}>Out of Area</b>
                    <div className="my-2">
                      <CustomToggleButton
                        ToggleName="out_of_area"
                        ToggleValue={newFormData?.site_details?.out_of_area}
                        changeHandler={(e) => handleCheckBox(e, 'site_details', 'out_of_area')}
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
                        ToggleValue={newFormData?.site_details?.security_clearance}
                        changeHandler={(e) => handleCheckBox(e, 'site_details', 'security_clearance')}
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
                        ToggleValue={newFormData?.site_details?.requires_escort}
                        changeHandler={(e) => handleCheckBox(e, 'site_details', 'requires_escort')}
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

                <div className="col" style={{ maxWidth: "70px", marginRight: "3%" }}>
                  <Form.Group>
                    <b className={"d-block mb-3"}>Site POC</b>
                    <div className="my-2">
                      <CustomToggleButton
                        ToggleName="site_poc"
                        ToggleValue={newFormData?.site_details?.site_poc}
                        changeHandler={(e) => handleCheckBox(e, 'site_details', 'site_poc')}
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

                <div className="col" style={{ maxWidth: "100px", marginRight: "2%" }}>
                  <Form.Group>
                    <b className={"d-block mb-3"}>Site Hours</b>
                    <div className="my-2">
                      <CustomToggleButton
                        ToggleName="site_hours"
                        ToggleValue={newFormData?.site_details?.site_hours}
                        changeHandler={(e) => handleCheckBox(e, 'site_details', 'site_hours')}
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
                    <span className="d-inline-block">
                      <CustomToggleButton
                        ToggleName="same_billing_address"
                        ToggleValue={newFormData?.site_details?.same_billing_address}
                        changeHandler={(e) => handleCheckBox(e, 'site_details', 'same_billing_address')}
                      />
                    </span>
                  </Form.Group>
                </div>

                <div className="col" style={{ maxWidth: "130px" }}>
                  <Form.Group>
                    <b className={"d-block mb-3"}>Billing Contact</b>
                    <div className="my-2">
                      <CustomToggleButton
                        ToggleName="billing_contact"
                        ToggleValue={newFormData?.site_details?.billing_contact}
                        changeHandler={(e) => handleCheckBox(e, 'site_details', 'billing_contact')}
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
                    <span className="d-inline-block">
                      {/* <ToogleSwitch
                      switchKeyValue={newFormData?.site_details?.same_shipping_address}
                      setSwitchValue={setSwitchValue}
                      switchValue={switchValue}
                      switchKey={"same_shipping_address"}
                      switchType={'site_details'}
                    /> */}
                      <CustomToggleButton
                        ToggleName="same_shipping_address"
                        ToggleValue={newFormData?.site_details?.same_shipping_address}
                        changeHandler={(e) => handleCheckBox(e, 'site_details', 'same_shipping_address')}
                      />
                    </span>
                  </Form.Group>
                </div>

                <div className="col" style={{ maxWidth: "140px" }}>
                  <Form.Group>
                    <b className={"d-block mb-3"}>Shipping Contact</b>
                    <div className="my-2">
                      <CustomToggleButton
                        ToggleName="shipping_contact"
                        ToggleValue={newFormData?.site_details?.shipping_contact}
                        changeHandler={(e) => handleCheckBox(e, 'site_details', 'shipping_contact')}
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
                        ToggleValue={newFormData?.site_details?.alternate_training}
                        changeHandler={(e) => handleCheckBox(e, 'site_details', 'alternate_training')}
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

            {/* Site POC */}
            {
              newFormData?.site_details?.site_poc ?
                <>
                  <div
                    className="container-fluid bottom-border-blue pb-2 pt-2 mt-4"
                    style={{ background: "#eee" }}
                  >
                    <h2 className="text-left heading" style={{ marginBottom: "0" }}>
                      Site POC
                    </h2>
                    <div className="row my-4 ">
                      <Form.Group className={"col"}>
                        <Form.Label>Salutation</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_salutation"
                          value={newFormData?.site_contact?.account_main_contact_salutation}
                          onChange={(e) => {
                            handleInputChange(e, 'site_contact');
                          }}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_firstname"
                          value={newFormData?.site_contact?.account_main_contact_firstname}
                          onChange={(e) => {
                            handleInputChange(e, 'site_contact');
                          }}
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
                          value={newFormData?.site_contact?.account_main_contact_middlename}
                          onChange={(e) => {
                            handleInputChange(e, 'site_contact');
                          }}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_lastname"
                          value={newFormData?.site_contact?.account_main_contact_lastname}
                          onChange={(e) => {
                            handleInputChange(e, 'site_contact');
                          }}
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
                          value={newFormData?.site_contact?.account_main_contact_suffix}
                          onChange={(e) => {
                            handleInputChange(e, 'site_contact');
                          }}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_title"
                          value={newFormData?.site_contact?.account_main_contact_title}
                          onChange={(e) => {
                            handleInputChange(e, 'site_contact');
                          }}
                        />
                      </Form.Group>
                      <Form.Group className={"col"}>
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_department"
                          value={newFormData?.site_contact?.account_main_contact_department}
                          onChange={(e) => {
                            handleInputChange(e, 'site_contact');
                          }}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Contact Status</Form.Label>

                        <Form.Select
                          className={""}
                          name="account_contact_status"
                          value={newFormData?.site_contact?.account_contact_status}
                          onChange={(e) => {
                            handleInputChange(e, 'site_contact');
                          }}
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


                    <SubFormAdmin
                      altTrainerForm={siteContactPhone}
                      setSubFormData={setSiteContactPhone}
                      increaseAlternative={increaseSiteContactPhone}
                      decreaseAlternative={decreaseSiteContactPhone}
                      handleInputChange={(e) => {
                        handleInputChange(e);
                      }}
                      allDropDowns={allDropDowns}
                      formData={newFormData.site_contact_phone}
                      formName={"site_contact_phone"}
                      setFormData={setNewFormData}
                      noBtns={true}
                      setPhoneValidations={setPhoneValidations}
                      phoneValidations={phoneValidations}
                      setSubFormPhoneValidated={setSubFormPhoneValidated}
                    />

                    <MultiEmailFormAdmin
                      setFormData={setNewFormData}
                      altTrainerForm={siteContactMail}
                      setSubFormData={setSiteContactMail}
                      increaseAlternative={SiteMultiEmailFormIncrease}
                      decreaseAlternative={SiteMultiEmailFormDecrease}
                      handleInputChange={(e) => {
                        handleInputChange(e);
                      }}
                      allDropDowns={allDropDowns}
                      emailFormData={newFormData?.site_contact_email}
                      formName={"site_contact_email"}
                    />

                  </div>
                </>
                :
                <></>
            }


            {/* Site Hours */}
            {
              newFormData?.site_details?.site_hours ?
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
                                onClick={() => handleRadioChange("sundayopen", 'sunday_open', 'sunday_close')}
                              />
                            }
                          />
                        </div>
                        <div
                          className={"d-flex align-items-center calendar-input-btn"}
                        >
                          <input
                            type="time"
                            value={newFormData?.sitehoursData?.sunday_open}
                            onChange={(e) => handleTimeChanges(e, "sunday_open")}
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
                                onClick={() => handleRadioChange("mondayopen", 'monday_open', 'monday_close')}
                              />
                            }
                          />
                        </div>
                        <div
                          className={"d-flex align-items-center calendar-input-btn"}
                        >
                          <input
                            type="time"
                            value={newFormData?.sitehoursData?.monday_open}
                            onChange={(e) => handleTimeChanges(e, "monday_open")}
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
                                onClick={() => handleRadioChange("tuesdayopen", 'tuesday_open', 'tuesday_close')}
                              />
                            }
                          />
                        </div>
                        <div
                          className={"d-flex align-items-center calendar-input-btn"}
                        >
                          <input
                            type="time"
                            value={newFormData?.sitehoursData?.tuesday_open}
                            onChange={(e) => handleTimeChanges(e, "tuesday_open")}
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
                                onClick={() => handleRadioChange("wednesdayopen", 'wednesday_open', 'wednesday_close')}
                              />
                            }
                          />
                        </div>
                        <div
                          className={"d-flex align-items-center calendar-input-btn"}
                        >
                          <input
                            type="time"
                            value={newFormData?.sitehoursData?.wednesday_open}
                            onChange={(e) => handleTimeChanges(e, "wednesday_open")}
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
                                onClick={() => handleRadioChange("thursdayopen", 'thursday_open', 'thursday_close')}
                              />
                            }
                          />
                        </div>
                        <div
                          className={"d-flex align-items-center calendar-input-btn"}
                        >
                          <input
                            type="time"
                            value={newFormData?.sitehoursData?.thursday_open}
                            onChange={(e) => handleTimeChanges(e, "thursday_open")}
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
                                onClick={() => handleRadioChange("fridayopen", 'friday_open', 'friday_close')}
                              />
                            }
                          />
                        </div>
                        <div
                          className={"d-flex align-items-center calendar-input-btn"}
                        >
                          <input
                            type="time"
                            value={newFormData?.sitehoursData?.friday_open}
                            onChange={(e) => handleTimeChanges(e, "friday_open")}
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
                                onClick={() => handleRadioChange("saturdayopen", 'saturday_open', 'saturday_close')}
                              />
                            }
                          />
                        </div>
                        <div
                          className={"d-flex align-items-center calendar-input-btn"}
                        >
                          <input
                            type="time"
                            value={newFormData?.sitehoursData?.saturday_open}
                            onChange={(e) => handleTimeChanges(e, "saturday_open")}
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
                            value={newFormData?.sitehoursData?.sunday_close}
                            onChange={(e) => handleTimeChanges(e, "sunday_close")}
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
                            value={newFormData?.sitehoursData?.monday_close}
                            onChange={(e) => handleTimeChanges(e, "monday_close")}
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
                            value={newFormData?.sitehoursData?.tuesday_close}
                            onChange={(e) => handleTimeChanges(e, "tuesday_close")}
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
                            value={newFormData?.sitehoursData?.wednesday_close}
                            onChange={(e) => handleTimeChanges(e, "wednesday_close")}
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
                            value={newFormData?.sitehoursData?.thursday_close}
                            onChange={(e) => handleTimeChanges(e, "thursday_close")}
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
                            value={newFormData?.sitehoursData?.friday_close}
                            onChange={(e) => handleTimeChanges(e, "friday_close")}
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
                            value={newFormData?.sitehoursData?.saturday_close}
                            onChange={(e) => handleTimeChanges(e, "saturday_close")}
                            dateFormat="HH:mm:ss"
                            placeholderText="HH:mm:ss"
                            disabled={open?.saturdayopen === 1}
                          />
                        </div>
                      </Form.Group>
                    </div>

                  </div>
                </>
                :
                <></>
            }

            {/*Billing Address */}
            {
              newFormData?.site_details?.same_billing_address ?
                <></>
                :
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
                            handleSelectChange(data, "account_billing_info_country", 'billing_details');
                          }}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Address*</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          name="account_billing_info_address1"
                          value={newFormData?.billing_details?.account_billing_info_address1}
                          onChange={(e) => handleInputChange(e, 'billing_details')}
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
                          value={newFormData?.billing_details?.account_billing_info_address2}
                          onChange={(e) => handleInputChange(e, 'billing_details')}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>City*</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          name="account_billing_info_city"
                          value={newFormData?.billing_details?.account_billing_info_city}
                          onChange={(e) => handleInputChange(e, 'billing_details')}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please Enter City.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className={"col relative"}>
                        <Form.Label>State* </Form.Label>

                        <AdminStateField
                          setFormData={setNewFormData}
                          valueKey="account_billing_info_state"
                          selectedCountry={
                            selectedCountry?.account_billing_info_country?.value
                          }
                          objName='billing_details'
                          validated={validated}
                          required={true}
                          stateSelectedValue={newFormData?.billing_details?.account_billing_info_state}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Zip code*</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          name="account_billing_info_zipcode"
                          value={newFormData?.billing_details?.account_billing_info_zipcode}
                          onChange={(e) => handleInputChange(e, 'billing_details')}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please Enter Zip code.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </div>
                </>
            }


            {/* Billing Contact */}
            {
              newFormData?.site_details?.billing_contact ?
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
                          name="account_main_contact_salutation"
                          value={newFormData?.billing_contact?.account_main_contact_salutation}
                          onChange={(e) => handleInputChange(e, 'billing_contact')}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_firstname"
                          value={newFormData?.billing_contact?.account_main_contact_firstname}
                          onChange={(e) => handleInputChange(e, 'billing_contact')}
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
                          value={newFormData?.billing_contact?.account_main_contact_middlename}
                          onChange={(e) => handleInputChange(e, 'billing_contact')}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_lastname"
                          value={newFormData?.billing_contact?.account_main_contact_lastname}
                          onChange={(e) => handleInputChange(e, 'billing_contact')}
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
                          value={newFormData?.billing_contact?.account_main_contact_suffix}
                          onChange={(e) => handleInputChange(e, 'billing_contact')}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_title"
                          value={newFormData?.billing_contact?.account_main_contact_title}
                          onChange={(e) => handleInputChange(e, 'billing_contact')}
                        />
                      </Form.Group>
                      <Form.Group className={"col"}>
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_department"
                          value={newFormData?.billing_contact?.account_main_contact_department}
                          onChange={(e) => handleInputChange(e, 'billing_contact')}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Contact Status</Form.Label>

                        <Form.Select
                          className={""}
                          name="account_contact_status"
                          value={newFormData?.billing_contact?.account_contact_status}
                          onChange={(e) => handleInputChange(e, 'billing_contact')}
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

                    <SubFormAdmin
                      altTrainerForm={billingContactPhone}
                      setSubFormData={setBillingContactPhone}
                      increaseAlternative={increaseBillingContactPhone}
                      decreaseAlternative={decreaseBillingContactPhone}
                      handleInputChange={(e) => {
                        handleInputChange(e);
                      }}
                      allDropDowns={allDropDowns}
                      formData={newFormData?.billing_contact_phone}
                      formName={"billing_contact_phone"}
                      setFormData={setNewFormData}
                      noBtns={true}
                      setPhoneValidations={setPhoneValidations}
                      phoneValidations={phoneValidations}
                      setSubFormPhoneValidated={setSubFormPhoneValidated}
                    />

                    <MultiEmailFormAdmin
                      setFormData={setNewFormData}
                      altTrainerForm={billingContactMail}
                      setSubFormData={setBillingContactMail}
                      increaseAlternative={BillingMultiEmailFormIncrease}
                      decreaseAlternative={BillingMultiEmailFormDecrease}
                      handleInputChange={(e) => {
                        handleInputChange(e);
                      }}
                      allDropDowns={allDropDowns}
                      emailFormData={newFormData?.billing_contact_email}
                      formName={"billing_contact_email"}
                    />

                  </div>
                </>
                :
                <></>
            }

            {/*Shipping Address */}
            {
              newFormData?.site_details?.same_shipping_address ?
                <></>
                :
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
                            handleSelectChange(data, "account_shipping_info_country", 'shipping_details');
                          }}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Address*</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          name="account_shipping_info_address1"
                          value={newFormData?.shipping_details?.account_shipping_info_address1}
                          onChange={(e) => handleInputChange(e, 'shipping_details')}
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
                          value={newFormData?.shipping_details?.account_shipping_info_address2}
                          onChange={(e) => handleInputChange(e, 'shipping_details')}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>City*</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          name="account_shipping_info_city"
                          value={newFormData?.shipping_details?.account_shipping_info_city}
                          onChange={(e) => handleInputChange(e, 'shipping_details')}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please Enter City.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className={"col relative"}>
                        <Form.Label>State* </Form.Label>
                        <AdminStateField
                          setFormData={setNewFormData}
                          valueKey="account_shipping_info_state"
                          selectedCountry={
                            selectedCountry?.account_shipping_info_country?.value
                          }
                          objName='shipping_details'
                          validated={validated}
                          required={true}
                          stateSelectedValue={newFormData?.shipping_details?.account_shipping_info_state}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Zip code*</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          name="account_shipping_info_zipcode"
                          value={newFormData?.shipping_details?.account_shipping_info_zipcode}
                          onChange={(e) => handleInputChange(e, 'shipping_details')}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please Enter Zip code.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </div>
                </>
            }


            {/* Shipping Contact */}
            {
              newFormData?.site_details?.shipping_contact ?
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
                          name="account_main_contact_salutation"
                          value={newFormData?.shipping_contact?.account_main_contact_salutation}
                          onChange={(e) => handleInputChange(e, 'shipping_contact')}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_firstname"
                          value={newFormData?.shipping_contact?.account_main_contact_firstname}
                          onChange={(e) => handleInputChange(e, 'shipping_contact')}
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
                          value={newFormData?.shipping_contact?.account_main_contact_middlename}
                          onChange={(e) => handleInputChange(e, 'shipping_contact')}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_lastname"
                          value={newFormData?.shipping_contact?.account_main_contact_lastname}
                          onChange={(e) => handleInputChange(e, 'shipping_contact')}
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
                          value={newFormData?.shipping_contact?.account_main_contact_suffix}
                          onChange={(e) => handleInputChange(e, 'shipping_contact')}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_title"
                          value={newFormData?.shipping_contact?.account_main_contact_title}
                          onChange={(e) => handleInputChange(e, 'shipping_contact')}
                        />
                      </Form.Group>
                      <Form.Group className={"col"}>
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_main_contact_department"
                          value={newFormData?.shipping_contact?.account_main_contact_department}
                          onChange={(e) => handleInputChange(e, 'shipping_contact')}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Contact Status</Form.Label>

                        <Form.Select
                          className={""}
                          name="account_contact_status"
                          value={newFormData?.shipping_contact?.account_contact_status}
                          onChange={(e) => handleInputChange(e, 'shipping_contact')}
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

                    <SubFormAdmin
                      altTrainerForm={shippingContactPhone}
                      setSubFormData={setShippingContactPhone}
                      increaseAlternative={increaseShippingContactPhone}
                      decreaseAlternative={decreaseShippingContactPhone}
                      handleInputChange={(e) => {
                        handleInputChange(e);
                      }}
                      allDropDowns={allDropDowns}
                      formData={newFormData?.shipping_contact_phone}
                      formName={"shipping_contact_phone"}
                      setFormData={setNewFormData}
                      noBtns={true}
                      setPhoneValidations={setPhoneValidations}
                      phoneValidations={phoneValidations}
                      setSubFormPhoneValidated={setSubFormPhoneValidated}
                    />

                    <MultiEmailFormAdmin
                      setFormData={setNewFormData}
                      altTrainerForm={shippingContactMail}
                      setSubFormData={setShippingContactMail}
                      increaseAlternative={ShippingMultiEmailFormIncrease}
                      decreaseAlternative={ShippingMultiEmailFormDecrease}
                      handleInputChange={(e) => {
                        handleInputChange(e);
                      }}
                      allDropDowns={allDropDowns}
                      emailFormData={newFormData?.shipping_contact_email}
                      formName={"shipping_contact_email"}
                    />

                  </div>
                </>
                :
                <></>
            }


            {/*Alternate Training Information */}
            {
              newFormData?.site_details?.alternate_training ?
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
                      <Form.Group className={"col"}>
                        <MultiTrainingFrom
                          altTrainerForm={traininglocation}
                          setSubFormData={setTraininglocation}
                          increaseAlternative={IncreaseTrainningLocation}
                          decreaseAlternative={DecreaseTrainningLocation}
                          handleInputChange={(e) => {
                            handleInputChange(e, 'traininglocation');
                          }}
                          allDropDowns={allDropDowns}
                          noBtns={false}
                          fieldsRequired={true}
                          countriesList={countryList}
                          setTrainingPhoneValidations={setTrainingPhoneValidations}
                          validated={validated}
                          setValidateField={setValidateField}
                        />
                      </Form.Group>

                    </div>

                  </div>
             </>
                :
                <></>
            }

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
                value={newFormData.technicians.primary}
            onChange={handleTechniciansPrimarySelectChange}
              >
                <option value="0" selected>
                  --Select One--
                </option>
                {techniciansData.map((item, index) => {
                  if(item.account_main_contact_id !== newFormData.technicians.backup){
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
              value={newFormData.technicians.backup}
              onChange={handleTechniciansBackupSelectChange}
            >
              <option value="0" selected>
                --Select One--
              </option>
              {techniciansData.map((item, index) => {
                if(item.account_main_contact_id !== newFormData.technicians.primary){
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

            <div className="row pb-3 py-5" >
              <div className="col-12 content-flex-right" >
                <button className="btn btn-danger text-uppercase" type="button" onClick={() => navigate(-1)}>Cancel</button>
                <button className="btn btn-success text-uppercase ms-2" type="submit" >Submit</button>
              </div>
            </div>

            {/*<ProductModal
              ProductShowModal={productShowModel}
              setProductShowModal={setProductShowModal}
              ProductModalData={ProductModalData}
              setProductModalData={setProductModalData}
              SelectedProductsData={SelectedProductsData}
              setSelectedProductData={setSelectedProductData}
            />*/}

            <AccountReps
              ShowRepsModal={ShowAccRepsModal}
              SetShowRepsModal={setShowAccRepsModal}
              setSelectAccReps={setSelectAccReps}
              setAccReps={setAccReps}
              AccReps={AccReps}
              setAccRepsList={setAccRepsList}
              AccRepsList={AccRepsList}
              resultData={repsData}
              setRepsData={setRepsData}
              // type="newSiteReps"
              type='newAccountSiteReps'
            />

            <AdminMainContactMailModal
              open={openMailModal}
              mailModalTitle={mailModalTitle}
              hanldeModal={setOpenMailModal}
              setNewFormData={setNewFormData}
              newFormData={newFormData}
              emailDataList={modalMailtype}
              mailObjName={mailObjName}
              dataType={'email'}
              setSubFormData={setMultiEmailFormCount}
              saveForm={saveForm}
              handleContinue={handleSubmit}
            />

            <AdminMainContactPhoneModal
              open={openPhoneModal}
              mailModalTitle={phoneModalTitle}
              hanldeModal={setOpenPhoneModal}
              setNewFormData={setNewFormData}
              newFormData={newFormData}
              emailDataList={modalPhonetype}
              mailObjName={phoneObjName}
              dataType={'phone'}
              setSubFormData={setAltTrainerForm1}
              saveForm={saveForm}
              handleContinue={handleSubmit}
            />

          </div>
        </Form >
      </div >
    </>
  )
}

export default AdminAccount;
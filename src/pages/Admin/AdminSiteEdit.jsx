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
  AssignedRepList,
  AssignedSiteContactList,
  ContactList,
  DecryptToken,
  FetchDropDowns,
  GetCountries,
  ModalAccReps,
  ModalAccSiteReps,
  ProductsDropDown,
  SiteContactRepList,
  SiteRepsDropDown,
} from "../../helper/BasicFn";
import { prepareOptions, validatePhone } from "../../helper/Common";
import AccountReps from "../../components/modals/accountReps";
import ContactModel from "../../components/modals/ContactModel";
import { CallDetails, CallGETAPI, CallPOSTAPI } from "../../helper/API";
// import MultiTrainingFrom from "../../components/forms/MultiTrainingFrom";
import AdminMultiTrainingFrom from "./AdminMultiTrainingFrom";
import { toast } from "react-toastify";
import { Checkbox, FormControlLabel, Icon, Radio, Switch } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AdminContactModel from "./AdminContactModel";
import AdminAccountReps from "./AdminAccountReps";
import Loading from "../../pages/accounts/Loading";

const AdminSiteEdit = () => {
  const { accountId, siteId } = useParams();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(true)
  const [StateAbreaviation, setStateAbreaviation] = useState("");
  const [adminContactModelData, setAdminContactModelData] = useState([]);
  const [adminAccountModelData, setAdminAccountModelData] = useState([]);
  const [ProductModalData, setProductModalData] = useState([]);
  const [editSiteAdmin, setEditSiteAdmin] = useState("");
  const user = DecryptToken();
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
    // alternate_training: 0,

    // Site contact
    site_contact_salutation: "",
    site_contact_firstname: "",
    site_contact_middlename: "",
    site_contact_lastname: "",
    site_contact_suffix: "",
    site_contact_title: "",
    site_contact_department: "",
    site_contact_status: "",
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
    billing_contact_status: "",
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
    shipping_contact_status: "",
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
  const [techniciansData, setTechniciansData] = useState([]);

  const [open, setOpen] = useState({
    sundayopen:    0,
    mondayopen:    0,
    tuesdayopen:   0,
    wednesdayopen: 0,
    thursdayopen:  0,
    fridayopen:    0,
    saturdayopen:  0,
  });

  const handleRadioChange = (openKey, closeopenKey) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [openKey]: prevOpen[openKey] === 0 ? 1 : 0,
    }));

    setFormData((prevOpen) => ({
      ...prevOpen,
      [openKey]: prevOpen[openKey] === 'Closed' ? '' : 'Closed',
      [closeopenKey]: prevOpen[closeopenKey] === 'Closed' ? '' : 'Closed',
    }));

  };

  const siteHoursobj = {
    sundayopen: "",
    mondayopen: "",
    tuesdayopen: "",
    wednesdayopen: "",
    thrusdayopen: "",
    fridayopen: "",
    saturdayopen: "",
    sundayclose: "",
    mondayclose: "",
    tuesdayclose: "",
    wednesdayclose: "",
    thrusdayclose: "",
    fridayclose: "",
    saturdayclose: "",
  }

  
  function compareSiteHours(siteHoursObj, receivedSiteHoursObj) {
    for (const key in siteHoursObj) {
        if (siteHoursObj?.hasOwnProperty(key)) {
            if (receivedSiteHoursObj?.hasOwnProperty(key) && siteHoursObj[key] !== receivedSiteHoursObj[key]) {
                return false;
            }
        }
    }
    return true;
}

const getData = async () => {
  let data = await AssignedRepList(siteId);
  if (data?.status) {
    if (!data.data.status) {
      let response = await CallDetails(accountId);
      setRepsData(response?.data?.data?.accountReps);
      return response?.data?.data?.accountReps;
    } else {
      setRepsData(data?.data?.siteRepstList);
      return data?.data?.siteRepstList;
    }
  }
  return "";
};

  const fetchOnload = async () => {
    let repsListData = await getData();
    let AllDResult = await FetchDropDowns();
    if (AllDResult) {
      setAllDropDowns(AllDResult);
    }

    let AccResult = await ModalAccSiteReps();
    // let AccResult = await ModalAccReps();
    let AccreptList = await SiteRepsDropDown();
    let AccountContactList = await ContactList(accountId);
    let AccountContectRepList = await SiteContactRepList();
    let AssignContectRepListData = await AssignedSiteContactList(siteId);

    let CheckMarkList = [];
    if (AccResult) {
      let List = [];
      for (let index = 0; index < AccResult.length; index++) {
        const AccEle = AccResult[index];
        let obj = { ...AccEle };
        let findPPrimaryId = repsListData.find(
          (e) => e.position_id === AccEle.position_id && e.is_primary != 0
        );
        let findPBackupId = repsListData.find(
          (e) => e.position_id === AccEle.position_id && e.is_backup != 0
        );
        obj.backup = { id: "", val: "" };
        obj.primary = { id: "", val: "" };
        obj.contact_id = "";

        if (findPPrimaryId) {
          obj.contact_id = "";
          obj.id = findPPrimaryId.id;
          let GetVal = AccreptList.find(
            (e) =>
              e?.account_main_contact_id === findPPrimaryId.contact_id &&
              findPPrimaryId.is_primary != 0
          );

          CheckMarkList.push(GetVal?.account_main_contact_id);
          obj.primary = {
            e_id: findPPrimaryId.id,
            id: findPPrimaryId.contact_id,
            val:
              GetVal?.account_main_contact_firstname +
              " " +
              GetVal?.account_main_contact_lastname,
          };
        }
        if (findPBackupId) {
          obj.id = findPBackupId.id;
          let GetVal = AccreptList.find(
            (e) =>
              e?.account_main_contact_id === findPBackupId.contact_id &&
              findPBackupId.is_backup != 0
          );
          CheckMarkList.push(GetVal?.account_main_contact_id);
          obj.backup = {
            e_id: findPBackupId.id,
            id: findPBackupId.contact_id,
            val:
              GetVal?.account_main_contact_firstname +
              " " +
              GetVal?.account_main_contact_lastname,
          };
        }
        List.push(obj);
      }
      setAccReps(List);

      setFormData((prevFormData) => ({
        ...prevFormData,
        technicians: {
          primary: List[0]?.primary?.id,
          backup: List[0]?.backup?.id,
        },
      }));

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
          CheckContactList.push(GetVal?.contact_id);
          let parr = findPBackupId.permissions
            ? findPBackupId.permissions.split(",")
            : [];
          obj.backup = {
            e_id: findPBackupId.id,
            id: findPBackupId.contact_id,
            val: GetVal?.contact_name,
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
    setLoading(false);
  };


  // const fetchOnload = async () => {
  //   let repsListData = await getData();
  //   let ProductResult = await ProductsDropDown();
  //   if (ProductResult) {
  //     setProductModalData(ProductResult?.products);
  //   }

  //   let AllDResult = await FetchDropDowns();
  //   if (AllDResult) {
  //     setAllDropDowns(AllDResult);
  //   }

  //   let AccResult = await ModalAccSiteReps();
  //   let AccreptList = await AccRepsDropDown();
  //   // let AccountContactList        = await ContactList(siteId)
  //   let AccountContactList = await ContactList(accountId);
  //   let AccountContectRepList = await SiteContactRepList();
  //   let AssignContectRepListData = await AssignedSiteContactList(siteId);

  //   let CheckMarkList = [];
  //   if (AccResult) {
  //     let List = [];
  //     for (let index = 0; index < AccResult.length; index++) {
  //       const AccEle = AccResult[index];
  //       let obj = { ...AccEle };
  //       let findPPrimaryId = repsListData.find(
  //         (e) => e.position_id === AccEle.position_id && e.is_primary != 0
  //       );
  //       let findPBackupId = repsListData.find(
  //         (e) => e.position_id === AccEle.position_id && e.is_backup != 0
  //       );

  //       obj.backup = { id: "", val: "" };
  //       obj.primary = { id: "", val: "" };
  //       obj.contact_id = "";

  //       if (findPPrimaryId) {
  //         obj.contact_id = "";
  //         obj.id = findPPrimaryId.id;
  //         let GetVal = AccreptList.find(
  //           (e) =>
  //             e.account_main_contact_id === findPPrimaryId.contact_id &&
  //             findPPrimaryId.is_primary != 0
  //         );
  //         CheckMarkList.push(GetVal.account_main_contact_id);
  //         obj.primary = {
  //           e_id: findPPrimaryId.id,
  //           id: findPPrimaryId.contact_id,
  //           val:
  //             GetVal.account_main_contact_firstname +
  //             " " +
  //             GetVal.account_main_contact_lastname,
  //         };
  //       }
  //       if (findPBackupId) {
  //         obj.id = findPBackupId.id;
  //         let GetVal = AccreptList.find(
  //           (e) =>
  //             e.account_main_contact_id === findPBackupId.contact_id &&
  //             findPBackupId.is_backup != 0
  //         );
  //         CheckMarkList.push(GetVal.account_main_contact_id);
  //         obj.backup = {
  //           e_id: findPBackupId.id,
  //           id: findPBackupId.contact_id,
  //           val:
  //             GetVal.account_main_contact_firstname +
  //             " " +
  //             GetVal.account_main_contact_lastname,
  //         };
  //       }
  //       List.push(obj);
  //     }

  //     setAccReps(List);
  //   }

  //   if (AccreptList) {
  //     let RepList = [];

  //     for (let index = 0; index < AccreptList.length; index++) {
  //       const RepElement = AccreptList[index];
  //       let obj = { ...RepElement };
  //       let FindData = CheckMarkList.find(
  //         (e) => e === RepElement.account_main_contact_id
  //       );
  //       if (FindData) {
  //         obj.is_selected = false;
  //       } else {
  //         obj.is_selected = false;
  //       }
  //       obj.primary = { id: "", val: "" };
  //       obj.backup = { id: "", val: "" };
  //       RepList.push(obj);
  //     }
  //     setAccRepsList(RepList);
  //   }

  //   let CheckContactList = [];
  //   if (AccountContectRepList) {
  //     let RepList = [];

  //     for (let index = 0; index < AccountContectRepList.length; index++) {
  //       const RepElement = AccountContectRepList[index];
  //       let obj = { ...RepElement, id: "" };

  //       let findPPrimaryId = AssignContectRepListData
  //         ? AssignContectRepListData.find(
  //             (e) =>
  //               e.position_id === RepElement.position_id && e.is_primary != 0
  //           )
  //         : "";
  //       let findPBackupId = AssignContectRepListData
  //         ? AssignContectRepListData.find(
  //             (e) =>
  //               e.position_id === RepElement.position_id && e.is_backup != 0
  //           )
  //         : "";

  //       obj.backup = { id: "", val: "", permissions: [] };
  //       obj.primary = { id: "", val: "", permissions: [] };
  //       obj.contact_id = obj.contact_id;

  //       function onlyUnique(value, index, self) {
  //         return self.indexOf(value) === index;
  //       }
  //       if (findPPrimaryId) {
  //         obj.id = findPPrimaryId?.id;
  //         let GetVal = AccountContactList.find(
  //           (e) =>
  //             e.contact_id === findPPrimaryId.contact_id &&
  //             findPPrimaryId.is_primary != 0
  //         );
  //         CheckContactList.push(GetVal.contact_id);
  //         let parr = findPPrimaryId?.permissions
  //           ? findPPrimaryId?.permissions.split(",")
  //           : [];
  //         obj.primary = {
  //           e_id: findPPrimaryId.id,
  //           id: findPPrimaryId.contact_id,
  //           val: GetVal.contact_name,
  //           permissions: parr,
  //         };
  //         obj.primary.permissions = obj.primary.permissions.filter(onlyUnique);
  //       }

  //       if (findPBackupId) {
  //         obj.id = findPBackupId?.id;
  //         let GetVal = AccountContactList.find(
  //           (e) =>
  //             e.contact_id === findPBackupId.contact_id &&
  //             findPBackupId.is_backup != 0
  //         );
  //         CheckContactList.push(GetVal.contact_id);
  //         let parr = findPBackupId.permissions
  //           ? findPBackupId.permissions.split(",")
  //           : [];
  //         obj.backup = {
  //           e_id: findPBackupId.id,
  //           id: findPBackupId.contact_id,
  //           val: GetVal.contact_name,
  //           permissions: parr,
  //         };
  //         obj.backup.permissions = obj.backup.permissions.filter(onlyUnique);
  //       }

  //       RepList.push(obj);
  //     }
  //     setContactRepsList(RepList);
  //   }

  //   if (AccountContactList) {
  //     let List = [];
  //     for (let index = 0; index < AccountContactList.length; index++) {
  //       const AccEle = AccountContactList[index];
  //       let obj = { ...AccEle };
  //       let FindData = CheckContactList.find((e) => e === obj.contact_id);

  //       obj.backup = { id: "", val: "", permissions: [] };
  //       obj.primary = { id: "", val: "", permissions: [] };
  //       obj.contact_id = obj.contact_id;

  //       if (FindData) {
  //         obj.is_selected = false;
  //       } else {
  //         obj.is_selected = false;
  //       }
  //       List.push(obj);
  //     }
  //     setContactReps(List);
  //   }

  //   // get country
  //   const countries = await GetCountries();
  //   if (countries?.status) {
  //     let Allcountries = countries?.country;
  //     let countriesData = prepareOptions(Allcountries, "id", "country_name");
  //     setCountryList(countriesData);

  //     // if (EditsiteData?.account_site_country_id) {
  //     //   const country = countriesData.find(
  //     //     (country) =>
  //     //       country?.value == parseInt(EditsiteData?.account_site_country_id)
  //     //   );
  //     //   setSelectedCountry((old) => ({
  //     //     ...old,
  //     //     account_site_country: {
  //     //       label: country?.label,
  //     //       value: country?.value,
  //     //     },
  //     //   }));
  //     //   setFormData((old) => ({ ...old, account_site_country: country.value }));
  //     // } else {
  //     //   setSelectedCountry((old) => ({
  //     //     ...old,
  //     //     account_site_country: {
  //     //       label: countriesData[230].label,
  //     //       value: countriesData[230].value,
  //     //     },
  //     //   }));
  //     //   setFormData((old) => ({
  //     //     ...old,
  //     //     account_site_country: countriesData[230].value,
  //     //   }));
  //     // }

  //     // if (EditbillingData?.account_billing_info_country_id) {
  //     //   const country = countriesData.find(
  //     //     (country) =>
  //     //       country?.value ==
  //     //       parseInt(EditbillingData?.account_billing_info_country_id)
  //     //   );
  //     //   setSelectedCountry((old) => ({
  //     //     ...old,
  //     //     account_billing_info_country: {
  //     //       label: country?.label,
  //     //       value: country?.value,
  //     //     },
  //     //   }));
  //     //   setFormData((old) => ({
  //     //     ...old,
  //     //     account_billing_info_country: country.value,
  //     //   }));
  //     // } else {
  //     //   setSelectedCountry((old) => ({
  //     //     ...old,
  //     //     account_billing_info_country: {
  //     //       label: countriesData[230].label,
  //     //       value: countriesData[230].value,
  //     //     },
  //     //   }));
  //     //   setFormData((old) => ({
  //     //     ...old,
  //     //     account_billing_info_country: countriesData[230].value,
  //     //   }));
  //     // }

  //     // if (EditshippingData?.account_shipping_info_country_id) {
  //     //   const country = countriesData.find(
  //     //     (country) =>
  //     //       country?.value ==
  //     //       parseInt(EditshippingData?.account_shipping_info_country_id)
  //     //   );
  //     //   setSelectedCountry((old) => ({
  //     //     ...old,
  //     //     account_shipping_info_country: {
  //     //       label: country?.label,
  //     //       value: country?.value,
  //     //     },
  //     //   }));
  //     //   setFormData((old) => ({
  //     //     ...old,
  //     //     account_shipping_info_country: country.value,
  //     //   }));
  //     // } else {
  //     //   setSelectedCountry((old) => ({
  //     //     ...old,
  //     //     account_shipping_info_country: {
  //     //       label: countriesData[230].label,
  //     //       value: countriesData[230].value,
  //     //     },
  //     //   }));
  //     //   setFormData((old) => ({
  //     //     ...old,
  //     //     account_shipping_info_country: countriesData[230].value,
  //     //   }));
  //     // }
  //   }

  //   setShowLoading(false);
  // };

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
    {
      phone_number: "",
      ext: "",
      phone_type_id: 0,
      main: 0,
    },
  ]);

  const [altTrainerForm1Billing, setAltTrainerForm1Billing] = useState([
    {
      phone_number: "",
      ext: "",
      phone_type_id: 0,
      main: 0,
    },
  ]);

  const [altTrainerForm1Shipping, setAltTrainerForm1Shipping] = useState([
    {
      phone_number: "",
      ext: "",
      phone_type_id: 0,
      main: 0,
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
      phone_number: "",
      ext: "",
      phone_type_id: "",
      main: "",
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

  const decreaseAlternative1 = (section) => {
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

    if (section === "site" && altTrainerForm1Site.length > 1) {
      arr.pop();
      setAltTrainerForm1Site(arr);
    }
    if (section === "billing" && altTrainerForm1Billing.length > 1) {
      arr.pop();
      setAltTrainerForm1Billing(arr);
    }
    if (section === "shipping" && altTrainerForm1Shipping.length > 1) {
      arr.pop();
      setAltTrainerForm1Shipping(arr);
    }
  };

  const [multiEmailFormCountSite, setMultiEmailFormCountSite] = useState([
    {
      email: "",
      email_type: "0",
      main: 0,
    },
  ]);

  const [multiEmailFormCountBilling, setMultiEmailFormCountBilling] = useState([
    {
      email: "",
      email_type: "0",
      main: 0,
    },
  ]);

  const [multiEmailFormCountShipping, setMultiEmailFormCountShipping] =
    useState([
      {
        email: "",
        email_type: "0",
        main: 0,
      },
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
      email: "",
      email_type: "0",
      main: 0,
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

  const MultiEmailFormDecrease = (section) => {
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

    if (section === "site" && multiEmailFormCountSite.length > 1) {
      arr.pop();
      setMultiEmailFormCountSite(arr);
    }
    if (section === "billing" && multiEmailFormCountBilling.length > 1) {
      arr.pop();
      setMultiEmailFormCountBilling(arr);
    }
    if (section === "shipping" && multiEmailFormCountShipping.length > 1) {
      arr.pop();
      setMultiEmailFormCountShipping(arr);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    let techRepsValueArray = [];
    if(formData?.technicians?.primary || !formData?.technicians?.primary){
      techRepsValueArray.push({id: AccReps[0]?.primary?.e_id || "", position_id: 13, contact_id: formData.technicians.primary === 0 ? "" : formData.technicians.primary, is_primary: 1, is_backup: 0, set_order: 1})
    }
    if(formData?.technicians?.backup || !formData?.technicians?.backup){
      techRepsValueArray.push({id: AccReps[0]?.backup?.e_id || "", position_id: 13, contact_id: formData.technicians.backup === 0 ? "" : formData.technicians.backup, is_primary: 0, is_backup: 1, set_order: 2})
    }
    
    const payload = {
      account_id: accountId,
      site_id: siteId,
      site_details: {
        account_site_info_id: editSiteAdmin?.siteData?.account_site_info_id,
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
        // alternate_training: formData?.alternate_training,
      },
      // site_contact: {
      //   account_main_contact_salutation: formData?.site_contact_salutation,
      //   account_main_contact_firstname: formData?.site_contact_firstname,
      //   account_main_contact_middlename: formData?.site_contact_middlename,
      //   account_main_contact_lastname: formData?.site_contact_lastname,
      //   account_main_contact_suffix: formData?.site_contact_suffix,
      //   account_main_contact_title: formData?.site_contact_title,
      //   account_main_contact_department: formData?.site_contact_department,
      //   account_main_contact_status: formData?.site_contact_status,
      // },
      // site_contact_phone: formData?.site_contact_phone,
      // site_contact_email: formData?.site_contact_email,

      siteHoursData: {
        site_hour_id: editSiteAdmin?.siteHours?.site_hour_id,
        sundayopen: open?.sundayopen === 0 ? formData?.sundayopen : "Closed",
        mondayopen: open?.mondayopen === 0 ? formData?.mondayopen : "Closed",
        tuesdayopen: open?.tuesdayopen === 0 ? formData?.tuesdayopen : "Closed",
        wednesdayopen:
          open?.wednesdayopen === 0 ? formData?.wednesdayopen : "Closed",
        thrusdayopen:
          open?.thursdayopen === 0 ? formData?.thursdayopen : "Closed",
        fridayopen: open?.fridayopen === 0 ? formData?.fridayopen : "Closed",
        saturdayopen:
          open?.saturdayopen === 0 ? formData?.saturdayopen : "Closed",
        sundayclosed: open?.sundayopen === 0 ? formData?.sundayclose : "Closed",
        mondayclosed: open?.mondayopen === 0 ? formData?.mondayclose : "Closed",
        tuesdayclosed:
          open?.tuesdayopen === 0 ? formData?.tuesdayclose : "Closed",
        wednesdayclosed:
          open?.wednesdayopen === 0 ? formData?.wednesdayclose : "Closed",
        thrusdayclosed:
          open?.thursdayopen === 0 ? formData?.thursdayclose : "Closed",
        fridayclosed: open?.fridayopen === 0 ? formData?.fridayclose : "Closed",
        saturdayclosed:
          open?.saturdayopen === 0 ? formData?.saturdayclose : "Closed",
      },

      billing_details: {
        account_billing_info_id: editSiteAdmin?.billingData?.account_billing_info_id,
        account_billing_info_address1: formData?.account_billing_info_address1,
        account_billing_info_address2: formData?.account_billing_info_address2,
        account_billing_info_city: formData?.account_billing_info_city,
        account_billing_info_state: formData?.account_billing_info_state,
        account_billing_info_country: formData?.account_billing_info_country,
        account_billing_info_zipcode: formData?.account_billing_info_zipcode,
      },

      // billing_contact: {
      //   account_main_contact_salutation: formData?.billing_contact_salutation,
      //   account_main_contact_firstname: formData?.billing_contact_firstname,
      //   account_main_contact_middlename: formData?.billing_contact_middlename,
      //   account_main_contact_lastname: formData?.billing_contact_lastname,
      //   account_main_contact_suffix: formData?.billing_contact_suffix,
      //   account_main_contact_title: formData?.billing_contact_title,
      //   account_main_contact_department: formData?.billing_contact_department,
      //   account_main_contact_status: formData?.billing_contact_status,
      // },
      // billing_contact_phone: formData?.billing_contact_phone,
      // billing_contact_email: formData?.billing_contact_email,

      shipping_details: {
        account_shipping_info_id: editSiteAdmin?.shippingData?.account_shipping_info_id,
        account_shipping_info_address1:
          formData?.account_shipping_info_address1,
        account_shipping_info_address2:
          formData?.account_shipping_info_address2,
        account_shipping_info_city: formData?.account_shipping_info_city,
        account_shipping_info_state: formData?.account_shipping_info_state,
        account_shipping_info_country: formData?.account_shipping_info_country,
        account_shipping_info_zipcode: formData?.account_shipping_info_zipcode,
      },

      // shipping_contact: {
      //   account_main_contact_salutation: formData?.shipping_contact_salutation,
      //   account_main_contact_firstname: formData?.shipping_contact_firstname,
      //   account_main_contact_middlename: formData?.shipping_contact_middlename,
      //   account_main_contact_lastname: formData?.shipping_contact_lastname,
      //   account_main_contact_suffix: formData?.shipping_contact_suffix,
      //   account_main_contact_title: formData?.shipping_contact_title,
      //   account_main_contact_department: formData?.shipping_contact_department,
      //   account_main_contact_status: formData?.shipping_contact_status,
      // },
      // shipping_contact_phone: formData?.shipping_contact_phone,
      // shipping_contact_email: formData?.shipping_contact_email,

      // traininglocation: traininglocation,
      // site_reps: adminAccountModelData ? adminAccountModelData : "",
      site_reps: techRepsValueArray,
      contact_reps: adminContactModelData?.site_contact
        ? adminContactModelData?.site_contact
        : "",
    };


    const res = await CallPOSTAPI("admin/update-site-details/" + siteId, payload);
    if (res?.data?.status) {
      toast.success(res?.data?.msg);
      if(user?.user_type === 0 || (user?.user_type === 2 && user?.sub_admin != "")) {
      navigate("/account/site-details/" + siteId)
      } else {
        navigate("/user/site-details/" + siteId)
      }
      //  {
      //     state: {
      //       tab: "Sites",
      //       type: res?.data?.status,
      //       msg: res?.data?.msg,
      //     },
      //   });
      setFormData("");
    } else {
      toast.error(res?.data?.msg);
    }
  };

  const fetchEditData = async () => {
    const res = await CallGETAPI("admin/edit-site-details/" + siteId);
    if (res) {
      setEditSiteAdmin(res?.data);
    }

    // formData?.account_site_address1 = res?.data?.siteData?.account_site_address1;
  };

  useEffect(() => {
    fetchEditData();
  }, []);

  useEffect(() => {
    if (editSiteAdmin) {
      var firstContact;
      const sitePocDetail = editSiteAdmin?.sitePocContact[0];
      const PocContactDetail = sitePocDetail?.siteContactDetail;

      const billingDetail = editSiteAdmin?.billingContact[0];

      const shippingDetail = editSiteAdmin?.shippingContact[0];

      setFormData((prevFormData) => ({
        ...prevFormData,
        account_site_address1:
          editSiteAdmin?.siteData?.account_site_address1 || "",
        account_site_address2:
          editSiteAdmin?.siteData?.account_site_address2 || "",
        building_name: editSiteAdmin?.siteData?.building_name || "",
        account_site_city: editSiteAdmin?.siteData?.account_site_city || "",
        account_site_state:
          editSiteAdmin?.siteData?.account_site_state_id || "",
        account_site_zipcode:
          editSiteAdmin?.siteData?.account_site_zipcode || "",
        generate_name_toggle: editSiteAdmin?.siteData?.account_site_name == "" ? 0 : 1,
        account_site_name: editSiteAdmin?.siteData?.account_site_name || "",
        account_site_phone: editSiteAdmin?.siteData?.account_site_phone || "",
        account_site_info_phone_ext: editSiteAdmin?.siteData?.account_site_phone_ext || "",
        // account_site_zipcode: editSiteAdmin?.siteData?.account_site_zipcode || "",
        account_site_status_id:
          editSiteAdmin?.siteData?.account_site_status_id || "",
        invoice_asap: editSiteAdmin?.billingData?.billing_is_invoice == 0 ? 0 : 1,  // invoice asap
        call_ahead: editSiteAdmin?.siteData?.account_site_call_ahead == 0 ? 0 : 1,
        out_of_area: editSiteAdmin?.siteData?.out_of_area == 0 ? 0 : 1,
        security_clearance: editSiteAdmin?.siteData?.security_clearence == 0 ? 0 : 1,  // Security clearance
        requires_escort: editSiteAdmin?.siteData?.requires_escort == 0 ? 0 : 1,
        site_hours: compareSiteHours(siteHoursobj, editSiteAdmin?.siteHours) == true ? 0 : 1,
        same_billing_address: editSiteAdmin?.siteData?.same_billing_address == 0 ? 0 : 1, // same Billing
        same_shipping_address: editSiteAdmin?.siteData?.same_shipping_address == 0 ? 0 : 1, // Same Shipping

        // Billing Address
        account_billing_info_address1:
          editSiteAdmin?.billingData?.account_billing_info_address1 || "",
        account_billing_info_address2:
          editSiteAdmin?.billingData?.account_billing_info_address2 || "",
        account_billing_info_city:
          editSiteAdmin?.billingData?.account_billing_info_city || "",
        account_billing_info_state:
          editSiteAdmin?.billingData?.account_billing_info_state_id || "",
        account_billing_info_country:
          editSiteAdmin?.billingData?.account_billing_info_country_id || "",
        account_billing_info_zipcode:
          editSiteAdmin?.billingData?.account_billing_info_zipcode || "",

        // Shipping Address
        account_shipping_info_address1:
          editSiteAdmin?.shippingData?.account_shipping_info_address1 || "",
        account_shipping_info_address2:
          editSiteAdmin?.shippingData?.account_shipping_info_address2 || "",
        account_shipping_info_city:
          editSiteAdmin?.shippingData?.account_shipping_info_city || "",
        account_shipping_info_state:
          editSiteAdmin?.shippingData?.account_shipping_info_state_id || "",
        account_shipping_info_country:
          editSiteAdmin?.shippingData?.account_shipping_info_country_id || "",
        account_shipping_info_zipcode:
          editSiteAdmin?.shippingData?.account_shipping_info_zipcode || "",

        // Site Hours
        sundayopen: editSiteAdmin?.siteHours?.sundayopen || "",
        mondayopen: editSiteAdmin?.siteHours?.mondayopen || "",
        tuesdayopen: editSiteAdmin?.siteHours?.tuesdayopen || "",
        wednesdayopen: editSiteAdmin?.siteHours?.wednesdayopen || "",
        thursdayopen: editSiteAdmin?.siteHours?.thrusdayopen || "",
        fridayopen: editSiteAdmin?.siteHours?.fridayopen || "",
        saturdayopen: editSiteAdmin?.siteHours?.saturdayopen || "",
        sundayclose: editSiteAdmin?.siteHours?.sundayclosed || "",
        mondayclose: editSiteAdmin?.siteHours?.mondayclosed || "",
        tuesdayclose: editSiteAdmin?.siteHours?.tuesdayclosed || "",
        wednesdayclose: editSiteAdmin?.siteHours?.wednesdayclosed || "",
        thursdayclose: editSiteAdmin?.siteHours?.thrusdayclosed || "",
        fridayclose: editSiteAdmin?.siteHours?.fridayclosed || "",
        saturdayclose: editSiteAdmin?.siteHours?.saturdayclosed || "",


      }));

      // setOpen((prev) => ({
      //   ...prev,
      //   sundayopen: editSiteAdmin?.siteHours?.sundayopen == "Closed" || "closed" ? 1 : 0,
      //   mondayopen: editSiteAdmin?.siteHours?.mondayopen == "Closed" || "closed" ? 1 : 0,
      //   tuesdayopen: editSiteAdmin?.siteHours?.tuesdayopen == "Closed" || "closed" ? 1 : 0,
      //   wednesdayopen: editSiteAdmin?.siteHours?.wednesdayopen == "Closed" || "closed" ? 1 : 0,
      //   thursdayopen: editSiteAdmin?.siteHours?.thrusdayopen == "Closed" || "closed" ? 1 : 0,
      //   fridayopen: editSiteAdmin?.siteHours?.fridayopen == "Closed" || "closed" ? 1 : 0,
      //   saturdayopen: editSiteAdmin?.siteHours?.saturdayopen == "Closed" || "closed" ? 1 : 0,
      // }));
    }
  }, [editSiteAdmin]);

  useEffect(() => {
    setOpen((prev) => ({
      ...prev,
      sundayopen: formData?.sundayopen.toLowerCase() === "closed" ? 1 : 0,
      mondayopen: formData?.mondayopen.toLowerCase() === "closed" ? 1 : 0,
      tuesdayopen: formData?.tuesdayopen.toLowerCase() === "closed" ? 1 : 0,
      wednesdayopen: formData?.wednesdayopen.toLowerCase() === "closed" ? 1 : 0,
      thursdayopen: formData?.thursdayopen.toLowerCase() === "closed" ? 1 : 0,
      fridayopen: formData?.fridayopen.toLowerCase() === "closed" ? 1 : 0,
      saturdayopen: formData?.saturdayopen.toLowerCase() === "closed" ? 1 : 0,
    }));
  }, [formData]);
  


  // const [isGenerateBtn, setIsGenerateBtn] = useState(true)

  // useEffect(() => {
  //   if (
  //     formData?.account_site_name ||
  //     !formData?.account_site_state_abbreviation &&
  //     !formData?.account_site_address1 &&
  //     !formData?.account_site_city &&
  //     !formData?.account_site_address2 &&
  //     !formData?.building_name &&
  //     !formData?.account_site_zipcode
  //   ) {
  //     setIsGenerateBtn(false)
  //   }
  //   else {
  //     setIsGenerateBtn(true)
  //   }
  // }, [formData])

  let stateAbbr = formData?.account_site_state_abbreviation
  let generatedSiteName = (stateAbbr ? stateAbbr + ', ' : '') +
  (formData?.account_site_city ? formData.account_site_city + ' - ' : '') +
    formData?.account_site_address1 + 
    (formData?.building_name ? ' / ' + formData?.building_name : "");

  const handleGenerateSiteName = (e, type, name) => {
    if (!formData?.account_site_name || formData?.account_site_name) {
      setFormData({ ...formData, account_site_name: generatedSiteName })
    }
    else if (formData?.account_site_name && !formData?.account_site_name.includes(stateAbbr)) {
      setFormData({ ...formData, account_site_name: generatedSiteName })
    }
    // else {
    //   setFormData({ ...formData, account_site_name: '' })
    // }
  }

  if(editSiteAdmin){
  console.log(compareSiteHours(siteHoursobj, editSiteAdmin?.siteHours))
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
    {loading ?
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
          :
      <>
      <div className="mt-4" style={{ paddingInline: "45px" }}>
        <SubHeadingOther
          hideNew="tab"
          title="Edit Site"
          subHeading={true}
          hideHierarchy={true}
          bottomLinks={false}
        />

        {/* account resps and products popup buttons */}
        <div className="d-flex">
          <button
            className="btn text-primary"
            type="button"
            onClick={() => setContactShowModel(true)}
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
                <Form.Label>State * </Form.Label>

                <StateField
                  setFormData={setFormData}
                  valueKey="account_site_state"
                  selectedCountry={selectedCountry?.account_site_country?.value}
                  validated={validated}
                  required={true}
                  stateSelectedValue={formData?.account_site_state}
                  setStateAbreaviation={setFormData}
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
                <div className="my-4">
                  <BButton
                    // disabled={!isGenerateBtn}
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
                  value={formData?.account_site_phone}
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
                  value={formData?.account_site_info_phone_ext}
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

              {/* <div
                className="col"
                style={{ maxWidth: "70px", marginRight: "3%" }}
              >
                <Form.Group>
                  <b className={"d-block mb-3"}>Site POC</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="site_poc"
                      ToggleValue={formData?.site_poc}
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
              </div> */}

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

              {/* <div className="col" style={{ maxWidth: "130px" }}>
                <Form.Group>
                  <b className={"d-block mb-3"}>Billing Contact</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="billing_contact"
                      ToggleValue={formData?.billing_contact}
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
              </div> */}

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

              {/* <div className="col" style={{ maxWidth: "140px" }}>
                <Form.Group>
                  <b className={"d-block mb-3"}>Shipping Contact</b>
                  <div className="my-2">
                    <CustomToggleButton
                      ToggleName="shipping_contact"
                      ToggleValue={formData?.shipping_contact}
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
              </div> */}
            </div>
          </div>

          {/* Site Contact */}
          {/* {formData?.site_poc === 1 && (
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
                  decreaseAlternative={() => decreaseAlternative1("site")}
                  handleInputChange={(e) => {
                    handleInputChange(e);
                  }}
                  allDropDowns={allDropDowns}
                  formData={formData.site_contact_phone}
                  formName={"site_contact_phone"}
                  setFormData={setFormData}
                  noBtns={true}
                  setPhoneValidations={setPhoneValidations}
                  phoneValidations={phoneValidations}
                  setSubFormPhoneValidated={setSubFormPhoneValidated}
                />

                <MultiEmailForm
                  altTrainerForm={multiEmailFormCountSite}
                  setSubFormData={setMultiEmailFormCountSite}
                  increaseAlternative={() => MultiEmailFormIncrease("site")}
                  decreaseAlternative={() => MultiEmailFormDecrease("site")}
                  handleInputChange={(e) => {
                    handleInputChange(e);
                  }}
                  allDropDowns={allDropDowns}
                  formData={formData.site_contact_email}
                  formName={"main_contact_email"}
                  setFormData={setFormData}
                />
              </div>
            </>
          )} */}

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
                            onClick={() => handleRadioChange("sundayopen", 'sundayclose')}
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
                            onClick={() => handleRadioChange("mondayopen", 'mondayclose')}
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
                            onClick={() => handleRadioChange("tuesdayopen", 'tuesdayclose')}
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
                            onClick={() => handleRadioChange("wednesdayopen", 'wednesdayclose')}
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
                            onClick={() => handleRadioChange("thursdayopen", 'thursdayclose')}
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
                            onClick={() => handleRadioChange("fridayopen", 'fridayclose')}
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
                            onClick={() => handleRadioChange("saturdayopen", 'saturdayclose')}
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
          {/* {formData?.billing_contact === 1 && (
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
                  decreaseAlternative={() => decreaseAlternative1("billing")}
                  handleInputChange={(e) => {
                    handleInputChange(e);
                  }}
                  allDropDowns={allDropDowns}
                  formData={formData.billing_contact_phone}
                  formName={"billing_contact_phone"}
                  setFormData={setFormData}
                  noBtns={true}
                  setPhoneValidations={setPhoneValidations}
                  phoneValidations={phoneValidations}
                  setSubFormPhoneValidated={setSubFormPhoneValidated}
                />

                <MultiEmailForm
                  altTrainerForm={multiEmailFormCountBilling}
                  setSubFormData={setMultiEmailFormCountBilling}
                  increaseAlternative={() => MultiEmailFormIncrease("billing")}
                  decreaseAlternative={() => MultiEmailFormDecrease("billing")}
                  handleInputChange={(e) => {
                    handleInputChange(e);
                  }}
                  allDropDowns={allDropDowns}
                  formData={formData.billing_contact_email}
                  formName={"billing_contact_email"}
                  setFormData={setFormData}
                />
              </div>
            </>
          )} */}

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
          {/* {formData?.shipping_contact === 1 && (
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
                  decreaseAlternative={() => decreaseAlternative1("shipping")}
                  handleInputChange={(e) => {
                    handleInputChange(e);
                  }}
                  allDropDowns={allDropDowns}
                  formData={formData.shipping_contact_phone}
                  formName={"shipping_contact_phone"}
                  setFormData={setFormData}
                  noBtns={true}
                  setPhoneValidations={setPhoneValidations}
                  phoneValidations={phoneValidations}
                  setSubFormPhoneValidated={setSubFormPhoneValidated}
                />

                <MultiEmailForm
                  altTrainerForm={multiEmailFormCountShipping}
                  setSubFormData={setMultiEmailFormCountShipping}
                  increaseAlternative={() => MultiEmailFormIncrease("shipping")}
                  decreaseAlternative={() => MultiEmailFormDecrease("shipping")}
                  handleInputChange={(e) => {
                    handleInputChange(e);
                  }}
                  allDropDowns={allDropDowns}
                  formData={formData.shipping_contact_email}
                  formName={"shipping_contact_email"}
                  setFormData={setFormData}
                />
              </div>
            </>
          )} */}

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
              >
                Submit
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
            type="siteContact"
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

          {/* </div> */}
        </Form>
      </div>
      </>
    }
    </>
  );
};

export default AdminSiteEdit;

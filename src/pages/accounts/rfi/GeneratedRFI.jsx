import React, { useEffect, useState } from "react";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  ProductsDropDown,
  FetchDropDowns,
  GetCountries,
  GetRfiData,
  GetContactSelectedBySite,
  GetContactListByAccount,
  FetchAccountSiteDetails,
  GetSitesList,
  GetSitesAddressList,
} from "../../../helper/BasicFn";
import SubForm from "../../SubForm";
import MultiEmailForm from "../../../components/forms/MultiEmailForm";
import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import ClassDetails from "../../../components/modals/classDetailsComponent/ClassDetails";
import AedComponent from "../../../components/modals/AED/AedComponent";
import Select from "react-select";
import { prepareOptions, validatePhone } from "../../../helper/Common";
import { CallGETAPI, CallPOSTAPI, CallPOSTAPINEW } from "../../../helper/API";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import MessageHandler from "../../../components/common/MessageHandler";
import Modal from "@mui/material/Modal";
import NewContactModal from "../../../components/modals/newContactModal/NewContactModal";
import Loading from "../Loading";
import { useParams } from 'react-router-dom';

export default function GeneratedRFI() {

  const location = useLocation()
  const searchForParams = new URLSearchParams(location.search);
  const rfi_id = searchForParams.get('id');

  const navigate = useNavigate();
  const [ProductModalData, setProductModalData] = useState([]);
  const [allDropDowns, setAllDropDowns] = React.useState([]);
  const [allSites, setSites] = useState([]);
  const [allAddress, setAddress] = useState([]);
  const [allContactList, setAllContactList] = useState([]);
  const [countryList, setCountryList] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState({});
  const [statesList, setStateList] = React.useState({});
  const [selectedState, setSelectedState] = React.useState({});
  const [selectedData, setSelectedData] = React.useState({});
  const [contactData, setContactData] = React.useState({});
  const [trainingEditMode, setTrainingEditMode] = React.useState(false);
  const [FormMsg, setFormMsg] = useState({ type: true, msg: "" });
  const [aedData, setAedData] = useState([]);
  const [hideForm, setHideForm] = React.useState(true);
  const [formMessage, setFormMessage] = React.useState("Link has been expired");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(true);
  const [showContactModal, setShowContactModal] = React.useState(false);
  const [newData, setNewData] = React.useState({});
  // State to track if the "New" button has been clicked
  const [isNewButtonClicked, setIsNewButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false)

  const [classRowsData, setClassRowsData] = useState([
    {
      index: 1,
      course_name: "Class 1",
      date_time_option_1: "",
      date_time_option_2: "",
      date_time_option_3: "",
      is_primary: 0,
    },
  ]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 386,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [formData, setFormData] = useState({
    old_site_info: false,
    old_contact_info: false,
    old_billing_contact_info: false,
    same_address_company: false,
  });

  // for phone validations
  const [phoneValidations, setPhoneValidations] = useState({
    account_site_phone: false
    // account_billing_info_billing_phone: false,
    // account_shipping_info_shipping_phone: false,
  });

  const [studentFeild, setStudentFeild] = useState('')

  const [isInValid, setIsInvalid] = useState({
    date_time_option_1: false,
    date_time_option_2: false,
    date_time_option_3: false,
    expected_students: false
  })


  const [dateFeilds, setDateFeilds] = useState({
    'date_time_option_1': '',
    'date_time_option_2': '',
    'date_time_option_3': '',
  })

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    if (
      e.target.name == "account_site_phone" ||
      e.target.name == "alternative_phone"
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

  // handle select change
  const handleContactSelectChange = (data, key) => {
    setFormData((old) => ({ ...old, [key]: data.value }));
    setFormData((old) => ({ ...old, [key + "_name"]: data.label }));
  };

  // fecth states by country
  const fetchStatesByCountryId = async (key, value) => {
    const results = await CallGETAPI(
      "account/get-state-by-country/" + value?.value
    );
    if (results?.status) {
      let statesList = results?.data?.state;
      let statesData = prepareOptions(statesList, "state_id", "state_name");
      setStateList((old) => ({ ...old, [key]: statesData }));
      if (key == "companyStateList") {
        setSelectedState((old) => ({
          ...old,
          account_company_state: {
            label: statesData[0]?.label,
            value: statesData[0]?.value,
          },
        }));
        setFormData((old) => ({
          ...old,
          account_company_state: statesData[0].value,
        }));
      } else {
        setSelectedState((old) => ({
          ...old,
          account_training_state: {
            label: statesData[0]?.label,
            value: statesData[0]?.value,
          },
        }));
        setFormData((old) => ({
          ...old,
          account_training_state: statesData[0].value,
        }));
      }
    }
  };

  // handle select state change
  const handleSelectStateChange = (data, key) => {
    if (key == "select_site" || key == "select_site_training") {
      setSelectedData((old) => ({
        ...old,
        [key]: {
          label: data.label,
          value: data.value,
        },
      }));
      setNewData((old) => ({ ...old, [key]: false }));
    } else {
      setSelectedState((old) => ({
        ...old,
        [key]: {
          label: data.label,
          value: data.value,
        },
      }));
    }
    setFormData((old) => ({ ...old, [key]: data.value }));
  };

  const [multiEmailFormCount, setMultiEmailFormCount] = useState([
    {
      email: "",
      email_type: 1,
      main: 0,
    },
  ]);

  const MultiEmailFormIncrease = () => {
    let arr = [...multiEmailFormCount];
    let obj = {
      email: "",
      email_type: 1,
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

  // fetch data on load
  const fetchOnload = async () => {
    let ProductResult = await ProductsDropDown();
    if (ProductResult) {
      setProductModalData(ProductResult?.products);
    }

    let AllDResult = await FetchDropDowns();
    if (AllDResult) {
      setAllDropDowns(AllDResult);
    }

    // get rfi data function
    getGeneratedRfiData();
  };

  // get state list
  const getStateList = async (countryId) => {
    const results = await CallGETAPI(
      "account/get-state-by-country/" + countryId
    );
    if (results?.status) {
      return results?.data?.state;
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const [rfiData, setRfiData] = useState({});
  const [validated, setValidated] = useState(false);
  const [siteDetails, setSiteDetails] = useState([]);
  const [rowsDataValidation, setRowsDataValidation] = useState({});

  // filter country by countryId
  const filterCountry = (countryId) => {
    const country = countryList.find((country) => country.value == countryId);
    return country;
  };

  // fetch contact list
  const fetchAllContactList = async (id) => {
    // fetch accounts details
    let contactLists = await GetContactListByAccount(id);

    if (contactLists.status) {
      let contactListsData = contactLists?.data?.data?.contact_list;
      let allcontactListsData = prepareOptions(
        contactListsData,
        "contact_id",
        "contact_name"
      );
      setAllContactList(allcontactListsData);
    }
  };

  // handle new
  const handleNew = (key, val = true) => {
    setNewData((old) => ({ ...old, [key]: val }));
    setFormData((old) => ({ ...old, [key]: "" }));
    setSelectedData((old) => ({ ...old, [key]: false }));
  };

  // fecth states
  const fetchSelectedStates = async (key, stateId, countryId) => {
    const results = await CallGETAPI(
      "account/get-state-by-country/" + countryId
    );
    if (results?.status) {
      let statesList = results?.data?.state;
      let statesData = prepareOptions(statesList, "state_id", "state_name");

      const state = statesData.find((state) => state.value == stateId);

      setStateList((old) => ({ ...old, [key]: statesData }));
      setSelectedState((old) => ({
        ...old,
        account_company_state: {
          label: state?.label,
          value: state?.value,
        },
      }));
      setFormData((old) => ({ ...old, [key]: state?.value }));
    }
  };

  // fetch sites
  const fetchSiteAddress = async (siteId) => {
    let sitesAddress = await GetSitesAddressList(siteId);

    if (sitesAddress.status) {
      let sitesAddressData = sitesAddress?.data?.trainingLocations;
      if (sitesAddressData) {
        sitesAddressData.map((data, index) => {
          data.addressData =
            data?.account_alternate_traning_location_address1 +
            " " +
            data?.account_alternate_traning_location_address2 +
            " " +
            data?.account_alternate_traning_location_city +
            " " +
            data?.state_name +
            " " +
            data?.country_name +
            " " +
            data?.account_alternate_traning_location_zipcode;
        });

        let allSitesAddressData = prepareOptions(
          sitesAddressData,
          "account_alternate_traning_location_id",
          "addressData"
        );
        setAddress(allSitesAddressData);
      }
      // setSelectedData((old) => ({...old, ['select_site_training']: allSitesAddressData[0]}));
    }

    // site details
    let data = await FetchAccountSiteDetails(siteId);

    if (data) {
      let FD = formData;
      // setAccountData(data);
      let selectedSiteData = data?.siteData;
      setSiteDetails(selectedSiteData);
      // site details
      (FD.account_site_name = selectedSiteData?.account_site_name),
        (FD.account_site_phone = selectedSiteData?.account_site_phone),
        (FD.account_site_phone_ext = selectedSiteData?.account_site_phone_ext),
        (FD.company_address = selectedSiteData?.account_site_address1),
        (FD.address2 = selectedSiteData?.account_site_address2),
        (FD.city = selectedSiteData?.account_site_city),
        (FD.state = selectedSiteData?.account_site_state_id),
        (FD.country = selectedSiteData?.account_site_country_id),
        (FD.zipcode = selectedSiteData?.account_site_zipcode),
        setFormData(FD);
    }
  };

  // get generated rfi data
  const getGeneratedRfiData = async () => {
    let rfiId = searchParams.get("id");
    const rfiData = await GetRfiData(rfiId);
    console.log({ rfiData });
    let rfiMainData = rfiData?.data;

    if (rfiMainData?.is_generated_fill == 1) {
      setModalOpen(true);
      setHideForm(true);
    } else {
      setModalOpen(false);
      setHideForm(false);
    }

    setShowLoader(false);
    setRfiData(rfiMainData);
    setFormData((old) => ({ ...old, ...rfiMainData }));
    setAedData(rfiMainData?.AEDs);

    let trainingAddress = {
      company_name:
        rfiMainData?.training_address
          ?.account_alternate_traning_location_company_name,
      alternative_phone: rfiMainData?.training_address?.alternative_phone,
      alternative_ext: rfiMainData?.training_address?.alternative_ext,
      training_address1:
        rfiMainData?.training_address
          ?.account_alternate_traning_location_address1,
      training_address2:
        rfiMainData?.training_address
          ?.account_alternate_traning_location_address2,
      training_city:
        rfiMainData?.training_address?.account_alternate_traning_location_city,
      training_zip:
        rfiMainData?.training_address
          ?.account_alternate_traning_location_zipcode,
    };

    setFormData((old) => ({ ...old, ...trainingAddress }));
    let sites = await GetSitesList(rfiMainData?.account_id);

    if (sites.status) {
      let sitesData = sites?.data?.data?.site_details;
      let allSitesData = prepareOptions(
        sitesData,
        "account_site_info_id",
        "account_site_name"
      );
      const arr = [{ value: 0, label: '--Select One--' }, ...allSitesData];
      setSites(arr);
    }

    // fetch selected contact
    fetchSelectedContact(rfiMainData?.site_id);

    // get country
    const countries = await GetCountries();
    if (countries?.status) {
      let countriesData = prepareOptions(
        countries?.country,
        "id",
        "country_name"
      );
      setCountryList(countriesData);

      // to show selected country and state value for account_company_country
      if (
        rfiMainData?.account_company_country != null &&
        rfiMainData?.account_company_country != ""
      ) {
        let country = filterCountry(rfiMainData?.account_company_country);
        setSelectedCountry((old) => ({
          ...old,
          account_company_country: {
            label: country.label,
            value: country.value,
          },
        }));

        fetchStatesByCountryId("companyStateList", country);
        setFormData((old) => ({
          ...old,
          account_company_country: country.value,
        }));
      } else {
        setSelectedCountry((old) => ({
          ...old,
          account_company_country: {
            label: countriesData[230].label,
            value: countriesData[230].value,
          },
        }));
        // fetchStatesByCountryId('companyStateList', countriesData[230])
        setFormData((old) => ({
          ...old,
          account_company_country: countriesData[230].value,
        }));
      }

      // to show selected country and state value for account_training_country
      if (
        rfiMainData?.training_address?.account_training_country != null &&
        rfiMainData?.training_address?.account_training_country != ""
      ) {
        let country = filterCountry(rfiMainData?.account_training_country);
        setSelectedCountry((old) => ({
          ...old,
          account_training_country: {
            label: country.label,
            value: country.value,
          },
        }));
        fetchStatesByCountryId("account_training_country", country);
        setFormData((old) => ({
          ...old,
          account_training_country: country.value,
        }));
      } else {
        setSelectedCountry((old) => ({
          ...old,
          account_training_country: {
            label: countriesData[230].label,
            value: countriesData[230].value,
          },
        }));
        // fetchStatesByCountryId('account_training_country', countriesData[230])
        setFormData((old) => ({
          ...old,
          account_training_country: countriesData[230].value,
        }));
      }

      // for states
      const results = await CallGETAPI(
        "account/get-state-by-country/" + countriesData[230].value
      );
      if (results?.status) {
        let statesList = results?.data?.state;
        let statesData = prepareOptions(statesList, "state_id", "state_name");
        setStateList((old) => ({ ...old, companyStateList: statesData }));
        setStateList((old) => ({ ...old, trainingStateList: statesData }));
      }

      // if(formData?.account_company_country != null && formData?.account_company_country != '' && formData?.account_company_state != '' && formData?.account_company_state != null) {
      //     let country = filterCountry(formData?.account_company_country)
      //     setSelectedCountry((old) => ({ ...old, "account_company_state": {
      //         "label" : country.label,
      //         "value" : country.value,
      //     }}))
      //     fetchStatesByCountryId('companyStateList', country)
      // }
    }

    // fetch contact list
    fetchAllContactList(rfiMainData?.account_id);

    // fetch site details
    let data = await FetchAccountSiteDetails(rfiMainData?.site_id);

    if (data?.status) {
      let siteAllDetails = data?.siteData;
      setSiteDetails(siteAllDetails);
      let siteData = {
        account_site_name: siteAllDetails?.account_site_name,
        account_site_phone: siteAllDetails?.account_site_phone,
        account_site_phone_ext: siteAllDetails?.account_site_phone_ext,
        company_address: siteAllDetails?.account_site_address1,
        address2: siteAllDetails?.account_site_address2,
        city: siteAllDetails?.account_site_city,
        state: siteAllDetails?.account_site_state_id,
        country: siteAllDetails?.account_site_country_id,
        // "account_company_country" : siteAllDetails?.account_site_country_id != '' && siteAllDetails?.account_site_country_id != null && siteAllDetails?.account_site_country_id != undefined ? siteAllDetails?.account_site_country_id : formData?.account_company_country,
        zipcode: siteAllDetails?.account_site_zipcode,
      };

      setFormData((old) => ({
        ...old,
        ...siteData,
        account_zipcode: siteData?.zipcode,
      }));
    }

    let siteDetails = await FetchAccountSiteDetails(rfiMainData?.site_id);

    let siteCountryId = parseInt(
      siteDetails?.siteData?.account_site_country_id
    );
    let siteStateId = parseInt(siteDetails?.siteData?.account_site_state_id);

    if (siteCountryId && siteStateId) {
      fetchSelectedStates("account_company_state", siteStateId, siteCountryId);
    }
  };

  // fetch selected contacts by site id
  const fetchSelectedContact = async (siteId) => {
    let selectedContacts = await GetContactSelectedBySite(siteId);

    if (selectedContacts.status) {
      let selectedContactsList = selectedContacts?.data?.siteRepstList;
    }
  };

  // handle update conatcts
  const handleContactUpdate = async (e) => {
    let payloadData = {
      training_address_information_primary: parseInt(
        formData?.training_address_information_primary
      ),
      training_address_information_backup: parseInt(
        formData?.training_address_information_backup
      ),
      billing_contact_primary: parseInt(formData?.billing_contact_primary),
      billing_contact_backup: parseInt(formData?.billing_contact_backup),
      instructor_contact_primary: parseInt(
        formData?.instructor_contact_primary
      ),
      instructor_contact_backup: parseInt(formData?.instructor_contact_backup),
    };

    // call the post api function
    let result = await CallPOSTAPINEW(
      "account/update-rfi-contact/" + rfiData?.rfi_id,
      payloadData
    );
    setFormMsg({ type: result?.data?.status, msg: result?.data?.data });

    fetchSelectedContact(rfiData?.site_id);
    setTrainingEditMode(false);
  };

  // handle scroll to top
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  const [message, setMessage] = useState('');
  const messageHandler = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('')
    }, 30000)
  }

  const handleSubmit = async (e) => {

    e.preventDefault();

    let errors = {}

    if (dateFeilds.date_time_option_1 === '') {
      errors.date_time_option_1 = true
    }
    if (dateFeilds.date_time_option_2 === '') {
      errors.date_time_option_2 = true
    }
    if (dateFeilds.date_time_option_3 === '') {
      errors.date_time_option_3 = true
    }

    if (studentFeild === '') {
      errors.expected_students = true
    }

    if (Object.keys(errors).length > 0) {
      setIsInvalid({ ...isInValid, ...errors })
      scrollToTop()
      return
    }

    saveForm();
  }

  console.log('isInValid', isInValid);

  // handle submit
  // const handleSubmit = async (e) => {

  //   e.preventDefault(); setMessage('')

  //   let validationsData = {};

  //   classRowsData?.map((data, index) => {
  //     if (data?.date_time_option_1?.trim()?.length == 0) {
  //       let items = {
  //         date_time_option_1: true,
  //       };

  //       validationsData[index + 1] = {
  //         ...validationsData[index + 1],
  //         ...items,
  //       };
  //       setValidated(true);
  //       scrollToTop();
  //     }
  //     if (data?.date_time_option_2?.trim()?.length == 0) {
  //       let items = {
  //         date_time_option_2: true,
  //       };

  //       validationsData[index + 1] = {
  //         ...validationsData[index + 1],
  //         ...items,
  //       };
  //       setValidated(true);
  //       scrollToTop();
  //     }
  //     if (data?.date_time_option_3?.trim()?.length == 0) {
  //       let items = {
  //         date_time_option_3: true,
  //       };

  //       validationsData[index + 1] = {
  //         ...validationsData[index + 1],
  //         ...items,
  //       };
  //       setValidated(true);
  //       scrollToTop()
  //     }
  //   });

  //   setRowsDataValidation(validationsData);

  //   const form = e.currentTarget;

  //   if (form.checkValidity() === false) {
  //     setValidated(true);
  //     scrollToTop();
  //     return;
  //   }
  //   // return "";
  //   setValidated(false);
  //   saveForm();
  // };

  // save form data
  const saveForm = async () => {
    setLoading(true)
    let payloadData = {
      same_site_address: isNewButtonClicked ? 0 : siteName,
      training_address_id:
        formData?.select_site_training != "" ||
          formData?.select_site_training != undefined ||
          formData?.select_site_training != null
          ? formData?.select_site_training
          : 0,
      room_name: formData?.room_name,
      room_number: formData?.room_number,
      covid_restrictions_required: formData?.covid_restrictions_required
        ? 1
        : 0,
      covid_special_requirement_for_instructor:
        formData?.covid_special_requirement_for_instructor,
      expected_students: formData?.expected_students,
      min_student: formData?.min_student,
      special_parking_instructions: formData?.special_parking_instructions,
      parking_fee: formData?.parking_fee,
      onsite_parking: formData?.onsite_parking ? 1 : 0,
      loading_dock: formData?.loading_dock ? 1 : 0,
      security_procedures: formData?.security_procedures,
      AED_purchase_lease: formData?.loading_dock ? 1 : 0,
      tv_projector: formData?.tv_projector ? 1 : 0,
      dvd_computer: formData?.dvd_computer ? 1 : 0,
      speaker_system: formData?.speaker_system ? 1 : 0,
      comments: formData?.comments,
      AEDs: aedData,
      classes: classRowsData,
    };

    if (formData?.old_site_info) {
      payloadData.company_information = "";
    } else {
      payloadData.company_information = {
        account_id: formData?.account_id,
        account_site_name: formData?.site_company_name,
        account_site_phone: formData?.account_site_phone,
        account_site_phone_ext: formData?.account_site_phone_ext,
        company_address: formData?.company_address,
        address2: formData?.address2,
        city: formData?.city,
        state: formData?.account_company_state,
        country: formData?.account_company_country,
        zipcode: formData?.account_zipcode,
      };
    }

    payloadData.training_address = {
      account_id: formData?.account_id,
      site_id: formData?.select_site ?? 0,
      company_name: formData?.company_name,
      alternative_phone: formData?.alternative_phone,
      alternative_ext: formData?.alternative_ext,
      address1: formData?.training_address1,
      address2: formData?.training_address2,
      city: formData?.training_city,
      state: formData?.account_training_state,
      country: formData?.account_training_country,
      zipcode: formData?.training_zip,
    };

    let result = await CallPOSTAPINEW(
      "account/save-generated-rfi/" + rfiData?.rfi_id,
      payloadData
    );
   console.log({result})
    if (result?.status) {
      setLoading(false)
      setModalOpen(true);
      setFormMsg({ type: result?.data?.status, msg: result?.data?.message });
      // setFormMessage(
      //   <span style={{ color: "green" }}>Form saved successfully</span>
      // );
      // navigate('/account/rfi-details/' + rfiData?.rfi_id)
    } else {
      setFormMsg({ type: result?.data.status, msg: result?.data?.message });
    }
  };

  // handle same site address
  const sameOldAddress = (e) => {
    let isChecked = e.target.checked;
    let Fd = {};

    if (!isChecked && formData?.same_address_company) {
      Fd.company_name = formData?.account_name;
      Fd.alternative_phone = formData?.account_site_phone;
      Fd.alternative_ext = formData?.account_site_phone_ext;
      Fd.training_address1 = formData?.company_address;
      Fd.training_address2 = formData?.address2;
      Fd.training_city = formData?.city;
      Fd.account_training_state = formData?.account_company_state;
      Fd.account_company_country = formData?.account_company_country;
      Fd.training_zip = formData?.account_zipcode;
    } else if (isChecked && formData?.same_address_company) {
      Fd.company_name = formData?.account_name;
      Fd.alternative_phone = formData?.account_site_phone;
      Fd.alternative_ext = formData?.account_site_phone_ext;
      Fd.training_address1 = formData?.company_address;
      Fd.training_address2 = formData?.address2;
      Fd.training_city = formData?.city;
      Fd.account_training_state = formData?.account_company_state;
      Fd.account_company_country = formData?.account_company_country;
      Fd.training_zip = formData?.account_zipcode;
    } else {
      Fd.company_name = "";
      Fd.alternative_phone = "";
      Fd.alternative_ext = "";
      Fd.training_address1 = "";
      Fd.training_address2 = "";
      Fd.training_city = "";
      Fd.account_training_state = "";
      Fd.account_company_country = "";
      Fd.training_zip = "";
    }

    setFormData((old) => ({ ...old, ...Fd }));
  };

  // handle same site address
  const sameSiteAddress = (e) => {
    let isChecked = e.target.checked;
    let Fd = {};

    if (isChecked && formData?.old_site_info) {
      Fd.company_name = formData?.site_name;
      Fd.alternative_phone = formData?.account_site_phone;
      Fd.alternative_ext = formData?.account_site_phone_ext;
      Fd.training_address1 = formData?.company_address;
      Fd.training_address2 = formData?.address2;
      Fd.training_city = formData?.city;
      Fd.account_training_state = formData?.account_company_state;
      Fd.account_training_country = formData?.account_company_country;
      Fd.training_zip = formData?.account_zipcode;

      setSelectedCountry((old) => ({
        ...old,
        account_training_country: selectedCountry?.account_company_country,
      }));
      setSelectedState((old) => ({
        ...old,
        account_training_state: selectedState?.account_company_state,
      }));
    } else {
      Fd.company_name = "";
      Fd.alternative_phone = "";
      Fd.alternative_ext = "";
      Fd.training_address1 = "";
      Fd.training_address2 = "";
      Fd.training_city = "";
      Fd.account_training_state = "";
      Fd.account_training_country = "";
      Fd.training_zip = "";

      setSelectedCountry((old) => ({
        ...old,
        account_training_country: {
          label: countryList[230].label,
          value: countryList[230].value,
        },
      }));
      fetchStatesByCountryId("account_training_country", countryList[230]);
    }

    setFormData((old) => ({ ...old, ...Fd }));
  };

  useEffect(() => {
    fetchOnload();
  }, []);

  useEffect(() => {
    fetchAllContactList(rfiData?.account_id);
  }, [showContactModal]);

  const tooltip = <Tooltip id="tooltip">Total number of classes</Tooltip>;

  const [showAlternateTrainingInfo, setShowAlternateTrainingInfo] =
    useState(true);

  const handleToggleChange = (e) => {
    setShowAlternateTrainingInfo(!e.target.checked);
  };
  // const sitename = rfiData.site_id;
  // console.log(sitename)

  const [siteName, setSiteName] = useState(rfiData?.site_id); // Initialize with an empty string
  const [defaultSiteName, setDefaultSiteName] = useState("");
  // ...

  console.log('siteName', siteName);

  // Update the state when rfiData changes
  useEffect(() => {
    if (rfiData?.site_name) {
      // setSiteName(rfiData.site_name);
      setSiteName(rfiData?.site_id);
      setDefaultSiteName(rfiData.site_name)
    } else {
      setSiteName(""); // Set it back to an empty string if site_name is not available in rfiData
    }
  }, [rfiData]);

  const handleSiteNameChange = (selectedOption) => {
    if (selectedOption) {
      const selectedSiteName = selectedOption.value;
      setSiteName(selectedSiteName);
      fetchSiteAddress(selectedSiteName);
      handleSelectStateChange(selectedOption, "select_site");
    } else {
      setSiteName(""); // Clear the siteName if no option is selected
    }
  };

  console.log('allSites', allSites);

  // State to track if the "New" button has been clicked
  //   const [isNewButtonClicked, setIsNewButtonClicked] = useState(false);

  // Effect to submit the form automatically when validation is met
  useEffect(() => {
    // Validation logic - check if all required fields are filled
    //   const isFormValid = validateForm(formData); // Implement your validation logic here

    // Check if the "New" button has not been clicked and the form is valid
    // if (!isNewButtonClicked) {
    //   // Programmatically submit the form
    //   handleSubmit();
    // }
  }, [formData, isNewButtonClicked]);

  const handleNewButtonClick = () => {
    // Set the state to indicate that the button has been clicked
    setIsNewButtonClicked(!isNewButtonClicked);
    // You can also perform any additional actions related to the button click here
  };

  return (
    <div className="relative">
      {showLoader ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ) : (
        <>
          <div
            className="mt-4"
            style={{ width: "100%", paddingInline: "45px" }}
          >
            {/* check already updated generated rfi or not */}
            {!hideForm && (
              <>
                {/* top heading */}
                <SubHeadingOther
                  title="Request for Information"
                  hideNew={true}
                  hideHierarchy={true}
                  hideInstructor={true}
                  subHeading={true}
                  bottomLinks={false}
                />

                {/* show form */}
                <Form
                  className=""
                  onSubmit={handleSubmit}
                  noValidate
                  validated={validated}
                  id="create-new-site-form"
                >
                  <h3 className="heading px-3 mt-3">
                    {rfiData?.cert_agency_name} {rfiData?.course_name} training
                    for {rfiData?.training_month}
                  </h3>
                  <h4 className="px-3 my-3">
                    Please confirm/provide the following information so we can offer the best training possible:
                  </h4>

                  {/* company information */}
                  <div className="px-3">
                    <span className="heading">Company Information</span> &nbsp;
                    <span>({defaultSiteName})</span>
                  </div>
                  <div
                    className="form my-3 p-2 mx-3"
                    style={{ background: "#eee" }}
                  >
                    {/* top heading */}
                    <div className="d-flex justify-space-between align-items-center">
                      {/* select site */}
                      <Form.Group
                        className={"col-md-2 my-2"}
                        style={{ width: "auto", minWidth: "600px" }}
                      >
                        {/* <Form.Label>Select Site*</Form.Label> */}
                        <Select
                          className="custom-select"
                          style={{ width: "auto", minwidth: "600px" }}
                          //   value={allSites.find(option => option.value === siteName)} // Provide both label and value
                          value={
                            allSites.find(
                              (option) => option.value === siteName
                            ) || { label: siteName, value: siteName }
                          }
                          options={allSites}
                          onChange={handleSiteNameChange}
                          placeholder="Select Site..."
                        />
                      </Form.Group>

                      {/* new */}
                      <button
                        type="button"
                        className="btn text-primary d-flex align-items-center border-btn"
                        onClick={() => {
                          if (newData?.select_site) {
                            handleNewButtonClick();
                            handleNew("select_site", '');
                            setSiteName("");
                          } else {

                            handleNewButtonClick();
                            handleNew("select_site");
                            setSiteName("");
                          }
                        }}
                      >
                        {/* <img src="/add.svg" alt="add" style={{maxWidth: '25px'}} /> */}
                        <span className="">New</span>
                        <span className="ms-1">{newData?.select_site ? <>&times;</> : '+'}</span>
                      </button>
                      {/* <h4>Site Address: ({rfiData?.site_address})?</h4>
                                        <Form.Group className={ "ms-3" }>
                                            <div className="">
                                                <FormControlLabel
                                                    className={ "" }
                                                    label=""
                                                    control={
                                                        <Switch
                                                            checked={formData?.old_site_info}
                                                            color="primary"
                                                            size="medium"
                                                            value={ true }
                                                            name="old_site_info"
                                                            onChange={ (e) => { handleInputChange(e); sameOldAddress(e) }}
                                                        />
                                                    }
                                                />
                                            </div>
                                        </Form.Group> */}
                    </div>
                    {/* {!formData?.old_site_info && (   */}
                    {newData?.select_site && (
                      <div className="mt-3">
                        <div className="row">
                          <Form.Group className={"col-md-4"}>
                            {/* <Form.Label>{rfiData?.account_name}</Form.Label> */}
                            <Form.Label>Site Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="site_company_name"
                              onChange={handleInputChange}
                              // value={formData?.site_company_name}
                              defaultValue={
                                formData?.old_site_info
                                  ? formData?.site_company_name
                                  : ""
                              }
                            />
                          </Form.Group>

                          <Form.Group className={"col-md-3"}>
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                              type="number"
                              name="account_site_phone"
                              onChange={handleInputChange}
                              // defaultValue={
                              //   formData?.old_site_info
                              //     ? formData?.account_site_phone
                              //     : ""
                              // }
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

                          <Form.Group className={"col-md-3"}>
                            <Form.Label>Ext</Form.Label>
                            <Form.Control
                              type="text"
                              name="account_site_phone_ext"
                              onChange={handleInputChange}
                              defaultValue={
                                formData?.old_site_info
                                  ? formData?.account_site_phone_ext
                                  : ""
                              }
                            />

                            <Form.Control.Feedback type="invalid">
                              This field is required.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>

                        <div className="row my-3">
                          <Form.Group className={"col"}>
                            <Form.Label>Country*</Form.Label>
                            <Select
                              required={newData?.select_site}
                              value={selectedCountry?.account_company_country}
                              options={countryList}
                              onChange={(value) => {
                                handleSelectChange(
                                  value,
                                  "account_company_country"
                                );
                                fetchStatesByCountryId(
                                  "companyStateList",
                                  value
                                );
                              }}
                            />
                          </Form.Group>

                          <Form.Group className={"col"}>
                            <Form.Label>Site Address*</Form.Label>
                            <Form.Control
                              type="text"
                              name="company_address"
                              // required={formData?.old_site_info ? false : true}
                              // required={newData?.select_site}
                              required={newData?.select_site}
                              onChange={handleInputChange}
                              defaultValue={
                                formData?.old_site_info
                                  ? formData?.company_address
                                  : ""
                              }
                            />

                            <Form.Control.Feedback type="invalid">
                              This field is required.
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className={"col"}>
                            <Form.Label>Address 2</Form.Label>
                            <Form.Control
                              type="text"
                              name="address2"
                              onChange={handleInputChange}
                              defaultValue={
                                formData?.old_site_info
                                  ? formData?.address2
                                  : ""
                              }
                            />

                            <Form.Control.Feedback type="invalid">
                              This field is required.
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className={"col"}>
                            <Form.Label>City*</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              required={newData?.select_site}
                              // required={formData?.old_site_info ? false : true}
                              onChange={handleInputChange}
                              defaultValue={
                                formData?.old_site_info ? formData?.city : ""
                              }
                            />

                            <Form.Control.Feedback type="invalid">
                              This field is required.
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className={"col"}>
                            <Form.Label>State*</Form.Label>
                            <Select
                              value={selectedState?.account_company_state}
                              options={[
                                { value: "", label: "--- Select one ----" },
                                ...statesList?.companyStateList,
                              ]}
                              onChange={(value) =>
                                handleSelectStateChange(
                                  value,
                                  "account_company_state"
                                )
                              }
                              required={newData?.select_site}
                            />
                          </Form.Group>

                          <Form.Group className={"col"}>
                            <Form.Label>Zip Code*</Form.Label>
                            <Form.Control
                              type="text"
                              name="account_zipcode"
                              // required={formData?.old_site_info ? false : true}
                              onChange={handleInputChange}
                              defaultValue={
                                formData?.old_site_info
                                  ? formData?.account_zipcode
                                  : ""
                              }
                              required={newData?.select_site}
                            />

                            <Form.Control.Feedback type="invalid">
                              This field is required.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Training Address Information */}
                  <div className="px-3">
                    <span className="heading">
                      Training Address Information
                    </span>
                  </div>
                  <div
                    className="form my-3 p-2 mx-3"
                    style={{ background: "#eee" }}
                  >
                    {/* top heading */}
                    <div className="d-flex">
                      <h5 className="mb-3">
                        Will this training take place at the same address as
                        from company information section above?
                      </h5>
                      <Form.Group className={"ms-3"}>
                        <div className="">
                          <FormControlLabel
                            className={""}
                            label=""
                            control={
                              <Switch
                                checked={formData?.same_address_company}
                                color="primary"
                                size="medium"
                                value={true}
                                name="same_address_company"
                                onChange={(e) => {
                                  handleInputChange(e);
                                  sameSiteAddress(e);
                                  handleToggleChange(e);
                                }}
                              />
                            }
                          />
                        </div>
                      </Form.Group>
                    </div>

                    {showAlternateTrainingInfo && (
                      <>
                        <h5 className="mb-4">Alternate Training Information</h5>
                        {/* select site */}
                        <div className="d-flex justify-space-between align-items-center">
                          {/* select site */}
                          <Form.Group className={"col-md-2 my-2"}>
                            {/* <Form.Label>Select Training Address*</Form.Label> */}
                            <Select
                              value={selectedData?.select_site_training}
                              options={allAddress}
                              onChange={(data) => {
                                handleSelectStateChange(
                                  data,
                                  "select_site_training"
                                );
                              }}
                              placeholder="Select Address..."
                            />
                          </Form.Group>
                          {/* new */}
                          <button
                            type="button"
                            className="btn text-primary d-flex align-items-center border-btn"
                            onClick={() => {
                              handleNewButtonClick();
                              handleNew("select_site_training", !newData?.select_site_training);
                            }}
                          >
                            {/* <img src="/add.svg" alt="add" style={{maxWidth: '25px'}} /> */}
                            <span className="">New</span>
                            <span className="ms-1">{newData?.select_site_training ? <>&times;</> : "+"} </span>
                          </button>
                          {/* {newData?.select_site_training ? <span className='ms-2 btn ' 
                          onClick={()=>handleNew("select_site_training",!newData?.select_site_training)}
                        >&times;</span> :""} */}
                        </div>
                      </>
                    )}

                    {(showAlternateTrainingInfo && newData?.select_site_training) && (
                      <>
                        <div className="row my-3">
                          <Form.Group className={"col-md-4"}>
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="company_name"
                              onChange={handleInputChange}
                              value={formData?.company_name}
                            />
                          </Form.Group>

                          <Form.Group className={"col-md-3"}>
                            <Form.Label>Phone*</Form.Label>
                            <Form.Control
                              type="number"
                              name="alternative_phone"
                              required={newData?.select_site_training}
                              onChange={handleInputChange}
                              value={formData?.alternative_phone}
                            />

                            {phoneValidations?.alternative_phone ? (
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

                          <Form.Group className={"col-md-3"}>
                            <Form.Label>Ext</Form.Label>
                            <Form.Control
                              type="text"
                              name="alternative_ext"
                              onChange={handleInputChange}
                              value={formData?.alternative_ext}
                            />
                          </Form.Group>
                        </div>

                        <div className="row my-3">
                          <Form.Group className={"col"}>
                            <Form.Label>Country</Form.Label>
                            <Select
                              value={selectedCountry?.account_training_country}
                              options={countryList}
                              onChange={(value) => {
                                handleSelectChange(
                                  value,
                                  "account_training_country"
                                );
                                fetchStatesByCountryId(
                                  "trainingStateList",
                                  value
                                );
                              }}
                            />
                          </Form.Group>

                          <Form.Group className={"col"}>
                            <Form.Label>Company Address*</Form.Label>
                            <Form.Control
                              type="text"
                              name="training_address1"
                              required={
                                newData?.select_site_training
                                // ? true :  formData?.same_address_company ? false : true
                              }
                              onChange={handleInputChange}
                              value={formData?.training_address1}
                            />
                            {!formData?.same_address_company && (
                              <Form.Control.Feedback type="invalid">
                                This field is required.
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>

                          <Form.Group className={"col"}>
                            <Form.Label>Address 2</Form.Label>
                            <Form.Control
                              type="text"
                              name="training_address2"
                              onChange={handleInputChange}
                              value={formData?.training_address2}
                            />
                          </Form.Group>

                          <Form.Group className={"col"}>
                            <Form.Label>City*</Form.Label>
                            <Form.Control
                              type="text"
                              name="training_city"
                              required={
                                newData?.select_site_training
                                // ? true : formData?.same_address_company ? false : true
                              }
                              onChange={handleInputChange}
                              value={formData?.training_city}
                            />
                            {!formData?.same_address_company && (
                              <Form.Control.Feedback type="invalid">
                                This field is required.
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>

                          <Form.Group className={"col"}>
                            <Form.Label>State*</Form.Label>
                            <Select
                              required={newData?.select_site_training}
                              value={selectedState?.account_training_state}
                              options={statesList?.trainingStateList}
                              onChange={(value) =>
                                handleSelectStateChange(
                                  value,
                                  "account_training_state"
                                )
                              }
                            />
                          </Form.Group>

                          <Form.Group className={"col"}>
                            <Form.Label>Zip Code*</Form.Label>
                            <Form.Control
                              type="text"
                              name="training_zip"
                              required={
                                // ? true: formData?.same_address_company ? false : true
                                newData?.select_site_training
                              }
                              onChange={handleInputChange}
                              value={formData?.training_zip}
                            />
                            {!formData?.same_address_company && (
                              <Form.Control.Feedback type="invalid">
                                This field is required.
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </div>
                      </>
                    )}

                    <h6 className="mb-2 mt-4">
                      Name or number of the room where training will take place?
                    </h6>
                    <div className="row my-3">
                      <Form.Group className={"col-2"}>
                        <Form.Label>Room Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="room_name"
                          onChange={handleInputChange}
                          value={formData?.room_name}
                        />
                      </Form.Group>

                      <Form.Group className={"col-2"}>
                        <Form.Label>Room Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="room_number"
                          onChange={handleInputChange}
                          value={formData?.room_number}
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* contact information */}
                  <div className="px-3">
                    <span className="heading">Contact Information</span>
                  </div>
                  {/* top heading */}
                  <div className="d-flex justify-content-between align-items-center px-3">
                    <h4>
                      Please Select the correct contacts for this training class
                    </h4>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn text-primary"
                        type="button"
                        onClick={() => setTrainingEditMode(!trainingEditMode)}
                      >
                        <img
                          src="/edit.svg"
                          alt="Edit"
                          style={{ marginRight: "5px" }}
                        />
                        <span className="ms-1">Edit</span>
                      </button>

                      <button
                        className="btn text-primary ms-2"
                        type="button"
                        onClick={() => {
                          setShowContactModal(!showContactModal);
                        }}
                      >
                        <img
                          src="/add.svg"
                          alt="new"
                          style={{ marginRight: "5px" }}
                        />
                        <span className="ms-1">New</span>
                      </button>
                    </div>
                  </div>
                  <div className="form my-1 mx-3">
                    <div className="table my-3">
                      <table className="w-100 border-gray">
                        <thead>
                          <tr className="">
                            <th
                              scope="col"
                              width="33%"
                              className=" py-2 px-2 bg-tbl-border border-r-blue"
                            >
                              Training Site Coordinator{" "}
                            </th>
                            <th
                              scope="col"
                              width="33%"
                              className=" py-2 px-2 bg-tbl-border border-r-blue"
                            >
                              Instructor Contact Primary
                            </th>
                            <th
                              scope="col"
                              width="33%"
                              className=" py-2 px-2 bg-tbl-border"
                            >
                              Billing Contact
                            </th>
                          </tr>
                        </thead>
                        <tbody className="odd-even-row">
                          <tr className="">
                            <td className="py-2 px-2 tbl-border border-r-blue">
                              <div className="d-flex align-items-center">
                                <span className="me-2">
                                  Primary:{" "}
                                  {
                                    formData?.training_address_information_primary_name
                                  }
                                </span>
                                {trainingEditMode && (
                                  <div
                                    className="ms-auto"
                                    style={{ minWidth: "250px" }}
                                  >
                                    <Select
                                      options={allContactList}
                                      onChange={(data) => {
                                        handleContactSelectChange(
                                          data,
                                          "training_address_information_primary"
                                        );
                                      }}
                                    // defaultValue={ allContactList }
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-2 tbl-border border-r-blue">
                              <div className="d-flex align-items-center">
                                <span className="me-2">
                                  Primary:{" "}
                                  {formData?.instructor_contact_primary_name}
                                </span>
                                {trainingEditMode && (
                                  <div
                                    className="ms-auto"
                                    style={{ minWidth: "250px" }}
                                  >
                                    <Select
                                      options={allContactList}
                                      onChange={(data) => {
                                        handleContactSelectChange(
                                          data,
                                          "instructor_contact_primary"
                                        );
                                      }}
                                    // defaultValue={ allContactList }
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className=" py-2 px-2 tbl-border">
                              <div className="d-flex align-items-center">
                                <span className="me-2">
                                  Primary:{" "}
                                  {formData?.billing_contact_primary_name}
                                </span>
                                {trainingEditMode && (
                                  <div
                                    className="ms-auto"
                                    style={{ minWidth: "250px" }}
                                  >
                                    <Select
                                      options={allContactList}
                                      onChange={(data) => {
                                        handleContactSelectChange(
                                          data,
                                          "billing_contact_primary"
                                        );
                                      }}
                                    // defaultValue={ allContactList }
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-2 px-2 tbl-border border-r-blue">
                              <div className="d-flex align-items-center">
                                <span className="me-2">
                                  Backup:{" "}
                                  {
                                    formData?.training_address_information_backup_name
                                  }
                                </span>
                                {trainingEditMode && (
                                  <div
                                    className="ms-auto"
                                    style={{ minWidth: "250px" }}
                                  >
                                    <Select
                                      options={allContactList}
                                      onChange={(data) => {
                                        handleContactSelectChange(
                                          data,
                                          "training_address_information_backup"
                                        );
                                      }}
                                    // defaultValue={ allContactList }
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className=" py-2 px-2 tbl-border border-r-blue">
                              <div className="d-flex align-items-center">
                                <span className="me-2">
                                  Backup:{" "}
                                  {formData?.instructor_contact_backup_name}
                                </span>
                                {trainingEditMode && (
                                  <div
                                    className="ms-auto"
                                    style={{ minWidth: "250px" }}
                                  >
                                    <Select
                                      options={allContactList}
                                      onChange={(data) => {
                                        handleContactSelectChange(
                                          data,
                                          "instructor_contact_backup"
                                        );
                                      }}
                                    // defaultValue={ allContactList }
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className=" py-2 px-2 tbl-border">
                              <div className="d-flex align-items-center">
                                <span className="me-2">
                                  Backup:{" "}
                                  {formData?.billing_contact_backup_name}
                                </span>
                                {trainingEditMode && (
                                  <div
                                    className="ms-auto"
                                    style={{ minWidth: "250px" }}
                                  >
                                    <Select
                                      options={allContactList}
                                      onChange={(data) => {
                                        handleContactSelectChange(
                                          data,
                                          "billing_contact_backup"
                                        );
                                      }}
                                    // defaultValue={ allContactList }
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* bottom update button */}
                    {trainingEditMode && (
                      <div className="col-12 content-flex-right px-2 py-2">
                        <button
                          className="btn btn-success text-uppercase ms-2"
                          type="button"
                          onClick={handleContactUpdate}
                        >
                          Update
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Covid 19 Restrictions */}
                  <div className="px-3">
                    <span className="heading">Covid 19 Restrictions</span>
                  </div>

                  <div
                    className="form my-3 p-2 mx-3"
                    style={{ background: "#eee" }}
                  >
                    <div className="row">
                      <Form.Group className={"col-2"}>
                        <Form.Label>Are Masks Required?</Form.Label>
                        <div className="">
                          <FormControlLabel
                            className={""}
                            label=""
                            control={
                              <Switch
                                checked={
                                  formData?.covid_restrictions_required == 1 ||
                                    formData?.covid_restrictions_required
                                    ? true
                                    : false
                                }
                                color="primary"
                                size="medium"
                                value={true}
                                name="covid_restrictions_required"
                                onChange={handleInputChange}
                              />
                            }
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className={"col-md-10"}>
                        <Form.Label>
                          Any special requirements for instructors?
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          name="covid_special_requirement_for_instructor"
                          rows={3}
                          onChange={handleInputChange}
                          value={
                            formData?.covid_special_requirement_for_instructor
                          }
                        />
                      </Form.Group>
                    </div>

                    <h6 className="mb-2 mt-4">
                      ********** Maximum of 8 students per class while Covid-19
                      restrictions are in place **********
                    </h6>
                    <h6 className="mb-2">
                      Up to twelve students per class as long as adequate
                      training space is available to ensure safe social
                      distancing.
                    </h6>
                  </div>

                  {/* Tentative Details */}
                  <div className="px-3">
                    <span className="heading">Tentative Details</span>
                  </div>

                  <h5 className="px-3 my-2">
                    Tentative/requested dates or preferred days of the week and
                    start time for this (#) hour training session?
                  </h5>

                  <div
                    className="form my-3 p-2 mx-3"
                    style={{ background: "#eee" }}
                  >
                    <div className="row mb-3">
                      <Form.Group className={"col-2"}>
                        <Form.Label>Expected # of Students*</Form.Label>
                        <Form.Control
                          style={{ borderColor: isInValid.expected_students ? '#DC3545' : '' }}
                          type="text"
                          name="expected_students"
                          onChange={(e) => {
                            handleInputChange(e)
                            setStudentFeild(e.target.value)
                            setIsInvalid({ ...isInValid, expected_students: false })
                          }}
                          value={formData?.expected_students}
                        />
                        {/* <Form.Control.Feedback type="invalid">
                          This field is required.
                        </Form.Control.Feedback> */}
                        {
                          isInValid.expected_students && (
                            <p style={{ color: '#DC3545' }}>This field is required.</p>
                          )
                        }
                      </Form.Group>

                      <Form.Group className={"col-2"}>
                        <Form.Label>Minimum</Form.Label>
                        <Form.Control
                          value={formData?.min_student}
                          type="text"
                          name="min_student"
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                        <Form.Control.Feedback type="invalid">
                          This field is required.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>

                    {/* class details */}
                    <ClassDetails
                      dateFeilds={dateFeilds}
                      setDateFeilds={setDateFeilds}
                      isInValid={isInValid}
                      setIsInvalid={setIsInvalid}
                      setRowsData={setClassRowsData}
                      rowsData={classRowsData}
                      validated={validated}
                      setValidated={setValidated}
                      rowsDataValidation={rowsDataValidation}
                      setRowsDataValidation={setRowsDataValidation}
                    />
                  </div>

                  {/* Parking and  Special  Procedures */}
                  <div className="px-3">
                    <span className="heading">
                      Parking and Special Procedures
                    </span>
                  </div>
                  <div
                    className="form my-3 p-2 mx-3"
                    style={{ background: "#eee" }}
                  >
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <Form.Group className={"col"}>
                          <Form.Label>Special Parking Instructions</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="special_parking_instructions"
                            rows={4}
                            onChange={handleInputChange}
                            value={formData?.special_parking_instructions}
                          />
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <div className="row">
                          <Form.Group className={"col-6"}>
                            <Form.Label>Parking Fee</Form.Label>
                            <Form.Control
                              type="text"
                              name="parking_fee"
                              placeholder="$"
                              onChange={handleInputChange}
                              value={formData?.parking_fee}
                            />
                          </Form.Group>

                          <Form.Group className={"col-6"}>
                            <Form.Label>Onsite Parking</Form.Label>
                            <div className="">
                              <FormControlLabel
                                className={""}
                                label=""
                                control={
                                  <Switch
                                    checked={
                                      formData?.onsite_parking == 1 ||
                                        formData?.onsite_parking
                                        ? true
                                        : false
                                    }
                                    color="primary"
                                    size="medium"
                                    value={true}
                                    name="onsite_parking"
                                    onChange={handleInputChange}
                                  />
                                }
                              />
                            </div>
                          </Form.Group>

                          <Form.Group className={"col-6 mt-3"}>
                            <Form.Label>Loading Dock</Form.Label>
                            <div className="">
                              <FormControlLabel
                                className={""}
                                label=""
                                control={
                                  <Switch
                                    checked={
                                      formData?.loading_dock == 1 ||
                                        formData?.loading_dock
                                        ? true
                                        : false
                                    }
                                    color="primary"
                                    size="medium"
                                    value={true}
                                    name="loading_dock"
                                    onChange={handleInputChange}
                                  />
                                }
                              />
                            </div>
                          </Form.Group>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <Form.Group className={"col"}>
                          <Form.Label>Sign-In / Security Procedures</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="security_procedures"
                            rows={4}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>

                  {/* AV Equipment */}
                  <div className="px-3">
                    <span className="heading">AV Equipment</span>
                  </div>

                  <div
                    className="form my-3 p-2 mx-3"
                    style={{ background: "#eee" }}
                  >
                    <h5 className="my-2">
                      What AV equipment do you have available for the instructor
                      to play a DVD (TV/DVD system or laptop/projector system
                      with sound)?
                    </h5>
                    <div className="row my-3 mt-4">
                      <Form.Group className={"col-2"}>
                        <Form.Label>TV / Projector</Form.Label>
                        <div className="">
                          <FormControlLabel
                            className={""}
                            label=""
                            control={
                              <Switch
                                checked={
                                  formData?.tv_projector == 1 ||
                                    formData?.tv_projector
                                    ? true
                                    : false
                                }
                                color="primary"
                                size="medium"
                                value={true}
                                name="tv_projector"
                                onChange={handleInputChange}
                              />
                            }
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className={"col-2"}>
                        <Form.Label>DVD / Computer</Form.Label>
                        <div className="">
                          <FormControlLabel
                            className={""}
                            label=""
                            control={
                              <Switch
                                checked={
                                  formData?.dvd_computer == 1 ||
                                    formData?.dvd_computer
                                    ? true
                                    : false
                                }
                                color="primary"
                                size="medium"
                                value={true}
                                name="dvd_computer"
                                onChange={handleInputChange}
                              />
                            }
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className={"col-2"}>
                        <Form.Label>Speaker System</Form.Label>
                        <div className="">
                          <FormControlLabel
                            className={""}
                            label=""
                            control={
                              <Switch
                                checked={
                                  formData?.speaker_system == 1 ||
                                    formData?.speaker_system
                                    ? true
                                    : false
                                }
                                color="primary"
                                size="medium"
                                value={true}
                                name="speaker_system"
                                onChange={handleInputChange}
                              />
                            }
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  {/* AEDs */}
                  <div className="px-3">
                    <span className="heading">AEDs</span>
                  </div>

                  <div
                    className="form my-3 p-2 mx-3"
                    style={{ background: "#eee" }}
                  >
                    <h5 className="my-2">
                      Do you have an AED on site and if so, what make and model?
                    </h5>
                    <div className="row my-3">
                      {/* aed information */}
                      <AedComponent
                        aedData={aedData}
                        setAedData={setAedData}
                        mode="edit"
                      />
                    </div>
                    <h5 className="mt-2">
                      If you have an AED, did you purchase/lease it/them from
                      Rescue One?
                    </h5>
                    <Form.Group className={"col-2"}>
                      <div className="">
                        <FormControlLabel
                          className={""}
                          label=""
                          control={
                            <Switch
                              checked={
                                formData?.AED_purchase_lease == 1 ||
                                  formData?.AED_purchase_lease
                                  ? true
                                  : false
                              }
                              color="primary"
                              size="medium"
                              value={true}
                              name="AED_purchase_lease"
                              onChange={handleInputChange}
                            />
                          }
                        />
                      </div>
                    </Form.Group>
                  </div>

                  {/* Comments */}
                  <div className="px-3">
                    <span className="heading">Comments</span>
                  </div>

                  <div
                    className="form mt-3 mb-1 p-2 mx-3"
                    style={{ background: "#eee" }}
                  >
                    <div className="row">
                      <Form.Group className={"col"}>
                        <Form.Control
                          as="textarea"
                          name="comments"
                          rows={4}
                          onChange={handleInputChange}
                          placeholder="Place any needed comments here"
                          value={formData?.comments}
                        />
                      </Form.Group>
                    </div>

                    <h5 className="my-3">
                      Once this information is received, We will confirm the
                      training. Feel free to call or email,if you have any
                      questions. Thank you.
                    </h5>
                  </div>

                  {/* alert msg */}
                  <div className="my-4">
                    <MessageHandler
                      status={FormMsg.type}
                      msg={FormMsg.msg}
                      HandleMessage={setFormMsg}
                    />
                  </div>

                  {/* bottom buttons */}
                  {message ? <div className="alert alert-danger">{message}</div> : ""}
                  <div className="row pb-3">
                    <div className="col-12 content-flex-right">
                      <button
                        className="btn btn-danger text-uppercase"
                        type="button"
                        onClick={() => {
                          navigate(-1);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-success text-uppercase ms-2"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'Submit'}
                      </button>
                    </div>
                  </div>
                </Form>
              </>
            )}
            {/* show modal */}
            {modalOpen && (
              <>
                {/* modal */}
                <Modal
                  open={true}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      <div className="text-danger text-center">
                        {formMessage}
                      </div>
                    </Typography>
                  </Box>
                </Modal>
              </>
            )}
            {/* contact modal */}
            {showContactModal && (
              <NewContactModal
                className="custom-select"
                style={{ maxwidth: "700px" }}
                showContactModal={showContactModal}
                setShowContactModal={setShowContactModal}
                accountId={formData?.account_id}
                rfi_id={rfi_id}
                title="New Contact"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

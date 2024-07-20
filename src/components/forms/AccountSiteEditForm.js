import React, { useState, useEffect } from "react";

import { FormControlLabel, Icon, Switch } from "@mui/material";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";

import Container from "react-bootstrap/Container";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AccRepsDropDown,
  AssignedSiteContactList,
  AssignedSiteRepsList,
  ContactList,
  SiteContactRepList,
  FetchDropDowns,
  ModalAccSiteReps,
  ProductsDropDown,
  GetCountries,
} from "../../helper/BasicFn";
import {
  AssignContectRepList,
  AssignedRepList,
  ContectRepList,
  ModalAccReps,
} from "../../helper/BasicFn";

import { CallDetails, CallPOSTAPI } from "../../helper/API";
import { useParams, useNavigate } from "react-router";

import AccountReps from "../modals/accountReps";
import ContactModel from "../modals/ContactModel";
import MessageHandler from "../common/MessageHandler";
import SubHeading from "../header/SubHeading";
import SubHeadingOther from "../header/SubHeadingOther";
import {
  formatPhoneNumber,
  prepareOptions,
  validatePhone,
} from "../../helper/Common";
import Select from "react-select";
import StateField from "../common/states/StatesField";
import TableSkeleton from "../../pages/accounts/skeleton/table/TableSkeleton";
import Loading from "../../pages/accounts/Loading";
import ToogleSwitch from "../common/toggleSwitch/ToogleSwitch";

export default function AccountSiteEditForm({
  EditsiteData,
  EditbillingData,
  EditshippingData,
  EdittraningData,
  EditcoordinatorData,
}) {
  const navigate = useNavigate();
  const { siteId } = useParams();
  const [ShowAccRepsModal, setShowAccRepsModal] = useState(false);
  const [contactShowModel, setContactShowModel] = useState(false);
  const [SelectAccReps, setSelectAccReps] = useState([]);
  const [SelectContact, setSelectContact] = useState([]);
  const [AccReps, setAccReps] = useState([]);
  const [AccRepsList, setAccRepsList] = useState([]);
  const [contactReps, setContactReps] = useState([]);
  const [contactRepsList, setContactRepsList] = useState([]);
  const [repsData, setRepsData] = useState([]);
  const [FormMsg, setFormMsg] = useState({ type: true, msg: "" });
  const [validated, setValidated] = useState(false);
  const [switchValue, setSwitchValue] = useState({});
  const [formData, setFormData] = useState({
    site_name_toggle: false,
    user_type: 1,
    account_name: "",
    parent_account_id: 0,
    distributor_id: 0,
    customer_type_id: 0,
    industry_id: 0,
    terms_id: 0,
    account_status_id: 0,
    lead_source_id: 0,
    website: "",
    important_note: "",
    product_interest: "",
    contact_status: "",
    restricted_user: "",
    two_FA: 0,

    account_site_name: "",
    account_site_phone: "",
    account_site_phone_ext: "",
    account_site_main_site: 0,
    account_site_call_ahead: 0,
    account_site_status_id: 1,
    account_site_address1: "",
    account_site_address2: " ",
    building_name: "",
    account_site_city: "",
    account_site_state: "",
    account_site_country: "",
    account_site_zipcode: "",

    account_billing_info_billing_phone: "",
    account_billing_info_phone_ext: "",
    account_billing_info_address1: "",
    account_billing_info_address2: "",
    account_billing_info_city: "",
    account_billing_info_state: "",
    account_billing_info_country: "",
    account_billing_info_zipcode: "",
    billing_is_invoice: EditbillingData.billing_is_invoice
      ? EditbillingData.billing_is_invoice
      : false,

    account_shipping_info_shipping_phone: "",
    account_shipping_info_phone_ext: "",
    account_shipping_info_address1: "",
    account_shipping_info_address2: "",
    account_shipping_info_city: "",
    account_shipping_info_state: "",
    account_shipping_info_country: "",
    account_shipping_info_zipcode: "",
    shipping_is_invoice: EditshippingData.shipping_is_invoice
      ? EditshippingData.shipping_is_invoice
      : false,

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
  const [showLoading, setShowLoading] = React.useState(true);

  //   set comp data
  const setUpCompData = (
    EditsiteData,
    EditbillingData,
    EditshippingData,
    EdittraningData,
    EditcoordinatorData
  ) => {
    setFormData({
      ...EditsiteData,
      ...EditbillingData,
      ...EditshippingData,
      ...EdittraningData,
      ...EditcoordinatorData,
    });
  };

  useEffect(() => {
    setUpCompData(
      EditsiteData,
      EditbillingData,
      EditshippingData,
      EdittraningData,
      EditcoordinatorData
    );
  }, [
    EditsiteData,
    EditbillingData,
    EditshippingData,
    EdittraningData,
    EditcoordinatorData,
  ]);

  const [allDropDowns, setAllDropDowns] = React.useState([]);
  const [ProductModalData, setProductModalData] = useState([]);
  // for phone validations
  const [phoneValidations, setPhoneValidations] = useState({
    account_site_phone: false,
    account_billing_info_billing_phone: false,
    account_shipping_info_shipping_phone: false,
  });

  const [countryList, setCountryList] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState({});

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

  // handle input change
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

  const getData = async () => {
    let data = await AssignedRepList(siteId);
    if (data?.status) {
      if (!data.data.status) {
        let response = await CallDetails(EditsiteData?.account_id);
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
    let ProductResult = await ProductsDropDown();
    if (ProductResult) {
      setProductModalData(ProductResult?.products);
    }

    let AllDResult = await FetchDropDowns();
    if (AllDResult) {
      setAllDropDowns(AllDResult);
    }

    let AccResult = await ModalAccSiteReps();
    let AccreptList = await AccRepsDropDown();
    // let AccountContactList        = await ContactList(siteId)
    let AccountContactList = await ContactList(EditsiteData?.account_id);
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
              e.account_main_contact_id === findPPrimaryId.contact_id &&
              findPPrimaryId.is_primary != 0
          );
          CheckMarkList.push(GetVal.account_main_contact_id);
          obj.primary = {
            e_id: findPPrimaryId.id,
            id: findPPrimaryId.contact_id,
            val:
              GetVal.account_main_contact_firstname +
              " " +
              GetVal.account_main_contact_lastname,
          };
        }
        if (findPBackupId) {
          obj.id = findPBackupId.id;
          let GetVal = AccreptList.find(
            (e) =>
              e.account_main_contact_id === findPBackupId.contact_id &&
              findPBackupId.is_backup != 0
          );
          CheckMarkList.push(GetVal.account_main_contact_id);
          obj.backup = {
            e_id: findPBackupId.id,
            id: findPBackupId.contact_id,
            val:
              GetVal.account_main_contact_firstname +
              " " +
              GetVal.account_main_contact_lastname,
          };
        }
        List.push(obj);
      }

      setAccReps(List);
    }

    if (AccreptList) {
      let RepList = [];

      for (let index = 0; index < AccreptList.length; index++) {
        const RepElement = AccreptList[index];
        let obj = { ...RepElement };
        let FindData = CheckMarkList.find(
          (e) => e === RepElement.account_main_contact_id
        );
        if (FindData) {
          obj.is_selected = false;
        } else {
          obj.is_selected = false;
        }
        obj.primary = { id: "", val: "" };
        obj.backup = { id: "", val: "" };
        RepList.push(obj);
      }
      setAccRepsList(RepList);
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

    // get country
    const countries = await GetCountries();
    if (countries?.status) {
      let Allcountries = countries?.country;
      let countriesData = prepareOptions(Allcountries, "id", "country_name");
      setCountryList(countriesData);

      if (EditsiteData?.account_site_country_id) {
        const country = countriesData.find(
          (country) =>
            country?.value == parseInt(EditsiteData?.account_site_country_id)
        );
        setSelectedCountry((old) => ({
          ...old,
          account_site_country: {
            label: country?.label,
            value: country?.value,
          },
        }));
        setFormData((old) => ({ ...old, account_site_country: country.value }));
      } else {
        setSelectedCountry((old) => ({
          ...old,
          account_site_country: {
            label: countriesData[230].label,
            value: countriesData[230].value,
          },
        }));
        setFormData((old) => ({
          ...old,
          account_site_country: countriesData[230].value,
        }));
      }

      if (EditbillingData?.account_billing_info_country_id) {
        const country = countriesData.find(
          (country) =>
            country?.value ==
            parseInt(EditbillingData?.account_billing_info_country_id)
        );
        setSelectedCountry((old) => ({
          ...old,
          account_billing_info_country: {
            label: country?.label,
            value: country?.value,
          },
        }));
        setFormData((old) => ({
          ...old,
          account_billing_info_country: country.value,
        }));
      } else {
        setSelectedCountry((old) => ({
          ...old,
          account_billing_info_country: {
            label: countriesData[230].label,
            value: countriesData[230].value,
          },
        }));
        setFormData((old) => ({
          ...old,
          account_billing_info_country: countriesData[230].value,
        }));
      }

      if (EditshippingData?.account_shipping_info_country_id) {
        const country = countriesData.find(
          (country) =>
            country?.value ==
            parseInt(EditshippingData?.account_shipping_info_country_id)
        );
        setSelectedCountry((old) => ({
          ...old,
          account_shipping_info_country: {
            label: country?.label,
            value: country?.value,
          },
        }));
        setFormData((old) => ({
          ...old,
          account_shipping_info_country: country.value,
        }));
      } else {
        setSelectedCountry((old) => ({
          ...old,
          account_shipping_info_country: {
            label: countriesData[230].label,
            value: countriesData[230].value,
          },
        }));
        setFormData((old) => ({
          ...old,
          account_shipping_info_country: countriesData[230].value,
        }));
      }
    }

    setShowLoading(false);
  };

  useEffect(() => {
    if (!EditsiteData?.account_id) {
      return;
    }
    fetchOnload();
  }, [EditsiteData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sitePhoneValidate = validatePhone(formData?.account_site_phone);
    const billingPhoneValidate = validatePhone(
      formData?.account_billing_info_billing_phone
    );
    const shippingPhoneValidate = validatePhone(
      formData?.account_shipping_info_shipping_phone
    );

    setPhoneValidations({
      account_site_phone: sitePhoneValidate ? false : true,
      account_billing_info_billing_phone: billingPhoneValidate ? false : true,
      account_shipping_info_shipping_phone: shippingPhoneValidate
        ? false
        : true,
    });

    if (
      phoneValidations.account_site_phone ||
      phoneValidations.account_billing_info_billing_phone ||
      phoneValidations.account_shipping_info_shipping_phone
    ) {
      setValidated(true);
      return;
    }
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      // setPhoneValidations({
      //     account_site_phone: false,
      //     account_billing_info_billing_phone: false,
      //     account_shipping_info_shipping_phone: false,
      // })
      return;
    }

    setValidated(false);
    saveForm();
  };

  const saveForm = async () => {
    let infoData = {
      site_details: {
        site_id: siteId,
        site_name_toggle: formData?.site_name_toggle ? 1 : 0,
        account_id: formData?.account_id,
        account_site_name: formData?.site_name_toggle
          ? formData?.temp_account_site_name
          : formData?.account_site_name,
        account_site_phone: formData?.account_site_phone
          ? formData?.account_site_phone.replace(/[^0-9 ]/g, "")
          : "",
        account_site_phone_ext: formData?.account_site_phone_ext
          ? formData?.account_site_phone_ext
          : "",
        account_site_main_site: formData?.account_site_main_site ? 1 : 0,
        account_site_call_ahead: formData?.account_site_call_ahead ? 1 : 0,
        account_site_status_id: formData?.account_site_status_id
          ? formData?.account_site_status_id
          : "",
        account_site_address1: formData?.account_site_address1
          ? formData?.account_site_address1
          : "",
        account_site_address2: formData?.account_site_address2
          ? formData?.account_site_address2
          : "",
        building_name: formData?.building_name ? formData?.building_name : "",
        account_site_city: formData?.account_site_city
          ? formData?.account_site_city
          : "",
        account_site_state: formData?.account_site_state_id
          ? formData?.account_site_state_id
          : "",
        account_site_country: formData?.account_site_country
          ? formData?.account_site_country
          : "",
        account_site_zipcode: formData?.account_site_zipcode
          ? formData?.account_site_zipcode
          : "",
      },
      billing_details: {
        billing_id: formData?.account_billing_info_id
          ? formData?.account_billing_info_id
          : "",
        account_id: formData.account_id,
        site_id: siteId,
        account_billing_info_billing_phone:
          formData?.account_billing_info_billing_phone
            ? formData?.account_billing_info_billing_phone.replace(
                /[^0-9 ]/g,
                ""
              )
            : "",
        account_billing_info_phone_ext: formData?.account_billing_info_phone_ext
          ? formData?.account_billing_info_phone_ext
          : "",
        account_billing_info_address1: formData?.account_billing_info_address1
          ? formData?.account_billing_info_address1
          : "",
        account_billing_info_address2: formData?.account_billing_info_address2
          ? formData?.account_billing_info_address2
          : "",
        account_billing_info_city: formData?.account_billing_info_city
          ? formData?.account_billing_info_city
          : "",
        account_billing_info_state: formData?.account_billing_info_state_id
          ? formData?.account_billing_info_state_id
          : "",
        account_billing_info_country: formData?.account_billing_info_country
          ? formData?.account_billing_info_country
          : "",
        account_billing_info_zipcode: formData?.account_billing_info_zipcode
          ? formData?.account_billing_info_zipcode
          : "",
        is_invoice: formData?.billing_is_invoice ? 1 : 0,
      },
      shipping_details: {
        shipping_id: formData?.account_shipping_info_id
          ? formData?.account_shipping_info_id
          : "",
        account_id: formData.account_id,
        site_id: siteId,
        account_shipping_info_shipping_phone:
          formData?.account_shipping_info_shipping_phone
            ? formData?.account_shipping_info_shipping_phone.replace(
                /[^0-9 ]/g,
                ""
              )
            : "",
        account_shipping_info_phone_ext:
          formData?.account_shipping_info_phone_ext
            ? formData?.account_shipping_info_phone_ext
            : "",
        account_shipping_info_address1: formData?.account_shipping_info_address1
          ? formData?.account_shipping_info_address1
          : "",
        account_shipping_info_address2: formData?.account_shipping_info_address2
          ? formData?.account_shipping_info_address2
          : "",
        account_shipping_info_city: formData?.account_shipping_info_city
          ? formData?.account_shipping_info_city
          : "",
        account_shipping_info_state: formData?.account_shipping_info_state_id
          ? formData?.account_shipping_info_state_id
          : "",
        account_shipping_info_country: formData?.account_shipping_info_country
          ? formData?.account_shipping_info_country
          : "",
        account_shipping_info_zipcode: formData?.account_shipping_info_zipcode
          ? formData?.account_shipping_info_zipcode
          : "",
        is_invoice: formData?.shipping_is_invoice ? 1 : 0,
      },
    };

    let result = await CallPOSTAPI("account/update-site-details", infoData);

    if (result?.data?.status) {
      navigate("/account-details/" + formData?.account_id, {
        state: {
          tab: "Sites",
          type: result?.data?.status,
          msg: result?.data?.msg,
        },
      });
    }

    setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
  };

  // validation for site data, billing data and shipping data
  const phoneValidationSet = (
    EditbillingData,
    EditshippingData,
    EditsiteData
  ) => {
    const sitePhoneValidate = validatePhone(EditsiteData?.account_site_phone);
    const billingPhoneValidate = validatePhone(
      EditbillingData?.account_billing_info_billing_phone
    );
    const shippingPhoneValidate = validatePhone(
      EditshippingData?.account_shipping_info_shipping_phone
    );

    setPhoneValidations({
      account_site_phone: sitePhoneValidate ? false : true,
      account_billing_info_billing_phone: billingPhoneValidate ? false : true,
      account_shipping_info_shipping_phone: shippingPhoneValidate
        ? false
        : true,
    });
  };

  useEffect(() => {
    phoneValidationSet(EditbillingData, EditshippingData, EditsiteData);
  }, [EditbillingData, EditshippingData, EditsiteData]);

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
        formData?.account_site_state_id_abbreviation +
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

  return (
    <>
      {/* loading */}
      {showLoading ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ) : (
        <>
          {/* main data */}
          <div className="mt-4" style={{ paddingInline: "45px" }}>
            <SubHeadingOther
              hideNew="tab"
              title={"Edit: " + EditsiteData?.account_site_name}
              subHeading={true}
              hideHierarchy={true}
              bottomLinks={false}
            />
            {/* form */}
            <Form
              className=""
              onSubmit={handleSubmit}
              noValidate
              validated={validated}
              id="create-new-site-form"
            >
              <div className="containerr">
                <div className="">
                  {/* site info */}
                  <div
                    className="container-fluid mt-4 pt-2 bottom-border-blue"
                    style={{
                      borderBottom: "4px solid rgb(13, 110, 253)",
                      background: "#eee",
                    }}
                  >
                    <h2 className="text-left heading">Site Information</h2>
                    <div className="row my-4">
                      <Form.Group className={"col"}>
                        <Form.Label>Site Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_site_name"
                          value={
                            formData?.temp_account_site_name != false
                              ? formData?.temp_account_site_name
                              : formData?.account_site_name
                          }
                          onChange={handleInputChange}
                          required={formData?.site_name_toggle ? false : true}
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
                          value={formData?.account_site_phone}
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
                          name="account_site_phone_ext"
                          value={formData?.account_site_phone_ext}
                          onChange={handleInputChange}
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
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Site Status</Form.Label>
                        <Form.Select
                          className={""}
                          name="account_site_status_id"
                          value={formData?.account_site_status_id || ""}
                          onChange={handleInputChange}
                        >
                          <option value="0">--Select One--</option>
                          {allDropDowns?.siteStatus &&
                            allDropDowns?.siteStatus.map((SS, index) => (
                              <option
                                value={SS.dropdown_site_status_id}
                                key={index}
                              >
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
                          onChange={handleInputChange}
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

                      <Form.Group className={"col"}>
                        <Form.Label>State * </Form.Label>
                        <StateField
                          setFormData={setFormData}
                          valueKey="account_site_state_id"
                          selectedCountry={
                            selectedCountry?.account_site_country?.value
                          }
                          validated={validated}
                          required={true}
                          stateSelectedValue={formData?.account_site_state_id}
                          altTrainerForm={formData}
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

                    <div className="my-4 d-flex gap-2 align-items-center">
                      <Button
                        className={"btn account-btn ms-2"}
                        type="button"
                        onClick={() => setShowAccRepsModal(true)}
                      >
                        Site Reps
                      </Button>

                      <Button
                        className={"btn btn-primary account-btn mx-2"}
                        variant="success"
                        type="button"
                        onClick={() => setContactShowModel(true)}
                      >
                        Site Contacts
                      </Button>

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

                  {/* billing address info */}
                  <div
                    className="container-fluid bottom-border-blue mt-4 pt-2"
                    style={{
                      borderBottom: "4px solid rgb(13, 110, 253)",
                      background: "#eee",
                    }}
                  >
                    <h2 className="text-left heading">Billing Information</h2>
                    <div className="row my-4">
                      <Form.Group className={"col"}>
                        <Form.Label>Billing Phone</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_billing_info_billing_phone"
                          value={formData?.account_billing_info_billing_phone}
                          // required
                          onChange={(e) => {
                            handleInputChange(e);
                          }}
                          className={
                            phoneValidations.account_billing_info_billing_phone
                              ? "phone-invalid-input"
                              : ""
                          }
                        />

                        {phoneValidations.account_billing_info_billing_phone ? (
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
                          value={formData?.account_billing_info_phone_ext}
                          onChange={handleInputChange}
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
                                                                value={ true }
                                                                name="billing_is_invoice"
                                                                onChange={ handleInputChange }
                                                                checked={formData?.billing_is_invoice == 1 || formData?.billing_is_invoice ? true : false}
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
                                                                value={ true }
                                                                name="same_address"
                                                                onChange={ (e) => { handleInputChange; SameAddressBilling(e) } }
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
                            handleSelectChange(
                              data,
                              "account_billing_info_country"
                            );
                          }}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_billing_info_address1"
                          value={formData?.account_billing_info_address1}
                          onChange={handleInputChange}
                        />
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
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_billing_info_city"
                          value={formData?.account_billing_info_city}
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>State </Form.Label>
                        <StateField
                          setFormData={setFormData}
                          valueKey="account_billing_info_state_id"
                          selectedCountry={
                            selectedCountry?.account_billing_info_country?.value
                          }
                          validated={validated}
                          required={false}
                          stateSelectedValue={
                            formData?.account_billing_info_state_id
                          }
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Zip code</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_billing_info_zipcode"
                          value={formData?.account_billing_info_zipcode}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* shipping address info */}
                  <div
                    className="container-fluid bottom-border-blue mt-4 pt-2"
                    style={{
                      borderBottom: "4px solid rgb(13, 110, 253)",
                      background: "#eee",
                    }}
                  >
                    <h2 className="text-left heading">Shipping Information</h2>
                    <div className="row my-4">
                      <Form.Group className={"col-md-4"}>
                        <Form.Label>Shipping Phone</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_shipping_info_shipping_phone"
                          value={formData?.account_shipping_info_shipping_phone}
                          onChange={(e) => {
                            handleInputChange(e);
                          }}
                          // required
                          minLength={10}
                          className={
                            phoneValidations.account_shipping_info_shipping_phone
                              ? "phone-invalid-input"
                              : ""
                          }
                        />

                        {phoneValidations.account_shipping_info_shipping_phone ? (
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

                      <Form.Group className={"col-md-4"}>
                        <Form.Label>Phone Ext</Form.Label>
                        <Form.Control
                          type="number"
                          name="account_shipping_info_phone_ext"
                          value={formData?.account_shipping_info_phone_ext}
                          onChange={handleInputChange}
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
                                                                value={ true }
                                                                name="account_shipping_is_invoice"
                                                                onChange={ handleInputChange }
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
                                                                value={ true }
                                                                name="same_address"
                                                                onChange={ (e) => { handleInputChange; SameAddressShipping(e) } }
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
                            handleSelectChange(
                              data,
                              "account_shipping_info_country"
                            );
                          }}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_shipping_info_address1"
                          value={formData?.account_shipping_info_address1}
                          onChange={handleInputChange}
                        />
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
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_shipping_info_city"
                          value={formData?.account_shipping_info_city}
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>State </Form.Label>
                        <StateField
                          setFormData={setFormData}
                          valueKey="account_shipping_info_state_id"
                          selectedCountry={
                            selectedCountry?.account_shipping_info_country
                              ?.value
                          }
                          validated={validated}
                          required={false}
                          stateSelectedValue={
                            formData?.account_shipping_info_state_id
                          }
                        />
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Zip code</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_shipping_info_zipcode"
                          value={formData?.account_shipping_info_zipcode}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </div>
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
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>

                {/* reps modal  */}
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
                  type="siteReps"
                />

                {/* contact modal */}
                <ContactModel
                  ShowRepsModal={contactShowModel}
                  SetShowRepsModal={setContactShowModel}
                  setSelectAccReps={setSelectContact}
                  setAccReps={setContactRepsList}
                  AccReps={contactRepsList}
                  setAccRepsList={setContactReps}
                  AccRepsList={contactReps}
                  resultData={repsData}
                  type="siteContact"
                />
              </div>
            </Form>
          </div>
        </>
      )}
    </>
  );
}

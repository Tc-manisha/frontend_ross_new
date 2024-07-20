import Container from "react-bootstrap/Container";
import MenuIcon from "@mui/icons-material/Menu";

import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import styles from "../../NewAccount.module.css";
import {
  AccRepsDropDown,
  AssignContectRepList,
  ContactList,
  ContectRepList,
  DecryptToken,
  FetchDropDowns,
  ModalAccReps,
  ProductsDropDown,
} from "../../../helper/BasicFn";
import { CallDetails, CallPOSTAPI, CallPOSTData } from "../../../helper/API";
import React, { useEffect, useState } from "react";
import ProductModal from "../../../components/modals/ProductModal";
import AccountReps from "../../../components/modals/accountReps";
import Button from "@mui/material/Button";
import { FormControlLabel, Switch } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MessageHandler from "../../../components/common/MessageHandler";
import ContactModel from "../../../components/modals/ContactModel";
import SubHeading from "../../../components/header/SubHeading";
import Loading from "../Loading";
import { sortData } from "../../../helper/Common";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import Select from "react-select";
import { MultiSelect } from "react-multi-select-component";

const AccountEdit = ({ setShowSidebar }) => {
  const [showLoading, setShowLoading] = React.useState(true);
  const [accountTitle, setAccountTitle] = useState("");
  const [ProductShowModal, setProductShowModal] = useState(false);
  const [ProductModalData, setProductModalData] = useState([]);
  const [SelectedProductsData, setSelectedProductData] = useState([]);
  const [ShowAccRepsModal, setShowAccRepsModal] = useState(false);
  const [contactShowModel, setContactShowModel] = useState(false);
  const [SelectAccReps, setSelectAccReps] = useState([]);
  const [SelectContact, setSelectContact] = useState([]);

  const [AccReps, setAccReps] = useState([]);
  const [AccRepsList, setAccRepsList] = useState([]);

  const [contactReps, setContactReps] = useState([]);
  const [contactRepsList, setContactRepsList] = useState([]);
  const user = DecryptToken();
  const { accountId } = useParams();
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [resultData, setResultData] = useState("");
  const [repsData, setRepsData] = useState("");
  const [editUrl, seteditUrl] = useState("");
  const [listType, setListType] = React.useState("");

  const [formData, setFormData] = useState({
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
    aed_check_length: "30 Days",
    extra_fields: 0,
    extra_field1: "",
    extra_field2: "",

    account_site_name: "",
    account_site_phone: "0",
    account_site_phone_ext: "0",
    account_site_main_site: "0",
    account_site_call_ahead: 0,
    account_site_status_id: "0",
    account_site_address1: "",
    account_site_address2: " ",
    account_site_city: "",
    account_site_state: "",
    account_site_country: "",
    account_site_zipcode: "0",

    account_billing_info_billing_phone: "0",
    account_billing_info_phone_ext: "0",
    account_billing_info_address1: "",
    account_billing_info_address2: "",
    account_billing_info_city: "",
    account_billing_info_state: "",
    account_billing_info_country: "",
    account_billing_info_zipcode: "0",

    account_alternate_traning_location_company_name: "",
    account_alternate_traning_location_address1: "",
    account_alternate_traning_location_address2: "",
    account_alternate_traning_location_city: "",
    account_alternate_traning_location_state: "",
    account_alternate_traning_location_country: "",
    account_alternate_traning_location_zipcode: "",

    location_phone: [],

    account_main_contact_salutation: "",
    account_main_contact_firstname: "",
    account_main_contact_middlename: "",
    account_main_contact_lastname: "",
    account_main_contact_suffix: "",
    account_main_contact_title: "",
    account_main_contact_department: "",

    main_contact_phone: [],
    main_contact_email: [],
    project_managers: {
      primary: 0,
      backup: 0,
    },
    sales_reps: {
      primary: 0,
      backup: 0,
    },
  });
  const [primaryData, setPrimaryData] = useState([]);
  const [salesRepsData, setSalesRepsData] = useState([]);

  const [multiEmailFormCount, setMultiEmailFormCount] = useState([
    {
      email: "",
      email_type: "0",
      main: 0,
    },
  ]);

  const handleInputChange = (e) => {
    if (e.target.type == "checkbox") {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.checked }));
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
    }
  };

  const [altTrainerForm, setAltTrainerForm] = useState([]);

  const [altTrainerForm1, setAltTrainerForm1] = useState([
    {
      phone_number: "0",
      ext: "0",
      phone_type_id: "0",
      main: 0,
    },
  ]);

  const [allDropDowns, setAllDropDowns] = React.useState([]);

  const getData = async (allProductListData) => {
    let data = await CallDetails(accountId);
    if (data?.status) {
      let accountInfo = data?.data?.data?.accountInfo;
      accountInfo.aed_check_length = accountInfo?.aed_check_length ?? "30 Days";
      accountInfo.extra_fields = accountInfo.extra_fields ?? 0;
      accountInfo.extra_field1 = accountInfo.extra_field1 ?? "";
      accountInfo.extra_field2 = accountInfo.extra_field2 ?? "";
      // setResultData(accountInfo);

      const productInterestIds = accountInfo.product_interest
        .split(",")
        .map((id) => parseInt(id, 10));
      const filteredData = allProductListData.filter((item) =>
        productInterestIds.includes(item.value)
      );
      setSelectedProductData(filteredData);

      setFormData(accountInfo);
      setAccountTitle(accountInfo?.account_name);
      setRepsData(data?.data?.data?.accountReps);

      const RepData = data?.data?.data?.accountReps;
      RepData.forEach((item) => {
        const { contact_id, position_id, is_primary, is_backup } = item;

        if (position_id === 1) {
          if (is_primary === 1) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              project_managers: {
                ...prevFormData.project_managers,
                primary: contact_id,
              },
            }));
          }
          if (is_backup === 1) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              project_managers: {
                ...prevFormData.project_managers,
                backup: contact_id,
              },
            }));
          }
        } else if (position_id === 2) {
          if (is_primary === 1) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              sales_reps: {
                ...prevFormData.sales_reps,
                primary: contact_id,
              },
            }));
          }
          if (is_backup === 1) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              sales_reps: {
                ...prevFormData.sales_reps,
                backup: contact_id,
              },
            }));
          }
        } else if (position_id === 2) {
          if (is_primary === 1) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              sales_reps: {
                ...prevFormData.sales_reps,
                primary: contact_id,
              },
            }));
          }
          if (is_backup === 1) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              sales_reps: {
                ...prevFormData.sales_reps,
                backup: contact_id,
              },
            }));
          }
        }
      });

      // setSelectedProductData(accountInfo.product_interest);
      return data?.data?.data?.accountReps;
    }
    return "";
  };

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
    let allProductListData = [];
    if (ProductResult) {
      // ProductList
      allProductListData = prepareOptions(
        ProductResult?.products,
        "dropdown_product_interest_id",
        "dropdown_product_interest_name"
      );
      setProductModalData(allProductListData);
    }

    let repsListData = await getData(allProductListData);

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
    let AccreptList = await AccRepsDropDown();
    let AccountContactList = await ContactList(accountId);
    let AccountContectRepList = await ContectRepList();
    let AssignContectRepListData = await AssignContectRepList(accountId);

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
    }

    if (AccreptList) {
      let RepList = [];

      for (let index = 0; index < AccreptList.length; index++) {
        const RepElement = AccreptList[index];
        let obj = { ...RepElement };
        let FindData = CheckMarkList.find(
          (e) => e === RepElement?.account_main_contact_id
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
      const activeList = List.filter((item) => item.status === 1);
      setContactReps(activeList);
    }

    setShowLoading(false);
  };

  const [FormMsg, setFormMsg] = React.useState({ type: true, msg: "" });
  const [loading, setLoading] = React.useState(false);

  const sendData = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      setLoading(false);
      setValidated(true);
      return;
    }

    SaveForm();
    setLoading(false);
  };

  const SaveForm = async () => {
    setLoading(true);
    let arr = formData;
    arr.restricted_user = arr.restricted_user ? 1 : 0;
    arr.two_FA = arr.restricted_user;
    arr.location_phone = altTrainerForm;
    arr.main_contact_phone = altTrainerForm1;
    arr.main_contact_email = multiEmailFormCount;
    arr.product_interest = SelectedProductsData.map((item) => item.value).join(
      ","
    );

    let repsValueArray = [];
    if (formData?.project_managers?.primary || !formData?.project_managers?.primary) {
      repsValueArray.push({
        id: repsData[0]?.id || "",
        position_id: 1,
        contact_id: formData?.project_managers?.primary === 0 ? "" : formData?.project_managers?.primary,
        is_primary: 1,
        is_backup: 0,
        set_order: 1,
      });
    }
    if (formData?.project_managers?.backup || !formData?.project_managers?.backup) {
      repsValueArray.push({
        id: repsData[1]?.id || "",
        position_id: 1,
        contact_id: formData?.project_managers?.backup === 0 ? "" : formData?.project_managers?.backup,
        is_primary: 0,
        is_backup: 1,
        set_order: 2,
      });
    }
    if (formData?.sales_reps?.primary || !formData?.sales_reps?.primary) {
      repsValueArray.push({
        id: repsData[2]?.id || "",
        position_id: 2,
        contact_id: formData?.sales_reps?.primary === 0 ? "" : formData?.sales_reps?.primary,
        is_primary: 1,
        is_backup: 0,
        set_order: 3,
      });
    }
    if (formData?.sales_reps?.backup || !formData?.sales_reps?.backup) {
      repsValueArray.push({
        id: repsData[3]?.id || "",
        position_id: 2,
        contact_id: formData?.sales_reps?.backup === 0 ? "" : formData?.sales_reps?.backup,
        is_primary: 0,
        is_backup: 1,
        set_order: 4,
      });
    }
    arr.account_reps = repsValueArray;

    let result = await CallPOSTData(accountId, arr);
    setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
    setLoading(false);
    let url = "";
    if(user?.user_type === 0 || (user?.user_type === 2 && user?.sub_admin != "") ){
      url = "/account-details/" + formData?.account_id;
    } else {
      url = "/user/Details/" + formData?.account_id;
    }
    navigate(url, {
      state: {
        tab: "Details",
        type: result?.data?.status,
        msg: result?.data?.msg,
      },
    });
  };

  useEffect(() => {
    fetchOnload();
  }, []);

  // handle select change
  const handleProductSelect = (data) => {
    let valueArray = [];
    data.map((item, index) => {
      valueArray.push({
        label: item.label,
        value: item.value,
      });
    });
    setSelectedProductData((old) => [...valueArray]);
  };

  const handleProjectPrimarySelectChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      project_managers: {
        ...prevFormData.project_managers,
        primary: selectedId,
      },
    }));
  };

  const handleProjectBackupSelectChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      project_managers: {
        ...prevFormData.project_managers,
        backup: selectedId,
      },
    }));
  };

  const handleSalesPrimarySelectChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      sales_reps: {
        ...prevFormData.sales_reps,
        primary: selectedId,
      },
    }));
  };

  const handleSalesBackupSelectChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      sales_reps: {
        ...prevFormData.sales_reps,
        backup: selectedId,
      },
    }));
  };

  const renderSelectedTitleNames = () => {
    return SelectedProductsData?.map((item) => item.label).join(", ");
  };

  const renderSelectTitle = () => {
    return (
      <div>
        {SelectedProductsData?.length === 0
          ? "--Select One--"
          : SelectedProductsData?.length >= 2
          ? `${SelectedProductsData?.length} Selected`
          : renderSelectedTitleNames()}
      </div>
    );
  };

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
          <div className="mt-4" style={{ paddingInline: "45px" }}>
            <SubHeadingOther
              hideNew={true}
              title={accountTitle}
              subHeading={true}
              hideHierarchy={true}
              bottomLinks={false}
            />

            {/* account resps and products popup buttons */}
            <div className="d-flex mb-3">
              {/* products modal btn */}
              {/*<button
                className="btn text-primary"
                type="button"
                onClick={() => setProductShowModal(true)}
              >
                <img
                  src="/products.svg"
                  alt="svg"
                  style={{ marginRight: "1px" }}
                />
                <span className="ms-2">Products</span>
              </button>*/}

              {/* account reps modal btn */}
              {/*<button
                className="btn text-primary"
                type="button"
                onClick={() => setShowAccRepsModal(true)}
              >
                <img src="/reps.svg" alt="svg" style={{ marginRight: "1px" }} />
                <span className="ms-2">Reps</span>
              </button>*/}

              {/* account contacts modal btn */}
              <button
                className="btn text-primary"
                type="button"
                onClick={() => setContactShowModel(true)}
              >
                <img src="/reps.svg" alt="svg" style={{ marginRight: "1px" }} />
                <span className="ms-2">Contacts</span>
              </button>
            </div>

            <div
              className="container-fluid p-2 mx-3"
              style={{
                background: "#eee",
                borderBottom: "4px solid rgb(13, 110, 253)",
              }}
            >
              <div className="row mb-4">
                <div className="col-md-12" style={{ marginBottom: "20px" }}>
                  <h2 className="text-left d-inline heading">
                    Account Information
                  </h2>
                </div>

                <div className="col-md-2 col-lg-3">
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
                        value={formData?.account_name}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please Enter Account Name.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </div>

                <div className="col-md-2 col-lg-3">
                  <b className={""}>Parent Account</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="parent_account_id"
                    value={formData?.parent_account_id}
                    onChange={handleInputChange}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.parentAccount &&
                      allDropDowns?.parentAccount.map((PA, i) => (
                        <option value={PA.account_id} key={i}>
                          {PA?.account_main_contact_firstname}
                        </option>
                      ))}
                  </Form.Select>
                </div>

                <div className="col-md-2 col-lg-3">
                  <b>Distributor</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="distributor_id"
                    value={formData?.distributor_id}
                    onChange={handleInputChange}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.distributors &&
                      allDropDowns?.distributors.map((Distributor, i) => (
                        <>
                          <option
                            value={Distributor.dropdown_distributor_id}
                            key={i}
                          >
                            {Distributor.distributor_name}
                          </option>
                        </>
                      ))}
                  </Form.Select>
                </div>

                <div className="col-md-2 col-lg-3">
                  <Form.Group
                    className={" text-left "}
                    style={{ margin: "auto 10px" }}
                  >
                    <b className={""}>Restricted</b>
                    <div className="">
                      <FormControlLabel
                        className={""}
                        label=""
                        control={
                          <Switch
                            checked={
                              formData.restricted_user === 1 ||
                              formData.restricted_user
                                ? true
                                : false
                            }
                            color="primary"
                            size="medium"
                            value={true}
                            name="restricted_user"
                            onChange={handleInputChange}
                          />
                        }
                      />
                    </div>
                  </Form.Group>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col">
                  <b className={""}>Customer Type</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="customer_type_id"
                    value={formData?.customer_type_id}
                    onChange={handleInputChange}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.customerType &&
                      allDropDowns?.customerType.map((CT, i) => (
                        <>
                          <option value={CT.dropdown_customer_type_id} key={i}>
                            {CT.customer_type_name}
                          </option>
                        </>
                      ))}
                  </Form.Select>
                </div>

                <div className="col">
                  <b className={""}>Industry</b>
                  <Form.Select
                    className={styles.ddLabel}
                    name="industry_id"
                    value={formData?.industry_id}
                    onChange={handleInputChange}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.industryType &&
                      allDropDowns?.industryType.map((IT, i) => (
                        <option value={IT.dropdown_industry_id} key={i}>
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
                    value={formData?.terms_id}
                    onChange={handleInputChange}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.termsType &&
                      allDropDowns?.termsType.map((TT, i) => (
                        <option value={TT.dropdown_terms_id} key={i}>
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
                    value={formData?.lead_source_id}
                    onChange={handleInputChange}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.leadSources &&
                      allDropDowns?.leadSources.map((LS, i) => (
                        <option value={LS.dropdown_lead_source_id} key={i}>
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
                  value={SelectedProductsData || []}
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
                    value={formData?.account_status_id}
                    onChange={handleInputChange}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.accountStatus &&
                      allDropDowns?.accountStatus.map((AS, i) => (
                        <option value={AS.drop_account_status_id} key={i}>
                          {AS.account_status}
                        </option>
                      ))}
                  </Form.Select>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-5">
                  <Form.Group className={""}>
                    <Form.Label className={styles.textlabel}>
                      Website
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Website..."
                      name="website"
                      value={formData?.website}
                      onChange={handleInputChange}
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
                      value={formData?.important_note}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </div>

                {/* <div className='col-2' ></div> */}
              </div>

              <div className="">
                <MessageHandler
                  status={FormMsg.type}
                  msg={FormMsg.msg}
                  HandleMessage={setFormMsg}
                />
              </div>
            </div>

            {/* aed */}
            <div
              className="container-fluid col-12 my-5 p-2 mx-3"
              style={{
                background: "#eee",
                borderBottom: "4px solid rgb(13, 110, 253)",
              }}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                              onChange={handleInputChange}
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
                              onChange={handleInputChange}
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
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Project Managers */}
            <div
              className="container-fluid col-12 my-5 p-2 mx-3"
              style={{
                background: "#eee",
                borderBottom: "4px solid rgb(13, 110, 253)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <h2
                  className="text-left heading"
                  style={{ marginBottom: "0", width: "51%" }}
                >
                  Project Managers
                </h2>
                <h2
                  className="text-left heading"
                  style={{ marginBottom: "0", width: "50%" }}
                >
                  Sales Reps
                </h2>
              </div>
              <div className="row my-4 ">
                <Form.Group className={"col"}>
                  <Form.Label>Primary</Form.Label>
                  <Form.Select
                    className={""}
                    name="primary"
                    value={formData?.project_managers?.primary}
                    onChange={(e) => {
                      handleProjectPrimarySelectChange(e);
                    }}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {primaryData.map((item, index) => {
                      if (
                        item.account_main_contact_id !==
                        formData?.project_managers?.backup
                      ) {
                        return (
                          <option
                            value={item.account_main_contact_id}
                            key={index}
                          >
                            {item.account_main_contact_firstname}{" "}
                            {item.account_main_contact_lastname}
                          </option>
                        );
                      }
                    })}
                  </Form.Select>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Backup</Form.Label>
                  <Form.Select
                    className={""}
                    name="backup"
                    value={formData?.project_managers?.backup}
                    onChange={(e) => {
                      handleProjectBackupSelectChange(e);
                    }}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {primaryData.map((item, index) => {
                      if (
                        item.account_main_contact_id !==
                        formData?.project_managers?.primary
                      ) {
                        return (
                          <option
                            value={item.account_main_contact_id}
                            key={index}
                          >
                            {item.account_main_contact_firstname}{" "}
                            {item.account_main_contact_lastname}
                          </option>
                        );
                      }
                    })}
                  </Form.Select>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Primary</Form.Label>
                  <Form.Select
                    className={""}
                    name="sales_reps_primary"
                    value={formData?.sales_reps?.primary}
                    onChange={handleSalesPrimarySelectChange}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {salesRepsData.map((item, index) => {
                      if (
                        item.account_main_contact_id !==
                        formData?.sales_reps?.backup
                      ) {
                        return (
                          <option
                            value={item.account_main_contact_id}
                            key={index}
                          >
                            {item.account_main_contact_firstname}{" "}
                            {item.account_main_contact_lastname}
                          </option>
                        );
                      }
                    })}
                  </Form.Select>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Backup</Form.Label>
                  <Form.Select
                    className={""}
                    name="sales_reps_backup"
                    value={formData?.sales_reps?.backup}
                    onChange={handleSalesBackupSelectChange}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {salesRepsData.map((item, index) => {
                      if (
                        item.account_main_contact_id !==
                        formData?.sales_reps?.primary
                      ) {
                        return (
                          <option
                            value={item.account_main_contact_id}
                            key={index}
                          >
                            {item.account_main_contact_firstname}{" "}
                            {item.account_main_contact_lastname}
                          </option>
                        );
                      }
                    })}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            {/* bottom buttons */}
            <div className="col-12 d-flex justify-content-end mt-5 mb-4 gap-2">
              <Button
                className={" bg-red hover-bg-red text-light"}
                variant="Cancel"
                style={{ fontSize: "16px" }}
                type="button"
                disabled={loading}
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </Button>
              <Button
                className={" bg-green hover-bg-green text-light"}
                variant="success"
                onClick={(e) => {
                  sendData(e);
                }}
                style={{ fontSize: "16px" }}
                type="submit"
                disabled={loading || formData.account_name === ""}
              >
                {loading ? "Loading" : "Submit"}
              </Button>
            </div>

            {/*<ProductModal
              ProductShowModal={ProductShowModal}
              setProductShowModal={setProductShowModal}
              ProductModalData={ProductModalData}
              SelectedProductsData={SelectedProductsData}
              setSelectedProductData={setSelectedProductData}
              resultData={resultData}
            />*/}

            <ContactModel
              ShowRepsModal={contactShowModel}
              SetShowRepsModal={setContactShowModel}
              setSelectAccReps={setSelectContact}
              setAccReps={setContactRepsList}
              AccReps={contactRepsList}
              setAccRepsList={setContactReps}
              AccRepsList={contactReps}
              resultData={repsData}
            />

            {/*<AccountReps
              ShowRepsModal={ShowAccRepsModal}
              SetShowRepsModal={setShowAccRepsModal}
              setSelectAccReps={setSelectAccReps}
              setAccReps={setAccReps}
              AccReps={AccReps}
              setAccRepsList={setAccRepsList}
              AccRepsList={AccRepsList}
              resultData={repsData}
            />*/}
          </div>
        </>
      )}
    </>
  );
};

export default AccountEdit;

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Box, FormControlLabel, Switch } from "@mui/material";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import MessageHandler from "../../../components/common/MessageHandler";
import Select from "react-select";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import CustomToggleButton from "../../../components/common/toggleSwitch/CustomToggleButton";
import Contacts from "../../../img/Contacts.svg";
import Locations from "../../../img/Locations.svg";
import AEDCabinet from "../../../img/AEDCabinet.svg";
import Adult from "../../../img/Adult.svg";
import pediatricPad from "../../../img/pediatricPad.svg";
import Battery from "../../../img/Battery.svg";
import RMSBattery from "../../../img/RMSBattery.svg";
import Cancel from "../../../img/Cancel.svg";
import Check from "../../../img/Check.svg";
import Edit from "../../../img/Edit.png";
import Equipment from "../../../img/Equipment.svg";
import Accessories from "../../../img/Accessories.svg";
import MoneyBag from "../../../img/MoneyBag.svg";
import Courses from "../../../img/Courses.svg";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import PopEquipment from "./PopEquipment";
import PopAccessories from "./PopAccessories";
import PopCourses from "./PopCourses";
import AddSitespagemodal from "./AddSitesPage";
import AddSitesmodal from "./AddSitesPage";
import AddContactsmodal from "./AddContactspage";
import InpersonContactModel from "../../../components/modals/InpersonContactModel/InpersonContactModel";
import {
  ContactList,
  FetchAccountDetails,
  GetCertAgencyList,
  PriceFormat,
} from "../../../helper/BasicFn";
import {
  Debounce,
  FormatDate,
  RemoveDollarSign,
  addDollarSign,
  prepareOptions,
} from "../../../helper/Common";
import { toast } from "react-toastify";
import AddContactsmodalNew from "./AddContactsmodalNew";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../src/global.css";
import CommonDatePicker from "../../../components/common/date-picker/CommonDatePicker"
import { resetAllPops } from "../../../redux/slices/EquipmentSlice";

const NewPop = () => {

  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [validatedContract, setValidatedContract] = useState(false);
  const { accountId } = useParams();
  const dispatch = useDispatch();

  const EquipEquipmentList = useSelector(
    (state) => state.equipment.equipmentList
  );
  const ContractEquipmentList = useSelector(
    (state) => state.equipment.ContractEquipmentList
  );
  // ContractEquipmentList
  const EquipAccessoriesList = useSelector(
    (state) => state.equipment.AssesoriesList
  );
  const ContractAccessoriesList = useSelector(
    (state) => state.equipment.ContractAssesoriesList
  );
  const PopCourseListData = useSelector(
    (state) => state.equipment.POPCourseList
  );

  const [planTypes, setPlanTypes] = useState([]);
  const [selectedPlanType, setSelectedPlanType] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [equipmentModal, setEquipmentModal] = useState(false);
  const [accessoriesModal, setAccessoriesModal] = useState(false);
  const [type, setType] = useState(null);
  const [edit, setEdit] = useState("");
  const [courseModal, setCourseModal] = useState(false);
  const [addSitesModal, setAddSitesModal] = useState(false);
  const [addContactsModal, setAddContactsModal] = useState(false);
  const [isEquipmentSelected, setIsEquipmentSelected] = useState(false);
  const [getPlanType, setGetPlanType] = useState([]);
  const [cerifyAgencyList, setCertifyAgency] = useState([]);
  const [ContractPricingData, setContractPricingData] = useState([]);
  const [purchaseProEquip, setPurchaseProEquip] = useState([]);
  const [purchaseProAssesory, setPurchaseProAssesory] = useState([]);
  const [ContractPricEquip, setContractPricEquip] = useState([]);
  const [ContractPricAssesory, setContractPricAssesory] = useState([]);
  const [showSitesError, setShowSitesError] = useState(false);
  const [showContactsError, setShowContactsError] = useState(false);

  const [formData, setFormData] = useState({
    contractType: "",
    contractNumber: "",
    reqNumber: "",
    orderNumber: "",
    modificationNumber: "",
    numberOfYears: "",
    contractStart: null,
    contractYear: "",
    yearlyValue: "",
    total: "",
    spendingCap: "",
    shipping: "",
    popType: "",
    qbInvoiceNumber: "",
    invoicePaid: 0,
    invoicingInstructions: "",
    contacts: "",
    sites: "",
    planType: "",
    rental: false,
    visits: "Annual",
    rms: true,
    accessoriesIncluded: [
      "MoneyBag",
      "Battery",
      "Battery",
      "Adult",
      "Adult",
      "AEDCabinet",
      "RMSBattery",
    ],
    contractCLINS: "",
    RMSMonthlyPrice: "",
    Price: 0,
  });
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef(null);
  const saveForm = async (accountId) => {
    if (isEquipmentSelected) {
      if (!selectedPlanType) {
        setValidated(true);
        toast.error("Please Fill All The Required Details");
        return;
      }
    }
    // !formData.contractType ||
    if (
      !formData.popType
      // !formData.contacts ||
      // !formData.sites ||
      // !(isEquipmentSelected && !selectedPlanType)
    ) {
      setValidated(true);
      toast.error("Please Fill All The Required Details");
      return;
    }
    const siteIds = selectedSites.map((it) => it.account_site_info_id);
    if (!siteIds) {
      toast.error("Please Select Site");
      return "";
    }
    const checkSelectedContact =
      selectedContact?.contract_officer?.length > 0 ||
      selectedContact?.contracting_officer_rep?.length > 0 ||
      selectedContact?.other_reps?.length > 0;
    if (!checkSelectedContact) {
      toast.error("Please Select Contact");
      return "";
    }
    setLoading(true);
    const EquipmentIds = EquipEquipmentList.map(
      (it) => it.equipment_id
    ).toString();
    const EquipmentAssesIds = EquipAccessoriesList.map(
      (it) => it.accessories_id
    ).toString();
    const COntractAssesIds = ContractAccessoriesList.map(
      (it) => it.accessories_id
    ).toString();
    const ContractEquipmentIds = ContractEquipmentList.map(
      (it) => it.equipment_id
    ).toString();
    const CourseIds = PopCourseListData.map((it) => it.id).toString();

    const payLoad = {
      account_id: accountId,
      contract_type: formData.contractType,
      contract: formData.contractNumber,
      req: formData.reqNumber,
      order: formData.orderNumber,
      modification: formData.modificationNumber,
      of_year: formData.numberOfYears,
      contract_start: formData.contractStart,
      contract_year: formData.contractYear,
      yearly_value: formData.yearlyValue,
      total: formData.total,
      spending_cap: formData.spendingCap,
      shipping: formData.shipping,
      pop_type: formData.popType,
      qb_invoice: formData.qbInvoiceNumber,
      invoice_paid: formData?.invoicePaid || 0,
      invoicing_instructions: formData.invoicingInstructions,
      contact: selectedContact,
      sites: siteIds.toString(),
      plan_id: selectedPlanType,
      purchased_products_clins: formData.contractCLINS,
      purchased_products_qty: formData.Quantity,
      purchased_products_rms_yearly_cost: formData.RMSMonthlyPrice,
      purchased_products_price: formData.Price,
      purchased_products_yearly_cost: formData.YearlyPrice,
      purchased_products_equipment: EquipmentIds,
      purchased_products_accessories: EquipmentAssesIds,
      contract_pricing_equipment: ContractEquipmentIds,
      contract_pricing_accessories: COntractAssesIds,
      contract_pricing_course: CourseIds,
    };

    let result = await CallPOSTAPI("account/add-pop", payLoad);
    if (result.data.status) {
      toast.success("Pop Added Successfully");
      navigate(-1);
    } else {
      toast.error(result.data.msg);
    }
    setFormData({ type: result?.data?.status, msg: result?.data?.data });
    setLoading(false);
  };
  // save form
  //   const saveForm = async() => {
  //   setFormData({ type: result?.data?.status, msg: result?.data?.data });
  // };

  const calculateYearlyPrice = (qty, price, rmsPrice) => {
    price = price ? price : "";
    rmsPrice = rmsPrice ? rmsPrice : "";
    qty = qty ? qty : "";

    let TTPrice;
    if (rmsPrice && price) {
      TTPrice = parseInt(price) + parseInt(rmsPrice);
    } else if (price) {
      TTPrice = parseInt(price);
    } else if (rmsPrice) {
      TTPrice = parseInt(rmsPrice);
    }
    qty = parseInt(qty);
    setFormData({
      ...formData,
      YearlyPrice: qty * TTPrice * 12,
    });
  };
  useEffect(() => {
    calculateYearlyPrice(
      formData?.Quantity,
      formData?.Price,
      formData.RMSMonthlyPrice
    );
  }, [formData?.Quantity, formData?.Price, formData.RMSMonthlyPrice]);
  // const debouncedPriceFunction = Debounce(calculateYearlyPrice, 1000);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.contractStart) {
      setValidatedContract(true);
    } else {
      setValidatedContract(false);
    }

    const checkSelectedContact =
      selectedContact?.contract_officer?.length > 0 ||
      selectedContact?.contracting_officer_rep?.length > 0 ||
      selectedContact?.other_reps?.length > 0;

    if (!checkSelectedContact) {
      setShowContactsError(true);
    } else {
      setShowContactsError(false);
    }

    if (selectedSites.length === 0) {
      setShowSitesError(true);
    } else {
      setShowSitesError(false);
    }

    if (
      !formData.contractType ||
      !formData.popType ||
      !formData.contacts ||
      !formData.sites ||
      !selectedPlanType
    ) {
      setValidated(true);
      return;
    }
    // saveForm();
  };

  const calendarIcon = () => {
    return <img src="/calendar.svg" alt="calendar" />;
  };

  const callEquipment = async (type) => {
    setEquipmentModal(true);
    setType(type);
    setEdit(false);
  };

  const callAccessories = async (type2) => {
    setAccessoriesModal(true);
    setType(type2);
    setEdit(false);
  };

  const [EditAccessoriesId, seteditAccessoriesId] = useState({});
  const callEditPurchaseAccessories = async (
    type1,
    edit,
    accessories_rowData
  ) => {
    if (!accessories_rowData) {
      toast.error("Invalid ID");
    }
    seteditAccessoriesId(accessories_rowData);
    setAccessoriesModal(true);
    setType(type1);
    setEdit(edit);
  };

  const [EditContractAccessoriesId, seteditContractAccessoriesId] = useState(
    {}
  );
  const callEditContractAccessories = async (
    type2,
    edit,
    Contractaccessories_rowData
  ) => {
    if (!Contractaccessories_rowData) {
      toast.error("Invalid ID");
    }
    seteditContractAccessoriesId(Contractaccessories_rowData);
    setAccessoriesModal(true);
    setType(type2);
    setEdit(edit);
  };

  const [EditPurchaseId, seteditPurchaseId] = useState({});
  const callEditPurchaseEquipment = async (type1, edit, purchase_rowData) => {
    if (!purchase_rowData) {
      toast.error("Invalid ID");
    }
    seteditPurchaseId(purchase_rowData);
    setEquipmentModal(true);
    setType(type1);
    setEdit(edit);
  };

  const [EditContractPurchaseId, seteditContractPurchaseId] = useState({});
  const callEditContractEquipment = async (
    type2,
    edit,
    Contractpurchase_rowData
  ) => {
    seteditContractPurchaseId(Contractpurchase_rowData);
    setEquipmentModal(true);
    setType(type2);
    setEdit(edit);
  };

  const [EditCourseId, seteditCourseId] = useState({});
  const callEditCourse = async (edit, Course_rowData) => {
    console.log(Course_rowData);
    seteditCourseId(Course_rowData);
    setCourseModal(true);
    setEdit(edit);
  };

  const handleCoursesClick = async () => {
    setCourseModal(true);
  };

  const addSites = () => {
    setAddSitesModal(true);
  };

  const addContacts = () => {
    setAddContactsModal(true);
  };

  const handlePopTypeChange = (event) => {
    const selectedPopType = event.target.value;
    setIsEquipmentSelected(selectedPopType === "Equipment");
    setFormData({
      ...formData,
      popType: selectedPopType,
    });

    dispatch(resetAllPops());

  };

  // Fetch plan types from the API and set them in the state
  const [accountDetails, setAccountDetails] = useState({});

  const fetchPlanTypes = async () => {
    try {
      const response = await CallGETAPI("account/get-plans");
      const planTypesData = response?.data?.data || [];
      setPlanTypes(planTypesData);

      if (accountId) {
        const AccDetails = await FetchAccountDetails(accountId);
        setAccountDetails(AccDetails);
      }

      let cart = await GetCertAgencyList();
      if (cart.status) {
        let CertAgencyData = cart?.data?.agenciesList;
        let allCertAgencyData = prepareOptions(
          CertAgencyData,
          "certifying_agency_id",
          "certifying_agency_name"
        );
        setCertifyAgency(allCertAgencyData);
      }
    } catch (error) {
      console.error("Error fetching plan types:", error);
    }
  };

  // Function to handle Plan Type selection
  const handlePlanTypeChange = async (selectedOption) => {
    setSelectedPlanType(selectedOption);
  };

  const fetchData = async () => {
    try {
      const response = await CallGETAPI(
        `account/get-plan-by-id/${selectedPlanType}`
      );
      if (response) {
        setGetPlanType(response?.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (selectedPlanType) {
      fetchData();
    }
  }, [selectedPlanType]);

  // export const addDollarSign = (value) =>
  // {
  // 	value = value.replace('$', '');
  // 	const regex = /^\d*\.?\d*$/;

  // 	if (regex.test(value))
  // 	{
  // 		return '$' + value;
  // 	} else
  // 	{
  // 		return '$';
  // 	}
  // }
  const [optYearList, setOptYearList] = useState([]);

  const handleChange = (e, fieldName) => {
    let value = e.target.value;
    if (e.target.type === "checkbox") {
      if (e.target.checked) {
        value = 1;
      } else {
        value = 0;
      }
    }

    if (e.target.name === "numberOfYears") {
      const ar1 = parseInt(e.target.value) === 0 ? [1] : [];
      for (let i = 0; i <= parseInt(e.target.value); i++) {
        if (i === 0) {
          ar1[0] = "Base";
        } else {
          ar1.push(i);
        }
      }
      setOptYearList(ar1);
    }
    const oldData = { ...formData };

    // if(fieldName==='RMSMonthlyPrice'){
    //   oldData[fieldName]  = PriceFormat(value);
    // }else{
    //   oldData[fieldName]  = value;
    // }
    oldData[fieldName] = value;

    setFormData(oldData);

    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset the height
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px"; // Set the new height
    }
  };

  // handle calendar change
  const handleCalendarChange = (name, date) => {
    let dateValue = null;
    if (date) {
      setValidatedContract(false);
      // const formattedDate = dayjs(date).format("MM/DD/YYYY");
      const formattedDate = date ? FormatDate(date) : '';
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedDate,
      }));
    }
  };

  const [accountContact, setAccountContact] = useState([]);
  const [selectedContact, setSelectedContacts] = useState({
    contract_officer: [],
    contracting_officer_rep: [],
    other_reps: [],
  });
  // const [contactRepsList,    ] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);

  const fetchContactByAccount = async () => {
    let AccountContactList = await ContactList(accountId);

    if (AccountContactList) {
      setAccountContact(AccountContactList);
    }
  };
  useEffect(() => {
    fetchPlanTypes();
    fetchContactByAccount();
  }, []);

  // data Table Fields
  const RenderPrice = (e) => {
    if (e.value) {
      const formattedPrice = `$ ${Number(PriceFormat(e.value))
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
      return <span>{formattedPrice}</span>;
    }
    return "";
  };

  const renderPart = (e) => {
    const rowData = e.data;

    /**Physio-Control CR2 Device Included Adult Pad/Pak Spare Adult Pad/Pak Device Included Battery Spare Battery Pelican Case Orange Ready Kit
     */
    return (
      <>
        {rowData?.part ? <p className="m-0">{rowData?.part}</p> : ""}
        {rowData?.battery_part ? (
          <p className="m-0">{rowData?.battery_part}</p>
        ) : (
          ""
        )}
        {rowData?.battery_spare_toggle ? (
          <p className="m-0">{rowData?.spare_battery_part}</p>
        ) : (
          ""
        )}
        {rowData?.adult_pad ? <p className="m-0">{rowData?.adult_pad}</p> : ""}
        {rowData?.adult_spare_toggle ? (
          <p className="m-0">{rowData?.spare_adult_pad}</p>
        ) : (
          ""
        )}
        {rowData?.ped_pad ? <p className="m-0">{rowData?.ped_pad}</p> : ""}
        {rowData?.spare_ped_pad ? (
          <p className="m-0">{rowData?.spare_ped_pad}</p>
        ) : (
          ""
        )}
        {rowData?.ready_kit_part ? (
          <p className="m-0">{rowData?.ready_kit_part}</p>
        ) : (
          ""
        )}
        {rowData?.storage_part ? (
          <p className="m-0">{rowData?.storage_part}</p>
        ) : (
          ""
        )}
        {rowData?.wall_sign_part ? (
          <p className="m-0">{rowData?.wall_sign_part}</p>
        ) : (
          ""
        )}
      </>
    );
  };
  const renderEqipment = (e) => {
    const rowData = e.data;
    console.log({ rowData });
    return (
      <>
        <p className="m-0"> {rowData?.equipment_type} </p>
        {/* <p className="m-0"> {rowData?.brandName} {rowData?.modelName}</p> */}
        <p className="m-0">
          {" "}
          {rowData?.battery_part ? "Device Included Battery" : ""}{" "}
        </p>
        <p className="m-0">
          {" "}
          {rowData?.battery_spare_toggle ? "Spare Battery" : ""}{" "}
        </p>
        <p className="m-0">
          {" "}
          {rowData?.adult_pad ? "Device Included Adult Pad/Pak" : ""}{" "}
        </p>
        <p className="m-0">
          {" "}
          {rowData?.adult_spare_toggle ? "Spare Adult Pad/Pak" : ""}{" "}
        </p>
        <p className="m-0"> {rowData?.ped_pad ? "Pediatric Pad" : ""} </p>
        <p className="m-0">
          {" "}
          {rowData?.spare_ped_pad ? " Spare Pediatric Pad" : ""}{" "}
        </p>
        <p className="m-0"> {rowData?.ready_kit_part ? "Ready Kit" : ""} </p>
        <p className="m-0">{rowData?.storageBrand ? "Storage" : ""} </p>
        <p className="m-0"> {rowData?.wall_sign_part ? "Wall Sign" : ""} </p>
      </>
    );
  };

  const renderSitesName = (e) => {
    const val = e.data;
    const SiteNAme = val.sitesNames.map((it) => it.account_site_name) || [];
    return (
      <>
        {SiteNAme.map((it) => (
          <p className="m-0">{it}</p>
        ))}
      </>
    );
  };

  const RenderEquipmentEditButton = (e) => {
    const val = e.data;
    console.log(val);
    return (
      <>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            style={{
              border: "none",
              display: "flex",
              flexDirection: "row",
              backgroundColor: "transparent",
            }}
            onClick={() => callEquipment("1")}
          >
            <img
              src={Edit}
              style={{ height: "17px", marginRight: "3%", cursor: "pointer" }}
            />
            <p
              className="m-0"
              style={{
                color: "rgba(12, 113, 195, 1)",
                fontSize: "17px",
                lineHeight: "1",
                cursor: "pointer",
              }}
            >
              Edit
            </p>
          </button>{" "}
        </div>
      </>
    );
  };

  const RenderPurchaseAccessoryEditButton = (e) => {
    const rowData = e.data;
    console.log({ rowData });
    return (
      <>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            style={{
              border: "none",
              display: "flex",
              flexDirection: "row",
              backgroundColor: "transparent",
            }}
            onClick={() => callEditPurchaseAccessories("1", "edit", rowData)}
          >
            <img
              src={Edit}
              style={{ height: "17px", marginRight: "3%", cursor: "pointer" }}
            />
            <p
              className="m-0"
              style={{
                color: "rgba(12, 113, 195, 1)",
                fontSize: "17px",
                lineHeight: "1",
                cursor: "pointer",
              }}
            >
              Edit
            </p>
          </button>{" "}
        </div>
      </>
    );
  };

  const RenderContractAccessoryEditButton = (e) => {
    const rowData = e.data;
    return (
      <>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            style={{
              border: "none",
              display: "flex",
              flexDirection: "row",
              backgroundColor: "transparent",
            }}
            onClick={() => callEditContractAccessories("2", "edit", rowData)}
          >
            <img
              src={Edit}
              style={{ height: "17px", marginRight: "3%", cursor: "pointer" }}
            />
            <p
              className="m-0"
              style={{
                color: "rgba(12, 113, 195, 1)",
                fontSize: "17px",
                lineHeight: "1",
                cursor: "pointer",
              }}
            >
              Edit
            </p>
          </button>{" "}
        </div>
      </>
    );
  };

  const RenderPurchaseEquipmentEditButton = (e) => {
    const rowData = e.data;
    return (
      <>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            style={{
              border: "none",
              display: "flex",
              flexDirection: "row",
              backgroundColor: "transparent",
            }}
            onClick={() => callEditPurchaseEquipment("1", "edit", rowData)}
          >
            <img
              src={Edit}
              style={{ height: "17px", marginRight: "3%", cursor: "pointer" }}
            />
            <p
              className="m-0"
              style={{
                color: "rgba(12, 113, 195, 1)",
                fontSize: "17px",
                lineHeight: "1",
                cursor: "pointer",
              }}
            >
              Edit
            </p>
          </button>{" "}
        </div>
      </>
    );
  };

  const RenderContractEquipmentEditButton = (e) => {
    const rowData = e.data;
    return (
      <>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            style={{
              border: "none",
              display: "flex",
              flexDirection: "row",
              backgroundColor: "transparent",
            }}
            onClick={() => callEditContractEquipment("2", "edit", rowData)}
          >
            <img
              src={Edit}
              style={{ height: "17px", marginRight: "3%", cursor: "pointer" }}
            />
            <p
              className="m-0"
              style={{
                color: "rgba(12, 113, 195, 1)",
                fontSize: "17px",
                lineHeight: "1",
                cursor: "pointer",
              }}
            >
              Edit
            </p>
          </button>{" "}
        </div>
      </>
    );
  };

  const RenderEditCourses = (e) => {
    const rowData = e.data;
    return (
      <>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            style={{
              border: "none",
              display: "flex",
              flexDirection: "row",
              backgroundColor: "transparent",
            }}
            onClick={() => callEditCourse("edit", rowData)}
          >
            <img
              src={Edit}
              style={{ height: "17px", marginRight: "3%", cursor: "pointer" }}
            />
            <p
              className="m-0"
              style={{
                color: "rgba(12, 113, 195, 1)",
                fontSize: "17px",
                lineHeight: "1",
                cursor: "pointer",
              }}
            >
              Edit
            </p>
          </button>{" "}
        </div>
      </>
    );
  };

  const RenderTotalPrice = (e) => {
    const rowData = e.data;
    const totalPrice = rowData?.quantity * rowData?.price;
    const formattedPrice = totalPrice
      ? `$ ${Number(totalPrice)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
      : "";
    return <>{formattedPrice}</>;
  };

  useEffect(() => {
    const checkSelectedContact =
      selectedContact?.contract_officer?.length > 0 ||
      selectedContact?.contracting_officer_rep?.length > 0 ||
      selectedContact?.other_reps?.length > 0;
    if (!checkSelectedContact) {
      // setShowContactsError(true);
    } else {
      setShowContactsError(false);
    }
  }, [selectedContact]);

  return (
    <div className="mt-4" style={{ position: "relative", width: "100%", paddingInline: "45px" }}>
      <SubHeadingOther
        hideNew="tab"
        title={accountDetails?.account_name}
        newUrl=""
        subHeading={true}
        hideHierarchy={true}
        bottomLinks={false}
      />

      <Form
        className=""
        onSubmit={handleSubmit}
        noValidate
        validated={validated}
        id="create-new-equipment-form"
      >
        <div
          className="container-fluid mt-4 bottom-border-blue pt-2"
          style={{
            borderBottom: "4px solid rgb(13, 110, 253)",
            background: "#eee",
            paddingBottom: "20px",
          }}
        >
          <h2 className="heading">Period of Performance Information</h2>

          {/* <div className="row my-3"> */}
          <div className="row my-3 NewPopField">
            <Form.Group className={"col"}>
              <Form.Label>Contract Type</Form.Label>
              <Form.Control
                type="text"
                name="contractType"
                value={formData.contractType}
                onChange={(e) => handleChange(e, "contractType")}
              />
            </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>Contract #</Form.Label>
              <Form.Control
                type="text"
                name="contractNumber"
                value={formData.contractNumber}
                onChange={(e) => handleChange(e, "contractNumber")}
              />
            </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>Req #</Form.Label>
              <Form.Control
                type="text"
                name="reqNumber"
                value={formData.reqNumber}
                onChange={(e) => handleChange(e, "reqNumber")}
              />
            </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>Order #</Form.Label>
              <Form.Control
                type="text"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={(e) => handleChange(e, "orderNumber")}
              />
            </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>Modification #</Form.Label>
              <Form.Control
                type="text"
                name="modificationNumber"
                value={formData.modificationNumber}
                onChange={(e) => handleChange(e, "modificationNumber")}
              />
            </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>Option Years</Form.Label>
              <Form.Control
                type="text"
                name="numberOfYears"
                value={formData.numberOfYears}
                onChange={(e) => handleChange(e, "numberOfYears")}
              />
            </Form.Group>
          </div>

          <div className="row my-3 NewPopField">
            <Form.Group className={"col"}>
              <Form.Label>Contract Start*</Form.Label>
              <div
                className={
                  validatedContract
                    ? "d-flex align-items-center calendar-input-btn invalid-datepicker-div"
                    : "d-flex align-items-center calendar-input-btn"
                }
              >
                {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <Stack spacing={3} >
                      <DesktopDatePicker
                        label=""
                        // inputFormat="HH:mm:ss"
                        components={{
                          OpenPickerIcon: calendarIcon,
                        }}
                        // minDate={new Date()}
                        value={formData.contractStart}
                        onChange={(newValue) => handleCalendarChange(newValue, 'contractStart')}
                        renderInput={(params) => <TextField className='form-control' {...params} error={false} 
                        />}
                        // isInvalid={formData.contractStart === ''}
                        required
                     />
                    </Stack>
                  </LocalizationProvider> */}

                {/* <DatePicker
                  selected={
                    formData.contractStart
                      ? new Date(formData.contractStart)
                      : null
                  }
                  onChange={(date) =>
                    handleCalendarChange(date, "contractStart")
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                /> */}

                <CommonDatePicker
                  calName={"contractStart"}
                  CalVal={formData.contractStart ? FormatDate(formData.contractStart) : null}
                  HandleChange={(name, val) =>
                    handleCalendarChange(name, val)
                  }
                  disabled={false}
                />

              </div>
              {validatedContract && (
                <div className="invalid mt-2">This field is required.</div>
              )}
            </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>Contract Year</Form.Label>
              <select
                className="form-control"
                value={formData.contractYear}
                name="contractYear"
                onChange={(e) => handleChange(e, "contractYear")}
              >
                <option value="">--Select One--</option>
                {optYearList.length > 0
                  ? optYearList.map((it) => <option value={it}>{it}</option>)
                  : ""}
              </select>
              {/* <Form.Control
                  type="number"
                  name="contractYear"
                  max={10}
                  min={1}
                  value={formData.contractYear}
                  onChange={(e) => handleChange(e, 'contractYear')}
                /> */}
            </Form.Group>
            <Form.Group className={"col dollar-sign"}>
              <Form.Label>Yearly value</Form.Label>
              <Form.Control
                type="number"
                name="yearlyValue"
                value={formData.yearlyValue}
                onChange={(e) => handleChange(e, "yearlyValue")}
              />
            </Form.Group>

            <Form.Group className={"col dollar-sign"}>
              <Form.Label>Total</Form.Label>
              <Form.Control
                type="number"
                name="total"
                value={formData.total}
                onChange={(e) => handleChange(e, "total")}
              />
            </Form.Group>

            <Form.Group className={"col dollar-sign"}>
              <Form.Label>Spending Cap</Form.Label>
              <Form.Control
                type="number"
                name="spendingCap"
                value={formData.spendingCap}
                onChange={(e) => handleChange(e, "spendingCap")}
              />
            </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>Shipping</Form.Label>
              <select
                className="form-control"
                type="text"
                name="shipping"
                value={formData.shipping}
                onChange={(e) => handleChange(e, "shipping")}
                style={{}}
                placeholder="- Select one -"
              >
                <option value="">- Select-One -</option>
                <option value="Charges">Charge</option>
                <option value="FOB">FOB</option>
              </select>
            </Form.Group>
          </div>
          {/* </div> */}

          <div className="row my-3">
            <Form.Group className={"col NewPoptypeField"} >
              <Form.Label>POP Type*</Form.Label>
              <select
                className="form-control"
                name="popType"
                value={formData.popType}
                onChange={handlePopTypeChange}
                required
              >
                <option value="">--Select One--</option>
                <option value="Equipment">Equipment</option>
                <option value="Training">Training</option>
              </select>
              <Form.Control.Feedback type="invalid">
                This field is required
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={"col NewPoptypeField"} >
              <Form.Label>QB Invoice Number</Form.Label>
              <Form.Control
                type="text"
                name="qbInvoiceNumber"
                value={formData.qbInvoiceNumber}
                onChange={(e) => handleChange(e, "qbInvoiceNumber")}
              />
            </Form.Group>

            <Form.Group className={"col invoicePaidDiv"} style={{ maxWidth: "150px" }}>
              <Form.Label>Invoice Paid</Form.Label>
              <CustomToggleButton
                ToggleName="invoicePaid"
                ToggleValue={formData?.invoicePaid}
                changeHandler={(e) => handleChange(e, "invoicePaid")}
                style={{ height: "7px" }}
              />

              {/* <FormControlLabel 
                className="row" 
                name="invoicePaid"
                value="1"
                onChange={(e)=>handleChange(e,'invoicePaid')}
                style={{ maxWidth: "50px" }} 
                control={<Switch defaultChecked />} label="" /> */}
            </Form.Group>

            <Form.Group className={"col NewPoptypeField"} style={{ maxWidth: "auto" }}>
              <Form.Label>Invoicing Instructions</Form.Label>
              <Form.Control
                as="textarea"
                ref={textAreaRef}
                name="invoicingInstructions"
                value={formData.invoicingInstructions}
                onChange={(e) => handleChange(e, "invoicingInstructions")}
                style={{
                  wordWrap: "break-word", // Word wrap property
                  overflowWrap: "break-word", // Overflow wrap property
                  overflow: "hidden", // Hide content that overflows
                  height: "auto", // Fixed height for the textarea
                  resize: "vertical", // Allow vertical resizing
                }}
              />
            </Form.Group>
          </div>

          <div className="row ">
            <div className={"col NewPopContactField"} >
              <Form.Group className="col">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Form.Label>Contacts*</Form.Label>
                  <button
                    style={{ border: "none" }}
                    onClick={() => addContacts(true)}
                    type="button"
                  >
                    <img src={Contacts} alt="" />
                    <Form.Label
                      style={{
                        color: "rgb(12, 113, 195)",
                        fontFamily: "Calibri",
                        fontStyle: "normal",
                        marginLeft: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Contacts
                    </Form.Label>
                  </button>
                </div>

                {addContactsModal && (
                  <AddContactsmodalNew
                    addContactsModal={addContactsModal}
                    setAddContactsModal={setAddContactsModal}
                    accountId={accountId}
                    accountContact={accountContact}
                    selectedContact={selectedContact}
                    setSelectedContacts={setSelectedContacts}
                  />
                )}

                {/* <Form.Control
                  type="text"
                  name="contacts"
                  value={formData.contacts}
                  onChange={(e)=>handleChange(e,'contacts')}
                  required
                  style={{ height: "150px" }} // Adjust the height as needed
                /> */}

                <div
                  className="data-table  col-md-12 bg-white "
                  style={{ height: "150px" }}
                >
                  <table
                    className="w-100 border-gray"
                    style={{ height: "150px" }}
                  >
                    <thead style={{ backgroundColor: "#999999" }}>
                      <tr className="" style={{ backgroundColor: "#999999" }}>
                        <th
                          scope="col"
                          width="33%"
                          className=" py-2 px-2 bg-tbl-border border-t-blue border-l-blue border-r-blue"
                          style={{ backgroundColor: "#999999 !important" }}
                        >
                          Contract Officer
                        </th>
                        <th
                          scope="col"
                          width="33%"
                          className=" py-2 px-2 bg-tbl-border border-t-blue border-r-blue"
                        >
                          Contract Officer Rep
                        </th>
                        <th
                          scope="col"
                          width="33%"
                          className=" py-2 px-2 bg-tbl-border border-t-blue border-r-blue"
                        >
                          Other Rep
                        </th>
                      </tr>
                    </thead>
                    <tbody className="odd-even-row">
                      <tr>
                        <td className=" px-2 bg-tbl-border border-l-blue border-r-blue border-b-blue">
                          {selectedContact?.contract_officer.map((it, i) => (
                            <div key={i}>{it?.contact_name}</div>
                          ))}
                        </td>
                        <td className="py-2 px-2 bg-tbl-border border-r-blue border-b-blue">
                          {selectedContact?.contracting_officer_rep.map(
                            (it, i) => (
                              <div key={i}>{it?.contact_name}</div>
                            )
                          )}
                        </td>
                        <td className="py-2 px-2 bg-tbl-border border-r-blue border-b-blue">
                          {selectedContact?.other_reps.map((it, i) => (
                            <div key={i}>{it?.contact_name}</div>
                          ))}
                        </td>
                        {/* <td className='py-2 px-2 bg-tbl-border border-r-blue'>{selectedContact?.contracting_officer_rep?.contact_name}</td>
                  <td className='py-2 px-2 bg-tbl-border'>{selectedContact?.other_reps?.contact_name}</td> */}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {showContactsError && (
                  <div className="invalid mt-2">This field is required.</div>
                )}
                <Form.Control.Feedback type="invalid">
                  This field is required
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className={"col NewPopContactField"}>
              <Form.Group className={"col"}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Form.Label>Sites*</Form.Label>
                  <button
                    style={{ border: "none", cursor: "pointer" }}
                    onClick={() => addSites()}
                    type="button"
                  >
                    <img src={Locations} alt="" />
                    <Form.Label
                      style={{
                        color: "rgb(12, 113, 195)",
                        fontFamily: "Calibri",
                        fontStyle: "normal",
                        marginLeft: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Sites
                    </Form.Label>
                  </button>
                </div>
                {/* <Form.Control
                  type="text"
                  name="sites"
                  value={formData.sites}
                  onChange={(e)=>handleChange(e,'sites')}
                  required
                  style={{ height: "150px" }}
                /> */}
                <div className="bg-white border-t-blue border-b-blue border-r-blue border-l-blue">
                  <ul
                    className=""
                    style={{
                      height: "145px",
                      overflow: "auto",
                      listStyle: "none",
                      paddingLeft: "10px",
                    }}
                  >
                    {selectedSites?.map((site) => (
                      <li key={site?.id} className="list-item mt-2 pl-1">
                        <span>{site?.account_site_name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedSites.length <= 0 && showSitesError && (
                  <div className="invalid mt-2">This field is required.</div>
                )}

                {/* <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback> */}
              </Form.Group>
            </div>
          </div>

          {addSitesModal && (
            <AddSitesmodal
              addSitesModal={addSitesModal}
              setAddSitesModal={setAddSitesModal}
              selectedSites={selectedSites}
              setSelectedSites={setSelectedSites}
              accountId={accountId}
            />
          )}
        </div>

        {formData?.popType === "Equipment" && (
          <>
            <div
              className=" mt-4 bottom-border-blue p-2"
              style={{
                borderBottom: "4px solid rgb(13, 110, 253)",
                background: "#eee",
                // position: "absolute",
                // width: "94vw",
              }}
            >
              {/* {formData.popType != 'Training' && ( */}
              <>
                <h2 className="heading">Plan Information</h2>

                <div className="row my-3">
                  <div className="row" style={{ width: "300px" }}>
                    <Form.Group className={"col"}>
                      <Form.Label>Plan Type*</Form.Label>
                      <select
                        className="form-control"
                        name="planType"
                        value={selectedPlanType}
                        onChange={(e) => handlePlanTypeChange(e.target.value)}
                        required
                      >
                        <option value="">- Select Plan Type -</option>
                        {planTypes.map((planType) => (
                          <option key={planType?.id} value={planType?.id}>
                            {planType?.plan_name}
                          </option>
                        ))}
                      </select>
                      <Form.Control.Feedback type="invalid">
                        This field is required
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  {selectedPlanType ? (
                    <>
                      <Form.Group className={"col"}>
                        <Form.Label>Rental</Form.Label>
                        <div className="row">
                          {getPlanType.rental == "0" ? (
                            <img
                              className="col"
                              style={{
                                marginLeft: "0px",
                                maxWidth: "50px",
                                height: "25px",
                              }}
                              src={Cancel}
                            />
                          ) : (
                            <img
                              className="col"
                              style={{
                                marginLeft: "0px",
                                maxWidth: "50px",
                                height: "25px",
                              }}
                              src={Check}
                            />
                          )}
                          <h1
                            className="col"
                            style={{
                              fontSize: "15px",
                              marginTop: "0px",
                              fontWeight: "400",
                            }}
                          >
                            {getPlanType.rental_duration}
                          </h1>
                        </div>
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Visits</Form.Label>
                        <div className="row">
                          {getPlanType.visits === "0" ||
                            getPlanType.visits === null ? (
                            <img
                              className="col"
                              style={{ maxWidth: "20%", height: "20px" }}
                              src={Cancel}
                            />
                          ) : (
                            <img
                              className="col"
                              style={{ maxWidth: "20%", height: "25px" }}
                              src={Check}
                            />
                          )}{" "}
                          <h1
                            className="col"
                            style={{
                              fontSize: "15px",
                              marginTop: "0px",
                              fontWeight: "400",
                            }}
                          >
                            {getPlanType.visits}
                          </h1>
                        </div>
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label> Medical Direction</Form.Label>
                        <div className="row">
                          {getPlanType.medical_direction === 0 ||
                            getPlanType.medical_direction === null ? (
                            <img
                              className="col"
                              style={{ maxWidth: "20%", height: "20px" }}
                              src={Cancel}
                            />
                          ) : (
                            <img
                              className="col"
                              style={{ maxWidth: "20%", height: "25px" }}
                              src={Check}
                            />
                          )}{" "}
                        </div>
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>RMS</Form.Label>
                        <div
                          className="row"
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            flexDirection: "row",
                          }}
                        >
                          {getPlanType?.rms_billable === 1 ? (
                            <img
                              className="col"
                              style={{
                                marginLeft: "0px",
                                maxWidth: "40px",
                                height: "20px",
                              }}
                              src={MoneyBag}
                            />
                          ) : (
                            ""
                          )}
                          {getPlanType.rms == "0" ? (
                            <img
                              className="col"
                              style={{ maxWidth: "20%", height: "20px" }}
                              src={Cancel}
                            />
                          ) : (
                            <img
                              className="col"
                              style={{ maxWidth: "20%", height: "25px" }}
                              src={Check}
                            />
                          )}
                        </div>
                      </Form.Group>

                      <Form.Group className={"col"}>
                        <Form.Label>Accessories Included</Form.Label>
                        <div className="">
                          {getPlanType.accessory_billable == "1" ? (
                            <img
                              className="col"
                              style={{
                                marginRight: "4px",
                                maxWidth: "40px",
                                height: "25px",
                              }}
                              src={MoneyBag}
                            />
                          ) : null}
                          {getPlanType.battery == "1" ? (
                            <img
                              src={Battery}
                              alt=""
                              style={{ marginRight: "4px" }}
                            />
                          ) : null}
                          {getPlanType.spare_battery == "1" ? (
                            <img
                              src={Battery}
                              alt=""
                              style={{ marginRight: "4px" }}
                            />
                          ) : null}
                          {getPlanType.adult_pad == "1" ? (
                            <img
                              src={Adult}
                              alt=""
                              style={{ marginRight: "4px" }}
                            />
                          ) : null}
                          {getPlanType.spare_adult == "1" ? (
                            <img
                              src={Adult}
                              alt=""
                              style={{ marginRight: "4px" }}
                            />
                          ) : null}
                          {getPlanType.aed_cabinet_9v == "1" ? (
                            <img
                              src={AEDCabinet}
                              alt=""
                              style={{ marginRight: "4px" }}
                            />
                          ) : null}
                          {getPlanType.rms_battery == "1" ? (
                            <img
                              src={RMSBattery}
                              alt="RMS Battery"
                              style={{ marginRight: "4px" }}
                            />
                          ) : null}
                          {getPlanType.pediatric_pad == "1" ? (
                            <img
                              src={pediatricPad}
                              alt=""
                              style={{ marginRight: "4px", height: "26px" }}
                            />
                          ) : null}
                          {getPlanType.pediatric_spare_pad == "1" ? (
                            <img
                              src={pediatricPad}
                              alt="pediatric Pad"
                              style={{ height: "26px" }}
                            />
                          ) : null}
                        </div>
                      </Form.Group>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                {/* </div> */}
              </>
            </div>
          </>
        )}

        {formData?.popType === "Equipment" && (
          <>
            <div
              className="mt-4 bottom-border-blue p-2"
              style={{
                // display:"flex",
                borderBottom: "4px solid rgb(13, 110, 253)",
                background: "#eee",
                // position: "absolute",
              }}
            >
              {/* {formData.popType != 'Training' && ( */}
              <>
                <h2 className="heading">Purchased Products</h2>
                <Form.Label style={{ marginRight: "1190px" }}>
                  Program Management
                </Form.Label>
                <div className="row ">
                  <Form.Group className={"col"}>
                    <Form.Label>CLINS</Form.Label>
                    <Form.Control
                      type="text"
                      name="contractCLINS"
                      value={formData.contractCLINS}
                      onChange={(e) => handleChange(e, "contractCLINS")}
                    />
                  </Form.Group>

                  <Form.Group className={"col"} style={{ maxWidth: "300px" }}>
                    <Form.Label>Qty</Form.Label>
                    <Form.Control
                      type="number"
                      name="Quantity"
                      value={formData.Quantity}
                      onChange={(e) => {
                        handleChange(e, "Quantity");
                        // debouncedPriceFunction(e.target.value,formData.Price,formData.RMSMonthlyPrice)
                      }}
                    />
                  </Form.Group>

                  <Form.Group
                    className={"col dollar-sign"}
                    style={{ maxWidth: "300px" }}
                  >
                    <Form.Label>RMS Monthly Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="RMSMonthlyPrice"
                      value={formData.RMSMonthlyPrice}
                      onChange={(e) => {
                        handleChange(e, "RMSMonthlyPrice");
                        // debouncedPriceFunction(formData?.Quantity,formData.Price,e.target.value)
                      }}
                    />
                  </Form.Group>

                  <Form.Group
                    className={"col dollar-sign"}
                    style={{ maxWidth: "300px" }}
                  >
                    <Form.Label>Plan Monthly Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="Price"
                      value={formData.Price}
                      onChange={(e) => {
                        handleChange(e, "Price");
                        // debouncedPriceFunction(formData?.Quantity,e.target.value,formData.RMSMonthlyPrice)
                      }}
                    />
                  </Form.Group>

                  <Form.Group className={"col dollar-sign"}>
                    <Form.Label>Yearly Cost</Form.Label>
                    <Form.Control
                      type="number"
                      name="YearlyPrice"
                      value={PriceFormat(
                        formData.YearlyPrice ? formData.YearlyPrice : ""
                      )}
                      readOnly
                      onChange={(e) => handleChange(e, "YearlyPrice")}
                    />
                  </Form.Group>
                </div>

                <div className="row my-3">
                  <div className="col">
                    <Form.Group
                      className={"col"}
                      style={{
                        width: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Form.Label>Equipment</Form.Label>
                      <button
                        style={{ border: "none" }}
                        onClick={() => callEquipment("1")}
                      >
                        <img src={Equipment} alt="" />
                        <Form.Label
                          style={{
                            color: "rgb(12, 113, 195)",
                            fontFamily: "Calibri",
                            fontStyle: "normal",
                            marginLeft: "3px",
                            cursor: "pointer",
                          }}
                        >
                          Equipment
                        </Form.Label>
                      </button>
                    </Form.Group>

                    {/* {JSON.stringify(equipmentList)} */}

                    <DataGrid
                      className="col"
                      dataSource={EquipEquipmentList}
                      minHeight={300}
                      maxHeight={500}
                      width={"auto"}
                      keyExpr="equipment_id"
                      showColumnLines={true}
                      showRowLines={true}
                      showBorders={false}
                      allowSorting={false}
                      rowAlternationEnabled={false}
                    >
                      <Column
                        dataField="clins"
                        cellRender={(e) => {
                          return <>{e.value ? e.value : ""}</>;
                        }}
                        width={100}
                        caption="CLINS"
                        cssClass="column-header"
                        allowSorting={false}
                      />
                      <Column
                        dataField="equipment_type"
                        cssClass="column-header"
                        allowSorting={false}
                        caption={"Equipment"}
                        cellRender={renderEqipment}
                        minWidth={300}
                      />
                      <Column
                        dataField="part"
                        cssClass="column-header"
                        allowSorting={false}
                        caption={"Part #"}
                        cellRender={renderPart}
                        minWidth={200}
                      />
                      <Column
                        dataField="purchase_type"
                        cssClass="column-header"
                        allowSorting={false}
                        caption={"Purchase Type"}
                      />
                      <Column
                        dataField="condition"
                        cssClass="column-header"
                        allowSorting={false}
                        caption={"Condition"}
                      />
                      <Column
                        dataField="quantity"
                        cssClass="column-header"
                        allowSorting={false}
                        caption={"Qty"}
                      />
                      <Column
                        dataField="price"
                        cssClass="column-header"
                        allowSorting={false}
                        caption={"Price"}
                        cellRender={RenderPrice}
                      />
                      <Column
                        dataField="price"
                        caption={"Total Price"}
                        cssClass="column-header"
                        allowSorting={false}
                        cellRender={RenderTotalPrice}
                      />
                      <Column
                        dataField="action"
                        caption={"Action"}
                        cssClass="column-header"
                        allowSorting={false}
                        cellRender={RenderPurchaseEquipmentEditButton}
                      />

                      {/* <Column dataField="condition" cssClass="column-header" allowSorting={false} /> */}
                      <Scrolling columnRenderingMode="virtual" />
                      <Paging enabled={false} />
                    </DataGrid>
                  </div>
                </div>

                <div className="row my-5">
                  <div className="col">
                    <Form.Group
                      className={"col"}
                      style={{
                        width: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Form.Label>Accessories</Form.Label>
                      <button
                        style={{ border: "none", cursor: "pointer" }}
                        onClick={() => {
                          callAccessories("1");
                        }}
                      >
                        <img src={Accessories} alt="" />
                        <Form.Label
                          style={{
                            color: "rgb(12, 113, 195)",
                            fontFamily: "Calibri",
                            fontStyle: "normal",
                            marginLeft: "3px",
                            cursor: "pointer",
                          }}
                        >
                          Accessories
                        </Form.Label>
                      </button>
                    </Form.Group>
                    <DataGrid
                      className="col"
                      dataSource={EquipAccessoriesList}
                      minHeight={300}
                      width={"auto"}
                      keyExpr="accessories_id"
                      showColumnLines={true}
                      showRowLines={true}
                      showBorders={false}
                      rowAlternationEnabled={false}
                    >
                      {/* <Column dataField="clins" cellRender={(e)=>{
                      return <>{e.value?e.value:''}</>
                    }} width={180} caption="CLINS" cssClass="column-header" allowSorting={false} /> */}
                      <Column
                        dataField="accessories_type"
                        cssClass="column-header"
                        allowSorting={false}
                        caption={"Accessory"}
                      />
                      <Column
                        dataField="part"
                        cssClass="column-header"
                        allowSorting={false}
                        caption={"Part #"}
                      />
                      <Column
                        dataField="condition"
                        cssClass="column-header"
                        allowSorting={false}
                        caption={"Condition"}
                      />
                      <Column
                        dataField="quantity"
                        cssClass="column-header"
                        allowSorting={false}
                        caption={"Qty"}
                      />

                      <Column
                        dataField="price"
                        cssClass="column-header"
                        allowSorting={false}
                        caption={"Price"}
                        cellRender={RenderPrice}
                      />
                      <Column
                        dataField="price"
                        cssClass="column-header"
                        allowSorting={false}
                        caption={"Total Price"}
                        cellRender={RenderTotalPrice}
                      />
                      <Column
                        dataField="action"
                        caption={"Action"}
                        cssClass="column-header"
                        allowSorting={false}
                        cellRender={RenderPurchaseAccessoryEditButton}
                      />
                      <Scrolling columnRenderingMode="virtual" />
                      <Paging enabled={false} />
                    </DataGrid>
                  </div>
                </div>
              </>
            </div>
          </>
        )}


        {formData?.popType === "Equipment" && (
          <>
            <div
              className="container-fluid mt-4 bottom-border-blue pt-2"
              style={{
                borderBottom: "4px solid rgb(13, 110, 253)",
                background: "#eee",
              }}
            >
              <h2 className="heading">Contract Pricing</h2>

              <div className="row ">
                <div className="col">
                  <Form.Group
                    className={"col"}
                    style={{
                      width: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Form.Label>Equipment</Form.Label>
                    <button
                      type="button"
                      style={{ border: "none" }}
                      onClick={() => {
                        callEquipment("2");
                      }}
                    >
                      <img src={Equipment} alt="" />
                      <Form.Label
                        style={{
                          color: "rgb(12, 113, 195)",
                          fontFamily: "Calibri",
                          fontStyle: "normal",
                          marginLeft: "3px",
                          cursor: "pointer",
                        }}
                      >
                        Equipment
                      </Form.Label>
                    </button>
                  </Form.Group>

                  <DataGrid
                    className="col"
                    dataSource={ContractEquipmentList}
                    minHeight={300}
                    maxHeight={500}
                    width={"auto"}
                    keyExpr="equipment_id"
                    showColumnLines={true}
                    showRowLines={true}
                    showBorders={false}
                    allowSorting={false}
                    rowAlternationEnabled={false}
                  >
                    <Column
                      dataField="clins"
                      cellRender={(e) => {
                        return <>{e.value ? e.value : ""}</>;
                      }}
                      width={100}
                      caption="CLINS"
                      cssClass="column-header"
                      allowSorting={false}
                    />
                    <Column
                      dataField="equipment_type"
                      cssClass="column-header"
                      allowSorting={false}
                      caption={"Equipment"}
                      cellRender={renderEqipment}
                      minWidth={400}
                    />
                    <Column
                      dataField="part"
                      cssClass="column-header"
                      allowSorting={false}
                      caption={"Part #"}
                      cellRender={renderPart}
                      minWidth={200}
                    />
                    <Column
                      dataField="purchase_type"
                      cssClass="column-header"
                      allowSorting={false}
                      caption={"Purchase Type"}
                    />
                    <Column
                      dataField="condition"
                      cssClass="column-header"
                      allowSorting={false}
                      caption={"Condition"}
                    />
                    {/* <Column dataField="quantity" cssClass="column-header" allowSorting={false} caption={'Qty'} /> */}
                    <Column
                      dataField="price"
                      cssClass="column-header"
                      allowSorting={false}
                      caption={"Price"}
                      cellRender={RenderPrice}
                    />
                    <Column
                      dataField="action"
                      caption={"Action"}
                      cssClass="column-header"
                      allowSorting={false}
                      cellRender={RenderContractEquipmentEditButton}
                    />
                    {/* <Column dataField="condition" cssClass="column-header" allowSorting={false} /> */}
                    <Scrolling columnRenderingMode="virtual" />
                    <Paging enabled={false} />
                  </DataGrid>
                </div>
              </div>

              <div className="row my-5">
                <div className="col">
                  <Form.Group
                    className={"col"}
                    style={{
                      width: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Form.Label>Accessories</Form.Label>
                    <button
                      style={{ border: "none", cursor: "pointer" }}
                      onClick={() => {
                        callAccessories("2");
                      }}
                    >
                      <img src={Accessories} alt="" />
                      <Form.Label
                        style={{
                          color: "rgb(12, 113, 195)",
                          fontFamily: "Calibri",
                          fontStyle: "normal",
                          marginLeft: "3px",
                          cursor: "pointer",
                        }}
                      >
                        Accessories
                      </Form.Label>
                    </button>
                  </Form.Group>

                  <DataGrid
                    className="col"
                    dataSource={ContractAccessoriesList}
                    minHeight={300}
                    width={"auto"}
                    keyExpr="accessories_id"
                    showColumnLines={true}
                    showRowLines={true}
                    showBorders={false}
                    rowAlternationEnabled={false}
                  >
                    {/* <Column dataField="clins" cellRender={(e)=>{
                      return <>{e.value?e.value:''}</>
                    }} width={180} caption="CLINS" cssClass="column-header" allowSorting={false} /> */}
                    <Column
                      dataField="accessories_type"
                      cssClass="column-header"
                      allowSorting={false}
                      caption={"Accessory"}
                    />
                    <Column
                      dataField="part"
                      cssClass="column-header"
                      allowSorting={false}
                      caption={"Part #"}
                    />
                    <Column
                      dataField="condition"
                      cssClass="column-header"
                      allowSorting={false}
                      caption={"Condition"}
                    />
                    {/* <Column dataField="quantity" cssClass="column-header" allowSorting={false} caption={'Qty'}/> */}

                    <Column
                      dataField="price"
                      cssClass="column-header"
                      allowSorting={false}
                      caption={"Price"}
                      cellRender={RenderPrice}
                    />
                    <Column
                      dataField="action"
                      caption={"Action"}
                      cssClass="column-header"
                      allowSorting={false}
                      cellRender={RenderContractAccessoryEditButton}
                    />
                    {/* <Scrolling columnRenderingMode="virtual" /> */}
                    <Paging enabled={false} />
                  </DataGrid>
                </div>
              </div>
            </div>
          </>
        )}

        {formData?.popType === "Training" && (
          <>
            <div
              className="container-fluid mt-4 bottom-border-blue pt-2"
              style={{
                borderBottom: "4px solid rgb(13, 110, 253)",
                background: "#eee",
              }}
            >
              <h2 className="heading">Contract Pricing</h2>

              <div className="row ">
                <div className="col" style={{ marginBottom: "30px" }}>
                  <Form.Group
                    className={"col"}
                    style={{
                      minWidth: "1400px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Form.Label>Courses</Form.Label>
                    <button
                      style={{ border: "none" }}
                      onClick={handleCoursesClick}
                      type="button"
                    >
                      <img src={Courses} alt="" />
                      <Form.Label
                        style={{
                          color: "rgb(12, 113, 195)",
                          fontFamily: "Calibri",
                          fontStyle: "normal",
                          marginLeft: "3px",
                          cursor: "pointer",
                        }}
                      >
                        Courses
                      </Form.Label>
                    </button>
                  </Form.Group>

                  {courseModal && (
                    <PopCourses
                      courseModal={courseModal}
                      setCourseModal={setCourseModal}
                      accountId={accountId}
                      edit={edit}
                      EditCourseId={EditCourseId}
                      siteId={formData?.site_id}
                      cerifyAgencyList={cerifyAgencyList}
                      ContractPricingData={ContractPricingData}
                      setContractPricingData={setContractPricingData}
                    />
                  )}

                  <DataGrid
                    className="col"
                    dataSource={PopCourseListData}
                    minHeight={300}
                    maxHeight={500}
                    width={"auto"}
                    keyExpr="id"
                    showColumnLines={true}
                    showRowLines={true}
                    showBorders={false}
                    allowSorting={false}
                    rowAlternationEnabled={false}
                  >
                    <Column
                      dataField="clin"
                      cellRender={(e) => {
                        return <>{e.value ? e.value : ""}</>;
                      }}
                      width={"auto"}
                      caption="CLINs"
                      cssClass="column-header"
                      allowSorting={false}
                    />
                    <Column
                      dataField="certAgencyName"
                      cssClass="column-header"
                      allowSorting={false}
                    />
                    <Column
                      dataField="allowed_className"
                      cssClass="column-header"
                      allowSorting={false}
                    />
                    <Column
                      dataField="sitesNames"
                      cssClass="column-header"
                      allowSorting={false}
                      cellRender={renderSitesName}
                    />
                    <Column
                      dataField="class_price"
                      cssClass="column-header"
                      allowSorting={false}
                      cellRender={RenderPrice}
                    />
                    <Column
                      dataField="price_per_student"
                      cssClass="column-header"
                      allowSorting={false}
                      cellRender={RenderPrice}
                    />
                    <Column
                      dataField="minMaxEnroll"
                      cellRender={(e) => {
                        return <>{e.value ? e.value : ""}</>;
                      }}
                      cssClass="column-header"
                      allowSorting={false}
                    />
                    <Column
                      dataField="action"
                      caption={"Action"}
                      cssClass="column-header"
                      allowSorting={false}
                      cellRender={RenderEditCourses}
                    />
                    <Scrolling columnRenderingMode="virtual" />
                    <Paging enabled={false} />
                  </DataGrid>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="row pb-3 py-5">
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
              onClick={() => saveForm(accountId)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </div>
      </Form>
      {/* purchaseProEquip,setPurchaseProEquip
purchaseProAssesory,setPurchaseProAssesory
ContractPricEquip,setContractPricEquip
ContractPricAssesory,setContractPricAssesory */}
      {equipmentModal && (
        <PopEquipment
          equipmentModal={equipmentModal}
          EditPurchaseId={EditPurchaseId}
          EditContractPurchaseId={EditContractPurchaseId}
          setEquipmentModal={setEquipmentModal}
          type={type}
          edit={edit ? edit : ""}
          accountId={accountId}
          purchaseProEquip={purchaseProEquip}
          setPurchaseProEquip={setPurchaseProEquip}
          ContractPricEquip={ContractPricEquip}
          setContractPricEquip={setContractPricEquip}
        />
      )}
      {accessoriesModal && (
        <PopAccessories
          accessoriesModal={accessoriesModal}
          EditAccessoriesId={EditAccessoriesId}
          EditContractAccessoriesId={EditContractAccessoriesId}
          setAccessoriesModal={setAccessoriesModal}
          type={type}
          edit={edit ? edit : ""}
          accountId={accountId}
          purchaseProAssesory={purchaseProAssesory}
          setPurchaseProAssesory={setPurchaseProAssesory}
          ContractPricAssesory={ContractPricAssesory}
          setContractPricAssesory={setContractPricAssesory}
        />
      )}
    </div>
  );
};

export default NewPop;

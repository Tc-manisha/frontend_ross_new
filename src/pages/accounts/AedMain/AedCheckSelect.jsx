import React, { useEffect, useState } from "react";
import { Form, useNavigate, useSearchParams } from "react-router-dom";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
  Selection,
} from "devextreme-react/data-grid";
import CustomToggleButton from "../../../components/common/toggleSwitch/CustomToggleButton";
import ToogleSwitch from "../../../components/common/toggleSwitch/ToogleSwitch";
import infoButton from "../../../img/infoButton.svg";
import CustomToggleButton2 from "../../../components/common/toggleSwitch/CustomToggle2";
import { CallGETAPI, CallGETAPINEW, CallPOSTAPI } from "../../../helper/API";
import {
  AEDGroupBYCoordinatorInfo,
  BatteryTypebyModel,
  AedCheckADTable,
  GetAedBrands,
  GetAedModelsByBrandId,
  GetAedSumModelsById,
  CheckSpareBatteryTblCol,
  RenderDate,
} from "../../../helper/BasicFn";
import { Box } from "devextreme-react";
import { FormatDate, prepareOptions } from "../../../helper/Common";
import { Tooltip } from "react-tooltip";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import CommonDatePicker from "../../../components/common/date-picker/CommonDatePicker";
import moment from "moment";
import BatteryInformationTrEdit from "../../../components/tables/AEDs/BatteryInformationTrEdit";
import PadsInfoEditTbl from "../../../components/tables/AEDs/PadsInfoEditTbl";
import { InfoIcon } from "../../../helper/Icons";
import { toast } from "react-toastify";
import BackButton from "../../../components/common/BackButton";
import SpareBatteryInfoEdit from "../../../components/tables/AEDs/SpareBatteryInfoEdit";
import Loading from "../Loading";
import { Modal } from "react-bootstrap";
import { MdClose } from "react-icons/md";

const filterData = (arr, key, value) => {
  const data = arr.find((a) => a[key] == value);
  return data;
};

const AedCheckSelect = () => {
  const navigate = useNavigate();
  const [toggleValue, setToggleValue] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const aedId = searchParams.get("aed_id");
  const accountId = searchParams.get("account_id");

  const [loading, setLoading] = useState(false);
  const [aedDetails, setAedDetails] = useState({});

  const [aedData, setAEDData] = useState({});
  const [storageInfoList, setStorageInfoList] = useState([]);
  const [rmsBrandList, setrmsBrandList] = useState([]);
  const [aedBattryTypeList, setaedBattryTypeList] = useState([]);
  const [aedPadTypeList, setaedPadTypeList] = useState([]);
  const [OtherFiled, setOtherFileds] = useState([]);
  const [batteryTypeList, setBatteryTypeList] = useState([]);
  const [padTypeList, setPadTypeList] = useState([]);

  const [infoModal, setInfoModal] = useState(false);

  const [brandList, setBrandList] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [issueTypeValid, setIssueTypeValid] = useState(false);
  const [issueValid, setIssueValid] = useState(false);
  const [formData, setFormData] = useState({
    aed_id: aedId,
    account_id: accountId,
    is_aed_present: 1,
    status_indicator: 1,
    rescue_kit_present: 1,
    aed_storage_currect: 1,
    sti_expiry_date: "",
    sti_alarmed: null,
    sti_alarm_status: null,
    sti_turned_on: null,
    sti_alarme_sound: 1,
    battery_information_toggle: 1,
    bleeding_kit_located_toggle: 1,
    bleeding_kit_sealed_toggle: 1,
    oxygen_equipment_located_toggle: 1,
    needed_supplies_toggle: 1,
    gauge_show_toggle: 1,
    pads_info_toggle: 1,
    support_tickets_toggle: 0,
    battery_info: [],
    spare_battery_info: [],
    adult_pad_info: [],
    spare_adult_pad_info: [],
    pediatric_pad_info: [],
    spare_padric_pad_info: [],
    gateway_info: [],
    adult_pad_pak_info: [],
    spare_adult_pad_pak_info: [],
    pediatric_pak_pad_info: [],
    spare_padric_pak_pad: [],
    bleeding_kit_located_input: "",
    bleeding_kit_sealed_input: "",
    oxygen_equipment_located_input: "",
    needed_supplies_input: "",
    is_aed_present_input: "",
    status_indicator_input: "",
    rescue_kit_present_input: "",
    issue_type: "",
    issue: "",
    sti_storage_type: "",
    gauge_show_input: "",
  });

  const [toggleInvalid, setToggleInvalid] = useState({
    aed_present: false,
    status_indicator: false,
    rescue_kit: false,
  })

  const getAedDetails = async () => {
    const result = await CallGETAPI("account/get-aed-by-id/" + aedId);
    const aedDetails1 = result?.data?.data;
    const allPads = result?.data?.allPads || [];
    const batteryInfo = result?.data?.batteryInfo || [];
    // console.log({aedDetails1,chL: result?.data});
    // const batteryTypeList = [];
    if (result?.status) {
      // set list data ;
      const FD = { ...formData };
      setAEDData(aedDetails1);
      setStorageInfoList(result?.data?.storageInfo);
      // setSubModelList(result?.data?.storageInfo)
      setrmsBrandList(result?.data?.rmsBrand);
      setaedBattryTypeList(result?.data?.aedBattryType);

      let res = await CallGETAPINEW(
        "account/ade-pad-type-by-model/" + aedDetails1?.aed_model_id
      );

      // setaedPadTypeList(result?.data?.aedPadType);
      // if(res)
      setaedPadTypeList(res?.data?.data);

      // aed_model_id
      const BatteryRes = await BatteryTypebyModel(aedDetails1?.aed_model_id);
      setBatteryTypeList(BatteryRes);
      if (aedDetails1.length === 0) {
        toast.error("Something went wrong please try again");
        return "";
      }
      setShowLoading(true);
      aedDetails1.adult_pad_info = JSON.parse(aedDetails1?.adult_pad_info);
      aedDetails1.adult_pad_pak_info = JSON.parse(
        aedDetails1?.adult_pad_pak_info
      );
      aedDetails1.battery_info = JSON.parse(aedDetails1?.battery_info);
      aedDetails1.builtin_RMS_info = JSON.parse(aedDetails1?.builtin_RMS_info);
      aedDetails1.charge_pak_info = JSON.parse(aedDetails1?.charge_pak_info);
      // aedDetails1.charge_pak_info = aedDetails1?.charge_pak_info[0];

      const ar1 = [];
      const SPar1 = [];
      const PartnumberPads = [];
      for (let ci = 0; ci < batteryInfo.length; ci++) {
        const ell = batteryInfo[ci];
        if (ell.section_name === "charge_pack") {
          const ChargePakInfoObj = {
            battery_expiration: ell?.battery_expiration,
            battery_lot: ell?.battery_lot,
            charge_pak_part: ell?.charge_pak_uid,
            charge_pak_uiid: ell?.charge_pak_uid,
            charge_pak_uid: ell?.charge_pak_uid,
            pad_1_expiration: "",
            pad_1_lot: "",
            pad_1_part: "",
            pad_2_expiration: "",
            pad_2_lot: "",
            pad_2_part: "",
          };

          for (let i3 = 0; i3 < allPads.length; i3++) {
            const apd = allPads[i3];
            if (apd?.section_name === "charge_pack") {
              if (apd?.pid === Number(ell?.charge_pak_pad_1_id)) {
                ChargePakInfoObj.pad_1_expiration = apd?.pad_expiration;
                ChargePakInfoObj.pad_1_lot = apd?.pad_lot;
                ChargePakInfoObj.pad_1_part = apd?.pad_type_id;
              } else if (apd?.pid === Number(ell?.charge_pak_pad_2_id)) {
                ChargePakInfoObj.pad_2_expiration = apd?.pad_expiration;
                ChargePakInfoObj.pad_2_lot = apd?.pad_lot;
                ChargePakInfoObj.pad_2_part = apd?.pad_type_id;
              }
            }
          }
          if (ell.is_spare) {
            SPar1.push(ChargePakInfoObj);
          } else {
            ar1.push(ChargePakInfoObj);
          }
        }
      }
      aedDetails.charge_pak_info = ar1?.[0];
      aedDetails.spare_charge_pak_info = SPar1;

      aedDetails1.gateway_info = JSON.parse(aedDetails1?.gateway_info);
      aedDetails1.gateway_info = aedDetails1?.gateway_info[0];
      aedDetails1.other = JSON.parse(aedDetails1?.other);
      aedDetails1.out_of_service_info = JSON.parse(
        aedDetails1?.out_of_service_info
      );
      aedDetails1.pediatric_pad_info = JSON.parse(
        aedDetails1?.pediatric_pad_info
      );
      aedDetails1.pediatric_pak_pad_info = JSON.parse(
        aedDetails1?.pediatric_pak_pad_info
      );
      aedDetails1.rms_info = JSON.parse(aedDetails1?.rms_info);
      aedDetails1.spare_adult_pad_info = JSON.parse(
        aedDetails1?.spare_adult_pad_info
      );
      aedDetails1.spare_adult_pad_pak_info = JSON.parse(
        aedDetails1?.spare_adult_pad_pak_info
      );
      aedDetails1.spare_battery_info = JSON.parse(
        aedDetails1?.spare_battery_info
      );
      aedDetails1.spare_charge_pak_info = JSON.parse(
        aedDetails1?.spare_charge_pak_info
      );
      aedDetails1.spare_padric_pad_info = JSON.parse(
        aedDetails1?.spare_padric_pad_info
      );
      aedDetails1.spare_padric_pak_pad = JSON.parse(
        aedDetails1?.spare_padric_pak_pad
      );
      aedDetails1.storage_info = JSON.parse(aedDetails1?.storage_info);

      // batteries info // Spare Batteris Info charge_pack:[], charge_pack_spare:[],
      const BI = {
        has_battery: [],
        has_9v: [],
        has_10pk: [],
        has_installby: [],
        has_man: [],
      };
      const SPBI = {
        has_battery_spare: [],
        has_9v_spare: [],
        has_10pk_spare: [],
        has_installby_spare: [],
        has_man_spare: [],
      };
      const ABSpares = [];
      const ALLBatteris = [];
      for (let bii = 0; bii < batteryInfo.length; bii++) {
        const b2 = batteryInfo[bii] || false;
        if (!b2) {
          break;
        }
        ALLBatteris.push(b2);
        b2.battery_uid = b2.battery_udi;
        if (b2.is_spare) {
          const key = b2.section_name + "_spare";
          if (SPBI[key]) {
            ABSpares.push(b2);
            SPBI[key].push(b2);
          }
        } else {
          const key = b2.section_name;
          if (BI[key]) {
            BI[key].push(b2);
          }
        }
      }
      console.log({ SPBI, BI });
      const AP = [],
        SAP = [],
        PP = [],
        SPP = [],
        APP = [],
        SAPP = [],
        PPP = [],
        SPPP = [],
        CP = [],
        SCP = [];
      for (let api = 0; api < allPads.length; api++) {
        const APD = allPads[api] || false;
        if (!APD) {
          break;
        }
        APD.battery_uid = APD.battery_udi;
        if (
          APD.section_name === "charge_pack" ||
          APD.section_name === "spare_charge_pack"
        ) {
          if (APD.is_spare) {
            SCP.push(APD);
          } else {
            CP.push(APD);
          }
        }

        if (
          APD.section_name === "adult_pad_info" ||
          APD.section_name === "spare_adult_pad_info"
        ) {
          if (APD.is_spare) {
            SAP.push(APD);
          } else {
            AP.push(APD);
          }
        }

        if (
          APD.section_name === "adult_pad_pak_info" ||
          APD.section_name === "spare_adult_pad_pak_info"
        ) {
          if (APD.is_spare) {
            SAPP.push(APD);
          } else {
            APP.push(APD);
          }
        }

        if (
          APD.section_name === "pediatric_pad_info" ||
          APD.section_name === "spare_pediatric_pad_info" ||
          APD.section_name === "spare_padric_pad_info"
        ) {
          if (APD.is_spare) {
            SPP.push(APD);
          } else {
            PP.push(APD);
          }
        }

        if (
          APD.section_name === "pediatric_pak_pad_info" ||
          APD.section_name === "spare_pediatric_pak_pad_info" ||
          APD.section_name === "spare_padric_pak_pad"
        ) {
          if (APD.is_spare) {
            SPPP.push(APD);
          } else {
            PPP.push(APD);
          }
        }
      }
      console.log({
        sbi: aedDetails1?.spare_battery_info,
        sbiChecl: [SPBI],

        bti: aedDetails1?.battery_info,
        bti2: [BI],
      });

      FD.sti_expiry_date = FormatDate(
        aedDetails1?.storage_info?.[0]?.expiry_date
      );
      FD.spare_battery_info = [SPBI]; //aedDetails1?.spare_battery_info;
      FD.allBatterySpares = ABSpares; //aedDetails1?.spare_battery_info;
      FD.allBatterySpares = ABSpares; //aedDetails1?.spare_battery_info;
      FD.ALLBatteris = ALLBatteris; //aedDetails1?.spare_battery_info;
      // ALLBatteris
      FD.spare_pediatric_pad_part = aedDetails1?.spare_pediatric_pad_part;
      FD.sti_alarmed = aedDetails1?.storage_info?.[0]?.alarmed || 0;
      FD.sti_alarm_status = aedDetails1?.storage_info?.[0]?.alarm_status || 0;
      FD.sti_turned_on = aedDetails1?.storage_info?.[0]?.alarm_status || 0;
      FD.battery_info = [BI]; //aedDetails1?.battery_info;
      FD.adult_pad_info = AP; //aedDetails1?.adult_pad_info ||[];
      FD.spare_adult_pad_info = SAP; //aedDetails1?.spare_adult_pad_info ||[];
      FD.pediatric_pad_info = PP; //aedDetails1?.pediatric_pad_info ||[];
      FD.spare_padric_pad_info = SPP; //aedDetails1?.spare_padric_pad_info ||[];
      FD.gateway_info = aedDetails1?.gateway_info || [];
      FD.adult_pad_pak_info = APP; //aedDetails1?.adult_pad_pak_info ||[];
      FD.spare_adult_pad_pak_info = SAPP; //aedDetails1?.spare_adult_pad_pak_info ||[];
      FD.pediatric_pak_pad_info = PPP; //aedDetails1?.pediatric_pak_pad_info ||[];
      FD.spare_padric_pak_pad = SPPP; //aedDetails1?.spare_padric_pak_pad || [];
      FD.site_id = result?.data?.site_id;
      FD.sti_storage_type = aedDetails1?.storage_info?.[0]?.storage_type;
      aedDetails1.site_name = result?.data?.site_name;
      aedDetails1.account_name = result?.data?.account_name;
      console.log({ AP, SAP, PP, SPP, APP, SAPP, PPP, SPPP, CP, SCP });
      setOtherFileds(aedDetails1.other);
      let brandList = await GetAedBrands();
      setBrandList(brandList);

      const filteredBrand = filterData(
        brandList?.data,
        "id",
        aedDetails1?.aed_brand_id
      );
      aedDetails1.brand_name = filteredBrand?.AED_brands;

      let ModelRes = await GetAedModelsByBrandId(filteredBrand?.id);
      let sub_model_res = await GetAedSumModelsById(aedDetails1.aed_model_id);
      let MODEL_NAME = ModelRes?.data.find(
        (item) => item.id === aedDetails1.aed_model_id
      ); // aedDetails1.aed_model_id
      // setModelList(ModelRes?.data);

      const filteredModel = filterData(
        ModelRes?.data,
        "id",
        aedDetails1?.aed_model_id
      );
      aedDetails1.model_name = MODEL_NAME?.model_name; // filteredModel?.model_name

      const filteredSubModel = filterData(
        sub_model_res?.data,
        "id",
        aedDetails1?.sub_model_id
      );
      aedDetails1.sub_model_name = filteredSubModel
        ? filteredSubModel?.sub_model_name
        : "";

      setAedDetails(aedDetails1);

      // let CoordiData = AEDGroupBYCoordinatorInfo(
      //   result?.data?.cordinatorInformation
      // );
      // setCordinatorInfo(CoordiData);
      setFormData(FD);
      setShowLoading(false);
    }
  };

  const BatteryExpTbl = [
    {
      key: "battery_type_id",
      is_default: 1,
      title: "Battery Part",
    },
    { key: "battery_expiration", is_default: 0, title: "Battery Expiration" },
    {
      key: "manufactured_date",
      is_default: 0,
      title: "Manufactured Date",
    },
    { key: "battery_lot", is_default: 1, title: "Battery Lot" },
    { key: "battery_udi", is_default: 1, title: "Battery UDI" },
    // { key: "battery_serial", is_default: 0, title: "Serial" },
    // {
    //   key: "v9_install",
    //   is_default: 0,
    //   title: "v9 Install",
    // },
    // {
    //   key: "install_before_date",
    //   is_default: 0,
    //   title: "Install Before Date",
    // },
    // {
    //   key: "date_installed",
    //   is_default: 0,
    //   title: "Date Installed",
    // },
  ];

  const print_battery_part = (bid) => {
    let findName = batteryTypeList.find(
      (item) => parseInt(item?.battery_type_id) === parseInt(bid)
    );
    return findName?.battery_part_number || bid;
  };
  const [issueList, setissueList] = useState([]);
  const fecthIssueType = async () => {
    // /support/all-issues-type
    const res = await CallGETAPI("support/all-issues-type");
    if (res.data.status) {
      const arr = res.data.issuesList || [];
      const allIssueTypes = prepareOptions(arr, "issue_id", "issue_name");
      setissueList(allIssueTypes);
    }
  };

  useEffect(() => {
    getAedDetails();
    fecthIssueType();
  }, []);

  // const RenderDate = (date, is_expiry = false) => {
  //   if (!date) {
  //     return "";
  //   }

  //   if (date === "unknown") {
  //     return "unknown";
  //   }

  //   date = FormatDate(date);

  //   if (!is_expiry) {
  //     return date;
  //   }
  //   //FormatDate
  //   const currentDate = moment();

  //   // Convert the input date to a moment object
  //   const inputMoment = moment(date);

  //   // Compare the input date with the current date
  //   const isInputDateBeforeCurrent = inputMoment.isBefore(currentDate);
  //   if (isInputDateBeforeCurrent) {
  //     return <span className="text-danger">{date}</span>;
  //   } else {
  //     return <span>{date}</span>;
  //   }
  // };

  const handleToggleChange = (event) => {
    const newValue = event.target.checked ? 1 : 0;

    if (event.target.name === "is_aed_present" && newValue === 0) {
      setFormData((prev) => ({
        ...prev,
        status_indicator: 1,
      }));

      setFormData((prev) => ({
        ...prev,
        rescue_kit_present: 1,
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [event.target.name]: newValue,
    }));

    setToggleValue(newValue);
  };

  const HIC = (e) => {
    const newValue = e.target.value;
    const name = e.target.name;
    const FD = { ...formData };
    if (name === "sti_storage_type") {
      if (Number(newValue) === 1) {
        FD.sti_alarmed = "";
        FD.sti_alarm_status = "";
        FD.sti_turned_on = "";
        FD.sti_alarme_sound = "";
        FD.sti_expiry_date = "";
      }
    }
    (FD[e.target.name] = newValue), setFormData(FD);
    // setFormData((prev) => ({
    //   ...prev,
    //   [e.target.name]: newValue,
    // }));
  };
  const [warentyYear, setWarentyYear] = useState(0);

  const handleDateChange = (name, val) => {
    const fd = { ...formData };
    if (name === "purchase_date") {
      let warenty_date = moment(val).add(warentyYear, "years").calendar();
      fd.warenty_date = warenty_date;
    }
    fd[name] = val;
    setFormData(fd);
    // setDefaultfromData(fd);
  };

  const handleCheckBox = (e) => {
    if (e.target.type == "checkbox") {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.checked }));
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
    }
  };
  const handleSubmit = async (e) => {

    e.preventDefault();

    let toggleErrors = {}

    if (!formData.is_aed_present && formData.is_aed_present_input === '') {
      toggleErrors.aed_present = true
    }
    if (!formData.status_indicator && formData.status_indicator_input === '') {
      toggleErrors.status_indicator = true
    }
    if (!formData.rescue_kit_present && formData.rescue_kit_present_input === '') {
      toggleErrors.rescue_kit = true
    }

    if (Object.keys(toggleErrors).length > 0) {
      setToggleInvalid({ ...toggleInvalid, ...toggleErrors })
      return
    }

    if (formData?.support_tickets_toggle && formData?.issue_type === "") {
      setIssueTypeValid(true);
      setLoading(false);
      return;
    } else if (formData?.support_tickets_toggle && formData?.issue === "") {
      setIssueValid(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    const res = await CallPOSTAPI("account/aed-checks", formData);
    if (res.status) {
      toast.success("AED checked Saved Successfully");
      navigate(-1);
    } else {
      toast.error("Something went wrong please try again");
    }
    setLoading(false);
  };

  console.log('formData', formData);

  return (
    <>
      <div
        className="mt-4 table-main-20002"
        style={{ width: "100%", paddingInline: "2%" }}
      >
        <BackButton />
        {showLoading ? (
          <div className="showloading">
            <Loading />
          </div>
        ) : (
          <>
            <InfoModal infoModal={infoModal} setInfoModal={setInfoModal} />
            <div className="col py-2">
              <h2 className="heading">General Information</h2>
              <div className="table-main-20002">
                <table className="table">
                  <thead className="border heading">
                    <tr>
                      <th>Type</th>
                      <th>Brand / Modal</th>
                      <th>Serial #</th>
                      <th>Asset #</th>
                      <th>Placement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>AED</td>
                      <td>
                        {aedDetails?.brand_name}{" "}
                        {aedDetails?.model_name
                          ? " / " + aedDetails?.model_name
                          : ""}
                      </td>
                      <td>{aedData?.serial_number}</td>
                      <td>{aedData?.asset}</td>
                      <td>{aedData?.placement}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <form className="pb-3" onSubmit={handleSubmit}>
              <div className="col py-2">
                <h2 className="heading">AED Information</h2>

                <table className="table table-striped-columns">
                  <tbody className="">
                    <>
                    <tr>
                      <td colSpan={3}> {" "}  Is The AED Present?</td>
                      <td colSpan={1} style={{width:"50px"}}>
                        {" "}
                        <CustomToggleButton2
                          ToggleName="is_aed_present"
                          ToggleValue={formData?.is_aed_present}
                          changeHandler={(e) => {
                            handleToggleChange(e)
                            setToggleInvalid({ ...toggleInvalid, aed_present: false })
                          }}
                          is_read_only={false}
                        />
                      </td>
                    </tr>
                    {!formData?.is_aed_present && (
                      <tr>
                        <td colSpan={4}>
                          <textarea
                            className="form-control"
                            name="is_aed_present_input"
                            placeholder="Enter text here."
                            value={formData?.is_aed_present_input}
                            onChange={(e) => {
                              HIC(e)
                              setToggleInvalid({ ...toggleInvalid, aed_present: false })
                            }}
                          ></textarea>
                          {toggleInvalid.aed_present && (
                            <p className="text-danger m-0 ps-1 mt-1">
                              This field is required.
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                    </>

                    {!formData?.is_aed_present ? (
                      ""
                    ) : (
                      <>
                        <tr>
                          <td colSpan={3}> Does the status indicator show ready?</td>
                          <td colSpan={1}>
                            {" "}
                            <CustomToggleButton2
                              ToggleName="status_indicator"
                              ToggleValue={formData?.status_indicator}
                              changeHandler={(e) => {
                                handleToggleChange(e)
                                setToggleInvalid({ ...toggleInvalid, status_indicator: false })
                              }}
                              is_read_only={false}
                            />
                          </td>
                        </tr>
                        {!formData?.status_indicator && (
                          <tr>
                            <td colSpan={4}>
                              <textarea
                                className="form-control"
                                placeholder="Enter text here."
                                value={formData?.status_indicator_input}
                                name="status_indicator_input"
                                onChange={(e) => {
                                  HIC(e)
                                  setToggleInvalid({ ...toggleInvalid, status_indicator: false })
                                }}
                              ></textarea>
                              {toggleInvalid.status_indicator && (
                                <p className="text-danger m-0 ps-1 mt-1">
                                  This field is required.
                                </p>
                              )}
                            </td>
                          </tr>
                        )}

                        <tr>
                          <td colSpan={3}>
                            {" "}
                            Is there a AED rescue kit present and in good
                            condition?
                            <span
                              role="button"
                              data-tooltip-id="my-tooltip"
                              data-tooltip-content="Hello world!"
                              data-tooltip-place="top"
                              onClick={() => setInfoModal(true)}
                            >
                              <InfoIcon />
                            </span>
                          </td>
                          <td colSpan={1}>
                            {" "}
                            <CustomToggleButton2
                              ToggleName="rescue_kit_present"
                              ToggleValue={formData?.rescue_kit_present}
                              changeHandler={(e) => {
                                handleToggleChange(e)
                                setToggleInvalid({ ...toggleInvalid, rescue_kit: false })
                              }}
                              is_read_only={false}
                            />
                          </td>
                        </tr>
                        {!formData?.rescue_kit_present && (
                          <tr>
                            <td colSpan={4}>
                              <textarea
                                className="form-control"
                                placeholder="Enter text here."
                                name="rescue_kit_present_input"
                                value={formData?.rescue_kit_present_input}
                                onChange={(e) => {
                                  HIC(e)
                                  setToggleInvalid({ ...toggleInvalid, rescue_kit: false })
                                }}
                              ></textarea>
                              {toggleInvalid.rescue_kit && (
                                <p className="text-danger m-0 ps-1 mt-1">
                                  This field is required.
                                </p>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {!formData?.is_aed_present ? (
                ""
              ) : (
                <>
                  {formData?.sti_storage_type && (
                    <div className="col py-2">
                      <h2 className="heading">AED Storage</h2>
                      <table className="theme-table">
                        <tr style={{display:"flex", justifyContent:"space-between"}}>
                          <td className="" style={{borderColor: "transparent"}}>
                            {formData?.aed_storage_currect
                              ? "Please Correct Below Information"
                              : "Is below information correct?"}
                          </td>
                          <td style={{ marginRight:"10px",borderColor: "transparent"}}>
                            <CustomToggleButton2
                              ToggleName="aed_storage_currect"
                              ToggleValue={formData?.aed_storage_currect}
                              changeHandler={handleToggleChange}
                              is_read_only={false}
                            />
                          </td>
                        </tr>
                      </table>

                      <table className="theme-table">
                        <thead>
                          <tr>
                            <td>Storage Type</td>
                            <td>Alarmed</td>
                            <td>Turned On</td>
                            <td>Does the Alarm sound?</td>
                            <td>9v Expiration</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {formData?.aed_storage_currect ? (
                                storageInfoList?.map((item, index) =>
                                  parseInt(item?.storage_info_id) ===
                                    parseInt(
                                      aedDetails?.storage_info?.[0]?.storage_type
                                    )
                                    ? item?.storage_info_name
                                    : ""
                                )
                              ) : (
                                <select
                                  className="form-control"
                                  name="sti_storage_type"
                                  value={
                                    parseInt(formData?.sti_storage_type) ||
                                    parseInt(
                                      aedDetails?.storage_info?.[0]
                                        ?.storage_type
                                    )
                                  }
                                  onChange={HIC}
                                >
                                  <option value="">---Select One---</option>
                                  {storageInfoList?.map((item, index) => (
                                    <option
                                      value={item?.storage_info_id}
                                      key={index}
                                    >
                                      {item?.storage_info_name}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </td>
                            <td>
                              {parseInt(formData?.sti_storage_type) != 1 ? (
                                ""
                              ) : (
                                <>
                                  {formData?.aed_storage_currect ? (
                                    formData?.sti_alarmed ? (
                                      <CheckIcon sx={{ color: "#00FF00" }} />
                                    ) : (
                                      <CloseIcon color={"error"} />
                                    )
                                  ) : (
                                    <>
                                      <div className="">
                                        <CustomToggleButton2
                                          ToggleName="sti_alarmed"
                                          ToggleValue={formData?.sti_alarmed}
                                          changeHandler={handleCheckBox}
                                        />
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </td>
                            <td>
                              {parseInt(formData?.sti_storage_type) != 1 ? (
                                ""
                              ) : (
                                <>
                                  {formData?.aed_storage_currect ? (
                                    formData?.sti_turned_on ? (
                                      <CheckIcon sx={{ color: "#00FF00" }} />
                                    ) : (
                                      <CloseIcon color={"error"} />
                                    )
                                  ) : (
                                    <div className="">
                                      <CustomToggleButton2
                                        ToggleName="sti_turned_on"
                                        ToggleValue={formData?.sti_turned_on}
                                        changeHandler={handleCheckBox}
                                      />
                                    </div>
                                  )}
                                  {/* {formData?.aed_storage_currect ? (
                                    formData?.sti_alarm_status ? (
                                      <CheckIcon sx={{ color: "#00FF00" }} />
                                    ) : (
                                      <CloseIcon color={"error"} />
                                    )
                                  ) : (
                                    <div className="">
                                      <CustomToggleButton2
                                        ToggleName="sti_alarm_status"
                                        ToggleValue={formData?.sti_alarm_status}
                                        changeHandler={handleCheckBox}
                                      />
                                    </div>
                                  )} */}
                                </>
                              )}
                            </td>
                            <td>
                              {parseInt(formData?.sti_storage_type) != 1 ? (
                                ""
                              ) : (
                                <>
                                  {formData?.aed_storage_currect ? (
                                    formData?.sti_alarm_status ? (
                                      <CheckIcon sx={{ color: "#00FF00" }} />
                                    ) : (
                                      <CloseIcon color={"error"} />
                                    )
                                  ) : (
                                    <div className="">
                                      <CustomToggleButton2
                                        ToggleName="sti_alarme_sound"
                                        ToggleValue={formData?.sti_alarme_sound}
                                        changeHandler={handleCheckBox}
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                            </td>
                            <td style={{ width: "400px" }}>
                              {parseInt(formData?.sti_storage_type) != 1 ? (
                                ""
                              ) : (
                                <>
                                  {formData?.aed_storage_currect ? (
                                    formData?.sti_expiry_date
                                  ) : (
                                    <CommonDatePicker
                                      calName={"sti_expiry_date"}
                                      CalVal={formData?.sti_expiry_date}
                                      HandleChange={handleDateChange}
                                      disabled={false}
                                    />
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* {JSON.stringify([
                    ...formData?.allBatterySpares,
                    ...formData?.ALLBatteris,
                  ])} */}
                  {CheckSpareBatteryTblCol(
                    [...formData?.allBatterySpares, ...formData?.ALLBatteris],
                    "All"
                  ) ? (
                    <div className="col py-2">
                      <h2 className="heading">Battery Information</h2>
                      <table className="theme-table">
                        <tr>
                          <td>
                            <div
                              style={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}
                            >
                              <div>
                                {" "}
                                {!formData?.battery_information_toggle
                                  ? "Please Correct Below Information"
                                  : "Is below information correct?"}{" "}
                              </div>
                              <div
                                style={{ display: "flex", marginRight: "10px" }}
                              >
                                <CustomToggleButton2
                                  ToggleName="battery_information_toggle"
                                  ToggleValue={
                                    formData?.battery_information_toggle
                                  }
                                  changeHandler={handleToggleChange}
                                  is_read_only={false}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <table className="theme-table">
                        <thead>
                          <tr className="">
                            <th
                              scope="col"
                              className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                            >
                              Main #
                            </th>

                            {Array.isArray(formData?.battery_info) &&
                              BatteryExpTbl?.map((item) =>
                                item?.is_default ||
                                  CheckSpareBatteryTblCol(
                                    [
                                      ...formData?.allBatterySpares,
                                      ...formData?.ALLBatteris,
                                    ] || [],
                                    item?.key
                                  ) === 1 ? (
                                  <th
                                    scope="col"
                                    className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                                  >
                                    {item?.title} #
                                  </th>
                                ) : (
                                  ""
                                )
                              )}
                          </tr>
                        </thead>

                        {Array.isArray(formData?.battery_info) &&
                          formData?.battery_info?.map((data, index) => (
                            <tbody
                              className="odd-even-row border-b-blue"
                              key={index}
                            >
                              {/* has_battery loop */}
                              {data?.has_battery?.length > 0 && (
                                <>
                                  {data?.has_battery?.map(
                                    (hasBattery, batteryIndex) =>
                                      hasBattery?.battery_type_id &&
                                      hasBattery?.battery_type_id != "" && (
                                        <BatteryInformationTrEdit
                                          setFormData={setFormData}
                                          formData={formData}
                                          battery_information={
                                            formData?.battery_information_toggle
                                          }
                                          batteryTypeList={batteryTypeList}
                                          batteryInfo={formData?.battery_info}
                                          print_battery_part={
                                            print_battery_part
                                          }
                                          RenderDate={RenderDate}
                                          DataValue={hasBattery}
                                          DataName={"has_battery"}
                                          batteryIndex={batteryIndex}
                                        />
                                      )
                                  )}
                                </>
                              )}

                              {/* has_9v loop */}
                              {data?.has_9v?.length > 0 && (
                                <>
                                  {data?.has_9v?.map(
                                    (has9v, has9vIndex) =>
                                      has9v?.battery_type_id &&
                                      has9v?.battery_type_id != "" && (
                                        <BatteryInformationTrEdit
                                          setFormData={setFormData}
                                          formData={formData}
                                          battery_information={
                                            formData?.battery_information_toggle
                                          }
                                          batteryTypeList={batteryTypeList}
                                          batteryInfo={formData?.battery_info}
                                          print_battery_part={
                                            print_battery_part
                                          }
                                          RenderDate={RenderDate}
                                          DataValue={has9v}
                                          DataName={"has_9v"}
                                          batteryIndex={has9vIndex}
                                        />
                                      )
                                  )}
                                </>
                              )}

                              {/* has_installby loop */}
                              {data?.has_installby?.length > 0 && (
                                <>
                                  {data?.has_installby?.map(
                                    (hasInstallby, hasInstallbyIndex) =>
                                      hasInstallby?.battery_type_id &&
                                      hasInstallby?.battery_type_id != "" && (
                                        <BatteryInformationTrEdit
                                          setFormData={setFormData}
                                          formData={formData}
                                          battery_information={
                                            formData?.battery_information_toggle
                                          }
                                          batteryTypeList={batteryTypeList}
                                          batteryInfo={formData?.battery_info}
                                          print_battery_part={
                                            print_battery_part
                                          }
                                          RenderDate={RenderDate}
                                          DataValue={hasInstallby}
                                          DataName={"has_installby"}
                                          batteryIndex={hasInstallbyIndex}
                                        />
                                      )
                                  )}
                                </>
                              )}

                              {/* has_man loop */}
                              {data?.has_man?.length > 0 && (
                                <>
                                  {data?.has_man.map(
                                    (hasMan, hasManIndex) =>
                                      hasMan?.battery_type_id &&
                                      hasMan?.battery_type_id != "" && (
                                        <BatteryInformationTrEdit
                                          setFormData={setFormData}
                                          formData={formData}
                                          battery_information={
                                            formData?.battery_information_toggle
                                          }
                                          batteryTypeList={batteryTypeList}
                                          batteryInfo={formData?.battery_info}
                                          print_battery_part={
                                            print_battery_part
                                          }
                                          RenderDate={RenderDate}
                                          DataValue={hasMan}
                                          DataName={"has_man"}
                                          batteryIndex={hasManIndex}
                                        />
                                      )
                                  )}
                                </>
                              )}

                              {/* has_10pk loop */}
                              {data?.has_10pk?.length > 0 && (
                                <>
                                  {data?.has_10pk.map(
                                    (has10pk, has10pkIndex) =>
                                      has10pk?.battery_type_id &&
                                      has10pk?.battery_type_id != "" && (
                                        <BatteryInformationTrEdit
                                          setFormData={setFormData}
                                          formData={formData}
                                          battery_information={
                                            formData?.battery_information_toggle
                                          }
                                          batteryTypeList={batteryTypeList}
                                          batteryInfo={formData?.battery_info}
                                          print_battery_part={
                                            print_battery_part
                                          }
                                          RenderDate={RenderDate}
                                          DataValue={has10pk}
                                          DataName={"has_10pk"}
                                          batteryIndex={has10pkIndex}
                                        />
                                      )
                                  )}
                                </>
                              )}
                            </tbody>
                          ))}

                        <SpareBatteryInfoEdit
                          formData={formData}
                          setFormData={setFormData}
                          print_battery_part={print_battery_part}
                          RenderDate={RenderDate}
                          batteryTypeList={batteryTypeList}
                        />
                      </table>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="col py-2">
                    <h2 className="heading">Pads Information</h2>
                    <table className="theme-table">
                      <tr>
                        <td>
                          <div
                            style={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}
                          >
                            <div>
                              {!formData?.pads_info_toggle
                                ? "Please Correct Below Information"
                                : "Is below information correct?"}
                            </div>
                            <div
                              style={{ display: "flex", marginRight: "10px" }}
                            >
                              <CustomToggleButton2
                                ToggleName="pads_info_toggle"
                                ToggleValue={formData?.pads_info_toggle}
                                changeHandler={handleToggleChange}
                                is_read_only={false}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>

                    {/* {JSON.stringify(formData?.adult_pad_pak_info)} */}
                    <PadsInfoEditTbl
                      aedPadTypeList={aedPadTypeList}
                      RenderDate={RenderDate}
                      // adultPadInfo={adultPadInfo}
                      // spareAdultPadInfo={spareAdultPadInfo}
                      // pediatricPadInfo={pediatricPadInfo}
                      // sparePadricPadInfo={sparePadricPadInfo}

                      adultPadInfo={formData?.adult_pad_info}
                      spareAdultPadInfo={formData?.spare_adult_pad_info}
                      pediatricPadInfo={formData?.pediatric_pad_info}
                      sparePadricPadInfo={formData?.spare_padric_pad_info}
                      gatewayInfo={formData?.gateway_info}
                      adultPadPakInfo={formData?.adult_pad_pak_info}
                      spareAdultPadPakInfo={formData?.spare_adult_pad_pak_info}
                      pediatricPadPakInfo={formData?.pediatric_pak_pad_info}
                      sparePadricPadPakInfo={formData?.spare_padric_pak_pad}
                      formData={formData}
                      setFormData={setFormData}
                      toggle={formData?.pads_info_toggle}
                    />
                  </div>

                  {/* <div className="col py-2">
                    <h2 className="heading">Bleeding Kit Information</h2>

                    <table className="theme-table">
                      <tr>
                        <td>
                          Is Bleeding Kit located in the designated location?
                        </td>
                        <td>
                          <CustomToggleButton2
                            ToggleName="bleeding_kit_located_toggle"
                            ToggleValue={formData?.bleeding_kit_located_toggle}
                            changeHandler={handleToggleChange}
                            is_read_only={false}
                          />
                        </td>
                      </tr>
                      {!formData?.bleeding_kit_located_toggle && (
                        <tr>
                          <td colSpan={2}>
                            <textarea
                              className="form-control"
                              id="bleeding_kit_located_input"
                              name={"bleeding_kit_located_input"}
                              placeholder="Enter text Here"
                              value={formData?.bleeding_kit_located_input}
                              onChange={HIC}
                              required
                            ></textarea>
                            {!formData?.bleeding_kit_located_toggle &&
                              formData?.bleeding_kit_located_input === "" && (
                                <p className="text-danger m-0 ps-1 mt-1">
                                  This field is required.
                                </p>
                              )}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td>
                          <p>Is the Bleeding Kit sealed? </p>
                        </td>
                        <td>
                          <CustomToggleButton2
                            ToggleName="bleeding_kit_sealed_toggle"
                            ToggleValue={formData?.bleeding_kit_sealed_toggle}
                            changeHandler={handleToggleChange}
                            is_read_only={false}
                          />
                        </td>
                      </tr>
                      {!formData?.bleeding_kit_sealed_toggle && (
                        <tr>
                          <td colSpan={2}>
                            <textarea
                              className="form-control"
                              id="bleeding_kit_sealed_input"
                              name="bleeding_kit_sealed_input"
                              placeholder="Enter text Here"
                              value={formData?.bleeding_kit_sealed_input}
                              onChange={HIC}
                              required
                            ></textarea>
                            {!formData?.bleeding_kit_sealed_toggle &&
                              formData?.bleeding_kit_sealed_input === "" && (
                                <p className="text-danger m-0 ps-1 mt-1">
                                  This field is required.
                                </p>
                              )}
                          </td>
                        </tr>
                      )}
                    </table>
                    </div> */}
                  {/* <table  className='theme-table' style={ { maxHeight: '400px', overflowY: 'auto',padding:"0px" } }>
                 <tr>
                  
                  <td> 
                <div style={{display:"flex", alignItems:"center",marginBottom:"0.6%"}}> 
                <div> Is Bleeding Kit located in the designated location? </div> 
                  <div  style={{display:"flex",marginLeft:"18.5%"}}>
                      <CustomToggleButton2 
                          ToggleName="bleeding_kit_located_toggle"
                          ToggleValue={formData?.bleeding_kit_located_toggle}
                          changeHandler={handleToggleChange}
                          is_read_only={false}
                        />
                    </div> 
                   </div>
              
                   <div style={{display:"flex", alignItems:"center",marginBottom:"0.6%"}}> 
                   <div>Is the Bleeding Kit sealed? </div> 
                <div  style={{display:"flex",marginLeft:"30.9%"}}>
                    <CustomToggleButton2 
                      ToggleName="bleeding_kit_sealed_toggle"
                      ToggleValue={formData?.bleeding_kit_sealed_toggle}
                      changeHandler={handleToggleChange}
                      is_read_only={false}
                    />
                    </div> 
                    </div> 
              </td></tr>
                            
                             </table>  */}
                  {0 ? (
                    <div className="col py-2">
                      <h2 className="heading">Oxygen Information</h2>

                      <table className="theme-table">
                        <tr>
                          <td>
                            <p>
                              Is the Oxygen equipment located in the designated
                              location?{" "}
                            </p>
                          </td>
                          <td>
                            <CustomToggleButton2
                              ToggleName="oxygen_equipment_located_toggle"
                              ToggleValue={
                                formData?.oxygen_equipment_located_toggle
                              }
                              changeHandler={handleToggleChange}
                              is_read_only={false}
                            />
                          </td>
                        </tr>
                        {!formData?.oxygen_equipment_located_toggle && (
                          <tr>
                            <td colSpan={2}>
                              <textarea
                                className="form-control"
                                id="oxygen_equipment_located_input"
                                name="oxygen_equipment_located_input"
                                placeholder="Enter text Here"
                                value={formData?.oxygen_equipment_located_input}
                                onChange={HIC}
                                required
                              ></textarea>
                              {!formData?.oxygen_equipment_located_toggle &&
                                formData?.oxygen_equipment_located_input ===
                                "" && (
                                  <p className="text-danger m-0 ps-1 mt-1">
                                    This field is required.
                                  </p>
                                )}
                            </td>
                          </tr>
                        )}

                        <tr>
                          <td>
                            <p>Does the gauge show that it is full?</p>
                          </td>
                          <td>
                            <CustomToggleButton2
                              ToggleName="gauge_show_toggle"
                              ToggleValue={formData?.gauge_show_toggle}
                              changeHandler={handleToggleChange}
                              is_read_only={false}
                            />
                          </td>
                        </tr>

                        {!formData?.gauge_show_toggle && (
                          <tr>
                            <td colSpan={2}>
                              <textarea
                                className="form-control"
                                id="gauge_show_input"
                                name="gauge_show_input"
                                placeholder="Enter text Here"
                                value={formData?.gauge_show_input}
                                onChange={HIC}
                                required
                              ></textarea>
                              {!formData?.gauge_show_toggle &&
                                formData?.gauge_show_input === "" && (
                                  <p className="text-danger m-0 ps-1 mt-1">
                                    This field is required.
                                  </p>
                                )}
                            </td>
                          </tr>
                        )}

                        <tr>
                          <td>
                            <p>
                              Are all the needed supplies available and in good
                              condition?
                            </p>
                          </td>
                          <td>
                            <CustomToggleButton2
                              ToggleName="needed_supplies_toggle"
                              ToggleValue={formData?.needed_supplies_toggle}
                              changeHandler={handleToggleChange}
                              is_read_only={false}
                            />
                          </td>
                        </tr>

                        {!formData?.needed_supplies_toggle && (
                          <tr>
                            <td colSpan={2}>
                              <textarea
                                className="form-control"
                                id="needed_supplies_input"
                                name="needed_supplies_input"
                                placeholder="Enter text Here"
                                value={formData?.needed_supplies_input}
                                onChange={HIC}
                                required
                              ></textarea>
                              {!formData?.needed_supplies_toggle &&
                                formData?.needed_supplies_input === "" && (
                                  <p className="text-danger m-0 ps-1 mt-1">
                                    This field is required.
                                  </p>
                                )}
                            </td>
                          </tr>
                        )}
                      </table>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="col py-2">
                    <h2 className="heading">Support Tickets</h2>
                    <table
                      className="theme-table"
                      style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        padding: "0px",
                      }}
                    >
                      <>
                      <tr style={{display:"flex", width:"100%",justifyContent:"space-between"}}>
                        <td colSpan={3} style={{borderColor:"transparent" }}>
                          <div
                            style={{ display: "flex", alignItems: "center"}}
                          >
                            Do you need to submit a support ticket?
                          </div>
                        </td>
                        <td colSpan={1} style={{borderColor:"transparent",flex: "0 0 100px",display: "flex", justifyContent: "flex-end" }}>
                          <div style={{ display: "flex", marginRight: "10px" }}>
                            <CustomToggleButton2
                              ToggleName="support_tickets_toggle"
                              ToggleValue={formData?.support_tickets_toggle}
                              changeHandler={handleToggleChange}
                              is_read_only={false}
                            />
                          </div>
                        </td>
                      </tr>

                      {formData?.support_tickets_toggle === 1 && (
                        <tr style={{width:"100%"}}>
                          <td colSpan={2} style={{maxWidth:"50%"}}>
                            <select
                              className=""
                              onChange={HIC}
                              name="issue_type"
                              value={formData?.issue_type}
                            >
                              <option value="">--Select-One--</option>
                              {issueList.map((it) => (
                                <option value={it.value} key={it.value}>
                                  {it.label}
                                </option>
                              ))}
                            </select>
                            {formData?.support_tickets_toggle === 1 &&
                              formData?.issue_type === "" && issueTypeValid && (
                                <p className="text-danger m-0 ps-1 mt-1">
                                  This field is required.
                                </p>
                              )}
                          </td>
                          <td colSpan={2}>
                            <textarea
                              className="form-control"
                              placeholder="Enter Text Here..."
                              name="issue"
                              value={formData?.issue}
                              onChange={HIC}
                            ></textarea>
                            {formData?.support_tickets_toggle === 1 &&
                              formData?.issue === "" && issueValid && (
                                <p className="text-danger m-0 ps-1 mt-1">
                                  This field is required.
                                </p>
                              )}
                          </td>
                        </tr>
                      )}
                      </>
                    </table>
                  </div>
                </>
              )}

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
                    {loading ? "Loading..." : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
};

const InfoModal = ({ infoModal, setInfoModal }) => {
  return (
    <Modal
      centered
      show={infoModal}
      onHide={() => setInfoModal(false)}
      size="xl"
    >
      {/* <Modal.Header closeButton></Modal.Header> */}
      <Modal.Body className="">
        <div className="row">
          <div className="col-4">
            <p className="" style={{ fontWeight: "bolder" }}>
              These kits usually include:
            </p>
            <div
              className="gap-1 d-flex flex-column"
              style={{ marginLeft: "40px" }}
            >
              <p className="m-0">Razor</p>
              <p className="m-0">Scissors</p>
              <p className="m-0">CPR Barrier</p>
              <p className="m-0">Disinfectant Wipe</p>
              <p className="m-0">Pair of Gloves</p>
              <p className="m-0">Disposable Towel</p>
            </div>
          </div>
          <div className="col-7">
            <p className="text-center" style={{ fontWeight: "bolder" }}>
              These are examples of AED Rescue Kits that could be with your
              device
            </p>
            <div className="d-flex justify-content-center align-items-center">
              <img src="/image1.svg" alt="image1" />
              <img src="/image2.png" alt="image2" />
              <img src="/image3.png" alt="image3" />
              <img src="/image4.png" alt="image4" />
            </div>
          </div>
          <div className="col-1 text-right">
            <MdClose
              role="button"
              size={30}
              onClick={() => setInfoModal(false)}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AedCheckSelect;

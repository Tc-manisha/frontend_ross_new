import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CustomToggleButton2 from "../../../../components/common/toggleSwitch/CustomToggle2";
import { CallGETAPI, CallPOSTAPI } from "../../../../helper/API";
import {
  AEDGroupBYCoordinatorInfo,
  AedCheckADTable,
  BatteryTypebyModel,
  CheckADTable,
  CheckAEDBatteryTblCol,
  CheckSpareBatteryTblCol,
  GetAedBrands,
  GetAedModelsByBrandId,
  GetAedSumModelsById,
  RenderDate,
} from "../../../../helper/BasicFn";
import {
  FormatDate,
  FormatDateWithTime,
  prepareOptions,
} from "../../../../helper/Common";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import CommonDatePicker from "../../../../components/common/date-picker/CommonDatePicker";
import moment from "moment";
import BatteryInformationTrEdit from "../../../../components/tables/AEDs/BatteryInformationTrEdit";
import PadsInfoEditTbl from "../../../../components/tables/AEDs/PadsInfoEditTbl";
import { InfoIcon } from "../../../../helper/Icons";
import { toast } from "react-toastify";
import BackButton from "../../../../components/common/BackButton";
import SpareBatteryInfoEdit from "../../../../components/tables/AEDs/SpareBatteryInfoEdit";
import CircularLoadingComp from "../../../../userPages/userComp/CircularLoadingComp";

const filterData = (arr, key, value) => {
  const data = arr.find((a) => a[key] == value);
  return data;
};

const AEDChecksDetails = () => {
  const navigate = useNavigate();
  const [toggleValue, setToggleValue] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { aedId, checkId } = useParams();
  const [accountId, setAccountID] = useState(""); // searchParams.get('account_id');

  const [loading, setLoading] = useState(false);
  const [aedDetails, setAedDetails] = useState({});

  const [aedData, setAEDData] = useState({});
  const [storageInfoList, setStorageInfoList] = useState([]);
  const [rmsBrandList, setrmsBrandList] = useState([]);
  const [aedBattryTypeList, setaedBattryTypeList] = useState([]);
  const [aedPadTypeList, setaedPadTypeList] = useState([]);
  const [OtherFiled, setOtherFileds] = useState([]);
  const [batteryTypeList, setBatteryTypeList] = useState([]);
  const [loading2, setLoading2] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading2(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const [brandList, setBrandList] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [formData, setFormData] = useState({
    aed_id: aedId,
    account_id: accountId,
    is_aed_present: 1,
    status_indicator: 1,
    rescue_kit_present: 1,
    aed_storage_currect: 1,
    sti_expiry_date: "",
    sti_alarmed: 1,
    sti_turned_on: 1,
    sti_alarme_sound: 1,
    battery_information_toggle: 1,
    bleeding_kit_located_toggle: 1,
    bleeding_kit_sealed_toggle: 1,
    oxygen_equipment_located_toggle: 1,
    needed_supplies_toggle: 1,
    gauge_show_toggle: 1,
    pads_info_toggle: 1,
    support_tickets_toggle: 1,
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
    gauge_show_input: "",
  });

  console.log('formData', formData);

  const [aedData1, setAedData1] = useState({});

  const [completedBy, setCompletedBy] = useState(null);
  const [brandName, setBrandName] = useState(null);
  const getAedDetails = async () => {
    const result = await CallGETAPI("account/aed-check-details/" + checkId);

    const result2 = await CallGETAPI("account/get-aed-by-id/" + aedId);
    const allPads = result2?.data?.allPads || [];
    const SupportData = result?.data?.supportData || [];
    const aedDetails2 = result2?.data?.data || {};

    const FD = { ...formData };
    FD.SupportData = SupportData;

    FD.issue_type = SupportData?.[0]?.issue_type;
    FD.issue = SupportData?.[0]?.issue;

    if (result?.data?.status) {
      const aedDetails1 = result?.data?.data;
      setCompletedBy({
        createdDate: result?.data?.data.created_date,
        createdBy: result?.data?.data.created_by,
      });
      console.log({ batteryInfo: JSON.parse(aedDetails1?.battery_info) });
      setStorageInfoList(result2?.data?.storageInfo);
      setBrandName(result?.data?.brandName?.aed_brand);
      // console.log("brand name", result);
      setAedData1(aedDetails2);
      setAEDData(aedDetails2);

      const BatteryRes = await BatteryTypebyModel(aedDetails2?.aed_model_id);
      setBatteryTypeList(BatteryRes);

      aedDetails1.adult_pad_info = JSON.parse(aedDetails1?.adult_pad_info);
      aedDetails1.adult_pad_pak_info = JSON.parse(
        aedDetails1?.adult_pad_pak_info
      );
      aedDetails1.battery_info = JSON.parse(aedDetails1?.battery_info);
      // aedDetails1.builtin_RMS_info = JSON.parse(aedDetails1?.builtin_RMS_info);
      // aedDetails1.charge_pak_info = JSON.parse(aedDetails1?.charge_pak_info);
      // aedDetails1.charge_pak_info = aedDetails1?.charge_pak_info[0];
      // aedDetails1.gateway_info = JSON.parse(aedDetails1?.gateway_info);
      // aedDetails1.gateway_info = aedDetails1?.gateway_info[0];
      // aedDetails1.other = JSON.parse(aedDetails1?.other);
      // aedDetails1.out_of_service_info = JSON.parse(
      //   aedDetails1?.out_of_service_info
      // );
      aedDetails1.pediatric_pad_info = JSON.parse(
        aedDetails1?.pediatric_pad_info
      );
      aedDetails1.pediatric_pak_pad_info = JSON.parse(
        aedDetails1?.pediatric_pak_pad_info
      );
      // aedDetails1.rms_info = JSON.parse(aedDetails1?.rms_info);
      aedDetails1.spare_adult_pad_info = JSON.parse(
        aedDetails1?.spare_adult_pad_info
      );
      aedDetails1.spare_adult_pad_pak_info = JSON.parse(
        aedDetails1?.spare_adult_pad_pak_info
      );
      aedDetails1.spare_battery_info = JSON.parse(
        aedDetails1?.spare_battery_info
      );
      // aedDetails1.spare_charge_pak_info = JSON.parse(
      //   aedDetails1?.spare_charge_pak_info
      // );
      aedDetails1.spare_padric_pad_info = JSON.parse(
        aedDetails1?.spare_padric_pad_info
      );
      aedDetails1.spare_padric_pak_pad = JSON.parse(
        aedDetails1?.spare_padric_pak_pad
      );
      // aedDetails1.storage_info = JSON.parse(aedDetails1?.storage_info);

      // sti_storage_type sti_storage_type

      FD.sti_storage_type = aedDetails1?.sti_storage_type;
      FD.sti_expiry_date = aedDetails1?.sti_expiry_date;
      FD.sti_alarmed = aedDetails1?.sti_alarmed;
      FD.sti_turned_on = aedDetails1?.sti_turned_on;
      FD.sti_alarme_sound = aedDetails1?.sti_alarme_sound;

      FD.is_aed_present = aedDetails1?.is_aed_present;
      FD.status_indicator = aedDetails1?.status_indicator;
      FD.rescue_kit_present = aedDetails1?.rescue_kit_present;
      FD.aed_storage_currect = aedDetails1?.aed_storage_currect;
      FD.battery_information_toggle = aedDetails1?.battery_information_toggle;
      FD.bleeding_kit_located_toggle = aedDetails1?.bleeding_kit_located_toggle;
      FD.bleeding_kit_sealed_toggle = aedDetails1?.bleeding_kit_sealed_toggle;
      FD.oxygen_equipment_located_toggle =
        aedDetails1?.oxygen_equipment_located_toggle;
      FD.needed_supplies_toggle = aedDetails1?.needed_supplies_toggle;
      FD.gauge_show_toggle = aedDetails1?.gauge_show_toggle;
      FD.pads_info_toggle = aedDetails1?.pads_info_toggle;
      FD.support_tickets_toggle = aedDetails1?.support_tickets_toggle;

      FD.bleeding_kit_located_input = aedDetails1?.bleeding_kit_located_input;
      FD.bleeding_kit_sealed_input = aedDetails1?.bleeding_kit_sealed_input;
      FD.oxygen_equipment_located_input =
        aedDetails1?.oxygen_equipment_located_input;
      (FD.needed_supplies_input = aedDetails1?.needed_supplies_input),
        (FD.is_aed_present_input = aedDetails1?.is_aed_present_input);
      (FD.status_indicator_input = aedDetails1?.status_indicator_input),
        (FD.rescue_kit_present_input = aedDetails1?.rescue_kit_present_input);
      // FD.issue_type = aedDetails1?.issue_type;
      // FD.issue = aedDetails1?.issue;
      FD.spare_battery_info = aedDetails1?.spare_battery_info;
      FD.battery_info = aedDetails1?.battery_info;
      FD.gauge_show_input = aedDetails1?.gauge_show_input;
      // console.log("aed details 1 ", aedDetails1.gauge_show_input);
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
          APD.section_name === "spare_pediatric_pak_pad_info"
        ) {
          if (APD.is_spare) {
            SPPP.push(APD);
          } else {
            PPP.push(APD);
          }
        }
      }
      // for (let index = 0; index < array.length; index++) {
      //   const element = array[index];

      // }

      // FD.adult_pad_info = adult_pad_info || [];
      // FD.spare_adult_pad_info = spare_adult_pad_info || [];
      // FD.pediatric_pad_info = pediatric_pad_info || [];
      // FD.spare_padric_pad_info = spare_padric_pad_info || [];
      // // FD.gateway_info = gateway_info || [];
      // FD.adult_pad_pak_info = adult_pad_pak_info || [];
      // FD.spare_adult_pad_pak_info = spare_adult_pad_pak_info || [];
      // FD.pediatric_pak_pad_info = pediatric_pak_pad_info || [];
      // FD.spare_padric_pak_pad = spare_padric_pak_pad || [];
      // FD.pads_info_toggle = pads_info_toggle || [];

      FD.adult_pad_info = AP; //aedDetails1?.adult_pad_info ||[];
      FD.spare_adult_pad_info = SAP; //aedDetails1?.spare_adult_pad_info ||[];
      FD.pediatric_pad_info = PP; //aedDetails1?.pediatric_pad_info ||[];
      FD.spare_padric_pad_info = SPP; //aedDetails1?.spare_padric_pad_info ||[];
      FD.gateway_info = aedDetails1?.gateway_info || [];
      FD.adult_pad_pak_info = APP; //aedDetails1?.adult_pad_pak_info ||[];
      FD.spare_adult_pad_pak_info = SAPP; //aedDetails1?.spare_adult_pad_pak_info ||[];
      FD.pediatric_pak_pad_info = PPP; //aedDetails1?.pediatric_pak_pad_info ||[];
      FD.spare_padric_pak_pad = SPPP; //aedDetails1?.spare_padric_pak_pad || [];

      // console.log({ APP });

      setFormData(FD);

      let brandList = await GetAedBrands();
      setBrandList(brandList);

      const filteredBrand = filterData(
        brandList?.data,
        "id",
        aedDetails1?.aed_brand_id
      );
      aedDetails1.brand_name = filteredBrand?.AED_brands;
      setAedDetails(aedDetails1);
    }
    //
    return "";

    // const result = await CallGETAPI("account/get-aed-by-id/" + aedId);
    const aedDetails1 = result?.data?.data;

    // const batteryTypeList = [];
    if (result?.status) {
      // set list data ;
      const FD = { ...formData };
      setAEDData(aedDetails1);
      // setAccountID
      setStorageInfoList(result?.data?.storageInfo);
      // setSubModelList(result?.data?.storageInfo)
      setrmsBrandList(result?.data?.rmsBrand);
      setaedBattryTypeList(result?.data?.aedBattryType);
      setaedPadTypeList(result?.data?.aedPadType);
      setAccountID(result?.data?.account_id);
      // aed_model_id
      const BatteryRes = await BatteryTypebyModel(aedDetails1?.aed_model_id);
      setBatteryTypeList(BatteryRes);
      if (aedDetails1.length === 0) {
        toast.error("Something went wrong please try again");
        return "";
      }
      aedDetails1.adult_pad_info = JSON.parse(aedDetails1?.adult_pad_info);
      aedDetails1.adult_pad_pak_info = JSON.parse(
        aedDetails1?.adult_pad_pak_info
      );
      aedDetails1.battery_info = JSON.parse(aedDetails1?.battery_info);
      aedDetails1.builtin_RMS_info = JSON.parse(aedDetails1?.builtin_RMS_info);
      aedDetails1.charge_pak_info = JSON.parse(aedDetails1?.charge_pak_info);
      // aedDetails1.charge_pak_info = aedDetails1?.charge_pak_info[0];
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

      FD.sti_expiry_date = FormatDate(
        aedDetails1?.storage_info?.[0]?.expiry_date
      );
      FD.spare_battery_info = aedDetails1?.spare_battery_info;
      FD.spare_pediatric_pad_part = aedDetails1?.spare_pediatric_pad_part;
      FD.sti_alarmed = aedDetails1?.storage_info?.[0]?.alarmed || 0;
      FD.battery_info = aedDetails1?.battery_info;
      FD.adult_pad_info = aedDetails1?.adult_pad_info || [];
      FD.spare_adult_pad_info = aedDetails1?.spare_adult_pad_info || [];
      FD.pediatric_pad_info = aedDetails1?.pediatric_pad_info || [];
      FD.spare_padric_pad_info = aedDetails1?.spare_padric_pad_info || [];
      FD.gateway_info = aedDetails1?.gateway_info || [];
      FD.adult_pad_pak_info = aedDetails1?.adult_pad_pak_info || [];
      FD.spare_adult_pad_pak_info = aedDetails1?.spare_adult_pad_pak_info || [];
      FD.pediatric_pak_pad_info = aedDetails1?.pediatric_pak_pad_info || [];
      FD.spare_padric_pak_pad = aedDetails1?.spare_padric_pak_pad || [];
      FD.site_id = result?.data?.site_id;
      FD.sti_storage_type = aedDetails1?.storage_info?.[0]?.storage_type;
      aedDetails1.site_name = result?.data?.site_name;
      aedDetails1.account_name = result?.data?.account_name;
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
      title: "Batter Part",
    },
    {
      key: "manufactured_date",
      is_default: 0,
      title: "Manufactured Date",
    },
    // { key: "battery_expiration", is_default: 1, title: "Battery Expiration" },
    { key: "battery_lot", is_default: 1, title: "Battery Lot" },
    { key: "battery_uid", is_default: 1, title: "Battery UDI" },
    // { key: "serial", is_default: 0, title: "Serial" },
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
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: newValue,
    }));

    setToggleValue(newValue);
  };

  const HIC = (e) => {
    const newValue = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: newValue,
    }));
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
    setLoading(true);
    const res = await CallPOSTAPI("account/aed-checks", formData);
    if (res.status) {
      toast.success("AED checked Saved Successfully");
    } else {
      toast.error("Something went wrong please try again");
    }
    setLoading(false);
  };

  // console.log("formdata again", formData);

  // console.log({ formData });

  return (
    <>
      {
        loading2 ?
          <>
            <CircularLoadingComp />
          </>
          :
          <>
            <div
              className="mt-4 table-main-20002"
              style={{ width: "100%", paddingInline: "2%" }}
            >
              <BackButton />

              <div className="col py-2">
                <h2 className="heading">General Information</h2>
                <div className="table-main-20002">
                  <table className="table">
                    <thead className="heading">
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
                          {brandName && brandName}{" "}
                          {aedData1?.model_name ? " / " + aedData1?.model_name : ""}
                        </td>
                        <td>{aedData?.serial_number}</td>
                        <td>{aedData?.asset}</td>
                        <td>{aedData?.placement}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <form className="pb-5" onSubmit={handleSubmit}>
                <div className="col py-2">
                  <h2 className="heading">AED Information</h2>

                  <table className="table table-striped-columns">
                    <tbody className="">
                      <tr>
                        <td> Is The AED Present?</td>
                        <td>
                          <CustomToggleButton2
                            ToggleName="is_aed_present"
                            ToggleValue={formData?.is_aed_present}
                            changeHandler={handleToggleChange}
                            is_read_only={true}
                          />
                        </td>
                      </tr>
                      {!formData?.is_aed_present && (
                        <tr>
                          <td colSpan={3}>
                            <textarea
                              className="form-control"
                              name="is_aed_present_input"
                              placeholder=""
                              value={formData?.is_aed_present_input}
                              onChange={HIC}
                              readOnly
                            ></textarea>
                          </td>
                        </tr>
                      )}

                      {!formData?.is_aed_present ? (
                        ""
                      ) : (
                        <>
                          <tr>
                            <td> Does the status indicator show ready?</td>
                            <td>
                              <CustomToggleButton2
                                ToggleName="status_indicator"
                                ToggleValue={formData?.status_indicator}
                                changeHandler={handleToggleChange}
                                is_read_only={true}
                              />
                            </td>
                          </tr>
                          {!formData?.status_indicator && (
                            <tr>
                              <td colSpan={3}>
                                <textarea
                                  className="form-control"
                                  placeholder=""
                                  value={formData?.status_indicator_input}
                                  name="status_indicator_input"
                                  onChange={HIC}
                                  readOnly
                                ></textarea>
                              </td>
                            </tr>
                          )}

                          <tr>
                            <td>
                              {" "}
                              Is there a AED rescue kit present and in good condition?
                              <span
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Hello world!"
                                data-tooltip-place="top"
                              >
                                <InfoIcon />
                              </span>
                            </td>
                            <td>
                              <CustomToggleButton2
                                ToggleName="rescue_kit_present"
                                ToggleValue={formData?.rescue_kit_present}
                                changeHandler={handleToggleChange}
                                is_read_only={true}
                              />
                            </td>
                          </tr>
                          {!formData?.rescue_kit_present && (
                            <tr>
                              <td colSpan={3}>
                                <textarea
                                  className="form-control"
                                  placeholder=""
                                  name="rescue_kit_present_input"
                                  value={formData?.rescue_kit_present_input}
                                  onChange={HIC}
                                  readOnly
                                ></textarea>
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

                    {
                      formData?.sti_storage_type !== '' && (
                        <div className="col py-2">
                          <h2 className="heading">AED Storage</h2>
                          <table className="theme-table">
                            <tr>
                              {/* <td>
                      {formData?.aed_storage_currect
                        ? "Please Correct Below Information"
                        : "Is below information correct?"}
                    </td> */}
                              <td>
                                {formData?.aed_storage_currect
                                  ? "Is below information correct?"
                                  : "Is below information correct?"}
                              </td>
                              <td>
                                <CustomToggleButton2
                                  ToggleName="aed_storage_currect"
                                  ToggleValue={formData?.aed_storage_currect}
                                  changeHandler={handleToggleChange}
                                  is_read_only={true}
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
                                  {storageInfoList.map(
                                    (it) =>
                                      parseInt(it.storage_info_id) ===
                                      parseInt(formData?.sti_storage_type) && (
                                        <span>{it?.storage_info_name}</span>
                                      )
                                  )}
                                </td>
                                <td>
                                  {formData?.sti_alarmed ? (
                                    <CheckIcon sx={{ color: "#00FF00" }} />
                                  ) : (
                                    <CloseIcon color={"error"} />
                                  )}
                                </td>
                                <td>
                                  {formData?.sti_turned_on ? (
                                    <CheckIcon sx={{ color: "#00FF00" }} />
                                  ) : (
                                    <CloseIcon color={"error"} />
                                  )}
                                </td>
                                <td>
                                  {formData?.sti_alarme_sound ? (
                                    <CheckIcon sx={{ color: "#00FF00" }} />
                                  ) : (
                                    <CloseIcon color={"error"} />
                                  )}
                                  {/* {parseInt(formData?.sti_storage_type) != 1 ? "" : <>

    {formData?.aed_storage_currect ?
      formData?.sti_alarme_sound ? <CheckIcon sx={ { color: "#00FF00" } } /> :  <CloseIcon color={ "error" } />
      :                
      <div className="">
          <CustomToggleButton2 
          ToggleName="sti_alarme_sound"
          ToggleValue={formData?.sti_alarme_sound}
          changeHandler={handleCheckBox}
          />
      </div>
       
      }</>} */}
                                </td>
                                <td style={{ width: "400px" }}>
                                  {FormatDate(formData?.sti_expiry_date)}
                                  {/*       
    {parseInt(formData?.sti_storage_type) != 1 ? "" : <>
      {formData?.aed_storage_currect ? formData?.sti_expiry_date  :
        <CommonDatePicker 
            calName={'sti_expiry_date'}
            CalVal={formData?.sti_expiry_date}
            HandleChange={handleDateChange}
            disabled={false}
        />}
        </>} */}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )
                    }

                    {CheckSpareBatteryTblCol(
                      [...formData?.battery_info, ...formData?.spare_battery_info],
                      "All"
                    ) ? (
                      <div className="col py-2">
                        <h2 className="heading">Battery Information</h2>
                        <table className="theme-table">
                          <tr>
                            <td>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <div>
                                  {" "}
                                  {!formData?.battery_information_toggle
                                    ? "Please Correct Below Information"
                                    : "Is below information correct?"}{" "}
                                </div>
                                <div style={{ display: "flex", marginLeft: "30.1%" }}>
                                  <CustomToggleButton2
                                    ToggleName="battery_information_toggle"
                                    ToggleValue={formData?.battery_information_toggle}
                                    changeHandler={handleToggleChange}
                                    is_read_only={true}
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
                                    CheckAEDBatteryTblCol(
                                      [
                                        formData?.battery_info,
                                        formData?.spare_battery_info,
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
                                            print_battery_part={print_battery_part}
                                            RenderDate={RenderDate}
                                            DataValue={hasBattery}
                                            DataName={"has_battery"}
                                            batteryIndex={batteryIndex}
                                            readOnly={1}
                                            is_disabled={true}
                                          />
                                        )
                                    )}
                                  </>
                                )}

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
                                            print_battery_part={print_battery_part}
                                            RenderDate={RenderDate}
                                            DataValue={has9v}
                                            DataName={"has_9v"}
                                            batteryIndex={has9vIndex}
                                            readOnly={1}
                                            is_disabled={true}
                                          />
                                        )
                                    )}
                                  </>
                                )}

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
                                            print_battery_part={print_battery_part}
                                            RenderDate={RenderDate}
                                            DataValue={hasInstallby}
                                            DataName={"has_installby"}
                                            batteryIndex={hasInstallbyIndex}
                                            readOnly={1}
                                            is_disabled={true}
                                          />
                                        )
                                    )}
                                  </>
                                )}

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
                                            print_battery_part={print_battery_part}
                                            RenderDate={RenderDate}
                                            DataValue={hasMan}
                                            DataName={"has_man"}
                                            batteryIndex={hasManIndex}
                                            readOnly={1}
                                            is_disabled={true}
                                          />
                                        )
                                    )}
                                  </>
                                )}

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
                                            print_battery_part={print_battery_part}
                                            RenderDate={RenderDate}
                                            DataValue={has10pk}
                                            DataName={"has_10pk"}
                                            batteryIndex={has10pkIndex}
                                            readOnly={1}
                                            is_disabled={true}
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
                            is_disabled={true}
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
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <div>
                                {!formData?.pads_info_toggle
                                  ? "Please Correct Below Information"
                                  : "Is below information correct?"}
                              </div>
                              <div style={{ display: "flex", marginLeft: "30.1%" }}>
                                <CustomToggleButton2
                                  ToggleName="pads_info_toggle"
                                  ToggleValue={formData?.pads_info_toggle}
                                  changeHandler={handleToggleChange}
                                  is_read_only={true}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <PadsInfoEditTbl
                        aedPadTypeList={aedPadTypeList}
                        RenderDate={RenderDate}
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
                        readOnly={1}
                      // is_disabled={true}
                      />
                    </div>

                    {/* <div className="col py-2">
                <h2 className="heading">Bleeding Kit Information</h2>

                <table className="theme-table">
                  <tr>
                    <td>Is Bleeding Kit located in the designated location?</td>
                    <td>
                      <CustomToggleButton2
                        ToggleName="bleeding_kit_located_toggle"
                        ToggleValue={formData?.bleeding_kit_located_toggle}
                        changeHandler={handleToggleChange}
                        is_read_only={true}
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
                        ></textarea>
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
                        is_read_only={true}
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
                        ></textarea>
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
                                is_read_only={true}
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
                                  readOnly
                                ></textarea>
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
                                is_read_only={true}
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
                                  readOnly
                                ></textarea>
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
                                is_read_only={true}
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
                                  readOnly
                                ></textarea>
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
                        <tr>
                          <td>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              Do you need to submit a support ticket?
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", marginLeft: "23.8%" }}>
                              <CustomToggleButton2
                                ToggleName="support_tickets_toggle"
                                ToggleValue={formData?.support_tickets_toggle}
                                changeHandler={handleToggleChange}
                                is_read_only={true}
                              />
                            </div>
                          </td>
                        </tr>

                        {formData?.support_tickets_toggle === 1 && (
                          <tr>
                            <td>
                              {formData?.issue_type}
                              {/* <select
                          className="form-control"
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
                        </select> */}
                            </td>
                            <td>
                              <textarea
                                className="form-control"
                                placeholder="Enter Text Here..."
                                name="issue"
                                value={formData?.issue}
                                onChange={HIC}
                                readOnly
                              ></textarea>
                            </td>
                          </tr>
                        )}
                      </table>
                    </div>

                    <div className="col py-2">
                      <h2 className="heading">Completion Information</h2>

                      <table className="theme-table">
                        <thead>
                          <tr>
                            <td>Checked By</td>
                            <td>Checked Date</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{completedBy?.createdBy}</td>

                            <td style={{ width: "400px" }}>
                              {FormatDateWithTime(completedBy?.createdDate)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* <div className="row pb-3 py-5">
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
          </div> */}
              </form>
            </div>
          </>
      }
    </>
  );
};
export default AEDChecksDetails;

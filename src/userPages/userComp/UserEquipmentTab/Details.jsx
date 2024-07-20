import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import {
  CheckADTable,
  CheckDate,
  GetAccountContactList,
  RenderDate,
} from "../../../helper/BasicFn";
import { useNavigate, useParams } from "react-router-dom";
import {
  ContactStatus,
  FormatDate,
  formatPhoneNumber,
} from "../../../helper/Common";
import { CallGETAPI, CallGETAPINEW } from "../../../helper/API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../../src/global.css";
import Form from "react-bootstrap/Form";

import {
  faPhoneSquare,
  faHome,
  faPhoneFlip,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import moment from "moment";
import BatteryInformationTr from "../../../components/tables/AEDs/BatteryInformationTr";
import SpareBatteryinformation from "../../../components/forms/subaed_forms/SpareBatteryinformation";
import ContactName from "../../../components/anchorTags/ContactName";
import { linkTabsPermission } from "../../../helper/permission";

const CheckAEdCheckers = (data) => {
  if (!data) {
    return 0;
  }
  let is_found = 0;
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    if (
      element?.primary ||
      element?.backup1 ||
      element?.backup2 ||
      element?.backup3
    ) {
      is_found = 1;
      break;
    }
  }
  return is_found;
};

const BatteryExpTbl = [
  {
    key: "battery_type_id",
    is_default: 1,
    title: "Battery Part #",
    is_first: 1,
  },
  {
    key: "battery_expiration",
    is_default: 0,
    title: "Expiration Date",
    is_first: 1,
  },
  //

  { key: "battery_serial", is_default: 0, title: "Serial", is_first: 1 },

  {
    key: "install_9v_date",
    is_default: 0,
    title: "9V install Date",
    is_first: 1,
  },
  {
    key: "install_9v_date",
    is_default: 0,
    title: "9V Expiry Date",
    is_first: 2,
  },
  {
    key: "manufactured_date",
    is_default: 0,
    title: "Manufactured Date",
    is_first: 1,
  },
  {
    key: "install_date",
    is_default: 0,
    title: "Installed Date",
    is_first: 1,
  },

  { key: "battery_lot", is_default: 0, title: "Battery Lot", is_first: 1 },
  { key: "battery_udi", is_default: 0, title: "Battery UDI", is_first: 1 },

  {
    key: "install_before_date",
    is_default: 0,
    title: "Install Before Date",
    is_first: 1,
  },
];

const SpareBatteryExpTbl = [
  {
    key: "battery_type_id",
    is_default: 1,
    title: "Battery Part #",
    is_first: 1,
  },
  {
    key: "battery_expiration",
    is_default: 0,
    title: "Expiration Date",
    is_first: 1,
  },
  //

  { key: "battery_serial", is_default: 0, title: "Serial", is_first: 1 },

  {
    key: "install_9v_date",
    is_default: 0,
    title: "9V install Date",
    is_first: 1,
  },
  {
    key: "install_9v_date",
    is_default: 0,
    title: "9V Expiry Date",
    is_first: 2,
  },
  {
    key: "manufactured_date",
    is_default: 0,
    title: "Manufactured Date",
    is_first: 1,
  },
  {
    key: "installed_date",
    is_default: 0,
    title: "Installed Date",
    is_first: 1,
  },

  { key: "battery_lot", is_default: 0, title: "Battery Lot", is_first: 1 },
  { key: "battery_udi", is_default: 0, title: "Battery UDI", is_first: 1 },

  {
    key: "install_before_date",
    is_default: 0,
    title: "Install Before Date",
    is_first: 1,
  },
];

const CheckBatteryInfo = (batteryInfo, is_spare = 0) => {
  if (!batteryInfo || batteryInfo?.length === 0) {
    return 0;
  }
  let is_found = 0;
  // const keys = ["battery_type_id","battery_expiration"]
  for (let index = 0; index < batteryInfo.length; index++) {
    const el = batteryInfo[index];
    if (el.section_name != "charge_pack") {
      if (is_spare) {
        for (let i2 = 0; i2 < BatteryExpTbl.length; i2++) {
          const el2 = BatteryExpTbl[i2];
          if (el.is_spare) {
            if (el[el2.key]) {
              is_found = 1;
              break;
            }
          }
        }
      } else {
        if (!el.is_spare) {
          for (let i2 = 0; i2 < BatteryExpTbl.length; i2++) {
            const el2 = BatteryExpTbl[i2];
            if (el[el2.key]) {
              is_found = 1;
              break;
            }
          }
        }
      }
    }
    if (is_found) {
      break;
    }
  }
  return is_found;
};

export default function Details({
  modelList,
  aedDetails,
  cordinatorInfo,
  storageInfo,
  batteryInfo,
  sphereBatteryInfo,
  adultPadInfo,
  spareAdultPadInfo,
  pediatricPadInfo,
  sparePadricPadInfo,
  gatewayInfo,
  adultPadPakInfo,
  spareAdultPadPakInfo,
  pediatricPadPakInfo,
  sparePadricPadPakInfo,
  chargePakInfo,
  spareChargePakInfo,
  batteryTypeList,
  outOfServiceInfo,
  out_of_service_toggle,
  storageInfoList,
  rmsBrandList,
  aedPadTypeList,
  aedBattryTypeList,
  OtherFiled,
  allPads
}) {

  const filteredAdultPadInfo = [
    ...adultPadInfo.filter(obj => obj.is_spare === 0 && obj.is_pediatric === 0),
    ...adultPadInfo.filter(obj => obj.is_spare === 1 && obj.is_pediatric === 0),
    ...adultPadInfo.filter(obj => obj.is_spare === 0 && obj.is_pediatric === 1),
    ...adultPadInfo.filter(obj => obj.is_spare === 1 && obj.is_pediatric === 1)
  ];

  console.log('filteredAdultPadInfo', filteredAdultPadInfo);

  const navigate = useNavigate();
  const [rmsinfo, setRmsInfo] = useState(aedDetails.builtin_RMS_info);
  const [showPadPakSection, setshowPadPakSection] = useState("");
  const [rmsBrandInfoId, setRmsBrandInfoId] = useState(aedDetails.rms_info);
  const userPermission = ["contact-details", "notes-tab"];

  const handleRmsBrand = (selectedBrandId) => {
    if (rmsBrandList && rmsBrandList[selectedBrandId]) {
      const rmsBrandName = rmsBrandList[selectedBrandId].rms_brand_name;
      return rmsBrandName;
    } else {
      return "";
    }
  };

  // console.log('outOfServiceInfo: ', outOfServiceInfo);

  const adultPakPadIndex = adultPadPakInfo.findIndex(
    (item) => item.section_name === "adult_pad_pak_info"
  );
  const spareAdultPakPadIndex = adultPadPakInfo.findIndex(
    (item) => item.section_name === "spare_adult_pad_pak_info"
  );
  const padiatricPakPadIndex = adultPadPakInfo.findIndex(
    (item) => item.section_name === "pediatric_pak_pad_info"
  );
  const sparePadiatricPakPadIndex = adultPadPakInfo.findIndex(
    (item) => item.section_name === "spare_padric_pak_pad"
  );

  const adultPadPakData = adultPadPakInfo[adultPakPadIndex];
  const spareAdultPadPakData = adultPadPakInfo[spareAdultPakPadIndex];
  const padiatricPadPakData = adultPadPakInfo[padiatricPakPadIndex];
  const sparePadiatricPadPakData = adultPadPakInfo[sparePadiatricPakPadIndex];

  const print_battery_part = (bid) => {
    let findName = batteryTypeList.find(
      (item) => parseInt(item?.battery_type_id) === parseInt(bid)
    );
    return findName?.battery_part_number || bid;
  };

  // function hasInvalidValue(data) {
  // 	const invalidValue = "undefined-NaN-undefined";

  // 	// Convert the JSON data string to an actual JavaScript object
  // 	const parsedData = data;//JSON.parse(data);

  // 	// Iterate through the data and check if any property has the invalid value
  // 	for (const item of parsedData) {
  // 	  for (const key in item) {
  // 		if (typeof item[key][0] === "object" && item[key][0].hasOwnProperty("battery_expiration")) {
  // 		  if (item[key][0].battery_expiration === invalidValue) {
  // 			return true; // Found an invalid value
  // 		  }
  // 		}
  // 	  }
  // 	}

  // 	return false; // No invalid value found
  //   }

  // function hasInvalidValue(jsonObject) {
  // 	function isInvalidValue(value) {
  // 	  return value === "undefined-NaN-undefined";
  // 	}

  // 	function checkValues(obj) {
  // 	  if (Array.isArray(obj)) {
  // 		for (let item of obj) {
  // 		  if (checkValues(item)) {
  // 			return true;
  // 		  }
  // 		}
  // 	  } else if (typeof obj === "object") {
  // 		for (let key in obj) {
  // 		  if (checkValues(obj[key])) {
  // 			return true;
  // 		  }
  // 		}
  // 	  } else if (isInvalidValue(obj)) {
  // 		return true;
  // 	  }

  // 	  return false;
  // 	}

  // 	return checkValues(jsonObject);
  //   }

  function hasInvalidValue(jsonObject) {
    return (
      (batteryInfo?.[0]?.has_battery?.length > 0 &&
        batteryInfo?.[0]?.has_battery?.[0]?.battery_type_id != "") ||
      (batteryInfo?.[0]?.has_9v?.length > 0 &&
        batteryInfo?.[0]?.has_9v?.[0]?.battery_type_id != "") ||
      (batteryInfo?.[0]?.has_installby?.length > 0 &&
        batteryInfo?.[0]?.has_installby?.[0]?.battery_type_id != "") ||
      (batteryInfo?.[0]?.has_man?.length > 0 &&
        batteryInfo?.[0]?.has_man?.[0]?.battery_type_id != "") ||
      (batteryInfo?.[0]?.has_10pk?.length > 0 &&
        batteryInfo?.[0]?.has_10pk?.[0]?.battery_type_id != "")
    );
  }

  const print_storage_type = (bid) => {
    let findName = storageInfoList.find(
      (item) => parseInt(item?.storage_info_id) === parseInt(bid)
    );
    return findName?.storage_info_name || bid;
  };

  const print_rms_brand = (bid) => {
    let findName = rmsBrandList.find(
      (item) => parseInt(item?.rms_brand_id) === parseInt(bid)
    );
    return findName?.rms_brand_name || bid;
  };

  const print_aed_pad_type = (bid) => {
    if (bid === "unknown") return "unknown";
    let findName = aedPadTypeList.find(
      (item) => parseInt(item?.pad_type_id) === parseInt(bid)
    );
    return findName?.pad_part_number || bid || "NA";
  };

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

  // aedPadType

  console.log('cordinatorInfo', cordinatorInfo);

  return (
    <div className="relative">
      {/* general information */}
      <div className="general-info pt-1">
        {/* heading */}
        <Box className="text-left">
          <h4 className="heading">General Information</h4>
        </Box>

        {/* table */}
        <table className="w-100">
          <thead>
            <tr className="">
              <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">
                Brand / Model
              </th>
              <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">
                Sub-Model
              </th>
              <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">
                Part #
              </th>
              <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">
                Purchased Date{" "}
              </th>
              <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">
                Warranty Date{" "}
              </th>
              <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">
                Last Check
              </th>
              <th className="border border-2 py-1 px-2 bg-tbl-border border-t-blue">
                Last Service
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="">
              {/* {JSON.stringify(aedDetails)} ; */}
              <td className="border border-2 py-1 px-2 border-r-blue">
                {aedDetails?.brand_name} {/* modelList */}
                {aedDetails?.model_name ? " / " + aedDetails?.model_name : ""}
              </td>
              <td className="border border-2 py-1 px-2 border-r-blue">
                {aedDetails?.sub_model_name}
              </td>
              <td className="border border-2 py-1 px-2 border-r-blue">
                {aedDetails?.part_number}
              </td>
              <td className="border border-2 py-1 px-2 border-r-blue">
                {RenderDate(aedDetails?.purchase_date, 0)}
              </td>
              <td className="border border-2 py-1 px-2 border-r-blue">
                {RenderDate(aedDetails?.warranty_date)}
              </td>
              <td className="border border-2 py-1 px-2 border-r-blue">
                {RenderDate(aedDetails?.last_check)}
              </td>
              <td className="border border-2 py-1 px-2">
                {RenderDate(aedDetails?.last_service)}
              </td>
            </tr>
          </tbody>
          <tbody className="">
            {/* second row */}
            <tr className="">
              <th className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                Placement
              </th>
              <th
                colSpan="3"
                className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
              >
                Asset
              </th>
              <th
                colSpan="2"
                className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
              >
                Spares
              </th>
              <th className="border border-2 py-1 px-2 bg-tbl-border border-t-blue">
                Pediatrics
              </th>
            </tr>
            <tr className="border-b-blue">
              <td className="border border-2 py-1 px-2 border-t-blue border-r-blue">
                {aedDetails?.placement}
              </td>
              <td
                colSpan="3"
                className="border border-2 py-1 px-2 border-t-blue border-r-blue"
              >
                {aedDetails?.asset}
              </td>
              <td
                colSpan="2"
                className="border border-2 py-1 px-2 border-t-blue border-r-blue"
              >
                {Number(aedDetails?.no_spares_toggle) == 1 ? (
                  <CheckIcon sx={{ color: "#00FF00" }} />
                ) : (
                  <CloseIcon color={"error"} />
                )}
              </td>
              <td className="border border-2 py-1 px-2 border-t-blue">
                {aedDetails?.no_pediatric_toggle == 1 ? (
                  <CheckIcon sx={{ color: "#00FF00" }} />
                ) : (
                  <CloseIcon color={"error"} />
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {OtherFiled?.[0]?.label && (
          <>
            <table className="w-100">
              <thead>
                <tr>
                  {OtherFiled?.map((item) => (
                    <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue ">
                      {item?.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {OtherFiled?.map((item) => (
                    <td className="border border-2 py-1 px-2 border-r-blue ">
                      {item?.val}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Storage Information */}
      <div className="account-info py-4">
        {/* heading */}
        {storageInfo[0]?.storage_type === "" ||
          !storageInfo[0]?.storage_type ? null : (
          <Box className="text-left">
            <h4 className="heading">Storage Information</h4>
          </Box>
        )}

        {storageInfo[0].storage_type !== "" && storageInfo[0]?.storage_type ? (
          <table className="w-100">
            <thead>
              <tr className="">
                <th
                  scope="col"
                  width="15%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Storage Type{" "}
                </th>
                <th
                  scope="col"
                  width="15%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Alarmed
                </th>
                <th
                  scope="col"
                  width="15%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Alarm Status
                </th>
                <th
                  scope="col"
                  width="15%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  9v Installed Date
                </th>
                <th
                  scope="col"
                  width="55%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue"
                >
                  9v Expiration Date
                </th>
              </tr>
            </thead>
            {/* second row */}
            <tbody className="odd-even-row border-b-blue">
              {storageInfo.map((SI, i) => (
                <tr className="" key={i}>
                  <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                    {print_storage_type(SI?.storage_type)}
                  </td>
                  <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                    {SI?.alarmed === 1 ? (
                      <CheckIcon sx={{ color: "#00FF00" }} />
                    ) : (
                      <CloseIcon color={"error"} />
                    )}
                  </td>
                  <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                    {SI?.alarm_status === 1 ? (
                      <CheckIcon sx={{ color: "#00FF00" }} />
                    ) : (
                      <CloseIcon color={"error"} />
                    )}
                  </td>
                  <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                    {/* {RenderDate(SI?.v9_Installed_Date, 0)
                      ? RenderDate(SI?.v9_Installed_Date, 0)
                      : "NA"} */}
                    {
                      SI?.v9_Installed_Date === 'unknown' ?
                        'unknown' :
                        RenderDate(SI?.v9_Installed_Date, 0)
                    }
                  </td>
                  <td className="border border-2 py-1 px-2 bg-tbl-border">
                    {/* {RenderDate(SI?.expiry_date)
                      ? RenderDate(SI?.expiry_date, true)
                      : "NA"} */}
                    {
                      SI?.expiry_date === 'unknown' ?
                        'unknown' :
                        RenderDate(SI?.expiry_date, 0)
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      {/* Battery Information */}

      <div className="account-info pb-4">
        {/* heading */}
        {CheckBatteryInfo(batteryInfo) ? (
          <>
            <Box className="text-left">
              <h4 className="heading">Main Battery Information</h4>
            </Box>
            <table className="w-100 border-l-blue border-b-blue border-r-blue">
              <thead>
                <tr className="">
                  {BatteryExpTbl?.map((item) =>
                    item?.is_default ||
                      CheckADTable(
                        batteryInfo.filter((it) => !it.is_spare),
                        item?.key
                      ) === 1 ? (
                      <th
                        scope="col"
                        className="border border-2 py-1 px-2 bg-tbl-border border-l-blue border-t-blue border-r-blue"
                      >
                        {item?.title}
                      </th>
                    ) : (
                      ""
                    )
                  )}
                </tr>
              </thead>

              <tbody className="odd-even-row border-b-blue">
                {batteryInfo.map(
                  (item, index) =>
                    Number(item.is_spare) == 0 && (
                      <>
                        {
                          item.section_name === "has_battery" && (
                            // ((item.battery_type_id === "" &&
                            // item.manufactured_date === "" &&
                            // item.install_date === "" &&
                            // item.battery_expiration === "" &&
                            // item.battery_lot === "" &&
                            // item.battery_udi === "" ? "" :
                            <>
                              <BatteryInformationTr
                                batteryInfo={batteryInfo.filter(
                                  (it) => !it.is_spare
                                )}
                                print_battery_part={print_battery_part}
                                RenderDate={RenderDate}
                                DataValue={item}
                                batteryIndex={index}
                              />
                            </>
                          )
                          // ))
                        }
                        {
                          item.section_name === "has_9v" && (
                            //  ((item.battery_type_id === "" &&
                            // item.manufactured_date === "" &&
                            // item.install_date === "" &&
                            // item.battery_expiration === "" &&
                            // item.battery_lot === "" &&
                            // item.battery_udi === "" ? "" :
                            <>
                              <BatteryInformationTr
                                batteryInfo={batteryInfo.filter(
                                  (it) => !it.is_spare
                                )}
                                print_battery_part={print_battery_part}
                                RenderDate={RenderDate}
                                DataValue={item}
                                batteryIndex={index}
                              />
                            </>
                          )
                          // ))
                        }

                        {
                          item.section_name === "has_installby" && (
                            //  ((item.battery_type_id === "" &&
                            // item.manufactured_date === "" &&
                            // item.install_date === "" &&
                            // item.battery_expiration === "" &&
                            // item.battery_lot === "" &&
                            // item.battery_udi === "" ? "" :
                            <>
                              <BatteryInformationTr
                                batteryInfo={batteryInfo.filter(
                                  (it) => !it.is_spare
                                )}
                                print_battery_part={print_battery_part}
                                RenderDate={RenderDate}
                                DataValue={item}
                                batteryIndex={index}
                              />
                            </>
                          )
                          //))
                        }

                        {
                          item.section_name === "has_man" && (
                            // ((item.battery_type_id === "" &&
                            // item.manufactured_date === "" &&
                            // item.install_date === "" &&
                            // item.battery_expiration === "" &&
                            // item.battery_lot === "" &&
                            // item.battery_udi === "" ? "" :
                            <>
                              <BatteryInformationTr
                                batteryInfo={batteryInfo.filter(
                                  (it) => !it.is_spare
                                )}
                                print_battery_part={print_battery_part}
                                RenderDate={RenderDate}
                                DataValue={item}
                                batteryIndex={index}
                                no_exp={1}
                              />
                            </>
                          )
                          // ))
                        }

                        {
                          item.section_name === "has_10pk" && (
                            //  ((item.battery_type_id === "" &&
                            // item.manufactured_date === "" &&
                            // item.install_date === "" &&
                            // item.battery_expiration === "" &&
                            // item.battery_lot === "" &&
                            // item.battery_udi === "" ? "" :
                            <>
                              <BatteryInformationTr
                                batteryInfo={batteryInfo.filter(
                                  (it) => !it.is_spare
                                )}
                                print_battery_part={print_battery_part}
                                RenderDate={RenderDate}
                                DataValue={item}
                                batteryIndex={index}
                              />
                            </>
                          )
                          // ))
                        }

                        {
                          item.section_name === "charge_pack" && (
                            //  ((item.battery_type_id === "" &&
                            // item.manufactured_date === "" &&
                            // item.install_date === "" &&
                            // CheckDate(item.battery_expiration)  &&
                            // item.battery_lot === "" &&
                            // item.battery_udi === "" ? "" :
                            <>
                              <BatteryInformationTr
                                batteryInfo={batteryInfo.filter(
                                  (it) => !it.is_spare
                                )}
                                print_battery_part={print_battery_part}
                                RenderDate={RenderDate}
                                DataValue={item}
                                batteryIndex={index}
                              />
                            </>
                          )
                          // ))
                        }
                      </>
                    )
                )}
              </tbody>
            </table>
          </>
        ) : (
          ""
        )}

        {CheckBatteryInfo(batteryInfo, 1) ? (
          <>
            <Box className="text-left mt-4">
              <h4 className="heading">Spare Battery Information</h4>
            </Box>

            <table className="w-100 border-b-blue">
              <thead>
                <tr className="">
                  {SpareBatteryExpTbl?.map((item) =>
                    item?.is_default ||
                      CheckADTable(
                        batteryInfo.filter((it) => Number(it.is_spare)),
                        item?.key
                      ) === 1 ? (
                      <th
                        scope="col"
                        className="border border-2 py-1 px-2 bg-tbl-border border-l-blue border-t-blue border-r-blue"
                      >
                        {item?.title}
                      </th>
                    ) : (
                      ""
                    )
                  )}
                </tr>
              </thead>

              <tbody className="odd-even-row">
                {batteryInfo.map(
                  (item, index) =>
                    Number(item.is_spare) === 1 && (
                      <>
                        {item.section_name === "has_battery" &&
                          (item.battery_type_id === "" &&
                            item.manufactured_date === "" &&
                            item.battery_expiration === "" &&
                            item.battery_lot === "" &&
                            item.battery_udi === "" ? (
                            ""
                          ) : (
                            <>
                              <SpareBatteryinformation
                                batteryInfo={batteryInfo.filter((it) =>
                                  Number(it.is_spare)
                                )}
                                print_battery_part={print_battery_part}
                                RenderDate={RenderDate}
                                DataValue={item}
                                batteryIndex={index}
                              />
                            </>
                          ))}

                        {item.section_name === "has_9v" &&
                          (item.battery_type_id === "" &&
                            item.manufactured_date === "" &&
                            item.battery_expiration === "" &&
                            item.battery_lot === "" &&
                            item.battery_udi === "" ? (
                            ""
                          ) : (
                            <>
                              <SpareBatteryinformation
                                batteryInfo={batteryInfo.filter((it) =>
                                  Number(it.is_spare)
                                )}
                                print_battery_part={print_battery_part}
                                RenderDate={RenderDate}
                                DataValue={item}
                                batteryIndex={index}
                              />
                            </>
                          ))}

                        {item.section_name === "has_installby" &&
                          (item.battery_type_id === "" &&
                            item.manufactured_date === "" &&
                            item.battery_expiration === "" &&
                            item.battery_lot === "" &&
                            item.battery_udi === "" ? (
                            ""
                          ) : (
                            <>
                              <SpareBatteryinformation
                                batteryInfo={batteryInfo.filter((it) =>
                                  Number(it.is_spare)
                                )}
                                print_battery_part={print_battery_part}
                                RenderDate={RenderDate}
                                DataValue={item}
                                batteryIndex={index}
                              />
                            </>
                          ))}

                        {item.section_name === "has_man" &&
                          (item.battery_type_id === "" &&
                            item.manufactured_date === "" &&
                            item.battery_expiration === "" &&
                            item.battery_lot === "" &&
                            item.battery_udi === "" ? (
                            ""
                          ) : (
                            <>
                              <SpareBatteryinformation
                                batteryInfo={batteryInfo.filter((it) =>
                                  Number(it.is_spare)
                                )}
                                print_battery_part={print_battery_part}
                                RenderDate={RenderDate}
                                DataValue={item}
                                batteryIndex={index}
                              />
                            </>
                          ))}

                        {item.section_name === "has_10pk" &&
                          (item.battery_type_id === "" &&
                            item.manufactured_date === "" &&
                            item.battery_expiration === "" &&
                            item.battery_lot === "" &&
                            item.battery_udi === "" ? (
                            ""
                          ) : (
                            <>
                              <SpareBatteryinformation
                                batteryInfo={batteryInfo.filter((it) =>
                                  Number(it.is_spare)
                                )}
                                print_battery_part={print_battery_part}
                                RenderDate={RenderDate}
                                DataValue={item}
                                batteryIndex={index}
                              />
                            </>
                          ))}

                        {item.section_name === "charge_pack" &&
                          (item.battery_type_id === "" &&
                            item.manufactured_date === "" &&
                            item.battery_expiration === "" &&
                            item.battery_lot === "" &&
                            item.battery_udi === "" ? (
                            ""
                          ) : (
                            <>
                              <SpareBatteryinformation
                                batteryInfo={batteryInfo.filter((it) =>
                                  Number(it.is_spare)
                                )}
                                print_battery_part={print_battery_part}
                                RenderDate={RenderDate}
                                DataValue={item}
                                batteryIndex={index}
                              />
                            </>
                          ))}
                      </>
                    )
                )}
              </tbody>
            </table>
          </>
        ) : (
          ""
        )}
      </div>

      {/* Charge-Pak Information */}
      {Array.isArray(chargePakInfo) && chargePakInfo.length > 0 || Array.isArray(spareChargePakInfo) && spareChargePakInfo.length > 0 && (
        <div className="account-info pb-4">
          {/* heading */}
          {/* { chargePakInfo[ 0 ]?.charge_pak_part !== "" ? 
						<Box className="text-left">
							<h4 className="heading">Charge-Pak Information</h4>
						</Box>
					: "" } */}

          <Box className="text-left">
            <h4 className="heading">Charge-Pak Information</h4>
          </Box>

          {/* chargePakInfo[ 0 ]?.charge_pak_part */}
          <table className="w-100">
            {/* main adult head */}
            <thead>
              <tr className="">
                <th
                  scope="col"
                  colSpan={1}
                  // width={ "20%" }
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Charge-Pak Type
                </th>
                <th
                  scope="col"
                  colSpan={2}
                  // width={ "20%" }
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Charge-Pak Part #
                </th>
                <th
                  scope="col"
                  colSpan={2}
                  // width={ "20%" }
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  Charge-Pak UDI
                </th>
                <th
                  scope="col"
                  colSpan={1}
                  // width={ "20%" }
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Battery Expiration
                </th>
                <th
                  scope="col"
                  colSpan={2}
                  // width={ "20%" }
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue"
                >
                  Battery Lot
                </th>
              </tr>
            </thead>

            {/* main adult body */}
            <tbody className="odd-even-row border-b-blue">
              {/* main adult */}

              {chargePakInfo?.charge_pak_part &&
                chargePakInfo?.spare_pediatric_pad_part != "" && (
                  <>
                    <tr className="">
                      <td
                        colSpan={1}
                        className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                      >
                        Main Adult
                      </td>
                      <td
                        colSpan={2}
                        className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                      >
                        {print_battery_part(chargePakInfo?.charge_pak_part)}
                      </td>
                      <td
                        colSpan={2}
                        // colSpan={ 3 }
                        className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        style={{
                          maxWidth: "300px",
                          overflowWrap: "break-word",
                        }}
                      >
                        {chargePakInfo?.charge_pak_uiid}
                      </td>
                      <td
                        colSpan={1}
                        className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                      >
                        {/* {RenderDate(chargePakInfo?.battery_expiration, true)} */}
                        {
                          chargePakInfo?.battery_expiration === 'unknown' ?
                            'unknown' :
                            RenderDate(chargePakInfo?.battery_expiration, true)
                        }
                      </td>
                      <td
                        colSpan={2}
                        className="border border-2 py-1 px-2 bg-tbl-border"
                        style={{
                          maxWidth: "300px",
                          overflowWrap: "break-word",
                        }}
                      >
                        {chargePakInfo?.battery_lot}
                      </td>
                    </tr>

                    {/* <tr className="">
                        <th
                          scope="col"
                          colSpan={1}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        ></th>
                        <th
                          scope="col"
                          colSpan={1}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          Pad 1 Part #
                        </th>
                        <th
                          scope="col"
                          colSpan={1}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          Pad 1 Expiration
                        </th>
                        <th
                          scope="col"
                          colSpan={1}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          style={{
                            maxWidth: "200px",
                            overflowWrap: "break-word",
                          }}
                        >
                          Pad 1 Lot{" "}
                        </th>
                        <th
                          scope="col"
                          colSpan={1}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          Pad 2 Part #
                        </th>
                        <th
                          scope="col"
                          colSpan={1}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          Pad 2 Expiration
                        </th>
                        <th
                          scope="col"
                          colSpan={2}
                          className="border border-2 py-1 px-2 bg-tbl-border"
                        >
                          Pad 2 Lot{" "}
                        </th>
                      </tr> */}

                    {/* <tr className="">
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          <span></span>
                        </td>
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          {print_battery_part(chargePakInfo?.pad_1_part) ||
                            "NA"}
                        </td>
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          {RenderDate(chargePakInfo?.pad_1_expiration, true) ||
                            "NA"}
                        </td>
                        <td
                          style={{
                            minHeight: "10px",
                            maxWidth: "200px",
                            overflowWrap: "break-word",
                          }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          {chargePakInfo?.pad_1_lot || "NA"}
                        </td>
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          {print_aed_pad_type(chargePakInfo?.pad_2_part) ||
                            "NA"}
                        </td>
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          {RenderDate(chargePakInfo?.pad_2_expiration, true) ||
                            "NA"}
                        </td>
                        <td
                          colSpan={2}
                          style={{
                            minHeight: "10px",
                            maxWidth: "200px",
                            overflowWrap: "break-word",
                          }}
                          className="border border-2 py-1 px-2 bg-tbl-border"
                        >
                          {chargePakInfo?.pad_2_lot || "NA"}
                        </td>
                      </tr> */}
                  </>
                )}
            </tbody>

            {/* sphere adult head */}
            {Array.isArray(spareChargePakInfo) && spareChargePakInfo.length > 0 && (
              <>
                {/* sphere adult body */}
                <tbody className="odd-even-row border-b-blue">
                  {spareChargePakInfo.map((SpareChargItem, SpareCharKey) => (
                    <>
                      <tr className="">
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          Spare Adult
                        </td>
                        <td
                          colSpan={2}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          {print_battery_part(
                            SpareChargItem?.charge_pak_part
                          )}
                        </td>
                        <td
                          colSpan={2}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          {SpareChargItem?.charge_pak_uiid}
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {
                            SpareChargItem?.battery_expiration === 'unknown' ?
                              'unknown' :
                              RenderDate(
                                SpareChargItem?.battery_expiration,
                                true
                              )
                          }
                        </td>
                        <td
                          colSpan={2}
                          className="border border-2 py-1 px-2 bg-tbl-border"
                        >
                          {SpareChargItem?.battery_lot}
                        </td>
                      </tr>

                      {/* <tr className="">
                          <th
                            scope="col"
                            width={"15%"}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          ></th>
                          <th
                            scope="col"
                            width={"15%"}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            Pad 1 Part #
                          </th>
                          <th
                            scope="col"
                            width={"15%"}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            Pad 1 Expiration
                          </th>
                          <th
                            scope="col"
                            width={"15%"}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            Pad 1 Lot{" "}
                          </th>
                          <th
                            scope="col"
                            width={"15%"}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            Pad 2 Part #
                          </th>
                          <th
                            scope="col"
                            width={"15%"}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            Pad 2 Expiration
                          </th>
                          <th
                            scope="col"
                            colSpan={2}
                            className="border border-2 py-1 px-2 bg-tbl-border"
                          >
                            Pad 2 Lot{" "}
                          </th>
                        </tr> */}

                      {/* <tr className="">
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            <span></span>
                          </td>
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            {print_aed_pad_type(SpareChargItem?.pad_1_part)
                              ? print_aed_pad_type(SpareChargItem?.pad_1_part)
                              : "NA"}
                          </td>
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            {RenderDate(SpareChargItem?.pad_1_expiration, true)
                              ? RenderDate(
                                  SpareChargItem?.pad_1_expiration,
                                  true
                                )
                              : "NA"}
                          </td>
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            {SpareChargItem?.pad_1_lot
                              ? SpareChargItem?.pad_1_lot
                              : "NA"}
                          </td>
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            {print_aed_pad_type(SpareChargItem?.pad_2_part) ||
                              "NA"}
                          </td>
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            {RenderDate(
                              SpareChargItem?.pad_2_expiration,
                              true
                            ) || "NA"}
                          </td>
                          <td
                            colSpan={2}
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border"
                          >
                            {SpareChargItem?.pad_2_lot || "NA"}
                          </td>
                        </tr> */}
                    </>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>
      )}

      {/* Pad Information */}
      <div className="account-info pb-4">
        {/* heading */}
        {
          // 	(adultPadInfo?.length > 0 &&
          // 	spareAdultPadInfo?.length > 0 &&
          // 	pediatricPadInfo?.length > 0 &&
          // 	sparePadricPadInfo?.length > 0 )
          // &&
          // 	(
          // 	adultPadInfo[ 0 ].adult_pad_part === ""
          // &&  spareAdultPadInfo[0]?.spare_adult_pad_part === ""
          // &&  pediatricPadInfo[0]?.pediatric_pad_part === ""
          // &&  sparePadricPadInfo[0]?.spare_pediatric_pad_part === ""
          // 	)
          // Fixing the error
          (adultPadInfo?.length > 0 &&
            adultPadInfo?.[0]?.adult_pad_part != "") ||
            chargePakInfo?.charge_pak_part ||
            (spareAdultPadInfo?.length > 0 &&
              spareAdultPadInfo?.[0]?.spare_adult_pad_part != "") ||
            (pediatricPadInfo?.length > 0 &&
              pediatricPadInfo?.[0]?.pediatric_pad_part != "") ||
            (sparePadricPadInfo?.length > 0 &&
              sparePadricPadInfo?.[0]?.spare_pediatric_pad_part != "") ? (
            <Box className="text-left d-flex align-items-center">
              <h4 className="heading">Pad Information</h4>
              {/* <img src={"/Baby.svg"} width={20} /> */}
              {aedDetails?.pediatric_key_child ? (
                ""
              ) : (
                <img src={"/NOPED.svg"} width={20} />
              )}
              {aedDetails?.pediatric_key ? (
                <p className="m-0">
                  &nbsp;
                  <img src={"/Baby.svg"} width={20} />
                  <img src="/PedKey.svg" width={16} />
                </p>
              ) : (
                <>
                  &nbsp;
                  {/* <img src={"/NOPED.svg"} width={20} /> */}
                </>
              )}
            </Box>
          ) : (
            ""
          )
        }
        {
          // (adultPadInfo[ 0 ]?.adult_pad_part === ""
          // && spareAdultPadInfo[0]?.spare_adult_pad_part === ""
          // &&  pediatricPadInfo[0]?.pediatric_pad_part === ""
          // && sparePadricPadInfo[0]?.spare_pediatric_pad_part === "")
          (adultPadInfo?.length > 0 &&
            adultPadInfo?.[0]?.adult_pad_part != "") ||
            chargePakInfo?.charge_pak_part ||
            (spareAdultPadInfo?.length > 0 &&
              spareAdultPadInfo?.[0]?.spare_adult_pad_part != "") ||
            (pediatricPadInfo?.length > 0 &&
              pediatricPadInfo?.[0]?.pediatric_pad_part != "") ||
            (sparePadricPadInfo?.length > 0 &&
              sparePadricPadInfo?.[0]?.spare_pediatric_pad_part != "") ? (
            <table className="w-100">
              <thead>
                <tr className="">
                  <th
                    scope="col"
                    className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                  >
                    Pad Type
                  </th>
                  <th
                    scope="col"
                    className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                  >
                    Part #{" "}
                  </th>
                  <th
                    scope="col"
                    className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                  >
                    Expiration Date
                  </th>
                  <th
                    scope="col"
                    className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                  >
                    Pad Lot{" "}
                  </th>
                  <th
                    scope="col"
                    className="border border-2 py-1 px-2 bg-tbl-border border-t-blue"
                  >
                    Pad UDI
                  </th>
                </tr>
              </thead>
              {/* second row */}
              <tbody className="odd-even-row border-b-blue">

                {filteredAdultPadInfo?.map(
                  (API, i) =>
                    API.section_name === "adult_pad_info" &&
                    (API.pad_type_id === "" &&
                      API.pad_expiration === "" &&
                      API.pad_lot === "" &&
                      API.pad_udi === "" ? (
                      ""
                    ) : (
                      <tr className="" key={i}>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {/* Main Adult */}
                          {API.is_spare ? "Spare Adult" : "Main Adult"}
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {print_aed_pad_type(API?.pad_type_id)}
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {/* {RenderDate(FormatDate(API?.pad_expiration), 1)} */}
                          {
                            API?.pad_expiration === 'unknown' ?
                              'unknown' :
                              RenderDate(FormatDate(API?.pad_expiration), 1)
                          }
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {API?.pad_lot}
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border">
                          {API?.pad_udi}
                        </td>
                      </tr>
                    ))
                )}

                {chargePakInfo?.charge_pak_part &&
                  chargePakInfo?.spare_pediatric_pad_part != "" && (
                    chargePakInfo?.pad_1_part === "" &&
                      chargePakInfo?.pad_1_expiration === "" &&
                      chargePakInfo?.pad_1_lot === "" ? "" : (
                      <>
                        <tr className="">
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            Main Adult
                          </td>
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            {print_aed_pad_type(chargePakInfo?.pad_1_part) ||
                              "NA"}
                          </td>
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            {/* {RenderDate(
                              FormatDate(chargePakInfo?.pad_1_expiration),
                              1
                            ) || "NA"} */}
                            {
                              chargePakInfo?.pad_1_expiration === 'unknown' ?
                                'unknown' :
                                RenderDate(
                                  FormatDate(chargePakInfo?.pad_1_expiration),
                                  1
                                )
                            }
                          </td>
                          <td
                            style={{
                              minHeight: "10px",
                              maxWidth: "200px",
                              overflowWrap: "break-word",
                            }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            {chargePakInfo?.pad_1_lot || "NA"}
                          </td>
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            NA
                          </td>
                        </tr>
                      </>)
                  )}

                {chargePakInfo?.charge_pak_part &&
                  chargePakInfo?.spare_pediatric_pad_part != "" && (
                    chargePakInfo?.pad_2_part === "" &&
                      chargePakInfo?.pad_2_expiration === "" &&
                      chargePakInfo?.pad_2_lot === "" ? "" : (
                      <>
                        <tr>
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            Main Adult
                          </td>
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            {print_aed_pad_type(chargePakInfo?.pad_2_part) ||
                              "NA"}
                          </td>
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            {/* {RenderDate(
                              FormatDate(chargePakInfo?.pad_2_expiration),
                              1
                            ) || "NA"} */}
                            {
                              chargePakInfo?.pad_2_expiration === 'unknown' ?
                                'unknown' :
                                RenderDate(
                                  FormatDate(chargePakInfo?.pad_2_expiration),
                                  1
                                )
                            }
                          </td>
                          <td
                            style={{
                              minHeight: "10px",
                              maxWidth: "200px",
                              overflowWrap: "break-word",
                            }}
                            className="border border-2 py-1 px-2 bg-tbl-border"
                          >
                            {chargePakInfo?.pad_2_lot || "NA"}
                          </td>
                          <td
                            style={{ minHeight: "10px" }}
                            className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                          >
                            NA
                          </td>
                        </tr>
                      </>)
                  )}

                {spareAdultPadInfo?.map(
                  (SAPI, i) =>
                    SAPI.section_name === "spare_adult_pad_info" &&
                    (SAPI.pad_type_id === "" &&
                      SAPI.pad_expiration === "" &&
                      SAPI.pad_lot === "" &&
                      SAPI.pad_udi === "" ? (
                      ""
                    ) : (
                      <tr className="" kye={i}>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          Spare Adult
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {print_aed_pad_type(SAPI?.pad_type_id)}
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {/* {RenderDate(FormatDate(SAPI?.pad_expiration), 1)} */}
                          {
                            SAPI?.pad_expiration === 'unknown' ?
                              'unknown' :
                              RenderDate(FormatDate(SAPI?.pad_expiration), 1)
                          }
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {SAPI?.pad_lot}
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border">
                          {SAPI?.pad_udi}
                        </td>
                      </tr>
                    ))
                )}

                {spareChargePakInfo?.map((SpareChargItem, SpareCharKey) => (
                  SpareChargItem?.pad_1_part === "" &&
                    SpareChargItem?.pad_1_expiration === "" &&
                    SpareChargItem?.pad_1_lot === "" ? "" : (
                    <>
                      <tr key={SpareCharKey} className="">
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          <span>Spare Adult</span>
                        </td>
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          {print_aed_pad_type(SpareChargItem?.pad_1_part)
                            ? print_aed_pad_type(SpareChargItem?.pad_1_part)
                            : "NA"}
                        </td>
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          {/* {FormatDate(SpareChargItem?.pad_1_expiration)
                            ? RenderDate(
                              FormatDate(SpareChargItem?.pad_1_expiration),
                              1
                            )
                            : "NA"} */}
                          {
                            SpareChargItem?.pad_1_expiration === 'unknown' ?
                              'unknown' :
                              RenderDate(
                                FormatDate(SpareChargItem?.pad_1_expiration),
                                1
                              )
                          }
                        </td>
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          {SpareChargItem?.pad_1_lot
                            ? SpareChargItem?.pad_1_lot
                            : "NA"}
                        </td>
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          NA
                        </td>
                      </tr>
                    </>)
                ))}

                {spareChargePakInfo?.map((SpareChargItem, SpareCharKey) => (
                  SpareChargItem?.pad_2_part === "" &&
                    SpareChargItem?.pad_2_expiration === "" &&
                    SpareChargItem?.pad_2_lot === "" ? "" : (
                    < >
                      <tr key={SpareCharKey}>
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          <span>Spare Adult</span>
                        </td>
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          {print_aed_pad_type(SpareChargItem?.pad_2_part) || "NA"}
                        </td>
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          {/* {RenderDate(
                            FormatDate(SpareChargItem?.pad_2_expiration),
                            1
                          ) || "NA"} */}
                          {
                            SpareChargItem?.pad_2_expiration === 'unknown' ?
                              'unknown' :
                              RenderDate(
                                FormatDate(SpareChargItem?.pad_2_expiration),
                                1
                              )
                          }
                        </td>
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border"
                        >
                          {SpareChargItem?.pad_2_lot || "NA"}
                        </td>
                        <td
                          style={{ minHeight: "10px" }}
                          className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                        >
                          NA
                        </td>
                      </tr>
                    </>)
                ))}

                {/* {spareChargePakInfo?.map((SpareChargItem, SpareCharKey) => (
                  <>
                    <tr>
                      <td
                        style={{ minHeight: "10px" }}
                        className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                      >
                        <span>Spare Adult</span>
                      </td>
                      <td
                        style={{ minHeight: "10px" }}
                        className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                      >
                        {print_aed_pad_type(SpareChargItem?.pad_2_part) || "NA"}
                      </td>
                      <td
                        style={{ minHeight: "10px" }}
                        className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                      >
                        {RenderDate(SpareChargItem?.pad_2_expiration, true) ||
                          "NA"}
                      </td>
                      <td
                        style={{ minHeight: "10px" }}
                        className="border border-2 py-1 px-2 bg-tbl-border"
                      >
                        {SpareChargItem?.pad_2_lot || "NA"}
                      </td>
                      <td
                        style={{ minHeight: "10px" }}
                        className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                      >
                        NA
                      </td>
                    </tr>
                  </>
                ))} */}

                {pediatricPadInfo &&
                  pediatricPadInfo?.map(
                    (ppitem, i) =>
                      ppitem.section_name === "pediatric_pad_info" &&
                      (ppitem.pad_type_id === "" &&
                        ppitem.pad_expiration === "" &&
                        ppitem.pad_lot === "" &&
                        ppitem.pad_udi === "" ? (
                        ""
                      ) : (
                        <tr className="" key={i}>
                          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                            Pediatric
                          </td>
                          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                            {print_aed_pad_type(ppitem?.pad_type_id)}
                          </td>
                          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                            {/* {ppitem?.pad_expiration === 'unknown' ? 'unknown' : RenderDate(FormatDate(ppitem?.pad_expiration), 1)} */}
                            {
                              ppitem?.pad_expiration === 'unknown' ?
                                'unknown' :
                                RenderDate(FormatDate(ppitem?.pad_expiration), 1)
                            }
                          </td>
                          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                            {ppitem?.pad_lot}
                          </td>
                          <td className="border border-2 py-1 px-2 bg-tbl-border">
                            {ppitem?.pad_udi}
                          </td>
                        </tr>
                      ))
                  )}

                {sparePadricPadInfo?.map(
                  (SPPi, i) =>
                    SPPi.section_name === "spare_padric_pad_info" &&
                    (SPPi.pad_type_id === "" &&
                      SPPi.pad_expiration === "" &&
                      SPPi.pad_lot === "" &&
                      SPPi.pad_udi === "" ? (
                      ""
                    ) : (
                      <tr className="" key={i}>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          Spare Pediatric
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {print_aed_pad_type(SPPi?.pad_type_id)}
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {/* {RenderDate(FormatDate(SPPi?.pad_expiration), 1)} */}
                          {
                            SPPi?.pad_expiration === 'unknown' ?
                              'unknown' :
                              RenderDate(FormatDate(SPPi?.pad_expiration), 1)
                          }
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {SPPi?.pad_lot}
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border">
                          {SPPi?.pad_udi}
                        </td>
                      </tr>
                    ))
                )}

                {pediatricPadInfo &&
                  pediatricPadInfo?.map(
                    (ppitem, i) =>
                      ppitem.section_name === "adult_pad_pak_info" &&
                      (ppitem.pad_type_id === "" &&
                        ppitem.pad_expiration === "" &&
                        ppitem.pad_lot === "" &&
                        ppitem.pad_udi === "" ? (
                        ""
                      ) : (
                        <tr className="" key={i}>
                          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                            Pad Pak
                          </td>
                          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                            {print_aed_pad_type(ppitem?.pad_type_id)}
                          </td>
                          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                            {/* {RenderDate(FormatDate(ppitem?.pad_expiration), 1)} */}
                            {
                              ppitem?.pad_expiration === 'unknown' ?
                                'unknown' :
                                RenderDate(FormatDate(ppitem?.pad_expiration), 1)
                            }
                          </td>
                          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                            {ppitem?.pad_lot}
                          </td>
                          <td className="border border-2 py-1 px-2 bg-tbl-border">
                            {ppitem?.pad_udi}
                          </td>
                        </tr>
                      ))
                  )}

                {sparePadricPadInfo?.map(
                  (SPPi, i) =>
                    SPPi.section_name === "spare_adult_pad_pak_info" &&
                    (SPPi.pad_type_id === "" &&
                      SPPi.pad_expiration === "" &&
                      SPPi.pad_lot === "" &&
                      SPPi.pad_udi === "" ? (
                      ""
                    ) : (
                      <tr className="" key={i}>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          Spare Pad-Pak
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {print_aed_pad_type(SPPi?.pad_type_id)}
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {/* {RenderDate(FormatDate(SPPi?.pad_expiration), 1)} */}
                          {
                            SPPi?.pad_expiration === 'unknown' ?
                              'unknown' :
                              RenderDate(FormatDate(SPPi?.pad_expiration), 1)
                          }
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {SPPi?.pad_lot}
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border">
                          {SPPi?.pad_udi}
                        </td>
                      </tr>
                    ))
                )}

                {pediatricPadInfo &&
                  pediatricPadInfo?.map(
                    (ppitem, i) =>
                      ppitem.section_name === "pediatric_pak_pad_info" &&
                      (ppitem.pad_type_id === "" &&
                        ppitem.pad_expiration === "" &&
                        ppitem.pad_lot === "" &&
                        ppitem.pad_udi === "" ? (
                        ""
                      ) : (
                        <tr className="" key={i}>
                          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                            Pediatric Pak
                          </td>
                          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                            {print_aed_pad_type(ppitem?.pad_type_id)}
                          </td>
                          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                            {/* {RenderDate(FormatDate(ppitem?.pad_expiration), 1)} */}
                            {
                              ppitem?.pad_expiration === 'unknown' ?
                                'unknown' :
                                RenderDate(FormatDate(ppitem?.pad_expiration), 1)
                            }
                          </td>
                          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                            {ppitem?.pad_lot}
                          </td>
                          <td className="border border-2 py-1 px-2 bg-tbl-border">
                            {ppitem?.pad_udi}
                          </td>
                        </tr>
                      ))
                  )}

                {sparePadricPadInfo?.map(
                  (SPPi, i) =>
                    SPPi.section_name === "spare_padric_pak_pad" &&
                    (SPPi.pad_type_id === "" &&
                      SPPi.pad_expiration === "" &&
                      SPPi.pad_lot === "" &&
                      SPPi.pad_udi === "" ? (
                      ""
                    ) : (
                      <tr className="" key={i}>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          Spare Pediatric-Pak
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {print_aed_pad_type(SPPi?.pad_type_id)}
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {/* {RenderDate(FormatDate(SPPi?.pad_expiration), 1)} */}
                          {
                            SPPi?.pad_expiration === 'unknown' ?
                              'unknown' :
                              RenderDate(FormatDate(SPPi?.pad_expiration), 1)
                          }
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                          {SPPi?.pad_lot}
                        </td>
                        <td className="border border-2 py-1 px-2 bg-tbl-border">
                          {SPPi?.pad_udi}
                        </td>
                      </tr>
                    ))
                )}
                {/* pediatric_pak_pad_info */}

                {/* adult_pad_pak_info */}
              </tbody>
            </table>
          ) : (
            ""
          )
        }
        {/* table */}
      </div>

      {adultPadPakData === "" &&
        spareAdultPadPakData === "" &&
        padiatricPadPakData === "" &&
        sparePadiatricPadPakData === "" ? (
        <>
          {/* Pad Pak Information */}
          <div className="account-info pb-4">
            {/* heading */}

            <Box className="text-left">
              <h4 className="heading">Pad Pak Information</h4>
            </Box>

            <table className="w-100">
              <thead>
                <tr className="">
                  <th
                    scope="col"
                    className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                  >
                    Pad Type
                  </th>
                  <th
                    scope="col"
                    className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                  >
                    Part #{" "}
                  </th>
                  <th
                    scope="col"
                    className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                  >
                    Expiration Date
                  </th>
                  <th
                    scope="col"
                    className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                  >
                    Pad Lot{" "}
                  </th>
                  <th
                    scope="col"
                    className="border border-2 py-1 px-2 bg-tbl-border border-t-blue"
                  >
                    Pad UDI
                  </th>
                </tr>
              </thead>
              {/* second row */}
              <tbody className="odd-even-row border-b-blue">
                {adultPadPakData &&
                  CheckDate(adultPadPakData.pad_expiration) ? (
                  <>
                    {/* // 			(adultPadPakData === null &&
    // adultPadPakData.pad_type_id === "" &&
    // adultPadPakData.pad_expiration === "0000-00-00" &&
    // adultPadPakData.pad_lot === "" &&
    // adultPadPakData.pad_udi === "") ? "" : ( <> */}
                    <tr className="">
                      <td
                        width={"25%"}
                        className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"
                      >
                        Adult Pad Pak
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {print_aed_pad_type(adultPadPakData.pad_type_id)}
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {/* {RenderDate(
                          FormatDate(adultPadPakData.pad_expiration),
                          1
                        )} */}
                        {
                          adultPadPakData.pad_expiration === 'unknown' ?
                            'unknown' :
                            RenderDate(
                              FormatDate(adultPadPakData.pad_expiration),
                              1
                            )
                        }
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {adultPadPakData.pad_lot}
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border">
                        {adultPadPakData.pad_udi}
                      </td>
                    </tr>
                  </>
                ) : (
                  ""
                )}

                {spareAdultPadPakData &&
                  CheckDate(spareAdultPadPakData.pad_expiration) ? (
                  <>
                    {/* // (spareAdultPadPakData.pad_type_id === "" &&
    // (spareAdultPadPakData.pad_expiration === "0000-00-00" || spareAdultPadPakData.pad_expiration === "") &&
    // spareAdultPadPakData.pad_lot === "" &&
    // spareAdultPadPakData.pad_udi === "")) ? "" : (<> */}
                    <tr className="">
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        Spare Adult Pad Pak
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {print_aed_pad_type(spareAdultPadPakData?.pad_type_id)}
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {/* {RenderDate(
                          FormatDate(spareAdultPadPakData?.pad_expiration),
                          1
                        )} */}
                        {
                          spareAdultPadPakData?.pad_expiration === 'unknown' ?
                            'unknown' :
                            RenderDate(
                              FormatDate(spareAdultPadPakData?.pad_expiration),
                              1
                            )
                        }
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {spareAdultPadPakData?.pad_lot}
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border">
                        {spareAdultPadPakData?.pad_udi}
                      </td>
                    </tr>
                  </>
                ) : (
                  ""
                )}

                {padiatricPadPakData &&
                  CheckDate(padiatricPadPakData.pad_expiration) ? (
                  <>
                    {/* ((padiatricPadPakData === "" && padiatricPadPakData === null) &&(padiatricPadPakData.pad_type_id === "" || padiatricPadPakData.pad_type_id === null) && 
					(padiatricPadPakData.pad_expiration === "0000-00-00" || padiatricPadPakData.pad_expiration === null) &&
					(padiatricPadPakData.pad_lot === "" || padiatricPadPakData.pad_lot === null) &&
					(padiatricPadPakData.pad_udi === "" || padiatricPadPakData.pad_udi === null )) ? "" : ( <> */}
                    <tr className="">
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        Pediatric Pad Pak
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {print_aed_pad_type(padiatricPadPakData?.pad_type_id)}
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {/* {RenderDate(
                          FormatDate(padiatricPadPakData?.pad_expiration),
                          1
                        )} */}
                        {
                          padiatricPadPakData?.pad_expiration === 'unknown' ?
                            'unknown' :
                            RenderDate(
                              FormatDate(padiatricPadPakData?.pad_expiration),
                              1
                            )
                        }
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {padiatricPadPakData?.pad_lot}
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border">
                        {padiatricPadPakData?.pad_udi}
                      </td>
                    </tr>
                  </>
                ) : (
                  ""
                )}

                {sparePadiatricPadPakData &&
                  CheckDate(sparePadiatricPadPakData.pad_expiration) ? (
                  <>
                    {/* // ((sparePadiatricPadPakData === "" && sparePadiatricPadPakData === null) &&(sparePadiatricPadPakData.pad_type_id === "" || sparePadiatricPadPakData.pad_type_id === null) && 
// 					(sparePadiatricPadPakData.pad_expiration === "0000-00-00" || sparePadiatricPadPakData.pad_expiration === null) &&
// 					(sparePadiatricPadPakData.pad_lot === "" || sparePadiatricPadPakData.pad_lot === null) &&
// 					(sparePadiatricPadPakData.pad_udi === "" || sparePadiatricPadPakData.pad_udi === null )) ? "" : ( <> */}
                    <tr className="">
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        Spare Pediatric Pad Pak
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {print_aed_pad_type(
                          sparePadiatricPadPakData?.pad_type_id
                        )}
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {/* {RenderDate(
                          FormatDate(sparePadiatricPadPakData?.pad_expiration),
                          1
                        )} */}
                        {
                          sparePadiatricPadPakData?.pad_expiration === 'unknown' ?
                            'unknown' :
                            RenderDate(
                              FormatDate(sparePadiatricPadPakData?.pad_expiration),
                              1
                            )
                        }
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {sparePadiatricPadPakData?.pad_lot}
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border">
                        {sparePadiatricPadPakData?.pad_udi}
                      </td>
                    </tr>
                  </>
                ) : (
                  ""
                )}
              </tbody>
            </table>
            {/* table */}
          </div>
        </>
      ) : (
        ""
      )}

      {/* gateway Information */}
      {gatewayInfo?.installed ? (
        <div className="account-info py-4">
          {/* heading */}
          <Box className="text-left">
            <h4 className="heading">Gateway Information</h4>
          </Box>

          <table className="w-100">
            <thead>
              <tr className="">
                <th
                  scope="col"
                  width="15%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Connected
                </th>
                <th
                  scope="col"
                  width="15%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Serial #
                </th>
                <th
                  scope="col"
                  width="15%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Mac Address
                </th>
                <th
                  scope="col"
                  width="15%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Battery Install Date
                </th>
                <th
                  scope="col"
                  width="55%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue"
                >
                  Battery Expiration
                </th>
              </tr>
            </thead>
            {/* second row */}
            <tbody className="odd-even-row border-b-blue">
              <tr className="">
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                  {gatewayInfo?.connected == 1 ? (
                    <CheckIcon sx={{ color: "#00FF00" }} />
                  ) : (
                    <CloseIcon color={"error"} />
                  )}
                </td>
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                  {gatewayInfo?.gateway_serial}
                </td>
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                  {gatewayInfo?.gateway_Mmac_address}
                </td>
                <td className="border border-2 py-1 px-2 bg-tbl-border">
                  {RenderDate(gatewayInfo?.battery_install_date, 0)}
                </td>
                <td className="border border-2 py-1 px-2 bg-tbl-border">
                  {/* {RenderDate(gatewayInfo?.expiry_date, 0)} */}
                  {
                    gatewayInfo?.expiry_date === 'unknown' ?
                      'unknown' :
                      RenderDate(gatewayInfo?.expiry_date, 0)
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}

      {/* Pad Pak Information */}
      {aedDetails.RMS_toggle === 1 && (
        <>
          {rmsinfo?.map(
            (item, index) =>
              item?.mac_address != "" && (
                <div className="account-info pb-4" key={index}>
                  {/* heading */}
                  <Box className="text-left">
                    <h4 className="heading"> RMS Information</h4>
                  </Box>

                  <table className="w-100 border border-l-blue border-r-blue">
                    <thead>
                      <tr className="">
                        <th
                          scope="col"
                          width="15%"
                          className="border border-2 py-1 px-2 bg-tbl-border border-l-blue border-t-blue border-r-blue"
                        >
                          Brand
                        </th>
                      </tr>
                    </thead>

                    {rmsinfo.map((innerItem, innerIndex) => (
                      <tbody
                        className="odd-even-row border-b-blue"
                        key={innerIndex}
                      >
                        <tr className="">
                          {rmsBrandInfoId.map((i, ind) => (
                            <td
                              className="border border-2 py-1 px-2 bg-tbl-border border-l-blue border-r-blue"
                              key={ind}
                            >
                              {handleRmsBrand(i.rms_brand - 1)}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
              )
          )}
        </>
      )}

      {rmsinfo?.map(
        (item, index) =>
          item?.mac_address != "" && (
            <div className="account-info pb-4" key={index}>
              {/* heading */}
              <Box className="text-left">
                <h4 className="heading">Built In RMS Information</h4>
              </Box>

              <table className="w-100 border border-l-blue border-r-blue">
                <thead>
                  <tr className="">
                    <th
                      scope="col"
                      width="15%"
                      className="border border-2 py-1 px-2 bg-tbl-border border-l-blue border-t-blue border-r-blue"
                    >
                      Brand
                    </th>
                    <th
                      scope="col"
                      width="15%"
                      className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                    >
                      Connected
                    </th>
                    <th
                      scope="col"
                      width="15%"
                      className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                    >
                      Mac Address
                    </th>
                  </tr>
                </thead>

                {rmsinfo.map((innerItem, innerIndex) => (
                  <tbody
                    className="odd-even-row border-b-blue"
                    key={innerIndex}
                  >
                    <tr className="">
                      {rmsBrandInfoId.map((i, ind) => (
                        <td
                          className="border border-2 py-1 px-2 bg-tbl-border border-l-blue border-r-blue"
                          key={ind}
                        >
                          {handleRmsBrand(i.rms_brand)}
                        </td>
                      ))}
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {innerItem?.connected === false ? (
                          <CloseIcon color={"error"} />
                        ) : (
                          <CheckIcon sx={{ color: "#00FF00" }} />
                        )}
                      </td>
                      <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {innerItem?.mac_address}
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          )
      )}
      {CheckAEdCheckers(aedDetails.assign_user) ? (
        <>
          
        </>
      ) : (
        ""
      )}
      {/* // : "" } */}

      {/* outOfService Information */}
      {out_of_service_toggle && out_of_service_toggle == '1' ? (<>
        {/* {outOfServiceInfo?.replaced_serial ||
      outOfServiceInfo?.date_sent_to_manufacturer ||
      outOfServiceInfo?.loaner_rental_serial ? ( */}
        <div className="account-info py-4">
          {/* heading */}
          <Box className="text-left">
            <h4 className="heading">Out of Service Information</h4>
          </Box>

          <table className="w-100">
            <thead>
              <tr className="">
                <th
                  scope="col"
                  width="5%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Replacing
                </th>
                <th
                  scope="col"
                  width="25%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Replaced Serial #
                </th>
                <th
                  scope="col"
                  width="10%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                >
                  Date Sent To Manufacturer
                </th>
                <th
                  scope="col"
                  width="25%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue"
                >
                  Loaner Rental Serial
                </th>
                <th
                  scope="col"
                  width="35%"
                  className="border border-2 py-1 px-2 bg-tbl-border border-t-blue"
                >
                  Reason
                </th>
              </tr>
            </thead>
            {/* second row */}
            <tbody className="odd-even-row border-b-blue">
              <tr className="">
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                  {outOfServiceInfo[0]?.not_replacing == 1 ||
                    outOfServiceInfo[0]?.not_replacing ? (
                    <CheckIcon sx={{ color: "#00FF00" }} />
                  ) : (
                    <CloseIcon color={"error"} />
                  )}
                </td>
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                  {outOfServiceInfo[0]?.replaced_serial_name}
                </td>
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                  {/* { outOfServiceInfo?.date_sent_to_manufacturer ? (
										<Moment
											date={ outOfServiceInfo?.date_sent_to_manufacturer }
											format={ 'MM/DD/YYYY' }
										/>
									) : (
										""
									) } */}
                  {/* {RenderDate(
                    outOfServiceInfo?.date_sent_to_manufacturer,
                    false
                  )} */}
                  {
                    outOfServiceInfo[0]?.date_sent_to_manufacturer === 'unknown' ?
                      'unknown' :
                      RenderDate(
                        outOfServiceInfo[0]?.date_sent_to_manufacturer,
                        false
                      )
                  }
                </td>
                <td className="border border-2 py-1 px-2 bg-tbl-border">
                  {outOfServiceInfo[0]?.loaner_rental_serial_name}
                </td>
                <td className="border border-2 py-1 px-2 bg-tbl-border">
                  {outOfServiceInfo[0]?.reason}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>) : (
        ""
      )}

      {/* Coordinator Information */}
      <Box>
        <h4 className="heading mt-3">Coordinator Information</h4>
        <table className="border w-100 last-table-border-hide last-r-border-none">
          <tbody>
            <tr className="">
              {cordinatorInfo.map((CoorD, index) => (
                <th
                  className="border py-1 px-2 bg-tbl-border border-t-blue border-r-blue "
                  key={index}
                >
                  {CoorD.title}
                </th>
              ))}
            </tr>
            <tr>
              {cordinatorInfo.map((CoorD, i1) => (
                <td className={linkTabsPermission(userPermission) ? "border py-1 px-2 border-r-blue link" : "border py-1 px-2 border-r-blue"}
                 key={i1}>
                  {" "}
                  P:{" "}

                  <ContactName 
                          url={'/user/' + aedDetails?.account_id + '/contact-details/' + CoorD?.arr?.[ 0 ]?.contact_id || CoorD?.arr?.[ 1 ]?.contact_id }

                              locationState={
                                {
                                  state: {
                                    siteTitle: "Contact : " + CoorD?.arr?.[ 0 ]?.primary || CoorD?.arr?.[ 1 ]?.primary,
                                    editUrl: "/account/contact-details-edit/" + CoorD?.arr?.[ 0 ]?.contact_id || CoorD?.arr?.[ 1 ]?.contact_id,
                                    deleteUrl: "/account/contact-details-edit/" + CoorD?.arr?.[ 0 ]?.contact_id || CoorD?.arr?.[ 1 ]?.contact_id
                                  }
                                }
                               }
                              name={ CoorD?.arr?.[ 0 ]?.primary || CoorD?.arr?.[ 1 ]?.primary }

                        />
                  {/* <span
                    onClick={() => {
                      navigate(
                        "/account/" +
                        aedDetails?.account_id +
                        "/contact-details/" +
                        CoorD?.arr?.[0]?.contact_id ||
                        CoorD?.arr?.[1]?.contact_id,
                        {
                          state: {
                            siteTitle:
                              "Contact : " + CoorD?.arr?.[0]?.primary ||
                              CoorD?.arr?.[1]?.primary,
                            editUrl:
                              "/account/contact-details-edit/" +
                              CoorD?.arr?.[0]?.contact_id ||
                              CoorD?.arr?.[1]?.contact_id,
                            deleteUrl:
                              "/account/contact-details-edit/" +
                              CoorD?.arr?.[0]?.contact_id ||
                              CoorD?.arr?.[1]?.contact_id,
                          },
                        }
                      );
                    }}
                    className="link"
                  >
                    {" "}
                    {CoorD?.arr?.[0]?.primary || CoorD?.arr?.[1]?.primary}
                  </span> */}
                </td>
              ))}
            </tr>

            <tr>
              {cordinatorInfo.map((CoorD, i1) => (
                <td
                  className={linkTabsPermission(userPermission) ? " border bg-tbl-border py-1 px-2 border-b-blue border-r-blue link" : 
                    " border bg-tbl-border py-1 px-2 border-b-blue border-r-blue"
                  }
                  key={i1}
                >
                  {" "}
                  B:

                  <ContactName 
                          url={linkTabsPermission(userPermission) && 
                            "/user/" +
                            aedDetails?.account_id +
                            "/contact-details/" +
                            CoorD?.arr?.[2]?.contact_id ||
                            CoorD?.arr?.[2]?.contact_id }
                              locationState={
                                {
                                  state: {
                                    siteTitle:
                                      "Contact : " + CoorD?.arr?.[2]?.backup ||
                                      CoorD?.arr?.[2]?.backup,
                                    editUrl:
                                      "/account/contact-details-edit/" +
                                      CoorD?.arr?.[2]?.contact_id ||
                                      CoorD?.arr?.[2]?.contact_id,
                                    deleteUrl:
                                      "/account/contact-details-edit/" +
                                      CoorD?.arr?.[2]?.contact_id ||
                                      CoorD?.arr?.[2]?.contact_id,
                                  },
                                }
                               }
                              name={CoorD?.arr?.[1]?.backup || CoorD?.arr?.[1]?.backup}

                        />
                  {/* <span
                    onClick={() => {
                      navigate(
                        "/account/" +
                        aedDetails?.account_id +
                        "/contact-details/" +
                        CoorD?.arr?.[2]?.contact_id ||
                        CoorD?.arr?.[2]?.contact_id,
                        {
                          state: {
                            siteTitle:
                              "Contact : " + CoorD?.arr?.[2]?.backup ||
                              CoorD?.arr?.[2]?.backup,
                            editUrl:
                              "/account/contact-details-edit/" +
                              CoorD?.arr?.[2]?.contact_id ||
                              CoorD?.arr?.[2]?.contact_id,
                            deleteUrl:
                              "/account/contact-details-edit/" +
                              CoorD?.arr?.[2]?.contact_id ||
                              CoorD?.arr?.[2]?.contact_id,
                          },
                        }
                      );
                    }}
                    className="link"
                  >
                    {" "}
                    {CoorD?.arr?.[1]?.backup || CoorD?.arr?.[1]?.backup}
                  </span> */}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Box>

      <div style={{ marginTop: "70px", marginBottom: "10px" }}>
              <Box
                className="d-flex justify-content-evenly align-items-center"
                style={{ gap: "50px" }}
              >
                <p>
                  Created Date:{" "}
                  {aedDetails?.created_date ? (
                    <Moment
                      date={aedDetails?.created_date}
                      format={"MM/DD/YYYY h:mm A"}
                    />
                  ) : (
                    ""
                  )}
                </p>
                <p>Created By: {aedDetails?.created_by}</p>
                <p>
                  Modified Date:{" "}
                  {aedDetails?.modified_date ? (
                    <Moment
                      date={aedDetails?.modified_date}
                      format={"MM/DD/YYYY h:mm A"}
                    />
                  ) : (
                    ""
                  )}{" "}
                </p>
                <p>Modified By: {aedDetails?.modified_by}</p>
                <p>
                  Last Touch Date:{" "}
                  {aedDetails?.last_check
                    ? FormatDate(aedDetails?.last_check)
                    : ""}
                </p>
                {/* <Moment date={aedDetails?.last_check} format={'DD-MM-YYYY'} /> */}
              </Box>
            </div>
    </div>
  );
}

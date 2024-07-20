import React from "react";
import Container from "react-bootstrap/Container";
import { useEffect, useState } from "react";
import { AedTabs, UserAedTabs } from "../../utils";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AED_IMG_BASE, CallGETAPI } from "../../helper/API";
import {
  AEDGroupBYCoordinatorInfo,
  BatteryTypebyModel,
  GetAedBrands,
  GetAedModelsByBrandId,
  GetAedSumModelsById,
  GroupBYCoordinatorInfo,
} from "../../helper/BasicFn";

import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Notes from "../../pages/accounts/AedMain/tabs/Notes";
import SubHeadingOther from "../../components/header/SubHeadingOther";
import Loading from "../../pages/accounts/Loading";
import Moment from "react-moment";
import OutOfServiceModal from "../../components/modals/outOfServiceModal/outOfServiceModal";
import { useDispatch } from "react-redux";
// import { selecteTab } from "../../redux/slices/TabSlice";
import { toast } from "react-toastify";
import { FormatDate, GetProfile, getPermission } from "../../helper/Common";
// import AEDChecksDetails from "./tabs/AEDChecksDetails";
import AEDChecksTbl from "../../pages/accounts/AedMain/tabs/AEDChecksTbl";
import { EquipmentIcon } from "../../helper/Icons";
import AedSupport from "../../pages/accounts/AedMain/tabs/AEDSupport";
import AedDocuments from "../../pages/accounts/AedMain/tabs/AEDDocuments";
import AedServicing from "../../pages/accounts/AedMain/tabs/AEDServicing";
// import { Dropdown } from "react-bootstrap";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import OutOfServiceSecondModal from "../../components/modals/outOfServiceModal/outOfServiceSecondModal";
import UserNotes from "../../userPages/userComp/UserNotes";
import UserSupport from "../../userPages/userComp/UserSupport";
import { filteredDetailsTabs, filteredEquipmentTabs } from "../../helper/constants";
import Details from "./UserEquipmentTab/Details";

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

const UserAedMain = ({ setShowSidebar }) => {
  const { aedId } = useParams();
  // const currentTab = tab ? tab : 'Details';
  // const [currentTab, setCurrentTab] = useState(UserAedTabs.Details);
  // const [currentTab, setCurrentTab] = useState('');

  const [showLoading, setShowLoading] = React.useState(true);
  const [filteredTabs, setFilteredTabs] = useState([])

  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const handleClose = () => setOpen(false);
  const [aedDetails, setAedDetails] = useState({});
  const [aedData, setAEDData] = useState({});
  const [cordinatorInfo, setCordinatorInfo] = useState([]);
  // const { aedId } = useParams();
  const [batteryTypeList, setBatteryTypeList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [aedList, setAedList] = useState([]);
  const [loanerList, setLoanerList] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const [storageInfoList, setStorageInfoList] = useState([]);
  const [rmsBrandList, setrmsBrandList] = useState([]);
  const [aedBattryTypeList, setaedBattryTypeList] = useState([]);
  const [aedPadTypeList, setaedPadTypeList] = useState([]);
  const [OtherFiled, setOtherFileds] = useState([]);
  const [subModelList, setSubModelList] = useState([]);
  const dispatch = useDispatch();

  const [showOutOfServiceModal, setShowOutOfServiceModal] = useState(false);
  const [outofServiceSecond, setOutofServiceSecond] = useState(false);
  const [outofServiceFormData, setOutofServiceFormData] = useState({});
  const [allPads, stAllPads] = useState([])
  const [currentTab, setCurrentTab] = useState('');

  let is_user = location?.state?.is_user
  let privileges = location?.state?.privileges

  // filter data of array with key and value
  const filterData = (arr, key, value) => {
    console.log(arr, key, value);
    const data = arr.find((a) => a[key] == value);
    console.log(data);
    return data;
  };
  // console.log(filterData)
  // get aeds by account
  const getAedDetails = async () => {
    const result = await CallGETAPI("account/get-aed-by-id/" + aedId);
    stAllPads(result?.data?.allPads);
    const allPadsData = result?.data.allPads;
    const allBatteryData = result?.data.batteryInfo;
    const modelCondition = result?.data.aedModels;
    // const rmsBrands = result?.data.rmsBrand;

    const aedDetails = result?.data?.data;
    // const batteryTypeList = [];
    if (result?.status) {
      // set list data ;

      setAEDData(aedDetails);
      setStorageInfoList(result?.data?.storageInfo);
      // setSubModelList(result?.data?.storageInfo)
      setrmsBrandList(result?.data?.rmsBrand);
      setaedBattryTypeList(result?.data?.aedBattryType);
      setaedPadTypeList(result?.data?.aedPadType);

      // aed_model_id
      const BatteryRes = await BatteryTypebyModel(aedDetails?.aed_model_id);
      setBatteryTypeList(BatteryRes);
      if (aedDetails.length === 0) {
        toast.error("Something went wrong please try again");
        return "";
      }
      // allPadsData.forEach((item, index) => {
      //   if (item.section_name === "adult_pad_info") {
      //     aedDetails.adult_pad_info = allPadsData[index];
      //   }
      // });
      const APDArr = allPadsData.filter(
        (it) => it.section_name != "charge_pack"
      );

      aedDetails.adult_pad_info = APDArr;
      // aedDetails.adult_pad_info = JSON.parse(aedDetails?.adult_pad_info);

      // aedDetails.adult_pad_pak_info = JSON.parse(
      //   aedDetails?.adult_pad_pak_info
      // );
      aedDetails.adult_pad_pak_info = APDArr;
      aedDetails.modelCondition = modelCondition;
      aedDetails.pediatric_key_child =
        modelCondition?.has_ped_key ||
        modelCondition?.has_ped_pad ||
        modelCondition?.has_pedpak;
      // aedDetails.pediatric_key = modelCondition?.has_ped_key || modelCondition?.has_ped_pad || modelCondition?.has_pedpak;
      // modelCondition
      // console.log({modelCondition,has_ped_key: modelCondition?.has_ped_key , has_ped_pad: modelCondition?.has_ped_pad , has_pedpak:modelCondition?.has_pedpak});
      aedDetails.battery_info = allBatteryData;
      // aedDetails.battery_info = JSON.parse(aedDetails?.battery_info);
      aedDetails.builtin_RMS_info = JSON.parse(aedDetails?.builtin_RMS_info);
      aedDetails.charge_pak_info = JSON.parse(aedDetails?.charge_pak_info);

      const ar1 = [];
      const SPar1 = [];
      const PartnumberPads = [];
      for (let ci = 0; ci < allBatteryData.length; ci++) {
        const ell = allBatteryData[ci];
        if (ell.section_name === "charge_pack") {
          const ChargePakInfoObj = {
            battery_expiration: ell?.battery_expiration,
            battery_lot: ell?.battery_lot,
            charge_pak_part: ell?.battery_type_id,
            charge_pak_uiid: ell?.charge_pak_uid,
            charge_pak_uid: ell?.charge_pak_uid,
            pad_1_expiration: "",
            pad_1_lot: "",
            pad_1_part: "",
            pad_2_expiration: "",
            pad_2_lot: "",
            pad_2_part: "",
          };

          for (let i3 = 0; i3 < allPadsData.length; i3++) {
            const apd = allPadsData[i3];
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
      // aedDetails.charge_pak_info = aedDetails?.charge_pak_info?.[0];

      aedDetails.gateway_info = JSON.parse(aedDetails?.gateway_info);
      aedDetails.gateway_info = aedDetails?.gateway_info[0];
      aedDetails.other = JSON.parse(aedDetails?.other);
      aedDetails.out_of_service_info = JSON.parse(
        aedDetails?.out_of_service_info
      );
      // aedDetails.pediatric_pad_info = JSON.parse(
      //   aedDetails?.pediatric_pad_info
      // );
      aedDetails.pediatric_pad_info = APDArr;

      // aedDetails.pediatric_pak_pad_info = JSON.parse(
      //   aedDetails?.pediatric_pak_pad_info
      // );
      aedDetails.pediatric_pak_pad_info = APDArr;

      aedDetails.rms_info = JSON.parse(aedDetails?.rms_info);
      // aedDetails.spare_adult_pad_info = JSON.parse(
      //   aedDetails?.spare_adult_pad_info
      // );
      aedDetails.spare_adult_pad_info = APDArr;

      // aedDetails.spare_adult_pad_pak_info = JSON.parse(
      //   aedDetails?.spare_adult_pad_pak_info
      // );
      aedDetails.spare_adult_pad_pak_info = APDArr;

      aedDetails.spare_battery_info = JSON.parse(
        aedDetails?.spare_battery_info
      );
      // aedDetails.spare_charge_pak_info = JSON.parse(
      //   aedDetails?.spare_charge_pak_info
      // );
      // aedDetails.spare_padric_pad_info = JSON.parse(
      //   aedDetails?.spare_padric_pad_info
      // );
      aedDetails.spare_padric_pad_info = APDArr;

      // aedDetails.spare_padric_pak_pad = JSON.parse(
      //   aedDetails?.spare_padric_pak_pad
      // );
      aedDetails.spare_padric_pak_pad = APDArr;

      aedDetails.storage_info = JSON.parse(aedDetails?.storage_info);
      aedDetails.site_name = result?.data?.site_name;
      aedDetails.account_name = result?.data?.account_name;
      setOtherFileds(aedDetails.other);
      let brandList = await GetAedBrands();
      setBrandList(brandList);

      const filteredBrand = filterData(
        brandList?.data,
        "id",
        aedDetails?.aed_brand_id
      );
      aedDetails.brand_name = filteredBrand?.AED_brands;

      let ModelRes = await GetAedModelsByBrandId(filteredBrand?.id);
      let sub_model_res = await GetAedSumModelsById(aedDetails.aed_model_id);
      let MODEL_NAME = ModelRes?.data.find(
        (item) => item.id === aedDetails.aed_model_id
      ); // aedDetails.aed_model_id
      setModelList(ModelRes?.data);

      const filteredModel = filterData(
        ModelRes?.data,
        "id",
        aedDetails?.aed_model_id
      );
      aedDetails.model_name = MODEL_NAME?.model_name; // filteredModel?.model_name

      const filteredSubModel = filterData(
        sub_model_res?.data,
        "id",
        aedDetails?.sub_model_id
      );
      aedDetails.sub_model_name = filteredSubModel
        ? filteredSubModel?.sub_model_name
        : "";
      aedDetails.assign_user = aedDetails.assign_user
        ? JSON.parse(aedDetails.assign_user)
        : [];
      // aedDetails.assign_user
      setAedDetails(aedDetails);

      let CoordiData = AEDGroupBYCoordinatorInfo(
        result?.data?.cordinatorInformation
      );
      setCordinatorInfo(CoordiData);

      setShowLoading(false);
    }
  };

  // on load fetch data
  useEffect(() => {
    getAedDetails();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleTab = (item) => {
    setCurrentTab(item);
  };

  useEffect(() => {
    if (location?.state?.tab) {
      setCurrentTab(location?.state?.tab);
    }
  }, [location]);

  console.log('aedDetails', aedDetails);

  const notesRedirect = () => {
    // aedId={aedId} account_id={aedData?.account_id}
    navigate(
      `/account/new-note?account_id=${aedData?.account_id}&aed_id=${aedId}`
    );
  };
  const handleAssignEqupment = () => {
    let siteId = aedData?.site_id;
    const AEDID = aedId;
    let equipmentUrl = "/assign-quipment/" + aedData?.account_id + "/" + siteId;
    // equipmentUrl = siteId ? equipmentUrl+'/'+siteId : equipmentUrl;
    equipmentUrl = equipmentUrl + "?aed_id=" + AEDID;
    navigate(equipmentUrl);
  };

  const getAllAeds = async () => {
    // const result = await CallGETAPI("account/get-aed/" + aedData?.account_id);
    const result = await CallGETAPI(
      "account/get-aed-with-standalon/" + aedData?.account_id
    );
    if (result?.data?.status) {
      let aeds = result?.data?.data || [];
      const pendingaeds = result?.data?.pendingData;
      let newArr = [];

      if (Array.isArray(aeds) && pendingaeds.length > 0) {
        newArr = [...pendingaeds, ...aeds];
      } else {
        newArr = aeds;
      }
      let currentList = [];

      for (let i = 0; i < newArr.length; i++) {
        for (let j = 0; j < newArr[i].data.length; j++) {
          currentList.push(newArr[i].data[j]);
        }
      }

      // aeds = newArr;
      setAedList(currentList);
    }
  };

  const getLoanerList = async () => {
    const result = await CallGETAPI("account/get-ross-aed");
    if (result?.data?.status) {
      setLoanerList(result?.data?.data);
    }
  };

  useEffect(() => {
    if (aedData?.account_id) {
      getAllAeds();
      getLoanerList();
    }
  }, [aedData]);

  const documentRedirect = () => {
    navigate("/account-document-upload", {
      state: {
        type: "Support",
        accountId: aedData?.account_id,
        siteId: "",
        aedId: aedId,
      },
    });
  };

  // console.log(aedData?.account_id, aedData?.site_id);

  const supportRedirect = () => {
    const stateData = {
      type: "Support",
      site_id: 0,
      accountId: aedData?.account_id,
      contactId: 0,
      // accountName: accountDetails?.account_name || "",
      // support_name: accountDetails?.account_name,
    };

    navigate("/account/new-support/" + aedData.accountId, { state: stateData });
  };
  // console.log(aedData);

  const handleServiceCheck = () => {
    navigate(
      `/account/aed/service-check/service1/${aedData?.account_id}/${aedData?.site_id
      }/aedId?aedId=${encodeURIComponent(aedId)}`
    );
  };

  let profile = GetProfile();// JSON.parse(localStorage.getItem("ross-profile"))
  let contact_id = profile?.contact_id
  let account_id = profile?.account_id

  const filterTabsArray = () => {

    const filteredContactsTabs = filteredEquipmentTabs(UserAedTabs)

    filteredContactsTabs.unshift({ name: 'Details', id: 'aed-details', 'order': 1 })
    // filteredContactsTabs.push({ name: 'AEDChecks', id: 'aed-check-tab', 'order': 13 })
    filteredContactsTabs.push({ name: 'AEDChecks', id: 'aed-check-details', 'order': 13 })
    // filteredContactsTabs.push({ name: 'AED Servicing', id: 'aed-servicing-tab', 'order': 14 })
    filteredContactsTabs.push({ name: 'AEDServicing', id: 'aed-service-check', 'order': 14 })

    // let filteredData = {};
    let filteredData = [];

    const permission = getPermission();// localStorage.getItem('permissions');
    if (!permission) {
      console.log('No Permission Found');
      return "";
    }

    const cp = permission.split(',');
    filteredContactsTabs.forEach(tab => {
      if (cp.includes(tab.id)) {
        // filteredData[tab.name] = tab.name;
        filteredData.push(tab)
      }
    });

    const filteredDataObj = {};
    filteredData.forEach(obj => {
      filteredDataObj[obj.name] = obj.name;
    });

    var firstKey = Object.keys(filteredDataObj)[0];
    setCurrentTab(filteredDataObj[firstKey])
    setFilteredTabs(filteredDataObj)
  };


  useEffect(() => {
    filterTabsArray()
  }, [])

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
          <div
            className="mt-4"
            style={{ width: "100%", paddingInline: "45px" }}
          >
            {/* top heading */}
            <SubHeadingOther
              title={"AED: " + (aedDetails?.serial_number || "")}
              hideNew={true}
              hideHierarchy={true}
              hideInstructor={true}
              subHeading={true}
              bottomLinks={false}
              account={5}
              editUrl={false}
              assign_equipment={true}
            />

            {/* bottom buttons */}
            <div className="d-flex" style={{ justifyContent: "space-between" }}>
              <div className="d-flex">
                {privileges?.includes('account-edit') && (
                  <button
                    className="btn text-primary"
                    type="button"
                    onClick={() => navigate("/account/aed/edit/" + aedId)}
                  >
                    <img
                      src="/edit.svg"
                      alt="Edit"
                      style={{ marginRight: "5px" }}
                    />
                    <span className="ms-1">Edit </span>
                  </button>
                )}

                {privileges?.includes('out-of-service') && (
                  <button
                    className="btn text-primary"
                    type="button"
                    onClick={() => {
                      setShowOutOfServiceModal(true);
                    }}
                  >
                    <img
                      src="/outofservice.svg"
                      alt="outofservice"
                      style={{ marginRight: "5px" }}
                    />
                    <span className="ms-1">Out of Service</span>
                  </button>
                )}

                {privileges?.includes('new-aed-checks') && (
                  <button
                    className="btn text-primary"
                    type="button"
                    onClick={() =>
                      navigate(
                        "/account/aed-details/check-select?aed_id=" +
                        aedId +
                        "&account_id=" +
                        aedData?.account_id
                      )
                    }
                  >
                    <img
                      src="/aedcheck.svg"
                      alt="aedcheck"
                      style={{ marginRight: "5px" }}
                    />
                    <span className="ms-1">AED Check</span>
                  </button>
                )}

                {privileges?.includes('aed-service-check') && (
                  <button className="btn text-primary" type="button" onClick={handleServiceCheck}>
                    <img
                      src="/servicecheck.svg"
                      alt="servicecheck"
                      style={{ marginRight: "5px" }}
                    />
                    <span className="ms-1">Service Check</span>
                  </button>
                )}


                {/* <button className="btn text-primary" type="button">
                  <img
                    src="/servicecheck.svg"
                    alt="servicecheck"
                    style={{ marginRight: "5px" }}
                  />
                  <span className="ms-1">Service Check</span>
                </button> */}

                {privileges?.includes('assign-aed') && (
                  <button
                    className="btn btn-transparent text-primary ms-2 bg-white"
                    id="new-tab-btn-12111"
                    type="button"
                    style={{ backgroundColor: "transparent !important" }}
                    onClick={handleAssignEqupment}
                  >
                    <EquipmentIcon />
                    <span className="ms-1">Assigned AED</span>
                  </button>
                )}

              </div>
            </div>
            {/* </div> */}

            {/* under bottom buttons */}
            <div className="row mt-3 align-items-center">
              <div
                className="d-flex gap-5 align-items-center"
                style={{ justifyContent: "space-between" }}
              >
                <div className="d-flex gap-5 align-items-center">
                  {aedDetails?.ready_status == "ready" && (
                    <span
                      className="px-5 py-3 text-white"
                      style={{
                        backgroundColor: "#5CB200",
                        borderRadius: "0px",
                      }}
                    >
                      Ready
                    </span>
                  )}
                  {aedDetails?.ready_status == "not ready" && (
                    <span
                      className="px-5 py-3 text-white"
                      style={{
                        backgroundColor: "rgba(228, 0, 0, 1)",
                        borderRadius: "0px",
                      }}
                    >
                      Not Ready
                    </span>
                  )}
                  {aedDetails?.ready_status == "Unknown" && (
                    <span
                      className="px-5 py-3 text-white"
                      style={{
                        backgroundColor: "rgba(228, 0, 0, 1)",
                        borderRadius: "0px",
                      }}
                    >
                      Unknown
                    </span>
                  )}
                  {aedDetails?.ready_status == "out of service" && (
                    <span
                      className="px-5 py-3 text-white"
                      style={{
                        backgroundColor: "rgba(191, 118, 9, 1)",
                        borderRadius: "0px",
                      }}
                    >
                      Out of Service
                    </span>
                  )}
                  <img
                    src={AED_IMG_BASE + aedDetails?.aed_image}
                    alt="aed_image"
                    style={{ maxWidth: "100px" }}
                  />

                  {/* heading */}
                  <h2
                    className="text-center aed-title"
                    style={{
                      position: matches ? "" : "absolute",
                      right: matches ? "" : "35%",
                    }}
                  >
                    {aedDetails?.account_name} {aedDetails?.site_name}
                  </h2>
                </div>
              </div>
            </div>

            {/* tabs */}
            <Box className="bg-primary mt-3 mb-2">
              <div className="d-flex border-bottom border-secondary">
                {Object.values(filteredTabs).map((tabItem, i) => (
                  <div
                    role="button"
                    key={i}
                    className={"text-light py-2 px-3"}
                    style={{
                      backgroundColor: `${tabItem === currentTab ? "#26AEE0" : "#0C71C3"
                        }`,
                    }}
                    onClick={() => handleTab(tabItem)}
                  >
                    {tabItem}
                  </div>
                ))}
              </div>
            </Box>

            {/* Details */}
            {filteredTabs.hasOwnProperty('Details') && currentTab === filteredTabs.Details && (
              <Details
                modelList={modelList}
                aedDetails={aedDetails}
                batteryTypeList={batteryTypeList}
                // outOfServiceInfo={aedDetails?.out_of_service_info}
                outOfServiceInfo={typeof aedDetails?.out_of_service_info === 'string' ? JSON.parse(aedDetails?.out_of_service_info) : aedDetails?.out_of_service_info}
                out_of_service_toggle={aedDetails?.out_of_service_toggle}
                cordinatorInfo={cordinatorInfo}
                storageInfo={aedDetails?.storage_info}
                batteryInfo={aedDetails?.battery_info}
                sphereBatteryInfo={aedDetails?.spare_battery_info}
                adultPadInfo={aedDetails.adult_pad_info}
                spareAdultPadInfo={aedDetails.spare_adult_pad_info}
                pediatricPadInfo={aedDetails.pediatric_pad_info}
                sparePadricPadInfo={aedDetails.spare_padric_pad_info}
                gatewayInfo={aedDetails.gateway_info}
                adultPadPakInfo={aedDetails.adult_pad_pak_info}
                spareAdultPadPakInfo={aedDetails.spare_adult_pad_pak_info}
                pediatricPadPakInfo={aedDetails.pediatric_pak_pad_info}
                sparePadricPadPakInfo={aedDetails.spare_padric_pak_pad}
                chargePakInfo={aedDetails?.charge_pak_info}
                spareChargePakInfo={aedDetails?.spare_charge_pak_info}
                storageInfoList={storageInfoList}
                rmsBrandList={rmsBrandList}
                aedBattryTypeList={aedBattryTypeList}
                aedPadTypeList={aedPadTypeList}
                OtherFiled={OtherFiled}
                allPads={allPads}
              />
            )}

            {/* Notes */}
            {/* {currentTab === AedTabs.Notes && (
              <Notes aedId={aedId} account_id={aedData?.account_id} />
            )} */}

            {/* Notes */}
            {
              filteredTabs.hasOwnProperty('Notes') && currentTab === filteredTabs.Notes ?
                is_user === true ?
                  <>
                    <UserNotes aedId={aedId} account_id={account_id} privileges={privileges} />
                  </>
                  :
                  <>
                    <Notes aedId={aedId} account_id={aedData?.account_id} />
                  </>
                :
                <></>
            }

            {filteredTabs.hasOwnProperty('AEDChecks') && currentTab === filteredTabs.AEDChecks && <AEDChecksTbl />}

            {filteredTabs.hasOwnProperty('AEDServicing') && currentTab === filteredTabs.AEDServicing && (
              <AedServicing
                privileges={privileges} is_user={is_user}
                stateData={{
                  type: "AEDServicing",
                  accountId: is_user === true ? account_id : aedData?.account_id,
                  aedId: aedId,
                  contactId: 0,
                  siteId: 0,
                  inpersonId: 0,
                }}
              />
            )}

            {/* {filteredTabs.hasOwnProperty('Support') && currentTab === AedTabs.Support && (
              <UserSupport is_user={true} privileges={privileges} account_id={account_id} contact_id={contact_id} />
            )} */}

            {/* {filteredTabs.hasOwnProperty('Documents') && currentTab === filteredTabs.Documents && (
              <AedDocuments aedId={aedId} accountID={is_user === true ? account_id : aedData?.account_id} />
            )} */}

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

            {/* out of service modal */}
            {showOutOfServiceModal && (
              <OutOfServiceModal
                ShowModal={showOutOfServiceModal}
                SetShowModal={setShowOutOfServiceModal}
                outOfServiceInfo={aedDetails?.out_of_service_info}
                outOfServiceToggle={aedDetails?.out_of_service_toggle}
                aedList={aedList}
                loanerList={loanerList}
                setLoanerList={setLoanerList}
                aedId={aedId}
                getAedDetails={() => getAedDetails()}
                aedDetails={aedDetails}
                accountId={aedData?.account_id}
                outofServiceSecond={outofServiceSecond}
                setOutofServiceSecond={setOutofServiceSecond}
                setOutofServiceFormData={setOutofServiceFormData}
              />
            )}

            <OutOfServiceSecondModal
              accountId={aedData?.account_id}
              ShowSecondModal={outofServiceSecond}
              setShowSecondModal={setOutofServiceSecond}
              outOfServiceInfo={aedDetails?.out_of_service_info}
              outofServiceFormData={outofServiceFormData}
            />

          </div>
          <div className="floating-menu-btn d-flex flex-column gap-2">
            {isOpen && (
              <>
                <img
                  src="/NewDocument.svg"
                  width={60}
                  height={60}
                  style={{
                    padding: "2px",
                    borderRadius: "50%",
                    borderColor: "#0c71c3",
                    borderWidth: "3px",
                    borderStyle: "solid",
                  }}
                  className="pointer bg-white"
                  onClick={documentRedirect}
                />

                <img
                  src="/NewSupport.svg"
                  width={60}
                  height={60}
                  style={{
                    padding: "2px",
                    borderRadius: "50%",
                    borderColor: "#0c71c3",
                    borderWidth: "3px",
                    borderStyle: "solid",
                  }}
                  className="pointer bg-white"
                  onClick={supportRedirect}
                />

                <img
                  src="/NewNote.svg"
                  width={60}
                  height={60}
                  style={{
                    padding: "2px",
                    borderRadius: "50%",
                    borderColor: "#0c71c3",
                    borderWidth: "3px",
                    borderStyle: "solid",
                  }}
                  className="pointer bg-white"
                  onClick={notesRedirect}
                />
              </>
            )}

            <img
              src="/Plus.svg"
              width={60}
              height={60}
              style={{
                padding: "2px",
                borderRadius: "50%",
                borderColor: "#0c71c3",
                borderWidth: "3px",
                borderStyle: "solid",
              }}
              className="pointer bg-white"
              onClick={() => {
                setIsOpen((prev) => !prev);
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default UserAedMain;
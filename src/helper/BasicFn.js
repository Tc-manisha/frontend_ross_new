import {
  CallGETAPI,
  CallGETAPI2,
  CallGETAPINEW,
  CallGETAPINEWTech,
  CallPOSTAPI,
  CallPOSTAPINEW,
} from "./API";
import axios from "axios";
import { FormatDate, formatPhoneNumber, getToken } from "./Common";
import moment from "moment";

export const FetchDropDowns = async () => {
  let url = "account/account-dropdowns";
  let res = await CallGETAPI(url);
  if (res?.data?.status) {
    return res?.data?.data;
  }
  return "";
};

export const ProductsDropDown = async () => {
  let url = "account/product-dropdown";
  let res = await CallGETAPI(url);
  if (res?.data?.status) {
    return res?.data?.data;
  }
  return "";
};

export const UserDetails = async () => {
  let result = await CallGETAPI("user-profile");
  if (result.status) {
    if (result?.data.status) {
      return result?.data?.data[0];
    }
  }
  return false;
};

export const DecryptToken = () => {
  const token = getToken();
  if (!token) {
    return "";
  }

  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const FetchClients = async () => {
  // let url = assignedClients
  let result = await CallGETAPI("assignedClients");
  if (result.status) {
    return result?.data?.data;
  }
  return "";
};

export const FetchPrograms = async (clientID) => {
  let result = await CallGETAPI("program-by-client/" + clientID);
  if (result.status) {
    return result?.data?.data;
  }
  return "";
};

export const FetchProjects = async () => {
  let result = await CallGETAPI("all-project-by-user");
  if (result.status) {
    return result?.data?.data;
  }
  return "";
};
export const GetSingleProject = async (id) => {
  let result = await CallGETAPI("get-project-by-id/" + id);
  if (result.status) {
    return result?.data?.data;
  }
  return "";
};

export const getIpAddress = () => {
  return axios.get("https://api.ipify.org?format=json").then((res) => {
    return res.data.ip;
  });
};

export const FetchIP = async () => {
  let result = await CallGETAPI2("https://geolocation-db.com/json/");
  if (result?.status) {
    return result?.data;
  }
};

export const Logout = async () => {
  // sessionStorage.removeItem("ross_rtoken");
  // sessionStorage.removeItem("ross_token");
  // localStorage.removeItem("ross_token");
  const is_user  = Number(sessionStorage.getItem('is_user')) || 0;
  if(is_user){
    sessionStorage.removeItem("is_user");
    sessionStorage.removeItem("ross_token");
    sessionStorage.removeItem("ross_rtoken");
    // localStorage.removeItem("ross_token");
    // localStorage.removeItem("ross-profile");
  }else{
    sessionStorage.removeItem("is_user");
    sessionStorage.removeItem("ross_token");
    sessionStorage.removeItem("ross_rtoken");
    localStorage.removeItem("ross_token");
    localStorage.removeItem("ross-profile");
  }

};

export const RefreashToken = async () => {
	const is_user = sessionStorage.getItem('is_user') || 0;
  let rtoken = is_user == 1 ? sessionStorage.getItem("ross_rtoken") : localStorage.getItem("ross_rtoken");
  let token = getToken();
  let body = { refreshToken: rtoken };
  let headers = { "x-access-token": token };
  let result = await CallPOSTAPI("auth/refresh-token", body, headers);
  if (result?.data?.status) {
    is_user == 1 ? sessionStorage.setItem("ross_rtoken", result?.data?.refreshtoken) : localStorage.setItem("ross_rtoken", result?.data?.refreshtoken);
   is_user == 1 ?  sessionStorage.setItem("ross_token", result?.data?.token) : localStorage.setItem("ross_token", result?.data?.token);
    return result?.data;
  }
  return "";
};

export const PasswordRGX = new RegExp(
  "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
);

export const FetchAccountDetails = async (accountId) => {
  try {
    const accountRes = await CallGETAPI(
      `account/account_info_detail/${accountId}`
    );
    return accountRes?.data?.data?.AccountDetails;
  } catch (e) {
    return {};
  }
};

export const FetchAccountSiteDetails = async (accountId) => {
  try {
    const accountRes = await CallGETAPI(
      `account/account-site-details/${accountId}`
    );
    return accountRes?.data;
  } catch (e) {
    return {};
  }
};

export const FetchAccountSiteTrainingDetails = async (siteId) => {
  try {
    const accountRes = await CallGETAPI(
      `account/site-training-address/${siteId}`
    );
    return accountRes?.data;
  } catch (e) {
    return {};
  }
};

export const GroupBYCoordinatorInfo = (DBData) => {
  let CoordinatorArr = [
    {
      title: "Account POC",
      arr: ["", ""],
    },
    {
      title: "AED Auditor",
      arr: ["", ""],
    },
    {
      title: "Equipment Auditor",
      arr: ["", ""],
    },
    {
      title: "Training Auditor",
      arr: ["", ""],
    },
    // {
    //     title: "Account Auditor",
    //     arr: ["",""]
    // },
    {
      title: "Project Managers",
      arr: ["", ""],
    },
    {
      title: "Sales Reps",
      arr: ["", ""],
    },
  ];
  if (!DBData) {
    return CoordinatorArr;
  }
  let FinalRetArr = [];
  for (let CRI = 0; CRI < CoordinatorArr.length; CRI++) {
    const CoorDInatorelement = CoordinatorArr[CRI];
    let arrRole = [];
    for (let DBI = 0; DBI < DBData.length; DBI++) {
      const element = DBData[DBI];
      if (CoorDInatorelement.title === element.title) {
        arrRole.push(element);
      }
    }
    if (arrRole.length > 0) {
      CoorDInatorelement.arr = arrRole;
    }
    FinalRetArr.push(CoorDInatorelement);
  }
  return FinalRetArr;
};

export const AEDGroupBYCoordinatorInfo = (DBData) => {
  let CoordinatorArr = [
    {
      title: "Site POC",
      arr: ["", ""],
    },
    {
      title: "AED Auditor",
      arr: ["", ""],
    },
    {
      title: "AED Site Coordinator",
      arr: ["", ""],
    },
    {
      title: "Billing Coordinator",
      arr: ["", ""],
    },
    // {
    //     title: "Account Auditor",
    //     arr: ["",""]
    // },
    {
      title: "Sales Reps",
      arr: ["", ""],
    },
    {
      title: "Technicians",
      arr: ["", ""],
    },
  ];

  let FinalRetArr = [];
  for (let CRI = 0; CRI < CoordinatorArr.length; CRI++) {
    const CoorDInatorelement = CoordinatorArr[CRI];
    let arrRole = [];
    for (let DBI = 0; DBI < DBData.length; DBI++) {
      const element = DBData[DBI];
      if (CoorDInatorelement.title === element.title) {
        arrRole.push(element);
      }
    }
    if (arrRole.length > 0) {
      CoorDInatorelement.arr = arrRole;
    }
    FinalRetArr.push(CoorDInatorelement);
  }
  return FinalRetArr;
};

export const GroupBYSiteCoordinatorInfo = (DBData) => {
  let CoordinatorArr = [
    {
      title: "Site POC",
      arr: ["", ""],
    },
    {
      title: "AED Site Coordinator",
      arr: ["", ""],
    },
    // {
    //     title: "Billing Contact",
    //     arr: ["",""]
    // },
    {
      title: "Billing Coordinator",
      arr: ["", ""],
    },
    {
      title: "Equipment Site Coordinator",
      arr: ["", ""],
    },
    // {
    //     title: "Account Auditor",
    //     arr: ["",""]
    // },
    {
      title: "Instructor Contact",
      arr: ["", ""],
    },
    {
      title: "Training Coordinator",
      arr: ["", ""],
    },
    {
      title: "Shipping Contact",
      arr: ["", ""],
    },
  ];

  let FinalRetArr = [];
  if (CoordinatorArr && DBData) {
    for (let CRI = 0; CRI < CoordinatorArr.length; CRI++) {
      const CoorDInatorelement = CoordinatorArr[CRI];
      let arrRole = [];
      for (let DBI = 0; DBI < DBData.length; DBI++) {
        const element = DBData[DBI];
        if (CoorDInatorelement.title === element.title) {
          arrRole.push(element);
        }
      }
      if (arrRole.length > 0) {
        CoorDInatorelement.arr = arrRole;
      }
      FinalRetArr.push(CoorDInatorelement);
    }
  }
  return FinalRetArr;
};

export const GroupBYAdminSiteCoordinatorInfo = (DBData) => {
  let CoordinatorArr = [
    {
      title: "Site POC",
      arr: ["", ""],
    },
    {
      title: "Shipping Contact",
      arr: ["", ""],
    },
    {
      title: "Billing Coordinator",
      arr: ["", ""],
    },
    {
      title: "AED Site Coordinator",
      arr: ["", ""],
    },
    {
      title: "Equipment Site Coordinator",
      arr: ["", ""],
    },
    {
      title: "Instructor Contact",
      arr: ["", ""],
    },
    {
      title: "Training Coordinator",
      arr: ["", ""],
    },
    {
      title: "Technicians",
      arr: ["", ""],
    },
  ];

  let FinalRetArr = [];
  if (CoordinatorArr && DBData) {
    for (let CRI = 0; CRI < CoordinatorArr.length; CRI++) {
      const CoorDInatorelement = CoordinatorArr[CRI];
      let arrRole = [];
      for (let DBI = 0; DBI < DBData.length; DBI++) {
        const element = DBData[DBI];
        if (CoorDInatorelement.title === element.title) {
          arrRole.push(element);
        }
      }
      if (arrRole.length > 0) {
        CoorDInatorelement.arr = arrRole;
      }
      FinalRetArr.push(CoorDInatorelement);
    }
  }
  return FinalRetArr;
};

export const AccountSiteList = async (acid) => {
  let result = await CallGETAPI("account/account-site-list/" + acid);
  if (result?.status) {
    return result?.data?.data;
  }
  return false;
};
export const AccountContactDetails = async (acid) => {
  let result = await CallGETAPI("account/account-contacts-list/" + acid);
  if (result?.status) {
    return result?.data?.data;
  }
  return false;
};
export const ModalAccReps = async () => {
  let result = await CallGETAPI("account/fetch-positions/acc-reps");
  if (result?.status) {
    return result?.data?.positions;
  }
  return false;
};
export const ModalAccSiteReps = async () => {
  let result = await CallGETAPI("account/fetch-positions/site-reps");
  if (result?.status) {
    return result?.data?.data?.positions;
  }
  return false;
};
export const AccRepsDropDown = async () => {
  // let result = await CallGETAPI("account/site-reps-dropdown");
  let result = await CallGETAPI("account/account-reps-dropdown");
  console.log({result})
  if (result?.status) {
    return result?.data?.data?.accountReps;
  }
  return false;
};
export const SiteRepsDropDown = async () => {
  let result = await CallGETAPI("account/site-reps-dropdown");
  if (result?.status) {
    return result?.data?.data?.accountReps;
  }
  return false;
};
export const ContactList = async (params) => {
  // params must be Account ID
  let result = await CallGETAPI("account/account-contacts-list/" + params);
  if (result?.status) {
    return result?.data?.data?.contact_list;
  }
  return false;
};
export const ContectRepList = async () => {
  let result = await CallGETAPI("account/fetch-positions/acc-contact");
  if (result?.status) {
    return result?.data?.data?.positions;
  }
  return false;
};

export const SiteContactRepList = async () => {
  let result = await CallGETAPI("account/fetch-positions/site-contact");
  if (result?.status) {
    return result?.data?.data?.positions;
  }
  return false;
};

export const AssignContectRepList = async (id) => {
  let result = await CallGETAPI("account/assign-acc-contact-list/" + id);
  console.log({result})
  if (result?.status) {
    return result?.data?.data?.accountContactList;
  }
  return false;
};

export const AssignedSiteContactList = async (id) => {
  if(!id){
    return [];
  }
  let result = await CallGETAPI("account/assign-site-contact-list/" + id);
  if (result?.status) {
    return result?.data?.siteContactList;
  }
  return [];
};

export const AssignedSiteRepsList = async (id) => {
  let result = await CallGETAPI("account/assign-site-reps-list/" + id);
  if (result?.status) {
    return result?.data?.siteRepstList;
  }
  return false;
};

export const AssignedRepList = async (id) => {
  let result = await CallGETAPI("account/assign-site-reps-list/" + id);
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetAccountContactList = async (id) => {
  let result = await CallGETAPI("account/contact-details/" + id);
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetUserContactList = async (id) => {
  let result = await CallGETAPI("user/account-contact-details/" + id);
  if (result?.status) {
    return result;
  }
  return false;
};
// user/account-contact-details/

export const GetAccountEditContactList = async (id) => {
  let result = await CallGETAPI("account/edit-contact-details/" + id);
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetAccountList = async () => {
  let result = await CallGETAPI("account/account-list");
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetContactList = async () => {
  let result = await CallGETAPI("admin/account-admin-contacts-list");
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetSitesList = async (id) => {
  let result = await CallGETAPI("account/account-site-list/" + id);
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetSitesAddressList = async (id) => {
  let result = await CallGETAPI("account/site-training-address/" + id);
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetCertAgencyList = async () => {
  let result = await CallGETAPI("account/cert-agency");
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetCartAgencyCoursesList = async (id) => {
  let result = await CallGETAPI("account/course-list/" + id);
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetCartAgencyCourseSchedulerList = async () => {
  let result = await CallGETAPI("account/schedular-list");
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetClassStatus = async () => {
  let result = await CallGETAPI("account/class-status");
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetCalendarGroup = async () => {
  let result = await CallGETAPI("account/calendar-group");
  if (result?.status) {
    return result;
  }
  return false;
};

export const ProfileDetails = async () => {
  let profileDetails = getToken();
  if (profileDetails) {
    let PD = parseJwt(profileDetails);
    return PD;
  }
  return false;
};

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export const GetAccountByContact = async (id) => {
  let result = await CallGETAPI("account/account-by-contact/" + id);
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetContactSelectedBySite = async (id) => {
  let result = await CallGETAPI("account/site-contact-list-by-site/" + id);
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetContactListByAccount = async (id) => {
  let result = await CallGETAPI("account/account-contacts-list/" + id);
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetFilterData = async () => {
  let result = await CallGETAPI("account/account-filter");
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetEquipmentFilterData = async (id) => {
  let result = await CallGETAPI(`account/equipment-filter/${id}`);
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetAccessoryListingFilterData = async () => {
  let result = await CallGETAPI(`admin/admin-accessory-fetch`);
  if (result?.status) {
    return result;
  }
  return false;
};

export const GetEquipmentListingFilterData = async (id) => {
  let result = await CallGETAPI(`admin/fetch-admin-equipment-listting`);
  if (result?.status) {
    return result;
  }
  return false;
};

export const DeleteAEDTraningInfomar = async (id) => {
  let res = await CallGETAPI(`account/delete-training-address/${id}`);
  if (res?.status) {
    return res?.data;
  }
  return false;
};

export const EditSiteDetailsSingle = async (id) => {
  let res = await CallGETAPI(`account/edit-training-address/${id}`);
  if (res?.status) {
    return res?.data;
  }
  return false;
};

export const GetCountries = async () => {
  let res = await CallGETAPI(`account/get-country`);
  if (res?.status) {
    return res?.data;
  }
  return false;
};

export const GetRfiData = async (id) => {
  let res = await CallGETAPINEW("account/generated-rfi?id=" + id);
  if (res?.status) {
    return res?.data;
  }
  return false;
};

export const GetAedBrands = async () => {
  let res = await CallGETAPINEW("account/ade-brands");
  if (res?.status) {
    return res?.data;
  }
  return false;
};

export const GetAedModelsByBrandId = async (id) => {
  let res = await CallGETAPINEW("account/ade-models-by-brand?brand_id=" + id);
  if (res?.status) {
    return res?.data;
  }
  return false;
};

export const GetAedSumModelsById = async (id) => {
  let res = await CallGETAPINEW(
    "account/ade-submodels-by-models?model_id=" + id
  );
  if (res?.status) {
    return res?.data;
  }
  return false;
};

// ade-submodels-by-models

export const GetClassContactsByAddressAndCert = async (addressId, certId) => {
  let res = await CallGETAPINEW(
    "account/instructors-by-address-cert?address_id=" +
      addressId +
      "&cert_agency=" +
      certId
  );
  if (res?.status) {
    return res?.data;
  }
  return false;
};

export const GetAssignedInstructorsByClass = async (id) => {
  let res = await CallGETAPINEW(
    "account/get-assign-instructors-of-inperson/" + id
  );
  if (res?.status) {
    return res?.data;
  }
  return false;
};

export const GetAssignedBroadcastInstructors = async (id) => {
  let res = await CallGETAPINEW(
    "account/get-broadcast-message-of-inpersons/" + id
  );
  if (res?.status) {
    return res?.data;
  }
  return false;
};

export const GetInpersonClassesByAccountId = async (id) => {
  let res = await CallGETAPINEW("account/inperson-class-by-account/" + id);
  if (res?.status) {
    return res?.data;
  }
  return false;
};

export const GetInpersonClassesBySitesId = async (id) => {
  let res = await CallGETAPINEW("account/inperson-class-by-site/" + id);
  if (res?.status) {
    return res?.data;
  }
  return false;
};

export const AEDStorageInfo = async () => {
  let res = await CallGETAPINEW("account/storage-info");
  if (res?.status) {
    return res?.data?.data;
  }
  return false;
};

export const GetRMSBrand = async () => {
  let res = await CallGETAPINEW("account/rms-brand");
  if (res?.status) {
    return res?.data?.data;
  }
  return false;
};

export const BatteryTypebyModel = async (id) => {
  try {
    if (!id || id === "undefined") return [];
    let res = await CallGETAPINEW("account/ade-battery-type-by-model/" + id);
    if (res?.status) {
      return res?.data?.data;
    }
    return [];
  } catch (e) {
    return [];
  }
};

export const FetchAEDList = async () => {
  try {
    let res = await CallGETAPINEW("account/get-aed/");
    if (res?.status) {
      return res?.data?.data;
    }
  } catch (e) {
    console.log("Error Message " + e.message);
    return [];
  }
};

export const FetchAEDDetails = async (id) => {
  try {
    let res = await CallGETAPINEW("account/get-aed-by-id/" + id);
    if (res?.status) {
      return res?.data?.data;
    }
  } catch (e) {
    console.log("Error Message " + e.message);
    return [];
  }
};

// user/account-contact-list

export const fetchUserAccountContact = async () => {
  try {
    let res = await CallGETAPINEW("user/account-contact-list");
    if (res?.status) {
      return res?.data?.data;
    }
  } catch (e) {
    console.log("Error Message " + e.message);
    return [];
  }
};

export const PadTypeByModal = async (id) => {
  try {
    let res = await CallGETAPINEW("account/ade-pad-type-by-model/" + id);
    if (res?.status) {
      return res?.data?.data;
    }
  } catch (e) {
    console.log("Error Message " + e.message);
    return [];
  }
};

// function to prepare data for all select options
export const PrepareOptions = (optionsData, key, value) => {
  if (optionsData) {
    let allData = [];
    for (let i = 0; i < optionsData.length; i++) {
      let singleData = {};
      singleData.value = optionsData[i][key];
      singleData.label = optionsData[i][value];
      allData.push(singleData);
    }
    return allData;
  }
};

export const HandleUnknow = (val) => {
  if (val === "unknown") {
    return "";
  } else {
    return val;
  }
};

export const RenderMobile = (mobile, ext) => {
  if (!mobile) {
    return "";
  }
  return (
    <a
      className="link"
      style={{ textDecration: "none !important" }}
      href={"tel:" + ext + mobile}
    >
      {mobile ? formatPhoneNumber(mobile) : ""}
      {ext != "" ? "x" + ext : ""}
    </a>
  );
};

export const RenderEmail = (email) => {
  return (
    <a className="link" href={"mailto:" + email}>
      {email}
    </a>
  );
};

export const PriceFormat = (val) => {
  if (!val) {
    return "";
  }
  return val + ".00";
};
export const CheckDate = (d) => {
  let dateNew = moment(d).format("MM/DD/YYYY");
  if (dateNew === "Invalid date") {
    return false;
  }
  return true;
};
// export function PriceFormat(price) {
//     // return price.toFixed(2);
//     // console.log(typeof price);
//     // price = parseInt(price);
//     // Check if the input is a valid number
//     if (typeof price !== 'number' || isNaN(price)) {
//         console.error('Invalid input. Please provide a valid numeric price.');
//         return;
//     }

//     // Use the toFixed method to ensure two decimal places
//     const fixedPrice = price.toFixed(2);

//     // Use the toLocaleString method with options to format the number as US currency
//     const formattedPrice = parseFloat(fixedPrice).toLocaleString('en-US', {
//         style: 'currency',
//         currency: 'USD'
//     });

//     return formattedPrice;
// }

// account/get-aed-by-id

// ade-battery-type-by-model

export const CheckADTable = (batteryInfo, key) => {
  const pKey = [
    { key: "has_battery" },
    { key: "has_10pk" },
    { key: "has_9v" },
    { key: "has_installby" },
    { key: "has_man" },
  ];
  let isFound = 0;
  if (batteryInfo?.length == 0) return "";
  for (let i1 = 0; i1 < batteryInfo.length; i1++) {
    const ele2 = batteryInfo[i1];
    if (
      ele2[key] &&
      ele2[key] != "" &&
      ele2[key] != "undefined-NaN-undefined"
    ) {
      isFound = 1;
      break;
    }
  }

  // for (let index = 0; index < batteryInfo.length; index++) {
  //     if(!batteryInfo[index]){
  //         break;
  //     }
  //   const el1 = batteryInfo[index];
  //   for (let ki = 0; ki < pKey.length; ki++) {
  //     const el2Key = pKey[ki].key; // Correcte
  //     if(!el1[el2Key]){
  //         isFound = 0;
  //         break;
  //     }
  //     if(el2Key==='has_man' && key==='battery_expiration'){
  //         isFound = 0;
  //         break;
  //     }
  //     for (let i2 = 0; i2 < el1[el2Key].length; i2++) {
  //       const ele2 = el1[el2Key][i2];
  //       if (ele2[key] && ele2[key]!='' && ele2[key]!='undefined-NaN-undefined') {

  //         isFound = 1;
  //         break;
  //       }
  //     }
  //     if (isFound) {
  //       break;
  //     }
  //   }
  //   if (isFound) {
  //     break;
  //   }
  // }

  return isFound;
};

export const AedCheckADTable = (batteryInfo, key) => {
  const pKey = [
    { key: "has_battery" },
    { key: "has_10pk" },
    { key: "has_9v" },
    { key: "has_installby" },
    { key: "has_man" },
  ];
  let isFound = 0;
  // if(batteryInfo?.length==0) return '';
  // for (let i1 = 0; i1 < batteryInfo.length; i1++) {
  //     const ele2 = batteryInfo[i1];
  //     if(ele2[key] && ele2[key]!='' && ele2[key]!='undefined-NaN-undefined'){
  //         isFound = 1;
  //         break;
  //     }
  // }

  for (let index = 0; index < batteryInfo.length; index++) {
    if (!batteryInfo[index]) {
      break;
    }
    const el1 = batteryInfo[index];
    for (let ki = 0; ki < pKey.length; ki++) {
      const el2Key = pKey[ki].key; // Correcte
      if (!el1[el2Key]) {
        isFound = 0;
        break;
      }
      if (el2Key === "has_man" && key === "battery_expiration") {
        isFound = 0;
        break;
      }
      for (let i2 = 0; i2 < el1[el2Key].length; i2++) {
        const ele2 = el1[el2Key][i2];
        if (
          ele2[key] &&
          ele2[key] != "" &&
          ele2[key] != "undefined-NaN-undefined"
        ) {
          isFound = 1;
          break;
        }
      }
      if (isFound) {
        break;
      }
    }
    if (isFound) {
      break;
    }
  }

  return isFound;
};

export const CheckAEDBatteryTblCol = (batteryInfo, key) => {
  const pKey = [
    { key: "has_battery" },
    { key: "has_10pk" },
    { key: "has_9v" },
    { key: "has_installby" },
    { key: "has_man" },
  ];
  let isFound = 0;

  for (let index = 0; index < batteryInfo.length; index++) {
    if (!batteryInfo[index]) {
      break;
    }
    const el1 = batteryInfo[index];
    for (let ki = 0; ki < pKey.length; ki++) {
      const el2Key = pKey[ki].key; // Correcte
      if (!el1[el2Key]) {
        isFound = 0;
        break;
      }
      if (el2Key === "has_man" && key === "battery_expiration") {
        isFound = 0;
        break;
      }
      for (let i2 = 0; i2 < el1[el2Key].length; i2++) {
        const ele2 = el1[el2Key][i2];
        if (
          ele2[key] &&
          ele2[key] != "" &&
          ele2[key] != "undefined-NaN-undefined"
        ) {
          isFound = 1;
          break;
        }
      }
      if (isFound) {
        break;
      }
    }
    if (isFound) {
      break;
    }
  }

  return isFound;
};

// export const CheckSpareBatteryTblCol = (batteryInfo, key) => {
//   let is_found = 0;
//   if (!batteryInfo) {
//     return 0;
//   }
//   //   console.log("barrety info", batteryInfo[0]);
//   Object.entries(batteryInfo[0]).forEach(([key, value]) => {
//     for (let i = 0; i < value.length; i++) {
//       const element = value[i];
//       console.log({ element, key });
//       if (element[key]) {
//         is_found = 1;
//         console.log({ is_found });
//         break;
//       }
//     }

//     // console.log("value", value);
//   });
// };

export const CheckSpareBatteryTblCol = (batteryInfo, key) => {
  let is_found = 0;
  if (!batteryInfo) {
    return 0;
  }
  if (key === "All") {
    const AllKey = [
      "battery_type_id",
      "battery_expiration",
      "manufactured_date",
      "battery_lot",
      "battery_uid",
    ];
    for (let i1 = 0; i1 < AllKey.length; i1++) {
      const e1 = AllKey[i1];
      for (let i2 = 0; i2 < batteryInfo.length; i2++) {
        const el2 = batteryInfo[i2];
        if (el2[e1] && el2.section_name != "charge_pack") {
          is_found = 1;
          break;
        }
      }
      if (is_found) {
        break;
      }
    }

    return is_found;
  }

  for (let index = 0; index < batteryInfo.length; index++) {
    const element = batteryInfo[index];
    console.log({ element });
    if (element[key]) {
      is_found = 1;
      break;
    }
  }

  return is_found;
};
/*
checkADTable = (batteryInfo,key) => {
    // batteryInfo.find((b1=>{
    // }))
    const pKey = [
        {key:'battery_type_id'},
        {key:'battery_expiration'},
        {key:'battery_lot'},
        {key:'battery_uid'},
        {key:'serial'},
        {key: 'v9_install'},
        {key: "install_before_date"},
        {key: 'date_installed'},
        {key:'manufactured_date'}        
    ];
    let is_found = 0;
    for (let index = 0; index < batteryInfo.length; index++) {
        const el1 = batteryInfo[index];
        for (let ki = 0; ki < pKey.length; ki++) {
            const el2 = pKey[ki].key;;
            for (let i2 = 0; i2 < el1.[el2].length; i2++) {
                const ele2 = el1?.[el2][i2];
                if(ele2?.[key]){
                    is_found = 1;
                    // return 1;
                    break;
                }
            }    
        }
        
    }
    return is_found;
} */
// account/storage-info

export function SortByProperty(array, propertyName) {
  if (
    !Array.isArray(array) ||
    array.length === 0 ||
    typeof propertyName !== "string"
  ) {
    // Check if the input is valid
    console.error(
      "Invalid input. Please provide a non-empty array of objects and a valid property name."
    );
    return;
  }

  // Use the sort method to sort the array based on the specified property
  array.sort(function (a, b) {
    // Convert property values to lowercase to ensure case-insensitive sorting
    const valueA = a[propertyName].toLowerCase();
    const valueB = b[propertyName].toLowerCase();

    if (valueA < valueB) {
      return -1;
    } else if (valueA > valueB) {
      return 1;
    } else {
      return 0;
    }
  });

  return array;
}

export const CalculateAEDList = (aeds) => {
  const resultArr = [];
  for (let a1 = 0; a1 < aeds?.length; a1++) {
    const aed1 = aeds[a1];
    let obj = {
      site_name: aed1.site_name,
      // site_id: 0,
      site_id: aed1.site_id || 0,
      data: [],
      standalone_data: aed1?.standalone_data || [],
    };
    for (let a2 = 0; a2 < aed1.data.length; a2++) {
      const aeds2d = aed1?.data[a2]?.aed_details;
      const allBatteries = aed1?.data[a2]?.batteryInfo || [];
      const allPads = aed1?.data[a2]?.allPads || [];
      const gateway_info = aeds2d?.gateway_info
        ? JSON.parse(aeds2d?.gateway_info)
        : [];
      obj.site_id = aeds2d?.site_id;
      // obj.standalone_data = aeds2d?.standalone_data || [];
      let obj2 = {
        aed_id: aeds2d?.aed_id,
        site_id: aeds2d?.site_id,
        serial_number: aeds2d?.serial_number,
        placement: aeds2d?.placement,
        brand_name: aed1.data[a2]?.aed_brand,
        battery_expiration: [],
        pads_expiration: [],
        last_check: FormatDate(aeds2d?.last_check),
        last_service: aeds2d?.last_service,
        rms_check: aeds2d?.rms_check,
        pediatric_key: aeds2d?.pediatric_key,
      };
      let si_obj = { title: "storage_info", data: [], img: "/alarm.svg" };
      // let si_obj = { title: "storage_info", data: [], img: '/Aed Cabinet.svg' };
      // let si_9v_install_obj = { title: "storage_info", data: [], img: '/Aed Cabinet.svg' };
      let si1 = aeds2d?.storage_info ? JSON.parse(aeds2d?.storage_info) : [];
      for (let si = 0; si < si1.length; si++) {
        const sie = si1[si];
        si_obj.data.push(FormatDate(sie?.expiry_date));
        // if(sie?.v9_Installed_Date){
        //     si_9v_install_obj.data.push(FormatDate(sie?.v9_Installed_Date));
        // }
      }
      if (obj2?.serial_number === "516351651") {
        console.log({ SI: si_obj });
      }
      const has_9v_arr = [];
      const Spare_has_9v_arr = [];
      const SparebatteryIconArr = [];
      const batteryIconArr = [];
      const batteryChargeArr = [];
      const SparebatteryChargeArr = [];
      const manufectureDateArr = [];
      const SparesmanufectureDateArr = [];
      const sp10pakArr = [];
      const BateryDateArr = [];

      for (let a3 = 0; a3 < allBatteries.length; a3++) {
        const be = allBatteries[a3];
        let exp_data = "";
        if (CheckDate(be.battery_expiration)) {
          exp_data = be.battery_expiration;
        } else {
          exp_data = be.manufactured_date;
        }
        const btObj = {
          title: "spare_battery_info",
          data: SparebatteryIconArr,
          img: "/Battery.png",
          is_red: 1,
        };
      }

      /* 
                        if(aed1.site_name.trim()==='Testing'){
                            } */
      const v9BOlIconarr = [];
      let is_bt_old = "";
      for (let a3 = 0; a3 < allBatteries.length; a3++) {
        const be = allBatteries[a3];
        let exp_data = ""; // has_10pk
        if (CheckDate(be.battery_expiration)) {
          exp_data = be.battery_expiration;
        } else {
          exp_data = be.manufactured_date;
        }

        if (be.section_name === "has_10pk" && Number(be.is_spare) == 1) {
          sp10pakArr.push(be.install_before_date);
        }
        if (
          be.section_name != "has_man" &&
          be.section_name != "has_man_spare"
        ) {
          if (
            be.section_name != "charge_pack" &&
            be.section_name != "spare_charge_pack"
          ) {
            if (
              be.section_name === "has_9v" ||
              be.section_name === "has_9v_spare"
            ) {
              let exp_data_1 = moment(exp_data).add(1, "years");
              if (be.is_spare) {
                if (is_bt_old) {
                  has_9v_arr.push(is_bt_old);
                }
                const Shas9vObj = {
                  title: "spare_has_9v_batteries",
                  data: [exp_data],
                  img: "/spare-battery.png",
                  is_red: 1,
                };
                Spare_has_9v_arr.push(exp_data);
                Shas9vObj.data = [exp_data];
                const has9vObj = {
                  title: "has_9v_batteries",
                  data: [exp_data],
                  img: "/Battery.png",
                  is_red: 1,
                };
                if (is_bt_old) {
                  has9vObj.data = [is_bt_old];
                }
                v9BOlIconarr.push(has9vObj);
                v9BOlIconarr.push(Shas9vObj);
              } else {
                // batteryIconArr.push(exp_data);
                has_9v_arr.push(exp_data);
                if (!is_bt_old) {
                  is_bt_old = exp_data;
                  Spare_has_9v_arr.push(exp_data);
                  // Spare_has_9v_arr.push(exp_data);
                }
                const has9vObj = {
                  title: "has_9v_batteries",
                  data: [exp_data],
                  img: "/Battery.png",
                  is_red: 1,
                };
                const Shas9vObj = {
                  title: "spare_has_9v_batteries",
                  data: [exp_data_1],
                  img: "/spare-battery.png",
                  is_red: 1,
                };
                if (is_bt_old) {
                  has9vObj.data = [is_bt_old];
                }
                v9BOlIconarr.push(has9vObj);
                v9BOlIconarr.push(Shas9vObj);
              }
            } else {
              if (be.is_spare) {
                SparebatteryIconArr.push(exp_data);
              } else {
                batteryIconArr.push(exp_data);
              }
            }
          } else {
            if (
              be.section_name === "has_9v" ||
              be.section_name === "has_9v_spare"
            ) {
              if (be.is_spare) {
                SparebatteryChargeArr.push(exp_data);
              } else {
                batteryChargeArr.push(exp_data);
              }
            } else {
              if (be.is_spare) {
                SparebatteryChargeArr.push(exp_data);
              } else {
                batteryChargeArr.push(exp_data);
              }
            }
          }
        } else {
          if (be.is_spare) {
            SparesmanufectureDateArr.push(be.manufactured_date);
          } else {
            manufectureDateArr.push(exp_data);
          }
        }
      }
      // BatteryMfgr Menufecting icon

      const gieArr = [];
      for (let i12 = 0; i12 < gateway_info.length; i12++) {
        const gie = gateway_info[i12];
        if (gie?.expiry_date) {
          gieArr.push(gie?.expiry_date);
        }
      }
      const SbObj = {
        title: "spare_battery_info",
        data: SparebatteryIconArr,
        img: "/Battery.png",
        is_red: 1,
      };
      const sp10pak = {
        title: "batttery_10_Pakc",
        data: sp10pakArr,
        img: "/installby.svg",
        is_red: 0,
      };
      const mnuObj = {
        title: "manufetchDate",
        data: manufectureDateArr,
        img: "/Battery.png",
        is_red: 0,
      };
      const SparemnuObj = {
        title: "manufetchDate",
        data: SparesmanufectureDateArr,
        img: "/BatteryMfgr.svg",
        is_red: 0,
      };
      const chrgObj = {
        title: "Charge_pack",
        data: batteryChargeArr,
        img: "/Battery.png",
        is_red: 1,
      };
      const SpchrgObj = {
        title: "spare_Charge_pack",
        data: SparebatteryChargeArr,
        img: "/Battery.png",
        is_red: 1,
      };
      const has9vObj = {
        title: "has_9v_batteries",
        data: has_9v_arr,
        img: "/Battery.png",
        is_red: 1,
      };
      const Shas9vObj = {
        title: "spare_has_9v_batteries",
        data: Spare_has_9v_arr,
        img: "/spare-battery.png",
        is_red: 1,
      };
      const bObj = {
        title: "battery_info",
        data: batteryIconArr,
        img: "/Battery.png",
        is_red: 1,
      };
      const gieObj = {
        title: "gateway_info",
        data: gieArr,
        img: "/wifie-icon.png",
        is_red: 1,
      };
      if (obj2.brand_name === "Defibtech Lifeline") {
        v9BOlIconarr.push(si_obj);
        obj2.battery_expiration = v9BOlIconarr;
      } else {
        obj2.battery_expiration = [
          bObj,
          mnuObj,
          chrgObj,
          has9vObj,
          SbObj,
          sp10pak,
          SparemnuObj,
          SpchrgObj,
          Shas9vObj,
          si_obj,
          gieObj,
        ];
      }

      const adultPadsArr = [];
      const SpareadultPadsArr = [];
      const PediraticPadsArr = [];
      const SparePediraticPadsArr = [];
      const chargeExpArr = [];
      for (let a4 = 0; a4 < allPads.length; a4++) {
        const pe = allPads[a4];
        if (
          pe.section_name != "charge_pack" &&
          pe.section_name != "spare_charge_pack"
        ) {
          if (
            pe.section_name == "pediatric_pad_info" ||
            pe.section_name == "spare_padric_pad_info" ||
            pe.section_name == "pediatric_pak_pad_info" ||
            pe.section_name == "spare_padric_pak_pad"
          ) {
            if (pe.is_spare) {
              SparePediraticPadsArr.push(pe.pad_expiration);
            } else {
              PediraticPadsArr.push(pe.pad_expiration);
            }
          } else {
            if (pe.is_spare) {
              SpareadultPadsArr.push(pe.pad_expiration);
            } else {
              adultPadsArr.push(pe.pad_expiration);
            }
          }
        } else {
          chargeExpArr.push(pe.pad_expiration);
        }
      }

      let obj3 = [
        {
          title: "adult_pad_info",
          data: adultPadsArr,
          img: "/people-Group.svg",
        },
        {
          title: "spare_adult_pad_info",
          data: SpareadultPadsArr,
          img: "/people-Group.svg",
        },
        { title: "charge Pad", data: chargeExpArr, img: "/people-Group.svg" },
        {
          title: "pediatric_pad_info",
          data: PediraticPadsArr,
          img: "/child-Vector.png",
        },
        {
          title: "spare_padric_pad_info",
          data: SparePediraticPadsArr,
          img: "/child-Vector.png",
        },
        // { title: 'spare_padric_pad_info', data: Chargepad2Arr, img: "/people-Group.svg" },
      ];
      obj2.pads_expiration = obj3;
      obj.data.push(obj2);
    }
    resultArr.push(obj);
  }
  return resultArr;
};

// export const RenderDate = (date,is_red=1)=> {
// 	const currentDate = moment();
// 	// Convert the input date to a moment object
// 	const inputMoment = moment(date);

// 	// Compare the input date with the current date
// 	const isInputDateBeforeCurrent = inputMoment.isBefore(currentDate.subtract(30, 'days'));
// 	if(!is_red){
// 		return <span >{date}</span>;
// 	}
// 	if(isInputDateBeforeCurrent){
// 		return <span className="text-danger" >{date}</span>;
// 	}else{
// 		return <span >{date}</span>;
// 	}
// }
export const RenderDate = (date, is_red = 1) => {
  if (!date) {
    return "";
  }
  date = FormatDate(date);
  const currentDate = moment();
  // Convert the input date to a moment object
  const inputMoment = moment(date, "MM/DD/YYYY"); // assuming date format is MM/DD/YYYY
  // const  checkDate = moment('04/20/2002');
  // Calculate the difference in days
  const daysDifference = inputMoment.diff(currentDate, "days");

  // Check if the input date is before the current date or within the next 30 days
  const isInputDateRed =
    daysDifference < 0 || (daysDifference >= 0 && daysDifference <= 30);

  if (!is_red) {
    return <span>{FormatDate(date)}</span>;
  }
  return (
    <span className={isInputDateRed ? "text-danger" : ""}>
      {FormatDate(date)}
    </span>
  );
};

export const BatteryInfocolumnList = [
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
  { key: "battery_serial", is_default: 0, title: "Serial" },
  {
    key: "v9_install",
    is_default: 0,
    title: "v9 Install",
  },
  {
    key: "install_9v_date",
    is_default: 0,
    title: "9v Install",
  },
  {
    key: "install_before_date",
    is_default: 0,
    title: "Install Before Date",
  },
  {
    key: "install_date",
    is_default: 0,
    title: "Install Date",
  },
];

export const section_name_list = {
  charge_pack: "charge_pack",
  has_battery: "has_battery",
  has_9v: "has_9v",
  has_man: "has_man",
  has_installby: "has_installby",
  has_10pk: "has_10pk",
  has_battery_spare: "has_battery_spare",
  has_installby_spare: "has_installby_spare",
  has_man_spare: "has_man_spare",
  has_10pk_spare: "has_10pk_spare",
};

import moment from "moment";
import { AccountContactDetails, DecryptToken } from "./BasicFn";
import { CallGETAPI } from "./API";

export const AccountStatus = {
  1: "Good",
  2: "Payment Hold",
  3: "No Longer Customer",
  4: "Do not Contact",
};

export const ContactStatus = {
  1: "Active",
  2: "Deceased",
  3: "InActive",
  4: "Retired",
};

export const formatPhoneNumber = (phoneNumberString) => {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return null;
};

// validate form
export const validatePhone = (phoneNumberString) => {
  if (
    phoneNumberString?.length > 0 &&
    (phoneNumberString?.length < 10 || phoneNumberString?.length > 10)
  ) {
    return false;
  } else {
    return true;
  }
};

// prepare data for react select
export const prepareOptions = (optionsData, key, value) => {
  if (optionsData) {
    let allData = [];
    for (let i = 0; i < optionsData.length; i++) {
      let singleData = {};
      singleData.value = optionsData[i][key];
      singleData.label = optionsData[i][value];
      allData.push(singleData);
    }
    return allData;
  } else {
    return [];
  }
};

export const getImageName = (image) => {
  if (image) {
    let check = image.substring(image.lastIndexOf("/") + 1, image.length);
    return check;
  }
  return image;
  // let  last = image.substring(image.lastIndexOf("/") + 1, image.length);
  // return last;
};

// get logged in user
export const getLoggedInUser = () => {
  let token = getToken();
  if (!token) {
    return;
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

  return jsonPayload;
};

// sort data
export const sortData = (data, key) => {
  return data.sort((a, b) => a[key].localeCompare(b[key]));
};

// add $ sign in front
export const addDollarSign = (value) => {
  value = value.replace("$", "");
  const regex = /^\d*\.?\d*$/;

  if (regex.test(value)) {
    return "$" + value;
  } else {
    return "$";
  }
};
export const RemoveDollarSign = (val) => {
  return val?.length > 1 ? val.replace("$", "") : "";
};

export const CalendarIcon = () => {
  return <img src="/calendar.svg" alt="calendar" />;
};

export const CalendarEquipmentIcon = () => {
  return <img src="/calendarequipment.svg" alt="calendar" />;
};

export const FormatDate = (date) => {
  if (!date) {
    return "";
  }
  let dateNew = moment(date).format("MM/DD/YYYY");
  return dateNew != "Invalid date" ? dateNew : false;
};
export const FormatDateTime = (datetime) => {
  return moment(datetime).format("MM/DD/YYYY");
};
export const FormatDateWithTime = (datetime) => {
  return moment(datetime).format("MM/DD/YYYY LT");
};

export const relatedToListData = [
  { label: "Account", value: "Account" },
  { label: "Contact", value: "Contact" },
  { label: "Equipment", value: "Equipment" },
  { label: "AED", value: "AED" },
  { label: "AED Check", value: "AED Check" },
  { label: "Service Check", value: "Service Check" },
];

export const HasUnknownValue = (obj) => {
  // Iterate over each key in the object
  for (let key in obj) {
    // Check if the value is "unknown"
    if (obj[key] === "unknown") {
      return 1; // Found "unknown" value, return true
    }

    // If the value is an array, recursively check its elements
    if (Array.isArray(obj[key])) {
      for (let i = 0; i < obj[key].length; i++) {
        if (HasUnknownValue(obj[key][i])) {
          return 1; // Found "unknown" value, return true
        }
      }
    }

    // If the value is an object, recursively check its properties
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (HasUnknownValue(obj[key])) {
        return 1; // Found "unknown" value, return true
      }
    }
  }

  return 0; // No "unknown" value found
};

export const Debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

export const RenderWithOutZero = (val) => {
  if (val === 0 || val === "0") {
    return "";
  }
  return val;
};

//   export const getToken = ()=>{
// 	const is_user = Number(sessionStorage.getItem('is_user') || 0);
// 	console.log({is_user});
// 	if(is_user){
// 		return sessionStorage.getItem('ross_token');
// 	}
// 	return localStorage.getItem('ross_token');
//   }

//   const isValidJSON = (str) => {
//     try {
//         JSON.parse(str);
//         return true;
//     } catch (e) {
//         return false;
//     }
// };
// export const GetProfile = ()=>{
// 	const is_user = Number(sessionStorage.getItem('is_user') || 0);
// 	const user = is_user && is_user == 1 ? (sessionStorage.getItem("ross-profile")) : (localStorage.getItem("ross-profile"));
// 	// console.log({userProfile: user});
// 	// const userProfile = isValidJSON(user) ? JSON.parse(user) : user;
// 	return user;
// }

export const getToken = () => {
  const is_user = Number(sessionStorage.getItem("is_user") || 0);
  console.log({is_user})
  if (is_user && is_user == 1) {
    return sessionStorage.getItem("ross_token");
  }
  return localStorage.getItem("ross_token");
};
export const GetProfile = ()=>{
	const is_user = Number(sessionStorage.getItem('is_user') || 0);
	const user = (is_user && is_user == 1) ? sessionStorage.getItem("ross-profile") : localStorage.getItem("ross-profile");
	const userData = JSON.parse(user);
	return userData;
}

// export const GetProfile = async () => {
//   const isUser = Number(sessionStorage.getItem("is_user") || 0);

//   const getUserProfile = async () => {
//     if (isUser === 1) {
//       return sessionStorage.getItem("ross-profile");
//     } else {
//       return localStorage.getItem("ross-profile");
//     }
//   };

//   const user = await getUserProfile();

//   if (user) {
//     const useData = JSON.parse(user);
//     return useData;
//   }
//   // else {
//   //   return null;
//   // }
// };

export const getPermission = () => {
  const is_user = Number(sessionStorage.getItem("is_user") || 0);
  const permissions =
    is_user && is_user == 1
      ? sessionStorage.getItem("permissions")
      : localStorage.getItem("permissions");
  return permissions;
};

export const setPermission = (data) => {
  const is_user = Number(sessionStorage.getItem("is_user") || 0);
  if (is_user) {
    sessionStorage.setItem("permissions", data);
  } else {
    localStorage.setItem("permissions", data);
  }
  return is_user;
};

export const userSiteTabData = async (userAccountId) => {
  const tokenData = DecryptToken();
  const accountId = tokenData?.account_id;
  let result = await CallGETAPI("user/user-site-tab/" + userAccountId);
  if (result?.status) {
    return result?.data?.data?.site_details || [];
  }
  // }
};

export const userContactTabData = async (userAccountId) => {
  const tokenData = DecryptToken();
  const accountId = tokenData?.account_id;
  let result = await CallGETAPI("user/user-contact-tab/" + userAccountId);
  if (result?.status) {
    return result?.data?.data?.contact_list || [];
  }
};

export const userNotesTabData = async (userAccountId) => {
  const tokenData = DecryptToken();
  const accountId = tokenData?.account_id;
  let result = await CallGETAPI("user/notes-tab/" + userAccountId);
  if (result) {
    return result?.data?.data || [];
  }
};

export const userSupportTabData = async (userAccountId) => {
  const tokenData = DecryptToken();
  const accountId = tokenData?.account_id;
  if (userAccountId == accountId) {
    let result = await CallGETAPI("user/support-list");
    if (result?.status) {
      const supportArrList = result?.data?.ticketList || [];
      // var supportArr = [];
      // supportArr = result?.data?.ticketList?.assignto.concat(
      //   result?.data?.ticketList?.createdby,
      //   result?.data?.ticketList?.closed
      // );
      return supportArrList;
    }
  } else {
    const result = await CallGETAPI(
      "support/ticket-by-account/" + userAccountId
    );

    if (result?.status) {
      return result?.data?.ticketList || [];
    }
  }
};

export const userEquipmentTabData = async (userAccountId) => {
  const tokenData = DecryptToken();
  const accountId = tokenData?.account_id;
    const result = await CallGETAPI(
      "user/user-equipment-tab/" + userAccountId
    );
    if (result?.status) {
      return result;
    }
};

// export const BASE_API = "https://dev.mightyegor.com/api/";
// export const BASE_API = "http://localhost:8000/api/";
// // export const BASE_API = 'http://192.168.29.204:8000/api/';
// export const BASE_API_NEW = "https://dev.mightyegor.com/api/";
// export const BASE_API_TECH = "https://dev.mightyegor.com/api/";
// export const AED_IMG_BASE = "https://dev.mightyegor.com/aedImages/";

import { getToken } from "./Common";


export const BASE_API       = window.BASEURL+"/api/";
export const BASE_API_NEW = window.BASEURL + "/api/";
export const BASE_API_TECH = window.BASEURL + "/api/";
export const AED_IMG_BASE = window.BASEURL + "/aedImages/";


// export const BASE_API = 'https://backend.mightyegor.com/api/';
// export const BASE_API_NEW = 'https://backend.mightyegor.com/api/';
// export const BASE_API_TECH = 'https://backend.mightyegor.com/api/';
// export const AED_IMG_BASE = 'https://backend.mightyegor.com/aedImages/';

export async function CallGETAPI(url, params = "", headers = {}) {
  try {
    let token = getToken();
    let AllHeaders = { ...headers };
    if (token) {
      AllHeaders = { Authorization: "Bearer " + token, ...headers };
    }
    let res = await fetch(BASE_API + url + params, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AllHeaders,
      },
    });

    if (!res.ok) {
      return { status: false, msg: "No Data Found", data: [] };
    }
    let resultData = await res.json();
    return { status: true, msg: "", data: resultData };
  } catch (e) {
    return { status: false, msg: e.message, data: [] };
  }
}

export async function CallGETPreveledge(url, params = "", headers = {}) {
  try {
    let token = localStorage.getItem('ross_token');
    let AllHeaders = { ...headers };
    if (token) {
      AllHeaders = { Authorization: "Bearer " + token, ...headers };
    }
    let res = await fetch(BASE_API + url + params, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AllHeaders,
      },
    });

    if (!res.ok) {
      return { status: false, msg: "No Data Found", data: [] };
    }
    let resultData = await res.json();
    return { status: true, msg: "", data: resultData };
  } catch (e) {
    return { status: false, msg: e.message, data: [] };
  }
}

export async function CallGETAPI2(url, params = "", headers = {}) {
  try {
    let token = getToken();
    let AllHeaders = { ...headers };
    if (token) {
      AllHeaders = { Authorization: "Bearer " + token, ...headers };
    }
    let res = await fetch(url + params, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AllHeaders,
      },
    });

    if (!res.ok) {
      return { status: false, msg: "No Data Found", data: [] };
    }
    let resultData = await res.json();
    return { status: true, msg: "", data: resultData };
  } catch (e) {
    return { status: false, msg: e.message, data: [] };
  }
}

export async function CallPOSTAPI(url, params = [], headers = {}) {
  try {
    let token = getToken(); 
    let AllHeaders = { ...headers };
    if (token) {
      AllHeaders = { Authorization: "Bearer " + token, ...headers };
    }

    let res = await fetch(BASE_API + url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...AllHeaders },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      return { status: false, msg: "No Data Found", data: [] };
    }
    let resultData = await res.json();
    return { status: true, msg: resultData?.msg, data: resultData };
  } catch (e) {
    return { status: false, msg: e.message, data: [] };
  }
}

export async function CallDetails(params = "", headers = {}) {
  try {
    let token = getToken();
    let AllHeaders = { ...headers };
    if (token) {
      AllHeaders = { Authorization: "Bearer " + token, ...headers };
    }
    let res = await fetch(BASE_API + "account/account_info/" + params, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AllHeaders,
      },
    });

    if (!res.ok) {
      return { status: false, msg: "No Data Found", data: [] };
    }
    let resultData = await res.json();
    return { status: true, msg: "", data: resultData };
  } catch (e) {
    return { status: false, msg: e.message, data: [] };
  }
}

export async function CallPOSTData(params = [], data, headers = {}) {
  try {
    let token = getToken();
    let AllHeaders = { ...headers };
    if (token) {
      AllHeaders = { Authorization: "Bearer " + token, ...headers };
    }

    let res = await fetch(BASE_API + "account/update-account-info/" + params, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...AllHeaders },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return { status: false, msg: "No Data Found", data: [] };
    }
    let resultData = await res.json();
    return { status: true, msg: "", data: resultData };
  } catch (e) {
    return { status: false, msg: e.message, data: [] };
  }
}

export async function CallPOSTAPINEW(url, params = [], headers = {}) {
  try {
    let token = getToken();
    let AllHeaders = { ...headers };
    if (token) {
      AllHeaders = { Authorization: "Bearer " + token, ...headers };
    }

    let res = await fetch(BASE_API_NEW + url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...AllHeaders },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      return { status: false, msg: "No Data Found", data: [] };
    }
    let resultData = await res.json();
    return { status: true, msg: "", data: resultData };
  } catch (e) {
    return { status: false, msg: e.message, data: [] };
  }
}

export async function CallGETAPINEW(url, params = "", headers = {}) {
  try {
    let token = getToken();
    let AllHeaders = { ...headers };
    if (token) {
      AllHeaders = { Authorization: "Bearer " + token, ...headers };
    }
    let res = await fetch(BASE_API_NEW + url + params, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AllHeaders,
      },
    });

    if (!res.ok) {
      return { status: false, msg: "No Data Found", data: [] };
    }
    let resultData = await res.json();
    return { status: true, msg: "", data: resultData };
  } catch (e) {
    return { status: false, msg: e.message, data: [] };
  }
}

export async function CallPOSTAPINEWTech(url, params = [], headers = {}) {
  try {
    let token = getToken();
    let AllHeaders = { ...headers };
    if (token) {
      AllHeaders = { Authorization: "Bearer " + token, ...headers };
    }

    let res = await fetch(BASE_API_TECH + url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...AllHeaders },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      return { status: false, msg: "No Data Found", data: [] };
    }
    let resultData = await res.json();
    return { status: true, msg: "", data: resultData };
  } catch (e) {
    return { status: false, msg: e.message, data: [] };
  }
}

export async function CallGETAPINEWTech(url, params = "", headers = {}) {
  try {
    let token = getToken();
    let AllHeaders = { ...headers };
    if (token) {
      AllHeaders = { Authorization: "Bearer " + token, ...headers };
    }
    let res = await fetch(BASE_API_TECH + url + params, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AllHeaders,
      },
    });

    if (!res.ok) {
      return { status: false, msg: "No Data Found", data: [] };
    }
    let resultData = await res.json();
    return { status: true, msg: "", data: resultData };
  } catch (e) {
    return { status: false, msg: e.message, data: [] };
  }
}

export async function CallPOSTAPINEWFileUpload(url, params, headers = {}) {
  try {
    let token = getToken();

    let AllHeaders = { ...headers };
    if (token) {
      AllHeaders = { Authorization: "Bearer " + token, ...headers };
    }
    //             // headers:{'Content-Type':'application/json',...AllHeaders},

    let res = await fetch(BASE_API_NEW + url, {
      method: "POST",
      headers: AllHeaders,
      body: params,
    });

    if (!res.ok) {
      return { status: false, msg: "No Data Found", data: [] };
    }
    let resultData = await res.json();
    return { status: true, msg: "", data: resultData };
  } catch (e) {
    return { status: false, msg: e.message, data: [] };
  }
}

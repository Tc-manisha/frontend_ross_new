import React, { useEffect, useState } from "react";
import {
  BatteryTypebyModel,
  FetchAccountDetails,
  GetAccountList,
  GetAedBrands,
  GetRMSBrand,
  PadTypeByModal,
  PrepareOptions,
} from "../../../helper/BasicFn";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import MessageHandler from "../../../components/common/MessageHandler";
import moment from "moment/moment";
import { Form } from "react-bootstrap";
import { FormatDate, HasUnknownValue } from "../../../helper/Common";
import CustomToggleButton from "../../../components/common/toggleSwitch/CustomToggleButton";
import { useDispatch, useSelector } from "react-redux";
import NewStdlnAedForm from "../../../components/forms/NewStdlnAedForm";
import StdlnParentBatteryInfo from "../../../components/forms/subaed_forms/StdlnParentBatteryInfo";
import StdlnChargePakInfo from "../../../components/forms/subaed_forms/StdlnChargePakInfo";
import StdlnAdultPakInfo from "../../../components/forms/subaed_forms/StdlnAdultPakInfo";
import StdlnAdultPadPakInfo from "../../../components/forms/subaed_forms/StdlnAdultPadPakInfo";
import StdlnPediatricPadInfo from "../../../components/forms/subaed_forms/StdlnPediatricPadInfo";
import StdlnPediatricPadPakInfo from "../../../components/forms/subaed_forms/StdlnPediatricPadPakInfo";
import SubHeading from "../../../components/header/SubHeading";
import { updatePermission } from "../../../redux/slices/StandloneAEDSlice";
import { Box } from "@mui/material";

export function checkIfAnyKeyHasValue(arrayOfData) {
  if (!Array.isArray(arrayOfData)) {
    return false;
  }
  for (const jsonData of arrayOfData) {
    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        if (jsonData[key]) {
          return true; // Return true if any key has a value
        }
      }
    }
  }
  return false; // Return false if none of the keys have a value
}

export function updateJsonArrayWithUnknown(arrayOfData) {
  const updatedArray = arrayOfData.map((jsonData) => {
    const updatedJsonData = { ...jsonData };

    for (const key in updatedJsonData) {
      if (updatedJsonData.hasOwnProperty(key) && !updatedJsonData[key]) {
        updatedJsonData[key] = "unknown";
      }
    }

    return updatedJsonData;
  });

  return updatedArray;
}

const NewStandloneAcce = () => {
  const all_condition_true = 0;
  // const {id}
  // const routes = useParams();
  const { accountId, siteId } = useParams();
  const navigate = useNavigate();

  console.log(accountId, siteId);
  const AccId = accountId;
  const SiteID = siteId;

  const [AccLidatData, setaccLidatData] = useState([]);
  const [brandData, setBrandData] = useState([]);

  const [RmsDropdown, SetRmsDropdown] = useState([]);
  const [BatteryList, setBatteryList] = useState([]);
  const [FormMsg, setFormMsg] = useState({ type: true, msg: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const PermissionRedux = useSelector(
    (state) => state?.StdlnAED_manager?.permissions
  );

 const chargepakRequired = PermissionRedux?.accessory_type == "Charge Pak";
  console.log(chargepakRequired);
  const [Permissins, setPermission] = useState({
    auto: 0,
    brand_id: 0,
    created_by_id: null,
    created_date: "2023-05-15T15:53:07.000Z",
    discontinued: 0,
    display: 0,
    gateway_lifespan: 0,
    has_9v: 0,
    has_10pk: 0,
    has_battery: 0,
    has_builtin_rms: 0,
    has_chargepak: 0,
    has_gateway: 0,
    has_installby: 0,
    has_man: 0,
    has_pad: 0,
    has_padpak: 0,
    has_ped_key: 0,
    has_ped_pad: 0,
    has_pedpak: 0,
    id: 0,
    image_file_name: "PowerheartAEDG3-200.jpg",
    model_name: "Powerheart G3",
    model_partnumber: "9300C-001",
    modified_by_id: null,
    modified_date: null,
    semi: 0,
    v_battery: 0,
    warranty: 0,
  });

  const DefaultValue = {
    // General Information
    account_id: AccId,
    account: AccId,
    site: SiteID || 0,
    site_id: SiteID || "",
    brand: "",
    model_name: "",
    part_number: "",
    sub_model: "",
    serial: "",
    serial_number: "",
    battery_serial: "",
    asset: "",
    other1_lable: "",
    other2_lable: "",
    other1: "",
    other2: "",
    file_name: "",
    placement: "",
    purchase_type: "",
    purchase_date: "",
    rms_brand: "",
    warenty_date: "",

    no_spares_toggle: 1,
    no_pediatric_toggle: 1,
    RMS_toggle: 0,
    out_of_service_toggle: 0,
    accessory_type: "",
    dni: 0,

    has_battery: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
        quantity: "",
      },
    ],

    has_9v: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
        quantity: "",
      },
    ],

    has_installby: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
        quantity: "",
      },
    ],

    has_man: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
        quantity: "",
      },
    ],

    has_10pk: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
        quantity: "",
      },
    ],

    battery_info: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        serial: "",
        battery_serial: "",
        quantity: "",
      },
    ],

    battery_info1: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_udi: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
      },
    ],

    ChargePakInformation: [
      {
        charge_pak_part: "",
        charge_pak_uiid: "",
        battery_expiration: "",
        battery_lot: "",
        pad_1_part: "",
        pad_1_expiration: "",
        pad_1_lot: "",
        pad_2_part: "",
        pad_2_expiration: "",
        pad_2_lot: "",
        quantity: "",
      },
    ],

    AdultPadInformation: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
        quantity: "",
      },
    ],

    AdultPadPakInfo: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
        quantity: "",
      },
    ],

    PediatricPadInformation: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
        quantity: "",
      },
    ],
    PediatricPakPadInformation: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
        quantity: "",
      },
    ],
    pediatric_key: false,
  };
  const [formData, setFormData] = useState(DefaultValue);

  // const [accountData,setAccountData] = useState(null);
  const fetchAccount = async () => {
    if (formData?.account) {
      let fd = { ...formData };
      let res = await FetchAccountDetails(formData.account);

      // setAccountData(res);
      // aed_check_length
      let len = res?.aed_check_length || "15 Days";
      let len_days = len.split(" ")?.[0];
      let crrDate = moment();
      let check_date = moment(crrDate).add(len_days, "day");

      fd.other1_lable = res?.extra_field1;
      fd.other2_lable = res?.extra_field2;
      fd.check_date = check_date;
      setFormData(fd);
    }
  };

  const onLoad = async () => {
    let AccoutnList = await GetAccountList();
    let brandList = await GetAedBrands();
    let RmsBList = await GetRMSBrand();
    // setCountryList(brandData)

    let accListData = AccoutnList?.data?.data?.account || [];
    let bradlistData = brandList?.data || [];
    // let brandData =  (bradlistData.length > 0) ? PrepareOptions(bradlistData, 'id', 'AED_brands') : [];

    SetRmsDropdown(RmsBList);
    setaccLidatData(accListData);
    setBrandData(bradlistData);
  };

  const [padList, setPadList] = useState([]);

  const fetchAEDPads = async () => {
    let result = await PadTypeByModal(formData?.model_name);
    setPadList(result);
  };

  // formData?.model_name;
  // useEffect(()=>{},[formData?.model_name]);

  const getBatteryType = async () => {
    let betteryData = await BatteryTypebyModel(formData?.model_name);

    if (betteryData) {
      setBatteryList(betteryData);
    }
  };

  const handleInput = (e) => {
    let val = e.target.value;
    let name = e.target.name;
    setFormData((old) => ({ ...old, [name]: val }));
  };
  const handleCheckBox = (e) => {
    if (e.target.type == "checkbox") {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.checked }));
      noToogleHandler(e);
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
    }
  };

  // no toogle handle
  const noToogleHandler = (e) => {
    const name = e.target.name;
    const value = e.target.checked;
    let FD = { ...formData };

    setFormData((old) => ({ ...old, [name]: value }));
    if (name == "no_battery_spare_toggle") {
      let info = fillArrayValuesUnknown(FD?.has_battery_spare, value);
      setFormData((old) => ({ ...old, ["has_battery_spare"]: info }));
    } else if (name == "no_9v_spare_toggle") {
      let info = fillArrayValuesUnknown(FD?.has_9v_spare, value);
      setFormData((old) => ({ ...old, ["has_9v_spare"]: info }));
    } else if (name == "no_installby_spare_toggle") {
      let info = fillArrayValuesUnknown(FD?.has_installby_spare, value);
      setFormData((old) => ({ ...old, ["has_installby_spare"]: info }));
    } else if (name == "no_has_10pk_spare_toggle") {
      let info = fillArrayValuesUnknown(FD?.has_10pk_spare, value);
      setFormData((old) => ({ ...old, ["has_10pk_spare"]: info }));
    } else if (name == "no_has_man_spare_toggle") {
      let info = fillArrayValuesUnknown(FD?.has_man_spare, value);
      setFormData((old) => ({ ...old, ["has_man_spare"]: info }));
    } else if (name == "no_spare_charge_pak_info_toggle") {
      let info = fillArrayValuesUnknown(FD?.SpareChargePakInformation, value);
      setFormData((old) => ({ ...old, ["SpareChargePakInformation"]: info }));
    } else if (name == "no_spare_adult_pak_info_toggle") {
      let info = fillArrayValuesUnknown(FD?.SpareAdultPadInfo, value);
      setFormData((old) => ({ ...old, ["SpareAdultPadInfo"]: info }));
    } else if (name == "no_spare_adult_pad_pak_info_toggle") {
      let info = fillArrayValuesUnknown(FD?.SpareAdultPadPakInfo, value);
      setFormData((old) => ({ ...old, ["SpareAdultPadPakInfo"]: info }));
    } else if (name == "no_spare_padric_pad_info_toggle") {
      let info = fillArrayValuesUnknown(FD?.sparePadricPadInfo, value);
      setFormData((old) => ({ ...old, ["sparePadricPadInfo"]: info }));
    } else if (name == "no_spare_padric_pad_pak_info_toggle") {
      let info = fillArrayValuesUnknown(FD?.sparePadricPakPad, value);
      setFormData((old) => ({ ...old, ["sparePadricPakPad"]: info }));
    } else if (name == "no_has_battery_toggle") {
      let info = fillArrayValuesUnknown(FD?.has_battery, value);
      setFormData((old) => ({ ...old, ["has_battery"]: info }));
    } else if (name == "no_has_9v_toggle") {
      let info = fillArrayValuesUnknown(FD?.has_9v, value);
      setFormData((old) => ({ ...old, ["has_9v"]: info }));
    } else if (name == "no_has_installby_toggle") {
      let info = fillArrayValuesUnknown(FD?.has_installby, value);
      setFormData((old) => ({ ...old, ["has_installby"]: info }));
    } else if (name == "no_has_man_toggle") {
      let info = fillArrayValuesUnknown(FD?.has_man, value);
      setFormData((old) => ({ ...old, ["has_man"]: info }));
    } else if (name == "no_has_10pk_toggle") {
      let info = fillArrayValuesUnknown(FD?.has_10pk, value);
      setFormData((old) => ({ ...old, ["has_10pk"]: info }));
    } else if (name == "no_has_chargepak_toggle") {
      let info = fillArrayValuesUnknown(FD?.ChargePakInformation, value);
      setFormData((old) => ({ ...old, ["ChargePakInformation"]: info }));
    } else if (name == "no_has_pad_toggle") {
      let info = fillArrayValuesUnknown(FD?.AdultPadInformation, value);
      setFormData((old) => ({ ...old, ["AdultPadInformation"]: info }));
    } else if (name == "no_has_padpak_toggle") {
      let info = fillArrayValuesUnknown(FD?.AdultPadPakInfo, value);
      setFormData((old) => ({ ...old, ["AdultPadPakInfo"]: info }));
    } else if (name == "no_has_pedpad_toggle") {
      let info = fillArrayValuesUnknown(FD?.PediatricPadInformation, value);
      setFormData((old) => ({ ...old, ["PediatricPadInformation"]: info }));
    } else if (name == "no_has_pedpak_toggle") {
      let info = fillArrayValuesUnknown(FD?.PediatricPakPadInformation, value);
      setFormData((old) => ({ ...old, ["PediatricPakPadInformation"]: info }));
    }
  };

  // pass value to unknown
  const fillArrayValuesUnknown = (array, toogleValue) => {
    const newArray = array.map((obj) => {
      const updatedObj = {};
      for (const key in obj) {
        updatedObj[key] = toogleValue ? "unknown" : "";
      }
      return updatedObj;
    });

    return newArray;
  };

  const addMorebattery_info = (type) => {
    if (type === "add") {
      let arr = { ...formData };
      let crr = arr.battery_info[arr?.battery_info.length - 1];
      arr.battery_info.push(crr);
      setFormData(arr);
    } else {
      let arr = { ...formData };
      // if(arr.battery_info.length > 1){
      arr.battery_info.pop();
      setFormData(arr);
      // }
    }
  };

  const addRemoveChargePakInfo = (type, keyName) => {
    if (type === "add") {
      let arr = { ...formData };
      let crr = arr[keyName].length
        ? arr[keyName][arr[keyName].length - 1]
        : [];
      if (
        keyName === "spare_battery_info" ||
        keyName === "has_battery_spare" ||
        keyName === "has_9v_spare" ||
        keyName === "has_installby_spare" ||
        keyName === "has_man_spare" ||
        keyName === "has_10pk_spare"
      ) {
        crr = spare_battery_info;
      }

      if (keyName === "SpareChargePakInformation") {
        crr = SpareChargePackInfo;
      }

      if (keyName === "SpareAdultPadInfo") {
        crr = SpareAdultPadInfo;
      }

      if (keyName === "SpareAdultPadPakInfo") {
        crr = SpareAdultPadPakInfo;
      }
      if (keyName === "sparePadricPadInfo") {
        crr = sparePadricPadInfo;
      }

      if (keyName === "sparePadricPakPad") {
        crr = sparePadricPakPad;
      }

      // sparePadricPakPad

      if (keyName && arr[keyName] && crr) {
        arr[keyName].push(crr);
        setFormData(arr);
      }
    } else {
      let arr = { ...formData };
      // if(arr[keyName].length > 1){
      arr[keyName].pop();
      setFormData(arr);
      // }
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    fetchAccount();
  }, [formData?.account]);
  useEffect(() => {
    if (formData?.model_name) {
      getBatteryType();
      fetchAEDPads();
    }
  }, [formData.model_name]);
  const [validated, setValidated] = useState(false);

  const setUnknownonAllFieldsisBlank = async () => {
    if (PermissionRedux?.has_battery) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_battery);
      if (!if_has_btery) {
        let n = "no_has_battery_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_battery";
        let v2 = updateJsonArrayWithUnknown(formData?.has_battery);
        FD[n2] = v2;
        setFormData(FD);
      }
    }

    // spare has battry
    if (formData?.no_spares_toggle && PermissionRedux?.has_battery) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_battery_spare);
      if (!if_has_btery) {
        let n = "no_battery_spare_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_battery_spare";
        let v2 = updateJsonArrayWithUnknown(formData?.has_battery_spare);
        FD[n2] = v2;
        setFormData(FD);
      }
    }

    if (PermissionRedux?.has_9v) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_9v);
      if (!if_has_btery) {
        let n = "no_has_9v_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_9v";
        let v2 = updateJsonArrayWithUnknown(formData?.has_9v);
        FD[n2] = v2;
        setFormData(FD);
      }
    }

    // spare has Has 9v
    if (formData?.no_spares_toggle && PermissionRedux?.has_9v) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_9v_spare);
      if (!if_has_btery) {
        let n = "no_9v_spare_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_9v_spare";
        let v2 = updateJsonArrayWithUnknown(formData?.has_9v_spare);
        FD[n2] = v2;
        setFormData(FD);
      }
    }

    if (PermissionRedux?.has_installby) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_installby);
      if (!if_has_btery) {
        let n = "no_has_installby_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_installby";
        let v2 = updateJsonArrayWithUnknown(formData?.has_installby);
        FD[n2] = v2;
        setFormData(FD);
      }
    }

    // spare has installby
    if (formData?.no_spares_toggle && PermissionRedux?.has_installby) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_installby_spare);
      if (!if_has_btery) {
        let n = "no_installby_spare_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_installby_spare";
        let v2 = updateJsonArrayWithUnknown(formData?.has_installby_spare);
        FD[n2] = v2;
        setFormData(FD);
      }
    }

    if (PermissionRedux?.has_man) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_man);

      if (!if_has_btery) {
        let n = "no_has_man_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_man";
        let v2 = updateJsonArrayWithUnknown(formData?.has_man);
        FD[n2] = v2;
        setFormData(FD);
      }
    }

    // spare has has_man
    if (formData?.no_spares_toggle && PermissionRedux?.has_man) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_man_spare);
      if (!if_has_btery) {
        let n = "no_has_man_spare_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_man_spare";
        let v2 = updateJsonArrayWithUnknown(formData?.has_man_spare);
        FD[n2] = v2;
        setFormData(FD);
      }
    }

    if (PermissionRedux?.has_10pk) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_10pk);
      if (!if_has_btery) {
        let n = "no_has_10pk_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_10pk";
        let v2 = updateJsonArrayWithUnknown(formData?.has_10pk);
        FD[n2] = v2;
        setFormData(FD);
      }
    }

    // spare has 10pk
    if (formData?.no_spares_toggle && PermissionRedux?.has_10pk) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_10pk_spare);
      if (!if_has_btery) {
        let n = "no_has_10pk_spare_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_10pk_spare";
        let v2 = updateJsonArrayWithUnknown(formData?.has_10pk_spare);
        FD[n2] = v2;
        setFormData(FD);
      }
    }

    // if(PermissionRedux.has_10pk){
    //     const if_has_btery  = checkIfAnyKeyHasValue(formData?.has_10pk_spare);
    //     if(!if_has_btery){
    //         let n  = 'no_has_10pk_spare_toggle';
    //         let v  = 1;
    //         let FD = {...formData }
    //         FD[n]  = v;
    //         let n2 = 'has_10pk_spare';
    //         let v2 = updateJsonArrayWithUnknown(formData?.has_10pk_spare);
    //         FD[n2] = v2;
    //         setFormData(FD);
    //     }
    // }
  };

 // Function to clean battery_info array
const cleanBatteryInfo = (batteryInfo) => {
  return batteryInfo.map((info) => {
    // Filter each array inside the object
    Object.keys(info).forEach((key) => {
      info[key] = info[key].filter((item) => {
        return Object.values(item).some((value) => value !== null && value !== undefined && value !== '');
      });
    });
    // Remove the key if the array is empty
    Object.keys(info).forEach((key) => {
      if (info[key].length === 0) {
        delete info[key];
      }
    });
    return info;
  }).filter((info) => Object.keys(info).length > 0);
};
const [submitRequired, setSubmitRequired] = useState(false);

  const handleSubmit = async (e) => {
    setSubmitRequired(true);
    e.preventDefault();
    setLoading(true);
    const vform = e.currentTarget;
    const mainFormData = { ...formData };
    if (vform.checkValidity() === false) {
      setValidated(true);
      setLoading(false);
      return "";
    } else {
      setValidated(false);
    }
    let batteries_expirations = [];

    formData?.has_battery.map((item) => {
      if (item?.battery_expiration && item?.battery_expiration != "") {
        batteries_expirations.push(item?.battery_expiration);
      }
    });

    formData?.has_9v.map((item) => {
      if (item?.battery_expiration && item?.battery_expiration != "") {
        batteries_expirations.push(item?.battery_expiration);
      }
    });

    formData?.has_installby.map((item) => {
      if (item?.battery_expiration && item?.battery_expiration != "") {
        batteries_expirations.push(item?.battery_expiration);
      }
    });

    formData?.has_man.map((item) => {
      if (item?.battery_expiration && item?.battery_expiration != "") {
        batteries_expirations.push(item?.battery_expiration);
      }
    });
    // has_man

    formData?.has_10pk.map((item) => {
      if (item?.battery_expiration && item?.battery_expiration != "") {
        batteries_expirations.push(item?.battery_expiration);
      }
    });

    if (PermissionRedux?.has_battery) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_battery);
      if (!if_has_btery) {
        let n = "no_has_battery_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;

        let n2 = "has_battery";
        let v2 = updateJsonArrayWithUnknown(formData?.has_battery);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }

    if (PermissionRedux?.has_9v) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_9v);
      if (!if_has_btery) {
        let n = "no_has_9v_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_9v";
        let v2 = updateJsonArrayWithUnknown(formData?.has_9v);
        FD[n2] = v2;

        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }

    if (PermissionRedux?.has_installby) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_installby);
      if (!if_has_btery) {
        let n = "no_has_installby_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_installby";
        let v2 = updateJsonArrayWithUnknown(formData?.has_installby);
        FD[n2] = v2;

        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }

    if (PermissionRedux?.has_man) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_man);

      if (!if_has_btery) {
        let n = "no_has_man_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_man";
        let v2 = updateJsonArrayWithUnknown(formData?.has_man);
        FD[n2] = v2;

        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }

    if (PermissionRedux?.has_10pk) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.has_10pk);
      if (!if_has_btery) {
        let n = "no_has_10pk_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "has_10pk";
        let v2 = updateJsonArrayWithUnknown(formData?.has_10pk);
        FD[n2] = v2;

        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }

    if (PermissionRedux?.has_pad) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.AdultPadInformation);
      if (!if_has_btery) {
        let n = "no_has_pad_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "AdultPadInformation";
        let v2 = updateJsonArrayWithUnknown(formData?.AdultPadInformation);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }

    if (PermissionRedux?.has_padpak) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.AdultPadPakInfo);
      if (!if_has_btery) {
        let n = "no_has_padpak_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "AdultPadPakInfo";
        let v2 = updateJsonArrayWithUnknown(formData?.AdultPadPakInfo);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }

    if (
      formData?.no_spares_toggle &&
      formData.no_pediatric_toggle &&
      PermissionRedux?.has_ped_pad
    ) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.sparePadricPadInfo);
      if (!if_has_btery) {
        let n = "no_spare_padric_pad_info_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "sparePadricPadInfo";
        let v2 = updateJsonArrayWithUnknown(formData?.sparePadricPadInfo);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }

    if (
      formData?.no_spares_toggle &&
      formData.no_pediatric_toggle &&
      PermissionRedux?.has_padpak
    ) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.sparePadricPakPad);
      if (!if_has_btery) {
        let n = "no_spare_padric_pad_info_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "sparePadricPakPad";
        let v2 = updateJsonArrayWithUnknown(formData?.sparePadricPakPad);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }

    if (PermissionRedux?.has_chargepak) {
      const if_has_btery = checkIfAnyKeyHasValue(
        formData?.ChargePakInformation
      );
      if (!if_has_btery) {
        let n = "no_has_chargepak_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "ChargePakInformation";
        let v2 = updateJsonArrayWithUnknown(formData?.ChargePakInformation);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }
  
      formData?.has_9v.map((item) => {
        if (item?.battery_expiration && item?.battery_expiration != "") {
          batteries_expirations.push(item?.battery_expiration);
        }
      });
  
      formData?.has_installby.map((item) => {
        if (item?.battery_expiration && item?.battery_expiration != "") {
          batteries_expirations.push(item?.battery_expiration);
        }
      });
  
      formData?.has_man.map((item) => {
        if (item?.battery_expiration && item?.battery_expiration != "") {
          batteries_expirations.push(item?.battery_expiration);
        }
      });
      // has_man
  
      formData?.has_10pk.map((item) => {
        if (item?.battery_expiration && item?.battery_expiration != "") {
          batteries_expirations.push(item?.battery_expiration);
        }
      });
  
      if (PermissionRedux?.has_battery) {
        const if_has_btery = checkIfAnyKeyHasValue(formData?.has_battery);
        if (!if_has_btery) {
          let n = "no_has_battery_toggle";
          let v = 1;
          let FD = { ...formData };
          FD[n] = v;
  
          let n2 = "has_battery";
          let v2 = updateJsonArrayWithUnknown(formData?.has_battery);
          FD[n2] = v2;
          mainFormData[n] = v;
          mainFormData[n2] = v2;
          setFormData(FD);
        }
      }
  
      if (PermissionRedux?.has_9v) {
        const if_has_btery = checkIfAnyKeyHasValue(formData?.has_9v);
        if (!if_has_btery) {
          let n = "no_has_9v_toggle";
          let v = 1;
          let FD = { ...formData };
          FD[n] = v;
          let n2 = "has_9v";
          let v2 = updateJsonArrayWithUnknown(formData?.has_9v);
          FD[n2] = v2;
  
          mainFormData[n] = v;
          mainFormData[n2] = v2;
          setFormData(FD);
        }
      }
  
      if (PermissionRedux?.has_installby) {
        const if_has_btery = checkIfAnyKeyHasValue(formData?.has_installby);
        if (!if_has_btery) {
          let n = "no_has_installby_toggle";
          let v = 1;
          let FD = { ...formData };
          FD[n] = v;
          let n2 = "has_installby";
          let v2 = updateJsonArrayWithUnknown(formData?.has_installby);
          FD[n2] = v2;
  
          mainFormData[n] = v;
          mainFormData[n2] = v2;
          setFormData(FD);
        }
      }
  
      if (PermissionRedux?.has_man) {
        const if_has_btery = checkIfAnyKeyHasValue(formData?.has_man);
  
        if (!if_has_btery) {
          let n = "no_has_man_toggle";
          let v = 1;
          let FD = { ...formData };
          FD[n] = v;
          let n2 = "has_man";
          let v2 = updateJsonArrayWithUnknown(formData?.has_man);
          FD[n2] = v2;
  
          mainFormData[n] = v;
          mainFormData[n2] = v2;
          setFormData(FD);
        }
      }
  
      if (PermissionRedux?.has_10pk) {
        const if_has_btery = checkIfAnyKeyHasValue(formData?.has_10pk);
        if (!if_has_btery) {
          let n = "no_has_10pk_toggle";
          let v = 1;
          let FD = { ...formData };
          FD[n] = v;
          let n2 = "has_10pk";
          let v2 = updateJsonArrayWithUnknown(formData?.has_10pk);
          FD[n2] = v2;
  
          mainFormData[n] = v;
          mainFormData[n2] = v2;
          setFormData(FD);
        }
      }
  
      if (PermissionRedux?.has_pad) {
        const if_has_btery = checkIfAnyKeyHasValue(formData?.AdultPadInformation);
        if (!if_has_btery) {
          let n = "no_has_pad_toggle";
          let v = 1;
          let FD = { ...formData };
          FD[n] = v;
          let n2 = "AdultPadInformation";
          let v2 = updateJsonArrayWithUnknown(formData?.AdultPadInformation);
          FD[n2] = v2;
          mainFormData[n] = v;
          mainFormData[n2] = v2;
          setFormData(FD);
        }
      }
  
      if (PermissionRedux?.has_padpak) {
        const if_has_btery = checkIfAnyKeyHasValue(formData?.AdultPadPakInfo);
        if (!if_has_btery) {
          let n = "no_has_padpak_toggle";
          let v = 1;
          let FD = { ...formData };
          FD[n] = v;
          let n2 = "AdultPadPakInfo";
          let v2 = updateJsonArrayWithUnknown(formData?.AdultPadPakInfo);
          FD[n2] = v2;
          mainFormData[n] = v;
          mainFormData[n2] = v2;
          setFormData(FD);
        }
      }
  
      if (
        formData?.no_spares_toggle &&
        formData.no_pediatric_toggle &&
        PermissionRedux?.has_ped_pad
      ) {
        const if_has_btery = checkIfAnyKeyHasValue(formData?.sparePadricPadInfo);
        if (!if_has_btery) {
          let n = "no_spare_padric_pad_info_toggle";
          let v = 1;
          let FD = { ...formData };
          FD[n] = v;
          let n2 = "sparePadricPadInfo";
          let v2 = updateJsonArrayWithUnknown(formData?.sparePadricPadInfo);
          FD[n2] = v2;
          mainFormData[n] = v;
          mainFormData[n2] = v2;
          setFormData(FD);
        }
      }
  
      if (
        formData?.no_spares_toggle &&
        formData.no_pediatric_toggle &&
        PermissionRedux?.has_padpak
      ) {
        const if_has_btery = checkIfAnyKeyHasValue(formData?.sparePadricPakPad);
        if (!if_has_btery) {
          let n = "no_spare_padric_pad_info_toggle";
          let v = 1;
          let FD = { ...formData };
          FD[n] = v;
          let n2 = "sparePadricPakPad";
          let v2 = updateJsonArrayWithUnknown(formData?.sparePadricPakPad);
          FD[n2] = v2;
          mainFormData[n] = v;
          mainFormData[n2] = v2;
          setFormData(FD);
        }
      }
  
      if (PermissionRedux?.has_chargepak) {
        const if_has_btery = checkIfAnyKeyHasValue(
          formData?.ChargePakInformation
        );
        if (!if_has_btery) {
          let n = "no_has_chargepak_toggle";
          let v = 1;
          let FD = { ...formData };
          FD[n] = v;
          let n2 = "ChargePakInformation";
          let v2 = updateJsonArrayWithUnknown(formData?.ChargePakInformation);
          FD[n2] = v2;
          mainFormData[n] = v;
          mainFormData[n2] = v2;
          setFormData(FD);
        }
      }
  
      let sendFormData = {
        account_id: mainFormData?.account_id,
        site_id: mainFormData?.site_id,
        aed_brand_id: mainFormData?.brand,
        aed_model_id: mainFormData?.model_name,
        part_number: mainFormData?.part_number,
        accessory_type: mainFormData?.accessory_type,
        dni: mainFormData?.dni,
        battery_info: [], 
        charge_pak_info: null,
        adult_pad_info: null, 
        adult_pad_pak_info: null, 
        pediatric_pad_info: null, 
        pediatric_pak_pad_info: null, 
      };
      
      if (PermissionRedux?.accessory_type === "Battery") {
        sendFormData.battery_info.push({
          has_battery: mainFormData?.has_battery,
          has_9v: mainFormData?.has_9v,
          has_installby: mainFormData?.has_installby,
          has_man: mainFormData?.has_man,
          has_10pk: mainFormData?.has_10pk,
      });
      } else if (PermissionRedux?.accessory_type === "Charge Pak") {
        sendFormData.charge_pak_info = mainFormData?.ChargePakInformation;
      } else if (PermissionRedux?.accessory_type === "Pad") {
       sendFormData.adult_pad_info = mainFormData?.AdultPadInformation;
      } else if (PermissionRedux?.accessory_type === "Pad Pak") {
        sendFormData.adult_pad_pak_info = mainFormData?.AdultPadPakInfo;
      } else if (PermissionRedux?.accessory_type === "Pediatric Pad") {
        sendFormData.pediatric_pad_info = mainFormData?.PediatricPadInformation;
      } else if (PermissionRedux?.accessory_type === "Pediatric Pad Pak") {
        sendFormData.pediatric_pak_pad_info = mainFormData?.PediatricPakPadInformation;
      }

      sendFormData.battery_info = cleanBatteryInfo(sendFormData.battery_info);
      
      console.log({ mainFormData });
      console.log({sendFormData});
        
      let res = await CallPOSTAPI("account/save-aed-standalone-data", sendFormData);
   
      if (res?.data?.status) {
        setFormMsg({ type: res?.data?.status, msg: res?.data?.msg });
        toast.success("Stanalone accessory saved successfully");
      // return;
      const updatedPermission = {
        ...PermissionRedux,
        accessory_type: "",
      };
      dispatch(updatePermission(updatedPermission));

      const updatedFormData = {
        ...formData,
        accessory_type: "",
        brand: "",
        model_name: "",
        dni: 0,
      };
      setFormData(updatedFormData);
      setSubmitRequired(false);
    } else {
      const updatedPermission = {
        ...PermissionRedux,
        accessory_type: "",
      };
      dispatch(updatePermission(updatedPermission));

      const updatedFormData = {
        ...formData,
        accessory_type: "",
        brand: "",
        model_name: "",
        dni: 0,
      };
      setFormData(updatedFormData);
      setSubmitRequired(false);
      setFormMsg({ type: 0, msg: "Something went wrong please try again" });
      toast.error("Something went wrong please try again");
    }
    setLoading(false);
  }


  const [aedList, setAedList] = useState([]);
  const [loanerList, setLoanerList] = useState([]);

  const getAllAeds = async () => {
    const result = await CallGETAPI("account/get-aed/" + AccId);
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
      console.log({ result: result?.data.data });
      setLoanerList(result?.data?.data);
    }
  };
  
  useEffect(() => {
    if (AccId) {
      getAllAeds();
      getLoanerList();
    }
  }, [AccId]);

  const handleCancel = () => {
    const updatedPermission = {
      ...PermissionRedux,
      accessory_type: "",
    };
   
    dispatch(updatePermission(updatedPermission));
    navigate(-1);
  };

  // console.log({ formData });

  return (
    <>
      <div className="mt-4" style={{ paddingInline: "45px" }}>
        <Form
          class=""
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
          id="create-new-account-form"
        >
          <button
            className="btn text-primary"
            type="button"
            onClick={() => {
              const updatedPermission = {
                ...PermissionRedux,
                accessory_type: "",
              };

              dispatch(updatePermission(updatedPermission));
              navigate(-1);
            }}
          >
            <img src="/back.svg" alt="svg" style={{ marginRight: "5px" }} />
            <span className="ms-2">Back</span>
          </button>

          <h2 className="heading" style={{ color: "black" }}>
            {" "}
            New Standalone Accessory
          </h2>

          <NewStdlnAedForm
            AccountList={AccLidatData}
            BrandList={brandData}
            formData={formData}
            setFormData={setFormData}
            setPermission={setPermission}
            Permissins={PermissionRedux}
            RmsDropdown={RmsDropdown}
            all_condition_true={all_condition_true}
            DefaultValue={DefaultValue}
            aedList={aedList}
            loanerList={loanerList}
          />
          <StdlnParentBatteryInfo
            formData={formData}
            setFormData={setFormData}
            handleCheckBox={handleCheckBox}
            handleInput={handleInput}
            addMore={addRemoveChargePakInfo}
            Permissins={PermissionRedux}
            addRemoveBtn={addRemoveChargePakInfo}
            all_condition_true={all_condition_true}
            BatteryList={BatteryList}
          />

          {(PermissionRedux?.has_chargepak &&
            PermissionRedux?.accessory_type == "Charge Pak") ||
          all_condition_true ? (
            <div className=" bg-gray py-4 px-4 mt-4">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="heading">{"Charge Pak Information"}</h2>
              </div>
              {/* <div className="d-flex align-items-center justify-content-between">
                  <h2 className="heading">
                    {"Charge Pak Information"}
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo("add", "SpareChargePakInformation")
                      }
                      className="btn mx-2 btn-sm btn-primary "
                      disabled={!formData?.no_spares_toggle}
                      type="button"
                    >
                      +
                    </button>
                  </h2>
                  <div className="toggle">
                    <label className="d-block mb-2">
                      <b>Unknown</b>
                    </label>
                    <CustomToggleButton
                      ToggleName="no_has_chargepak_toggle"
                      ToggleValue={formData?.no_has_chargepak_toggle}
                      changeHandler={handleCheckBox}
                    />
                  </div>
                </div> */}

              {formData?.ChargePakInformation?.map((item, index) => (
                <StdlnChargePakInfo 
                  is_unknowntrue={formData?.no_has_chargepak_toggle}
                  toogleKeyName={formData?.no_has_chargepak_toggle}
                  keyName={"ChargePakInformation"}
                  title="Battery Information"
                  crrIndex={index}
                  formData={formData}
                  setFormData={setFormData}
                  handleCheckBox={handleCheckBox}
                  handleInput={handleInput}
                  crrFormData={item}
                  addMore={addMorebattery_info}
                  BatteryList={BatteryList}
                  padList={padList}
                  all_condition_true={all_condition_true}
                  chargepakRequired={chargepakRequired}
                  submitRequired={submitRequired}
                />
              ))}
            </div>
          ) : (
            ""
          )}

          {/* {(formData?.no_spares_toggle &&
              formData?.SpareChargePakInformation.length > 0) ||
            all_condition_true ? (
              <div className=" bg-gray py-4 px-4 mt-4">
                <div className="d-flex align-items-center justify-content-between">
                  <h2 className="heading">
                    {"Spare Charge Pak Information"}
  
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo("add", "SpareChargePakInformation")
                      }
                      className="btn mx-2 btn-sm btn-primary "
                      disabled={!formData?.no_spares_toggle}
                      type="button"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo(
                          "remove",
                          "SpareChargePakInformation"
                        )
                      }
                      className="btn mx-2 btn-sm btn-danger "
                      type="button"
                    >
                      -
                    </button>
                  </h2>
                  <div className="toggle">
                    <label className="d-block mb-2">
                      <b>Unknown</b>
                    </label>
                    <CustomToggleButton
                      ToggleName="no_spare_charge_pak_info_toggle"
                      ToggleValue={formData?.no_spare_charge_pak_info_toggle}
                      changeHandler={handleCheckBox}
                    />
                  </div>
                </div>
  
                {formData?.SpareChargePakInformation?.map((item, index) => (
                  <SpareChargePakInfo
                    is_unknowntrue={formData?.no_spare_charge_pak_info_toggle}
                    toogleKeyName={formData?.no_has_chargepak_toggle}
                    keyName={"SpareChargePakInformation"}
                    title="Battery Information"
                    crrIndex={index}
                    formData={formData}
                    setFormData={setFormData}
                    handleCheckBox={handleCheckBox}
                    handleInput={handleInput}
                    crrFormData={item}
                    addMore={addMorebattery_info}
                    BatteryList={BatteryList}
                    padList={padList}
                    all_condition_true={all_condition_true}
                  />
                ))}
              </div>
            ) : (
              ""
            )} */}
          {(PermissionRedux?.has_pad &&
            PermissionRedux?.accessory_type == "Pad") ||
          all_condition_true ? (
            <div className=" bg-gray py-4 px-4 mt-4">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="heading">{"Adult Pad Information"}</h2>
              </div>
              {/* <div className="d-flex align-items-center justify-content-between">
                  <h2 className="heading">
                    {"Adult Pad Information"}
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo("add", "SpareAdultPadInfo")
                      }
                      className="btn mx-2 btn-sm btn-primary "
                      disabled={!formData?.no_spares_toggle}
                      type="button"
                    >
                      +
                    </button>
                  </h2>
                  <div className="toggle">
                    <label className="d-block mb-2">
                      <b>Unknown</b>
                    </label>
                    <CustomToggleButton
                      ToggleName="no_has_pad_toggle"
                      ToggleValue={formData?.no_has_pad_toggle}
                      changeHandler={handleCheckBox}
                    />
                  </div>
                </div> */}

              {formData?.AdultPadInformation?.map((item, index) => (
                <StdlnAdultPakInfo
                  is_unknowntrue={formData?.no_has_pad_toggle}
                  toogleKeyName={formData?.no_has_pad_toggle}
                  keyName={"AdultPadInformation"}
                  title="Battery Information"
                  crrIndex={index}
                  formData={formData}
                  setFormData={setFormData}
                  handleCheckBox={handleCheckBox}
                  handleInput={handleInput}
                  crrFormData={item}
                  addMore={addMorebattery_info}
                  padList={padList}
                />
              ))}
            </div>
          ) : (
            ""
          )}

          {/* {formData?.no_spares_toggle &&
            (formData?.SpareAdultPadInfo.length > 0 || all_condition_true) ? (
              <div className=" bg-gray py-4 px-4 mt-4">
                <div className="d-flex align-items-center justify-content-between">
                  <h2 className="heading">
                    {"Spare Adult Pad Information"}
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo("add", "SpareAdultPadInfo")
                      }
                      className="btn mx-2 btn-sm btn-primary "
                      disabled={!formData?.no_spares_toggle}
                      type="button"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo("remove", "SpareAdultPadInfo")
                      }
                      className="btn mx-2 btn-sm btn-danger "
                      type="button"
                    >
                      -
                    </button>
                  </h2>
                  <div className="toggle">
                    <label className="d-block mb-2">
                      <b>Unknown</b>
                    </label>
                    <CustomToggleButton
                      ToggleName="no_spare_adult_pak_info_toggle"
                      ToggleValue={formData?.no_spare_adult_pak_info_toggle}
                      changeHandler={handleCheckBox}
                    />
                  </div>
                </div>
  
                {formData?.SpareAdultPadInfo?.map((item, index) => (
                  <SpareAdultPakInfo
                    is_unknowntrue={formData?.no_spare_adult_pak_info_toggle}
                    keyName={"SpareAdultPadInfo"}
                    title="Battery Information"
                    crrIndex={index}
                    formData={formData}
                    setFormData={setFormData}
                    handleCheckBox={handleCheckBox}
                    handleInput={handleInput}
                    crrFormData={item}
                    addMore={addMorebattery_info}
                    padList={padList}
                  />
                ))}
              </div>
            ) : (
              ""
            )} */}
          {/*  */}

          {/* Adult Pad Pak Info */}
          {(PermissionRedux?.has_padpak &&
            PermissionRedux?.accessory_type == "Pad Pak") ||
          all_condition_true ? (
            <div className=" bg-gray py-4 px-4 mt-4">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="heading">{"Adult Pad Pak Information"}</h2>
              </div>
              {/* <div className="d-flex align-items-center justify-content-between">
                  <h2 className="heading">
                    {"Adult Pad Pak Information"}
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo("add", "SpareAdultPadPakInfo")
                      }
                      className="btn mx-2 btn-sm btn-primary "
                      disabled={!formData?.no_spares_toggle}
                      type="button"
                    >
                      +
                    </button>
                  </h2>
                  <div className="toggle">
                    <label className="d-block mb-2">
                      <b>Unknown</b>
                    </label>
                    <CustomToggleButton
                      ToggleName="no_has_padpak_toggle"
                      ToggleValue={formData?.no_has_padpak_toggle}
                      changeHandler={handleCheckBox}
                    />
                  </div>
                </div> */}

              {formData?.AdultPadPakInfo?.map((item, index) => (
                <StdlnAdultPadPakInfo
                  is_unknowntrue={formData?.no_has_padpak_toggle}
                  keyName={"AdultPadPakInfo"}
                  title="Battery Information"
                  crrIndex={index}
                  formData={formData}
                  setFormData={setFormData}
                  handleCheckBox={handleCheckBox}
                  handleInput={handleInput}
                  crrFormData={item}
                  addMore={addMorebattery_info}
                  padList={padList}
                />
              ))}
            </div>
          ) : (
            ""
          )}

          {/* {(formData?.no_spares_toggle &&
              formData?.SpareAdultPadPakInfo.length > 0) ||
            all_condition_true ? (
              <div className=" bg-gray py-4 px-4 mt-4">
                <div className="d-flex align-items-center justify-content-between">
                  <h2 className="heading">
                    {"Spare Adult Pad Pak Information"}
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo("add", "SpareAdultPadPakInfo")
                      }
                      className="btn mx-2 btn-sm btn-primary "
                      disabled={!formData?.no_spares_toggle}
                      type="button"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo("remove", "SpareAdultPadPakInfo")
                      }
                      className="btn mx-2 btn-sm btn-danger "
                      type="button"
                    >
                      -
                    </button>
                  </h2>
                  <div className="toggle">
                    <label className="d-block mb-2">
                      <b>Unknown</b>
                    </label>
                    <CustomToggleButton
                      ToggleName="no_spare_adult_pad_pak_info_toggle"
                      ToggleValue={formData?.no_spare_adult_pad_pak_info_toggle}
                      changeHandler={handleCheckBox}
                    />
                  </div>
                </div>
  
                {formData?.SpareAdultPadPakInfo?.map((item, index) => (
                  <SpareAdultPadPakInfoComp
                    is_unknowntrue={formData?.no_spare_adult_pad_pak_info_toggle}
                    keyName={"SpareAdultPadPakInfo"}
                    title="SpareAdultPadPakInfo"
                    crrIndex={index}
                    formData={formData}
                    setFormData={setFormData}
                    handleCheckBox={handleCheckBox}
                    handleInput={handleInput}
                    crrFormData={item}
                    addMore={addMorebattery_info}
                    padList={padList}
                  />
                ))}
              </div>
            ) : (
              ""
            )} */}

          {(formData.no_pediatric_toggle &&
            PermissionRedux?.has_ped_pad &&
            PermissionRedux?.accessory_type == "Pediatric Pad") ||
          all_condition_true ? (
            <div className=" bg-gray py-4 px-4 mt-4">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="heading">{"Pediatric Pad Information"}</h2>
              </div>
              {/* // removed unknown code from here  */}

              {formData?.PediatricPadInformation?.map((item, index) => (
                <StdlnPediatricPadInfo
                  is_unknowntrue={formData?.no_has_pedpad_toggle}
                  keyName={"PediatricPadInformation"}
                  title="Pediatric Pad Info"
                  crrIndex={index}
                  formData={formData}
                  setFormData={setFormData}
                  handleCheckBox={handleCheckBox}
                  handleInput={handleInput}
                  crrFormData={item}
                  addMore={addMorebattery_info}
                  padList={padList}
                />
              ))}
            </div>
          ) : (
            ""
          )}

          {/* {formData?.no_spares_toggle &&
            formData.no_pediatric_toggle &&
            PermissionRedux?.has_ped_pad &&
            formData?.sparePadricPadInfo.length > 0 ? (
              <div className=" bg-gray py-4 px-4 mt-4">
                <div className="d-flex align-items-center justify-content-between">
                  <h2 className="heading">
                    {"Spare Pediatric Pad Information"}
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo("add", "sparePadricPadInfo")
                      }
                      className="btn mx-2 btn-sm btn-primary "
                      disabled={!formData?.no_spares_toggle}
                      type="button"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo("remove", "sparePadricPadInfo")
                      }
                      className="btn mx-2 btn-sm btn-danger "
                      type="button"
                    >
                      -
                    </button>
                  </h2>
  
                  <div className="toggle">
                    <label className="d-block mb-2">
                      <b>Unknown</b>
                    </label>
                    <CustomToggleButton
                      ToggleName="no_spare_padric_pad_info_toggle"
                      ToggleValue={formData?.no_spare_padric_pad_info_toggle}
                      changeHandler={handleCheckBox}
                    />
                  </div>
                </div>
  
                {formData?.sparePadricPadInfo?.map((item, index) => (
                  <SparePediatricPadInfo
                    is_unknowntrue={formData?.no_spare_padric_pad_info_toggle}
                    keyName={"sparePadricPadInfo"}
                    title="sparePadricPadInfo"
                    crrIndex={index}
                    formData={formData}
                    setFormData={setFormData}
                    handleCheckBox={handleCheckBox}
                    handleInput={handleInput}
                    crrFormData={item}
                    padList={padList}
                    addMore={addMorebattery_info}
                  />
                ))}
              </div>
            ) : (
              ""
            )} */}

          {(formData.no_pediatric_toggle &&
            PermissionRedux?.has_padpak &&
            PermissionRedux?.accessory_type == "Pediatric Pad Pak") ||
          all_condition_true ? (
            <div className=" bg-gray py-4 px-4 mt-4">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="heading">{"Pediatric Pad-Pak Information"}</h2>
              </div>
              {/* <div className="d-flex align-items-center justify-content-between">
                  <h2 className="heading">
                    {"Pediatric Pad-Pak Information"}
  
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo("add", "sparePadricPakPad")
                      }
                      className="btn mx-2 btn-sm btn-primary "
                      disabled={!formData?.no_spares_toggle}
                      type="button"
                    >
                      +
                    </button>
                  </h2>
                  <div className="toggle">
                    <label className="d-block mb-2">
                      <b>Unknown</b>
                    </label>
                    <CustomToggleButton
                      ToggleName="no_has_pedpak_toggle"
                      ToggleValue={formData?.no_has_pedpak_toggle}
                      changeHandler={handleCheckBox}
                    />
                  </div>
                </div> */}
              {formData?.PediatricPakPadInformation?.map((item, index) => (
                <StdlnPediatricPadPakInfo
                  is_unknowntrue={formData?.no_has_pedpak_toggle}
                  keyName={"PediatricPakPadInformation"}
                  title="Pediatric Pad Info"
                  crrIndex={index}
                  formData={formData}
                  setFormData={setFormData}
                  handleCheckBox={handleCheckBox}
                  handleInput={handleInput}
                  crrFormData={item}
                  padList={padList}
                  addMore={addMorebattery_info}
                />
              ))}
            </div>
          ) : (
            ""
          )}

          {/* {formData?.no_spares_toggle &&
            formData?.sparePadricPakPad.length > 0 ? (
              <div className=" bg-gray py-4 px-4 mt-4">
                <div className="d-flex align-items-center justify-content-between">
                  <h2 className="heading">
                    {"Spare Pediatric Pad-Pak Information"}
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo("add", "sparePadricPakPad")
                      }
                      className="btn mx-2 btn-sm btn-primary "
                      disabled={!formData?.no_spares_toggle}
                      type="button"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        addRemoveChargePakInfo("remove", "sparePadricPakPad")
                      }
                      className="btn mx-2 btn-sm btn-danger "
                      type="button"
                    >
                      -
                    </button>
                  </h2>
                  <div className="toggle">
                    <label className="d-block mb-2">
                      <b>Unknown</b>
                    </label>
                    <CustomToggleButton
                      ToggleName="no_spare_padric_pad_pak_info_toggle"
                      ToggleValue={formData?.no_spare_padric_pad_pak_info_toggle}
                      changeHandler={handleCheckBox}
                    />
                  </div>
                </div>
  
                {formData?.sparePadricPakPad?.map((item, index) => (
                  <SparePediatricPadPakInfo
                    keyName={"sparePadricPakPad"}
                    title="sparePadricPakPad"
                    crrIndex={index}
                    formData={formData}
                    setFormData={setFormData}
                    handleCheckBox={handleCheckBox}
                    handleInput={handleInput}
                    crrFormData={item}
                    addMore={addMorebattery_info}
                    padList={padList}
                    is_unknowntrue={formData?.no_spare_padric_pad_pak_info_toggle}
                  />
                ))}
              </div>
            ) : (
              ""
            )} */}

          {/* {PermissionRedux?.has_ped_key || all_condition_true ? (
              <div className=" bg-gray py-4 px-4 mt-4">
                <h2 className="heading">{"Pediatric Key Information"} </h2>
                <PediatricKeyInfo
                  keyName={"GatewayInformation"}
                  title="GatewayInformation"
                  crrIndex={"1"}
                  formData={formData}
                  setFormData={setFormData}
                  handleCheckBox={handleCheckBox}
                  handleInput={handleInput}
                  addMore={addMorebattery_info}
                />
              </div>
            ) : (
              ""
            )} */}

          {/* PediatricKeyInfo */}
          {/* {PermissionRedux?.has_gateway || all_condition_true ? (
              <div className=" bg-gray py-4 px-4 mt-4">
                <h2 className="heading">{"Gateway Information"} </h2>
  
                {formData?.GatewayInformation?.map((item, index) => (
                  <GatewayInformation
                    keyName={"GatewayInformation"}
                    title="GatewayInformation"
                    crrIndex={index}
                    formData={formData}
                    setFormData={setFormData}
                    handleCheckBox={handleCheckBox}
                    handleInput={handleInput}
                    crrFormData={item}
                    addMore={addMorebattery_info}
                    permissins={PermissionRedux}
                  />
                ))}
              </div>
            ) : (
              ""
            )} */}

          {/* {PermissionRedux?.has_builtin_rms || all_condition_true ? (
              <div className=" bg-gray py-4 px-4 mt-4">
                <h2 className="heading">{"Built-In RMS Information"} </h2>
  
                {formData?.BuiltInRMSInformation?.map((item, index) => (
                  <BuiltInRMSInformation
                    keyName={"BuiltInRMSInformation"}
                    title="BuiltInRMSInformation"
                    crrIndex={index}
                    formData={formData}
                    setFormData={setFormData}
                    handleCheckBox={handleCheckBox}
                    handleInput={handleInput}
                    crrFormData={item}
                    addMore={addMorebattery_info}
                  />
                ))}
              </div>
            ) : (
              ""
            )} */}

          {/* <div className="col-12">
            <MessageHandler
              status={FormMsg.type}
              msg={FormMsg.msg}
              HandleMessage={setFormMsg}
            />
          </div> */}

          <div class="col-md-12 text-right">
            <button class="btn btn-danger" type="button" onClick={handleCancel}>
              Cancel
            </button>{" "}
            &nbsp;&nbsp;
            <button class="btn btn-success">
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </Form>
        <br />
        <br />
        <br />
      </div>
    </>
  );
};

export default NewStandloneAcce;

import React, { useEffect, useState } from "react";
import NewAedForm from "../../components/forms/NewAedForm";
import SubHeading from "../../components/header/SubHeading";
import {
  BatteryTypebyModel,
  DecryptToken,
  FetchAccountDetails,
  GetAccountList,
  GetAedBrands,
  GetRMSBrand,
  PadTypeByModal,
  PrepareOptions,
} from "../../helper/BasicFn";
import ChargePakInfo from "../../components/forms/subaed_forms/ChargePakInfo";
import SpareChargePakInfo from "../../components/forms/subaed_forms/SpareChargePakInfo";
import AdultPakInfo from "../../components/forms/subaed_forms/AdultPakInfo";
import SpareAdultPakInfo from "../../components/forms/subaed_forms/SpareAdultPakInfo";
import PediatricPadInfo from "../../components/forms/subaed_forms/PediatricPadInfo";
import BuiltInRMSInformation from "../../components/forms/subaed_forms/BuiltInRMSInformation";
import SparePediatricPadInfo from "../../components/forms/subaed_forms/SparePediatricPadInfo";
import GatewayInformation from "../../components/forms/subaed_forms/GatewayInformation";
import AdultPadPakInfo from "../../components/forms/subaed_forms/AdultPadPakInfo";
import SpareAdultPadPakInfoComp from "../../components/forms/subaed_forms/SpareAdultPadPakInfoComp";
import SparePediatricPadPakInfo from "../../components/forms/subaed_forms/SparePediatricPadPakInfo";
import PediatricPadPakInfo from "../../components/forms/subaed_forms/PediatricPadPakInfo";
import PediatricKeyInfo from "../../components/forms/subaed_forms/PediatricKeyInfo";
import { CallGETAPI, CallPOSTAPI } from "../../helper/API";
import { Link, useNavigate, useParams } from "react-router-dom";
import ParentBatteryInfo from "../../components/forms/subaed_forms/ParentBatteryInfo";
import { toast } from "react-toastify";
import MessageHandler from "../../components/common/MessageHandler";
import moment from "moment/moment";
import { Form } from "react-bootstrap";
import { FormatDate, HasUnknownValue } from "../../helper/Common";
import CustomToggleButton from "../../components/common/toggleSwitch/CustomToggleButton";
import { useDispatch, useSelector } from "react-redux";
import { updatePermission } from "../../redux/slices/AEDSlice";
// GatewayInformation

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

const NewAed = () => {
  const all_condition_true = 0;
  const user = DecryptToken();
  // const {id}
  const routes = useParams();
  const navigate = useNavigate();

  // const AccId = routes?.id;
  const [AccId, setAccId] = useState(routes?.id)
  const SiteID = routes?.site_id;
  // site_id

  // const [AccountId,setAccoutnId] = useState()
  const [AccLidatData, setaccLidatData] = useState([]);
  const [brandData, setBrandData] = useState([]);

  const [RmsDropdown, SetRmsDropdown] = useState([]);
  const [BatteryList, setBatteryList] = useState([]);
  const [FormMsg, setFormMsg] = useState({ type: true, msg: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const PermissionRedux = useSelector(
    (state) => state?.AED_manager?.permissions
  );

  // console.log(PermissionRedux)

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

  const spare_battery_info = {
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
    no_battery_spare_toggle: false,
  };

  const SpareChargePackInfo = {
    charge_pak_part: "",
    charge_pak_uid: "",
    battery_expiration: "",
    battery_lot: "",
    pad_1_part: "",
    pad_1_expiration: "",
    pad_1_lot: "",
    pad_2_part: "",
    pad_2_expiration: "",
    pad_2_lot: "",
    no_spare_charge_pak_info_toggle: "",
  };

  const SpareAdultPadInfo = {
    pad_part: "",
    pad_expiration: "",
    pad_lot: "",
    pad_udi: "",
    no_spare_adult_pak_info_toggle: "",
  };

  const sparePadricPadInfo = {
    pad_part: "",
    pad_expiration: "",
    pad_lot: "",
    pad_udi: "",
    no_spare_padric_pad_info_toggle: "",
  };

  const sparePadricPakPad = {
    pad_part: "",
    pad_expiration: "",
    pad_lot: "",
    pad_udi: "",
    no_spare_padric_pad_pak_info_toggle: "",
  };

  const SpareAdultPadPakInfo = {
    pad_part: "",
    pad_expiration: "",
    pad_lot: "",
    pad_udi: "",
    no_spare_adult_pad_pak_info_toggle: "",
  };
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

    // Out of Service Information
    replaced_serial: "",
    replaced_serial_name: "",
    date_sent_to_manufacturer: "",
    loaner_rental_serial: "",
    loaner_rental_serial_name: "",
    reason: "",
    not_replacing: false,
    loaner_toggle: false,
    loaner_serial_id: 0,

    // StorageInformation
    storage_type: "",
    alarmed: "",
    alarm_status: 1,
    v9_Installed_Date: "",
    store_expiry_date: "",

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
      },
    ],
    has_battery_spare: [],

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
      },
    ],

    has_9v_spare: [],

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
      },
    ],
    has_installby_spare: [],

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
      },
    ],

    has_man_spare: [],

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
      },
    ],
    has_10pk_spare: [],

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
      },
    ],

    spare_battery_info: [],

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
        charge_pak_uid: "",
        battery_expiration: "",
        battery_lot: "",
        pad_part: "",
        pad_1_expiration: "",
        pad_1_lot: "",
        pad_2_part: "",
        pad_2_expiration: "",
        pad_2_lot: "",
      },
    ],

    SpareChargePakInformation: [],

    AdultPadInformation: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
      },
    ],

    SpareAdultPadInfo: [],

    AdultPadPakInfo: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
      },
    ],

    SpareAdultPadPakInfo: [],

    PediatricPadInformation: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
      },
    ],
    sparePadricPadInfo: [],
    PediatricPakPadInformation: [
      {
        pad_part: "",
        pad_expiration: "",
        pad_lot: "",
        pad_udi: "",
      },
    ],
    sparePadricPakPad: [],

    GatewayInformation: [
      {
        installed: "",
        connected: "",
        gateway_serial: "",
        gateway_Mmac_address: "",
        battery_install_date: "",
        expiry_date: "",
      },
    ],
    BuiltInRMSInformation: [
      {
        connected: false,
        mac_address: "",
      },
    ],
    pediatric_key: false,
    useSbidInventory: [],
    useSpidInventory: [],
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

      const arrey = arr[keyName][arr[keyName].length-1];
      console.log(arrey)
      if(arrey?.sbid) {
        const updatedArray = removeFirstOccurrenceSbid(arr, 'useSbidInventory', arrey?.sbid);
      }

      if(arrey?.spid) {
        const updatedArray = removeFirstOccurrenceSbid(arr, 'useSpidInventory', arrey?.spid);
      }

      // if(arr[keyName].length > 1){
      arr[keyName].pop();
      setFormData(arr);
      // }
    }
  };

  function removeFirstOccurrenceSbid(arr, keyName, sbid) {
    const inventoryArray = arr[keyName];
    const index = inventoryArray.indexOf(sbid);
    
    if (index !== -1) {
      inventoryArray.splice(index, 1);
    }
    
    return inventoryArray;
  }

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

  const handleSubmit = async (e) => {
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

    let adult_pad_exp_date = [];
    formData?.AdultPadInformation.map((item) => {
      if (item?.adult_pad_expiration) {
        adult_pad_exp_date.push(item?.adult_pad_expiration);
      }
    });

    // await  setUnknownonAllFieldsisBlank();

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

    if (formData?.no_spares_toggle && PermissionRedux?.has_pad) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.SpareAdultPadInfo);
      if (!if_has_btery) {
        let n = "no_spare_adult_pak_info_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "SpareAdultPadInfo";
        let v2 = updateJsonArrayWithUnknown(formData?.SpareAdultPadInfo);
        FD[n2] = v2;

        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }
    // if(PermissionRedux?.has_pad){
    //     const if_has_btery  = checkIfAnyKeyHasValue(formData?.AdultPadInformation);
    //     if(!if_has_btery){
    //         let n  = 'no_has_pad_toggle';
    //         let v  = 1;
    //         let FD = {...formData }
    //         FD[n]  = v;
    //         let n2 = 'AdultPadInformation';
    //         let v2 = updateJsonArrayWithUnknown(formData?.AdultPadInformation);
    //         FD[n2] = v2;

    //         mainFormData[n] = v;
    //         mainFormData[n2] = v2;
    //         setFormData(FD);
    //     }
    // }
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

    if (formData?.no_spares_toggle && PermissionRedux?.has_padpak) {
      const if_has_btery = checkIfAnyKeyHasValue(
        formData?.SpareAdultPadPakInfo
      );
      if (!if_has_btery) {
        let n = "no_spare_adult_pad_pak_info_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "SpareAdultPadPakInfo";
        let v2 = updateJsonArrayWithUnknown(formData?.SpareAdultPadPakInfo);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }

    // if (!!formData.no_pediatric_toggle && PermissionRedux?.has_ped_pad) {
    //   const if_has_btery = checkIfAnyKeyHasValue(
    //     formData?.PediatricPadInformation
    //   );
    //   if (!if_has_btery) {
    //     let n = "no_has_pedpad_toggle";
    //     let v = 1;
    //     let FD = { ...formData };
    //     FD[n] = v;
    //     let n2 = "PediatricPadInformation";
    //     let v2 = updateJsonArrayWithUnknown(formData?.PediatricPadInformation);
    //     FD[n2] = v2;
    //     mainFormData[n] = v;
    //     mainFormData[n2] = v2;
    //     setFormData(FD);
    //   }
    // }

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

    // if(!!formData.no_pediatric_toggle && PermissionRedux?.has_padpak){
    //     const if_has_btery  = checkIfAnyKeyHasValue(formData?.sparePadricPadInfo);
    //     if(!if_has_btery){
    //         let n  = 'no_spare_padric_pad_info_toggle';
    //         let v  = 1;
    //         let FD = {...formData }
    //         FD[n]  = v;
    //         let n2 = 'sparePadricPadInfo';
    //         let v2 = updateJsonArrayWithUnknown(formData?.sparePadricPadInfo);
    //         FD[n2] = v2;
    //         mainFormData[n] = v;
    //         mainFormData[n2] = v2;
    //         setFormData(FD);
    //     }
    // }

    // has_padpak sparePadricPadInfo
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
    // ChargePakInformation
    //

    // SpareAdultPadInfo SpareAdultPadPakInfo GatewayInformation

    // PermissionRedux?.has_pad

    /*
        formData?.has_battery
        formData?.has_9v
        formData?.has_installby
        formData?.has_man
        
        formData?.has_10pk
        */

    let sendFormData = {
      account_id: mainFormData?.account_id,
      site_id: mainFormData?.site_id,
      aed_brand_id: mainFormData?.brand,
      aed_model_id: mainFormData?.model_name,
      part_number: mainFormData?.part_number,
      sub_model_id: mainFormData?.sub_model,
      serial_number: mainFormData?.serial_number,
      warranty_date: mainFormData?.warenty_date,
      asset: mainFormData?.asset,
      other: [
        {
          label: mainFormData?.other1_lable,
          val: mainFormData?.other1,
        },
        {
          label: mainFormData?.other2_lable,
          val: mainFormData?.other2,
        },
      ],
      file_name: mainFormData?.file_name,
      placement: mainFormData?.placement || "unknown",
      purchase_type: mainFormData?.purchase_type,
      purchase_date: mainFormData?.purchase_date,
      no_spares_toggle: mainFormData?.no_spares_toggle || 0,
      no_pediatric_toggle: mainFormData?.no_pediatric_toggle || 0,
      RMS_toggle: mainFormData?.RMS_toggle || 0,
      out_of_service_toggle: mainFormData?.out_of_service_toggle || 0,

      rms_info: [
        {
          rms_brand: mainFormData?.rms_brand,
        },
      ],

      loaner_serial_id: mainFormData?.loaner_serial_id,
      out_of_service_info: [
        {
          date_sent_to_manufacturer: mainFormData?.date_sent_to_manufacturer,
          loaner_rental_serial: mainFormData?.loaner_rental_serial,
          loaner_rental_serial_name: mainFormData?.loaner_rental_serial_name,
          reason: mainFormData?.reason,
          not_replacing: mainFormData?.not_replacing,
          loaner_toggle: mainFormData?.loaner_toggle,
          replaced_serial: mainFormData?.replaced_serial,
          replaced_serial_name: mainFormData?.replaced_serial_name,
        },
      ],

      battery_info: [
        {
          has_battery: mainFormData?.has_battery,
          has_9v: mainFormData?.has_9v,
          has_installby: mainFormData?.has_installby,
          has_man: mainFormData?.has_man,
          has_10pk: mainFormData?.has_10pk,
        },
      ],

      batteries_expirations: batteries_expirations,
      adult_pad_exp_date: adult_pad_exp_date,
      min_exp_date: "",
      spare_battery_info: [
        {
          has_battery_spare: mainFormData?.has_battery_spare,
          has_9v_spare: mainFormData?.has_9v_spare,
          has_installby_spare: mainFormData?.has_installby_spare,
          has_man_spare: mainFormData?.has_man_spare,
          has_10pk_spare: mainFormData?.has_10pk_spare,
        },
      ],
      storage_info: [
        {
          storage_type: mainFormData?.storage_type,
          alarmed: mainFormData?.alarmed,
          alarm_status: mainFormData.alarm_status,
          v9_Installed_Date: mainFormData?.alarmed
            ? mainFormData?.v9_Installed_Date
            : "",
          expiry_date: mainFormData?.alarmed
            ? mainFormData?.store_expiry_date
            : "",
          // ? moment(mainFormData?.v9_Installed_Date).add(1, 'year') : "",
        },
      ],

      charge_pak_info: mainFormData?.ChargePakInformation,

      spare_charge_pak_info: mainFormData?.SpareChargePakInformation,

      adult_pad_info: mainFormData?.AdultPadInformation,

      spare_adult_pad_info: mainFormData?.SpareAdultPadInfo,

      adult_pad_pak_info: mainFormData?.AdultPadPakInfo,

      spare_adult_pad_pak_info: mainFormData?.SpareAdultPadPakInfo,

      pediatric_pad_info: mainFormData?.PediatricPadInformation,
      spare_padric_pad_info: mainFormData?.sparePadricPadInfo,
      pediatric_pak_pad_info: mainFormData?.PediatricPakPadInformation,
      spare_padric_pak_pad: mainFormData?.sparePadricPakPad,

      gateway_info: mainFormData?.GatewayInformation,
      builtin_RMS_info: mainFormData?.BuiltInRMSInformation,
      pediatric_key: mainFormData?.pediatric_key,
      last_check: "", // FormatDate(mainFormData?.check_date) removed by Gautam
      unknown_toggle: 0,
      useSbidInventory: mainFormData?.useSbidInventory,
      useSpidInventory: mainFormData?.useSpidInventory,
    };

    sendFormData.unknown_toggle = HasUnknownValue(sendFormData);
    // console.log({sendFormData});
    // return '';

    console.log({ mainFormData });

    let res = await CallPOSTAPI("account/save-aed", sendFormData);

    if (res?.data?.status) {
      setFormMsg({ type: res?.data?.status, msg: res?.data?.msg });
      toast.success("AED added successfully");
      const updatedPermission = {
        id: 0,
        brand_id: 0,
        model_name: "",
        model_partnumber: "",
        image_file_name: "",
        v_battery: 0,
        gateway_lifespan: 0,
        warranty: 0,
        has_ped_key: 0,
        has_ped_pad: 0,
        has_padpak: 0,
        has_pedpak: 0,
        has_chargepak: 0,
        has_9v: 0,
        has_gateway: 0,
        has_builtin_rms: 0,
        discontinued: 0,
        display: 0,
        auto: 0,
        semi: 0,
        has_installby: 0,
        has_10pk: 0,
        has_man: 0,
        has_battery: 0,
        has_pad: 0,
        created_by_id: 0,
        created_date: "",
        modified_by_id: 0,
        modified_date: "",
      };

      dispatch(updatePermission(updatedPermission));
      let pathUrl = "";
      if(user?.user_type == 3){
        pathUrl = "/user/Equipment/" + formData?.account_id;
      }
      else {
        pathUrl = "/account-details/" + formData?.account_id;
      }
      navigate(pathUrl, {
        state: {
          tab: "Equipment",
          type: res?.data?.status,
          msg: res?.data?.msg,
        },
      });
    } else {
      setFormMsg({ type: 0, msg: "Something went wrong please try again" });
      toast.error("Something went wrong please try again");
    }
    setLoading(false);
  };

  const [aedList, setAedList] = useState([]);
  const [loanerList, setLoanerList] = useState([]);

  const getAllAeds = async () => {
    console.log({AccId})
    // const result = await CallGETAPI("account/get-aed/" + aedData?.account_id);
    const result = await CallGETAPI(
      "account/get-aed-with-standalon/" + AccId
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

  // const getAllAeds = async () => {
  //   const result = await CallGETAPI("account/get-aed/" + AccId);
  //   // if(result?.data?.status){
  //   //   let aeds = result?.data?.data || [];
  //   //   console.log(aeds)
  //   // }


  //   if (result?.data?.status) {
  //     let aeds = result?.data?.data || [];
  //     const pendingaeds = result?.data?.pendingData;
  //     const a = result?.data?.data;
  //     a.forEach(obj => {
  //       const siteId = obj.site_id;
  //       console.log("Site ID:", siteId);
  //   });
  //     console.log(result?.data?.data)
  //     let newArr = [];

  //     if (Array.isArray(aeds) && pendingaeds.length > 0) {
  //       newArr = [...pendingaeds, ...aeds];
  //     } else {
  //       newArr = aeds;
  //     }
  //     let currentList = [];

  //     for (let i = 0; i < newArr.length; i++) {
  //       for (let j = 0; j < newArr[i].data.length; j++) {
  //         currentList.push(newArr[i].data[j]);
  //       }
  //     }

  //     // aeds = newArr;
  //     setAedList(currentList);
  //   }
  // };
  const getLoanerList = async () => {
    // const result = await CallGETAPI("account/get-ross-aed");
    const result = await CallGETAPI(`account/get-rental-serial/${formData?.site_id}`)
    
    if (result?.data?.status) {
      setLoanerList(result?.data?.serialNumbers);
    }
    setFormData((prev)=> ({
      ...prev,
      loaner_rental_serial: "",
      loaner_serial_id: "",
    }))
  };

  useEffect(() => {
    getLoanerList();
  },[formData?.site_id])

  useEffect(() => {
    if (AccId) {
      getAllAeds();
      getLoanerList();
    }
  }, [AccId]);

  const handleCancel = () => {
    const updatedPermission = {
      id: 0,
      brand_id: 0,
      model_name: "",
      model_partnumber: "",
      image_file_name: "",
      v_battery: 0,
      gateway_lifespan: 0,
      warranty: 0,
      has_ped_key: 0,
      has_ped_pad: 0,
      has_padpak: 0,
      has_pedpak: 0,
      has_chargepak: 0,
      has_9v: 0,
      has_gateway: 0,
      has_builtin_rms: 0,
      discontinued: 0,
      display: 0,
      auto: 0,
      semi: 0,
      has_installby: 0,
      has_10pk: 0,
      has_man: 0,
      has_battery: 0,
      has_pad: 0,
      created_by_id: 0,
      created_date: "",
      modified_by_id: 0,
      modified_date: "",
    };

    dispatch(updatePermission(updatedPermission));
    navigate(-1);
  };

  console.log({ formData });

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
                id: 0,
                brand_id: 0,
                model_name: "",
                model_partnumber: "",
                image_file_name: "",
                v_battery: 0,
                gateway_lifespan: 0,
                warranty: 0,
                has_ped_key: 0,
                has_ped_pad: 0,
                has_padpak: 0,
                has_pedpak: 0,
                has_chargepak: 0,
                has_9v: 0,
                has_gateway: 0,
                has_builtin_rms: 0,
                discontinued: 0,
                display: 0,
                auto: 0,
                semi: 0,
                has_installby: 0,
                has_10pk: 0,
                has_man: 0,
                has_battery: 0,
                has_pad: 0,
                created_by_id: 0,
                created_date: "",
                modified_by_id: 0,
                modified_date: "",
              };

              dispatch(updatePermission(updatedPermission));
              navigate(-1);
            }}
          >
            <img src="/back.svg" alt="svg" style={{ marginRight: "5px" }} />
            <span className="ms-2">Back</span>
          </button>

          <h2 className="heading" style={{ color: "black" }}>
            Add New AED
          </h2>


          <NewAedForm
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
            setAccId={setAccId}
            AccId={AccId}
            siteId={SiteID}
          />
          <ParentBatteryInfo
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

          {PermissionRedux?.has_chargepak || all_condition_true ? (
            <div className=" bg-gray py-4 px-4 mt-4">
              <div className="d-flex align-items-center justify-content-between">
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
                {/* <div className="toggle">
                  <label className="d-block mb-2">
                    <b>Unknown</b>
                  </label>
                  <CustomToggleButton
                    ToggleName="no_has_chargepak_toggle"
                    ToggleValue={formData?.no_has_chargepak_toggle}
                    changeHandler={handleCheckBox}
                  />
                </div> */}
              </div>
                      {console.log(formData?.ChargePakInformation)}
              {formData?.ChargePakInformation?.map((item, index) => (
                <ChargePakInfo
                  is_unknowntrue={item?.no_has_chargepak_toggle}
                  toogleKeyName={formData?.no_has_chargepak_toggle}
                  keyName={"ChargePakInformation"}
                  unKnownToggleKey={"no_has_chargepak_toggle"}
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
          )}

          {(formData?.no_spares_toggle &&
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
                {/* <div className="toggle">
                  <label className="d-block mb-2">
                    <b>Unknown</b>
                  </label>
                  <CustomToggleButton
                    ToggleName="no_spare_charge_pak_info_toggle"
                    ToggleValue={formData?.no_spare_charge_pak_info_toggle}
                    changeHandler={handleCheckBox}
                  />
                </div> */}
              </div>

              {formData?.SpareChargePakInformation?.map((item, index) => (
                <SpareChargePakInfo
                  is_unknowntrue={item?.no_spare_charge_pak_info_toggle}
                  toogleKeyName={formData?.no_has_chargepak_toggle}
                  keyName={"SpareChargePakInformation"}
                  unKnownToggleKey={"no_spare_charge_pak_info_toggle"}
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
          )}
          {PermissionRedux?.has_pad || all_condition_true ? (
            <div className=" bg-gray py-4 px-4 mt-4">
              <div className="d-flex align-items-center justify-content-between">
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
                {/* <div className="toggle">
                  <label className="d-block mb-2">
                    <b>Unknown</b>
                  </label>
                  <CustomToggleButton
                    ToggleName="no_has_pad_toggle"
                    ToggleValue={formData?.no_has_pad_toggle}
                    changeHandler={handleCheckBox}
                  />
                </div> */}
              </div>

              {formData?.AdultPadInformation?.map((item, index) => (
                <AdultPakInfo
                  is_unknowntrue={item?.no_has_pad_toggle}
                  toogleKeyName={formData?.no_has_pad_toggle}
                  keyName={"AdultPadInformation"}
                  unKnownToggleKey={"no_has_pad_toggle"}
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

          {formData?.no_spares_toggle &&
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
                {/* <div className="toggle">
                  <label className="d-block mb-2">
                    <b>Unknown</b>
                  </label>
                  <CustomToggleButton
                    ToggleName="no_spare_adult_pak_info_toggle"
                    ToggleValue={formData?.no_spare_adult_pak_info_toggle}
                    changeHandler={handleCheckBox}
                  />
                </div> */}
              </div>

              {formData?.SpareAdultPadInfo?.map((item, index) => (
                <SpareAdultPakInfo
                  is_unknowntrue={item?.no_spare_adult_pak_info_toggle}
                  keyName={"SpareAdultPadInfo"}
                  unKnownToggleKey={"no_spare_adult_pak_info_toggle"}
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
          {/*  */}

          {/* Adult Pad Pak Info */}
          {PermissionRedux?.has_padpak || all_condition_true ? (
            <div className=" bg-gray py-4 px-4 mt-4">
              <div className="d-flex align-items-center justify-content-between">
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
                {/* <div className="toggle">
                  <label className="d-block mb-2">
                    <b>Unknown</b>
                  </label>
                  <CustomToggleButton
                    ToggleName="no_has_padpak_toggle"
                    ToggleValue={formData?.no_has_padpak_toggle}
                    changeHandler={handleCheckBox}
                  />
                </div> */}
              </div>

              {formData?.AdultPadPakInfo?.map((item, index) => (
                <AdultPadPakInfo
                  is_unknowntrue={item?.no_has_padpak_toggle}
                  keyName={"AdultPadPakInfo"}
                  unKnownToggleKey={"no_has_padpak_toggle"}
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

          {(formData?.no_spares_toggle &&
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
                {/* <div className="toggle">
                  <label className="d-block mb-2">
                    <b>Unknown</b>
                  </label>
                  <CustomToggleButton
                    ToggleName="no_spare_adult_pad_pak_info_toggle"
                    ToggleValue={formData?.no_spare_adult_pad_pak_info_toggle}
                    changeHandler={handleCheckBox}
                  />
                </div> */}
              </div>

              {formData?.SpareAdultPadPakInfo?.map((item, index) => (
                <SpareAdultPadPakInfoComp
                  is_unknowntrue={item?.no_spare_adult_pad_pak_info_toggle}
                  keyName={"SpareAdultPadPakInfo"}
                  unKnownToggleKey={"no_spare_adult_pad_pak_info_toggle"}
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
          )}

          {(formData.no_pediatric_toggle && PermissionRedux?.has_ped_pad) ||
            all_condition_true ? (
            <div className=" bg-gray py-4 px-4 mt-4">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="heading">
                  {"Pediatric Pad Information"}
                  {/* sparePadricPadInfo
                   */}
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
                </h2>
                {/* <div className="toggle">
                  <label className="d-block mb-2">
                    <b>Unknown</b>
                  </label>
                  <CustomToggleButton
                    ToggleName="no_has_pedpad_toggle"
                    ToggleValue={formData?.no_has_pedpad_toggle}
                    changeHandler={handleCheckBox}
                  />
                </div> */}
              </div>

              {formData?.PediatricPadInformation?.map((item, index) => (
                <PediatricPadInfo
                  is_unknowntrue={item?.no_has_pedpad_toggle}
                  keyName={"PediatricPadInformation"}
                  unKnownToggleKey={"no_has_pedpad_toggle"}
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

          {formData?.no_spares_toggle &&
            // formData.no_pediatric_toggle &&
            // PermissionRedux?.has_ped_pad &&
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

                {/* <div className="toggle">
                  <label className="d-block mb-2">
                    <b>Unknown</b>
                  </label>
                  <CustomToggleButton
                    ToggleName="no_spare_padric_pad_info_toggle"
                    ToggleValue={formData?.no_spare_padric_pad_info_toggle}
                    changeHandler={handleCheckBox}
                  />
                </div> */}
              </div>

              {formData?.sparePadricPadInfo?.map((item, index) => (
                <SparePediatricPadInfo
                  is_unknowntrue={item?.no_spare_padric_pad_info_toggle}
                  keyName={"sparePadricPadInfo"}
                  unKnownToggleKey={"no_spare_padric_pad_info_toggle"}
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
          )}

          {(formData.no_pediatric_toggle && PermissionRedux?.has_padpak) ||
            all_condition_true ? (
            <div className=" bg-gray py-4 px-4 mt-4">
              <div className="d-flex align-items-center justify-content-between">
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
                {/* <div className="toggle">
                  <label className="d-block mb-2">
                    <b>Unknown</b>
                  </label>
                  <CustomToggleButton
                    ToggleName="no_has_pedpak_toggle"
                    ToggleValue={formData?.no_has_pedpak_toggle}
                    changeHandler={handleCheckBox}
                  />
                </div> */}
              </div>
              {formData?.PediatricPakPadInformation?.map((item, index) => (
                <PediatricPadPakInfo
                  is_unknowntrue={item?.no_has_pedpak_toggle}
                  keyName={"PediatricPakPadInformation"}
                  unKnownToggleKey={"no_has_pedpak_toggle"}
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

          {formData?.no_spares_toggle &&
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
                {/* <div className="toggle">
                  <label className="d-block mb-2">
                    <b>Unknown</b>
                  </label>
                  <CustomToggleButton
                    ToggleName="no_spare_padric_pad_pak_info_toggle"
                    ToggleValue={formData?.no_spare_padric_pad_pak_info_toggle}
                    changeHandler={handleCheckBox}
                  />
                </div> */}
              </div>

              {formData?.sparePadricPakPad?.map((item, index) => (
                <SparePediatricPadPakInfo
                  keyName={"sparePadricPakPad"}
                  unKnownToggleKey={"no_spare_padric_pad_pak_info_toggle"}
                  title="sparePadricPakPad"
                  crrIndex={index}
                  formData={formData}
                  setFormData={setFormData}
                  handleCheckBox={handleCheckBox}
                  handleInput={handleInput}
                  crrFormData={item}
                  addMore={addMorebattery_info}
                  padList={padList}
                  is_unknowntrue={item?.no_spare_padric_pad_pak_info_toggle}
                />
              ))}
            </div>
          ) : (
            ""
          )}

          {PermissionRedux?.has_ped_key || all_condition_true ? (
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
          )}

          {/* PediatricKeyInfo */}
          {PermissionRedux?.has_gateway || all_condition_true ? (
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
          )}

          {PermissionRedux?.has_builtin_rms || all_condition_true ? (
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
          )}

          <div className="col-12">
            <MessageHandler
              status={FormMsg.type}
              msg={FormMsg.msg}
              HandleMessage={setFormMsg}
            />
          </div>

          <div class="col-md-12 text-right py-4" style={{ marginBottom: '4%' }}>
            <button class="btn cancel-button" type={"button"} onClick={handleCancel}>
              Cancel
            </button>{" "}
            &nbsp;&nbsp;
            <button class="btn submit-button">
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
export default NewAed;

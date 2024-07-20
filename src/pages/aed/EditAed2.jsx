import React, { useEffect, useState } from "react";
import NewAedForm from "../../components/forms/NewAedForm";
import SubHeading from "../../components/header/SubHeading";
import {
  BatteryTypebyModel,
  FetchAEDDetails,
  FetchAccountDetails,
  GetAccountList,
  GetAedBrands,
  GetRMSBrand,
  PadTypeByModal,
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
import Loading from "../accounts/Loading";
import CustomToggleButton from "../../components/common/toggleSwitch/CustomToggleButton";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAEDLoading,
  updatePermission,
} from "../../redux/slices/AEDSlice";
import { checkIfAnyKeyHasValue, updateJsonArrayWithUnknown } from ".";
import { HasUnknownValue } from "../../helper/Common";
import EditParentBatteryInfo from "../../components/forms/subaed_forms/EditParentBatteryInfo";
import EditAdultPakInfo from "../../components/forms/subaed_forms/EditAed2.jsx/EditAdultPakInfo";
import EditSpareAdultPadInfo from "../../components/forms/subaed_forms/EditAed2.jsx/EditSpareAdultPakInfo";
import EditAdultPadPakInfo from "../../components/forms/subaed_forms/EditAed2.jsx/EditAdultPadPakInfo";
import EditSpareAdultPadPakInfoComp from "../../components/forms/subaed_forms/EditAed2.jsx/EditSpareAdultPadPakInfoComp";
import EditPediatricPadInfo from "../../components/forms/subaed_forms/EditAed2.jsx/EditPediatricPadInfo";
import EditSparePediatricPadInfo from "../../components/forms/subaed_forms/EditAed2.jsx/EditSparePediatricPadInfo";
import EditPediatricPadPakInfo from "../../components/forms/subaed_forms/EditAed2.jsx/EditPediatricPadPakInfo";
import EditSparePediatricPadPakInfo from "../../components/forms/subaed_forms/EditAed2.jsx/EditSparePediatricPadPakInfo";
import EditChargePakInfo from "../../components/forms/subaed_forms/EditAed2.jsx/EditChargePakInfo";
import EditSpareChargePakInfo from "../../components/forms/subaed_forms/EditAed2.jsx/EditSpareChargePakInfo";
// GatewayInformation
const EditAedForm2 = () => {
  const all_condition_true = 0;
  // const {id}
  const routes = useParams();
  const navigate = useNavigate();

  const AccId = routes?.id;
  const AEDId = routes?.aedId;

  // const [AccountId,setAccoutnId] = useState()
  const [AccLidatData, setaccLidatData] = useState([]);
  const [brandData, setBrandData] = useState([]);

  const [RmsDropdown, SetRmsDropdown] = useState([]);
  const [BatteryList, setBatteryList] = useState([]);
  const [FormMsg, setFormMsg] = useState({ type: true, msg: "" });
  const [aedDetails, setAedDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const Permissins = useSelector((state) => state?.AED_manager?.permissions);
  const dispatch = useDispatch();

  const PermissionRedux = useSelector(
    (state) => state?.AED_manager?.permissions
  );
  const AEDLoader = useSelector((state) => state?.AED_manager?.AEDLoader);
  // AEDLoader

  const [Permissins1, setPermission] = useState({
    auto: 0,
    brand_id: 0,
    created_by_id: null,
    created_date: "2023-05-04T19:51:56.000Z",
    discontinued: 0,
    display: 0,
    has_9v: 0,
    has_10pk: 0,
    has_battery: 1,
    has_builtin_rms: 0,
    has_chargepak: 0,
    has_gateway: 0,
    has_installby: 0,
    has_man: 0,
    has_pad: 0,
    has_padpak: 0,
    has_ped_key: 0,
    has_ped_pad: 0,

    id: 0,
    image_file_name: "",
    model_name: "",
    model_partnumber: null,
    modified_by_id: null,
    modified_date: null,
    semi: 0,
  });

  const spare_battery_info = {
    battery_type_id: "",
    battery_expiration: "",
    battery_lot: "",
    battery_uid: "",
    v9_install: "",
    install_before_date: "",
    date_installed: "",
    manufactured_date: "",
    battery_serial: "",
    add_row: 1,
  };

  const SpareChargePackInfo = {
    spare_charge_pak_part: "",
    spare_charge_pak_uiid: "",
    spare_battery_expiration: "",
    spare_battery_lot: "",
    spare_pad_1_part: "",
    spare_pad_1_expiration: "",
    spare_pad_1_lot: "",
    spare_pad_2_part: "",
    spare_pad_2_expiration: "",
    spare_pad_2_lot: "",
    add_row: 1,
  };

  const SpareAdultPadInfo = {
    pad_part: "",
    pad_expiration: "",
    pad_lot: "",
    pad_UDI: "",
    add_row: 1,
  };

  const sparePadricPadInfo = {
    pad_part: "",
    pad_expiration: "",
    pad_lot: "",
    pad_UDI: "",
    add_row: 1,
  };

  const sparePadricPakPad = {
    pad_part: "",
    pad_expiration: "",
    pad_lot: "",
    pad_UDI: "",
    add_row: 1,
  };

  const SpareAdultPadPakInfo = {
    pad_part: "",
    pad_expiration: "",
    pad_lot: "",
    pad_UDI: "",
    add_row: 1,
  };
  const AdultPadInfoVAl = {
    pad_part: "",
    pad_expiration: "",
    pad_lot: "",
    pad_UDI: "",
  };
  const ChargePakInfoVal = {
    pad_type_id:"",
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
  };

  const PediatricPadInformationVal = {
    pad_part: "",
    pad_expiration: "",
    pad_lot: "",
    pad_UDI: "",
  };

  const PediatricPakPadInformationVal = {
    pad_part: "",
    pad_expiration: "",
    pad_lot: "",
    pad_UDI: "",
  };
  const GateWayInfoVal = {
    installed: "",
    connected: "",
    gateway_serial: "",
    gateway_Mmac_address: "",
    battery_install_date: "",
  };
  const [formData, setFormData] = useState({
    // General Information
    account_id: AccId,
    account: AccId,
    site: "",
    brand: "",
    model_name: "",
    part_no: "",
    sub_model: "",
    serial: "",
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

    no_spares_toggle: 1,
    no_pediatric_toggle: 1,
    RMS_toggle: 0,
    out_of_service_toggle: 0,
    no_spare_padric_pad_info_toggle: 0,

    // Out of Service Information
    replaced_serial: "",
    replaced_serial_name: "",
    date_sent_to_manufacturer: "",
    loaner_rental_serial: "",
    loaner_rental_serial_name: "",
    reason: "",
    not_replacing: false,
    loaner_serial_id: 0,

    // StorageInformation
    storage_type: "",
    alarmed: "",
    alarm_status: "",
    v9_Installed_Date: "",

    has_battery: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_uid: "",
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
        battery_uid: "",
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
        battery_uid: "",
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
        battery_uid: "",
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
        battery_uid: "",
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
        battery_uid: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
      },
    ],

    spare_battery_info: [],

    battery_info1: [
      {
        battery_type_id: "",
        battery_expiration: "",
        battery_lot: "",
        battery_uid: "",
        v9_install: "",
        install_before_date: "",
        date_installed: "",
        manufactured_date: "",
        battery_serial: "",
      },
    ],

    ChargePakInformation: [ChargePakInfoVal],
    SpareChargePakInformation: [],
    AdultPadInformation: [AdultPadInfoVAl],
    SpareAdultPadInfo: [],
    AdultPadPakInfo: [AdultPadInfoVAl],
    SpareAdultPadPakInfo: [],
    PediatricPadInformation: [PediatricPadInformationVal],
    sparePadricPadInfo: [],
    PediatricPakPadInformation: [PediatricPakPadInformationVal],
    sparePadricPakPad: [],

    GatewayInformation: [GateWayInfoVal],
    BuiltInRMSInformation: [
      {
        connected: false,
        mac_address: "",
        alarmed: "",
      },
    ],
    pediatric_key: false,

    adult_pad_info: [AdultPadInfoVAl],
    spare_adult_pad_info: [],
    adult_pad_pak_info: [AdultPadInfoVAl],
    spare_adult_pad_pak_info: [],
    pediatric_pad_info: [PediatricPadInformationVal],
    spare_padric_pad_info: [],
    pediatric_pak_pad_info: [PediatricPadInformationVal],
    spare_padric_pak_pad: [],
    store_expiry_date: "",
    dni_array_list: [],
    deletedBatteried: [],
    unKnownArr: [],
    useSbidInventory: [],
    useSpidInventory: [],
  });

  // const [accountData,setAccountData] = useState(null);
  const fetchAccount = async () => {
    if (formData?.account) {
      let fd = { ...formData };
      let res = await FetchAccountDetails(formData.account);
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

  const [currentAccountId, setCurrentAccountId] = useState(null);

  const onLoad = async () => {
    const res = await CallGETAPI("account/get-aed-by-id/" + AEDId);
    const allPadsData = res?.data?.allPads;
    const batteryInfoData = res?.data?.batteryInfo;

    if (res.status) {
      setCurrentAccountId(res?.data?.data?.account_id);
    }

    dispatch(updateAEDLoading(1));
    let AccoutnList = await GetAccountList();
    let brandList = await GetAedBrands();
    let RmsBList = await GetRMSBrand();
    let AEDFromData = await FetchAEDDetails(AEDId);
    // "charge_pack" , "adult_pad_info", "spare_adult_pad_info", "adult_pad_pak_info", "spare_adult_pad_pak_info", "pediatric_pad_info", "pediatric_pak_pad_info"
    const CP = [],
      API = [],
      SAPI = [],
      APPI = [],
      SAPPI = [],
      PPI = [],
      SPPI = [],
      PPPI = [],
      SPPPI = [];

    // AEDFromData.AdultPadInformation = allPadsData

    AEDFromData.adult_pad_info = JSON.parse(AEDFromData?.adult_pad_info);
    AEDFromData.AdultPadInformation = AEDFromData?.adult_pad_info;
    AEDFromData.adult_pad_pak_info = JSON.parse(
      AEDFromData?.adult_pad_pak_info
    );
    AEDFromData.AdultPadPakInfo = AEDFromData?.adult_pad_pak_info;
    // AEDFromData.AdultPadPakInfo = allPadsData

    AEDFromData.battery_info = JSON.parse(AEDFromData?.battery_info);
    // const HB = [], H9V=[], h10PK=[], HIB=[], HM=[];
    const BI = {
      charge_pack: [],
      has_battery: [],
      has_9v: [],
      has_10pk: [],
      has_installby: [],
      has_man: [],
    };
    const SPBI = {
      spare_charge_pack: [],
      has_battery_spare: [],
      has_9v_spare: [],
      has_10pk_spare: [],
      has_installby_spare: [],
      has_man_spare: [],
    };
    for (let bii = 0; bii < batteryInfoData?.length; bii++) {
      const b2 = batteryInfoData[bii] || false;
      if (!b2) {
        break;
      }
      if (b2.is_spare) {
        const key = b2.section_name + "_spare";
        if (SPBI[key]) {
          SPBI[key].push(b2);
        }
      } else {
        const key = b2.section_name;
        if (BI[key]) {
          BI[key].push(b2);
        }
      }
    }

    AEDFromData.has_battery = BI.has_battery; // AEDFromData?.battery_info?.[0]?.has_battery ? AEDFromData?.battery_info?.[0]?.has_battery : []
    AEDFromData.has_9v = BI.has_9v; //AEDFromData?.battery_info?.[0]?.has_9v ? AEDFromData?.battery_info?.[0]?.has_9v : []
    AEDFromData.has_10pk = BI.has_10pk; //AEDFromData?.battery_info?.[0]?.has_10pk ? AEDFromData?.battery_info?.[0]?.has_10pk : []
    AEDFromData.has_installby = BI.has_installby; //AEDFromData?.battery_info?.[0]?.has_installby ? AEDFromData?.battery_info?.[0]?.has_installby : []
    AEDFromData.has_man = BI.has_man; //AEDFromData?.battery_info?.[0].has_man ? AEDFromData?.battery_info?.[0]?.has_man : []

    AEDFromData.builtin_RMS_info = AEDFromData?.builtin_RMS_info
      ? JSON.parse(AEDFromData?.builtin_RMS_info)
      : [];
    AEDFromData.BuiltInRMSInformation = AEDFromData?.builtin_RMS_info;
    
    const ar1 = [];
    const SPar1 = [];
    const PartnumberPads = [];
    for (let ci = 0; ci < batteryInfoData?.length; ci++) {
      const ell = batteryInfoData[ci];
      if (ell.section_name === "charge_pack") {
        const ChargePakInfoObj = {
          battery_expiration: ell?.battery_expiration,
          battery_lot: ell?.battery_lot,
          charge_pak_part: ell?.battery_type_id,
          charge_pak_uiid: ell?.charge_pak_uid,
          charge_pak_uid: ell?.charge_pak_uid,
          section_name : ell?.section_name,
          is_spare : ell?.is_spare,
          pad_1_expiration: "",
          pad_1_lot: "",
          pad_1_part: "",
          pad_2_expiration: "",
          pad_2_lot: "",
          pad_2_part: "",
          pad_type_id:"",
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
    AEDFromData.charge_pak_info = ar1.length > 0 ? ar1 : [ChargePakInfoVal];
    AEDFromData.ChargePakInformation = AEDFromData?.charge_pak_info || [ChargePakInfoVal];
    AEDFromData.spare_charge_pak_info = SPar1;
    AEDFromData.SpareChargePakInformation = AEDFromData?.spare_charge_pak_info;

    AEDFromData.has_chargepak = AEDFromData?.charge_pak_info[0]?.has_chargepak;
    AEDFromData.gateway_info = JSON.parse(AEDFromData?.gateway_info);
    AEDFromData.GatewayInformation = AEDFromData?.gateway_info;
    AEDFromData.other = JSON.parse(AEDFromData?.other);
    AEDFromData.out_of_service_info = JSON.parse(
      AEDFromData?.out_of_service_info
    );
    AEDFromData.pediatric_pad_info = JSON.parse(
      AEDFromData?.pediatric_pad_info
    );
    AEDFromData.PediatricPadInformation = AEDFromData?.pediatric_pad_info;
    // AEDFromData.PediatricPadInformation = allPadsData

    AEDFromData.pediatric_pak_pad_info = JSON.parse(
      AEDFromData?.pediatric_pak_pad_info
    );
    AEDFromData.PediatricPakPadInformation =
      AEDFromData?.pediatric_pak_pad_info;
    // AEDFromData.PediatricPakPadInformation = allPadsData

    AEDFromData.rms_info = JSON.parse(AEDFromData?.rms_info);
    AEDFromData.spare_adult_pad_info = JSON.parse(
      AEDFromData?.spare_adult_pad_info
    );
    AEDFromData.SpareAdultPadInfo = AEDFromData?.spare_adult_pad_info;
    // AEDFromData.SpareAdultPadInfo = allPadsData

    AEDFromData.spare_adult_pad_pak_info = JSON.parse(
      AEDFromData?.spare_adult_pad_pak_info
    );
    // AEDFromData.SpareAdultPadPakInfo = allPadsData

    AEDFromData.spare_battery_info = JSON.parse(
      AEDFromData?.spare_battery_info
    );
    AEDFromData.has_battery_spare = SPBI?.has_battery_spare || []; //AEDFromData?.spare_battery_info?.[0]?.has_battery_spare ? AEDFromData?.spare_battery_info?.[0]?.has_battery_spare : []
    AEDFromData.has_9v_spare = SPBI?.has_9v_spare || []; //AEDFromData?.spare_battery_info?.[0]?.has_9v_spare ? AEDFromData?.spare_battery_info?.[0]?.has_9v_spare : []
    AEDFromData.has_10pk_spare = SPBI?.has_10pk_spare || []; //AEDFromData?.spare_battery_info?.[0]?.has_10pk_spare ? AEDFromData?.spare_battery_info?.[0]?.has_10pk_spare : []
    AEDFromData.has_installby_spare = SPBI?.has_installby_spare || []; //AEDFromData?.spare_battery_info?.[0]?.has_installby_spare ? AEDFromData?.spare_battery_info?.[0]?.has_installby_spare : []
    AEDFromData.has_man_spare = SPBI?.has_man_spare || []; //AEDFromData?.spare_battery_info?.[0]?.has_man_spare ? AEDFromData?.spare_battery_info?.[0]?.has_man_spare : []

    // AEDFromData.spare_charge_pak_info = JSON.parse(
    //   AEDFromData?.spare_charge_pak_info
    // );
    // AEDFromData.SpareChargePakInformation = AEDFromData?.spare_charge_pak_info;

    AEDFromData.spare_padric_pad_info = JSON.parse(
      AEDFromData?.spare_padric_pad_info
    );
    AEDFromData.sparePadricPadInfo = AEDFromData?.spare_padric_pad_info;
    // AEDFromData.sparePadricPadInfo = allPadsData

    AEDFromData.spare_padric_pak_pad = JSON.parse(
      AEDFromData?.spare_padric_pak_pad
    );
    // AEDFromData.sparePadricPakPad = allPadsData

    AEDFromData.storage_info = JSON.parse(AEDFromData?.storage_info);
    AEDFromData.storage_type = AEDFromData?.storage_info?.length > 0 ? 1 : 0;
    AEDFromData.alarmed = AEDFromData?.storage_info[0]?.alarmed ? 1 : 0;
    AEDFromData.alarm_status = AEDFromData?.storage_info[0]?.alarm_status
      ? 1
      : 0;
    AEDFromData.v9_Installed_Date =
      AEDFromData?.storage_info[0]?.v9_Installed_Date;
    AEDFromData.store_expiry_date = AEDFromData?.storage_info[0]?.expiry_date;
    AEDFromData.expiry_date = AEDFromData?.storage_info[0]?.expiry_date;
    // store_expiry_date
    AEDFromData.storage_type = AEDFromData?.storage_info[0]?.storage_type;
    AEDFromData.file_name = AEDFromData?.aed_image;
    AEDFromData.model_name = AEDFromData?.aed_model_id;
    AEDFromData.brand = AEDFromData?.aed_brand_id;
    AEDFromData.serial = AEDFromData?.serial_number;
    AEDFromData.sub_model = AEDFromData?.sub_model_id;
    AEDFromData.rms_brand = AEDFromData?.rms_info?.[0]?.rms_brand || "";

    // all pads
    // PediatricPadInformation, PediatricPakPadInformation,SpareAdultPadInfo,SpareAdultPadPakInfo,SpareChargePakInformation, sparePadricPadInfo,sparePadricPakPad

    const AP = [],
      SAP = [],
      PP = [],
      SPP = [],
      APP = [],
      SAPP = [],
      PPP = [],
      SPPP = [],
      CP2 = [],
      SCP = [];
    for (let api = 0; api < allPadsData.length; api++) {
      const APD = allPadsData[api] || false;
      if (!APD) {
        break;
      }
      if (
        APD.section_name === "charge_pack" ||
        APD.section_name === "spare_charge_pack"
      ) {
        APD.pad_part = APD.pad_type_id;

        if (APD.is_spare) {
          SCP.push(APD);
        } else {
          CP2.push(APD);
        }
      }

      if (
        APD.section_name === "adult_pad_info" ||
        APD.section_name === "spare_adult_pad_info"
      ) {
        APD.pad_part = APD.pad_type_id;

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
        APD.pad_part = APD.pad_type_id;

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
        APD.pad_part = APD.pad_type_id;
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
        APD.pad_part = APD.pad_type_id;

        if (APD.is_spare) {
          SPPP.push(APD);
        } else {
          PPP.push(APD);
        }
      }
    }
    if (PP.length === 0) {
      PP.push(PediatricPadInformationVal);
    }
    // PediatricPakPadInformation pediatric_pad_info spare_padric_pad_info
    AEDFromData.AdultPadInformation = AP; //aedDetails1?.adult_pad_info ||[];
    AEDFromData.adult_pad_info = AP; //aedDetails1?.adult_pad_info ||[];
    AEDFromData.SpareAdultPadInfo = SAP; //aedDetails1?.spare_adult_pad_info ||[];
    AEDFromData.spare_adult_pad_info = SAP; //aedDetails1?.spare_adult_pad_info ||[];
    AEDFromData.PediatricPadInformation = PP; //aedDetails1?.pediatric_pad_info ||[];
    AEDFromData.pediatric_pad_info = PP; //aedDetails1?.pediatric_pad_info ||[];
    AEDFromData.sparePadricPadInfo = SPP; //aedDetails1?.spare_padric_pad_info ||[];
    AEDFromData.spare_padric_pad_info = SPP; //aedDetails1?.spare_padric_pad_info ||[];
    AEDFromData.AdultPadPakInfo = APP; //aedDetails1?.adult_pad_pak_info ||[];
    AEDFromData.adult_pad_pak_info = APP; //aedDetails1?.adult_pad_pak_info ||[];
    AEDFromData.SpareAdultPadPakInfo = SAPP; //aedDetails1?.spare_adult_pad_pak_info ||[];
    AEDFromData.spare_adult_pad_pak_info = SAPP; //aedDetails1?.spare_adult_pad_pak_info ||[];
    AEDFromData.PediatricPakPadInformation = PPP; //aedDetails1?.pediatric_pak_pad_info ||[];
    AEDFromData.pediatric_pak_pad_info = PPP; //aedDetails1?.pediatric_pak_pad_info ||[];
    AEDFromData.sparePadricPakPad = SPPP; //aedDetails1?.spare_padric_pak_pad || [];
    AEDFromData.spare_padric_pak_pad = SPPP; //aedDetails1?.spare_padric_pak_pad || [];
    AEDFromData.no_spares_toggle = AEDFromData?.no_spares_toggle;
    // no_spares_toggle
    setAedDetails(AEDFromData);
    setFormData((old) => ({
      ...old,
      ...AEDFromData,
      ...AEDFromData?.out_of_service_info[0],
    }));
    // let PermissinsData = {
    //     auto: 0,
    //     brand_id: AEDFromData.brand,
    //     created_by_id: AEDFromData.created_by_id,
    //     created_date: AEDFromData.created_date,
    //     discontinued: 0,
    //     display: 0,
    //     has_9v: AEDFromData.battery_info[0].has_9v?.length > 0 ? 1 : 0,
    //     has_10pk: AEDFromData.battery_info[0].has_10pk?.length > 0 ? 1 : 0,
    //     has_battery: AEDFromData?.has_battery?.length > 0 ? 1 : 0,
    //     has_builtin_rms: AEDFromData.builtin_RMS_info?.length > 0 ? 1 : 0,
    //     has_chargepak: AEDFromData.battery_info[0].charge_pak_info?.length > 0 ? 1 : 0,
    //     has_gateway:  AEDFromData?.gateway_info?.length > 0 ? 1 : 0,
    //     has_installby: AEDFromData.battery_info[0].has_installby?.length > 0 ? 1 : 0,
    //     has_man: AEDFromData.battery_info[0].has_man?.length > 0 ? 1 : 0,
    //     has_pad: AEDFromData.adult_pad_info?.length > 0 ? 1 : 0,
    //     has_padpak: AEDFromData.pediatric_pak_pad_info?.length > 0 ? 1 : 0,
    //     has_ped_key: AEDFromData.pediatric_key,
    //     has_ped_pad: AEDFromData.pediatric_pad_info?.length > 0 ? 1 : 0,
    //     id: AEDFromData.aed_id,
    //     image_file_name: AEDFromData.file_name,
    //     model_name: AEDFromData.model_name,
    //     model_partnumber: null,
    //     modified_by_id: AEDFromData.modified_by_id,
    //     modified_date: AEDFromData.modified_date,
    //     semi: 0,
    // }

    // setPermission((old) => ({...old, ...PermissinsData}));
    // dispatch(updatePermission(PermissinsData));

    let accListData = AccoutnList?.data?.data?.account || [];
    let bradlistData = brandList?.data || [];

    SetRmsDropdown(RmsBList);
    setaccLidatData(accListData);
    setBrandData(bradlistData);

    setShowLoading(false);
    dispatch(updateAEDLoading(0));
  };

  const getBatteryType = async () => {
    let betteryData = await BatteryTypebyModel(formData?.model_name);
    setBatteryList(betteryData);
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
        if (key.includes("part")) {
          updatedObj[key] = toogleValue ? "unknown" : "";
        } else {
          updatedObj[key] = toogleValue ? "unknown" : "";
        }
      }
      return updatedObj;
    });

    return newArray;
  };

  const addMorebattery_info = (type) => {
    if (type === "add") {
      let arr = { ...formData };
      let crr = arr.battery_info[arr?.battery_info.length - 1];
      // if (keyName === "SpareAdultPadInfo") {
      //   crr = SpareAdultPadInfo;
      // }
      arr.battery_info.push(crr);
      setFormData(arr);
    } else {
      let arr = { ...formData };
      // if (arr.battery_info.length > 1)
      // {
      //     arr.battery_info.pop();
      //     setFormData(arr);
      // }
      arr.battery_info.pop();
      setFormData(arr);
    }
  };

  const addMorespare_battery_info = () => {
    let arr = { ...formData };
    let crr = arr.spare_battery_info[arr?.spare_battery_info.length - 1];
    arr.spare_battery_info.push(crr);
    setFormData(arr);
  };

  const Removespare_battery_info = (index) => {
    let arr = { ...formData };
    // if (arr?.spare_battery_info.length > 1)
    // {
    //     arr.spare_battery_info.pop();
    //     setFormData(arr);
    // }
    arr.spare_battery_info.pop();
    setFormData(arr);
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

      // if (arr[ keyName ].length > 1)
      // {
      //     arr[ keyName ].pop();
      //     setFormData(arr);
      // }
      arr[keyName].pop();
      setFormData(arr);
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

  // useEffect(() =>
  // {
  //     fetchAccount();
  // }, [ formData?.account ]);

  const [padList, setPadList] = useState([]);

  const fetchAEDPads = async () => {
    let result = await PadTypeByModal(formData?.model_name);
    setPadList(result);
  };

  useEffect(() => {
    if (formData?.model_name) {
      getBatteryType();
    }
  }, [formData.model_name]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let batteries_expirations = [];
    const mainFormData = { ...formData };

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

    if (formData.no_pediatric_toggle && PermissionRedux?.has_ped_pad) {
      const if_has_btery = checkIfAnyKeyHasValue(
        formData?.PediatricPadInformation
      );
      if (!if_has_btery) {
        let n = "no_has_pedpad_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "PediatricPadInformation";
        let v2 = updateJsonArrayWithUnknown(formData?.PediatricPadInformation);
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

    // if(formData.no_pediatric_toggle && PermissionRedux?.has_padpak){
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
    if (PermissionRedux?.has_chargepak) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.charge_pak_info);
      if (!if_has_btery) {
        let n = "no_has_chargepak_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "charge_pak_info";
        let v2 = updateJsonArrayWithUnknown(formData?.charge_pak_info);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }
    if (formData?.no_spares_toggle && PermissionRedux?.has_chargepak) {
      const if_has_btery = checkIfAnyKeyHasValue(
        formData?.SpareChargePakInformation
      );
      if (!if_has_btery) {
        let n = "no_spare_charge_pak_info_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "SpareChargePakInformation";
        let v2 = updateJsonArrayWithUnknown(
          formData?.SpareChargePakInformation
        );
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    }

    //  Edit

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
    } else {
      let FD = { ...formData };
      let n2 = "AdultPadInformation";
      let v2 = [AdultPadInfoVAl];
      FD[n2] = v2;
      mainFormData[n2] = v2;
      setFormData(FD);
    }

    /*
        adult_pad_info: [AdultPadInfoVAl],
        spare_adult_pad_info:[],
        adult_pad_pak_info:[  AdultPadInfoVAl ],
        spare_adult_pad_pak_info:[],
        pediatric_pad_info:[ PediatricPadInformationVal ],
        spare_padric_pad_info:[],
        pediatric_pak_pad_info:[  PediatricPadInformationVal ],
        spare_padric_pak_pad:[], */
    if (formData?.no_spares_toggle && PermissionRedux?.has_pad) {
      const if_has_btery = checkIfAnyKeyHasValue(
        formData?.spare_adult_pad_info
      );
      if (!if_has_btery) {
        let n = "no_has_pad_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "spare_adult_pad_info";
        let v2 = updateJsonArrayWithUnknown(formData?.spare_adult_pad_info);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    } else {
      let FD = { ...formData };
      let n2 = "spare_adult_pad_info";
      let v2 = [];
      FD[n2] = v2;
      mainFormData[n2] = v2;
      setFormData(FD);
    }

    if (PermissionRedux?.has_padpak) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.adult_pad_pak_info);
      if (!if_has_btery) {
        let n = "no_has_padpak_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "adult_pad_pak_info";
        let v2 = updateJsonArrayWithUnknown(formData?.adult_pad_pak_info);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    } else {
      let FD = { ...formData };
      let n2 = "adult_pad_pak_info";
      let v2 = [AdultPadInfoVAl];
      FD[n2] = v2;
      mainFormData[n2] = v2;
      setFormData(FD);
    }

    if (formData?.no_spares_toggle && PermissionRedux?.has_padpak) {
      const if_has_btery = checkIfAnyKeyHasValue(
        formData?.spare_adult_pad_pak_info
      );
      if (!if_has_btery) {
        let n = "no_spare_adult_pad_pak_info_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "spare_adult_pad_pak_info";
        let v2 = updateJsonArrayWithUnknown(formData?.spare_adult_pad_pak_info);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    } else {
      let FD = { ...formData };
      let n2 = "spare_adult_pad_pak_info";
      let v2 = [];
      FD[n2] = v2;
      mainFormData[n2] = v2;
      setFormData(FD);
    }
    if (formData.no_pediatric_toggle && PermissionRedux?.has_ped_pad) {
      const if_has_btery = checkIfAnyKeyHasValue(formData?.pediatric_pad_info);
      if (!if_has_btery) {
        let n = "no_has_pedpad_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "pediatric_pad_info";
        let v2 = updateJsonArrayWithUnknown(formData?.pediatric_pad_info);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    } else {
      let FD = { ...formData };
      let n2 = "pediatric_pad_info";
      let v2 = [PediatricPadInformationVal];
      FD[n2] = v2;
      mainFormData[n2] = v2;
      setFormData(FD);
    }

    if (
      formData?.no_spares_toggle &&
      formData.no_pediatric_toggle &&
      PermissionRedux?.has_ped_pad
    ) {
      const if_has_btery = checkIfAnyKeyHasValue(
        formData?.spare_padric_pad_info
      );
      if (!if_has_btery) {
        let n = "no_spare_padric_pad_info_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "spare_padric_pad_info";
        let v2 = updateJsonArrayWithUnknown(formData?.spare_padric_pad_info);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    } else {
      let FD = { ...formData };
      let n2 = "spare_padric_pad_info";
      let v2 = [];
      FD[n2] = v2;
      mainFormData[n2] = v2;
      setFormData(FD);
    }

    if (
      formData?.no_spares_toggle &&
      formData.no_pediatric_toggle &&
      PermissionRedux?.has_padpak
    ) {
      const if_has_btery = checkIfAnyKeyHasValue(
        formData?.spare_padric_pak_pad
      );
      if (!if_has_btery) {
        let n = "no_spare_padric_pad_info_toggle";
        let v = 1;
        let FD = { ...formData };
        FD[n] = v;
        let n2 = "spare_padric_pak_pad";
        let v2 = updateJsonArrayWithUnknown(formData?.spare_padric_pak_pad);
        FD[n2] = v2;
        mainFormData[n] = v;
        mainFormData[n2] = v2;
        setFormData(FD);
      }
    } else {
      let FD = { ...formData };
      let n2 = "spare_padric_pak_pad";
      let v2 = [];
      FD[n2] = v2;
      mainFormData[n2] = v2;
      setFormData(FD);
    }

    // if(PermissionRedux?.has_chargepak){
    //     const if_has_btery  = checkIfAnyKeyHasValue(formData?.ChargePakInformation);
    //     if(!if_has_btery){
    //         let n  = 'no_has_chargepak_toggle';
    //         let v  = 1;
    //         let FD = {...formData }
    //         FD[n]  = v;
    //         let n2 = 'ChargePakInformation';
    //         let v2 = updateJsonArrayWithUnknown(formData?.ChargePakInformation);
    //         FD[n2] = v2;
    //         mainFormData[n] = v;
    //         mainFormData[n2] = v2;
    //         setFormData(FD);
    //     }
    // }
    // else{
    //     let n2 = 'spare_padric_pad_info';
    //     let v2 = [];
    //     FD[n2] = v2;
    //     mainFormData[n] = v;
    //     mainFormData[n2] = v2;
    //     setFormData(FD);
    // }
    // if(PermissionRedux?.has_chargepak){
    //     const if_has_btery  = checkIfAnyKeyHasValue(formData?.charge_pak_info);
    //     if(!if_has_btery){
    //         let n  = 'no_has_chargepak_toggle';
    //         let v  = 1;
    //         let FD = {...formData }
    //         FD[n]  = v;
    //         let n2 = 'charge_pak_info';
    //         let v2 = updateJsonArrayWithUnknown(formData?.charge_pak_info);
    //         FD[n2] = v2;
    //         mainFormData[n] = v;
    //         mainFormData[n2] = v2;
    //         setFormData(FD);
    //     }
    // }
    // else{
    //     let n2 = 'spare_padric_pad_info';
    //     let v2 = [];
    //     FD[n2] = v2;
    //     mainFormData[n] = v;
    //     mainFormData[n2] = v2;
    //     setFormData(FD);
    // }
    // if(PermissionRedux?.has_chargepak){
    //     const if_has_btery  = checkIfAnyKeyHasValue(formData?.SpareChargePakInformation);
    //     if(!if_has_btery){
    //         let n  = 'no_spare_charge_pak_info_toggle';
    //         let v  = 1;
    //         let FD = {...formData }
    //         FD[n]  = v;
    //         let n2 = 'SpareChargePakInformation';
    //         let v2 = updateJsonArrayWithUnknown(formData?.SpareChargePakInformation);
    //         FD[n2] = v2;
    //         mainFormData[n] = v;
    //         mainFormData[n2] = v2;
    //         setFormData(FD);
    //     }
    // }
    // else{
    //     let n2 = 'spare_padric_pad_info';
    //     let v2 = [];
    //     FD[n2] = v2;
    //     mainFormData[n] = v;
    //     mainFormData[n2] = v2;
    //     setFormData(FD);
    // }

    // let sendFormData = {
    //     account_id:     mainFormData?.account_id,
    //     site_id:        mainFormData?.site_id,
    //     aed_brand_id:   mainFormData?.brand,
    //     aed_model_id:   mainFormData?.model_name,
    //     part_no:        mainFormData?.part_no,
    //     sub_model_id:   mainFormData?.sub_model,
    //     serial_number:  mainFormData?.serial_number,
    //     serial:         mainFormData?.serial_number,
    //     rms_brand:      mainFormData?.rms_brand,

    //     asset:          mainFormData?.asset,
    //     other: [
    //         {
    //             label:  mainFormData?.other1_lable,
    //             val:    mainFormData?.other1,
    //         },
    //         {
    //             label:  mainFormData?.other2_lable,
    //             val:    mainFormData?.other2,
    //         }
    //     ],
    //     file_name:              mainFormData?.file_name,
    //     placement:              mainFormData?.placement || 'unknown',
    //     purchase_type:          mainFormData?.purchase_type,
    //     purchase_date:          mainFormData?.purchase_date,
    //     batteries_expirations:  batteries_expirations,
    //     adult_pad_exp_date:     adult_pad_exp_date,
    //     min_exp_date:           "",
    //     no_spares_toggle:       mainFormData?.no_spares_toggle || 0,
    //     no_pediatric_toggle:    mainFormData?.no_pediatric_toggle || 0,
    //     RMS_toggle:             mainFormData?.RMS_toggle || 0,
    //     out_of_service_toggle:  mainFormData?.out_of_service_toggle || 0,

    //     rms_info: [
    //         {
    //             rms_brand: mainFormData?.rms_brand,
    //         }
    //     ],

    //     out_of_service_info: [ {
    //         "date_sent_to_manufacturer":    mainFormData?.date_sent_to_manufacturer,
    //         "loaner_rental_serial":         mainFormData?.loaner_rental_serial,
    //         "reason":                       mainFormData?.reason,
    //         "replaced_serial":              mainFormData?.replaced_serial,
    //         "not_replacing":                mainFormData?.not_replacing,
    //         "storage_type":                 mainFormData?.storage_type,
    //         "alarmed":                      mainFormData?.alarmed,
    //         "v9_Installed_Date":            mainFormData?.v9_Installed_Date,
    //         "expiry_date":                  mainFormData?.v9_Installed_Date ? moment(mainFormData?.v9_Installed_Date).add(1, 'year') : "",
    //     } ],

    //     battery_info: [ {
    //         has_battery: mainFormData?.has_battery,
    //         has_9v: mainFormData?.has_9v,
    //         has_installby: mainFormData?.has_installby,
    //         has_man: mainFormData?.has_man,
    //         has_10pk: mainFormData?.has_10pk,
    //     } ],

    //     spare_battery_info: [ {
    //         has_battery_spare: mainFormData?.has_battery_spare,
    //         has_9v_spare: mainFormData?.has_9v_spare,
    //         has_installby_spare: mainFormData?.has_installby_spare,
    //         has_man_spare: mainFormData?.has_man_spare,
    //         has_10pk_spare: mainFormData?.has_10pk_spare,
    //     } ],

    //     // storage_info: [ {
    //     //     storage_type: mainFormData?.storage_typ,
    //     //     alarmed: mainFormData?.alarme,
    //     //     v9_Installed_Date: mainFormData?.v9_Installed_Dat,
    //     //     expiry_date: mainFormData?.store_expiry_date
    //     // } ],

    //     storage_info: [ {
    //         storage_type: mainFormData?.storage_type,
    //         alarmed: mainFormData?.alarmed,
    //         v9_Installed_Date: mainFormData?.alarmed ? mainFormData?.v9_Installed_Date : '',
    //         expiry_date: mainFormData?.alarmed ? mainFormData?.store_expiry_date : ''
    //         // ? moment(mainFormData?.v9_Installed_Date).add(1, 'year') : "",
    //     } ],
    //     charge_pak_info:            mainFormData?.charge_pak_info,
    //     spare_charge_pak_info:      mainFormData?.spare_charge_pak_info,
    //     adult_pad_info:             mainFormData?.AdultPadInformation,
    //     spare_adult_pad_info:       mainFormData?.spare_adult_pad_info,
    //     adult_pad_pak_info:         mainFormData?.adult_pad_pak_info,
    //     spare_adult_pad_pak_info:   mainFormData?.spare_adult_pad_pak_info,
    //     pediatric_pad_info:         mainFormData?.pediatric_pad_info,
    //     spare_padric_pad_info:      mainFormData?.spare_padric_pad_info,
    //     pediatric_pak_pad_info:     mainFormData?.pediatric_pak_pad_info,
    //     spare_padric_pak_pad:       mainFormData?.spare_padric_pak_pad,
    //     gateway_info:               mainFormData?.gateway_info,
    //     builtin_RMS_info:           mainFormData?.builtin_RMS_info,
    //     pediatric_key:              mainFormData?.pediatric_key,
    //     last_check:                 '', //formData?.check_date, Removed BY Gautam
    // };
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
      out_of_service_info: mainFormData?.out_of_service_toggle
        ? [
          {
            date_sent_to_manufacturer:
              mainFormData?.date_sent_to_manufacturer,
            loaner_rental_serial: mainFormData?.loaner_rental_serial,
            loaner_rental_serial_name:
              mainFormData?.loaner_rental_serial_name,
            reason: mainFormData?.reason,
            not_replacing: mainFormData?.not_replacing,
            replaced_serial: mainFormData?.replaced_serial,
            replaced_serial_name: mainFormData?.replaced_serial_name,
          },
        ]
        : [],

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
          alarm_status: mainFormData?.alarm_status,
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
    let res = await CallPOSTAPI("account/edit-aed/" + AEDId, sendFormData);
    if (res?.data?.status) {
      setFormMsg({ type: res?.data?.status, msg: res?.data?.msg });
      toast.success("AED added successfully");
      navigate(-1);
    } else {
      setFormMsg({ type: 0, msg: "Something went wrong please try again" });
      toast.error("Something went wrong please try again");
    }
  };

  useEffect(() => {
    if (formData?.model_name) {
      fetchAEDPads();
    }
  }, [formData?.model_name]);

  const [aedList, setAedList] = useState([]);
  const [loanerList, setLoanerList] = useState([]);

  const getAllAeds = async () => {
    const result = await CallGETAPI("account/get-aed/" + currentAccountId);
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
    if (currentAccountId) {
      getAllAeds();
      getLoanerList();
    }
  }, [currentAccountId]);


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
          <div className="mt-4" style={{ paddingInline: "45px" }}>
            <form class="" onSubmit={handleSubmit}>
              <SubHeading
                title="Edit AED"
                subHeading={true}
                hideNew={true}
                hideHierarchy={true}
                bottomLinks={false}
              />
              <NewAedForm
                AccountList={AccLidatData}
                BrandList={brandData}
                formData={formData}
                setFormData={setFormData}
                setPermission={setPermission}
                Permissins={Permissins}
                RmsDropdown={RmsDropdown}
                all_condition_true={all_condition_true}
                is_edit={true}
                aedList={aedList}
                loanerList={loanerList}
              />

              <EditParentBatteryInfo
                formData={formData}
                setFormData={setFormData}
                handleCheckBox={handleCheckBox}
                handleInput={handleInput}
                addMore={addRemoveChargePakInfo}
                Permissins={Permissins}
                addRemoveBtn={addRemoveChargePakInfo}
                all_condition_true={all_condition_true}
                BatteryList={BatteryList}
                is_edit={true}
              />

              {Permissins?.has_chargepak || all_condition_true ? (
                <div className=" bg-gray py-4 px-4 mt-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <h2 className="heading">
                      {"Charge Pak Information"}
                      <button
                        onClick={() =>
                          addRemoveChargePakInfo(
                            "add",
                            "SpareChargePakInformation"
                          )
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
                        // ToggleValue={formData?.no_has_chargepak_toggle}
                        ToggleValue={
                          formData?.ChargePakInformation[0]?.pad_type_id ===
                            "unknown"
                            ? true
                            : false
                        }
                        changeHandler={handleCheckBox}
                      />
                    </div> */}
                  </div>
                  {formData?.ChargePakInformation?.map((item, index) => (
                    <EditChargePakInfo
                      is_unknowntrue={
                        item.pad_type_id === "unknown" ? true : false
                      }
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
                      is_edit={true}
                    />
                  ))}
                </div>
              ) : (
                ""
              )}

              {formData?.SpareChargePakInformation.length > 0 ||
                all_condition_true ? (
                <div className=" bg-gray py-4 px-4 mt-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <h2 className="heading">
                      {"Spare Charge Pak Information"}

                      <button
                        onClick={() =>
                          addRemoveChargePakInfo(
                            "add",
                            "SpareChargePakInformation"
                          )
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
                        ToggleValue={
                          formData?.SpareChargePakInformation[0]?.pad_type_id ===
                            "unknown"
                            ? true
                            : false
                        }
                        changeHandler={handleCheckBox}
                      />
                    </div> */}
                  </div>

                  {formData?.SpareChargePakInformation?.map((item, index) => (
                    <EditSpareChargePakInfo
                      keyName={"SpareChargePakInformation"}
                      toogleKeyName={formData?.no_spare_charge_pak_info_toggle}
                      is_unknowntrue={
                        item.pad_type_id === "unknown" ? true : false
                      }
                      title="Battery Information"
                      unKnownToggleKey={"no_spare_charge_pak_info_toggle"}
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
                      is_edit={1}
                    />
                  ))}
                </div>
              ) : (
                ""
              )}

              {Permissins?.has_pad || all_condition_true ? (
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
                        ToggleValue={
                          formData?.AdultPadInformation[0]?.pad_type_id ===
                            "unknown"
                            ? true
                            : false
                        }
                        changeHandler={handleCheckBox}
                      />
                    </div> */}
                  </div>

                  {/* { formData?.AdultPadInformation */}
                  {formData?.AdultPadInformation?.map((item, index) => (
                    <EditAdultPakInfo
                      keyName={"AdultPadInformation"}
                      unKnownToggleKey={"no_has_pad_toggle"}
                      toogleKeyName={formData?.no_has_pad_toggle}
                      is_unknowntrue={
                        item.pad_type_id === "unknown" ? true : false
                      }
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

              {formData?.SpareAdultPadInfo.length > 0 || all_condition_true ? (
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
                        ToggleValue={
                          formData?.SpareAdultPadInfo[0]?.pad_type_id ===
                            "unknown"
                            ? true
                            : false
                        }
                        changeHandler={handleCheckBox}
                      />
                    </div> */}
                  </div>

                  {formData?.SpareAdultPadInfo?.map((item, index) => (
                    <EditSpareAdultPadInfo
                      keyName={"SpareAdultPadInfo"}
                      unKnownToggleKey={"no_spare_adult_pak_info_toggle"}
                      toogleKeyName={formData?.no_spare_adult_pak_info_toggle}
                      is_unknowntrue={
                        item.pad_type_id === "unknown" ? true : false
                      }
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
              {Permissins?.has_padpak || all_condition_true ? (
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
                        <b>Unknown </b>
                      </label>
                      <CustomToggleButton
                        ToggleName="no_has_padpak_toggle"
                        ToggleValue={
                          formData?.AdultPadPakInfo[0]?.pad_type_id ===
                            "unknown"
                            ? true
                            : false
                        }
                        changeHandler={handleCheckBox}
                      />
                    </div> */}
                  </div>

                  {formData?.AdultPadPakInfo?.map((item, index) => (
                    <EditAdultPadPakInfo
                      keyName={"AdultPadPakInfo"}
                      unKnownToggleKey={"no_has_padpak_toggle"}
                      toogleKeyName={formData?.no_has_padpak_toggle}
                      is_unknowntrue={
                        item.pad_type_id === "unknown" ? true : false
                      }
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

              {formData?.SpareAdultPadPakInfo.length > 0 ||
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
                          addRemoveChargePakInfo(
                            "remove",
                            "SpareAdultPadPakInfo"
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
                        ToggleName="no_spare_adult_pad_pak_info_toggle"
                        ToggleValue={
                          formData?.SpareAdultPadPakInfo[0]?.pad_type_id ===
                            "unknown"
                            ? true
                            : false
                        }
                        changeHandler={handleCheckBox}
                      />
                    </div> */}
                  </div>

                  {formData?.SpareAdultPadPakInfo?.map((item, index) => (
                    <EditSpareAdultPadPakInfoComp
                      is_unknowntrue={
                        item.pad_type_id === "unknown" ? true : false
                      }
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
              {(formData.no_pediatric_toggle && Permissins?.has_ped_pad) ||
                all_condition_true ? (
                <div className=" bg-gray py-4 px-4 mt-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <h2 className="heading">
                      {"Pediatric Pad Information"}

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
                        ToggleValue={
                          formData?.PediatricPadInformation[0]?.pad_type_id ===
                            "unknown"
                            ? true
                            : false
                        }
                        changeHandler={handleCheckBox}
                      />
                    </div> */}
                  </div>

                  {formData?.PediatricPadInformation?.map((item, index) => (
                    <EditPediatricPadInfo
                    unKnownToggleKey={"no_has_pedpad_toggle"}
                      // is_unknowntrue={formData?.no_has_pedpad_toggle}
                      is_unknowntrue={
                        item.pad_type_id === "unknown" ? true : false
                      }
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

              {/* <h1>{JSON.stringify(formData.no_pediatric_toggle)}</h1> */}
              {(formData.no_pediatric_toggle &&
                Permissins?.has_ped_pad &&
                formData?.sparePadricPadInfo.length > 0) ||
                all_condition_true ? (
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
                        ToggleValue={
                          formData?.sparePadricPadInfo[0]?.pad_type_id ===
                            "unknown"
                            ? true
                            : false
                        }
                        changeHandler={handleCheckBox}
                      />
                    </div> */}
                  </div>

                  {formData?.sparePadricPadInfo?.map((item, index) => (
                    <EditSparePediatricPadInfo
                    unKnownToggleKey={"no_spare_padric_pad_info_toggle"}
                      // is_unknowntrue={formData?.no_spare_padric_pad_info_toggle}
                      is_unknowntrue={
                        item.pad_type_id === "unknown" ? true : false
                      }
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
              )}

              {(formData.no_pediatric_toggle && Permissins?.has_padpak) ||
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
                        ToggleValue={
                          formData?.PediatricPakPadInformation[0]?.pad_type_id ===
                            "unknown"
                            ? true
                            : false
                        }
                        changeHandler={handleCheckBox}
                      />
                    </div> */}
                  </div>

                  {formData?.PediatricPakPadInformation?.map((item, index) => (
                    <EditPediatricPadPakInfo
                    unKnownToggleKey={"no_has_pedpak_toggle"}
                      // is_unknowntrue={formData?.no_has_pedpak_toggle}
                      is_unknowntrue={
                        item.pad_type_id === "unknown" ? true : false
                      }
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

              {formData?.sparePadricPakPad.length > 0 ? (
                <div className=" bg-gray py-4 px-4 mt-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <h2 className="heading">
                      {"Spare Pediatric Pak-Pad Information"}
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
                        ToggleValue={
                          formData?.sparePadricPakPad[0]?.pad_type_id ===
                            "unknown"
                            ? true
                            : false
                        }
                        changeHandler={handleCheckBox}
                      />
                    </div> */}
                  </div>

                  {formData?.sparePadricPakPad?.map((item, index) => (
                    <EditSparePediatricPadPakInfo
                    unKnownToggleKey={"no_spare_padric_pad_pak_info_toggle"}
                      // is_unknowntrue={formData?.no_spare_padric_pad_pak_info_toggle}
                      is_unknowntrue={
                        item.pad_type_id === "unknown" ? true : false
                      }
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
                    />
                  ))}
                </div>
              ) : (
                ""
              )}

              {Permissins?.has_ped_key || all_condition_true ? (
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
              {Permissins?.has_gateway || all_condition_true ? (
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
                    />
                  ))}
                </div>
              ) : (
                ""
              )}

              {Permissins?.has_builtin_rms || all_condition_true ? (
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

              <div className="col-12 mt-3">
                <MessageHandler
                  status={FormMsg.type}
                  msg={FormMsg.msg}
                  HandleMessage={setFormMsg}
                />
              </div>

              <div class="col-md-12 text-right mt-3">
                <button
                  class="btn btn-danger me-2"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  class="btn btn-success"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Submit"}
                </button>
              </div>
            </form>
            <br />
            <br />
            <br />
          </div>
        </>
      )}
    </>
  );
};
export default EditAedForm2;

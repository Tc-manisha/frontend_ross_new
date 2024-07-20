import React from "react";
import Container from "react-bootstrap/Container";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";
// import { Button, DownListItems } from "../../components";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useEffect, useState } from "react";
import { AccountDetailsTab } from "../../utils";
import Switch from "@mui/material/Switch";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CallGETAPI, CallPOSTAPI } from "../../helper/API";
import { FormatDate, getPermission } from "../../helper/Common";
import {
  AccountContactDetails,
  AccountSiteList,
  DecryptToken,
  GroupBYCoordinatorInfo,
} from "../../helper/BasicFn";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import Inperson from "./tabs/Inperson";
import Pops from "./tabs/Pops";
import Notes from "./tabs/Notes";
import Emails from "./tabs/Emails";
import Support from "./tabs/Support";
import Documents from "./tabs/Documents";
import RFI from "./tabs/RFI";
import { Button } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import { MenuLinks } from "../../utils";
import SidebarLink from "../../components/layout/SidebarLink";
import { TraningTable } from "../meep-table";
import TraningDetailsTabel from "./adminTrainingTable/TraningDetailsTabel";
import SubHeading from "../../components/header/SubHeading";
import Filter from "../../components/filter/";
import { ContactStatus, formatPhoneNumber } from "../../helper/Common";
import Moment from "react-moment";
import MessageHandler from "../../components/common/MessageHandler";
import { DateFormate } from "../../helper/TblFn";
import Loading from "./Loading";
import TableSkeleton from "./skeleton/table/TableSkeleton";
import Details from "./tabs/Details";
import Sites from "./tabs/Sites";
import Contacts from "./tabs/Contacts";
import Aeds from "./tabs/Aeds";
import { useDispatch, useSelector } from "react-redux";
import { selecteTab } from "../../redux/slices/TabSlice";
import { addItem } from "../../redux/slices/BreadCrumbsSlice";
import "../../../src/global.css";

// Floating button imports

// import MdAdd from "@material-ui/icons/Add";
// import AddIcon from "@mui/icons-material/Add";

// import MdClose from "@material-ui/icons/Clear";
// import CloseIcon from "@mui/icons-material/Close";

// import MdEdit from "@material-ui/icons/Edit";
import EditIcon from "@mui/icons-material/Edit";
import ArticleIcon from "@mui/icons-material/Article";
import BreadCrumbs from "../../helper/BreadCrumbs";
import { toast } from "react-toastify";
import { isSubAdminPermission, isUserPermission } from "../../helper/permission";
// import MdStar from "@material-ui/icons/Star";
// import MdFavorite from "@material-ui/icons/Favorite";

const drawerWidth = 200;
const theme = createTheme();

const AccountDetails = ({ setShowSidebar, handleSetToken }) => {
  const [showLoading, setShowLoading] = React.useState(true);
  const [outsideClick, setOutsideClick] = React.useState("");
  const [currentTab, setCurrentTab] = useState(AccountDetailsTab.DETAILS);
  const [accountDetails, setAccountDetails] = useState({});
  const [CoordiDataList, setCoordiDataList] = useState([]);
  const [programDetails, setProgramDetails] = useState({});
  const [siteDataList, setSiteDataList] = useState([]);
  const [siteContactList, setSiteContactList] = useState([]);
  const [NotesData, setNotesData] = useState([]);
  const [forward, setForward] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [open, setOpen] = React.useState(false);
  const [httpsWeb, setHttpsWeb] = useState(false);
  const [FormMsg, setFormMsg] = React.useState({ type: true, msg: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { accountId } = useParams();
  const [EditUrl, setEditUrl] = useState("/account/accounts-edit/" + accountId);
  // const [showAlert, setshowAlert] = useState("");
  const user = DecryptToken();
  const privilege = getPermission();

  const fetchNotesData = async () => {
    // const response = await fetch('http://localhost:5000/api/notes');
    // const data = await response.json();
    // setNotesData(data);
    let response = await CallGETAPI("notes/account-notes/" + accountId);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));

  const handleTab = (item) => {
    console.log({item})
    dispatch(selecteTab(item));
    setCurrentTab(item);
    // setEditUrl("/account/"+item+'/'+accountId)
  };

  const fetchOnload = async () => {
    const accountRes = await CallGETAPI(
      `account/account_info_detail/${accountId}`
    );
    console.log(accountRes)
    const accountData = accountRes?.data?.data?.AccountDetails;

    const cordinatorInfo = accountRes?.data?.data?.cordinatorInformation;
    const ProgramDetailInfo = accountRes?.data?.data?.programDetails;
    let CoordiData = GroupBYCoordinatorInfo(cordinatorInfo);

    setCoordiDataList(CoordiData);
    setAccountDetails(accountData);
    setProgramDetails(ProgramDetailInfo);

    let SiteData = await AccountSiteList(accountId);
    if (SiteData) {
      setSiteDataList(SiteData?.site_details);
    }

    let ContactData = await AccountContactDetails(accountId);
    if (ContactData) {
      setSiteContactList(ContactData?.contact_list);
    }

    var pattern = new RegExp("^(https?|http)://");

    if (pattern.test(accountDetails?.website)) {
      setHttpsWeb(true);
    }

    // show loading false
    setShowLoading(false);
  };
  const prev_selected_tb = useSelector(
    (state) => state?.TAB_manager?.selectedTab
  );

  useEffect(() => {
    fetchOnload();
    if (prev_selected_tb && !currentTab) {
      setCurrentTab(prev_selected_tb);
    } else if (location?.state?.tab) {
      setCurrentTab(location?.state?.tab);
    }
  }, [location]);

  const documentRedirect = () => {
    navigate("/account-document-upload", {
      state: {
        type: "account",
        accountId,
        siteId: "",
      },
    });
  };

  const [documentData, setDocumentData] = useState(null);

  const getDocumentsData = async () => {
    const response = await CallGETAPI("get-all-documents/", accountId);

    if (response?.status) {
      setDocumentData(response.data);
    }
  };
  const [aedList, setAedList] = useState([]);
  const fetchAEDData = async () => {
    // const result = await CallGETAPI('account/get-aed/' + accountId);
    const result = await CallGETAPI(
      "account/get-aed-with-standalon/" + accountId
    );
    // account/get-aed-with-standalon
    if (result?.data?.status) {
      const aeds = result?.data
      const resultArr = [];
      for (let a1 = 0; a1 < aeds.length; a1++) {
        const aed1 = aeds[a1];
        let obj = {
          site_name: aed1.site_name,
          site_id: "",
          data: [],
        };

        for (let a2 = 0; a2 < aed1.data.length; a2++) {
          const aeds2d = aed1.data[a2]?.aed_details;
          obj.site_id = aeds2d?.site_id;
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
          let bi1 = aeds2d?.battery_info
            ? JSON.parse(aeds2d?.battery_info)
            : [];
          let si1 = aeds2d?.storage_info
            ? JSON.parse(aeds2d?.storage_info)
            : [];
          let cpi1 = aeds2d?.charge_pak_info
            ? JSON.parse(aeds2d?.charge_pak_info)
            : []; // charge_pak_info
          let cpi1Arr = cpi1.length > 0 ? cpi1 : [];
          let cpi1BatteryDatesata = cpi1Arr.map(
            (cpi1Arritem) => cpi1Arritem.battery_expiration
          );

          let sbi1 = aeds2d?.spare_battery_info
            ? JSON.parse(aeds2d?.spare_battery_info)
            : []; //spare_battery_info
          let sbi1Arr = sbi1.length > 0 ? sbi1[0] : [];

          let sbi1_arr =
            sbi1Arr?.has_battery_spare && sbi1Arr?.has_battery_spare?.length > 0
              ? sbi1Arr?.has_battery_spare.map(
                  (item) => item.battery_expiration
                )
              : [];
          let sbi1_arr2 =
            sbi1Arr?.has_9v_spare && sbi1Arr?.has_9v_spare?.length > 0
              ? sbi1Arr?.has_9v_spare.map((item) => item.battery_expiration)
              : [];
          let sbi1_arr3 =
            sbi1Arr?.has_10pk_spare && sbi1Arr?.has_10pk_spare?.length > 0
              ? sbi1Arr?.has_10pk_spare.map((item) => item.battery_expiration)
              : [];
          let sbi1_arr4 =
            sbi1Arr?.has_installby_spare &&
            sbi1Arr?.has_installby_spare?.length > 0
              ? sbi1Arr?.has_installby_spare.map(
                  (item) => item.battery_expiration
                )
              : [];
          let sbi1_arr5 =
            sbi1Arr?.has_man_spare && sbi1Arr?.has_man_spare?.length > 0
              ? sbi1Arr?.has_man_spare.map((item) => item.battery_expiration)
              : [];

          let spare_obj = [
            {
              title: "spare_battery_info",
              data: sbi1_arr,
              img: "/Battery.png",
            },
            {
              title: "spare_battery_info",
              data: sbi1_arr2,
              img: "/spare-battery.png",
            },
            {
              title: "spare_battery_info",
              data: sbi1_arr3,
              img: "/Battery.png",
            },
            {
              title: "spare_battery_info",
              data: sbi1_arr4,
              img: "/Battery.png",
            },
            {
              title: "spare_battery_info",
              data: sbi1_arr5,
              img: "/Battery.png",
            },
            {
              title: "spare_battery_info",
              data: cpi1BatteryDatesata,
              img: "/Battery.png",
            },
          ];

          let ppi1 = aeds2d?.pediatric_pad_info
            ? JSON.parse(aeds2d?.pediatric_pad_info)
            : [];
          let sppi1 = aeds2d?.spare_padric_pad_info
            ? JSON.parse(aeds2d?.spare_padric_pad_info)
            : [];
          let api1 = aeds2d?.adult_pad_info
            ? JSON.parse(aeds2d?.adult_pad_info)
            : [];
          let sapi1 = aeds2d?.spare_adult_pad_info
            ? JSON.parse(aeds2d?.spare_adult_pad_info)
            : [];

          let ppd =
            ppi1 && ppi1?.length > 0
              ? ppi1.map(
                  (item) =>
                    item?.pediatric_pad_expiration &&
                    item?.pediatric_pad_expiration != "" &&
                    item?.pediatric_pad_expiration
                )
              : [];
          let spsd =
            sppi1 && sppi1?.length > 0
              ? sppi1.map(
                  (item) =>
                    item?.spare_pediatric_pad_expiration &&
                    item?.spare_pediatric_pad_expiration != "" &&
                    item?.spare_pediatric_pad_expiration
                )
              : [];
          let apid =
            api1 && api1?.length > 0
              ? api1.map(
                  (item) =>
                    item?.adult_pad_expiration &&
                    item?.adult_pad_expiration != "" &&
                    item?.adult_pad_expiration
                )
              : [];
          let spd =
            sapi1 && sapi1?.length > 0
              ? sapi1.map(
                  (item) =>
                    item?.spare_adult_pad_expiration &&
                    item?.spare_adult_pad_expiration != "" &&
                    item?.spare_adult_pad_expiration
                )
              : [];

          let batteryDateArr = [];
          for (let bi = 0; bi < bi1.length; bi++) {
            const hab_batery = bi1[bi]?.has_battery;
            const has_9v = bi1[bi]?.has_9v;

            const has_10pk = bi1[bi]?.has_10pk;
            const has_installby = bi1[bi]?.has_installby;
            const has_man = bi1[bi]?.has_man;

            let arr =
              hab_batery && hab_batery?.length > 0
                ? hab_batery.map((item) => item.battery_expiration)
                : [];
            let arr2 =
              has_9v && has_9v?.length > 0
                ? has_9v.map((item) => item.battery_expiration)
                : [];
            let arr3 =
              has_10pk && has_10pk?.length > 0
                ? has_10pk.map((item) => item.battery_expiration)
                : [];
            let arr4 =
              has_installby && has_installby?.length > 0
                ? has_installby.map((item) => item.battery_expiration)
                : [];
            let arr5 =
              has_man && has_man?.length > 0
                ? has_man.map((item) => item.battery_expiration)
                : [];
            let obj = [
              { title: "hab_batery", data: arr, img: "/Battery.png" },
              { title: "has_9v", data: arr2, img: "/spare-battery.png" },
              { title: "has_10pk", data: arr3, img: "/Battery.png" },
              { title: "has_installby", data: arr4, img: "/Battery.png" },
              { title: "has_man", data: arr5, img: "/Battery.png" },
            ];

            batteryDateArr = obj;
          }

          let si_obj = {
            title: "storage_info",
            data: [],
            img: "/Aed-Cabinet.png",
          };
          // if(obj2?.brand_name==='Defibtech Lifeline'){
          //      si_obj = { title: "storage_info", data: [], img: '/spare-battery.png' };
          // }

          for (let si = 0; si < si1.length; si++) {
            const sie = si1[si];
            si_obj.data.push(FormatDate(sie?.expiry_date));
          }
          batteryDateArr.push(si_obj);

          obj2.battery_expiration = [...batteryDateArr, ...spare_obj];
          let Chargepad1Arr = cpi1Arr.map(
            (cpi1Item) => cpi1Item.pad_1_expiration
          );
          let Chargepad2Arr = cpi1Arr.map(
            (cpi1Item) => cpi1Item.pad_2_expiration
          );

          let obj3 = [
            { title: "adult_pad_info", data: apid, img: "/people-Group.svg" },
            {
              title: "spare_adult_pad_info",
              data: spd,
              img: "/people-Group.svg",
            },
            {
              title: "pediatric_pad_info",
              data: ppd,
              img: "/child-Vector.png",
            },
            {
              title: "spare_padric_pad_info",
              data: spsd,
              img: "/child-Vector.png",
            },
            {
              title: "spare_padric_pad_info",
              data: Chargepad1Arr,
              img: "/people-Group.svg",
            },
            {
              title: "spare_padric_pad_info",
              data: Chargepad2Arr,
              img: "/people-Group.svg",
            },
          ];
          obj2.pads_expiration = obj3;
          obj.data.push(obj2);
        }
        resultArr.push(obj);
      }

      setAedList(resultArr);
    }
  };

  useEffect(() => {
    handleSetToken();
    fetchOnload();
    getDocumentsData();
    fetchAEDData();
  }, []);

  const supportRedirect = () => {
    const stateData = {
      type: "Account",
      site_id: 0,
      accountId: accountId ? accountId : 0,
      contactId: 0,
      accountName: accountDetails?.account_name || "",
      support_name: accountDetails?.account_name,
    };

    navigate("/account/new-support/" + accountId, { state: stateData });
  };

  const notesRedirect = () => {
    navigate(`/account/new-note?account_id=${accountId}`);
  };

  const handleHoverFloating = () => {
    setIsOpen(true);
  };

  const handleLeaveFloating = () => {
    setIsOpen(false);
  };
  const breadcrumbs1 = useSelector((state) => state.BreadCrumbs.items);

  const changeState = async () => {
    setForward(true);
  };

  useEffect(() => {
    dispatch(
      addItem({ title: "Accounts", path: location?.pathname, tab: currentTab })
    );
  }, [currentTab]);

  const handleExportReport = async () => {
    let payload = {
      account_id: accountId,
      tab: currentTab,
    };
    const res = await CallPOSTAPI("admin/report-account", payload);
    const path = res?.data?.filePath;
    handleDownload(path);
  };

  const equipmentPayloadData = useSelector(
    (state) => state.accountdetailsequipmentfilter.equipmentPayloadData
  );

  const handleExportAed = async () => {
    let payload = {};
    if (equipmentPayloadData != "") {
      payload = {
        accesory_brand_model: equipmentPayloadData?.accesory_brand_model,
        accessory_type: equipmentPayloadData?.accessory_type,
        aed_brand_model: equipmentPayloadData?.aed_brand_model,
        aed_checker: equipmentPayloadData?.aed_checker,
        expirationrange: equipmentPayloadData?.expirationrange,
        from: equipmentPayloadData?.from,
        site_name: equipmentPayloadData?.site_name,
        state: equipmentPayloadData?.state,
        to: equipmentPayloadData?.to,
        account_id: accountId,
        tab: "aed",
      };
    } else {
      payload = {
        accesory_brand_model: "",
        accessory_type: "",
        aed_brand_model: "",
        aed_checker: "",
        expirationrange: "",
        from: "",
        site_name: "",
        state: "",
        to: "",
        account_id: accountId,
        tab: "aed",
      };
    }
    const res = await CallPOSTAPI("admin/report-account", payload);
    const path = res?.data?.filePath;
    handleDownload(path);
  };

  const handleExportAccessory = async () => {
    let payload = {};
    if (equipmentPayloadData != "") {
      payload = {
        accesory_brand_model: equipmentPayloadData?.accesory_brand_model,
        accessory_type: equipmentPayloadData?.accessory_type,
        aed_brand_model: equipmentPayloadData?.aed_brand_model,
        aed_checker: equipmentPayloadData?.aed_checker,
        expirationrange: equipmentPayloadData?.expirationrange,
        from: equipmentPayloadData?.from,
        site_name: equipmentPayloadData?.site_name,
        state: equipmentPayloadData?.state,
        to: equipmentPayloadData?.to,
        account_id: accountId,
        tab: "accessory",
      };
    } else {
      payload = {
        accesory_brand_model: "",
        accessory_type: "",
        aed_brand_model: "",
        aed_checker: "",
        expirationrange: "",
        from: "",
        site_name: "",
        state: "",
        to: "",
        account_id: accountId,
        tab: "accessory",
      };
    }
    const res = await CallPOSTAPI("admin/report-account", payload);
    const path = res?.data?.filePath;
    handleDownload(path);
  };

  const handleDownload = (path) => {
    if (path) {
      const fullURL = `https://api.rossdev.xyz/${path}`;
      // Construct a temporary anchor element
      const link = document.createElement("a");
      link.href = fullURL;
      link.download = "report.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("File download successfully");
    } else {
      toast.error("No file to download");
    }
  };

  const [tabTbldata, setTabTbldata] = useState({
    site: false,
    contact: false,
    equipment: {
      aed: false,
      accessory: false,
    },
    note: false,
    support: false,
  });

  return (
    <>
      {/* loading */}
      {showLoading ? (
        <>
          <div className="showloading-table">
            <TableSkeleton />
          </div>
        </>
      ) : (
        <>
          <div
            className="mt-4 main-site"
            style={{ width: "100%" }}
            onClick={(e) => {
              setOutsideClick(e);
            }}
          >
            <SubHeading
              hideNew="tab"
              title={"Account : " + accountDetails?.account_name}
              newUrl="/new-account"
              subHeading={true}
              hideHierarchy={
                accountDetails?.parent_account != "" &&
                accountDetails?.parent_account != 0
                  ? false
                  : true
              }
              editUrl={"/account/accounts-edit/" + accountId}
              outsideClickEvent={outsideClick}
              accountName={"accountName"}
              support_type="Account"
              support_name={accountDetails?.account_name}
              site_id={0}
              assign_equipment={aedList?.length > 0 ? true : false}
              exportReport={true}
              currentTab={currentTab}
              handleExportReport={handleExportReport}
              handleExportAed={handleExportAed}
              handleExportAccessory={handleExportAccessory}
              tabTbldata={tabTbldata}
            />

  <Box className="bg-primary">
  <div className="d-flex border-bottom border-secondary">
    {Object.values(AccountDetailsTab).map((tabItem, i) => {
      if (
        (user?.user_type === 0) ||
        (tabItem === "Details" && user?.user_type === 2 && privilege?.includes("account-details")) ||
        (tabItem === "Sites" && user?.user_type === 2 && privilege?.includes("site-tab")) ||
        (tabItem === "Contacts" && user?.user_type === 2 && privilege?.includes("contact-tab")) ||
        (tabItem === "Equipment" && user?.user_type === 2 && privilege?.includes("equipment-tab")) ||
        (tabItem === "Training" && user?.user_type === 2 && privilege?.includes("training-tab")) ||
        (tabItem === "Inperson" && user?.user_type === 2 && privilege?.includes("inperson-tab")) ||
        (tabItem === "POPS" && user?.user_type === 2 && privilege?.includes("pops-tab")) ||
        (tabItem === "Notes" && user?.user_type === 2 && privilege?.includes("notes-tab")) ||
        (tabItem === "Emails" && user?.user_type === 2 && privilege?.includes("email-tab")) ||
        (tabItem === "Support" && user?.user_type === 2 && privilege?.includes("support-tab")) ||
        (tabItem === "Documents" && user?.user_type === 2 && privilege?.includes("documents-tab")) ||
        (tabItem === "RFI" && user?.user_type === 2 && privilege?.includes("rfi-tab")) 
      ) {
        return (
          <div
            role="button"
            key={i}
            className={"text-light tab-button"}
            style={{
              backgroundColor: `${
                tabItem === currentTab ? "#26AEE0" : "#0C71C3"
              }`,
            }}
            onClick={() => handleTab(tabItem)}
          >
            {tabItem}
          </div>
        );
      }
      return null;
    })}
  </div>
</Box>


            {currentTab === AccountDetailsTab.DETAILS && (
              <>
                <Details
                  accountDetails={accountDetails}
                  CoordiDataList={CoordiDataList}
                  programDetails={programDetails}
                  httpsWeb={httpsWeb}
                  tabTbldata={tabTbldata}
                />
              </>
            )}

            {currentTab === AccountDetailsTab.SITES && (
              <>
                <Sites
                  siteDataList={siteDataList}
                  setTabTbldata={setTabTbldata}
                />
              </>
            )}

            {currentTab === AccountDetailsTab.CONTACTS && (
              <>
                <Contacts
                  siteContactList={siteContactList}
                  setTabTbldata={setTabTbldata}
                />
              </>
            )}

            {/* DOCUMENTS */}
            {currentTab === AccountDetailsTab.DOCUMENTS && (
              <Documents documentData={documentData} type="Account" />
            )}

            {/* POPS/PLANS */}
            {currentTab === AccountDetailsTab.INPERSON && <Inperson />}

            {/* POPS/PLANS */}
            {currentTab === AccountDetailsTab.POPS && (
              <Pops accountId={accountId} type="ACCOUNT" />
            )}

            {/* TRAINING */}
            {currentTab === AccountDetailsTab.TRAINING && (
              <TraningDetailsTabel />
              // <TraningDetailsTabel showAlert={showAlert}/>
            )}

            {/* SUPPORT */}
            {currentTab === AccountDetailsTab.SUPPORT && (
              <Support
                setTabTbldata={setTabTbldata}
                stateData={{
                  type: "Account",
                  site_id: 0,
                  accountId: accountId ? accountId : 0,
                  contactId: 0,
                  accountName: accountDetails?.account_name || "",
                  support_name: accountDetails?.account_name,
                }}
                // navigate("/account/new-support/"+accountId, {state: {
                // 	type:	support_type,// contactId ? 'contact' : 'account',
                // 	site_id: site_id || 0,
                // 	accountId: accountId || 0,
                // 	contactId: contactId || 0,
                // 	accountName:accountName || "",
                // 	support_name: support_name,
                // }});
              />
            )}

            {/* Notes */}
            {currentTab === AccountDetailsTab.NOTES && (
              <Notes
                accountId={accountId}
                accountDetails={accountDetails}
                CoordiDataList={CoordiDataList}
                programDetails={programDetails}
                httpsWeb={httpsWeb}
                type="ACCOUNT"
                setTabTbldata={setTabTbldata}
              />
            )}

            {/* Emails */}
            {currentTab === AccountDetailsTab.EMAILS && (
              <Emails accountId={accountId} />
            )}

            {/* RFI */}
            {currentTab === AccountDetailsTab.RFI && <RFI />}

            {/* AEDS */}
            {currentTab === AccountDetailsTab.Equipment && (
              <Aeds tabTbldata={tabTbldata} setTabTbldata={setTabTbldata} />
            )}
          </div>
          <div
            className="floating-menu-btn d-flex flex-column gap-2"
            onMouseEnter={handleHoverFloating}
            onMouseLeave={handleLeaveFloating}
          >
            {isOpen && (
              <>
              {(isSubAdminPermission("new-document") === 1 || isUserPermission("new-document") === 1) && ( 
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
                  title="New Document"
                />
                )}

                {(isSubAdminPermission("new-support") === 1 || isUserPermission("new-support") === 1 ) && (
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
                  title="New Support"
                />
                )}

                {(isSubAdminPermission("new-note") === 1 || isUserPermission("new-note") === 1) && (
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
                  title="New Note"
                />
                )}
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
              // onMouseLeave={() => {
              //   setIsOpen((prev) => !prev);
              // }}
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

export default AccountDetails;

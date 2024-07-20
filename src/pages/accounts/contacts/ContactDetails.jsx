import React from "react";
import Container from "react-bootstrap/Container";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";
// import { Button, DownListItems } from "../../components";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useEffect, useState } from "react";
import {
  AccountContactTbWithPermission,
  AccountContactsTab,
} from "../../../utils";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { CallGETAPI } from "../../../helper/API";
import {
  AccountContactDetails,
  AccountSiteList,
  DecryptToken,
  GetAccountContactList,
  GroupBYCoordinatorInfo,
} from "../../../helper/BasicFn";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

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
import { MenuLinks } from "../../../utils";
import SidebarLink from "../../../components/layout/SidebarLink";
import { TraningTable } from "../../meep-table";
import TraningDetailsTable from ".././AlertTable/TraningDetailsTable";
import SubHeading from "../../../components/header/SubHeading";
import Details from "./tabs/Details";
import Classes from "./tabs/Classes";
import Instructor from "./tabs/Instructor";
import Documents from "./tabs/Documents";
import Support from "./tabs/Support";
import Notes from "../tabs/Notes";
import Emails from "./tabs/Emails";
import RFI from "./tabs/RFI";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import Filter from "../../../components/filter/";
import Loading from "../Loading";
import { useDispatch, useSelector } from "react-redux";
import { setContactActiveTab } from "../../../redux/slices/TabSlice";
import { addItem } from "../../../redux/slices/BreadCrumbsSlice";
import { GetProfile, getPermission } from "../../../helper/Common";
import { isContactPermission, isSubAdminPermission, isUserPermission } from "../../../helper/permission";

const drawerWidth = 200;
const theme = createTheme();

const ContactDetails = ({ setShowSidebar, handleSetToken }) => {
  const [currentTab, setCurrentTab] = useState(AccountContactsTab.Details);
  const [showLoading, setShowLoading] = React.useState(true);
  const [accountContactList, setAccountContactList] = useState({});
  const [pageTitle, setPageTitle] = useState("");
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { contactId, accountId } = useParams();
  const [showBtnTab, setShowBtnTab] = useState(false);
  const [clickable, setClickable] = useState(true);
  const user = DecryptToken();
  const privilege = getPermission();
  const tabItems = Object.values(AccountContactsTab);

  // Filter out the "Instructor" tab if there are no instructor details
  // const filteredTabItems = accountContactList?.instructorDetails?.length < 1
  //   ? tabItems.filter(tabItem => tabItem !== 'Instructor')
  //   : tabItems;

  const [filteredTabItems, setfilteredTabItems] = useState(
    AccountContactTbWithPermission
  ); // accountContactList?.instructorDetails?.length < 1 AccountContactTbWithPermission

  let privileges = location?.state?.privileges;
  let is_user = location?.state?.is_user;

  const [isOpen, setIsOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const dispatch = useDispatch();
  const handleTab = (item) => {
    if (clickable) {
      dispatch(setContactActiveTab(item));
      setCurrentTab(item);
    }
  };
  const fetchOnLoad = async () => {
    var data = await GetAccountContactList(contactId);
    if (data) {
      setAccountContactList(data?.data?.data);
      const contactData = data?.data?.data;
      const FTT =
        contactData?.instructorDetails?.length < 1
          ? AccountContactTbWithPermission.filter(
              (tabItem) => tabItem.title !== "Instructor"
            )
          : AccountContactTbWithPermission;
      setfilteredTabItems(FTT);
      var title = "";
      title += contactData?.contact_details?.account_main_contact_salutation
      ? " " + contactData?.contact_details?.account_main_contact_salutation
      : "";
      title += contactData?.contact_details?.account_main_contact_firstname
        ? " " + contactData?.contact_details?.account_main_contact_firstname
        : "";
      title += contactData?.contact_details?.account_main_contact_middlename
        ? " " + contactData?.contact_details?.account_main_contact_middlename
        : "";
      title += contactData?.contact_details?.account_main_contact_lastname
        ? " " + contactData?.contact_details?.account_main_contact_lastname
        : "";
      title += contactData?.contact_details?.account_main_contact_suffix
        ? " " + contactData?.contact_details?.account_main_contact_suffix
        : "";

      setPageTitle(title);

      if (data?.data?.data?.instructorDetails?.length > 0) {
        setShowBtnTab(true);
      }
      // else {
      // let key = "Instructor";
      // delete AccountContactsTab[key];
      // setShowBtnTab(false);
      // }
      // setfilteredTabItems
      setShowLoading(false);
    }
  };

  useEffect(() => {
    handleSetToken();
    fetchOnLoad();

    const profile = GetProfile(); // JSON.parse(localStorage.getItem("ross-profile"));

    if (profile?.user_type == 1) {
      setClickable(false);
    }
  }, []);
  const activeSiteTab = useSelector(
    (state) => state?.TAB_manager?.contactActiveTab
  );
  useEffect(() => {
    if (activeSiteTab) {
      setCurrentTab(activeSiteTab);
    } else if (location?.state?.tab) {
      setCurrentTab(location?.state?.tab);
    }
  }, [location]);

  const supportRedirect = () => {
    const mainAccountId = accountContactList?.contact_details?.account_id || 0;
    const stateData = {
      type: "Contact",
      site_id: 0,
      accountId: accountContactList?.contact_details?.account_id || 0,
      contactId: contactId,
      accountName: "",
      support_name:
        accountContactList?.contact_details?.account_main_contact_firstname +
        " " +
        accountContactList?.contact_details?.account_main_contact_lastname,
    };

    navigate("/account/new-support/" + mainAccountId, { state: stateData });
  };

  const notesRedirect = () => {
    const accountId = accountContactList?.contact_details?.account_id || 0;

    navigate(
      `/account/new-note?account_id=${accountId}&contact_id=${contactId}`
    );
  };

  const [documentData, setDocumentData] = useState(null);

  const payload = {
    contact_id: contactId,
    account_id: "0",
  };

  const getDocumentsData = async () => {
    const params = new URLSearchParams(payload); // Convert payload to URL parameters
    const url = `get-all-contact-documents/${contactId}?${params}`; // Append parameters to the URL
    const response = await CallGETAPI(url);
    // const response = await CallGETAPI('get-all-contact-documents/' +contactId, payload);
    console.log(response);
    if (response?.status) {
      setDocumentData(response.data.data);
    }
  };

  useEffect(() => {
    getDocumentsData();
  }, []);

  const documentRedirect = () => {
    navigate("/account-document-upload", {
      state: {
        accountId: accountId,
        type: "contact",
        contactId,
      },
    });
  };

  useEffect(() => {
    const state = location?.state;
    const type = state ? state?.type : null;
    dispatch(
      addItem({ title: type, path: location?.pathname, tab: currentTab })
    );
  }, [currentTab]);

  const breadcrumbs = useSelector((state) => state.BreadCrumbs.items);

  const [tabTbldata, setTabTbldata] = useState({
    site: false,
    contact: false,
    equipment: false,
    note: false,
    support: false,
  });

  const handleHoverFloating = () => {
    setIsOpen(true);
  };

  const handleLeaveFloating = () => {
    setIsOpen(false);
  };

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
              title={"Contact: " + pageTitle}
              hideNew={true}
              editUrl={"/account/contact-details-edit/" + contactId}
              hideHierarchy={true}
              hideInstructor={showBtnTab}
              subHeading={true}
              bottomLinks={true}
              account={accountContactList?.contact_details?.account_id}
              support_type="Contact"
              support_name={
                accountContactList?.contact_details
                  ?.account_main_contact_firstname +
                " " +
                accountContactList?.contact_details
                  ?.account_main_contact_lastname
              }
              site_id={0}
              account_id={accountContactList?.contact_details?.account_id}
              privileges={privileges}
              is_user={is_user}
              breadcrumbs={breadcrumbs}
              exportReport={true}
              currentTab={currentTab}
              tabTbldata={tabTbldata}
            />

            {/* tabs */}
            <Box className="bg-primary ">
              <div className="d-flex border-bottom border-secondary">
                {filteredTabItems.map(
                  (tabItem, i) =>
                    isContactPermission(tabItem.permission) && (
                      <div
                        role="button"
                        key={i}
                        className={"text-light py-2 px-3"}
                        style={{
                          backgroundColor: `${
                            tabItem.title == currentTab ? "#26AEE0" : "#0C71C3"
                          }`,
                        }}
                        onClick={() => handleTab(tabItem.title)}
                      >
                        {tabItem.title == "Instructor" &&
                        accountContactList?.instructorDetails.length < 1
                          ? ""
                          : tabItem.title}
                      </div>
                    )
                )}
              </div>
            </Box>

            {/* Details */}
            {currentTab === AccountContactsTab.Details && <Details />}

            {/* Classes */}
            {currentTab === AccountContactsTab.Classes && <Classes />}

            {/* Instructor */}
            {currentTab === AccountContactsTab.Instructor && (
              <Instructor
                InstructorData={accountContactList?.instructorDetails[0] || []}
                ahaDetails={accountContactList?.ahaDetails[0] || []}
                hsiDetails={accountContactList?.hsiDetails[0] || []}
              />
            )}

            {/* DOCUMENTS */}
            {currentTab === AccountContactsTab.Documents && (
              <Documents
                accountId={accountId}
                contact_id={contactId}
                type={"Contact"}
                // siteName={siteData?.account_site_name}
                documentData={documentData}
              />
            )}

            {/* SUPPORT */}
            {currentTab === AccountContactsTab.Support && (
              <Support
                stateData={{
                  type: "Contact",
                  site_id: 0,
                  accountId:
                    accountContactList?.contact_details?.account_id || 0,
                  contactId: contactId,
                  accountName: "",
                  support_name:
                    accountContactList?.contact_details
                      ?.account_main_contact_firstname +
                    " " +
                    accountContactList?.contact_details
                      ?.account_main_contact_lastname,
                }}
                setTabTbldata={setTabTbldata}
              />
            )}

            {/* Notes */}
            {currentTab === AccountContactsTab.Notes && (
              <Notes
                accountId={accountContactList?.contact_details?.account_id}
                type="CONTACT"
                contact_id={contactId}
                setTabTbldata={setTabTbldata}
              />
            )}

            {/* Emails */}
            {currentTab === AccountContactsTab.Emails && <Emails />}

            {/* rfi */}
            {currentTab === AccountContactsTab.RFI && (
              <RFI
                accountId={accountContactList?.contact_details?.account_id}
              />
            )}
          </div>
          <div
            className="floating-menu-btn d-flex flex-column gap-2"
            onMouseEnter={handleHoverFloating}
            onMouseLeave={handleLeaveFloating}
          >
            {isOpen && (
              <>
                {(isSubAdminPermission("new-document") === 1 ||
                  isUserPermission("new-document") === 1) && (
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
                )}

                {(isSubAdminPermission("new-support") === 1 ||
                  isUserPermission("new-support") === 1) && (
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
                )}

                {(isSubAdminPermission("new-note") === 1 ||
                  isUserPermission("new-note") === 1) && (
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

export default ContactDetails;

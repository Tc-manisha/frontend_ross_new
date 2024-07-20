import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  DecryptToken,
  FetchAccountSiteDetails,
  GroupBYAdminSiteCoordinatorInfo,
  GroupBYSiteCoordinatorInfo,
} from "../../../helper/BasicFn";
import { AccountSiteTab } from "../../../utils";
import TableSkeletonFull from "../skeleton/tableFull/TableSkeletonFull";
import { Box } from "@mui/material";
import Details from "./tabs/Details";
import Notes from "./tabs/Notes";
import Contacts from "./tabs/Contacts";
import Emails from "../tabs/Emails";
import Documents from "../tabs/Documents";
import UserEquipments from "../../../pages/accounts/sites/tabs/Equipment";
import SitesRFI from "./tabs/SitesRFI";
import SitesInperson from "./tabs/SitesInperson";
import Support from "./tabs/SitesSupport";
import SubHeading from "../../../components/header/SubHeading";
import { useDispatch, useSelector } from "react-redux";
import { setSiteActiveTab } from "../../../redux/slices/TabSlice";
import Dropdown from "react-bootstrap/Dropdown";

// Floating button imports

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArticleIcon from "@mui/icons-material/Article";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { EquipmentIcon } from "../../../helper/Icons";
import Loading from "../Loading";
import { addItem } from "../../../redux/slices/BreadCrumbsSlice";
import Report from "../../../img/Xls.png";
import { toast } from "react-toastify";
import Moment from "react-moment";
import { getPermission } from "../../../helper/Common";
import { isSubAdminPermission, isUserPermission } from "../../../helper/permission";

export default function SiteMain() {
  const { siteId } = useParams();
  const [currentTab, setCurrentTab] = useState(AccountSiteTab.Details);
  const [showLoading, setShowLoading] = React.useState(true);
  const [accountData, setAccountData] = React.useState({});
  const [CoordiDataList, setCoordiDataList] = React.useState([]);
  const [siteDataList, setSiteDataList] = React.useState([]);
  const [siteContactList, setSiteContactList] = React.useState([]);
  const [siteData, setSiteData] = React.useState([]);
  const [billingData, setBillingData] = React.useState("");
  const [shippingData, setShippingData] = React.useState("");
  const [traningData, setTraningData] = React.useState([]);
  const [siteHoursData, setHoursData] = useState("");
  const [aedUnits, setAedUnits] = React.useState([]);
  const [coordinatorData, setCoordinatorData] = React.useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = DecryptToken();
  const privilege = getPermission();
  const exportReport = true;
  // const activeSiteTab = useSelector((state)=>state.tab.siteActiveTab);
  const activeSiteTab = useSelector(
    (state) => state?.TAB_manager?.siteActiveTab
  );
  // handle tab
  const handleTab = (item) => {
    dispatch(setSiteActiveTab(item));
    setCurrentTab(item);
  };

  // FETCH DATA ON LOAD
  const fetch = async () => {
    let data = await FetchAccountSiteDetails(siteId);

    if (data) {
      // setAccountData(data);
      setSiteData(data?.siteData);
      setBillingData(data?.billingData);
      setShippingData(data?.shippingData);
      setTraningData(data?.trainingLocations);
      setHoursData(data?.siteHours);

      let CoordiData = GroupBYAdminSiteCoordinatorInfo(
        data?.cordinatorInformation
      );
      // let CoordiData = data?.cordinatorInformation;
      setCoordinatorData(CoordiData);
      setAedUnits(data?.aed_units);
      setShowLoading(false);
    }
  };

  // on load
  useEffect(() => {
    fetch();
  }, []);

  // set tab
  useEffect(() => {
    if (activeSiteTab) {
      setCurrentTab(activeSiteTab);
    } else if (location?.state?.tab) {
      setCurrentTab(location?.state?.tab);
    }
  }, [location]);

  const [isOpen, setIsOpen] = useState(false);

  const documentRedirect = () => {
    navigate("/account-document-upload", {
      state: {
        accountId: siteData?.account_id,
        type: "site",
        siteId,
      },
    });
  };

  const [documentData, setDocumentData] = useState(null);

  const getDocumentsData = async () => {
    const response = await CallGETAPI(
      `get-all-site-documents?siteId=${siteId}&accountId=${siteData?.account_id}`
    );

    if (response?.status) {
      setDocumentData(response.data.data);
    }
  };

  const [equipmentUrl, setEquipmentUrl] = useState("");
  useEffect(() => {
    if (siteData?.account_id) {
      getDocumentsData();
      let equipmentUrl1 = "/assign-quipment/" + siteData?.account_id;
      equipmentUrl1 = siteId ? equipmentUrl1 + "/" + siteId : equipmentUrl1;
      setEquipmentUrl(equipmentUrl1);
    }
  }, [siteData]);

  const supportRedirect = () => {
    const stateData = {
      type: "Site",
      site_id: siteId || 0,
      accountId: siteData?.account_id || 0,
      contactId: 0,
      accountName: "",
      support_name: siteData?.account_site_name,
    };

    navigate("/account/new-support/" + siteData?.account_id, {
      state: stateData,
    });
  };

  const notesRedirect = () => {
    const accountId = siteData?.account_id || 0;
    navigate(`/account/new-note?account_id=${accountId}&site_id=${siteId}`);
  };

  useEffect(() => {
    dispatch(
      addItem({ title: "Sites", path: location?.pathname, tab: currentTab })
    );
  }, [currentTab]);

  const breadcrumbs = useSelector((state) => state.BreadCrumbs.items);

  const handleExportReport = async () => {
    let payload = {
      account_id: siteData?.account_id,
      site_id: siteId,
      tab: currentTab,
    };
    const res = await CallPOSTAPI("admin/report-site", payload);
    const path = res?.data?.filePath;
    handleDownload(path);
  };

  const handleExportAed = async () => {
    let payload = {
      account_id: siteData?.account_id,
      site_id: siteId,
      tab: "aed",
    };
    const res = await CallPOSTAPI("admin/report-site", payload);
    const path = res?.data?.filePath;
    handleDownload(path);
  };

  const handleExportAccessory = async () => {
    let payload = {
      account_id: siteData?.account_id,
      site_id: siteId,
      tab: "accessory",
    };
    const res = await CallPOSTAPI("admin/report-site", payload);
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
            {/* <TableSkeletonFull /> */}
            <Loading />
          </div>
        </>
      ) : (
        <>
          <div className="mt-4 pb-5" style={{ paddingInline: "45px" }}>
            <SubHeading
              title={siteData?.account_site_name}
              hideNew={true}
              newUrl={"/account/sites/new/" + siteData?.account_id}
              subHeading={true}
              hideHierarchy={true}
              editUrl={false}
              backTab={"Sites"}
              bottomLinks={false}
              support_type="Site"
              support_name={siteData?.account_site_name}
              site_id={siteId}
              account_id={siteData?.account_id}
              assign_equipment={true}
              breadcrumbs={breadcrumbs}
            />

            {/* bottom links */}
            <div className="d-flex" style={{ justifyContent: "space-between" }}>
              <div className="d-flex" style={{ gap: "10px" }}>
                {/* <button
                  className="btn text-primary"
                  type="button"
                  onClick={() =>
                    navigate("/account/site-details-edit/" + siteId)
                  }
                >
                  <img
                    src="/edit.svg"
                    alt="edit"
                    style={{ marginRight: "0" }}
                  />
                  <span className="ms-2">Edit</span>
                </button> */}
                {(user?.user_type == 0 ||
                  (user?.user_type == 2 &&
                    user?.sub_admin != "" &&
                    privilege?.includes("site-details-edit"))) && (
                  <button
                    className="btn text-primary"
                    type="button"
                    onClick={() =>
                      navigate(
                        "/admin-siteEdit/" + siteData?.account_id + "/" + siteId
                      )
                    }
                  >
                    <img
                      src="/edit.svg"
                      alt="edit"
                      style={{ marginRight: "0" }}
                    />
                    <span className="ms-2">Edit</span>
                  </button>
                )}

                {(user?.user_type == 0 ||
                  (user?.user_type == 2 &&
                    user?.sub_admin != "" &&
                    privilege?.includes("assign-aed"))) && (
                  <button
                    className="btn btn-transparent text-primary ms-2 bg-white"
                    id="new-tab-btn-12111"
                    type="button"
                    style={{ backgroundColor: "transparent !important" }}
                    onClick={() => navigate(equipmentUrl)}
                  >
                    <EquipmentIcon />
                    <span className="ms-1">Assigned AED</span>
                  </button>
                )}
                {/* <button
                  className="btn text-primary"
                  type="button"
                  // onClick={ () => navigate('/account/site-details-edit/' + siteId) }
                >
                  <img src="/aed_laws.svg" alt="aed_laws" />
                  <span className="ms-2">AED Laws</span>
                </button> */}
                {exportReport &&
                  (currentTab == "Sites" ||
                    (currentTab == "Contacts" && tabTbldata.contact == true) ||
                    (currentTab == "Notes" && tabTbldata.note == true) ||
                    (currentTab == "Support" &&
                      tabTbldata.support == true)) && (
                    <button
                      className="btn text-primary ms-2 bg-white"
                      id="new-tab-btn-12111"
                      type="button"
                      style={{ backgroundColor: "transparent !important" }}
                      onClick={handleExportReport}
                    >
                      <img
                        src={Report}
                        alt="Report"
                        style={{ width: "25px", height: "24px" }}
                      />
                      <span className="ms-1"> Export Report</span>
                    </button>
                  )}

                {exportReport &&
                  currentTab == "Equipment" &&
                  (tabTbldata.equipment.aed == true ||
                    tabTbldata.equipment.accessory == true) && (
                    <Dropdown>
                      <Dropdown.Toggle
                        className="btn btn-transparent text-primary ms-2 bg-white DropDownBtn"
                        id="new-tab-btn"
                        style={{
                          backgroundColor: "transparent !important",
                          border: "none",
                        }}
                      >
                        <img
                          src={Report}
                          alt="Report"
                          style={{ width: "25px", height: "24px" }}
                        />
                        <span className="ms-1 textSize">Export Report</span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu
                        className="bg-primary"
                        style={{ minWidth: "30px" }}
                      >
                        {tabTbldata.equipment.accessory == true && (
                          <Dropdown.Item
                            className=""
                            onClick={handleExportAccessory}
                          >
                            Accessories
                          </Dropdown.Item>
                        )}

                        {tabTbldata.equipment.aed == true && (
                          <Dropdown.Item className="" onClick={handleExportAed}>
                            AED
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
              </div>
            </div>

            {/* tabs */}
            {/* <Box className="bg-primary mt-3">
              <div className="d-flex border-bottom border-secondary">
                {Object.values(AccountSiteTab).map((tabItem, i) => (
                  <div
                    role="button"
                    key={i}
                    className={"text-light py-2 px-3"}
                    style={{
                      backgroundColor: `${
                        tabItem == currentTab ? "#26AEE0" : "#0C71C3"
                      }`,
                    }}
                    onClick={() => handleTab(tabItem)}
                  >
                    {tabItem}
                  </div>
                ))}
              </div>
            </Box> */}

            <Box className="bg-primary">
              <div className="d-flex border-bottom border-secondary">
                {Object.values(AccountSiteTab).map((tabItem, i) => {
                  if (
                    user?.user_type === 0 ||
                    (tabItem === "Details" &&
                      user?.user_type === 2 &&
                      privilege?.includes("account-details")) ||
                    (tabItem === "Contacts" &&
                      user?.user_type === 2 &&
                      privilege?.includes("contact-tab")) ||
                    (tabItem === "Equipment" &&
                      user?.user_type === 2 &&
                      privilege?.includes("equipment-tab")) ||
                    (tabItem === "Inperson" &&
                      user?.user_type === 2 &&
                      privilege?.includes("inperson-tab")) ||
                    (tabItem === "Notes" &&
                      user?.user_type === 2 &&
                      privilege?.includes("notes-tab")) ||
                    (tabItem === "Emails" &&
                      user?.user_type === 2 &&
                      privilege?.includes("email-tab")) ||
                    (tabItem === "Support" &&
                      user?.user_type === 2 &&
                      privilege?.includes("support-tab")) ||
                    (tabItem === "Documents" &&
                      user?.user_type === 2 &&
                      privilege?.includes("documents-tab")) ||
                    (tabItem === "RFI" &&
                      user?.user_type === 2 &&
                      privilege?.includes("rfi-tab"))
                  ) {
                    return (
                      <div
                        role="button"
                        key={i}
                        className={"text-light py-2 px-3"}
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

            {/* Details */}
            {currentTab == AccountSiteTab.Details && (
              <Details
                siteData={siteData}
                billingData={billingData}
                shippingData={shippingData}
                traningData={traningData}
                siteHoursData={siteHoursData}
                aedUnits={aedUnits}
                coordinatorData={coordinatorData}
                fetch={fetch}
              />
            )}

            {/* Classes */}
            {currentTab == AccountSiteTab.Contacts && (
              <Contacts
                accountId={siteData?.account_id}
                site_id={siteId}
                setTabTbldata={setTabTbldata}
              />
            )}

            {/* Notes */}
            {currentTab == AccountSiteTab.Notes && (
              <Notes
                accountId={siteData?.account_id}
                site_id={siteId}
                type={"SITE"}
                setTabTbldata={setTabTbldata}
              />
            )}

            {/* Equipment */}
            {currentTab == AccountSiteTab.Equipment && (
              <UserEquipments
                accountId={siteData?.account_id}
                site_id={siteId}
                type={"SITE"}
                tabTbldata={tabTbldata}
                setTabTbldata={setTabTbldata}
              />
            )}

            {/* Inperson */}
            {currentTab == AccountSiteTab.Inperson && (
              <SitesInperson
                accountId={siteData?.account_id}
                site_id={siteId}
                type={"SITE"}
              />
            )}

            {/* Emails */}
            {currentTab == AccountSiteTab.Emails && (
              <Emails
                accountId={siteData?.account_id}
                site_id={siteId}
                type={"SITE"}
              />
            )}

            {/* Support */}
            {currentTab == AccountSiteTab.Support && (
              <Support
                accountId={siteData?.account_id}
                site_id={siteId}
                type={"SITE"}
                account_id={siteData?.account_id}
                setTabTbldata={setTabTbldata}
                stateData={{
                  type: "Site",
                  site_id: siteId || 0,
                  accountId: siteData?.account_id || 0,
                  contactId: 0,
                  accountName: "",
                  support_name: siteData?.account_site_name,
                }}
              />
            )}

            {/* Documents */}
            {currentTab == AccountSiteTab.Documents && (
              <Documents
                accountId={siteData?.account_id}
                site_id={siteId}
                type={"SITE"}
                siteName={siteData?.account_site_name}
                documentData={documentData}
              />
            )}

            {/* RFI */}
            {currentTab == AccountSiteTab.RFI && (
              <SitesRFI
                accountId={siteData?.account_id}
                site_id={siteId}
                type={"SITE"}
              />
            )}
          </div>
          {/* <div>
            <FloatingMenu
              slideSpeed={500}
              isOpen={isOpen}
              spacing={20}
              direction={Directions.Up}
              className="floating-menu-btn"
            >
              <MainButton
                isOpen={isOpen}
                iconResting={
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
                  />
                }
                iconActive={
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
                  />
                }
                background="white"
                onClick={() => {
                  setIsOpen((prev) => !prev);
                }}
                size={56}
              />
              <ChildButton
                icon={
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
                  />
                }
                background="white"
                size={56}
                onClick={documentRedirect}
              />
              <ChildButton
                icon={
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
                  />
                }
                background="white"
                size={56}
                onClick={supportRedirect}
              />
              <ChildButton
                icon={
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
                  />
                }
                background="white"
                size={56}
                onClick={notesRedirect}
              />
            </FloatingMenu>
          </div> */}
          
            {currentTab == AccountSiteTab.Details && (
            <div style={{ marginBottom: "10px" }}>
              <Box
                className="d-flex justify-content-evenly align-items-center"
                style={{ gap: "50px" }}
              >
                <p>
                  Created Date:{" "}
                  {siteData?.created_date ? (
                    <Moment
                      date={siteData?.created_date}
                      format={"MM/DD/YYYY h:mm A"}
                    />
                  ) : (
                    ""
                  )}
                </p>
                <p>Created By: {siteData?.created_by}</p>
                <p>
                  Modified Date:{" "}
                  {siteData?.modified_date ? (
                    <Moment
                      date={siteData?.modified_date}
                      format={"MM/DD/YYYY h:mm A"}
                    />
                  ) : (
                    ""
                  )}{" "}
                </p>
                <p>Modified By: {siteData?.modified_by}</p>
              </Box>
            </div>
          )}
          {/* <div className="floating-menu-btn d-flex flex-column gap-2"> */}
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
}

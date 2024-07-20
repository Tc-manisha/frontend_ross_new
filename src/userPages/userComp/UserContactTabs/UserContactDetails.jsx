import React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import New from "../../../img/New.png";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import { GetProfile, getPermission } from "../../../helper/Common";
import { filteredDetailsTabs } from "../../../helper/constants";
import BackButton from "../../../components/shared/BackButton";
import {
  AccountContactDetails,
  FetchAccountSiteDetails,
  GetAccountContactList,
  GroupBYSiteCoordinatorInfo,
} from "../../../helper/BasicFn";
import ContactDetailsTopBar from "../ContactDetailsTopBar";
import Details from "./Details";
import Notes from "./Notes";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import Loading from "../../../pages/accounts/Loading";
import Emails from "./Email";
import Support from "./Support";
import Documents from "./Documents";
import { CallGETAPI } from "../../../helper/API";
import RFI from "./RFI";

function UserContactsDetails() {
  const { accountId, siteId, tab } = useParams();
  // const currentTab = tab ? tab : 'Details';
  const [currentTab, setCurrentTab] = useState("");
  const [showLoading, setShowLoading] = React.useState(true);
  const [siteData, setSiteData] = React.useState([]);
  const [billingData, setBillingData] = React.useState("");
  const [shippingData, setShippingData] = React.useState("");
  const [traningData, setTraningData] = React.useState([]);
  const [aedUnits, setAedUnits] = React.useState([]);
  const [coordinatorData, setCoordinatorData] = React.useState([]);
  const [siteContactList, setSiteContactList] = React.useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { contactId } = useParams();
  const [pageTitle, setPageTitle] = useState("");
  const [accountContactList, setAccountContactList] = useState({});
  const [showBtnTab, setShowBtnTab] = useState(false);

  let permissions = getPermission(); // localStorage.getItem('permissions')
  let permissionsArr = permissions.split(",");
  let is_user = location?.state?.is_user;

  let userData = GetProfile(); // JSON.parse(localStorage.getItem("ross-profile"))
  // let account_id = userData?.account_id;
  // let contact_id = userData?.contact_id;

  let privileges = permissionsArr;

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

  // FETCH DATA ON LOAD
  const fetch = async () => {
    setShowLoading(true);
    let data = await FetchAccountSiteDetails(siteId);
    if (data) {
      // setAccountData(data);
      setSiteData(data?.siteData);
      setBillingData(data?.billingData);
      setShippingData(data?.shippingData);
      setTraningData(data?.trainingLocations);

      let CoordiData = GroupBYSiteCoordinatorInfo(data?.cordinatorInformation);
      setCoordinatorData(CoordiData);
      setAedUnits(data?.aed_units);
      setShowLoading(false);
    }
    setShowLoading(false);
  };

  // on load
  useEffect(() => {
    fetch();
  }, []);

  const [tabBarlist, setTabBarlist] = useState([]);

  const subHeading = () => {
    return (
      <div
        style={{
          display: "flex",
          gap: 15,
          width: "100%",
          justifyContent: "left",
          margin: "2% 0",
        }}
      >
        {privileges.includes("site-details-edit") && (
          <Link
            style={{ textDecoration: "none" }}
            to={"/account/accounts-edit/" + account_id}
          >
            <img src={New} alt="New" />
            Edit
          </Link>
        )}
        {privileges.includes("assign-aed") && (
          <Link
            style={{ textDecoration: "none" }}
            to={"/assign-quipment/" + account_id}
          >
            <img src={New} alt="New" />
            Assign AED
          </Link>
        )}
      </div>
    );
  };

  const fetchOnLoad = async () => {
    var data = await GetAccountContactList(contactId);
    if (data) {
      setAccountContactList(data?.data?.data);
      const contactData = data?.data?.data;
      console.log({ contactData });

      var title = "";
      title += contactData?.contact_details?.account_main_contact_salutation;
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

      setShowLoading(false);
    }
  };

  const arr = [
    // {
    //   name: "Details",
    // },
    {
      name: "Classes",
    },
    {
      name: "Notes",
    },
    {
      name: "Emails",
    },
    {
      name: "Support",
    },
    {
      name: "Documents",
    },
    {
      name: "RFI",
    },
  ];

  const settabPermissions = () => {
    const filteredContactTabs = filteredDetailsTabs(arr);

    filteredContactTabs.unshift({
      name: "Details",
      id: "contact-details",
      order: 1,
    });

    const Cp = getPermission(); //localStorage.getItem('permissions');
    if (!Cp) {
      console.log("Invalid Permission");
    }
    const Cp2 = Cp.split(",");

    const newArr = [];
    filteredContactTabs?.map((it) => {
      if (Cp2.includes(it.id)) {
        newArr.push(it);
      }
    });

    var firstKey = newArr[0]?.name;
    setCurrentTab(firstKey);
    setTabBarlist(newArr);
  };

  const tabBarlistArr = tabBarlist.map((item) => item?.name);

  useEffect(() => {
    settabPermissions();
    fetchOnLoad();
  }, []);

  return (
    <>
      <div className="mt-4 pb-5" style={{ paddingInline: "45px" }}>
        {showLoading && (
          <div
            className="showloading"
            style={
              {
                // marginTop: '50%',
                // marginLeft: '50%',
                // transform: 'translate(-50%, -50%)',
              }
            }
          >
            <Loading />
          </div>
        )}

        {!showLoading && (
          <>
            {/* <BackButton />
            <h3 style={{ fontWeight: 600, fontSize: 22, marginTop: "1%" }}>
              Contact: {pageTitle}
            </h3> */}

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
              // breadcrumbs={breadcrumbs}
              exportReport={true}
              currentTab={currentTab}
              // tabTbldata={tabTbldata}
            />

            {/* {subHeading()} */}
            <ContactDetailsTopBar
              tabldList={tabBarlist}
              tab={currentTab}
              setCurrentTab={setCurrentTab}
              contactId={contactId}
            />

            {tabBarlistArr.includes("Details") && currentTab == "Details" && (
              <Details
                siteData={siteData}
                billingData={billingData}
                shippingData={shippingData}
                traningData={traningData}
                aedUnits={aedUnits}
                coordinatorData={coordinatorData}
              />
            )}

            {tabBarlistArr.includes("Notes") && currentTab == "Notes" && (
              <Notes
                is_user={true}
                site_id={siteId}
                privileges={privileges}
                accountId={accountId}
              />
            )}

            {tabBarlistArr.includes("Emails") && currentTab == "Emails" && (
              <Emails
                is_user={true}
                site_id={siteId}
                privileges={privileges}
                accountId={accountId}
              />
            )}

            {tabBarlistArr.includes("Support") && currentTab == "Support" && (
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
                // setTabTbldata={setTabTbldata}
              />
            )}

            {console.log(tabBarlistArr.includes("Documents"))}
            {console.log({ currentTab })}

            {tabBarlistArr.includes("Documents") &&
              currentTab == "Documents" && (
                <Documents
                  accountId={accountId}
                  contact_id={contactId}
                  type={"Contact"}
                  // siteName={siteData?.account_site_name}
                  documentData={documentData}
                />
              )}

            {console.log(tabBarlistArr.includes("RFI"))}
            {console.log({ currentTab })}

            {tabBarlistArr.includes("RFI") && currentTab == "RFI" && (
              <RFI
                accountId={accountContactList?.contact_details?.account_id}
                contact_id={contactId}
                type={"Contact"}
                // siteName={siteData?.account_site_name}
                documentData={documentData}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default UserContactsDetails;

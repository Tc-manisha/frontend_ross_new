import React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AccountContactDetails,
  DecryptToken,
  FetchAccountSiteDetails,
  GroupBYSiteCoordinatorInfo,
} from "../../../helper/BasicFn";
import { useState } from "react";
import { useEffect } from "react";
// import Details from '../pages/accounts/sites/tabs/Details';
// import { AccountSiteTab } from '../utils';
// import BackButton from '../components/shared/BackButton';
import { Box } from "@mui/material";
// import SiteDetailsTopBar from './userComp/SiteDetailsTopBar';
// import UserContactTable from './userComp/UserContactTable';
import UserContactTable from "../../userComp/UserContactTable";
// import UserAeds from './userComp/UserAeds';
// import TrainingTable from './userComp/TrainingTable';
// import UserInperson from './userComp/UserInperson';
import New from "../../../img/New.png";
// import UserSiteNotes from './userComp/UserSiteNotes';
// import UserNotes from './userComp/UserNotes';
// import UserEquipments from './userComp/UserEquipment';
// import UserEmails from './userComp/UserEmails';
// import UserRFI from './userComp/UserRFI';
// import UserSupport from './userComp/UserSupport';
// import UserDocuments from './userComp/UserDocuments';
// import { MainDashboardTopTabLists, filteredDetailsTabs } from '../helper/constants';
// import Loading from '../pages/accounts/Loading';
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import { GetProfile, getPermission } from "../../../helper/Common";
import {
  filteredDetailsTabs,
  filteredSiteTabs,
} from "../../../helper/constants";
import SiteDetailsTopBar from "../SiteDetailsTopBar";
import BackButton from "../../../components/common/BackButton";
import Details from "../../../pages/accounts/sites/tabs/Details";
import Contacts from "./Contacts";
import UserEquipments from "./Equipment";
import Notes from "./Notes";
import Documents from "./Documents";
import { CallGETAPI } from "../../../helper/API";
import Inperson from "./Inperson";
import SubHeading from "../../../components/header/SubHeading";
import Loading from "../../../pages/accounts/Loading";
import UserTraningNewComp from "../UserTrainingNewComp";
import Emails from "./Emails";
import Support from "./Support";
import RFI from "./RFI";

function UserSiteDetails() {
  const { siteId, tab } = useParams();
  // const currentTab = tab ? tab : 'Details';
  const [currentTab, setCurrentTab] = useState("");
  const [showLoading, setShowLoading] = React.useState(false);
  const [siteData, setSiteData] = React.useState([]);
  const [billingData, setBillingData] = React.useState("");
  const [shippingData, setShippingData] = React.useState("");
  const [traningData, setTraningData] = React.useState([]);
  const [aedUnits, setAedUnits] = React.useState([]);
  const [coordinatorData, setCoordinatorData] = React.useState([]);
  const [siteContactList, setSiteContactList] = React.useState([]);
  const [documentData, setDocumentData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  // const accountId = location.state.accountId;
  // console.log({accountId})

  let permissions = getPermission(); // localStorage.getItem('permissions')
  let permissionsArr = permissions.split(",");

  let userData = DecryptToken(); // JSON.parse(localStorage.getItem("ross-profile"))
  let account_id = userData?.account_id;
  let contact_id = userData?.contact_id;

  let privileges = permissionsArr;

  const getDocumentsData = async () => {
    const response = await CallGETAPI(
      `get-all-site-documents?siteId=${siteId}&accountId=${siteData?.account_id}`
    );

    if (response?.status) {
      setDocumentData(response.data.data);
    }
  };

  // FETCH DATA ON LOAD
  const fetch = async () => {
    setShowLoading(true);
    let data = await FetchAccountSiteDetails(siteId);
    if (data) {
      console.log({ data });
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

  useEffect(() => {
    if (siteData?.account_id) {
      getDocumentsData();
    }
  }, [siteData?.account_id]);

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
        {/* {privileges.includes('site-details-edit') && (
					<Link style={{ textDecoration: 'none' }} to={'/account/accounts-edit/' + account_id}>
						<img src={New} alt="New" />
						Edit
					</Link>
				)} */}
        {/* {privileges.includes('assign-aed') && (
					<Link style={{ textDecoration: 'none' }} to={'/assign-quipment/' + account_id}>
						<img src={New} alt="New" />
						Assign AED
					</Link>
				)} */}

        {/* <div className="col" style={{ maxWidth: "130px" }}> */}
        {/* <b className={"d-block mb-2"}>Generate Name</b> */}
        {/* <div className="my-4">
                  <BButton
                    // disabled={!isGenerateBtn}
                    // onClick={(e) => handleGenerateSiteName(e, 'site_details', 'generate_name_toggle')}
                    variant="primary" type="button">
                    Export
                  </BButton>
                </div> */}
        {/* </div> */}
      </div>
    );
  };

  const fetchOnLoad = async () => {
    setShowLoading(true);
    let ContactData = await AccountContactDetails(account_id);
    if (ContactData) {
      setSiteContactList(ContactData?.contact_list);
    }
    setShowLoading(false);
  };

  const arr = [
    {
      name: "Details",
    },
    {
      name: "Contacts",
    },
    {
      name: "Equipment",
    },
    // {
    //   name: "Training",
    // },
    {
      name: "Inperson",
    },
    {
      name: "Notes",
    },
    {
      name: "Documents",
    },
    {
      name: "Emails",
    },
    {
      name: "Support",
    },
    {
      name: "RFI",
    },
  ];

  const settabPermissions = () => {
    const filteredSitesTabs = filteredSiteTabs(arr);

    filteredSitesTabs.unshift({
      name: "Details",
      id: "site-details",
      order: 1,
    });

    const Cp = getPermission(); //localStorage.getItem('permissions');
    if (!Cp) {
      console.log("Invalid Permission");
    }
    const Cp2 = Cp.split(",");

    const newArr = [];
    filteredSitesTabs.map((it) => {
      if (Cp2.includes(it.id)) {
        newArr.push(it);
      }
    });

    var firstKey = newArr[0].name;
    setCurrentTab(firstKey);
    setTabBarlist(newArr);
  };

  const tabBarlistArr = tabBarlist.map((item) => item?.name);

  useEffect(() => {
    settabPermissions();
    fetchOnLoad();
  }, []);

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
      <div className="mt-4 pb-5" style={{ paddingInline: "45px" }}>
        {showLoading && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Loading />
          </div>
        )}

        {!showLoading && (
          <>
            <SubHeading
              title={siteData?.account_site_name}
              hideNew={true}
              newUrl={"/account/sites/new/" + siteData?.account_id}
              subHeading={true}
              hideHierarchy={true}
              //   editUrl={true}
              editUrl={`/admin-siteEdit/${siteData?.account_id}/${siteId}`}
              backTab={"Sites"}
              bottomLinks={true}
              support_type="Site"
              support_name={siteData?.account_site_name}
              site_id={siteId}
              account_id={siteData?.account_id}
              assign_equipment={true}
              Sites={true}
            />

            <SiteDetailsTopBar
              tabldList={tabBarlist}
              tab={currentTab}
              setCurrentTab={setCurrentTab}
              siteId={siteId}
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

            {tabBarlistArr.includes("Contacts") && currentTab == "Contacts" && (
              <Contacts
                is_user={true}
                site_id={siteId}
                siteContactList={siteContactList}
                privileges={privileges}
                accountId={account_id}
              />
            )}
            {tabBarlistArr.includes("Equipment") &&
              currentTab == "Equipment" && (
                <UserEquipments
                  is_user={true}
                  privileges={privileges}
                  accountId={account_id}
                  site_id={siteId}
                />
              )}
            {tabBarlistArr.includes("Notes") && currentTab == "Notes" && (
              <Notes
                is_user={true}
                privileges={privileges}
                accountId={account_id}
                siteId={siteId}
              />
            )}
            {tabBarlistArr.includes("Inperson") && currentTab == "Inperson" && (
              <Inperson
                is_user={true}
                privileges={privileges}
                account_id={account_id}
              />
            )}
            {/* {tabBarlistArr.includes('Training') && currentTab == 'Training' && <UserTraningNewComp is_user={true} privileges={privileges} account_id={account_id} />} */}

            {tabBarlistArr.includes("Emails") && currentTab == "Emails" && (
              <Emails
                is_user={true}
                accountId={siteData?.account_id}
                site_id={siteId}
                type={"SITE"}
              />
            )}

            {tabBarlistArr.includes("Support") && currentTab == "Support" && (
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
            {tabBarlistArr.includes("RFI") && currentTab == "RFI" && (
              <RFI
                accountId={siteData?.account_id}
                site_id={siteId}
                type={"SITE"}
              />
            )}

            {tabBarlistArr.includes("Documents") &&
              currentTab == "Documents" && (
                <Documents
                  is_user={true}
                  site_id={siteId}
                  privileges={privileges}
                  account_id={account_id}
                  contact_id={contact_id}
                  type={"SITE"}
                  siteName={siteData?.account_site_name}
                  documentData={documentData}
                />
              )}
          </>
        )}
      </div>
    </>
  );
}

export default UserSiteDetails;

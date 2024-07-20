import "devextreme/dist/css/dx.light.css";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import NewAccount from "./pages/NewAccount";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/auth/Login";
import Layout from "./components/layout";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ReSetPassword from "./pages/auth/ReSetPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import { AccountDetails, AccountEdit, AccountsListing } from "./pages/accounts";
import NewContact from "./pages/NewContact";
import AccountSiteEdit from "./pages/AccountSiteEdit";
import SiteEdit from "./pages/accounts/account-edit/SiteEdit";
import SiteDetails from "./pages/accounts/SiteDetails";
import { FitnessTable, MeepFitness } from "./pages/meep-table";
import TraningTable from "./pages/meep-table/TraningTable";
import InfoTable from "./pages/meep-table/InfoTable";
import Header from "./pages/meep-table/Header";
// import GenrateImage from './pages/accounts/account-edit/GenrateImage';
import TraningDetailsTable from "./pages/accounts/AlertTable/TraningDetailsTable";
import FixAlert from "./pages/accounts/AlertTable/FixAlert";
import AddNewSite from "./pages/accounts/AddNewSite";
import AddNewContacts from "./pages/accounts/contacts/AddNewContacts";
import Inperson from "./pages/accounts/tabs/Inperson";
import SiteTrainingNew from "./pages/accounts/SiteTrainingNew";
import SiteTrainingEdit from "./pages/accounts/SiteTrainingEdit";
import ContactDetails from "./pages/accounts/contacts/ContactDetails";
import EditContact from "./pages/accounts/contacts/EditContacts";
import CreateInstructor from "./pages/accounts/CreateInstructor";
import EditInstructor from "./pages/accounts/EditInstructor";
import NewRFI from "./pages/accounts/rfi/NewRFI";
import GeneratedRFI from "./pages/accounts/rfi/GeneratedRFI";
import Dashboard from "./pages/accounts/account-edit/Dashboard";
// import Calendar from './pages/calendar';
import CalendarPage from "./pages/CalendarPage";
import ErrorPage from "./pages/error_page";
import NewInperson from "./pages/accounts/inperson/NewInperson";
import EditInperson from "./pages/accounts/inperson/EditInperson";
import InpersonDetails from "./pages/accounts/inperson/InpersonDetails";
import RfiDetails from "./pages/accounts/rfi/RfiDetails";
import TrainerApprove from "./pages/accounts/TrainerApprove";
import InstructorApprove from "./pages/accounts/InstructorApprove";
import Classes from "./pages/accounts/Classes";
import NewNote from "./pages/accounts/notes/NewNote";
import EditNote from "./pages/accounts/notes/EditNote";
import NoteDetails from "./pages/accounts/notes/NoteDetails";
import NewSupport from "./pages/accounts/support/NewSupport";
import EditSupport from "./pages/accounts/support/EditSupport";
import SupportDetails from "./pages/accounts/support/SupportDetails";
import ForbiddenPage from "./pages/forbidden_page";
import {
  getLoggedInUser,
  getPermission,
  getToken,
  setPermission,
} from "./helper/Common";
import NewAed from "./pages/aed";
import UserSelfReg from "./pages/accounts/UserSelfReg";
import UserClassSelection from "./pages/accounts/UserClassSelection";
import UserClassRegistration from "./pages/accounts/UserClassRegistration";
import AedDetails from "./pages/accounts/AedMain/AedMain";
import UserAccountsListing from "./pages/accounts/user/accounts-listing";
import UserAccountDetails from "./pages/accounts/user/account-details";
import EditAedForm from "./pages/aed/EditAed";
import InstructorCalendarPage from "./pages/InstructorCalendarPage/InstructorCalendar";
import AdminCalendarPage from "./pages/AdminCalendarPage";
import EmailDetails from "./pages/accounts/EmailDetails";
import PaymentPage from "./pages/payment-page";
import SiteMain from "./pages/accounts/sites/SiteMain";
import UserRoutes from "./routes/UserRoutes";
import UserDashboard from "./userPages/UserDashboard";
import UserContactDetails from "./userPages/UserContactDetails";
import UserNewNotes from "./userPages/formPages/UserNewNotes";
import MoveAed from "./pages/accounts/AedMain/MoveAed";
import UserClassDetails from "./userPages/classPages/UserClassDetails";
import UserTrainingNew from "./userPages/userComp/UserTrainingNew";
import UserMoveTraining from "./userPages/userComp/UserMoveTraining";
import UserFixAlert from "./userPages/userComp/UserFixAlert";
import UserDashboard1 from "./userPages/UserDashboard1";
import NewPop from "./pages/accounts/Pop/NewPop";
import PopDetails from "./pages/accounts/Pop/PopDetails";
import PopEquipment from "./pages/accounts/Pop/PopEquipment";
import PopAccessories from "./pages/accounts/Pop/PopAccessories";
import NewPopTraining from "./pages/accounts/Pop/NewPopTraining";
import PopCourses from "./pages/accounts/Pop/PopCourses";
import AssignEquipment from "./pages/accounts/AedMain/AssignEquipment";
import AssignEquipmentEdit from "./pages/accounts/AedMain/AssignEquipmentEdit";
import AedCheck from "./pages/accounts/AedMain/AedCheck";
import AedCheckSelect from "./pages/accounts/AedMain/AedCheckSelect";
import PopEdit from "./pages/accounts/Pop/PopEdit";

import AccountDocumentUpload from "./pages/AccountDocumentUpload";
import AccountDocumentDetails from "./pages/AccountDocumentDetails";
import AccountDocumentEdit from "./pages/AccountDocumentEdit";
import AEDChecksDetails from "./pages/accounts/AedMain/tabs/AEDChecksDetails";
import AedServiceCheck from "./pages/accounts/AedMain/AedServiceCheck";
import AedServiceCheckService from "./pages/accounts/AedMain/AedServiceCheckService1";
import AedServiceCheckService1 from "./pages/accounts/AedMain/AedServiceCheckService1";
import AedServiceCheckService2 from "./pages/accounts/AedMain/AedServiceCheckService2";
import AEDInventoryModal from "./pages/accounts/AedMain/AEDInventoryModal";
import AEDServiceDetails from "./pages/accounts/AedMain/AEDServiceDetails";
import NewStandloneAcce from "./pages/accounts/AedMain/NewStandloneAcce";
import AdminAccount from "./pages/Admin/AdminAccount";
import AdminSiteNew from "./pages/Admin/AdminSiteNew";
import AdminSiteEdit from "./pages/Admin/AdminSiteEdit";
import MoveAccessory from "./pages/accounts/AedMain/MoveAccessory";
import UserProfile from "./userPages/userComp/UserProfile";

import AssignPermission from "./pages/permission/assign-permission/AssignPermission";
import CreatePossition from "./pages/permission/create-position/CreatePossition";
import CreateTab from "./pages/permission/create-tab/CreateTab";
import CreatePermission from "./pages/permission/create-permission/CreatePermission";
import AssignCreatePermission from "./pages/accounts/AedMain/AssignCreatePermission";
import AssignPermissionPosition from "./pages/accounts/AedMain/AssignPermissionPosition";
import AssignPermissionUser from "./pages/accounts/AedMain/AssignPermissionUser";
import MultipleAccount from "./pages/accounts/AedMain/MultipleAccount";
import AssignAdmin from "./pages/accounts/AedMain/AssignAdmin";
import UserAedMain from "./userPages/userComp/UserAedMain";
import UserSites from "./userPages/userComp/UserSites";
import UserSupport from "./userPages/userComp/UserSupport";
import UserNotes from "./userPages/userComp/UserNotes";
import UserContacts from "./userPages/userComp/UserContacts";
import UserEquipments from "./userPages/userComp/UserEquipment";
import AccessoryListing from "./userPages/userComp/AccessoryListing";
import { CallGETAPI, CallPOSTAPI } from "./helper/API";
import SitesListing from "./pages/accounts/Admin-Listing/SitesListing";
import ContactListing from "./pages/accounts/Admin-Listing/ContactListing";
import NoteListing from "./pages/accounts/Admin-Listing/NoteListing";
import SupportListing from "./pages/accounts/Admin-Listing/SupportListing";
import EquipmentListing from "./pages/accounts/Admin-Listing/EquipmentListing";
import NewEditAedForm from "./pages/aed/NewEditAedForm";
import EditAedForm2 from "./pages/aed/EditAed2";
import UserAccount from "./userPages/userComp/UserAccount";
import UserSiteDetails from "./userPages/userComp/userSiteTabs/UserSiteDetails";
import UserContactsDetails from "./userPages/userComp/UserContactTabs/UserContactDetails";
import AedMain from "./userPages/userComp/UserEquipmentTab/AedMain";
import UserInpersonDetails from "./userPages/userComp/UserInpersonTab/InpersonDetails";
import { DecryptToken } from "./helper/BasicFn";
import UserPopDetails from "./userPages/userComp/UserPopTabs/UserPopDetails";
// import UserContactsDetails from "./userPages/userComp/UserContactTabs/UserContactDetails";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;
  const [title, setTitle] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [privileges, setPrivileges] = useState([]);
  const [isUser, setIsUser] = useState("");
  const [userAccountId, setUserAccountId] = useState("");
  const user = DecryptToken();

  // handle Url Query

  const url_Object = new URL(window.location.href);
  const is_user = url_Object.searchParams.get("is_user");
  const user_token = url_Object.searchParams.get("token");
  const user_refresh_token = url_Object.searchParams.get("refresh_token");
  if (is_user && user_token && user_refresh_token) {
    sessionStorage.setItem("ross_token", user_token);
    sessionStorage.setItem("ross_rtoken", user_refresh_token);
    sessionStorage.setItem("is_user", is_user);
  }

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action]);

  const handleSetToken = () => {
    setLoading(true);
    let title = "";
    let metaDescription = "";

    const urlObject = new URL(window.location.href);
    const isuser = urlObject.searchParams.get("is_user");
    if (isuser) {
      sessionStorage.setItem("is_user", 1);
      setIsUser(isuser);
    }

    let checkLogin = getToken();
    if (checkLogin) {
      setisLoggedIn(true);
    } else {
      setisLoggedIn(false);
    }

    const profile = getLoggedInUser();
    setProfile(profile);

    //TODO: Update meta titles and descriptions below
    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    } else {
      document.title = "Ross";
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSetToken();
  }, [pathname]);

  const fetchPrivilege = async () => {
    let response = "";
    if(user?.user_type == 2 && user?.sub_admin != "") {
      let payload = {
        account_id: user?.account_id,
        contact_id: user?.contact_id,
      };
      // response = await CallPOSTAPI("account/switch-user", payload);
      response = await CallGETAPI("auth/switch-admin");
    } else {
     response = await CallGETAPI("auth/priviledge");
    }
    if (response.status && response?.data?.permission) {
      let permission = response?.data?.permission;
      setPrivileges(permission);
      setPermission(permission);
    }
  };

  useEffect(() => {
    fetchPrivilege();
  }, []);

  // const privileges = getPermission();

  const layoutWrapper = (props, pageName) => {
    return (
      <Layout pageTitle={pageName} withSidebar={showSidebar}>
        {props}
      </Layout>
    );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={layoutWrapper(<Login isUser={isUser} />, "login")}
      />
      <Route
        path="/forgot-password"
        element={layoutWrapper(<ForgotPassword />, "login")}
      />
      <Route
        path="/reset-password"
        element={layoutWrapper(<ReSetPassword />, "login")}
      />
      <Route
        path="/verify-otp"
        element={layoutWrapper(<VerifyOTP />, "login")}
      />

      <Route
        path="/calendar"
        element={layoutWrapper(<CalendarPage />, "login")}
      />

      <Route
        path="/user-self-registration"
        element={layoutWrapper(
          <UserSelfReg setShowSidebar={setShowSidebar} />,
          "login"
        )}
      />

      <Route
        path="/user-class-selection/:classId"
        element={layoutWrapper(
          <UserClassSelection setShowSidebar={setShowSidebar} />,
          "login"
        )}
      />

      <Route
        path="/account/generated-rfi"
        element={layoutWrapper(
          <GeneratedRFI setShowSidebar={setShowSidebar} />,
          "Generate RFI"
        )}
      />

      <Route
        path="/trainer_approval"
        element={layoutWrapper(
          <TrainerApprove setShowSidebar={setShowSidebar} />,
          "Trainer Approve"
        )}
      />

      <Route
        path="/instructor_approval"
        element={layoutWrapper(
          <InstructorApprove setShowSidebar={setShowSidebar} />,
          "Instructor Approve"
        )}
      />

      <Route
        path="/instructor-calendar"
        element={layoutWrapper(
          <InstructorCalendarPage setShowSidebar={setShowSidebar} />,
          "Instructor Calendar Page"
        )}
      />

      <Route
        path="/admin-calendar"
        element={layoutWrapper(
          <AdminCalendarPage setShowSidebar={setShowSidebar} />,
          "Admin Calendar Page"
        )}
      />

      <Route
        path="/account/:accountId/email/:emailId"
        element={layoutWrapper(
          <EmailDetails setShowSidebar={setShowSidebar} />,
          "Email Details"
        )}
      />

      {/* Protacted Routes */}
      {isLoggedIn && profile?.user_type != 1 ? (
        <>
          <Route
            path="/user-class-registration"
            element={layoutWrapper(
              <UserClassRegistration setShowSidebar={setShowSidebar} />,
              "User Class Registration"
            )}
          />

          <Route
            path="/new-account"
            element={layoutWrapper(
              <NewAccount setShowSidebar={setShowSidebar} />,
              "New Account"
            )}
          />

          <Route
            path="/dashboard"
            element={layoutWrapper(
              <Dashboard setShowSidebar={setShowSidebar} />,
              "Dashboard"
            )}
          />

          <Route
            path="/accounts-listing"
            element={layoutWrapper(
              <AccountsListing
                setShowSidebar={setShowSidebar}
                isUser={isUser}
              />,
              "Accounts"
            )}
          />

          <Route
            path="/meep-fitness"
            element={layoutWrapper(
              <FitnessTable setShowSidebar={setShowSidebar} />,
              "Meep Fitness"
            )}
          />

          <Route
            path="/traning-table"
            element={layoutWrapper(
              <TraningTable setShowSidebar={setShowSidebar} />,
              "traning-table"
            )}
          />

          <Route
            path="/info-table"
            element={layoutWrapper(
              <InfoTable setShowSidebar={setShowSidebar} />,
              "info-table"
            )}
          />

          <Route
            path="/fix-alert"
            element={layoutWrapper(
              <FixAlert setShowSidebar={setShowSidebar} />,
              "fix-alert"
            )}
          />

          <Route
            path="/header"
            element={layoutWrapper(
              <Header setShowSidebar={setShowSidebar} isUser={isUser} />,
              "header"
            )}
          />

          <Route
            path="/accounts-edit"
            element={layoutWrapper(
              <AccountEdit setShowSidebar={setShowSidebar} />,
              "Account Edit"
            )}
          />

          <Route
            path="/account/accounts-edit/:accountId"
            element={layoutWrapper(
              <AccountEdit setShowSidebar={setShowSidebar} />,
              "Account Edit"
            )}
          />
          <Route
            path="/account/site-details-edit/:siteId"
            element={layoutWrapper(
              <AccountSiteEdit setShowSidebar={setShowSidebar} />,
              "Account Edit"
            )}
          />

          <Route
            path="/account-details/:accountId"
            element={layoutWrapper(
              <AccountDetails
                handleSetToken={handleSetToken}
                setShowSidebar={setShowSidebar}
              />,
              "Account Details"
            )}
          />

          <Route
            path="/account-details/:accountId/:tabname"
            element={layoutWrapper(
              <AccountDetails setShowSidebar={setShowSidebar} />,
              "Account Details"
            )}
          />

          <Route
            path="/new-contact"
            element={layoutWrapper(
              <NewContact setShowSidebar={setShowSidebar} />,
              "Account Details"
            )}
          />

          <Route
            path="/account/:accountId/contact-details/:contactId"
            element={layoutWrapper(
              <ContactDetails
                handleSetToken={handleSetToken}
                setShowSidebar={setShowSidebar}
              />,
              "Account Details"
            )}
          />

          <Route
            path="/account/Sites/:accountId"
            element={layoutWrapper(
              <SiteEdit setShowSidebar={setShowSidebar} />,
              "Account Site Edit"
            )}
          />

          <Route
            path="/account/site-details/:siteId"
            element={layoutWrapper(
              <SiteMain setShowSidebar={setShowSidebar} />,
              "Site"
            )}
          />

          <Route
            path="/account/sites/new/:accountId"
            element={layoutWrapper(
              <AddNewSite setShowSidebar={setShowSidebar} />,
              "Account Site New"
            )}
          />

          <Route
            path="/account/contacts/new/:accountId"
            element={layoutWrapper(
              <AddNewContacts setShowSidebar={setShowSidebar} />,
              "New Contact"
            )}
          />

          <Route
            path="/account/contact-details-edit/:contactId"
            element={layoutWrapper(
              <EditContact setShowSidebar={setShowSidebar} />,
              "Edit Contact"
            )}
          />

          <Route
            path="/account/:accountId/site/:siteId/training/new"
            element={layoutWrapper(
              <SiteTrainingNew setShowSidebar={setShowSidebar} />,
              "New Contact"
            )}
          />

          <Route
            path="/account/:accountId/site/:siteId/:DetailID/training/edit"
            element={layoutWrapper(
              <SiteTrainingEdit setShowSidebar={setShowSidebar} />,
              "New Contact"
            )}
          />

          <Route
            path="/account/inperson/new/:accountId"
            element={layoutWrapper(
              <NewInperson setShowSidebar={setShowSidebar} />,
              "New Inperson"
            )}
          />

          <Route
            path="/account/inperson/details/:inpersonId"
            element={layoutWrapper(
              <InpersonDetails setShowSidebar={setShowSidebar} />,
              "InpersonDetails"
            )}
          />

          <Route
            path="/user/inperson/details/:inpersonId"
            element={layoutWrapper(
              <UserInpersonDetails setShowSidebar={setShowSidebar} />,
              "InpersonDetails"
            )}
          />

          <Route
            path="/account/:accountId/inperson/edit/:inpersonId"
            element={layoutWrapper(
              <EditInperson setShowSidebar={setShowSidebar} />,
              "Edit Inperson"
            )}
          />

          <Route
            path="/account/rfi/new/:accountId"
            element={layoutWrapper(
              <NewRFI setShowSidebar={setShowSidebar} />,
              "New RFI"
            )}
          />

          <Route
            path="/account/rfi-details/:rfiId"
            element={layoutWrapper(
              <RfiDetails setShowSidebar={setShowSidebar} />,
              "Generate RFI"
            )}
          />

          <Route
            path="/account/instructor/new/:contactId"
            element={layoutWrapper(
              <CreateInstructor setShowSidebar={setShowSidebar} />,
              "New Inperson"
            )}
          />

          <Route
            path="/account/instructor/edit/:contactId"
            element={layoutWrapper(
              <EditInstructor setShowSidebar={setShowSidebar} />,
              "Edit Instructor"
            )}
          />

          <Route
            path="/account/new-note"
            element={layoutWrapper(
              <NewNote setShowSidebar={setShowSidebar} />,
              "New Note"
            )}
          />

          <Route
            path="/account/edit-note/:noteId"
            element={layoutWrapper(
              <EditNote setShowSidebar={setShowSidebar} />,
              "Edit Note"
            )}
          />

          <Route
            path="/account/note/:noteId"
            element={layoutWrapper(
              <NoteDetails setShowSidebar={setShowSidebar} />,
              "Note Details"
            )}
          />

          <Route
            path="/account/new-support"
            element={layoutWrapper(
              <NewSupport setShowSidebar={setShowSidebar} />,
              "New Support"
            )}
          />
          <Route
            path="/account/new-support/:accountId"
            element={layoutWrapper(
              <NewSupport setShowSidebar={setShowSidebar} />,
              "New Support"
            )}
          />

          <Route
            path="/account/pop-details/:pop_id/:accountId"
            element={layoutWrapper(
              <PopDetails setShowSidebar={setShowSidebar} />,
              "Pop Details"
            )}
          />

          <Route
            path="/user/pop-details/:pop_id/:accountId"
            element={layoutWrapper(
              <UserPopDetails setShowSidebar={setShowSidebar} />,
              "Pop Details"
            )}
          />

          <Route
            path="/account/pop-edit/:pop_id/:accountId"
            element={layoutWrapper(
              <PopEdit setShowSidebar={setShowSidebar} />,
              "Pop Edit"
            )}
          />

          <Route
            path="/account/new-pop/:accountId"
            element={layoutWrapper(
              <NewPop setShowSidebar={setShowSidebar} />,
              "New Pop"
            )}
          />

          <Route
            path="/account/new-pop-training/"
            element={layoutWrapper(
              <NewPopTraining setShowSidebar={setShowSidebar} />,
              "New Pop Training"
            )}
          />

          <Route
            path="/account/add-courses/"
            element={layoutWrapper(
              <PopCourses setShowSidebar={setShowSidebar} />,
              "New Pop Courses"
            )}
          />

          <Route
            path="/account/edit-support/:supportId"
            element={layoutWrapper(
              <EditSupport setShowSidebar={setShowSidebar} />,
              "Edit Support"
            )}
          />

          <Route
            path="/account/support/:supportId"
            element={layoutWrapper(
              <SupportDetails
                handleSetToken={handleSetToken}
                setShowSidebar={setShowSidebar}
              />,
              "Support Details"
            )}
          />
          <Route
            path="/account/new/aed/"
            element={layoutWrapper(
              <NewAed setShowSidebar={setShowSidebar} />,
              "Add AED"
            )}
          />
          <Route
            path="/assign-quipment/:accountId"
            element={layoutWrapper(
              <AssignEquipment setShowSidebar={setShowSidebar} />,
              "Assign Equipment"
            )}
          />
          <Route
            path="/assign-quipment/:accountId/:siteId"
            element={layoutWrapper(
              <AssignEquipment setShowSidebar={setShowSidebar} />,
              "Assign Equipment"
            )}
          />

          <Route
            path="/account/assign-equipment/edit/:siteId"
            element={layoutWrapper(
              <AssignEquipmentEdit setShowSidebar={setShowSidebar} />,
              "Assign Equipment Edit"
            )}
          />

          <Route
            path="/account/assign-create-permission"
            element={layoutWrapper(
              <AssignCreatePermission setShowSidebar={setShowSidebar} />,
              "Assign Create Permission"
            )}
          />

          <Route
            path="/account/assign-permission-position"
            element={layoutWrapper(
              <AssignPermissionPosition setShowSidebar={setShowSidebar} />,
              "Assign Permission Group to Position"
            )}
          />

          <Route
            path="/account/assign-permission-user"
            element={layoutWrapper(
              <AssignPermissionUser setShowSidebar={setShowSidebar} />,
              "Assign Permission Group to User"
            )}
          />

          <Route
            path="/account/multiple-account-permission"
            element={layoutWrapper(
              <MultipleAccount setShowSidebar={setShowSidebar} />,
              "Assign Permission Group to User"
            )}
          />

          <Route
            path="/account/assign-admin"
            element={layoutWrapper(
              <AssignAdmin setShowSidebar={setShowSidebar} />,
              "Assign Admin"
            )}
          />

          <Route
            path="/account/new/aed/:id"
            element={layoutWrapper(
              <NewAed setShowSidebar={setShowSidebar} />,
              "Add AED"
            )}
          />

          <Route
            path="/account/new/aed/:id/:site_id"
            element={layoutWrapper(
              <NewAed setShowSidebar={setShowSidebar} />,
              "Add AED"
            )}
          />

          <Route
            path="/account/aed-details/:aedId"
            element={layoutWrapper(
              <AedDetails setShowSidebar={setShowSidebar} />,
              "AedDetails"
            )}
          />

          {/* <Route
            path="/user/aed-details/:aedId"
            element={layoutWrapper(
              <UserAedMain setShowSidebar={setShowSidebar} />,
              "AedDetails"
            )}
          /> */}

          <Route
            path="/user/aed-details/:aedId"
            element={layoutWrapper(
              <AedMain setShowSidebar={setShowSidebar} />,
              "AedDetails"
            )}
          />

          <Route
            path="/account/aed-checks-details/:aedId/:checkId"
            element={layoutWrapper(
              <AEDChecksDetails setShowSidebar={setShowSidebar} />,
              "AedDetails"
            )}
          />

          <Route
            path="/account/aed-details/check"
            element={layoutWrapper(
              <AedCheck setShowSidebar={setShowSidebar} />,
              "AedCheck"
            )}
          />

          <Route
            path="/account/aed-details/check-select"
            element={layoutWrapper(
              <AedCheckSelect setShowSidebar={setShowSidebar} />,
              "AedCheckSelect"
            )}
          />

          <Route
            path="/move-aed/:accountId/:siteId"
            element={layoutWrapper(
              <MoveAed setShowSidebar={setShowSidebar} />,
              "AedDetails"
            )}
          />

          <Route
            path="/move-accessory/:accountId/:siteId"
            element={layoutWrapper(
              <MoveAccessory setShowSidebar={setShowSidebar} />,
              "AedDetails"
            )}
          />

          <Route
            path="/account/aed/edit/:aedId"
            element={layoutWrapper(
              <EditAedForm setShowSidebar={setShowSidebar} />,
              "EditAedForm"
            )}
          />

          <Route
            path="/account/aed/edit2/:aedId"
            element={layoutWrapper(
              <EditAedForm2 setShowSidebar={setShowSidebar} />,
              "EditAedForm2"
            )}
          />

          <Route
            path="/account/aed/new-edit/:aedId"
            element={layoutWrapper(
              <NewEditAedForm setShowSidebar={setShowSidebar} />,
              "EditAedForm"
            )}
          />

          {/* user routes */}

          <Route
            path="/user/accounts-listing"
            element={layoutWrapper(
              <UserAccountsListing setShowSidebar={setShowSidebar} />,
              "User Accounts Listing"
            )}
          />

          <Route
            path="/user/account-details/:accountId"
            element={layoutWrapper(
              <UserAccountDetails
                setShowSidebar={setShowSidebar}
                privileges={privileges}
              />,
              "User Account Details"
            )}
          />

          {/* Payment Page */}
          <Route
            path="/payment-page"
            element={layoutWrapper(
              <PaymentPage setShowSidebar={setShowSidebar} />,
              "Payment Page"
            )}
          />
        </>
      ) : (
        <>
          <Route
            path="/account/:accountId/contact-details/:contactId"
            element={layoutWrapper(
              <ContactDetails setShowSidebar={setShowSidebar} />,
              "Account Details"
            )}
          />
          {!loading ? <Route path={"/*"} element={<ErrorPage />} /> : ""}
        </>
      )}

      <Route
        path={"/user-dashboard1"}
        element={layoutWrapper(
          <UserDashboard1 setShowSidebar={setShowSidebar} />,
          "User Dashbaord"
        )}
      />

      <Route
        path={"user-dashboard"}
        element={layoutWrapper(<UserDashboard />, "User Dashbaord")}
      />

      <Route
        path={"/user/:tab"}
        element={layoutWrapper(
          <UserDashboard
            setShowSidebar={setShowSidebar}
            userAccountId={userAccountId}
          />,
          "User Dashbaord"
        )}
      />

      {/* <Route
        path={"/user/:tab/:accountId"}
        element={layoutWrapper(
          <UserDashboard
            setShowSidebar={setShowSidebar}
            userAccountId={userAccountId}
          />,
          "User Dashbaord"
        )}
      /> */}

      <Route
        path={"/user/:tab/:userAccountId"}
        element={layoutWrapper(
          <UserDashboard
            setShowSidebar={setShowSidebar}
            userAccountId={userAccountId}
          />,
          "User Dashbaord"
        )}
      />

      <Route
        path={"/user/site-details/:siteId"}
        element={layoutWrapper(
          <UserSiteDetails setShowSidebar={setShowSidebar} />,
          "User Site Details"
        )}
      />

      <Route
        path={"/user/:accountId/contact-details/:contactId"}
        element={layoutWrapper(
          <UserContactsDetails setShowSidebar={setShowSidebar} />,
          "User Contact Details"
        )}
      />
      {/* 
     <Route
        path={"/user/account-details/:accountId/:tab"}
        element={layoutWrapper(
          <UserAccountDetails setShowSidebar={setShowSidebar} />,
          "Account Details"
        )}
      /> */}

      <Route
        path={"/user/site-details/:siteId/:tab"}
        element={layoutWrapper(
          <UserSiteDetails setShowSidebar={setShowSidebar} />,
          "User Site Details"
        )}
      />

      <Route
        path={"/user/:accountId/contact-details/:contactId"}
        element={layoutWrapper(
          <UserContactDetails setShowSidebar={setShowSidebar} />,
          "Contact Details"
        )}
      />

      <Route
        path={"/user/account/new-note"}
        element={layoutWrapper(
          <UserNewNotes setShowSidebar={setShowSidebar} />,
          "New Notes"
        )}
      />

      <Route
        path={"/user/inperson-class/:inpersonId"}
        element={layoutWrapper(
          <UserClassDetails setShowSidebar={setShowSidebar} />,
          "New Notes"
        )}
      />

      <Route
        path={"/user-training/new"}
        element={layoutWrapper(
          <UserTrainingNew setShowSidebar={setShowSidebar} />,
          "User Training New"
        )}
      />

      <Route
        exact
        path={"/user-training/Move"}
        element={layoutWrapper(
          <UserMoveTraining setShowSidebar={setShowSidebar} />,
          "User Move Training "
        )}
      />

      <Route
        path={"/user/fix-alerts"}
        element={layoutWrapper(
          <UserFixAlert setShowSidebar={setShowSidebar} />,
          "User Fix-Alert "
        )}
      />

      <Route
        path="/account-document-upload"
        element={layoutWrapper(
          <AccountDocumentUpload setShowSidebar={setShowSidebar} />,
          "Account Document Upload"
        )}
      />

      <Route
        path="/account-document-details/:id"
        element={layoutWrapper(
          <AccountDocumentDetails setShowSidebar={setShowSidebar} />,
          "Account Document Details"
        )}
      />

      <Route
        path="/account-document-edit/:id"
        element={layoutWrapper(
          <AccountDocumentEdit setShowSidebar={setShowSidebar} />,
          "Account Document Edit"
        )}
      />

      <Route
        path="/account/aed/service-check/:accountId/:siteId"
        element={layoutWrapper(
          <AedServiceCheck setShowSidebar={setShowSidebar} />,
          "Aed Service Check"
        )}
      />

      <Route
        path="/account/aed/service-check/service1/:accountId/:siteId/:aedId"
        element={layoutWrapper(
          <AedServiceCheckService1 setShowSidebar={setShowSidebar} />,
          "Aed Service Check Service1"
        )}
      />

      <Route
        path="/account/aed/service-check/service2/:serviceQuestionID"
        element={layoutWrapper(
          <AedServiceCheckService2 setShowSidebar={setShowSidebar} />,
          "Aed Service Check Service1"
        )}
      />

      <Route
        path="/account-details/AEDServiceDetails/:aedId/:serviceQuestionId"
        element={layoutWrapper(
          <AEDServiceDetails setShowSidebar={setShowSidebar} />,
          "AED Service Details"
        )}
      />

      <Route
        path="/account/AEDInventoryModal"
        element={layoutWrapper(
          <AEDInventoryModal setShowSidebar={setShowSidebar} />,
          "AED Inventory Modal"
        )}
      />

      <Route
        path="/account/aed/NewStandloneAcce/:accountId/:siteId"
        element={layoutWrapper(
          <NewStandloneAcce setShowSidebar={setShowSidebar} />,
          "New Standlone Acce"
        )}
      />

      <Route
        path="/admin-account"
        element={layoutWrapper(
          <AdminAccount setShowSidebar={setShowSidebar} />,
          "New Standlone Acce"
        )}
      />

      <Route
        path="/admin-siteNew/:accountId"
        element={layoutWrapper(
          <AdminSiteNew setShowSidebar={setShowSidebar} />,
          "New Standlone Acce"
        )}
      />

      <Route
        path="/admin-siteEdit/:accountId/:siteId"
        element={layoutWrapper(
          <AdminSiteEdit setShowSidebar={setShowSidebar} />,
          "New Standlone Acce"
        )}
      />

      <Route
        path="/user-dashboard1/user-profile/:contactId"
        element={layoutWrapper(<UserProfile isUser={isUser} />, "User Profile")}
      />

      <Route
        path="/permission-manager/assign-permission"
        element={layoutWrapper(<AssignPermission />, "Assign Permission")}
      />

      <Route
        path="/permission-manager/create-position"
        element={layoutWrapper(<CreatePossition />, "Create Permission")}
      />

      <Route
        path="/permission-manager/create-tab"
        element={layoutWrapper(<CreateTab />, "Create Tab")}
      />

      <Route
        path="/permission-manager/create-permission"
        element={layoutWrapper(<CreatePermission />, "Create Permission")}
      />

      <Route
        path="/user-listing/account"
        element={layoutWrapper(
          <UserAccount
            setShowSidebar={setShowSidebar}
            privileges={privileges}
            isUser={isUser}
            setUserAccountId={setUserAccountId}
          />,
          "User Account-listing"
        )}
      />

      <Route
        path="/user-listing/sites"
        element={layoutWrapper(
          <UserSites setShowSidebar={setShowSidebar} />,
          "User Sites-listing"
        )}
      />

      <Route
        path="/user-listing/support"
        element={layoutWrapper(
          <UserSupport setShowSidebar={setShowSidebar} />,
          "User Support-listing"
        )}
      />

      <Route
        path="/user-listing/notes"
        element={layoutWrapper(
          <UserNotes setShowSidebar={setShowSidebar} />,
          "User Notes-listing"
        )}
      />

      <Route
        path="/user-listing/contacts"
        element={layoutWrapper(
          <UserContacts setShowSidebar={setShowSidebar} />,
          "User Contact-listing"
        )}
      />

      <Route
        path="/user-listing/equipment"
        element={layoutWrapper(
          <UserEquipments setShowSidebar={setShowSidebar} />,
          "User Equipment-listing"
        )}
      />

      <Route
        path="/Admin/accessory-listing"
        element={layoutWrapper(
          <AccessoryListing setShowSidebar={setShowSidebar} />,
          "Admin-Accessory-listing"
        )}
      />

      <Route
        path="/Admin/Sites-listing"
        element={layoutWrapper(
          <SitesListing setShowSidebar={setShowSidebar} />,
          "Admin-Sites-listing"
        )}
      />

      <Route
        path="/Admin/Equipment-listing"
        element={layoutWrapper(
          <EquipmentListing setShowSidebar={setShowSidebar} />,
          "Admin-Equipment-listing"
        )}
      />

      <Route
        path="/Admin/Contact-listing"
        element={layoutWrapper(
          <ContactListing setShowSidebar={setShowSidebar} />,
          "Admin-Contact-listing"
        )}
      />

      <Route
        path="/Admin/Note-listing"
        element={layoutWrapper(
          <NoteListing setShowSidebar={setShowSidebar} />,
          "Admin-Note-listing"
        )}
      />

      <Route
        path="/Admin/Support-listing"
        element={layoutWrapper(
          <SupportListing setShowSidebar={setShowSidebar} />,
          "Admin-Support-listing"
        )}
      />

      {/* /user/account/contact-details/ */}
    </Routes>
  );
}
export default App;

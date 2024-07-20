// Sidebar configs
import MailIcon from "@mui/icons-material/Mail";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import { CallGETAPI } from "../helper/API";

export const MenuLinks = [
  
  {
    Icon: <PlaylistAddIcon color={"inherit"} />,
    privillage: "accounts-listing",
    title: "Accounts",
    link: "/accounts-listing",
    onClick: () => navigate("/accounts-listing"),
  },
  {
    Icon: <MailIcon color={"inherit"} />,
    privillage: "instructor-calendar",
    title: "Instructor Calendar",
    link: "/instructor-calendar",
    onClick: () => navigate("/instructor-calendar"),
  },
  {
    Icon: <MailIcon color={"inherit"} />,
    privillage: "admin-calendar",
    title: "Admin Calendar",
    link: "/admin-calendar",
    onClick: () => navigate("/admin-calendar"),
  },
  {
    Icon: <MailIcon color={"inherit"} />,
    privillage: "site-tab",
    title: "Site Listing",
    link: "/Admin/Sites-listing",
    onClick: () => navigate("/Admin/Sites-listing"),
  },
  {
    Icon: <PlaylistAddIcon color={"inherit"} />,
    privillage: "equipment-tab",
    title: "Equipment Listing",
    link: "/Admin/Equipment-listing",
    onClick: () => navigate("/Admin/Equipment-listing"),
  },
  {
    Icon: <PlaylistAddIcon color={"inherit"} />,
    privillage: "accessory-tab",
    title: "Accessory Listing",
    link: "/Admin/accessory-listing",
    onClick: () => navigate("/Admin/accessory-listing"),
  },
  {
    Icon: <MailIcon color={"inherit"} />,
    privillage: "contact-tab",
    title: "Contact Listing",
    link: "/Admin/Contact-listing",
    onClick: () => navigate("/Admin/Contact-listing"),
  },
  {
    Icon: <MailIcon color={"inherit"} />,
    privillage: "notes-tab",
    title: "Note Listing",
    link: "/Admin/Note-listing",
    onClick: () => navigate("/Admin/Note-listing"),
  },
  {
    Icon: <MailIcon color={"inherit"} />,
    privillage: "support-tab",
    title: "Support Listing",
    link: "/Admin/Support-listing",
    onClick: () => navigate("/Admin/Support-listing"),
  },
];


export const UserMenuLinks = [
  {
    Icon: <MailIcon color={"inherit"} />,
    privillage: "Home",
    title: "Home",
    link: "/user-dashboard1",
    onClick: () => navigate("/user-dashboard1"),
  },
  {
    Icon: <MailIcon color={"inherit"} />,
    privillage: "Account",
    title: "Accounts",
    link: "",
  },
  {
    Icon: <MailIcon color={"inherit"} />,
    privillage: "site-tab",
    title: "Site Listing",
    link: "/user-listing/sites",
    onClick: () => navigate("/user-listing/sites"),
  },
  {
    Icon: <PlaylistAddIcon color={"inherit"} />,
    privillage: "equipment-tab",
    title: "Equipment Listing",
    link: "/user-listing/equipment",
    onClick: () => navigate("/user-listing/equipment"),
  },
  {
    Icon: <MailIcon color={"inherit"} />,
    privillage: "contact-tab",
    title: "Contact Listing",
    link: "/user-listing/contacts",
    onClick: () => navigate("/user-listing/contacts"),
  },
  {
    Icon: <MailIcon color={"inherit"} />,
    privillage: "notes-tab",
    title: "Note Listing",
    link: "/user-listing/notes",
    onClick: () => navigate("/user-listing/notes"),
  },
  {
    Icon: <MailIcon color={"inherit"} />,
    privillage: "support-tab",
    title: "Support Listing",
    link: "/user-listing/support",
    onClick: () => navigate("/user-listing/support"),
  },
];

export const getNavMenus = (navigate) => {
  const navMenus = [
    {
      Icon: <MailIcon />,
      title: "New Account",
      link: "/new-account",
      onClick: () => navigate("/new-account"),
    },
    {
      Icon: <MailIcon />,
      title: "Accounts",
      link: "/accounts-listing",
      onClick: () => navigate("/accounts-listing"),
    },
    {
      Icon: <MailIcon />,
      title: "Meep Fitness",
      link: "/meep-fitness",
      onClick: () => navigate("/meep-fitness"),
    },
    {
      Icon: <MailIcon />,
      title: "traning-table",
      link: "/traning-table",
      onClick: () => navigate("/traning-table"),
    },
    {
      Icon: <MailIcon />,
      title: "info-table",
      link: "/info-table",
      onClick: () => navigate("/info-table"),
    },
    // {
    //   title: "alert-table-table",
    //   link:"/alert-table",
    //   onClick: () => navigate("/alert-table"),
    // },

    // {
    //   title: "Main Contact",
    //   link:"/new-contact",
    //   onClick: () => navigate("/new-contact"),
    // },
    // {
    //   title: "New Contacts",
    //   link:"/new-contact",
    //   onClick: () => navigate("/new-contact"),
    // },
    // {
    //   title: "Account Site Edit",
    //   link:"/account/site-edit",
    //   onClick: () => navigate("/new-contact"),
    // },
  ];

  return navMenus;
};

/* Accounts Listing */
// @ Account Details
export const AccountDetailsTab = {
  DETAILS: "Details",
  SITES: "Sites",
  CONTACTS: "Contacts",
  Equipment: "Equipment",
  TRAINING: "Training",
  INPERSON: "Inperson",
  POPS: "POPS",
  NOTES: "Notes",
  EMAILS: "Emails",
  SUPPORT: "Support",
  DOCUMENTS: "Documents",
  RFI: "RFI",

  // CALLS: "Calls",
};

export const AccountContactsTab = {
  Details: "Details",
  Classes: "Classes",
  Instructor: "Instructor",
  Notes: "Notes",
  Emails: "Emails",
  Support: "Support",
  Documents: "Documents",
  RFI: "RFI",
};
export const AccountContactTbWithPermission = [
  {title: "Details",permission:'account-details'},
  {title: "Classes",permission:'classes-tab'},
  {title: "Instructor",permission:'instructor-tab'},
  {title: "Notes",permission:'notes-tab'},
  {title: "Emails",permission:'email-tab'},
  {title: "Support",permission:'support-tab'},
  {title: "Documents",permission:'documents-tab'},
  {title: "RFI",permission:'rfi-tab'},
];

export const InpersonTab = {
  Details: "Details",
  Students: "Students",
  Certifications: "Certifications",
  Notes: "Notes",
};

export const UsersInpersonTab = {
  Details: "Details",
  Notes: "Notes",
};

export const UserInpersonTab = [
  { name: "Details" },
  // { name: "Students" },
  // { name: "Certifications" },
  { name: "Notes" }
];

export const AedTabs = {
  Details: "Details",
  Notes: "Notes",
  AEDChecks: "AED Checks",
  AEDServicing: "AED Servicing",
  Support: "Support",
  Documents: "Documents",
};

export const UserAedTabs = [
  { name: "Details" },
  { name: "Notes" },
  { name: "AED Checks" },
  { name: "AED Servicing" },
  {Support: "Support"},
  {Documents: "Documents"},
];

export const AccountSiteTab = {
  Details: "Details",
  Contacts: "Contacts",
  Equipment: "Equipment",
  Inperson: "Inperson",
  // Instructor: "Instructor",
  Notes: "Notes",
  Emails: "Emails",
  Support: "Support",
  Documents: "Documents",
  RFI: "RFI",
};

export const AccountPopTab = {
  Details: "Details",
  Documents: "Documents",
  Notes: "Notes",
};

export const UserPopTabs = [
  { name: "Details", id: "pop-details" },
  { name: "Documents", id: "documents-tab" },
  { name: "Notes", id: "notes-tab" }
];
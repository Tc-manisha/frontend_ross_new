import React from "react";
import Container from "react-bootstrap/Container";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";
// import { Button, DownListItems } from "../../components";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useEffect, useState } from "react";
import New from '../img/New.png';
import NewDropdown from "./userComp/NewDropdown"

const AccountContactsTab = [
    { name: "Details" },
    { name: "Classes" },
    { name: "Notes" },
    { name: "Instructor" },
    { name: "Emails" },
    { name: "RFI" },
    { name: "Documents" },
    { name: "Support" }
];

import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { CallGETAPI } from "../helper/API";
import { GetAccountContactList } from "../helper/BasicFn";

import {
    CssBaseline,
    ThemeProvider,
    createTheme,
    StyledEngineProvider,
} from "@mui/material";
import Details from "../pages/accounts/contacts/tabs/Details";
import Instructor from "../pages/accounts/contacts/tabs/Instructor";
import Loading from "../pages/accounts/Loading";
import ContctDetails from "./userComp/ContctDetails";
import BackButton from "../components/shared/BackButton";
import UserContactInpersonClass from "./userComp/UserContactInpersonClass";
import UserSupport from "./userComp/UserSupport";
import UserEmails from "./userComp/UserEmails";
import UserNotes from "./userComp/UserNotes";
import UserDocuments from "./userComp/UserDocuments";
import UserRFI from "./userComp/UserRFI";
import { filteredDetailsTabs } from "../helper/constants";
import { GetProfile, getPermission } from "../helper/Common";


const drawerWidth = 200;
const theme = createTheme();


const UserContactsDetails = ({ setShowSidebar }) => {
    const [currentTab, setCurrentTab] = useState('');
    // const [currentTab, setCurrentTab] = useState('');

    const [showLoading, setShowLoading] = React.useState(true);
    const [accountContactList, setAccountContactList] = useState({});
    const [pageTitle, setPageTitle] = useState('');
    const [open, setOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { contactId } = useParams();
    const [showBtnTab, setShowBtnTab] = useState(false);
    const [clickable, setClickable] = useState(true);
    const [filteredTabs, setFilteredTabs] = useState([])


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleTab = (item) => {
        if (clickable) {
            setCurrentTab(item)
        }
    }

    let userData = GetProfile();// JSON.parse(localStorage.getItem("ross-profile"))
    let account_id = userData?.account_id
    let contact_id = userData?.contact_id

    let privileges = getPermission();// localStorage.getItem('permissions')
    let privilegesArr = privileges.split(',')

    const subHeading = () => {
        return (
            <div style={{ display: 'flex', gap: 15, width: '100%', justifyContent: 'left', margin: '2% 0' }}>
                {privileges.includes('contacts-new') && (
                    <Link style={{ textDecoration: 'none' }} to={'/account/contacts/new/' + account_id}>
                        <img src={New} alt="New" />
                        New
                    </Link>
                )}
                {privileges.includes('contact-details-edit') && (
                    <Link style={{ textDecoration: 'none' }} to={'/account/contact-details-edit/' + contact_id}>
                        <img src={New} alt="New" />
                        Edit
                    </Link>
                )}
                {privileges.includes('assign-aed') && (
                    <Link style={{ textDecoration: 'none' }} to={'/assign-quipment/' + account_id}>
                        <img src={New} alt="New" />
                        Instructor
                    </Link>
                )}
            </div>
        )
    }


    const fetchOnLoad = async () => {
        var data = await GetAccountContactList(contactId)
        if (data) {
            setAccountContactList(data?.data?.data)

            const contactData = data?.data?.data

            var title = '';
            title += contactData?.contact_details?.account_main_contact_salutation;
            title += contactData?.contact_details?.account_main_contact_firstname ? ' ' + contactData?.contact_details?.account_main_contact_firstname : '';
            title += contactData?.contact_details?.account_main_contact_middlename ? ' ' + contactData?.contact_details?.account_main_contact_middlename : '';
            title += contactData?.contact_details?.account_main_contact_lastname ? ' ' + contactData?.contact_details?.account_main_contact_lastname : '';
            title += contactData?.contact_details?.account_main_contact_suffix ? ' ' + contactData?.contact_details?.account_main_contact_suffix : '';

            setPageTitle(title);


            if (data?.data?.data?.instructorDetails?.length > 0) {
                setShowBtnTab(true);
            } else {
                let key = 'Instructor';
                delete AccountContactsTab[key];
                setShowBtnTab(false);
            }

            setShowLoading(false);
        }

    }

    useEffect(() => {
        fetchOnLoad();

        const profile = GetProfile();// JSON.parse(localStorage.getItem("ross-profile"));

        if (profile?.user_type == 1) {
            setClickable(false);
        }
    }, [])

    useEffect(() => {
        if (location?.state?.tab) {
            setCurrentTab(location?.state?.tab)
        }

    }, [location])

    const filterTabsArray = () => {

        const filteredContactsTabs = filteredDetailsTabs(AccountContactsTab)

        filteredContactsTabs.unshift({ name: 'Details', id: 'contact-details', 'order': 1 })
        filteredContactsTabs.push({ name: 'Classes', id: 'contact-classes-tab', 'order': 13 })
        filteredContactsTabs.push({ name: 'Instructor', id: 'contact-instructor-tab', 'order': 14 })

        // let filteredData = {};
        let filteredData = [];
        const permission = getPermission();//localStorage.getItem('permissions');
        if (!permission) {
            console.log('No Permission Found');
            return "";
        }
        const cp = permission.split(',');
        filteredContactsTabs.forEach(tab => {
            if (cp.includes(tab.id)) {
                // filteredData[tab.name] = tab.name;
                filteredData.push(tab)
            }
        });

        const filteredDataObj = {};
        filteredData.forEach(obj => {
            filteredDataObj[obj.name] = obj.name;
        });

        var firstKey = Object.keys(filteredDataObj)[0];
        setCurrentTab(filteredDataObj[firstKey])
        setFilteredTabs(filteredDataObj)
    };

    useEffect(() => {
        filterTabsArray()
    }, [])

    return (
        <>
            {/* loading */}
            {showLoading ?
                <>
                    <div className="showloading">
                        <Loading />
                    </div>
                </> : <>
                    <div className="mt-4" style={{ width: "100%", paddingInline: "45px" }}>

                        <BackButton />

                        {subHeading()}

                        <Box className="bg-primary ">
                            <div className="d-flex border-bottom border-secondary">
                                {Object.values(filteredTabs).map((tabItem, i) => (
                                    <div
                                        role="button"
                                        key={i}
                                        className={"text-light py-2 px-3"}
                                        style={{
                                            backgroundColor: `${tabItem == currentTab ? "#26AEE0" : "#0C71C3"}`,
                                        }}
                                        onClick={() => handleTab(tabItem)}
                                    >
                                        {tabItem}
                                    </div>
                                ))}
                            </div>
                        </Box>

                        {/* Details */}
                        {filteredTabs.hasOwnProperty('Details') && currentTab === filteredTabs.Details && (
                            <ContctDetails is_user={true} />
                        )}

                        {/* Classes */}
                        {filteredTabs.hasOwnProperty('Classes') && currentTab === filteredTabs.Classes && (
                            <UserContactInpersonClass contact_id={contact_id} />
                        )}

                        {filteredTabs.hasOwnProperty('Instructor') && currentTab === filteredTabs.Instructor && (
                            <Instructor
                                InstructorData={accountContactList?.instructorDetails[0] || []}
                                ahaDetails={accountContactList?.ahaDetails[0] || []}
                                hsiDetails={accountContactList?.hsiDetails[0] || []}
                            />
                        )}


                        {/* DOCUMENTS */}
                        {filteredTabs.hasOwnProperty('Documents') && currentTab === filteredTabs.Documents && (
                            <UserDocuments is_user={true} privileges={privilegesArr} account_id={account_id} />
                        )}

                        {/* SUPPORT */}
                        {filteredTabs.hasOwnProperty('Support') && currentTab === filteredTabs.Support && (
                            <UserSupport
                                is_user={true} privileges={privilegesArr} account_id={account_id} contact_id={contact_id}
                            />
                        )}

                        {/* Notes */}
                        {filteredTabs.hasOwnProperty('Notes') && currentTab === filteredTabs.Notes && (
                            <UserNotes is_user={true} privileges={privileges} account_id={account_id} />
                        )}

                        {/* Emails */}
                        {filteredTabs.hasOwnProperty('Emails') && currentTab === filteredTabs.Emails && (
                            <UserEmails is_user={true} privileges={privilegesArr} account_id={account_id} />
                        )}

                        {/* rfi */}
                        {filteredTabs.hasOwnProperty('RFI') && currentTab === filteredTabs.RFI && (
                            <UserRFI is_user={true} privileges={privilegesArr} account_id={account_id} />
                        )}

                    </div>
                </>
            }

        </>
    );
};

export default UserContactsDetails;

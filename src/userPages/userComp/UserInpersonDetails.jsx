import React, { useState } from "react";
import SubHeadingOther from "../../components/header/SubHeadingOther";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { InpersonTab, UserInpersonTab } from "../../utils";
import Details from "../../pages/accounts/inperson/tabs/Details";
import Students from "../../pages/accounts/inperson/tabs/Students";
import Certifications from "../../pages/accounts/inperson/tabs/Certifications";
import { useNavigate, useParams } from "react-router-dom";
import BroadcastModal from "../../components/modals/BroadcastModal/BroadcastModal";
import InstructorCourseModal from "../../components/modals/InstructorCourseModal/InstructorCourseModal";
import { useEffect } from "react";
import {
    GetAssignedBroadcastInstructors,
    GetAssignedInstructorsByClass,
    GetClassContactsByAddressAndCert,
} from "../../helper/BasicFn";
import { CallGETAPINEW, CallPOSTAPINEW } from "../../helper/API";
import { Dropdown } from "react-bootstrap";
import InpersonNotes from "../../pages/accounts/inperson/tabs/InpersonNotes";
import Loading from "../../pages/accounts/Loading";
import NewDropdown from "../../userPages/userComp/NewDropdown";
import { filteredDetailsTabs } from "../../helper/constants";
import { GetProfile, getPermission } from "../../helper/Common";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 386,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function UserInpersonDetails() {
    const [currentTab, setCurrentTab] = useState('');
    const [open, setOpen] = React.useState(false);
    const [allInstructors, setAllInstructors] = useState([]);
    const [broadCastModal, setBroadCastModal] = React.useState(false);
    const [instructorCourseModal, setInstructorCourseModal] =
        React.useState(false);
    const [assignedInstructors, setAssignedInstructors] = React.useState([]);
    const [assignedBroadcastInstructors, setAssignedBroadcastInstructors] =
        React.useState([]);
    const [inpersonClass, setInpersonsClass] = useState({});
    const [accountId, setAccountId] = useState("");
    const [uniqueClassID, setUniqueClassID] = useState("")
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filteredTabs, setFilteredTabs] = useState([])

    const handleClose = () => setOpen(false);
    const { inpersonId, tab } = useParams();
    const navigate = useNavigate();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleTab = (item) => {
        setCurrentTab(item);
    };

    // get instructors
    const fetchOnLoad = async () => {
        setLoading(true);
        const inpersonData = await CallGETAPINEW(
            "account/inperson-class/" + inpersonId
        );

        if (inpersonData?.status) {
            const inperson = inpersonData?.data?.data?.inpersonClass;
            inperson.account_name = inpersonData?.data?.data?.account_name;
            inperson.cert_name = inpersonData?.data?.data?.certName;
            inperson.course_name = inpersonData?.data?.data?.courseName;
            inperson.site_name = inpersonData?.data?.data?.site_name;
            setAccountId(inperson?.account_id);
            setUniqueClassID(inpersonData?.data?.data.inpersonClass)
            setInpersonsClass(inperson);

            const instructors = await GetClassContactsByAddressAndCert(
                inperson?.training_address_id,
                inperson?.cert_agency
            );
            if (instructors?.status) {
                setAllInstructors(instructors?.data);
            }
        }

        const result = await GetAssignedInstructorsByClass(inpersonId);

        if (result?.status) {
            let data = result?.classInstructor?.class_instructors;
            data = JSON.parse(data);
            setAssignedInstructors(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOnLoad();
    }, [instructorCourseModal]);

    useEffect(() => {
        fetchOnLoad();
    }, []);

    const notesRedirect = () => {
        navigate(
            `/account/new-note?account_id=${accountId}&inperson_id=${inpersonId}`
        );
    };

    const permission =  getPermission();//localStorage.getItem('permissions');

    let profile = GetProfile(); //JSON.parse(localStorage.getItem("ross-profile"))
    let account_id = profile?.account_id
    let contact_id = profile?.contact_id

    let is_user = false
    let privileges = []
    if (profile.user_type > 1) {
        let permissionsArr = permission.split(',')
        privileges = permissionsArr
        is_user = true
    }

    const filterTabsArray = () => {

        const filteredInpersonTabs = filteredDetailsTabs(UserInpersonTab)

        filteredInpersonTabs.unshift({ name: 'Details', id: 'inperson-details', 'order': 1 })
        filteredInpersonTabs.push({ name: 'Students', id: 'inperson-student-tab', 'order': 13 })
        filteredInpersonTabs.push({ name: 'Certifications', id: 'inperson-certification-tab', 'order': 14 })

        // let filteredData = {};
        let filteredData = [];
        if (!permission) {
            console.log('No Permission Found');
            return "";
        }
        const cp = permission.split(',');
        filteredInpersonTabs.forEach(tab => {
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
        <div>
            {loading ? (
                <>
                    <div className="showloading">
                        <Loading />
                    </div>
                </>
            ) : (<>
                <div className="" style={{ paddingInline: "45px" }}>
                    <div className="sub-heading-top mt-3">
                        <SubHeadingOther
                            title={"Class: " + uniqueClassID.unique_class_id}
                            hideNew={"tab"}
                            hideHierarchy={true}
                            hideInstructor={true}
                            subHeading={true}
                        />

                        {/* <SubHeading hideNew='tab' title={ 'Account : ' + accountDetails?.account_name } newUrl="/new-account" subHeading={ true } hideHierarchy={ accountDetails?.parent_account != '' && accountDetails?.parent_account != 0 ? false : true } editUrl={ '/account/accounts-edit/' + inpersonClass?.account_id } outsideClickEvent={ outsideClick } /> */}
                        {/* bottom buttons */}

                        <div className="d-flex" style={{ justifyContent: "space-between" }}>
                            <div className="d-flex">

                                {privileges.includes('new-inperson') && (
                                    <button
                                        className="btn text-primary"
                                        type="button"
                                        onClick={() =>
                                            navigate(`/account/inperson/new/${account_id}`)
                                        }
                                    >
                                        <img
                                            src="/edit.svg"
                                            alt="New"
                                            style={{ marginRight: "5px" }}
                                        />
                                        <span className="ms-1">New</span>
                                    </button>
                                )}

                                {privileges.includes('edit-inperson') && (
                                    <button
                                        className="btn text-primary"
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/account/" +
                                                inpersonClass?.account_id +
                                                "/inperson/edit/" +
                                                inpersonId
                                            )
                                        }
                                    >
                                        <img
                                            src="/edit.svg"
                                            alt="Edit"
                                            style={{ marginRight: "5px" }}
                                        />
                                        <span className="ms-1">Edit</span>
                                    </button>
                                )}

                                {privileges.includes('inperson-instructor') && (
                                    <button
                                        className="btn text-primary"
                                        type="button"
                                        onClick={() => {
                                            setInstructorCourseModal(!instructorCourseModal);
                                        }}
                                    >
                                        <img
                                            src="/create-instructor.svg"
                                            alt="Instructors"
                                            style={{ marginRight: "5px" }}
                                        />
                                        <span className="ms-1">Instructors</span>
                                    </button>
                                )}

                                {privileges.includes('inperson-broadcast') && (
                                    <button
                                        className="btn text-primary"
                                        type="button"
                                        onClick={() => {
                                            setBroadCastModal(!broadCastModal);
                                        }}
                                    >
                                        <img
                                            src="/broadcast.svg"
                                            alt="broadcast"
                                            style={{ marginRight: "5px" }}
                                        />
                                        <span className="ms-1">Boradcast</span>
                                    </button>
                                )}


                                {privileges.includes('inperson-clone') && (
                                    <button
                                        className="btn text-primary"
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/account/inperson/new/" + inpersonClass?.account_id,
                                                {
                                                    state: {
                                                        inpersonId: inpersonClass?.class_id,
                                                    },
                                                }
                                            )
                                        }
                                    >
                                        <img
                                            src="/clone.svg"
                                            alt="clone"
                                            style={{ marginRight: "5px" }}
                                        />
                                        <span className="ms-1">Clone</span>
                                    </button>
                                )}

                            </div>
                        </div>

                        {/* InstructorCourseModal */}
                        <InstructorCourseModal
                            ShowModal={instructorCourseModal}
                            SetShowModal={setInstructorCourseModal}
                            inpersonCourseName={inpersonClass?.course_name}
                            inpersonCourseId={inpersonClass?.course}
                            instructorNeeded={inpersonClass?.instructors_needed}
                            allInstructors={allInstructors}
                        />

                        {/* broadcast model */}
                        <BroadcastModal
                            ShowModal={broadCastModal}
                            SetShowModal={setBroadCastModal}
                            inpersonCourseName={inpersonClass?.course_name}
                            inpersonCourseId={inpersonClass?.course}
                            allInstructors={allInstructors}
                            instructorNeeded={inpersonClass?.instructors_needed}
                        />

                        {/* tabs */}
                        <Box className="bg-primary my-3">
                            <div className="d-flex border-bottom border-secondary">
                                {Object.values(filteredTabs).map((tabItem, i) => (
                                    <div
                                        role="button"
                                        key={i}
                                        className={"text-light py-2 px-3"}
                                        style={{
                                            backgroundColor: `${tabItem === currentTab ? "#26AEE0" : "#0C71C3"
                                                }`,
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
                            <Details assignedInstructors={assignedInstructors} />
                        )}

                        {/* Details */}
                        {filteredTabs.hasOwnProperty('Students') && currentTab === filteredTabs.Students && <Students />}

                        {/* Details */}
                        {filteredTabs.hasOwnProperty('Certifications') && currentTab === filteredTabs.Certifications && <Certifications />}

                        {filteredTabs.hasOwnProperty('Notes') && currentTab === filteredTabs.Notes && <InpersonNotes />}

                        {/* InpersonNotes */}
                    </div>
                </div>
                <div className="floating-menu-btn d-flex flex-column gap-2">
                    {isOpen && (
                        <>
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
                            // onClick={documentRedirect}
                            />

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
                            // onClick={supportRedirect}
                            />

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
            </>)}
        </div>
    );
}

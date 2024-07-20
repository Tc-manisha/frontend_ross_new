import React, { useState } from "react";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { InpersonTab } from "../../../utils";
import Details from "./tabs/Details";
import Students from "./tabs/Students";
import Certifications from "./tabs/Certifications";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import BroadcastModal from "../../../components/modals/BroadcastModal/BroadcastModal";
import InstructorCourseModal from "../../../components/modals/InstructorCourseModal/InstructorCourseModal";
import { useEffect } from "react";
import {
  DecryptToken,
  GetAssignedBroadcastInstructors,
  GetAssignedInstructorsByClass,
  GetClassContactsByAddressAndCert,
} from "../../../helper/BasicFn";
import { CallGETAPINEW, CallPOSTAPINEW } from "../../../helper/API";
import { Dropdown } from "react-bootstrap";
import InpersonNotes from "./tabs/InpersonNotes";
import Loading from "../Loading";
import NewDropdown from "../../../userPages/userComp/NewDropdown";
import { addItem } from "../../../redux/slices/BreadCrumbsSlice";
import { useDispatch, useSelector } from "react-redux";
import { getPermission } from "../../../helper/Common";
import { isSubAdminPermission, isUserPermission } from "../../../helper/permission";

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

export default function InpersonDetails() {
  const [currentTab, setCurrentTab] = useState(InpersonTab.Details);
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
  const [uniqueClassID, setUniqueClassID] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const user = DecryptToken();
  const privilege = getPermission();

  const handleClose = () => setOpen(false);
  const { inpersonId } = useParams();
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
      setUniqueClassID(inpersonData?.data?.data.inpersonClass);
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

  const supportRedirect = () => {
    const stateData = {
      type: "Account",
      site_id: 0,
      accountId: accountId ? accountId : 0,
      contactId: 0,
      accountName: "",
      support_name: "",
    };

    navigate("/account/new-support/" + accountId, { state: stateData });
  };

  const documentRedirect = () => {
    navigate("/account-document-upload", {
      state: {
        type: "account",
        accountId,
        siteId: "",
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

  const breadcrumbs = useSelector((state) => state.BreadCrumbs.items); // Accessing breadcrumbs from Redux store state

  const handleHoverFloating = () => {
    setIsOpen(true);
  };

  const handleLeaveFloating = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {loading ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ) : (
        <>
          <div className="" style={{ paddingInline: "45px" }}>
            <div className="sub-heading-top mt-3">
              <SubHeadingOther
                title={"Class: " + uniqueClassID.unique_class_id}
                hideNew={"tab"}
                hideHierarchy={true}
                hideInstructor={true}
                subHeading={true}
                breadcrumbs={breadcrumbs}
              />

              {/* <SubHeading hideNew='tab' title={ 'Account : ' + accountDetails?.account_name } newUrl="/new-account" subHeading={ true } hideHierarchy={ accountDetails?.parent_account != '' && accountDetails?.parent_account != 0 ? false : true } editUrl={ '/account/accounts-edit/' + inpersonClass?.account_id } outsideClickEvent={ outsideClick } /> */}
              {/* bottom buttons */}

              <div
                className="d-flex"
                style={{ justifyContent: "space-between" }}
              >
                <div className="d-flex">
                  {(user?.user_type == 0 ||
                    (user?.user_type === 2 &&
                      user?.sub_admin != "" &&
                      privilege?.includes("edit-inperson"))) && (
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

                  <button
                    className="btn text-primary"
                    type="button"
                    onClick={() =>
                      navigate(
                        "/account/inperson/new/" + inpersonClass?.account_id
                      )
                    }
                  >
                    <img
                      src="/add.svg"
                      alt="New"
                      style={{ marginRight: "5px" }}
                    />
                    <span className="ms-1">New</span>
                  </button>

                  {(user?.user_type == 0 ||
                    (user?.user_type === 2 &&
                      user?.sub_admin != "" &&
                      privilege?.includes("inperson-instructor"))) && (
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

                  {(user?.user_type == 0 ||
                    (user?.user_type === 2 &&
                      user?.sub_admin != "" &&
                      privilege?.includes("inperson-broadcast"))) && (
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
                      <span className="ms-1">Broadcast</span>
                    </button>
                  )}

                  {(user?.user_type == 0 ||
                    (user?.user_type === 2 &&
                      user?.sub_admin != "" &&
                      privilege?.includes("inperson-clone"))) && (
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
                setAllInstructors={setAllInstructors}
                instructorNeeded={inpersonClass?.instructors_needed}
              />

              {/* tabs */}
              <Box className="bg-primary my-3">
                <div className="d-flex border-bottom border-secondary">
                  {Object.values(InpersonTab).map(
                    (tabItem, i) =>
                      (user?.user_type === 0 ||
                        (tabItem === "Details" &&
                          user?.user_type === 2 &&
                          privilege?.includes("inperson-details")) ||
                        (tabItem === "Students" &&
                          user?.user_type === 2 &&
                          privilege?.includes("inperson-student-tab")) ||
                        (tabItem === "Certifications" &&
                          user?.user_type === 2 &&
                          privilege?.includes("inperson-certification-tab")) ||
                        (tabItem === "Notes" &&
                          user?.user_type === 2 &&
                          privilege?.includes("notes-tab"))) && (
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
                      )
                  )}
                </div>
              </Box>

              {/* Details */}
              {currentTab === InpersonTab.Details && (
                <Details assignedInstructors={assignedInstructors} />
              )}

              {/* Details */}
              {currentTab === InpersonTab.Students && <Students />}

              {/* Details */}
              {currentTab === InpersonTab.Certifications && <Certifications />}

              {currentTab === InpersonTab.Notes && <InpersonNotes />}

              {/* InpersonNotes */}
            </div>
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
                    // onClick={documentRedirect}
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
                    // onClick={supportRedirect}
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
    </div>
  );
}

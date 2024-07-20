import React, { useState } from "react";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { InpersonTab, UsersInpersonTab } from "../../../utils";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import BroadcastModal from "../../../components/modals/BroadcastModal/BroadcastModal";
import InstructorCourseModal from "../../../components/modals/InstructorCourseModal/InstructorCourseModal";
import { useEffect } from "react";
import {
  GetAssignedBroadcastInstructors,
  GetAssignedInstructorsByClass,
  GetClassContactsByAddressAndCert,
} from "../../../helper/BasicFn";
import { CallGETAPINEW, CallPOSTAPINEW } from "../../../helper/API";
import { Dropdown } from "react-bootstrap";
import NewDropdown from "../NewDropdown";
import { addItem } from "../../../redux/slices/BreadCrumbsSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../pages/accounts/Loading";
import Details from "./Details";
import InpersonNotes from "./Notes";
import { getPermission } from "../../../helper/Common";

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
  const [currentTab, setCurrentTab] = useState(UsersInpersonTab.Details);
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

  useEffect(() => {
    const state = location?.state;
    const type = state ? state?.type : null;
    dispatch(
      addItem({ title: type, path: location?.pathname, tab: currentTab })
    );
  }, [currentTab]);

  const breadcrumbs = useSelector((state) => state.BreadCrumbs.items); // Accessing breadcrumbs from Redux store state

  const privileges = getPermission();

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
                  {privileges?.includes("edit-inperson") && (
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

                  {privileges?.includes("new-inperson") && (
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
                  )}

                  {privileges?.includes("inperson-instructor") && (
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

                  {privileges?.includes("inperson-broadcast") && (
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

                  {privileges?.includes("inperson-clone") && (
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
                  {Object.values(UsersInpersonTab).map((tabItem, i) => (
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
                  ))}
                </div>
              </Box>

              {/* Details */}
              {currentTab === InpersonTab.Details && (
                <Details assignedInstructors={assignedInstructors} />
              )}

              {/* Details */}
              {/* {currentTab === InpersonTab.Students && <Students />} */}

              {/* Details */}
              {/* {currentTab === InpersonTab.Certifications && <Certifications />} */}

              {currentTab === InpersonTab.Notes && (
                <InpersonNotes accountId={accountId} />
              )}

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
        </>
      )}
    </div>
  );
}

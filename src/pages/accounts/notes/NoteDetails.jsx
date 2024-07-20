import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import Container from "react-bootstrap/Container";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { CallGETAPI } from "../../../helper/API";
import { FormatDateWithTime, GetProfile, getPermission } from "../../../helper/Common";
import Loading from "../Loading";
import { addItem } from "../../../redux/slices/BreadCrumbsSlice";
import { useDispatch, useSelector } from "react-redux";

export default function NoteDetails() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [NotesData, setNotesData] = React.useState([]);
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addItem({title:'Notes', path: location?.pathname, tab:"" }));
  },[])

  const breadcrumbs = useSelector(state => state.BreadCrumbs.items); // Accessing breadcrumbs from Redux store state


  const handleNotesChange = (event) => {
    const newNotes = event.target.value;
    setNotes(newNotes);

    if (newNotes.length > 1500) {
      setErrorMessage("Notes cannot exceed 1500 characters.");
    } else {
      setErrorMessage("");
    }
  };

  // console.log(NotesData);
  const onLoad = async () => {
    const response = await CallGETAPI("/notes/fetch_notes_details/" + noteId);
    const data = response?.data?.data || [];
    setNotesData(data);
    setLoading(false);
  };

  React.useEffect(() => {
    onLoad();
  }, []);

  let profile = GetProfile(); //JSON.parse(localStorage.getItem("ross-profile"))
  let account_id = profile?.account_id
  let contact_id = profile?.contact_id

  let is_user = false
  let privileges = []
  if (profile.user_type > 1) {
    let permissions = getPermission();//  localStorage.getItem('permissions')
    let permissionsArr = permissions.split(',')
    privileges = permissionsArr
    is_user = true
  }


  return (
    <>
      {loading ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ) : (
        <div className="mt-4" style={{ width: "100%", paddingInline: "45px" }}>
          <diV>
            <SubHeadingOther
              title={"Note"}
              subTitle={NotesData?.title}
              newUrl=""
              editUrl={"/account/edit-note/" + noteId}
              subHeading={true}
              hideHierarchy={true}
              hideInstructor={true}
              breadcrumbs={breadcrumbs}
            />
          </diV>
          {/* heading */}
          <div className="row mb-2">
            {
              is_user === true ?
                <>
                  {privileges.includes('edit-note') && (
                    <div className="col-md-6 text-primary">
                      <button
                        className="btn text-primary"
                        type="button"
                        onClick={() => navigate(`/account/edit-note/` + noteId)}
                      >
                        <img src="/edit.svg" alt="svg" style={{ marginRight: "5px" }} />
                        <span className="ms-2">Edit</span>
                      </button>
                    </div>
                  )}
                </>
                :
                <>
                  <div className="col-md-6 text-primary">
                    <button
                      className="btn text-primary"
                      type="button"
                      onClick={() => navigate(`/account/edit-note/` + noteId)}
                    >
                      <img src="/edit.svg" alt="svg" style={{ marginRight: "5px" }} />
                      <span className="ms-2">Edit</span>
                    </button>
                  </div>
                </>
            }

            {/* <div className='col-md-6 text-danger text-end' > 
						<img src="/delete.svg" style={{width:'20px'}} /> <span >Delete</span>
					 </div> */}
          </div>

          <Box className="text-left pt-1 pb-1">
            <h4 className="heading">General Information</h4>
          </Box>

          <table className="theme-table">
            <thead>
              <tr>
                {/* <td>Notes Id</td> */}
                {/* <td>Account ID</td> */}
                {/* <td>Site ID</td> */}
                {/* <td>Contact ID</td> */}
                <td>title</td>
                {/* <td>notes</td> */}
                <td>related to</td>
                {/* <td>access</td> */}
                <td>Visibility</td>
                <td>Status</td>
              </tr>
            </thead>
            <tbody>
              {/* {NotesData.map((item)=>( */}
              <tr>
                {/* <td>{NotesData?.notes_id}</td> */}
                {/* <td>{NotesData?.account_id}</td> */}
                {/* <td>{NotesData?.site_id}</td> */}
                {/* <td>{NotesData?.contact_id}</td> */}
                <td>{NotesData?.title}</td>
                {/* <td>{NotesData?.notes}</td> */}
                <td>{NotesData?.related_to}</td>
                {/* <td>{NotesData?.access}</td> */}
                <td>{NotesData?.access}</td>
                <td>{NotesData?.active ? "Active" : "inactive"}</td>
              </tr>
              {/* ))} */}
            </tbody>
            <tbody>
              <tr className="">
                <th
                  colSpan={5}
                  className="border border-2 py-1 px-2 bg-tbl-border"
                >
                  Notes{" "}
                </th>
              </tr>
              <tr className="" style={{ overflowWrap: "break-word" }}>
                <td
                  colSpan={7}
                  className="border border-2 px-2"
                  value={notes}
                  onChange={handleNotesChange}
                  style={{ maxWidth: "500px", overflowWrap: "break-word" }}
                >
                  {NotesData?.notes}
                  {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: "96px", paddingBottom: "20px" }}>
            <Box className="d-flex justify-content-evenly ">
              <span>
                Created Date: {FormatDateWithTime(NotesData?.created_date)}
              </span>
              <span>Created By: {NotesData?.created_by}</span>
              <span>
                Modified Date: {FormatDateWithTime(NotesData?.modified_date)}{" "}
              </span>
              <span>Modified By: {NotesData?.modified_by}</span>
              {/* <span>Last Touch Date: </span> */}
            </Box>
          </div>
        </div>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import React from "react";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import { Link, useNavigate, useParams } from "react-router-dom";
import TableSkeleton from "../../../pages/accounts/skeleton/table/TableSkeleton";
import { CallGETAPI } from "../../../helper/API";
import { FormatDateWithTime, userNotesTabData } from "../../../helper/Common";
import New from "../../../img/New.png";
import { isUserPermission } from "../../../helper/permission";

export default function NoteListing({
  account_id,
  site_id = 0,
  contact_id,
  type = "ACCOUNT",
  inperson_id = 0,
  privileges,
}) {
  const { userAccountId } = useParams();
  const navigate = useNavigate();

  let redirectUrl = `/account/new-note?account_id=${account_id}`;
  if (type === "CONTACT") {
    redirectUrl = `/account/new-note?account_id=${account_id}&contact_id=${contact_id}`;
  }
  if (type === "SITE") {
    redirectUrl = `/account/new-note?account_id=${account_id}&site_id=${site_id}`;
  }
  if (type === "INPERSON") {
    redirectUrl = `/account/new-note?account_id=${account_id}&inperson_id=${inperson_id}`;
  }
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      // let sendUrl = 'notes/account-notes/' + account_id;
      // let sendUrl = 'user/notes-list';
      if (type === "CONTACT") {
        sendUrl = `notes/contact-notes?account_id=${account_id}&contact_id=${contact_id}`;
      }
      if (type === "SITE") {
        sendUrl = `notes/site-notes?account_id=${account_id}&site_id=${site_id}`;
      }
      if (type === "INPERSON") {
        sendUrl = `notes/inperson-notes?account_id=${account_id}&inperson_id=${inperson_id}`;
      }
      // let response = await CallGETAPI(sendUrl);
      // let resultData = response?.data?.data || [];
      let resultData = await userNotesTabData(userAccountId);
      // const updatedData = resultData.slice(1);

      setNotesData(resultData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleStatus = (e) => {
    if (e.value) {
      return <span className="text-left text-success">Active</span>;
    } else {
      return <span className="text-left">Deactive</span>;
    }
  };
  let is_note_details = false;
  let permissions = localStorage.getItem("permissions");
  let permissionsArr = permissions.split(",");
  if (permissionsArr.includes("note-details")) {
    is_note_details = true;
  }
  const handleRender = (e) => {
    return (
      <span
        className={isUserPermission("note-details") == 1 ? "link" : ""}
        onClick={() =>
          isUserPermission("note-details") == 1 &&
          navigate(`/account/note/${e.data.notes_id}`)
        }
      >
        {e.value}
      </span>
    );
  };

  const handleDateRender = (e) => {
    return FormatDateWithTime(e.value);
  };

  return (
    <div className="relative" style={{ marginBottom: "5%" }}>
      <Box className="d-flex justify-content-between align-items-center py-2">
        <h3 className="heading">{""}</h3>
        <div style={{ display: "flex", flexDirection: "row", gap: "2px" }}>
          {privileges.includes("new-note") && (
            <button
              className="btn text-primary"
              type="button"
              style={{
                display: "flex",
                width: "100%",
                alignContent: "flex-end",
              }}
              onClick={() => navigate(redirectUrl)}
            >
              <img src={New} style={{ marginRight: "5px" }} />
              <span className="ms-1">New </span>
            </button>
          )}
        </div>
      </Box>
      {/* data grid table */}
      <div className="data-table pb-3">
        {!loading ? (
          <>
            <DataGrid
              dataSource={notesData}
              // height={ 250 }
              keyExpr={"notes_id"}
              showColumnLines={true}
              showRowLines={true}
              showBorders={false}
              rowAlternationEnabled={true}
            >
              <Column
                dataField="title"
                cssClass="column-header"
                cellRender={(e) => handleRender(e)}
              />
              <Column dataField="related_to" cssClass="column-header" />
              <Column
                dataField="created_date"
                cssClass="column-header"
                cellRender={handleDateRender}
              />
              <Column dataField="created_by" cssClass="column-header" />
              <Column dataField="access" cssClass="column-header" />
              {/* <Column
							dataField="active"
							width={130}
							cssClass="column-header"
							dataType={'string'}
							cellRender={handleStatus}
						/> */}
              <Scrolling columnRenderingMode="virtual" />
              <Paging enabled={false} />
            </DataGrid>
          </>
        ) : (
          <>
            <p>{loading}</p>
            <div style={{ padding: 0 }}>
              <TableSkeleton />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

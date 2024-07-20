import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
// import "./table.css";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CallGETAPI } from "../../../helper/API";
import {
  getPermission,
  prepareOptions,
  userSupportTabData,
} from "../../../helper/Common";
import Moment from "react-moment";
import TableSkeleton from "../../../pages/accounts/skeleton/table/TableSkeleton";
import New from "../../../img/New.png";
import { isUserPermission } from "../../../helper/permission";

export default function Support({ account_id, stateData = {} }) {
  // const {  } = useParams();
  // const mainAccountId = accountId || account_id;
  const navigate = useNavigate();
  const [supportList, setSupportList] = useState([]);
  const [issueTypeList, setIssueTypeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const privilages = getPermission();
  // get support list
  const getSupportList = async (e) => {
    try {
      const issueTypeResult = await CallGETAPI("support/all-issues-type");
      console.log("issueTypeResult: " + issueTypeResult);

      if (issueTypeResult?.status) {
        const issueTypes = issueTypeResult?.data?.issuesList;
        const allIssueTypes = prepareOptions(
          issueTypes,
          "issue_id",
          "issue_name"
        );
        setIssueTypeList(allIssueTypes);
      }

      // get support details
      // const result = await CallGETAPI(
      //   "support/ticket-by-account/" + mainAccountId
      // );

      // if (result?.status) {
      //   const resultData = result?.data?.ticketList;
      //   setSupportList(resultData);
      // }
      let supportList = await userSupportTabData(userAccountId);
      setSupportList(supportList);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSupportList();
  }, []);

  // getStatus for table
  const getStatus = (data) => {
    return (
      <>
        {data?.status == 1 ? (
          <span className="text-danger">Active</span>
        ) : (
          <span>Completed</span>
        )}
      </>
    );
  };

  // getStatus for table
  const getIssue = (data) => {
    return (
      <>
        <span
          className={(isUserPermission("support-details") == 1) ? "link" : ""}
          onClick={() => (isUserPermission("support-details") == 1) && navigate("/account/support/" + data?.ticket_id)}
        >
          {data?.issue}
        </span>
      </>
    );
  };

  // getStatus for table
  const getIssueType = (data) => {
    const filteredIssueType = issueTypeList.find(
      (issue) => issue.value == data?.issue_type
    );
    return <>{filteredIssueType?.label}</>;
  };

  const getRelation = (data) => {
    return (
      <>
        <span>{data?.relation}</span>
      </>
    );
  };

  return (
    <div className="relative" style={{ marginBottom: "5%" }}>
      <Box className="d-flex justify-content-between align-items-center py-2">
        <h3 className="heading">{""}</h3>
        <div style={{ display: "flex", flexDirection: "row", gap: "2px" }}>
          {privilages.includes("new-support") && (
            <button
              className="btn text-primary"
              type="button"
              style={{
                display: "flex",
                width: "100%",
                alignContent: "flex-end",
              }}
              onClick={() => navigate("/account/new-support/" + account_id, { state: stateData })}
            >
              <img src={New} style={{ marginRight: "5px" }} />
              <span className="ms-1">New </span>
            </button>
          )}
        </div>
      </Box>

      {/* data grid table */}
      <div className="data-table py-4">
        {!loading ? (
          <DataGrid
            dataSource={supportList}
            keyExpr="ticket_id"
            showColumnLines={true}
            showRowLines={true}
            showBorders={false}
            rowAlternationEnabled={true}
          >
            <Paging defaultPageSize={10} defaultPageIndex={0} />
            <Column
              cellRender={(e) => getIssueType(e.data)}
              caption="Issue Type"
              cssClass="column-header"
            />
            <Column
              cellRender={(e) => getIssue(e.data)}
              caption="Issue"
              cssClass="column-header"
            />
            {/* <Column
              cellRender={(e) => getRelation(e.data)}
              caption="Relation"
              cssClass="column-header"
            /> */}
            <Column
              dataField="due_date"
              caption="Due Date"
              cssClass="column-header"
              dataType={"date"}
            />
            <Column
              dataField="created_by"
              caption="Created"
              cssClass="column-header"
            />
            <Column
              dataField="created_date"
              caption="Created Date"
              cssClass="column-header"
              dataType={"date"}
              cellRender={(data) => (
                <span>
                  <Moment
                    date={data.data.created_date}
                    format={"MM/DD/YYYY h:mm A"}
                  />
                </span>
              )}
            />
            <Column
              dataField="owner_name"
              caption="Owner"
              cssClass="column-header"
            />
            <Column
              cellRender={(e) => getStatus(e.data)}
              caption="Status"
              cssClass="column-header"
            />
            <Scrolling columnRenderingMode="virtual" />
            {/* <Paging enabled={true} /> */}
          </DataGrid>
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

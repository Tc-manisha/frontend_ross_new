import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./table.css";
import New from "../../../img/New.png";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CallGETAPI } from "../../../helper/API";
import { getPermission, prepareOptions } from "../../../helper/Common";
import Moment from "react-moment";
import TableSkeleton from "../skeleton/table/TableSkeleton";
import { DecryptToken } from "../../../helper/BasicFn";

export default function Support({ account_id,setTabTbldata, stateData = {} }) {
  const { accountId } = useParams();
  const mainAccountId = accountId || account_id;
  const navigate = useNavigate();
  const [supportList, setSupportList] = useState([]);
  const [issueTypeList, setIssueTypeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = DecryptToken();
  const privilege = getPermission();

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
      const result = await CallGETAPI(
        "support/ticket-by-account/" + mainAccountId
      );

      if (result?.status) {
        const resultData = result?.data?.ticketList;
        setSupportList(resultData);
      }

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
          className={(user?.user_type == 0 || (user?.user_type == 2 && user?.sub_admin != "" && privilege?.includes("support-details"))) ? "link" : ""}
          onClick={()=> (user?.user_type == 0 || (user?.user_type == 2 && user?.sub_admin != "" && privilege?.includes("support-details")))  && navigate("/account/support/" + data?.ticket_id)}
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

  useEffect(() => {
    if (supportList?.length > 0) {
      setTabTbldata((prev) => ({
      ...prev,
      support: true,
      }));
    }
    }, [supportList]);

  return (
    <div className="relative" style={{ marginBottom: "5%" }}>
       {(user?.user_type == 0 ||
               (user?.user_type == 2 && user?.sub_admin != "" && privilege?.includes("new-support"))) && (
      <div className="d-flex justify-content-end">
        <button
          className="btn "
          type="button"
          style={{ marginTop: "10px" }}
          onClick={() =>
            navigate("/account/new-support/" + accountId, { state: stateData })
          }
        >
          <img src={New} alt="New" style={{ marginRight: "5px" }} />
         <span style={{color:"#0C71C3"}}> New</span>
        </button>
      </div>
      )}
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
            <Column
              cellRender={(e) => getRelation(e.data)}
              caption="Relation"
              cssClass="column-header"
            />
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
            <Paging enabled={false} />
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

import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import { Link, useNavigate, useParams } from "react-router-dom";
import Moment from "react-moment";
import { getPermission, prepareOptions } from "../../../helper/Common";
import { CallGETAPI } from "../../../helper/API";
import New from "../../../img/New.png";
import { DecryptToken } from "../../../helper/BasicFn";
import TableSkeleton from "../../../pages/accounts/skeleton/table/TableSkeleton";

export default function Support({ account_id, setTabTbldata, stateData = {} }) {
  const { accountId } = useParams();
  const mainAccountId = accountId || account_id;
  const navigate = useNavigate();
  const [supportList, setSupportList] = useState();
  const [issueTypeList, setIssueTypeList] = useState();
  const { siteId } = useParams();
  const [loading, setLoading] = useState(true);
  const user = DecryptToken();
  const privilege = getPermission();

  // get support list
  const getSupportList = async (e) => {
    const issueTypeResult = await CallGETAPI("support/all-issues-type");

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
    const result = await CallGETAPI("support/ticket-by-site/" + siteId);

    if (result?.status) {
      const resultData = result?.data?.ticketList;
      setSupportList(resultData);
    }
    setLoading(false);
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
        <Link
          className="link"
          style={{ fontWeight: "bold", textDecoration: "none" }}
          to={"/account/support/" + data?.ticket_id}
        >
          {data?.issue}
        </Link>
      </>
    );
  };

  // getStatus for table
  const getIssueType = (data) => {
    const filteredIssueType = issueTypeList.find(
      (issue) => issue.value == data?.issue_type
    );
    return (
      <>
        <span>{filteredIssueType?.label}</span>
      </>
    );
  };

  const getRelation = (data) => {
    // console.log(data);
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
    <div className="relative">
      {loading && (
        <div className="" style={{ width: "100%", marginTop: "4%" }}>
          <TableSkeleton />
        </div>
      )}

      {/* data grid table */}
      {!loading && (
        <>
          <div>
            <div className="d-flex justify-content-end">
              {(user?.user_type == 0 ||
                (user?.user_type == 2 &&
                  user?.sub_admin != "" &&
                  privilege?.includes("new-support"))) && (
                <button
                  className="new-btn"
                  style={{
                    marginTop: "10px",
                    textDecoration: "none",
                    backgroundColor: "transparent",
                    border: "transparent ",
                  }}
                  onClick={() => {
                    // navigate('/account/new-support/'+mainAccountId,state);
                    navigate("/account/new-support/" + siteId, {
                      state: stateData,
                    });
                  }}
                >
                  <img src={New} />
                  New
                </button>
              )}
            </div>

            <div className="data-table py-4">
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}

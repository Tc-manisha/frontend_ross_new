import React, { useEffect, useState } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Paging,
} from "devextreme-react/data-grid";
import { Link, useNavigate } from "react-router-dom";
import Moment from "react-moment";
import Loading from "../Loading.jsx";

const SupportListTbl = ({
  tableData,
  issueTypeList,
  showLoading,
  setShowLoading,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //  const getSupportList = async (e) => {
  //   try {
  //     const issueTypeResult = await CallGETAPI('support/all-issues-type');

  //     if (issueTypeResult?.status) {
  //       const issueTypes = issueTypeResult?.data?.issuesList;
  //       const allIssueTypes = prepareOptions(issueTypes, 'issue_id', 'issue_name');
  //       setIssueTypeList(allIssueTypes);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data: ', error);
  //     setLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   getSupportList();
  // }, []);

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
    return <>{filteredIssueType?.label}</>;
  };

  const getRelation = (data) => {
    return (
      <>
        <span>{data?.relation}</span>
      </>
    );
  };

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

  return (
    <>
      {(showLoading || !tableData) ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ) : (<> 

      {/* {tableData?.length > 0 && (
        <> */}
          <DataGrid
            id="account-listing-table"
            dataSource={tableData}
            keyExpr="ticket_id"
            showBorders={true}
            // height={ 500 }
            showRowLines={true}
            columnAutoWidth={true}
            wordWrapEnabled={true}
          >
            <SearchPanel
              visible={true}
              highlightCaseSensitive={true}
              placeholder="Search by keywords..."
            />
            {/* <FilterPanel visible={true} /> */}

            {/* <HeaderFilter visible={true} /> */}
            {/* <Scrolling mode="infinite" /> */}
            <Paging defaultPageSize={20} defaultPageIndex={0} />

            <Column
              dataField="issue_type"
              caption={"Issue Type"}
              dataType="string"
              cellRender={(e) => getIssueType(e.data)}
            />

            <Column
              dataField="issue"
              dataType="string"
              caption={"Issue"}
              cellRender={(e) => getIssue(e?.data)}
              allowSorting={true}
            />
            <Column
              dataField="relation"
              dataType="string"
              caption={"Relation"}
              cellRender={(e) => getRelation(e?.data)}
              allowSorting={true}
            />
            <Column
              dataField="due_date"
              caption={"Due Date"}
              // dataType="string"
              dataType={"date"}
            />
            <Column
              dataField="created_by"
              caption={"Created"}
              //   cellRender={(e) => RenderAccParent(e.data)}
              dataType="string"
            />
            <Column
              dataField="distributon_name"
              caption={"Created Date"}
              dataType="string"
              cellRender={(data) => (
                <span>
                  <Moment
                    date={data?.created_date}
                    format={"MM/DD/YYYY h:mm A"}
                  />
                </span>
              )}
            />
            <Column
              dataField="owner_name"
              dataType="string"
              caption={"Owner"}
              // cellRender={(e) => RenderSecure(e.data)}
              allowSorting={true}
            />
            <Column
              dataField="status"
              caption={"Status"}
              dataType="string"
              cellRender={(e) => getStatus(e?.data)}
              allowSorting={true}
            />
          </DataGrid>
        </>
      )}
    </>
  );
};

export default SupportListTbl;

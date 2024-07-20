import React, { useState } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Paging,
} from "devextreme-react/data-grid";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../pages/accounts/Loading.jsx";
import { FormatDateWithTime } from "../../helper/Common.js";

const NoteListTbl = ({
  tableData,
  privileges,
  showLoading,
  setShowLoading,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // let excludedAccountTblData = tableData?.slice(1);

  // console.log(excludedAccountTblData);

  const RenderTitle = (data) => {
    return (
      <span
        onClick={() =>
          privileges?.includes("note-details") &&
          navigate(`/account/note/${data?.notes_id}`)
        }
        className={privileges?.includes("note-details") ? "link" : ""}
      >
        {data?.title}
      </span>
    );
  };

  const handleDateRender = (e) => {
    return FormatDateWithTime(e?.data?.created_date);
  };

  const handleStatus = (e) => {
    if (e?.data?.active) {
      return <span className="text-left text-success">Active</span>;
    } else {
      return <span className="text-left">Deactive</span>;
    }
  };

  const RenderAccount = () => {
    return (
      <>
        <span>{tableData ? tableData[0]?.account_name : ""}</span>
      </>
    );
  };

  return (
    <>
      {showLoading  ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ) : (
        <>
          {/* {excludedAccountTblData?.length > 0 && (<>  */}
          <DataGrid
            id="account-listing-table"
            dataSource={tableData || [] }
            keyExpr="notes_id"
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
            <Paging defaultPageSize={50} defaultPageIndex={0} />

            <Column
              dataField="title"
              caption={"Title"}
              dataType="string"
              cellRender={(e) => RenderTitle(e?.data)}
            />
            <Column
              dataField="related_to"
              caption={"Related to"}
              dataType="string"
              allowSorting={true}
            />
            <Column
              dataField="created_date"
              dataType="string"
              caption={"Created Date"}
              cellRender={(e) => handleDateRender(e)}
              allowSorting={true}
            />
            <Column
              dataField="created_by"
              caption={"Created By"}
              dataType="string"
            />
            <Column
              dataField="access"
              caption={"Access"}
              //   cellRender={(e) => RenderAccParent(e.data)}
              dataType="string"
            />
            <Column
              dataField=""
              caption={"Active"}
              dataType="string"
              cellRender={(e) => handleStatus(e)}
            />
            <Column
              dataField=""
              dataType="string"
              caption={"Account"}
              cellRender={RenderAccount}
              allowSorting={true}
            />
          </DataGrid>
        </>
      )}
    </>
  );
};

export default NoteListTbl;

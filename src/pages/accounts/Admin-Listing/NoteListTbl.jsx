import React, { useState } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Paging,
} from "devextreme-react/data-grid";
import { Link, useNavigate } from "react-router-dom";
import { FormatDateWithTime } from "../../../helper/Common.js";
import Loading from "../Loading.jsx";


const NoteListTbl = ({ tableData, showLoading, setShowLoading }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  console.log(tableData);

  const RenderTitle = (e) => {
    return (
      <span
        onClick={() =>
          navigate(`/account/note/${e?.data?.notes_id}`)
        }
        className={"link"}
      >
        {e?.data?.title}
      </span>
    );
  };

  const handleDateRender = (e) => {
    return FormatDateWithTime(e.created_date);
  };

  const handleStatus = (e) => {
    if (e?.data?.active) {
      return <span className="text-left text-success">Active</span>;
    } else {
      return <span className="text-left">Deactive</span>;
    }
  };

  return (
    <>
      {showLoading || !tableData ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ) : (
        <>
          <DataGrid
            id="account-listing-table"
            dataSource={tableData}
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
            {/* <FilterPanel visible={true} /> */}

            {/* <HeaderFilter visible={true} /> */}
            {/* <Scrolling mode="infinite" /> */}
            <Paging defaultPageSize={20} defaultPageIndex={0} />

            <Column
              dataField="title"
              caption={"Title"}
              dataType="string"
              cellRender={(e) => RenderTitle(e)}
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
              dataField="active"
              caption={"Active"}
              dataType="string"
              cellRender={(e) => handleStatus(e)}
            />
            <Column
              dataField="account_name"
              dataType="string"
              caption={"Account"}
              // cellRender={RenderAccount}
              allowSorting={true}
            />
          </DataGrid>
        </>
      )}
    </>
  );
};

export default NoteListTbl;

import React, { useState } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Paging,
} from "devextreme-react/data-grid";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading";

const SiteListTbl = ({ tableData, showLoading, setShowLoading }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const RenderAccTitle = (account) => {
    return (
      <>
        <span
          role={"button link"}
          // style={{ color: "#0C71C3", fontWeight: 600, cursor: "pointer" }}
          onClick={() => {
            // if (privileges?.includes('site-details')) {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              navigate(
                `/account/site-details/${account?.account_site_info_id}`
              );
              // , {
              //   state: {
              //     siteTitle: "Account : " + account?.account_site_info_id,
              //     editUrl: "/account/accounts-edit/" + account?.account_id,
              //     deleteUrl: "/account/accounts-delete/" + account?.account_id,
              //   },
              // });
            }, 0);
            // }
          }}
          className="link"
        >
          {account.account_site_name}
        </span>
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
      ) : (
        <>
          {(tableData && tableData?.length > 0) ? ( <>
          <DataGrid
            id="account-listing-table"
            dataSource={tableData}
            keyExpr="account_id"
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
            <Paging defaultPageSize={20} defaultPageIndex={0} />

            <Column
              dataField="account_site_name"
              caption={"Site Name"}
              dataType="string"
              cellRender={(e) => RenderAccTitle(e.data)}
            />
            <Column
              dataField="account_name"
              caption={"Account Name"}
              dataType="string"
              //   cellRender={(e) => RenderEqupment(e)}
              allowSorting={true}
            />
            <Column
              dataField="aeds"
              dataType="string"
              caption={"Equipment"}
              //   cellRender={(e) => RenderTraining(e.data)}
              allowSorting={true}
            />
            <Column
              dataField="trainingCount"
              caption={"Training"}
              dataType="string"
            />
            <Column
              dataField="account_site_poc"
              caption={"Site Poc"}
              //   cellRender={(e) => RenderAccParent(e.data)}
              dataType="string"
            />
          </DataGrid>
          </>
      ) : (<>
      <DataGrid
            id="account-listing-table"
            dataSource={tableData}
            keyExpr="account_id"
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
            <Paging defaultPageSize={10} defaultPageIndex={0} />

            <Column
              dataField="account_site_name"
              caption={"Site Name"}
              dataType="string"
              cellRender={(e) => RenderAccTitle(e.data)}
            />
            <Column
              dataField="account_name"
              caption={"Account Name"}
              dataType="string"
              //   cellRender={(e) => RenderEqupment(e)}
              allowSorting={true}
            />
            <Column
              dataField="aeds"
              dataType="string"
              caption={"Equipment"}
              //   cellRender={(e) => RenderTraining(e.data)}
              allowSorting={true}
            />
            <Column
              dataField="trainingCount"
              caption={"Training"}
              dataType="string"
            />
            <Column
              dataField="account_site_poc"
              caption={"Site Poc"}
              //   cellRender={(e) => RenderAccParent(e.data)}
              dataType="string"
            />
          </DataGrid>
       </>)}
        </>
      )}
    </>
  );
};

export default SiteListTbl;

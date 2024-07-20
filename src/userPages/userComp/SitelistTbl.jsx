import React,{ useState } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Paging,
} from "devextreme-react/data-grid";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../pages/accounts/Loading.jsx";
import { isUserPermission, linkTabsPermission } from "../../helper/permission.js";

const SiteListTbl = ({ tableData, privileges,showLoading,setShowLoading }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userPermission = ["site-details", "contact-tab", "equipment-tab", "training-tab", "inperson-tab", "notes-tab", "documents-tab"];

  const RenderAccTitle = (account) => {
    return (
      <>
        <span
          onClick={() => (linkTabsPermission(userPermission) === 1) && navigate(`/user/site-details/${account?.account_site_info_id}`)}
          className={(linkTabsPermission(userPermission) === 1) ? "link" : ""}
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
        <Paging defaultPageSize={50} defaultPageIndex={0} />

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
          caption={"Equipment"}
          dataType="string"
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
  );
};

export default SiteListTbl;

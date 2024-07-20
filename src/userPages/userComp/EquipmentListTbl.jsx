import React,{ useState } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Paging,
} from "devextreme-react/data-grid";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../pages/accounts/Loading";
import { linkTabsPermission } from "../../helper/permission";


const EquipmentListTbl = ({showLoading, tableData, privileges }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userPermission = ["aed-details", "notes-tab", "documents-tab", "support-tab"];

  const RenderAccTitle = (data) => {
    console.log(data);
    return (
      <>
          <span className={(linkTabsPermission(userPermission) === 1) ? "link" : ""}
          onClick={() =>  (linkTabsPermission(userPermission) === 1) &&
          navigate("/user/aed-details/" + data?.aed_id)}
          >
             {data?.aed_brand}
             </span>
      </>
    );
  };
  
  const RenderSerial = (data) => {
    console.log(data)
    return(<>
      <span className={(linkTabsPermission(userPermission) === 1) ? "link" : ""}
          onClick={() =>  (linkTabsPermission(userPermission) === 1) && 
          navigate("/user/aed-details/" + data?.aed_id)}
          > {data?.serial_number}</span>
    </>)
  }

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
        keyExpr="site_id"
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
        <Paging defaultPageSize={50} defaultPageIndex={0} />

        <Column
          dataField="aed_brand"
          caption={"AED brand"}
          dataType="string"
          cellRender={(e) => RenderAccTitle(e?.data)}
        />
        <Column
          dataField="serial_number"
          caption={"Serial #"}
          dataType="string"
          cellRender={(e) => RenderSerial(e?.data)}
          allowSorting={true}
        />
        <Column
          dataField="aeds"
          dataType="string"
          caption={"Last Check"}
        //   cellRender={(e) => RenderTraining(e.data)}
          allowSorting={true}
        />
        <Column
          dataField="trainingCount"
          caption={"Last Service"}
          dataType="string"
        />
        <Column
          dataField="account_site_poc"
          caption={"RMS Check"}
        //   cellRender={(e) => RenderAccParent(e.data)}
          dataType="string"
        />
        <Column
          dataField="account_name"
          caption={"Account"}
          dataType="string"
          // cellRender={(e) => RenderAccount(e.data)}
          allowSorting={true}
        />
        <Column
          dataField="site_name"
          dataType="string"
          caption={"Site"}
          // cellRender={(e) => RenderSite(e)}
          allowSorting={true}
        />
      </DataGrid>
      </>)}
    </>
  );
};

export default EquipmentListTbl;

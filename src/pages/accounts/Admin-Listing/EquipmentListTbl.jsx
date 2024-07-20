import React,{ useState } from "react";
import DataGrid, {
  Column,
  FilterRow,
  HeaderFilter,
  FilterPanel,
  FilterBuilderPopup,
  Scrolling,
  SearchPanel,
  Paging,
} from "devextreme-react/data-grid";
// import { orders } from "./data.js";
// import {
//   RenderEqupment,
//   RenderSecure,
//   RenderTraining,
// } from "../../helper/TblFn.js";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading";
// import Loading from "../../pages/accounts/Loading.jsx";

const saleAmountEditorOptions = { format: "currency", showClearButton: true };

const EquipmentListTbl = ({ tableData, showLoading, setShowLoading }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  console.log(tableData)

  // const RenderAccTitle = (account) => {
  //   console.log(account)
  //   return (
  //     <>
  //       {/* <span
  //         role={"button link"}
  //         style={{ color: "#0C71C3", fontWeight: 600, cursor: "pointer" }}
  //         onClick={() => {
  //           setLoading(true)
  //           setTimeout(() => {
  //           setLoading(false)
  //           navigate(`/user/site-details/${account?.account_id}`, {
  //             state: {
  //               siteTitle: "Account : " + account?.account_name,
  //               editUrl: "/account/accounts-edit/" + account?.account_id,
  //               deleteUrl: "/account/accounts-delete/" + account?.account_id,
  //             },
  //           });
  //         },0)
  //         }}
  //       >
  //         {account.account_site_name}
  //       </span> */}
  //       <span> {account[0].brand_name} </span>
  //     </>
  //   );
  // };

  const RenderAccTitle = (data) => {
    console.log(data);
    return (
      <>
        {/* {account.map((item, index) => (
          <span className="link" 
          onClick={() => navigate("/user/aed-details/" + item?.aed_id)}
          key={index}>
            {item.brand_name}
            <br />
          </span>
        ))} */}
          <span className="link"
          onClick={() => navigate("/account/aed-details/" + data?.aed_id)}
          >
             {data?.aed_brand}
             </span>
      </>
    );
  };
  
  

  const RenderSerial = (data) => {
    console.log(data)
    return(<>
     {/* {data.map((item, index) => (
          <span  onClick={() => navigate("/user/aed-details/" + item?.aed_id)
     }
            className="link" key={index}>{item.serial_number}<br /></span>
        ))} */}
        <span className="link"
          onClick={() => navigate("/user/aed-details/" + data?.aed_id)}
          > {data?.serial_number}</span>
    </>)
  }
 
  const RenderAccount = (data) => {
    return(<>
     {/* <span> {data[0].serial_number} </span> */}
    </>)
  }

  const RenderSite = (e) => {
    console.log(e);
    const siteName = tableData?.data?.site_name;
    const site = e?.data?.data;
    console.log(siteName);
    return(<>
    {site.map((item, index) => (
          <span key={index}>{siteName}<br /></span>
        ))}
    </>)
  }

  const RenderAccParent = (account) => {
    return (
      <>
        <span
          role={"button link"}
          style={{ color: "#0C71C3", fontWeight: 600, cursor: "pointer" }}
          onClick={() => {
            navigate(`/account-details/${account?.parent_account_id}`, {
              state: {
                siteTitle: "Account : " + account?.parent_name,
                editUrl: "/account/accounts-edit/" + account?.parent_account_id,
                deleteUrl:
                  "/account/accounts-delete/" + account?.parent_account_id,
              },
            });
          }}
        >
          {account.parent_name}
        </span>
      </>
    );
  };
  const RenderDistributer = (account) => {
    return (
      <>
        <span
          role={"button link"}
          style={{ color: "#0C71C3", fontWeight: 600, cursor: "pointer" }}
          onClick={() => {
            navigate(`/account-details/${account?.distributor_id}`, {
              state: {
                siteTitle: "Account : " + account?.distributon_name,
                editUrl: "/account/accounts-edit/" + account?.distributor_id,
                deleteUrl:
                  "/account/accounts-delete/" + account?.distributor_id,
              },
            });
          }}
        >
          {account.distributon_name}
        </span>
      </>
    );
  };
  return (
    <>
     {(showLoading || !tableData ) ? (
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
        <Paging defaultPageSize={20} defaultPageIndex={0} />

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
          width={200}
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

/* class AccountTbl extends React.Component {
  render() {
    return (
      <DataGrid
        id="gridContainer"
        columnsAutoWidth="true"
        // filterBuilder={filterBuilder}
        // defaultFilterValue={filterValue}
        dataSource={orders}
        keyExpr="ID"
        showBorders={true}
      >
        <FilterRow visible={true} />
        <FilterPanel visible={true} />
         <FilterBuilderPopup position={filterBuilderPopupPosition} /> 
        <HeaderFilter visible={true} />
        <Scrolling mode="infinite" />
        <Column
          dataType="number"
          dataField="OrderNumber"
          caption="Invoice Number"
        >
          <HeaderFilter groupInterval={10000} />
        </Column>
        <Column dataField="OrderDate" dataType="date" />
        <Column
        //   editorOptions={saleAmountEditorOptions}
          dataField="SaleAmount"
          dataType="number"
          format="currency"
        >
          <HeaderFilter dataSource={saleAmountHeaderFilters} />
        </Column>
        <Column dataField="Employee" />
        <Column dataField="CustomerInfo.StoreCity" caption="City" />
        <Column dataField="CustomerInfo.StoreState" caption="State" />
      </DataGrid>
    );
  }
} */

function getOrderDay(rowData) {
  return new Date(rowData.OrderDate).getDay();
}

const filterBuilderPopupPosition = {
  of: window,
  at: "top",
  my: "top",
  offset: { y: 10 },
};

const filterBuilder = {
  customOperations: [
    {
      name: "weekends",
      caption: "Weekends",
      dataTypes: ["date"],
      icon: "check",
      hasValue: false,
      calculateFilterExpression: () => [
        [getOrderDay, "=", 0],
        "or",
        [getOrderDay, "=", 6],
      ],
    },
  ],
  allowHierarchicalFields: true,
};

const filterValue = [
  ["Employee", "=", "Clark Morgan"],
  "and",
  ["OrderDate", "weekends"],
];

const saleAmountHeaderFilters = [
  {
    text: "Less than $3000",
    value: ["SaleAmount", "<", 3000],
  },
  {
    text: "$3000 - $5000",
    value: [
      ["SaleAmount", ">=", 3000],
      ["SaleAmount", "<", 5000],
    ],
  },
  {
    text: "$5000 - $10000",
    value: [
      ["SaleAmount", ">=", 5000],
      ["SaleAmount", "<", 10000],
    ],
  },
  {
    text: "$10000 - $20000",
    value: [
      ["SaleAmount", ">=", 10000],
      ["SaleAmount", "<", 20000],
    ],
  },
  {
    text: "Greater than $20000",
    value: ["SaleAmount", ">=", 20000],
  },
];

export default EquipmentListTbl;

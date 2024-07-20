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
import {
  RenderEqupment,
  RenderSecure,
  RenderTraining,
} from "../../helper/TblFn.js";
import { Link, useNavigate } from "react-router-dom";
// import Loading from "../../pages/accounts/Loading.jsx";
import { useSelector } from "react-redux";
import { getPermission } from "../../helper/Common.js";
import Loading from "../../pages/accounts/Loading.jsx";

const saleAmountEditorOptions = { format: "currency", showClearButton: true };

const AccountListTbl = ({showLoading, tableData,  setUserAccountId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const filterData = useSelector((state) => state.accountlistfilter.filterData);

  const privileges = getPermission();
 

  // const RenderAccTitle = (account) => {
  //   console.log(account);
  //   console.log(account?.data?.account_id);
  //   return (
  //     <>
  //       <span
  //         role={"button link"}
  //         onClick={() => {
  //           if (privileges?.includes('account-details')) {
  //             // setLoading(true);
  //             // setTimeout(() => {
  //               // setLoading(false);
  //               navigate(`/user/Details/${account?.data?.account_id}`);
  //               // , {
  //               //   state: {
  //               //     siteTitle: "Account : " + account?.account_site_info_id,
  //               //     editUrl: "/account/accounts-edit/" + account?.account_id,
  //               //     deleteUrl: "/account/accounts-delete/" + account?.account_id,
  //               //   },
  //               // });
  //             // }, 0);
  //           }
  //         }}
  //          className={privileges?.includes('account-details') ? "link" : ""}
  //         >
  //         {account?.data?.account_name}
  //       </span>
  //     </>
  //   );
  // };

  const RenderAccTitle = (account) => {
    console.log(account);
    console.log(account?.data?.account_id);
    const selectedAccountId = account?.data?.account_id;
    return (
      <span
        role={"button link"}
        onClick={() => {
          privileges?.includes('account-details') ? navigate("/user/Details/" +selectedAccountId) :
          privileges.includes("site-tab") ? navigate("/user/Sites/" +selectedAccountId) :
          privileges.includes("contact-tab") ? navigate("/user/Contacts/" +selectedAccountId) :
          privileges.includes("equipment-tab") ? navigate("/user/Equipment/" +selectedAccountId) :
          privileges.includes("notes-tab") ? navigate("/user/Notes/" +selectedAccountId) :
          privileges.includes("support-tab") ? navigate("/user/Support/" +selectedAccountId) :
          privileges.includes("training-tab") ? navigate("/user/Training/" +selectedAccountId) : 
          privileges.includes("email-tab") ? navigate("/user/Emails/" +selectedAccountId) : 
          privileges.includes("documents-tab") ? navigate("/user/Documents/" +selectedAccountId) : 
          privileges.includes("rfi-tab") ? navigate("/user/RFI/" +selectedAccountId) : "";
            // setUserAccountId(account?.data?.account_id);
            // navigate(`/user/Sites/${account?.data?.account_id}`);
          }
        }
        className="link"
      >
        {account?.data?.account_name}
      </span>
    );
  };



  const RenderAccParent = (account) => {
    return (
      <>
        <Link
          to={{
            pathname: `/account-details/${account.parent_account_id}`,
            state: {
              siteTitle: "Account : " + account?.parent_name,
              editUrl: "/account/accounts-edit/" + account?.parent_account_id,
              deleteUrl:
                "/account/accounts-delete/" + account?.parent_account_id,
            }
          }}
          role={"button link"}
          style={{ color: "#0C71C3", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}
          // onClick={() => {
          //   e.preventDefault();
          //   navigate(`/account-details/${account?.parent_account_id}`, {
          //     state: {
          //       siteTitle: "Account : " + account?.parent_name,
          //       editUrl: "/account/accounts-edit/" + account?.parent_account_id,
          //       deleteUrl:
          //         "/account/accounts-delete/" + account?.parent_account_id,
          //     },
          //   });
          // }}
        >
          {account.parent_name}
        </Link>
      </>
    );
  };
  const RenderDistributer = (account) => {
    return (
      <>
        <Link
          to={{
            pathname: `/account-details/${account.distributor_id}`,
            state: {
              siteTitle: "Account : " + account?.distributon_name,
                editUrl: "/account/accounts-edit/" + account?.distributor_id,
                deleteUrl:
                  "/account/accounts-delete/" + account?.distributor_id,
            }
          }}
          role={"button link"}
          style={{ color: "#0C71C3", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}
          // onClick={() => {
          //   e.preventDefault();
          //   navigate(`/account-details/${account?.distributor_id}`, {
          //     state: {
          //       siteTitle: "Account : " + account?.distributon_name,
          //       editUrl: "/account/accounts-edit/" + account?.distributor_id,
          //       deleteUrl:
          //         "/account/accounts-delete/" + account?.distributor_id,
          //     },
          //   });
          // }}
        >
          {account.distributon_name}
        </Link>
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
        {/* <FilterPanel visible={true} /> */}

        {/* <HeaderFilter visible={true} /> */}
        {/* <Scrolling mode="infinite" /> */}
        <Paging defaultPageSize={50} defaultPageIndex={0} />

        <Column
          dataField="account_name"
          caption={"Accounts"}
          dataType="string"
          // cellRender={(e) => RenderAccTitle(e.data), setUserAccountId(e.data.account_id)}
          cellRender={(e) => RenderAccTitle(e)}
        />
        <Column
          dataField="equipment"
          caption={"Equipment"}
          dataType="string"
          cellRender={(e) => RenderEqupment(e.data)}
          allowSorting={false}
        />
        <Column
          dataField="trainning"
          caption={"Trainning"}
          dataType="string"
          cellRender={(e) => RenderTraining(e.data)}
          allowSorting={false}
        />
        <Column
          dataField="customer_type_name"
          caption={"Customer Type"}
          dataType="string"
        />
        <Column
          dataField="parent_name"
          caption={"Parent"}
          // cellRender={(e) => RenderAccParent(e.data)}
          dataType="string"
        />
        <Column
          dataField="distributon_name"
          caption={"Distributor"}
          dataType="string"
          // cellRender={(e) => RenderDistributer(e.data)}
        />
        <Column dataField="owner" dataType="string" caption={"Owner"} />
        <Column
          dataField="isSecure"
          dataType="string"
          caption={"Restricted"}
          cellRender={(e) => RenderSecure(e.data)}
          allowSorting={false}
        />
      </DataGrid>
      </>)}
    </>
  );
};


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

export default AccountListTbl;

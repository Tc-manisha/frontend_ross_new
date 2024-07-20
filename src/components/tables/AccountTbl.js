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
import { orders } from "./data.js";
import {
  RenderEqupment,
  RenderSecure,
  RenderTraining,
} from "../../helper/TblFn.js";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../pages/accounts/Loading.jsx";
import { useSelector } from "react-redux";
import { DecryptToken } from "../../helper/BasicFn.js";
import { getPermission } from "../../helper/Common.js";

const saleAmountEditorOptions = { format: "currency", showClearButton: true };

const AccountTbl = ({ tableData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const filterData = useSelector((state) => state.accountlistfilter.filterData);
  const user = DecryptToken();
  const privilege = getPermission();

  const RenderAccTitle = (account) => {
    return (
      <>
        {/* <Link
          to={{
            pathname: `/account-details/${account.account_id}`,
            state: {
              siteTitle: "Account : " + account?.account_name,
                editUrl: "/account/accounts-edit/" + account?.account_id,
                deleteUrl: "/account/accounts-delete/" + account?.account_id,
            }
          }}
        href={`/account-details/${account?.account_id}`}
       
          role={"button link"}
          style={{ color: "#0C71C3", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}
        >
          {account.account_name}
        </Link> */}

                  <span
                  className={(user?.user_type == 0 || (user?.user_type == 2 && user?.sub_admin != "" &&
                     (privilege?.includes("account-details") || 
                     privilege?.includes("site-tab") ||
                     privilege?.includes("contact-tab") ||
                     privilege?.includes("equipment-tab") ||
                     privilege?.includes("training-tab") ||
                     privilege?.includes("inperson-tab") ||
                     privilege?.includes("pops-tab") ||
                     privilege?.includes("notes-tab") ||
                     privilege?.includes("support-tab") ||
                     privilege?.includes("email-tab") ||
                     privilege?.includes("documents-tab") ||
                     privilege?.includes("rfi-tab") 

                    ))) ?
                   "link" : ""}
                    onClick={() => (user?.user_type == 0 || (user?.user_type == 2 && user?.sub_admin != "" && 
                      (privilege?.includes("account-details") || 
                      privilege?.includes("site-tab") ||
                      privilege?.includes("contact-tab") ||
                      privilege?.includes("equipment-tab") ||
                      privilege?.includes("training-tab") ||
                      privilege?.includes("inperson-tab") ||
                      privilege?.includes("pops-tab") ||
                      privilege?.includes("notes-tab") ||
                      privilege?.includes("support-tab") ||
                      privilege?.includes("email-tab") ||
                      privilege?.includes("documents-tab") ||
                      privilege?.includes("rfi-tab") 
 
                     ))) &&
                      navigate(`/account-details/${account.account_id}`, {
                      state: {
                        siteTitle: "Account: " + account?.account_name,
                        editUrl: `/account/accounts-edit/${account?.account_id}`,
                        deleteUrl: `/account/accounts-delete/${account?.account_id}`,
                      }
                    })}
                    role="button"
                  >
                    {account.account_name}
                  </span>

      </>
    );
  };

  const RenderAccParent = (account) => {
    return (
      <>
        <span
                  className={(user?.user_type == 0 || (user?.user_type == 2 && user?.sub_admin != "" &&
                     (privilege?.includes("account-details") || 
                     privilege?.includes("site-tab") ||
                     privilege?.includes("contact-tab") ||
                     privilege?.includes("equipment-tab") ||
                     privilege?.includes("training-tab") ||
                     privilege?.includes("inperson-tab") ||
                     privilege?.includes("pops-tab") ||
                     privilege?.includes("notes-tab") ||
                     privilege?.includes("support-tab") ||
                     privilege?.includes("email-tab") ||
                     privilege?.includes("documents-tab") ||
                     privilege?.includes("rfi-tab") 

                    ))) ?
                   "link" : ""}
                    onClick={() => (user?.user_type == 0 || (user?.user_type == 2 && user?.sub_admin != "" && 
                      (privilege?.includes("account-details") || 
                      privilege?.includes("site-tab") ||
                      privilege?.includes("contact-tab") ||
                      privilege?.includes("equipment-tab") ||
                      privilege?.includes("training-tab") ||
                      privilege?.includes("inperson-tab") ||
                      privilege?.includes("pops-tab") ||
                      privilege?.includes("notes-tab") ||
                      privilege?.includes("support-tab") ||
                      privilege?.includes("email-tab") ||
                      privilege?.includes("documents-tab") ||
                      privilege?.includes("rfi-tab") 
 
                     ))) &&
                      navigate(`/account-details/${account.account_id}`, {
                      state: {
                        siteTitle: "Account: " + account?.account_name,
                        editUrl: `/account/accounts-edit/${account?.account_id}`,
                        deleteUrl: `/account/accounts-delete/${account?.account_id}`,
                      }
                    })}
                    role="button"
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
                  className={(user?.user_type == 0 || (user?.user_type == 2 && user?.sub_admin != "" &&
                     (privilege?.includes("account-details") || 
                     privilege?.includes("site-tab") ||
                     privilege?.includes("contact-tab") ||
                     privilege?.includes("equipment-tab") ||
                     privilege?.includes("training-tab") ||
                     privilege?.includes("inperson-tab") ||
                     privilege?.includes("pops-tab") ||
                     privilege?.includes("notes-tab") ||
                     privilege?.includes("support-tab") ||
                     privilege?.includes("email-tab") ||
                     privilege?.includes("documents-tab") ||
                     privilege?.includes("rfi-tab") 

                    ))) ?
                   "link" : ""}
                    onClick={() => (user?.user_type == 0 || (user?.user_type == 2 && user?.sub_admin != "" && 
                      (privilege?.includes("account-details") || 
                      privilege?.includes("site-tab") ||
                      privilege?.includes("contact-tab") ||
                      privilege?.includes("equipment-tab") ||
                      privilege?.includes("training-tab") ||
                      privilege?.includes("inperson-tab") ||
                      privilege?.includes("pops-tab") ||
                      privilege?.includes("notes-tab") ||
                      privilege?.includes("support-tab") ||
                      privilege?.includes("email-tab") ||
                      privilege?.includes("documents-tab") ||
                      privilege?.includes("rfi-tab") 
 
                     ))) &&
                      navigate(`/account-details/${account.account_id}`, {
                      state: {
                        siteTitle: "Account: " + account?.account_name,
                        editUrl: `/account/accounts-edit/${account?.account_id}`,
                        deleteUrl: `/account/accounts-delete/${account?.account_id}`,
                      }
                    })}
                    role="button"
                  >
          {account.distributon_name}
        </span>
      </>
    );
  };
  return (
    <>
     {/* {loading && (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      )} */}
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
        <Paging defaultPageSize={20} defaultPageIndex={0} />

        <Column
          dataField="account_name"
          caption={"Accounts"}
          dataType="string"
          cellRender={(e) => RenderAccTitle(e.data)}
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
          cellRender={(e) => RenderAccParent(e.data)}
          dataType="string"
        />
        <Column
          dataField="distributon_name"
          caption={"Distributor"}
          dataType="string"
          cellRender={(e) => RenderDistributer(e.data)}
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

export default AccountTbl;

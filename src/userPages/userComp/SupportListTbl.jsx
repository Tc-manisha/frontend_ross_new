import React, { useState } from "react";
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
import Loading from "../../pages/accounts/Loading.jsx";
import Moment from "react-moment";
import { FormatDateWithTime } from "../../helper/Common.js";

const saleAmountEditorOptions = { format: "currency", showClearButton: true };

const SupportListTbl = ({ tableData, showLoading, setShowLoading, issueTypeList, privileges }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  console.log(tableData);
  console.log({issueTypeList})
  const RenderAccTitle = (account) => {
    return (
      <>
        <span
          role={"button link"}
          style={{ color: "#0C71C3", fontWeight: 600, cursor: "pointer" }}
          onClick={() => {
            setShowLoading(true);
            setTimeout(() => {
              setShowLoading(false);
              navigate(`/user/site-details/${account?.account_id}`, {
                state: {
                  siteTitle: "Account : " + account?.account_name,
                  editUrl: "/account/accounts-edit/" + account?.account_id,
                  deleteUrl: "/account/accounts-delete/" + account?.account_id,
                },
              });
            }, 0);
          }}
        >
          {account.account_site_name}
        </span>
      </>
    );
  };

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

  const getIssueType = (data) => {
    const filteredIssueType = issueTypeList.find(
      (issue) => issue.value == data?.issue_type
    );
    return <>{filteredIssueType?.label}</>;
  };

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

  // const getIssue = (data) => {
  //   return (
  //     <>
  //       <Link
  //         className="link"
  //         style={{ fontWeight: "bold", textDecoration: "none" }}
  //         to={"/account/support/" + data?.ticket_id}
  //       >
  //         {data?.issue}
  //       </Link>
  //     </>
  //   );
  // };

    const getIssue = (data) => {
    return (
      <span
        onClick={() =>
          privileges?.includes("support-details") &&
          navigate(`/account/support/${data?.ticket_id}`)
        }
        className={privileges?.includes("support-details") ? "link" : ""}
      >
        {data?.issue}
      </span>
    );
  };

  const handleDueDateRender = (e) => {
    return FormatDateWithTime(e?.data?.due_date);
  };

  const handleCreatedDateRender = (e) => {
    return FormatDateWithTime(e?.data?.created_date);
  }

  return (
    <>
      {showLoading ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ): (<> 
      {/* {tableData?.length > 0 && (<> */}
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
          dataField="issue_type"
          caption={"Issue Type"}
          dataType="string"
          cellRender={(e) => getIssueType(e?.data)}
        />
        <Column
          dataField="status"
          caption={"Status"}
          dataType="string"
          //   cellRender={(e) => RenderEqupment(e)}
          cellRender={(e) => getStatus(e?.data)}
          allowSorting={true}
        />
        <Column
          dataField="issue"
          dataType="string"
          caption={"Issue"}
          cellRender={(e) => getIssue(e?.data)}
          allowSorting={true}
        />
        <Column
          dataField="due_date"
          caption={"Due Date"}
          dataType="string"
          cellRender={(e) => handleDueDateRender(e)}
        />
        <Column
          dataField="created_by"
          caption={"Created"}
          //   cellRender={(e) => RenderAccParent(e.data)}
          dataType="string"
        />
        <Column
          dataField="created_date"
          caption={"Created Date"}
          dataType="string"
          cellRender={(e) => handleCreatedDateRender(e)}
        />
        <Column
          dataField="owner_name"
          dataType="string"
          caption={"Owner"}
          // cellRender={(e) => RenderSecure(e.data)}
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

export default SupportListTbl;

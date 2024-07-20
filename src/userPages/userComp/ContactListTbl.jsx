import React, { useState } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Paging,
} from "devextreme-react/data-grid";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../pages/accounts/Loading.jsx";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { ContactStatus, formatPhoneNumber } from "../../helper/Common.js";
import { DecryptToken } from "../../helper/BasicFn.js";
import { isUserPermission, linkTabsPermission } from "../../helper/permission.js";

const ContactListTbl = ({
  tableData,
  privileges,
  showLoading,
  setShowLoading,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  console.log(tableData);
  const user = DecryptToken();
  const accountId = user?.account_id;
  const userPermission = ["contact-details", "notes-tab"];

  const RenderContact = (data) => {
    console.log(data);
    return (
      <>
        <span
          onClick={() => {
            linkTabsPermission(userPermission) === 1 &&
              navigate(
                "/user/" + accountId + "/contact-details/" + data.contact_id
              );
          }}
          className={linkTabsPermission(userPermission) === 1 ? "link" : ""}
        >
          {data?.contact_name}
        </span>
      </>
    );
  };

  const RenderUser = (data) => {
    console.log(data?.data);
    return (
      <>
        {data?.data?.user ? (
          <CheckIcon color={"success"} />
        ) : (
          <CloseIcon color="error" />
        )}
      </>
    );
  };

  const RenderPhone = (phone) => {
    console.log(phone?.phone[0]?.phone);
    return (
      <>
        {phone?.phone?.[0].phone != "" && phone?.phone?.[0].phone != "-" && (
          <a
            className="link"
            style={{ textDecration: "none !important" }}
            href={"tel:" + phone?.phone?.[0].ext + phone?.phone?.[0]?.phone}
          >
            {phone?.phone?.[0].phone
              ? formatPhoneNumber(phone?.phone?.[0].phone)
              : ""}
            {phone?.phone?.[0].ext != "" ? "x" + phone?.phone?.[0].ext : ""}
          </a>
        )}
      </>
    );
  };

  const RenderEmail = (email) => {
    console.log(email?.email[0]?.email);
    return (
      <>
        {email?.email.length > 0 && (
          <a className="link" href={"mailto:" + email?.email?.[0].email}>
            {email?.email?.[0].email}
          </a>
        )}
      </>
    );
  };

  const RenderStatus = (data) => {
    return (
      <>
        <p className={data?.status == 1 ? "" : "text-danger"}>
          {ContactStatus[data?.status]}
        </p>
      </>
    );
  };
  console.log({ tableData });

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
          {/* {tableData?.length > 0 && (<>  */}
          <DataGrid
            id="account-listing-table"
            className="py-4"
            dataSource={tableData}
            keyExpr="contact_id"
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
              dataField="contact_name"
              caption={"Contact"}
              dataType="string"
              cellRender={(e) => RenderContact(e.data)}
            />
            <Column
              dataField="user"
              caption={"User"}
              dataType="string"
              cellRender={(e) => RenderUser(e)}
              allowSorting={true}
            />
            <Column
              dataField="aeds"
              dataType="string"
              caption={"Phone"}
              cellRender={(e) => RenderPhone(e.data)}
              allowSorting={true}
            />
            <Column
              dataField="email"
              caption={"Email"}
              dataType="string"
              cellRender={(e) => RenderEmail(e.data)}
            />
            <Column
              dataField="status"
              caption={"Status"}
              cellRender={(e) => RenderStatus(e.data)}
              dataType="string"
            />
            <Column
              dataField="account_name"
              caption={"Account"}
              dataType="string"
              // cellRender={(e) => RenderAccountRole(e.data)}
            />
          </DataGrid>
        </>
      )}
    </>
  );
};

export default ContactListTbl;

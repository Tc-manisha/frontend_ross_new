import React, { useState } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Paging,
} from "devextreme-react/data-grid";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { ContactStatus, GetProfile, formatPhoneNumber } from "../../../helper/Common.js";
import Loading from "../Loading.jsx";

const saleAmountEditorOptions = { format: "currency", showClearButton: true };

const ContactListTbl = ({ tableData, showLoading, setShowLoading }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  console.log(tableData);

  let userData = GetProfile();//JSON.parse(localStorage.getItem("ross-profile"));
  let account_id = userData?.account_id;

  const RenderContact = (data) => {
    console.log(data);
    return (
      <>
        <span
          onClick={
            () =>
              // .includes('contact-details') && (
                navigate("/account/" + account_id + "/contact-details/" + data.contact_id)
                // )}
            // navigate(
            //   "/account/" + accountId + "/contact-details/" + data.contact_id,
            // {
            //   state: {
            //     // siteTitle: "Contact : " + data?.contact_name,
            //     // editUrl: "/account/contact-details-edit/" + data.contact_id,
            //     deleteUrl: "/account/contact-details-edit/" + data.contact_id,
            //   },
            // }
            // )
          }
          className={"link"}
        >
          {data?.contact_name}
        </span>
      </>
    );
  };

  const RenderUser = (data) => {
    console.log(data);
    return (
      <>
        {data?.user ? (
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

  const RenderAccount = (data) => {
    return <>{data?.account_name}</>;
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
            <Paging defaultPageSize={20} defaultPageIndex={0} />

            <Column
              dataField="contact_name"
              caption={"Contact"}
              dataType="string"
              cellRender={(e) => RenderContact(e.data)}
              allowSorting={true}
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
              allowSorting={true}
            />
            <Column
              dataField="status"
              caption={"Status"}
              cellRender={(e) => RenderStatus(e.data)}
              dataType="string"
              allowSorting={true}
            />
            <Column
              dataField="account_name"
              caption={"Account"}
              dataType="string"
              allowSorting={true}
            />
          </DataGrid>
        </>
      )}
    </>
  );
};

export default ContactListTbl;

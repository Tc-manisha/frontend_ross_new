import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import { CallGETAPI } from "../../../helper/API";
import { Link, useNavigate, useParams } from "react-router-dom";
import TableSkeleton from "../../../pages/accounts/skeleton/table/TableSkeleton";

export default function Emails(accountId) {
  const [emailList, setEmailList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { siteId } = useParams();
  const accountid = accountId.accountId;

  // fetch email
  const fetchEmail = async () => {
    try {
      const result = await CallGETAPI("account/emails-by-account/" + accountid);
      
      if (result?.status) {
        const emailDataList = result?.data?.emailList;
        setEmailList(emailDataList);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  // use effect
  useEffect(() => {
    fetchEmail();
  }, []);

  // getRecipient
  const getRecipient = (data) => {
    const stateData = {
      type: "Email",
    };

    // const handleClick = () => {
    //   navigate(`/account/${accountid}/contact-details/${data?.contact_id}`, { state: stateData });
    // };

    return (
      <Link
        to={{
          pathname: `/account/${accountid}/contact-details/${data?.contact_id}`,
          state: stateData,
        }}
        className="link"
        style={{textDecoration:"none"}}
      >
        {data?.email}
      </Link>
    );
  };

  // getEmailDetails
  const getEmailDetails = (data) => {
    return (
      <>
        <Link className="link" style={{textDecoration:"none"}} to={`/account/${accountid}/email/${data?.id}`}>
          {data?.subject}
        </Link>
      </>
    );
  };

  return (
    <div className="relative" style={{ marginBottom: "5%" }}>
      {/* data grid table */}
      <div className="data-table py-4">
        {!loading ? (
          <DataGrid
            dataSource={emailList}
            keyExpr="id"
            showColumnLines={true}
            showRowLines={true}
            showBorders={false}
            rowAlternationEnabled={true}
          >
            <Column
              dataField="email"
              cellRender={(e) => getRecipient(e.data)}
              caption={"Recipient"}
              cssClass="column-header"
            />
            <Column
              dataField="subject"
              cellRender={(e) => getEmailDetails(e.data)}
              caption={"Subject"}
              cssClass="column-header"
            />
            <Column
              dataField="created_date"
              caption={"Email Date"}
              dataType={"date"}
              cssClass="column-header"
            />

            <Scrolling columnRenderingMode="virtual" />
            <Paging enabled={false} />
          </DataGrid>
        ) : (
          <>
            {loading && (
              <div className="" style={{ width: "100%", marginTop: "2%" }}>
                <TableSkeleton />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

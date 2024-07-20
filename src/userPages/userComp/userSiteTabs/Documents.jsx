import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
// import "./table.css";
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import TableSkeleton from "../../../pages/accounts/skeleton/table/TableSkeleton";
import { isUserPermission } from "../../../helper/permission";

export default function Documents(props) {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const getDateTime = (e) => {
    return moment(e?.value).format("DD-MM-YYYY hh:mm A");
  };


  const renderLink = (e) => {
    // console.log("ebent", e);
    let id = e?.data?.document_id;

    return(
       <span 
    className={isUserPermission("document-details") ? "link" : ""}
    style={{textDecoration:'none'}}
     onClick={() => isUserPermission("document-details") && navigate(`/account-document-details/${id}`)}
     >
      {e?.value}
     </span>
     )
  };
  const redirectUrl = '';

  const fetchData = async () => {

    setLoading(false);

  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="relative" style={{ marginBottom: '5%' }}>
      {loading && (
        <div style={{ padding: '3% 0' }}>
          <TableSkeleton />
        </div>
      )}

    { console.log(siteId)}

      {!loading && (
        <>
          {props?.documentData && !props?.documentData?.allAccountDocuments && (
            <>
             <Box className="text-left pt-1 pb-1 d-flex">
             <h4 className="heading">{props?.siteName} </h4>
            {props.privileges.includes("new-document") && (
             
                <span className="" style={{ marginLeft: "auto" }}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/account-document-upload", {
                        state: {
                          type: "site",
                          accountId: props?.account_id,
                          siteId: siteId,
                        },
                      });
                    }}
                    className="btn "
                  >
                    <img
                      src="/edit.svg"
                      alt="Edit"
                      style={{ marginRight: "5px" }}
                    />{" "}
                   <span style={{color:"#0C71C3"}}> New</span>
                  </button>
                </span>
             )}
            </Box>

              {/* heading */}
              {/* <Box className="text-left pt-3 pb-1">
                <h4 className="heading">{props?.siteName} CheckName</h4>
              </Box> */}

              

              {/* data grid table */}

              <div className="data-table pb-3">
                <DataGrid
                  dataSource={props?.documentData ? props?.documentData : []}
                  // height={250}
                  keyExpr="document_id"
                  showColumnLines={true}
                  showRowLines={true}
                  showBorders={false}
                  rowAlternationEnabled={true}
                >
                  <Column
                    dataField="parent_document_name"
                    caption="Document Name"
                    cssClass="column-header"
                    cellRender={renderLink}
                  />
                  <Column dataField="comment" cssClass="column-header" />
                  <Column dataField="related_to" cssClass="column-header" />
                  <Column
                    dataField="uploaded_by_name"
                    cssClass="column-header"
                    caption="Uploaded by"
                  />
                  <Column
                    dataField="createdAt"
                    cssClass="column-header"
                    caption={"Uploaded Date"}
                    cellRender={getDateTime}
                  />

                  <Scrolling columnRenderingMode="virtual" />
                  <Paging enabled={false} />
                </DataGrid>
              </div>
            </>
          )}

          {props?.documentData && props?.documentData?.allAccountDocuments && (
            <>
              {/* heading */}
              <Box className="text-left pt-3 pb-1 d-flex">
                <h4 className="heading">Account</h4>
                <span className='' style={{ marginLeft: 'auto' }}>
                  <button type="button"
                    onClick={() => {
                      navigate("/account-document-upload", {
                        state: {
                          type: "site",
                          accountId: props?.account_id,
                          siteId: siteId,
                        },
                      });
                    }}

                    className="btn "><img
                      src="/edit.svg"
                      alt="Edit"
                      style={{ marginRight: "5px" }}
                    /> New</button>
                </span>
              </Box>

              {/* data grid table */}

              <div className="data-table pb-3">
                <DataGrid
                  dataSource={
                    props?.documentData
                      ? props?.documentData.allAccountDocuments
                      : []
                  }
                  // height={250}
                  keyExpr="document_id"
                  showColumnLines={true}
                  showRowLines={true}
                  showBorders={false}
                  rowAlternationEnabled={true}
                >
                  <Column
                    dataField="parent_document_name"
                    caption="Document Name"
                    cssClass="column-header"
                    cellRender={renderLink}
                  />
                  <Column dataField="comment" cssClass="column-header" />
                  <Column dataField="related_to" cssClass="column-header" />
                  <Column
                    dataField="uploaded_by_name"
                    cssClass="column-header"
                    caption="Uploaded by"
                  />
                  <Column
                    dataField="createdAt"
                    cssClass="column-header"
                    caption={"Uploaded Date"}
                    cellRender={getDateTime}
                  />

                  <Scrolling columnRenderingMode="virtual" />
                  <Paging enabled={false} />
                </DataGrid>
              </div>
            </>
          )}

          {/* <div className="data-table pb-3">
        <DataGrid
          dataSource={documentData ? documentData.allAccountDocuments : []}
          height={250}
          keyExpr="ID"
          showColumnLines={true}
          showRowLines={true}
          showBorders={false}
          rowAlternationEnabled={true}
        >
          <Column
            dataField="parent_document_name"
            width={80}
            caption="Document Name"
            cssClass="column-header"
          />
          <Column dataField="comment" cssClass="column-header" />
          <Column dataField="related_to" cssClass="column-header" />
          <Column dataField="uploaded_by" cssClass="column-header" />
          <Column dataField="State" cssClass="column-header" />
          <Column dataField="Position" width={130} cssClass="column-header" />
          <Column
            dataField="BirthDate"
            width={100}
            dataType="date"
            cssClass="column-header"
          />
          <Column
            dataField="HireDate"
            width={100}
            dataType="date"
            cssClass="column-header"
          />

          <Scrolling columnRenderingMode="virtual" />
          <Paging enabled={false} />
        </DataGrid>
      </div> */}
          {props?.documentData &&
            props?.documentData?.allGroup &&
            props?.documentData?.allGroup?.map((item, i) => (
              <div key={i}>
                <Box className="text-left pt-3 pb-1">
                  <h4 className="heading">{item.site_name}</h4>
                </Box>

                {/* data grid table */}

                <div className="data-table pb-3">
                  <DataGrid
                    dataSource={item.response ? item.response : []}
                    // height={250}
                    keyExpr="document_id"
                    showColumnLines={true}
                    showRowLines={true}
                    showBorders={false}
                    rowAlternationEnabled={true}
                  >
                    <Column
                      dataField="parent_document_name"
                      caption="Document Name"
                      cssClass="column-header"
                      cellRender={renderLink}
                    />
                    <Column dataField="comment" cssClass="column-header" />
                    <Column dataField="related_to" cssClass="column-header" />
                    <Column
                      dataField="uploaded_by_name"
                      cssClass="column-header"
                      caption="Uploaded by"
                    />
                    <Column
                      dataField="createdAt"
                      cssClass="column-header"
                      caption={"Uploaded Date"}
                      cellRender={getDateTime}
                    />

                    <Scrolling columnRenderingMode="virtual" />
                    <Paging enabled={false} />
                  </DataGrid>
                </div>
              </div>
            ))}
          <div></div>
        </>)}
    </div>
  );
}

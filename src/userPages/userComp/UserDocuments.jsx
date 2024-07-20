// import { Box } from "@mui/material";
// import React, { useEffect, useState } from "react";
// // import "./table.css";
// import DataGrid, {
//   Scrolling,
//   Paging,
//   Column,
// } from "devextreme-react/data-grid";
// import { CallGETAPI } from "../../helper/API";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import moment from "moment";
// import TableSkeleton from "../../pages/accounts/skeleton/table/TableSkeleton";
// import New from "../../img/New.png";
// import { getPermission } from "../../helper/Common";
// import { isUserPermission } from "../../helper/permission";

// export default function UserDocuments(props) {
//   const { userAccountId } = useParams();
//   const navigate = useNavigate();
//   const [documentData, setDocumentData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getDateTime = (e) => {
//     return moment(e?.value).format("DD-MM-YYYY hh:mm A");
//   };

//   let is_document_details = false;

//   let permissions = getPermission(); //localStorage.getItem('permissions')
//   let permissionsArr = permissions.split(",");
//   if (permissionsArr.includes("document-details")) {
//     is_document_details = true;
//   }

//   const renderLink = (e) => {
//     let id = e?.data?.document_id;
//     return (
//       <span
//       //  to={is_document_details ? `/account-document-details/${id}` : ""}
//       className={((isUserPermission("document-details") == 1) && is_document_details) ? "link" : ""}
//       onClick={()=> ((isUserPermission("document-details") == 1) && is_document_details) && navigate(`/account-document-details/${id}`)}
//        >
//         {e?.value}
//       </span>
//     );
//   };

//   const redirectUrl = "";

//   const fetchData = async () => {
//     const response = await CallGETAPI(
//       "user/user-document-tab/",
//       props.account_id
//     );
//     if (response?.status) {
//       setLoading(false);
//       setDocumentData(response?.data?.data?.allAccountDocuments);
//     }
//   };

//   console.log("documentData", documentData);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   console.log({ userAccountId });

//   return (
//     <div className="relative mb-5">
//       {loading && (
//         <div className="" style={{ width: "100%", marginTop: "4%" }}>
//           <TableSkeleton />
//         </div>
//       )}

//       {!loading && (
//         <>
//           <div
//             style={{
//               display: "flex",
//               gap: "10%",
//               width: "100%",
//               justifyContent: "right",
//               marginTop: "1%",
//             }}
//           >
//             {props.privileges.includes("new-document") && (
//               <Box className="text-left pt-1 pb-1 d-flex">
//                 <span className="" style={{ marginLeft: "auto" }}>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       navigate("/account-document-upload", {
//                         state: {
//                           type: "account",
//                           accountId: userAccountId,
//                           siteId: "",
//                         },
//                       });
//                     }}
//                     className="btn "
//                   >
//                     <img
//                       src="/edit.svg"
//                       alt="Edit"
//                       style={{ marginRight: "5px" }}
//                     />{" "}
//                     New
//                   </button>
//                 </span>
//               </Box>
//             )}
//           </div>

//           {documentData && (
//             <>
//               {/* heading */}
//               {/* <Box className="text-left pt-3 pb-1">
//                                 <h4 className="heading">{props?.siteName} CheckName</h4>
//                             </Box> */}

//               {/* data grid table */}

//               {/* <div className="data-table pb-3">
//                                 <DataGrid
//                                     // dataSource={props?.documentData ? props?.documentData : []}
//                                     dataSource={documentData}
//                                     // height={250}
//                                     keyExpr="document_id"
//                                     showColumnLines={true}
//                                     showRowLines={true}
//                                     showBorders={false}
//                                     rowAlternationEnabled={true}
//                                 >
//                                     <Column
//                                         dataField="parent_document_name"
//                                         caption="Document Name"
//                                         cssClass="column-header"
//                                         cellRender={renderLink}
//                                     />
//                                     <Column dataField="comment" cssClass="column-header" />
//                                     <Column dataField="related_to" cssClass="column-header" />
//                                     <Column
//                                         dataField="uploaded_by_name"
//                                         cssClass="column-header"
//                                         caption="Uploaded by"
//                                     />
//                                     <Column
//                                         dataField="createdAt"
//                                         cssClass="column-header"
//                                         caption={"Uploaded Date"}
//                                         cellRender={getDateTime}
//                                     />

//                                     <Scrolling columnRenderingMode="virtual" />
//                                     <Paging enabled={false} />
//                                 </DataGrid>
//                             </div> */}
//             </>
//           )}

//           {documentData ? (
//             <>
//               {/* heading */}
//               <Box className="text-left pt-1 pb-1 d-flex">
//                 <h4 className="heading">Account</h4>
//               </Box>

//               {/* data grid table */}

//               <div className="data-table pb-3">
//                 <DataGrid
//                   dataSource={documentData}
//                   // height={250}
//                   keyExpr="document_id"
//                   showColumnLines={true}
//                   showRowLines={true}
//                   showBorders={false}
//                   rowAlternationEnabled={true}
//                 >
//                   <Column
//                     dataField="parent_document_name"
//                     caption="Document Name"
//                     cssClass="column-header"
//                     cellRender={renderLink}
//                   />
//                   <Column dataField="comment" cssClass="column-header" />
//                   <Column dataField="related_to" cssClass="column-header" />
//                   <Column
//                     dataField="uploaded_by_name"
//                     cssClass="column-header"
//                     caption="Uploaded by"
//                   />
//                   <Column
//                     dataField="createdAt"
//                     cssClass="column-header"
//                     caption={"Uploaded Date"}
//                     cellRender={getDateTime}
//                   />

//                   <Scrolling columnRenderingMode="virtual" />
//                   <Paging enabled={false} />
//                 </DataGrid>
//               </div>
//             </>
//           ) : ( <>
//             <Box className="text-left pt-1 pb-1 d-flex">
//             <h4 className="heading">Account</h4>
//           </Box>

//           {/* data grid table */}

//           <div className="data-table pb-3">
//             <DataGrid
//               dataSource={documentData}
//               // height={250}
//               keyExpr="document_id"
//               showColumnLines={true}
//               showRowLines={true}
//               showBorders={false}
//               rowAlternationEnabled={true}
//             >
//               <Column
//                 dataField="parent_document_name"
//                 caption="Document Name"
//                 cssClass="column-header"
//                 cellRender={renderLink}
//               />
//               <Column dataField="comment" cssClass="column-header" />
//               <Column dataField="related_to" cssClass="column-header" />
//               <Column
//                 dataField="uploaded_by_name"
//                 cssClass="column-header"
//                 caption="Uploaded by"
//               />
//               <Column
//                 dataField="createdAt"
//                 cssClass="column-header"
//                 caption={"Uploaded Date"}
//                 cellRender={getDateTime}
//               />

//               <Scrolling columnRenderingMode="virtual" />
//               <Paging enabled={false} />
//             </DataGrid>
//           </div>
//          </> )}

//           {documentData &&
//             documentData?.allGroup &&
//             documentData?.allGroup?.map((item, i) => (
//               <div key={i}>
//                 <Box className="text-left pt-3 pb-1">
//                   <h4 className="heading">{item.site_name}</h4>
//                 </Box>

//                 {/* data grid table */}

//                 <div className="data-table pb-3">
//                   <DataGrid
//                     // dataSource={item.response ? item.response : []}
//                     dataSource={documentData}
//                     // height={250}
//                     keyExpr="document_id"
//                     showColumnLines={true}
//                     showRowLines={true}
//                     showBorders={false}
//                     rowAlternationEnabled={true}
//                   >
//                     <Column
//                       dataField="parent_document_name"
//                       caption="Document Name"
//                       cssClass="column-header"
//                       cellRender={renderLink}
//                     />
//                     <Column dataField="comment" cssClass="column-header" />
//                     <Column dataField="related_to" cssClass="column-header" />
//                     <Column
//                       dataField="uploaded_by_name"
//                       cssClass="column-header"
//                       caption="Uploaded by"
//                     />
//                     <Column
//                       dataField="createdAt"
//                       cssClass="column-header"
//                       caption={"Uploaded Date"}
//                       cellRender={getDateTime}
//                     />

//                     <Scrolling columnRenderingMode="virtual" />
//                     <Paging enabled={false} />
//                   </DataGrid>
//                 </div>
//               </div>
//             ))}
//           <div></div>
//         </>
//       )}
//     </div>
//   );
// }




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
import TableSkeleton from "../../pages/accounts/skeleton/table/TableSkeleton";
import { DecryptToken } from "../../helper/BasicFn";
// import TableSkeleton from "../skeleton/table/TableSkeleton";
// import { DecryptToken } from "../../../helper/BasicFn";
import { getPermission } from "../../helper/Common";
import { isSubAdminPermission, isUserPermission } from "../../helper/permission";
import New from "../../img/New.png";


export default function Documents(props) {
  const { accountId, siteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const user = DecryptToken();
  const privilege = getPermission();

  const dataSource = props?.documentData ? props?.documentData.allAccountDocuments : [];

  const getDateTime = (e) => {
    return moment(e?.value).format("DD-MM-YYYY hh:mm A");
  };


  const renderLink = (e) => {
    // console.log("ebent", e);
    let id = e?.data?.document_id;

    return(
       <span onClick={()=> (user?.user_type == 0 || isSubAdminPermission("document-details") || isUserPermission("document-details"))
        && navigate(`/account-document-details/${id}`)}
       className={(user?.user_type == 0 || isSubAdminPermission("document-details") || isUserPermission("document-details"))
       ? "link" : ""}
       >
      {e?.value}
        </span>
  )};
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


      {!loading && (
        <>
          {(props?.documentData && !props?.documentData?.allAccountDocuments && props?.type == "SITE") ? (
            <>
              {/* heading */}
              <Box className="text-left pt-3 pb-1 d-flex" >
                <h4 className="heading">{props?.siteName} </h4>
                {(isUserPermission("new-document") == 1) && ( 
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
                    style={{color: "#0C71C3"}}
                  >
                    <img
                      src={New}
                      alt="New"
                      style={{ marginRight: "5px" }}
                    />
                   <span style={{color:"#0C71C3"}}> New</span> 
                  </button>
                </span>
                )}
              </Box>

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
          ) : (<>
          {(props?.type == "SITE") && ( <> 
           <Box className="text-left pt-3 pb-1 d-flex" >
                <h4 className="heading">{props?.siteName} </h4>
                {(isUserPermission("new-document") == 1) && ( 
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
                    style={{color: "#0C71C3"}}
                  >
                    <img
                      src={New}
                      alt="New"
                      style={{ marginRight: "5px" }}
                    />{" "}
                    New
                  </button>
                </span>
                )}
              </Box>

              {/* data grid table */}

              <div className="data-table pb-3">
                <DataGrid
                  dataSource={""}
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
              </> )}
          </>)}

          {(props?.documentData && props?.documentData.allAccountDocuments && props?.type == "Account") ? (
            <>
              {/* heading */}
              <Box className="text-left pt-3 pb-1 d-flex">
                <h4 className="heading">Account</h4>
                {(isUserPermission("new-document") == 1) && ( 
                <span className='' style={{ marginLeft: 'auto' }}>
                  <button type="button"
                    onClick={() => {
                      navigate("/account-document-upload", {
                        state: {
                          type: "Account",
                          accountId: props?.account_id,
                          siteId: "",
                        },
                      });
                    }}

                    className="btn "
                    style={{color: "#0C71C3"}}
                    >
                      <img
                      src={New}
                      alt="New"
                      style={{ marginRight: "5px" }}
                    /> New</button>
                </span>
               )}
              </Box>

              {/* data grid table */}

              <div className="data-table pb-3">
                <DataGrid
                  // dataSource={
                  //   props?.documentData
                  //     ? props?.documentData.allAccountDocuments
                  //     : []
                  // }
                  dataSource={dataSource}
                  // height={250}
                  noDataText="No Data"
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

          ) : (<>
           {(props?.type == "Account") && (<> 
          <Box className="text-left pt-3 pb-1 d-flex">
                <h4 className="heading">Account</h4>
                {(isUserPermission("new-document") == 1) && ( 
                <span className='' style={{ marginLeft: 'auto' }}>
                  <button type="button"
                    onClick={() => {
                      navigate("/account-document-upload", {
                        state: {
                          type: "Account",
                          accountId: props?.account_id,
                          siteId: "",
                        },
                      });
                    }}

                    className="btn "
                    style={{color: "#0C71C3"}}
                    >
                      <img
                      src="/edit.svg"
                      alt="Edit"
                      style={{ marginRight: "5px" }}
                    /> New</button>
                </span>
               )}
              </Box>

              {/* data grid table */}

              <div className="data-table pb-3">
                <DataGrid
                  // dataSource={
                  //   props?.documentData
                  //     ? props?.documentData.allAccountDocuments
                  //     : []
                  // }
                  dataSource={""}
                  // height={250}
                  noDataText="No Data"
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
              </>)}
          </>)}

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
          {/* {props?.documentData &&
            props?.documentData?.allGroup &&
            props?.documentData?.allGroup?.map((item, i) => (
              <div key={i}>
                <Box className="text-left pt-3 pb-1">
                  <h4 className="heading">{item.site_name}</h4>
                </Box>


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
            ))} */}
          <div></div>
        </>)}
    </div>
  );
}


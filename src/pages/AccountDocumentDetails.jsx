import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CallGETAPI } from "../helper/API";
import { Box } from "@mui/material";
import moment from "moment";
import TableSkeleton from "./accounts/skeleton/table/TableSkeleton";
import axios from "axios";
import Loading from "./accounts/Loading";
import BreadCrumbsSlice, { addItem } from "../redux/slices/BreadCrumbsSlice";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumbs from "../helper/BreadCrumbs";
import { GetProfile, getPermission } from "../helper/Common";

// const BASE_API = "https://www.uploads.mightyegor.com/public/";

const BASE_API = "https://www.upload.rossdev.xyz/public/";
const BASE_API2 = "https://www.upload.rossdev.xyz/api/";

const AccountDocumentDetails = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [documentData, setDocumentData] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addItem({title:'Document', path: location?.pathname, tab:"" }));
  },[])

  // const breadcrumbs = useSelector(state => state.BreadCrumbs.items); 



  const getDocumentsData = async () => {
    setLoading(true);
    const response = await CallGETAPI("get-document-by-id/", id);

    if (response?.status) {
      setDocumentData(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getDocumentsData();
    }
  }, [id]);

  const documentRedirect = () => {
    navigate(`/account-document-edit/${documentData?.document_id}`, {
      state: {
        accountId: documentData?.account_id,
        siteId: documentData?.site_id,
      },
    });
  };

  const HandleBackClick = () => {
    window.history.back();
  };

  const downloadFile = async () => {
    setLoading(true);
    await axios
      .get(`${BASE_API2}download/${documentData?.document_unique_name}`, {
        responseType: "blob",
      })
      .then((responses) => {
        const anchor = document.createElement("a");
        anchor.href = window.URL.createObjectURL(responses.data);
        anchor.download = documentData?.original_name;
        document.body.appendChild(anchor);
        anchor.click();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
      });
  };

  let profile = GetProfile();// JSON.parse(localStorage.getItem("ross-profile"))
  let account_id = profile?.account_id
  let contact_id = profile?.contact_id

  let is_user = false
  let privileges = []
  if (profile.user_type > 1) {
    let permissions = getPermission(); // localStorage.getItem('permissions')
    let permissionsArr = permissions.split(',')
    privileges = permissionsArr
    is_user = true
  }

  return (
    <>
      {loading ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ) : (<>
        <div className="mb-5" style={{ width: "95%", margin: "auto" }}>
          <div className="mt-3" style={{ padding: "6px 0" }}>
            <>
            <button
              className="btn text-primary"
              type="button"
              onClick={() => {
                HandleBackClick();
              }}
            >
              <img src="/back.svg" alt="svg" style={{ marginRight: "5px" }} />
              <span className="ms-2">Back</span>
            </button>

            <br/>
            </>
          </div>

          <div className="d-flex" style={{ paddingLeft: "0px" }}>
            <h1 className={"newAccountH1"}>
              <span className="account-title text-capitalize">
                {documentData?.parent_document_name}
              </span>
            </h1>
          </div>
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            {
              is_user === true ?
                <>
                  {privileges.includes('edit-document') && (
                    <div className="d-flex" style={{ gap: "10px" }}>
                      <button
                        className="btn text-primary"
                        type="button"
                        onClick={() => documentRedirect()}
                      >
                        <img src="/edit.svg" alt="svg" style={{ marginRight: "5px" }} />
                        <span className="ms-2">Edit</span>
                      </button>
                    </div>
                  )}
                </>
                :
                <>
                  <div className="d-flex" style={{ gap: "10px" }}>
                    <button
                      className="btn text-primary"
                      type="button"
                      onClick={() => documentRedirect()}
                    >
                      <img src="/edit.svg" alt="svg" style={{ marginRight: "5px" }} />
                      <span className="ms-2">Edit</span>
                    </button>
                  </div>
                </>
            }
          </div>

          <Box className="text-left pt-3 pb-1">
            <h4 className="heading">{props?.siteName}</h4>
          </Box>
          <div className="data-table pb-3">
            {/* <Table
              striped="rows"
              style={{
                border: "3px solid #0c71c3",
                borderLeft: "none",
                borderRight: "none",
              }}
            >
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Comment</th>
                  <th>Related To</th>
                  <th>Uploaded By</th>
                  <th>Uploaded Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <p className="m-0 flex-grow-1">
                        {documentData?.original_name}
                      </p>
                      <a
                        className="pointer"
                        href={`${BASE_API}${documentData?.document_unique_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="/view_document.svg"
                          alt=""
                          width={25}
                          height={25}
                        />
                      </a>
                      <div className="pointer" onClick={() => downloadFile()}>
                        <img
                          src="/download_document.svg"
                          alt=""
                          width={25}
                          height={25}
                        />
                      </div>
                    </div>
                  </td>
                  <td>{documentData?.comment}</td>
                  <td>{documentData?.related_to}</td>
                  <td>{documentData?.uploaded_by_name}</td>
                  <td>
                    {moment(documentData?.createdAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )}
                  </td>
                </tr>
              </tbody>
            </Table> */}

            <table className="w-100 border-b-blue odd-even-row">
              <thead>
                <tr className="">
                  <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                    File Name
                  </th>
                  <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                    Comment
                  </th>
                  <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                    Related to
                  </th>
                  <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                    Uploaded by
                  </th>
                  <th className=" py-1 px-2 bg-tbl-border border-t-blue">
                    Uploaded date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="">
                  <td className=" py-1 px-2 tbl-border  border-r-blue">
                    <div className="d-flex align-items-center gap-2">
                      <p className="m-0 flex-grow-1">
                        {documentData?.original_name}
                      </p>
                      <a
                        className="pointer"
                        href={`${BASE_API}${documentData?.document_unique_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="/view_document.svg"
                          alt=""
                          width={25}
                          height={25}
                        />
                      </a>
                      <div className="pointer" onClick={() => downloadFile()}>
                        <img
                          src="/download_document.svg"
                          alt=""
                          width={25}
                          height={25}
                        />
                      </div>
                    </div>
                  </td>
                  <td className=" py-1 px-2 tbl-border  border-r-blue">
                    {documentData?.comment}
                  </td>
                  <td className=" py-1 px-2 tbl-border  border-r-blue">
                    {documentData?.related_to}
                  </td>
                  <td className=" py-1 px-2 tbl-border border-r-blue">
                    {documentData?.uploaded_by_name}
                  </td>
                  <td className=" py-1 px-2 tbl-border">
                    {moment(documentData?.createdAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
     </> )}
    </>
  );
};

export default AccountDocumentDetails;

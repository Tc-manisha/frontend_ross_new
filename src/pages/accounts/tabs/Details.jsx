import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import TableSkeleton from "../skeleton/table/TableSkeleton";
import Moment from "react-moment";
import { DateFormate } from "../../../helper/TblFn";
import { AED_IMG_BASE } from "../../../helper/API";
import { FormatDateWithTime } from "../../../helper/Common";
import "../../../../src/global.css";
import BreadCrumbs from "../../../helper/BreadCrumbs";

export default function Details({
  accountDetails,
  CoordiDataList,
  programDetails,
  httpsWeb,
  tabTbldata,
}) {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = React.useState(true);
  const { accountId } = useParams();

  if(accountDetails && CoordiDataList && programDetails){
  tabTbldata.site = ""
  }

  useEffect(() => {
    setShowLoading(false);
  }, [accountDetails, CoordiDataList, programDetails, httpsWeb]);

  return (<>
    <div className='relative'
      style={{ width: "93vw", paddingInline: "0px", marginLeft: "0px", paddingLeft: "0px", marginBottom: '5%' }}
    >
      {/* loading */}
      {showLoading && (
        <div className="showloading-table">
          <TableSkeleton />
        </div>
      )}

      

      {/* heading */}
      <Box className="text-left pt-3">
        <h4 className="heading">General Information</h4>
      </Box>
      <table className="w-100">
        <tbody>
          <tr className="">
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Main Site
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Terms
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Customer Type
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Industry
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Lead Source
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue">
              Account Status
            </th>
          </tr>
          <tr className="">
            <td className=" py-1 px-2 border-r-blue">
              {accountDetails?.main_site}
            </td>
            <td className=" py-1 px-2 border-r-blue">
              {accountDetails?.terms}
            </td>
            <td className=" py-1 px-2 border-r-blue">
              {accountDetails?.customer_type}
            </td>
            <td className=" py-1 px-2 border-r-blue">
              {accountDetails?.industry}
            </td>
            <td className=" py-1 px-2 border-r-blue">
              {accountDetails?.lead_source}
            </td>
            <td className=" py-1 px-2">{accountDetails?.account_status}</td>
          </tr>

          <tr className="">
            <th className=" py-1 px-2 border-t-blue bg-tbl-border border-r-blue">
              Parent Account
            </th>
            <th
              className=" py-1 px-2 border-t-blue bg-tbl-border border-r-blue"
              colSpan="2"
            >
              Distributor Account
            </th>
            <th className=" py-1 px-2 border-t-blue bg-tbl-border" colSpan="3">
              Product Interest
            </th>
          </tr>

          <tr className="">
            <td className=" py-1 px-2 border-r-blue border-b-blue">
              {accountDetails?.parent_account_id ? (
                <>
                  <Link
                    className="link"
                    style={{textDecoration:"none"}}
                    to={"/account-details/" + accountDetails?.parent_account_id}
                  >
                    {accountDetails?.parent_account}
                  </Link>
                </>
              ) : (
                ""
              )}
            </td>
            <td className=" py-1 px-2 border-r-blue border-b-blue" colSpan="2">
              {accountDetails?.distributor_account_id ? (
                <>
                  <Link
                    className="link"
                    style={{textDecoration:"none"}}
                    to={
                      "/account-details/" +
                      accountDetails?.distributor_account_id
                    }
                  >
                    {accountDetails?.distributor_account}
                  </Link>
                </>
              ) : (
                ""
              )}
            </td>
            <td className=" py-1 px-2 border-b-blue" colSpan="3">
              {accountDetails?.product_interest?.join(", ")}
            </td>
          </tr>

          <tr className="">
            <th className=" py-1 px-2 bg-tbl-border border-r-blue" colSpan="3">
              Important Note
            </th>
            <th className=" py-1 px-2 bg-tbl-border" colSpan="3">
              Website
            </th>
          </tr>
          <tr className="">
            <td className=" py-1 px-2 border-b-blue border-r-blue" colSpan="3">
              {accountDetails?.inportant_notes}
            </td>
            <td className=" py-1 px-2 border-b-blue" colSpan="3">
              {accountDetails?.website != "" &&
                accountDetails?.website != null &&
                accountDetails?.website != "-" ? (
                <>
                  <a
                  className="link"
                  style={{textDecoration:"none"}}
                    href={
                      !httpsWeb
                        ? "https://" + accountDetails?.website
                        : accountDetails?.website
                    }
                    target="_blank"
                  >
                    {accountDetails?.website}
                  </a>
                </>
              ) : (
                ""
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Program Details */}
      <Box className="text-left pt-3 ">
        <h4 className="heading">Program Details</h4>
      </Box>

      <table className="w-100 border-b-blue">
        <tbody>
          <tr className="">
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Active Sites
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              AEDS
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Equipment
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              CPR Trained
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              AED Check length
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue">
              Extra Fields
            </th>
          </tr>
          <tr className="">
            <td className=" py-1 px-2 border-r-blue">
              {programDetails?.activeSites}
            </td>
            <td className=" py-1 px-2 border-r-blue">{programDetails?.aed_units.length}</td>
            <td className=" py-1 px-2 border-r-blue"></td>
            <td className=" py-1 px-2 border-r-blue"></td>
            <td className=" py-1 px-2 border-r-blue">
              {accountDetails?.aed_check_length}
            </td>
            <td className=" py-1 px-2">
            {/*{accountDetails?.extra_field1 + ", " + accountDetails?.extra_field2}*/}
            {accountDetails?.extra_field1 
              ? accountDetails?.extra_field2 
                  ? `${accountDetails.extra_field1}, ${accountDetails.extra_field2}` 
                  : `${accountDetails.extra_field1}` 
              : ''}
              {/* {accountDetails?.extra_fields === "1"
            ? accountDetails?.extra_field1
            : accountDetails?.extra_fields === "2"
            ? accountDetails?.extra_field1 + ", " + accountDetails?.extra_field2
            : ""} */}
            </td>
          </tr>
        </tbody>
      </table>

      {/* AED Units Owned */}
      <Box className="text-left pt-3 ">
        <h4 className="heading">AED Units Owned</h4>
      </Box>

      <div>

        {/* <table className="w-100 border-b-blue last-r-border-none" >
          <tbody >
            {programDetails?.aed_units?.length > 0 ? (
              <>
                <tr className="">
                  {programDetails?.aed_units?.map((aed, index) => (
                    <th
                      scope="col"
                      width="30%"
                      className="text-center py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                      key={index}
                    >
                      {aed?.brandName} {aed?.modalName}
                    </th>
                  ))}
                  {programDetails?.aed_units?.length < 5 && (
                    <>
                      <th
                        scope="col"
                        width="20%"
                        className="text-center py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                      ></th>
                      <th
                        scope="col"
                        width="20%"
                        className="text-center py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                      ></th>
                      <th
                        scope="col"
                        width="20%"
                        className="text-center py-1 px-2 bg-tbl-border border-t-blue"
                      ></th>
                    </>
                  )}
                </tr>
                <tr className="">
                  {programDetails?.aed_units?.map((aed, index) => (
                    <td className=" py-1 px-2 border-r-blue" key={index}>
                      <div className="text-center">
                        <img
                          src={AED_IMG_BASE + aed?.modalImage}
                          alt={aed?.modalName}
                          style={{
                            maxWidth: "30%",
                            maxHeight: "50%",
                            marginTop: "20px",
                            minWidth: "161px"
                          }}
                        />
                      </div>
                    </td>
                  ))}
                  {programDetails?.aed_units?.length < 5 && (
                    <>
                      <td className=" py-1 px-2 border-r-blue"></td>
                      <td className=" py-1 px-2 border-r-blue"></td>
                      <td className=" py-1 px-2"></td>
                    </>
                  )}
                </tr>

                <tr className="">
                  {programDetails?.aed_units?.map((aed, index) => (
                    <td className=" py-1 px-2 border-r-blue" key={index}>
                      <p className="mt-3" style={{ textAlign: "center" }}>Own: {aed?.own}</p>
                    </td>
                  ))}
                </tr>
              </>
            ) : (
              <>
                <tr className="">
                  <td
                    colSpan={5}
                    className="text-center py-1 px-2 bg-tbl-border border-t-blue"
                  >
                    No AED units found
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table> */}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
        {programDetails?.aed_units && programDetails.aed_units.length > 0 ? (
          [...Array(Math.ceil(programDetails.aed_units.length / 6) * 6)].map((_, i) => {
            const aedIndex = i < programDetails.aed_units.length ? i : null;
            const aed = aedIndex !== null ? programDetails.aed_units[aedIndex] : null;
            const isLastRow = Math.floor(i / 6) === Math.ceil(programDetails.aed_units.length / 6) - 1;
            return (
              <div key={i} style={{ flex: '0 0 16.666%', maxWidth: '17.666%', marginBottom: 0, padding: 0 }}
                className={`border-l-blue border-t-blue border-r-blue ${isLastRow ? 'border-b-blue' : ''}`}>
        
                <div style={{ background: '#D9D9D9', display: "flex", alignItems: "center", flexDirection: 'column', justifyContent: "center", height: 55 }}>
                  <p style={{ margin: 0 }}>{aed?.brandName}</p>
                  <p style={{ margin: 0 }}>{aed?.modalName}</p>
                </div>
        
                {aed && (
                  <>
                    <div style={{ padding: '8% 0', display: "flex", justifyContent: "center" }}>
                      <img
                        src={AED_IMG_BASE + aed?.modalImage}
                        alt={aed?.modalName}
                        style={{
                          width: 130,
                          height: 130,
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </>
                )}
        
                {aed && (
                  <>
                    <div style={{ padding: '1% 0', display: "flex", justifyContent: "center" }}>
                      <p style={{ fontSize: 18 }}>Own: {aed?.own}</p>
                    </div>
                  </>
                )}
        
              </div>
            );
          })
        ) : (
          <div style={{ width: '100%', marginBottom: 0, paddingTop: '12px', textAlign: "center" }}
                className={`border-l-blue border-t-blue border-r-blue border-b-blue`}>
              <p>No AED units available</p>
          </div>
        )}
        
        </div>

      </div>

      {/* Coordinator Information */}
      <Box>
        <h4 className="heading mt-3">Coordinator Information</h4>
        <table className="w-100 last-table-border-hide">
          <tbody>
            <tr className="">
              {CoordiDataList?.map((CoorD, index) => (
                <td
                  className="py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                  key={index}
                >
                  {CoorD.title}
                </td>
              ))}
            </tr>
            <tr>
              {CoordiDataList?.map((CoorD, i1) => (
                <td className="py-1 px-2 border-r-blue" key={i1}>
                  {" "}
                  P:{" "}
                  <span
                    onClick={() => {
                      navigate(
                        "/account/" +
                        accountId +
                        "/contact-details/" +
                        CoorD?.arr?.[0]?.contact_id ||
                        CoorD?.arr?.[1]?.contact_id,
                        {
                          state: {
                            siteTitle:
                              "Contact : " + CoorD?.arr?.[0]?.primary ||
                              CoorD?.arr?.[1]?.primary,
                            editUrl:
                              "/account/contact-details-edit/" +
                              CoorD?.arr?.[0]?.contact_id ||
                              CoorD?.arr?.[1]?.contact_id,
                            deleteUrl:
                              "/account/contact-details-edit/" +
                              CoorD?.arr?.[0]?.contact_id ||
                              CoorD?.arr?.[1]?.contact_id,
                          },
                        }
                      );
                    }}
                    className="link"
                  >
                    {" "}
                    {CoorD?.arr?.[0]?.primary || CoorD?.arr?.[1]?.primary}
                  </span>
                </td>
              ))}
            </tr>

            <tr>
              {CoordiDataList?.map((CoorD, i1) => (
                <td className="py-1 px-2 border-b-blue border-r-blue" key={i1}>
                  {" "}
                  B:
                  <span
                    onClick={() => {
                      navigate(
                        "/account/" +
                        accountId +
                        "/contact-details/" +
                        CoorD?.arr?.[0]?.contact_id ||
                        CoorD?.arr?.[1]?.contact_id,
                        {
                          state: {
                            siteTitle:
                              "Contact : " + CoorD?.arr?.[0]?.backup ||
                              CoorD?.arr?.[1]?.backup,
                            editUrl:
                              "/account/contact-details-edit/" +
                              CoorD?.arr?.[0]?.contact_id ||
                              CoorD?.arr?.[1]?.contact_id,
                            deleteUrl:
                              "/account/contact-details-edit/" +
                              CoorD?.arr?.[0]?.contact_id ||
                              CoorD?.arr?.[1]?.contact_id,
                          },
                        }
                      );
                    }}
                    className="link"
                  >
                    {" "}
                    {CoorD?.arr?.[0]?.backup || CoorD?.arr?.[1]?.backup}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Box>
      <div className="pb-0" style={{ marginTop: "40px" }}>
        <div className="d-flex Created-Modified">
          <div className="CreatedDiv">
            <span>
              Created Date:{" "}
              {accountDetails?.created_date ? (
                FormatDateWithTime(accountDetails?.created_date)
              ) : (
                ""
              )}
            </span>
            <span>Created By: {accountDetails?.created_by}</span>
          </div>

          <div className="ModifiedDiv">
            <span>
              Modified Date:{" "}
              {accountDetails?.modified_date ? (
                <Moment
                  date={accountDetails?.modified_date}
                  format={'MM/DD/YYYY h:mm A'}
                />
              ) : (
                ""
              )}{" "}
            </span>
            <span>
              Modified By:{" "}
              {accountDetails?.modifiedBy?.account_name
                ? accountDetails?.modifiedBy?.account_name
                : accountDetails?.modifiedBy}
            </span>
          </div>
          {/* <span>Last Touch Date: 11-14-2020 12:00:00</span> */}
        </div>
      </div>
    </div>
  </>
  );
}

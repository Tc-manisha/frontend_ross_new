import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatPhoneNumber, getPermission } from "../../../helper/Common";
// import TableSkeleton from "../skeleton/table/TableSkeleton";
import New from "../../../img/New.png";
import TableSkeleton from "../../../pages/accounts/skeleton/table/TableSkeleton";
import { isUserPermission } from "../../../helper/permission";
import { linkTabsPermission }  from "../../../helper/permission";

export default function Sites({ siteDataList, edit = true, is_user = false }) {
  const navigate = useNavigate();
  const { userAccountId} = useParams();
  const [showLoading, setShowLoading] = React.useState(true);
  const privilages = getPermission();
  const userPermission = ["site-details", "contact-tab", "equipment-tab", "training-tab", "inperson-tab", "notes-tab", "documents-tab"];

  let site_url = is_user ? "/user/site-details/" : "/account/site-details/";

  useEffect(() => {
    setShowLoading(false);
  }, [siteDataList]);

  return (
    <div className="relative" style={{ marginBottom: "5%" }}>
      {/* loading */}
      {showLoading && (
        <div className="showloading-table">
          <TableSkeleton />
        </div>
      )}

      {!showLoading && (
        <>
          <Box className="d-flex justify-content-between align-items-center py-2">
            <h3 className="heading">Account Site Information</h3>
            <div style={{ display: "flex", flexDirection: "row", gap: "2px" }}>
              {privilages?.includes("sites-new") && ( 
                <button
                className="btn text-primary"
                type="button"
                onClick={()=> navigate("/admin-siteNew/" + userAccountId)}
              >
                <img
                  src={New}
                  style={{ marginRight: "5px" }}
                />
                <span className="ms-1">New </span>
              </button>
              )}
            </div>
          </Box>

          <table className="w-100 border-b-blue">
            <thead>
              <tr className="">
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  Main Site
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  Equipment
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  Training
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  Site POC
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  Phone
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="odd-even-row">
              {siteDataList?.map((siteList, index) => (
                <tr className="" key={index}>
                  <td className=" py-1 px-2 tbl-border border-r-blue">
                    <h6 className={(linkTabsPermission(userPermission) === 1) ? "link" : "" }
                    onClick={() => (linkTabsPermission(userPermission) === 1)
                    && navigate(site_url + `${siteList.account_site_info_id}`)} > 
                    {siteList?.account_site_name} 
                    </h6>
                  </td>
                  <td className=" py-1 px-2 tbl-border  border-r-blue">
                    {/* <Link to={ "account/site-details" } >
                                { siteList?.account_site_equipment }
                            </Link> */}
                    {siteList?.aedCount}/{siteList?.equipmentCount}
                  </td>
                  <td className=" py-1 px-2 tbl-border border-r-blue">
                    {siteList?.account_site_training}
                  </td>
                  <td className=" py-1 px-2 tbl-border border-r-blue">
                    {siteList?.account_site_poc}
                  </td>
                  <td className=" py-1 px-2 tbl-border border-r-blue">
                    {siteList?.account_site_phone && (
                      <a
                        className="link"
                        style={{textDecoration:"none"}}
                        href={
                          "tel:" +
                          siteList?.account_site_phone_ext +
                          siteList?.account_site_phone
                        }
                      >
                        {siteList?.account_site_phone
                          ? formatPhoneNumber(siteList?.account_site_phone)
                          : ""}{" "}
                        {siteList?.account_site_phone_ext
                          ? " X " + siteList?.account_site_phone_ext
                          : ""}
                      </a>
                    )}
                  </td>
                  <td className=" py-1 px-2 tbl-border">
                    <a
                      className="link"
                      style={{textDecoration:"none"}}
                      href={"mailto:" + siteList?.account_site_email}
                    >
                      {siteList?.account_site_email}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

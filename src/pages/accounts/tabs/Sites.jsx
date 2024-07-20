import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatPhoneNumber, getPermission } from "../../../helper/Common";
import TableSkeleton from "../skeleton/table/TableSkeleton";
import New from "../../../img/New.png";
import { DecryptToken } from "../../../helper/BasicFn";
import { isSiteDetails, isSubAdminPermission, linkTabsPermission } from "../../../helper/permission";

export default function Sites({ siteDataList, edit = true, is_user = false, setTabTbldata }) {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const [showLoading, setShowLoading] = React.useState(true);
  const user = DecryptToken();
  const privilege = getPermission();
  const subAdminPermission = ["site-details", "contact-tab", "equipment-tab", "training-tab", "inperson-tab", "notes-tab", "documents-tab"];

  let site_url = is_user ? "/user/site-details/" : "/account/site-details/";

  useEffect(() => {
    setShowLoading(false);
  }, [siteDataList]);

  useEffect(() => {
    if (siteDataList?.length > 0) {
      setTabTbldata((prev) => ({
      ...prev,
      site: true,
      }));
    }
    }, [siteDataList]);

    function hasSiteDetails(array) {
      for (let i = 0; i < array.length; i++) {
        console.log(array[i])
          if (array[i] == "site-details") {
            console.log(array[i])
              return true;
          }
      }
      return false;
  }

  // const isSiteDetailsPresent = privilege?.find(element => element === "site-details") !== undefined;
  // console.log({isSiteDetailsPresent})

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
              {(user?.user_type == 0 ||
               (user?.user_type == 2 && user?.sub_admin != "" && privilege?.includes("sites-new"))) && ( 
              <Link
                style={{ textDecoration: "none", marginRight: "10px" }}
                to={"/admin-siteNew/" + accountId}
              >
                <img src={New} />
              <span style={{color:"#0C71C3"}} > New</span>
              </Link>
              )}

              {/* {edit &&
                        <Link style={{ textDecoration: 'none' }} to={'/account/sites/new/' + accountId}
                        >
                            <img src={New} />
                            New
                        </Link>} */}
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
              {siteDataList.map((siteList, index) => (
                <tr className="" key={index}>
                 <td className="py-1 px-2 tbl-border border-r-blue">
                 
                  <span
                    className={(linkTabsPermission(subAdminPermission) == 1 )
                      ? "link" : ""} 
                    onClick={() => (linkTabsPermission(subAdminPermission) == 1 )
                      && navigate(site_url + siteList.account_site_info_id, {
                        state: {
                          siteTitle: "Site: " + siteList?.account_site_name,
                          ...(is_user
                            ? {}
                            : {
                                editUrl: "/account/site-details-edit/" + siteList.account_site_info_id,
                                deleteUrl: "/account/site-details-edit/" + siteList.account_site_info_id,
                              }),
                        },
                      }
                    )
                    }
                  >
                    {siteList?.account_site_name}
                  </span>
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
                  <span
                    onClick={() => {
                      navigate(
                        "/account/" +
                        accountId +
                        "/contact-details/" +
                        siteList.account_site_info_id,
                        {
                          state: {
                            siteTitle:
                              "Contact : " + siteList?.account_site_poc,
                            editUrl:
                              "/account/contact-details-edit/" +
                              siteList.account_site_info_id,
                            deleteUrl:
                              "/account/contact-details-edit/" +
                              siteList.account_site_info_id,
                          },
                        }
                      );
                    }}
                    className="link"
                  >
                  {siteList?.account_site_poc}
                  </span>
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

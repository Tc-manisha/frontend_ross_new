import { Box } from "@mui/material";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ContactStatus,
  formatPhoneNumber,
  getPermission,
} from "../../../helper/Common";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import New from "../../../img/New.png";
// import TableSkeleton from "../skeleton/table/TableSkeleton";
import { useState, useEffect } from "react";
import TableSkeleton from "../../../pages/accounts/skeleton/table/TableSkeleton";
import { isUserPermission, linkTabsPermission } from "../../../helper/permission";
// import { formatPhoneNumber } from "../../../helper/Common";

export default function Contacts({ siteContactList }) {
  const { accountId, userAccountId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const privileges = getPermission();
  const userPermission = ["contact-details", "notes-tab"];

  const fetchLoad = () => {
    setLoading(false);
  };

  useEffect(() => {
    fetchLoad();
  });

  const handleRedirect = (sC)=>{
		
    navigate('/user/' + userAccountId + '/contact-details/' + sC.contact_id, {
      state: {
        // siteTitle: "Contact : " + sC?.contact_name,
        editUrl: "/account/contact-details-edit/" + sC.contact_id,
        deleteUrl: "/account/contact-details-edit/" + sC.contact_id,
        type: "Contacts",
      }
    })
}

  return (
    <div className="relative" style={{ marginBottom: "5%" }}>
      {loading && (
        <div className="" style={{ width: "100%", marginTop: "4%" }}>
          <TableSkeleton />
        </div>
      )}

      {!loading && (
        <>
          <Box className="d-flex justify-content-between align-items-center py-2">
            <h3 className="heading">Account Contacts</h3>

            {privileges?.includes("contacts-new") && (
              <button
              className="btn text-primary"
              type="button"
              onClick={()=> navigate("/account/contacts/new/" + userAccountId)}
            >
              <img
                src={New}
                style={{ marginRight: "5px" }}
              />
              <span className="ms-1">New </span>
            </button>
               )}
          </Box>
          <table className="w-100 border-b-blue odd-even-row">
            <thead>
              <tr className="">
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  Contact{" "}
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  User
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  Phone
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  Email
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  Account Roles / Positions
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  Sites
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {siteContactList?.length > 0 && (
                <>
                  {siteContactList?.map((sC, index) => (
                    <tr className="" key={index}>
                      <td className=" py-1 px-2 tbl-border  border-r-blue">
                        <span
                          onClick={() =>
                            (linkTabsPermission(userPermission) == 1) &&
                            handleRedirect(sC)
                          }
                          className={
                            (linkTabsPermission(userPermission) == 1 )
                              ? "link"
                              : ""
                          }
                        >
                          {sC?.contact_name}
                        </span>
                      </td>
                      <td className=" py-1 px-2 tbl-border  border-r-blue">
                        {sC?.user ? (
                          <CheckIcon color={"success"} />
                        ) : (
                          <CloseIcon color="error" />
                        )}
                      </td>{" "}
                      {/* User */}
                      <td className=" py-1 px-2 tbl-border  border-r-blue" >
                        {sC?.phone?.[0].phone != "" &&
                          sC?.phone?.[0].phone != "-" && (
                            <a
                              className="link"
                              style={{ textDecration: "none !important", textDecoration:"none" }}
                              href={
                                "tel:" +
                                sC?.phone?.[0].ext +
                                sC?.phone?.[0]?.phone
                              }
                            >
                              {sC?.phone?.[0].phone
                                ? formatPhoneNumber(sC?.phone?.[0].phone)
                                : ""}
                              {sC?.phone?.[0].ext != ""
                                ? "x" + sC?.phone?.[0].ext
                                : ""}
                            </a>
                          )}
                      </td>
                      <td className=" py-1 px-2 tbl-border border-r-blue">
                        {/* Email */}
                        {sC?.email.length > 0 && (
                          <a
                            className="link"
                            style={{textDecoration:"none"}}
                            href={"mailto:" + sC?.email?.[0].email}
                          >
                            {sC?.email?.[0].email}
                          </a>
                        )}
                      </td>
                      <td className=" py-1 px-2 tbl-border border-r-blue">
                        {sC?.account_roles.join(", ")}{" "}
                      </td>
                      <td className=" py-1 px-2 tbl-border border-r-blue">
                        {sC?.main_site}
                      </td>
                      <td className=" py-1 px-2 tbl-border">
                        <p className={sC?.status == 1 ? "" : "text-danger"}>
                          {ContactStatus[sC?.status]}
                        </p>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

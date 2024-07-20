import { Box } from "@mui/material";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ContactStatus, formatPhoneNumber, getPermission } from "../../../helper/Common";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import New from "../../../img/New.png";
import TableSkeleton from "../skeleton/table/TableSkeleton";
import { useState, useEffect } from "react";
import { DecryptToken } from "../../../helper/BasicFn";

export default function Contacts({ siteContactList , setTabTbldata}) {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const user = DecryptToken();
  const privilege = getPermission();

  const fetchLoad = () => {
    setLoading(false);
  };

  useEffect(() => {
    fetchLoad();
  });

  useEffect(() => {
    if (siteContactList?.length > 0) {
      setTabTbldata((prev) => ({
      ...prev,
      contact: true,
      }));
    }
    }, [siteContactList]);

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
            <div></div>
            {(user?.user_type == 0 ||
               (user?.user_type == 2 && user?.sub_admin != "" && privilege?.includes("contacts-new"))) && ( 
            <Link
              style={{ textDecoration: "none" }}
              to={"/account/contacts/new/" + accountId}
            >
              <img src={New} />
              <span style={{color:"#0C71C3"}} > New</span>
            </Link>
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
                  Positions
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
              {siteContactList.length > 0 && (
                <>
                  {siteContactList.map((sC, index) => (
                    <tr className="" key={index}>
                      <td className="py-1 px-2 tbl-border border-r-blue">
                        <span
                            className={(user?.user_type == 0 || (user?.user_type == 2 && user?.sub_admin != "" && privilege?.includes("contact-details") === "contact-details"))
                              ? "link" : ""} 
                             
                          onClick={() => (user?.user_type == 0 || (user?.user_type == 2 && user?.sub_admin != "" && privilege?.includes("contact-details") === "contact-details"))
                            && navigate(`/account/${accountId}/contact-details/${sC.contact_id}`, {
                              state: {
                                // siteTitle: "Contact : " + sC?.contact_name,
                                editUrl: `/account/contact-details-edit/${sC.contact_id}`,
                                deleteUrl: `/account/contact-details-edit/${sC.contact_id}`,
                                type: "Contacts",
                              },
                            })
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
                      <td className=" py-1 px-2 tbl-border  border-r-blue">
                        {sC?.phone?.[0].phone != "" &&
                          sC?.phone?.[0].phone != "-" && (
                            <a
                              className="link"
                              style={{ textDecoration: "none" }}
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
                            style={{ textDecoration: "none" }}
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

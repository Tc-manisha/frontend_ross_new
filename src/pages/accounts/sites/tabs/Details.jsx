import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatPhoneNumber, getPermission } from "../../../../helper/Common";
import { FormControlLabel, Switch } from "@mui/material";
import { EditIcon, TrashIcon } from "../../../../helper/Icons";
import { AED_IMG_BASE, CallGETAPI } from "../../../../helper/API";
import New from "../../../../img/New.png";
import Cancel from "../../../../img/Cancel.svg";
import Check from "../../../../img/Check.svg";
import { toast } from "react-toastify";
import { DecryptToken } from "../../../../helper/BasicFn";
import Edit from "../../../../img/Edit.png";
import ContactName from "../../../../components/anchorTags/ContactName";

export default function Details({
  siteData,
  siteHoursData,
  billingData,
  shippingData,
  traningData,
  aedUnits,
  coordinatorData,
  fetch
}) {
  const navigate = useNavigate();
  const { siteId } = useParams();
  const user = DecryptToken();
  const privileges = getPermission();

  useEffect(() => { }, [
    siteData,
    billingData,
    shippingData,
    traningData,
    aedUnits,
    coordinatorData,
  ]);
   
  const siteHoursobj = {
    sundayopen: "",
    mondayopen: "",
    tuesdayopen: "",
    wednesdayopen: "",
    thrusdayopen: "",
    fridayopen: "",
    saturdayopen: "",
    sundayclose: "",
    mondayclose: "",
    tuesdayclose: "",
    wednesdayclose: "",
    thrusdayclose: "",
    fridayclose: "",
    saturdayclose: "",
  }

  
  function compareSiteHours(siteHoursObj, receivedSiteHoursObj) {
    for (const key in siteHoursObj) {
        if (siteHoursObj?.hasOwnProperty(key)) {
            if (receivedSiteHoursObj?.hasOwnProperty(key) && siteHoursObj[key] !== receivedSiteHoursObj[key]) {
                return false;
            }
        }
    }
    return true;
}

  function convertTo12Hour(timeString) {
    if (!timeString || timeString.toLowerCase() === "closed") {
      return "Closed";
    }

    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    if (hour === 0) {
      return `12:${minutes} AM`;
    } else if (hour < 12) {
      return `${hour}:${minutes} AM`;
    } else if (hour === 12) {
      return `12:${minutes} PM`;
    } else {
      return `${hour - 12}:${minutes} PM`;
    }
  }

  function getDaySchedule(openTime, closedTime) {
    if (openTime && openTime.toLowerCase() === "closed") {
      return "Closed";
    } else if (openTime && closedTime) {
      return `${convertTo12Hour(openTime)} - ${convertTo12Hour(closedTime)}`;
    } else if (openTime) {
      return `${convertTo12Hour(openTime)} - `;
    } else if (closedTime) {
      return ` - ${convertTo12Hour(closedTime)}`;
    } else {
      return "";
    }
  }

  const handleDelete = async (id) => {
    const res = await CallGETAPI(`account/delete-training-address/${id}`)
    if (res?.status) {
      toast.success(res?.data?.msg)
      fetch()
    }
    else {
      toast.error(res?.data?.msg)
    }
  }

  return (
    <div className="containerr site-details-table-section">
      <div className=" ">
        <table className="no-border">
          <tr className="bg-blue no-border">
            <th colSpan={4} className="tbl-title text-left no-border">
              Site Information
            </th>
          </tr>
          <tr>
            <th colSpan={1}>Site Phone</th>
            <th colSpan={2}>Address</th>
            <th colSpan={1}>Main</th>
            <th colSpan={1}>Account Status</th>
          </tr>
          <tr>
            <td colSpan={1}>
              {siteData?.account_site_phone && (
                <a
                  className="link"
                  style={{textDecoration:"none"}}
                  href={
                    "tel:" +
                    siteData?.account_site_phone_ext +
                    siteData?.account_site_phone
                  }
                >
                  {siteData?.account_site_phone
                    ? formatPhoneNumber(siteData.account_site_phone)
                    : ""}{" "}
                  {siteData?.account_site_phone_ext
                    ? " X " + siteData?.account_site_phone_ext
                    : ""}
                </a>
              )}
            </td>
            <td colSpan={2}>
              {siteData?.account_site_address1}{" "}
              {siteData?.account_site_address2} {siteData?.building_name}{" "}
              {siteData?.account_site_city} {siteData?.account_site_state}{" "}
              {siteData?.account_site_country} {siteData?.account_site_zipcode}
            </td>
            <td colSpan={1}>
              {" "}
              {Number(siteData?.account_site_main_site) === 0 ? (
                <img
                  className="col"
                  style={{ maxWidth: "20%", height: "20px" }}
                  src={Cancel}
                />
              ) : (
                <img
                  className="col"
                  style={{ maxWidth: "20%", height: "25px" }}
                  src={Check}
                />
              )}
            </td>
            <td colSpan={1}>{siteData?.account_site_status_name}</td>
          </tr>

          <tr>
            <th colSpan={1}>Invoice ASAP</th>
            <th colSpan={1}>Call Ahead</th>
            <th colSpan={1}>Security Clearance</th>
            <th colSpan={1}>Requires Escort</th>
            <th colSpan={1}>Out of Area</th>
          </tr>
          <tr>
            <td>
              {Number(billingData?.billing_is_invoice) === 0 ? (
                <img
                  className="col"
                  style={{ maxWidth: "20%", height: "20px" }}
                  src={Cancel}
                />
              ) : (
                <img
                  className="col"
                  style={{ maxWidth: "20%", height: "25px" }}
                  src={Check}
                />
              )}
            </td>

            <td>
              {Number(siteData?.account_site_call_ahead) === 0 ? (
                <img
                  className="col"
                  style={{ maxWidth: "20%", height: "20px" }}
                  src={Cancel}
                />
              ) : (
                <img
                  className="col"
                  style={{ maxWidth: "20%", height: "25px" }}
                  src={Check}
                />
              )}
            </td>

            <td>
              {Number(siteData?.account_site_call_ahead) === 0 ? (
                <img
                  className="col"
                  style={{ maxWidth: "20%", height: "20px" }}
                  src={Cancel}
                />
              ) : (
                <img
                  className="col"
                  style={{ maxWidth: "20%", height: "25px" }}
                  src={Check}
                />
              )}
            </td>

            <td>
              {Number(siteData?.requires_escort) === 0 ? (
                <img
                  className="col"
                  style={{ maxWidth: "20%", height: "20px" }}
                  src={Cancel}
                />
              ) : (
                <img
                  className="col"
                  style={{ maxWidth: "20%", height: "25px" }}
                  src={Check}
                />
              )}
            </td>

            <td>
              {Number(siteData?.out_of_area) === 0 ? (
                <img
                  className="col"
                  style={{ maxWidth: "20%", height: "20px" }}
                  src={Cancel}
                />
              ) : (
                <img
                  className="col"
                  style={{ maxWidth: "20%", height: "25px" }}
                  src={Check}
                />
              )}
            </td>
          </tr>
        </table>

        {/* Site Hours */}
        {compareSiteHours(siteHoursobj, siteHoursData) == false && (<>
        <table className="no-border">
          <tr className="bg-blue no-border">
            <th colSpan={5} className="tbl-title text-left no-border">
              Site Hours
            </th>
          </tr>

          <tr>
            <th>Sunday</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
          </tr>
          <tr>
            <td>
              {getDaySchedule(
                siteHoursData?.sundayopen,
                siteHoursData?.sundayclosed
              )}
            </td>
            <td>
              {getDaySchedule(
                siteHoursData?.mondayopen,
                siteHoursData?.mondayclosed
              )}
            </td>
            <td>
              {getDaySchedule(
                siteHoursData?.tuesdayopen,
                siteHoursData?.tuesdayclosed
              )}
            </td>
            <td>
              {getDaySchedule(
                siteHoursData?.wednesdayopen,
                siteHoursData?.wednesdayclosed
              )}
            </td>
            <td>
              {getDaySchedule(
                siteHoursData?.thrusdayopen,
                siteHoursData?.thrusdayclosed
              )}
            </td>
            <td>
              {getDaySchedule(
                siteHoursData?.fridayopen,
                siteHoursData?.fridayclosed
              )}
            </td>
            <td>
              {getDaySchedule(
                siteHoursData?.saturdayopen,
                siteHoursData?.saturdayclosed
              )}
            </td>
          </tr>
        </table>
        </>)}

        {/* billing */}
        <table className="no-border">
          <tr className="bg-blue no-border">
            <th colSpan={2} className="tbl-title text-left no-border">
              Billing Information
            </th>
            <th colSpan={2} className="tbl-title text-left no-border">
              Shipping Information
            </th>
          </tr>

          <tr>
            <th>Billing Contacts</th>
            <th>Billing Address</th>
            <th>Shipping Contacts</th>
            <th>Shipping Address</th>
          </tr>
          <tr>
            {/* <td>
              <div>
                P:{""} {<span>{billingData?.billing_contact}</span>}{" "}
              </div>
              <div>
                B:{""} {<span>{billingData?.billing_contact}</span>}{" "}
              </div>
            </td> */}
            <td>
              <div>
                {coordinatorData &&
                  coordinatorData.map((CoorD, i1) => {
                    if (CoorD.title === "Billing Coordinator") {
                      return (
                        <span key={i1}>
                          P:{" "}
                          <span
                            onClick={() => {
                              navigate(
                                "/account/" +
                                siteData?.account_id +
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
                          </span>{" "}
                        </span>
                      );
                    } else {
                      // If title doesn't match "Shipping Contact", return null
                      return null;
                    }
                  })}
              </div>
              <div>{coordinatorData &&
                coordinatorData.map((CoorD, i1) => {
                  if (CoorD.title === "Billing Coordinator") {
                    return (
                      <span key={i1}>
                        B:{" "}
                        <span
                          onClick={() => {
                            navigate(
                              "/account/" +
                              siteData?.account_id +
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
                        </span>{" "}
                      </span>
                    );
                  } else {
                    // If title doesn't match "Shipping Contact", return null
                    return null;
                  }
                })}</div>
            </td>

            <td>
              {billingData?.account_billing_info_address1}{" "}
              {billingData?.account_billing_info_address2}{" "}
              {billingData?.account_billing_info_city}{" "}
              {billingData?.account_billing_info_state}{" "}
              {billingData?.account_billing_info_country}{" "}
              {billingData?.account_billing_info_zipcode}
            </td>
            <td>
              <div>
                {coordinatorData &&
                  coordinatorData.map((CoorD, i1) => {
                    if (CoorD.title === "Shipping Contact") {
                      return (
                        <span key={i1}>
                          P:{" "}
                          <span
                            onClick={() => {
                              navigate(
                                "/account/" +
                                siteData?.account_id +
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
                          </span>{" "}
                        </span>
                      );
                    } else {
                      // If title doesn't match "Shipping Contact", return null
                      return null;
                    }
                  })}
              </div>
              <div>{coordinatorData &&
                coordinatorData.map((CoorD, i1) => {
                  if (CoorD.title === "Shipping Contact") {
                    return (
                      <span key={i1}>
                        B:{" "}
                        <span
                          onClick={() => {
                            navigate(
                              "/account/" +
                              siteData?.account_id +
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
                        </span>{" "}
                      </span>
                    );
                  } else {
                    // If title doesn't match "Shipping Contact", return null
                    return null;
                  }
                })}</div>
            </td>
            <td>
              {shippingData?.account_shipping_info_address1}{" "}
              {shippingData?.account_shipping_info_address2}{" "}
              {shippingData?.account_shipping_info_city}{" "}
              {shippingData?.account_shipping_info_state}{" "}
              {shippingData?.account_shipping_info_country}{" "}
              {shippingData?.account_shipping_info_zipcode}
            </td>
          </tr>
        </table>

        {/* AED information */}
        {(aedUnits && aedUnits?.length > 0) && (<>
        <h4 className="heading"> AED Units Owned</h4>
        <table className="border-blue border-b-blue border-r-blue border-l-blue">
          <tbody>
              <>
                {aedUnits
                  .reduce(
                    (rows, key, index) =>
                      (index % 6 == 0
                        ? rows.push([key])
                        : rows[rows.length - 1].push(key)) && rows,
                    []
                  )
                  .map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <tr className="no-border">
                        {row.map((aed, index) => (
                          <th
                            scope="col"
                            width="20%"
                            className="text-center py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                            key={index}
                          >
                            {aed?.brandName} {aed?.modalName}
                          </th>
                        ))}
                        {/* Add empty cells if needed to fill the row */}
                        {row.length < 6 &&
                          Array.from({ length: 6 - row.length }).map(
                            (_, index) => (
                              <th
                                key={`empty_${index}`}
                                className="text-center py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
                              ></th>
                            )
                          )}
                      </tr>
                      <tr className="no-border">
                        {row.map((aed, index) => (
                          <td key={index} className=" py-1 px-2 border-r-blue">
                            <div className="text-center">
                              <img
                                src={AED_IMG_BASE + aed?.modalImage}
                                alt={aed?.modalName}
                                style={{ maxWidth: "100px", marginTop: "20px" }}
                              />
                              <p className="mt-3">Own: {aed?.own}</p>
                            </div>
                          </td>
                        ))}
                        {/* Add empty cells if needed to fill the row */}
                        {row.length < 6 &&
                          Array.from({ length: 6 - row.length }).map(
                            (_, index) => (
                              <td
                                key={`empty_${index}`}
                                className=" py-1 px-2 border-r-blue"
                              ></td>
                            )
                          )}
                      </tr>
                    </React.Fragment>
                  ))}
              </>
            {/* ) : (
              <tr className="bg-blue no-border">
                <td
                  colSpan={5}
                  className="text-center py-1 px-2 bg-tbl-border border-t-blue"
                >
                  No AED units found
                </td>
              </tr>
            )} */}
          </tbody>
        </table>
        </>)}

        {/* Training information */}
        <table className="w-100 no-border">
          <tr className="w-100 bg-blue no-border">
            <th colSpan={3} className=" tbl-title text-left no-border">
              Training Address
            </th>
            <th colSpan={1} className="no-border" style={{textAlign: "end"}}>
              {(user?.user_type == 0 || 
              (user?.user_type == 2 && user?.sub_admin != "" && privileges?.includes("training-new"))) && ( 
              <button
                className="bg-transparent new-btn align-right"
                onClick={() => {
                  navigate(
                    "/account/" +
                    siteData.account_id +
                    "/site/" +
                    siteData.account_site_info_id +
                    "/training/new"
                  );
                }}
              >
                <img src={New} style={{ marginRight: "5px" }} />
                New
              </button>
              )}
            </th>
          </tr>
          <tr>
            <th>
              <span>Company Name</span>
            </th>
            <th style={{ width: "200px" }}>
              <span>Phone Number</span>
            </th>
            <th>
              <span>Address</span>
            </th>
            <th>Actions</th>
          </tr>

          <tr>
            <td className="py-1 px-2 tbl-border ">
              {siteData?.account_site_name}
            </td>
            <td className="py-1 px-2 tbl-border ">
              {siteData?.account_site_phone && (
                <a
                  className="link"
                  style={{textDecoration:"none"}}
                  href={
                    "tel:" +
                    siteData?.account_site_phone_ext +
                    siteData?.account_site_phone
                  }
                >
                  {siteData?.account_site_phone
                    ? formatPhoneNumber(siteData.account_site_phone)
                    : ""}{" "}
                  {siteData?.account_site_phone_ext
                    ? " X " + siteData?.account_site_phone_ext
                    : ""}
                </a>
              )}
            </td>
            <td className="py-1 px-2 tbl-border ">
              {siteData?.account_site_address1}{" "}
              {siteData?.account_site_address2} {siteData?.account_site_city}{" "}
              {siteData?.account_site_state} {siteData?.account_site_country}{" "}
              {siteData?.account_site_zipcode}
            </td>
            <td></td>
          </tr>

          {traningData?.map((d, index) => (
            <tr className="" key={index}>
              <td className="py-1 px-2 tbl-border ">
                {d?.account_alternate_traning_location_company_name}
              </td>
              <td className="py-1 px-2 tbl-border ">
                {d?.alternative_phone && (
                  <a
                    className="link"
                    style={{textDecoration:"none"}}
                    href={
                      "tel:" + d?.alternative_phone + "p" + d?.alternative_ext
                    }
                  >
                    {d?.alternative_phone
                      ? formatPhoneNumber(d.alternative_phone)
                      : ""}{" "}
                    {d?.alternative_ext ? " X " + d?.alternative_ext : ""}
                  </a>
                )}
              </td>
              <td className=" py-1 px-2 tbl-border ">
                {d?.account_alternate_traning_location_address1}
                {d?.account_alternate_traning_location_address2}{" "}
                {d?.account_alternate_traning_location_city}{" "}
                {d?.account_alternate_traning_location_state}{" "}
                {d?.account_alternate_traning_location_country}{" "}
                {d?.account_alternate_traning_location_zipcode}
              </td>
              <td className=" py-1 px-2 tbl-border d-flex">
                <button
                  className="new-btn btn  d-flex edit "
                  onClick={() => {
                    navigate(
                      "/account/" +
                      siteData.account_id +
                      "/site/" +
                      siteData.account_site_info_id +
                      `/${d?.account_alternate_traning_location_id}/training/edit`
                    );
                  }}
                >
                  <img src={Edit} style={{width:"20px", height:"20px"}}/>
                   Edit
                </button>
                <button
                  className="new-btn btn  d-flex delete "
                  onClick={() =>
                    handleDelete(d.account_alternate_traning_location_id)
                  }
                >
                  {TrashIcon}Delete
                </button>
              </td>
            </tr>
          ))}
        </table>

        {/* Coordinator Information */}
        <table className="w-100 no-border mt-3">
          <tr className="no-border">
            <td colSpan={5} className="no-border py-1 tbl-title">
              Coordinator Information
            </td>
          </tr>

          <tr className="">
            {coordinatorData.map((CoorD, index) => (
              (CoorD.title !== "Shipping Contact" && CoorD.title !== "Billing Coordinator") && (
                <th className=" py-1 px-2 tbl-border" key={index}>
                  {CoorD.title}
                </th>
              )
            ))}
          </tr>
          <tr>
            {coordinatorData &&
              coordinatorData.map((CoorD, i1) => (
                (CoorD.title !== "Shipping Contact" && CoorD.title !== "Billing Coordinator") && (
                  <td key={i1}>
                    {" "}
                    P:{" "}
                    <ContactName 
                          url={  
                            "/account/" +
                            siteData?.account_id +
                            "/contact-details/" +
                            (CoorD?.arr?.[0]?.contact_id || CoorD?.arr?.[1]?.contact_id) }

                              locationState={
                                {
                                  state: {
                                    siteTitle:
                                      "Contact : " +
                                      (CoorD?.arr?.[0]?.primary || CoorD?.arr?.[1]?.primary),
                                    editUrl:
                                      "/account/contact-details-edit/" +
                                      (CoorD?.arr?.[0]?.contact_id ||
                                        CoorD?.arr?.[1]?.contact_id),
                                    deleteUrl:
                                      "/account/contact-details-edit/" +
                                      (CoorD?.arr?.[0]?.contact_id ||
                                        CoorD?.arr?.[1]?.contact_id),
                                  },
                                }
                               }
                              name={CoorD?.arr?.[0]?.primary || CoorD?.arr?.[1]?.primary}

                        />
                    {/* <span
                      onClick={() => {
                        navigate(
                          "/account/" +
                          siteData?.account_id +
                          "/contact-details/" +
                          (CoorD?.arr?.[0]?.contact_id || CoorD?.arr?.[1]?.contact_id),
                          {
                            state: {
                              siteTitle:
                                "Contact : " +
                                (CoorD?.arr?.[0]?.primary || CoorD?.arr?.[1]?.primary),
                              editUrl:
                                "/account/contact-details-edit/" +
                                (CoorD?.arr?.[0]?.contact_id ||
                                  CoorD?.arr?.[1]?.contact_id),
                              deleteUrl:
                                "/account/contact-details-edit/" +
                                (CoorD?.arr?.[0]?.contact_id ||
                                  CoorD?.arr?.[1]?.contact_id),
                            },
                          }
                        );
                      }}
                      className="link"
                    >
                      {" "}
                      {CoorD?.arr?.[0]?.primary || CoorD?.arr?.[1]?.primary}
                    </span>{" "} */}
                  </td>
                )
              ))}
          </tr>

          <tr>
            {coordinatorData &&
              coordinatorData.map((CoorD, i1) => (
                (CoorD.title !== "Shipping Contact" && CoorD.title !== "Billing Coordinator") && (
                  <td key={i1}>
                    {" "}
                    B:{" "}
                    <ContactName 
                          url={  
                            "/account/" +
                            siteData?.account_id +
                            "/contact-details/" +
                            CoorD?.arr?.[0]?.contact_id ||
                            CoorD?.arr?.[1]?.contact_id }

                              locationState={{
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
                              } }
                    name={CoorD?.arr?.[0]?.backup || CoorD?.arr?.[1]?.backup}

                        />
                    {/* <span
                      onClick={() => {
                        navigate(
                          "/account/" +
                          siteData?.account_id +
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
                    </span>{" "} */}
                  </td>
                )
              ))}
          </tr>
        </table>
      </div>
    </div>
  );
}

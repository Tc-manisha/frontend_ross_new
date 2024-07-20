import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import SectionHeading from "../../components/common/SectionHeading";
import { AED_IMG_BASE, CallGETAPI } from "../../helper/API";
import {
  AccountContactDetails,
  AccountSiteList,
  DeleteAEDTraningInfomar,
  GroupBYCoordinatorInfo,
  GroupBYSiteCoordinatorInfo,
} from "../../helper/BasicFn";
import { FetchAccountSiteDetails } from "../../helper/BasicFn";
import { FormControlLabel, Icon, Switch } from "@mui/material";
import SubHeading from "../../components/header/SubHeading";
import { AccountStatus, formatPhoneNumber } from "../../helper/Common";
import New from "../../img/New.png";
import { Button } from "react-bootstrap";
import { EditIcon, TrashIcon } from "../../helper/Icons";
// import Swal from 'sweetalert';
import Swal from "sweetalert2";
import TableSkeletonFull from "./skeleton/tableFull/TableSkeletonFull";
import ContactName from "../../components/anchorTags/ContactName";

function SiteDetails({ setShowSidebar }) {
  const { siteId } = useParams();
  const [showLoading, setShowLoading] = React.useState(true);
  const [accountData, setAccountData] = useState({});
  const [CoordiDataList, setCoordiDataList] = useState([]);
  const [siteDataList, setSiteDataList] = useState([]);
  const [siteContactList, setSiteContactList] = useState([]);
  const [siteData, setSiteData] = useState([]);
  const [billingData, setBillingData] = useState("");
  const [shippingData, setShippingData] = useState("");
  const [traningData, setTraningData] = useState([]);
  const [aedUnits, setAedUnits] = useState([]);
  const [coordinatorData, setCoordinatorData] = useState([]);

  const navigate = useNavigate();

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let checkDelete = await DeleteAEDTraningInfomar(id);
        await fetch();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const HandleEditDelete = (type) => {
    if (type == "edit") {
      navigate("/account/site-details-edit/" + siteId);
    }
  };

  const fetch = async () => {
    let data = await FetchAccountSiteDetails(siteId);

    if (data) {
      // setAccountData(data);
      setSiteData(data?.siteData);
      setBillingData(data?.billingData);
      setShippingData(data?.shippingData);
      setTraningData(data?.trainingLocations);

      let CoordiData = GroupBYSiteCoordinatorInfo(data?.cordinatorInformation);
      setCoordinatorData(CoordiData);

      setAedUnits(data?.aed_units);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    (async () => {
      // const siteData = await
      const siteData = await CallGETAPI(
        "account/account-site-details/" + siteId
      );
      if (siteData) {
        setSiteDataList(siteData?.siteData);
      }

      setShowLoading(false);
    })();
  }, []);

  return (
    <>
      {/* loading */}
      {showLoading ? (
        <>
          <div className="showloading">
            <TableSkeletonFull />
          </div>
        </>
      ) : (
        <>
          <div className="mt-4 pb-5" style={{ paddingInline: "45px" }}>
            <SubHeading
              title={siteData?.account_site_name}
              hideNew={true}
              newUrl={"/account/sites/new/" + siteData?.account_id}
              subHeading={true}
              hideHierarchy={true}
              editUrl={"/account/site-details-edit/" + siteId}
              backTab={"Sites"}
            />
            <div className="containerr  site-details-table-section">
              <div className=" ">
                <table className="no-border">
                  <tr className="bg-blue no-border">
                    <th colSpan={4} className="tbl-title text-left no-border">
                      Site Information
                    </th>
                  </tr>
                  <tr>
                    <th>Site Phone</th>
                    <th>Address</th>
                    <th>Call Ahead</th>
                    <th>Site Status</th>
                  </tr>
                  <tr>
                    <td>
                      {siteData?.account_site_phone && (
                        <a
                          className="link"
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
                    <td>
                      {siteData?.account_site_address1}{" "}
                      {siteData?.account_site_address2}{" "}
                      {siteData?.building_name} {siteData?.account_site_city}{" "}
                      {siteData?.account_site_state}{" "}
                      {siteData?.account_site_country}{" "}
                      {siteData?.account_site_zipcode}
                    </td>
                    <td>
                      <div className="">
                        {/* {JSON.stringify(siteData)} */}
                        <FormControlLabel
                          className={""}
                          label=""
                          control={
                            <Switch
                              checked={
                                siteData?.account_site_call_ahead === 1
                                  ? true
                                  : false
                              }
                              color="primary"
                              size="medium"
                              name="account_site_call_ahead"
                              value={true}
                            />
                          }
                        />
                      </div>
                    </td>
                    <td>{siteData?.account_site_status_name}</td>
                  </tr>
                </table>

                {/* billing */}
                <table className="no-border">
                  <tr className="bg-blue no-border">
                    <th colSpan={5} className="tbl-title text-left no-border">
                      Billing Information
                    </th>
                  </tr>

                  <tr>
                    <th>Billing Contact</th>
                    <th>Billing Phone</th>
                    <th>Billing Email</th>
                    <th>Address</th>
                    <th>Invoice ASAP</th>
                  </tr>
                  <tr>
                    <td>{billingData?.billing_contact}</td>
                    <td>
                      {billingData?.account_billing_info_billing_phone && (
                        <a
                          className="link"
                          href={
                            "tel:" +
                            billingData?.account_billing_info_phone_ext +
                            "" +
                            billingData?.account_billing_info_billing_phone
                          }
                        >
                          {billingData?.account_billing_info_billing_phone
                            ? formatPhoneNumber(
                                billingData?.account_billing_info_billing_phone
                              )
                            : ""}
                          {billingData?.account_billing_info_phone_ext
                            ? " X " +
                              billingData?.account_billing_info_phone_ext
                            : ""}
                        </a>
                      )}
                    </td>
                    <td>
                      {billingData?.billing_email && (
                        <a
                          className="link"
                          href={"mailto:" + billingData?.billing_email}
                        >
                          {billingData?.billing_email}
                        </a>
                      )}
                    </td>
                    <td>
                      {siteData?.account_site_address1}{" "}
                      {siteData?.account_site_address2}{" "}
                      {siteData?.account_site_city}{" "}
                      {siteData?.account_site_state}{" "}
                      {siteData?.account_site_country}{" "}
                      {siteData?.account_site_zipcode}
                    </td>
                    <td>
                      <div className="">
                        {billingData?.account_site_call_ahead}
                        <FormControlLabel
                          className={""}
                          label=""
                          control={
                            <Switch
                              checked={
                                billingData?.billing_is_invoice === 1
                                  ? true
                                  : false
                              }
                              color="primary"
                              size="medium"
                              name="billing_is_invoice"
                              readOnly={true}
                              value={true}
                            />
                          }
                        />
                      </div>
                    </td>
                  </tr>
                </table>

                {/* shipping */}
                <table className="no-border">
                  <tr className="bg-blue no-border">
                    <th colSpan={5} className="tbl-title text-left no-border">
                      Shipping Information
                    </th>
                  </tr>

                  <tr>
                    <th>Shipping Contact</th>
                    <th>Shipping Phone</th>
                    <th>Shipping Email</th>
                    <th>Address</th>
                    {/* <th>Invoice ASAP</th> */}
                  </tr>
                  <tr>
                    <td>{shippingData?.shipping_contact}</td>
                    <td>
                      {shippingData?.account_shipping_info_shipping_phone && (
                        <a
                          className="link"
                          href={
                            "tel:" +
                            shippingData?.account_shipping_info_phone_ext +
                            shippingData?.account_shipping_info_shipping_phone
                          }
                        >
                          {shippingData?.account_shipping_info_shipping_phone
                            ? formatPhoneNumber(
                                shippingData?.account_shipping_info_shipping_phone
                              )
                            : ""}{" "}
                          {shippingData?.account_shipping_info_phone_ext
                            ? " X " +
                              shippingData?.account_shipping_info_phone_ext
                            : ""}
                        </a>
                      )}
                    </td>
                    <td>
                      {shippingData?.shipping_email && (
                        <a
                          className="link"
                          href={"mailto:" + shippingData?.shipping_email}
                        >
                          {shippingData?.shipping_email}
                        </a>
                      )}
                    </td>
                    <td>
                      {siteData?.account_site_address1}{" "}
                      {siteData?.account_site_address2}{" "}
                      {siteData?.account_site_city}{" "}
                      {siteData?.account_site_state}{" "}
                      {siteData?.account_site_country}{" "}
                      {siteData?.account_site_zipcode}
                    </td>
                  </tr>
                </table>

                {/* Training information */}
                <table className="no-border">
                  <tr className="bg-blue no-border">
                    <th colSpan={3} className="tbl-title text-left no-border">
                      Training Information
                    </th>
                    <th className="no-border">
                      <button
                        className="bg-transparent new-btn"
                        onClick={() => {
                          navigate(
                            "/account/" +
                              siteData.account_id +
                              "/site/" +
                              siteId +
                              "/training/new"
                          );
                        }}
                      >
                        <img
                          src="../../img/New.png"
                          style={{ marginRight: "5px" }}
                        />{" "}
                        New
                      </button>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <span>Company Name</span>
                    </th>
                    <th style={{ width: "200px" }}>
                      <span>Phone</span>
                    </th>
                    <th>
                      <span>Training Addresses</span>
                    </th>
                    <th></th>
                  </tr>

                  <tr>
                    <td className="py-1 px-2 tbl-border ">
                      {siteData?.account_site_name}
                    </td>
                    <td className="py-1 px-2 tbl-border ">
                      {siteData?.account_site_phone && (
                        <a
                          className="link"
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
                      {siteData?.account_site_address2}{" "}
                      {siteData?.account_site_city}{" "}
                      {siteData?.account_site_state}{" "}
                      {siteData?.account_site_country}{" "}
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
                            href={
                              "tel:" +
                              d?.alternative_phone +
                              "p" +
                              d?.alternative_ext
                            }
                          >
                            {d?.alternative_phone
                              ? formatPhoneNumber(d.alternative_phone)
                              : ""}{" "}
                            {d?.alternative_ext
                              ? " X " + d?.alternative_ext
                              : ""}
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
                                siteId +
                                `/${d?.account_alternate_traning_location_id}/training/edit`
                            );
                          }}
                        >
                          {EditIcon} Edit
                        </button>
                        <button
                          className="new-btn btn  d-flex delete "
                          onClick={() =>
                            handleDelete(
                              d.account_alternate_traning_location_id
                            )
                          }
                        >
                          {TrashIcon}Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </table>

                {/* AED information */}
                <h4 className="heading">AED Information</h4>
                <table className="border-blue">
                  <tbody>
                    {aedUnits?.length > 0 ? (
                      <>
                        <tr className="no-border">
                          {aedUnits?.map((aed, index) => (
                            <th
                              scope="col"
                              width="20%"
                              className="text-center py-1 px-2 bg-tbl-border border-r-blue"
                              key={index}
                            >
                              {aed?.brandName} {aed?.modalName}
                            </th>
                          ))}
                          {aedUnits?.length < 5 && (
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
                        <tr className="bg-blue no-border">
                          {aedUnits?.map((aed, index) => (
                            <td
                              className=" py-1 px-2 border-r-blue"
                              key={index}
                            >
                              <div className="text-center">
                                <img
                                  src={AED_IMG_BASE + aed?.modalImage}
                                  alt={aed?.modalName}
                                  style={{
                                    maxWidth: "100px",
                                    marginTop: "20px",
                                  }}
                                />
                                <p className="mt-3">Own: {aed?.own}</p>
                              </div>
                            </td>
                          ))}

                          {aedUnits?.length < 5 && (
                            <>
                              <td className=" py-1 px-2 border-r-blue"></td>
                              <td className=" py-1 px-2 border-r-blue"></td>
                              <td className=" py-1 px-2"></td>
                            </>
                          )}
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr className="bg-blue no-border">
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
                </table>

                {/* Coordinator Information */}
                <table className="w-100 border border-3 tbl-border no-border mt-3">
                  <tr className="no-border">
                    <td className="no-border py-1 tbl-title">
                      Coordinator Information
                    </td>
                  </tr>

                  <tr className="">
                    {coordinatorData.map((CoorD, index) => (
                      <th
                        className="border border-3 py-1 px-2 tbl-border"
                        key={index}
                      >
                        {CoorD.title}
                      </th>
                    ))}
                  </tr>

                  <tr>
                    {coordinatorData.map((CoorD, i1) => (
                      <td key={i1}>
                        {" "}
                        P:{" "}
                        <ContactName 
                          url={ "/account/" + siteData?.account_id + "/contact-details/" + CoorD?.arr?.[0]?.contact_id || CoorD?.arr?.[1]?.contact_id}

                              locationState={  {
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
                              } }
                              name={CoorD?.arr?.[0]?.primary || CoorD?.arr?.[1]?.primary}
                        />
                       
                      </td>
                    ))}
                  </tr>

                  <tr>
                    {coordinatorData.map((CoorD, i1) => (
                      <td key={i1}>
                        {" "}
                        B:{" "}
                        <ContactName 
                          url={
                            "/account/" +
                              siteData?.account_id +
                              "/contact-details/" +
                              CoorD?.arr?.[0]?.contact_id ||
                              CoorD?.arr?.[1]?.contact_id}
                              locationState={ {
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
                              }}
                              name={CoorD?.arr?.[0]?.backup || CoorD?.arr?.[1]?.backup}
                        />
                      </td>
                    ))}
                  </tr>
                  
                  {/* <tr>
                    {coordinatorData.map((CoorD, i1) => (
                      <td key={i1}>
                        {" "}
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
                      </td>
                    ))}
                  </tr>

                  <tr>
                    {coordinatorData.map((CoorD, i1) => (
                      <td key={i1}>
                        {" "}
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
                      </td>
                    ))}
                  </tr> */}
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SiteDetails;

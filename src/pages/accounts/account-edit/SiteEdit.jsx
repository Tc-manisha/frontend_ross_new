import React, { useState, useEffect } from "react";

import { FormControlLabel, Icon, Switch } from "@mui/material";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";

import Container from "react-bootstrap/Container";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import { FetchDropDowns, ProductsDropDown } from "../../../helper/BasicFn";

import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import SectionHeading from "../../../components/common/SectionHeading";
import { CallGETAPI } from "../../../helper/API";
import SubHeading from "../../../components/header/SubHeading";

const SiteEdit = ({ setShowSidebar }) => {
  const { siteId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_type: 1,
    account_name: "",
    parent_account_id: 0,
    distributor_id: 0,
    customer_type_id: 0,
    industry_id: 0,
    terms_id: 0,
    account_status_id: 0,
    lead_source_id: 0,
    website: "",
    important_note: "",
    product_interest: "",
    contact_status: "",
    restricted_user: 0,
    two_FA: 0,

    account_site_name: "",
    account_site_phone: "0",
    account_site_phone_ext: "0",
    account_site_main_site: "0",
    account_site_call_ahead: 0,
    account_site_status_id: "0",
    account_site_address1: "",
    account_site_address2: " ",
    account_site_city: "",
    account_site_state: "",
    account_site_country: "",
    account_site_zipcode: "0",

    account_billing_info_billing_phone: "0",
    account_billing_info_phone_ext: "0",
    account_billing_info_address1: "",
    account_billing_info_address2: "",
    account_billing_info_city: "",
    account_billing_info_state: "",
    account_billing_info_country: "",
    account_billing_info_zipcode: "0",

    traininglocation: [],

    account_main_contact_salutation: "",
    account_main_contact_firstname: "",
    account_main_contact_middlename: "",
    account_main_contact_lastname: "",
    account_main_contact_suffix: "",
    account_main_contact_title: "",
    account_main_contact_department: "",

    main_contact_phone: [],
    main_contact_email: [],
    account_reps: [],
  });

  const [allDropDowns, setAllDropDowns] = React.useState([]);
  const [ProductModalData, setProductModalData] = useState([]);
  const [accountDetails, setAccountDetails] = useState({});

  const fetchOnload = async () => {
    let ProductResult = await ProductsDropDown();
    if (ProductResult) {
      // setProductDropDown(ProductResult)
      setProductModalData(ProductResult?.products);
    }

    let AllDResult = await FetchDropDowns();
    if (AllDResult) {
      setAllDropDowns(AllDResult);
    }
  };

  const handleInputChange = (e) => {
    setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    (async () => {
      if (!siteId) {
        return;
      }
      // accountId = 45;
      const accountRes = await CallGETAPI(
        `account/account_info_detail/${siteId}`
      );
      const accountData = accountRes?.data?.data?.AccountDetails;
      setAccountDetails(accountData);
    })();

    fetchOnload();
  }, []);

  return (
    <>
      <div className="mt-4" style={{ paddingInline: "45px" }}>
        <SubHeading hideNew hideHierarchy />

        {/* <SectionHeading setShowSidebar={setShowSidebar} title={accountDetails?.account_name} /> */}
        <div className="containerr">
          <form className="">
            <div
              className="container-fluid mt-4 bottom-border-blue"
              style={{
                borderBottom: "4px solid rgb(13, 110, 253)",
                background: "#eee",
              }}
            >
              <div className="row my-4">
                <div className="col-md-2 my-4">
                  <BackButton />
                </div>
                <div
                  className="col-md-10"
                  style={{ marginBottom: "50px", marginTop: "20px" }}
                >
                  <h2 className="text-center">Site Information</h2>
                </div>

                <Form.Group className={"col"}>
                  <Form.Label>Site Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_name"
                    onChange={handleInputChange}
                    required
                  />

                  <Form.Control.Feedback type="invalid">
                    Please Enter Site Name.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Site Phone</Form.Label>
                  <Form.Control
                    type="number"
                    name="account_site_phone"
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className={"col"}>
                  <Form.Label>Phone Ext</Form.Label>
                  <Form.Control
                    type="number"
                    name="account_site_phone_ext"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className={"col-1"}>
                  <b className={""}>Main Site</b>
                  <div className="">
                    <FormControlLabel
                      className={""}
                      label=""
                      control={
                        <Switch
                          color="primary"
                          size="medium"
                          value="1"
                          name="account_site_main_site"
                          onChange={handleInputChange}
                        />
                      }
                    />
                  </div>
                </Form.Group>

                <Form.Group className={"col-1"}>
                  <b className={""}>Call Ahead</b>
                  <div className="">
                    <FormControlLabel
                      className={""}
                      label=""
                      control={
                        <Switch
                          color="primary"
                          size="medium"
                          value="1"
                          name="account_site_call_ahead"
                          onChange={handleInputChange}
                        />
                      }
                    />
                  </div>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Site Status</Form.Label>
                  <Form.Select
                    className={""}
                    name="account_site_status_id"
                    onChange={handleInputChange}
                  >
                    <option value="0" selected>
                      --Select One--
                    </option>
                    {allDropDowns?.siteStatus &&
                      allDropDowns?.siteStatus.map((SS) => (
                        <option value={SS.dropdown_site_status_id}>
                          {SS.dropdown_site_status_name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="row my-4">
                <Form.Group className={"col"}>
                  <Form.Label>Address *</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_address1"
                    onChange={handleInputChange}
                    required
                  />

                  <Form.Control.Feedback type="invalid">
                    Please Enter Address.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Address 2</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_address2"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>City *</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_city"
                    onChange={handleInputChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please Enter City.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>State *</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_state"
                    onChange={handleInputChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please Enter State.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_country"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Zip code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_site_zipcode"
                    onChange={handleInputChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please Enter Zip Code.
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div
              className="container-fluid bottom-border-blue"
              style={{
                borderBottom: "4px solid rgb(13, 110, 253)",
                background: "#eee",
              }}
            >
              <div className="row my-4">
                <div
                  className="col-md-12"
                  style={{ marginBottom: "50px", marginTop: "20px" }}
                >
                  <h2 className="text-center"> Shipping Information</h2>
                </div>

                <Form.Group className={"col"}>
                  <Form.Label>Shipping Phone</Form.Label>
                  <Form.Control
                    type="number"
                    name="account_billing_info_billing_phone"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Phone Ext</Form.Label>
                  <Form.Control
                    type="number"
                    name="account_billing_info_phone_ext"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className={"col-2"}>
                  <b className={""}>Invoice ASAP</b>
                  <div className="">
                    <FormControlLabel
                      className={""}
                      label=""
                      control={
                        <Switch
                          color="primary"
                          size="medium"
                          value="1"
                          name="invoice_asap"
                          onChange={handleInputChange}
                        />
                      }
                    />
                  </div>
                </Form.Group>

                <Form.Group className={"col-2"}>
                  <b className={""}>Same Address</b>
                  <div className="">
                    <FormControlLabel
                      className={""}
                      label=""
                      control={
                        <Switch
                          color="primary"
                          size="medium"
                          value="1"
                          name="same_address"
                          onChange={handleInputChange}
                        />
                      }
                    />
                  </div>
                </Form.Group>
              </div>

              <div className="row my-4">
                <Form.Group className={"col"}>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_billing_info_address1"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Address 2</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_billing_info_address2"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_billing_info_city"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>State *</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_billing_info_state"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_billing_info_coutry"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className={"col"}>
                  <Form.Label>Zip code</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_billing_info_zipcode"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-12 content-flex-right my-4">
                <button
                  className="btn btn-lg btn-danger ml-auto"
                  type="button"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-lg btn-success mx-4">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SiteEdit;

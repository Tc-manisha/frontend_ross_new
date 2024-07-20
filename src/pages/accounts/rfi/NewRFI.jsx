import React from "react";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { FormControlLabel, Switch } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  AccountSiteList,
  GetAccountByContact,
  GetCartAgencyCoursesList,
  GetCertAgencyList,
  GetSitesList,
  GetContactSelectedBySite,
  GetContactListByAccount,
  DecryptToken,
} from "../../../helper/BasicFn";
import { useEffect, useState } from "react";
import MessageHandler from "../../../components/common/MessageHandler";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { prepareOptions } from "../../../helper/Common";
import AedComponent from "../../../components/modals/AED/AedComponent";
import ToogleSwitch from "../../../components/common/toggleSwitch/ToogleSwitch";
import { toast } from "react-toastify";

export default function NewRFI() {
  const navigate = useNavigate();
  const user = DecryptToken();
  const [accountDetails, setAccountDetails] = useState([]);
  const [allSites, setAllSites] = useState([]);
  const [allContactList, setAllContactList] = useState([]);
  const [allCertAgency, setCertAgency] = useState([]);
  const [allCourses, setCourses] = useState([]);
  const [selectedMainContact, setSelectedMainContact] = useState({});
  const [selectedBillingContact, setSelectedBillingContact] = useState({});
  const [selectedInstructorContact, setSelectedInstructorContact] = useState(
    {}
  );
  const [selectedMainContactBackup, setSelectedMainContactBackup] = useState(
    {}
  );
  const [selectedBillingContactBackup, setSelectedBillingContactBackup] =
    useState({});
  const [selectedInstructorContactBackup, setSelectedInstructorContactBackup] =
    useState({});
  const [formData, setFormData] = useState({});
  const [switchValue, setSwitchValue] = useState({});
  const [validated, setValidated] = useState(false);
  const [aedData, setAedData] = useState([]);
  const [loading,setLoading] = useState(false);
  const [validatedField, setValidatedField] = useState({
    site_id: false,
    rfi_send_to: false,
    cert_agency: false,
    course: false,
    training_month: false,
  });
  const [checkValidatedField, setCheckValidatedField] = useState({
    site_id: false,
    rfi_send_to: false,
    cert_agency: false,
    course: false,
    training_month: false,
  });

  const [FormMsg, setFormMsg] = useState({ type: true, msg: "" });

  const { accountId } = useParams();
  const { contactId } = useParams();

  // fetch cart courses
  const fetchCartCourses = async (cartId) => {
    let courses = await GetCartAgencyCoursesList(cartId);

    if (courses.status) {
      let courseListData = courses?.data?.courseList;
      let allcourseListData = prepareOptions(
        courseListData,
        "course_id",
        "course_name"
      );
      setCourses(allcourseListData);
    }
  };

  // filter contact from contact list
  const fetchSelectedContactByContactId = (id) => {
    const contact = allContactList.find((contact) => contact.value == id);

    return contact;
  };

  // fetch object based on contact key
  const filterObjectByKeyAndList = (list, key) => {
    const object = list.find((data) => data.position == key);

    return object;
  };

  // fetch selected contacts by site id
  const fetchSelectedContact = async (siteId) => {
    let selectedContacts = await GetContactSelectedBySite(siteId);

    if (selectedContacts.status) {
      let selectedContactsList = selectedContacts?.data?.siteRepstList;

      let selectMainPrimaryObject = filterObjectByKeyAndList(
        selectedContactsList,
        "Training Coordinator primary"
      );
      let selectedBillingContactPrimaryObject = filterObjectByKeyAndList(
        selectedContactsList,
        "Billing Contact primary"
      );
      let selectedInstructorContactPrimaryObject = filterObjectByKeyAndList(
        selectedContactsList,
        "Instructor Contact primary"
      );
      let selectMainBackupObject = filterObjectByKeyAndList(
        selectedContactsList,
        "Training Coordinator backup"
      );
      let selectedBillingContactBackupObject = filterObjectByKeyAndList(
        selectedContactsList,
        "Billing Contact backup"
      );
      let selectedInstructorContactBackupObject = filterObjectByKeyAndList(
        selectedContactsList,
        "Instructor Contact backup"
      );

      let selectedMainPrimary = fetchSelectedContactByContactId(
        selectMainPrimaryObject?.contact_id
      );
      let selectedBillingContactPrimary = fetchSelectedContactByContactId(
        selectedBillingContactPrimaryObject?.contact_id
      );
      let selectedInstructorContactPrimary = fetchSelectedContactByContactId(
        selectedInstructorContactPrimaryObject?.contact_id
      );
      let selectedMainBackup = fetchSelectedContactByContactId(
        selectMainBackupObject?.contact_id
      );
      let selectedBillingContactBackup = fetchSelectedContactByContactId(
        selectedBillingContactBackupObject?.contact_id
      );
      let selectedInstructorContactBackup = fetchSelectedContactByContactId(
        selectedInstructorContactBackupObject?.contact_id
      );

      setSelectedMainContact(selectedMainPrimary ?? {});
      setSelectedBillingContact(selectedBillingContactPrimary ?? {});
      setSelectedInstructorContact(selectedInstructorContactPrimary ?? {});
      setSelectedMainContactBackup(selectedMainBackup ?? {});
      setSelectedBillingContactBackup(selectedBillingContactBackup ?? {});
      setSelectedInstructorContactBackup(selectedInstructorContactBackup ?? {});

      setFormData((old) => ({
        ...old,
        training_address_information_primary:
          selectedMainPrimary?.value != undefined
            ? selectedMainPrimary?.value
            : 0,
      }));
      setFormData((old) => ({
        ...old,
        billing_contact_primary:
          selectedBillingContactPrimary?.value != undefined
            ? selectedBillingContactPrimary?.value
            : 0,
      }));
      setFormData((old) => ({
        ...old,
        instructor_contact_primary:
          selectedInstructorContactPrimary?.value != undefined
            ? selectedInstructorContactPrimary?.value
            : 0,
      }));
      setFormData((old) => ({
        ...old,
        training_address_information_backup:
          selectedMainBackup?.value != undefined
            ? selectedMainBackup?.value
            : 0,
      }));
      setFormData((old) => ({
        ...old,
        billing_contact_backup:
          selectedBillingContactBackup?.value != undefined
            ? selectedBillingContactBackup?.value
            : 0,
      }));
      setFormData((old) => ({
        ...old,
        instructor_contact_backup:
          selectedInstructorContactBackup?.value != undefined
            ? selectedInstructorContactBackup?.value
            : 0,
      }));
      // setSelectedContacts(selectedContactsList)
    }
  };

  // pass input field value to formdata
  const handleInputChange = (e) => {
    if (e.target.type == "checkbox") {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.checked }));
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
    }
  };

  // handle select change
  const handleSelectChange = (data, key) => {
    setFormData((old) => ({ ...old, [key]: data.value }));

    if (key == "training_address_information_primary") {
      setSelectedMainContact(data);
    } else if (key == "billing_contact_primary") {
      setSelectedBillingContact(data);
    } else if (key == "instructor_contact_primary") {
      setSelectedInstructorContact(data);
    } else if (key == "training_address_information_backup") {
      setSelectedMainContactBackup(data);
    } else if (key == "billing_contact_backup") {
      setSelectedBillingContactBackup(data);
    } else if (key == "instructor_contact_backup") {
      setSelectedInstructorContactBackup(data);
    }

    setValidatedField((old) => ({ ...old, [key]: false }));
    setCheckValidatedField((old) => ({ ...old, [key]: true }));
  };

  // months
  const months = [
    { label: "January", value: "January" },
    { label: "February", value: "February" },
    { label: "March", value: "March" },
    { label: "April", value: "April" },
    { label: "May", value: "May" },
    { label: "June", value: "June" },
    { label: "July", value: "July" },
    { label: "August", value: "August" },
    { label: "September", value: "September" },
    { label: "October", value: "October" },
    { label: "November", value: "November" },
    { label: "December", value: "December" },
  ];

  // fetch all on laod data
  const fetchOnLoad = async () => {
    // fetch accounts details
    const account = await CallGETAPI(
      `account/account_info_detail/${accountId}`
    );

    if (account.status) {
      let accountData = account.data.data.AccountDetails;
      setAccountDetails(accountData);

      let sites = await GetSitesList(accountId);

      if (sites.status) {
        let sitesData = sites?.data?.data?.site_details;
        let allsitesData = prepareOptions(
          sitesData,
          "account_site_info_id",
          "account_site_name"
        );
        setAllSites(allsitesData);
      }

      // fetch accounts details
      let contactLists = await GetContactListByAccount(accountId);

      if (contactLists.status) {
        let contactListsData = contactLists?.data?.data?.contact_list;
        let allcontactListsData = prepareOptions(
          contactListsData,
          "contact_id",
          "contact_name"
        );
        setAllContactList(allcontactListsData);
      }
    }

    // fetch cart agency
    let cart = await GetCertAgencyList();

    if (cart.status) {
      let CertAgencyData = cart?.data?.agenciesList;
      let allCertAgencyData = prepareOptions(
        CertAgencyData,
        "certifying_agency_id",
        "certifying_agency_name"
      );
      setCertAgency(allCertAgencyData);
    }
  };

  // function to submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationsFields = [
      "site_id",
      "rfi_send_to",
      "cert_agency",
      "course",
      "training_month",
    ];

    const promises = validationsFields.map(async (field) => {
      let value = formData[field];
      if (value == undefined || value == "" || value == null) {
        setValidatedField((old) => ({ ...old, [field]: true }));
        setValidated(true);
      } else {
        setValidatedField((old) => ({ ...old, [field]: false }));
        setValidated(false);
      }
    });

    var form = e.currentTarget;
    // call save function after map finished
    Promise.all(promises)
      .then(() => {
        if (form.checkValidity() === false) {
          setValidated(true);
          return;
        }
      })
      .catch((error) => {
        if (form.checkValidity() === false) {
          setValidated(true);
          return;
        }
      });

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    ["site_id", "rfi_send_to", "cert_agency", "course", "training_month"];
    if (
      checkValidatedField?.site_id &&
      checkValidatedField?.rfi_send_to &&
      checkValidatedField?.cert_agency &&
      checkValidatedField?.course &&
      checkValidatedField?.training_month
    ) {
      saveForm();
    }
  };

  // save form
  const saveForm = async () => {
    setLoading(true);
    let payloadData = formData;
    payloadData.account_id = accountDetails.account_id || accountId;
    payloadData.tv_projector = payloadData.tv_projector ? 1 : 0;
    payloadData.dvd_computer = payloadData.dvd_computer ? 1 : 0;
    payloadData.speaker_system = payloadData.speaker_system ? 1 : 0;
    payloadData.covid_policy = payloadData.covid_policy ? 1 : 0;
    payloadData.training_terms = payloadData.training_terms ? 1 : 0;
    payloadData.training_policy = payloadData.training_policy ? 1 : 0;
    payloadData.AEDs = aedData;

    // call the post api function
    let result = await CallPOSTAPI("account/add-rfi", payloadData);
    // setFormMsg({ type: result?.data?.status, msg: result?.data?.data });
    const accID = accountDetails.account_id || accountId;
    if (result?.status) {
       toast.success(result?.data?.data);
      let pathUrl = "";
      if(user?.user_type == 3){
        pathUrl = "/user/Training/" + accID;
      } else {
        pathUrl = "/account-details/" + accID;
      }
      navigate(pathUrl, {
        state: {
          tab: "RFI",
        },
      });
    } else {
      toast.error(result?.data?.data); 
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOnLoad();
  }, []);

  // switchChangeHandle
  const switchChangeHandle = (switchValue, e) => {
    setFormData((old) => ({ ...old, [switchValue?.key]: switchValue?.value }));
  };

  // check for switch value and update values
  useEffect(() => {
    switchChangeHandle(switchValue);
  }, [switchValue]);

  return (
    <>
      <div className="mt-4" style={{ width: "100%", paddingInline: "45px" }}>
        {/* top heading */}
        <SubHeadingOther
          title="New RFI"
          hideNew={true}
          hideHierarchy={true}
          hideInstructor={true}
          subHeading={true}
          bottomLinks={false}
        />

        <Form
          className=""
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
          id="create-new-site-form"
        >
          {/* account info */}
          <div className="form my-3 p-2" style={{ background: "#eee" }}>
            <h2 className="heading">Account Information</h2>
            <div className="row">
              <Form.Group className={"col"} style={{minWidth:"200px"}}>
                <Form.Label>Account Name</Form.Label>
                <p>{accountDetails.account_name}</p>
              </Form.Group>

              <Form.Group className={"col NewRFIField"}>
                <Form.Label>Site *</Form.Label>
                <Select
                  className={validatedField.site_id ? "invalid-select" : ""}
                  options={allSites}
                  onChange={(data) => {
                    handleSelectChange(data, "site_id");
                    fetchSelectedContact(data.value);
                  }}
                  menuPosition={"fixed"}
                />

                {validatedField.site_id && (
                  <div className="invalid">This field is required</div>
                )}
              </Form.Group>

              <Form.Group className={"col NewRFIField"}>
                <Form.Label>RFI Send to *</Form.Label>
                <Select
                  className={validatedField.rfi_send_to ? "invalid-select" : ""}
                  options={allContactList}
                  onChange={(data) => {
                    handleSelectChange(data, "rfi_send_to");
                  }}
                  required
                  menuPosition={"fixed"}
                />

                {validatedField.rfi_send_to && (
                  <div className="invalid">This field is required</div>
                )}
              </Form.Group>
            </div>
          </div>

          {/* primary contact */}
          <div className="form my-3 p-2" style={{ background: "#eee" }}>
            <h2 className="heading">Primary Contact</h2>
            <div className="row">
              <Form.Group className={"col NewRFIField"}>
                <Form.Label>Training Site Coordinator</Form.Label>
                <Select
                  options={allContactList}
                  onChange={(data) => {
                    handleSelectChange(
                      data,
                      "training_address_information_primary"
                    );
                  }}
                  value={selectedMainContact}
                  menuPosition={"fixed"}
                />
              </Form.Group>

              <Form.Group className={"col NewRFIField"}>
                <Form.Label>Billing Contact</Form.Label>
                <Select
                  options={allContactList}
                  onChange={(data) => {
                    handleSelectChange(data, "billing_contact_primary");
                  }}
                  value={selectedBillingContact}
                  menuPosition={"fixed"}
                />
              </Form.Group>

              <Form.Group className={"col NewRFIField"}>
                <Form.Label>Instructor Contact</Form.Label>
                <Select
                  options={allContactList}
                  onChange={(data) => {
                    handleSelectChange(data, "instructor_contact_primary");
                  }}
                  value={selectedInstructorContact}
                  menuPosition={"fixed"}
                />
              </Form.Group>
            </div>
          </div>

          {/* Backup contact */}
          <div className="form my-3 p-2" style={{ background: "#eee" }}>
            <h2 className="heading">Backup Contact</h2>
            <div className="row">
              <Form.Group className={"col NewRFIField"}>
                <Form.Label>Training Site Coordinator</Form.Label>
                <Select
                  options={allContactList}
                  onChange={(data) => {
                    handleSelectChange(
                      data,
                      "training_address_information_backup"
                    );
                  }}
                  value={selectedMainContactBackup}
                  menuPosition={"fixed"}
                />
              </Form.Group>

              <Form.Group className={"col NewRFIField"}>
                <Form.Label>Billing Contact</Form.Label>
                <Select
                  options={allContactList}
                  onChange={(data) => {
                    handleSelectChange(data, "billing_contact_backup");
                  }}
                  value={selectedBillingContactBackup}
                  menuPosition={"fixed"}
                />
              </Form.Group>

              <Form.Group className={"col NewRFIField"}>
                <Form.Label>Instructor Contact</Form.Label>
                <Select
                  options={allContactList}
                  onChange={(data) => {
                    handleSelectChange(data, "instructor_contact_backup");
                  }}
                  value={selectedInstructorContactBackup}
                  menuPosition={"fixed"}
                />
              </Form.Group>
            </div>
          </div>

          {/* course */}
          <div className="form my-3 p-2" style={{ background: "#eee" }}>
            <h2 className="heading">Course</h2>
            <div className="row">
              <Form.Group className={"col NewRFIField"}>
                <Form.Label>Certifying Agency*</Form.Label>
                <Select
                  className={validatedField.cert_agency ? "invalid-select" : ""}
                  options={allCertAgency}
                  onChange={(data) => {
                    handleSelectChange(data, "cert_agency");
                    fetchCartCourses(data.value);
                  }}
                  menuPosition={"fixed"}
                />

                {validatedField.cert_agency && (
                  <div className="invalid">This field is required</div>
                )}
              </Form.Group>

              <Form.Group className={"col NewRFIField"}>
                <Form.Label>Course Name*</Form.Label>
                <Select
                  className={validatedField.course ? "invalid-select" : ""}
                  options={allCourses}
                  onChange={(data) => {
                    handleSelectChange(data, "course");
                  }}
                  menuPosition={"fixed"}
                />

                {validatedField.course && (
                  <div className="invalid">This field is required</div>
                )}
              </Form.Group>

              <Form.Group className={"col NewRFIField"}>
                <Form.Label>Minimum Students*</Form.Label>
                <Form.Control
                  type="text"
                  name="min_student"
                  required
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter Minimum Students.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={"col NewRFIField"}>
                <Form.Label>Training Month*</Form.Label>
                <Select
                  options={months}
                  className={
                    validatedField.training_month ? "invalid-select" : ""
                  }
                  onChange={(data) => {
                    handleSelectChange(data, "training_month");
                  }}
                  menuPosition={"fixed"}
                />

                {validatedField.training_month && (
                  <div className="invalid">This field is required</div>
                )}
              </Form.Group>

              <Form.Group className={"col"}></Form.Group>
            </div>
          </div>

          {/* av equiment */}
          <div className="form my-3 p-2" style={{ background: "#eee" }}>
            <div className="row">
              <div className="col-md-6">
                <h2 className="heading">AV Equipment</h2>
                <div className="row">
                  <Form.Group className={"col"}>
                    <b className={"d-block"}>TV / Projector</b>
                    <span className="d-inline-block mt-10-px">
                      <ToogleSwitch
                        switchKeyValue={formData?.tv_projector}
                        setSwitchValue={setSwitchValue}
                        switchValue={switchValue}
                        switchKey={"tv_projector"}
                      />
                    </span>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <b className={"d-block"}>DVD / Computer</b>
                    <span className="d-inline-block mt-10-px">
                      <ToogleSwitch
                        switchKeyValue={formData?.dvd_computer}
                        setSwitchValue={setSwitchValue}
                        switchValue={switchValue}
                        switchKey={"dvd_computer"}
                      />
                    </span>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <b className={"d-block"}>Speaker System</b>
                    <span className="d-inline-block mt-10-px">
                      <ToogleSwitch
                        switchKeyValue={formData?.speaker_system}
                        setSwitchValue={setSwitchValue}
                        switchValue={switchValue}
                        switchKey={"speaker_system"}
                      />
                    </span>
                  </Form.Group>
                </div>
              </div>
              <div className="col-md-6">
                {/* <h2 className="heading">AEDs</h2> */}
                <AedComponent
                  aedData={aedData}
                  setAedData={setAedData}
                  mode="new"
                />
              </div>
            </div>
          </div>

          {/* av equiment */}
          <div className="form my-3 p-2" style={{ background: "#eee" }}>
            <div className="row">
              <div className="col-md-6">
                <h2 className="heading">Documents</h2>
                <div className="row">
                  <Form.Group className={"col"}>
                    <b className={"d-block"}>Covid Policy</b>
                    <span className="d-inline-block mt-10-px">
                      <ToogleSwitch
                        switchKeyValue={formData?.covid_policy}
                        setSwitchValue={setSwitchValue}
                        switchValue={switchValue}
                        switchKey={"covid_policy"}
                      />
                    </span>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <b className={"d-block"}>Training Terms</b>
                    <span className="d-inline-block mt-10-px">
                      <ToogleSwitch
                        switchKeyValue={formData?.training_terms}
                        setSwitchValue={setSwitchValue}
                        switchValue={switchValue}
                        switchKey={"training_terms"}
                      />
                    </span>
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <b className={"d-block"}>Training Policy</b>
                    <span className="d-inline-block mt-10-px">
                      <ToogleSwitch
                        switchKeyValue={formData?.training_policy}
                        setSwitchValue={setSwitchValue}
                        switchValue={switchValue}
                        switchKey={"training_policy"}
                      />
                    </span>
                  </Form.Group>
                </div>
              </div>
            </div>
          </div>

          {/* alert msg */}
          <div className="my-4">
            <MessageHandler
              status={FormMsg.type}
              msg={FormMsg.msg}
              HandleMessage={setFormMsg}
            />
          </div>

          {/* bottom buttons */}
          <div className="row my-4">
            <div className="col-12 content-flex-right">
              <button
                className="btn btn-danger text-uppercase"
                type="button"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-success text-uppercase ms-2"
                type="submit"
                disabled={loading}
              >
                {loading?'Loading...':'Submit'}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}

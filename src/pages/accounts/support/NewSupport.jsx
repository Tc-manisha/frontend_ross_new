import React, { useEffect } from "react";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import { useState } from "react";
import Select from "react-select";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import MessageHandler from "../../../components/common/MessageHandler";
import {
  FormatDate,
  prepareOptions,
  relatedToListData,
} from "../../../helper/Common";
import { toast } from "react-toastify";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CommonDatePicker from "../../../components/common/date-picker/CommonDatePicker";
import { DecryptToken } from "../../../helper/BasicFn";

export default function NewSupport() {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    account_id: "",
    contact_id: "",
    issue_type: "",
    assign_to: "",
    related_to: "",
    relation: "",
    due_date: "",
    issue: "",
  });
  const [selectedData, setSelectedData] = useState({});
  const [relatedToList, setRelatedToList] = useState(relatedToListData);
  const [issueTypeList, setIssueTypeList] = useState([
    { label: "Issue 1", value: "1" },
  ]);
  /***    { label: 'Issue 1', value: '1' },
        { label: 'Issue 2', value: '2' },
        { label: 'Issue 3', value: '3' },
     */
  /**    { label: 'Contact 1', value: '1' },
        { label: 'Contact 2', value: '2' },
        { label: 'Contact 3', value: '3' },
     */
  const [assignedToList, setAssignedToList] = useState([]);
  const [FormMsg, setFormMsg] = React.useState({ type: true, msg: "" });

  const navigate = useNavigate();
  const { accountId, accountName } = useParams();
  const { contactId, contactName } = useParams();
  const user = DecryptToken();
  console.log({user})
  const { siteId, siteName } = useParams();
  const location = useLocation();
  // console.log(accountName);
  // handle input change
  const handleInputChange = (e) => {
    setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  // handle select change
  const handleSelectChange = (data, key) => {
    setSelectedData((old) => ({
      ...old,
      [key]: {
        label: data.label,
        value: data.value,
      },
    }));
    setFormData((old) => ({ ...old, [key]: data.value }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData?.issue_type == "" || formData?.assign_to !== "") {
      setValidated(true);
    }

    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    // save the form data
    saveData();
  };
  const [loading, setLoading] = useState(false);
  const saveData = async (e) => {
    setLoading(true);
    let payLoadData;
    console.log(location);
    if (location.state.type === "Support") {
      payLoadData = {
        account_id: location?.state?.accountId,
        contact_id: location?.state?.contactId,
        site_id: location?.state?.siteId,
        inperson_id: location?.state?.inpersonId,
        aed_id: location?.state?.aedId,
        issue_type: formData?.issue_type ?? 1,
        assign_to: formData?.assign_to ?? 1,
        related_to: location?.state?.type ?? 1,
        relation: "",
        due_date: formData?.due_date ?? "",
        issue: formData?.issue ?? "",
      };
    } else {
      payLoadData = {
        account_id: location?.state?.accountId,
        contact_id: location?.state?.contactId,
        issue_type: formData?.issue_type ?? 1,
        assign_to: formData?.assign_to ?? 1,
        related_to: location?.state?.type ?? 1,
        relation: location?.state?.support_name ?? "",
        due_date: formData?.due_date ?? "",
        issue: formData?.issue ?? "",
        owner_name: formData?.owner_name ?? "",
        status: 1,
        site_id: location?.state?.site_id ?? 0,
        inperson_id: location?.state?.inperson_id ?? 0,
        aed_id: location?.state?.aed_id ?? 0,
      };
    }
    // console.log({payLoadData});
    // return "";
    let result = await CallPOSTAPI("support/create-ticket", payLoadData);
    setFormMsg({ type: result?.data?.status, msg: result?.data?.message });
    setLoading(false);
    if (result?.data?.status) {
      toast.success("Ticket Added Successfully");
      let redirectUrl = "";
      if(user?.user_type == 3 || (user?.user_type == 2 && user?.sub_admin == "")){
         redirectUrl = "/user/Details/" + accountId;
      } else {
         redirectUrl = "/account-details/" + payLoadData?.account_id;
      }
      if (location?.state?.type == "account") {
        let pathUrl = "";
        if((user?.user_type == 2 && user?.sub_admin == "") || user?.user_type == 3){
          pathUrl= "/user/Details/" + accountId;
        }  else {
          pathUrl = "/account-details/" + location?.state?.accountId;
        }      
        console.log(pathUrl);
        navigate(pathUrl, {
          state: {
            tab: "Support",
            type: result?.data?.status,
            msg: result?.data?.msg,
          },
        });
      } else if (payLoadData?.site_id) {
        navigate("/account/site-details/" + payLoadData?.site_id, {
          state: {
            tab: "Support",
            type: result?.data?.status,
            msg: result?.data?.msg,
          },
        });
      } else {
        console.log("globalpath")
        navigate(redirectUrl, {
          state: {
            tab: "Support",
            type: result?.data?.status,
            msg: result?.data?.msg,
          },
        });
      }
    } else {
      toast.error("Something went wrong please try again");
    }
  };

  // fetch on load
  const fetchOnLoad = async () => {
    const result = await CallGETAPI("support/all-issues-type");

    if (result?.status) {
      const issueTypes = result?.data?.issuesList;
      const allIssueTypes = prepareOptions(
        issueTypes,
        "issue_id",
        "issue_name"
      );
      setIssueTypeList(allIssueTypes);
    }
  };

  useEffect(() => {
    fetchOnLoad();
  }, []);

  // pass location value
  const passLocation = async (state) => {
    // console.log(state.type);
    if (state?.type == "account") {
      setFormData((old) => ({
        ...old,
        ["relation"]: "Account: " + state?.accountName,
        ["related_to"]: "Account",
      }));
      setSelectedData((old) => ({
        ...old,
        ["related_to"]: {
          label: "Account",
          value: "Account",
        },
      }));
    } else if (state?.type == "contacts") {
      setFormData((old) => ({
        ...old,
        ["relation"]: "Contacts: " + state?.contactName,
        ["related_to"]: "Contacts",
      }));
      setSelectedData((old) => ({
        ...old,
        ["related_to"]: {
          label: "Contacts",
          value: "Contacts",
        },
      }));
    } else if (state?.type == "site") {
      setFormData((old) => ({
        ...old,
        ["relation"]: "Site: " + state?.siteName,
        ["related_to"]: "Site",
      }));
      setSelectedData((old) => ({
        ...old,
        ["related_to"]: {
          label: "Site",
          value: "Site",
        },
      }));
    } else {
      setFormData((old) => ({
        ...old,
        ["relation"]: "Contact: " + state?.contactId,
        ["related_to"]: "Contact",
      }));
      setSelectedData((old) => ({
        ...old,
        ["related_to"]: {
          label: "Contact",
          value: "Contact",
        },
      }));
    }
  };

  useEffect(() => {
    console.log({ location });
    if (location?.state) {
      passLocation(location?.state);
    }
  }, []);

  // prepare owner name data
  const prepareOwnerName = (data) => {
    setFormData((old) => ({ ...old, ["owner_name"]: data?.label }));
  };

  // prepare owner name data
  const fetchAssignToList = async (issue) => {
    const result = await CallGETAPI("support/assign-by-issues/" + issue?.value);

    if (result?.status) {
      const assignToList = result?.data?.contactList;
      assignToList.map((contact) => {
        contact.owner_name =
          contact?.account_main_contact_firstname +
          " " +
          contact.account_main_contact_lastname;
      });
      const allAssignToList = prepareOptions(
        assignToList,
        "account_main_contact_id",
        "owner_name"
      );
      setAssignedToList(allAssignToList);
    }
  };

  // calendar icon
  const calendarIcon = () => {
    return <img src="/calendar.svg" alt="calendar" />;
  };

  // handle calendar change
  const handleCalendarChange = (name, date) => {
    let dateValue = null;
    if (date) {
      // setValidatedContract(false);
      // const formattedDate = dayjs(date).format("MM/DD/YYYY");
      const formattedDate = date ? FormatDate(date) : "";
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedDate,
      }));
    }
  };

  return (
    <>
      <div className="mt-4" style={{ width: "100%", paddingInline: "45px" }}>
        <SubHeadingOther
          hideNew="tab"
          title={
            "New Support Ticket : " +
            location?.state?.type +
            " " +
            location?.state?.support_name
          }
          newUrl=""
          subHeading={true}
          hideHierarchy={true}
          bottomLinks={false}
        />

        {/* main form */}
        <Form
          className=""
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
          id="create-edit-support-form"
        >
          <div className="containerr">
            <div className="">
              <div
                className="container-fluid mt-4 bottom-border-blue pt-2"
                style={{
                  borderBottom: "4px solid rgb(13, 110, 253)",
                  background: "#eee",
                }}
              >
                <h2 className="heading">General Information</h2>

                <div className="row my-3">
                  <Form.Group className={"col"}>
                    <Form.Label>Issue Type*</Form.Label>
                    <Select
                      value={selectedData?.issue_type}
                      options={issueTypeList}
                      onChange={(data) => {
                        handleSelectChange(data, "issue_type");
                        fetchAssignToList(data);
                      }}
                      required
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          borderColor:
                            validated && formData?.issue_type === ""
                              ? "#DC3545"
                              : "transparent",
                          "&:hover": {
                            borderColor: state.isFocused
                              ? provided.borderColor
                              : "transparent",
                          },
                        }),
                      }}
                    />
                    {validated && formData?.issue_type == "" && (
                      <>
                        <p className="invalid">This field is required</p>
                      </>
                    )}
                  </Form.Group>

                  <Form.Group className={"col"}>
                    <Form.Label>Assigned to*</Form.Label>
                    <Select
                      value={selectedData?.assign_to}
                      options={assignedToList}
                      onChange={(data) => {
                        handleSelectChange(data, "assign_to");
                        prepareOwnerName(data);
                      }}
                      required
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          borderColor:
                            validated && formData?.assign_to === ""
                              ? "#DC3545"
                              : "transparent",
                        }),
                      }}
                    />
                    {validated && formData?.assign_to == "" && (
                      <>
                        <p className="invalid">This field is required</p>
                      </>
                    )}
                  </Form.Group>

                  {/* <Form.Group className={ "col" }>
                                        <Form.Label>Related to</Form.Label>
                                        <Select
                                            value={selectedData?.related_to}
                                            options={ relatedToList }
                                            onChange={ (data) => { handleSelectChange(data, 'related_to') } }
                                        />
                                    </Form.Group> */}

                  {/* <Form.Group className={ "col" }>
                                        <Form.Label>Relation</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="relation"
                                            value={ formData?relation}
                                            onChange={ handleInputChange }
                                        />
                                    </Form.Group> */}

                  <Form.Group
                    className={"col"}
                    style={{ minWidth: "490px", marginRight: "2px" }}
                  >
                    <Form.Label>Due Date</Form.Label>
                    <div
                    style={{maxWidth:"200px"}}
                      className={
                        validated.due_date
                          ? "d-flex align-items-center calendar-input-btn invalid-datepicker-div"
                          : "d-flex align-items-center calendar-input-btn"
                      }
                    >

                      <CommonDatePicker
                        calName={"due_date"}
                        CalVal={
                          formData?.due_date
                            ? FormatDate(formData?.due_date)
                            : null
                        }
                        HandleChange={(name, val) =>
                          handleCalendarChange(name, val)
                        }
                        disabled={false}
                      />
                    </div>
                  </Form.Group>
                </div>

                <div className="row my-4">
                  <Form.Group className={"col"}>
                    <Form.Label>Issue*</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="issue"
                      value={formData?.issue}
                      onChange={handleInputChange}
                      required
                      rows={5}
                    />

                    <Form.Control.Feedback type="invalid">
                      This field is required
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                {/* message */}
                <div className="my-5">
                  <MessageHandler
                    status={FormMsg.type}
                    msg={FormMsg.msg}
                    HandleMessage={setFormMsg}
                  />
                </div>

                {/* bottom buttons */}
                <div className="row pb-3">
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
                      {loading ? "Loading..." : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}

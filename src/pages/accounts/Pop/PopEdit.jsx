import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import Contacts from "../../../img/Contacts.svg";
import Locations from "../../../img/Locations.svg";
import CustomToggleButton from '../../../components/common/toggleSwitch/CustomToggleButton';
import AddContactsmodal from './AddContactspage';
import AddSitesmodal from './AddSitesPage';
import { CallGETAPI, CallPOSTAPI } from '../../../helper/API';
import { ContactList } from '../../../helper/BasicFn';
import { toast } from 'react-toastify';
import AddContactsmodalNew from './AddContactsmodalNew';
import Loading from "../../accounts/Loading";

const PopEdit = () => {
  const { pop_id, accountId } = useParams();
  const [validated, setValidated] = useState(false);
  const [addSitesModal, setAddSitesModal] = useState(false);
  const [addContactsModal, setAddContactsModal] = useState(false);
  const [selectedSites, setSelectedSites] = useState([]);
  const [popDetails, setPopDetails] = useState("");
  const [sitesDetails, setSitesDetails] = useState([]);
  const [contractOfficer, setContractOfficer] = useState([]);
  const [contractOfficerRep, setContractOfficerRep] = useState([]);
  const [otherReps, setOtherReps] = useState([]);
  const [accountContact, setAccountContact] = useState([]);
  const [isActive, setIsActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isInvoicePaid, setIsInvoicePaid] = useState(0);
  const navigate = useNavigate();
  const [accountName, setAccountName] = useState('')
  const [loading2, setLoading2] = useState(true)

  const [status, setStatus] = useState(() => {
    if (popDetails.status === 0) {
      return 'inactive';
    } else if (popDetails.status === 1) {
      return 'active';
    } else {
      return 'cancelled';
    }
  });
  const [selectedContact, setSelectedContacts] = useState({
    contract_officer: [],
    contracting_officer_rep: [],
    other_reps: [],
  });
  const [formData, setFormData] = useState({});

  const fetchOnLoad = async () => {
    const response = await CallGETAPI(`account/pop-details/${pop_id}`);
    const data = response?.data?.data || [];
    console.log({ data });

    if (data.popDetails) {
      const PopDetails = data.popDetails;
      const obj = {
        qb_invoice: PopDetails?.qb_invoice,
        invoice_paid: PopDetails?.invoice_paid,
        active: PopDetails?.active,
        status: PopDetails?.status,
      }
      setIsActive(PopDetails?.active);
      setIsInvoicePaid(PopDetails?.invoice_paid);
      setFormData(obj);
      setPopDetails(PopDetails);
    }
    if (data.siteNames) {
      const sitesDetails = data.siteNames;
      console.log({ sitesDetails });
      setSitesDetails(sitesDetails);
    }
    if (data.popDetails) {
      const contactData = JSON.parse(data.popDetails.contact);
      setSelectedContacts(contactData);
      const contractOfficer = contactData.contract_officer;
      const contractOfficerRep = contactData.contracting_officer_rep;
      const otherReps = contactData.other_reps;
      setContractOfficer(contractOfficer);
      setContractOfficerRep(contractOfficerRep);
      setOtherReps(otherReps);
    }

  }

  useEffect(() => {
    fetchOnLoad();
    getAccountName()
  }, [])

  const fetchContactByAccount = async () => {
    let AccountContactList = await ContactList(accountId)

    if (AccountContactList) {
      setAccountContact(AccountContactList)
    }
  }
  useEffect(() => {
    fetchContactByAccount();
  }, []);

  const addSites = () => {
    setAddSitesModal(true)
  }

  const addContacts = () => {
    setAddContactsModal(true)
  }

  const handlePaidToggle = () => {
    setIsInvoicePaid(isInvoicePaid === 0 ? 1 : 0);
  };

  const handleActiveToggle = () => {
    setIsActive(isActive === 0 ? 1 : 0);
  };


  // useEffect(() => {
  //   // Update siteDetails state when selectedSites changes
  //   setSitesDetails((prevSiteDetails) => [...prevSiteDetails, ...selectedSites]);
  // }, [selectedSites]);

  useEffect(() => {
    // Assuming selectedContact is an object
    const { contract_officer, contracting_officer_rep, other_reps } = selectedContact;

    // Merge the values of contractOfficer
    setContractOfficer((prevContractOfficer) => ({
      ...prevContractOfficer,
      ...contract_officer,
    }));

    setContractOfficerRep(contracting_officer_rep);
    setOtherReps(other_reps);
  }, [selectedContact]);


  // Handle form field changes
  const handleChange = async (e, fieldName) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const checContact = selectedContact?.contract_officer?.length > 0 || selectedContact?.contracting_officer_rep?.length > 0 || selectedContact?.other_reps?.length > 0;

    if (
      // !formData.contractType ||
      // !formData.popType ||
      !checContact ||
      !sitesDetails
      // ||  !selectedPlanType 
    ) {
      toast.error('Fill all required fields');
      setValidated(true);
      return;
    }
    saveForm();
  };

  const saveForm = async () => {
    const sites = sitesDetails.map(item => item.account_site_info_id);
    const contacts = selectedContact;
    const payload = {
      "pop_id": popDetails?.pop_id,
      "qb_invoice": formData?.qb_invoice,
      "invoice_paid": isInvoicePaid,
      "active": isActive,
      "status": formData?.status,
      "contact": contacts,
      "sites": sites.toString()
    }
    // console.log({payload});
    // return "";
    const res = await CallPOSTAPI('account/update-pop', payload);
    if (res.data.status) {
      toast.success(res.data.msg);
      navigate(-1);
    } else {
      toast.error(res.data.msg);
    }
  }

  const getAccountName = async () => {
    const response = await CallGETAPI(`account/account_info_detail/${accountId}`)
    if (response?.status) {
      setAccountName(response?.data?.data?.AccountDetails?.account_name)
    }
    setLoading2(false);
  }

  return (
    <>
    {loading2 ?
      <>
        <div className="showloading">
          <Loading />
        </div>
      </>
        :
      <div className="mt-4" style={{ width: "100%", paddingInline: "45px" }}>

        <SubHeadingOther title={`Account: ${accountName}`} hideNew={true} hideHierarchy={true} hideInstructor={true} subHeading={true} bottomLinks={false} />

        <Form
          className=""
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
          id="create-new-equipment-form"
        >

          <div className="container-fluid mt-4 bottom-border-blue pt-2"
            style={{
              borderBottom: "4px solid rgb(13, 110, 253)",
              background: "#eee",
              paddingBottom: "20px"
            }}
          >
            <h2 className="heading">Period of Performance Information</h2>

            <div className='row' style={{ display: "flex", justifyContent: "flex-start" }}>

              <Form.Group className={"col"} style={{ maxWidth: "20%" }}>
                <Form.Label>QB Invoice #</Form.Label>
                <Form.Control
                  type="text"
                  name="qb_invoice"
                  value={formData?.qb_invoice}
                  onChange={(e) => handleChange(e, 'qb_invoice')}
                />
              </Form.Group>

              <div className={"col"} style={{ display: "flex", flexDirection: "column", maxWidth: "150px" }}>
                <Form.Label>Paid</Form.Label>
                <CustomToggleButton
                  ToggleName="isInvoicePaid"
                  ToggleValue={isInvoicePaid}
                  changeHandler={handlePaidToggle}
                  style={{ height: "7px" }} />
              </div>

              <div className={"col"} style={{ display: "flex", flexDirection: "column", maxWidth: "150px" }}>
                <Form.Label>Activate Plan</Form.Label>
                <CustomToggleButton
                  ToggleName="active"
                  ToggleValue={isActive}
                  changeHandler={handleActiveToggle}
                  style={{ height: "7px" }} />
              </div>

              <Form.Group className={"col"} style={{ maxWidth: "20%" }}>
                <Form.Label>Status</Form.Label>
                <select id="brandDropdown" className="form-control"
                  type="text"
                  name="status"
                  value={formData?.status}
                  onChange={(e) => handleChange(e, 'status')}
                  required
                  style={{}}
                >
                  <option value='0'>inactive</option>
                  <option value='1'>Active</option>
                  <option value='2'>Cancelled</option>
                </select>
                <Form.Control.Feedback type="invalid">
                  This field is required
                </Form.Control.Feedback>
              </Form.Group>

            </div>


            <div className="row py-3">
              <Form.Group className="col" >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Form.Label >Contacts*</Form.Label>
                  <button style={{ border: "none" }} onClick={() => addContacts(true)} type="button">
                    <img src={Contacts} alt="" />
                    <Form.Label style={{ color: "rgb(12, 113, 195)", fontFamily: "Calibri", fontStyle: "normal", marginLeft: "3px", cursor: "pointer" }}>Contacts</Form.Label>
                  </button>
                </div>

                {addContactsModal && (
                  <AddContactsmodalNew
                    addContactsModal={addContactsModal}
                    setAddContactsModal={setAddContactsModal}
                    accountId={accountId}
                    accountContact={accountContact}
                    selectedContact={selectedContact}
                    setSelectedContacts={setSelectedContacts}
                  />
                )}




                <div className="data-table  col-md-12 bg-white " style={{ height: '150px' }} >
                  <table className="w-100 border-gray" style={{ height: '150px' }}>
                    <thead>
                      <tr className="">
                        <th scope='col' width="33%" className=" py-2 px-2 bg-tbl-border border-r-blue">
                          Contract Officer
                        </th>
                        <th scope='col' width="33%" className=" py-2 px-2 bg-tbl-border border-r-blue">
                          Contract Officer Rep
                        </th>
                        <th scope='col' width="33%" className=" py-2 px-2 bg-tbl-border">Other Rep</th>
                      </tr>
                    </thead>
                    <tbody className="odd-even-row">

                      <tr>
                        {/* <td className='py-2 px-2 bg-tbl-border border-r-blue'>{selectedContact?.contract_officer?.contact_name}</td>
                  <td className='py-2 px-2 bg-tbl-border border-r-blue'>{selectedContact?.contracting_officer_rep?.contact_name}</td>
                  <td className='py-2 px-2 bg-tbl-border'>{selectedContact?.other_reps?.contact_name}</td> */}

                        <td className='py-2 px-2 bg-tbl-border border-r-blue'>{selectedContact?.contract_officer.map((it, i) => (
                          <div key={i}>{it?.contact_name}</div>
                        ))}
                        </td>
                        <td className='py-2 px-2 bg-tbl-border border-r-blue'>{selectedContact?.contracting_officer_rep.map((it, i) => (
                          <div key={i}>{it?.contact_name}</div>
                        ))}
                        </td>
                        <td className='py-2 px-2 bg-tbl-border'>{selectedContact?.other_reps.map((it, i) => (
                          <div key={i}>{it?.contact_name}</div>
                        ))}
                        </td>

                      </tr>
                    </tbody>
                  </table>
                </div>


                <Form.Control.Feedback type="invalid">
                  This field is required
                </Form.Control.Feedback>
              </Form.Group>



              <Form.Group className={"col"}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Form.Label style={{ marginRight: "560px" }}>Sites*</Form.Label>
                  <button style={{ border: "none", cursor: "pointer" }} onClick={() => addSites()} type="button">
                    <img src={Locations} alt="" />
                    <Form.Label style={{ color: "rgb(12, 113, 195)", fontFamily: "Calibri", fontStyle: "normal", marginLeft: "3px", cursor: "pointer" }}>Sites</Form.Label>
                  </button></div>



                <div className="bg-white" >
                  <ul className='mt-2'
                    style={{ height: '150px', overflow: 'auto', listStyle: 'none', paddingLeft: '10px' }}>
                    {sitesDetails.map((site, index) => (
                      <li key={index} className='list-item mt-2 pl-1'>
                        <span>{site.account_site_name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* {showSitesError && (
    <div className="invalid mt-2">
      This field is required.
    </div>
)} */}

              </Form.Group>
            </div>

            {addSitesModal && (
              <AddSitesmodal
                addSitesModal={addSitesModal}
                setAddSitesModal={setAddSitesModal}
                selectedSites={selectedSites}
                setSelectedSites={setSelectedSites}
                accountId={accountId}
                is_edit={true}
                editSites={sitesDetails}
                setEditSites={setSitesDetails}
              />
            )}
          </div>

          {/* bottom buttons */}
          <div className="row pb-3 py-5" >
            <div className="col-12 content-flex-right" >
              <button className="btn btn-danger text-uppercase" type="button" onClick={() => {
                navigate(-1);
              }}>Cancel</button>
              <button className="btn btn-success text-uppercase ms-2" type="submit"
                disabled={loading}
              >{loading ? "Loading..." : "Submit"}</button>
            </div>
          </div>


        </Form>
      </div>
    }
    </>
  )
}

export default PopEdit;
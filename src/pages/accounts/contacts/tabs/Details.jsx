import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { GetAccountContactList } from '../../../../helper/BasicFn';
import { useParams } from 'react-router-dom';
import { ContactStatus, FormatDate, FormatDateWithTime, formatPhoneNumber } from '../../../../helper/Common';
import { CallGETAPI, CallGETAPINEW } from '../../../../helper/API';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSquare, faHome, faPhoneFlip, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Container } from 'react-bootstrap';
import Moment from 'react-moment';

export default function Details() {

    const { contactId } = useParams()

    const [MainEmail, setMainEmail] = useState("")
    const [MainPhone, setMainPhone] = useState("")
    const [AccountRoles, setAccountRoles] = useState([])
    const [SiteRoles, setSiteRoles] = useState([])
    const [formData, setFormData] = useState({
        contact_details: {},
        isUser: "",
        phone_numbers: [],
        emails: [],
        account_information: {},
        site_information: {},

    });

    console.log({formData})

    // fetch country
    const fetchCountryAndState = async(id, stateId) => {
        const results = await CallGETAPI('account/get-state-by-country/' + id)
        if(results?.status) {
            let states = results?.data?.state;
            return states.find(
                (state) => state.state_id == stateId
            );
        }
    }

    const fetch = async () =>
    {
        let data = await GetAccountContactList(contactId);

        if (data)
        {
            let allData = data?.data?.data
            let contactDetails = allData?.contact_details
            if(contactDetails?.contact_state && contactDetails?.contact_country) {
                let state =  await fetchCountryAndState(contactDetails?.contact_country, contactDetails?.contact_state);
                contactDetails.contact_state_name = state?.state_name
            }

            setFormData(allData);
            setSiteRoles(data?.data?.data?.site_information?.site_roles);
            setAccountRoles(data?.data?.data?.account_information.account_roles);
            setMainEmailData(data?.data?.data?.emails);
            setMainPhoneData(data?.data?.data?.phone_numbers);
        }
    }

    function setMainEmailData(data)
    {
        data.map((item, index) => {
            if (item.account_main_contact_email_main == 1)
            {
                setMainEmail(item.account_main_contact_email);
            }
        })
    }

    function setMainPhoneData(data)
    {
        data.map((item, index) => {
            if (item.account_main_contact_phone_main == 1)
            {
                setMainPhone({
                    phone: item.account_main_contact_phone,
                    ext: item.account_main_contact_phone_ext,
                });
            }
        })
    }

    useEffect(() =>
    {
        fetch()
    }, [])

  return (
    <div className='relative'>
        {/* general information */}
        <div className="general-info pt-1">
            {/* heading */}
            <Box className="text-left">
                <h4 className='heading'>General Information</h4>
            </Box>

            {/* table */}
            <table className="w-100">
                <thead>
                    <tr className="">
                        <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Title</th>
                        <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Department</th>
                        <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Main Phone</th>
                        <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Main Email</th>
                        <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">User</th>
                        <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Training OptOut</th>
                        <th className="border border-2 py-1 px-2 bg-tbl-border border-t-blue">Contact Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="">
                    <td className="border border-2 py-1 px-2 border-r-blue">
                        {formData?.contact_details?.account_main_contact_title}
                    </td>
                    <td className="border border-2 py-1 px-2 border-r-blue">
                        {formData?.contact_details?.account_main_contact_department}
                    </td>
                    <td className="border border-2 py-1 px-2 border-r-blue">
                        {MainPhone?.phone && (
                            <a className="link" style={{textDecoration:"none"}} href={ 'tel:' + MainPhone?.phone + 'p' + MainPhone?.ext }>
                                <FontAwesomeIcon icon={faPhone} style={{maxWidth:'20px', marginRight: '6px'}} />
                                { MainPhone?.phone ? formatPhoneNumber(MainPhone.phone) : '' } {MainPhone?.ext ? ' X ' + MainPhone?.ext : ''}
                            </a>
                        )}
                    </td>
                    <td className="border border-2 py-1 px-2 border-r-blue">
                        {MainEmail && (
                            <a className="link" style={{textDecoration:"none"}} href={ 'mailto:' + MainEmail }>
                                <FontAwesomeIcon icon={faEnvelope} style={{maxWidth:'20px', marginRight: '6px'}} />
                                { MainEmail }
                            </a>
                        )}
                    </td>
                    <td className="border border-2 py-1 px-2 border-r-blue">
                        {formData.isUser ? <>
                            <CheckIcon color={'success'}/>
                        </> : <>
                            <CloseIcon color={'error'}/>
                        </>}
                    </td>
                    <td className="border border-2 py-1 px-2 border-r-blue">
                        {formData?.contact_details?.training_optout == 1 ? <>
                            <CheckIcon color={'success'}/>
                        </> : <>
                            <CloseIcon color={'error'}/>
                        </>}
                    </td>
                    <td className="border border-2 py-1 px-2">
                        <p className={formData?.contact_details?.contact_status_id == 1 ? '' : 'text-danger'}>
                            {ContactStatus[formData?.contact_details?.contact_status_id]}
                        </p>
                    </td>
                    </tr>
                </tbody>
                <tbody className="">{/* second row */}
                    <tr className="">
                        <th colSpan="3" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                            Alternate Phone
                        </th>
                        <th colSpan="4" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue">
                            Alternate Email
                        </th>
                    </tr>
                    <tr className="">
                        <td colSpan="3" className="border border-2 py-1 px-2 border-t-blue border-r-blue">
                            {formData?.phone_numbers && (
                                <>
                                    {formData?.phone_numbers.map((phone,index) => (
                                        <div key={index} style={{marginBottom: '5px'}}>
                                            {phone?.account_main_contact_phone_main != 1 && (
                                                <>
                                                
                                                    <a className="link" style={{textDecoration:"none"}} href={ 'tel:' + phone?.account_main_contact_phone + 'p' + phone?.account_main_contact_phone_ext }>
                                                        {/* icons */}
                                                        {phone?.phone_type_id == 1 && (
                                                            <FontAwesomeIcon icon={faPhone} style={{maxWidth:'20px', marginRight: '6px'}} />
                                                        )}
                                                        {phone?.phone_type_id == 2 && (
                                                            <FontAwesomeIcon icon={faPhoneSquare} style={{maxWidth:'20px', marginRight: '6px'}} />
                                                            )}
                                                        {phone?.phone_type_id == 3 && (
                                                            <FontAwesomeIcon icon={faHome} style={{maxWidth:'20px', marginRight: '6px'}} />
                                                        )}
                                                        {phone?.phone_type_id == 4 && (
                                                            <FontAwesomeIcon icon={faPhoneFlip} style={{maxWidth:'20px', marginRight: '6px'}} />
                                                        )}
                                                        {/* phone number */}
                                                        { phone?.account_main_contact_phone ? formatPhoneNumber(phone?.account_main_contact_phone) : '' } {phone?.account_main_contact_phone_ext ? ' X ' + phone?.account_main_contact_phone_ext : ''}
                                                    </a>
                                                    <br />
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}
                        </td>
                        <td colSpan="4" className="border border-2 py-1 px-2 border-t-blue">
                            {formData?.emails && (
                                <>
                                    {formData?.emails.map((email,index) => (
                                        <div key={index} style={{marginBottom: '5px'}}>
                                            {email?.account_main_contact_email_main != 1 && (
                                                <>
                                                    <a className="link" style={{textDecoration:"none"}} href={ 'mailto:' + email?.account_main_contact_email }>
                                                        <FontAwesomeIcon icon={faEnvelope} style={{maxWidth:'20px', marginRight: '6px'}} />
                                                        {email?.account_main_contact_email}
                                                    </a>
                                                    <br />
                                                </>
                                            )} 
                                        </div>
                                    ))}
                                </>
                            )}
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr className="">
                        <th colSpan="7" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue">
                            Personal Address
                        </th>
                    </tr>
                    <tr className="">
                        <td colSpan="7" className="border border-2 py-1 px-2 border-b-blue">
                            {formData?.contact_details?.contact_address1 ?? ''} {formData?.contact_details?.contact_address2 ?? ''} {formData?.contact_details?.contact_city ?? ''} {formData?.contact_details?.contact_state_name ?? ''} {formData?.contact_details?.contact_contact_countrycity ?? ''} {formData?.contact_details?.contact_zipcode ?? ''}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* account information */}
        <div className="account-info py-5">
            {/* heading */}
            <Box className="text-left">
                <h4 className='heading'>Account Information</h4>
            </Box>

            {/* table */}
            <table className="w-100">
                <thead>
                    <tr className="">
                        <th scope='col' width="20%" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Account </th>
                        <th scope='col' width="20%" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Account Roles</th>
                        <th scope='col' width="60%" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue">Preferences</th>
                    </tr>
                </thead>
                {/* second row */}
                <tbody className="odd-even-row border-b-blue">
                {AccountRoles && (
                    <>
                        {AccountRoles.map((email,index) => (
                            <tr className="" key={index}>
                                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                                    {AccountRoles.length > 0 && index == 0 && (
                                        formData.account_information.account_name
                                    )}
                                    {AccountRoles.length == 0 && (
                                        formData.account_information.account_name
                                    )}
                                </td>
                                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                                    <p style={{marginBottom: 0}}>
                                        {email.role}
                                    </p>
                                </td>
                                <td className="border border-2 py-1 px-2 bg-tbl-border">
                                    {email.permissions.map((permission,index) => (
                                        <span className='me-2' key={index}>{permission}</span>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </>
                )}
                </tbody>
            </table>
        </div>

        {/* site information */}
        <div className="site-info pb-5">
            {/* heading */}
            <Box className="text-left">
                <h4 className='heading'>Site Information</h4>
            </Box>

            {/* table */}
            <table className="w-100">
                <thead>
                    <tr className="">
                        <th scope='col' width="25%" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Account Site</th>
                        <th scope='col' width="20%" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Site Roles</th>
                        <th scope='col' width="25%" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Preferences</th>
                        <th scope='col' width="15%" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Model</th>
                        <th scope='col' width="15%" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue">Serial Number</th>
                    </tr>
                </thead>
                <tbody className="odd-even-row border-b-blue">
                {SiteRoles && (
                    <>
                        {SiteRoles.map((site,index) => (
                            <tr className="" key={index}>
                                <td  className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                                    {SiteRoles.length > 0 && index == 0 && (
                                        formData.site_information.site_name
                                    )}
                                    {SiteRoles.length == 0 && (
                                        formData.site_information.site_name
                                    )}
                                </td>
                                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                                    <p key={index} style={{marginBottom: 0}}>
                                        {site.role}
                                        <br />
                                    </p>
                                </td>
                                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                                    {site.permissions.map((permission,index) => (
                                        <span className='me-2' key={index}>{permission}</span>
                                    ))}
                                </td>
                                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                                    
                                </td>
                                <td className="border border-2 py-1 px-2 bg-tbl-border">
                                    
                                </td>
                            </tr>
                        ))}
                    </>
                )}
                </tbody>
            </table>

           
        </div>

        {/* <Container style={ { marginTop: "20px", marginBottom:"0px" } }>
              <Box className="d-flex ">
                <span>Created Date: {formData?.contact_details?.created_date ? FormatDateWithTime(formData?.contact_details?.created_date)  : ''}</span>
                <span>Created By: { formData?.contact_details?.created_by }</span>
                <span>Modified Date: {formData?.contact_details?.modified_date ? FormatDateWithTime(formData?.contact_details?.modified_date) : '' } </span>
                <span>Modified By: { accountDetails?.modifiedBy?.account_name }</span>
                <span>Last Touch Date: 11-14-2020 12:00:00</span>
              </Box>
            </Container> */}

<div style={{ marginTop: "20px", marginBottom: "10px" }}>
              <Box
                className="d-flex justify-content-evenly align-items-center"
                style={{ gap: "50px" }}
              >
                <p>
                  Created Date:{" "}
                  {formData?.contact_details?.created_date ? (
                    <Moment
                      date={formData?.contact_details?.created_date}
                      format={"MM/DD/YYYY h:mm A"}
                    />
                  ) : (
                    ""
                  )}
                </p>
                <p>Created By: {formData?.contact_details?.created_by}</p>
                <p>
                  Modified Date:{" "}
                  {formData?.contact_details?.modified_date ? (
                    <Moment
                      date={formData?.contact_details?.modified_date}
                      format={"MM/DD/YYYY h:mm A"}
                    />
                  ) : (
                    ""
                  )}{" "}
                </p>
                <p>Modified By: {formData?.contact_details?.modified_by}</p>
                {/* <p>
                  Last Touch Date:{" "}
                  {formData?.contact_details?.last_check
                    ? FormatDate(formData?.contact_details?.last_check)
                    : ""}
                </p> */}
              </Box>
            </div>
    </div>
  )
}



import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { GetAccountContactList, GetUserContactList } from '../../helper/BasicFn';
import { useParams } from 'react-router-dom';
import { ContactStatus, formatPhoneNumber } from '../../helper/Common';
import { CallGETAPI, CallGETAPINEW } from '../../helper/API';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSquare, faHome, faPhoneFlip, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function ContctDetails({is_user=false}) {

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
        site_information: [],

    });

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
        let data = await GetUserContactList(contactId);
        
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
            setAccountRoles(data?.data?.data?.account_information?.account_roles);
            setMainEmailData(data?.data?.data?.emails);
            setMainPhoneData(data?.data?.data?.phone_numbers);
        }
    }

    function setMainEmailData(data)
    {
        if(data) {
            data.map((item, index) => {
                if (item.account_main_contact_email_main == 1)
                {
                    setMainEmail(item.account_main_contact_email);
                }
            })
        }
    }

    function setMainPhoneData(data)
    {
        if(data) {
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
                        <th className="border border-2 py-1 px-2 bg-tbl-border border-r-blue border-t-blue">Contact Name</th>
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
                        {formData?.contact_details?.account_main_contact_firstname} {formData?.contact_details?.account_main_contact_lastname}
                    </td>
                    <td className="border border-2 py-1 px-2 border-r-blue">
                        {formData?.contact_details?.account_main_contact_title}
                    </td>
                    <td className="border border-2 py-1 px-2 border-r-blue">
                        {formData?.contact_details?.account_main_contact_department}
                    </td>
                    <td className="border border-2 py-1 px-2 border-r-blue">
                        {MainPhone?.phone && (
                            <a className="link" href={ 'tel:' + MainPhone?.phone + 'p' + MainPhone?.ext }>
                                <FontAwesomeIcon icon={faPhone} style={{maxWidth:'20px', marginRight: '6px'}} />
                                { MainPhone?.phone ? formatPhoneNumber(MainPhone.phone) : '' } {MainPhone?.ext ? ' X ' + MainPhone?.ext : ''}
                            </a>
                        )}
                    </td>
                    <td className="border border-2 py-1 px-2 border-r-blue">
                        {MainEmail && (
                            <a className="link" href={ 'mailto:' + MainEmail }>
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
             
               
            </table>
        </div>

        {/* account information */}


        {/* site information */}
        <div className="site-info pb-5 mt-4">
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
                        <th scope='col' width="25%" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Brand /Model</th>
                        <th scope='col' width="15%" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Serial #</th>
                        <th scope='col' width="15%" className="border border-2 py-1 px-2 bg-tbl-border border-t-blue">Asset</th>
                    </tr>
                </thead>
                <tbody className="odd-even-row border-b-blue">
                    {formData?.site_information?.length === 0 && <tr><td colSpan={5} className="py-4 text-center">No Site Information</td></tr>}
                    {formData?.site_information && formData?.site_information?.map((item,index)=>(
                        <tr key={index} className="py-4">
                            <td className="py-2 border border-2 py-1 px-2 border-r-blue" >{item?.site_name}</td>
                            <td className="py-2 border border-2 py-1 px-2 border-r-blue" >{item?.roles}</td>
                            <td className="py-2 border border-2 py-1 px-2 border-r-blue" >{item?.brand_model}</td>
                            <td className="py-2 border border-2 py-1 px-2 border-r-blue" >{item?.serial}</td>
                            <td className="py-2 border border-2 py-1 px-2" >{item?.asset}</td>
                        </tr>
                    ))}
                
                </tbody>
            </table>
        </div>
    </div>
  )
}

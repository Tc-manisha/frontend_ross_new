import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ContactStatus, formatPhoneNumber, getPermission } from '../../../helper/Common';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { AccountContactDetails, fetchUserAccountContact } from '../../../helper/BasicFn';
import TableLoader from '../../../components/common/TableLoader';
// import { CallGETAPI } from '../../../../helper/API';
import New from "../../../img/New.png";
import { CallGETAPI } from '../../../helper/API';
import { isUserPermission, linkTabsPermission } from '../../../helper/permission';

export default function  	Contacts({ accountId, site_id,is_user=false })
{
	const navigate = useNavigate();
	const [ siteContactList, setSiteContactList ] = useState([]);
	const [loading,setLoading] = useState(false);
	const privileges = getPermission();
	const userPermission = ["contact-details", "notes-tab"]

	// fetch on load
	const fetchOnlaod = async() => {
		setLoading(true);
		if(is_user){
			// let contactData = await fetchUserAccountContact();
			let contactData = await CallGETAPI('account/site-contacts-list/'+site_id);
			setSiteContactList(contactData?.data?.data?.contact_list || []);
		}else{
			// let ContactData = await AccountContactDetails(accountId);
			let ContactData = await CallGETAPI('account/site-contacts-list/'+site_id);
			if (ContactData)
			{
				setSiteContactList(ContactData?.data?.data?.contact_list || []);
			}
		}
		// let result = await CallGETAPI('account/site-contacts-list/'+site_id)
		setLoading(false);
	}

	const handleRedirect = (sC)=>{
		
			navigate('/user/' + accountId + '/contact-details/' + sC.contact_id, {
				state: {
					// siteTitle: "Contact : " + sC?.contact_name,
					editUrl: "/account/contact-details-edit/" + sC.contact_id,
					deleteUrl: "/account/contact-details-edit/" + sC.contact_id,
					type: "Contacts",
				}
			})
	}

	// on load
	useEffect(() => {
		fetchOnlaod();
	}, [])

	return (
		<div className='relative'>
			
			<Box className="d-flex justify-content-between align-items-center py-2">
				<h3 className="heading">Account Contacts</h3>
				{privileges?.includes("contacts-new") && ( 
				<Link
              		style={{ textDecoration: "none" }}
              		to={"/account/contacts/new/" + accountId}
            	>
              		<img src={New} />
              	<span style={{color:"#0C71C3"}}> New </span>
            	</Link>
				)}
			</Box>
			<table className="w-100 border-b-blue odd-even-row theme-table">
				<thead className="thread-style">
					<tr className="">
						<th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Contact </th>
						<th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">User</th>
						<th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Phone</th>
						<th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Email</th>
						<th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Account Roles</th>
						<th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Sites</th>
						<th className=" py-1 px-2 bg-tbl-border border-t-blue">Status</th>
					</tr>
				</thead>
				<tbody className="bordered-table">
					{loading && <TableLoader/> }
					{ siteContactList?.length > 0 ? (
						<>
							{ siteContactList?.map((sC, index) => (
								<tr className="" key={ index }>
									<td className=" py-1 px-2 tbl-border  border-r-blue">
										<span onClick={ ()=> linkTabsPermission(userPermission) && handleRedirect(sC) }

											className={linkTabsPermission(userPermission) ? "link" : ""}
										>
											{ sC?.contact_name }
										</span>
									</td>
									<td className=" py-1 px-2 tbl-border  border-r-blue">{ sC?.user ? <CheckIcon color={ 'success' } /> : <CloseIcon color="error" /> }</td> {/* User */ }
									<td className=" py-1 px-2 tbl-border  border-r-blue">
										{ sC?.phone?.[ 0 ].phone != '' && sC?.phone?.[ 0 ].phone != '-' && (
											<a className="link" style={{textDecoration:"none"}} href={ 'tel:' + sC?.phone?.[ 0 ].ext + sC?.phone?.[ 0 ]?.phone }>{ sC?.phone?.[ 0 ].phone ? formatPhoneNumber(sC?.phone?.[ 0 ].phone) : '' }{ sC?.phone?.[ 0 ].ext != '' ? 'x' + sC?.phone?.[ 0 ].ext : '' }</a>
										) }
									</td>
									<td className=" py-1 px-2 tbl-border border-r-blue">
										{/* Email */ }
										{ sC?.email.length > 0 && (
											<a className="link" style={{textDecoration:"none"}} href={ 'mailto:' + sC?.email?.[ 0 ].email }>{ sC?.email?.[ 0 ].email }</a>
										) }
									</td>
									<td className=" py-1 px-2 tbl-border border-r-blue">{ sC?.account_roles.join(', ') } </td>
									<td className=" py-1 px-2 tbl-border border-r-blue">{ sC?.main_site }</td>

									<td className=" py-1 px-2 tbl-border">
										<p className={ sC?.status == 1 ? '' : 'text-danger' }>
											{ ContactStatus[ sC?.status ] }
										</p>
									</td>
								</tr>
							)) }
						</>

					): (
						<tr>
                            <td colSpan={8} className="text-center">
                              {/* No Data Found */}
                            </td>
                          </tr>
					)
					
				}
				</tbody>
			</table>
		</div>
	)
}

import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ContactStatus, formatPhoneNumber, getPermission } from '../../../../helper/Common';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { AccountContactDetails, DecryptToken, fetchUserAccountContact } from '../../../../helper/BasicFn';
import TableLoader from '../../../../components/common/TableLoader';
import { CallGETAPI } from '../../../../helper/API';
import New from "../../../../img/New.png";

export default function Contacts({ accountId, site_id,is_user=false, setTabTbldata })
{
	const navigate = useNavigate();
	const [ siteContactList, setSiteContactList ] = useState([]);
	const [loading,setLoading] = useState(false);
	const user = DecryptToken();
    const privilege = getPermission();

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
		if(is_user){
			navigate('/user/accountId/contact-details/' + sC.contact_id);
		}else{
			navigate('/account/' + accountId + '/contact-details/' + sC.contact_id, {
				state: {
					// siteTitle: "Contact : " + sC?.contact_name,
					editUrl: "/account/contact-details-edit/" + sC.contact_id,
					deleteUrl: "/account/contact-details-edit/" + sC.contact_id,
					type: "Contacts",
				}
			})
		}
	}

	// on load
	useEffect(() => {
		fetchOnlaod();
	}, [])

	useEffect(() => {
		if (siteContactList?.length > 0) {
		  setTabTbldata((prev) => ({
			...prev,
			contact: true,
		  }));
		}
	  }, [siteContactList]);

	return (
		<div className='relative'>
				
			

			<Box className="d-flex justify-content-between align-items-center py-2">
				<h3 className="heading">Account Contacts</h3>
				<div></div>
				{(user?.user_type == 0 ||
               (user?.user_type == 2 && user?.sub_admin != "" && privilege?.includes("contacts-new"))) && ( 
				<Link
				className='new-btn'
              		style={{ textDecoration: "none" }}
              		to={"/account/contacts/new/" + accountId}
            	>
              		<img src={New} />
              		New
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
						<th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Positions</th>
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
										<span onClick={ ()=>handleRedirect(sC) }

											className="link"
										>
											{ sC?.contact_name }
										</span>
									</td>
									<td className=" py-1 px-2 tbl-border  border-r-blue">{ sC?.user ? <CheckIcon color={ 'success' } /> : <CloseIcon color="error" /> }</td> {/* User */ }
									<td className=" py-1 px-2 tbl-border  border-r-blue">
										{ sC?.phone?.[ 0 ].phone != '' && sC?.phone?.[ 0 ].phone != '-' && (
											<a style={ { textDecoration: "none" } } className="link" href={ 'tel:' + sC?.phone?.[ 0 ].ext + sC?.phone?.[ 0 ]?.phone }>{ sC?.phone?.[ 0 ].phone ? formatPhoneNumber(sC?.phone?.[ 0 ].phone) : '' }{ sC?.phone?.[ 0 ].ext != '' ? 'x' + sC?.phone?.[ 0 ].ext : '' }</a>
										) }
									</td>
									<td className=" py-1 px-2 tbl-border border-r-blue">
										{/* Email */ }
										{ sC?.email.length > 0 && (
											<a style={{textDecoration: "none"}} className="link" href={ 'mailto:' + sC?.email?.[ 0 ].email }>{ sC?.email?.[0].email }</a>
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
                              No Data Found
                            </td>
                          </tr>
					)
					
				}
				</tbody>
			</table>
		</div>
	)
}

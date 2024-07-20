import { Box } from '@mui/material'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ContactStatus, formatPhoneNumber } from '../../helper/Common';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import New from '../../img/New.png'
import TableSkeleton from '../../pages/accounts/skeleton/table/TableSkeleton';
import { useState, useEffect } from 'react';

export default function Contacts({ siteContactList, privileges, account_id }) {

  // const { account_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchLoad = () => {
    setLoading(false);
  }

  useEffect(() => {
    fetchLoad();
  })

  return (
    <div className='relative' style={{ marginBottom: '5%' }}>
      {loading && (
        <div className='' style={{ width: '100%', marginTop: "4%" }}>
          <TableSkeleton />
        </div>
      )}


      {!loading && (<>
        <Box className="d-flex justify-content-between align-items-center py-2">
          <h3 className="heading">Account Contacts</h3>
          <div></div>

          {privileges.includes('new-contact') && (
            <Link style={{ textDecoration: 'none' }} to={'/account/contacts/new/' + account_id}>
              <img src={New} />
              New
            </Link>
          )}

        </Box>
        <table className="w-100 border-b-blue odd-even-row">
          <thead>
            <tr className="">
              <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Contact </th>
              {/* <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">User</th> */}
              <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Phone</th>
              <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Email</th>
              <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Account Roles</th>
              <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Sites</th>
              <th className=" py-1 px-2 bg-tbl-border border-t-blue">Status</th>
            </tr>
          </thead>
          <tbody>
            {siteContactList.length > 0 && (
              <>
                {siteContactList.map((sC, index) => (
                  <tr className="" key={index}>
                    <td className=" py-1 px-2 tbl-border  border-r-blue">
                      <span
                        onClick={() => navigate('/user/account_id/contact-details/' + sC.contact_id, {
                          state: {
                            // siteTitle: "Contact : " + sC?.contact_name,
                            editUrl: "/account/contact-details-edit/" + sC.contact_id,
                            deleteUrl: "/account/contact-details-edit/" + sC.contact_id,
                            privileges: privileges,
                            is_user: 1
                          }
                        })}

                        className="link"
                      >
                        {sC?.contact_name}
                      </span>
                    </td>
                    {/* <td className=" py-1 px-2 tbl-border  border-r-blue">{sC?.user ? <CheckIcon color={'success'} /> : <CloseIcon color="error" />}</td> User */}
                    <td className=" py-1 px-2 tbl-border  border-r-blue">
                      {sC?.phone?.[0].phone != '' && sC?.phone?.[0].phone != '-' && (
                        <a className="link" style={{ textDecration: 'none !important' }} href={'tel:' + sC?.phone?.[0].ext + sC?.phone?.[0]?.phone}>{sC?.phone?.[0].phone ? formatPhoneNumber(sC?.phone?.[0].phone) : ''}{sC?.phone?.[0].ext != '' ? 'x' + sC?.phone?.[0].ext : ''}</a>
                      )}
                    </td>
                    <td className=" py-1 px-2 tbl-border border-r-blue">
                      {/* Email */}
                      {sC?.email.length > 0 && (
                        <a className="link" href={'mailto:' + sC?.email?.[0].email}>{sC?.email?.[0].email}</a>
                      )}
                    </td>
                    <td className=" py-1 px-2 tbl-border border-r-blue">{sC?.account_roles.join(', ')} </td>
                    <td className=" py-1 px-2 tbl-border border-r-blue">{sC?.main_site}</td>

                    <td className=" py-1 px-2 tbl-border">
                      <p className={sC?.status == 1 ? '' : 'text-danger'}>
                        {ContactStatus[sC?.status]}
                      </p>
                    </td>
                  </tr>
                ))}
              </>

            )}
          </tbody>
        </table>
      </>)}
    </div>
  )
}

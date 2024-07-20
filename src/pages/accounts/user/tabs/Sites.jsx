import { Box } from '@mui/material';
import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatPhoneNumber } from '../../../../helper/Common';
import TableSkeleton from '../../skeleton/table/TableSkeleton';

export default function Sites({siteDataList}) {

    const navigate = useNavigate();
    const { accountId } = useParams();
    const [ showLoading, setShowLoading ] = React.useState(true);

    useEffect(() => {
        setShowLoading(false);
    }, [ siteDataList ]);

    return (
        <div className='relative'>
            {/* loading */}
            {showLoading && (
                <div className="showloading-table">
                    <TableSkeleton />
                </div>
            )}

            <Box className="d-flex justify-content-between align-items-center py-2">
              <h3 className="heading">Account Site Information</h3>
              <Link
                to={ '/account/sites/new/' + accountId }
                className="bg-light-blue text-decoration-none text-light border-0 fs-base px-4 py-2 rounded"
              >
                New
              </Link>
            </Box>

            <table className="w-100 border-b-blue">
                <thead>
                    <tr className="">
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Main Site</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Equipment</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Training</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Site POC</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">Site Phone</th>
                        <th className=" py-1 px-2 bg-tbl-border border-t-blue">Email</th>
                    </tr>
                </thead>
                <tbody className="odd-even-row">
                    { siteDataList.map((siteList, index) => (
                    <tr className="" key={ index }>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            <span onClick={ () => navigate('/account/site-details/' + siteList.account_site_info_id, {
                                state: {
                                siteTitle: "Site: " + siteList?.account_site_name,
                                editUrl: "/account/site-details-edit/" + siteList.account_site_info_id,
                                deleteUrl: "/account/site-details-edit/" + siteList.account_site_info_id
                                }
                            }) }
                                className="link"
                            >
                                { siteList?.account_site_name }
                            </span>
                        </td>
                        <td className=" py-1 px-2 tbl-border  border-r-blue">
                            <Link to={ "account/site-details" } >
                                { siteList?.account_site_equipment }
                            </Link>
                        </td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">{ siteList?.account_site_training }</td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">{ siteList?.account_site_poc }</td>
                        <td className=" py-1 px-2 tbl-border border-r-blue">
                            {siteList?.account_site_phone && (
                                <a className="link" href={ 'tel:' + siteList?.account_site_phone_ext + siteList?.account_site_phone  }>{ siteList?.account_site_phone ? formatPhoneNumber(siteList?.account_site_phone) : '' } {siteList?.account_site_phone_ext ? ' X ' + siteList?.account_site_phone_ext : ''}</a>
                            )}
                        </td>
                        <td className=" py-1 px-2 tbl-border">
                        <a className="link" href={ 'mailto:' + siteList?.account_site_email }>{ siteList?.account_site_email }</a>
                        </td>
                    </tr>
                    )) }
                </tbody>
            </table>
        </div>
    )
}

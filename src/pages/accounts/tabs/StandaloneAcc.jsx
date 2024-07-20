import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './table.css'
import { CallGETAPI, CallPOSTAPI } from '../../../helper/API';
import TableSkeleton from '../skeleton/table/TableSkeleton';
import Activitycheck from "../../../img/Activity Symbols.png"
import check from "../../../img/Check.svg"
import cancel from "../../../img/Cancel.svg"

export default function StandaloneAcc({
    accountId
}) {

    const [showLoading, setShowLoading] = useState(true);
    const [standaloneData, setStandaloneData] = useState([])

    const fetchStandaloneData = async () => {
        var body = { 'account_id': accountId }
        var response = await CallPOSTAPI('account/get-equipment-aed-listing', body)
        if (response.status === true) {
            var data = response?.data?.result?.battery.concat(response?.data?.result?.pad)
            setStandaloneData(data)
            setShowLoading(false)
        }
    }

    useEffect(() => {
        fetchStandaloneData()
    }, [])

    console.log('standaloneData: ', standaloneData)

    const fillTable = () => {
        return standaloneData?.map((item, i) => {
            return (
                <tr className='border' style={{ background: i % 2 === 0 ? 'white' : '#E4E4E4' }}>
                    <td className='border border-r-blue'>{item.hasOwnProperty('manufactured_date') ? item?.battery_part ? item?.battery_part : 'N/A' : item?.pad_part ? item?.pad_part : 'N/A'}</td>
                    <td className='border border-r-blue'>
                        {item.hasOwnProperty('manufactured_date') ? 'Battery' : item?.section_name.includes('pediatric') ? 'Pediatric' : item?.section_name.includes('pak') ? 'Pad Pak' : 'Pad'}
                    </td>
                    <td className='border border-r-blue'>
                        {/* {
                            item?.dni === 1 ?
                                <img src={Activitycheck} style={{ width: 30, height: 30 }} />
                                :
                                <></>
                        } */}
                        <img
                            src={
                                item.hasOwnProperty('manufactured_date') ?
                                    (item?.manufactured_date ? '/BatteryMfgr.svg' :
                                        (item?.battery_expiration ? '/Battery.png' :
                                            '/Installby.svg')) :
                                    (item?.pad_expiration && item?.is_pediatric === 1 ? '/child-Vector.png' : '/people-Group.svg')
                            }
                            style={{
                                width: item?.battery_expiration ? 15 : 25,
                                height: item?.battery_expiration ? 30 : 30,
                                marginRight: '2%'
                            }}
                        />
                        {
                            (item.hasOwnProperty('manufactured_date') ?
                                (item?.manufactured_date ? item?.manufactured_date :
                                    (item?.battery_expiration ? item?.battery_expiration :
                                        (item?.install_date ? item?.install_date : 'N/A'))) :
                                (item?.pad_expiration ? item?.pad_expiration : 'N/A'))
                        }

                    </td>
                    <td className='border border-r-blue'>{item.hasOwnProperty('manufactured_date') ? item?.battery_lot ? item?.battery_lot : 'N/A' : item?.pad_lot ? item?.pad_lot : 'N/A'}</td>
                    <td className='border border-r-blue'>{item.hasOwnProperty('manufactured_date') ? item?.battery_udi ? item?.battery_udi : 'N/A' : item?.pad_udi ? item?.pad_udi : 'N/A'}</td>
                    <td className='border border-r-blue'>{ <img src={item?.dni ? check : cancel} alt="Status" height={12} /> }</td>
                </tr>
            )
        })
    }

    return (
        <div style={{ marginBottom: '3%' }}>
            {
                showLoading ?
                    <>
                        <div className="showloading-table">
                            <TableSkeleton />
                        </div>
                    </>
                    :
                    <>
                        <div className="" style={{ display: 'flex' }}>

                            {/* <button style={{ marginLeft: 'auto' }}
                                className="btn text-primary"
                                type="button"
                            >
                                <img
                                    src="/add.svg"
                                    alt="svg"
                                    style={{ marginRight: "5px" }}
                                />
                                <span className="ms-1">Attach</span>
                            </button> */}

                            <button
                                className="btn text-primary"
                                type="button"
                            >
                                <img
                                    src="/add.svg"
                                    alt="svg"
                                    style={{ marginRight: "5px" }}
                                />
                                <span className="ms-1">New</span>
                            </button>

                            <button
                                className="btn text-primary"
                                type="button"
                            >
                                <img
                                    src="/add.svg"
                                    alt="svg"
                                    style={{ marginRight: "5px" }}
                                />
                                <span className="ms-1">Move</span>
                            </button>

                        </div>
                        <table className="theme-table">
                            <thead className='thread-style'>
                                <tr>
                                    <td className='border border-r-blue' style={{ minWidth: '150px', fontWeight: 600 }}>Part #</td>
                                    <td className='border border-r-blue' style={{ minWidth: '150px', fontWeight: 600 }}>Accessory Type</td>
                                    <td className='border border-r-blue' style={{ minWidth: '150px', fontWeight: 600 }}>Date</td>
                                    <td className='border border-r-blue' style={{ minWidth: '150px', fontWeight: 600 }}>Lot</td>
                                    <td className='border border-r-blue' style={{ minWidth: '150px', fontWeight: 600 }}>UDI</td>
                                    <td className='border border-r-blue' style={{ minWidth: '150px', fontWeight: 600 }}>DNI</td> 
                                    </tr>
                            </thead>
                            <tbody className=''>
                                {fillTable()}
                            </tbody>
                        </table>
                    </>
            }
        </div>
    )
}
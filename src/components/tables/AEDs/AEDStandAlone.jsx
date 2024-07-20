
import React, { useEffect, useState } from 'react'
// import 'src/pages/accounts/tabs/table.css'
// import { CallGETAPI, CallPOSTAPI } from '../../../helper/API';
// import TableSkeleton from '../skeleton/table/TableSkeleton';
import Activitycheck from "../../../img/Activity Symbols.png"
import check from "../../../img/Check.svg"
import cancel from "../../../img/Cancel.svg"
import TableSkeleton from '../../../pages/accounts/skeleton/table/TableSkeleton';
import { FormatDate } from '../../../helper/Common';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import "../../../../src/global.css";

export default function AEDStandAlone({
    accountId,
    siteId,
    standaloneData,
    setShowAccTbl,
    tabTbldata,
    setTabTbldata,
}) {

    let navigate = useNavigate()
    const [showLoading, setShowLoading] = useState(false);
    const [modifiedStandaloneData, setModifiedStandaloneData] = useState([])

    useEffect(() => {
        let filteredData = standaloneData?.filter(obj => !(obj.hasOwnProperty('pad_part') && obj.section_name === 'charge_pack'));
        setModifiedStandaloneData(filteredData)
    }, [standaloneData])

    useEffect(()=>{
        if (typeof setShowAccTbl === "function") {
            setShowAccTbl(false);
          }
    }, []);

    useEffect(() => {
        if (modifiedStandaloneData?.length > 0) {
            setTabTbldata({
                ...tabTbldata,
                equipment: {
                  ...tabTbldata.equipment,
                  accessory: true,
                }
              });;
        }
      }, [modifiedStandaloneData]);

    const fillTable = () => {
        return modifiedStandaloneData?.map((item, i) => {
            return (
                <tr className='border' style={{ background: i % 2 === 0 ? 'white' : '#E4E4E4' }}>
                    <td className='border border-r-blue'>{item.hasOwnProperty('manufactured_date') ? item?.battery_part ? item?.battery_part : 'N/A' : item?.pad_part ? item?.pad_part : 'N/A'}</td>
                    <td className='border border-r-blue'>
                        {item?.accessory_type}
                    </td>
                    <td className='border border-r-blue'>
                        {/* {
                            item?.dni === 1 ?
                                <img src={Activitycheck} style={{ width: 30, height: 30 }} />
                                :
                                <></>
                        } */}
                        <img className='image'
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
                                (item?.manufactured_date ? FormatDate(item?.manufactured_date) :
                                    (item?.battery_expiration ? FormatDate(item?.battery_expiration) :
                                        (item?.install_date ? FormatDate(item?.install_date) : 'N/A'))) :
                                (item?.pad_expiration ? FormatDate(item?.pad_expiration) : 'N/A'))
                        }
                        <div style={{ margin: '5% 0' }} />
                        {
                            item?.section_name === 'charge_pack' && item?.pad_expiration_1 ?
                                <img className='image' src="/people-Group.svg"
                                    style={{ marginRight: "2%" }}
                                />
                                :
                                <></>
                        }
                        {item.section_name === 'charge_pack' && item?.pad_expiration_1 ?
                            moment(item.pad_expiration_1).format("MM/DD/YYYY") : null
                        }

                        <div style={{ margin: '5% 0' }} />
                        {
                            item?.section_name === 'charge_pack' && item?.pad_expiration_2 ?
                                <img className='image' src="/people-Group.svg"
                                    style={{ marginRight: "2%" }}
                                />
                                :
                                <></>
                        }
                        {item.section_name === 'charge_pack' && item?.pad_expiration_2 ?
                            moment(item.pad_expiration_2).format("MM/DD/YYYY") : null
                        }

                    </td>
                    <td className='border border-r-blue' style={{maxWidth:"100px",wordBreak:"break-word"}}>{item.hasOwnProperty('manufactured_date') ? item?.battery_lot ? item?.battery_lot : 'N/A' : item?.pad_lot ? item?.pad_lot : 'N/A'}</td>
                    {/* <td className='border border-r-blue'>{item.hasOwnProperty('manufactured_date') ? item?.battery_udi ? item?.battery_udi : 'N/A' : item?.pad_udi ? item?.pad_udi : 'N/A'}</td>
                     */}
                     <td className='border border-r-blue'>{item.hasOwnProperty('manufactured_date') ? 
    (item?.section_name === 'charge_pack' ? (item?.charge_pak_uid ? item?.charge_pak_uid : 'N/A') : (item?.battery_udi ? item?.battery_udi : 'N/A')) 
    : (item?.pad_udi ? item?.pad_udi : 'N/A')}
</td>
                    <td className='border border-r-blue'>{<img src={item?.dni ? check : cancel} alt="Status" height={12} />}</td>
                </tr>
            )
        })
    }

    return (
        <div style={{ marginBottom: '3%' }}>
            {
                showLoading ? (
                    <>
                        <div className="showloading-table">
                            <TableSkeleton />
                        </div>
                    </>)
                    :
                   ( <>
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

                            <button style={{ marginLeft: 'auto' }}
                                onClick={() => {
                                    navigate(`/account/aed/NewStandloneAcce/${accountId}/${siteId}`);
                                }}
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
                                onClick={() => {
                                    navigate(`/move-accessory/${accountId}/${siteId}`);
                                }}
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
                                    <td className='border border-r-blue' style={{ minWidth: '', fontWeight: 600 }}>Part #</td>
                                    <td className='border border-r-blue' style={{ minWidth: '', fontWeight: 600 }}>Accessory Type</td>
                                    <td className='border border-r-blue' style={{ minWidth: '', fontWeight: 600 }}>Date</td>
                                    <td className='border border-r-blue' style={{ maxWidth: '', fontWeight: 600 }}>Lot</td>
                                    <td className='border border-r-blue' style={{ minWidth: '', fontWeight: 600 }}>UDI</td>
                                    <td className='border border-r-blue' style={{ minWidth: '', fontWeight: 600 }}>DNI</td>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {
                                    modifiedStandaloneData?.length === 0 ? (
                                        <tr key="noData">
                                                <td colSpan={6}>
                                                    <center>No accessory data found.</center>
                                                </td>
                                            </tr>
                                       )
                                        : (
                                        fillTable()
                               ) }
                            </tbody>
                        </table>
                    </>)
            }
        </div>
    )
}
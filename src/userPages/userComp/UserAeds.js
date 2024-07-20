import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
// import './table.css'
// import 'devextreme/dist/css/dx.light.css';
import { CallGETAPI } from '../../helper/API';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
// import { FormatDate } from '../../../helper/Common';
// import AedMoveModal from '../../../components/forms/subaed_forms/AedMoveModal';
import TableSkeleton from '../../pages/accounts/skeleton/table/TableSkeleton';
import { DateFormate, DefaultDateForm } from '../../helper/TblFn';
import { CalculateAEDList, CheckDate } from '../../helper/BasicFn';
import AEDOutOfServiceTbl from '../../components/tables/AEDs/AEDOutOfServiceTbl';
import servicecheck from '../../img/ServiceCheck.svg'
import StandaloneAcc from '../../pages/accounts/tabs/StandaloneAcc';
import { Dropdown } from "react-bootstrap";
import AEDStandAlone from '../../components/tables/AEDs/AEDStandAlone';
import AEDTable from '../../components/tables/AEDs/AEDTable';
import New from '../../img/New.png';


export default function Aeds({ privileges, account_id }) {
    const navigate = useNavigate();
    // const { account_id } = useParams();
    const [aedList, setAedList] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [aedsData, setAedsData] = useState([]);
    const [outofServiceData, setOutofServiceData] = useState([]);

    // get aeds by account
    const getAeds = async () => {
        // const result = await CallGETAPI('account/get-aed/' + account_id);
        const result = await CallGETAPI('account/get-aed-with-standalon/' + account_id);
        if (result?.data?.status) {
            let aeds = result?.data?.data || [];
            const pendingaeds = result?.data?.pendingData;
            const OFSData = result?.data?.outOfData;
            let newArr = [];

            if (Array.isArray(aeds) && (pendingaeds.length > 0)) {
                newArr = [...pendingaeds, ...aeds];
            } else {
                newArr = aeds;
            }
            aeds = newArr;
            setAedsData(aeds);
            const resultArr = CalculateAEDList(aeds);
            const OFDArr = CalculateAEDList(OFSData);
            const OFD = [];
            for (let OFi = 0; OFi < OFDArr.length; OFi++) {
                const el = OFDArr[OFi];
                for (let OF2 = 0; OF2 < el.data.length; OF2++) {
                    const element = el.data[OF2];
                    const obj = {
                        site_name: el?.site_name,
                        site_id: el?.site_id,
                        standalone_data: el?.standalone_data || [],
                        ...element
                    };
                    OFD.push(obj);
                }
            }
            setOutofServiceData(OFD);
            // setOutofServiceData(); outofServiceData;
            setAedList(resultArr);
        }

        setShowLoading(false);
    }

    // on load fetch data
    useEffect(() => {
        getAeds();
    }, [])
    const [openMoveModal, setOpenMoveModal] = useState(false);

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
    });

    const sortTable = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedData = [...data].sort((a, b) => {
            let valA = a[key];
            let valB = b[key];

            if (typeof valA === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }

            if (valA < valB) {
                return direction === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setData(sortedData);
        setSortConfig({ key, direction });
    };

    const newDD = () => {
        return (
            <>
                <Dropdown>
                    <Dropdown.Toggle
                        className="btn btn-transparent text-primary ms-2 bg-white"
                        id="new-tab-btn"
                        style={{ backgroundColor: "transparent !important", border: "none" }}
                    >
                        <img
                            src="/add.svg"
                            alt="New"
                        />
                        <span className="ms-1">New</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="bg-primary" style={{ minWidth: "20px" }}>
                        {privileges.includes('aed-newstandloneacce') && (
                            <Dropdown.Item
                                onClick={() => {
                                    // navigate(`/account/aed/NewStandloneAcce/${account_id}/${item?.site_id}`);
                                }}
                            >
                                Accessories
                            </Dropdown.Item>
                        )}

                        {privileges.includes('new-aed') && (
                            <Dropdown.Item
                                onClick={() => {
                                    // navigate(`/account/aed/NewStandloneAcce/${account_id}/${item?.site_id}`);
                                }}
                            >
                                AED
                            </Dropdown.Item>
                        )}

                    </Dropdown.Menu>
                </Dropdown>
            </>
        )
    }

    const moveDD = () => {
        return (
            <>
                <Dropdown >
                    <Dropdown.Toggle
                        className="btn btn-transparent text-primary ms-2 bg-white"
                        id="new-tab-btn"
                        style={{ backgroundColor: "transparent !important", border: "none" }}
                    >
                        <img
                            src="/add.svg"
                            alt="Move"
                        />
                        <span className="ms-1">Move</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="bg-primary" style={{ minWidth: "20px" }}>
                        {!privileges.includes('move-accessories') && (
                            <Dropdown.Item
                                onClick={() => {
                                    // navigate(`/move-accessory/${account_id}/${item?.site_id}`);
                                }}
                            >
                                Accessories
                            </Dropdown.Item>
                        )}

                        {!privileges.includes('move-aed') && (
                            <Dropdown.Item
                                onClick={() => {
                                    // navigate(`/move-aed/` + account_id + '/' + item?.site_id, { state: { siteName: item?.site_name } });
                                }}
                            >
                                AED
                            </Dropdown.Item>
                        )}

                    </Dropdown.Menu>
                </Dropdown>
            </>
        )
    }

    return (
        <div className='relative' style={{ marginBottom: '5%' }}>
            {/* loading */}
            {showLoading ?
                <>
                    <div style={{ padding: '3% 0' }}>
                        <TableSkeleton />
                    </div>
                </> :
                <>
                    {aedList?.length > 0 ? <>
                        {aedList.map((item, index) => (
                            <div key={index}>
                                <div className="row w-100">
                                    <div className="col-md-12 p-0 text-center site-title-btn">
                                        <h2 className='aed-title'>{item?.site_name}</h2>

                                        <div className="right-btns d-flex align-items-center absolute right-0 btn-section" style={{ display: 'flex', gap: '3%', width: 500, justifyContent: "right", marginTop: '1%' }}>

                                            {!privileges.includes('aed-newstandloneacce') || !privileges.includes('new-aed') && (
                                                newDD()
                                            )}


                                            {!privileges.includes('move-aed') || !privileges.includes('move-accessory') && (
                                                moveDD()
                                            )}

                                            {privileges.includes('aed-service-check') && (
                                                <Link style={{ textDecoration: 'none' }} to={'/account/sites/new/' + account_id}>
                                                    <img src={New} />
                                                    Service Check
                                                </Link>
                                            )}

                                        </div>
                                    </div>
                                </div>
                                <div className='' >
                                    <AEDTable
                                        SingleAED={item?.data}
                                        aedsData={aedsData}
                                    />
                                    <AEDStandAlone
                                        siteId={item?.site_id}
                                        account_id={account_id}
                                        standaloneData={item?.standalone_data}
                                    />
                                </div>
                            </div>
                        ))}


                        <div className='' >
                            <div className="row w-100">
                                <div className="col-md-12 p-0 text-center site-title-btn">
                                    <h2 className='aed-title'>Out of Service</h2>
                                </div>
                            </div>
                            <div className='' >
                                <AEDOutOfServiceTbl
                                    SingleAED={outofServiceData}
                                    aedsData={aedsData}
                                />
                            </div>
                        </div>

                        {/* <div>
                            <div className='' >
                                <StandaloneAcc account_id={account_id} />
                            </div>
                        </div> */}

                    </> : <>
                        <table className='table data-table my-4 theme-table'>
                            <thead className='thread-style'>
                                <tr  >
                                    <th className='border border-2 py-1 px-2 border-r-blue border-t-blue' >AED Brand / Model</th>
                                    <th className='border border-2 py-1 px-2 border-r-blue border-t-blue' >Serial Number</th>
                                    <th className='border border-2 py-1 px-2 border-r-blue border-t-blue' >AED Placement</th>
                                    <th className='border border-2 py-1 px-2 border-r-blue border-t-blue' >Battery Expiration</th>
                                    <th className='border border-2 py-1 px-2 border-r-blue border-t-blue' >Pads Expiration</th>
                                    <th className='border border-2 py-1 px-2 border-r-blue border-t-blue' >Last Check</th>
                                    <th className='border border-2 py-1 px-2 border-r-blue border-t-blue' >Last Service</th>
                                    <th className='border border-2 py-1 px-2 border-r-blue border-t-blue' >RMS Check</th>
                                </tr>
                            </thead>
                            <tbody className='bordered-table'>
                                <tr>
                                    <td colSpan={8} className='text-center'>No Data Found</td>
                                </tr>
                            </tbody>
                        </table>
                    </>}
                </>
            }
        </div>
    )
}
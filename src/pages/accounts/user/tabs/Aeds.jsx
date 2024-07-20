import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './table.css'
// import 'devextreme/dist/css/dx.light.css';
import { CallGETAPI } from '../../../../helper/API';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import AEDTable from '../../../../components/tables/AEDs/AEDTable';
import { FormatDate } from '../../../../helper/Common';
import AedMoveModal from '../../../../components/forms/subaed_forms/AedMoveModal';
import TableSkeleton from '../../skeleton/table/TableSkeleton';


export default function Aeds()
{   
    const navigate = useNavigate();
    const { accountId }             = useParams();
    const [ aedList, setAedList ]   = useState([]);
    const [ showLoading, setShowLoading ]   = useState(true);

    // get aeds by account
    // const getAeds = async () =>{

    //     const result = await CallGETAPI('account/get-aed/' + accountId);


    //     if (result?.data?.status){
    //         const aeds = result?.data?.data;
    //         const resultArr = [];
    //         for (let a1 = 0; a1 < aeds.length; a1++)
    //         {
    //             const aed1 = aeds[ a1 ];

    //             let obj = {
    //                 site_name: aed1.site_name,
    //                 site_id: '',
    //                 data: [],
    //             }

    //             for (let a2 = 0; a2 < aed1.data.length; a2++)
    //             {
    //                 const aeds2d = aed1.data[ a2 ]?.aed_details;
    //                 obj.site_id  = aeds2d?.site_id; 
    //                 let obj2 = {
    //                     aed_id: aeds2d?.aed_id,
    //                     site_id: aeds2d?.site_id,
    //                     serial_number: aeds2d?.serial_number,
    //                     placement: aeds2d?.placement,
    //                     brand_name: aed1.data[ a2 ]?.aed_brand,
    //                     battery_expiration: [],
    //                     pads_expiration: [],
    //                     last_check: aeds2d?.last_check,
    //                     last_service: aeds2d?.last_service,
    //                     rms_check: aeds2d?.rms_check,
    //                     pediatric_key: aeds2d?.pediatric_key
    //                 }

    //                 let bi1 = (aeds2d?.battery_info) ? JSON.parse(aeds2d?.battery_info) : [];
    //                 let si1 = (aeds2d?.storage_info) ? JSON.parse(aeds2d?.storage_info) : [];
    //                 let sbi1 = (aeds2d?.spare_battery_info) ? JSON.parse(aeds2d?.spare_battery_info) : []; //spare_battery_info
    //                 let sbi1Arr = (sbi1.length > 0) ? sbi1[ 0 ] : [];
                    
    //                 let sbi1_arr  = (sbi1Arr?.has_battery_spare && sbi1Arr?.has_battery_spare?.length > 0) ? sbi1Arr?.has_battery_spare.map((item) => item.battery_expiration) : [];
    //                 let sbi1_arr2 = (sbi1Arr?.has_9v_spare && sbi1Arr?.has_9v_spare?.length > 0) ? sbi1Arr?.has_9v_spare.map((item) => item.battery_expiration) : [];
    //                 let sbi1_arr3 = (sbi1Arr?.has_10pk_spare && sbi1Arr?.has_10pk_spare?.length > 0) ? sbi1Arr?.has_10pk_spare.map((item) => item.battery_expiration) : [];
    //                 let sbi1_arr4 = (sbi1Arr?.has_installby_spare && sbi1Arr?.has_installby_spare?.length > 0) ? sbi1Arr?.has_installby_spare.map((item) => item.battery_expiration) : [];
    //                 let sbi1_arr5 = (sbi1Arr?.has_man_spare && sbi1Arr?.has_man_spare?.length > 0) ? sbi1Arr?.has_man_spare.map((item) => item.battery_expiration) : [];

    //                 let spare_obj = [
    //                     { title: "spare_battery_info", data: sbi1_arr, img: '/spare-battery.png' },
    //                     { title: "spare_battery_info", data: sbi1_arr2, img: '/spare-battery.png' },
    //                     { title: "spare_battery_info", data: sbi1_arr3, img: '/spare-battery.png' },
    //                     { title: "spare_battery_info", data: sbi1_arr4, img: '/spare-battery.png' },
    //                     { title: "spare_battery_info", data: sbi1_arr5, img: '/spare-battery.png' },
    //                 ]

    //                 let ppi1 = (aeds2d?.pediatric_pad_info) ? JSON.parse(aeds2d?.pediatric_pad_info) : [];
    //                 let sppi1 = (aeds2d?.spare_padric_pad_info) ? JSON.parse(aeds2d?.spare_padric_pad_info) : [];
    //                 let api1 = (aeds2d?.adult_pad_info) ? JSON.parse(aeds2d?.adult_pad_info) : [];
    //                 let sapi1 = (aeds2d?.spare_adult_pad_info) ? JSON.parse(aeds2d?.spare_adult_pad_info) : [];

    //                 let ppd = (ppi1 && ppi1?.length > 0) ? ppi1.map(item => (item?.pediatric_pad_expiration && item?.pediatric_pad_expiration != '') && item?.pediatric_pad_expiration) : [];
    //                 let spsd = (sppi1 && sppi1?.length > 0) ? sppi1.map(item => (item?.spare_pediatric_pad_expiration && item?.spare_pediatric_pad_expiration != '') && item?.spare_pediatric_pad_expiration) : [];
    //                 let apid = (api1 && api1?.length > 0) ? api1.map(item => (item?.adult_pad_expiration && item?.adult_pad_expiration != '') && item?.adult_pad_expiration) : [];
    //                 let spd = (sapi1 && sapi1?.length > 0) ? sapi1.map(item => (item?.spare_adult_pad_expiration && item?.spare_adult_pad_expiration != '') && item?.spare_adult_pad_expiration) : [];

    //                 let batteryDateArr = [];
    //                 for (let bi = 0; bi < bi1.length; bi++)
    //                 {
    //                     const hab_batery = bi1[ bi ]?.has_battery;
    //                     const has_9v = bi1[ bi ]?.has_9v;

    //                     const has_10pk = bi1[ bi ]?.has_10pk;
    //                     const has_installby = bi1[ bi ]?.has_installby;
    //                     const has_man = bi1[ bi ]?.has_man;

    //                     let arr = (hab_batery && hab_batery?.length > 0) ? hab_batery.map((item) => item.battery_expiration) : []
    //                     let arr2 = (has_9v && has_9v?.length > 0) ? has_9v.map((item) => item.battery_expiration) : []
    //                     let arr3 = (has_10pk && has_10pk?.length > 0) ? has_10pk.map((item) => item.battery_expiration) : []
    //                     let arr4 = (has_installby && has_installby?.length > 0) ? has_installby.map((item) => item.battery_expiration) : []
    //                     let arr5 = (has_man && has_man?.length > 0) ? has_man.map((item) => item.battery_expiration) : []

    //                     let obj = [
    //                         { title: "hab_batery", data: arr, img: '/Battery.png' },
    //                         { title: "has_9v", data: arr2, img: '/Battery.png' },
    //                         { title: "has_10pk", data: arr3, img: '/Battery.png' },
    //                         { title: "has_installby", data: arr4, img: '/Battery.png' },
    //                         { title: "has_man", data: arr5, img: '/Battery.png' },
    //                     ]

    //                     batteryDateArr = obj; 
    //                 }

    //                 let si_obj = { title: "storage_info", data: [], img: '/Aed-Cabinet.png' };

    //                 for (let si = 0; si < si1.length; si++)
    //                 {
    //                     const sie = si1[ si ];
    //                     si_obj.data.push(FormatDate(sie?.expiry_date));
    //                 }
    //                 batteryDateArr.push(si_obj);

    //                 obj2.battery_expiration = [ ...batteryDateArr, ...spare_obj ];
    //                 let obj3 = [
    //                     { title: 'adult_pad_info', data: apid, img: "/people-Group.png" },
    //                     { title: 'spare_adult_pad_info', data: spd, img: "/people-Group.png" },
    //                     { title: 'pediatric_pad_info', data: ppd, img: "/child-Vector.png" },
    //                     { title: 'spare_padric_pad_info', data: spsd, img: "/child-Vector.png" },
    //                 ];
    //                 obj2.pads_expiration = obj3;
    //                 obj.data.push(obj2);
    //             }
    //             resultArr.push(obj);
    //         }

    //         setAedList(resultArr);
    //     }

    //     setShowLoading(false);
    // }

        // get aeds by account
        const getAeds = async () =>
        {
            // const result = await CallGETAPI('account/get-aed/' + accountId);
    const result = await CallGETAPI('account/get-aed-with-standalon/' + accountId);

            console.log({result});
            if (result?.data?.status)
            {
                const aeds = result?.data?.data;
                const resultArr = [];
                for (let a1 = 0; a1 < aeds.length; a1++)
                {
                    const aed1 = aeds[ a1 ];
                    let obj = {
                        site_name: aed1.site_name,
                        site_id: '',
                        data: [],
                    }
    
                    for (let a2 = 0; a2 < aed1.data.length; a2++)
                    {
                        const aeds2d = aed1.data[ a2 ]?.aed_details;
                        obj.site_id  = aeds2d?.site_id; 
                        let obj2 = {
                            aed_id: aeds2d?.aed_id,
                            site_id: aeds2d?.site_id,
                            serial_number: aeds2d?.serial_number,
                            placement: aeds2d?.placement,
                            brand_name: aed1.data[ a2 ]?.aed_brand,
                            battery_expiration: [],
                            pads_expiration: [],
                            last_check: FormatDate(aeds2d?.last_check),
                            last_service: aeds2d?.last_service,
                            rms_check: aeds2d?.rms_check,
                            pediatric_key: aeds2d?.pediatric_key
                        }
                        let bi1 = (aeds2d?.battery_info) ? JSON.parse(aeds2d?.battery_info) : [];
                        let si1 = (aeds2d?.storage_info) ? JSON.parse(aeds2d?.storage_info) : [];
                        let cpi1 = (aeds2d?.charge_pak_info) ? JSON.parse(aeds2d?.charge_pak_info) : [];// charge_pak_info
                        let cpi1Arr = (cpi1.length > 0) ? cpi1 : [];
                        let cpi1BatteryDatesata =  cpi1Arr.map((cpi1Arritem) => cpi1Arritem.battery_expiration);
    
                        let sbi1 = (aeds2d?.spare_battery_info) ? JSON.parse(aeds2d?.spare_battery_info) : []; //spare_battery_info
                        let sbi1Arr = (sbi1.length > 0) ? sbi1[ 0 ] : [];
                        
                        let sbi1_arr  = (sbi1Arr?.has_battery_spare && sbi1Arr?.has_battery_spare?.length > 0) ? sbi1Arr?.has_battery_spare.map((item) => item.battery_expiration) : [];
                        let sbi1_arr2 = (sbi1Arr?.has_9v_spare && sbi1Arr?.has_9v_spare?.length > 0) ? sbi1Arr?.has_9v_spare.map((item) => item.battery_expiration) : [];
                        let sbi1_arr3 = (sbi1Arr?.has_10pk_spare && sbi1Arr?.has_10pk_spare?.length > 0) ? sbi1Arr?.has_10pk_spare.map((item) => item.battery_expiration) : [];
                        let sbi1_arr4 = (sbi1Arr?.has_installby_spare && sbi1Arr?.has_installby_spare?.length > 0) ? sbi1Arr?.has_installby_spare.map((item) => item.battery_expiration) : [];
                        let sbi1_arr5 = (sbi1Arr?.has_man_spare && sbi1Arr?.has_man_spare?.length > 0) ? sbi1Arr?.has_man_spare.map((item) => item.battery_expiration) : [];
    
                        let spare_obj = [
                            { title: "spare_battery_info", data: sbi1_arr, img: '/Battery.png' },
                            { title: "spare_battery_info", data: sbi1_arr2, img: '/spare-battery.png' },
                            { title: "spare_battery_info", data: sbi1_arr3, img: '/Battery.png' },
                            { title: "spare_battery_info", data: sbi1_arr4, img: '/Battery.png' },
                            { title: "spare_battery_info", data: sbi1_arr5, img: '/Battery.png' },
                            { title: "spare_battery_info", data: cpi1BatteryDatesata, img: '/Battery.png' },
                        ]
    
    
                        let ppi1 = (aeds2d?.pediatric_pad_info) ? JSON.parse(aeds2d?.pediatric_pad_info) : [];
                        let sppi1 = (aeds2d?.spare_padric_pad_info) ? JSON.parse(aeds2d?.spare_padric_pad_info) : [];
                        let api1 = (aeds2d?.adult_pad_info) ? JSON.parse(aeds2d?.adult_pad_info) : [];
                        let sapi1 = (aeds2d?.spare_adult_pad_info) ? JSON.parse(aeds2d?.spare_adult_pad_info) : [];
    
                        let ppd = (ppi1 && ppi1?.length > 0) ? ppi1.map(item => (item?.pediatric_pad_expiration && item?.pediatric_pad_expiration != '') && item?.pediatric_pad_expiration) : [];
                        let spsd = (sppi1 && sppi1?.length > 0) ? sppi1.map(item => (item?.spare_pediatric_pad_expiration && item?.spare_pediatric_pad_expiration != '') && item?.spare_pediatric_pad_expiration) : [];
                        let apid = (api1 && api1?.length > 0) ? api1.map(item => (item?.adult_pad_expiration && item?.adult_pad_expiration != '') && item?.adult_pad_expiration) : [];
                        let spd = (sapi1 && sapi1?.length > 0) ? sapi1.map(item => (item?.spare_adult_pad_expiration && item?.spare_adult_pad_expiration != '') && item?.spare_adult_pad_expiration) : [];
    
                        let batteryDateArr = [];
                        for (let bi = 0; bi < bi1.length; bi++)
                        {
                            const hab_batery = bi1[ bi ]?.has_battery;
                            const has_9v = bi1[ bi ]?.has_9v;
    
                            const has_10pk = bi1[ bi ]?.has_10pk;
                            const has_installby = bi1[ bi ]?.has_installby;
                            const has_man = bi1[ bi ]?.has_man;
    
                            let arr = (hab_batery && hab_batery?.length > 0) ? hab_batery.map((item) => item.battery_expiration) : []
                            let arr2 = (has_9v && has_9v?.length > 0) ? has_9v.map((item) => item.battery_expiration) : []
                            let arr3 = (has_10pk && has_10pk?.length > 0) ? has_10pk.map((item) => item.battery_expiration) : []
                            let arr4 = (has_installby && has_installby?.length > 0) ? has_installby.map((item) => item.battery_expiration) : []
                            let arr5 = (has_man && has_man?.length > 0) ? has_man.map((item) => item.battery_expiration) : []
    // console.log({brand_name: aed1.data[ a2 ]?.aed_brand,arr2});
                            let obj = [
                                { title: "hab_batery", data: arr, img: '/Battery.png' },
                                { title: "has_9v", data: arr2, img: '/spare-battery.png' },
                                { title: "has_10pk", data: arr3, img: '/Battery.png' },
                                { title: "has_installby", data: arr4, img: '/Battery.png' },
                                { title: "has_man", data: arr5, img: '/Battery.png' },
                            ]
    
                            batteryDateArr = obj; 
                        }
    
                        let si_obj = { title: "storage_info", data: [], img: '/Aed-Cabinet.png' };
                        // if(obj2?.brand_name==='Defibtech Lifeline'){
                        //      si_obj = { title: "storage_info", data: [], img: '/spare-battery.png' };
                        // }
    
                        for (let si = 0; si < si1.length; si++)
                        {
                            const sie = si1[ si ];
                            si_obj.data.push(FormatDate(sie?.expiry_date));
                        }
                        batteryDateArr.push(si_obj);
    
                        obj2.battery_expiration = [ ...batteryDateArr, ...spare_obj ];
                        let Chargepad1Arr = cpi1Arr.map((cpi1Item)=>cpi1Item.pad_1_expiration);
                        let Chargepad2Arr = cpi1Arr.map((cpi1Item)=>cpi1Item.pad_2_expiration);
    
                        let obj3 = [
                            { title: 'adult_pad_info', data: apid, img: "/people-Group.png" },
                            { title: 'spare_adult_pad_info', data: spd, img: "/people-Group.png" },
                            { title: 'pediatric_pad_info', data: ppd, img: "/child-Vector.png" },
                            { title: 'spare_padric_pad_info', data: spsd, img: "/child-Vector.png" },
                            { title: 'spare_padric_pad_info', data: Chargepad1Arr, img: "/people-Group.png" },
                            { title: 'spare_padric_pad_info', data: Chargepad2Arr, img: "/people-Group.png" },
                        ];
                        obj2.pads_expiration = obj3;
                        obj.data.push(obj2);
                    }
                    resultArr.push(obj);
                }
    
                setAedList(resultArr);
            }
    
            setShowLoading(false);
        }
    
    // on load fetch data
    useEffect(() =>{
        getAeds();
    }, [])
    const [openMoveModal,setOpenMoveModal] = useState(false);

    return (
        <div className='relative'>

              {/* loading */}
                {showLoading ? 
                    <>
                        <div className="showloading-table">
                            <TableSkeleton />
                        </div>
                    </> : 
                    <>
                        { aedList.map((item, index) => (
                            <div key={ index }>
                                <div className="row w-100">
                                    <div className="col-md-6 p-0"></div>
                                    <div className="col-md-6 p-0">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h2 className='aed-title'>{ item?.site_name }</h2>
                                            <div className="right-btns d-flex align-items-center">
                                                <button
                                                    className="btn text-primary"
                                                    type="button"
                                                    onClick={(e) => {navigate('/account/new/aed/'+accountId+'/'+item?.site_id)}}
                                                >
                                                    <img
                                                        src="/add.svg"
                                                        alt="svg"
                                                        style={{ marginRight: "5px" }}
                                                    />
                                                    <span className="ms-1">New</span>
                                                </button>

                                                <AedMoveModal  
                                                    open={openMoveModal} 
                                                    setOpen={setOpenMoveModal} 
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='' >
                                    {item?.data.length > 0 ? 
                                        <AEDTable 
                                            SingleAED={ item?.data } 
                                            // sortTable={sortTable}
                                            // sortConfig={sortConfig}
                                        /> 
                                        :  
                                        <div className='' >
                                            No Records Found
                                        </div> 
                                    }                                    
                                </div>
                            </div>
                        )) }
                    </>
                }
        </div>
    )
}

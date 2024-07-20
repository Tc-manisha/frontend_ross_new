// import React from 'react'

// const BatteryInformationTbl = ({batteryInfo}) => {
//     const  BatteryExpTbl = {
//         main:"main",
//         battery_type_id:'battery_type_id',
//         battery_expiration:'battery_expiration',
//         battery_lot:'battery_lot',
//         battery_uid:'battery_uid',
//         v9_install:'v9_install',
//         install_before_date:'install_before_date',
//         date_installed:'date_installed',
//         manufactured_date:'manufactured_date',
//     }	  
    
//   return (
//     <>
    
//     { batteryInfo?.map((data, index) => (
//     <tbody className="odd-even-row border-b-blue" key={ index }>
//         {Object.keys(BatteryExpTbl).map(function(key) {
//             return <>
//                 { data?.[key]?.map(
// 			        (hasBattery, batteryIndex) => 
//                     hasBattery?.[key] && hasBattery?.[key] != "" && 
//                     (   
//                         {
//                             key === 'main' ? 'main' :
//                             hasBattery[key]
//                         }
//                     )
//                     ) 
//                 }
//             </>
//         })}
//     </tbody>
//     ))}
//     </>
//   )
// }

// export default BatteryInformationTbl
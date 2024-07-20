import React from "react";
import { CheckADTable, RenderDate } from "../../../helper/BasicFn";
import { FormatDate } from "../../../helper/Common";
import moment from "moment";

const BatteryInformationTr = ({
  batteryInfo,
  print_battery_part,
  // RenderDate,
  key,
  DataValue,
  batteryIndex,
}) => {
  if (!DataValue?.battery_type_id) {
    return "";
  }

  return (
    <>
      <tr className="" key={batteryIndex}>
        {/* <td>Main</td> */}
        {CheckADTable(batteryInfo, "battery_type_id") === 1 ? (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {print_battery_part(DataValue?.battery_type_id)}
          </td>
        ) : (
          ""
        )}
        {CheckADTable(batteryInfo, "battery_expiration") === 1 ? (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {/* {RenderDate(FormatDate(DataValue?.battery_expiration), 1)} */}
            {
              DataValue?.battery_expiration === 'unknown' ?
                'unknown' :
                RenderDate(FormatDate(DataValue?.battery_expiration), 1)
            }
          </td>
        ) : (
          ""
        )}
        {CheckADTable(batteryInfo, "battery_serial") === 1 ? (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {DataValue?.battery_serial}
          </td>
        ) : (
          ""
        )}
        {CheckADTable(batteryInfo, "install_9v_date") === 1 ? (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {/* {RenderDate(FormatDate(DataValue?.install_9v_date), 0)} */}
            {
              DataValue?.install_9v_date === 'unknown' ?
                'unknown' :
                RenderDate(FormatDate(DataValue?.install_9v_date), 0)
            }
          </td>
        ) : (
          ""
        )}
        {CheckADTable(batteryInfo, "install_9v_date") === 1 ? (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {/* {RenderDate(moment(FormatDate(DataValue?.install_9v_date)).add(1, 'year'), 0)} */}
            {
              DataValue?.install_9v_date === 'unknown' ?
                'unknown' :
                RenderDate(moment(FormatDate(DataValue?.install_9v_date)).add(1, 'year'), 0)
            }
          </td>
        ) : (
          ""
        )}
        {CheckADTable(batteryInfo, "manufactured_date") === 1 ? (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {/* {RenderDate(DataValue?.manufactured_date, 0)} */}
            {
              DataValue?.manufactured_date === 'unknown' ?
                'unknown' :
                RenderDate(DataValue?.manufactured_date, 0)
            }
          </td>
        ) : (
          ""
        )}
        {CheckADTable(batteryInfo, "install_date") === 1 ? (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {/* {RenderDate(DataValue?.install_date, 0)} */}
            {
              DataValue?.install_date === 'unknown' ?
                'unknown' :
                RenderDate(DataValue?.install_date, 0)
            }
          </td>
        ) : (
          ""
        )}

        {CheckADTable(batteryInfo, "battery_lot") === 1 ? (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {DataValue?.battery_lot}
          </td>
        ) : (
          ""
        )}

        {CheckADTable(batteryInfo, "battery_udi") === 1 ? (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {DataValue?.battery_udi}
          </td>
        ) : (
          ""
        )}
        {CheckADTable(batteryInfo, "install_before_date") === 1 ? (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {/* {RenderDate(DataValue?.install_before_date, 0)} */}
            {
              DataValue?.install_before_date === 'unknown' ?
                'unknown' :
                RenderDate(DataValue?.install_before_date, 0)
            }
          </td>
        ) : (
          ""
        )}
      </tr>
    </>
  );

  /** {CheckADTable(batteryInfo,'serial')===1 &&  
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {DataValue?.battery_serial}
                </td>}
                {CheckADTable(batteryInfo,'v9_install')===1 && 
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {RenderDate(DataValue?.v9_install)}
                </td>}
                {CheckADTable(batteryInfo,'install_before_date')===1 &&
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {RenderDate(DataValue?.install_before_date)}
                </td>
                }

                {CheckADTable(batteryInfo,'date_installed')===1 &&
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                        {RenderDate(DataValue?.date_installed)}
                </td>
                }
                {CheckADTable(batteryInfo,'manufactured_date')===1  &&
                <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
                    {RenderDate(DataValue?.manufactured_date)}
                </td>} */
  //  return(
  //     <>

  //     <tr className="" key={batteryIndex}>

  //                    {/* <td>Main</td> */}

  //                     <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
  //                   {print_battery_part(batteryInfo[batteryIndex].battery_type_id)}
  //                    </td>

  //                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
  //                        {RenderDate(batteryInfo[batteryIndex].manufactured_date,true)}
  //                    </td>

  //                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
  //                        {RenderDate(batteryInfo[batteryIndex].install_date,true)}
  //                    </td>

  //                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
  //                        {RenderDate(batteryInfo[batteryIndex].battery_expiration,true)}
  //                    </td>

  //                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
  //                        {batteryInfo[batteryIndex]?.battery_lot}
  //                    </td>

  //                    <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
  //                        {batteryInfo[batteryIndex]?.battery_udi}
  //                    </td>

  //       </tr>

  //    </>

  // )
};

export default BatteryInformationTr;

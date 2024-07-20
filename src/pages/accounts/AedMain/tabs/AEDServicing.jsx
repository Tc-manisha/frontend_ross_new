
import { useState } from 'react';
import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import './table.css'
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CallGETAPI } from '../../../../helper/API';
import { prepareOptions } from '../../../../helper/Common';
import Moment from 'react-moment';
import New from '../../../../img/New.png';
import TableSkeleton from '../../skeleton/table/TableSkeleton';
import check from "../../../../img/Check.svg"
import cancel from "../../../../img/Cancel.svg"
import { AiOutlineConsoleSql } from 'react-icons/ai';
import moment from 'moment';
import { isSubAdminPermission } from '../../../../helper/permission';

export default function AedServicing({
  stateData,
  privileges,
  is_user
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [aedServiceData, setAEDServiceData] = useState([]);
  const [aedId, setAEDId] = useState();
  const [alarmBattery, setAlarmBatteryDate] = useState();

  const fetchLoad = async () => {
    setLoading(true);
    const res = await CallGETAPI(`account/check_service_history_data_by_id/${stateData.aedId}`)
    if (res?.data?.data?.aed_id) {
      setAEDId(res?.data?.data.aed_id)
      setAEDServiceData(res?.data?.data?.serviceQuestion);
      setAlarmBatteryDate(res?.data?.data?.alarmBattery)
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchLoad();
  }, [])

  console.log({ aedServiceData })

  return (
    <>
      {loading && (
        <div className='' style={{ width: '100%', marginTop: "4%" }}>
          <TableSkeleton />
        </div>
      )}


      {!loading && (<>
        {/* heading */}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
          <Box className="text-left" >
            <h4 className="heading">Aed Service History</h4>
          </Box>

          {/* <Box className="text-left" >
            {
              is_user === true ?
                <>
                  {privileges.includes('aed-servicing-tab') && (
                    <button className='' style={{ marginTop: '10px', textDecoration: 'none', backgroundColor: "transparent", border: "transparent" }} onClick={() => {
                   }}>
                      <img src={New} />
                      New</button>
                  )}
                </>
                :
                <>
                  <button className='new-btn' style={{ marginTop: '10px', textDecoration: 'none', backgroundColor: "transparent", border: "transparent" }} onClick={() => {
                 }}>
                    <img src={New} />
                    New</button>
                </>
            }
          </Box> */}
        </div>

        {/* data grid table */}
        <div className="data-table pb-3 multiple-row-table" style={{marginBottom:"20px" }}>

          <DataGrid
            dataSource={aedServiceData}
            keyExpr="questions_id"
            showColumnLines={true}
            showRowLines={true}
            showBorders={false}
            rowAlternationEnabled={true}
          >
            <Column
              dataField="inspection_date"
              caption="Aed Service Date"
              cssClass="column-header"
              cellRender={(data) => (
                <span
                  className={(isSubAdminPermission("service-check-details") === 1) ? 'link' : ""}
                  style={{ cursor: 'pointer', color: '#0c71c3', textDecoration: 'none' }}
                  onClick={() => (isSubAdminPermission("service-check-details") === 1) && navigate(`/account-details/AEDServiceDetails/${aedId}/${data.data.questions_id}`)}
                >
                  <Moment date={data?.data?.inspection_date} format="MM/DD/YYYY h:mm:ss" />
                </span>
              )}
            />
            <Column
              dataField="aeds_ready_status"
              caption="Present/Ready"
              cssClass="column-header"
              cellRender={(data) => (
                <img src={data.data.aeds_ready_status ? check : cancel} alt="Status" height={12} />
              )}
            />
            <Column
              dataField="rescue_kits_status"
              caption="Replaced Rescue Kit"
              cssClass="column-header"
              cellRender={(data) => (
                <img src={data.data.rescue_kits_status ? check : cancel} alt="Status" height={12} />
              )}
            />
            <Column
              dataField="accessories_status"
              caption="Replaced Accessories"
              cssClass="column-header"
              cellRender={(data) => (
                <img src={data.data.accessories_status ? check : cancel} alt="Status" height={12} />
              )}
            />
            <Column
              // dataField="Alarm_Battery_Exp"
              caption="Alarm Battery Exp"
              cssClass="column-header"
              dataType="date"
              cellRender={() => (
                // <Moment date={alarmBattery} format="MM/DD/YYYY" />
                moment(alarmBattery).isValid() ? moment(alarmBattery).format("MM/DD/YYYY") : ''
              )}
            />
            <Column
              dataField="inspection_by"
              caption="Technician"
              cssClass="column-header"
              cellRender={(data) => (
                data.data.inspection_by
              )}
            />

            <Scrolling columnRenderingMode="virtual" />
            <Paging enabled={false} />
          </DataGrid>


        </div>
      </>
      )}

    </>
  )
}

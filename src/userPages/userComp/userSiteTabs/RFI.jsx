import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { CallGETAPINEW } from '../../../helper/API';
import { Link, useParams } from 'react-router-dom';
import Moment from 'react-moment';
import { DateFormate } from '../../../helper/TblFn';
import TableSkeleton from '../../../pages/accounts/skeleton/table/TableSkeleton';

export default function RFI({ is_user,site_id }){
  const[rfiDataList, setRfiDatList] = useState([]);
  const [ showLoading, setShowLoading ] = React.useState(true);
  
  // fecth rfi data
  const fetchOnLoad = async() => {
    const rfiData = await CallGETAPINEW('account/get-rfi-by-site/' + site_id)
  console.log(rfiData);
    if(rfiData?.status) {
      setRfiDatList(rfiData?.data?.data)
    }

    setShowLoading(false);
  }

  // status
  const getStatus = (data) => {
    return data.status == 1 ? 'Completed' : 'Not Completed';
  }

  // rfi site name
  const getSiteNameValue = (data) => { 
    return (
      <>
      {data?.status == 1 ? <>
        <Link 
          style={ { color: "#0C71C3", fontWeight: 600, cursor: "pointer", textDecoration: 'none' } } 
          to={'/account/rfi-details/' + data?.id}
        >
          {data?.site_name}
        </Link>
        </> : <>
          <span 
            style={ { fontWeight: 400, textDecoration: 'none' } } 
          >
            {data?.site_name}
          </span>
        </>}
      </>
    )
  }

  // getSentDate
  const getSentDate = (data) => { 
    return (
      <>
        {data?.sent_date && (
          <Moment date={data?.sent_date} format={'MM/DD/YYYY hh:mm:ss'} />
        )}
      </>
    )
  }

  // getCompletedDate
  const getCompletedDate = (data) => { 
    return (
      <>
        {data?.completed_date && (
          <Moment date={data?.completed_date} format={'MM/DD/YYYY hh:mm:ss'} />
        )}
      </>
    )
  }

  useEffect(() => {
    fetchOnLoad();
  }, [site_id])
  return (
    <div className='relative'>
      {/* loading */}
      {showLoading && (
          <div className="" style={{marginTop:"4%"}}>
              <TableSkeleton />
          </div>
      )}

{!showLoading && ( <>
      {/* heading */}
      <Box className="text-left pt-3 pb-1">
        <h4 className='heading'>Request for Information</h4>
      </Box>

      {/* data grid table */}
      <div className="data-table pb-3 multiple-row-table">
        <DataGrid 
          dataSource={rfiDataList}
          height={ 250 }
          showColumnLines={true}
          showRowLines={true}
          showBorders={false}
          rowAlternationEnabled={true}>
          <Column dataField="site_name" cellRender={ (e) => getSiteNameValue(e.data) } width={350} caption="Site Name" cssClass="column-header" />
          <Column dataField="course_name" caption="Course Name" cssClass="column-header" />
          <Column cellRender={ (e) => getSentDate(e.data) } caption="Sent Date" cssClass="column-header" />
          <Column cellRender={ (e) => getCompletedDate(e.data) } caption="Completed Date" cssClass="column-header" />
          <Column dataField="status" cellRender={ (e) => getStatus(e.data) } caption="Status" cssClass="column-header" />

          <Scrolling columnRenderingMode="virtual" />
          <Paging enabled={ false } />
        </DataGrid>
      </div>
      </>
)}

    </div>
  )
}

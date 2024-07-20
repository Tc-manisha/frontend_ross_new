import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './table.css'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { CallGETAPINEW } from '../../../../helper/API';
import { Link, useParams } from 'react-router-dom';
import Moment from 'react-moment';
import Loading from '../../Loading';
import TableSkeleton from '../../skeleton/table/TableSkeleton';

export default function RFI(){
  const[rfiDataList, setRfiDatList] = useState([])
  const [ showLoading, setShowLoading ] = React.useState(true);

  const {accountId} = useParams()
  // fecth rfi data
  const fetchOnLoad = async() => {
    const rfiData = await CallGETAPINEW('account/get-rfi-by-account/' + accountId)

    if(rfiData?.status) {
      setRfiDatList(rfiData?.data?.data)
    }

    // show loading false
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
  }, [accountId])
  return (
    <div className='relative'>

      {/* loading */}
      {showLoading && (
        <div className="showloading-table">
          <TableSkeleton />
        </div>
      )}

      {/* heading */}
      <Box className="text-left pt-3 pb-1">
        <h4 className='heading'>Request for Information</h4>
      </Box>

      {/* data grid table */}
      <div className="data-table pb-3 multiple-row-table">
        <DataGrid 
          dataSource={rfiDataList}
          // height={ 250 }
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

    </div>
  )
}

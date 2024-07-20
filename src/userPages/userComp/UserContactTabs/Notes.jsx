import { useEffect, useState } from 'react';
import { Box } from '@mui/material'
import React from 'react'
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { CallGETAPI } from '../../../helper/API';
import { Link, useNavigate } from 'react-router-dom';
import { FormatDate, FormatDateTime, FormatDateWithTime } from '../../../helper/Common';
import TableSkeleton from '../../../pages/accounts/skeleton/table/TableSkeleton';
import { isUserPermission } from '../../../helper/permission';
import New from "../../../img/New.png";


export default function Notes({ accountId, site_id = 0, contact_id = 0, type = 'ACCOUNT', inperson_id = 0, privileges}) {
  const navigate = useNavigate();
  let redirectUrl = `/account/new-note?account_id=${accountId}`;

  if (type === 'CONTACT') {
    redirectUrl = `/account/new-note?account_id=${accountId}&contact_id=${contact_id}`;
  }
  if (type === 'SITE') {
    redirectUrl = `/account/new-note?account_id=${accountId}&site_id=${site_id}`;
  }

  if (type === 'INPERSON') {
    redirectUrl = `/account/new-note?account_id=${accountId}&inperson_id=${inperson_id}`;
  }


  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      let sendUrl = 'notes/account-notes/' + accountId;

      if (type === 'CONTACT') {
        sendUrl = `notes/contact-notes?account_id=${accountId}&contact_id=${contact_id}`;
      }

      if (type === 'SITE') {
        sendUrl = `notes/site-notes?account_id=${accountId}&site_id=${site_id}`;
      }


      if (type === 'INPERSON') {
        sendUrl = `notes/inperson-notes?account_id=${accountId}&inperson_id=${inperson_id}`;
      }

      let response = await CallGETAPI(sendUrl);
      let resultData = response?.data?.data || [];


      setNotesData(resultData)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleStatus = (e) => {
    if (e.value) {
      return <span className='text-left text-success'>Active</span>
    } else {
      return <span className='text-left'>Deactive</span>

    }
  }

  const handleRender = (e) => {
    // return <Link to={`/account/edit-note/${e.data.notes_id}`} className="text-primary">{e.value}</Link>
    return <span 
    // to={`/account/note/${e.data.notes_id}`}
    onClick={() => (isUserPermission("note-details") == 1) && navigate(`/account/note/${e.data.notes_id}`)} 
    className={(isUserPermission("note-details") == 1) ? "link" : ""}>
      {e.value}
      </span>

  }


  const handleDateRender = (e) => {
    return FormatDateWithTime(e.value);
  }

  return (
    <div className='relative' style={{ marginBottom: '5%' }}>
      {/* heading */}
      <Box className="text-left pt-3 pb-1">
        <div className='heading d-flex' >

          {/* Meep Fitness Rickenbacker  */}

          {privileges?.includes("new-note") && (
          <span className='' style={{ marginLeft: 'auto', color:"#0C71C3" }}>
            <Link to={redirectUrl} className="btn ">
            <img
              src={New}
              alt="New"
              style={{ marginRight: "5px", color:"#0C71C3" }}
            /> 
            <span style={{ color:"#0C71C3", fontSize:"16px" }}> New </span>
            </Link>
          </span>
          )}

        </div>
      </Box>

      {/* data grid table */}
      <div className="data-table pb-3">
        {!loading ? (
          <DataGrid
            dataSource={notesData}
            // height={ 250 }
            keyExpr="notes_id"
            showColumnLines={true}
            showRowLines={true}
            showBorders={false}
            rowAlternationEnabled={true}>
            <Column dataField="title" cssClass="column-header" cellRender={handleRender} />
            <Column dataField="related_to" cssClass="column-header" />
            <Column dataField="created_date" cssClass="column-header" cellRender={handleDateRender} />
            <Column dataField="created_by" cssClass="column-header" />
            <Column dataField="access" cssClass="column-header" />
            {/* <Column
              dataField="active"
              width={130}
              cssClass="column-header"
              dataType={'string'}
              cellRender={handleStatus}
            /> */}
            <Scrolling columnRenderingMode="virtual" />
            <Paging enabled={false} />
          </DataGrid>
        ) : (
          <>
            <p>{loading}</p>
            <div style={{ padding: 0 }}>
              <TableSkeleton />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
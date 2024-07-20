import { useEffect, useState } from 'react';
import { Box } from '@mui/material'
import React from 'react'
import './table.css'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { EditIcon } from '../../../helper/Icons';
import { CallGETAPI } from '../../../helper/API';
import { Link, useNavigate } from 'react-router-dom';
import { FormatDate, FormatDateTime, FormatDateWithTime, getPermission } from '../../../helper/Common';
import TableSkeleton from '../skeleton/table/TableSkeleton';
import { AccountDetailsTab } from '../../../utils';
import Details from './Details';
import { DecryptToken } from '../../../helper/BasicFn';
import New from "../../../img/New.png";


export default function Notes({ accountId, site_id = 0, contact_id = 0, type = 'ACCOUNT', inperson_id = 0, }) {

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
  const user = DecryptToken();
  const privilege = getPermission();
  const navigate = useNavigate();

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
    return (
      <span onClick={()=> (user?.user_type == 0 || (user?.user_type == 2 && user?.sub_admin != "" && privilege?.includes("note-details")))
        && navigate(`/account/note/${e.data.notes_id}`)}
       className={(user?.user_type == 0 || (user?.user_type == 2 && user?.sub_admin != "" && privilege?.includes("note-details")))
       ? "link" : ""} 
       style={{ cursor: (user?.user_type == 0 || (user?.user_type == 2 && user?.sub_admin != "" && privilege?.includes("note-details")))
       ? 'pointer' : "" }}>
        {e.value}
      </span>
    );
  };


  const handleDateRender = (e) => {
    return FormatDateWithTime(e.value);
  }

  return (
    <div className='relative' style={{ marginBottom: '5%' }}>
      {/* heading */}
      
      <Box className="text-left pt-3 pb-1">
      {(user?.user_type == 0 ||
               (user?.user_type == 2 && user?.sub_admin != "" && privilege?.includes("new-note"))) && ( 
        <div className='heading d-flex' >

          <span className='' style={{ marginLeft: 'auto' }}>
            <Link to={redirectUrl} className="btn "><img
              src={New}
              alt="New"
              style={{ marginRight: "5px", color:"#0C71C3"}}
            /> 
           <span style={{color:"#0C71C3"}}> New </span> 
            </Link>
          </span>

        </div>
        )}
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
            <Column
              dataField="active"
              width={130}
              cssClass="column-header"
              dataType={'string'}
              cellRender={handleStatus}
            />
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
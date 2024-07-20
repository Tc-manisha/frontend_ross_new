import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react';
// import './table.css'
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { Link, useParams } from 'react-router-dom';
import { CallGETAPI } from '../../../helper/API';
import TableSkeleton from '../../../pages/accounts/skeleton/table/TableSkeleton';


export default function Emails(){
  const [emailList, setEmailList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { accountId,contactId } = useParams();

  // fetch email
  const fetchEmail = async () => {
    try {
      const result = await CallGETAPI('account/emails-by-contact/' + contactId);

      if (result?.status) {
        const emailDataList = result?.data?.emailList;
        setEmailList(emailDataList);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
  };

  // use effect
  useEffect(() => {
    fetchEmail();
  }, []);

  // getEmailDetails
  const getEmailDetails = (data) => {
    return (
      <>
        <Link className='link' style={{textDecoration:"none"}} to={'/account/' + accountId + '/email/' + data?.id}>{data?.subject}</Link>
      </>
    );
  };


  return (
    <div className='relative'>

      {/* data grid table */}
      <div className="data-table py-4">
        {!loading ? (
          <DataGrid
            dataSource={emailList}
            keyExpr="id"
            showColumnLines={true}
            showRowLines={true}
            showBorders={false}
            rowAlternationEnabled={true}>
            <Column dataField="email"  caption={"Recipient"} cssClass="column-header" />
            <Column dataField="subject" cellRender={(e) => getEmailDetails(e.data)} caption={"Subject"} cssClass="column-header" />
            <Column dataField="created_date" caption={"Email Date"} dataType={'date'} cssClass="column-header" />

            <Scrolling columnRenderingMode="virtual" />
            <Paging enabled={false} />
          </DataGrid>
        ) : (
			<>
			<p>{loading}</p>
			<div className="showloading-table">
			<TableSkeleton />
		  </div>
		  </>
        )}
      </div>

    </div>
  );
}

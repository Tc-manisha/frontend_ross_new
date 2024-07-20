import { Box } from '@mui/material'
import React from 'react'
import './table.css'
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import {useState, useEffect } from 'react';
import TableSkeleton from '../../skeleton/table/TableSkeleton';
import New from '../../../../img/New.png';
import { CallGETAPI } from '../../../../helper/API';

export default function AedDocuments({aedId,accountID}) {
  const [loading, setLoading] = useState(true);

  const fetchData = async() => {

    const res = await CallGETAPI(`get-all-aed-documents?accountId=${accountID}&aedId=${aedId}`)
    // if(res?.data?.status){
    //   const list  = res?.data?.ticketList || [];
    //   setSupportData(list);
    // }
    setLoading(false);
  } 

  useEffect(() => {
    fetchData();
  },[])

  return (
    <div className="relative mb-5">
     		{loading && (
        <div className='' style={{ width: '100%',marginTop:"4%"}}>
          <TableSkeleton />
        </div>
      )}

      {!loading && ( <> 

     <>
        {/* heading */}
        <div style={{display:"flex",flexDirection:"Row",justifyContent:"space-between"}}>
        <Box className="text-left">
          <h4 className="heading">Account</h4>
        </Box>

        {/* <Box className="text-left" > */}
        {/* <h4 className='heading'>Meep Fitness Rickenbacker</h4> */}
        {/* <button className='' style={{marginTop: '10px',textDecoration: 'none',backgroundColor:"transparent",border:"transparent"}} onClick={()=>{
				// navigate('/account/new-support/'+mainAccountId);
				// navigate("/account/new-support/"+mainAccountId, {state:  stateData});
    
			}}>
        <img src={New} />
        New</button> */}
      {/* </Box> */}
      </div>

        {/* data grid table */}

        <div className="data-table pb-3">
          <DataGrid
            dataSource={''}
            // height={250}
            keyExpr=""
            showColumnLines={true}
            showRowLines={true}
            showBorders={false}
            rowAlternationEnabled={true}
          >
            <Column
              dataField="parent_document_name"
              caption="Document Name"
              cssClass="column-header"
              cellRender={""}
            />
            <Column dataField="comment" cssClass="column-header" />
            <Column dataField="related_to" cssClass="column-header" />
            <Column
              dataField="uploaded_by_name"
              cssClass="column-header"
              caption="Uploaded by"
            />
            <Column
              dataField="createdAt"
              cssClass="column-header"
              caption={"Uploaded Date"}
              cellRender={""}
            />

            <Scrolling columnRenderingMode="virtual" />
            <Paging enabled={false} />
          </DataGrid>
        </div>
       </>
       <div>
    </div>
    </>)}
  </div>
);
}


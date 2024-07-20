import React from 'react'
import Box from "@mui/material/Box";
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { DateFormate } from '../../../../helper/TblFn';
import Moment from 'react-moment';
import Container from "react-bootstrap/Container";
import { useState, useEffect } from 'react';
import TableSkeleton from '../../skeleton/table/TableSkeleton';

const classes = [
    {
        ID: 1,
        AccountName: 'John',
        SiteName: 'Heart',
        Prefix: 'Mr.',
    },
];

export default function Students() {

    const [loading, setLoading] = useState(true);

    const fetchLoad = () => {
        setLoading(false);
    }

    useEffect(() =>{
        fetchLoad();
    })

  return (
    <div>
{loading && (
        <div className='' style={{ width: '100%',marginTop:"4%"}}>
          <TableSkeleton />
        </div>
      )}


      {!loading && ( <> 
        {/* account information */}
        <Box className="text-left">
            <h4 className='heading'>Account Information</h4>
        </Box>

        {/* data grid table */}
        <div className="data-table pb-3 multiple-row-table">
            <DataGrid 
                dataSource={classes}
                keyExpr="ID"
                showColumnLines={true}
                showRowLines={false}
                showBorders={false}
                rowAlternationEnabled={true}>
                <Column dataField="AccountName" width={200} caption="Account Name" />
                <Column dataField="SiteName" caption="Site Name" width={200} dataType="date" />
                <Column dataField="" caption="" dataType="date" />

                <Scrolling columnRenderingMode="virtual" />
                <Paging enabled={ false } />
            </DataGrid>
        </div>
       </>)}
    </div>
  )
}

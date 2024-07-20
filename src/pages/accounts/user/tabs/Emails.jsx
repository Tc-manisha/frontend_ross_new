import { Box } from '@mui/material'
import React from 'react'
import './table.css'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';

const customers = [{
  ID: 1,
  FirstName: 'John',
  LastName: 'Heart',
  City: 'Los Angeles',
}, {
  ID: 2,
  FirstName: 'Olivia',
  LastName: 'Peyton',
  City: 'Los Angeles',
}, {
  ID: 3,
  FirstName: 'Robert',
  LastName: 'Reagan',
  City: 'Bentonville',
}, {
  ID: 4,
  FirstName: 'Greta',
  LastName: 'Sims',
  City: 'Atlanta',
}, {
  ID: 5,
  FirstName: 'Brett',
  LastName: 'Wade',
  City: 'Boise',
}, {
  ID: 6,
  FirstName: 'Sandra',
  LastName: 'Johnson',
  City: 'Beaver',
}, {
  ID: 7,
  FirstName: 'Kevin',
  LastName: 'Carter',
  City: 'San Diego',
}, {
  ID: 8,
  FirstName: 'Cynthia',
  LastName: 'Stanwick',
  City: 'Little Rock',
}, {
  ID: 9,
  FirstName: 'Kent',
  LastName: 'Samuelson',
  City: 'St. Louis',
}, {
  ID: 10,
  FirstName: 'Taylor',
  LastName: 'Riley',
  City: 'San Jose',
}];

export default function Emails()
{
  return (
    <div className='relative'>
      {/* heading */}
      <Box className="text-left pt-3 pb-1">
        <h4 className='heading'>Meep Fitness Rickenbacker</h4>
      </Box>

      {/* data grid table */}
      <div className="data-table pb-3">
        <DataGrid 
          dataSource={customers}
          height={ 250 }
          keyExpr="ID"
          showColumnLines={true}
          showRowLines={true}
          showBorders={false}
          rowAlternationEnabled={true}>
          <Column dataField="FirstName" cssClass="column-header" />
          <Column dataField="LastName" cssClass="column-header" />
          <Column dataField="City" cssClass="column-header" />

          <Scrolling columnRenderingMode="virtual" />
          <Paging enabled={ false } />
        </DataGrid>
      </div>

    </div>
  )
}

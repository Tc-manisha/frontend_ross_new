import React from 'react'
import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    Pager,
    Paging,
    SearchPanel,
    FilterRow, HeaderFilter,
  } from 'devextreme-react/data-grid';

  import Short from '../../../img/Sort.png'

const AlertTable = () => {

    function createData(StudentName, Site, Course, Class, Status, Expiration) {
        return { StudentName, Site, Course, Class, Status, Expiration };
      }
      
      const rows = [
        createData('Lois meep', 'meep fitness Martha', 'Adult CPR / AED & First Aid / BBP', '887878955', 'expired', '07/29/2022'),
        createData('Clerk', 'meep fitness Martha', 'Adult CPR / AED & First Aid / BBP', '887878955', 'expired', '07/29/2022'),
      ];

  return (
    <div>

      {/* <img src={Short} /> */}
        <DataGrid
        dataSource={rows}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
      >
          <HeaderFilter visible={false} />
       
        <Column
          dataField="StudentName"
          caption="Student Name"
          dataType="number"
          format="currency"
          alignment="left"
        />
        <Column
          dataField="Site"
          caption="Site"
          dataType="number"
          format="percent"
          alignment="left"
          allowGrouping={false}
          cssClass="bullet"
        />
        <Column dataField="Course" dataType="string" />
        <Column dataField="Class" dataType="string" />
        <Column dataField="Status" dataType="string" />
        <Column dataField="Expiration" dataType="string" />

      </DataGrid>
    </div>
  )
}

export default AlertTable
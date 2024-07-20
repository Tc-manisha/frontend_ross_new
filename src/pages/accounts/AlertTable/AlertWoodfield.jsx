import React from 'react'
import DataGrid, {
	Column,
	Grouping,
	GroupPanel,
	Pager,
	Paging,
	SearchPanel, HeaderFilter
} from 'devextreme-react/data-grid';

const AlertWoodfield = () =>
{
	function createData(StudentName, Course, Class, Status, Expiration, Certification)
	{
		return { StudentName, Course, Class, Status, Expiration, Certification };
	}

	const rows = [
		createData('Lois meep', 'meep fitness Martha', 'Adult CPR / AED & First Aid / BBP', '887878955', 'expired', '07/29/2022'),
		createData('Clerk', 'meep fitness Martha', 'Adult CPR / AED & First Aid / BBP', '887878955', 'expired', '07/29/2022'),
	];
	return (
		<div>
			<DataGrid
				dataSource={ rows }
				allowColumnReordering={ true }
				rowAlternationEnabled={ true }
				showBorders={ true }
			>
				<HeaderFilter visible={ false } />
				<Column
					dataField="StudentName"
					caption="Student Name"
					dataType="number"
					format="currency"
					alignment="left"
				/>
				<Column
					dataField="Course"
					caption="Course"
					dataType="number"
					format="percent"
					alignment="left"
					allowGrouping={ false }
					cssClass="bullet"
				/>
				<Column dataField="Class" dataType="string" />
				<Column dataField="Status" dataType="string" />
				<Column dataField="Expiration" dataType="string" />
				<Column dataField="Certification" dataType="string" />
			</DataGrid>
		</div>
	)
}

export default AlertWoodfield
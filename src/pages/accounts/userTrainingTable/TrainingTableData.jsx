import React from 'react'
import DataGrid, {
	Column,
	Grouping,
	GroupPanel,
	Pager,
	Paging,
	SearchPanel, HeaderFilter
} from 'devextreme-react/data-grid';

const TrainingTableData = () => {
	function createData(StudentName, Course, Class, Status, Expiration, Certification) {
		return { StudentName, Course, Class, Status, Expiration, Certification };
	}

	const rows = [
		createData('Lois meep', 'meep fitness Martha', 'Adult CPR / AED & First Aid / BBP', 'expired', '8564895263', '07/29/2022'),
		createData('Clerk', 'meep fitness Martha', 'Adult CPR / AED & First Aid / BBP', 'expired', '8564895263', '07/29/2022'),
		createData('Lois meep', 'meep fitness Martha', 'Adult CPR / AED & First Aid / BBP', 'expired', '8564895263', '07/29/2022'),
		createData('Clerk', 'meep fitness Martha', 'Adult CPR / AED & First Aid / BBP', 'expired', '8564895263', '07/29/2022'),
	];

	return (
		<div className='mb-4'>
			<DataGrid
				dataSource={""}
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
					dataField="Course"
					caption="Course"
					dataType="number"
					format="percent"
					alignment="left"
					allowGrouping={false}
					cssClass="bullet"
				/>
				<Column dataField="Class" dataType="string" />
				<Column dataField="Status" dataType="string" />
				{/* className={rows?.Status == "expired" ? "status-color" : ""} */}
				<Column dataField="Expiration" dataType="string" />
				<Column dataField="Certification" dataType="string" />
			</DataGrid>
		</div>
	)
}

export default TrainingTableData
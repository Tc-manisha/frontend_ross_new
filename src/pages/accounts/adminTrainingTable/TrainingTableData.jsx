import React from 'react'
import DataGrid, {
	Column,
	Grouping,
	GroupPanel,
	Pager,
	Paging,
	SearchPanel, HeaderFilter
} from 'devextreme-react/data-grid';
import { Link, useNavigate } from 'react-router-dom';

const TrainingTableData = ({ trainingData }) =>
{
	const navigate = useNavigate();
	// check expiry or not
	const getRowStatus = (data) => {
		const currentDate = new Date();
		const expirationDate = new Date(data?.expirationDate);
		if(expirationDate < currentDate) {
			return (
				<span className='text-red'>Expired</span>
			)
		} else {
			return (
				<span className=''>Completed</span>
			)
		}
	}

	// check expiry or not
	const getRowExpiryData = (data) => {
		const currentDate = new Date();
		const expirationDate = new Date(data?.expirationDate);
		if(expirationDate < currentDate) {
			return (
				<span className='text-red'>{data?.expirationDate}</span>
			)
		} else {
			return (
				<span className=''>{data?.expirationDate}</span>
			)
		}
	}

	// get class id
	const getRowInpersonClass = (data) => {
		const stateData = {
			type: "Training",
		  };
	  
		const handleClick = () => {
		  navigate(`/account/inperson/details/${data?.inpersonId}`, {state: stateData});
		};
	  
		return (
		  <span className='link' onClick={handleClick}>{data?.classID}</span>
		);
	  };
	
	return (
		<div>

			{trainingData?.length > 0 ? <>
				{/* training table data */}
				{trainingData?.map((data, index) => (
					<div className='mb-4' key={index}>
						<div className='d-flex justify-content-between mt-4' style={ { marginTop: "5px", marginBottom: "5px", color: "#0c71c3" } }>
							<div style={ { fontSize: "22px", fontWeight: "bold" } }>{data?.siteName}</div>
						</div>

						{/* table */}
						<DataGrid
							dataSource={ data?.data ?? [] }
							allowColumnReordering={ true }
							rowAlternationEnabled={ true }
							showBorders={ true }
						>
							<HeaderFilter visible={ false } />
							<Column dataField="studentName" caption="Student Name" />
							<Column dataField="siteName" caption="Site Name" />
							<Column dataField="courseName" caption="Course Name" />
							<Column dataField="classID" caption="Class" cellRender={ (e) => getRowInpersonClass(e.data) } />
							<Column dataField="Status" caption="Status" cellRender={ (e) => getRowStatus(e.data) } />
							<Column dataField="expirationDate" caption="Expiration Date" cellRender={ (e) => getRowExpiryData(e.data) } dataType="date" />
							<Column dataField="certification" caption="Certification" />
						</DataGrid>
					</div>
				))}
			</> : 
				<div className="my-5">
					{/* table */}
					<DataGrid
						dataSource={ [] }
						allowColumnReordering={ true }
						rowAlternationEnabled={ true }
						showBorders={ true }
					>
						<HeaderFilter visible={ false } />
						<Column dataField="studentName" caption="Student Name" />
						<Column dataField="siteName" caption="Site Name" />
						<Column dataField="courseName" caption="Course Name" />
						<Column dataField="classID" caption="Class" cellRender={ (e) => getRowInpersonClass(e.data) } />
						<Column dataField="Status" caption="Status" cellRender={ (e) => getRowStatus(e.data) } />
						<Column dataField="expirationDate" caption="Expiration Date" cellRender={ (e) => getRowExpiryData(e.data) } dataType="date" />
						<Column dataField="certification" caption="Certification" />
					</DataGrid>
				</div>
			}
		</div>
	)
}

export default TrainingTableData
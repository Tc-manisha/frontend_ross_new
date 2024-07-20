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
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const AlertTable = ({ alertTrainingData }) =>
{

	const [ alertData, setAlertData] = React.useState([]);

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
				<span className='text-orange'>Completed</span>
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
				<span className='text-orange'>{data?.expirationDate}</span>
			)
		}
	}

	// get class id
	const getRowInpersonClass = (data) => {
		return (
			<Link to={'/account/inperson/details/' + data?.inpersonId} className='link'>{data?.classID}</Link>
		)
	}
	

	useEffect(() => {
		if(alertTrainingData) {
			setAlertData(alertTrainingData);
		}
	}, [alertTrainingData])

	return (
		<div>

			<DataGrid
				dataSource={ alertData }
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

			</DataGrid>
		</div>
	)
}

export default AlertTable
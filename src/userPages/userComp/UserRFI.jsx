import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './Tabls.scss'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Moment from 'react-moment';
import { CallGETAPI } from '../../helper/API';
import TableSkeleton from '../../pages/accounts/skeleton/table/TableSkeleton';
import { getPermission } from '../../helper/Common';
import { isUserPermission } from '../../helper/permission';
import New from "../../img/New.png";

export default function UserRFI({ account_id, privileges }) {
	const [rfiDataList, setRfiDatList] = useState([])
	const [showLoading, setShowLoading] = useState(true);
	const { userAccountId } = useParams();
	const navigate = useNavigate();

	// fecth rfi data
	const fetchOnLoad = async () => {
		const rfiData = await CallGETAPI('user/get-rfi-tab/' +userAccountId)

		if (rfiData?.status) {
			setRfiDatList(rfiData?.data?.data)
		}

		// show loading false
		setShowLoading(false);
	}

	// status
	const getStatus = (data) => {
		return data.status == 1 ? 'Completed' : 'Not Completed';
	}

	let is_rfi_details = false

	let permissions = getPermission();//localStorage.getItem('permissions')
	let permissionsArr = permissions.split(',')
	if (permissionsArr.includes('rfi-details')) {
		is_rfi_details = true
	}

	// rfi site name
	const getSiteNameValue = (data) => {
		return (
			<>
				{data?.status == 1 ? <>
					<span
						className={(isUserPermission("rfi-details") == 1) ? "link" : ""}
						onClick={()=> (isUserPermission("rfi-details") == 1 && is_rfi_details) && navigate('/account/rfi-details/' + data?.id)}
					>
						{data?.site_name}
					</span>
				</> : <>
					<span
						style={{ fontWeight: 400, textDecoration: 'none' }}
					>
						{data?.site_name}
					</span>
				</>}
			</>
		)
	}

	// getSentDate
	const getSentDate = (data) => {
		return (
			<>
				{data?.sent_date && (
					<Moment date={data?.sent_date} format={'MM/DD/YYYY hh:mm:ss'} />
				)}
			</>
		)
	}

	// getCompletedDate
	const getCompletedDate = (data) => {
		return (
			<>
				{data?.completed_date && (
					<Moment date={data?.completed_date} format={'MM/DD/YYYY hh:mm:ss'} />
				)}
			</>
		)
	}

	useEffect(() => {
		fetchOnLoad();
	}, [])
	return (
		<div className='relative'>

			{/* loading */}
			{showLoading && (
				<div className="showloading-table">
					<TableSkeleton />
				</div>
			)}

			{/* heading */}
			<Box className="text-left pt-3 pb-1" style={{ display: 'flex' }}>
				<h4 className='heading'>Request for Information</h4>

				{privileges.includes('new-rfi') && (
					<span className='' style={{ marginLeft: 'auto', color: "#0C71C3" }}>
						<Link to={`/account/rfi/new/${account_id}`} className="btn ">
							<img
								src={New}
								alt="New"
								style={{ marginRight: "5px" }}
							/> 
						  <span style={{color: "#0C71C3"}}> New</span>
							</Link>
					</span>
				)}
			</Box>

			{/* data grid table */}
			<div className="data-table pb-3 multiple-row-table">
				<DataGrid
					dataSource={rfiDataList}
					// height={ 250 }
					showColumnLines={true}
					showRowLines={true}
					showBorders={false}
					rowAlternationEnabled={true}>
					<Column dataField="site_name" cellRender={(e) => getSiteNameValue(e.data)} width={350} caption="Site Name" cssClass="column-header" />
					<Column dataField="course_name" caption="Course Name" cssClass="column-header" />
					<Column cellRender={(e) => getSentDate(e.data)} caption="Sent Date" cssClass="column-header" />
					<Column cellRender={(e) => getCompletedDate(e.data)} caption="Completed Date" cssClass="column-header" />
					<Column dataField="status" cellRender={(e) => getStatus(e.data)} caption="Status" cssClass="column-header" />

					<Scrolling columnRenderingMode="virtual" />
					<Paging enabled={false} />
				</DataGrid>
			</div>

		</div>
	)
}

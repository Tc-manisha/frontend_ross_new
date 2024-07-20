import { Box } from '@mui/material'
import React from 'react'
import './Tabls.scss'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CallGETAPI } from '../../helper/API';
import TableSkeleton from '../../pages/accounts/skeleton/table/TableSkeleton';
import { getPermission } from '../../helper/Common';

export default function UserEmails() {
	const [emailList, setEmailList] = useState([]);
	const [loading, setLoading] = useState(true);
	const { userAccountId } = useParams();

	// fetch email
	const fetchEmail = async () => {
		// const result = await CallGETAPI('user/emails-by-contact');
		const result = await CallGETAPI("user/user-email-tab/", +userAccountId)

		if (result?.status) {
			const emailDataList = result?.data?.emailList;
			setEmailList(emailDataList);
		}
		setLoading(false);
	}

	// use effect
	useEffect(() => {
		fetchEmail();
	}, []);

	let is_email_details = false

	let permissions = getPermission();// localStorage.getItem('permissions')
	let permissionsArr = permissions.split(',')
	if (permissionsArr.includes('contact-details')) {
		is_email_details = true
	}

	// getRecipient
	const getRecipient = (data) => {
		return (
			<>
				<Link className='link' style={{textDecoration:"none"}} to={is_email_details ? '/account/' + data?.account_id + '/contact-details/' + data?.contact_id : ''}>{data?.email}</Link >
				{/* <span>{data?.email}</span> */}
			</>
		)
	}

	// getEmailDetails
	const getEmailDetails = (data) => {
		return (
			<>
				<Link className='link' style={{textDecoration:"none"}} to={'/account/' + data?.account_id + '/email/' + data?.id}>{data?.subject}</Link>
			</>
		)
	}

	return (
		<div className='relative'>
			{/* data grid table */}
			<div className='data-table py-4'>
				{loading ? (
					<>
						<p>{loading}</p>
						<div>
							<TableSkeleton />
						</div>
					</>// Display a loading message while fetching data
				) : (
					<>
						<DataGrid
							dataSource={emailList}
							keyExpr="id"
							showColumnLines={true}
							showRowLines={true}
							showBorders={false}
							rowAlternationEnabled={true}>
							<Column dataField="email" cellRender={(e) => getRecipient(e.data)} caption={"Recipient"} cssClass="column-header" />
							<Column dataField="subject" cellRender={(e) => getEmailDetails(e.data)} caption={"Subject"} cssClass="column-header" />
							<Column dataField="created_date" caption={"Email Date"} dataType={'date'} cssClass="column-header" />

							<Scrolling columnRenderingMode='virtual' />
							<Paging enabled={false} />
						</DataGrid>
					</>
				)}
			</div>
		</div>
	);
}

import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './table.css'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { Link, useParams } from 'react-router-dom';
import { CallGETAPI } from '../../../../helper/API';
import { prepareOptions } from '../../../../helper/Common';

export default function Support()
{
	const { accountId } = useParams();
	const [ supportList, setSupportList] = useState();
    const [ issueTypeList, setIssueTypeList ] = useState();

	// get support list
	const getSupportList = async(e) => {
		let user = localStorage.getItem('ross-profile');
		user = JSON.parse(user);

		const issueTypeResult = await CallGETAPI('support/all-issues-type');

        if(issueTypeResult?.status) {
            const issueTypes = issueTypeResult?.data?.issuesList
            const allIssueTypes = prepareOptions(issueTypes, 'issue_id', 'issue_name')
            setIssueTypeList(allIssueTypes);
        }

		// get support details
		const result = await CallGETAPI('support/ticket-details-byuserid');

		if(result?.status) {
			const resultData = result?.data?.ticketList;
			setSupportList(resultData);
		}
	}

	useEffect(() => {
		getSupportList();
	}, []);


	// getStatus for table
	const getStatus = (data) => {
		return (
			<>
			{data?.status == 1 ? 
				<span className='text-danger'>Active</span>
				:
				<span>Completed</span>
			}
			</>
		)
	}

	// getStatus for table
	const getIssue = (data) => {
		return (
			<>
				<Link className="link" style={{fontWeight: 'bold', textDecoration: 'none'}} to={'/account/support/' + data?.ticket_id}>{data?.issue}</Link>
			</>
		)
	}

	// getStatus for table
	const getIssueType = (data) => {
		const filteredIssueType = issueTypeList.find((issue) => issue.value == data?.issue_type)
		return (
			<>
				<span>{filteredIssueType?.label}</span>
			</>
		)
	}


	return (
		<div className='relative'>

			{/* data grid table */ }
			<div className="data-table py-4">
				<DataGrid
					dataSource={ supportList }
					keyExpr="ticket_id"
					showColumnLines={ true }
					showRowLines={ true }
					showBorders={ false }
					rowAlternationEnabled={ true }>
					<Column cellRender={ (e) => getIssueType(e.data) } caption="Issue Type" cssClass="column-header" />
					<Column cellRender={ (e) => getStatus(e.data) } caption='Status' cssClass="column-header" />
					<Column cellRender={ (e) => getIssue(e.data) } caption='Issue' cssClass="column-header" />
					<Column dataField="due_date" caption='Due Date' cssClass="column-header" dataType={'date'} />
					<Column dataField="created_by" caption='Created' cssClass="column-header" />
					<Column dataField="created_date" caption='Created Date' cssClass="column-header" dataType={'date'} />
					<Column dataField="owner_name" caption='Owner' cssClass="column-header" />

					<Scrolling columnRenderingMode="virtual" />
					<Paging enabled={ false } />
				</DataGrid>
			</div>

		</div>
	)
}

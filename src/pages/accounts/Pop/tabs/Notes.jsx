import { useEffect, useState } from 'react';
import { Box } from '@mui/material'
import React from 'react'
// import './table.css'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { EditIcon } from '../../../../helper/Icons';
import { CallGETAPI } from '../../../../helper/API';
import { Link } from 'react-router-dom';
import { FormatDate, FormatDateTime, FormatDateWithTime } from '../../../../helper/Common';
import New from '../../../../img/New.png';
import TableSkeleton from '../../skeleton/table/TableSkeleton';


export default function Notes({ accountId, site_id = 0, contact_id = 0, type = 'POP' })
{

	let redirectUrl = `/account/new-note?account_id=${ accountId }`;

	if (type == 'CONTACT')
	{
		redirectUrl = `/account/new-note?account_id=${ accountId }&contact_id=${ contact_id }`;
	}
	if (type == 'SITE')
	{
		redirectUrl = `/account/new-note?account_id=${ accountId }&site_id=${ site_id }`;
	}


	const [ NotesData, setNotesData ] = useState([]);
	const [loading, setLoading] = useState(true);
	const fetchData = async () =>
	{

		let sendUrl = 'notes/account-notes/' + accountId;

		if (type === 'CONTACT')
		{
			sendUrl = `/notes/contact-notes?account_id=${ accountId }&contact_id=${ contact_id }`;
		}

		if (type === 'SITE')
		{
			sendUrl = `notes/site-notes?account_id=${ accountId }&site_id=${ site_id }`;
		}

		let response = await CallGETAPI(sendUrl);
		let resultData = response?.data?.data || [];

		setNotesData(resultData);
		setLoading(false);
	}

	useEffect(() =>
	{
		fetchData();
	}, [])

	const handleStatus = (e) =>
	{
		if (e.value)
		{
			return <span className='text-left text-success'>Active</span>
		} else
		{
			return <span className='text-left'>Deactive</span>

		}
	}

	const handleRender = (e) =>
	{
	
		// return <Link to={`/account/edit-note/${e.data.notes_id}`} className="text-primary">{e.value}</Link>
		return <Link to={ `/account/note/${ e.data.notes_id }` } className="text-primary">{ e.value }</Link>

	}

	const handleDateRender = (e) =>
	{
		return FormatDateWithTime(e.value);
	}
	return (
		<div className='relative'>
			{/* heading */ }
			<Box className="text-left pt-3 pb-1">
				<div className='heading d-flex' >

					{/* Meep Fitness Rickenbacker  */ }

{/* 
					<span className='' style={ { marginLeft: 'auto' } }>
						
						<Link to={ redirectUrl } style={{ textDecoration: 'none', display:"flex",flexDirection:"row" }} >
						  <img src={New} style={{height:"10%"}}/>
							<h5> New</h5>
						</Link>
					</span> */}

				</div>
			</Box>

			      {/* loading */}
				  {loading && (
        <div className='' style={{ width: '100%'}}>
          <TableSkeleton />
        </div>
      )}

			{/* data grid table */ }
			{!loading && (
			<div className="data-table pb-3">
				<DataGrid
					dataSource={ '' }
					// height={ 250 }
					keyExpr="notes_id"
					showColumnLines={ true }
					showRowLines={ true }
					showBorders={ false }
					rowAlternationEnabled={ true }>
					{/* <Column dataField="notes_id" width={120} caption="Notes ID" cssClass="column-header" cellRender={handleRender} /> */ }
					<Column dataField="title" cssClass="column-header" cellRender={ handleRender } />
					{/* <Column dataField="notes" cssClass="column-header" /> */ }
					<Column dataField="related_to" cssClass="column-header" />
					<Column dataField="created_date" cssClass="column-header" cellRender={ handleDateRender } />
					<Column dataField="created_by" cssClass="column-header" />
					<Column dataField="access" cssClass="column-header" />
					<Column dataField="active" width={ 130 } cssClass="column-header"
						dataType={ 'string' }
						cellRender={ handleStatus }


					/>
					{/* <Column dataField="created_by"  dataType="date" cssClass="column-header" /> */ }


					<Scrolling columnRenderingMode="virtual" />
					<Paging enabled={ false } />
				</DataGrid>
			</div>
			)}

		</div>
	)
}

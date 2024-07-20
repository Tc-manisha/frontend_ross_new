import { useEffect, useState } from 'react';
import { Box } from '@mui/material'
import React from 'react'
// import './table.css'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { EditIcon } from '../../../helper/Icons';
import { Link, useNavigate } from 'react-router-dom';
import { FormatDate, FormatDateTime, FormatDateWithTime, getPermission } from '../../../helper/Common';
import New from '../../../img/New.png';
// import TableSkeleton from '../skeleton/table/TableSkeleton';
import { CallGETAPI } from '../../../helper/API';
import TableSkeleton from '../../../pages/accounts/skeleton/table/TableSkeleton';
import { isUserPermission } from '../../../helper/permission';


export default function Notes({ accountId, site_id = 0, contact_id = 0, type = 'SITE', siteId })
{
	let privileges = getPermission();
	const navigate = useNavigate();

	let redirectUrl = `/account/new-note?account_id=${ accountId }`;

	if (type == 'CONTACT')
	{
		redirectUrl = `/account/new-note?account_id=${ accountId }&contact_id=${ contact_id }`;
	}
	if (type == 'SITE')
	{
		redirectUrl = `/account/new-note?account_id=${ accountId }&site_id=${ siteId }`;
	}


	const [ NotesData, setNotesData ] = useState([]);
	const [loading, setLoading] = useState(true);
	const fetchData = async () =>
	{

		// let sendUrl = 'notes/account-notes/' + accountId;
		let sendUrl = `notes/site-notes?account_id=${ accountId }&site_id=${ siteId }`;

		if (type === 'CONTACT')
		{
			sendUrl = `/notes/contact-notes?account_id=${ accountId }&contact_id=${ contact_id }`;
		}

		if (type === 'SITE')
		{
			sendUrl = `notes/site-notes?account_id=${ accountId }&site_id=${ siteId }`;
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

	const RenderTitle = (data) => {
		return (
		  <span
			onClick={() =>
			  isUserPermission("note-details") &&
			  navigate(`/account/note/${data?.notes_id}`)
			}
			className={isUserPermission("note-details") ? "link" : ""}
		  >
			{data?.title}
		  </span>
		);
	  };

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


					<span className='' style={ { marginLeft: 'auto' } }>
						{/* <img
              src="/edit.svg"
              alt="Edit"
              style={ { marginRight: "5px" } }
            /> */}
			         {isUserPermission("new-note") && ( 
						<Link to={ redirectUrl } style={{ textDecoration: 'none', display:"flex",flexDirection:"row" }} >
						  <img src={New} style={{height:"10%"}}/>
							<h5 style={{color:"#0C71C3"}}> New</h5>
						</Link>
						)}
					</span>

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
					dataSource={ NotesData }
					// height={ 250 }
					keyExpr="notes_id"
					showColumnLines={ true }
					showRowLines={ true }
					showBorders={ false }
					rowAlternationEnabled={ true }>
					{/* <Column dataField="notes_id" width={120} caption="Notes ID" cssClass="column-header" cellRender={handleRender} /> */ }
					<Column dataField="title" cssClass="column-header" cellRender={(e)=> RenderTitle(e?.data) } />
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

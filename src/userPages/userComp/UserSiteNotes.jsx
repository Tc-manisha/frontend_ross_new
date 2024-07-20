import { useEffect, useState } from 'react';
import { Box } from '@mui/material'
import React from 'react'
import './Tabls.scss'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { EditIcon } from '../../helper/Icons';
import { Link } from 'react-router-dom';
import { FormatDate, FormatDateTime, FormatDateWithTime } from '../../helper/Common';
import { CallGETAPI } from '../../helper/API';


export default function UserSiteNotes({ accountId, site_id = 0, contact_id = 0, type = 'ACCOUNT', inperson_id = 0 })
{

	const [ NotesData, setNotesData ] = useState([]);
	const fetchData = async () =>
	{

		let response = await CallGETAPI('user/site-notes-list/' + site_id);
		let resultData = response?.data?.data || [];


		setNotesData(resultData)
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


					<span className='' style={ { marginLeft: 'auto' } }>
						{/* <img
              src="/edit.svg"
              alt="Edit"
              style={ { marginRight: "5px" } }
            /> */}
						<Link to={ `/account/new-note?site_id=${ site_id }` } className="bg-light-blue text-decoration-none text-light border-0 fs-base px-4 py-2 rounded">New</Link>
					</span>

				</div>
			</Box>

			{/* data grid table */ }
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

		</div>
	)
}

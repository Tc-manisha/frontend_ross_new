import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import './table.css'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { EditIcon } from '../../../../helper/Icons';
import { Link, useNavigate } from 'react-router-dom';
import { CallGETAPI } from '../../../../helper/API';
import { FormatDateWithTime, getPermission } from '../../../../helper/Common';
import New from '../../../../img/New.png';
import TableSkeleton from '../../skeleton/table/TableSkeleton';
import { isSubAdminPermission } from '../../../../helper/permission';

const instructors = [
    {
        ID: 1,
        FirstName: 'John',
        LastName: 'Heart',
        Prefix: 'Mr.',
        Position: 'CEO',
        Picture: 'images/employees/01.png',
        BirthDate: '1964/03/16',
        HireDate: '1995/01/15',
        Notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
        Address: '351 S Hill St.',
        State: 'Register Assign',
        City: 'Los Angeles',
    },
    {
        ID: 2,
        FirstName: 'John',
        LastName: 'Heart',
        Prefix: 'Mr.',
        Position: 'CEO',
        Picture: 'images/employees/01.png',
        BirthDate: '1964/03/16',
        HireDate: '1995/01/15',
        Notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
        Address: '351 S Hill St.',
        State: 'Register Assign',
        City: 'Los Angeles',
    },
    {
        ID: 3,
        FirstName: 'John',
        LastName: 'Heart',
        Prefix: 'Mr.',
        Position: 'CEO',
        Picture: 'images/employees/01.png',
        BirthDate: '1964/03/16',
        HireDate: '1995/01/15',
        Notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
        Address: '351 S Hill St.',
        State: 'Register Assign',
        City: 'Los Angeles',
    },
    {
        ID: 4,
        FirstName: 'John',
        LastName: 'Heart',
        Prefix: 'Mr.',
        Position: 'CEO',
        Picture: 'images/employees/01.png',
        BirthDate: '1964/03/16',
        HireDate: '1995/01/15',
        Notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
        Address: '351 S Hill St.',
        State: 'Register Assign',
        City: 'Los Angeles',
    },
];

 const  Notes = ({aedId,account_id}) => {
    const [AedNotes,setAedNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const onLoad = async () => {
		const sendUrl = `notes/aed-notes?account_id=${ account_id }&aed_id=${ aedId }`;
        const result  = await CallGETAPI(sendUrl);
        if(result?.data?.status){
            const resultData = result?.data?.data || [];
            console.log({resultData});
            setAedNotes(resultData);
        }
        setLoading(false);
    }
    useEffect(()=>{
        onLoad();
    },[]);

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
	 return <span
        className={(isSubAdminPermission("note-details") === 1) ? "link" : ""}
        style={{textDecoration:"none"}}
        onClick={() => isSubAdminPermission("note-details") === 1 &&  navigate(`/account/note/${ e.data.notes_id }`) }
        >
        {/* //  to={ `/account/note/${ e.data.notes_id }` } > */}
        { e.value }
        </span>

	}

	const handleDateRender = (e) =>
	{
		return FormatDateWithTime(e.value);
	}
  return (
    <>
    <div className="notes relative">
    {loading && (
        <div className='' style={{ width: '100%',marginTop:"4%"}}>
          <TableSkeleton />
        </div>
      )}

    {!loading && (<>
        <Box className="text-left pt-3 pb-1 d-flex justify-content-end my-2">
            {/* <h4 className='heading'>Meep Fitness Rickenbacker
                <EditIcon />
            </h4> */}
            <Link className='new-btn' style={{ textDecoration: 'none' }}  to={`/account/new-note?account_id=${account_id}&aed_id=${aedId}`}  >
            <img src={New} />
                New</Link>
        </Box>

        <div className="data-table pb-3 multiple-row-table">
            <DataGrid
					dataSource={ AedNotes }
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
        </>)}
    </div>
  </>
  )
}

export default Notes;
import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './table.css'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { CallGETAPI } from '../../../../helper/API';
import TableSkeleton from '../../skeleton/table/TableSkeleton';
import { Link } from 'react-router-dom';



export default function Notes({accountId,contact_id,is_user=false}) {

    const [loading,setLoading]      = useState(false);
    const [NotesData,setNotsData]   = useState([]);

    const onLoad = async() => {
        if(!contact_id){ return ""; }
        setLoading(true);
        let res     = await CallGETAPI('user/account-contact-notes/'+contact_id);
        let result  = res?.data?.data || [];
        setNotsData(result);
        setLoading(false);
    }

    useEffect(()=>{
        onLoad();
    },[])
  return (
    <>
    {/* notes */}
    <div className="notes relative">
        {/* heading */}
        <Box className="text-left pt-3 pb-1">
            <h4 className='heading'>Note Information 
                {is_user ? 
                <Link className='btn btn-primary btn-lg float-end' to={`/user/account/new-note?account_id=${accountId}&contact_id=${contact_id}`} >New</Link>
                :<Link className='btn btn-primary btn-lg float-end' to={`/account/new-note?account_id=${accountId}&contact_id=${contact_id}`} >New</Link>
                }
            </h4>
        </Box>

        {/* data grid table */}
        <div className="data-table pb-3 multiple-row-table">

            {loading ? <TableSkeleton/> : 
            <DataGrid 
            dataSource={NotesData}
            //   height={ 250 }
            keyExpr="notes_id"
            showColumnLines={true}
            showRowLines={false}
            showBorders={false}
            rowAlternationEnabled={true}>
            <Column dataField="title" caption="title" />
            <Column dataField="related_to" caption="related To" />
            <Column dataField="created_date" caption="Created Date" />
            <Column dataField="created_by" caption="Created By" />
            <Column dataField="access" caption="access" />

            <Scrolling columnRenderingMode="virtual" />
            <Paging enabled={ false } />
            </DataGrid>
            }
        </div>
    </div>

  </>
  )
}

import { useState } from 'react';
import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import './table.css'
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CallGETAPI } from '../../../../helper/API';
import { prepareOptions } from '../../../../helper/Common';
import Moment from 'react-moment';
import New from '../../../../img/New.png';
import TableSkeleton from '../../skeleton/table/TableSkeleton';
import { isSubAdminPermission } from '../../../../helper/permission';

export default function AedSupport({stateData}){
  const [supportData,setSupportData] = useState([]);
  const [ issueTypeList, setIssueTypeList ] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    const fetchData = async() => {
      const issueTypeResult = await CallGETAPI('support/all-issues-type');

      if(issueTypeResult?.status) {
          const issueTypes = issueTypeResult?.data?.issuesList
          const allIssueTypes = prepareOptions(issueTypes, 'issue_id', 'issue_name')
          setIssueTypeList(allIssueTypes);
      }

      const res = await CallGETAPI(`support/ticket-by-aed/${stateData.aedId}`)
      if(res?.data?.status){
        const list  = res?.data?.ticketList || [];
        setSupportData(list);
      }
      setLoading(false);
    }

    useEffect(() => {
      fetchData();
    },[])

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
				<span 
        className={(isSubAdminPermission("support-details") === 1) ? "link" : ""}
         style={{ textDecoration: 'none'}}
          // to={'/account/support/' + data?.ticket_id}
          onClick={() => (isSubAdminPermission("support-details") === 1) && navigate('/account/support/' + data?.ticket_id)}>
            {data?.issue}
          </span>
			</>
		)
	}

    const getIssueType = (data) => {
      const filteredIssueType = issueTypeList.find((issue) => issue.value == data?.issue_type)
      return (
        <>
          <span>{filteredIssueType?.label}</span>
        </>
      )
    }

    const getRelation = (data) => {
      // console.log(data);
      return (
        <>
        <span>{data?.relation}</span>
        </>
      );
      }

  return (
    <>
     	{loading && (
        <div className='' style={{ width: '100%',marginTop:"4%"}}>
          <TableSkeleton />
        </div>
      )}


     {!loading && ( <>
      {/* heading */}
      <Box className="text-left pt-3 pb-1 d-flex justify-content-end mb-2" >
        {/* <h4 className='heading'>Meep Fitness Rickenbacker</h4> */}
        <button className='new-btn' style={{marginTop: '10px',textDecoration: 'none',backgroundColor:"transparent",border:"transparent"}} onClick={()=>{
				// navigate('/account/new-support/'+accountId);
				navigate("/account/new-support/"+stateData.accountId, {state:  stateData});
    
			}}>
        <img src={New} />
        New</button>
      </Box>

      {/* data grid table */}
      <div className="data-table pb-3 multiple-row-table">

                    <DataGrid
					dataSource={ supportData }
					keyExpr="ticket_id"
					showColumnLines={ true }
					showRowLines={ true }
					showBorders={ false }
					rowAlternationEnabled={ true }>
					<Column cellRender={ (e) => getIssueType(e.data) } caption="Issue Type" cssClass="column-header" />
					<Column cellRender={ (e) => getIssue(e.data) } caption='Issue' cssClass="column-header" />
					<Column cellRender={(e) => getRelation(e.data)} caption='Relation' cssClass="column-header" /> 
					<Column dataField="due_date" caption='Due Date' cssClass="column-header" dataType={'date'} />
					<Column dataField="created_by" caption='Created' cssClass="column-header" />
					<Column dataField="created_date" caption='Created Date'cssClass="column-header" dataType={'date'}
                      cellRender={(data) => (
                      <span>
                       <Moment date={data.data.created_date} format={'MM/DD/YYYY h:mm A'} />
                      </span>
                      )}
                      />
					<Column dataField="owner_name" caption='Owner' cssClass="column-header" />
                    <Column cellRender={ (e) => getStatus(e.data) } caption='Status' cssClass="column-header" />
					<Scrolling columnRenderingMode="virtual" />
					<Paging enabled={ false } />
				</DataGrid>

      </div>
      </>
     )}

    </>
  )
}

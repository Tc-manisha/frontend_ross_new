import { useState } from 'react';
import { Box } from '@mui/material'
import React, { useEffect } from 'react'
// import './table.css'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CallGETAPI } from '../../../helper/API';
import { getPermission, prepareOptions } from '../../../helper/Common';
import Moment from 'react-moment';
import New from '../../../img/New.png';
import { DecryptToken } from '../../../helper/BasicFn';
import TableSkeleton from '../../../pages/accounts/skeleton/table/TableSkeleton';
import { isUserPermission } from '../../../helper/permission';

export default function Support({account_id="",setTabTbldata, stateData={}})
{
  const { accountId,contactId }  = useParams();
	const mainAccountId = accountId || account_id;
  const navigate = useNavigate();
  const [supportData,setSupportData] = useState([]);
  const [ issueTypeList, setIssueTypeList ] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = DecryptToken();
  const privilege = getPermission();

  const onLoad =  async()=>{

    const issueTypeResult = await CallGETAPI('support/all-issues-type');

    if(issueTypeResult?.status) {
        const issueTypes = issueTypeResult?.data?.issuesList
        const allIssueTypes = prepareOptions(issueTypes, 'issue_id', 'issue_name')
        setIssueTypeList(allIssueTypes);
    }

    const res = await CallGETAPI('support/ticket-by-contact/'+contactId);
    if(res?.data?.status){
      const list  = res?.data?.ticketList || [];
      setSupportData(list);
    }
    setLoading(false);
  }
  useEffect(()=>{
    onLoad();
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

	const getRelation = (data) => {
		// console.log(data);
		return (
		  <>
			<span>{data?.relation}</span>
		  </>
		);
	  }

    useEffect(() => {
      if (supportData?.length > 0) {
        setTabTbldata((prev) => ({
        ...prev,
        support: true,
        }));
      }
      }, [supportData]);


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
        {(user?.user_type == 0 || isUserPermission("new-support") ||
               (user?.user_type == 2 && user?.sub_admin != "" && privilege?.includes("new-support"))) && (
       <button className='new-btn' style={{marginTop: '10px',textDecoration: 'none',backgroundColor:"transparent",border:"transparent"}} onClick={()=>{
				// navigate('/account/new-support/'+mainAccountId);
				navigate("/account/new-support/"+mainAccountId, {state:  stateData});
    
			}}>
        <img src={New} />
        New</button>
      )}
      </Box>

      {/* data grid table */}
      <div className="data-table pb-3 multiple-row-table">
        {/* <DataGrid 
          dataSource={customers}
          height={ 250 }
          keyExpr="ID"
          showColumnLines={true}
          showRowLines={true}
          showBorders={false}
          rowAlternationEnabled={true}>
          <Column dataField="Prefix" width={80} caption="Title" cssClass="column-header" />
          <Column dataField="FirstName" cssClass="column-header" />
          <Column dataField="LastName" cssClass="column-header" />
          <Column dataField="City" cssClass="column-header" />
          <Column dataField="State" cssClass="column-header" />
          <Column dataField="Position" width={130} cssClass="column-header" />
          <Column dataField="BirthDate" width={100} dataType="date" cssClass="column-header" />
          <Column dataField="HireDate" width={100} dataType="date" cssClass="column-header" />

          <Scrolling columnRenderingMode="virtual" />
          <Paging enabled={ false } />
        </DataGrid> */}

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

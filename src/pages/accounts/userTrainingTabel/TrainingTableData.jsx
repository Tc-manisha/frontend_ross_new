import React, { useState } from 'react';
import { AiOutlineFileAdd } from 'react-icons/ai';
// import { BiSolidBookAdd } from "@react-icons/all-files/bi/BiSolidBookAdd";
import { MdDriveFileMove } from 'react-icons/md';
import New from '../../../img/New.png'
import Move from '../../../img/Move.png'
import DataGrid, {
	Column,
	Grouping,
	GroupPanel,
	Pager,
	Paging,
	SearchPanel, HeaderFilter
} from 'devextreme-react/data-grid';
import { Link } from 'react-router-dom';
import UserTrainingNew from '../../../userPages/userComp/UserTrainingNew'


const TrainingTableData = ({ trainingData }) =>
{

	const [isNewClicked, setIsNewClicked] = useState(false);

	const handleNewClick = () => {
	  setIsNewClicked(true);
	};
	// check expiry or not
	const getRowStatus = (data) => {
		const currentDate = new Date();
		const expirationDate = new Date(data?.expirationDate);
		if(expirationDate < currentDate) {
			return (
				<span className='text-red'>Expired</span>
			)
		} else {
			return (
				<span className=''>Completed</span>
			)
		}
	}

	// check expiry or not
	const getRowExpiryData = (data) => {
		const currentDate = new Date();
		const expirationDate = new Date(data?.expirationDate);
		if(expirationDate < currentDate) {
			return (
				<span className='text-red'>{data?.expirationDate}</span>
			)
		} else {
			return (
				<span className=''>{data?.expirationDate}</span>
			)
		}
	}

	// get class id
	const getRowInpersonClass = (data) => {
		return (
			<Link to={'/account/inperson/details/' + data?.inpersonId} className='link'>{data?.classID}</Link>
		)
	}
	
	return (
		<div>
          
			{trainingData?.length > 0 ? <>
				{/* training table data */}
				{trainingData?.map((data, index) => (
					<div className='mb-4' key={index}>
						<div className='d-flex justif-content-flex-start mt-4' style={ { marginTop: "5px", marginBottom: "5px", color: "#0c71c3" } }>
							<div style={ { fontSize: "22px", fontWeight: "bold" } }>{data?.siteName}</div>
							

	 <Link to="/user-training/new" style={{textDecoration:"none", marginLeft: '1010px',alignContent:"center" }}>
        <div className="d-flex flex-direction-row" style={{alignItems:"center"}}>
		  {/* <AiOutlineFileAdd style={{ marginLeft: '1010px' }} /> */}.
		  <div><img src={ New } style={ { marginRight: "1px"} } /></div>
          <h1 style={{ fontSize: '17px', marginTop: '5px',color: "rgb(12, 113, 195)", fontWeight: "500", cursor: "pointer"  }}>New</h1>
		</div>
		</Link>
                
		     <Link to="/user-training/Move" style={{textDecoration:"none",marginLeft:"9px",alignContent:"center"}}>
							<div className='d-flex flex-direction-row align-items-center'>
								{/* <MdDriveFileMove style={{marginLeft:"7px",width:"20px", height:"20px"}}/> */}
								<div><img src={ Move } style={ { marginRight: "2px" } } /></div>
								<h1  style={ { fontSize: "17px", marginTop:"5px",color: "rgb(12, 113, 195)", fontWeight: "500", cursor: "pointer"  } }>Move</h1>
							</div>
							</Link>	
						</div>
								

						{/* table */}
						
						<DataGrid
							dataSource={ data?.data ?? [] }
							allowColumnReordering={ true }
							rowAlternationEnabled={ true }
							showBorders={ true }
						>
							<HeaderFilter visible={ false } />
							<Column dataField="studentName" caption="Student Name" />
							<Column dataField="siteName" caption="Site Name" />
							<Column dataField="courseName" caption="Course Name" />
							<Column dataField="classID" caption="Class" cellRender={ (e) => getRowInpersonClass(e.data) } />
							<Column dataField="Status" caption="Status" cellRender={ (e) => getRowStatus(e.data) } />
							<Column dataField="expirationDate" caption="Expiration Date" cellRender={ (e) => getRowExpiryData(e.data) } dataType="date" />
							<Column dataField="certification" caption="Certification" />
						</DataGrid>
					</div>
				))}
			</> : 
				<div className="my-5">
					{/* table */}
					<DataGrid
						dataSource={ [] }
						allowColumnReordering={ true }
						rowAlternationEnabled={ true }
						showBorders={ true }
					>
						<HeaderFilter visible={ false } />
						<Column dataField="studentName" caption="Student Name" />
						<Column dataField="siteName" caption="Site Name" />
						<Column dataField="courseName" caption="Course Name" />
						<Column dataField="classID" caption="Class" cellRender={ (e) => getRowInpersonClass(e.data) } />
						<Column dataField="Status" caption="Status" cellRender={ (e) => getRowStatus(e.data) } />
						<Column dataField="expirationDate" caption="Expiration Date" cellRender={ (e) => getRowExpiryData(e.data) } dataType="date" />
						<Column dataField="certification" caption="Certification" />
					</DataGrid>
				</div>
			}
		</div>
	)
}

export default TrainingTableData
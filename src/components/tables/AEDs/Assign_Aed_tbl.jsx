import React,{useState,useEffect} from 'react'
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { Box } from 'devextreme-react';
import { BatteryIcon, PeoplePad } from '../../../helper/Icons';
import moment from 'moment';
import { FormatDate } from '../../../helper/Common';
import './AEDs.css';
import { Link } from 'react-router-dom';
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import { RenderDate } from '../../../helper/BasicFn';

// const RenderDate = (date)=> {
// 	const currentDate = moment();

// 	// Convert the input date to a moment object
// 	const inputMoment = moment(date);
  
// 	// Compare the input date with the current date
// 	const isInputDateBeforeCurrent = inputMoment.isBefore(currentDate);
// 	if(isInputDateBeforeCurrent){
// 		return <span className="text-danger" >{date}</span>;
// 	}else{
// 		return <span >{date}</span>;
// 	}
// }
function Assign_Aed_tbl({SingleAED}) {

    
	const [data,setData] = useState(SingleAED || []);

	const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
      });
    const sortTable = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
		  direction = 'desc';
		}
		
		const sortedData = [...data].sort((a, b) => {
		  let valA = a[key] || " ";
		  let valB = b[key] || " ";

	
		  if (typeof valA === 'string' && valA  && valB) {
			valA = valA.toLowerCase();
			valB = valB.toLowerCase();
		  }
	
		  if (valA < valB) {
			return direction === 'asc' ? -1 : 1;
		  }
		  if (valA > valB) {
			return direction === 'asc' ? 1 : -1;
		  }
		  return 0;
		});
	
		setData(sortedData);
		setSortConfig({ key, direction });
	  };


	  const [jsonData, setJsonData] = useState(SingleAED);
	  const [sortBy, setSortBy] = useState('');
	  const sortJsonData = (column) => {
		const sortedData = [...jsonData];
		
		let direction   =  sortConfig.direction === 'asc' ? 'desc' : 'asc';
		let isSortedAsc =  sortConfig.direction === 'asc' ? 0 : 1; //column === sortBy;


		if (sortConfig.key === column && sortConfig.direction === 'asc') {
			direction = 'desc';
			isSortedAsc = false
		  }
		  
	
		// Check if the data is already sorted in the selected column
		sortedData.sort((a, b) => {
		  const valueA = getValueToCompare(a, column);
		  const valueB = getValueToCompare(b, column);
	
		  if (typeof valueA === 'string' && typeof valueB === 'string') {
			return valueA.localeCompare(valueB) * (isSortedAsc ? 1 : -1);
		  } else if (typeof valueA === 'string' && typeof valueB === 'object') {
			return -1 * (isSortedAsc ? 1 : -1);
		  } else if (typeof valueA === 'object' && typeof valueB === 'string') {
			return 1 * (isSortedAsc ? 1 : -1);
		  } else if (valueA instanceof Date && valueB instanceof Date) {
			return (valueA - valueB) * (isSortedAsc ? 1 : -1);
		  } else {
			return 0;
		  }
		});
	
		// Update the sorted data and the current sorting column
		setJsonData(sortedData);
		setSortBy(column);		
		setSortConfig({ key:column, direction:direction });
	  };

	  const getValueToCompare = (object, column) => {
		if (column === 'aed_id') {
		  return object.aed_id;
		} else if (column === 'site_id') {
		  return object.site_id;
		} else if (column === 'serial_number') {
		  return object.serial_number;
		} else if (column === 'placement') {
		  return object.placement;
		} else if (column === 'brand_name') {
		  return object.brand_name;
		} else if (column === 'battery_expiration') {
		  // Implement logic to extract value from battery_expiration
		  return object.battery_expiration[0].data[0];
		} else if (column === 'pads_expiration') {
		  // Implement logic to extract value from pads_expiration
		  return object.pads_expiration[0].data[0];
		} else if (column === 'last_check') {
		  return object.last_check;
		} else if (column === 'last_service') {
		  return object.last_service;
		} else if (column === 'rms_check') {
		  return object.rms_check;
		} else if (column === 'pediatric_key') {
		  return object.pediatric_key;
		} else {
		  return null;
		}
	  };
  return (
    <>
        <div className='' >
			{/* {JSON.stringify(SingleAED)} */}
			{SingleAED && <table className='table data-table pb-3'>
					<thead className='thread-style'>
						<tr>
							<th className='pointer' onClick={()=>sortJsonData('brand_name')} >
								<div className='d-flex inside-td' >

								
								<span> AED Brand / Model </span>  
								{sortConfig.key==='brand_name' && sortConfig.direction==='asc' ? 
									<span className="uparrow">
									<ArrowRightAltRoundedIcon/>
									</span>: 
									<span className="downarrow">
										<ArrowRightAltRoundedIcon/>
									</span>}
								</div>
							</th>
							<th className='pointer' onClick={()=>sortJsonData('serial_number')} >
							<div className='d-flex inside-td' >
								<span>Serial Number</span> 
								{sortConfig.key==='serial_number' && sortConfig.direction==='asc' ? 
								<span className="uparrow">
								<ArrowRightAltRoundedIcon/>
								</span>: 
								<span className="downarrow">
									<ArrowRightAltRoundedIcon/>
								</span>
								}
							</div>
							</th>
							<th className='pointer' onClick={()=>sortJsonData('placement')} >
								<div className='d-flex inside-td' >
								<span>AED Placement</span> 
								{sortConfig.key==='placement' && sortConfig.direction==='asc' ? 
								<span className="uparrow">
								<ArrowRightAltRoundedIcon/>
								</span>: 
								<span className="downarrow">
									<ArrowRightAltRoundedIcon/>
								</span>
								}
								</div>
							</th>
							<th className='pointer' onClick={()=>sortJsonData('battery_expiration')} >
									Battery Expiration 
									{sortConfig.key==='battery_expiration' && sortConfig.direction==='asc' ? 
									<span className="uparrow">
									<ArrowRightAltRoundedIcon/>
									</span>: 
									<span className="downarrow">
										<ArrowRightAltRoundedIcon/>
									</span>
									}
							</th>
							<th className='pointer' onClick={()=>sortJsonData('pads_expiration')} >Pads Expiration 

							{sortConfig.key==='pads_expiration' && sortConfig.direction==='asc' ? 
								<span className="uparrow">
								<ArrowRightAltRoundedIcon/>
								</span>: 
								<span className="downarrow">
									<ArrowRightAltRoundedIcon/>
								</span>
								}
							</th>
							<th className='pointer' onClick={()=>sortJsonData('last_check')} >
							<div className='d-flex inside-td'  >
								<span>Last Check</span> 
							{sortConfig.key==='last_check' && sortConfig.direction==='asc' ? 
								<span className="uparrow">
								<ArrowRightAltRoundedIcon/>
								</span>: 
								<span className="downarrow">
									<ArrowRightAltRoundedIcon/>
								</span>
								}
							</div>
							</th>
							<th className='pointer' onClick={()=>sortJsonData('last_service')} >
							<div className='d-flex inside-td' >
								
								<span>Last Service</span> 
								{sortConfig.key==='last_service' && sortConfig.direction==='asc' ? 
								<span className="uparrow">
								<ArrowRightAltRoundedIcon/>
								</span>: 
								<span className="downarrow">
									<ArrowRightAltRoundedIcon/>
								</span>
								}

								</div>
							</th>
							<th className='pointer' onClick={()=>sortJsonData('rms_check')} >
							<div className='d-flex inside-td' >
								<span> RMS Check  </span>
								{sortConfig.key==='rms_check' && sortConfig.direction==='asc' ? 
								<span className="uparrow">
									<ArrowRightAltRoundedIcon/>
								</span>: 
								<span className="downarrow">
									<ArrowRightAltRoundedIcon/>
								</span>
								}
							</div>
							</th>
						</tr>
					</thead>
					<tbody className='bordered-table'>
						{jsonData?.length > 0 ? <>
							{jsonData.map((item)=>(
								<tr>
									<td>
										<Link to={`/account/aed-details/`+item?.aed_id} className='link' style={{textDecoration: 'none'}} >
											{item?.brand_name}
										</Link>
									</td>
									<td>{item?.serial_number}</td>
									<td>{item?.placement}</td>
									<td>
										{item?.battery_expiration?.map((it)=>(
										<>
										
										{/* {JSON.stringify(it)} */}
											{it?.data?.map((it2)=>( it2==='unknown' ? 
											
											<p>
												<img src={it?.img} width={15}  /> &nbsp;
											{it2}
											</p>
											: it2!=''  && 
											<p>
												<img src={it?.img} width={15}  /> &nbsp;
												{/* {FormatDate(it2) } */}
												{RenderDate(FormatDate(it2))}
											</p>
											))}
										</>
									))} 
									</td>
									<td>
									{item?.pads_expiration?.map((it)=>(
										<>
											{it?.data?.map((it2)=>( it2==='unknown' ?  
											<p>
											<img src={it?.img} width={15}  /> &nbsp;
											{it2}
											</p>
											: it2!=''   ? 
											<p>
												<img src={it?.img} width={15}  /> &nbsp;
												{RenderDate(FormatDate(it2))} 
											</p>:''
											))}
										</>
									))} 
									{item?.pediatric_key ? 
										<p>
											<img src={'/child-Vector.png'} width={15}  /> &nbsp;
											<img src="/key-Vector.png"  width={15} /> 
										</p>
									:""}
									</td>
									<td>{item?.last_check || '-'}</td>
									<td>{item?.last_service || '-'}</td>
									<td>{item?.rms_check || '-'}</td>
								</tr>
							))}
						</> : <>
							<tr>
								<td colSpan={8} className='text-center'>No Data Found</td>
							</tr>
						</>}
					</tbody>
				</table>}
			
        </div>
    </>
  )
}

export default Assign_Aed_tbl

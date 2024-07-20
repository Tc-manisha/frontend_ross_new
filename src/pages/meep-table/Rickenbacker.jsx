import { Button } from '@mui/material';
import React from 'react'

const Rickenbacker = () => {

    function createData(Name, Class, Class2, Status, Expiration, Certification) {
        return { Name, Class, Class2, Status, Expiration,Certification };
      }
      
      const rows = [
        createData('Frozen', 'sdsd', 'sd','expired', 'sd', '07/29/2022'),
        createData('Frozen', 'sdsd', 'sd','expired', 'sd',  '07/29/2022'),
        createData('Frozen', 'sdsd', 'sd','Complated', 'sd',  '07/29/2022'),
        createData('Frozen', 'sdsd', 'sd','Complated', 'sd',  '07/29/2022'),
      ];
  return (
    <div>
        <div className='fw-bold bg-primary title-style'>
            <div className='text-white title-alret'>Meep Fitness Rickenbacker</div>
            <div className='btn-style'>
                <Button className='bg-info text-white btn-new'>New</Button>
                <Button className='bg-info text-white'>Move</Button>
            </div>
        </div>
        <table className="border-2-blue" style={{width:"100%"}}>
            <thead>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Student</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Class</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Class#</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Status</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Expiration</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Certification #</td></th> 
            </thead>
            <tbody>
                {rows.map((row) => {
                    return <tr className="border-2-blue py-1 px-2">
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.Name}</td>
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.Class}</td>
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.Class2}</td>
                        	<td className={`border-2-blue py-1 px-2 fw-bold bg-white ${row.Status == "expired" ? "text-danger" : "text-black"}`}>{row.Status}</td>
                        	<td className={`border-2-blue py-1 px-2 fw-bold bg-white ${row.Status == "expired" ? "text-danger" : "text-black"}`}>{row.Expiration}</td>
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.Certification}</td>
                    	</tr>
                })}
            </tbody>
        </table>
    </div>
  )
}

export default Rickenbacker
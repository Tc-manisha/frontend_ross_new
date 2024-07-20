import { Button } from '@mui/material';
import React from 'react'

const MeepFitness = () => {
    function createData(Name, Site, Class, Class2, Status, Expiration) {
        return { Name, Site, Class, Class2, Status, Expiration };
      }
      
      const rows = [
        createData('Lois meep', 'meep fitness Martha', 'Adult CPR / AED & First Aid / BBP', '887878955', 'expired', '07/29/2022'),
        createData('Clerk', 'meep fitness Martha', 'Adult CPR / AED & First Aid / BBP', '887878955', 'expired', '07/29/2022'),
      ];

  return (
    <div>
        <div className='fw-bold bg-danger title-style'>
            <div className='text-white title-alret'>Alerts</div>
            <div className='btn-style'>
                <Button className='bg-info text-white'>Remove</Button>
            </div>
        </div>
        <table className="border-2-blue" style={{width:"100%"}}>
            <thead>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Student</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Site</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Class</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Class#</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Status</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Expiration</td></th>

            </thead>
            <tbody>
                {rows.map((row) => {
                    return <tr className="border-2-blue py-1 px-2">
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.Name}</td>
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.Site}</td>
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.Class}</td>
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.Class2}</td>
                        	<td className={`border-2-blue py-1 px-2 fw-bold bg-white ${row.Status == "expired" ? "text-danger" : "text-black"}`}>{row.Status}</td>
                        	<td className={`border-2-blue py-1 px-2 fw-bold bg-white ${row.Status == "expired" ? "text-danger" : "text-black"}`}>{row.Expiration}</td>
                    	</tr>
                })}
            </tbody>
        </table>
    </div>
  )
}

export default MeepFitness
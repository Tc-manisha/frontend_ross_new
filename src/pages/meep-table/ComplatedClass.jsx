import { Button } from '@mui/material';
import React from 'react'

const ComplatedClass = () => {
    function createData(Class, ClassDate, Enrolled, Trainer, Contact, Action) {
        return { Class, ClassDate, Enrolled, Trainer, Contact, Action };
      }
      
      const rows = [
        createData('Frozen', 'sdsd', 'sd', 'sd','07/29/2022', 'expired' ),
        createData('Frozen', 'sdsd', 'sd', 'sd','07/29/2022', 'expired' ),
      ];
  return (
    <div>
        <div className='fw-bold bg-primary title-style'>
            <div className='text-white title-alret'>Complated Classes</div>
            <div className='btn-style'>
                <Button className='bg-info text-white'>New</Button>
            </div>
        </div>
        <table className="border-2-blue" style={{width:"100%"}}>
            <thead>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Class</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Class #</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Expiration</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Trainer</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Cirtification #</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary" style={{width:"13%"}}><td>Status</td></th>

            </thead>
            <tbody>
                {rows.map((row) => {
                    return <tr className="border-2-blue py-1 px-2">
                        	<td className={`border-2-blue py-1 px-2 fw-bold bg-white ${row.Action == "expired" ? "text-danger" : "text-black"}`}>{row.Class}</td>
                        	<td className={`border-2-blue py-1 px-2 fw-bold bg-white ${row.Action == "expired" ? "text-danger" : "text-black"}`}>{row.ClassDate}</td>
                        	<td className={`border-2-blue py-1 px-2 fw-bold bg-white ${row.Action == "expired" ? "text-danger" : "text-black"}`}>{row.Enrolled}</td>
                        	<td className={`border-2-blue py-1 px-2 fw-bold bg-white ${row.Action == "expired" ? "text-danger" : "text-black"}`}>{row.Trainer}</td>
                        	<td className={`border-2-blue py-1 px-2 fw-bold bg-white ${row.Action == "expired" ? "text-danger" : "text-black"}`}>{row.Contact}</td>
                        	<td className={`border-2-blue py-1 px-2 fw-bold bg-white ${row.Action == "expired" ? "text-danger" : "text-black"}`} style={{width:"13%"}}>{row.Action}</td>
                    	</tr>
                })}
            </tbody>
        </table>
    </div>
  )
}

export default ComplatedClass
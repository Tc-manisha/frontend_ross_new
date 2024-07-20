import { Button } from '@mui/material';
import React from 'react'

const AvailableClass = () => {
    function createData(Class, ClassDate, Enrolled, Trainer, Contact, Action) {
        return { Class, ClassDate, Enrolled, Trainer, Contact, Action };
      }
      
      const rows = [
        createData('Frozen', 'sdsd', 'sd', 'sd', 'expired', '07/29/2022'),
        createData('Frozen', 'sdsd', 'sd', 'sd', 'expired', '07/29/2022'),
      ];
  return (
    <div>
        <div className='fw-bold bg-primary title-style'>
            <div className='text-white title-alret'>Available Classes</div>
            <div className='btn-style'>
                <Button className='bg-info text-white'>Add</Button>
            </div>
        </div>
        <table className="border-2-blue" style={{width:"100%"}}>
            <thead>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Class</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>ClassDate</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Enrolled</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Trainer</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary"><td>Contact</td></th>
                <th className="border-2-blue py-1 px-2 fw-bold bg-secondary" style={{width:"16%"}}><td></td></th>

            </thead>
            <tbody>
                {rows.map((row) => {
                    return <tr className="border-2-blue py-1 px-2">
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.Class}</td>
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.ClassDate}</td>
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.Enrolled}</td>
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.Trainer}</td>
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.Contact}</td>
                        	<td className="border-2-blue py-1 px-2 fw-bold bg-white" style={{width:"16%"}}>
                                <Button className='btn-register'>Register</Button>
                                <Button className='account-btn'>Assign</Button>
                            </td>
                    	</tr>
                })}
            </tbody>
        </table>
    </div>
  )
}

export default AvailableClass
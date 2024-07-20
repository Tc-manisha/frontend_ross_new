import React from 'react'

const MflTable = () => {
    function createData(Class, ClassDate, Enrolled, Trainer, Status, Address) {
        return { Class, ClassDate, Enrolled, Trainer, Status, Address };
      }
      
      const rows = [
        createData('Frozen', 'sdsd', 'sd', 'sd', 'expired', '07/29/2022'),
        createData('Frozen', 'sdsd', 'sd', 'sd', 'expired', '07/29/2022'),
      ];
  return (
    <div>
    <div className='fw-bold bg-primary title-style'>
        <div className='text-white d-flex justify-content-center'>Meep Fitness Lindbergh</div>
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
                        <td className="border-2-blue py-1 px-2 fw-bold bg-white">{row.Address}</td>
                    </tr>
            })}
        </tbody>
    </table>
</div>
  )
}

export default MflTable
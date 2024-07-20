import { Skeleton } from '@mui/material'
import React from 'react'

function TableLoader() {
  return (
    <>
           <>
           {[0,1,2,3,4,5,6,7,8,9].map((item)=>(
            <tr className="my-4" key={item}  >
            <td className="py-1 px-2 tbl-border border-r-blue">
                <Skeleton width={100} height={20} />
            </td>
            <td className="py-1 px-2 tbl-border border-r-blue">
                <Skeleton width={20} height={20} />
            </td>
            <td className="py-1 px-2 tbl-border border-r-blue">
                <Skeleton width={150} height={20} />
            </td>
            <td className="py-1 px-2 tbl-border border-r-blue">
                <Skeleton width={150} height={20} />
            </td>
            <td className="py-1 px-2 tbl-border border-r-blue">
                <Skeleton width={100} height={20} />
            </td>
            <td className="py-1 px-2 tbl-border border-r-blue">
                <Skeleton width={100} height={20} />
            </td>
            <td className="py-1 px-2 tbl-border">
                <Skeleton width={60} height={20} />
            </td>
        </tr>
           ))}
           
            {/* Add more skeleton rows as needed */}
          </>
    </>
  )
}

export default TableLoader
import React from 'react'
import './table.scss';

export default function TableSkeleton({tdCount=3}) {
    const arr = [];
    for (let index = 0; index < tdCount; index++) {
        arr.push(index);
    }
    return (
        <div className="tableWrapper">
            <table className="table">
                <thead>
                <tr>
                    {arr.map((tem)=>(
                    <th className="loading">
                    <div className="bar"></div>
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                    <tr>
                    {arr.map((tem)=>(
                    <td className="loading">
                        <div className="bar"></div>
                    </td>
                    ))}
                    </tr>
                    <tr>
                    {arr.map((tem)=>(
                    <td className="loading">
                        <div className="bar"></div>
                    </td>
                    ))}
                    </tr>
                    <tr>
                    {arr.map((tem)=>(
                    <td className="loading">
                        <div className="bar"></div>
                    </td>
                    ))}
                    </tr>

                    <tr>
                    {arr.map((tem)=>(
                    <td className="loading">
                        <div className="bar"></div>
                    </td>
                    ))}
                    </tr>

                    <tr>
                    {arr.map((tem)=>(
                    <td className="loading">
                        <div className="bar"></div>
                    </td>
                    ))}
                    </tr>

                    <tr>
                    {arr.map((tem)=>(
                    <td className="loading">
                        <div className="bar"></div>
                    </td>
                    ))}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

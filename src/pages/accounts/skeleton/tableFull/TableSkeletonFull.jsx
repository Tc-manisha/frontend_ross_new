import React from 'react'
import './table.scss';

export default function TableSkeletonFull() {
    return (
        <div className="tableWrapper">
            <table className="table">
                <thead>
                    <tr>
                        <th className="loading">
                            <div className="bar"></div>
                        </th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td className="loading">
                            <div className="bar"></div>
                        </td>
                    </tr>

                    <tr>
                        <td className="loading">
                            <div className="bar"></div>
                        </td>
                    </tr>

                    <tr>
                        <td className="loading">
                            <div className="bar"></div>
                        </td>
                    </tr>

                    <tr>
                        <td className="loading">
                            <div className="bar"></div>
                        </td>
                    </tr>

                    <tr>
                        <td className="loading">
                            <div className="bar"></div>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    )
}

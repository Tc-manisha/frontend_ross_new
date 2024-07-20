import { useEffect } from "react";
import { sortArrAscending } from "../../../helper/constants";

export default function SearchBarComp({
    searchValue,
    setSearchValue,
    tableData,
    setsortedTableData,
    key1,
    key2,
    key3,
    status,
    sortingKey
}) {

    const handleSearch = () => {
        let filteredData = tableData;
        if (searchValue) {
            filteredData = tableData.filter(item => {
                // let intSearchValue
                // if (searchValue.toLowerCase() === 'activate' || searchValue.toLowerCase() === 'active') {
                //     intSearchValue = 1
                // }
                // else if (searchValue.toLowerCase() === 'deactivate' || searchValue.toLowerCase() === 'deactive') {
                //     intSearchValue = 0
                // }
                return (
                    item?.[key1]?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    item?.[key2]?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    item?.[key3]?.toLowerCase().includes(searchValue.toLowerCase())
                );
            });
        }
        const sortedData = sortArrAscending(filteredData, sortingKey);
        setsortedTableData(sortedData);
    };

    useEffect(() => {
        handleSearch();
    }, [searchValue]);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {/* <p style={{ fontWeight: 600, marginBottom: 7 }}>Search</p> */}
                <input
                    style={{ border: '1px solid #DEE2E6', padding: '1% 3%', borderRadius: 5, width: 250, height: 40 }}
                    placeholder="Search"
                    type="text"
                    name="search"
                    onChange={(e) => {
                        setSearchValue(e.target.value)
                        handleSearch(e)
                    }}
                />
            </div>
        </>
    )
}




// import React, { useEffect, useState } from "react";
// import { sortArrAscending } from "../../../helper/constants";

// export default function SearchBarComp({
//     searchValue,
//     setSearchValue,
//     tableData,
//     setSortedTableData,
//     key1,
//     key2,
//     key3,
//     sortingKey
// }) {

//     const [filteredData, setFilteredData] = useState([]);

//     useEffect(() => {
//         handleSearch();
//     }, [searchValue, tableData]);

//     const handleSearch = () => {
//         if (!searchValue) {
//             setFilteredData(tableData);
//             return;
//         }

//         const newFilteredData = tableData.filter(item => {
//             return (
//                 item?.[key1]?.toLowerCase().includes(searchValue.toLowerCase()) ||
//                 item?.[key2]?.toLowerCase().includes(searchValue.toLowerCase()) ||
//                 item?.[key3]?.toLowerCase().includes(searchValue.toLowerCase())
//             );
//         });

//         setFilteredData(newFilteredData);
//     };

//     useEffect(() => {
//         const sortedData = sortArrAscending(filteredData, sortingKey);
//         setSortedTableData(sortedData);
//     }, [filteredData]);

//     return (
//         <div style={{ display: "flex", flexDirection: "column" }}>
//             <p style={{ fontWeight: 600, marginBottom: 7 }}>Search</p>
//             <input
//                 style={{ border: '1px solid #DEE2E6', padding: '5%', borderRadius: 5, width: 250, height: 40 }}
//                 placeholder="Search"
//                 type="text"
//                 name="search"
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//             />
//         </div>
//     );
// }

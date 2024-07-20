import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../Tabls.scss";
import { CallGETAPI } from "../../../helper/API";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import UserAedTbl from "../UserAedTbl";
import TableSkeleton from "../../../pages/accounts/skeleton/table/TableSkeleton";
import { FormatDate, userEquipmentTabData } from "../../../helper/Common";
import { CalculateAEDList, DecryptToken } from "../../../helper/BasicFn";
import ServiceCheck from "../../../img/ServiceCheck.svg";

export default function Equipment({ is_user, tabs, privileges,account_id, contact_id }) {
  const navigate = useNavigate();
  // const { account_id } = useParams();
  const [aedList, setAedList] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const { userAccountId } = useParams();
  
const getAeds = async () => {
    //  + account_id
    // const resultold = await CallGETAPI("account/get-aed-with-standalon/" + userAccountId?.userAccountId);
    // console.log({resultold})
    const result = await userEquipmentTabData(userAccountId);
    // console.log({result})
    // console.log({ result });
    if (result?.data?.status) {
      // const aedsold = resultold?.data?.data;
      const aeds = result?.data?.data;
      // console.log({aeds})
      // console.log({aedsold})
      const resultArr = CalculateAEDList(aeds);

      setAedList(resultArr);
    }

    setShowLoading(false);
  };

  // on load fetch data
  useEffect(() => {
    getAeds();
   }, []);

  const [openMoveModal, setOpenMoveModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const sortTable = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...data].sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) {
        return direction === "asc" ? -1 : 1;
      }
      if (valA > valB) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
    setSortConfig({ key, direction });
  };

  const newDD = (item) => {
    return (
      <>
        <Dropdown>
          <Dropdown.Toggle
            className="btn btn-transparent text-primary ms-2 bg-white"
            id="new-tab-btn"
            style={{ backgroundColor: "transparent !important", border: "none" }}
          >
            <img
              src="/add.svg"
              alt="New"
            />
            <span className="ms-1">New</span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="bg-primary" style={{ minWidth: "20px" }}>
            {privileges.includes('aed-newstandloneacce') && (
              <Dropdown.Item
                onClick={() => {
                  navigate(`/account/aed/NewStandloneAcce/${account_id}/${item?.site_id}`);
                }}
              >
                Accessories
              </Dropdown.Item>
            )}

            {privileges.includes('new-aed') && (
              <Dropdown.Item
                onClick={() => {
                  navigate(`/account/new/aed/${account_id}/${item?.site_id}`);
                }}
              >
                AED
              </Dropdown.Item>
            )}

          </Dropdown.Menu>
        </Dropdown>
      </>
    )
  }

  const moveDD = (item) => {
    return (
      <>
        <Dropdown >
          <Dropdown.Toggle
            className="btn btn-transparent text-primary ms-2 bg-white"
            id="new-tab-btn"
            style={{ backgroundColor: "transparent !important", border: "none" }}
          >
            <img
              src="/add.svg"
              alt="Move"
            />
            <span className="ms-1">Move</span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="bg-primary" style={{ minWidth: "20px" }}>
            {privileges.includes('move-accessories') && (
              <Dropdown.Item
                onClick={() => {
                  navigate(`/move-accessory/${account_id}/${item?.site_id}`);
                }}
              >
                Accessories
              </Dropdown.Item>
            )}

            {privileges.includes('move-aed') && (
              <Dropdown.Item
                onClick={() => {
                  navigate(`/move-aed/` + account_id + '/' + item?.site_id, { state: { siteName: item?.site_name } });
                }}
              >
                AED
              </Dropdown.Item>
            )}

          </Dropdown.Menu>
        </Dropdown>
      </>
    )
  }

  console.log('aedList', aedList);

  return (
    <div className="relative" style={{paddingInline:"2px",paddingTop:"10px"}}>
      {/* loading */}
      {showLoading ? (
        <>
          <div style={{ marginTop: '3%' }}>
            <TableSkeleton />
          </div>
        </>
      ) : (
        <>
          {aedList?.length > 0 ? (
            <>
              {aedList.map((item, index) => (
                <div key={index}>
                  <div className="row w-100">
                    <div className="col-md-12 p-0 text-center site-title-btn">
                      <h2 className="aed-title">{item?.site_name}</h2>

                      <div className="right-btns d-flex align-items-center absolute right-0 btn-section" style={{ display: 'flex', gap: '3%', width: 500, justifyContent: "right", marginTop: '1%' }}>

                        {(privileges?.includes('aed-newstandloneacce') || privileges?.includes('new-aed')) && (
                          newDD(item)
                        )}

                        {(privileges?.includes('move-aed') || privileges?.includes('move-accessory')) && (
                          moveDD(item)
                        )}

                        {privileges?.includes('aed-service-check') && (
                          <Link className="ms-2"
                          style={{ textDecoration: 'none', color:"#0C71C3" }}
                           to={`/account/aed/service-check/${account_id}/${item?.site_id}`}>
                            <img src={ServiceCheck} width={20} height={20} />
                            Service Check
                          </Link>
                        )}

                      </div>
                    </div>
                  </div>
                  <div className="">
                    {item?.data.length > 0 ? (<>
                      <UserAedTbl 
                        SingleAED={item?.data}
                        setShowAedTbl={()=>{}}
                        privileges={privileges}

                        />
                      
                   </> ) : (
                      <div className="">No Records Found</div>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <table className="table data-table my-4">
                <thead className="thread-style">
                  <tr>
                    <th>AED Brand / Model</th>
                    <th>Serial Number</th>
                    <th>AED Placement</th>
                    <th>Battery Expiration</th>
                    <th>Pads Expiration</th>
                    <th>Last Check</th>
                    <th>Last Service</th>
                    <th>RMS Check</th>
                  </tr>
                </thead>
                <tbody className="bordered-table">
                  <tr>
                    <td colSpan={8} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { BatteryIcon, PeoplePad } from "../../helper/Icons";
import { FormatDate, GetProfile, getPermission } from "../../helper/Common";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import { DecryptToken, RenderDate } from "../../helper/BasicFn";
import { useNavigate } from "react-router-dom";
// import "./AEDs.css";
import "../../../src/global.css";
import { isUserPermission, linkTabsPermission } from "../../helper/permission";

// const RenderDate = (date,is_red=1)=> {
// 	const currentDate = moment();
// 	// Convert the input date to a moment object
// 	const inputMoment = moment(date);

// 	// Compare the input date with the current date
// 	const isInputDateBeforeCurrent = inputMoment.isBefore(currentDate.subtract(30, 'days'));
// 	if(!is_red){
// 		return <span >{date}</span>;
// 	}
// 	if(isInputDateBeforeCurrent){
// 		return <span className="text-danger" >{date}</span>;
// 	}else{
// 		return <span >{date}</span>;
// 	}
// }
function UserAedTbl({ SingleAED, setShowAedTbl,tabTbldata=[] }) {
  const navigate = useNavigate();
  const [data, setData] = useState(SingleAED || []);
  const user = DecryptToken();
  const privilege = getPermission();
  const userPermission = ["aed-details", "notes-tab", "documents-tab", "support-tab"];

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
      let valA = a[key] || " ";
      let valB = b[key] || " ";

      if (typeof valA === "string" && valA && valB) {
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

  const [jsonData, setJsonData] = useState(SingleAED);
  const [sortBy, setSortBy] = useState("");
  const sortJsonData = (column, dir = "") => {
    const sortedData = [...jsonData];
    if (!dir) {
      dir = sortConfig.direction;
    }
    let direction = dir === "asc" ? "desc" : "asc";
    let isSortedAsc = dir === "asc" ? 0 : 1; //column === sortBy;

    if (sortConfig.key === column && dir === "asc") {
      direction = "desc";
      isSortedAsc = false;
    }

    // Check if the data is already sorted in the selected column
    sortedData.sort((a, b) => {
      const valueA = getValueToCompare(a, column);
      const valueB = getValueToCompare(b, column);

      if (typeof valueA === "string" && typeof valueB === "string") {
        return valueA.localeCompare(valueB) * (isSortedAsc ? 1 : -1);
      } else if (typeof valueA === "string" && typeof valueB === "object") {
        return -1 * (isSortedAsc ? 1 : -1);
      } else if (typeof valueA === "object" && typeof valueB === "string") {
        return 1 * (isSortedAsc ? 1 : -1);
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return (valueA - valueB) * (isSortedAsc ? 1 : -1);
      } else {
        return 0;
      }
    });

    // if (sortedData?.length > 0) {
    //   setTabTbldata({
    //     ...tabTbldata,
    //     equipment: {
    //       ...tabTbldata.equipment,
    //       aed: true,
    //     }
    //   });
    // }

    // Update the sorted data and the current sorting column
    setJsonData(sortedData);
    setSortBy(column);
    setSortConfig({ key: column, direction: direction });
  };

  const getValueToCompare = (object, column) => {
    if (column === "aed_id") {
      return object.aed_id;
    } else if (column === "site_id") {
      return object.site_id;
    } else if (column === "serial_number") {
      return object.serial_number;
    } else if (column === "placement") {
      return object.placement;
    } else if (column === "brand_name") {
      return object.brand_name;
    } else if (column === "battery_expiration") {
      // Implement logic to extract value from battery_expiration
      return object.battery_expiration[0].data[0];
    } else if (column === "pads_expiration") {
      // Implement logic to extract value from pads_expiration
      return object.pads_expiration[0].data[0];
    } else if (column === "last_check") {
      return object.last_check;
    } else if (column === "last_service") {
      return object.last_service;
    } else if (column === "rms_check") {
      return object.rms_check;
    } else if (column === "pediatric_key") {
      return object.pediatric_key;
    } else {
      return null;
    }
  };
  useEffect(() => {
    sortJsonData("brand_name", "desc");
    if (typeof setShowAedTbl === "function") {
      setShowAedTbl(false);
    }
  }, []);

  let profile = GetProfile(); //JSON.parse(localStorage.getItem("ross-profile"));
  let user_type = profile?.user_type;

  let is_user = false;
  let is_aed_details = false;
  const handleAedClick = (item) => {
    if (user_type > 1) {
      is_user = true;
      let permissions = localStorage.getItem("permissions");
      let permissionsArr = permissions.split(",");
      if (permissionsArr.includes("aed-details")) {
        is_aed_details = true;
        navigate("/user/aed-details/" + item?.aed_id, {
          state: { is_user: true, privileges: permissionsArr },
        });
      }
    } else {
      navigate("/account/aed-details/" + item?.aed_id);
    }
  };

  return (
    <>
      <div className="table">
        {/* {JSON.stringify(SingleAED)} */}
        {SingleAED && (
          <table
            className="theme-table w-100 mt-2"
            style={{ marginBottom: "3%" }}
          >
            <thead className="">
              <tr>
                <th
                  className="border border-2 py-1 px-2 border-r-blue border-t-blue"
                  style={{ backgroundColor: "#999999", minWidth: "80px" }}
                  onClick={() => sortJsonData("brand_name")}
                >
                  <div className="d-flex inside-td">
                    <span> AED Brand / Model </span>
                    {sortConfig.key === "brand_name" &&
                    sortConfig.direction === "asc" ? (
                      <span className="uparrow">
                        <ArrowRightAltRoundedIcon />    
                      </span>
                    ) : (
                      <span className="downarrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="border border-2 py-1 px-2 border-r-blue border-t-blue"
                  style={{ backgroundColor: "#999999" }}
                  onClick={() => sortJsonData("serial_number")}
                >
                  <div className="d-flex inside-td">
                    <span>Serial Number</span>
                    {sortConfig.key === "serial_number" &&
                    sortConfig.direction === "asc" ? (
                      <span className="uparrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    ) : (
                      <span className="downarrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="border border-2 py-1 px-2 border-r-blue border-t-blue"
                  style={{ backgroundColor: "#999999" }}
                  onClick={() => sortJsonData("placement")}
                >
                  <div className="d-flex inside-td">
                    <span>AED Placement</span>
                    {sortConfig.key === "placement" &&
                    sortConfig.direction === "asc" ? (
                      <span className="uparrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    ) : (
                      <span className="downarrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="border border-2 py-1 px-2 border-r-blue border-t-blue"
                  style={{ backgroundColor: "#999999", minWidth: "85px" }}
                  onClick={() => sortJsonData("battery_expiration")}
                >
                  <div className="d-flex inside-td">
                    <span>Battery Expiration </span>
                    {sortConfig.key === "battery_expiration" &&
                    sortConfig.direction === "asc" ? (
                      <span className="uparrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    ) : (
                      <span className="downarrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="border border-2 py-1 px-2 border-r-blue border-t-blue"
                  style={{ backgroundColor: "#999999", minWidth: "85px" }}
                  onClick={() => sortJsonData("pads_expiration")}
                >
                  <div className="d-flex inside-td">
                    <span>Pads Expiration </span>
                    {sortConfig.key === "pads_expiration" &&
                    sortConfig.direction === "asc" ? (
                      <span className="uparrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    ) : (
                      <span className="downarrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="border border-2 py-1 px-2 border-r-blue border-t-blue"
                  style={{ backgroundColor: "#999999" }}
                  onClick={() => sortJsonData("last_check")}
                >
                  <div className="d-flex inside-td">
                    <span>Last Check</span>
                    {sortConfig.key === "last_check" &&
                    sortConfig.direction === "asc" ? (
                      <span className="uparrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    ) : (
                      <span className="downarrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="border border-2 py-1 px-2 border-r-blue border-t-blue"
                  style={{ backgroundColor: "#999999" }}
                  onClick={() => sortJsonData("last_service")}
                >
                  <div className="d-flex inside-td">
                    <span>Last Service</span>
                    {sortConfig.key === "last_service" &&
                    sortConfig.direction === "asc" ? (
                      <span className="uparrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    ) : (
                      <span className="downarrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="border border-2 py-1 px-2 border-t-blue"
                  style={{ backgroundColor: "#999999" }}
                  onClick={() => sortJsonData("rms_check")}
                >
                  <div className="d-flex inside-td">
                    <span> RMS Check </span>
                    {sortConfig.key === "rms_check" &&
                    sortConfig.direction === "asc" ? (
                      <span className="uparrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    ) : (
                      <span className="downarrow">
                        <ArrowRightAltRoundedIcon />
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            {jsonData?.length > 0 ? (
              <tbody className="border border-2 py-1 px-2 bg-tbl-border odd-even-row border-b-blue">
                {jsonData.map((item) => (
                  <tr>
                    <td className="border border-2 py-1 px-2 border-r-blue border-b-blue">
                      {/* <span
                        // to={`/account/aed-details/${item.aed_id}?fetchData=true`}
                        className="link"
                        style={{ textDecoration: "none" }}
                        onClick={(e) => {
                          // Prevent the default behavior of the link
                          e.preventDefault();
                          // navigate(`/account/aed-details/${item.aed_id}?fetchData=true`)
                          // Call the handleAedClick function
                          handleAedClick(item);
                          // Manually navigate to the link's destination
                          window.location.href = e.target.getAttribute("href");
                        }}
                      >
                        {item?.brand_name}
                      </span> */}

                      <span
                        // to={`/account/aed-details/${item.aed_id}?fetchData=true`}
                        className={(linkTabsPermission(userPermission) === 1)  ? "link" : ""}
                        style={{ textDecoration: "none" }}
                        onClick={(e) => {(linkTabsPermission(userPermission) === 1) && navigate(`/user/aed-details/${item.aed_id}?fetchData=true`)
                          // Prevent the default behavior of the link
                          // e.preventDefault();
                          // // navigate(`/account/aed-details/${item.aed_id}?fetchData=true`)
                          // // Call the handleAedClick function
                          // handleAedClick(item);
                          // // Manually navigate to the link's destination
                          // window.location.href = e.target.getAttribute("href");
                        }}
                      >
                        {item?.brand_name}
                      </span>

                      {/* <p style={{
											fontWeight: 600,
											cursor: is_user ? (is_aed_details ? 'pointer' : 'default') : 'pointer',
											color: is_user ? (is_aed_details ? '#0C71C3' : '') : '#0C71C3'
										}} onClick={() => handleAedClick(item)}>
											{item?.brand_name}
										</p> */}
                    </td>

                    <td
                       className={(linkTabsPermission(userPermission) === 1)  ? "border border-2 py-1 px-2 border-r-blue border-b-blue link" : "border border-2 py-1 px-2 border-r-blue border-b-blue"}
                       style={{ textDecoration: "none" }}
                       onClick={(e) => {(linkTabsPermission(userPermission) === 1) && navigate(`/user/aed-details/${item.aed_id}?fetchData=true`)}}
                    >
                      {item?.serial_number}
                    </td>

                    <td className="border border-2 py-1 px-2 border-r-blue border-b-blue">
                      {item?.placement}
                    </td>
                    <td className="border border-2 py-1 px-2 border-r-blue border-b-blue">
                      {item?.battery_expiration?.map((it) => (
                        <>
                          {/* {it.title} <br/> */}
                          {it?.data?.map((it2) =>
                            it2 === "unknown" ? (
                              <p>
                                <img src={it?.img} width={15} />
                                {it2}
                              </p>
                            ) : (
                              it2 != "" &&
                              FormatDate(it2) != "" && (
                                <p>
                                  <img src={it?.img} width={15} /> &nbsp;
                                  {RenderDate(
                                    FormatDate(it2),
                                    it.title === "manufetchDate" ? 0 : 1
                                  )}
                                </p>
                              )
                            )
                          )}
                        </>
                      ))}
                    </td>
                    <td className="border border-2 py-1 px-2 border-r-blue border-b-blue">
                      {item?.pads_expiration?.map((it) => (
                        <>
                          {it?.data?.map((it2) =>
                            it2 === "unknown" ? (
                              <p>
                                <img src={it?.img} width={15} /> &nbsp;
                                {it2}
                              </p>
                            ) : FormatDate(it2) ? (
                              <p>
                                <img src={it?.img} width={15} /> &nbsp;
                                {FormatDate(it2)}
                              </p>
                            ) : it2 != "" && FormatDate(it2) ? (
                              <p>
                                <img src={it?.img} width={15} /> &nbsp;
                                {RenderDate(
                                  FormatDate(it2),
                                  it.title === "manufetchDate" ? 0 : 1
                                )}
                              </p>
                            ) : (
                              ""
                            )
                          )}
                        </>
                      ))}
                      {item?.pediatric_key ? (
                        <p>
                          <img src={"/child-Vector.png"} width={15} /> &nbsp;
                          <img src="/key-Vector.png" width={15} />
                        </p>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="border border-2 py-1 px-2 border-r-blue border-b-blue">
                      {item?.last_check || "-"}
                    </td>
                    <td className="border border-2 py-1 px-2 border-r-blue border-b-blue">
                      {item?.last_service || "-"}
                    </td>
                    <td className="border border-2 py-1 px-2 border-b-blue">
                      {item?.rms_check || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody className="">
                <tr>
                  <td colSpan={8}>
                    <center>No equipment at this site.</center>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        )}
      </div>
    </>
  );
}

export default UserAedTbl;

import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./table.css";
// import 'devextreme/dist/css/dx.light.css';
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import AEDTable from "../../../components/tables/AEDs/AEDTable";
import { FormatDate, getPermission } from "../../../helper/Common";
import AedMoveModal from "../../../components/forms/subaed_forms/AedMoveModal";
import TableSkeleton from "../skeleton/table/TableSkeleton";
import { DateFormate, DefaultDateForm } from "../../../helper/TblFn";
import {
  CalculateAEDList,
  CheckDate,
  DecryptToken,
} from "../../../helper/BasicFn";
import AEDOutOfServiceTbl from "../../../components/tables/AEDs/AEDOutOfServiceTbl";
import servicecheck from "../../../img/ServiceCheck.svg";
import StandaloneAcc from "./StandaloneAcc";
import { Dropdown } from "react-bootstrap";
import AEDStandAlone from "../../../components/tables/AEDs/AEDStandAlone";
import { Button as FixedButton } from "@mui/material";
import Filter from "../../../components/filter/equipmentIndex";
import Drawer from "@mui/material/Drawer";
import { useSelector, useDispatch } from "react-redux";
import "../../../global.css";
import {
  removeFilterData,
  removePayloadData,
} from "../../../redux/slices/AccountDetailsEquipmentFilter";
import SingleSiteName from "../../../components/AEDs/SingleSiteName";
import { isSubAdminPermission } from "../../../helper/permission";

export default function Aeds({ tabTbldata, setTabTbldata }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accountId } = useParams();
  const [aedList, setAedList] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [aedsData, setAedsData] = useState([]);
  const [showAedTbl, setShowAedTbl] = useState(true);
  const [showAccTbl, setShowAccTbl] = useState(true);
  const [outofServiceData, setOutofServiceData] = useState([]);
  const user = DecryptToken();
  const privilege = getPermission();
  const equipmentFilterData = useSelector(
    (state) => state.accountdetailsequipmentfilter.equipmentFilterData
  );
  const equipmentPayloadData = useSelector(
    (state) => state.accountdetailsequipmentfilter.equipmentPayloadData
  );

  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const setTblsData = (result) => {
    let aeds = result?.data?.data || [];
    const pendingaeds = result?.data?.pendingData;
    const OFSData = result?.data?.outOfData;
    let newArr = [];

    if (Array.isArray(aeds) && pendingaeds.length > 0) {
      newArr = [...pendingaeds, ...aeds];
    } else {
      newArr = aeds;
    }
    aeds = newArr;
    setAedsData(aeds);
    const resultArr = CalculateAEDList(aeds);
    const OFDArr = CalculateAEDList(OFSData);
    const OFD = [];
    for (let OFi = 0; OFi < OFDArr?.length; OFi++) {
      const el = OFDArr[OFi];
      for (let OF2 = 0; OF2 < el.data.length; OF2++) {
        const element = el.data[OF2];
        const obj = {
          site_name: el?.site_name,
          site_id: el?.site_id,
          standalone_data: el?.standalone_data || [],
          ...element,
        };
        OFD.push(obj);
      }
    }
    setOutofServiceData(OFD);
    // setOutofServiceData(); outofServiceData;
    setAedList(resultArr);
  };

  // get aeds by account
  const getAeds = async () => {
    setShowLoading(true);

    if (
      Object.keys(equipmentFilterData).length !== 0 &&
      Object.keys(equipmentPayloadData).length !== 0
    ) {
      const result = await CallPOSTAPI(
        "account/equipment-filter-search-result",
        equipmentPayloadData
      );
      if (result?.data?.status) {
        setTblsData(result);
      }
    } else {
      const result = await CallGETAPI(
        "account/get-aed-with-standalon/" + accountId
      );
      if (result?.data?.status) {
        setTblsData(result);
      }
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

  const handleClearFilterData = async () => {
    dispatch(removeFilterData());
    dispatch(removePayloadData());
    setShowLoading(true);
    const result = await CallGETAPI(
      "account/get-aed-with-standalon/" + accountId
    );
    if (result?.data?.status) {
      setTblsData(result);
    }
    setShowLoading(false);
  };

  return (
    <div className="relative" style={{ width: "93vw", marginBottom: "5%" }}>
      {/* loading */}
      {showLoading ? (
        <>
          <div style={{ padding: "3% 0" }}>
            <TableSkeleton />
          </div>
        </>
      ) : (
        <>
          <div>
            {equipmentFilterData &&
            Object.keys(equipmentFilterData).length !== 0 ? (
              <div style={{ position: "relative !important" }}>
                <FixedButton
                  className="btn-style-cancel-filter"
                  onClick={handleClearFilterData}
                >
                  Clear Filter
                </FixedButton>
              </div>
            ) : null}
            <FixedButton
              className="btn-style-filter"
              onClick={handleDrawerOpen}
            >
              Equipment Filters
            </FixedButton>
            <Drawer
              sx={{
                width: "300px",
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: "300px",
                  boxSizing: "border-box",
                },
              }}
              anchor="right"
              open={open}
              onClose={handleDrawerClose}
            >
              {/* filter component  */}
              <Filter
                setOpen={setOpen}
                setShowLoading={setShowLoading}
                accountId={accountId}
                accountListingPage={true}
                setTblsData={setTblsData}
                setShowAedTbl={setShowAedTbl}
                setShowAccTbl={setShowAccTbl}
                tabTbldata={tabTbldata}
                setTabTbldata={setTabTbldata}
              />
            </Drawer>
          </div>
          {aedList?.length > 0 ? (
            <>
              {aedList.map((item, index) => (
                <div key={index}>
                  <div className="row w-100 EquipmentTab">
                    <div className="text-center p-0 site-title-btn EquipmentHeaderDiv">
                      <SingleSiteName
                        equipmentFilterData={equipmentFilterData}
                        item={item}
                      />
                      {equipmentFilterData && equipmentFilterData?.aed === false
                        ? null
                        : item?.data.length !== 0 && (
                            <div className="right-btns d-flex align-items-center absolute right-0 btn-section btnsDiv">
                              {(isSubAdminPermission("new-aed") === 1 ||
                                isSubAdminPermission("new-accessories") ===
                                  1) && (
                                <Dropdown>
                                  <Dropdown.Toggle
                                    className="btn btn-transparent text-primary ms-2 bg-white DropDownBtn"
                                    id="new-tab-btn"
                                    style={{
                                      backgroundColor: "transparent !important",
                                      border: "none",
                                    }}
                                  >
                                    <img
                                      className=""
                                      src="/add.svg"
                                      alt="New"
                                    />
                                    <span className="ms-1 textSize">New</span>
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu
                                    className="bg-primary"
                                    style={{ minWidth: "20px" }}
                                  >
                                    {isSubAdminPermission("new-accessories") ===
                                      1 && (
                                      <Dropdown.Item
                                        className="DropDownListtextSize"
                                        onClick={() => {
                                          navigate(
                                            `/account/aed/NewStandloneAcce/${accountId}/${item?.site_id}`
                                          );
                                        }}
                                      >
                                        Accessories
                                      </Dropdown.Item>
                                    )}

                                    {isSubAdminPermission("new-aed") === 1 && (
                                      <Dropdown.Item
                                        className="DropDownListtextSize"
                                        onClick={() => {
                                          navigate(
                                            `/account/new/aed/${accountId}/${item?.site_id}`
                                          );
                                        }}
                                      >
                                        AED
                                      </Dropdown.Item>
                                    )}
                                  </Dropdown.Menu>
                                </Dropdown>
                              )}

                              {(isSubAdminPermission("move-aed") === 1 ||
                                isSubAdminPermission("move-accessory") ===
                                  1) && (
                                <Dropdown>
                                  <Dropdown.Toggle
                                    className="btn btn-transparent text-primary ms-2 bg-white DropDownBtn"
                                    id="new-tab-btn"
                                    style={{
                                      backgroundColor: "transparent !important",
                                      border: "none",
                                    }}
                                  >
                                    <img src="/add.svg" alt="Move" />
                                    <span className="ms-1 textSize">Move</span>
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu
                                    className="bg-primary"
                                    style={{ minWidth: "20px" }}
                                  >
                                    {isSubAdminPermission("move-accessory") ===
                                      1 && (
                                      <Dropdown.Item
                                        className="DropDownListtextSize"
                                        onClick={() => {
                                          navigate(
                                            `/move-accessory/${accountId}/${item?.site_id}`
                                          );
                                        }}
                                      >
                                        Accessories
                                      </Dropdown.Item>
                                    )}

                                    {isSubAdminPermission("move-aed") === 1 && (
                                      <Dropdown.Item
                                        className="DropDownListtextSize"
                                        onClick={() => {
                                          navigate(
                                            `/move-aed/` +
                                              accountId +
                                              "/" +
                                              item?.site_id,
                                            {
                                              state: {
                                                siteName: item?.site_name,
                                              },
                                            }
                                          );
                                        }}
                                      >
                                        AED
                                      </Dropdown.Item>
                                    )}
                                  </Dropdown.Menu>
                                </Dropdown>
                              )}

                              {isSubAdminPermission("aed-service-check") === 1 && (
                                <button
                                  className="btn text-primary serviceCheckbtn"
                                  type="button"
                                  onClick={(e) => {
                                    navigate(
                                      "/account/aed/service-check/" +
                                        accountId +
                                        "/" +
                                        item?.site_id,
                                      {
                                        state: { siteName: item?.site_name },
                                      }
                                    );
                                  }}
                                >
                                  <img
                                    className="serviceCheckImage"
                                    src={servicecheck}
                                    alt="svg"
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      marginRight: "5px",
                                    }}
                                  />
                                  <span className="ms-1 textSize">
                                    Service Check
                                  </span>
                                </button>
                              )}
                            </div>
                          )}
                    </div>
                  </div>
                  <div className="">
                    {equipmentFilterData &&
                    equipmentFilterData?.aed === false ? null : item?.data
                        .length === 0 ? null : (
                      <AEDTable
                        SingleAED={item?.data}
                        aedsData={aedsData}
                        setShowAedTbl={setShowAedTbl}
                        tabTbldata={tabTbldata}
                        setTabTbldata={setTabTbldata}
                      />
                    )}
                    {equipmentFilterData &&
                    equipmentFilterData?.accessories === false ? null : item
                        ?.standalone_data.length === 0 ? null : (
                      <AEDStandAlone
                        siteId={item?.site_id}
                        accountId={accountId}
                        standaloneData={item?.standalone_data}
                        setShowAccTbl={setShowAccTbl}
                        tabTbldata={tabTbldata}
                        setTabTbldata={setTabTbldata}
                      />
                    )}
                  </div>
                </div>
              ))}

              {equipmentFilterData &&
              equipmentFilterData?.aed ===
                false ? null : outofServiceData.length === 0 ? null : (
                <div className="">
                  <div className="row w-100">
                    <div className="col-md-12 p-0 text-center site-title-btn">
                      <h2 className="aed-title OutOfServiceTitle">
                        Out of Service
                      </h2>
                    </div>
                  </div>
                  <div className="">
                    <AEDOutOfServiceTbl
                      SingleAED={outofServiceData}
                      aedsData={aedsData}
                    />
                  </div>
                </div>
              )}

              {((Object.keys(equipmentFilterData).length !== 0 &&
                equipmentFilterData?.aed === false &&
                equipmentFilterData?.accessories === false) ||
                (aedList.length === 0 && outofServiceData.length === 0) ||
                (aedList.length > 0 &&
                  showAedTbl === true &&
                  equipmentFilterData?.aed === true &&
                  equipmentFilterData?.accessories === false) ||
                (aedList.length > 0 &&
                  showAccTbl === true &&
                  equipmentFilterData?.accessories === true &&
                  equipmentFilterData?.aed === false)) && (
                <>
                  <div className="text-center p-0 site-title-btn EquipmentHeaderDiv">
                    {/*<div className="right-btns d-flex align-items-center absolute right-0 btn-section-custom-equipment btnsDiv">
                      <Dropdown>
                        <Dropdown.Toggle
                          className="btn btn-transparent text-primary ms-2 bg-white DropDownBtn"
                          id="new-tab-btn"
                          style={{
                            backgroundColor: "transparent !important",
                            border: "none",
                          }}
                        >
                          <img className="" src="/add.svg" alt="New" />
                          <span className="ms-1 textSize">New</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu
                          className="bg-primary"
                          style={{ minWidth: "20px" }}
                        >
                          <Dropdown.Item
                            className="DropDownListtextSize"
                            onClick={() => {
                              navigate(
                                `/account/aed/NewStandloneAcce/${accountId}/0`
                              );
                            }}
                          >
                            Accessories
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="DropDownListtextSize"
                            onClick={() => {
                              navigate(`/account/new/aed/${accountId}/0`);
                            }}
                          >
                            AED
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                          </div>*/}
                    <div style={{ marginTop: "30px" }}>
                      <table className="table data-table my-2 theme-table">
                        <thead className="thread-style">
                          <tr>
                            <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                              AED Brand / Model
                            </th>
                            <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                              Serial Number
                            </th>
                            <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                              AED Placement
                            </th>
                            <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                              Battery Expiration
                            </th>
                            <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                              Pads Expiration
                            </th>
                            <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                              Last Check
                            </th>
                            <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                              Last Service
                            </th>
                            <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                              RMS Check
                            </th>
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
                    </div>
                  </div>
                </>
              )}

              {/* <div>
                            <div className='' >
                                <StandaloneAcc accountId={accountId} />
                            </div>
                        </div> */}
            </>
          ) : (
            <>
              <div
                className="right-btns d-flex align-items-center absolute right-0 btn-section btnsDiv "
                style={{
                  justifyContent: "end",
                  marginTop: "4px",
                  marginBottom: "-17px",
                }}
              >
                <Dropdown>
                  <Dropdown.Toggle
                    className="btn btn-transparent text-primary ms-2 bg-white DropDownBtn"
                    id="new-tab-btn"
                    style={{
                      backgroundColor: "transparent !important",
                      border: "none",
                    }}
                  >
                    <img className="" src="/add.svg" alt="New" />
                    <span className="ms-1 textSize">New</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    className="bg-primary"
                    style={{ minWidth: "20px" }}
                  >
                    <Dropdown.Item
                      className="DropDownListtextSize"
                      onClick={() => {
                        navigate(
                          `/account/aed/NewStandloneAcce/${accountId}/0`
                        );
                      }}
                    >
                      Accessories
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="DropDownListtextSize"
                      onClick={() => {
                        navigate(`/account/new/aed/${accountId}/0`);
                      }}
                    >
                      AED
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <table className="table data-table my-4 theme-table">
                <thead className="thread-style">
                  <tr>
                    <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                      AED Brand / Model
                    </th>
                    <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                      Serial Number
                    </th>
                    <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                      AED Placement
                    </th>
                    <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                      Battery Expiration
                    </th>
                    <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                      Pads Expiration
                    </th>
                    <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                      Last Check
                    </th>
                    <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                      Last Service
                    </th>
                    <th className="border border-2 py-1 px-2 border-r-blue border-t-blue">
                      RMS Check
                    </th>
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

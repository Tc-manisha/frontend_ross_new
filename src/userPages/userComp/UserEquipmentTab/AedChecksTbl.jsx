import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CallGETAPI } from "../../../helper/API";
import { DataGrid } from "devextreme-react";
import { Column, Paging, Scrolling } from "devextreme-react/data-grid";
import {
  FormatDate,
  FormatDateTime,
  FormatDateWithTime,
} from "../../../helper/Common";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import TableSkeleton from "../../../pages/accounts/skeleton/table/TableSkeleton";
import { isSubAdminPermission, isUserPermission } from "../../../helper/permission";
const classes = [
  {
    ID: 1,
    FirstName: "John",
    LastName: "Heart",
    Prefix: "Mr.",
    Position: "CEO",
    Picture: "images/employees/01.png",
    BirthDate: "1964/03/16",
    HireDate: "1995/01/15",
    Notes:
      "John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.",
    Address: "351 S Hill St.",
    State: "Register Assign",
    City: "Los Angeles",
  },
];

const AEDChecksTbl = () => {
  const navigate = useNavigate();
  const { AEDcheckId, aedId } = useParams();
  const [toggleValue, setToggleValue] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  // const aedId = searchParams.get('aed_id');
  // const aedId = useParams();
  console.log({ AEDcheckId, aedId });
  const accountId = searchParams.get("account_id");

  const [aedDetails, setAedDetails] = useState({});

  const [aedData, setAEDData] = useState({});
  const [storageInfoList, setStorageInfoList] = useState([]);
  const [rmsBrandList, setrmsBrandList] = useState([]);
  const [aedBattryTypeList, setaedBattryTypeList] = useState([]);
  const [aedPadTypeList, setaedPadTypeList] = useState([]);
  const [OtherFiled, setOtherFileds] = useState([]);
  const [batteryTypeList, setBatteryTypeList] = useState([]);
  const [aedReadyStatus, setAedReadyStatus] = useState(null);

  const [brandList, setBrandList] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [formData, setFormData] = useState({
    aed_id: aedId,
    account_id: accountId,
    is_aed_present: 1,
    status_indicator: 1,
    rescue_kit_present: 1,
    aed_storage_currect: 1,
    sti_expiry_date: "",
    sti_alarmed: 1,
    sti_turned_on: 1,
    sti_alarme_sound: 1,
    battery_information_toggle: 1,
    bleeding_kit_located_toggle: 1,
    bleeding_kit_sealed_toggle: 1,
    oxygen_equipment_located_toggle: 1,
    needed_supplies_toggle: 1,
    gauge_show_toggle: 1,
    pads_info_toggle: 1,
    support_tickets_toggle: 1,
    battery_info: [],
    spare_battery_info: [],
    adult_pad_info: [],
    spare_adult_pad_info: [],
    pediatric_pad_info: [],
    spare_padric_pad_info: [],
    gateway_info: [],
    adult_pad_pak_info: [],
    spare_adult_pad_pak_info: [],
    pediatric_pak_pad_info: [],
    spare_padric_pak_pad: [],
    bleeding_kit_located_input: "",
    bleeding_kit_sealed_input: "",
    oxygen_equipment_located_input: "",
    needed_supplies_input: "",
    is_aed_present_input: "",
    status_indicator_input: "",
    rescue_kit_present_input: "",
    issue_type: "",
    issue: "",
  });

  const ft = async () => {
    const res = await CallGETAPI("account/aed-check-list/" + aedId);
    console.log({ res });
    if (res?.data?.data) {
      setAEDData(res?.data?.data);
      // setAedReadyStatus(res?.data.aedReadyStatus.ready_status);
    }
    setLoading(false);
  };
  useEffect(() => {
    ft();
  }, []);
  const renderDate = (val) => {
    const rowData = val.data;
    return (
      <span
        className={(isUserPermission("aed-check-details") === 1) ? "link" : ""}
        style={{background:"transparent"}}
        type=""
        onClick={() => (isUserPermission("aed-check-details") === 1) &&
          navigate("/account/aed-checks-details/" + aedId + "/" + rowData?.id)
        }
      >
        {FormatDateWithTime(val.value)}
      </span>
    );
  };
  const renderCheck = (e) => {
    return e.value ? (
      <CheckIcon sx={{ color: "#00FF00" }} />
    ) : (
      <CloseIcon color={"error"} />
    );
  };

  // const renderStatusCheck = (e) => {
  //   console.log("ready status value", e);
  //   return e.value === "ready" ? (
  //     <CheckIcon sx={{ color: "#00FF00" }} />
  //   ) : (
  //     <CloseIcon color={"error"} />
  //   );
  // };

  return (
    <>
      {loading && (
        <div className="" style={{ width: "100%", marginTop: "4%" }}>
          <TableSkeleton />
        </div>
      )}

      {!loading && (
        <>
          <h2 class="aed-title" style={{ textAlign: "left" }}>
            AED Checks History
          </h2>
          <DataGrid
            className="col"
            dataSource={aedData}
            //  height={100}
            width={"auto"}
            keyExpr="id"
            showColumnLines={true}
            showRowLines={true}
            showBorders={false}
            allowSorting={false}
            rowAlternationEnabled={false}
            // selection={{
            //     mode: 'multiple',
            //     showCheckBoxesMode: 'always',
            //     allowSelectAll: false,
            //     selectedRowKeys: selectedRows
            // }}
            // onSelectionChanged={handleCheckboxSelectionChanged}
          >
            <Column
              dataField="created_date"
              width={180}
              caption={"AED Check Date"}
              cssClass="column-header"
              allowSorting={true}
              cellRender={renderDate}
            />
            <Column
              dataField="is_aed_present"
              cellRender={renderCheck}
              caption={"AED Present"}
              cssClass="column-header"
              dataType="String"
              // allowSorting={true}
            />
            <Column
              dataField={"status_indicator"}
              cellRender={renderCheck}
              caption={"AED Ready"}
              cssClass="column-header"
              dataType="String"
              // allowSorting={true}
            />
            <Column
              dataField="rescue_kit_present"
              cellRender={renderCheck}
              caption={"Rescue Kit Present"}
              cssClass="column-header"
              dataType="String"
              // allowSorting={true}
            />
            <Column
              dataField="sti_expiry_date"
              // cellRender={renderCheck}

              cellRender={(e) => {
                return FormatDate(e.value);
              }}
              caption={"Alarm Battery Exp"}
              cssClass="column-header"
              allowSorting={true}
            />
            <Column
              dataField="support_tickets_toggle"
              cellRender={renderCheck}
              caption={"Support Ticket"}
              cssClass="column-header"
              dataType="String"
              // allowSorting={true}
            />
            <Column
              dataField="created_by"
              // cellRender={renderCheck}
              caption={"Checked By"}
              cssClass="column-header"
              allowSorting={true}
            />
            <Scrolling columnRenderingMode="virtual" />
            <x enabled={false} />
          </DataGrid>
        </>
      )}
    </>
  );
};
export default AEDChecksTbl;

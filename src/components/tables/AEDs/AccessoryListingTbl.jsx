import React, { useEffect, useState } from "react";
import DataGrid, { Column, SearchPanel, Paging } from "devextreme-react/data-grid";
import check from "../../../img/Check.svg";
import cancel from "../../../img/Cancel.svg";
import TableSkeleton from "../../../pages/accounts/skeleton/table/TableSkeleton";
import { FormatDate } from "../../../helper/Common";
import { useNavigate } from "react-router-dom";
import "../../../../src/global.css";
import moment from "moment";
import "./AccessoryListingTbl.css";

export default function AccessoryListingTbl({ standaloneData }) {
  let navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  const [modifiedStandaloneData, setModifiedStandaloneData] = useState([]);

  useEffect(() => {
    let standaloneDataArray = Array.isArray(standaloneData)
      ? standaloneData
      : [];

    let filteredData = standaloneDataArray?.filter(
      (obj) =>
        !(obj.hasOwnProperty("pad_part") && obj.section_name === "charge_pack")
    );

    setModifiedStandaloneData(filteredData);
  }, [standaloneData]);

  const renderDate = (item) => {
    return (
      <>
        <img
          className="image"
          src={
            item.hasOwnProperty("manufactured_date")
              ? item?.manufactured_date
                ? "/BatteryMfgr.svg"
                : item?.battery_expiration
                ? "/Battery.png"
                : "/Installby.svg"
              : item?.pad_expiration && item?.is_pediatric === 1
              ? "/child-Vector.png"
              : "/people-Group.svg"
          }
          style={{
            width: item?.battery_expiration ? 15 : 25,
            height: item?.battery_expiration ? 30 : 30,
            marginRight: "2%",
          }}
        />
        {item.hasOwnProperty("manufactured_date")
          ? item?.manufactured_date
            ? FormatDate(item?.manufactured_date)
            : item?.battery_expiration
            ? FormatDate(item?.battery_expiration)
            : item?.install_date
            ? FormatDate(item?.install_date)
            : "N/A"
          : item?.pad_expiration
          ? FormatDate(item?.pad_expiration)
          : "N/A"}
        <div style={{ margin: "5% 0" }} />
        {item?.section_name === "charge_pack" && item?.pad_expiration_1 ? (
          <img
            className="image"
            src="/people-Group.svg"
            style={{ marginRight: "2%" }}
          />
        ) : null}
        {item.section_name === "charge_pack" && item?.pad_expiration_1
          ? moment(item.pad_expiration_1).format("MM/DD/YYYY")
          : null}

        <div style={{ margin: "5% 0" }} />
        {item?.section_name === "charge_pack" && item?.pad_expiration_2 ? (
          <img
            className="image"
            src="/people-Group.svg"
            style={{ marginRight: "2%" }}
          />
        ) : null}
        {item.section_name === "charge_pack" && item?.pad_expiration_2
          ? moment(item.pad_expiration_2).format("MM/DD/YYYY")
          : null}
      </>
    );
  };

  return (
    <div id="acc-list-page-202" style={{ marginBottom: "3%" }}>
      {showLoading ? (
        <div className="showloading-table">
          <TableSkeleton />
        </div>
      ) : (
        <DataGrid
          id="accessory-listing-table"
          dataSource={modifiedStandaloneData}
          showBorders={true}
          showRowLines={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          searchPanel={{ visible: true, highlightCaseSensitive: true, placeholder: "Search by keywords..." }}
          searchExpr={[
            'battery_part',
            'accessory_type',
            'manufactured_date',
            'battery_lot',
            'battery_udi',
            'dni',
            'account_name',
            'site_name',
            'pad_part',
            'pad_lot',
            'pad_udi',
            'install_date',
            'pad_expiration',
            'battery_expiration',
            'charge_pak_uid',
            'pad_expiration_1',
            'pad_expiration_2'
          ]}
        >
          <Paging defaultPageSize={20} defaultPageIndex={0} />

          <Column
            dataField="battery_part"
            caption="Part #"
            cellRender={({ data }) =>
              data.hasOwnProperty("manufactured_date")
                ? data?.battery_part || "N/A"
                : data?.pad_part || "N/A"
            }
          />
          <Column dataField="accessory_type" caption="Accessory Type" />
          <Column
            dataField="manufactured_date"
            allowSorting={true}
            caption="Date"
            cellRender={({ data }) => <>{renderDate(data)}</>}
          />
          <Column
            dataField="battery_lot"
            caption="Lot"
            allowSorting={true}
            cellRender={({ data }) => (
              <div className="wrap-cell">
                {data.hasOwnProperty("manufactured_date")
                  ? data?.battery_lot || "N/A"
                  : data?.pad_lot || "N/A"}
              </div>
            )}
          />
          <Column
            dataField="battery_udi"
            caption="UDI"
            allowSorting={true}
            cellRender={({ data }) =>
              data.hasOwnProperty("manufactured_date")
                ? data?.section_name === "charge_pack"
                  ? data?.charge_pak_uid || "N/A"
                  : data?.battery_udi || "N/A"
                : data?.pad_udi || "N/A"
            }
          />
          <Column
            caption="DNI"
            cellRender={({ data }) => (
              <img src={data?.dni ? check : cancel} alt="Status" height={12} />
            )}
          />
          <Column dataField="account_name" caption="Account" />
          <Column dataField="site_name" caption="Site" />
        </DataGrid>
      )}
    </div>
  );
}

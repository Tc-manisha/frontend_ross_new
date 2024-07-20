import React from "react";
import { EditIcon } from "../../../../helper/Icons";
import EditMoveAccePlacement from "../../../../components/modals/Accessory/EditMoveAccePlacement";
import { useState } from "react";
import Activitycheck from "../../../../img/Activity Symbols.png";
import moment from "moment";
import check from "../../../../img/Check.svg"
import cancel from "../../../../img/Cancel.svg"

function MoveAccessoryTr({
  item,
  index,
  selectedIds,
  onLoad,
  handleQtyChange,
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <tr
        key={index}
        className="border"
        style={{ background: index % 2 === 0 ? "white" : "#E4E4E4" }}
      >
        <td style={{ background: "transparent" }}>
          <input
            type="number"
            placeholder="Enter Quantity"
            value={
              item.hasOwnProperty("moveQty")
                ? item?.moveQty
                : item?.moveQty || 0
            }
            inputmode="numeric"
            min={0}
            onWheel={(event) => event.preventDefault()}
            onScroll={(event) => event.preventDefault()}
            // onMouseDown={(event) => event.preventDefault()}
            // onMouseUp={(event) => event.preventDefault()}
            onKeyPress={(e) => {
              const disallowedChar = [".", "-", "/", "*", "+", "@", "#", "$", "%", ")", "(", "!", "^", "&", "~", "`", "="];
              if (disallowedChar.includes(e.key)) {
                e.preventDefault();
              }
            }}

            onChange={(e) => handleQtyChange(e, item, index)}
            style={{
              height: 30,
              width: "100%",
              border: "none",
              background: "transparent",
            }}
          />
        </td>
        <td style={{ background: "transparent" }}>
          {/* {item.hasOwnProperty("manufactured_date")
            ? "Battery"
            : item?.section_name.includes("pediatric")
              ? "Pediatric"
              : item?.section_name.includes("pak")
                ? "Pad Pak"
                : "Pad"} */}
          {item?.accessory_type}
        </td>

        <td style={{ background: "transparent" }}>
          {item.hasOwnProperty("manufactured_date")
            ? item?.battery_part
              ? item?.battery_part
              : "N/A"
            : item?.pad_part
              ? item?.pad_part
              : "N/A"}
        </td>

        <td style={{ background: "transparent" }}>
          <img
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
              ? moment(item?.manufactured_date).format("MM/DD/YYYY")
              : item?.battery_expiration
                ? moment(item?.battery_expiration).format("MM/DD/YYYY")
                : item?.install_date
                  ? moment(item?.install_date).format("MM/DD/YYYY")
                  : "N/A"
            : item?.pad_expiration
              ? moment(item?.pad_expiration).format("MM/DD/YYYY")
              : "N/A"}

          <div style={{ margin: '5% 0' }} />

          {
            item?.section_name === 'charge_pack' && item?.pad_expiration_1 ?
              <img src="/people-Group.svg"
                style={{ marginRight: "2%" }}
              />
              :
              <></>
          }
          {item.section_name === 'charge_pack' && item?.pad_expiration_1 ?
            moment(item.pad_expiration_1).format("MM/DD/YYYY") : null
          }

          <div style={{ margin: '5% 0' }} />

          {
            item?.section_name === 'charge_pack' && item?.pad_expiration_2 ?
              <img src="/people-Group.svg"
                style={{ marginRight: "2%" }}
              />
              :
              <></>
          }
          {item.section_name === 'charge_pack' && item?.pad_expiration_2 ?
            moment(item.pad_expiration_2).format("MM/DD/YYYY") : null
          }

        </td>

        <td style={{ background: "transparent" }}>
          {item.hasOwnProperty("manufactured_date")
            ? item?.battery_lot
              ? item?.battery_lot
              : "N/A"
            : item?.pad_lot
              ? item?.pad_lot
              : "N/A"}
        </td>
        <td style={{ background: "transparent" }}>
          {
            item?.section_name === 'charge_pack' ?
              item?.charge_pak_uid
              :
              <>
                {item.hasOwnProperty("manufactured_date")
                  ? item?.battery_udi
                    ? item?.battery_udi
                    : "N/A"
                  : item?.pad_udi
                    ? item?.pad_udi
                    : "N/A"}
              </>
          }
        </td>

        <td style={{ background: "transparent" }}>{item?.quantity}</td>

        <td style={{ background: "transparent" }}>{<img src={item?.dni ? check : cancel} alt="Status" height={12} />}</td>

      </tr>

      <EditMoveAccePlacement
        show={showModal}
        id={item.sgid}
        onHide={() => {
          setShowModal(false);
          onLoad();
        }}
        aedDetails={item.placement}
      />
    </>
  );
}

export default MoveAccessoryTr;

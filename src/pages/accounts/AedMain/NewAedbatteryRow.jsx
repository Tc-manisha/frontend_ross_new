import { useState, useEffect, useCallback } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import Plus from "../../../img/Plus.svg";
import Minus from "../../../img/Minus.svg";
import Activitycheck from "../../../img/Activity Symbols.png";
import new_modi_icon from "../../../img/new-modi-icon.png";
import KingTaz from "../../../img/KingTaz.png";
import InventoryIcon from "../../../img/InventoryIcon.png";
import { MdOutlineArrowDropDown } from "react-icons/md";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import CommonDatePicker from "../../../components/common/date-picker/CommonDatePicker";
import { FormatDate } from "../../../helper/Common";
import { NewModiFicationGroupIcon } from "../../../helper/Icons";
import { toast } from "react-toastify";
import AEDInventoryModal from "./AEDInventoryModal";

const NewAedBatteryRow = ({
  setDeleteNewBattery,
  handleRemoveMainBatteryRow,
  handleBatterySpareCrown,
  handleCalendarChange,
  inspection_by,
  handleChange,
  // formData,
  is_readonly,
  batteryInfo,
  selectedOption,
  Bindex,
  // print_battery_part,
  index,
  // showAdditionalBatteryRows,
  batteryList,
  handleDNDButton,
  handleResetBtn,
  onInputChange,
  default_battery_info,
  contact_id,
  AedFormData,
  setNewFormData,
  batteryvisibleColumns,
  isInventory
}) => {
  const [selectedBatteryValue, setSelectedBatteryValue] = useState("");
  const [inventoryModal, setInventoryModal] = useState(false);
  const secName = AedFormData[index]?.battery_info?.[0].section_name;

  const print_battery_part = (bid) => {
    let findName = batteryList.find(
      (item) => parseInt(item?.battery_type_id) === parseInt(bid)
    );
    return findName?.battery_part_number || bid;
  };

  const handleChange2 = useCallback(
    (event, index, Pindex) => {
      if (event.target.name === "type" && event.target.value === "main") {
        let Fd = [...AedFormData];
        const biArr = Fd[index].battery_info;
        const FindIndex = biArr.findIndex((it) => it.is_spare === 0);
        if (FindIndex != -1) {
          toast.error(
            "Please remove main first."
          );
          return false;
        } else {
          onInputChange(
            event.target.value,
            event.target.name,
            index,
            Pindex,
            "battery_info"
          );
        }
      } else {
        onInputChange(
          event.target.value,
          event.target.name,
          index,
          Pindex,
          "battery_info"
        );
      }
    },
    [onInputChange]
  );

  const handleDateChange = useCallback(
    (name, val, Pindex) => {
      console.log({ val });
      onInputChange(val, name, index, Pindex, "battery_info");
    },
    [onInputChange]
  );

  const calendarIcon = () => {
    return <img src="/calendar.svg" alt="calendar" />;
  };

  const handleBatterySelectChange = (event) => {
    setSelectedBatteryValue(event.target.value);
  };

  const handleDND = () => {
    setInventoryModal(true);
  };

  const IsColumnVisible = (key) => {
    let is_found = 0;

    for (let index = 0; index < batteryvisibleColumns.length; index++) {
      const el = batteryvisibleColumns[index];
      if (el.key === key) {
        is_found = 1;
        break;
      }
    }
    return is_found;
  };

  const handleDefaultBatteryExpiration = (AedBatteryInfo) => {

    let current_date = new Date();
    let expiration_date = new Date(AedBatteryInfo?.battery_expiration)
    let days_difference = expiration_date ? Math.floor((expiration_date - current_date) / (1000 * 60 * 60 * 24)) : null;

    return (
      <>
        {
          days_difference <= 30 ? (
            <font style={{ color: 'red' }}>{FormatDate(AedBatteryInfo?.battery_expiration)}</font>
          ) : (
            <font>{FormatDate(AedBatteryInfo?.battery_expiration)}</font>
          )
        }
      </>
    )
  }


  return (
    <>
      <tr key={Bindex}>
        <td>
          {/* {batteryInfo?.section_name} */}
          {is_readonly === 0 ? (
            batteryInfo.is_spare === 0 ? (
              "main"
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                Spare
              </div>
            )
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
              }}
            >
              <select
                // value={selectedBatteryValue}
                className={"form-control"}
                name="type"
                // onChange={handleBatterySelectChange}
                // style={{ width: "150px" }}
                onChange={(e) => handleChange2(e, index, Bindex)}
                value={batteryInfo?.type || 0}
              >
                <option value="0" selected={parseInt(batteryInfo?.type) === 0}>
                  --Select One--
                </option>
                <option value="main">Main</option>
                <option value="spare">Spare</option>
              </select>
              {/* <MdOutlineArrowDropDown style={{ position: 'absolute',width:"50px",height:"35px", right: '-4px'  }} /> */}
            </div>
          )}
        </td>

        <td>
          {is_readonly === 0 ? (
            print_battery_part(batteryInfo.battery_type_id) || "N/A"
          ) : (
            <div className="col form-group" style={{ maxWidth: "300px" }}>
              <select
                name="battery_type_id"
                className={"form-control"}
                value={batteryInfo?.battery_type_id}
                onChange={(e) => handleChange2(e, index, Bindex)}
              >
                <option value="" key={0} selected>
                  --Select One--
                </option>
                {batteryList?.map((item, index) => (
                  <option value={item?.battery_type_id} key={index + 1}>
                    {item?.battery_part_number}
                  </option>
                ))}
              </select>
            </div>
          )}
        </td>

        {IsColumnVisible("battery_expiration") ? (
          <td>
            {is_readonly === 0 ? (
              <>
                {
                  FormatDate(batteryInfo?.battery_expiration) ?
                    <>{handleDefaultBatteryExpiration(batteryInfo)}</>
                    :
                    'N/A'
                }
              </>
            ) : (
              <CommonDatePicker
                calName={"battery_expiration"}
                CalVal={batteryInfo?.battery_expiration}
                HandleChange={(name, val) =>
                  handleDateChange(name, val, Bindex)
                }
                disabled={false}
              />
            )}
          </td>
        ) : (
          ""
        )}

        {IsColumnVisible("manufactured_date") ? (
          <td>
            {is_readonly === 0 ? (
              FormatDate(batteryInfo?.manufactured_date) || "N/A"
            ) : (
              <CommonDatePicker
                calName={"manufactured_date"}
                CalVal={batteryInfo?.manufactured_date}
                HandleChange={(name, val) =>
                  handleDateChange(name, val, Bindex)
                }
                disabled={false}
              />
            )}
          </td>
        ) : (
          ""
        )}

        {IsColumnVisible("battery_lot") ? (
          <td>
            {is_readonly === 0 ? (
              batteryInfo.battery_lot || "N/A"
            ) : (
              <Form.Group className={"col"}>
                {/* <Form.Label>Contract #</Form.Label> */}
                <Form.Control
                  type="text"
                  name="battery_lot"
                  value={batteryInfo?.battery_lot}
                  // onChange={(e)=>handleChange(e,index, Bindex, 'battery_lot', true)}
                  onChange={(e) => handleChange2(e, index, Bindex)}
                />
              </Form.Group>
            )}
          </td>
        ) : (
          ""
        )}
        {IsColumnVisible("battery_udi") ? (
          <td>
            {is_readonly === 0 ? (
              batteryInfo.battery_udi || "N/A"
            ) : (
              <Form.Group className={"col"}>
                {/* <Form.Label>Contract #</Form.Label> */}
                <Form.Control
                  type="text"
                  name="battery_udi"
                  value={batteryInfo?.battery_udi}
                  // onChange={(e)=>handleChange(e,index,Bindex, 'battery_udi', true)}
                  onChange={(e) => handleChange2(e, index, Bindex)}
                />
              </Form.Group>
            )}
          </td>
        ) : (
          ""
        )}

        {IsColumnVisible("install_9v_date") ? (
          <td>
            {batteryInfo?.is_new === 1 && batteryInfo?.is_spare !== 0 ?
              ("N/A") : is_readonly === 0 ? (
                FormatDate(batteryInfo?.install_9v_date) || "N/A"
              ) : (
                <CommonDatePicker
                  calName={"install_9v_date"}
                  CalVal={batteryInfo?.install_9v_date || new Date()}
                  HandleChange={(name, val) =>
                    handleDateChange(name, val, Bindex)
                  }
                  disabled={false}
                />
              )}
          </td>
        ) : (
          ""
        )}
        {IsColumnVisible("install_before_date") ? (
          <td>
            {is_readonly === 0 ? (
              FormatDate(batteryInfo?.install_before_date) || "N/A"
            ) : (
              <CommonDatePicker
                calName={"install_before_date"}
                CalVal={batteryInfo?.install_before_date}
                HandleChange={(name, val) =>
                  handleDateChange(name, val, Bindex)
                }
                disabled={false}
              />
            )}
          </td>
        ) : (
          ""
        )}

        {IsColumnVisible("install_date") ? (
          <td>
            {batteryInfo?.is_new === 1 && batteryInfo?.is_spare !== 0 ? (
              "N/A"
            ) : is_readonly === 0 ? (
              FormatDate(batteryInfo?.install_date) || "N/A"
            ) : (
              <CommonDatePicker
                calName={"install_date"}
                CalVal={batteryInfo?.install_date}
                HandleChange={(name, val) =>
                  handleDateChange(name, val, Bindex)
                }
                disabled={false}
              />
            )}
          </td>
        ) : (
          ""
        )}

        {/* <td>
        <div style={{ display: "flex", flexDirection: "row", columnGap: "5%", alignItems: "center" }}>
          {batteryInfo?.is_new ?
            <span onClick={handleDND} style={{ cursor: 'pointer' }}>
              <NewModiFicationGroupIcon />
            </span> :
            <>
              {
                <img
                  src={Activitycheck}
                  alt='Plus'
                  height={30}
                  width={30}
                  style={{ cursor: AedFormData[index].dni_array_list.findIndex((it) => it.bid === batteryInfo.bid) !== -1 ? 'not-allowed' : 'pointer' }}
                  onClick={() => handleDNDButton(index, Bindex, batteryInfo, 'battery')}
                />
              }
            </>
          }
          <img src={Minus} alt='Minus' height={20} width={30} style={{ cursor: "pointer" }} onClick={() => { handleRemoveMainBatteryRow(index, Bindex, false, false, batteryInfo?.aed_id) }} />
        </div>
      </td> */}

        <td>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              columnGap: "5%",
              alignItems: "center",
            }}
          >
            {batteryInfo?.is_spare === 1 && is_readonly === 0 && (
              <img
                src={KingTaz}
                alt="KingTaz"
                height={30}
                style={{ cursor: "pointer" }}
                onClick={() => handleBatterySpareCrown(index, Bindex)}
              />
            )}
            {batteryInfo?.is_new && isInventory ? (
              <span onClick={handleDND} style={{ cursor: "pointer" }}>
                <NewModiFicationGroupIcon />
              </span>
            ) : (
              isInventory ? (
                <img
                  src={Activitycheck}
                  alt="Activitycheck"
                  height={30}
                  width={30}
                  style={{
                    cursor:
                      AedFormData[index].dni_array_list.findIndex(
                        (it) => it.bid === batteryInfo.bid
                      ) !== -1
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onClick={() => {
                    handleDNDButton(index, Bindex, batteryInfo, "battery");
                  }}
                />
              ) : ""
            )}
            <img
              src={Minus}
              alt="Minus"
              height={20}
              width={30}
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleRemoveMainBatteryRow(
                  index,
                  Bindex,
                  false,
                  false,
                  batteryInfo?.aed_id
                );
              }}
            />
          </div>
        </td>
      </tr>
      {inventoryModal ? (
        <>
          <AEDInventoryModal
            setNewFormData={setNewFormData}
            Bindex={Bindex}
            index={index}
            AedFormData={AedFormData}
            inventoryModal={inventoryModal}
            setInventoryModal={setInventoryModal}
            contact_id={contact_id}
            secName={secName}
            inspection_by={inspection_by}
            api="account/get-battery-inventory"
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default NewAedBatteryRow;

import { useState, useEffect, useCallback } from "react";
import Minus from "../../../img/Minus.svg";
import Activitycheck from "../../../img/Activity Symbols.png";
import KingTaz from "../../../img/KingTaz.png";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import { CallGETAPINEW } from "../../../helper/API";
import CommonDatePicker from "../../../components/common/date-picker/CommonDatePicker";
import { FormatDate } from "../../../helper/Common";
import { toast } from "react-toastify";
import AEDInventoryModal from "./AEDInventoryModal";
import { NewModiFicationGroupIcon } from "../../../helper/Icons";

const NewAedPadRow = ({
  index,
  Pindex,
  padInfo,
  is_readonly,
  handleMoveSpareToMainPadRow,
  handlePadSpareCrown,
  setNewFormData,
  handleCalendarChange,
  handleChange,
  handleRemovePadsRow,
  onInputChangePads,
  aedPadTypeList,
  AedFormData,
  contact_id,
  handleResetBtn,
  inspection_by,
  AedItem,
  handleDNDButton,
  isInventory
}) => {
  const [inventoryModal, setInventoryModal] = useState(false);
  let isPediatricTable = 0

  // Assuming aedPadTypeList is your array of objects
  const pediatricAedPadTypeList = aedPadTypeList.filter(obj => obj.pediatric === 1);
  const mainAedPadTypeList = aedPadTypeList.filter(obj => obj.pediatric === 0);

  console.log('mainAedPadTypeList', mainAedPadTypeList);
  console.log('pediatricAedPadTypeList:', pediatricAedPadTypeList);


  const print_pad_part = (pid) => {
    let findName = aedPadTypeList.find(
      (item) => parseInt(item?.pad_type_id) === parseInt(pid)
    );
    return findName?.pad_part_number || pid;
  };

  const handleChange2 = useCallback(
    (event, index, Pindex) => {
      if (
        event.target.name === "type" &&
        (event.target.value === "main" || event.target.value === "pediatric")
      ) {
        let Fd = [...AedFormData];
        const allPadsArr = Fd[index].all_pads;
        let FindIndex = -1;
        const type = event.target.value;

        if (type === "main" || type === "pediatric") {
          if (type == "main") {
            FindIndex = allPadsArr.findIndex(
              (item) => item.is_spare === 0 && item.is_pediatric === 0
            );
          } else {
            FindIndex = allPadsArr.findIndex(
              (item) => item.is_spare === 0 && item.is_pediatric === 1
            );
          }
        }

        // allPadsArr.findIndex((it) => it.is_spare === 0);
        if (FindIndex != -1) {
          if (event.target.value === "main") {
            toast.error(
              "Please remove main first."
            );
          } else {
            toast.error(
              "Please remove Pediatric first."
            );
          }
          return false;
        } else {
          onInputChangePads(
            event.target.value,
            event.target.name,
            index,
            Pindex,
            "all_pads"
          );
        }
      } else {
        onInputChangePads(
          event.target.value,
          event.target.name,
          index,
          Pindex,
          "all_pads"
        );
      }
    },
    [onInputChangePads]
  );

  const handleDateChange = useCallback(
    (name, val, Pindex) => {
      onInputChangePads(val, name, index, Pindex, "all_pads");
    },
    [onInputChangePads]
  );

  const handleDND = () => {
    setInventoryModal(true);
  };

  const handlePadSpareCrownFunc = useCallback(
    (index, Pindex, type) => {
      let Fd = [...AedFormData];
      const padSecName = Fd[index].all_pads[Pindex].section_name;
      handlePadSpareCrown(index, Pindex, type, padSecName);
    },
    [handlePadSpareCrown]
  );

  // const handlePadSelectChange = (event) => {
  //   setSelectedPadValue(event.target.value);
  // };

  const renderPadInfo = () => {
    const isSpare = padInfo.is_spare === 1;
    const isPediatric = padInfo.is_pediatric === 1;

    if (isSpare && !isPediatric) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Spare
        </div>
      );
    } else if (!isSpare && isPediatric) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Pediatric
        </div>
      );
    } else if (isSpare && isPediatric) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Spare Pediatric
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Main
        </div>
      );
    }
  };

  /**(padInfo.is_spare === 0 && padInfo.is_pediatric === 0 ? "main"
: (padInfo.is_spare === 1 && padInfo.is_pediatric === 0) ? 
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    Spare
    <img src={KingTaz} style={{ marginTop: 10,cursor:"pointer" }} onClick={() => handleMoveSpareToMainPadRow(index,Pindex)} />
  </div>
: (padInfo.is_spare === 0 && padInfo.is_pediatric === 1) ? "Pediatric"
: (<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
Spare Pediatric
</div>)
)  */

  const handleDefaultPadExpiration = (AedPadInfo) => {

    let current_date = new Date();
    let expiration_date = new Date(AedPadInfo?.pad_expiration)
    let days_difference = expiration_date ? Math.floor((expiration_date - current_date) / (1000 * 60 * 60 * 24)) : null;

    return (
      <>
        {
          days_difference <= 30 ? (
            <font style={{ color: 'red' }}>{FormatDate(AedPadInfo?.pad_expiration)}</font>
          ) : (
            <font>{FormatDate(AedPadInfo?.pad_expiration)}</font>
          )
        }
      </>
    )
  }

  const handleNewPadDD = (AedItem) => {
    let section_permissions = JSON.parse(AedItem?.section_permissions)
    // console.log('section_permissions', section_permissions);
    if (section_permissions.has_pad === 0 && section_permissions.has_ped_pad === 1 && section_permissions.has_pedpak === 0 && section_permissions.has_padpak === 0) {
      isPediatricTable = 1
      return (
        <>
          <option value="pediatric">Main Pediatric</option>
          <option value="spare_pediatric">Spare Pediatric</option>
        </>
      )
    }
    else {
      return (
        <>
          <option value="main">Main</option>
          <option value="spare">Spare</option>
        </>
      )
    }
  }

  console.log('AedItem', AedItem);

  return (
    <>
      <tr key={Pindex}>
        <td>
          {is_readonly === 0 ? (
            renderPadInfo()
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
                className={"form-control"}
                name="type"
                onChange={(e) => handleChange2(e, index, Pindex)}
                value={padInfo?.type || 0}
              >
                <option value="0" selected={parseInt(padInfo?.type) === 0}>
                  --Select One--
                </option>
                {
                  handleNewPadDD(AedItem)
                }
              </select>
            </div>
          )}
        </td>

        <td>
          {is_readonly === 0 ? (
            print_pad_part(padInfo.pad_type_id) || "N/A"
          ) : (
            <div className="col form-group" style={{ maxWidth: "300px" }}>
              <select
                className={"form-control"}
                value={padInfo?.pad_type_id}
                name={"pad_type_id"}
                onChange={(e) => handleChange2(e, index, Pindex)}
              >
                <option value="" key={0} selected>
                  --Select One--
                </option>
                {
                  isPediatricTable === 1 ?
                    <>
                      {
                        pediatricAedPadTypeList.map((item) => {
                          return (
                            <option value={item.pad_type_id} key={index + 1}>
                              {item.pad_part_number}
                            </option>
                          )
                        })
                      }
                    </>
                    :
                    <>
                      {
                        mainAedPadTypeList.map((item) => {
                          return (
                            <option value={item.pad_type_id} key={index + 1}>
                              {item.pad_part_number}
                            </option>
                          )
                        })
                      }
                    </>
                }
              </select>
            </div>
          )}
        </td>

        <td>
          {is_readonly === 0 ? (
            <>
              {
                FormatDate(padInfo?.pad_expiration) ?
                  <>{handleDefaultPadExpiration(padInfo)}</>
                  :
                  'N/A'
              }
            </>
          ) : (
            <div className={"d-flex align-items-center calendar-input-btn"}>
              <CommonDatePicker
                calName={"pad_expiration"}
                CalVal={padInfo?.pad_expiration}
                HandleChange={(name, val) =>
                  handleDateChange(name, val, Pindex)
                }
                disabled={false}
              />
            </div>
          )}
        </td>

        <td>
          {is_readonly === 0 ? (
            padInfo.pad_lot || "N/A"
          ) : (
            <Form.Group className={"col"}>
              <Form.Control
                type="text"
                name="pad_lot"
                value={padInfo?.pad_lot}
                onChange={(e) => handleChange2(e, index, Pindex)}
              />
            </Form.Group>
          )}
        </td>

        <td>
          {is_readonly === 0 ? (
            padInfo.pad_udi || "N/A"
          ) : (
            <Form.Group className={"col"}>
              <Form.Control
                type="text"
                name="pad_udi"
                value={padInfo?.pad_udi}
                onChange={(e) => handleChange2(e, index, Pindex)}
              />
            </Form.Group>
          )}
        </td>

        {/* <td>
        <div style={{ display: "flex", flexDirection: "row", columnGap: "5%", alignItems: "center" }}>

          {padInfo?.is_new ?
            <span onClick={handleDND} style={{ cursor: 'pointer' }}>
              <NewModiFicationGroupIcon />
            </span>
            :
            <>
              {
                <img
                  src={Activitycheck}
                  alt='Plus'
                  height={30}
                  width={30}
                  style={{ cursor: AedFormData[index].dni_array_list.findIndex((it) => it.pid === padInfo.pid) !== -1 ? 'not-allowed' : 'pointer' }}
                  onClick={() => handleDNDButton(index, Pindex, padInfo, 'pads')}
                />
              }
            </>
          }

          <img src={Minus} alt='Minus' height={20} width={30} style={{ cursor: "pointer" }}
            onClick={() => handleRemovePadsRow(index, Pindex, false, false, padInfo?.aed_id)}
          />

          {padInfo?.is_spare === 1  && (
            <img
              src={KingTaz}
              alt='KingTaz'
              height={30}
              style={{ cursor: "pointer" }}
              onClick={() => handlePadSpareCrownFunc(index, Pindex, 'main')}
            />
          )}

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
            {padInfo?.is_pediatric !== 1 &&
              padInfo?.is_spare === 1 &&
              padInfo?.is_new !== 1 && (
                <img
                  src={KingTaz}
                  alt="KingTaz"
                  height={30}
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePadSpareCrownFunc(index, Pindex, "main")}
                />
              )}
            {padInfo?.is_pediatric === 1 && padInfo?.is_spare === 1 && is_readonly === 0 && (
              <img
                src={KingTaz}
                alt="KingTaz"
                height={30}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handlePadSpareCrownFunc(index, Pindex, "pediatric")
                }
              />
            )}
            {padInfo?.is_new && isInventory ? (
              <span onClick={handleDND} style={{ cursor: "pointer" }}>
                <NewModiFicationGroupIcon />
              </span>
            ) : (
              isInventory!=0 ? (
                <img
                  src={Activitycheck}
                  alt="Activitycheck"
                  height={30}
                  width={30}
                  style={{
                    cursor:
                      AedFormData[index].dni_array_list.findIndex(
                        (it) => it.pid === padInfo.pid
                      ) !== -1
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onClick={() => {
                    handleDNDButton(index, Pindex, padInfo, "pads");
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
              onClick={() =>
                handleRemovePadsRow(
                  index,
                  Pindex,
                  false,
                  false,
                  padInfo?.aed_id
                )
              }
            />
          </div>
        </td>
      </tr>
      {inventoryModal ? (
          <AEDInventoryModal
            setNewFormData={setNewFormData}
            Pindex={Pindex}
            index={index}
            AedFormData={AedFormData}
            inventoryModal={inventoryModal}
            setInventoryModal={setInventoryModal}
            contact_id={contact_id}
            inspection_by={inspection_by}
            api="account/get-pad-inventory"
          />
      ) : ("")
      }
    </>
  );
};

export default NewAedPadRow;

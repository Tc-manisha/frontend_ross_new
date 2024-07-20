import { useState, useEffect, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import Plus from "../../../img/Plus.svg"
import Minus from "../../../img/Minus.svg"
import Activitycheck from "../../../img/Activity Symbols.png"
import new_modi_icon from "../../../img/new-modi-icon.png"
import KingTaz from "../../../img/KingTaz.png"
import InventoryIcon from "../../../img/InventoryIcon.png"
import { MdOutlineArrowDropDown } from "react-icons/md";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup, Dropdown,
} from "react-bootstrap";
import CommonDatePicker from '../../../components/common/date-picker/CommonDatePicker';
import { FormatDate } from '../../../helper/Common';
import { NewModiFicationGroupIcon } from '../../../helper/Icons';
import { toast } from 'react-toastify';
import AEDInventoryModal from './AEDInventoryModal';
import Battery from "../../../img/Battery.svg";
import Adult from "../../../img/Adult.svg";
import { section_name_list } from '../../../helper/BasicFn';
import ChargePackInventoryModal from './ChargePackInventoryModal';
import { CallGETAPI } from '../../../helper/API';

const AedModificationChargePackRow = (
  { setDeleteNewBattery,
    handleRemoveMainChargePakRow,
    handleChargeSpareCrown,
    handleCalendarChange,
    inspection_by,
    handleChange,
    is_readonly,
    //   batteryInfo,
    list_item,
    charge_pack_obj,
    selectedOption,
    Bindex,
    index,
    batteryList,
    handleDNDButton,
    handleResetBtn,
    onInputChange,
    default_battery_info,
    contact_id,
    AedFormData,
    setNewFormData,
    batteryvisibleColumns,
    aedPadTypeList,
    isInventory
  }) => {
  // console.log({charge_pack_obj});
  const [padcondi, setPadCondi] = useState(0);
  const batteryInfo = charge_pack_obj?.battery_info || {};
  const pad_type_1_data = charge_pack_obj?.pad_1_info || {};
  const pad_type_2_data = charge_pack_obj?.pad_2_info || {};
  const [selectedBatteryTypeId, setSelectedBatteryTypeId] = useState('')

  const [inventoryModal, setInventoryModal] = useState(false);
  const secName = section_name_list['charge_pack'];

  const print_battery_part = (bid) => {
    let findName = batteryList.find(
      (item) => parseInt(item?.battery_type_id) === parseInt(bid)
    );
    return findName?.battery_part_number || bid;
  };

  const print_pad_part = (pid) => {
    let findName = aedPadTypeList.find(
      (item) => parseInt(item?.pad_type_id) === parseInt(pid)
    );
    return findName?.pad_part_number || pid;
  };

  const handleChange2 = useCallback((event, index, Pindex, sec_type) => {
    if (event.target.name === 'type' && event.target.value === 'main') {
      const Fd = [...AedFormData];
      const biArr = Fd[index].charge_pack_list;
      const FindIndex = biArr.findIndex((it) => it?.battery_info?.is_spare === 0);

      if (FindIndex !== -1 && FindIndex !== Pindex) {
        toast.error('Please remove main first.');
        return false;
      } else {
        onInputChange(event.target.value, event.target.name, index, Pindex, 'battery_info', sec_type);
      }
    } else {
      onInputChange(event.target.value, event.target.name, index, Pindex, 'battery_info', sec_type);
    }
  }, [onInputChange]);


  const handleDateChange = useCallback((name, val, Pindex, sec_type) => {
    onInputChange(val, name, index, Pindex, 'battery_info', sec_type);
  }, [onInputChange]);


  const handleDND = () => {
    setInventoryModal(true)
  }

  const getAedBatteryTypeByModel = async (modelId) => {
    let response = await CallGETAPI(`account/ade-pad-type-by-model/${modelId}`)
    if (response?.status === true) {
      console.log('AED Battery type: ', response?.data)
    }
  }

  const handleChargePack = (e, index, Bindex) => {

    let aedModelId = AedFormData[index].aed_model_id
    getAedBatteryTypeByModel(aedModelId)

    let Fd = [...AedFormData];

    let chargePackList = Fd[index].charge_pack_list[Bindex];
    let chargePackObj = { ...chargePackList }
    let chargePackBatteryInfo = chargePackObj.battery_info
    chargePackBatteryInfo.battery_type_id = e.target.value

    let findPadKey = batteryList.find((item) => item?.battery_type_id === parseInt(e.target.value))
    if (findPadKey) {
      setPadCondi(findPadKey?.pad_qty);
    }
  }

  useEffect(() => {
    let findPadKey = batteryList.find((item) => item?.battery_type_id === parseInt(selectedBatteryTypeId))
    if (findPadKey) {
      setPadCondi(findPadKey?.pad_qty);
    }
  }, [selectedBatteryTypeId])

  const renderDatePicker = (calName, CalVal, Bindex, type) => {
    return (
      <CommonDatePicker
        calName={calName}
        CalVal={CalVal}
        HandleChange={(name, val) => handleDateChange(name, val, Bindex, type)}
        disabled={false}
      />
    );
  };

  // Extracted function to render charge pack select input
  const renderSelectInput = (name, itemList, value, index, Bindex, type) => {
    return (
      <div className='col form-group' style={{ maxWidth: "300px" }}>
        <select
          name={name}
          className={"form-control"}
          value={value}
          onChange={(e) => handleChange2(e, index, Bindex, type)}
        >
          <option value="" key={0} selected>--Select One--</option>
          {itemList.map((item, idx) => (
            <option value={item?.pad_type_id} key={idx + 1}>{print_pad_part(item?.pad_type_id || "N/A")}</option>
          ))}
        </select>
      </div>
    );
  };

  // Function to render form charge pack battery lot input
  const renderFormInput = (name, value, index, Bindex, type) => {
    return (
      <Form.Group className="col">
        <Form.Control
          type="text"
          name={name}
          placeholder="Enter Battery Lot No"
          value={value}
          onChange={(e) => handleChange2(e, index, Bindex, type)}
        />
      </Form.Group>
    );
  };

  console.log('AedFormData: ', AedFormData)

  const handleDefaultChargePakExpiration = (batteryInfo, pad_type_1_data, pad_type_2_data) => {
    let current_date = new Date();
    let battery_expiration_date = new Date(batteryInfo?.battery_expiration)
    let pad_1_expiration_date = new Date(pad_type_1_data?.pad_expiration)
    let pad_2_expiration_date = new Date(pad_type_2_data?.pad_expiration)

    let battery_days_difference = battery_expiration_date ? Math.floor((battery_expiration_date - current_date) / (1000 * 60 * 60 * 24)) : null;
    let pad_1_days_difference = pad_1_expiration_date ? Math.floor((pad_1_expiration_date - current_date) / (1000 * 60 * 60 * 24)) : null;
    let pad_2_days_difference = pad_2_expiration_date ? Math.floor((pad_2_expiration_date - current_date) / (1000 * 60 * 60 * 24)) : null;

    return (
      <>
        {
          battery_days_difference <= 30 ? (
            <><font style={{ color: 'red' }}>{FormatDate(batteryInfo?.battery_expiration)}</font><br /></>
          ) : (
            <><font>{FormatDate(batteryInfo?.battery_expiration)}</font><br /></>
          )
        }
        {
          pad_1_days_difference <= 30 ? (
            <><font style={{ color: 'red' }}>{FormatDate(pad_type_1_data?.pad_expiration)}</font><br /></>
          ) : (
            <><font>{FormatDate(pad_type_1_data?.pad_expiration)}</font><br /></>
          )
        }
        {
          pad_2_days_difference <= 30 ? (
            <><font style={{ color: 'red' }}>{FormatDate(pad_type_2_data?.pad_expiration)}</font><br /></>
          ) : (
            <><font>{FormatDate(pad_type_2_data?.pad_expiration)}</font><br /></>
          )
        }
      </>
    )
  }

  return (<>
    <tr key={Bindex}>
      <td style={{ verticalAlign: "top" }}>
        {is_readonly === 0 ?
          (batteryInfo.is_spare === 0 ? "main" :
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              Spare
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", position: 'relative' }}>
              <select
                className={"form-control"}
                name="type"
                onChange={(e) => handleChange2(e, index, Bindex, 0)}
                value={batteryInfo?.type || 0}
              >
                <option value="0"
                  selected={parseInt(batteryInfo?.type) === 0}
                >--Select One--</option>
                <option value="main">Main</option>
                <option value="spare">Spare</option>
              </select>
            </div>
          )
        }
      </td>

      <td style={{ verticalAlign: "top" }}>
        {is_readonly === 0
          ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span><img src={Battery} height={27} style={{ marginBottom: "4px" }} /></span>
                <span>{print_battery_part(batteryInfo.battery_type_id || "N/A")}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span><img src={Adult} height={27} style={{ marginBottom: "4px" }} /></span>
                <span>{print_pad_part(pad_type_1_data?.pad_type_id || "N/A")}</span>
              </div>

              {pad_type_2_data?.pad_type_id &&
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span><img src={Adult} height={27} style={{ marginBottom: "4px" }} /></span>
                  <span>{print_pad_part(pad_type_2_data?.pad_type_id || "N/A")}</span>
                </div>}
            </>
          )
          : (
            <>

              <div className='col form-group' style={{ maxWidth: "300px" }}>
                <select
                  name="battery_type_id"
                  className={"form-control"}
                  value={batteryInfo?.battery_type_id}
                  onChange={(e) => handleChargePack(e, index, Bindex, 0)}
                >
                  <option value="" key={0} selected >--Select One--</option>
                  {batteryList?.map((item, index) => (
                    <option value={item?.battery_type_id} key={index + 1} >{item?.battery_part_number}</option>
                  ))}
                </select>
              </div>
              <span className='p-2' ></span>

              {
                parseInt(padcondi) === 0 ? (
                  <></>
                ) : parseInt(padcondi) === 1 ? (
                  renderSelectInput("pad_type_id", AedFormData[index].aedPadTypeList.filter((it) => it.pediatric === 0), pad_type_1_data?.pad_type_id, index, Bindex, 1, AedFormData[index].chargePackList)
                ) : (
                  <>
                    <span className='p-2'></span>
                    {renderSelectInput("pad_type_id", AedFormData[index].aedPadTypeList.filter((it) => it.pediatric === 0), pad_type_1_data?.pad_type_id, index, Bindex, 1)}
                    <span className='p-2'></span>
                    {renderSelectInput("pad_type_id", AedFormData[index].aedPadTypeList.filter((it) => it.pediatric === 0), pad_type_2_data?.pad_type_id, index, Bindex, 2)}
                  </>
                )
              }
              <span className='p-2' ></span>
            </>

          )}
      </td>

      <td style={{ verticalAlign: "top" }}>
        {is_readonly === 0
          ? (
            // <>
            //   <div>{FormatDate(batteryInfo?.battery_expiration) || "N/A"}</div>
            //   <div >{FormatDate(pad_type_1_data?.pad_expiration) || "N/A"}</div>
            //   {pad_type_2_data?.pad_type_id && <div >{FormatDate(pad_type_2_data?.pad_expiration) || "N/A"}</div>
            //   }
            // </>
            <>
              {
                FormatDate(batteryInfo?.battery_expiration || pad_type_1_data?.pad_expiration || pad_type_2_data?.pad_expiration) ?
                  <>{handleDefaultChargePakExpiration(batteryInfo, pad_type_1_data, pad_type_2_data)}</>
                  :
                  'N/A'
              }
            </>
          ) :
          <>
            <CommonDatePicker
              calName={"battery_expiration"}
              CalVal={batteryInfo?.battery_expiration}
              HandleChange={(name, val) => handleDateChange(name, val, Bindex, 0)}
              disabled={false}
            />
            <span className='p-2'></span>

            {
              parseInt(padcondi) === 0 ? (
                <></>
              ) : parseInt(padcondi) === 1 ? (
                renderDatePicker("pad_expiration", pad_type_1_data?.pad_expiration, Bindex, 1)
              ) : (
                <>
                  <span className='p-2'></span>
                  {renderDatePicker("pad_expiration", pad_type_1_data?.pad_expiration, Bindex, 1)}
                  <span className='p-2'></span>
                  {renderDatePicker("pad_expiration", pad_type_2_data?.pad_expiration, Bindex, 2)}
                </>
              )
            }
            <span className='p-2' ></span>

          </>}
      </td>

      <td style={{ verticalAlign: "top" }}>
        {is_readonly === 0
          ? (<>
            <div>{batteryInfo?.battery_lot || "N/A"}</div>
            <div>{pad_type_1_data?.pad_lot || "N/A"}</div>
            {pad_type_2_data?.pad_type_id && <div >{pad_type_2_data?.pad_lot || "N/A"}</div>}

            {/* <div>{pad_type_2_data?.pad_lot || "N/A"}</div> */}
            {/* {chargepakpadData.map((item,Cindex)=> (
              <div key={Cindex}> {item?.pad_lot || "N/A"}</div>
              ))} */}
          </>) : (
            <>
              <Form.Group className={"col"}>
                <Form.Control
                  type="text"
                  name="battery_lot"
                  value={batteryInfo?.battery_lot}
                  placeholder='Enter Battery Lot No'
                  onChange={(e) => handleChange2(e, index, Bindex, 0)}
                />
              </Form.Group>
              <span className='p-2' ></span>
              {
                parseInt(padcondi) === 0 ? (
                  <></>
                ) : parseInt(padcondi) === 1 ? (
                  renderFormInput("pad_lot", pad_type_1_data?.pad_lot, index, Bindex, 1)
                ) : (
                  <>
                    <span className='p-2' ></span>
                    {renderFormInput("pad_lot", pad_type_1_data?.pad_lot, index, Bindex, 1)}
                    <span className='p-2'></span>
                    {renderFormInput("pad_lot", pad_type_2_data?.pad_lot, index, Bindex, 2)}
                  </>
                )
              }
            </>
          )}
      </td>
      <td style={{ verticalAlign: "top" }}>
        {is_readonly === 0
          ? (<div>{batteryInfo?.charge_pak_uid || "N/A"} </div>)
          : (
            <Form.Group className={"col"}>
              <Form.Control
                type="text"
                name="charge_pak_uid"
                placeholder='Enter Charge Pack UDI'
                value={batteryInfo?.charge_pak_uid}
                onChange={(e) => handleChange2(e, index, Bindex, 0)}
              />
            </Form.Group>
          )}
      </td>
      <td>
        <div style={{ display: "flex", flexDirection: "row", columnGap: "5%", alignItems: "center" }}>
          {batteryInfo?.is_spare === 1 && is_readonly === 0 && (
            <img
              src={KingTaz}
              alt='KingTaz'
              height={30}
              style={{ cursor: "pointer" }}
              onClick={() => handleChargeSpareCrown(index, Bindex)}
            />
          )}
          {charge_pack_obj?.is_new === 1 && isInventory ? (
            <span onClick={handleDND} style={{ cursor: 'pointer' }}>
              <NewModiFicationGroupIcon />
            </span>
          ) : (
            isInventory ? (
              <img
                src={Activitycheck}
                alt='Activitycheck'
                height={30}
                width={30}
                style={{
                  cursor: AedFormData[index].dni_array_list.findIndex((it) => it.bid === batteryInfo.bid) !== -1 ? 'not-allowed' : 'pointer'
                }}
                onClick={() => handleDNDButton(index, Bindex, charge_pack_obj, 'battery')}
              />
            ) : ""
          )}
          <img src={Minus} alt='Minus' height={20} width={30} style={{ cursor: "pointer" }} onClick={() => { handleRemoveMainChargePakRow(index, Bindex, false, false, batteryInfo?.aed_id) }} />
        </div>
      </td>


    </tr>
    {
      inventoryModal ?
        <ChargePackInventoryModal
          setNewFormData={setNewFormData}
          Bindex={Bindex}
          index={index}
          AedFormData={AedFormData}
          inventoryModal={inventoryModal}
          setInventoryModal={setInventoryModal}
          contact_id={contact_id}
          secName={secName}
          inspection_by={inspection_by}
          selectedBatteryTypeId={selectedBatteryTypeId}
          setSelectedBatteryTypeId={setSelectedBatteryTypeId}
          api='account/get-battery-inventory/v2' />
        :
        ""
    }
  </>
  )

}

export default AedModificationChargePackRow;
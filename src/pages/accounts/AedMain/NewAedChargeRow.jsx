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

const NewAedChargeRow = ({
  setDeleteNewBattery,
  handleRemoveMainChargePakRow,
  handleChargeSpareCrown,
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
  aedPadTypeList
}) => {

  const [inventoryModal, setInventoryModal] = useState(false)
  const secName = section_name_list['charge_pack'];//AedFormData[index]?.charge_pak_info?.[0].section_name
  const chargepakpadData = AedFormData[index]?.charge_pak_pad_info;
  
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

  const handleChange2 = useCallback((event, index, Pindex) => {
    if (event.target.name === 'type' && event.target.value === 'main') {
      let Fd = [...AedFormData];
      const biArr = Fd[index].battery_info;
      const FindIndex = biArr.findIndex((it) => it.is_spare === 0);
      if (FindIndex != -1) {
        toast.error('Please remove main first, then you can convert spare into main');
        return false;
      } else {
        onInputChange(event.target.value, event.target.name, index, Pindex, 'battery_info');
      }
    } else {
      onInputChange(event.target.value, event.target.name, index, Pindex, 'battery_info');
    }
  }, [onInputChange]);

  const handleDateChange = useCallback((name, val, Pindex) => {
    console.log({ val });
    onInputChange(val, name, index, Pindex, 'battery_info');
  }, [onInputChange]);


  const handleDND = () => {
    setInventoryModal(true)
  }


  return (<>
    <tr key={Bindex}>
      <td>
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
                onChange={(e) => handleChange2(e, index, Bindex)}
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



      <td>
        {is_readonly === 0
    ? (
      <>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span><img src={Battery} height={14} style={{marginBottom:"4px"}} /></span>
            <span>{print_battery_part(batteryInfo.battery_type_id || "N/A")}</span>
        </div>
        {/* {JSON.stringify({chargepakpadData})} */}
        {chargepakpadData?.map((item,Cindex)=> (
        <div key={Cindex} style={{ display: 'flex', alignItems: 'center' }}>
            <span><img src={Adult} height={12} style={{marginBottom:"4px"}}/></span>
            <span>{print_pad_part(item?.pad_type_id || "N/A")}</span>
        </div>
        ))}
      </>
    )
          : (
            <div className='col form-group' style={{ maxWidth: "300px" }}>
              <select
                name="battery_type_id"
                className={"form-control"}
                value={batteryInfo?.battery_type_id}
                onChange={(e) => handleChange2(e, index, Bindex)}
              >
                <option value="" key={0} selected >--Select One--</option>
                {batteryList?.map((item, index) => (
                  <option value={item?.battery_type_id} key={index + 1} >{item?.battery_part_number}</option>
                ))}
              </select>
            </div>
          )}
      </td>

        <td>
          {is_readonly === 0 
          ? (<> <div>{FormatDate(batteryInfo?.battery_expiration) || "N/A"}</div>
            {chargepakpadData?.map((item,Cindex)=> (
            <div key={Cindex}>{FormatDate(item?.pad_expiration) || "N/A"}</div>
            ))}
            </>) : 
             <CommonDatePicker
              calName={"battery_expiration"}
              CalVal={batteryInfo?.battery_expiration}
              HandleChange={(name, val) => handleDateChange(name, val, Bindex)}
              disabled={false}
            />}
        </td>

        <td>
          {is_readonly === 0 
          ? (<>
          <div>{batteryInfo?.battery_lot || "N/A"}</div>
          {chargepakpadData.map((item,Cindex)=> (
          <div key={Cindex}> {item?.pad_lot || "N/A"}</div>
          ))}
           </>) : (
              <Form.Group className={"col"}>
                <Form.Control
                  type="text"
                  name="battery_lot"
                  value={batteryInfo?.battery_lot}
                  onChange={(e) => handleChange2(e, index, Bindex)}

                />
              </Form.Group>
            )}
        </td> 
        <td>
          {is_readonly === 0 
          ? ( <div>{batteryInfo?.charge_pak_uid || "N/A"} </div>)
            : (
              <Form.Group className={"col"}>
                <Form.Control
                  type="text"
                  name="battery_udi"
                  value={batteryInfo?.battery_udi}
                  onChange={(e) => handleChange2(e, index, Bindex)}
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
          {batteryInfo?.is_new ? (
            <span onClick={handleDND} style={{ cursor: 'pointer' }}>
              <NewModiFicationGroupIcon />
            </span>
          ) : (
            <img
              src={Activitycheck}
              alt='Activitycheck'
              height={30}
              width={30}
              style={{
                cursor: AedFormData[index].dni_array_list.findIndex((it) => it.bid === batteryInfo.bid) !== -1 ? 'not-allowed' : 'pointer'
              }}
              onClick={() => handleDNDButton(index, Bindex, batteryInfo, 'battery')}
            />
          )}
          <img src={Minus} alt='Minus' height={20} width={30} style={{ cursor: "pointer" }} onClick={() => { handleRemoveMainChargePakRow(index, Bindex, false, false, batteryInfo?.aed_id) }} />
        </div>
      </td>


    </tr>
    {
      inventoryModal ?
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
            api='/account/get-battery-inventory' />
        :
        ""
    }


  </>
  )
}

export default NewAedChargeRow;
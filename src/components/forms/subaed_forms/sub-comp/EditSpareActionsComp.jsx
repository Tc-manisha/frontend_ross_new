import React, { useState } from "react";
import { NewModiFicationGroupIcon } from "../../../../helper/Icons";
import SiteListModel from "../../../modals/AED/SiteListModel";
// import AEDInventoryModal from '../../../../pages/accounts/AedMain/AEDInventoryModal';
import NewAedInventoryModel from "../../../modals/AED/NewAedInventoryModel";
import CustomToggleButton from "../../../common/toggleSwitch/CustomToggleButton";
import QuestionMark from "../../../../img/QuestionMark.png";
import Activitycheck from "../../../../img/Activity Symbols.png";
import Minus from "../../../../img/Minus.svg";
import KingTaz from "../../../../img/KingTaz.png";
import inventoryIcon from "../../../../img/InventoryIcon.png";
import { toast } from "react-toastify";
import EditSiteListModel from "./EditSiteListModel";

const EditSpareActionsComp = ({
  index,
  crrIndex,
  formData,
  setFormData,
  section_name,
  BatteryList,
  handleInputChange,
  is_readonly = 0,
  crrFormData,
  unKnownToggleKey,
  type,
}) => {
  const [openSitelistModel, setOpenSitelistModel] = useState(false);
  const [inventoryModal, setInventoryModal] = useState(false);
  const [selectSite, setSelectedSite] = useState("");
  const [api, setApi] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  // const handle_unknow_checkbox = (e, keyname, toogleKeyName) => {
  //   const oldData = { ...formData };

  //   const save_obj = {
  //     battery_type_id: e.target.checked ? "unknown" : "",
  //     battery_expiration: e.target.checked ? "unknown" : "",
  //     battery_lot: e.target.checked ? "unknown" : "",
  //     battery_uid: e.target.checked ? "unknown" : "",
  //     v9_install: e.target.checked ? "unknown" : "",
  //     install_before_date: e.target.checked ? "unknown" : "",
  //     date_installed: e.target.checked ? "unknown" : "",
  //     manufactured_date: e.target.checked ? "unknown" : "",
  //   };

  //   if (oldData[keyname]) {
  //     let newArr = [];
  //     for (let ari = 0; ari < oldData[keyname].length; ari++) {
  //       newArr.push(save_obj);
  //     }
  //     oldData[keyname] = newArr;
  //     oldData[toogleKeyName] = e.target.checked;
  //     setFormData(oldData);
  //   }
  // };

  // const handleCheckboxClick = () => {
  //   setIsChecked((prevState) => !prevState);
  //   const e = { target: { checked: !isChecked } };
  //   handle_unknow_checkbox(e, section_name, unKnownToggleKey);
  // };

  function checkAddRow(obj) {
    if ('add_row' in obj && obj['add_row'] === 1) {
        return true;
    } else {
        return false;
    }
}

function areAllKeysUnknown(obj) {
  console.log({obj})
  for (const key in obj) {
      if (obj[section_name] !== 'unknown' && obj["is_spare"] !== 'unknown' && obj["no_9v_spare_toggle"] !== 'unkown' && obj[key] == 'unknown') {
          return false;
      }
  }
  return true;
}

function findObjectBySectionAndIndex(sectionName, index, unkownArr) {
  console.log({unkownArr})
  for (let obj of unkownArr) {
    console.log("Hii1")
    console.log({sectionName})
    sectionName = sectionName === "ChargePakInformation" ? "charge_pack" :
    sectionName === "AdultPadInformation" ? "adult_pad_info" :
    sectionName === "AdultPadPakInfo" ? "adult_pad_pak_info" :
    sectionName === "PediatricPadInformation" ? "pediatric_pad_info" :
    sectionName === "PediatricPakPadInformation" ? "pediatric_pak_pad_info" :
    sectionName === "SpareAdultPadInfo" ? "spare_adult_pad_info" :
    sectionName === "SpareAdultPadPakInfo" ? "spare_adult_pad_pak_info" :
    sectionName === "sparePadricPadInfo" ? "spare_padric_pad_info" :
    sectionName === "sparePadricPakPad" ? "spare_padric_pak_pad" : 
    sectionName === "SpareChargePakInformation" ? "charge_pack" :
    sectionName === "has_man_spare" ? "has_man" :
    sectionName === "has_9v_spare" ? "has_9v" :
    sectionName === "has_10pk_spare" ? "has_10pk" :
    sectionName === "has_battery_spare" ? "has_battery" :
    sectionName === "has_installby_spare" ? "has_installby" : sectionName;
    console.log({sectionName})
    console.log(obj.section_name);
    console.log(obj.index);
      if (obj.section_name === sectionName && obj.index === index && obj.is_spare === 1) {
        console.log("Hii2")  
        return obj;
      }
  }
  return {};
}

const fillUnknown = (checkKey) => {
  // Create a new object to store the result
  console.log({checkKey})
  let result = {};

  // Iterate over each key in the input object
  for (let key in checkKey) {
      // Check if the current key is "section_name"
      if (key === "section_name" || key === "index" || key === "is_spare") {
          // Preserve the original value for "section_name"
          result[key] = checkKey[key];
      } else {
          // Set the value to "unknown" for all other keys
          result[key] = "unknown";
      }
  }
  return result;
}
 
const handle_unknow_checkbox = (e, crrIndex, keyname, toogleKeyName, is_spare) => {
  const oldData = { ...formData };
  const oldestData = { ...formData };

  console.log({is_spare})
  console.log({formData})
console.log({keyname})
  // let value = keyname.replace(/'/g, '');
  const checkKey = formData[`${keyname.replace(/'/g, '')}`][crrIndex];
  console.log(oldestData[keyname][crrIndex])

  let save_obj = {};
  if (
    keyname === "has_battery" ||
    keyname === "has_battery_spare" ||
    keyname === "has_9v" ||
    keyname === "has_9v_spare" ||
    keyname === "has_installby" ||
    keyname === "has_installby_spare" ||
    keyname === "has_man" ||
    keyname === "has_man_spare" ||
    keyname === "has_10pk" ||
    keyname === "has_10pk_spare"
  ) {
    const allKeysUnkown = areAllKeysUnknown(checkKey);
    console.log({allKeysUnkown});
    
    if (allKeysUnkown === true) {
      let unknownArr = [];
      var unknownRow = oldestData[keyname][crrIndex];
      unknownRow.index = crrIndex;
    
      console.log({ unknownRow });
      formData.unKnownArr.push(unknownRow);
      console.log(fillUnknown(checkKey))
      save_obj = fillUnknown(checkKey);
      console.log({save_obj})
      console.log({ formData });
    
    } else {
      console.log({ formData });
      console.log("modifiedObj", save_obj);
      
      const arrObject = formData?.unKnownArr || [];
      console.log({ arrObject });
      const sectionName = `${section_name.replace(/'/g, '')}`
    
      const oldRow = findObjectBySectionAndIndex(sectionName, crrIndex, arrObject, is_spare);
      console.log({ oldRow });
      save_obj = oldRow;
    }
  }

  if (
    keyname === "ChargePakInformation" ||
    keyname === "SpareChargePakInformation"
  ) {
    const allKeysUnkown = areAllKeysUnknown(checkKey);
    console.log({allKeysUnkown});
    
    if (allKeysUnkown === true) {
      let unknownArr = [];
      var unknownRow = oldestData[keyname][crrIndex];
      unknownRow.index = crrIndex;
    
      console.log({ unknownRow });
      formData.unKnownArr.push(unknownRow);
      console.log(fillUnknown(checkKey))
      save_obj = fillUnknown(checkKey);
      console.log({save_obj})
      console.log({ formData });
    
    } else {
      console.log({ formData });
      console.log("modifiedObj", save_obj);
      
      const arrObject = formData?.unKnownArr || [];
      console.log({ arrObject });
      const sectionName = `${section_name.replace(/'/g, '')}`
    
      const oldRow = findObjectBySectionAndIndex(sectionName, crrIndex, arrObject, is_spare);
      console.log({ oldRow });
      save_obj = oldRow;
    }
  }


  if (
    keyname === "AdultPadInformation" ||
    keyname === "SpareAdultPadInfo" ||
    keyname === "AdultPadPakInfo" ||
    keyname === "SpareAdultPadPakInfo" ||
    keyname === "PediatricPadInformation" ||
    keyname === "sparePadricPadInfo" ||
    keyname === "PediatricPakPadInformation" ||
    keyname === "sparePadricPakPad"
  ) {
    const allKeysUnkown = areAllKeysUnknown(checkKey);
    console.log({allKeysUnkown});
    
    if (allKeysUnkown === true) {
      let unknownArr = [];
      var unknownRow = oldestData[keyname][crrIndex];
      unknownRow.index = crrIndex;
    
      console.log({ unknownRow });
      formData.unKnownArr.push(unknownRow);
      console.log(fillUnknown(checkKey))
      save_obj = fillUnknown(checkKey);
      console.log({save_obj})
      console.log({ formData });
    
    } else {
      console.log({ formData });
      console.log("modifiedObj", save_obj);
      
      const arrObject = formData?.unKnownArr || [];
      console.log({ arrObject });
      const sectionName = `${section_name.replace(/'/g, '')}`
    
      const oldRow = findObjectBySectionAndIndex(sectionName, crrIndex, arrObject, is_spare);
      console.log({ oldRow });
      save_obj = oldRow;
    }
  }

  console.log({save_obj})
  console.log({keyname})
  console.log(formData[keyname][crrIndex])
  // formData[keyname][crrIndex].push(save_obj);
  setFormData((prev) => ({
    ...prev,
    [keyname]: prev[keyname].map((item, index) => 
      index === crrIndex ? { ...item, ...save_obj } : item
    ),
  }));
  

  console.log({formData})
};

  const handleCheckboxClick = (crrIndex, is_spare) => {
    console.log("checkbox click")
    setIsChecked((prevState) => !prevState);
    const e = { target: { checked: !isChecked } };
    handle_unknow_checkbox(e, crrIndex, section_name, unKnownToggleKey, 1);
  };

  const handleDNDButton = (index, Bindex, row, section_name, type) => {
    const Fd = {...formData};
    let is_found = 0;
    for (let i2 = 0; i2 < Fd?.dni_array_list.length; i2++) {
      let element = Fd?.dni_array_list[i2];
      if (type === "battery") {
        if (element.bid === row.bid) {
          is_found = 1;
        }
      } else {
        if (element.pid === row.pid) {
          is_found = 1;
        }
      }
    }
    const checkArr = Fd?.dni_array_list?.find(
      (it) =>
        it.aed_id === row.aed_id &&
        (it?.bid === row?.bid || it?.pid === row?.pid)
    );
    if (!is_found) {
      //toast.success('DNI Addedd Successfully');
      Fd.dni_array_list.push(row);
      if (type === "battery") {
        console.log("Battery");
        row.accessory_type = 'Battery'
        const biArr = Fd[`${section_name.replace(/'/g, '')}`];
        let dniArr = Fd.dni_array_list;
        const deletedBatteryArr = Fd.deletedBatteried;
        const removedBattery = biArr[Bindex];
        Fd.deletedBatteried = [...deletedBatteryArr, removedBattery];
        Fd[`${section_name.replace(/'/g, '')}`] = biArr.filter((_, i) => i !== Bindex);
        dniArr = [removedBattery];
        setFormData(Fd);

      } else {
        
        console.log("Pad");
        if (row?.section_name === 'pediatric_pad_info' || row?.section_name === 'spare_padric_pad_info') {
          row.accessory_type = 'Pediatric Pad'
        }
        if (row?.section_name === 'adult_pad_info' || row?.section_name === 'spare_adult_pad_info') {
          row.accessory_type = 'Pad'
        }
        if (row?.section_name === 'adult_pad_pak_info' || row?.section_name === 'spare_adult_pad_pak_info') {
          row.accessory_type = 'Pad Pak'
        }
        const piArr = Fd[`${section_name.replace(/'/g, '')}`];
        let dniArr = Fd.dni_array_list;
        const deletedPadsArr = Fd.deletedBatteried;


        // const piArr = Fd[index].all_pads;
        // let dniArr = Fd[index].dni_array_list;
        // const deletedPadsArr = Fd[index].deletedPads;
        const removedPad = piArr[Bindex];
        Fd.deletedPads = [...deletedPadsArr, removedPad];
        Fd[`${section_name.replace(/'/g, '')}`] = piArr.filter((_, i) => i !== Bindex);
        // Fd[index].all_pads = piArr.filter((_, i) => i !== Bindex);
        dniArr = [removedPad];
        setFormData(Fd);
      }
      setFormData(Fd);
    }
  };


  const handleRemoveMainBatteryRow = (index, Bindex, ret = 0, type , section_name) => {
    const Fd = {...formData};
    const biArr = Fd[`${section_name.replace(/'/g, '')}`];
    const deletedArr = Fd.deletedBatteried;
    const removedBattery = biArr[Bindex];
    Fd[`${section_name.replace(/'/g, '')}`] = biArr.filter((_, i) => i !== Bindex);
    Fd.deletedBatteried = [...deletedArr, removedBattery];
    setFormData(Fd);
    return ret ? Fd : undefined;
  };


  const handleBatterySpareCrown = (index, Bindex, section_name, crrFormData) => {
    let Fd = { ...formData };
    let batteryName = `${section_name.replace(/'/g, '').replace('_spare', '')}`;
    let spareBatteryName = `${section_name.replace(/'/g, '')}`;
    console.log({batteryName})
    console.log({Fd})
    batteryName = batteryName === "SpareChargePakInformation" ? "ChargePakInformation" : batteryName;
    console.log({batteryName});
    const biArr = Fd[batteryName];

    const FindIndex = biArr.findIndex((it) => it.is_spare === 0);
    if (FindIndex !== -1) {
        toast.error("Please remove main first, then you can convert spare into main");
        return false;
    } 

    if (Fd[spareBatteryName] && Fd[spareBatteryName][Bindex]) {
        // Remove the object at the specified index
        let newArray = { ...formData };
        let removedObject = Fd[spareBatteryName][Bindex];

        // Update the removed object
        removedObject = {
            ...removedObject,
            is_spare: 0,
            install_date: new Date(), 
        };

        // Remove the object from the spare array
        newArray[spareBatteryName] = newArray[spareBatteryName].filter((_, i) => i !== Bindex);

        // Add the updated object to the main array
        newArray[batteryName] = [...newArray[batteryName], removedObject];
        setFormData((prev) => ({
            ...prev,
            [batteryName]: newArray[batteryName],
            [spareBatteryName]: newArray[spareBatteryName],
        }));
    }
};

const handlePadSpareCrown = (index, Bindex, section_name, crrFormData) => {
  let Fd = { ...formData };
  let padName = `${section_name.replace(/'/g, '').replace('Spare', '')}`;
  let sparePadName = `${section_name.replace(/'/g, '')}`;

  console.log({padName})
  console.log({Fd})

  const KeyPadName = padName === "AdultPadInfo" ? "AdultPadInformation" :
  padName === "sparePadricPadInfo" ? "PediatricPadInformation" :
  padName === "sparePadricPakPad" ? "PediatricPakPadInformation" : padName;
   const biArr = Fd[KeyPadName];

  if (biArr?.length > 0) {
      toast.error("Please remove main first, then you can convert spare into main");
      return false;
  } 

  if (Fd[sparePadName] && Fd[sparePadName][Bindex]) {
    // Remove the object at the specified index
    let newArray = { ...formData };
    let removedObject = Fd[sparePadName][Bindex];

    // Update the removed object
    removedObject = {
        ...removedObject,
        is_spare: 0,
        install_date: new Date(), 
    };

        // Remove the object from the spare array
        newArray[sparePadName] = newArray[sparePadName].filter((_, i) => i !== Bindex);

        // Add the updated object to the main array
        newArray[KeyPadName] = [...newArray[KeyPadName], removedObject];
        setFormData((prev) => ({
            ...prev,
            [KeyPadName]: newArray[KeyPadName],
            [sparePadName]: newArray[sparePadName],
        }));
    }

}

 console.log({crrFormData})
  // BatteryList
  return (
    <>
      <div className="col form-group" style={{ maxWidth: "300px" }}>
        <label htmlFor="">Actions</label>
        <div>
          {/* <span
            onClick={isChecked == true ? undefined  : setOpenSitelistModel}
            style={{ cursor: "pointer", marginRight: "2px" }}
            disabled={isChecked == true}
          >
            {" "}
            <NewModiFicationGroupIcon />{" "}
          </span> */}

        {(!crrFormData.add_row) && ( <> 
          <span>
          <img
                src={KingTaz}
                alt="KingTaz"
                height={30}
                style={{ cursor: "pointer" }}
                onClick={() => crrFormData?.pid ? handlePadSpareCrown(index, crrIndex, section_name, crrFormData) 
                  : handleBatterySpareCrown(index, crrIndex, section_name, crrFormData)}
              />
          </span>
          </>)}
         
         {(crrFormData.add_row === 1) && (<> 
          <span>
          <img
                src={inventoryIcon}
                alt="inventoryIcon"
                height={30}
                style={{ cursor: "pointer" }}
                onClick={() => setOpenSitelistModel(true)}
              />
          </span>
         </>)}

         {(!crrFormData.add_row) && ( <> 
          <span>
          <img
                  src={Activitycheck}
                  alt="Activitycheck"
                  style={{ height: "30px", width: "30px", marginLeft: "5px", cursor: "pointer" }}
                //   style={{
                //     cursor:
                //       AedFormData[index].dni_array_list.findIndex(
                //         (it) => it.bid === batteryInfo.bid
                //       ) !== -1
                //         ? "not-allowed"
                //         : "pointer",
                //   }}
                  onClick={() => 
                    handleDNDButton(index, crrIndex, crrFormData, section_name, type)
                  }
                />
          </span>
          </>)}

          <span>
          <img
              src={Minus}
              alt="Minus"
              height={20}
              width={30}
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleRemoveMainBatteryRow(
                  index,
                  crrIndex,
                  false,
                  false,
                  section_name
                );
              }}
            />
          </span>

          <span>
            <img
              src={QuestionMark}
              alt=""
              onClick={() => handleCheckboxClick(crrIndex)}
              style={{ height: "20px", width: "20px", marginLeft: "5px" }}
            />
          </span>

          <img src="" />
        </div>
      </div>

      {/* {openSitelistModel && (
        <SiteListModel
          openSitelistModel={openSitelistModel}
          setOpenSitelistModel={setOpenSitelistModel}
          setInventoryModal={setInventoryModal}
          section_name={section_name}
          setApi={setApi}
          selectSite={selectSite}
          setSelectedSite={setSelectedSite}
        />
      )} */}

{openSitelistModel && (
        <EditSiteListModel
          openSitelistModel={openSitelistModel}
          setOpenSitelistModel={setOpenSitelistModel}
          setInventoryModal={setInventoryModal}
          section_name={section_name}
          Bindex={crrIndex}
          index={index}
          AedFormData={formData}
          setNewFormData={setFormData}
          contact_id={"1"}
          secName={section_name}
          inspection_by={"2"}
          crrFormData={crrFormData}
        />
      )}

      {inventoryModal ? (
        <>
          <NewAedInventoryModel
            setNewFormData={setFormData}
            Bindex={crrIndex}
            // Pindex={}
            index={index}
            AedFormData={formData}
            inventoryModal={inventoryModal}
            setInventoryModal={setInventoryModal}
            contact_id={"1"}
            secName={section_name}
            inspection_by={"2"}
            api={api}
            selectSite={selectSite}
            setSelectedSite={setSelectedSite}
            crrFormData={crrFormData}
          />
        </>
      ) : (
        <></>
      )}

    </>
  );
};

export default EditSpareActionsComp;

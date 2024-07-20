import React, { useState } from "react";
import { NewModiFicationGroupIcon } from "../../../../helper/Icons";
import SiteListModel from "../../../modals/AED/SiteListModel";
// import AEDInventoryModal from '../../../../pages/accounts/AedMain/AEDInventoryModal';
import NewAedInventoryModel from "../../../modals/AED/NewAedInventoryModel";
import CustomToggleButton from "../../../common/toggleSwitch/CustomToggleButton";
// import QuestionMark from "../../public/QuestionMark.png";
import QuestionMark from "../../../../img/QuestionMark.png";
const ActionsComp = ({
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
}) => {
  const [openSitelistModel, setOpenSitelistModel] = useState(false);
  const [inventoryModal, setInventoryModal] = useState(false);
  const [selectSite, setSelectedSite] = useState("");
  const [api, setApi] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handle_unknow_checkbox = (e, crrIndex, keyname, toogleKeyName) => {
    const oldData = { ...formData };
    console.log({ keyname });
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
      save_obj = {
        battery_type_id: e.target.checked ? "unknown" : "",
        battery_expiration: e.target.checked ? "unknown" : "",
        battery_lot: e.target.checked ? "unknown" : "",
        battery_uid: e.target.checked ? "unknown" : "",
        v9_install: e.target.checked ? "unknown" : "",
        install_before_date: e.target.checked ? "unknown" : "",
        date_installed: e.target.checked ? "unknown" : "",
        manufactured_date: e.target.checked ? "unknown" : "",
      };
    }

    if (
      keyname === "ChargePakInformation" ||
      keyname === "SpareChargePakInformation"
    ) {
      save_obj = {
        battery_type_id: e.target.checked ? "unknown" : "",
        battery_expiration: e.target.checked ? "unknown" : "",
        battery_lot: e.target.checked ? "unknown" : "",
        battery_uid: e.target.checked ? "unknown" : "",
        v9_install: e.target.checked ? "unknown" : "",
        install_before_date: e.target.checked ? "unknown" : "",
        date_installed: e.target.checked ? "unknown" : "",
        manufactured_date: e.target.checked ? "unknown" : "",
        charge_pak_part:
          keyname === "ChargePakInformation" ||
          keyname === "SpareChargePakInformation"
            ? e.target.checked
              ? "unknown"
              : ""
            : "",

        charge_pak_uid:
          keyname === "ChargePakInformation" ||
          keyname === "SpareChargePakInformation"
            ? e.target.checked
              ? "unknown"
              : ""
            : "",
        // "battery_expiration": e.target.checked ? "unknown" : "",
        // "battery_lot": e.target.checked ? "unknown" : "",
        pad_1_part:
          keyname === "ChargePakInformation" ||
          keyname === "SpareChargePakInformation"
            ? e.target.checked
              ? "unknown"
              : ""
            : "",
        pad_1_expiration:
          keyname === "ChargePakInformation" ||
          keyname === "SpareChargePakInformation"
            ? e.target.checked
              ? "unknown"
              : ""
            : "",
        pad_1_lot:
          keyname === "ChargePakInformation" ||
          keyname === "SpareChargePakInformation"
            ? e.target.checked
              ? "unknown"
              : ""
            : "",
        pad_2_part:
          keyname === "ChargePakInformation" ||
          keyname === "SpareChargePakInformation"
            ? e.target.checked
              ? "unknown"
              : ""
            : "",
        pad_2_expiration:
          keyname === "ChargePakInformation" ||
          keyname === "SpareChargePakInformation"
            ? e.target.checked
              ? "unknown"
              : ""
            : "",
        pad_2_lot:
          keyname === "ChargePakInformation" ||
          keyname === "SpareChargePakInformation"
            ? e.target.checked
              ? "unknown"
              : ""
            : "",
        battery_udi:
          keyname === "ChargePakInformation" ||
          keyname === "SpareChargePakInformation"
            ? e.target.checked
              ? "unknown"
              : ""
            : "",
        // "manufactured_date": e.target.checked ? "unknown" : "",
        install_date:
          keyname === "ChargePakInformation" ||
          keyname === "SpareChargePakInformation"
            ? e.target.checked
              ? "unknown"
              : ""
            : "",
        // "battery_type_id": e.target.checked ? "unknown" : "",
      };
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
      save_obj = {
        pad_part: e.target.checked ? "unknown" : "",
        pad_expiration: e.target.checked ? "unknown" : "",
        pad_lot: e.target.checked ? "unknown" : "",
        pad_udi: e.target.checked ? "unknown" : "",
        pad_type_id: e.target.checked ? "unknown" : "",
      };
    }

    if (
      Array.isArray(oldData[keyname]) &&
      Array.isArray(oldData[keyname][crrIndex])
    ) {
      // Initialize newArr with save_obj replicated for each element in the array
      const newArr = oldData[keyname][crrIndex].map(() => ({
        ...save_obj,
        [toogleKeyName]: e.target.checked,
      }));

      // Update the specific index with the new array
      oldData[keyname][crrIndex] = newArr;

      // Update the form data with the new state
      setFormData(oldData);
    } else if (
      oldData[keyname] &&
      typeof oldData[keyname][crrIndex] === "object"
    ) {
      // If oldData[keyname][crrIndex] is an object, update it directly
      oldData[keyname][crrIndex] = {
        ...save_obj,
        [toogleKeyName]: e.target.checked,
      };

      // Update the form data with the new state
      setFormData(oldData);
    } else {
      console.error(
        "Unexpected data structure: oldData[keyname][crrIndex] should be an array or object."
      );
    }
  };

  const handleCheckboxClick = (crrIndex) => {
    console.log({ crrIndex });
    setIsChecked((prevState) => !prevState);
    const e = { target: { checked: !isChecked } };
    handle_unknow_checkbox(e, crrIndex, section_name, unKnownToggleKey);
  };
  // BatteryList
  return (
    <>
      <div className="col form-group" style={{ maxWidth: "100px" }}>
        <label htmlFor="">Actions</label>
        <div>
          <span
            onClick={isChecked == true ? undefined : setOpenSitelistModel}
            style={{ cursor: "pointer", marginRight: "2px" }}
            disabled={isChecked == true}
          >
            {" "}
            <NewModiFicationGroupIcon />{" "}
          </span>
          <span>
            <img
              src={QuestionMark}
              alt=""
              onClick={() => handleCheckboxClick(crrIndex)}
              style={{ height: "20px", width: "20px", marginLeft: "5px", cursor: "pointer" }}
            />
          </span>

          <img src="" />
        </div>
      </div>

      {openSitelistModel && (
        <SiteListModel
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
    </>
  );
};

export default ActionsComp;

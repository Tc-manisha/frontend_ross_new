import React from "react";
import { Col, Form } from "react-bootstrap";
import CommonDatePicker from "../../../common/date-picker/CommonDatePicker";
import BatteryPakComp from "../sub-comp/BatteryPakComp";
import { useState } from "react";
import { HandleUnknow } from "../../../../helper/BasicFn";
import PadPartSelect from "../sub-comp/PadPartSelect";
import { useEffect } from "react";
import EditSpareActionsComp from "../sub-comp/EditSpareActionsComp";

function EditSpareChargePakInfo({
  title,
  crrIndex,
  toogleKeyName,
  formData,
  setFormData,
  handleCheckBox,
  handleInput,
  crrFormData,
  addMore,
  keyName,
  BatteryList,
  all_condition_true,
  padList,
  is_unknowntrue,
  is_edit = 0,
  unKnownToggleKey,
}) {
  const [padcondi, setPadCondi] = useState(0);

  const handleChange = (e) => {
    let name = e.target.name;
    let index = crrIndex;
    let val = e.target.value;

    const oldData = { ...formData };
    if (name === "charge_pak_part") {
      let findPadKey = BatteryList.find(
        (item) => item.battery_type_id === parseInt(val)
      );
      if (findPadKey) {
        setPadCondi(findPadKey?.pad_qty);
      }
      // oldData[keyName][crrIndex]["pad_1_part"] = val;
      // oldData[keyName][crrIndex]["pad_2_part"] = val;
    }
    // let objDatalist  =  oldData[keyName];
    // let newArr = objDatalist.map((item,i)=>{
    //   if(i===index){
    //     return {
    //       ...item,
    //       [name]: val
    //     };
    //   }else{
    //       return item;
    //   }
    // })
    // oldData[keyName] = newArr;
    oldData[keyName][crrIndex][name] = val;
    setFormData(oldData);
  };

  const handleDateChange = (name, val) => {
    const oldData = { ...formData };
    oldData[keyName][crrIndex][name] = val;
    setFormData(oldData);
  };
  useEffect(() => {
    if (is_edit) {
      const val = crrFormData?.charge_pak_part;
      let findPadKey = BatteryList.find(
        (item) => item.battery_type_id === parseInt(val)
      );
      if (findPadKey) {
        setPadCondi(findPadKey?.pad_qty);
      }
    }
  }, [crrFormData?.charge_pak_part, BatteryList]);

  useEffect(() => {
      const val = crrFormData?.charge_pak_part;
      let findPadKey = BatteryList.find(
        (item) => item.battery_type_id === parseInt(val)
      );
      if (findPadKey) {
        setPadCondi(findPadKey?.pad_qty);
      }
  }, [crrFormData?.charge_pak_part]);

  return (
    <>
      <div className="row my-4">
        <hr />

        <Form.Group className="col">
          <Form.Label>Spare Charge Pak Part #</Form.Label>
          {/* <Form.Control type="text" name="charge_pak_part" value={crrFormData?.charge_pak_part} onChange={handleChange} /> */}
          <BatteryPakComp
            disabled={is_unknowntrue}
            name="charge_pak_part"
            crrFormData={crrFormData}
            BatteryList={BatteryList}
            handleInputChange={handleChange}
            crrIndex={crrIndex}
            toogleKeyName={toogleKeyName}
          />
        </Form.Group>
        <Form.Group className="col">
          <Form.Label>Spare Charge Pak UDI</Form.Label>
          <Form.Control
            type="text"
            name="charge_pak_uid"
            value={HandleUnknow(crrFormData?.charge_pak_uid)}
            onChange={handleChange}
            disabled={toogleKeyName ? true : is_unknowntrue}
          />
        </Form.Group>
        <Form.Group className="col">
          <Form.Label>Spare Battery Expiration</Form.Label>
          {/* <Form.Control type="text" name="battery_expiration" value={crrFormData?.battery_expiration} onChange={handleChange} /> */}
          <CommonDatePicker
            calName={"battery_expiration"}
            CalVal={crrFormData?.battery_expiration}
            HandleChange={handleDateChange}
            disabled={toogleKeyName ? true : is_unknowntrue}
          />
        </Form.Group>
        <Form.Group className="col">
          <Form.Label>Spare Battery Lot</Form.Label>
          <Form.Control
            type="text"
            name="battery_lot"
            value={HandleUnknow(crrFormData?.battery_lot)}
            onChange={handleChange}
            disabled={toogleKeyName ? true : is_unknowntrue}
          />
        </Form.Group>
      </div>

      <div className="row my-4">
        {padcondi || all_condition_true ? (
          <>
            <Form.Group className="col">
              <Form.Label>Spare Pad 1 Part #</Form.Label>
              {/* <BatteryPakComp disabled={is_unknowntrue}
							name="pad_1_part"
							crrFormData={ crrFormData }
							BatteryList={ BatteryList }
							handleInputChange={ handleChange }
							crrIndex={ crrIndex }
							toogleKeyName={ toogleKeyName }
						/> */}
              <PadPartSelect
                disabled={is_unknowntrue}
                name="pad_1_part"
                crrFormData={crrFormData}
                padList={padList}
                handleInputChange={handleChange}
                crrIndex={crrIndex}
                is_adult={1}
                toogleKeyName={toogleKeyName}
              />
            </Form.Group>
            <Form.Group className="col">
              <Form.Label>Spare Pad 1 Expiration</Form.Label>
              <CommonDatePicker
                calName={"pad_1_expiration"}
                CalVal={crrFormData?.pad_1_expiration}
                HandleChange={handleDateChange}
                disabled={toogleKeyName ? true : is_unknowntrue}
              />
            </Form.Group>
            <Form.Group className="col">
              <Form.Label>Spare Pad 1 Lot</Form.Label>
              <Form.Control
                type="text"
                name="pad_1_lot"
                value={HandleUnknow(crrFormData?.pad_1_lot)}
                onChange={handleChange}
                disabled={toogleKeyName ? true : is_unknowntrue}
              />
            </Form.Group>
          </>
        ) : (
          ""
        )}
        {parseInt(padcondi) === 2 || all_condition_true ? (
          <>
            <Form.Group className="col">
              <Form.Label>Spare Pad 2 Part #</Form.Label>
              {/* <BatteryPakComp disabled={is_unknowntrue}
							name="pad_2_part"
							crrFormData={ crrFormData }
							BatteryList={ BatteryList }
							handleInputChange={ handleChange }
							crrIndex={ crrIndex }
							toogleKeyName={ toogleKeyName }
						/> */}
              <PadPartSelect
                disabled={is_unknowntrue}
                name="pad_2_part"
                crrFormData={crrFormData}
                padList={padList}
                handleInputChange={handleChange}
                crrIndex={crrIndex}
                is_adult={1}
                toogleKeyName={toogleKeyName}
              />
            </Form.Group>
            <Form.Group className="col">
              <Form.Label>Spare Pad 2 Expiration</Form.Label>
              {/* <Form.Control type="text" name="pad_2_expiration" value={crrFormData?.pad_2_expiration} onChange={handleChange} /> */}
              <CommonDatePicker
                calName={"pad_2_expiration"}
                CalVal={crrFormData?.pad_2_expiration}
                HandleChange={handleDateChange}
                disabled={toogleKeyName ? true : is_unknowntrue}
              />
            </Form.Group>
            <Form.Group className="col">
              <Form.Label>Spare Pad 2 Lot</Form.Label>
              <Form.Control
                type="text"
                name="pad_2_lot"
                value={HandleUnknow(crrFormData?.pad_2_lot)}
                onChange={handleChange}
                disabled={toogleKeyName ? true : is_unknowntrue}
              />
            </Form.Group>
          </>
        ) : (
          ""
        )}

        <EditSpareActionsComp
          index={0}
          crrIndex={crrIndex}
          formData={formData}
          setFormData={setFormData}
          section_name={keyName}
          crrFormData={crrFormData}
          unKnownToggleKey={unKnownToggleKey}
          type={"battery"}
        />
      </div>
    </>
  );
}

export default EditSpareChargePakInfo;

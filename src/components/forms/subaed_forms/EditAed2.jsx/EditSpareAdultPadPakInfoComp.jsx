import React from "react";
import { Form } from "react-bootstrap";
import CommonDatePicker from "../../../common/date-picker/CommonDatePicker";
import PadPartSelect from "../sub-comp/PadPartSelect";
import { HandleUnknow } from "../../../../helper/BasicFn";
import EditSpareActionsComp from "../sub-comp/EditSpareActionsComp";

function EditSpareAdultPadPakInfoComp({
  title,
  crrIndex,
  formData,
  setFormData,
  handleCheckBox,
  handleInput,
  crrFormData,
  addMore,
  keyName,
  padList,
  is_unknowntrue,
  unKnownToggleKey,
}) {
  const handleChange = (e) => {
    let name = e.target.name;
    let index = crrIndex;
    let val = e.target.value;

    const oldData = { ...formData };
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

  return (
    <>
      <div className="row my-4">
        <Form.Group className="col">
          <Form.Label>Spare Adult Pad Pak Part</Form.Label>
          <PadPartSelect
            disabled={is_unknowntrue}
            name="pad_type_id"
            crrFormData={crrFormData}
            padList={padList}
            handleInputChange={handleChange}
            crrIndex={crrIndex}
            is_adult={1}
          />
        </Form.Group>
        <Form.Group className="col">
          <Form.Label>Spare Adult Pad Pak Expiration</Form.Label>
          {/* <Form.Control type="text" name="pad_expiration" value={crrFormData?.pad_expiration} onChange={handleChange} /> */}

          <CommonDatePicker
            calName={"pad_expiration"}
            CalVal={crrFormData?.pad_expiration}
            HandleChange={handleDateChange}
            disabled={is_unknowntrue}
          />
        </Form.Group>
        <Form.Group className="col">
          <Form.Label>Spare Adult Pad Pak Lot</Form.Label>
          <Form.Control
            type="text"
            name="pad_lot"
            value={HandleUnknow(crrFormData?.pad_lot)}
            onChange={handleChange}
            disabled={is_unknowntrue}
          />
        </Form.Group>
        <Form.Group className="col">
          <Form.Label>Spare Adult Pad Pak UDI</Form.Label>
          <Form.Control
            type="text"
            name="pad_udi"
            value={HandleUnknow(crrFormData?.pad_udi)}
            onChange={handleChange}
            disabled={is_unknowntrue}
          />
        </Form.Group>

        <EditSpareActionsComp
          index={0}
          crrIndex={crrIndex}
          formData={formData}
          setFormData={setFormData}
          section_name={keyName}
          crrFormData={crrFormData}
          unKnownToggleKey={unKnownToggleKey}
          type={"Pad"}
        />
      </div>
    </>
  );
}

export default EditSpareAdultPadPakInfoComp;

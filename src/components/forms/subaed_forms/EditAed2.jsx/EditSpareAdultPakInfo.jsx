import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import { HandleUnknow } from "../../../../helper/BasicFn";
import PadPartSelect from "../sub-comp/PadPartSelect";
import CommonDatePicker from "../../../common/date-picker/CommonDatePicker";
import EditActionsComp from "../sub-comp/EditActionsComp";
import EditSpareActionsComp from "../sub-comp/EditSpareActionsComp";

function EditSpareAdultPadInfo({
  is_unknowntrue,
  title,
  toogleKeyName,
  crrIndex,
  formData,
  setFormData,
  handleCheckBox,
  handleInput,
  crrFormData,
  addMore,
  keyName,
  padList,
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
    oldData[keyName][index][name] = val;
    setFormData(oldData);
  };

  const handleDateChange = (name, val) => {
    const oldData = { ...formData };
    oldData[keyName][crrIndex][name] = val;
    setFormData(oldData);
  };

  useEffect(() => {
    if (is_unknowntrue) {
      const oldData = { ...formData };
      oldData[keyName][crrIndex]["pad_part"] = "unknown";
      oldData[keyName][crrIndex]["pad_expiration"] = "unknown";
      oldData[keyName][crrIndex]["pad_lot"] = "unknown";
      oldData[keyName][crrIndex]["pad_udi"] = "unknown";
      setFormData(oldData);
    }
  }, [is_unknowntrue]);

  return (
    <>
      <div className="row my-4">
        <Form.Group className="col">
          <Form.Label>Spare Adult Pad Part</Form.Label>
          {/* <Form.Control type="text" name="pad_part" value={crrFormData?.pad_part} onChange={handleChange} /> */}
          <PadPartSelect
            disabled={is_unknowntrue}
            name="pad_type_id"
            crrFormData={crrFormData}
            padList={padList}
            handleInputChange={handleChange}
            crrIndex={crrIndex}
            is_adult={1}
            toogleKeyName={toogleKeyName}
          />
        </Form.Group>
        <Form.Group className="col">
          <Form.Label>Spare Adult Pad Expiration</Form.Label>
          {/* <Form.Control type="text" name="pad_expiration" value={crrFormData?.pad_expiration} onChange={handleChange} /> */}
          <CommonDatePicker
            calName={"pad_expiration"}
            CalVal={crrFormData?.pad_expiration}
            HandleChange={handleDateChange}
            disabled={toogleKeyName ? true : is_unknowntrue}
          />
        </Form.Group>
        <Form.Group className="col">
          <Form.Label>Spare Adult Pad Lot</Form.Label>
          <Form.Control
            type="text"
            name="pad_lot"
            value={HandleUnknow(crrFormData?.pad_lot)}
            onChange={handleChange}
            disabled={toogleKeyName ? true : is_unknowntrue}
          />
        </Form.Group>
        <Form.Group className="col">
          <Form.Label>Spare Adult Pad UDI</Form.Label>
          <Form.Control
            type="text"
            name="pad_udi"
            value={HandleUnknow(crrFormData?.pad_udi)}
            onChange={handleChange}
            disabled={toogleKeyName ? true : is_unknowntrue}
          />
        </Form.Group>

        <EditSpareActionsComp
          index={0}
          crrIndex={crrIndex}
          formData={formData}
          setFormData={setFormData}
          section_name={keyName}
          crrFormData={formData[`${keyName}`][crrIndex]}
          unKnownToggleKey={unKnownToggleKey}
          type={"Pad"}
        />
      </div>
    </>
  );
}

export default EditSpareAdultPadInfo;

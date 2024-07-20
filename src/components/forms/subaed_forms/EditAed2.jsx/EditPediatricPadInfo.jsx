import React from "react";
import { Form } from "react-bootstrap";
import PadPartSelect from "../sub-comp/PadPartSelect";
import CommonDatePicker from "../../../common/date-picker/CommonDatePicker";
import { HandleUnknow } from "../../../../helper/BasicFn";
import { useEffect } from "react";
import EditActionsComp from "../sub-comp/EditActionsComp";

function EditPediatricPadInfo({
  title,
  crrIndex,
  formData,
  setFormData,
  handleCheckBox,
  handleInput,
  crrFormData,
  addMore,
  removeBtn,
  keyName,
  Permissins,
  padList,
  is_unknowntrue,
  unKnownToggleKey
}) {
  const handleChange = (e, index) => {
    let name = e.target.name;
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
      <div className="row" key={crrIndex}>
        <Form.Group className="col" controlId="formPediatricPadPart">
          <Form.Label>Pediatric Pad Part</Form.Label>

          <PadPartSelect
            disabled={is_unknowntrue}
            name="pad_type_id"
            crrFormData={crrFormData}
            padList={padList}
            handleInputChange={handleChange}
            crrIndex={crrIndex}
          />
        </Form.Group>

        <Form.Group className="col" controlId="formPediatricPadExpiration">
          <Form.Label>Pediatric Pad Expiration</Form.Label>

          <CommonDatePicker
            disabled={is_unknowntrue}
            calName={"pad_expiration"}
            CalVal={crrFormData?.pad_expiration}
            HandleChange={handleDateChange}
          />
        </Form.Group>

        <Form.Group className="col" controlId="formPediatricPadLot">
          <Form.Label>Pediatric Pad Lot</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Pediatric Pad Lot"
            name="pad_lot"
            value={HandleUnknow(crrFormData?.pad_lot)}
            onChange={handleChange}
            disabled={is_unknowntrue}
          />
        </Form.Group>

        <Form.Group className="col" controlId="formPediatricPadUDI">
          <Form.Label>Pediatric Pad UDI</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Pediatric Pad UDI"
            name="pad_udi"
            value={HandleUnknow(crrFormData?.pad_udi)}
            onChange={handleChange}
            disabled={is_unknowntrue}
          />
        </Form.Group>

        <EditActionsComp
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

export default EditPediatricPadInfo;

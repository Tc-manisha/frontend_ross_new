import React from "react";
import { Form } from "react-bootstrap";
import PadPartSelect from "./sub-comp/PadPartSelect";
import CommonDatePicker from "../../common/date-picker/CommonDatePicker";
import { HandleUnknow } from "../../../helper/BasicFn";
import ActionsComp from "./sub-comp/ActionsComp";

function SparePediatricPadInfo({
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
  unKnownToggleKey,
}) {
  const handleChange = (e) => {
    let name = e.target.name;
    let val = e.target.value;
    const oldData = { ...formData };

    let index = crrIndex;
    oldData[keyName][index][name] = val;
    setFormData(oldData);
  };

  const handleDateChange = (name, val) => {
    const oldData = { ...formData };
    oldData[keyName][crrIndex][name] = val;
    setFormData(oldData);
  };
  return (
    <>
      <div className="row" key={crrIndex}>
        <Form.Group className="col" controlId="formSparePediatricPadPart">
          <Form.Label>Spare Pediatric Pad Part</Form.Label>
          <PadPartSelect
            disabled={is_unknowntrue}
            // name="pad_part"
            name="pad_type_id"
            crrFormData={crrFormData}
            padList={padList}
            handleInputChange={handleChange}
            crrIndex={crrIndex}
          />
        </Form.Group>

        <Form.Group className="col" controlId="formSparePediatricPadExpiration">
          <Form.Label>Spare Pediatric Pad Expiration</Form.Label>
          <CommonDatePicker
            disabled={is_unknowntrue}
            calName={"pad_expiration"}
            CalVal={crrFormData?.pad_expiration}
            HandleChange={handleDateChange}
          />
        </Form.Group>

        <Form.Group className="col" controlId="formSparePediatricPadLot">
          <Form.Label>Spare Pediatric Pad Lot</Form.Label>
          <Form.Control
            type="text"
            disabled={is_unknowntrue}
            placeholder="Enter Spare Pediatric Pad Lot"
            name="pad_lot"
            value={HandleUnknow(crrFormData?.pad_lot)}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="col" controlId="formSparePediatricPadUDI">
          <Form.Label>Spare Pediatric Pad UDI</Form.Label>
          <Form.Control
            type="text"
            disabled={is_unknowntrue}
            placeholder="Enter Spare Pediatric Pad UDI"
            name="pad_udi"
            value={HandleUnknow(crrFormData?.pad_udi)}
            onChange={handleChange}
          />
        </Form.Group>

        <ActionsComp
          index={0}
          crrIndex={crrIndex}
          formData={formData}
          setFormData={setFormData}
          section_name={keyName}
          crrFormData={crrFormData}
          unKnownToggleKey={unKnownToggleKey}
        />
      </div>
    </>
  );
}

export default SparePediatricPadInfo;

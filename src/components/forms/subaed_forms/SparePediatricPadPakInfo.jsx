import React from "react";
import { Form } from "react-bootstrap";
import CommonDatePicker from "../../common/date-picker/CommonDatePicker";
import PadPartSelect from "./sub-comp/PadPartSelect";
import ActionsComp from "./sub-comp/ActionsComp";

function SparePediatricPadPakInfo({
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
  const handleChange = (e, index) => {
    let name = e.target.name;
    let val = e.target.value;
    const oldData = { ...formData };
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
      <div className="row mt-2" key={crrIndex}>
        <Form.Group className="col" controlId="formPediatricPadPart">
          <Form.Label> Spare Pediatric Pad Part</Form.Label>
          <PadPartSelect
            // name="pad_part"
            name="pad_type_id"
            crrFormData={crrFormData}
            padList={padList}
            handleInputChange={handleChange}
            crrIndex={crrIndex}
            disabled={is_unknowntrue}
          />
        </Form.Group>

        <Form.Group className="col" controlId="formPediatricPadExpiration">
          <Form.Label> Spare Pediatric Pad Expiration</Form.Label>
          <CommonDatePicker
            calName={"pad_expiration"}
            CalVal={crrFormData?.pad_expiration}
            HandleChange={handleDateChange}
            disabled={is_unknowntrue}
          />
        </Form.Group>

        <Form.Group className="col" controlId="formPediatricPadLot">
          <Form.Label> Spare Pediatric Pad Lot</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Pediatric Pad Lot"
            name="pad_lot"
            value={crrFormData?.pad_lot}
            onChange={handleChange}
            disabled={is_unknowntrue}
          />
        </Form.Group>

        <Form.Group className="col" controlId="formPediatricPadUDI">
          <Form.Label> Spare Pediatric Pad UDI</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Pediatric Pad UDI"
            name="pad_udi"
            value={crrFormData?.pad_udi}
            onChange={handleChange}
            disabled={is_unknowntrue}
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
export default SparePediatricPadPakInfo;

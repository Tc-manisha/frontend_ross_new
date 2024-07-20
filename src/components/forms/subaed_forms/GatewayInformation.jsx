import { FormControlLabel, Switch } from "@mui/material";
import React from "react";
import { Form } from "react-bootstrap";
import CustomToggleButton from "../../common/toggleSwitch/CustomToggleButton";
import CommonDatePicker from "../../common/date-picker/CommonDatePicker";
import moment from "moment";

function GatewayInformation({
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
  permissins,
}) {
  const handleChange = (e, index) => {
    let name = e.target.name;
    let val = e.target.value;

    if (name === "gateway_Mmac_address" && val.length > 1) {
      const cleanedValue = val.replace(/[^a-fA-F0-9]/g, "");
      // Insert colons at the appropriate positions
      let formattedValue = cleanedValue;
      if (cleanedValue.length > 1) {
        formattedValue = cleanedValue.match(/.{1,2}/g).join(":");
      }
      const oldData = { ...formData };
      oldData[keyName][crrIndex][name] = formattedValue;
      setFormData(oldData);
    } else {
      const oldData = { ...formData };
      oldData[keyName][crrIndex][name] = val;
      setFormData(oldData);
    }
  };

  const handleCheckBox2 = (e) => {
    let name = e.target.name;
    let val = e.target.value;
    let checked = e.target.checked;

    const oldData = { ...formData };
    if (checked) {
      oldData[keyName][crrIndex][name] = 1;
    } else {
      oldData[keyName][crrIndex][name] = 0;
    }
    setFormData(oldData);
  };

  const handleDateChange = (name, val) => {
    const oldData = { ...formData };
    oldData[keyName][crrIndex]["expiry_date"] = moment(val)
      .add(permissins?.gateway_lifespan, "years")
      .calendar();
    oldData[keyName][crrIndex][name] = val;
    setFormData(oldData);
  };

  return (
    <>
      <div className="row">
        <Form.Group className="col" controlId="formGatewayInstalled">
          <b className={""}>Installed</b>
          <div className="">
            <CustomToggleButton
              ToggleName="installed"
              ToggleValue={crrFormData?.installed}
              changeHandler={handleCheckBox2}
            />
          </div>
        </Form.Group>

        {crrFormData?.installed ? (
          <>
            <Form.Group className="col" controlId="formGatewayConnected">
              <b className={""}>Connected</b>
              <div className="">
                <CustomToggleButton
                  ToggleName="connected"
                  ToggleValue={crrFormData?.connected}
                  changeHandler={handleCheckBox2}
                />
              </div>
            </Form.Group>

            <Form.Group className="col" controlId="formGatewaySerial">
              <Form.Label>Gateway Serial</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Gateway Serial"
                name="gateway_serial"
                value={crrFormData?.gateway_serial}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="col" controlId="formGatewayMmacAddress">
              <Form.Label>Gateway Mac Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Gateway Mac Address"
                name="gateway_Mmac_address"
                value={crrFormData?.gateway_Mmac_address}
                onChange={handleChange}
                maxLength={17}
              />
            </Form.Group>

            <Form.Group className="col" controlId="formBatteryInstallDate">
              <Form.Label>Battery Install Date</Form.Label>
              <CommonDatePicker
                calName={"battery_install_date"}
                CalVal={crrFormData?.battery_install_date}
                HandleChange={handleDateChange}
              />
            </Form.Group>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default GatewayInformation;

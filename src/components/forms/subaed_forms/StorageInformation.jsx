import { FormControlLabel, Switch } from "@mui/material";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { AEDStorageInfo, SortByProperty } from "../../../helper/BasicFn";
import CommonDatePicker from "../../common/date-picker/CommonDatePicker";
import CustomToggleButton from "../../common/toggleSwitch/CustomToggleButton";
import moment from "moment";

function StorageInformation({
  AccountList,
  formData,
  BrandList,
  setFormData,
  keyName,
  Permissins,
}) {
  const handleInput = (e) => {
    let val = e.target.value;
    let name = e.target.name;
    const fd = { ...formData };
    fd.alarmed = parseInt(val) === 1 ? 1 : 0; // val === 1 ? 1 : 0;
    fd.alarm_status = parseInt(val) === 1 ? 1 : 0;
    fd[name] = val;
    setFormData(fd);
  };

  console.log('formDataNew2', formData);

  const handleCheckBox = (e) => {
    if (e.target.type == "checkbox") {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.checked }));
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
    }
  };
  const [StorageList, setStorageList] = useState([]);
  const onLoad = async () => {
    let data = await AEDStorageInfo();
    if (data) {
      data = SortByProperty(data, "storage_info_name");
      setStorageList(data);
    }
  };
  React.useEffect(() => {
    onLoad();
  }, []);

  const handleCheckBox2 = (e) => {
    let name = e.target.name;
    let val = e.target.value;
    let checked = e.target.checked;

    const oldData = { ...formData };
    if (checked) {
      oldData[name] = 1;
    } else {
      oldData[name] = 0;
    }
    setFormData(oldData);
  };

  const handleAlarmStatus = (e) => {
    let name = e.target.name;
    let val = e.target.value;
    let checked = e.target.checked;

    const oldData = { ...formData };
    if (checked) {
      oldData[name] = 1;
    } else {
      oldData[name] = 0;
    }
    setFormData(oldData);
  };

  const handleDateChange = (name, val) => {
    let expiry_date = moment(val)
      .add(Permissins?.v_battery, "years")
      .calendar();
    const oldData = { ...formData };
    (oldData.store_expiry_date = expiry_date),
      (oldData.expiry_date = expiry_date),
      (oldData[name] = val);
    setFormData(oldData);
  };

  return (
    <>
      <div className=" bg-gray py-4 px-4 my-2">
        <h2 className="heading">Storage Information</h2>
        <div className="row">
          <div className="col-4 form-group">
            <label htmlFor="">Storage Type</label>
            <select
              className="form-control"
              id=""
              name="storage_type"
              value={formData?.storage_type}
              onChange={handleInput}
            >
              <option value="" key={0} selected>
                --Select One--
              </option>
              {StorageList &&
                StorageList.map((item) => (
                  <option value={item?.storage_info_id}>
                    {item?.storage_info_name}
                  </option>
                ))}
            </select>
          </div>
          {formData?.storage_type == 1 ? (
            <div className="col-2">
              <Form.Group>
                <b className={"d-block mb-2"}>Alarmed</b>
                <div className="">
                  <CustomToggleButton
                    ToggleName="alarmed"
                    ToggleValue={formData?.alarmed}
                    changeHandler={handleCheckBox2}
                  />
                </div>
              </Form.Group>
            </div>
          ) : (
            ""
          )}

          {formData?.storage_type == 1 ? (
            <div className="col-2">
              <Form.Group>
                <b className={"d-block mb-2"}>Alarm Status</b>
                <div className="">
                  <CustomToggleButton
                    ToggleName="alarm_status"
                    ToggleValue={formData?.alarm_status}
                    changeHandler={handleAlarmStatus}
                  />
                </div>
              </Form.Group>
            </div>
          ) : (
            ""
          )}

          {formData?.alarmed == 1 || formData?.alarmed ? (
            <div className="col-3 form-group">
              <label htmlFor="">9v Installed Date</label>
              <CommonDatePicker
                calName={"v9_Installed_Date"}
                CalVal={formData?.v9_Installed_Date}
                HandleChange={handleDateChange}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default StorageInformation;

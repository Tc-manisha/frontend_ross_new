import { FormControlLabel, Switch } from "@mui/material";
import React from "react";
import { Form } from "react-bootstrap";
// import CustomToggleButton from "../../common/toggleSwitch/CustomToggleButton";
// import CommonDatePicker from "../../common/date-picker/CommonDatePicker";
import CustomToggleButton from "../../../components/common/toggleSwitch/CustomToggleButton";
import CommonDatePicker from "../../../components/common/date-picker/CommonDatePicker";
const EditOutOfService = React.memo(({
    AccountList,
  formData,
  BrandList,
  setFormData,
  aedList,
  loanerList,
  siteId,
}) => { 
// function EditOutOfService({
//   AccountList,
//   formData,
//   BrandList,
//   setFormData,
//   aedList,
//   loanerList,
//   siteId,
// }) { 
  console.log({aedList})
  const handleInput = (e) => {
    // let val = e.target.value;
    // let name = e.target.name;
    // setFormData((old) => ({ ...old, [name]: val }));

    const filteredAedList = aedList.filter(item => item?.aed_details?.out_of_service_toggle === 0)

    // console.log('filteredAedList: ', filteredAedList);

    let currentValue = e.target.value;
    if (e.target.name === "replaced_serial") {
      setFormData((old) => ({ ...old, [e.target.name]: currentValue }));
      setFormData((old) => ({
        ...old,
        replaced_serial_name: aedList.filter(
          (item) => Number(item?.aed_details?.aed_id) === Number(currentValue)
        )?.[0]?.aed_details?.serial_number,
      }));
    } else if (e.target.name === "loaner_rental_serial") {
      setFormData((old) => ({ ...old, [e.target.name]: currentValue }));
      setFormData((old) => ({
        ...old,
        loaner_rental_serial_name: loanerList.filter(
          (item) => Number(item?.aed_details?.aed_id) === Number(currentValue)
        )?.[0]?.aed_details?.serial_number,
      }));

      if (currentValue === "") {
        setFormData((old) => ({ ...old, loaner_serial_id: 0 }));
      }

      setFormData((old) => ({ ...old, loaner_serial_id: currentValue }));
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
    }
  };

  const handleDateChange = (name, val) => {
    setFormData((old) => ({ ...old, [name]: val }));
  };
  const handleCheckBox = (e) => {
    if (e.target.type == "checkbox") {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.checked }));
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
    }
  };

  return (
    <>
      <div className=" bg-gray py-4 px-4 my-2">
        <h2 className="heading">Out of Service Information</h2>
        <div className="row">
          <div className="col-2">
            <Form.Group>
              <b className={"d-block mb-2"}>Replacing</b>
              <div className="">
                <CustomToggleButton
                  ToggleName="not_replacing"
                  ToggleValue={formData?.not_replacing}
                  changeHandler={handleCheckBox}
                  is_read_only={!formData?.out_of_service_toggle}
                />
              </div>
            </Form.Group>
          </div>

          <div className="col-2">
            <div className="form-group">
              <label htmlFor="">Replaced Serial #</label>
              {/* <input
                type="text"
                className="form-control"
                name="replaced_serial"
                value={formData?.replaced_serial}
                onChange={handleInput}
                disabled={
                  !formData?.out_of_service_toggle || !formData?.not_replacing
                }
              /> */}
          
              <select
                className="form-control"
                name="replaced_serial"
                value={formData?.replaced_serial}
                onChange={handleInput}
                disabled={
                  !formData?.out_of_service_toggle || !formData?.not_replacing
                }
              >
                <option value="">
                  --Select One--
                </option>
                {aedList?.filter(
                    (item) =>
                      item?.aed_details?.site_id ===
                    Number(siteId)
                  ).map((item, key) => (
                  <option
                    key={key + 1}
                    value={item?.aed_details?.aed_id}
                    // selected={
                    //   formData?.replaced_serial === item?.aed_details?.aed_id
                    //     ? true
                    //     : false
                    // }
                  >
                    {/* {JSON.stringify(item?.aed_details?.site_id)}
                    {console.log(item?.aed_details?.site_id)} */}
                    {item?.aed_details?.serial_number}
                  </option>
                  
                ))}
              </select>
            </div>
          </div>

          <div className="col-2">
            <Form.Group>
              <b className={"d-block mb-2"}>Loaner</b>
              <div className="">
                <CustomToggleButton
                  ToggleName="loaner_toggle"
                  ToggleValue={formData?.loaner_toggle}
                  changeHandler={handleCheckBox}
                  is_read_only={!formData?.out_of_service_toggle}
                />
              </div>
            </Form.Group>
          </div>

          <div className="col-3">
            <div className="form-group">
              <label htmlFor="">Loaner Serial # </label>
              {/* <input
                type="text"
                className="form-control"
                name="loaner_rental_serial"
                value={formData?.loaner_rental_serial}
                onChange={handleInput}
                disabled={!formData?.out_of_service_toggle}
              /> */}

              <select
                className="form-control"
                name="loaner_rental_serial"
                value={formData?.loaner_rental_serial}
                onChange={handleInput}
                disabled={
                  !formData?.out_of_service_toggle || !formData?.loaner_toggle
                }
              >
                <option value="" key={0} selected>
                  --Select One--
                </option>
                {loanerList?.map((item, key) => (
                  <option
                    key={key + 1}
                    value={item?.aed_details?.aed_id}
                    selected={
                      formData?.loaner_rental_serial ===
                        item?.aed_details?.aed_id
                        ? true
                        : false
                    }
                  >
                    {item?.serial_number}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-2">
            <div className="form-group">
              <label htmlFor="">Date Sent to Manufacturer </label>
              <CommonDatePicker
                calName={"date_sent_to_manufacturer"}
                CalVal={formData?.date_sent_to_manufacturer}
                HandleChange={handleDateChange}
                disabled={!formData?.out_of_service_toggle}
              />
              {/* <input type='date' className='form-control' name="date_sent_to_manufacturer"  onChange={handleInput} /> */}
            </div>
          </div>

          <div className="col-3">
            <div className="form-group">
              <label htmlFor="">Reason</label>
              <input
                type="text"
                className="form-control"
                name="reason"
                value={formData?.reason}
                onChange={handleInput}
                disabled={!formData?.out_of_service_toggle}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default EditOutOfService;

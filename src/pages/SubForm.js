import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Checkbox, FormControlLabel, Icon, Radio, Switch } from "@mui/material";
import { Form, Button as BButton, Button as BsButton } from "react-bootstrap";
import Button from "@mui/material/Button";
import { validatePhone } from "../helper/Common";

export default function SubForm({
  altTrainerForm,
  setSubFormData,
  increaseAlternative,
  decreaseAlternative,
  handleInputChange,
  allDropDowns,
  formData,
  formName,
  setFormData,
  noBtns,
  noMain,
  setSubFormPhoneValidated,
}) {
  // const [subFormData,setSubFormData] =  useState({"phone_number":"","ext":"","phone_type_id":"","main":""});
  const [allPhoneData, setAllPhoneData] = useState([]);
  const [phone, setPhone] = useState("");
  const [phoneExt, setPhoneExt] = useState("");

  const [phoneType, setPhoneType] = useState(1);
  const [main, setMain] = useState(false);
  const [phoneValidations, setPhoneValidations] = useState({});

  const updateFieldChanged = (index) => (e) => {
    console.log("event", e);
    if (e.target.name == "phone_number") {
      e.target.value = e.target.value.replace(/[^0-9 ]/g, "").trim();
      e.target.value = e.target.value.slice(0, 10);

      const phoneValidate = validatePhone(e.target.value);
      setPhoneValidations((old) => ({
        ...old,
        [index]: phoneValidate ? false : true,
      }));
      setSubFormPhoneValidated(phoneValidate ? false : true);
    }

    let newArr = [...altTrainerForm]; // copying the old datas array

    console.log("new arrr", newArr);
    console.log("target type", e.target.type);

    if (e.target.type === "checkbox") {
      if (newArr[index][e.target.name] === 0) {
        newArr[index][e.target.name] = 1;
        newArr.map((data, i) => {
          if (index !== i) {
            data.main = 0;
          }
        });
      } else {
        newArr[index][e.target.name] = 0;
        newArr.map((data, i) => {
          data.main = 0;
        });
      }
      // newArr[index][e.target.name] = e.target.checked;
    } else {
      newArr[index][e.target.name] = e.target.value;
    }

    setSubFormData(newArr);

    // console.log("new arr again", newArr);
  };

  // console.log("all trainer form", altTrainerForm);

  return (
    <>
      {altTrainerForm.map((singleForm, index) => (
        <div
          className="row mb-4 "
          style={{ display: "flex", alignItems: "center" }}
          key={index}
        >
          <Form.Group className={"col"}>
            <div className="d-flex mb-2" style={{ alignItems: "center" }}>
              <Form.Label>Phone*</Form.Label>
              {noBtns && (
                <>
                  <button
                    onClick={increaseAlternative}
                    type="button"
                    className="btn mx-2 btn-sm btn-primary "
                  >
                    +
                  </button>
                  <button
                    onClick={decreaseAlternative}
                    type="button"
                    className="btn mx-2 btn-sm btn-danger "
                  >
                    -
                  </button>
                </>
              )}
            </div>

            <Form.Control
              type="text"
              name="phone_number"
              defaultValue={singleForm.phone_number}
              onChange={updateFieldChanged(index)}
              required={altTrainerForm.length == 1 ? true : false}
              minLength={10}
              maxLength={10}
              className={phoneValidations[index] ? "phone-invalid-input" : ""}
            />

            {phoneValidations[index] ? (
              <>
                <div className="phone-invalid">
                  Please Enter Exact 10 digits.
                </div>
              </>
            ) : (
              <>
                <Form.Control.Feedback type="invalid">
                  Please Enter Exact 10 digits.
                </Form.Control.Feedback>
              </>
            )}
          </Form.Group>

          <Form.Group className={"col"}>
            <Form.Label>Ext</Form.Label>

            <Form.Control
              type="number"
              name="ext"
              onChange={updateFieldChanged(index)}
              defaultValue={singleForm.ext}
            />
          </Form.Group>

          <Form.Group className={"col"}>
            <Form.Label>Phone Type</Form.Label>
            <Form.Select
              className={""}
              name="phone_type_id"
              onChange={updateFieldChanged(index)}
              value={singleForm.phone_type_id}
            >
              <option value="0" selected>
                --Select One--
              </option>
              {allDropDowns?.phoneType &&
                allDropDowns?.phoneType.map((PT, index) => (
                  <option value={PT.dropdown_phone_type_id} key={index}>
                    {PT.dropdown_phone_type_name}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className={"col d-block"}>
            {!noMain && (
              <>
                <b className={""}>Main</b>
                <div className="">
                  <FormControlLabel
                    className={""}
                    label=""
                    value={true}
                    name="main"
                    onChange={updateFieldChanged(index)}
                    control={
                      <Checkbox
                        checked={
                          singleForm.account_main_contact_email_main == 1 ||
                          singleForm.main === 1
                            ? true
                            : false
                        }
                        color="primary"
                        size="medium"
                      />
                      // <Radio
                      //   checked={
                      //     singleForm.account_main_contact_email_main == 1 ||
                      //     singleForm.main
                      //       ? true
                      //       : false
                      //   }
                      //   color="primary"
                      //   size="medium"
                      // />
                    }
                  />
                </div>
              </>
            )}
          </Form.Group>
        </div>
      ))}
    </>
  );
}

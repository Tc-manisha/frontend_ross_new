import React, { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, Icon, Radio, Switch } from "@mui/material";
import { Form, Button as BButton, Button as BsButton } from "react-bootstrap";
import Button from "@mui/material/Button";

export default function MultiEmailForm({
  altTrainerForm,
  setSubFormData,
  increaseAlternative,
  decreaseAlternative,
  handleInputChange,
  allDropDowns,
  noBtns,
  noMain,
}) {
  const updateFieldChanged = (index) => (e) => {
    let newArr = [...altTrainerForm]; // copying the old datas array

    // if (e.target.type == "radio") {
    //   newArr[index][e.target.name] = e.target.checked; // replace e.target.value with whatever you want to change it to

    //   newArr.map((data, i) => {
    //     if (index === i) {
    //       data.main = 1;
    //     } else {
    //       data.main = 0;
    //     }
    //   });
    // }
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
    } else {
      newArr[index][e.target.name] = e.target.value; // replace e.target.value with whatever you want to change it to
    }

    setSubFormData(newArr);
  };

  useEffect(() => {}, []);

  return (
    <>
      {altTrainerForm.map((singleForm, index) => (
        <div className="row my-4" key={index}>
          <Form.Group className={"col"}>
            <div className="d-flex ">
              <Form.Label>Email* </Form.Label>
              {!noBtns && (
                <>
                  <button
                    type="button"
                    onClick={increaseAlternative}
                    className="btn py-1 btn-sm mx-2 btn-primary"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={decreaseAlternative}
                    className="btn py-1 btn-sm mx-2 btn-danger"
                  >
                    -
                  </button>
                </>
              )}
            </div>

            <Form.Control
              type="email"
              required
              name="email"
              defaultValue={singleForm.account_main_contact_email}
              onChange={updateFieldChanged(index)}
            />
            <Form.Control.Feedback type="invalid">
              Please Enter Email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className={"col"}>
            <Form.Label>Email Type</Form.Label>
            <Form.Select
              className={""}
              name="email_type"
              onChange={updateFieldChanged(index)}
              defaultValue={singleForm.email_type_id}
            >
              <option value="0" selected>
                --Select One--
              </option>
              {allDropDowns?.emailType &&
                allDropDowns?.emailType.map((ET, index) => (
                  <option value={ET.dropdown_email_type_id} key={index}>
                    {ET.dropdown_email_type_name}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className={"col"}>
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
                        color="primary"
                        size="medium"
                        checked={
                          singleForm.account_main_contact_email_main == 1 ||
                          singleForm.main == 1
                            ? true
                            : false
                        }
                      />
                      // <Radio
                      //   color="primary"
                      //   size="medium"
                      //   value={true}
                      //   name="main"
                      //   onChange={ updateFieldChanged(index) }
                      //   checked={ singleForm.account_main_contact_email_main == 1 || singleForm.main ? true : false }
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

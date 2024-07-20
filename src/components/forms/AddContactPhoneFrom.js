import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FormControlLabel, Icon, Radio, Switch } from "@mui/material";
import { Form, Button as BButton, Button as BsButton } from "react-bootstrap";
import Button from '@mui/material/Button';
import { validatePhone } from '../../helper/Common';
import "../../../src/global.css";
import { toast } from 'react-toastify';


export default function AddContactPhoneFrom({ altTrainerForm, setSubFormData, increaseAlternative, decreaseAlternative, handleInputChange, allDropDowns, formData, formName, setFormData, noBtns, setPhoneValidation, phoneValidation }) {

  const [allPhoneData, setAllPhoneData] = useState([]);
  const [phone, setPhone] = useState("");
  const [phoneExt, setPhoneExt] = useState("");
  const [phoneType, setPhoneType] = useState(1);
  const [main, setMain] = useState(false);
  const [phoneValidations, setPhoneValidations] = useState({});
  const [phoneErrors, setPhoneErrors] = useState([]);

  const validatePhoneNumbers = (forms) => {
      const newPhoneErrors = forms.map((form) => {
          const phone = form.account_main_contact_phone || '';
          return phone.trim() !== '' && phone.trim().length < 10;
      });
      setPhoneErrors(newPhoneErrors);
  };

  const updateFieldChanged = (e, index, name) => {
      const newArr = [...altTrainerForm];
      let newPhoneErrors = [...phoneErrors];

      if (e.target.name === 'account_main_contact_phone') {
          e.target.value = e.target.value.replace(/[^0-9]/g, "").trim();
          e.target.value = e.target.value.slice(0, 10);

          newArr[index][name] = e.target.value;

          if (e.target.value.trim().length < 10) {
              newPhoneErrors[index] = true;
          } else {
              newPhoneErrors[index] = false;
          }
      }

      if (name === `account_main_contact_phone_main`) {
          newArr.forEach((form, i) => {
              newArr[i].account_main_contact_phone_main = i === index ? (form.account_main_contact_phone_main ? 0 : 1) : 0;
          });
      } else {
          newArr[index][name] = e.target.value;
      }
      setPhoneErrors(newPhoneErrors);
      setSubFormData(newArr);
  };

  const handleDecreaseAlternative = (index) => {
      decreaseAlternative(index);
      validatePhoneNumbers(altTrainerForm);
  };

  useEffect(() => {
      validatePhoneNumbers(altTrainerForm);
  }, [altTrainerForm]);

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
                          <Form.Label>Phone</Form.Label>
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
                                      onClick={() => handleDecreaseAlternative(index)}
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
                          name="account_main_contact_phone"
                          value={singleForm.account_main_contact_phone}
                          onChange={(e) => updateFieldChanged(e, index, 'account_main_contact_phone')}
                          pattern="[0-9]*"
                          minLength={10}
                          maxLength={10}
                          className={phoneErrors[index] ? "phone-invalid-input" : ""}
                      />
                      {
                          phoneErrors[index] && (
                              <div className="phone-invalid">
                                  Please Enter Exact 10 digits.
                              </div>
                          )
                      }

                  </Form.Group>

                  <Form.Group className={"col"}>
                      <Form.Label>Ext</Form.Label>

                      <Form.Control
                          type="number"
                          name="account_main_contact_phone_ext"
                          onChange={(e) => updateFieldChanged(e, index, 'account_main_contact_phone_ext')}
                          value={singleForm.account_main_contact_phone_ext}
                      />
                  </Form.Group>

                  <Form.Group className={"col"}>
                      <Form.Label>Phone Type</Form.Label>
                      <Form.Select
                          className={""}
                          name="phone_type_id"
                          onChange={(e) => updateFieldChanged(e, index, 'phone_type_id')}
                          value={singleForm.phone_type_id}
                      >
                          <option value="" selected>
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
                      <>
                          <b className={""}>Main</b>

                          <div className="">
                              <FormControlLabel
                                  className={''}
                                  label=''
                                  // value={true}
                                  name="account_main_contact_phone_main"
                                  onClick={(e) => {
                                      // Check if phone field is empty
                                      const phoneNumber =
                                        altTrainerForm[index].account_main_contact_phone;
                                      if (!phoneNumber || phoneNumber.trim() === "") {
                                        toast.error("Please first fill Phone number");
                                      } else {
                                        e.preventDefault();
                                        updateFieldChanged(
                                          e,
                                          index,
                                          "account_main_contact_phone_main"
                                        );
                                      }
                                    }}
                                  // onChange={(e) => updateFieldChanged(e, index, 'account_main_contact_phone_main')}
                                  control={<Radio color="primary" size="medium"
                                      // checked={singleForm?.account_main_contact_phone_main === true || singleForm?.account_main_contact_phone_main ? true : false} />}
                                      checked={singleForm?.account_main_contact_phone_main} />}
                              />
                          </div>
                      </>
                  </Form.Group>
              </div>
          ))}
      </>
  );
}

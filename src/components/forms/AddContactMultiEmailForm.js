import React, { useEffect, useState } from 'react';
import { FormControlLabel, Icon, Radio, Switch } from "@mui/material";
import { Form, Button as BButton, Button as BsButton } from "react-bootstrap";
import Button from '@mui/material/Button';
import "../../../src/global.css";
import { toast } from "react-toastify";

export default function AddContactMultiEmailForm({
  altTrainerForm, setSubFormData,
  increaseAlternative, decreaseAlternative,
  handleInputChange, allDropDowns, noBtns,
}) {
  const [emailErrors, setEmailErrors] = useState(Array(altTrainerForm.length).fill(false));

  const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
  };

  const validateEmailAddresses = (forms) => {
      const newEmailErrors = forms.map((form) => {
          const email = form.account_main_contact_email || '';
          return email.trim() !== '' && !validateEmail(email);
      });
      setEmailErrors(newEmailErrors);
  };

  const updateFieldChanged = (e, index, name) => {
      const newArr = [...altTrainerForm];
      let newEmailErrors = [...emailErrors];

      if (name === `account_main_contact_email_main`) {
          newArr.forEach((form, i) => {
              newArr[i].account_main_contact_email_main = i === index ? (form.account_main_contact_email_main ? 0 : 1) : 0;
          });
      } else {
          newArr[index][name] = e.target.value;
      }

      if (name === 'account_main_contact_email') {
          if (!validateEmail(e.target.value)) {
              newEmailErrors[index] = true;
          } else {
              newEmailErrors[index] = false;
          }
      }

      setEmailErrors(newEmailErrors);
      setSubFormData(newArr);
  };

  const handleDecreaseAlternative = (index) => {
      decreaseAlternative(index);
      validateEmailAddresses(altTrainerForm);
  };

  useEffect(() => {
      validateEmailAddresses(altTrainerForm);
  }, [altTrainerForm]);

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
                                      onClick={() => handleDecreaseAlternative(index)}
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
                          name="account_main_contact_email"
                          value={singleForm.account_main_contact_email}
                          onChange={(e) => updateFieldChanged(e, index, 'account_main_contact_email')}
                          isInvalid={emailErrors[index]}
                      />
                      <Form.Control.Feedback type="invalid">
                          Please enter a valid email address.
                      </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className={"col"}>
                      <Form.Label>Email Type</Form.Label>
                      <Form.Select
                          className={""}
                          name="email_type_id"
                          onChange={(e) => updateFieldChanged(e, index, 'email_type_id')}
                          value={singleForm.email_type_id}
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
                  <>
                    <b className={""}>Main</b>
      
                    <div className="">
                      <FormControlLabel
                        className={""}
                        label=""
                        control={
                          <Radio
                            color="primary"
                            size="medium"
                            checked={singleForm?.account_main_contact_email_main}
                            name={"account_main_contact_email_main"}
                            value={
                              singleForm?.account_main_contact_email_main == true
                                ? 1
                                : 0
                            }
                            onClick={(e) => {
                              // Check if phone field is empty
                              const email =
                                altTrainerForm[index].account_main_contact_email;
                              if (!email || email.trim() === "") {
                                toast.error("Please first fill Email");
                              } else {
                                e.preventDefault();
                                updateFieldChanged(
                                  e,
                                  index,
                                  "account_main_contact_email_main"
                                );
                              }
                            }}
                          />
                        }
                      />
                    </div>
                  </>
                </Form.Group>
              </div>
          ))}
      </>
  );
}

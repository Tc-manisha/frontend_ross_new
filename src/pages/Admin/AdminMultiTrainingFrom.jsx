import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormControlLabel, Icon, Switch } from "@mui/material";
import { Form, Button as BButton, Button as BsButton } from "react-bootstrap";
import Button from "@mui/material/Button";
import { formatPhoneNumber, validatePhone } from "../../helper/Common";
import Select from "react-select";
import StateField from "../../components/common/states/StatesField";

export default function AdminMultiTrainingFrom({
  altTrainerForm,
  setSubFormData,
  increaseAlternative,
  decreaseAlternative,
  handleInputChange,
  allDropDowns,
  noBtns,
  type,
  fieldsRequired = true,
  countriesList,
  setTrainingPhoneValidations,
  setValidateField = "",
  validated
}) {
  // const [subFormData,setSubFormData] =  useState({"phone_number":"","ext":"","phone_type_id":"","main":""});
  const [phone, setPhone] = useState("");
  const [phoneExt, setPhoneExt] = useState("");

  const [phoneType, setPhoneType] = useState("");
  const [main, setMain] = useState(0);
  const [selectedCountry, setSelectedCountry] = React.useState({});
  const [phoneValidations, setPhoneValidations] = React.useState({});

  const HandleSubForm = () => {
    let mySubFormData = [...altTrainerForm];
    mySubFormData[formIndex] = {
      phone_number: phone,
      ext: phoneExt,
      phone_type_id: phoneType,
      main: main,
    };
  };

  const updateFieldChanged = (index) => (e) => {
    if (e.target.value !== " ") {
      let newArr = [...altTrainerForm]; // copying the old datas array
      if (e.target.name == "alternative_phone") {
        e.target.value = e.target.value.replace(/[^0-9 ]/g, "").trim();
        e.target.value = e.target.value.slice(0, 10);

        const phoneValidate = validatePhone(e.target.value);
        setPhoneValidations((old) => ({
          ...old,
          [index]: phoneValidate ? false : true,
        }));
        // setTrainingPhoneValidations((old) => ({ ...old, [ index ]: phoneValidate ? false : true }));
        setTrainingPhoneValidations(phoneValidate ? false : true);
        // setValidateField(phoneValidate ? false : true);
      }

      if (e.target.type == "checkbox") {
        let value = e.target.checked ? 1 : 0;
        newArr[index][e.target.name] = value;
      } else {
        newArr[index][e.target.name] = e.target.value; // replace e.target.value with whatever you want to change it to
      }
      setSubFormData(newArr);
    }
  };

  // handle select change
  const handleSelectChange = (data, key, index) => {
    let newArr = [...altTrainerForm];
    newArr[index][key] = data.value;
    setSubFormData(newArr);

    setSelectedCountry((old) => ({
      ...old,
      [key]: {
        label: data?.label,
        value: data?.value,
      },
    }));
  };

  useEffect(() => {
    if (countriesList) {
      if (altTrainerForm[0]?.account_alternate_traning_location_country) {
        const country = countriesList.find(
          (country) =>
            country.value ==
            parseInt(
              altTrainerForm[0]?.account_alternate_traning_location_country
            )
        );
        setSelectedCountry((old) => ({
          ...old,
          account_alternate_traning_location_country: {
            label: country?.label,
            value: country?.value,
          },
        }));
      } else {
        setSelectedCountry((old) => ({
          ...old,
          account_alternate_traning_location_country: {
            label: countriesList[230]?.label,
            value: countriesList[230]?.value,
          },
        }));
      }
    }
  }, [countriesList, altTrainerForm]);

  return (
    <>
      {altTrainerForm.map((singleForm, index) => (
        <div key={index}>
          <div
            className="row mb-4 "
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className="col-4">
              <div className="d-flex mb-2" style={{ alignItems: "center" }}>
                <Form.Label>Company Name</Form.Label>
                {type != "trainingEdit" && (
                  <>
                    <button
                      onClick={increaseAlternative}
                      className="btn mx-2 btn-sm btn-primary "
                      type="button"
                    >
                      +
                    </button>
                    <button
                      onClick={decreaseAlternative}
                      className="btn mx-2 btn-sm btn-danger "
                      type="button"
                    >
                      -
                    </button>
                  </>
                )}
              </div>

              <Form.Group className={"col"}>
                <Form.Control
                  type="text"
                  name="account_alternate_traning_location_company_name"
                  value={
                    singleForm.account_alternate_traning_location_company_name
                  }
                  onChange={updateFieldChanged(index)}
                />
              </Form.Group>
            </div>

            <div className="col-8 row">
              <Form.Group className={"col-md-4"}>
                <div className="d-flex mb-2" style={{ alignItems: "center" }}>
                  <Form.Label>Phone </Form.Label>
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
                  name="alternative_phone"
                  value={singleForm.alternative_phone}
                  onChange={updateFieldChanged(index)}
                  // required
                  minLength="10"
                  className={
                    phoneValidations[index]
                      ? "phone-invalid-input col-md-4"
                      : "col-md-4"
                  }
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

              <Form.Group className={"col-md-4"}>
                <div className="mb-2">
                  <Form.Label>Ext</Form.Label>
                </div>

                <Form.Control
                  type="number"
                  name="alternative_ext"
                  onChange={updateFieldChanged(index)}
                  value={singleForm.alternative_ext}
                />
              </Form.Group>

              {/* <Form.Group className={"col"}>
                <Form.Label>Phone Type</Form.Label>
                <Form.Select
                  className={""}
                  name="phone_type_id"
                  onChange={updateFieldChanged(index)}
                  defaultValue={singleForm.phone_type_id}
                >
                  <option defaultValue="0">--Select One--</option>
                  {allDropDowns?.phoneType &&
                    allDropDowns?.phoneType.map((PT, index) => (
                      <option defaultValue={PT.dropdown_phone_type_id} key={index}>
                        {PT.dropdown_phone_type_name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group> */}

              {/* <Form.Group className={"col d-block"}>
                <b className={""}>Main</b>
                <div className="">
                  <FormControlLabel
                    className={""}
                    label=""
                    value={true}
                    name="main"
                    onChange={updateFieldChanged(index)}
                    control={<Switch color="primary" size="medium" />}
                  />
                </div>
              </Form.Group> */}
            </div>
          </div>

          <div className="row my-4">
            <Form.Group className={"col relative"}>
              <Form.Label>Country </Form.Label>
              <Select
                value={
                  selectedCountry?.account_alternate_traning_location_country
                }
                options={countriesList}
                onChange={(data) => {
                  handleSelectChange(
                    data,
                    "account_alternate_traning_location_country",
                    index
                  );
                }}
              />
              <Form.Control.Feedback type="invalid">
                Please Enter Country.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>Address *</Form.Label>
              <Form.Control
                type="text"
                name="account_alternate_traning_location_address1"
                value={singleForm.account_alternate_traning_location_address1}
                onChange={updateFieldChanged(index)}
                required
                 />
                  <Form.Control.Feedback type="invalid">
                  Please Enter Address.
                </Form.Control.Feedback>
              </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>Address 2</Form.Label>
              <Form.Control
                type="text"
                name="account_alternate_traning_location_address2"
                value={singleForm.account_alternate_traning_location_address2}
                onChange={updateFieldChanged(index)}
              />
            </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>City *</Form.Label>
              <Form.Control
                type="text"
                name="account_alternate_traning_location_city"
                value={singleForm.account_alternate_traning_location_city}
                onChange={updateFieldChanged(index)}
                required
              />
               <Form.Control.Feedback type="invalid">
                  Please Enter City.
                </Form.Control.Feedback>
              </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>State *</Form.Label>

              <StateField
                setFormData={setSubFormData}
                valueKey="account_alternate_traning_location_state"
                selectedCountry={
                  selectedCountry?.account_alternate_traning_location_country
                    ?.value
                }
                validated={validated}
                required={fieldsRequired ? true : false}
                type="array"
                index={index}
                altTrainerForm={altTrainerForm}
                stateSelectedValue={
                  singleForm.account_alternate_traning_location_state
                }
              />
            </Form.Group>

            <Form.Group className={"col"}>
              <Form.Label>Zip code *</Form.Label>
              <Form.Control
                type="number"
                name="account_alternate_traning_location_zipcode"
                defaultValue={
                  singleForm.account_alternate_traning_location_zipcode
                }
                onChange={updateFieldChanged(index)}
                required
               />
                <Form.Control.Feedback type="invalid">
                  Please Enter Zip Code.
                </Form.Control.Feedback>
              </Form.Group>
          </div>
        </div>
      ))}
    </>
  );
}

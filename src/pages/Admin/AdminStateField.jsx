import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { CallGETAPI } from "../../helper/API";

const AdminStateField = ({
  selectedCountry,
  setFormData,
  valueKey,
  validated,
  required,
  type,
  index,
  altTrainerForm,
  objName,
  stateSelectedValue,
  setIsGenerateBtn,
  isGenerateBtn
}) => {

  const [value, setValue] = useState("");
  const [valueValidated, setValueValidated] = useState(false);
  const [states, setStates] = useState([]);

  const [stateArray, setStateArray] = useState([]);

  const handleChange = (event) => {
    if (value?.length > 0 && event?.target?.value.length <= value?.length) {
      setValue("");
      setIsGenerateBtn(false)
    } else {
      formDataValueUpdate(event?.target?.value);
    }
  };

  // get state value
  const getState = (value) => {
    if (selectedCountry == 231) {
      console.log({states})
      return states.find((state) => state.abbreviation === value.toUpperCase());
    } else {
      return states.find(
        (state) => state.state_name.toLowerCase() === value.toLowerCase()
      );
    }
  };

  // console.log('objName', objName);

  // set form data
  const formDataValueUpdate = (value) => {
    if (type != "array") {
      let state = getState(value);

      if (state) {
        setValue(state.state_name);

        setFormData((old) => ({
          ...old,
          [objName]: {
            ...old[objName],
            [valueKey]: state?.state_id,
            // [valueKey + "_name"]: state?.state_name,
            [valueKey + "_abbreviation"]: state?.abbreviation
          }
        }));

      } else {
        setValue(value);
        // setValueValidated(false);
      }
    } else {
      let state = getState(value);
      if (state) {
        setValue(state.state_name);
        let newArr = [...altTrainerForm];
        newArr[index][valueKey] = state.state_id;
        newArr[index][valueKey + "_name"] = state.state_name;
        newArr[index][valueKey + "_abbreviation"] = state.abbreviation;
        setFormData(newArr);
      } else {
        setValue(value);
        // setValueValidated(false);
      }
    }
  };

  // fetch country
  const fetchCountry = async (id) => {
    const results = await CallGETAPI("account/get-state-by-country/" + id);
    console.log({results})
    if (results?.status) {
      return results?.data?.data?.state;
    }
  };

  // get countriesList on page load
  const fetchOnLoad = async () => {
    const states = await fetchCountry(selectedCountry);

    if (stateSelectedValue) {
      const findState = states.find(
        (state) => state.state_id == parseInt(stateSelectedValue)
      );
      setFormData((old) => ({ ...old, [valueKey]: findState.state_id }));
      setFormData((old) => ({
        ...old,
        [valueKey + "_name"]: findState.state_name,
      }));
      setFormData((old) => ({
        ...old,
        [valueKey + "_abbreviation"]: findState.abbreviation,
      }));
    }
    setStates(states);
  };

  // get selected country
  useEffect(() => {
    if (selectedCountry) {
      fetchOnLoad();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (value?.trim()?.length == 0) {
      setValueValidated(true);
    } else {
      setValueValidated(false);
    }
  }, [value]);

  // get state
  const filterState = async () => {
    const AllStates = await fetchCountry(selectedCountry);
    const filteredStates = AllStates.filter(
      (state) => state.state_id == parseInt(stateSelectedValue)
    );
    const state = filteredStates[0];
    setValue(state?.state_name);
  };

  useEffect(() => {
    if (stateSelectedValue) {
      filterState();
    }
  }, [stateSelectedValue, selectedCountry]);

  return (
    <div>
      <Form.Group className={"col"}>
        <Form.Control
          name="state"
          type="text"
          value={value}
          onChange={handleChange}
          className={
            validated && required && valueValidated ? "invalid-input" : ""
          }
        // required
        />
        {/* {valueValidated && <p className="invalid">Please Enter Valid State.</p>} */}
        {validated && required && valueValidated && (
          <p className="invalid">Please Enter State.</p>
        )}
      </Form.Group>
    </div>
  );
};

export default AdminStateField;

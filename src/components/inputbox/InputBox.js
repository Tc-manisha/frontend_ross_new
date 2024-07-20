import React, { useState } from "react";
import { StateList } from "./StateList";
const states = StateList;

const InputBox = () => {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    if (value.length > 0 && event.target.value.length <= value.length) {
      setValue("");
    } else {
      const state = states.find(
        (state) => state.abbreviation === event.target.value.toUpperCase()
      );
      if (state) {
        setValue(state.name);
      } else {
        setValue(event.target.value);
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        style={{
          padding: "0.5em",
          borderRadius: "5px",
          border: "1px solid gray"
        }}
      />
    </div>
  );
};

export default InputBox;
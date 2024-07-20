import * as React from "react";
import "./toogleSwitch.scss";
import { useState } from "react";
import { useEffect } from "react";

export default function ToogleSwitch({
  switchKeyValue,
  setSwitchValue,
  switchKey,
  switchValue,
  disabled = false,
  switchType
}) {
  const [value, setValue] = useState(false);
  // pass data to parent component
  const passDataChange = (e) => {
    setValue(e.target.checked);
    setSwitchValue({
      key: switchKey,
      value: e.target.checked,
      type: switchType
    });
  };

  useEffect(() => {
    setValue(switchKeyValue);
  }, [switchKeyValue]);

  return (
    <div className="toggle-button-cover">
      <div className="button-cover">
        <div className="button r" id="button-1">
          <input
            type="checkbox"
            className="checkbox"
            checked={value || value == 1}
            onChange={(e) => {
              passDataChange(e);
            }}
            disabled={disabled}
          />
          <div className="knobs"></div>
          <div className="layer"></div>
        </div>
      </div>
    </div>
  );
}

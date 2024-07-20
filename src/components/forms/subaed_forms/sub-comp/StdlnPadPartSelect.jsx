import React from "react";
const StdlnPadPartSelect = ({
  name,
  title,
  crrFormData,
  padList,
  handleInputChange,
  crrIndex,
  is_adult = 0,
  toogleKeyName = false,
  disabled = false,
  chargepakRequired
}) => {
  // padList


  return (
    <>
      <select
        name={name}
        value={crrFormData?.[name]}
        class="form-control"
        onChange={(e) => handleInputChange(e, crrIndex)}
        disabled={toogleKeyName ? true : disabled}
        required={chargepakRequired}
      >
        <option value="" key={0} selected>
          --Select One--
        </option>
        {padList?.map((item, index) => {
          if (is_adult) {
            return (
              item?.pediatric === 0 && (
                <option
                  value={item?.pad_type_id}
                  key={index + 1}
                  className={item?.main ? "option-change" : ""}
                >
                  {item?.pad_part_number}
                </option>
              )
            );
          } else {
            return (
              item?.pediatric === 1 && (
                <option
                  value={item?.pad_type_id}
                  key={index + 1}
                  className={item?.main ? "option-change" : ""}
                >
                  {item?.pad_part_number}
                </option>
              )
            );
          }
        })}
      </select>
    </>
  );
};

export default StdlnPadPartSelect;

/*
 */

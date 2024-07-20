import React, { useState, useEffect, forwardRef, useRef } from "react";
import { CalendarEquipmentIcon } from "../../../helper/Common";
import DatePicker from "react-datepicker";
import moment from "moment";
import MaskedInput from "react-text-mask";
import "react-datepicker/dist/react-datepicker.css";

const CustomInput = forwardRef(({ isRequired, isFilled, ...props }, ref) => (
  <MaskedInput
    mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
    {...props}
    ref={ref}
    required={isRequired}
  />
));

function CommonDatePickerForFilter({
  calName,
  CalVal,
  HandleChange,
  disabled = false,
  isRequired = false,
  minDate,
  maxDate,
}) {
  const [DateValueState, setDateValueState] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // State to track if date picker is open
  const [isFilled, setIsFilled] = useState(false);
  const inputRef = useRef(null);

  const handleCalendarChange = (value) => {
    if (!value) return;
    const date = moment(value).format("YYYY-MM-DD");
    HandleChange(calName, date);
    setDateValueState(value);
    setIsFilled(true);
    setIsOpen(false);
  };

  useEffect(() => {
    if (CalVal) {
      const formattedDate = moment(CalVal, "YYYY-MM-DD");
      if (formattedDate.isValid()) {
        setDateValueState(formattedDate.toDate());
      }
    }
  }, [CalVal]);

  return (
    <div style={{ position: "relative" }}>
      <div
        className={`d-flex align-items-center calendar-input-btn-custom calendar-input-btn-1012-custom ${
          disabled ? "disabled-date-custom" : ""
        }`}
        style={{
          border: isRequired && !isFilled ? "1px solid red" : "",
        }}
      >
        <DatePicker
          open={isOpen}
          selected={DateValueState}
          onChange={handleCalendarChange}
          ref={inputRef}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          onClickOutside={() => setIsOpen(false)}
          shouldCloseOnSelect={true}
          customInput={
            <CustomInput
              ref={inputRef}
              isRequired={isRequired}
              isFilled={!!DateValueState}
            />
          }
        />
      </div>
      <span
        className="cl-name-custom"
        onClick={() => (disabled ? "" : setIsOpen(!isOpen))}
        style={{ color: "#000" }}
      >
        <CalendarEquipmentIcon />
      </span>
    </div>
  );
}

export default CommonDatePickerForFilter;

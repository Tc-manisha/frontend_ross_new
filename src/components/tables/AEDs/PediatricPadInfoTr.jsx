import React, { useEffect } from "react";
import CommonDatePicker from "../../common/date-picker/CommonDatePicker";

const PediatricPadInfoTr = ({
  i,
  formData,
  parentName,
  setFormData,
  DataName,
  print_aed_pad_type,
  RenderDate,
  toggle,
  aedPadTypeList,
  readOnly = 0,
}) => {
  const API = formData?.[parentName]?.[i];
  const handleDateChange = (name, val) => {
    const fd = { ...formData };
    if (name === "purchase_date") {
      let warenty_date = moment(val).add(warentyYear, "years").calendar();
      fd.warenty_date = warenty_date;
    }
    fd[parentName][i][name] = val;
    setFormData(fd);
  };
  const handleInput = (e) => {
    const fd = { ...formData };
    fd[parentName][i][e.target.name] = e.target.value;
    setFormData(fd);
  };

  return (
    <>
      <tr className="" key={i}>
        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
          {parentName === "pediatric_pad_info"
            ? "Main Pediatric"
            : "Pediatric Pak"}
        </td>
        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
          {/* { API?.adult_pad_part && API?.adult_pad_part != 'unknown' ? print_aed_pad_type(API?.adult_pad_part) : '' } */}
          {readOnly ? (
            <>{API?.pad_type_id}</>
          ) : (
            <>
              {toggle ? (
                print_aed_pad_type(API?.pad_type_id)
              ) : (
                <select
                  className="form-control"
                  name="pad_type_id"
                  defaultValue={API?.pad_type_id}
                  disabled={readOnly}
                >
                  {aedPadTypeList.map((it) => (
                    <option value={it?.pad_type_id}>
                      {it?.pad_part_number}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
        </td>
        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
          {toggle ? (
            RenderDate(API?.pad_expiration, true)
          ) : (
            <CommonDatePicker
              calName={"pad_expiration"}
              CalVal={API?.pad_expiration}
              HandleChange={handleDateChange}
              // disabled={false}
              disabled={readOnly}
            />
          )}
        </td>
        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
          {/* { API?.adult_pad_lot && API?.adult_pad_lot != 'unknown' ? API?.adult_pad_lot : '' } */}
          {toggle ? (
            API?.pad_lot
          ) : (
            <input
              type="text"
              name="pad_lot"
              defaultValue={API?.pad_lot}
              className="form-control"
              onChange={handleInput}
              readOnly={readOnly}
            />
          )}
        </td>
        <td className="border border-2 py-1 px-2 bg-tbl-border">
          {/* { API?.adult_pad_UDI && API?.adult_pad_UDI != 'unknown' ? API?.adult_pad_UDI : '' } */}

          {toggle ? (
            API?.pad_udi
          ) : (
            <input
              type="text"
              name="pad_udi"
              defaultValue={API?.pad_udi}
              className="form-control"
              onChange={handleInput}
              readOnly={readOnly}
            />
          )}
        </td>
      </tr>
    </>
  );
};
export default PediatricPadInfoTr;

import React from "react";
import CommonDatePicker from "../../common/date-picker/CommonDatePicker";

const PadsInfoEditTr = ({
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
    // fd[name] = val;
    fd[parentName][i][name] = val;
    setFormData(fd);
    // setDefaultfromData(fd);
  };
  const handleInput = (e) => {
    const fd = { ...formData };
    fd[parentName][i][e.target.name] = e.target.value;
    setFormData(fd);
  };

  // console.log({ formDataInside: formData });

  console.log('API', API);

  return (
    <>
      <tr className="" key={i}>
        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
          {parentName === "adult_pad_info" ? "Main Adult" : "Pad-Pak"}
        </td>
        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
          {/* { API?.pad_type_id && API?.pad_type_id != 'unknown' ? print_aed_pad_type(API?.pad_type_id) : '' } */}
          {readOnly ? (
            <> {API?.pad_type_id} </>
          ) : (
            <>
              {toggle ? (
                print_aed_pad_type(API?.pad_type_id)
              ) : (
                <select
                  className="form-control"
                  name=""
                  defaultValue={API?.pad_type_id}
                  onChange={handleInput}
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
            <>{API?.pad_expiration === 'unknown' ? 'unknown' : RenderDate(API?.pad_expiration, true)}</>
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
          {/* { API?.pad_lot && API?.pad_lot != 'unknown' ? API?.pad_lot : '' } */}
          {toggle ? (
            API?.pad_lot
          ) : (
            <input
              type="text"
              name={"pad_lot"}
              defaultValue={API?.pad_lot}
              className="form-control"
              onChange={handleInput}
              readOnly={readOnly}
            />
          )}
          {/* {API?.pad_lot} */}
        </td>
        <td className="border border-2 py-1 px-2 bg-tbl-border">
          {/* { API?.pad_udi && API?.pad_udi != 'unknown' ? API?.pad_udi : '' } */}
          {/* {API?.pad_udi} */}
          {toggle ? (
            API?.pad_udi
          ) : (
            <input
              type="text"
              name={"pad_udi"}
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

export default PadsInfoEditTr;

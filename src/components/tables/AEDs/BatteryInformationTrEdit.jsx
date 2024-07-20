import React, { useEffect, useState } from "react";
import { CheckADTable, CheckSpareBatteryTblCol } from "../../../helper/BasicFn";
import CommonDatePicker from "../../common/date-picker/CommonDatePicker";

const BatteryInformationTrEdit = ({
  is_spare = false,
  batteryInfo,
  print_battery_part,
  RenderDate,
  key,
  DataValue,
  batteryIndex,
  batteryTypeList,
  battery_information,
  formData,
  setFormData,
  DataName,
  readOnly = 0,
  is_disabled = false,
}) => {
  const handleDateChange = (name, val) => {
    const fd = { ...formData };
    if (name === "purchase_date") {
      let warenty_date = moment(val).add(warentyYear, "years").calendar();
      fd.warenty_date = warenty_date;
    }
    fd.battery_info[0][DataName][batteryIndex][name] = val;
    setFormData(fd);
  };

  const handleInput = (e) => {
    const fd = { ...formData };
    fd.battery_info[0][DataName][batteryIndex][e.target.name] = e.target.value;
    setFormData(fd);
  };

  return (
    <>
      <tr className="" key={batteryIndex}>
        <td>{is_spare ? "Spare" : "Main"}</td>
        <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
          {battery_information ? (
            print_battery_part(
              formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                ?.battery_type_id
            )
          ) : (
            <select
              className="form-control"
              name="battery_part"
              defaultValue={parseInt(
                formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                  ?.battery_type_id
              )}
              onChange={handleInput}
              disabled={readOnly}
            >
              {batteryTypeList?.map((it) => (
                <option defaultValue={it?.battery_type_id}>
                  {it?.battery_part_number}
                </option>
              ))}
            </select>
          )}
        </td>
        {/* {JSON.stringify(batteryInfo)} */}
        {CheckSpareBatteryTblCol(
          [...formData?.allBatterySpares, ...formData?.ALLBatteris],
          "battery_expiration"
        ) === 1 && (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {battery_information ? (
              RenderDate(
                formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                  ?.battery_expiration,
                true
              )
            ) : (
              <CommonDatePicker
                calName={"battery_expiration"}
                CalVal={
                  formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                    ?.battery_expiration
                }
                HandleChange={handleDateChange}
                disabled={is_disabled}
              />
            )}
          </td>
        )}
        {/* battery_expiration */}
        {/* (CheckADTable(batteryInfo, "manufactured_date") === 1 || CheckADTable(batteryInfo, "manufactured_date") === 1) */}
        {CheckSpareBatteryTblCol(
          [...formData?.allBatterySpares, ...formData?.ALLBatteris],
          "manufactured_date"
        ) === 1 && (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {/* {RenderDate(formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]?.manufactured_date)} */}
            {battery_information ? (
              RenderDate(
                formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                  ?.manufactured_date,
                false
              )
            ) : (
              <CommonDatePicker
                calName={"manufactured_date"}
                CalVal={
                  formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                    ?.manufactured_date
                }
                HandleChange={handleDateChange}
                disabled={readOnly}
              />
            )}
          </td>
        )}
        {CheckSpareBatteryTblCol(
          [...formData?.allBatterySpares, ...formData?.ALLBatteris],
          "battery_lot"
        ) === 1 && (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {battery_information ? (
              formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                ?.battery_lot
            ) : (
              <>
                <input
                  type="text"
                  className="form-control"
                  name="battery_lot"
                  defaultValue={
                    formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                      ?.battery_lot
                  }
                  onChange={handleInput}
                  readOnly={readOnly}
                />
              </>
            )}
          </td>
        )}
        {CheckSpareBatteryTblCol(
          [...formData?.allBatterySpares, ...formData?.ALLBatteris],
          "battery_udi"
        ) === 1 && (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {battery_information ? (
              formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                ?.battery_udi
            ) : (
              <input
                type="text"
                className="form-control"
                name="battery_uid"
                defaultValue={
                  formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                    ?.battery_udi
                }
                onChange={handleInput}
                readOnly={readOnly}
              />
            )}
          </td>
        )}
        {/* {CheckADTable(batteryInfo, "battery_serial") === 1 && (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue">
            {battery_information ? (
              formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                ?.battery_serial
            ) : (
              <input
                type="text"
                className="form-control"
                name="battery_serial"
                defaultValue={
                  formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                    ?.battery_serial
                }
                onChange={handleInput}
              />
            )}
          </td>
        )} */}
        {/* {CheckADTable(batteryInfo, "v9_install") === 1 && (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"> */}
        {/* {RenderDate(formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]?.v9_install)} */}
        {/* {battery_information ? (
              RenderDate(
                formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                  ?.v9_install,
                true
              )
            ) : (
              <CommonDatePicker
                calName={"v9_install"}
                CalVal={formData?.v9_install}
                HandleChange={handleDateChange}
                disabled={false}
              />
            )}
          </td>
        )} */}
        {/* {CheckADTable(batteryInfo, "install_before_date") === 1 && (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"> */}
        {/* {RenderDate(formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]?.install_before_date)} */}
        {/* {battery_information ? (
              RenderDate(
                formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                  ?.install_before_date,
                true
              )
            ) : (
              <CommonDatePicker
                calName={"install_before_date"}
                CalVal={
                  formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                    ?.install_before_date
                }
                HandleChange={handleDateChange}
                disabled={false}
              />
            )}
          </td>
        )} */}
        {/* {CheckADTable(batteryInfo, "date_installed") === 1 && (
          <td className="border border-2 py-1 px-2 bg-tbl-border border-r-blue"> */}
        {/* {RenderDate(formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]?.date_installed)} */}
        {/* {battery_information ? (
              RenderDate(
                formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                  ?.date_installed,
                true
              )
            ) : (
              <CommonDatePicker
                calName={"date_installed"}
                CalVal={
                  formData?.battery_info?.[0]?.[DataName]?.[batteryIndex]
                    ?.date_installed
                }
                HandleChange={handleDateChange}
                disabled={false}
              />
            )}
          </td>
        )} */}
      </tr>
    </>
  );
};

export default BatteryInformationTrEdit;

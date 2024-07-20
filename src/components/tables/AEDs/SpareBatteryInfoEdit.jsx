import React from "react";
import SpareBatteryInformationTrEdit from "./SpareBatteryInformationTrEdit";
const SpareBatteryInfoEdit = ({
  batteryTypeList,
  formData,
  setFormData,
  print_battery_part,
  RenderDate,
  is_disabled = false,
}) => {
  return (
    <>
      {Array.isArray(formData?.spare_battery_info) &&
        formData?.spare_battery_info?.map((data, index) => (
          <tbody className="odd-even-row border-b-blue" key={index}>
            {/* has_battery_spare loop */}
            {data?.has_battery_spare?.length > 0 && (
              <>
                {data?.has_battery_spare?.map(
                  (hasBattery, batteryIndex) =>
                    hasBattery?.battery_type_id &&
                    hasBattery?.battery_type_id != "" && (
                      <SpareBatteryInformationTrEdit
                        is_disabled={is_disabled}
                        is_spare={true}
                        setFormData={setFormData}
                        formData={formData}
                        battery_information={
                          formData?.battery_information_toggle
                        }
                        batteryTypeList={batteryTypeList}
                        batteryInfo={formData?.spare_battery_info}
                        print_battery_part={print_battery_part}
                        RenderDate={RenderDate}
                        DataValue={hasBattery}
                        DataName={"has_battery_spare"}
                        batteryIndex={batteryIndex}
                      />
                    )
                )}
              </>
            )}

            {/* has_9v_spare loop */}
            {data?.has_9v_spare?.length > 0 && (
              <>
                {data?.has_9v_spare?.map(
                  (has9v, has9vIndex) =>
                    has9v?.battery_type_id &&
                    has9v?.battery_type_id != "" && (
                      <SpareBatteryInformationTrEdit
                        is_disabled={is_disabled}
                        is_spare={true}
                        setFormData={setFormData}
                        formData={formData}
                        battery_information={
                          formData?.battery_information_toggle
                        }
                        batteryTypeList={batteryTypeList}
                        batteryInfo={formData?.spare_battery_info}
                        print_battery_part={print_battery_part}
                        RenderDate={RenderDate}
                        DataValue={has9v}
                        DataName={"has_9v_spare"}
                        batteryIndex={has9vIndex}
                      />
                    )
                )}
              </>
            )}

            {/* has_installby_spare loop */}
            {data?.has_installby_spare?.length > 0 && (
              <>
                {data?.has_installby_spare?.map(
                  (hasInstallby, hasInstallbyIndex) =>
                    hasInstallby?.battery_type_id &&
                    hasInstallby?.battery_type_id != "" && (
                      <SpareBatteryInformationTrEdit
                        is_disabled={is_disabled}
                        is_spare={true}
                        setFormData={setFormData}
                        formData={formData}
                        battery_information={
                          formData?.battery_information_toggle
                        }
                        batteryTypeList={batteryTypeList}
                        batteryInfo={formData?.spare_battery_info}
                        print_battery_part={print_battery_part}
                        RenderDate={RenderDate}
                        DataValue={hasInstallby}
                        DataName={"has_installby_spare"}
                        batteryIndex={hasInstallbyIndex}
                      />
                    )
                )}
              </>
            )}

            {/* has_man_spare loop */}
            {data?.has_man_spare?.length > 0 && (
              <>
                {data?.has_man_spare.map(
                  (hasMan, hasManIndex) =>
                    hasMan?.battery_type_id &&
                    hasMan?.battery_type_id != "" && (
                      <SpareBatteryInformationTrEdit
                        is_disabled={is_disabled}
                        is_spare={true}
                        setFormData={setFormData}
                        formData={formData}
                        battery_information={
                          formData?.battery_information_toggle
                        }
                        batteryTypeList={batteryTypeList}
                        batteryInfo={formData?.spare_battery_info}
                        print_battery_part={print_battery_part}
                        RenderDate={RenderDate}
                        DataValue={hasMan}
                        DataName={"has_man_spare"}
                        batteryIndex={hasManIndex}
                      />
                    )
                )}
              </>
            )}

            {/* has_10pk_spare loop */}
            {data?.has_10pk_spare?.length > 0 && (
              <>
                {data?.has_10pk_spare.map(
                  (has10pk, has10pkIndex) =>
                    has10pk?.battery_type_id &&
                    has10pk?.battery_type_id != "" && (
                      <SpareBatteryInformationTrEdit
                        is_disabled={is_disabled}
                        is_spare={true}
                        setFormData={setFormData}
                        formData={formData}
                        battery_information={
                          formData?.battery_information_toggle
                        }
                        batteryTypeList={batteryTypeList}
                        batteryInfo={formData?.spare_battery_info}
                        print_battery_part={print_battery_part}
                        RenderDate={RenderDate}
                        DataValue={has10pk}
                        DataName={"has_10pk_spare"}
                        batteryIndex={has10pkIndex}
                      />
                    )
                )}
              </>
            )}
          </tbody>
        ))}
    </>
  );
};
export default SpareBatteryInfoEdit;

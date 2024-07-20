import React from 'react'
import NewAedBatteryRow from '../../pages/accounts/AedMain/NewAedbatteryRow';
import Plus from "../../img/Plus.svg";
import { useSelector } from 'react-redux';

const SingleBatteryInfo = ({
    index,
    AedItem,
    handleBatteryAdd,
    handleResetBtn,
    setDeleteNewBattery,
    handleRemoveMainBatteryRow,
    handleBatterySpareCrown,
    print_battery_part,
    showAdditionalBatteryRows,
    handleCalendarChange,
    handleChange,
    handleDNDButton,
    onInputChange,
    AedFormData,
    setNewFormData,
    contact_id,
    inspection_by,
    selectedOption,
    isInventory,
    batteryResetButton
})=> {



    const PermissionRedux = useSelector(
        (state) => state?.AED_manager?.permissions
      );

      console.log({PermissionRedux});
    
  let has_9v = PermissionRedux?.has_9v === 1;
  let has_installby = PermissionRedux?.has_installby === 1;
  let has_10pk = PermissionRedux?.has_10pk === 1;
  let has_man = PermissionRedux?.has_man === 1;
  let has_battery = PermissionRedux?.has_battery === 1;

  return (has_9v || has_installby || has_10pk || has_man || has_battery) ?  
   (
        <div className="col py-2">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h2 className="heading">
                          Battery Information
                          <img
                            src={Plus}
                            onClick={() =>
                              handleBatteryAdd(
                                index,
                                AedItem.aed_id,
                                AedItem?.battery_section_name
                              )
                            }
                            style={{ cursor: "pointer" }}
                          />
                        </h2>
                        {(AedItem?.dni_array_list.length > 0 &&
                          AedItem.dni_array_list.some((item) =>
                            item.hasOwnProperty("bid")
                          )) ||
                          AedItem.battery_info.slice(
                            0,
                            AedItem?.default_battery_info.length
                          ).length !== AedItem?.default_battery_info.length ||
                          (AedItem?.deletedBatteried.length > 0 &&
                            AedItem.deletedBatteried.some(
                              (item) => !item.hasOwnProperty("inventory_id")
                            )) ||
                          batteryResetButton ? (
                          <button
                            type="button"
                            style={{
                              borderRadius: "10%",
                              backgroundColor: "#f24646",
                              color: "white",
                              height: "30px",
                              width: "52px",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "15px",
                            }}
                            onClick={() => handleResetBtn(index, 1)}
                          >
                            Reset
                          </button>
                        ) : (
                          ""
                        )}
                      </div>

                      <table className="theme-table">
                        <thead>
                          <tr>
                            <td
                              className="border border-r-blue"
                              style={{ minWidth: "150px" }}
                            >
                              Battery Type
                            </td>
                            {AedItem?.batteryvisibleColumns?.map((it, index) => (
                              <td
                                key={index}
                                className="border border-r-blue"
                                style={{ minWidth: "150px" }}
                              >
                                {it?.title}
                              </td>
                            ))}
                            <td
                              className="border border-r-blue"
                              style={{ maxWidth: "70px", minWidth: "60px" }}
                            >
                              Actions
                            </td>
                          </tr>
                        </thead>

                        <tbody className="">
                          {AedItem.battery_info &&
                            AedItem.battery_info.map((batteryInfo1, Bindex) => (
                                <NewAedBatteryRow
                                  setDeleteNewBattery={setDeleteNewBattery}
                                  handleRemoveMainBatteryRow={
                                    handleRemoveMainBatteryRow
                                  }
                                  handleBatterySpareCrown={handleBatterySpareCrown}
                                  batteryInfo={batteryInfo1}
                                  default_battery_info={AedItem.default_battery_info}
                                  is_readonly={batteryInfo1?.is_readonly || 0}
                                  Bindex={Bindex}
                                  print_battery_part={print_battery_part}
                                  index={index}
                                  showAdditionalBatteryRows={showAdditionalBatteryRows}
                                  handleCalendarChange={handleCalendarChange}
                                  handleChange={handleChange}
                                  batteryList={AedItem?.battery_type_list || []}
                                  handleDNDButton={handleDNDButton}
                                  handleResetBtn={handleResetBtn}
                                  onInputChange={onInputChange}
                                  AedFormData={AedFormData}
                                  setNewFormData={setNewFormData}
                                  contact_id={contact_id}
                                  inspection_by={inspection_by}
                                  selectedOption={selectedOption}
                                  batteryvisibleColumns={
                                    AedItem?.batteryvisibleColumns || []
                                  }
                                  isInventory={isInventory}
                                />
                            ))}
                        </tbody>
                      </table>
                    </div>
    
  ) : (
    <>
    </>
  )
}

export default SingleBatteryInfo
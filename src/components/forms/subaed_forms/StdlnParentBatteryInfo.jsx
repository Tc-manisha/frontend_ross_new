import React from "react";
import Batteryinformation from "./Batteryinformation";
import SpareBatteryinformation from "./SpareBatteryinformation";
import CustomToggleButton from "../../common/toggleSwitch/CustomToggleButton";
import { useSelector } from "react-redux";
import StdlnBatteryinformation from "./StdlnBatteryInfo";

function StdlnParentBatteryInfo({
  formData,
  setFormData,
  handleCheckBox,
  handleInput,
  addMore,
  // Permissins,
  addRemoveBtn,
  all_condition_true,
  BatteryList,
}) {
  const Permissins = useSelector((state) => state?.StdlnAED_manager?.permissions);
  const handle_unknow_checkbox = (e, keyname, toogleKeyName) => {
    const oldData = { ...formData };

    const save_obj = {
      battery_type_id: e.target.checked ? "unknown" : "",
      battery_expiration: e.target.checked ? "unknown" : "",
      battery_lot: e.target.checked ? "unknown" : "",
      battery_uid: e.target.checked ? "unknown" : "",
      v9_install: e.target.checked ? "unknown" : "",
      install_before_date: e.target.checked ? "unknown" : "",
      date_installed: e.target.checked ? "unknown" : "",
      manufactured_date: e.target.checked ? "unknown" : "",
    };

    if (oldData[keyname]) {
      let newArr = [];
      for (let ari = 0; ari < oldData[keyname].length; ari++) {
        newArr.push(save_obj);
      }
      oldData[keyname] = newArr;
      oldData[toogleKeyName] = e.target.checked;
      setFormData(oldData);
    }
  };

  return (
    <>
      <div className="">
        {(Permissins?.has_battery && Permissins?.accessory_type == "Battery") || all_condition_true ? (
          <div className="bg-gray py-4 px-4 mt-4">
             <div className="d-flex align-items-center justify-content-between">
               <h2 className="heading">Battery Information</h2>
               </div>
            {/* <div className="d-flex align-items-center justify-content-between">
              <h2 className="heading">
                Battery Information
                <button
                  onClick={() => addRemoveBtn("add", "has_battery_spare")}
                  className="btn mx-2 btn-sm btn-primary "
                  disabled={!formData?.no_spares_toggle}
                  type="button"
                >
                  +
                </button>
              </h2>
              <div className="toggle">
                <label className="d-block mb-2">
                  <b>Unknown</b>
                </label>
                <CustomToggleButton
                  ToggleName="no_has_battery_toggle"
                  ToggleValue={
                    formData?.no_has_battery_toggle ||
                    formData?.has_battery[0]?.battery_type_id === "unknown"
                  }
                  changeHandler={(e) =>
                    handle_unknow_checkbox(
                      e,
                      "has_battery",
                      "no_has_battery_toggle"
                    )
                  }
                />
              </div>
            </div> */}

            {formData?.has_battery?.map((item, index) => (<>
              
              <StdlnBatteryinformation
                is_unknowntrue={
                  item?.battery_type_id === "unknown" ||
                  formData?.no_has_battery_toggle
                }
                keyName={"has_battery"}
                title="Battery Information"
                crrIndex={index}
                formData={formData}
                setFormData={setFormData}
                handleCheckBox={handleCheckBox}
                handleInput={handleInput}
                crrFormData={item}
                addMore={addMore}
                Permissins={Permissins}
                bettery_type={1}
                BatteryList={BatteryList}
              />
           </> ))}
          </div>
       ) : (
          ""
        )}

        {/* {formData?.has_battery_spare.length > 0 || all_condition_true ? (
          <div className="bg-gray py-4 px-4 mt-4">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="heading">
                Spare Battery Information
                <button
                  onClick={() => addRemoveBtn("add", "has_battery_spare")}
                  className="btn mx-2 btn-sm btn-primary "
                  disabled={!formData?.no_spares_toggle}
                  type="button"
                >
                  +
                </button>
                <button
                  onClick={() => addRemoveBtn("remove", "has_battery_spare")}
                  className="btn mx-2 btn-sm btn-danger "
                  type="button"
                >
                  -
                </button>
              </h2>
              <div className="toggle">
                <label className="d-block mb-2">
                  <b>Unknown</b>
                </label>
                <CustomToggleButton
                  ToggleName="no_battery_spare_toggle"
                  ToggleValue={
                    formData?.no_battery_spare_toggle ||
                    formData?.has_battery_spare?.[0]?.battery_type_id === "unknown"
                  }
                  changeHandler={(e) =>
                    handle_unknow_checkbox(
                      e,
                      "has_battery_spare",
                      "no_battery_spare_toggle"
                    )
                  }
                />
              </div>
            </div>

            {formData?.has_battery_spare?.map((item, index) => (
              <SpareBatteryinformation
                is_unknowntrue={
                  item?.battery_type_id === "unknown" ||
                  formData?.no_battery_spare_toggle
                }
                keyName={"has_battery_spare"}
                title="Spare Battery Information"
                crrIndex={index}
                formData={formData}
                setFormData={setFormData}
                handleCheckBox={handleCheckBox}
                handleInput={handleInput}
                crrFormData={item}
                addMore={addMore}
                RemoveSpare={() => {}}
                Permissins={Permissins}
                addRemoveBtn={addRemoveBtn}
                bettery_type={1}
                BatteryList={BatteryList}
              />
            ))}
          </div>
        ) : (
          ""
        )} */}

        {(Permissins?.has_9v && Permissins?.accessory_type == "Battery") || all_condition_true ? (
          <div className=" bg-gray py-4 px-4 mt-4">
             <div className="d-flex align-items-center justify-content-between">
               <h2 className="heading">
               {"Battery Information with 9 Volt"}
                </h2>
               </div>
            {/* <div className="d-flex align-items-center justify-content-between">
              <h2 className="heading">
                {"Battery Information with 9 Volt"}
                <button
                  onClick={() => addRemoveBtn("add", "has_9v_spare")}
                  className="btn mx-2 btn-sm btn-primary "
                  disabled={!formData?.no_spares_toggle}
                  type="button"
                >
                  +
                </button>
              </h2>
              <div className="toggle">
                <label className="d-block mb-2">
                  <b>Unknown</b>
                </label>
                <CustomToggleButton
                  ToggleName="no_has_9v_toggle"
                  ToggleValue={
                    formData?.no_has_9v_toggle ||
                    formData?.has_9v[0]?.battery_type_id === "unknown"
                  }
                  // changeHandler={handleCheckBox}
                  changeHandler={(e) =>
                    handle_unknow_checkbox(e, "has_9v", "no_has_9v_toggle")
                  }
                />
              </div>
            </div> */}

            {formData?.has_9v?.map((item, index) => (
              <StdlnBatteryinformation
                is_unknowntrue={
                  item?.battery_type_id === "unknown" ||
                  formData?.no_has_9v_toggle
                }
                keyName={"has_9v"}
                title="Battery Information"
                crrIndex={index}
                formData={formData}
                setFormData={setFormData}
                handleCheckBox={handleCheckBox}
                handleInput={handleInput}
                crrFormData={item}
                addMore={addMore}
                Permissins={Permissins}
                bettery_type={2}
                BatteryList={BatteryList}
              />
            ))}
          </div>
        ) : (
          ""
        )}
        {/* {formData?.has_9v_spare.length > 0 || all_condition_true ? (
          <div className=" bg-gray py-4 px-4 mt-4">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="heading">
                {"Spare Battery Information with 9 Volt"}
                <button
                  onClick={() => addRemoveBtn("add", "has_9v_spare")}
                  className="btn mx-2 btn-sm btn-primary "
                  disabled={!formData?.no_spares_toggle}
                  type="button"
                >
                  +
                </button>
                <button
                  onClick={() => addRemoveBtn("remove", "has_9v_spare")}
                  className="btn mx-2 btn-sm btn-danger "
                  type="button"
                >
                  -
                </button>
              </h2>

              <div className="toggle">
                <label className="d-block mb-2">
                  <b>Unknown</b>
                </label>
                <CustomToggleButton
                  ToggleName="no_9v_spare_toggle"
                  ToggleValue={
                    formData?.no_9v_spare_toggle ||
                    formData?.has_9v_spare?.[0]?.battery_type_id === "unknown"
                  }
                  // changeHandler={handleCheckBox}
                  changeHandler={(e) =>
                    handle_unknow_checkbox(
                      e,
                      "has_9v_spare",
                      "no_9v_spare_toggle"
                    )
                  }
                />
              </div>
            </div>
            {formData?.has_9v_spare?.map((item, index) => (
              <SpareBatteryinformation
                is_unknowntrue={
                  item?.battery_type_id === "unknown" ||
                  formData?.no_9v_spare_toggle
                }
                keyName={"has_9v_spare"}
                title="Spare Battery Information"
                crrIndex={index}
                formData={formData}
                setFormData={setFormData}
                handleCheckBox={handleCheckBox}
                handleInput={handleInput}
                crrFormData={item}
                addMore={addMore}
                RemoveSpare={() => {}}
                Permissins={Permissins}
                addRemoveBtn={addRemoveBtn}
                bettery_type={2}
                BatteryList={BatteryList}
              />
            ))}
          </div>
        ) : (
          ""
        )} */}

        {(Permissins?.has_installby && Permissins?.accessory_type == "Battery") || all_condition_true ? (
          <div className=" bg-gray py-4 px-4 mt-4">
            <div className="d-flex align-items-center justify-content-between">
               <h2 className="heading">
               {"Battery Information with Install By Date"}
                </h2>
               </div>
            {/* <div className="d-flex align-items-center justify-content-between">
              <h2 className="heading">
                {"Battery Information with Install By Date"}
                <button
                  onClick={() => addRemoveBtn("add", "has_installby_spare")}
                  className="btn mx-2 btn-sm btn-primary "
                  disabled={!formData?.no_spares_toggle}
                  type="button"
                >
                  +
                </button>
              </h2>
              <div className="toggle">
                <label className="d-block mb-2">
                  <b>Unknown</b>
                </label>
                <CustomToggleButton
                  ToggleName="no_has_installby_toggle"
                  ToggleValue={
                    formData?.no_has_installby_toggle ||
                    formData?.has_installby[0]?.battery_type_id === "unknown"
                  }
                  // changeHandler={handleCheckBox}
                  changeHandler={(e) =>
                    handle_unknow_checkbox(
                      e,
                      "has_installby",
                      "no_has_installby_toggle"
                    )
                  }
                />
              </div>
            </div> */}

            {formData?.has_installby?.map((item, index) => (
              <StdlnBatteryinformation
                is_unknowntrue={
                  item?.battery_type_id === "unknown" ||
                  formData?.no_has_installby_toggle
                }
                keyName={"has_installby"}
                title="Battery Information"
                crrIndex={index}
                formData={formData}
                setFormData={setFormData}
                handleCheckBox={handleCheckBox}
                handleInput={handleInput}
                crrFormData={item}
                addMore={addMore}
                Permissins={Permissins}
                bettery_type={3}
                BatteryList={BatteryList}
              />
            ))}
          </div>
        ) : (
          ""
        )}

        {/* {formData?.has_installby_spare.length > 0 || all_condition_true ? (
          <div className=" bg-gray py-4 px-4 mt-4">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="heading">
                {"Spare Battery Information with install By Date"}
                <button
                  onClick={() => addRemoveBtn("add", "has_installby_spare")}
                  className="btn mx-2 btn-sm btn-primary "
                  disabled={!formData?.no_spares_toggle}
                  type="button"
                >
                  +
                </button>
                <button
                  onClick={() => addRemoveBtn("remove", "has_installby_spare")}
                  className="btn mx-2 btn-sm btn-danger "
                  type="button"
                >
                  -
                </button>
              </h2>

              <div className="toggle">
                <label className="d-block mb-2">
                  <b>Unknown</b>
                </label>
                <CustomToggleButton
                  ToggleName="no_installby_spare_toggle"
                  ToggleValue={
                    formData?.no_installby_spare_toggle ||
                    formData?.has_installby_spare?.[0]?.battery_type_id ===
                      "unknown"
                  }
                  // changeHandler={handleCheckBox}
                  changeHandler={(e) =>
                    handle_unknow_checkbox(
                      e,
                      "has_installby_spare",
                      "no_installby_spare_toggle"
                    )
                  }
                />
              </div>
            </div>

            {formData?.has_installby_spare?.map((item, index) => (
              <SpareBatteryinformation
                is_unknowntrue={
                  item?.battery_type_id === "unknown" ||
                  formData?.no_installby_spare_toggle
                }
                keyName={"has_installby_spare"}
                title="Spare Battery Information"
                crrIndex={index}
                formData={formData}
                setFormData={setFormData}
                handleCheckBox={handleCheckBox}
                handleInput={handleInput}
                crrFormData={item}
                addMore={addMore}
                RemoveSpare={() => {}}
                Permissins={Permissins}
                addRemoveBtn={addRemoveBtn}
                bettery_type={3}
                BatteryList={BatteryList}
              />
            ))}
          </div>
        ) : (
          ""
        )} */}

        {(Permissins?.has_man && Permissins?.accessory_type == "Battery") || all_condition_true ? (
          <div className=" bg-gray py-4 px-4 mt-4">
             <div className="d-flex align-items-center justify-content-between">
               <h2 className="heading">
               {"Battery Information with Manufactured Date"}
                </h2>
               </div>
            {/* <div className="d-flex align-items-center justify-content-between">
              <h2 className="heading">
                {"Battery Information with Manufactured Date"}
                <button
                  onClick={() => addRemoveBtn("add", "has_man_spare")}
                  className="btn mx-2 btn-sm btn-primary "
                  disabled={!formData?.no_spares_toggle}
                  type="button"
                >
                  +
                </button>
              </h2>
              <div className="toggle">
                <label className="d-block mb-2">
                  <b>Unknown</b>
                </label>
                <CustomToggleButton
                  ToggleName="no_has_man_toggle"
                  ToggleValue={
                    formData?.no_has_man_toggle ||
                    formData?.has_man[0]?.battery_type_id === "unknown"
                  }
                  // changeHandler={handleCheckBox}
                  changeHandler={(e) =>
                    handle_unknow_checkbox(e, "has_man", "no_has_man_toggle")
                  }
                />
              </div>
            </div> */}
            {/* {JSON.stringify(formData?.has_man)} */}
            {formData?.has_man?.map((item, index) => (
              <StdlnBatteryinformation
                is_unknowntrue={
                  item?.battery_type_id === "unknown" ||
                  formData?.no_has_man_toggle
                }
                keyName={"has_man"}
                title="Battery Information"
                crrIndex={index}
                formData={formData}
                setFormData={setFormData}
                handleCheckBox={handleCheckBox}
                handleInput={handleInput}
                crrFormData={item}
                addMore={addMore}
                Permissins={Permissins}
                bettery_type={4}
                BatteryList={BatteryList}
                is_spare_manu={1}
              />
            ))}
          </div>
        ) : (
          ""
        )}
        {/* {formData?.has_man_spare.length > 0 || all_condition_true ? (
          <div className=" bg-gray py-4 px-4 mt-4">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="heading">
                {"Spare Battery Information with Manufactured Date"}
                <button
                  onClick={() => addRemoveBtn("add", "has_man_spare")}
                  className="btn mx-2 btn-sm btn-primary "
                  disabled={!formData?.no_spares_toggle}
                  type="button"
                >
                  +
                </button>
                <button
                  onClick={() => addRemoveBtn("remove", "has_man_spare")}
                  className="btn mx-2 btn-sm btn-danger "
                  type="button"
                >
                  -
                </button>
              </h2>

              <div className="toggle">
                <label className="d-block mb-2">
                  <b>Unknown</b>
                </label>
                <CustomToggleButton
                  ToggleName="no_has_man_spare_toggle"
                  ToggleValue={
                    formData?.no_has_man_spare_toggle ||
                    formData?.has_man_spare?.[0]?.battery_type_id === "unknown"
                  }
                  // changeHandler={handleCheckBox}
                  changeHandler={(e) =>
                    handle_unknow_checkbox(
                      e,
                      "has_man_spare",
                      "no_has_man_spare_toggle"
                    )
                  }
                />
              </div>
            </div>
            {formData?.has_man_spare?.map((item, index) => (
              <SpareBatteryinformation
                is_unknowntrue={
                  item?.battery_type_id === "unknown" ||
                  formData?.no_has_man_spare_toggle
                }
                keyName={"has_man_spare"}
                title="Spare Battery Information"
                crrIndex={index}
                formData={formData}
                setFormData={setFormData}
                handleCheckBox={handleCheckBox}
                handleInput={handleInput}
                crrFormData={item}
                addMore={addMore}
                RemoveSpare={() => {}}
                Permissins={Permissins}
                addRemoveBtn={addRemoveBtn}
                bettery_type={4}
                BatteryList={BatteryList}
                is_spare_manu={1}
              />
            ))}
          </div>
        ) : (
          ""
        )} */}

        {(Permissins?.has_10pk && Permissins?.accessory_type == "Battery") || all_condition_true ? (
          <div className="bg-gray py-4 px-4 mt-4">
              <div className="d-flex align-items-center justify-content-between">
               <h2 className="heading">
               {"Battery Information 10 Pack"}
                </h2>
               </div>
            {/* <div className="d-flex align-items-center justify-content-between">
              <h2 className="heading">
                {"Battery Information 10 Pack"}
                <button
                  onClick={() => addRemoveBtn("add", "has_10pk_spare")}
                  className="btn mx-2 btn-sm btn-primary "
                  disabled={!formData?.no_spares_toggle}
                  type="button"
                >
                  +
                </button>
              </h2>
              <div className="toggle">
                <label className="d-block mb-2">
                  <b>Unknown</b>
                </label>
                <CustomToggleButton
                  ToggleName="no_has_10pk_toggle"
                  ToggleValue={
                    formData?.no_has_10pk_toggle ||
                    formData?.has_10pk[0]?.battery_type_id === "unknown"
                  }
                  // changeHandler={handleCheckBox}
                  changeHandler={(e) =>
                    handle_unknow_checkbox(e, "has_10pk", "no_has_10pk_toggle")
                  }
                />
              </div>
            </div> */}

            {formData?.has_10pk?.map((item, index) => (
              <StdlnBatteryinformation
                is_unknowntrue={
                  item?.battery_type_id === "unknown" ||
                  formData?.no_has_10pk_toggle
                }
                keyName={"has_10pk"}
                title="Battery Information"
                crrIndex={index}
                formData={formData}
                setFormData={setFormData}
                handleCheckBox={handleCheckBox}
                handleInput={handleInput}
                crrFormData={item}
                addMore={addMore}
                Permissins={Permissins}
                bettery_type={5}
                BatteryList={BatteryList}
              />
            ))}
          </div>
        ) : (
          ""
        )}

        {/* {formData?.has_10pk_spare.length > 0 || all_condition_true ? (
          <div className=" bg-gray py-4 px-4 mt-4">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="heading">
                {"Spare Battery Information 10 Pack"}
                <button
                  onClick={() => addRemoveBtn("add", "has_10pk_spare")}
                  className="btn mx-2 btn-sm btn-primary "
                  disabled={!formData?.no_spares_toggle}
                  type="button"
                >
                  +
                </button>
                <button
                  onClick={() => addRemoveBtn("remove", "has_10pk_spare")}
                  className="btn mx-2 btn-sm btn-danger "
                  type="button"
                >
                  -
                </button>
              </h2>

              <div className="toggle">
                <label className="d-block mb-2">
                  <b>Unknown</b>
                </label>
                <CustomToggleButton
                  ToggleName="no_has_10pk_spare_toggle"
                  ToggleValue={
                    formData?.no_has_10pk_spare_toggle ||
                    formData?.has_10pk_spare[0]?.battery_type_id === "unknown"
                  }
                  // changeHandler={handleCheckBox}
                  changeHandler={(e) =>
                    handle_unknow_checkbox(
                      e,
                      "has_10pk_spare",
                      "no_has_10pk_spare_toggle"
                    )
                  }
                />
              </div>
            </div>
            {formData?.has_10pk_spare?.map((item, index) => (
              <SpareBatteryinformation
                is_unknowntrue={
                  item?.battery_type_id === "unknown" ||
                  formData?.no_has_10pk_spare_toggle
                }
                keyName={"has_10pk_spare"}
                title="Spare Battery Information"
                crrIndex={index}
                formData={formData}
                setFormData={setFormData}
                handleCheckBox={handleCheckBox}
                handleInput={handleInput}
                crrFormData={item}
                addMore={addMore}
                RemoveSpare={() => {}}
                Permissins={Permissins}
                addRemoveBtn={addRemoveBtn}
                bettery_type={5}
                BatteryList={BatteryList}
              />
            ))}
          </div>
        ) : (
          ""
        )} */}
      </div>
    </>
  );
}

export default StdlnParentBatteryInfo;

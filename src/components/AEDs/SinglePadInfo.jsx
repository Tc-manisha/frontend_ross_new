import React from 'react'
import NewAedPadRow from '../../pages/accounts/AedMain/NewAedPadRow'
import Plus from "../../img/Plus.svg";
import { useSelector } from 'react-redux';

const SinglePadInfo = ({
    index,
    AedItem,
    HandleAddPadInfo,
    handleResetBtn,
    padList,
    AedFormData,
    setNewFormData,
    handleRemoveSparePadiatricPadRow,
    handleMoveSpareToMainPadRow,
    handleCalendarChange,
    handleChange,
    handleRemovePadsRow,
    handlePadSpareCrown,
    onInputChangePads,
    handleDNDButton,
    inspection_by,
    contact_id,
    isInventory,
    padResetButton
}) => {
    const PermissionRedux = useSelector(
        (state) => state?.AED_manager?.permissions
      );
    let hasPad = PermissionRedux?.has_pad === 1;
    let hasPedpak = PermissionRedux?.has_pedpak === 1;
    let hasPadpak = PermissionRedux?.has_padpak === 1;
    let hasPedPad = PermissionRedux?.has_ped_pad === 1;
    let hasPedKey = PermissionRedux?.has_ped_key === 1;
    
    return (hasPad || hasPedpak || hasPadpak || hasPedPad || hasPedKey) ?  (
        <div className="col py-2">
            <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
            >
            <h2 className="heading" style={{ width: "100%" }}>
                Pads Information
                {AedItem?.all_pads.some(item => item.is_pediatric === 0) &&
                ((AedItem.aed_brand_id === 8 && AedItem.aed_model_id === 20) ||
                    (AedItem.aed_brand_id === 6 && AedItem.aed_model_id === 18)) ? (
                <img src={"/NOPED.svg"} alt='NoPed' width={20} style={{ margin: '0 0.5%' }} />
                ) : ""}
                <img
                src={Plus}
                onClick={() => HandleAddPadInfo(index, AedItem.aed_id)}
                style={{ cursor: "pointer" }}
                />
            </h2>

            {(AedItem?.dni_array_list.length > 0 &&
                AedItem.dni_array_list.some((item) =>
                item.hasOwnProperty("pid")
                )) ||
                AedItem.all_pads.slice(0, AedItem.default_all_pads.length)
                .length !== AedItem.default_all_pads.length ||
                (AedItem?.deletedPads.length > 0 &&
                AedItem.deletedPads.some(
                    (item) => !item.hasOwnProperty("inventory_id")
                )) ||
                padResetButton ? (
                <button
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
                type="button"
                onClick={() => handleResetBtn(index, 2)}
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
                <td className="border border-r-blue">Pad Type</td>
                <td className="border border-r-blue">Part #</td>
                <td className="border border-r-blue">Expiration Date</td>
                <td className="border border-r-blue">Pad Lot</td>
                <td className="border border-r-blue">Pad UDI</td>
                <td
                    className="border border-r-blue"
                    style={{ maxWidth: "70px", minWidth: "60px" }}
                >
                    Actions
                </td>
                </tr>
            </thead>

            <tbody className="">
                {AedItem?.all_pads?.map((padInfo, Pindex) => (
                <NewAedPadRow
                    AedItem={AedItem}
                    index={index}
                    Pindex={Pindex}
                    padInfo={padInfo}
                    is_readonly={padInfo?.is_readonly || 0}
                    padList={padList}
                    AedFormData={AedFormData}
                    setNewFormData={setNewFormData}
                    handleRemoveSparePadiatricPadRow={
                    handleRemoveSparePadiatricPadRow
                    }
                    handleMoveSpareToMainPadRow={
                    handleMoveSpareToMainPadRow
                    }
                    handleCalendarChange={handleCalendarChange}
                    handleChange={handleChange}
                    handleRemovePadsRow={handleRemovePadsRow}
                    handlePadSpareCrown={handlePadSpareCrown}
                    onInputChangePads={onInputChangePads}
                    aedPadTypeList={AedItem?.aedPadTypeList || []}
                    handleDNDButton={handleDNDButton}
                    handleResetBtn={handleResetBtn}
                    inspection_by={inspection_by}
                    contact_id={contact_id}
                    isInventory={isInventory}
                />
                ))}
            </tbody>

            </table>
        </div>
    ) : null
}

export default SinglePadInfo
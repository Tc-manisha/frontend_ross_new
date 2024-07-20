import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
// import "../../outOfServiceModal/outOfServiceModal.scss";
import Modal from "react-bootstrap/Modal";
import { FormControlLabel, Switch, Button } from "@mui/material";
import { toast } from "react-toastify";
import { DataGrid } from "devextreme-react";
import { Column, Paging, Scrolling } from "devextreme-react/data-grid";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { FormatDate } from "../../../../helper/Common";
import moment from "moment";
import { CallGETAPI, CallPOSTAPI } from "../../../../helper/API";

const EditSiteListModel = ({
  openSitelistModel,
  setOpenSitelistModel,
  secName,
  Pindex,
  index,
  setNewFormData,
  Bindex,
  inspection_by,
  AedFormData,
  contact_id,
  crrFormData,
}) => {
  const handleClose = () => {
    setOpenSitelistModel(false);
  };
  const [siteList, setSiteList] = useState([]);
  const [selectSite, setSelectedSite] = useState("");

  const fetchLoad = async () => {
    const res = await CallGETAPI("account/fetch-site-inventory");
    console.log(res?.data?.data);
    setSiteList(res?.data?.data || []);
  };

  useEffect(() => {
    fetchLoad();
  }, []);

  const aed_brand_id = AedFormData.brand;
  const aed_model_id = AedFormData.model_name;

  const [addAedInventoryModal, setAedInventoryModal] = useState(true);
  const [batteryInventory, setBatteryInventory] = useState([]);
  const [padInventory, setPadInventory] = useState([]);
  const [isDNI, setIsDNI] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedBatteryRows, setSelectedBatteryRows] = useState([]);
  const [selectedPadRows, setSelectedPadRows] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState("");

  const fetchBatteryInventaryData = async () => {
    if (
      (secName === "has_battery" ||
        secName === "has_battery_spare" ||
        secName === "has_9v" ||
        secName === "has_9v_spare" ||
        secName === "has_installby" ||
        secName === "has_installby_spare" ||
        secName === "has_man" ||
        secName === "has_man_spare" ||
        secName === "has_10pk" ||
        secName === "has_10pk_spare" ||
        secName === "ChargePakInformation" ||
        secName === "SpareChargePakInformation") &&
      selectSite != ""
    ) {
      var body = {
        section_name: secName,
        contact_id: contact_id,
        model_id: aed_model_id,
        brand_id: aed_brand_id,
      };

      let payload = {
        section_name: secName.includes("_spare")
          ? secName.replace("_spare", "")
          : secName === "ChargePakInformation" ||
            secName === "SpareChargePakInformation"
          ? "charge_pack"
          : secName,
        site_id: selectSite,
        brand_id: AedFormData?.brand,
        model_id: AedFormData?.model_name,
      };
      var response = await CallPOSTAPI(
        "account/get-site-battery-inventory",
        payload
      );
      if (response.status === true) {
        var data = response?.data;

        if (data?.batteryInfo) {
          for (
            let invent = data.batteryInfo.length - 1;
            invent >= 0;
            invent--
          ) {
            const element = data.batteryInfo[invent];
            let quantityUpdated = false; // Flag to check if quantity is updated
            for (
              let index2 = 0;
              index2 < AedFormData[`${secName.replace(/'/g, "")}`].length;
              index2++
            ) {
              if (
                secName === "has_9v" ||
                secName === "has_10pk" ||
                secName === "has_battery" ||
                secName === "has_installby" ||
                secName === "has_man" ||
                secName === "ChargePakInformation"
              ) {
                const element2 =
                  AedFormData[`${secName.replace(/'/g, "")}`][index2];
                const secSubName =
                  secName === "has_9v" || secName === "has_9v_spare"
                    ? "has_9v_spare"
                    : secName === "has_10pk" || secName === "has_10pk_spare"
                    ? "has_10pk_spare"
                    : secName === "has_battery" ||
                      secName === "has_battery_spare"
                    ? "has_battery_spare"
                    : secName === "has_installby" ||
                      secName === "has_installby_spare"
                    ? "has_installby_spare"
                    : secName === "has_man" || secName === "has_man_spare"
                    ? "has_man_spare"
                    : secName === "ChargePakInformation" ||
                      secName === "SpareChargePakInformation"
                    ? "SpareChargePakInformation"
                    : "";

                const element3 = AedFormData[secSubName][index2];

                if (element.sbid === element2?.inventory_id) {
                  element.quantity--;
                  quantityUpdated = true;
                  setBatteryInventory([...data.batteryInfo]);
                }
                if (element.sbid === element3?.inventory_id) {
                  //
                  element.quantity--;
                  quantityUpdated = true;
                  setBatteryInventory([...data.batteryInfo]);
                }
              } else {
                const element2 =
                  AedFormData[`${secName.replace(/'/g, "")}`][index2];
                console.log({ element2 });
                const secSubName =
                  secName === "has_9v" || secName === "has_9v_spare"
                    ? "has_9v"
                    : secName === "has_10pk" || secName === "has_10pk_spare"
                    ? "has_10pk"
                    : secName === "has_battery" ||
                      secName === "has_battery_spare"
                    ? "has_battery"
                    : secName === "has_installby" ||
                      secName === "has_installby_spare"
                    ? "has_installby"
                    : secName === "has_man" || secName === "has_man_spare"
                    ? "has_man"
                    : secName === "ChargePakInformation" ||
                      secName === "SpareChargePakInformation"
                    ? "ChargePakInformation"
                    : "";
                console.log(secSubName);
                const element3 = AedFormData[secSubName][index2];
                console.log({ element3 });

                if (element.sbid === element2?.inventory_id) {
                  element.quantity--;
                  quantityUpdated = true;
                  setBatteryInventory([...data.batteryInfo]);
                }
                if (element.sbid === element3?.inventory_id) {
                  element.quantity--;
                  quantityUpdated = true;
                  setBatteryInventory([...data.batteryInfo]);
                }
              }
            }
            if (element.quantity === 0) {
              data.batteryInfo.splice(invent, 1);
              setBatteryInventory([...data.batteryInfo]);
              quantityUpdated = true;
            }
            if (!quantityUpdated) {
              setBatteryInventory([...data.batteryInfo]);
            }
          }
        }
        setLoading(false);
      }
    }
  };
  console.log({ batteryInventory });
  const fetchPadInventaryData = async () => {
    if (
      (secName === "AdultPadInformation" ||
        secName === "SpareAdultPadInfo" ||
        secName === "AdultPadPakInfo" ||
        secName === "SpareAdultPadPakInfo" ||
        secName === "PediatricPadInformation" ||
        secName === "sparePadricPadInfo" ||
        secName === "PediatricPakPadInformation" ||
        secName === "sparePadricPakPad") &&
      selectSite != ""
    ) {
      var body = {
        contact_id: contact_id,
        model_id: aed_model_id,
        brand_id: aed_brand_id,
      };

      let payload = {
        section_name:
          secName === "AdultPadInformation" || secName === "SpareAdultPadInfo"
            ? "adult_pad_info"
            : secName === "AdultPadPakInfo" ||
              secName === "SpareAdultPadPakInfo"
            ? "adult_pad_pak_info"
            : secName === "PediatricPadInformation" ||
              secName === "sparePadricPadInfo"
            ? "pediatric_pad_info"
            : secName === "PediatricPakPadInformation" ||
              secName === "sparePadricPakPad"
            ? "pediatric_pak_pad_info"
            : "",
        site_id: selectSite,
        brand_id: AedFormData?.brand,
        model_id: AedFormData?.model_name,
      };
      var response = await CallPOSTAPI(
        "account/get-site-pad-inventory/",
        payload
      );
      if (response.status === true) {
        var data = response?.data;

        if (data?.padInfo) {
          for (let invent = data?.padInfo.length - 1; invent >= 0; invent--) {
            const element = data?.padInfo[invent];
            let quantityUpdated = false; // Flag to check if quantity is updated
            for (
              let index2 = 0;
              index2 < AedFormData[`${secName.replace(/'/g, "")}`].length;
              index2++
            ) {
              if (
                secName === "AdultPadInformation" ||
                secName === "AdultPadPakInfo" ||
                secName === "PediatricPadInformation" ||
                secName === "PediatricPakPadInformation"
              ) {
                const element2 =
                  AedFormData[`${secName.replace(/'/g, "")}`][index2];
                const secSubName =
                  secName === "AdultPadInformation" ||
                  secName === "SpareAdultPadInfo"
                    ? "SpareAdultPadInfo"
                    : secName === "AdultPadPakInfo" ||
                      secName === "SpareAdultPadPakInfo"
                    ? "SpareAdultPadPakInfo"
                    : secName === "PediatricPadInformation" ||
                      secName === "sparePadricPadInfo"
                    ? "sparePadricPadInfo"
                    : secName === "PediatricPakPadInformation" ||
                      secName === "sparePadricPakPad"
                    ? "sparePadricPakPad"
                    : "";

                const element3 = AedFormData[secSubName][index2];
                console.log(element3);
                if (element.spid === element2?.inventory_id) {
                  element.quantity--;
                  quantityUpdated = true;
                  setPadInventory([...data.padInfo]);
                }
                if (element.spid === element3?.inventory_id) {
                  element.quantity--;
                  quantityUpdated = true;
                  setPadInventory([...data.padInfo]);
                }
              } else {
                const element2 =
                  AedFormData[`${secName.replace(/'/g, "")}`][index2];
                const secSubName =
                  secName === "AdultPadInformation" ||
                  secName === "SpareAdultPadInfo"
                    ? "AdultPadInformation"
                    : secName === "AdultPadPakInfo" ||
                      secName === "SpareAdultPadPakInfo"
                    ? "AdultPadPakInfo"
                    : secName === "PediatricPadInformation" ||
                      secName === "sparePadricPadInfo"
                    ? "PediatricPadInformation"
                    : secName === "PediatricPakPadInformation" ||
                      secName === "sparePadricPakPad"
                    ? "PediatricPakPadInformation"
                    : "";
                console.log(secSubName);
                const element3 = AedFormData[secSubName][index2];
                console.log(element3);
                if (element.spid === element2?.inventory_id) {
                  element.quantity--;
                  quantityUpdated = true;
                  setPadInventory([...data.padInfo]);
                }
                if (element.spid === element3?.inventory_id) {
                  element.quantity--;
                  quantityUpdated = true;
                  setPadInventory([...data.padInfo]);
                }
              }
            }
            if (element.quantity === 0) {
              data.padInfo.splice(invent, 1);
              setPadInventory([...data.padInfo]);
              quantityUpdated = true;
            }
            if (!quantityUpdated) {
              setPadInventory([...data.padInfo]);
            }
          }
        }

        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (selectSite) {
      setBatteryInventory("");
      setPadInventory("");
      fetchBatteryInventaryData();
      fetchPadInventaryData();
    }
  }, [selectSite]);

  const handleCellClick = (e) => {
    setSelectedRowIndex(e.rowIndex);
    let name =
      secName === "has_battery" ||
      secName === "has_battery_spare" ||
      secName === "has_9v" ||
      secName === "has_9v_spare" ||
      secName === "has_installby" ||
      secName === "has_installby_spare" ||
      secName === "has_man" ||
      secName === "has_man_spare" ||
      secName === "has_10pk" ||
      secName === "has_10pk_spare" ||
      secName === "ChargePakInformation" ||
      secName === "SpareChargePakInformation"
        ? "battery"
        : "pads";
    console.log({ name });
    if (name === "battery") {
      const selectedBatteryRowData = batteryInventory.filter(
        (row) => row?.sbid === e?.data?.sbid
      );
      setSelectedBatteryRows(selectedBatteryRowData);
    } else {
      const selectedPadRowData = padInventory.filter(
        (row) => row?.spid === e?.data?.spid
      );
      setSelectedPadRows(selectedPadRowData);
      console.log({ padInventory });
      console.log({ selectedPadRowData });
    }
  };

  const handleBatteryRowQnty = () => {
    const Bfd = [...batteryInventory];
    if (Bfd[selectedRowIndex]) {
      Bfd[selectedRowIndex].quantity = Bfd[selectedRowIndex].quantity - 1;
    }
    setBatteryInventory(Bfd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({AedFormData})
    if (
      secName === "has_battery" ||
      secName === "has_battery_spare" ||
      secName === "has_9v" ||
      secName === "has_9v_spare" ||
      secName === "has_installby" ||
      secName === "has_installby_spare" ||
      secName === "has_man" ||
      secName === "has_man_spare" ||
      secName === "has_10pk" ||
      secName === "has_10pk_spare" ||
      secName === "ChargePakInformation" ||
      secName === "SpareChargePakInformation"
    ) {
      const currentDate = new Date().toISOString().split('T')[0];
      const formattedDate = moment(currentDate).format("YYYY-MM-DD")
    //   const formattedDate = `${
    //     currentDate.getMonth() + 1
    // }/${currentDate.getDate()}/${currentDate.getFullYear()}`;  
      console.log({formattedDate})
      handleBatteryRowQnty();
      const fd = { ...AedFormData };
      console.log({ AedFormData });
      const battery = secName.replace(/'/g, "");
      console.log({ battery });
      console.log({Bindex})
      console.log(selectedBatteryRows[0]);
    //   console.log(fd[`${battery}`])
      
    

      fd[`${battery}`][Bindex].battery_udi =
        selectedBatteryRows[0]?.battery_udi;
      fd[`${battery}`][Bindex].battery_lot =
        selectedBatteryRows[0]?.battery_lot;
      fd[`${battery}`][Bindex].battery_expiration =
        selectedBatteryRows[0]?.battery_expiration;
      fd[`${battery}`][Bindex].manufactured_date =
        selectedBatteryRows[0]?.manufactured_date;
      fd[`${battery}`][Bindex].install_date = formattedDate; 
      fd[`${battery}`][Bindex].battery_type_id =
        selectedBatteryRows[0]?.battery_type_id;
        fd[`${battery}`][Bindex].battery_serial =
        selectedBatteryRows[0]?.battery_serial;
        fd[`${battery}`][Bindex].install_9v_date = secName === "has_9v" ? formattedDate : 'N/A';
        fd[`${battery}`][Bindex].charge_pak_part =
        selectedBatteryRows[0]?.battery_type_id;
      fd[`${battery}`][Bindex].inventory_id = selectedBatteryRows[0]?.sbid;

      fd[`${battery}`][Bindex].charge_pak_uid =
        selectedBatteryRows[0]?.charge_pak_uid;
      fd[`${battery}`][Bindex].pad_1_expiration =
        selectedBatteryRows[0]?.pad1?.pad_expiration;
      fd[`${battery}`][Bindex].pad_1_lot =
        selectedBatteryRows[0]?.pad1?.pad_lot;
      fd[`${battery}`][Bindex].pad_1_part =
        selectedBatteryRows[0]?.pad1?.pad_type_id;

      fd[`${battery}`][Bindex].pad_2_expiration =
        selectedBatteryRows[0]?.pad2?.pad_expiration;
      fd[`${battery}`][Bindex].pad_2_lot =
        selectedBatteryRows[0]?.pad2?.pad_lot;
      fd[`${battery}`][Bindex].pad_2_part =
        selectedBatteryRows[0]?.pad2?.pad_type_id;
        fd[`${battery}`][Bindex].sbid =
        selectedBatteryRows[0]?.sbid;
         
        console.log({fd})
        fd?.useSbidInventory.push(selectedBatteryRows[0]?.sbid);
      setNewFormData(fd);
    } else {
      const fd = { ...AedFormData };
      console.log({ fd });
      const pad = secName.replace(/'/g, "");
      console.log({ pad });
      fd[`${pad}`][Bindex].pad_udi = selectedPadRows[0]?.pad_udi;
      fd[`${pad}`][Bindex].pad_lot = selectedPadRows[0]?.pad_lot;
      fd[`${pad}`][Bindex].pad_expiration = selectedPadRows[0]?.pad_expiration;
      fd[`${pad}`][Bindex].pad_type_id = selectedPadRows[0]?.pad_type_id;
      fd[`${pad}`][Bindex].pad_udi = selectedPadRows[0]?.pad_udi;
      fd[`${pad}`][Bindex].inventory_id = selectedPadRows[0]?.spid;
      fd[`${pad}`][Bindex].spid = selectedPadRows[0]?.spid;
      
      if (fd) {
        if (!Array.isArray(fd.useSpidInventory)) {
          fd.useSpidInventory = [];
        }

        if (selectedPadRows[0] && selectedPadRows[0].spid) {
          fd.useSpidInventory.push(selectedPadRows[0].spid);
        }
      }
      // fd?.useSpidInventory.push(selectedPadRows[0]?.spid);
      setNewFormData(fd);
    }
    setSelectedSite("");
    setSelectedBatteryRows([]);
    setSelectedPadRows([]);
    handleClose();
  };

  // console.log('batteryInventory: ', batteryInventory)
  console.log('AedFormData: ', AedFormData)

  const renderCheckBox = (e) => {
    const rowData = e;
    const is_selected =
      secName === "has_battery" ||
      secName === "has_battery_spare" ||
      secName === "has_9v" ||
      secName === "has_9v_spare" ||
      secName === "has_installby" ||
      secName === "has_installby_spare" ||
      secName === "has_man" ||
      secName === "has_man_spare" ||
      secName === "has_10pk" ||
      secName === "has_10pk_spare" ||
      secName === "ChargePakInformation" ||
      secName === "SpareChargePakInformation"
        ? selectedBatteryRows?.find((row) => row.sbid === e.data.sbid)
        : selectedPadRows?.find((row) => row.spid === e.data.spid);

    // let batteryRowIndex = AedFormData.battery_info[Bindex]?.inventory_id
    // let padRowIndex = AedFormData.all_pads[Pindex]?.inventory_id
    // const is_default_checked = secName ? batteryRowIndex === e.data.sbid : padRowIndex === e.data.spid;

    return (
      <>
        <input
          type="checkbox"
          value={e.value}
          name={"select_row"}
          checked={is_selected || 0}
          // checked={(is_selected || is_default_checked) ? true : false}
          onChange={() => handleCellClick(rowData)}
        />
      </>
    );
  };

  const renderDateBatteryCell = (battery) => {
    if (secName) {
      const dateField = battery.manufactured_date
        ? "manufactured_date"
        : battery.battery_expiration
        ? "battery_expiration"
        : "install_date";

      const imageSourceMap = {
        manufactured_date: "/BatteryMfgr.svg",
        battery_expiration: "/Battery.png",
        install_date: "/Battery.png",
      };

      return (
        <div>
          {battery[dateField] && (
            <img
              src={imageSourceMap[dateField]}
              alt={dateField}
              style={{
                width: dateField === "manufactured_date" ? "20px" : undefined,
                height: dateField === "manufactured_date" ? "20px" : undefined,
                marginRight: "5%",
              }}
            />
          )}
          {battery[dateField] ? (
            <span>{FormatDate(battery[dateField])}</span>
          ) : (
            <span>N/A</span>
          )}
        </div>
      );
    }
  };

  const renderDatePadCell = (pad) => {
    const dateField = pad.pad_expiration ? "pad_expiration" : "";

    return (
      <div>
        {pad[dateField] && (
          <img
            src={
              pad.is_pediatric === 1 ? "/child-Vector.png" : "/people-Group.svg"
            }
            alt={
              pad.is_pediatric === 1 ? "child-Vector.png" : "people-Group.svg"
            }
            style={{
              width: pad.is_pediatric === 1 ? "20px" : undefined,
              height: pad.is_pediatric === 1 ? "32px" : undefined,
              marginRight: "5%",
            }}
          />
        )}
        {pad[dateField] ? (
          <span>{FormatDate(pad[dateField])}</span>
        ) : (
          <span>N/A</span>
        )}
      </div>
    );
  };

  const renderDniCell = (data) => {
    const feild = data.dni;
    return (
      <div>
        {feild === 1 ? (
          <DoneIcon color="success" />
        ) : (
          <CloseIcon color="error" />
        )}
      </div>
    );
  };

  if (padInventory) {
    padInventory?.sort(
      (a, b) => new Date(a.pad_expiration) - new Date(b.pad_expiration)
    );
  }
  if (batteryInventory) {
    batteryInventory.sort(
      (a, b) => new Date(a.render_date) - new Date(b.render_date)
    );
  }

  console.log({ batteryInventory });
  console.log({ padInventory });

  return (
    <>
      <Modal
        show={openSitelistModel}
        onHide={handleClose}
        // dialogClassName="modal-half"
        // aria-labelledby="example-custom-modal-styling-title"
        size="lg"
        style={{ maxWidth: "800px", marginLeft: "25%", marginTop: "8%" }}
        // id="outofservice-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-3">
            <span>Standalone Inventory</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-container" id="outofservice-modal-content">
            <div className="my-modal-section">
              <div className="row">
                <div className="col-md-12 mx-auto">
                  <Form
                    class=""
                    // onSubmit={(e)=> handleSubmit(e)}
                    // noValidate
                    // validated={validated}
                    // id="outofservice-form"
                  >
                    <div
                      className="bottom-border-blue py-4 px-2"
                      style={{
                        background: "#eee",
                      }}
                    >
                      <div className="row" style={{ maxWidth: "300px" }}>
                        <Form.Group className="col-md mb-3">
                          <Form.Label>Site </Form.Label>
                          <select
                            className="form-control"
                            name="loaner_rental_serial"
                            value={selectSite}
                            onChange={(e) => setSelectedSite(e.target.value)}
                          >
                            <option value="" key={0}>
                              --Select One--
                            </option>
                            {siteList?.map((item, index) => (
                              <option key={index} value={item?.site_id}>
                                {item?.site_name}
                              </option>
                            ))}
                          </select>
                        </Form.Group>
                      </div>

                      <div className="upper-div">
                        {loading && selectSite == "" ? (
                          <>{/* <Loading /> */} </>
                        ) : (
                          <>
                            <DataGrid
                              className="col data-grid"
                              onCellClick={(e) =>
                                handleCellClick(
                                  e,
                                  secName === "has_battery" ||
                                    secName === "has_battery_spare" ||
                                    secName === "has_9v" ||
                                    secName === "has_9v_spare" ||
                                    secName === "has_installby" ||
                                    secName === "has_installby_spare" ||
                                    secName === "has_man" ||
                                    secName === "has_man_spare" ||
                                    secName === "has_10pk" ||
                                    secName === "has_10pk_spare" ||
                                    secName === "ChargePakInformation" ||
                                    secName === "SpareChargePakInformation"
                                    ? "battery"
                                    : "pads"
                                )
                              }
                              dataSource={
                                secName === "has_battery" ||
                                secName === "has_battery_spare" ||
                                secName === "has_9v" ||
                                secName === "has_9v_spare" ||
                                secName === "has_installby" ||
                                secName === "has_installby_spare" ||
                                secName === "has_man" ||
                                secName === "has_man_spare" ||
                                secName === "has_10pk" ||
                                secName === "has_10pk_spare" ||
                                secName === "ChargePakInformation" ||
                                secName === "SpareChargePakInformation"
                                  ? batteryInventory
                                  : padInventory
                              }
                              height={"auto"}
                              width={"auto"}
                              keyExpr={
                                secName === "has_battery" ||
                                secName === "has_battery_spare" ||
                                secName === "has_9v" ||
                                secName === "has_9v_spare" ||
                                secName === "has_installby" ||
                                secName === "has_installby_spare" ||
                                secName === "has_man" ||
                                secName === "has_man_spare" ||
                                secName === "has_10pk" ||
                                secName === "has_10pk_spare" ||
                                secName === "ChargePakInformation" ||
                                secName === "SpareChargePakInformation"
                                  ? "sbid"
                                  : "spid"
                              }
                              showColumnLines={true}
                              showRowLines={true}
                              showBorders={true}
                              allowSorting={true}
                              rowAlternationEnabled={true}
                              selection={{
                                //mode: 'multiple',
                                //showCheckBoxesMode: 'onClick',
                                allowSelectAll: true,
                                // selectedRowKeys: secName ? selectedBatteryRows.sbid : selectedPadRows.spid
                              }}
                              //onSelectionChanged={(e) => handleCheckboxSelectionChanged(e, secName ? 'battery' : 'pads')}
                            >
                              <Column
                                dataField={
                                  secName === "has_battery" ||
                                  secName === "has_battery_spare" ||
                                  secName === "has_9v" ||
                                  secName === "has_9v_spare" ||
                                  secName === "has_installby" ||
                                  secName === "has_installby_spare" ||
                                  secName === "has_man" ||
                                  secName === "has_man_spare" ||
                                  secName === "has_10pk" ||
                                  secName === "has_10pk_spare" ||
                                  secName === "ChargePakInformation" ||
                                  secName === "SpareChargePakInformation"
                                    ? "bid"
                                    : "pid"
                                }
                                caption="#"
                                cssClass="column-header"
                                allowSorting={false}
                                dataType="string"
                                cellRender={renderCheckBox}
                              />

                              <Column
                                dataField={
                                  secName === "has_battery" ||
                                  secName === "has_battery_spare" ||
                                  secName === "has_9v" ||
                                  secName === "has_9v_spare" ||
                                  secName === "has_installby" ||
                                  secName === "has_installby_spare" ||
                                  secName === "has_man" ||
                                  secName === "has_man_spare" ||
                                  secName === "has_10pk" ||
                                  secName === "has_10pk_spare" ||
                                  secName === "ChargePakInformation" ||
                                  secName === "SpareChargePakInformation"
                                    ? "battery_part"
                                    : "pad_part"
                                }
                                caption="Part #"
                                cssClass="column-header"
                                allowSorting={true}
                                dataType="string"
                                customizeText={(cellInfo) =>
                                  cellInfo.value === "" ? "N/A" : cellInfo.value
                                }
                              />

                              {secName === "has_battery" ||
                              secName === "has_battery_spare" ||
                              secName === "has_9v" ||
                              secName === "has_9v_spare" ||
                              secName === "has_installby" ||
                              secName === "has_installby_spare" ||
                              secName === "has_man" ||
                              secName === "has_man_spare" ||
                              secName === "has_10pk" ||
                              secName === "has_10pk_spare" ||
                              secName === "ChargePakInformation" ||
                              secName === "SpareChargePakInformation" ? (
                                <Column
                                  dataField={"render_date"}
                                  caption="Date"
                                  cssClass="column-header"
                                  allowSorting={true}
                                  dataType="date"
                                  cellRender={(data) =>
                                    renderDateBatteryCell(data.data)
                                  }
                                />
                              ) : (
                                <Column
                                  dataField={"customDate"}
                                  caption="Date"
                                  cssClass="column-header"
                                  allowSorting={true}
                                  dataType="date"
                                  cellRender={(data) =>
                                    renderDatePadCell(data.data)
                                  }
                                />
                              )}

                              <Column
                                dataField={
                                  secName === "has_battery" ||
                                  secName === "has_battery_spare" ||
                                  secName === "has_9v" ||
                                  secName === "has_9v_spare" ||
                                  secName === "has_installby" ||
                                  secName === "has_installby_spare" ||
                                  secName === "has_man" ||
                                  secName === "has_man_spare" ||
                                  secName === "has_10pk" ||
                                  secName === "has_10pk_spare" ||
                                  secName === "ChargePakInformation" ||
                                  secName === "SpareChargePakInformation"
                                    ? "battery_lot"
                                    : "pad_lot"
                                }
                                caption={
                                  secName === "has_battery" ||
                                  secName === "has_battery_spare" ||
                                  secName === "has_9v" ||
                                  secName === "has_9v_spare" ||
                                  secName === "has_installby" ||
                                  secName === "has_installby_spare" ||
                                  secName === "has_man" ||
                                  secName === "has_man_spare" ||
                                  secName === "has_10pk" ||
                                  secName === "has_10pk_spare" ||
                                  secName === "ChargePakInformation" ||
                                  secName === "SpareChargePakInformation"
                                    ? "Battery Lot"
                                    : "Pad Lot"
                                }
                                cssClass="column-header"
                                allowSorting={true}
                                dataType="string"
                                customizeText={(cellInfo) =>
                                  cellInfo.value === "" ? "N/A" : cellInfo.value
                                }
                              />
                              <Column
                                dataField="quantity"
                                caption="Quantity"
                                cssClass="column-header"
                                allowSorting={true}
                                dataType="string"
                              />
                              <Column
                                dataField="customDate"
                                caption="DNI"
                                cssClass="column-header"
                                allowSorting={true}
                                dataType="string"
                                cellRender={(data) => renderDniCell(data.data)}
                              />
                              <Scrolling columnRenderingMode="virtual" />
                              <Paging enabled={false} />
                            </DataGrid>
                          </>
                        )}
                      </div>

                      <div className="row" style={{marginRight: "10px"}}>
                        <Form.Group
                          className="col-md mt-4"
                          style={{display:"flex", justifyContent:"right", width: "82%"}}
                        >
                          <Button
                            className={"btn btn-danger"}
                            variant="danger"
                            type="button"
                            style={{ fontSize: "16px", marginTop: "2px" }}
                            onClick={() => {
                              handleClose();
                            }}
                          >
                            Cancel
                          </Button>
                        </Form.Group>

                        <Form.Group
                          className="col-md mt-4"
                          style={{ maxWidth: "100px" }}
                        >
                          <Button
                            className={"btn btn-success"}
                            variant="success"
                            style={{ fontSize: "16px", marginTop: "2px" }}
                            type="submit"
                            onClick={(e) => handleSubmit(e)}
                            // disabled={switchValue.value === true ? false : true}
                          >
                            Submit
                          </Button>
                        </Form.Group>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
          {/* alert */}
          {/* <div className="my-4">
            <MessageHandler
              status={FormMsg.type}
              msg={FormMsg.msg}
              HandleMessage={setFormMsg}
            />
          </div> */}
        </Modal.Body>
        {/* <Modal.Footer></Modal.Footer> */}
      </Modal>
    </>
  );
};

export default EditSiteListModel;

import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import cancel from "../../../img/Cancel.svg";
import check from "../../../img/Check.svg"
import manufacturedAED from "../../../img/manufactured.png"
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { DataGrid } from "devextreme-react";
import { Column, Paging, Scrolling } from "devextreme-react/data-grid";
import Loading from '../Loading';
import DoneIcon from "@mui/icons-material/Done";
import LockIcon from "@mui/icons-material/Lock";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { FormatDate } from "../../../helper/Common";

const AEDInventoryModal = ({
  inventoryModal,
  setInventoryModal,
  secName,
  api,
  Pindex,
  index,
  setNewFormData,
  Bindex,
  inspection_by,
  AedFormData,
  contact_id
}) => {
console.log({AedFormData})
console.log({secName})
  const aed_brand_id = AedFormData[index].aed_brand_id
  const aed_model_id = AedFormData[index].aed_model_id

  const [addAedInventoryModal, setAedInventoryModal] = useState(true);
  const [batteryInventory, setBatteryInventory] = useState([])
  const [padInventory, setPadInventory] = useState([])
  const [isDNI, setIsDNI] = useState(true);
  const handleClose = () => setInventoryModal(false);
  const [loading, setLoading] = useState(true)
  const [selectedBatteryRows, setSelectedBatteryRows] = useState([]);
  const [selectedPadRows, setSelectedPadRows] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState('')

  const fetchBatteryInventaryData = async () => {
    if (secName) {
      var body = { 'section_name': secName, 'contact_id': contact_id, 'model_id': aed_model_id, 'brand_id': aed_brand_id }
      var response = await CallPOSTAPI(api, body)
      if (response.status === true) {
        var data = response?.data

        if (data?.batteryInfo) {
          for (let invent = data.batteryInfo.length - 1; invent >= 0; invent--) {
            const element = data.batteryInfo[invent];
            let quantityUpdated = false; // Flag to check if quantity is updated
            for (let index2 = 0; index2 < AedFormData[index].battery_info.length; index2++) {
              const element2 = AedFormData[index].battery_info[index2];
              if (element.sbid === element2.inventory_id) {
                element.quantity--;
                quantityUpdated = true;
                setBatteryInventory([...data.batteryInfo]);
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
  }

  const fetchPadInventaryData = async () => {
    if (!secName) {
      var body = { 'contact_id': contact_id, 'model_id': aed_model_id, 'brand_id': aed_brand_id }
      var response = await CallPOSTAPI(api, body)
      if (response.status === true) {
        var data = response?.data

        if (data?.padInfo) {
          for (let invent = data?.padInfo.length - 1; invent >= 0; invent--) {
            const element = data?.padInfo[invent];
            let quantityUpdated = false; // Flag to check if quantity is updated
            for (let index2 = 0; index2 < AedFormData[index].all_pads.length; index2++) {
              const element2 = AedFormData[index].all_pads[index2];
              if (element.spid === element2.inventory_id) {
                element.quantity--;
                quantityUpdated = true;
                setPadInventory([...data.padInfo]);
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

  }

  useEffect(() => {
    fetchBatteryInventaryData()
    fetchPadInventaryData()
  }, [])

  // const handleCellClick = (e) => {
  //   setSelectedRowIndex(e.rowIndex)
  //   let name = secName ? 'battery' : 'pads'
  //   if (name === 'battery') {
  //     const selectedBatteryRowData = batteryInventory.filter(row => row.sbid === e.data.sbid);
  //     setSelectedBatteryRows(selectedBatteryRowData);
  //   } else {
  //     const selectedPadRowData = padInventory.filter(row => row.spid === e.data.spid);
  //     setSelectedPadRows(selectedPadRowData);
  //   }
  // }

  const handleCellClick = (e) => {
    setSelectedRowIndex(e.rowIndex);
    let name = secName ? 'battery' : 'pads';

    if (name === 'battery') {
      const selectedBatteryRowData = batteryInventory.filter(row => row?.sbid === e?.data?.sbid);
      setSelectedBatteryRows(selectedBatteryRowData);
    } else {
      const selectedPadRowData = padInventory.filter(row => row?.spid === e?.data?.spid);
      setSelectedPadRows(selectedPadRowData);
    }
  }


  const handleBatteryRowQnty = () => {
    const Bfd = [...batteryInventory]
    if (Bfd[selectedRowIndex]) {
      Bfd[selectedRowIndex].quantity = Bfd[selectedRowIndex].quantity - 1
    }
    setBatteryInventory(Bfd)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (secName) {
      handleBatteryRowQnty()
      const fd = [...AedFormData];
      fd[index].battery_info[Bindex].battery_udi = selectedBatteryRows[0]?.battery_udi
      fd[index].battery_info[Bindex].battery_lot = selectedBatteryRows[0]?.battery_lot
      fd[index].battery_info[Bindex].battery_expiration = selectedBatteryRows[0]?.battery_expiration
      fd[index].battery_info[Bindex].manufactured_date = selectedBatteryRows[0]?.manufactured_date
      fd[index].battery_info[Bindex].install_date = selectedBatteryRows[0]?.install_date
      fd[index].battery_info[Bindex].battery_type_id = selectedBatteryRows[0]?.battery_type_id
      fd[index].battery_info[Bindex].inventory_id = selectedBatteryRows[0]?.sbid
      setNewFormData(fd)
    }
    else {
      const fd = [...AedFormData];
      fd[index].all_pads[Pindex].pad_udi = selectedPadRows[0]?.pad_udi
      fd[index].all_pads[Pindex].pad_lot = selectedPadRows[0]?.pad_lot
      fd[index].all_pads[Pindex].pad_expiration = selectedPadRows[0]?.pad_expiration
      fd[index].all_pads[Pindex].pad_type_id = selectedPadRows[0]?.pad_type_id
      fd[index].all_pads[Pindex].pad_udi = selectedPadRows[0]?.pad_udi
      fd[index].all_pads[Pindex].inventory_id = selectedPadRows[0]?.spid
      setNewFormData(fd)
    }
    setSelectedBatteryRows([]);
    setSelectedPadRows([]);
    handleClose()
  }

  // console.log('batteryInventory: ', batteryInventory)
  // console.log('AedFormData: ', AedFormData)

  const renderCheckBox = (e) => {
    const rowData = e;
    const is_selected = secName ? selectedBatteryRows?.find(row => row.sbid === e.data.sbid) : selectedPadRows?.find(row => row.spid === e.data.spid)

    // let batteryRowIndex = AedFormData[index].battery_info[Bindex]?.inventory_id
    // let padRowIndex = AedFormData[index].all_pads[Pindex]?.inventory_id
    // const is_default_checked = secName ? batteryRowIndex === e.data.sbid : padRowIndex === e.data.spid;

    return <>
      <input
        type="checkbox"
        value={e.value}
        name={'select_row'}
        checked={is_selected || 0}
        // checked={(is_selected || is_default_checked) ? true : false}
        onChange={() => handleCellClick(rowData)}
      />
    </>
  }

  const renderDateBatteryCell = (battery) => {
    if (secName) {
      const dateField =
        battery.manufactured_date
          ? "manufactured_date"
          : battery.battery_expiration
            ? "battery_expiration"
            : "install_date";

      const imageSourceMap = {
        manufactured_date: '/BatteryMfgr.svg',
        battery_expiration: '/Battery.png',
        install_date: '/Battery.png',
      };

      return (
        <div>
          {battery[dateField] && (
            <img
              src={imageSourceMap[dateField]}
              alt={dateField}
              style={{
                width: dateField === 'manufactured_date' ? '20px' : undefined,
                height: dateField === 'manufactured_date' ? '20px' : undefined,
                marginRight: '5%'
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
    const dateField =
      pad.pad_expiration
        ? "pad_expiration"
        : '';

    return (
      <div>
        {pad[dateField] && (
          <img
            src={pad.is_pediatric === 1 ? '/child-Vector.png' : '/people-Group.svg'}
            alt={pad.is_pediatric === 1 ? 'child-Vector.png' : 'people-Group.svg'}
            style={{
              width: pad.is_pediatric === 1 ? '20px' : undefined,
              height: pad.is_pediatric === 1 ? '32px' : undefined,
              marginRight: '5%'
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
    const feild = data.dni
    return (
      <div>
        {
          feild === 1 ?
            <DoneIcon color="success" />
            :
            <CloseIcon color="error" />
        }
      </div>
    )
  }

  padInventory.sort((a, b) => new Date(a.pad_expiration) - new Date(b.pad_expiration));
  // batteryInventory.sort((a, b) => new Date(a.render_date) - new Date(b.render_date));

  return (<>
    <Modal
      show={inventoryModal}
      onHide={handleClose}
      dialogClassName="modal-120w"
      aria-labelledby="example-custom-modal-styling-title"
      size="lg"
      id="states-modal"
    >
      <Modal.Header >
        <Modal.Title>{inspection_by} Inventory</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mb-3">
        <div className="modal-container">
          <div className="my-modal-section">

            <div className="upper-div">

              {
                loading ?
                  <><Loading /></>
                  :
                  <>
                    <DataGrid
                      className="col data-grid"
                      onCellClick={(e) => handleCellClick(e, secName ? 'battery' : 'pads')}
                      dataSource={secName ? batteryInventory : padInventory}
                      height={"auto"}
                      width={"auto"}
                      keyExpr={secName ? "sbid" : "spid"}
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
                      <Column dataField={secName ? "bid" : "pid"} caption="#" cssClass="column-header" allowSorting={true} dataType="string"
                        cellRender={renderCheckBox}
                      />

                      <Column dataField={secName ? "battery_part" : "pad_part"} caption="Part #" cssClass="column-header" allowSorting={true} dataType="string" customizeText={(cellInfo) => cellInfo.value === '' ? 'N/A' : cellInfo.value} />

                      {
                        secName ?
                          <Column
                            dataField={"render_date"}
                            caption="Date"
                            cssClass="column-header"
                            allowSorting={true}
                            dataType="date"
                            cellRender={(data) => renderDateBatteryCell(data.data)}
                          />
                          :
                          <Column
                            dataField={"customDate"}
                            caption="Date"
                            cssClass="column-header"
                            allowSorting={true}
                            dataType="date"
                            cellRender={(data) => renderDatePadCell(data.data)}
                          />
                      }


                      <Column dataField={secName ? "battery_lot" : "pad_lot"} caption={secName ? "Battery Lot" : "Pad Lot"} cssClass="column-header" allowSorting={true} dataType="string" customizeText={(cellInfo) => cellInfo.value === '' ? 'N/A' : cellInfo.value} />
                      <Column dataField="quantity" caption="Quantity" cssClass="column-header" allowSorting={true} dataType="string" />
                      <Column dataField="customDate" caption="DNI" cssClass="column-header" allowSorting={true} dataType="string" cellRender={(data) => renderDniCell(data.data)} />
                      <Scrolling columnRenderingMode="virtual" />
                      <Paging enabled={false} />
                    </DataGrid>
                  </>
              }

            </div>
          </div>
        </div>
      </Modal.Body>
      {/* <Modal.Footer> */}
      <div className="mt-3 mb-3" style={{ display: "flex", marginLeft: "76%", gap: "9%" }}>
        <button className="Cancel-btn" style={{ borderRadius: "7px" }} onClick={handleClose}>
          Cancel
        </button>
        <button className="submit-btn" type="button" style={{ borderRadius: "7px" }} onClick={handleSubmit}>
          Submit
        </button>
      </div>
      {/* </Modal.Footer> */}
    </Modal >
  </>)
}

export default AEDInventoryModal;
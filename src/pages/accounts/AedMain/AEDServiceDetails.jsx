import React from 'react';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { DataGrid } from "devextreme-react";
import CustomToggleButton2 from "../../../components/common/toggleSwitch/CustomToggle2";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import { Column, Paging, Scrolling } from "devextreme-react/data-grid";
import Moment from "react-moment";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import { CallGETAPI } from "../../../helper/API";
import check from "../../../img/Check.svg";
import cancel from "../../../img/Cancel.svg";
import {
  BatteryInfocolumnList,
  BatteryTypebyModel,
  PadTypeByModal,
  RenderDate,
} from "../../../helper/BasicFn";
import Plus from "../../../img/Plus.svg";
import Minus from "../../../img/Minus.svg";
import moment from "moment";
import "moment-timezone";
import { IoMdDownload } from "react-icons/io";
import Loading from "../Loading";
import axios from "axios";
import { FormatDate } from '../../../helper/Common';

const AEDServiceDetails = () => {
  const { aedId, serviceQuestionId } = useParams();
  const [apiData, setApiData] = useState();
  const [formData, setFormData] = useState();
  const [batteryList, setBatteryList] = useState([]);
  const [padList, setPadList] = useState([]);
  const [aedModelId, setAedModelId] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log(aedId);
  const fetchLoad = async () => {
    setLoading(true);
    const response = await CallGETAPI(
      `account/get_aed_modification_data_by_id_v2/${aedId}/${serviceQuestionId}`
    );

    if (response.data.data) {
      const resultData = response.data.data;
      const getVisibleColumns = FetchBatteryColumns(response.data.data);
      resultData.visiblae_columns = getVisibleColumns;

      resultData.aedDetails.map((aedData, index) => {
        if (aedData.aed_model_id) {
          setAedModelId(aedData.aed_model_id);
        }
      });

      setFormData({
        ...resultData,
     });

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoad();
  }, [aedId]);

  const FetchBatteryColumns = (fd) => {
    try {
      if (fd.battery) {
        var BiArr = fd.battery;

        const IsColumnVisible = (key, data) => {
          if (key === "battery_serial") {
            return false;
          }
          return data.some((row) => isValidValue(row[key]));
        };

        const isValidValue = (value) => {
          return (
            value !== null &&
            value !== undefined &&
            value !== "0000-00-00" &&
            value !== ""
          );
        };

        const visibleColumns = BatteryInfocolumnList.filter((column) => {
          return column.is_default === 1 || IsColumnVisible(column.key, BiArr);
        });

        console.log(visibleColumns);
        return visibleColumns;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      return [];
    }
  };

  const IsColumnVisible = (key) => {
    let is_found = 0;

    for (let index = 0; index < formData?.visiblae_columns.length; index++) {
      const el = formData?.visiblae_columns[index];
      if (el.key === key) {
        is_found = 1;
        break;
      }
    }
    return is_found;
  };

  const sortedBatteryArray = formData?.battery
    ? formData.battery.slice().sort((a, b) => a.is_spare - b.is_spare)
    : [];

  const sortedPadArray = formData?.pad
    ? formData.pad.slice().sort((a, b) => {
        if (a.is_spare === 0 && a.is_pediatric === 0) return -1;
        if (b.is_spare === 0 && b.is_pediatric === 0) return 1;
        return 0;
      })
    : [];

  const downloadImage = async (imageUrl, fileName) => {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "blob",
      });

      const contentType = response.headers["content-type"];

      // Explicitly set the file extension to "png"
      const anchor = document.createElement("a");
      anchor.href = window.URL.createObjectURL(response.data);
      anchor.download = `${fileName}.png`;
      document.body.appendChild(anchor);
      anchor.click();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {loading ? (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      ) : (
        <div
          className="mt-4 table-main-20002"
          style={{ width: "100%", paddingInline: "2%", marginBottom: "5%" }}
        >
          <SubHeadingOther
            hideNew={true}
            hideHierarchy={true}
            hideInstructor={true}
            subHeading={true}
            bottomLinks={false}
            account={5}
            editUrl={false}
            assign_equipment={true}
          />

          <Box className="text-left">
            <h4 className="heading" style={{ color: "black" }}>
              AED Service Date:{" "}
              <Moment
                date={formData?.serviceQuestion?.inspection_date}
                format="MM/DD/YYYY h:mm:ss"
              />
            </h4>
          </Box>

          {formData?.aedDetails &&
            formData?.aedDetails.map((aedData, index) => (
              <>
                <div key={""} className="col py-2">
                  <h2 className="heading">Serial #:{aedData.serial_number}</h2>

                  <table className="theme-table">
                    <thead>
                      <tr>
                        <td className="border border-r-blue" colSpan={2}>
                          Type
                        </td>
                        <td className="border border-r-blue" colSpan={2}>
                          Brand / Model
                        </td>
                        <td className="border border-r-blue" colSpan={2}>
                          Serial #
                        </td>
                        <td className="border border-r-blue" colSpan={2}>
                          Placement
                        </td>
                      </tr>
                    </thead>
                    <tbody className="">
                      <tr>
                        <td className="border border-r-blue" colSpan={2}>
                          AED
                        </td>
                        <td className="border border-r-blue" colSpan={2}>
                          {aedData.brandname + "/" + aedData.modelname}
                        </td>
                        <td className="border border-r-blue" colSpan={2}>
                          {aedData.serial_number}
                        </td>
                        <td className="border border-r-blue" colSpan={2}>
                          {aedData.placement}
                        </td>
                      </tr>
                    </tbody>
                    <thead>
                      <tr>
                        <td className="border border-r-blue" colSpan={2}>
                          Present / Ready
                        </td>
                        <td className="border border-r-blue" colSpan={2}>
                          Replace rescue kit
                        </td>
                        <td className="border border-r-blue" colSpan={2}>
                          Replace alarm battery
                        </td>
                        <td className="border border-r-blue" colSpan={1}>
                          Replace Accessories
                        </td>
                        <td className="border border-r-blue" colSpan={1}>
                          Support Ticket
                        </td>
                      </tr>
                    </thead>
                    <tbody className="">
                      <tr>
                        <td colSpan={2}>
                          <CustomToggleButton2
                            ToggleName="aeds_ready_status"
                            ToggleValue={aedData.aeds_ready_status}
                            // changeHandler={() => handleToggleChange('aeds_ready_status')}
                            //   is_read_only={serviceQuestionData?.aeds_ready_status === true ? true : ""}
                          />
                        </td>
                        <td colSpan={2}>
                          <CustomToggleButton2
                            ToggleName="rescue_kits_status"
                            ToggleValue={aedData.rescue_kits_status}
                            // changeHandler={() => handleToggleChange('rescue_kits_status')}
                            //   is_read_only={serviceQuestionData?.rescue_kits_status === false ? true : ""}
                          />
                        </td>
                        <td colSpan={2}>
                          <CustomToggleButton2
                            ToggleName="alarm_batteries_status"
                            ToggleValue={aedData.alarm_batteries_status}
                            // changeHandler={() => handleToggleChange('AlarmBatteryToggle')}
                            //   is_read_only={serviceQuestionData?.alarm_batteries_status === false ? true : ""}
                          />
                        </td>
                        <td colSpan={1}>
                          <CustomToggleButton2
                            ToggleName="accessories_status"
                            ToggleValue={aedData.accessories_status}
                            // changeHandler={() => handleToggleChange('accessories_status')}
                            //   is_read_only={serviceQuestionData?.accessories_status === false ? true : ""}
                          />
                        </td>
                        <td colSpan={1}>
                          <CustomToggleButton2
                            ToggleName="issue_toggle"
                            ToggleValue={aedData.issue_toggle}
                            // changeHandler={() => handleToggleChange('accessories_status')}
                            //   is_read_only={serviceQuestionData?.accessories_status === false ? true : ""}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {aedData.aeds_ready_status ? (
                  " "
                ) : (
                  <div className="col py-2">
                    <h2 className="heading">Present / Ready Information*</h2>

                    <table className="theme-table">
                      <thead>
                        <tr>
                          <td
                            className="border border-r-blue"
                            style={{ width: "50%" }}
                          >
                            Replacing AEDs
                          </td>
                          <td
                            className="border border-r-blue"
                            style={{ width: "50%" }}
                          >
                            Replacement Serial #
                          </td>
                        </tr>
                      </thead>
                      <tbody className="">
                        <tr>
                          <td>
                            <CustomToggleButton2
                              ToggleName="ReplacingAeds"
                              ToggleValue={aedData?.replacement_aed_toggle}
                            />
                          </td>
                          <td> {aedData?.replacement_aed_serial}</td>
                        </tr>
                      </tbody>
                    </table>

                    <table
                      className="theme-table"
                      style={{ marginBottom: "3%" }}
                    >
                      <thead>
                        <tr>
                          <td className="border border-r-blue">Comment</td>
                        </tr>
                      </thead>
                      <tbody className="">
                        <tr>
                          <td>{aedData?.aed_present_info}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ))}

{(formData?.battery?.length > 0 && formData.battery[0]?.section_name !== "charge_pack") && (
 <div className="col py-2">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2 className="heading">Battery Information</h2>
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
                    {formData?.visiblae_columns.map((it) => (
                      <td
                        className="border border-r-blue"
                        style={{ minWidth: "150px" }}
                      >
                        {it.title}
                      </td>
                    ))}
                    {/* <td className='border border-r-blue'>Expiration Date</td>
                      <td className='border border-r-blue'>Manufactured Date</td>
        <td className='border border-r-blue'>Install Date</td>
        <td className='border border-r-blue'>Battery Lot</td>
        <td className='border border-r-blue'>Battery UID</td> */}
                    {/* <td className='border border-r-blue' style={{maxWidth:"70px",minWidth:"60px"}}>Actions</td> */}
                  </tr>
                </thead>
                <tbody className="">
                  {sortedBatteryArray &&
                    sortedBatteryArray.map((battery, Bindex) => (
                      <React.Fragment key={Bindex}>
                        <tr >
                          <td>{battery?.is_spare === 0 ? "Main" : "Spare"}</td>

                          {IsColumnVisible("battery_type_id") ? (
                            <td>{battery?.battery_part}</td>
                          ) : (
                            ""
                          )}

                          {IsColumnVisible("battery_expiration") ? (
                            <td>
                              {battery?.battery_expiration &&
                              moment(battery.battery_expiration).isValid()
                                ? RenderDate(moment(battery.battery_expiration).format(
                                    "MM/DD/YYYY"
                                  ))
                                : "NA"}
                            </td>
                          ) : (
                            ""
                          )}

                          {IsColumnVisible("manufactured_date") ? (
                            <td>
                              {battery?.manufactured_date &&
                              moment(battery.manufactured_date).isValid()
                                ? moment(battery.manufactured_date).format(
                                    "MM/DD/YYYY"
                                  )
                                : "NA"}
                            </td>
                          ) : (
                            ""
                          )}

                          {IsColumnVisible("battery_lot") ? (
                            <td>{battery?.battery_lot}</td>
                          ) : (
                            ""
                          )}

                          {IsColumnVisible("battery_udi") ? (
                            <td>{battery?.battery_udi}</td>
                          ) : (
                            ""
                          )}

                        {IsColumnVisible("install_before_date") ? (<>
                            <td> 
                              {battery?.install_before_date &&  
                              moment(battery.install_before_date).isValid()
                                ? ( moment(battery.install_before_date).format("MM/DD/YYYY")
                               ) : "NA"}
                            </td>
                            </> ) : (
                            ""
                            )}
                            
                          {IsColumnVisible("install_date") ? (<>
                            <td> 
                              {battery?.install_date &&  
                              moment(battery.install_date).isValid()
                                ? ( moment(battery.install_date).format("MM/DD/YYYY")
                               ) : "NA"}
                            </td>
                            </> ) : (
                            ""
                            )}

                           {IsColumnVisible("install_9v_date") ? (
                            <td>
                              {battery?.install_9v_date &&
                              moment(battery.install_9v_date).isValid()
                                ? moment(battery.install_9v_date).format(
                                    "MM/DD/YYYY"
                                  )
                                : "NA"}
                            </td>
                          ) : (
                            ""
                          )}

                          {/* <td>{
                    <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                    <img src={Plus} height={20} />
                    <img src={Minus} height={20} />
                   </div>
                   }</td>  */}
                        </tr>
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
          )}

        {(formData?.battery?.length > 0 && formData?.battery[0]?.section_name === "charge_pack" ) && (
            <div className="col py-2">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2 className="heading">Charge Pak Information</h2>
              </div>

              <table className="theme-table">
                <thead>
                  <tr>
                    <td
                      className="border border-r-blue"
                      style={{ minWidth: "150px" }}
                    >
                     Charge-Pak Type
                    </td>
                   
                    <td className='border border-r-blue'>Charge-Pak Part #</td>
                    <td className='border border-r-blue'>Battery Expiration</td>
                    <td className='border border-r-blue'>Battery Lot</td>
                    <td className='border border-r-blue'>Charge-Pak UDI</td>
        {/* <td className='border border-r-blue'>Battery UID</td> */}
                    {/* <td className='border border-r-blue' style={{maxWidth:"70px",minWidth:"60px"}}>Actions</td> */}
                  </tr>
                </thead>
                <tbody className="">
                  {sortedBatteryArray &&
                    sortedBatteryArray.map((battery, Bindex) => (
                      <>
                        <tr key={Bindex}>
                          <td>{battery?.is_spare === 0 ? "Main" : "Spare"}</td>
                          <td>{battery?.battery_part}</td>
                          <td>
                              {battery?.battery_expiration &&
                              moment(battery.battery_expiration).isValid()
                                ? RenderDate(moment(battery.battery_expiration).format(
                                    "MM/DD/YYYY"
                                  ))
                                : "NA"}
                            </td>
                          <td>{battery?.battery_lot}</td>
                          <td>{battery?.charge_pak_uid}</td>
                        

                          {/* <td>{
                    <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                    <img src={Plus} height={20} />
                    <img src={Minus} height={20} />
                   </div>
                   }</td>  */}
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {formData?.pad && formData.pad.length > 0 ? (
            <>
              <div className="col py-2">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h2 className="heading">Pads Information</h2>
                </div>

                <table className="theme-table">
                  <thead>
                    <tr>
                      <td className="border border-r-blue">Pad Type</td>
                      <td className="border border-r-blue">Part #</td>
                      <td className="border border-r-blue">Expiration Date</td>
                      <td className="border border-r-blue">Pad Lot</td>
                      <td className="border border-r-blue">Pad UID</td>
                      {/* <td className='border border-r-blue' style={{maxWidth:"70px",minWidth:"60px"}}>Actions</td> */}
                    </tr>
                  </thead>
                  <tbody className="">
                    {sortedPadArray &&
                      sortedPadArray.map((pad, Pindex) => (
                        <>
                          <tr key={Pindex}>
                            <td>
                              {pad?.is_spare === 0 && pad?.is_pediatric === 0
                                ? "Main"
                                : pad?.is_spare === 1 && pad?.is_pediatric === 0
                                ? "Spare"
                                : pad?.is_spare === 0 && pad?.is_pediatric === 1
                                ? "Pediatric"
                                : "Spare Pediatric"}
                            </td>
                            <td>{pad?.pad_part}</td>
                            <td>
                              {pad?.pad_expiration &&
                              moment(pad.pad_expiration).isValid()
                                ? RenderDate(moment(pad.pad_expiration).format(
                                    "MM/DD/YYYY"
                                  ))
                                : "NA"}{" "}
                            </td>
                            <td>{pad.pad_lot}</td>
                            <td>{pad?.pad_udi ? pad.pad_udi : "N/A"}</td>
                            {/* <td>{
                    <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-around",maxWidth:"70px"}}>
                    <img src={Plus} height={20} />
                    <img src={Minus} height={20} />
                   </div>
                   }</td>  */}
                          </tr>
                        </>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            ""
          )}

          {formData?.aedDetails?.map((aedData, index) => (
            aedData?.issue_toggle === 1 && (
              <div className="col py-2" key={index}>
                <h2 className="heading">Support Ticket Issue</h2>
                <textarea
                  className="form-control"
                  name="support_description"
                 value={aedData?.issue}
                  style={{
                    height: "auto",
                    width: "100%",
                    border: "3px solid #337ab7",
                  }}
                ></textarea>
              </div>
            )
          ))}


          <div className="col py-2 table-main-20002">
            <h2 className="heading">Servicing Questions*</h2>

            <table className="table">
              <tbody className="">
                <tr>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        columnGap: "8%",
                      }}
                    >
                      <span>Inspection Date:</span>
                      <span>
                        <div
                          className={
                            "d-flex align-items-center calendar-input-btn"
                          }
                        >
                          <span>
                            <Moment
                              date={formData?.serviceQuestion.inspection_date}
                              format="MM/DD/YYYY"
                            />
                          </span>
                        </div>
                      </span>
                    </div>
                  </td>
                  <td style={{ columnGap: "18%" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        columnGap: "7%",
                        alignItems: "center",
                      }}
                    >
                      <span>Inspection Completed by: </span>
                      <span>{formData?.serviceQuestion.inspection_by}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td> Are all AEDS present and in a ready status?</td>
                  <td>
                    {" "}
                    <CustomToggleButton2
                      ToggleName="aeds_ready_status"
                      ToggleValue={formData?.serviceQuestion.aeds_ready_status}
                      // changeHandler={handleToggleChange}
                      is_read_only={false}
                    />
                  </td>
                </tr>

                <tr>
                  <td> Did you replaced any rescue kits?</td>
                  <td>
                    {" "}
                    <CustomToggleButton2
                      ToggleName="rescue_kits_status"
                      ToggleValue={formData?.serviceQuestion.rescue_kits_status}
                      //   changeHandler={handleToggleChange}
                      is_read_only={false}
                    />
                  </td>
                </tr>

                <tr>
                  <td> Did you replace any alarm batteries?</td>
                  <td>
                    {" "}
                    <CustomToggleButton2
                      ToggleName="alarm_batteries_status"
                      ToggleValue={
                        formData?.serviceQuestion.alarm_batteries_status
                      }
                      //   changeHandler={handleToggleChange}
                      is_read_only={false}
                    />
                  </td>
                </tr>

                <tr>
                  <td> Did you replace any accessories?</td>
                  <td>
                    {" "}
                    <CustomToggleButton2
                      ToggleName="accessories_status"
                      ToggleValue={formData?.serviceQuestion.accessories_status}
                      //   changeHandler={handleToggleChange}
                      is_read_only={false}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col py-2">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 className="heading">Servicing Notes*</h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: "5%",
                  marginRight: "1%",
                }}
              >
                <h2 className="heading">Issue</h2>
                <CustomToggleButton2
                  ToggleName="issue_toggle"
                  ToggleValue={formData?.serviceQuestion.issue_toggle}
                  //  changeHandler={handleToggleChange}
                  is_read_only={false}
                />
              </div>
            </div>
            <Form.Group
              className={`service-notes-container`}
              style={{
                height: "200px",
                width: "100%",
                border: `3px solid #337ab7`,
                padding: "5px",
              }}
            >
              {formData?.serviceQuestion.issue_toggle ? formData?.issue : formData?.serviceQuestion.servicing_notes}
            </Form.Group>
          </div>

          <div className="col py-2">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 className="heading">Servicing Images </h2>
            </div>

            <div
              className="col relative service-notes-container"
              style={{
                height: "200px",
                width: "100%",
                maxWidth: "100%",
                border: "3px solid #337ab7",
                padding: "1%",
                overflowX: "auto",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
              }}
            >
              <ul
                style={{
                  listStyleType: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "15px",
                  paddingRight: "20px",
                }}
              >
                {formData?.image &&
                  formData?.image.map((img, index) => (
                    <li
                      key={index}
                      style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={`https://www.upload.rossdev.xyz/public/${img.image_id}`}
                        alt={img.image_id}
                        style={{ height: "120px", width: "200px" }}
                      />
                      <button
                        onClick={() =>
                          downloadImage(
                            `https://www.upload.rossdev.xyz/api/download/${img.image_id}`,
                            `image_${index}`
                          )
                        }
                        style={{
                          position: "absolute",
                          padding: "0px",
                          right: "0px",
                          marginTop: "0px",
                          textDecoration: "none",
                          color: "#337ab7",
                          cursor: "pointer",
                          border: "none",
                          background: "none",
                        }}
                      >
                        <img
                          src="/download_document.svg"
                          alt=""
                          width={25}
                          height={25}
                        />
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="col py-2">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 className="heading">AEDs on Service Check</h2>
            </div>

            <DataGrid
              className="col"
              dataSource={formData?.serviceQuestiondata}
              height={"auto"}
              width={"auto"}
              keyExpr="aed_id"
              showColumnLines={true}
              showRowLines={true}
              showBorders={true}
              allowSorting={true}
              rowAlternationEnabled={true}
            >
              {/* <Column
                dataField="serialNumbers"
                width={180}
                caption="AED Serial #"
                cssClass="column-header"
                allowSorting={true}
                cellRender={(data) => (
                  <span
                    style={{
                      cursor: "pointer",
                      color: "#0c71c3",
                      textDecoration: "underline",
                    }}
                    onClick={() =>
                      navigate(
                        `/account-details/AEDServiceDetails/${data.data.aed_id}/${data.data.service_question_id}`
                      )
                    }
                  >
                    {data.data.serialNumbers}
                  </span>
                )}
              /> */}

<Column
  dataField="serialNumbers"
  width={180}
  caption="AED Serial #"
  cssClass="column-header"
  allowSorting={true}
  cellRender={(data) => {
    const isMatchingAedId = data.data.aed_id == aedId;

    return (
      <span
        style={{
          cursor: isMatchingAedId ? "default" : "pointer",
          color: isMatchingAedId ? "black" : "#0c71c3",
          textDecoration: isMatchingAedId ? "none" : "underline",
        }}
        onClick={() =>
          isMatchingAedId
            ? null // Handle the case when AED ID matches, no action needed
            : navigate(
                `/account-details/AEDServiceDetails/${data.data.aed_id}/${data.data.service_question_id}`
              )
        }
      >
        {data.data.serialNumbers}
      </span>
    );
  }}
/>


              <Column
                dataField="aeds_ready_status"
                caption="Present / Ready"
                cssClass="column-header"
                allowSorting={true}
                dataType="string"
                cellRender={(data) => (
                  <img
                    src={data.data.aeds_ready_status ? check : cancel}
                    alt="Status"
                    height={12}
                  />
                )}
              />

              <Column
                dataField="rescue_kits_status"
                caption="Replaced Rescue Kit"
                cssClass="column-header"
                allowSorting={true}
                dataType="string"
                cellRender={(data) => (
                  <img
                    src={data.data.rescue_kits_status ? check : cancel}
                    alt="Status"
                    height={12}
                  />
                )}
              />

              <Column
                dataField="expiry_date"
                caption="Alarm Battery Exp"
                cssClass="column-header"
                allowSorting={true}
                dataType="string"
                cellRender={(data) =>
                  moment(data?.data?.expiry_date).isValid()
                    ? moment(data?.data?.expiry_date).format("MM/DD/YYYY")
                    : ""
                }
              />
              <Column
                dataField="accessories_status"
                caption="Replaced Accessories"
                cssClass="column-header"
                allowSorting={true}
                cellRender={(data) => (
                  <img
                    src={data.data.accessories_status ? check : cancel}
                    alt="Status"
                    height={12}
                  />
                )}
              />
              <Scrolling columnRenderingMode="virtual" />
              <Paging enabled={false} />
            </DataGrid>
          </div>

          <div style={{ marginTop: "70px", marginBottom: "10px" }}>
            <Box
              className="d-flex justify-content-evenly align-items-center"
              style={{ gap: "50px" }}
            >
              <p>
                Created Date:{" 01/25/2024"}
                {/* {aedDetails?.created_date ? (
                    <Moment
                      date={aedDetails?.created_date}
                      format={"MM/DD/YYYY h:mm A"}
                    />
                  ) : (
                    ""
                  )} */}
              </p>
              <p>Created By: </p>
              <p>
                Modified Date:{" "}
                {/* {aedDetails?.modified_date ? (
                    <Moment
                      date={aedDetails?.modified_date}
                      format={"MM/DD/YYYY h:mm A"}
                    />
                  ) : (
                    ""
                  )}{" "} */}
              </p>
              <p>Modified By: </p>
              <p>
                Last Touch Date:{" "}
                {/* {aedDetails?.last_check
                    ? FormatDate(aedDetails?.last_check)
                    : ""} */}
              </p>
              {/* <Moment date={aedDetails?.last_check} format={'DD-MM-YYYY'} /> */}
            </Box>
          </div>
        </div>
      )}
    </>
  );
};

export default AEDServiceDetails;

import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "./outOfServiceModal.scss";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import { FormControlLabel, Switch, Button } from "@mui/material";
import MessageHandler from "../../common/MessageHandler";
import ToogleSwitch from "../../common/toggleSwitch/ToogleSwitch";
import CommonDatePicker from "../../common/date-picker/CommonDatePicker";
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { toast } from "react-toastify";
import { FormatDate } from "../../../helper/Common";
import moment from "moment";
import CustomToggleButton from "../../common/toggleSwitch/CustomToggleButton";

const OutOfServiceModal = ({
  ShowModal,
  SetShowModal,
  outOfServiceInfo,
  outOfServiceToggle,
  aedList,
  loanerList,
  setLoanerList,
  aedId,
  getAedDetails,
  aedDetails,
  setOutofServiceSecond,
  setOutofServiceFormData,
  cordinatorInfo,
}) => { 
  const [contactId, setContactId] = useState(null); 
  const [formData, setFormData] = React.useState({
    loaner_rental_serial: outOfServiceInfo[0]?.loaner_rental_serial || "",
    loaner_rental_serial_name:outOfServiceInfo[0]?.loaner_rental_serial_name || "",
    loaner_serial_id: outOfServiceInfo[0]?.loaner_serial_id || "",
    replaced_serial_name: outOfServiceInfo[0]?.replaced_serial_name || "",
    replaced_serial: outOfServiceInfo[0]?.replaced_serial || "",
    date_sent_to_manufacturer: outOfServiceInfo[0]?.date_sent_to_manufacturer
      ? moment(outOfServiceInfo[0]?.date_sent_to_manufacturer)
      : "",
    not_replacing: outOfServiceInfo[0]?.not_replacing || false,
    loaner_toggle: outOfServiceInfo[0]?.loaner_toggle || false,
    reason: outOfServiceInfo[0]?.reason || "",
  });

  const [FormMsg, setFormMsg] = React.useState({ type: true, msg: "" });
  const [validated, setValidated] = React.useState(false);
  const [serialNumbersData, setSerialNumbersData] = useState([]);
  const [switchValue, setSwitchValue] = useState({
    key: "out_of_service",
    value: outOfServiceToggle,
  });

  const [replacingSwitchValue, setReplacingSwitchValue] = useState({
    key: "not_replacing",
    value: formData?.not_replacing,
  });

  const [loanerSwitchValue, setloanerSwitchValue] = useState({
    key: "loaner_toggle",
    value: formData?.loaner_toggle,
  });

  useEffect(() => {
    setIsReplacingToggleOn(replacingSwitchValue.value);
  }, [replacingSwitchValue.value]);

  const [isReplacingToggleOn, setIsReplacingToggleOn] = useState(
    replacingSwitchValue.value
  );
  const [loaner_serial_id, set_loaner_serial_id] = useState(0);

  // close modal
  const handleClose = () => SetShowModal(false);

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      outOfServiceToggle &&
      formData?.loaner_rental_serial &&
      !switchValue.value
    ) {
      let res = await CallPOSTAPI("account/update-out-of-service/" + aedId, {
        out_of_service_info: switchValue.value ? [formData] : [],
        out_of_service_toggle: switchValue.value,
        account_id: "",
        site_id: "",
        loaner_serial_id: "",
      });
      if (res?.data?.status) {
        setOutofServiceFormData(formData);
        SetShowModal(false);
        setOutofServiceSecond(true);
        getAedDetails();
      } else {
        toast.error("Something went wrong please try again");
      }
    } else {
      let res = await CallPOSTAPI("account/update-out-of-service/" + aedId, {
        out_of_service_info: switchValue.value ? [formData] : [],
        out_of_service_toggle: switchValue.value,
        account_id: aedDetails?.account_id,
        site_id: aedDetails?.site_id,
        loaner_serial_id: Number(loaner_serial_id),
      });
      if (res?.data?.status) {
        toast.success("Out of service added successfully");
        handleClose();
        getAedDetails();
      } else {
        toast.error("Something went wrong please try again");
      }
    }
  };

  // handle change
  const handleChange = (e) => {
    let currentValue = e.target.value;
    console.log(e)
    if (e.target.name === "replaced_serial") {
      setFormData((old) => ({ ...old, [e.target.name]: currentValue }));
      setFormData((old) => ({
        ...old,
        replaced_serial_name: aedList.filter(
          (item) => Number(item?.aed_details?.aed_id) === Number(currentValue)
        )?.[0]?.aed_details?.serial_number,
      }));
    } else if (e.target.name === "loaner_rental_serial") {
      setFormData((old) => ({ ...old, [e.target.name]: currentValue }));
      setFormData((old) => ({
        ...old,
        loaner_rental_serial_name: loanerList.filter(
          (item) => Number(item?.aed_details?.aed_id) === Number(currentValue)
        )?.[0]?.aed_details?.serial_number,
      }));

      const selectedLoaner = serialNumbersData.find(
        (item) => item.serial_number === currentValue
      );
      
      if (currentValue === "") {
        set_loaner_serial_id(0);
      }
      set_loaner_serial_id(selectedLoaner?.aed_id);
    } else {
      setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
    }
  };

  // handle date change
  const handleDateChange = (name, val) => {
    setFormData((old) => ({ ...old, [name]: val }));
  };

  // set Laoner List
  if (outOfServiceInfo[0]?.loaner_rental_serial_name) {
    const lonerItem = {
      aed_details: {
        aed_id: outOfServiceInfo[0].loaner_rental_serial,
        serial_number: outOfServiceInfo[0].loaner_rental_serial_name,
      },
    };
    const existingItem = loanerList.find(
      (item) => item.aed_details.aed_id === lonerItem.aed_details.aed_id
    );
    if (!existingItem) {
      setLoanerList((prevList) => [...prevList, lonerItem]);
    }
  }

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      not_replacing: replacingSwitchValue.value,
    }));
  }, [replacingSwitchValue.value]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      loaner_toggle: loanerSwitchValue.value,
    }));
  }, [loanerSwitchValue.value]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      loaner_serial_id: Number(loaner_serial_id),
    }));
  }, [loaner_serial_id]);

  const fetchSerialNumbers = async () => {
    console.log("Hii")
    if(contactId){
    console.log({contactId})
    const response = await CallGETAPI(`account/get-replacing-serial/${contactId}`);
    if (response.status === true) {
      var data = response?.data?.serialNumbers;
      setSerialNumbersData(data);
      console.log("data: ", data);
    }
  }
  };

  const fillReplacementSerialDD = () => {
    return serialNumbersData?.map((item, i) => {
      return <option value={item?.serial_number}>{item?.serial_number}</option>;
    });
  }

  useEffect(() => {
    fetchSerialNumbers();
  },[contactId])


 

  useEffect(() => {
    
   if(cordinatorInfo?.arr?.length > 0 ) {
      for (let i = 0; i < cordinatorInfo?.arr?.length; i++) {
          const obj = cordinatorInfo?.arr[i];
          if (obj?.title === "Technicians") {
              setContactId(obj?.contact_id); 
              break; 
          }
      }
    }
  }, [cordinatorInfo?.arr]);
    
  return (
    <>
      <Modal
        show={ShowModal}
        onHide={handleClose}
        dialogClassName="modal-half"
        aria-labelledby="example-custom-modal-styling-title"
        size="xl"
        id="outofservice-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-3">
            <span>Out Of Service</span>

            <ToogleSwitch
              switchKeyValue={switchValue.value}
              setSwitchValue={setSwitchValue}
              switchKey={"out_of_service"}
              disabled={false}
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-container" id="outofservice-modal-content">
            <div className="my-modal-section">
              <div className="row">
                <div className="col-md-12 mx-auto">
                  <Form
                    class=""
                    onSubmit={handleSubmit}
                    noValidate
                    validated={validated}
                    id="outofservice-form"
                  >
                    <div
                      className="bottom-border-blue py-4 px-2"
                      style={{
                        background: "#eee",
                      }}
                    >
                      <div className="row">
                        <Form.Group className="col-md-1">
                          <Form.Label className="d-block">Replacing</Form.Label>
                          <span className="d-inline-block">
                            <ToogleSwitch
                              switchKeyValue={replacingSwitchValue.value}
                              setSwitchValue={setReplacingSwitchValue}
                              switchKey={"not_replacing"}
                              disabled={!switchValue.value}
                            />
                          </span>
                        </Form.Group>
                           {console.log({aedList})}
                           {console.log(aedList[0].aed_details?.serial_number)}
                        <Form.Group className="col-md-2 mb-3">
                          <Form.Label>Replaced Serial #</Form.Label>
                          <select
                            className="form-control"
                            name="replaced_serial"
                            value={formData?.replaced_serial}
                            onChange={handleChange}
                            disabled={
                              !isReplacingToggleOn || !switchValue.value
                            }
                          >
                            <option value="" key={0} selected>
                              --Select One--
                            </option>
                            {aedList
                              ?.filter(
                                (item) =>
                                  item?.aed_details?.site_id ===
                                  aedDetails?.site_id
                              )
                              .map((item, key) => (
                                <option
                                  key={key + 1}
                                  value={item?.aed_details?.aed_id}
                                  selected={
                                    formData?.replaced_serial ===
                                    item?.aed_details?.aed_id
                                      ? true
                                      : false
                                  }
                                >
                                  {item?.aed_details?.serial_number}
                                </option>
                              ))}
                          </select>
                        </Form.Group>

                        <Form.Group className="col-md-1">
                          <Form.Label className="d-block">Loaner</Form.Label>
                          <span className="d-inline-block">
                            <ToogleSwitch
                              switchKeyValue={loanerSwitchValue?.value}
                              setSwitchValue={setloanerSwitchValue}
                              switchKey={"loaner_toggle"}
                              disabled={!switchValue.value}
                            />
                          </span>
                        </Form.Group>

                        {/* <Form.Group className="col-md-1">
                          <b className={"d-block mb-2"}>Loaner</b>
                          <div className="">
                            <CustomToggleButton
                              ToggleName="loaner_toggle"
                              ToggleValue={formData?.loaner_toggle}
                              changeHandler={handleCheckBox}
                              is_read_only={!formData?.out_of_service_toggle}
                            />
                          </div>
                        </Form.Group> */}

                        <Form.Group className="col-md-2 mb-3">
                          <Form.Label>Loaner Serial #</Form.Label>
                          <select
                            className="form-control"
                            name="loaner_rental_serial"
                            value={formData?.loaner_rental_serial}
                            onChange={handleChange}
                            disabled={!switchValue.value || !formData?.loaner_toggle}
                          >
                            <option value="" key={0} selected>
                              --Select One--
                            </option>
                            {/* {loanerList?.map((item, key) => (
                              <option
                                key={key + 1}
                                value={item?.aed_details?.aed_id}
                                selected={
                                  formData?.loaner_rental_serial ===
                                  item?.aed_details?.aed_id
                                    ? true
                                    : false
                                }
                              >
                                {item?.aed_details?.serial_number}
                              </option>
                            ))} */}
                              {fillReplacementSerialDD()}
                          </select>
                        </Form.Group>

                        <Form.Group className="col-md-3 mb-3 mr-3">
                          <Form.Label>Date Sent to Manufacturer</Form.Label>

                          {formData?.date_sent_to_manufacturer ? (
                            <CommonDatePicker
                              calName={"date_sent_to_manufacturer"}
                              CalVal={FormatDate(
                                formData?.date_sent_to_manufacturer
                              )}
                              HandleChange={handleDateChange}
                              disabled={!switchValue.value}
                            />
                          ) : (
                            <CommonDatePicker
                              calName={"date_sent_to_manufacturer"}
                              CalVal={FormatDate(
                                formData?.date_sent_to_manufacturer
                              )}
                              HandleChange={handleDateChange}
                              disabled={!switchValue.value}
                            />
                          )}
                        </Form.Group>

                        <Form.Group className="col-md-2 mb-3">
                          <Form.Label>Reason</Form.Label>
                          <Form.Control
                            type="text"
                            name="reason"
                            value={formData?.reason}
                            onChange={handleChange}
                            disabled={!switchValue.value}
                          />
                        </Form.Group>
                      </div>

                      {/* bottom buttons */}
                      <div className="" style={{ marginBottom: "15px" }}>
                        <div
                          className="col-md-12 d-flex"
                          style={{ marginTop: "25px", justifyContent: "right" }}
                        >
                          <Button
                            className={"btn btn-danger mx-4"}
                            variant="danger"
                            style={{ fontSize: "16px" }}
                            onClick={() => {
                              handleClose();
                            }}
                          >
                            Cancel
                          </Button>

                          <Button
                            className={"btn btn-success"}
                            variant="success"
                            style={{ marginRight: "5px", fontSize: "16px" }}
                            type="submit"
                            // disabled={switchValue.value === true ? false : true}
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
          {/* alert */}
          <div className="my-4">
            <MessageHandler
              status={FormMsg.type}
              msg={FormMsg.msg}
              HandleMessage={setFormMsg}
            />
          </div>
        </Modal.Body>
        {/* <Modal.Footer></Modal.Footer> */}
      </Modal>
    </>
  );
};

export default OutOfServiceModal;

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
import { GetAccountList } from "../../../helper/BasicFn";

const OutOfServiceSecondModal = ({
  ShowSecondModal,
  setShowSecondModal,
  accountId,
  outofServiceFormData,
}) => {

  // const [formData, setFormData] = React.useState({
  //   date_sent_to_manufacturer: "",
  //   loaner_rental_serial: "",
  //   loaner_rental_serial_name: "",
  //   reason: "",
  //   replaced_serial: "",
  //   replaced_serial_name: "",
  //   not_replacing: false,
  // });
console.log(outofServiceFormData);
  const handleSecondModelClose = () => setShowSecondModal(false);
  const [validated, setValidated] = React.useState(false);
  const [accountList, setAccountList] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState(accountId);
  const [AedSiteList, setAedSiteList] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");

  const handleSecondSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
    } else {
      const sendData = {
        account_id: selectedAcc,
        site_id: selectedSite,
        id: outofServiceFormData?.replaced_serial || outofServiceFormData?.loaner_rental_serial,
      };
      const res = await CallPOSTAPI("account/move-replece-aed", sendData);
      // return;
      if (res.data.status) {
        toast.success(res.data.msg);
        handleClose();
        handleSecondModelClose();
      } else {
        toast.error("Something went Wrong Please Try Again");
      }
    }
  }

  const onLoad = async () => {
    const accountDataRes = await GetAccountList();
    const accountData = accountDataRes?.data?.data?.account || [];
    const selectedAcc = accountData.find(
      (item) => item.account_id == accountId
    );
    console.log({ selectedAcc });
    setAccountList(accountData);
  }

  useEffect(() => {
    onLoad();
  }, [])

  const onChangeAccount = async (id, onload = false) => {
    const accSiteListres = await CallGETAPI("account/account-site-list/" + id);
    const accSiteList = accSiteListres?.data?.data?.site_details || [];
    setSelectedAcc(id);
    setAedSiteList(accSiteList);
    if (!onload) {
      setSelectedSite("");
    }
  };

  const handleClose = () => {
    setShowSecondModal(false)
  }

  return (
    <>
      <Modal
        show={ShowSecondModal}
        onHide={handleSecondModelClose}
        // dialogClassName="modal-half"
        aria-labelledby="example-custom-modal-styling-title"
        size="md"
        id="outofservice-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-3">
            <span>Moved Aed</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-container" id="outofservice-modal-content">
            <div className="my-modal-section">

              <Form
                class=""
                onSubmit={handleSecondSubmit}
                noValidate
                validated={validated}
                id="outofservice-form"
              >
                <div className="bottom-border-blue py-4 px-2"
                  style={{
                    background: "#eee",
                  }}
                >
                  <div className="col-md-8">
                    <div className="form-group mt-3">
                      <label>Account Name*</label>
                      <span className="drop-icom">▼</span>
                      <select
                        className="form-control"
                        onChange={(e) => onChangeAccount(e.target.value)}
                        // defaultValue={selectedAcc}
                        required
                      >
                        <option value={""} key={0}>
                          --- Select One ---
                        </option>
                        {accountList.map((item, index) => (
                          <option
                            value={item?.account_id}
                            key={index}
                          // selected={parseInt(selectedAcc) === item?.account_id}
                          >
                            {item?.account_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group mt-3">
                      <label>Site Name*</label>
                      <span className="drop-icom">▼</span>
                      <select
                        className="form-control"
                        onChange={(e) => setSelectedSite(e.target.value)}
                        // defaultValue={selectedSite}
                        required
                      >
                        <option value={""} key={0}>
                          --- Select One ---
                        </option>
                        {/* {
                      parseInt(siteId) === 0 ?
                        <option value={0} selected> Pending </option>
                        :
                        ''
                    } */}
                        {AedSiteList.map((item, index) => (
                          <>
                            <option
                              value={item?.account_site_info_id}
                              key={index}
                              selected={
                                parseInt(selectedSite) === item?.account_site_info_id
                              }
                            >
                              {item?.account_site_name}
                            </option>
                          </>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

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


              </Form>
            </div>
          </div>

        </Modal.Body>
      </Modal>

    </>
  );
};

export default OutOfServiceSecondModal;
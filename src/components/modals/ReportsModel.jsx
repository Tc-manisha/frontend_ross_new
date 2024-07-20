import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "./outOfServiceModal/outOfServiceModal.scss";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import { FormControlLabel, Switch, Button } from "@mui/material";
import { toast } from "react-toastify";
import MessageHandler from "../common/MessageHandler";
import { CallGETAPI, CallPOSTAPI } from "../../helper/API";

const ReportsModel = ({ openReports, setOpenReports,privileges }) => {
  const handleClose = () => setOpenReports(false);
  const [selectedReport, setSelectedReport] = useState("");
  const [downloadPath, setDownloadPath] = useState("")

const handleSubmit = async (e) => {
  e.preventDefault();
  let payload = {};
  if(selectedReport === "site-tab") {
    payload = {
      site: "site"
    };
  }
    if(selectedReport === "contact-tab") {
      payload = {
        contact: "contact"
      }};
      if(selectedReport === "equipment-tab") {
        payload = {
          equipment : "equipment" 
        }};
        if(selectedReport === "notes-tab") {
          payload = {
            note : "note" 
          }};
          if(selectedReport === "support-tab") {
            payload = {
              support: "support"
            };
          }
  const res = await CallPOSTAPI("user/report", payload);
  console.log(res?.data?.filePath);
  // setDownloadPath(res?.data?.filePath);
  const path = res?.data?.filePath;
  handleDownload(path);
}

const handleDownload = (path) => {
  console.log(path)
  if (path) {
    const fullURL = `https://dev.rossdev.xyz/${path}`;
    // Construct a temporary anchor element
    const link = document.createElement("a");
    console.log(link);
    link.href = fullURL;
    console.log(link.href);
    link.download = "report.csv";
    console.log(link.download)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("File download successfully")
    // handleClose();
    setOpenReports(false);
  } else {
    toast.error("No file to download");
    // handleClose();
    setOpenReports(false);
  }
};


const filteredPrivileges = privileges?.filter(
  (item) => item === "site-tab" || item === "contact-tab"
   || item === "equipment-tab" || item === "notes-tab"
   || item === "support-tab"
);
console.log({filteredPrivileges})

console.log(downloadPath)

  return (
    <>
      <Modal
        show={openReports}
        onHide={handleClose}
        // dialogClassName="modal-half"
        // aria-labelledby="example-custom-modal-styling-title"
        size="lg"
        style={{ maxWidth: "500px", marginLeft: "30%"  }}
        // id="outofservice-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-3">
            <span>Reports</span>
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
                      <div className="row">
                        <Form.Group className="col-md mb-3">
                          <Form.Label>Reports List </Form.Label>
                          <select
                            className="form-control"
                            name="loaner_rental_serial"
                            value={selectedReport}
                            onChange={(e) => setSelectedReport(e.target.value)}
                            // disabled={!switchValue.value || !formData?.loaner_toggle}
                          >
                            <option value="" key={0} selected>
                              --Select One--
                            </option>
                            {/* {filteredPrivileges?.map((permission, index) => (
                              <option key={index} value={permission}>
                                {permission}
                              </option>
                            ))} */}
                            {privileges.includes("site-tab") && <option value="site-tab"> Site Report</option>}
                            {privileges.includes("contact-tab") && <option value="contact-tab"> Contact Report</option>}
                            {privileges.includes("equipment-tab") && <option value="equipment-tab"> Equipment Report</option>}
                            {privileges.includes("notes-tab") && <option value="notes-tab"> Notes Report</option>}
                            {privileges.includes("support-tab") && <option value="support-tab"> Support Report</option>}

                          </select>
                        </Form.Group>
                      </div>

                      <div className="row">
                        <Form.Group
                          className="col-md mt-4"
                          style={{ maxWidth: "120px" }}
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
                            onClick={(e)=> handleSubmit(e)}
                            // disabled={switchValue.value === true ? false : true}
                          >
                            Download
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

export default ReportsModel;

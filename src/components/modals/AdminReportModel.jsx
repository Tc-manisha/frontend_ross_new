import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "./outOfServiceModal/outOfServiceModal.scss";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import { FormControlLabel, Switch, Button } from "@mui/material";
import { toast } from "react-toastify";
import MessageHandler from "../common/MessageHandler";
import { CallGETAPI, CallPOSTAPI } from "../../helper/API";
import CommonDatePicker from "../common/date-picker/CommonDatePicker";

const AdminReportsModel = ({ openReports, setOpenReports }) => {
  const handleClose = () => setOpenReports(false);
  const [selectedReport, setSelectedReport] = useState("");
  const [downloadPath, setDownloadPath] = useState("");
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
  });

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const permission = [
    "Site Report",
    "Contact Report",
    "Equipment Report",
    "Notes Report",
    "Support Report",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {};
    if (selectedReport === "Site Report") {
      payload = {
        site: "site",
        from_date: formData?.from_date,
        to_date: formData?.to_date,
      };
    }
    if (selectedReport === "Contact Report") {
      payload = {
        contact: "contact",
        from_date: formData?.from_date,
        to_date: formData?.to_date,
      };
    }
    if (selectedReport === "Equipment Report") {
      payload = {
        equipment: "equipment",
        from_date: formData?.from_date,
        to_date: formData?.to_date,
      };
    }
    if (selectedReport === "Notes Report") {
      payload = {
        note: "note",
        from_date: formData?.from_date,
        to_date: formData?.to_date,
      };
    }
    if (selectedReport === "Support Report") {
      payload = {
        support: "support",
        from_date: formData?.from_date,
        to_date: formData?.to_date,
      };
    }
    const res = await CallPOSTAPI("admin/report", payload);
   
    // setDownloadPath(res?.data?.filePath);
    const path = res?.data?.filePath;
    handleDownload(path);
  };

  const handleDownload = (path) => {
    if (path) {
      const fullURL = `https://api.rossdev.xyz/${path}`;
      // Construct a temporary anchor element
      const link = document.createElement("a");
      link.href = fullURL;
      link.download = "report.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("File download successfully");
      // handleClose();
      setOpenReports(false);
    } else {
      toast.error("No file to download");
      // handleClose();
      setOpenReports(false);
    }
  };

  // const filteredPrivileges = privileges?.filter(
  //   (item) => item === "site-tab" || item === "contact-tab"
  //    || item === "equipment-tab" || item === "notes-tab"
  //    || item === "support-tab"
  // );


  return (
    <>
      <Modal
        show={openReports}
        onHide={handleClose}
        // dialogClassName="modal-half"
        // aria-labelledby="example-custom-modal-styling-title"
        size="lg"
        style={{ maxWidth: "500px", marginLeft: "30%" }}
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
                        <Form.Group className="col-md ">
                          <Form.Label> From</Form.Label>
                          <div className="d-flex">
                            {" "}
                            <CommonDatePicker
                              calName="from_date"
                              CalVal={formData.from_date}
                              HandleChange={handleDateChange}
                              maxDate={
                                formData.to_date
                                  ? new Date(formData.to_date)
                                  : null
                              }
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="col-md">
                          <Form.Label> To</Form.Label>
                          <div className="d-flex">
                            {" "}
                            <CommonDatePicker
                              calName="to_date"
                              CalVal={formData.to_date}
                              HandleChange={handleDateChange}
                              minDate={
                                formData.from_date
                                  ? new Date(formData.from_date)
                                  : null
                              }
                              // disabled={!formData.from_date}
                            />
                          </div>
                        </Form.Group>
                      </div>

                      <div className="row mt-4">
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
                            {permission?.map((permission, index) => (
                              <option key={index} value={permission}>
                                {permission}
                              </option>
                            ))}
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
                            onClick={(e) => handleSubmit(e)}
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

export default AdminReportsModel;

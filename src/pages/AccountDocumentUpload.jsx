import React, { useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import axios from "axios";
import { CallPOSTAPI, CallPOSTAPINEWFileUpload } from "../helper/API";
// import { Box, Modal } from "@mui/material";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { GetProfile } from "../helper/Common";
import { DecryptToken } from "../helper/BasicFn";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// const BASE_API = "https://www.uploads.mightyegor.com/api/upload-document";
const BASE_API = "https://www.upload.rossdev.xyz/api/upload-document";

const AccountDocumentUpload = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);

  const [validated, setValidated] = useState(false);
  const [document_name, set_document_name] = useState("");
  const [file_name, set_file_name] = useState(null);
  const [file_data, set_file_data] = useState(null);
  const [comment, set_comment] = useState("");

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  const { state } = location;
  console.log({state})
  const { accountId, siteId,contactId } = state;
  const { type } = location.state;
console.log(type)
console.log(siteId)

  const HandleBackClick = () => {
    window.history.back();
  };

  const handleFileChange = async (e) => {
    // setValidated(false);
    setLoading(true);
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // const maxSizeInBytes = 5242880; // 5 MB (adjust this as needed)

      const maxSizeInBytes = 26214400;

      if (selectedFile.size > maxSizeInBytes) {
        // console.log("File size exceeds the limit (5 MB).");
        toast.error("File size must be less than 25MB.");
        set_file_name(null);
        setLoading(false);
      } else {
        set_file_name(selectedFile);
        setLoading(false);
        // let fileData = new FormData();
        // fileData.append("document", selectedFile);
        // const response = await axios.post(BASE_API, fileData);
        // if (response.data.status) {
        //   set_file_data(response.data.data);
        //   setLoading(false);
        // } else {
        //   set_file_data(null);
        //   setLoading(false);
        // }
      }
    } else {
      set_file_name(null); // Clear file_name when no file is selected.
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (document_name === "" || !file_name || file_name.name === "") {
      setValidated(true);
      return;
    }
    
    setLoading(true);

    let fileData = new FormData();
    fileData.append("document", file_name);
    const uploadResponse = await axios.post(BASE_API, fileData);
    if (uploadResponse.data.status) {
      set_file_data(uploadResponse.data.data);

      // let userData =GetProfile();// JSON.parse(localStorage.getItem("ross-profile"));
      let userData = DecryptToken();
      let payload;
      if(location.state.type === 'Support') {
        payload = {
        document_name,
        file_name: uploadResponse.data.data,
        comment,
        accountId: parseInt(accountId),
        siteId: 0,
        contactId: 0,
        uploaded_by: parseInt(userData.userID),
        aedId: Number(location.state.aedId),
        }
       } else {

       payload = {
        document_name,
        file_name: uploadResponse.data.data,
        comment,
        accountId: parseInt(accountId),
        siteId: type === "site" ? (siteId ? parseInt(siteId) : 0) : 0,
        contactId: type === "contact" ? (contactId || 0) : 0,
        uploaded_by: parseInt(userData.userID),
      };
    }

      // if (type === "account") {
      //   formData.siteId = siteId ? parseInt(siteId) : 0;
      //   formData.contactId = contactId ? parseInt(contactId) : 0;
      // }
      
      // console.log(payload);
      const response = await CallPOSTAPI("document-upload", payload);
      if (response.data.success) {
        toast.success("data saved successfully.");
        set_file_data(null);
        set_file_name(null);
        set_document_name("");
        set_comment("");
        setLoading(false);
        setValidated(false);
      } else {
        toast.error("data not saved.");
        setLoading(false);
      }
    } else {
      set_file_data(null);
      setLoading(false);
      toast.error("Something wrong happened.");
    }

    // let userData = JSON.parse(localStorage.getItem("ross-profile"));
    // const formData = {
    //   document_name,
    //   file_name: file_data,
    //   comment,
    //   accountId: parseInt(accountId),
    //   siteId: siteId ? parseInt(siteId) : 0,
    //   uploaded_by: parseInt(userData.userID),
    // };

    // // console.log("form data", formData);

    // const response = await CallPOSTAPI("document-upload", formData);

    // if (response.data.success) {
    //   toast.success("data saved successfully.");
    //   set_file_data(null);
    //   set_file_name(null);
    //   set_document_name("");
    //   set_comment("");
    //   setLoading(false);
    // } else {
    //   toast.error("data not saved.");
    //   setLoading(false);
    // }
  };

  // if (loading) {
  //   return (
  //     <Spinner animation="border" role="status">
  //       <span className="visually-hidden">Loading...</span>
  //     </Spinner>
  //   );
  // }

  return (
    <div className="mb-5">
      <div
        className="mt-3"
        style={{ width: "95%", margin: "auto", padding: "6px 0" }}
      >
        {/* { ToogleIcon() } */}
        <button
          className="btn text-primary"
          type="button"
          onClick={() => {
            HandleBackClick();
          }}
        >
          <img src="/back.svg" alt="svg" style={{ marginRight: "5px" }} />
          <span className="ms-2">Back</span>
        </button>
      </div>
      <div>
        {loading ? (
          <div className="text-center">
            {/* <Spinner animation="border" role="status"> */}
              <span className="visually-hidden">{loading} </span>
            {/* </Spinner> */}
          </div>
        ) : (
          <Form
            className=""
            onSubmit={handleSubmit}
            noValidate
            validated={validated}
            encType="multipart/formdata"
          >
            <div className="contailer-fluid px-4 mx-4">
              <div
                className="container-fluid bottom-border-blue pb-4 pt-2"
                style={{ background: "#eee" }}
              >
                <h2 className="text-left heading">General Information</h2>
                <div className="row mb-4 mt-3">
                  <div className="col-6">
                    <div className="row">
                      <Form.Group className={"col"} controlId="document_name">
                        <Form.Label>
                          Document Name<sup className="text-danger">*</sup>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="document_name"
                          value={document_name}
                          onChange={(e) => set_document_name(e.target.value)}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please Enter Document Name.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className={"col"} controlId="file_name">
                        <Form.Label>
                          File Name<sup className="text-danger">*</sup>
                        </Form.Label>

                        <div className="d-flex align-items-center">
                        <div className="d-flex flex-direction-row ">
                          <div>
                          <Form.Control
                            type="text"
                            // name={document.key+"_cert_file_name"}
                            defaultValue={file_name?.name}
                            required
                            readOnly
                            // defaultValue={getImageName(formData[document.key + '_cert_file'])}
                          />
                          <Form.Control.Feedback type="invalid">
                           Please upload the file.
                          </Form.Control.Feedback>
                        </div></div>
                            <button
                            className="btn ms-2 file-input-div"
                            type="button"
                          >
                            <img src="/upload.svg" alt="upload" />
                            <input
                              type="file"
                              // name={document.key + '_cert_file'}
                              className="hidden-file"
                              name="file_name"
                              size="sm"
                              accept=".jpg, .jpeg, .png, .pdf, .xlsx, .xls, .docx, .doc, .pdg, .gif"
                              // value={file_name}
                              onChange={(e) => {
                                handleFileChange(e);
                              }}
                              required
                            />
                          </button>

                          {file_name && (
                            <a
                              className="pointer"
                              href={URL.createObjectURL(file_name)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src="/view_document.svg"
                                width={20}
                                height={20}
                                alt="view"
                              />
                            </a>
                          )}
                        </div>
                        {!file_name && ( 
                        <Form.Control.Feedback type="invalid">
                          Please upload the file.
                        </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </div>
                  </div>

                  <Form.Group className={"col-6"} controlId="comment">
                    <Form.Label>
                      Comment
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      name="comment"
                      value={comment}
                      onChange={(e) => set_comment(e.target.value)}
                      />
                   </Form.Group>
                </div>
              </div>

              <div
                className="container-fluid bottom-border-blue"
                style={{ marginBottom: "50px" }}
              >
                <div
                  className="col-md-12 d-flex"
                  style={{ marginTop: "25px", justifyContent: "right" }}
                >
                  <Button
                    className={"btn btn-danger mx-4"}
                    variant="danger"
                    style={{ fontSize: "16px" }}
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    className={"btn btn-success"}
                    variant="success"
                    style={{ marginRight: "5px", fontSize: "16px" }}
                    type="submit"
                    // disabled={ loading }
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </div>
      {/* <DocumentViewModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        numPages={numPages}
        setNumPages={setNumPages}
        file_name={file_name}
      /> */}
    </div>
  );
};

const DocumentViewModal = ({
  openModal,
  setOpenModal,
  pageNumber,
  setPageNumber,
  numPages,
  setNumPages,
  file_name,
}) => {
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <Modal show={openModal} onHide={() => setOpenModal(false)} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>Document</Modal.Title>
      </Modal.Header>
      <Modal.Body className="">
        <div className="w-75 mx-auto">
          {file_name && file_name.type === "application/pdf" && (
            <div className="pdf-preview">
              <Document
                file={URL.createObjectURL(file_name)}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} />
              </Document>
              <div>
                <p>
                  Page {pageNumber} of {numPages}
                </p>
                <button onClick={prevPage} disabled={pageNumber <= 1}>
                  Previous Page
                </button>
                <button onClick={nextPage} disabled={pageNumber >= numPages}>
                  Next Page
                </button>
              </div>
            </div>
          )}
          {file_name && file_name.type !== "application/pdf" && (
            <img
              className="w-75 mx-auto"
              src={URL.createObjectURL(file_name)}
              alt="image"
            />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AccountDocumentUpload;

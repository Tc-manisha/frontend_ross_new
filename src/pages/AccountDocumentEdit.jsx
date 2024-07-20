import React, { useEffect, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import axios from "axios";
import {
  CallGETAPI,
  CallPOSTAPI,
  CallPOSTAPINEWFileUpload,
} from "../helper/API";
// import { Box, Modal } from "@mui/material";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Loading from "../pages/accounts/Loading";

// const BASE_API = "https://www.uploads.mightyegor.com/public/";
// const BASE_API_POST = "https://www.uploads.mightyegor.com/api/upload-document";
const BASE_API = "https://www.upload.rossdev.xyz/public/";
const BASE_API_POST = "https://www.upload.rossdev.xyz/api/upload-document";

const AccountDocumentEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [validated, setValidated] = useState(false);

  const [document_name, set_document_name] = useState("");
  const [file_name, set_file_name] = useState(null);
  const [file_data, set_file_data] = useState(null);
  const [comment, set_comment] = useState("");

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(true)
  const [newUpload, setNewUpload] = useState(false);

  const { state } = location;
  const { accountId, siteId } = state;

  // console.log("state", state);

  const HandleBackClick = () => {
    window.history.back();
  };

  const [documentData, setDocumentData] = useState(null);

  const getDocumentsData = async () => {
    const response = await CallGETAPI("get-document-by-id/", id);

    if (response?.status) {
      // setDocumentData(response.data.data);
      set_document_name(response.data.data.parent_document_name);
      set_comment(response.data.data.comment);
      set_file_name({ name: response.data.data.original_name });
      set_file_data({
        id: response.data.data.document_unique_name,
        original_name: response.data.data.original_name,
      });
    }
    setLoading2(false);
  };

  useEffect(() => {
    if (id) {
      getDocumentsData();
    }
  }, [id]);

  const handleFileChange = async (e) => {
    setLoading(true);
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const maxSizeInBytes = 26214400;
      if (selectedFile.size > maxSizeInBytes) {
        // console.log("File size exceeds the limit (5 MB).");
        toast.error("File size must be less than 25MB.");
        // set_file_name(null);
        setLoading(false);
      } else {
        set_file_name(selectedFile);
        console.log("selected file", selectedFile);
        setNewUpload(true);
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (newUpload) {
      let fileData = new FormData();
      fileData.append("document", file_name);
      const uploadResponse = await axios.post(BASE_API_POST, fileData);
      if (uploadResponse.data.status) {
        set_file_data(uploadResponse.data.data);

        const formData = {
          document_name,
          file_name: uploadResponse?.data?.data,
          comment,
        };

        const response = await CallPOSTAPI(
          `document-upload-edit/${id}`,
          formData
        );

        if (response.data.success) {
          toast.success("data saved successfully.");

          setLoading(false);
        } else {
          toast.error("data not saved.");
          setLoading(false);
        }
      } else {
        // set_file_data(null);
        setLoading(false);
        toast.error("Something wrong happened.");
      }
    } else {
      const formData = {
        document_name,
        file_name: file_data,
        comment,
      };

      const response = await CallPOSTAPI(
        `document-upload-edit/${id}`,
        formData
      );

      if (response.data.success) {
        toast.success("data saved successfully.");
        setLoading(false);
      } else {
        toast.error("data not saved.");
        setLoading(false);
      }
    }
  };

  return (
    <>
    {loading2 ?
      <>
        <div className="showloading">
          <Loading />
        </div>
      </>
    :
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
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Form
            className=""
            onSubmit={handleSubmit}
            noValidate
            validated={validated}
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
                          <Form.Control
                            type="text"
                            // name={document.key+"_cert_file_name"}
                            defaultValue={file_name?.name}
                            required
                            // defaultValue={getImageName(formData[document.key + '_cert_file'])}
                          />
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
                              accept=".jpg, .jpeg, .png, .pdf"
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
                              href={
                                file_name.data
                                  ? URL.createObjectURL(file_name)
                                  : `${BASE_API}${file_data.id}`
                              }
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
                        <Form.Control.Feedback type="invalid">
                          Please upload the file.
                        </Form.Control.Feedback>
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
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please Enter Comment.
                    </Form.Control.Feedback>
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
    </div>
      }
    </>
  );
};

export default AccountDocumentEdit;

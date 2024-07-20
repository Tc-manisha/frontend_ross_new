import CustomToggleButton2 from "../../../components/common/toggleSwitch/CustomToggle2";
import upload from "../../../img/Upload.svg";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { BASE_API, CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import axios from "axios";
import cancel from "../../../img/Cancel.svg";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
  Button,
} from "react-bootstrap";
import TableSkeleton from "../skeleton/table/TableSkeleton";
import Loading from "../Loading";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import moment from "moment";
import { FormatDate } from "../../../helper/Common";
import imageCompression from "browser-image-compression";
import { DecryptToken } from "../../../helper/BasicFn";

const BASE_API_UPLOAD = "https://www.upload.rossdev.xyz/api/upload-document";

const AedServiceCheckService1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [btnLoading, setBtnLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const aedId = queryParams.get("aedId");
  const aedIdArray = aedId.split(",").map(Number);
  const { accountId, siteId } = useParams();
  const [technicianData, setTechnicianData] = useState([]);
  const [formData, setFormData] = useState({
    accountId: accountId,
    aeds_id: aedIdArray,
    inspection_date: new Date(),
    inspection_by: "",
    contact_id: "",
    aeds_ready_status: 1,
    rescue_kits_status: 0,
    alarm_batteries_status: 0,
    accessories_status: 0,
    servicing_notes: "",
    issue_description: "",
    issue_toggle: 0,
    servicing_images_data: [],
  });

  const [file, setFile] = useState(null);
  // console.log('file: ', file)
  const [servicingNotesError, setServicingNotesError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [insepectionByError, setInsepectionByError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInventory, setIsInventory] = useState(0)
  const user = DecryptToken();

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;

    // console.log({ selectedFiles });

    setFile((prevFiles) => [...(prevFiles || []), ...selectedFiles]);

    setFormData((prev) => ({
      ...prev,
      servicing_images_data: Array.isArray(prev.servicing_images_data)
        ? [...(prev.servicing_images_data || []), ...selectedFiles]
        : [...selectedFiles],
    }));
  };

  const calendarIcon = () => {
    return <img src="/calendar.svg" alt="calendar" />;
  };

  const fetchData = async () => {
    try {
      // const res = await CallGETAPI(`account/site_technician/${siteId}`);
      const res = await CallGETAPI(`account/site_technician/${siteId}`);
      setTechnicianData(res?.data.technicians);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [siteId]);

  const handleCalendarChange = (date, fieldName) => {
    const formattedDate = dayjs(date).format("MM/DD/YYYY");
    setFormData((prev) => ({
      ...prev,
      [fieldName]: formattedDate,
    }));
  };

  const scrollToError = (selector, additionalDistance) => {
    const errorElement = document.querySelector(selector);
    if (errorElement) {
      const offsetTop = errorElement.offsetTop - additionalDistance;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (formSubmitted) {
      scrollToError(".form-control.is-invalid", 300);
    }
  }, [formSubmitted]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // if (file?.length > 5) {
    //   toast.error('Maximum 5 images are allowed.');
    // }
    // else {
    var newDate = new Date();
    var currentHour = newDate.getHours();
    var currentMinute = newDate.getMinutes();
    var currentSecond = newDate.getSeconds();
    var currentTime = currentHour + ":" + currentMinute + ":" + currentSecond;

    setFormSubmitted(true);
    if (formData.inspection_date === "") {
      setFormSubmitted(true);
      return;
    }

    if (formData.contact_id === "") {
      setInsepectionByError(true);
      return;
    }

    if (formData.servicing_notes.trim() === "") {
      setServicingNotesError(true);
      return;
    }

    try {
      // setLoading(true);
      setBtnLoading(true);
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const uploadPromises = formData.servicing_images_data.map(
        async (file, index) => {
          const compressedFile = await imageCompression(file, options);

          let fileData = new FormData();
          // fileData.append(`document`, file);
          fileData.append(`document`, compressedFile, file.name);

          const uploadResponse = await axios.post(BASE_API_UPLOAD, fileData);

          return uploadResponse.data.data;
        }
      );
      const uploadedFiles = await Promise.all(uploadPromises);
      const Cdate = moment(formData.inspection_date);
      const Ctime = moment(currentTime, "HH:mm");
      const dateTime = Cdate.format("YYYY-MM-DD") + " " + Ctime.format("HH:mm");
      // console.log({dateTime});
      // return "";
      const payload = {
        accountId: accountId,
        aeds_id: formData.aeds_id,
        inspection_date: dateTime,
        inspection_by: formData.inspection_by,
        contact_id: formData.contact_id,
        aeds_ready_status: formData.aeds_ready_status,
        rescue_kits_status: formData.rescue_kits_status,
        alarm_batteries_status: formData.alarm_batteries_status,
        accessories_status: formData.accessories_status,
        servicing_notes:
          formData.issue_toggle === 0 ? formData.servicing_notes : "",
        issue_description:
          formData.issue_toggle === 1 ? formData.servicing_notes : "",
        issue_toggle: formData.issue_toggle,
        servicing_images_data: uploadedFiles,
        site_id: siteId,
      };
      const response = await CallPOSTAPI("account/service-questions", payload);
      if (response.status) {
        toast.success("Service Question Submitted Successfully");
      }
      const serviceQuestionID = response.data.service_questions_id;

      if (
        formData.aeds_ready_status === 1 &&
        formData.rescue_kits_status === 0 &&
        formData.alarm_batteries_status === 0 &&
        formData.accessories_status === 0
      ) {
        if((user?.user_type === 2 && user?.sub_admin == "") || user?.user_type === 3){
          navigate(`/user/aed-details/${accountId}/`, {
            state: {
              tab: "Equipment",
            },
          });
        } else {
        navigate(`/account-details/${accountId}/`, {
          state: {
            tab: "Equipment",
          },
        });
      }
      } else {
        navigate(`/account/aed/service-check/service2/${serviceQuestionID}`, { state: { isInventory: isInventory } });
      }
    } catch (error) {
      // setLoading(false);
      setBtnLoading(false);
      toast.error("An error occurred while submitting the form.");
    }
  };

  const handleToggleChange = (event) => {
    const newValue = event.target.checked ? 1 : 0;

    switch (event.target.name) {
      case "aeds_ready_status":
        setFormData((prev) => ({
          ...prev,
          aeds_ready_status: newValue,
        }));
        break;

      case "rescue_kits_status":
        setFormData((prev) => ({
          ...prev,
          rescue_kits_status: newValue,
        }));
        break;

      case "alarm_batteries_status":
        setFormData((prev) => ({
          ...prev,
          alarm_batteries_status: newValue,
        }));
        break;

      case "accessories_status":
        setFormData((prev) => ({
          ...prev,
          accessories_status: newValue,
        }));
        break;

      case "issue_toggle":
        setFormData((prev) => ({
          ...prev,
          issue_toggle: newValue,
        }));
        break;

      default:
        break;
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFile((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    setFormData((prev) => ({
      ...prev,
      servicing_images_data: prev.servicing_images_data.filter(
        (_, index) => index !== indexToRemove
      ),
    }));

    // Reset the input value to allow uploading the same file again
    const fileInput = document.querySelector(".hidden-file");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  useEffect(() => {
    // Trigger the onChange event after setting the default value
    if (Array.isArray(technicianData) && technicianData.length > 0) {
      const defaultOption =
        technicianData.length > 0 ? technicianData[0].contact_id : "";
      const event = { target: { value: defaultOption } };
      handleChange(event);
    }
  }, [technicianData]);

  const handleChange = (e) => {

    if (Array.isArray(technicianData) && technicianData.length > 0) {
      const selectedTechnician = technicianData.find(
        (technician) =>
          technician.contact_id === parseInt(String(e.target.value).trim(), 10)
      );

      setFormData((prev) => ({
        ...prev,
        contact_id: e.target.value,
        inspection_by: selectedTechnician
          ? selectedTechnician?.contact_name
          : e.target.value,
      }));
      setInsepectionByError(false);
    }
  };

  useEffect(() => {
    checkInventory(formData?.contact_id ? formData?.contact_id : (technicianData.length > 0 ? technicianData[0].contact_id : ''))
  }, [formData?.contact_id])

  const checkInventory = async (contactID) => {
    const response = await CallGETAPI(`account/check-technician-inventory/${contactID}`)
    if (response?.status) {
      setIsInventory(response?.data?.is_inventory)
    }
  }

  return (
    <>
      {loading && (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      )}

      <div className="mt-4 " style={{ width: "98vw", paddingInline: "2%" }}>
        <Form onSubmit={(e) => handleSubmit(e)}>
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
                          style={{
                            borderRadius: 4,
                            border: "0.5px solid #ccc",
                          }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack spacing={3}>
                              <DesktopDatePicker
                                label=""
                                components={{
                                  OpenPickerIcon: calendarIcon,
                                }}
                                value={formData.inspection_date}
                                onChange={(newValue) =>
                                  handleCalendarChange(
                                    newValue,
                                    "inspection_date"
                                  )
                                }
                                renderInput={(params) => (
                                  <TextField
                                    className="form-control"
                                    {...params}
                                    error={
                                      formSubmitted &&
                                      formData.inspection_date === ""
                                    }
                                    helperText={
                                      formSubmitted &&
                                        formData.inspection_date === ""
                                        ? "Please fill in the date."
                                        : ""
                                    }
                                    required
                                  />
                                )}
                                isInvalid={formData.inspection_date === ""}
                                format="yyyy-MM-dd"
                                required
                              />
                            </Stack>
                          </LocalizationProvider>
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
                      <Form.Group
                        className={"row"}
                        style={{ maxWidth: "250px" }}
                      >
                        {
                          Array.isArray(technicianData) && technicianData.length > 0 ?
                            <>
                              <select
                                value={
                                  formData?.contact_id ||
                                  (technicianData.length > 0
                                    ? technicianData[0].contact_id
                                    : "")
                                }
                                onChange={(e) => {

                                  const selectedContactId = e.target.value;

                                  const selectedTechnician = technicianData.find(
                                    (technician) =>
                                      technician.contact_id ===
                                      parseInt(e.target.value.trim(), 10)
                                  );
                                  setFormData((prev) => ({
                                    ...prev,
                                    contact_id: e.target.value,
                                    inspection_by: selectedTechnician
                                      ? selectedTechnician?.contact_name
                                      : selectedContactId
                                  }));
                                  setInsepectionByError(false);
                                  // checkInventory(selectedContactId)
                                }}
                                className={`form-control ${insepectionByError ? "is-invalid" : ""
                                  }`}
                                style={{ width: "200px" }}
                              >
                                {technicianData.map((technician) => (
                                  <option
                                    key={technician.contact_id}
                                    value={technician.contact_id}
                                  >
                                    {technician.contact_name}
                                  </option>
                                ))}
                              </select>
                            </>
                            :
                            <>
                              <select
                                value={formData?.contact_id}
                                className={`form-control ${insepectionByError ? "is-invalid" : ""
                                  }`}
                                style={{ width: "200px" }}
                              >
                                <option>---Select One---</option>
                              </select>
                            </>
                        }

                        <Form.Control.Feedback type="invalid">
                          Select Inspection Completed by.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td> Are all AEDS present and in a ready status?</td>
                  <td>
                    {" "}
                    <CustomToggleButton2
                      ToggleName="aeds_ready_status"
                      ToggleValue={formData?.aeds_ready_status}
                      changeHandler={handleToggleChange}
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
                      ToggleValue={formData?.rescue_kits_status}
                      changeHandler={handleToggleChange}
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
                      ToggleValue={formData?.alarm_batteries_status}
                      changeHandler={handleToggleChange}
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
                      ToggleValue={formData?.accessories_status}
                      changeHandler={handleToggleChange}
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
                  ToggleValue={formData?.issue_toggle}
                  changeHandler={handleToggleChange}
                  is_read_only={false}
                />
              </div>
            </div>
            <Form.Group
              className={`service-notes-container ${servicingNotesError ? "is-invalid" : ""
                }`}
            >
              <textarea
                className={`form-control ${servicingNotesError ? "is-invalid" : ""
                  }`}
                name="servicing_notes"
                placeholder="Enter Servicing Notes"
                value={formData?.servicing_notes}
                style={{
                  height: "200px",
                  width: "100%",
                  border: `3px solid ${servicingNotesError ? "#be6464" : "#337ab7"
                    }`,
                }}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    servicing_notes: e.target.value,
                  }));
                  setServicingNotesError(false);
                }}
              //  required
              ></textarea>
              {servicingNotesError && !formData?.servicing_notes && (
                <div className="invalid"> Please fill servicing notes </div>
              )}
            </Form.Group>
          </div>

          <div className="col py-2">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 className="heading">Servicing Images Upload</h2>
              <button
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  cursor: "pointer",
                }}
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
                  accept=".jpg, .jpeg, .png, .gif"
                  // value={file}
                  onChange={(e) => {
                    handleFileChange(e);
                  }}
                  multiple
                // required
                />
                <h2
                  className="heading"
                  style={{
                    minWidth: "150px",
                    fontWeight: "lighter",
                    fontSize: "21px",
                    margin: "0px",
                  }}
                >
                  Upload Images
                </h2>
              </button>
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
                {file &&
                  file.map((uploadedFile, index) => (
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
                        src={URL.createObjectURL(uploadedFile)}
                        alt={uploadedFile.name}
                        style={{ height: "120px", width: "200px" }}
                      />
                      <h4
                        style={{
                          fontFamily: "sans-serif",
                          fontSize: "12px",
                          maxWidth: "200px",
                        }}
                      >
                        {uploadedFile.name}
                      </h4>
                      <span
                        style={{
                          position: "absolute",
                          right: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleRemoveFile(index)}
                      >
                        <img src={cancel} height={13} alt="cancel" />
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
            {/* <p style={{ marginTop: '0.5%', opacity: '70%' }}>*Maximum 5 Images</p> */}
          </div>

          <div className="row pb-3 py-4" style={{ marginBottom: "6%" }}>
            <div className="col-12 content-flex-right">
              <button
                className="btn text-uppercase cancel-button"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                type="submit"
                disabled={btnLoading}
                className="btn text-uppercase ms-4 submit-button"
                style={{ borderColor: "#5cb200" }}
              >
                {btnLoading ? "Loading..." : "Submit"}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AedServiceCheckService1;

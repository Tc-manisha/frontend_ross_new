import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import { DateFormate } from "../../../../helper/TblFn";
import Moment from "react-moment";
import Container from "react-bootstrap/Container";
import { CallGETAPI, CallGETAPINEW } from "../../../../helper/API";
import { useParams } from "react-router-dom";
import { formatPhoneNumber, prepareOptions } from "../../../../helper/Common";
import { GetCalendarGroup } from "../../../../helper/BasicFn";

export default function Details({ assignedInstructors }) {
  const [inpersonClass, setInpersonsClass] = useState({});
  const [classContacts, setClassContacts] = useState({});
  const [trainingData, setTrainignData] = useState({});
  const { inpersonId } = useParams();

  // get inperson data
  const getInpersonData = async () => {
    const inpersonData = await CallGETAPINEW(
      "account/inperson-class/" + inpersonId
    );

    if (inpersonData?.status) {
      const inperson = inpersonData?.data?.data?.inpersonClass;
      inperson.account_name = inpersonData?.data?.data?.account_name;
      inperson.cert_name = inpersonData?.data?.data?.certName;
      inperson.course_name = inpersonData?.data?.data?.courseName;
      inperson.site_name = inpersonData?.data?.data?.site_name;

      inperson.aed_information = JSON.parse(inperson?.aed_information);
      inperson.class_contacts = JSON.parse(inperson?.class_contacts);
      inperson.classes = JSON.parse(inperson?.classes);
      inperson.class_instructors =
        inperson?.class_instructors != null
          ? JSON.parse(inperson?.class_instructors)
          : "";
      inperson.broad_cast =
        inperson?.broad_cast != null ? JSON.parse(inperson?.broad_cast) : "";
      inperson.is_instructor_approved =
        JSON.parse(inperson?.is_instructor_approved) || [];

      setInpersonsClass(inperson);
      setClassContacts(inperson?.class_contacts[0]);

      if (inperson?.training_address_id) {
        let res = await CallGETAPI(
          "account/edit-training-address/" + inperson?.training_address_id
        );
        if (res?.status) {
          setTrainignData(res?.data?.trainingLocations);
        }
      }

      if (inperson?.color_group) {
        // filter colorGroup
        let colorGroup = await GetCalendarGroup();

        if (colorGroup.status) {
          let colorGroupData = colorGroup?.data?.calendarGroup;
          let allcolorGroupData = prepareOptions(
            colorGroupData,
            "calendar_group_id",
            "calendar_group_name"
          );
          const filteredcolorGroup = allcolorGroupData.find(
            (colorGroup) => colorGroup.value == inperson?.color_group
          );

          setInpersonsClass((old) => ({
            ...old,
            ["color_group_label"]: filteredcolorGroup?.label,
          }));
        }
      }
    }
  };

  // getInpersonData
  useEffect(() => {
    getInpersonData();
  }, []);

  // assignedInstructors
  useEffect(() => {}, [assignedInstructors]);

  return (
    <div>
      {/* account information */}
      <Box className="text-left">
        <h4 className="heading">Account Information</h4>
      </Box>

      <table className="w-100 border-b-blue mb-3">
        <thead>
          <tr className="">
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Account Name
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Site Name
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue"></th>
          </tr>
        </thead>
        <tbody className="odd-even-row">
          <tr className="">
            <td className=" py-1 px-2 tbl-border  border-r-blue">
              {inpersonClass?.account_name}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.site_name}
            </td>
            <td className=" py-1 px-2 tbl-border"></td>
          </tr>
        </tbody>
      </table>

      {/* Training Address Information */}
      <Box className="text-left">
        <h4 className="heading">Training Address Information</h4>
      </Box>

      <table className="w-100 border-b-blue mb-3">
        <thead>
          <tr className="">
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Company Name
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Training Address
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Phone
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Room Name
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue">
              Room Number
            </th>
          </tr>
        </thead>
        <tbody className="odd-even-row">
          <tr className="">
            <td className=" py-1 px-2 tbl-border  border-r-blue">
              {inpersonClass?.is_site_address == 1
                ? inpersonClass?.site_name
                : trainingData?.account_alternate_traning_location_company_name}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {trainingData?.account_alternate_traning_location_address1}{" "}
              {trainingData?.account_alternate_traning_location_address2}{" "}
              {trainingData?.account_alternate_traning_location_country_name}{" "}
              {trainingData?.account_alternate_traning_location_city}{" "}
              {trainingData?.account_alternate_traning_location_state_name}{" "}
              {trainingData?.account_alternate_traning_location_country_name}
              {trainingData?.account_alternate_traning_location_zipcode}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              <a
                className="link"
                style={{textDecoration:"none"}}
                href={
                  "tel:" +
                  trainingData?.alternative_ext +
                  trainingData?.alternative_phone
                }
              >
                {trainingData?.alternative_phone
                  ? formatPhoneNumber(trainingData.alternative_phone)
                  : ""}{" "}
                {trainingData?.alternative_ext
                  ? " X " + trainingData?.alternative_ext
                  : ""}
              </a>
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.room_name}
            </td>
            <td className=" py-1 px-2 tbl-border">
              {inpersonClass?.room_number}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Course Information */}
      <Box className="text-left">
        <h4 className="heading">Course Information</h4>
      </Box>

      <table className="w-100 border-b-blue mb-3">
        <thead>
          <tr className="">
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Certification Agency
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Course
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Skills Check
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Public
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Keycodes
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue">Package</th>
          </tr>
        </thead>
        <tbody className="odd-even-row">
          <tr className="">
            <td className=" py-1 px-2 tbl-border  border-r-blue">
              {inpersonClass?.cert_name}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.course_name}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.skills_check == 1 ? "Yes" : "No"}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.public == 1 ? "Yes" : "No"}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.keycodes == 1 ? "Yes" : "No"}
            </td>
            <td className=" py-1 px-2 tbl-border">
              {inpersonClass?.package == 1 ? "Yes" : "NA"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Class Occupancy Information */}
      <Box className="text-left">
        <h4 className="heading">Class Occupancy Information</h4>
      </Box>

      <table className="w-100 border-b-blue mb-3">
        <thead>
          <tr className="">
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Registered
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Expected
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Minimum
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Maximum
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue">
              Student Price
            </th>
          </tr>
        </thead>
        <tbody className="odd-even-row">
          <tr className="">
            <td className=" py-1 px-2 tbl-border  border-r-blue">
              {inpersonClass?.registered}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.expected}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.minimum}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.miximum}
            </td>
            <td className=" py-1 px-2 tbl-border">
              {"$" + inpersonClass?.student_price}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Schedule Information */}
      <Box className="text-left">
        <h4 className="heading">Schedule Information</h4>
      </Box>

      <table className="w-100 border-b-blue mb-3">
        <thead>
          <tr className="">
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Course Date
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Time
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Enrollment Closed Date
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Time
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              # of Instructors
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue">Hours</th>
          </tr>
        </thead>
        <tbody className="odd-even-row">
          <tr className="">
            <td className=" py-1 px-2 tbl-border  border-r-blue">
              {inpersonClass?.course_date
                ? new Date(inpersonClass.course_date).toLocaleDateString(
                    "en-US"
                  )
                : ""}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.course_time}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.registration_close_date
                ? new Date(
                    inpersonClass.registration_close_date
                  ).toLocaleDateString("en-US")
                : ""}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.registration_close_time}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.instructors_needed}
            </td>
            <td className=" py-1 px-2 tbl-border">{inpersonClass?.hours}</td>
          </tr>
        </tbody>
      </table>

      {/* Parking Information */}
      <Box className="text-left mt-5">
        <h4 className="heading">Parking Information</h4>
      </Box>

      <table className="w-100 border-b-blue mb-3">
        <thead>
          <tr className="">
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Parking Fee
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Loading Dock
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Onsite Parking
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Special Parking Instructions
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue">
              Sign-In / Security Procedures
            </th>
          </tr>
        </thead>
        <tbody className="odd-even-row">
          <tr className="">
            <td className=" py-1 px-2 tbl-border  border-r-blue">
              {"$" + inpersonClass?.parking_fee}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.loading_doc == 1 ? "Yes" : "No"}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.onsite_parking == 1 ? "Yes" : "No"}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.special_parking_instruction}
            </td>
            <td className=" py-1 px-2 tbl-border">
              {inpersonClass?.security_procedure}
            </td>
          </tr>
        </tbody>
      </table>

      {/* AV Information */}
      <Box className="text-left mt-5">
        <h4 className="heading">AV Information</h4>
      </Box>

      <table className="w-100 border-b-blue mb-3">
        <thead>
          <tr className="">
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              TV / Projector
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              DVD / Computer
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue">
              Speaker System{" "}
            </th>
          </tr>
        </thead>
        <tbody className="odd-even-row">
          <tr className="">
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.tv_projector == 1 ? "Yes" : "No"}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.dvd_computer == 1 ? "Yes" : "No"}
            </td>
            <td className=" py-1 px-2 tbl-border">
              {inpersonClass?.speaker_system == 1 ? "Yes" : "No"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* AED  Information */}
      <Box className="px-2 mt-3">
        <div className="row">
          <div className="col-md-4">
            <h4 className="heading mt-1">AED Information</h4>
            <table className="w-100 border-gray">
              <thead>
                <tr className="">
                  <th
                    scope="col"
                    width="45%"
                    className=" py-2 px-2 bg-tbl-border border-r-blue"
                  >
                    Brand
                  </th>
                  <th
                    scope="col"
                    width="45%"
                    className=" py-2 px-2 bg-tbl-border"
                  >
                    Model
                  </th>
                </tr>
              </thead>
              <tbody className="odd-even-row">
                {Array.isArray(inpersonClass?.aed_information) &&
                  inpersonClass?.aed_information.length > 0 &&
                  inpersonClass?.aed_information?.map((data, index) => (
                    <tr className="" key={index}>
                      <td className="py-2 px-2 tbl-border border-r-blue">
                        <div className="d-flex align-items-center">
                          <span className="me-2">{data?.brand?.label}</span>
                        </div>
                      </td>
                      <td className=" py-2 px-2 tbl-border">
                        <div className="d-flex align-items-center">
                          <span className="me-2">{data?.model?.label}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Box>

      {/* Class Contacts */}
      <Box className="px-2 mt-3">
        <div className="row">
          <div className="col-md-6">
            <h4 className="heading mt-1">Contact Information</h4>
            <table className="w-100 border-gray">
              <thead>
                <tr className="">
                  <th
                    scope="col"
                    width="33%"
                    className=" py-2 px-2 bg-tbl-border border-r-blue"
                  >
                    Training Site Coordinator{" "}
                  </th>
                  <th
                    scope="col"
                    width="33%"
                    className=" py-2 px-2 bg-tbl-border border-r-blue"
                  >
                    Instructor Contact
                  </th>
                  <th
                    scope="col"
                    width="33%"
                    className=" py-2 px-2 bg-tbl-border"
                  >
                    Billing Contact
                  </th>
                </tr>
              </thead>
              <tbody className="odd-even-row">
                <tr className="">
                  <td className="py-2 px-2 tbl-border border-r-blue">
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        Primary:{" "}
                        {classContacts?.training_site_cordinator?.primary_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-2 tbl-border border-r-blue">
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        Primary:{" "}
                        {classContacts?.instructor_contact?.primary_name}
                      </span>
                    </div>
                  </td>
                  <td className=" py-2 px-2 tbl-border">
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        Primary: {classContacts?.billing_contact?.primary_name}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="">
                  <td className="py-2 px-2 tbl-border border-r-blue">
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        Backup:{" "}
                        {classContacts?.training_site_cordinator?.backup_name}
                      </span>
                    </div>
                  </td>
                  <td className=" py-2 px-2 tbl-border border-r-blue">
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        Backup: {classContacts?.instructor_contact?.backup_name}
                      </span>
                    </div>
                  </td>
                  <td className=" py-2 px-2 tbl-border">
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        Backup: {classContacts?.billing_contact?.backup_name}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* <div className="col-md-1"></div> */}

          <div className="col-md-6">
            <h4 className="heading mt-1">Instructors</h4>
            <table className="w-100 border-gray">
              <thead>
                <tr className="">
                  <th className="py-2 px-2 bg-tbl-border">Instructors</th>
                </tr>
              </thead>
              <tbody className="odd-even-row">
                {assignedInstructors?.map((data, index) => (
                  <tr className="">
                    <td className="py-2 px-2 tbl-border">
                      <span>
                        <b>{data?.label}: </b>
                        <b>{data?.contact_name}</b>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Box>

      {/* Tentative Class Details */}
      {inpersonClass?.classes?.length > 0 && (
        <div className="container-fluid mt-3 py-2 px-2">
          <h4 className="heading mt-1">Tentative Class Details</h4>
          {/* table */}
          <table className="w-100 border-b-blue odd-even-row">
            <thead>
              <tr className="">
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  Class
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  Date/Time Option 1
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
                  Date/Time Option 2
                </th>
                <th className=" py-1 px-2 bg-tbl-border border-t-blue">
                  Date/Time Option 3
                </th>
              </tr>
            </thead>
            <tbody>
              {inpersonClass?.classes?.map((classDetail, index) => (
                <tr className="" key={index}>
                  <td className=" py-1 px-2 border-r-blue">{index + 1}</td>
                  <td className=" py-1 px-2 border-r-blue">
                    {classDetail?.date_time_option_1}
                  </td>
                  <td className=" py-1 px-2 border-r-blue">
                    {classDetail?.date_time_option_2}
                  </td>
                  <td className=" py-1 px-2">
                    {classDetail?.date_time_option_3}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Covid Restrictions */}
      <Box className="text-left mt-3">
        <h4 className="heading">Covid Restrictions</h4>
      </Box>

      <table className="w-100 border-b-blue mb-3">
        <thead>
          <tr className="">
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Mask Required
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Special Requirements
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue">Comment</th>
          </tr>
        </thead>
        <tbody className="odd-even-row">
          <tr className="">
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.masks_required == 1 ? "Yes" : "No"}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.special_requirements}
            </td>
            <td className=" py-1 px-2 tbl-border">{inpersonClass?.comments}</td>
          </tr>
        </tbody>
      </table>

      {/* General Information */}
      <Box className="text-left">
        <h4 className="heading">General Information</h4>
      </Box>

      <table className="w-100 border-b-blue mb-3">
        <thead>
          <tr className="">
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Color Group
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Status
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Invoice Number
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Paid
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue">
              Keycodes Sent{" "}
            </th>
            <th className=" py-1 px-2 bg-tbl-border border-t-blue">
              Package Tracking
            </th>
          </tr>
        </thead>
        <tbody className="odd-even-row">
          <tr className="">
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.color_group_label}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.status == 1 ? "Active" : "Disabled"}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.invoice_number ?? "NA"}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.paid == 1 ? "Yes" : "NA"}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.keycodes_sent == 1 ? "Yes" : "NA"}
            </td>
            <td className=" py-1 px-2 tbl-border">
              {inpersonClass?.package_tracking ?? "NA"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Process Completion Information */}
      <Box className="text-left">
        <h4 className="heading">Process Completion Information</h4>
      </Box>

      {/* first table */}
      <table className="w-100 border-b-blue">
        <thead>
          <tr className="">
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
            >
              Class Confirmed
            </th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
            >
              Keycodes Sent
            </th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
            >
              Package Shipped
            </th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
            >
              Instructor Confirmed By
            </th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border border-t-blue border-r-blue"
            >
              Instructor Reminder
            </th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border border-t-blue"
            >
              Student Reminder
            </th>
          </tr>
        </thead>
        <tbody className="odd-even-row">
          <tr className="">
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.class_confirmed} <br />{" "}
              {inpersonClass?.class_confirmed_by}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.keycodes_sent ? (
                <>
                  {inpersonClass?.keycode_sent_date} <br />{" "}
                  {inpersonClass?.keycode_sent_by}
                </>
              ) : (
                <>NA</>
              )}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.package_shipped ? (
                <>
                  {inpersonClass?.package_shipped} <br />{" "}
                  {inpersonClass?.package_shipped_by}
                </>
              ) : (
                <>NA</>
              )}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.instructor_confirmed ? (
                <>
                  {inpersonClass?.instructor_confirmed} <br />
                </>
              ) : (
                ""
              )}{" "}
              {inpersonClass?.instructor_confirmed_by}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {/* {inpersonClass?.instructor_reminder ? <>{inpersonClass?.instructor_reminder} <br /></> : ''} {inpersonClass?.instructor_reminder_by} */}
            </td>
            <td className=" py-1 px-2 tbl-border">
              {/* {inpersonClass?.student_reminder ? <>{inpersonClass?.cards_sentr} <br /></> : ''} {inpersonClass?.student_reminder_by} */}
            </td>
          </tr>
        </tbody>
      </table>

      {/* second table */}
      <table className="w-100 border-b-blue">
        <thead>
          <tr className="">
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border border-r-blue"
            >
              Client Reminder
            </th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border border-r-blue"
            >
              Roster Sent
            </th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border border-r-blue"
            >
              Roster Confirmed
            </th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border border-r-blue"
            >
              Invoiced
            </th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border border-r-blue"
            >
              Paid
            </th>
            <th scope="col" width="15%" className=" py-1 px-2 bg-tbl-border">
              Cards
            </th>
          </tr>
        </thead>
        <tbody className="odd-even-row">
          <tr className="">
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {/* {inpersonClass?.client_reminder ? <>{inpersonClass?.cards_sentr}<br /></>: ''} {inpersonClass?.client_reminder_by} */}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.roster_sentr ? (
                <>
                  {inpersonClass?.cards_sentr}
                  <br />
                </>
              ) : (
                ""
              )}{" "}
              {inpersonClass?.roster_sent_by}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.roster_confirmedr ? (
                <>
                  {inpersonClass?.cards_sentr}
                  <br />
                </>
              ) : (
                ""
              )}{" "}
              {inpersonClass?.roster_confirmed_by}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.invoice_number ? (
                <>
                  {inpersonClass?.invoiced_date} <br />{" "}
                  {inpersonClass?.invoiced_by}
                </>
              ) : (
                <>NA</>
              )}
            </td>
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.paid_dater ? (
                <>
                  {inpersonClass?.paid_dater}
                  <br />
                </>
              ) : (
                ""
              )}{" "}
              {inpersonClass?.paid_by}
            </td>
            <td className=" py-1 px-2 tbl-border">
              {inpersonClass?.cards_sentr ? (
                <>
                  {inpersonClass?.cards_sentr}
                  <br />
                </>
              ) : (
                ""
              )}{" "}
              {inpersonClass?.cards_sent_by}
            </td>
          </tr>
        </tbody>
      </table>

      {/* third table */}
      <table className="w-100 border-b-blue">
        <thead>
          <tr className="">
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border border-r-blue"
            >
              Class Completed
            </th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border"
            ></th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border"
            ></th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border"
            ></th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border"
            ></th>
            <th
              scope="col"
              width="15%"
              className=" py-1 px-2 bg-tbl-border"
            ></th>
          </tr>
        </thead>
        <tbody className="odd-even-row">
          <tr className="">
            <td className=" py-1 px-2 tbl-border border-r-blue">
              {inpersonClass?.class_completed} <br />{" "}
              {inpersonClass?.class_completed_by}
            </td>
            <td className=" py-1 px-2 tbl-border"></td>
          </tr>
        </tbody>
      </table>
      {/* fourth table */}
      <table className="w-100 border-b-blue">
        <thead>
          {inpersonClass?.is_instructor_approved != null &&
          inpersonClass?.is_instructor_approved?.length > 0 ? (
            <>
              {inpersonClass?.is_instructor_approved.map(
                (instructor, index) => (
                  <tr className="" key={index}>
                    <th
                      scope="col"
                      className={
                        index ==
                        inpersonClass?.is_instructor_approved?.length - 1
                          ? "py-1 px-2 bg-tbl-border"
                          : "py-1 px-2 bg-tbl-border border-r-blue"
                      }
                    >
                      Instructor Confirmed
                    </th>
                  </tr>
                )
              )}
            </>
          ) : (
            <>
              <tr className="">
                <th scope="col" className="py-1 px-2 bg-tbl-border">
                  Instructor Confirmed
                </th>
              </tr>
            </>
          )}
        </thead>
        <tbody className="odd-even-row">
          {inpersonClass?.is_instructor_approved != null &&
          inpersonClass?.is_instructor_approved?.length > 0 ? (
            <>
              {inpersonClass?.is_instructor_approved.map(
                (instructor, index) => (
                  <tr className="" key={index}>
                    <td
                      scope="col"
                      className={
                        index ==
                        inpersonClass?.is_instructor_approved?.length - 1
                          ? "py-1 px-2 bg-tbl-border"
                          : "py-1 px-2 bg-tbl-border border-r-blue"
                      }
                    >
                      {instructor?.label}: {instructor?.contact_name} <br />{" "}
                      <Moment
                        date={instructor?.confirmed_date}
                        format={"MM/DD/YYYY hh:mm:ss"}
                      />
                    </td>
                  </tr>
                )
              )}
            </>
          ) : (
            <>
              <tr className="">
                <td scope="col" className="py-1 px-2 bg-tbl-border"></td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: "70px", marginBottom: "10px" }}>
        <Box
          className="d-flex justify-content-evenly align-items-center"
          style={{ gap: "50px" }}
        >
          <p>
            Created Date:{" "}
            {inpersonClass?.created_date ? (
              <Moment
                date={inpersonClass?.created_date}
                format={"MM/DD/YYYY h:mm A"}
              />
            ) : (
              ""
            )}
          </p>
          <p>Created By: {inpersonClass?.created_by}</p>
          <p>
            Modified Date:{" "}
            {inpersonClass?.modified_date ? (
              <Moment
                date={inpersonClass?.modified_date}
                format={"MM/DD/YYYY h:mm A"}
              />
            ) : (
              ""
            )}{" "}
          </p>
          <p>Modified By: {inpersonClass?.modified_by}</p>
        </Box>
      </div>
    </div>
  );
}

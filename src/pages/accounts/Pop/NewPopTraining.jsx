import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import MessageHandler from "../../../components/common/MessageHandler";
import Select from 'react-select';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import CustomToggleButton from "../../../components/common/toggleSwitch/CustomToggleButton";
import Contacts from "../../../img/Contacts.svg";
import Locations from "../../../img/Locations.svg";
import Courses from "../../../img/Courses.svg";
import { CallGETAPI, CallPOSTAPI } from '../../../helper/API';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const NewPopTraining = () => {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const { accountId } = useParams();
   

    const [formData, setFormData] = useState({
        contractType: '',
        contractNumber: '',
        reqNumber: '',
        orderNumber: '',
        modificationNumber: '',
        numberOfYears: '',
        contractStart: null,
        contractYear: '',
        yearlyValue: '',
        total: '',
        spendingCap: '',
        shipping: '',
        popType: '',
        qbInvoiceNumber: '',
        invoicePaid: false,
        invoicingInstructions: '',
        contacts: '',
        sites: '',
        planType: '',
        rental: false,
        visits: 'Annual',
        rms: true,
        accessoriesIncluded: [
          'MoneyBag',
          'Battery',
          'Battery',
          'Adult',
          'Adult',
          'AEDCabinet',
          'RMSBattery',
        ],
        contractCLINS:'',
        RMSMonthlyPrice:'',
        Price:'',
      });

      const handleCoursesClick = () => {
        navigate('/account/add-courses/');
      }

      const calendarIcon = () => {
        return (
          <img src="/calendar.svg" alt="calendar" />
        );
      };

      const handleChange = (event, fieldName) => {
        const value = event.target.value;
    
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: value,
        }));
      };

    const handleSubmit = (event) => {
        event.preventDefault();
    
              if (formData?.popType || formData?.planType == ''){
                  setValidated(true);
              }
      
    
        // Handle form submission here, e.g., send formData to a server
        console.log('Form data submitted:', formData);
        saveForm();
      };

        // save form
  const saveForm = async() => {
    // call the post api function
    let result = await CallPOSTAPI("account/add-pop")
    setFormData({ type: result?.data?.status, msg: result?.data?.data });
  
}

const handleCalendarChange = (date, fieldName) => {
  const formattedDate = date ? date.toISOString() : '';

  setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: formattedDate,
  }));
};


    return(
        <div className="mt-4" style={{ width: "100%", paddingInline: "45px" }}>
        <SubHeadingOther hideNew='tab' title={'Account: Meep Fitness'} newUrl="" subHeading={true} hideHierarchy={true} bottomLinks={false} />
  
        <Form
          className=""
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
          id="create-new-note-form"
        >
          <div
            className="container-fluid mt-4 bottom-border-blue pt-2"
            style={{
              borderBottom: "4px solid rgb(13, 110, 253)",
              background: "#eee",
            }}
          >
            <h2 className="heading">Period of Performance Information</h2>
  
            <div className="row my-3">
              <div className="row my-3">
              <Form.Group className={"col"}>
                  <Form.Label>Contract Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.contractType}
                    onChange={handleChange}
                  />
                </Form.Group>
  
                <Form.Group className={"col"}>
                  <Form.Label>Contract#</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.contractNumber}
                    onChange={handleChange}
                  />
                 </Form.Group>
  
                <Form.Group className={"col"}>
                  <Form.Label>Req #</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.reqNumber}
                    onChange={handleChange}
                  />
                 </Form.Group>
  
                
                <Form.Group className={"col"}>
                  <Form.Label>Order #</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.orderNumber}
                    onChange={handleChange}
                  />
                 </Form.Group>
  
                <Form.Group className={"col"}>
                  <Form.Label>Modification #</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.modificationNumber}
                    onChange={handleChange}
                  />
                 </Form.Group>
  
                <Form.Group className={"col"}>
                  <Form.Label># of Year</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.numberOfYears}
                    onChange={handleChange}
                  />
                </Form.Group>
  
                <div className="row my-3">
                <Form.Group className={"col"}>
                  <Form.Label>Contract Start*</Form.Label>
                  <div className={'d-flex align-items-center calendar-input-btn '} >
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
                      <Stack spacing={3} >
                        <DesktopDatePicker
                          label=""
                          // inputFormat="HH:mm:ss"
                          components={{
                            OpenPickerIcon: calendarIcon,
                          }}
                          minDate={new Date()}
                          value={formData.contractStart}
                          onChange={(newValue) => handleCalendarChange(newValue, 'due_date')}
                          renderInput={(params) => <TextField className='form-control' {...params} error={false} />}
                          // isInvalid={formData.contractStart === ''}
                       />
                      </Stack>
                    </LocalizationProvider> */}
                    <DatePicker
    minDate={new Date()}
    selected={formData.due_date ? new Date(formData.due_date) : null}
    onChange={(date) => handleCalendarChange(date, 'due_date')}
    // Add any additional props or styling as needed
>
    {(props) => (
        <TextField
            {...props}
            label=""
            className='form-control'
            error={false}
        />
    )}
</DatePicker>
                  </div>
                  {validated && !formData?.access && (
                                             <p className='invalid'> This field is required</p>
                                             )}
                </Form.Group>
  
                <Form.Group className={"col"}>
                  <Form.Label>Contract Year</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.contractYear}
                    onChange={handleChange}
                  />
                 </Form.Group>
  
                <Form.Group className={"col"}>
                  <Form.Label>Yearly value</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.yearlyValue}
                    onChange={handleChange}
                  />
                 </Form.Group>
  
                <Form.Group className={"col"}>
                  <Form.Label>Total</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.total}
                    onChange={handleChange}
                  />
                </Form.Group>
  
                <Form.Group className={"col"}>
                  <Form.Label>Spending Cap</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.spendingCap}
                    onChange={handleChange}
                  />
                 </Form.Group>
  
                <Form.Group className={"col"}>
                  <Form.Label>Shipping</Form.Label>
                  <Select
                    type="text"
                    name="access"
                    value={formData.shipping}
                    options={[
                      { label: "Charges", value: "" },
                      { label: "FOB", value: "" }
                    ]}
                    onChange={handleChange}
                   style={{}}
                    placeholder="- Select one -"
                  />
                </Form.Group>
              </div>
              </div>
  
              <div className="row my-3" >
  
              <Form.Group className={"col"} style={{ maxWidth: "250px" }}>
    <Form.Label>POP Type*</Form.Label>
    <select className="form-control"
      name="popType"
      value={formData.popType}
      onChange={(e) => handleChange(e, 'popType')}
      required
    >
      <option value="Equipment">Equipment</option>
      <option value="Training">Training</option>
    </select>
    {validated && !formData?.popType && (
      <p className='invalid'>POP Type is required</p>
    )}
  </Form.Group>
  
  
  
                <Form.Group className={"col"}  style={{ maxWidth: "300px" }}>
                  <Form.Label>QB Invoice Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.qbInvoiceNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
  
                <Form.Group className={"col"} style={{ maxWidth: "150px" }}>
                  <Form.Label>Invoice Paid</Form.Label>
                  <FormControlLabel className="row" style={{ maxWidth: "50px" }} control={<Switch defaultChecked />} label="" />
                </Form.Group>
  
                <Form.Group className={"col"}  style={{ maxWidth: "700px" }} >
                  <Form.Label>Invoicing Instructions</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.invoicingInstructions}
                    onChange={handleChange}
                  />
                 </Form.Group>
              </div>
  
              <div className="row ">
                <Form.Group className="col">
                  <Form.Label style={{ marginRight: "510px" }}>Contacts*</Form.Label>
                  <img src={Contacts} alt="" />
                  <Form.Label style={{ color: "rgb(12, 113, 195)", fontFamily: "Calibri", fontStyle: "normal", marginLeft: "3px" }}>Contacts</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.contacts}
                    onChange={handleChange}
                    required
                    style={{ height: "150px" }} // Adjust the height as needed
                  />
                  {validated && !formData?.access && (
                   <p className='invalid'> This field is required</p>
                  )}
                 </Form.Group>
  
                <Form.Group className={"col"} style={{minWidth:"690px"}}>
                  <Form.Label style={{ marginRight: "570px" }}>Sites*</Form.Label>
                  <img src={Locations} alt="" />
                  <Form.Label style={{ color: "rgb(12, 113, 195)", fontFamily: "Calibri", fontStyle: "normal", marginLeft: "3px" }}>Sites</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.sites}
                    onChange={handleChange}
                    required
                    style={{ height: "150px",minWidth:"695px"}}
                  />
                   {validated && !formData?.access && (
                       <p className='invalid'> This field is required</p>
                      )}
                </Form.Group>
              </div>
  
             
            </div>
          </div>



          <div
          className="container-fluid mt-4 bottom-border-blue pt-2"
          style={{
            borderBottom: "4px solid rgb(13, 110, 253)",
            background: "#eee",
          }}
        >
          <h2 className="heading">Contract Pricing</h2>

          <div className="row ">
            <div className="row">

              <div className="col" style={{marginBottom:"30px"}}>
                <Form.Group className={"col"} style={{minWidth:"1400px"}} >
                  <Form.Label >Courses</Form.Label>
                  <button style={{marginLeft:"1240px",border:"none"}}
  onClick={handleCoursesClick}>
  <img src={Courses} alt="" />
  <Form.Label style={{ color: "rgb(12, 113, 195)", fontFamily: "Calibri", fontStyle: "normal", marginLeft: "3px",cursor:"pointer"}}>Courses</Form.Label>
   </button> 
   </Form.Group>

                <DataGrid className="col"
                  dataSource={''}
                  height={100}
                  width={1400}
                  keyExpr="ID"
                  showColumnLines={true}
                  showRowLines={true}
                  showBorders={false}
                  allowSorting={false}
                  rowAlternationEnabled={false}>
                  <Column dataField="CLINs" width={180} caption="CLINs" cssClass="column-header" allowSorting={false} />
                  <Column dataField="Certifying Agency " cssClass="column-header" allowSorting={false} />
                  <Column dataField="Allowed Classes" cssClass="column-header" allowSorting={false} />
                  <Column dataField="Covered Sites" cssClass="column-header" allowSorting={false} />
                  <Column dataField="Class Price" cssClass="column-header" allowSorting={false} />
                  <Column dataField="Price Per Student" cssClass="column-header" allowSorting={false} />
                  <Column dataField="Min/Max Enrollment" cssClass="column-header" allowSorting={false} />
                  <Scrolling columnRenderingMode="virtual" />
                  <Paging enabled={false} />
                </DataGrid>
              </div>

              
              </div>
            </div>
            </div>
    

           {/* bottom buttons */}
         <div className="row pb-3 py-5" >
            <div className="col-12 content-flex-right" >
              <button className="btn btn-danger text-uppercase" type="button" onClick={() => { navigate(-1) }}>Cancel</button>
              <button className="btn btn-success text-uppercase ms-2" type="submit">Submit</button>
            </div>
          </div>
        </Form>
    </div>
    )
}

export default NewPopTraining;
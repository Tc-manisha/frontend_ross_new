import React, {useState}from 'react';
import { useNavigate } from 'react-router-dom'; 
import DataGrid, { Column ,Template } from 'devextreme-react/data-grid';
import { IoIosArrowBack } from 'react-icons/io';
import Switch from '@mui/material/Switch';
import Select from "react-select";
import {  IoFilterOutline } from 'react-icons/io5';
import { IoMdArrowDropdown} from 'react-icons/io';
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import "./UserFixAlert.css";




const CustomCell = (props) => {
  const { data } = props;
  return (
    <div className="CustomCell">
      <span className="ContactStatus">{data['Contact Status']}</span>
      <IoMdArrowDropdown className="ContactStatusDropDownIcon" />
    </div>
  );
};

const UserFixAlert = () => {
  const navigate = useNavigate();

  const data1 = [
    { id: 1, Student: 'Clarke Meep', 'Contact Status': 'Active', 'Training Optout': 'No', age: 'Class A' },
    { id: 2, Student: 'Jimmy Meep', 'Contact Status': 'Active', 'Training Optout': 'Yes', age: 'Class B' },
    // Add more rows as needed
  ];

  const [data, setData] = useState(data1);

  // Function to handle the "Back" button click
  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page using React Router's navigate
  };

    return(
      <div className="UserFixAlertPage">
      <div className="TopLeftContainer">
        <div className="BackContainerDiv" onClick={handleBackClick}>
          <IoIosArrowBack className="BackArrow" />
          <h1 className="BackText">Back</h1>
        </div>
        <h1 className="NewTrainingText">Fix Alerts</h1>
      </div>

<div className='GeneralInformationContainer'>
  <h1 className='GeneralInformationText'>General Information</h1>
  <DataGrid
      className='DataGridContainer'
      dataSource={data}
      showBorders={true}
      keyExpr="id"
      height="100%"
    >
      <Column dataField="Student" caption="Student" alignment="left"  ></Column> 
        
      <Column caption="Contact Status" cellRender={CustomCell} alignment="left"> </Column>
      <Column
        dataField="Training Optout"
        caption="Training Optout"
        alignment="left"
        cellRender={e => (
          <Switch className='ContactStatusToggle'/>
        )}
      />
    <Column dataField="age" caption="Assign to Class" alignment="left"
    cellRender={e => (
           <Form.Select className='FormSelect' >
             <option  value="0" selected>
                    --Select--
               </option>
            </Form.Select  >
        )}
        />
    </DataGrid>
    </div>

     <div className='RightDivCancelSubmitDiv1'>
            <button className='CancelButton'> Cancel</button>
            <button className='SubmitButton'> Submit</button>
        </div>
        </div>
    )
}
export default UserFixAlert;
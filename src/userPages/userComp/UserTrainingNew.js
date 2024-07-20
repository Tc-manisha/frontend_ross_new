import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { SlCalender} from 'react-icons/sl';
import { TiUserAdd} from 'react-icons/ti';
import "./UserTrainingNew.css";
import { FormControlLabel, Icon, Switch } from "@mui/material";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import Button from "@mui/material/Button";
// import SubForm from "./SubForm";
// import styles from "./NewAccount.module.css";


const UserTrainingNew = () => {
  const navigate = useNavigate();
    
    const [selectedOption, setSelectedOption] = useState('- Select-one -');

    const handleOptionChange = (e) => {
      setSelectedOption(e.target.value);
    };

    const handleBackClick = () => {
      navigate(-1); 
    };

    return(
       <div className='UserTrainingNewPage'>
        <div className="TopLeftContainer">
         <div className="BackContainerDiv" onClick={handleBackClick}>
            <IoIosArrowBack className='BackArrow'/>
            <h1 className='BackText'> Back</h1>
          </div>
        <h1 className='NewTrainingText'>New Training</h1>
        </div>

        <div className='NewTraingdetailsContainer'>

          <Form.Group className={""}>
                    <Form.Label className={"NewTrainingContainerAllText"}>
                    Certifying Agency
                    </Form.Label>
                    <Form.Select
                    className={"CertifyAgencyDropdownInput"}
                    name=""
                     >
                    <option value="0" selected>
                      -Select One-
                    </option>   
                  </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please Enter Certifying Agency.
                      </Form.Control.Feedback>
                  </Form.Group>
       
        <Form.Group className={"ClassesDiv"}>
                    <Form.Label className={"NewTrainingContainerAllText"}>
                    Classes
                    </Form.Label>
                    <Form.Select
                    className={"CertifyAgencyDropdownInput"}
                    name=""
                     >
                    <option value="0" selected>
                    -Select One-
                    </option>   
                  </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please Enter Classes
                      </Form.Control.Feedback>
                  </Form.Group>
        

       
        <Form.Group className={"Class#Div"}>
                    <Form.Label className={""}>
                    Class #
                    </Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        required
                        name=""
                        value={""}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please Enter Class #
                      </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

        <Form.Group className={"StatusDiv"}>
                    <Form.Label className={"NewTrainingContainerAllText"}>
                    Status
                    </Form.Label>
                    <Form.Select
                    className={"CertifyAgencyDropdownInput"}
                    name=""
                     >
                    <option value="0" selected>
                    -Select One-
                    </option>   
                  </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please Enter Status
                      </Form.Control.Feedback>
                  </Form.Group>
       
      
       
        <Form.Group className={""}>
                    <Form.Label className={""}>
                    Class Date
                    </Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        required
                        name=""
                        value={""}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please Enter Class Date
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
         <SlCalender className='ClassDateCalender'/>
       

     
        <Form.Group className={"ClassTimeDiv"}>
                    <Form.Label className={""}>
                    Class Time
                    </Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        required
                        name=""
                        value={""}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please Enter Class Time
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
       

       
        <Form.Group className={"InstructorNameDiv"}>
                    <Form.Label className={""}>
                    Instructor Name
                    </Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        required
                        name=""
                        value={""}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please Enter Instructor Name
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
  
        </div>
        
        <div className='AddStudentsDiv'>  
          <TiUserAdd className='AddStudentIcon'/>
          <h1 className='AddStudentsText'> Add Students</h1>
        </div>

        <div className='CancelSubmitDiv'>
            <button className='CancelButton'> Cancel</button>
            <button className='SubmitButton'> Submit</button>
        </div>
       </div>
    )
}

export default UserTrainingNew;
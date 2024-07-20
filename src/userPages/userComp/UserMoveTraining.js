import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { IoIosArrowBack } from 'react-icons/io';
import { FormControlLabel, Icon, Switch } from "@mui/material";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import "./UserMoveTraining.css";


const UserMoveTraining = () => {
  const navigate = useNavigate();

    const [selectedOption, setSelectedOption] = useState('- Select-one -');

    const handleOptionChange = (e) => {
      setSelectedOption(e.target.value);
    };

    const handleBackClick = () => {
      navigate(-1); // Go back to the previous page using React Router's navigate
    };

    return(
        <div className='UserMoveTrainingPage'>

         <div className="TopLeftContainer">
          <div className="BackContainerDiv"  onClick={handleBackClick}>
            <IoIosArrowBack className='BackArrow'/>
            <h1 className='BackText'> Back</h1>
          </div>
        <h1 className='MoveTrainingText'>Move Training</h1>
        </div>
          
        <div className='MeepFitnessDiv'>
        <h1 className='MeepFitnessText'> Meep Fitness: Meep Fitness Rickenbacker</h1>
        <div className='MeepFitnessContentDiv'>
           <div className='MeepFitnessConetentLeftDiv'>
             <div className='StudentDiv'>
              <input className='StudentCheckBox' type='checkbox' />
              <h1 className='RightDivText'> Student</h1>
             </div>

             <div className='AprilMeepDiv'>
              <input className='StudentCheckBox' type='checkbox' />
              <h1 className='RightDivText'> April Meep</h1>
             </div>
          
             <div className='JimmyMeepDiv'>
              <input className='StudentCheckBox' type='checkbox' />
              <h1 className='RightDivText'> Jimmy Meep</h1>
             </div>

             <div className='PerryMeepDiv'>
              <input className='StudentCheckBox' type='checkbox' />
              <h1 className='RightDivText'> Perry Meep</h1>
             </div>

             <div className='TomMeepDiv'>
              <input className='StudentCheckBox' type='checkbox' />
              <h1 className='RightDivText'> Tom Meep</h1>
             </div>

           </div>

           <div className='MeepFitnessConetentRightDiv'>
             <div className='RightDivHeader'>
             <h1 className='MoveToText'> Move to:</h1>
             </div>

             <div className='SiteNameDiv'>
             <Form.Group className={""}>
                    <Form.Label className={""}>
                    Site Name
                    </Form.Label>
             <Form.Select
                    className={"SiteNameDropdownInput"}
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
             </div>

             <div className='RightDivCancelSubmitDiv'>
            <button className='CancelButton'> Cancel</button>
            <button className='SubmitButton'> Submit</button>
        </div>
           </div>
          
        </div>
       
        </div>
        </div>
    )
}
export default UserMoveTraining;
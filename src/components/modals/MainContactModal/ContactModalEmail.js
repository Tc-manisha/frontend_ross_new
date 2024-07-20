
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

// import { FormControlLabel, Icon, Switch } from "@mui/material";
import { Form, Button as BButton, Button as BsButton } from "react-bootstrap";

import Box from '@mui/material/Box';

import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import { FormControlLabel, Radio, Switch } from "@mui/material";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  

function ContactModalEmail({SaveForm,open,hanldeModal,emailDataList,phoneDataList,dataType,setSubFormData,setDataType}) {

  const [ allPhoneData, setAllPhoneData ] = React.useState([]);


    const handleClose = ()=>{
        hanldeModal(false)
        setDataType('')
    }


//     const updateFieldChanged = index => e =>
//   {
//     if (e.target.name == 'phone_number')
//     {
//       if (e.target.value > 10)
//       {
//         e.target.value = e.target.value.slice(0, 10)
//       }
//     }

//     let newArr = [ ...allPhoneData ]; // copying the old datas array
//     if(e.target.type == 'checkbox') {
//       newArr[ index ][ e.target.name ] = e.target.checked; 
//     } else {
//       newArr[ index ][ e.target.name ] = e.target.value; 
//     }
//     newArr.map((data) => {
//       data.account_main_contact_phone = data.phone_number ?? null;
//       data.account_main_contact_phone_ext = data.ext ?? null;
//       data.account_main_contact_phone_main = data.main ? 1 : 0;
//     })
//     setSubFormData(newArr);
//   }

const updateFieldChanged = index => e =>{

  let newArr = [ ...emailDataList ]; // copying the old datas array
  
  // if (e.target.type == 'checkbox')
  // {
  //   newArr[ index ][ e.target.name ] = e.target.checked; // replace e.target.value with whatever you want to change it to
  // } else 
  // {
  //   newArr[ index ][ e.target.name ] = e.target.value; // replace e.target.value with whatever you want to change it to
  // }


  // if(e.target.type === 'radio') {
  //   newArr[ index ][ e.target.name ] = e.target.checked; 
  // } else {
  //   newArr[ index ][ e.target.name ] = e.target.value; 
  // }


  newArr.map((data,i) => {
    if(index===i){
      data.account_main_contact_email_main = 1;
      // data.account_main_contact_phone = data.phone_number ?? null;
      // data.account_main_contact_phone_ext = data.ext ?? null;
      // data.account_main_contact_phone_main = 1;  
    }else{
      data.account_main_contact_email_main = 0;
      // data.account_main_contact_phone = data.phone_number ?? null;
      // data.account_main_contact_phone_ext = data.ext ?? null;
      // data.account_main_contact_phone_main =  0;
      }
  });



  setSubFormData(newArr);
}


//   React.useEffect(() => {
//     if(phoneDataList.length) {
//       phoneDataList.map((data) => {
//         data.main = data.account_main_contact_phone_main == 1 ? true : false
//       })
//     }
//     setAllPhoneData(phoneDataList);
//   }, [phoneDataList])

const handleContinue = ()=>{
    handleClose();
    SaveForm();   
}

  return (
    <>

<Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Set Main Email Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>

{/* {JSON.stringify(emailDataList)} */}
        <ul>
         {emailDataList.map((single,index)=>(
            <li key={index} > 

            <Form.Group className={ 'col d-block' }>
              <b className={ '' }>Main</b>
              <div className="">
                <FormControlLabel
                  className={ '' }
                  label={`${single.account_main_contact_email}`}
                  value={true}
                  name="main"
                  onChange={ updateFieldChanged(index) }
                  control={ <Radio color="primary" size="medium" checked={single.account_main_contact_email_main} /> }
                />

                
              </div>
            </Form.Group>

        </li>
        ))}
         
         </ul>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
          <Button variant="primary" onClick={handleContinue}>
          Continue
          </Button>
        </Modal.Footer>
      </Modal>

{/* <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="parent-modal-title"
  aria-describedby="parent-modal-description"
>
  <Box sx={{ ...style, width: 400 }}>
    {dataType==='Phone' ? <>
        <div className='' >
    {JSON.stringify(phoneDataList)}
        </div>
    </> : <>
    {JSON.stringify(emailDataList)}
    
    </>}
  </Box>
</Modal> */}


    </>
  )
}

export default ContactModalEmail;
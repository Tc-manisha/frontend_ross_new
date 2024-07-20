
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

// import { FormControlLabel, Icon, Radio } from "@mui/material";
import { Form, Button as BButton, Button as BsButton } from "react-bootstrap";

import Box from '@mui/material/Box';

import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import { FormControlLabel, Radio } from "@mui/material";


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


function MainContactModalPhone({ SaveForm, open, setSubFormData, hanldeModal, phoneDataList, dataType, setDataType })
{

  const handleClose = () =>
  {
    hanldeModal(false)
    setDataType('')
  }


  const updateFieldChanged = index => e =>
  {

    let newArr = [ ...phoneDataList ]; // copying the old datas array

    if (e.target.type === 'radio')
    {
      newArr[ index ][ e.target.name ] = e.target.checked;
    } else
    {
      newArr[ index ][ e.target.name ] = e.target.value;
    }


    newArr.map((data, i) =>
    {
      if (index === i)
      {
        // data.phone_number = data.phone_number ?? null;
        // data.ext = data.ext ?? null;
        data.main = 1;
      } else
      {

        // data.phone_number = data.phone_number ?? null;
        // data.ext = data.ext ?? null;
        data.main = 0;
      }
    });
 
    setSubFormData(newArr);
  }


  // React.useEffect(() => {
  //   if(phoneDataList.length) {
  //     phoneDataList.map((data) => {
  //       data.main = data.main == 1 ? true : false
  //     })
  //   }
  //   setphoneDataList(phoneDataList);
  // }, [phoneDataList])

  const handleSubmit = () =>
  {
    // create-new-account-form
    var check = false;
    phoneDataList.map((a) => {
      if(a.main || a.main == 1) {
        check = true
      }
    })

   
    if (check)
    {
      handleClose();
      // SaveForm();
    }
  }
  return (
    <>

      <Modal show={ open } onHide={ handleClose }>
        <Modal.Header closeButton>
          <Modal.Title>Set Main Phone Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <ul>
              { phoneDataList.map((single, index) => (
                <li key={ index } >

                  <Form.Group className={ 'col d-block' }>
                    <b className={ '' }>Main</b>
                    <div className="">
                      <FormControlLabel
                        className={ '' }
                        label={ `${ single.ext } - ${ single.phone_number }` }
                        value={ true }
                        name="main"
                        onChange={ updateFieldChanged(index) }
                        control={ <Radio checked = { single.main == 1 || single.main ? true : false } color="primary" size="medium" /> }
                      />
                    </div>
                  </Form.Group>

                </li>
              )) }
            </ul>
          </div>


        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="link secondary" onClick={handleClose}>
            Close
          </Button> */}
          <Button variant="primary" onClick={ handleSubmit }>
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

export default MainContactModalPhone
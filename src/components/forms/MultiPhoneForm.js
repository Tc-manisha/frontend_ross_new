import React from 'react'
import React, { useEffect, useState } from 'react';
import { FormControlLabel, Icon, Switch } from "@mui/material";
import { Form, Button as BButton, Button as BsButton } from "react-bootstrap";
import Button from '@mui/material/Button';

export default function MultiPhoneForm({ fromListName, increaseAlternative, decreaseAlternative })
{


  const HandleSubForm = (e) =>
  {
    // let mySubFormData         = [...altTrainerForm];
    // mySubFormData[formIndex]  = {"phone_number":phone,"ext":phoneExt,"phone_type_id":phoneType,"main":main}
    // setSubFormData(old=>({...old,[e.target.name]:e.target.value}))
  }


  return (
    <>
      <div className='row mb-4 ' style={ { display: 'flex', alignItems: 'center' } }   >

        <Form.Group className={ 'col' }>
          <div className='d-flex mb-2' style={ { alignItems: 'center' } } >
            <Form.Label>Phone </Form.Label>
            <button onClick={ increaseAlternative } className="btn mx-2 btn-sm btn-primary " >+</button>
            <button onClick={ decreaseAlternative } className="btn mx-2 btn-sm btn-danger " >-</button>
          </div>

          <Form.Control 
            type="number" 
            name="phone_number" 
            required
            onChange={ HandleSubForm } 
          />
          <Form.Control.Feedback type="invalid">
            Please Enter Phone.
          </Form.Control.Feedback>
        </Form.Group>


        <Form.Group className={ 'col' }>
          <Form.Label>Ext</Form.Label>
          <Form.Control type="number"
            name="ext"
            onChange={ HandleSubForm }
          />
        </Form.Group>

        <Form.Group className={ 'col' }>
          <Form.Label>Phone Type</Form.Label>
          <Form.Select className={ '' }
            name="phone_type_id"
            onChange={ HandleSubForm }
          >
            <option value="0" selected>--Select One--</option>
            { allDropDowns?.phoneType && allDropDowns?.phoneType.map((PT) => (
              <option value={ PT.dropdown_phone_type_id }>{ PT.dropdown_phone_type_name
              }</option>
            )) }

          </Form.Select>
        </Form.Group>



        <Form.Group className={ 'col d-block' }>
          <b className={ '' }>Main</b>
          <div className="">
            <FormControlLabel
              className={ '' }
              label=""
              value="1"
              name="main"
              onChange={ HandleSubForm }
              control={ <Switch color="primary" size="medium" /> }
            />
          </div>
        </Form.Group>


      </div>
    </>
  )
}

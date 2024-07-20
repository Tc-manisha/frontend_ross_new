import { FormControlLabel, Switch } from '@mui/material';
import React from 'react'
import { Form } from 'react-bootstrap';
import CustomToggleButton from '../../common/toggleSwitch/CustomToggleButton';

function PediatricKeyInfo({
    formData,
    setFormData,
}) {

    
    const handleChange = (e,index)=>{
        let name        = e.target.name;
        let val         = e.target.value;
        let checked     = e.target.checked;

        const oldData = {...formData};
        if(checked){
            oldData.pediatric_key = 1;
        }else{
            oldData.pediatric_key = 0;
        }
        setFormData(oldData)
    }
  return (
    
    <>
    <div class="form-group" >
        <Form.Group controlId="formGatewayConnected">
            <Form.Group>
                <b className={ "" }>Pediatric Key</b>
                <div className="">
                    {/* <FormControlLabel
                        className={ "" }
                        label=""
                        control={
                            <Switch
                                color="primary"
                                size="medium"
                                value={true}
                                name="pediatric_key"
                                onChange={handleChange}
                                checked={formData?.pediatric_key == 1 || formData?.pediatric_key ? true : false}
                            />
                        }
                    /> */}
                    <CustomToggleButton 
                        ToggleName="pediatric_key"
                        ToggleValue={formData?.pediatric_key}
                        changeHandler={handleChange}
                    />
                </div>
            </Form.Group>

      </Form.Group>

    </div>
    </>
  )
}

export default PediatricKeyInfo
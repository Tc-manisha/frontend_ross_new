import { FormControlLabel, Switch } from '@mui/material';
import React from 'react'
import { Form } from 'react-bootstrap';
import CustomToggleButton from '../../common/toggleSwitch/CustomToggleButton';

function BuiltInRMSInformation({
    title,
    crrIndex,
    formData,
    setFormData,
    // handleCheckBox,
    handleInput,
    crrFormData,
    addMore,
    removeBtn,
    keyName,
    Permissins
  }) {
    const handleChange = (e)=>{
        let name = e.target.name;
        let val  = e.target.value;
        let index = crrIndex; 

        if (name === "mac_address" && val.length > 1) {
            const cleanedValue = val.replace(/[^a-fA-F0-9]/g, "");
            // Insert colons at the appropriate positions
            let formattedValue = cleanedValue;
            if (cleanedValue.length > 1) {
              formattedValue = cleanedValue.match(/.{1,2}/g).join(":");
            }
            val = formattedValue; // Update the value with formatted MAC address
          }
        const oldData = {...formData};

        oldData[keyName][index][name] = val; 
        setFormData(oldData);
      }

      const handleCheckBox = (e)=>{
        const oldData = {...formData};
        oldData[keyName][crrIndex][e.target.name] =  e.target.checked?e.target.checked:0;
        setFormData(oldData);
    }

  return (
    <>
    <div key={crrIndex} className="row" >
        {/* <Form.Group controlId="formGatewayConnected">
            <Form.Check
                type="checkbox"
                label="Connected"
                name="Connected"
                checked={crrFormData?.connected}
                onChange={handleChange}
            />
      </Form.Group> */}

      <Form.Group className="col">
                        <b className={ "" }>Connected</b>
                        <div className="">
                            {/* <FormControlLabel
                                className={ "" }
                                label=""
                                control={
                                    <Switch
                                        color="primary"
                                        size="medium"
                                        value={true}
                                        name="connected"
                                        onChange={handleChange}
                                        checked={crrFormData?.alarmed == 1 || crrFormData?.alarmed ? true : false}
                                    />
                                }
                            /> */}
                            <CustomToggleButton 
                            ToggleName="connected"
                            ToggleValue={crrFormData?.connected}
                            changeHandler={handleCheckBox}
                            />
                        </div>
                    </Form.Group>

      <Form.Group className="col" controlId="formPediatricmac_address">
            <Form.Label>MAC Address </Form.Label>
            <Form.Control
            type="text"
            placeholder="Enter MAC Address"
            name="mac_address"
            value={crrFormData?.mac_address}
            onChange={handleChange}
            maxLength={17}
            />
        </Form.Group>
        
    </div>
    </>
  )
}

export default BuiltInRMSInformation
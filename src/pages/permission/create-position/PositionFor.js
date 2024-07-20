import * as React from 'react';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { CallGETAPI } from '../../../helper/API';

export default function PositionFor({
    setPosition,
    position,
    isInvalid,
    setIsInvalid
}) {

    const [selectedPosition, setSelectedPosition] = useState('')

    const handleChange = (event) => {
        // setSelectedPosition(event.target.value);
        if (setPosition) {
            setPosition({ ...position, position_for: event.target.value })
        }
        if (setIsInvalid) {
            setIsInvalid({ ...isInvalid, position_for: false });
        }
    };

    const positionArr = [
        {
            position_name: 'Account',
            position_for: 'acc-contact'
        },
        {
            position_name: 'Site',
            position_for: 'site-contact'
        },
        {
            position_name: 'Account Reps',
            position_for: 'acc-reps'
        },
        {
            position_name: 'Site Reps',
            position_for: 'site-reps'
        }
    ]

    const fillPositionDD = () => {
        return positionArr?.map((item, i) => {
            return <option value={item?.position_for}>{item?.position_name}</option>;
        });
    };

    // useEffect(() => {
    //     setPosition(position?.position_for || '');
    // }, [position]);

    const assignPosition = () => {
        return (
            <Box>
                <select
                    style={{ borderColor: isInvalid.position_for ? '#DC3545' : '' }}
                    className="form-control"
                    value={position?.position_for}
                    onChange={handleChange}
                >
                    <option value="" key={0} selected disabled>
                        --Select One--
                    </option>
                    {fillPositionDD()}
                </select>
                {
                    isInvalid.position_for ?
                        <p style={{ color: '#DC3545', fontWeight: 400, fontSize: 14, marginTop: 5 }}>Please select Position for</p>
                        :
                        <></>
                }
            </Box>
        );
    }

    return (
        <div>
            {assignPosition()}
        </div>
    )

}
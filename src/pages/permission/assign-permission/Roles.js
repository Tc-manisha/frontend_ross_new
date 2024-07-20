import * as React from 'react';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { CallGETAPI } from '../../../helper/API';

export default function Roles({
    setPositionId,
    setIsInvalid,
    isInvalid
}) {

    const [roles, setRoles] = useState([]);
    const [selectedRols, setSelectedRole] = useState('')

    const handleChange = (event) => {
        setSelectedRole(event.target.value);
        if (setPositionId) {
            setPositionId(event.target.value)
        }
        if (setIsInvalid) {
            setIsInvalid({ ...isInvalid, position_name: false });
        }
    };

    const fetchRoles = async () => {
        let response = await CallGETAPI('admin/fetch-role')
        if (response?.status) {
            setRoles(response?.data?.data)
        }
    }

    useEffect(() => {
        fetchRoles()
    }, [])

    const fillRolesDD = () => {
        return roles?.map((item, i) => {
            return <option value={item?.position_id}>{item?.position_name}</option>;
        });
    };

    const assignRoles = () => {
        return (
            <Box>
                <select
                    style={{ borderColor: isInvalid?.position_name ? '#DC3545' : '', }}
                    className="form-control"
                    value={selectedRols}
                    onChange={handleChange}
                >
                    <option value="" key={0} selected disabled>
                        --Select One--
                    </option>
                    {fillRolesDD()}
                </select>
                {
                    isInvalid?.position_name ?
                        <p style={{ color: '#DC3545', fontWeight: 400, fontSize: 14, marginTop: 5 }}>Please select Position</p>
                        :
                        <></>
                }
            </Box>
        );
    }

    return (
        <div>
            {assignRoles()}
        </div>
    )

}
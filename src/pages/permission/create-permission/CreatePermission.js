import React, { useState } from "react"
import { Grid } from "@mui/material"
import { Form } from "react-bootstrap";
import Heading from "../Heading";
import { toast } from 'react-toastify';
import { CallPOSTAPI } from "../../../helper/API";

export default function CreatePermission() {

    const [loading, setLoading] = useState(false)
    const [permissions, setPermissions] = useState('')
    const [isInvalid, setIsInvalid] = useState(false);

    const createPermission = () => {
        return (
            <div>
                <label htmlFor=""><b>Permission name*</b></label>
                <input
                    style={{ borderColor: isInvalid ? '#DC3545' : '#C5B6B6' }}
                    type="text"
                    onChange={(e) => {
                        setPermissions(e.target.value);
                        setIsInvalid(e.target.value === '');
                    }}
                    value={permissions}
                    className="form-control"
                    required
                    name="permission_name"
                />
                {
                    isInvalid ?
                        <p style={{ color: '#DC3545', fontWeight: 400, fontSize: 14,  marginTop: 5 }}>Please enter Permisison name</p>
                        :
                        <></>
                }
            </div>
        )
    }

    const handleSubmit = async () => {
        setLoading(true)
        if (!permissions.trim()) { 
            setIsInvalid(true);
            setLoading(false);
            return;
        }
        let body = { 'permissions': permissions }
        let response = await CallPOSTAPI('admin/create-permission', body)
        if (response?.status) {
            setLoading(false)
            setPermissions('')
            setIsInvalid(false);
            toast.success('Permission created successfully.')
        }
        else {
            toast.error('Failed to create Permission.')
        }
    }

    return (
        <div style={{ padding: '2%' }}>
            <Heading heading={'Create Permission'} />
            <Grid container spacing={3}>
                <Grid item md={2}>
                    {createPermission()}
                </Grid>
                <Grid item md={2}>
                    <button className="btn submit-button" style={{ marginTop: '8%' }} onClick={handleSubmit} disabled={loading}>
                        {loading ? "Loading..." : "Submit"}
                    </button>
                </Grid>
            </Grid>
        </div>
    )
}

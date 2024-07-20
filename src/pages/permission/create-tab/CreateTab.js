import React, { useState } from "react"
import { Grid } from "@mui/material"
import { Form } from "react-bootstrap";
import Heading from "../Heading";
import { CallPOSTAPI } from "../../../helper/API";
import { toast } from 'react-toastify';

export default function CreateTab() {

    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)

    const handleSubmit = async () => {
        if (name === '') {
            setIsInvalid(true)
        }
        else {
            setLoading(true)
            let body = { 'name': name }
            let response = await CallPOSTAPI('admin/create-tab', body)
            if (response?.status) {
                setLoading(false)
                setName('')
                toast.success('Tab created successfully.')
            }
            else {
                toast.error('Failed to create Tab.')
            }
        }
    }

    const tabFeild = () => {
        return (
            <div>
                <label htmlFor=""><b>Tab name*</b></label>
                <input
                    style={{ borderColor: isInvalid ? '#DC3545' : '' }}
                    type="text"
                    onChange={(e) => {
                        setName(e.target.value)
                        setIsInvalid(false);
                    }}
                    value={name}
                    className="form-control"
                    required
                    name="tab_name"
                />
                {
                    isInvalid ?
                        <p style={{ color: '#DC3545', fontWeight: 400, fontSize: 14, marginTop: 5 }}>Please enter Tab name</p>
                        :
                        <></>
                }
            </div>
        )
    }

    return (
        <div style={{ padding: '2%' }}>
            <Heading heading={'Create Tab'} />
            <Grid container spacing={3}>
                <Grid item md={2}>
                    {tabFeild()}
                </Grid>
                <Grid item md={2}>
                    <button class="btn submit-button" style={{ marginTop: '8%' }} onClick={handleSubmit} disabled={loading}>
                        {loading ? "Loading..." : "Submit"}
                    </button>
                </Grid>
            </Grid>
        </div>
    )
}
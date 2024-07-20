import React, { useState } from "react"
import { Grid } from "@mui/material"
import { Form } from "react-bootstrap";
import Permissions from "../assign-permission/Permissions";
import Heading from "../Heading";
import PositionFor from "./PositionFor";
import EmailFor from "./EmailFor";
import { toast } from 'react-toastify';
import { CallPOSTAPI } from "../../../helper/API";

export default function CreatePossition() {

    const [loading, setLoading] = useState(false)
    const [position, setPosition] = useState({
        position_name: '',
        position_for: '',
        permissions: '', // For email permission
        permission_group: []
    })
    const [isInvalid, setIsInvalid] = useState({
        position_name: false,
        position_for: false,
        permissions: false,
        permission_group: false
    });

    const createPositionComponent = () => {
        return (
            <div>
                <label htmlFor=""><b>Position name*</b></label>
                <input
                    style={{ borderColor: isInvalid.position_name ? '#DC3545' : '#C5B6B6' }}
                    type="text"
                    onChange={(e) => {
                        setPosition({ ...position, position_name: e.target.value })
                        setIsInvalid({ ...isInvalid, position_name: e.target.value === '' });
                    }}
                    value={position?.position_name}
                    className="form-control"
                    required
                    name="position_name"
                />
                {
                    isInvalid.position_name ?
                        <p style={{ color: '#DC3545', fontWeight: 400, fontSize: 14, marginTop: 5 }}>Please enter Position name</p>
                        :
                        <></>
                }
            </div>
        )
    }

    console.log('position', position);

    const handleSubmit = async () => {

        // setPosition({
        //     position_name: '',
        //     position_for: '',
        //     permissions: '', // For email permission
        //     permission_group: []
        // })

        let is_false = 0;
        let obj = {
            position_name: false,
            position_for: false,
            permissions: false,
            permission_group: false
        }
        if (position.position_name === '') {
            obj.position_name = true;
            is_false = 1;
        }

        if (position.position_for === '') {
            obj.position_for = true;
            is_false = 1;
        }

        if (position.permissions.length === 0) {
            obj.permissions = true;
            is_false = 1;
        }

        if (position.permission_group.length === 0) {
            obj.permission_group = true;
            is_false = 1;
        }

        if (is_false) {
            setIsInvalid(obj);
            return "";
        }

        // setLoading(true);
        // let body = { 'position_name': position.position_name, 'position_for': position.position_for, 'permission_group': JSON.stringify(position.permission_group), permissions: JSON.stringify(position.permissions) }
        // let response = await CallPOSTAPI('admin/create-role', body)

        // if (response?.status) {
        //     setPosition({
        //         position_name: '',
        //         position_for: '',
        //         permissions: '', // For email permission
        //         permission_group: []
        //     })

        //     setLoading(false);
        //     toast.success('Role created successfully.');
        // } else {
        //     setLoading(false);
        //     toast.error('Failed to create Role.');
        // }
    }

    return (
        <div style={{ padding: '2%' }}>
            <Heading heading={'Create Role'} />
            <Grid container spacing={3}>
                <Grid item md={2}>
                    {createPositionComponent()}
                </Grid>
                <Grid item md={2}>
                    <label htmlFor=""><b>Position For*</b></label>
                    <PositionFor setPosition={setPosition} position={position} setIsInvalid={setIsInvalid} isInvalid={isInvalid} />
                </Grid>
                <Grid item md={2}>
                    <label htmlFor=""><b>Email For*</b></label>
                    <EmailFor setPosition={setPosition} position={position} setIsInvalid={setIsInvalid} isInvalid={isInvalid} />
                </Grid>
                <Grid item md={2}>
                    <label htmlFor=""><b>Permissions Group*</b></label>
                    <Permissions setPosition={setPosition} position={position} setIsInvalid={setIsInvalid} isInvalid={isInvalid} />
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
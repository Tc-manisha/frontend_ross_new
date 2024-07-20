import * as React from 'react';
import Roles from './Roles';
import Permissions from './Permissions';
import { Grid } from '@mui/material';
import Heading from '../Heading';
import { useState } from 'react';
import { CallPOSTAPI } from '../../../helper/API';
import { toast } from 'react-toastify';

export default function AssignPermission({

}) {

    const [loading, setLoading] = useState(false)
    const [positionId, setPositionId] = useState('')
    const [permissionsArray, setPermissionsArray] = useState([])
    const [isInvalid, setIsInvalid] = useState({
        position_name: false,
        permission_group: false
    });

    const handleSubmit = async () => {
        let is_false = 0;
        let obj = {
            position_name: false,
            permission_group: false
        }
        if (positionId === '') {
            obj.position_name = true;
            is_false = 1;
        }

        if (permissionsArray.length === 0) {
            obj.permission_group = true;
            is_false = 1;
        }

        if (is_false) {
            setIsInvalid(obj);
            return "";
        }

        setLoading(true)
        let body = { 'permissions': permissionsArray + "" }
        let response = await CallPOSTAPI(`admin/assign-permission/${positionId}`, body)
        if (response?.status) {
            setPositionId('')
            setPermissionsArray([])
            setLoading(false)
            toast.success('Permission assigned successfully.')
        }
        else {
            toast.error('Failed to assign Permission.')
        }
    }

    // console.log('permissionsArray', permissionsArray + "");

    return (
        <div style={{ padding: '2%' }}>
            <Heading heading={'Assign Permission'} />
            <Grid container spacing={3}>
                <Grid item md={2}>
                    <label htmlFor=""><b>Position*</b></label>
                    <Roles setPositionId={setPositionId} positionId={positionId} setIsInvalid={setIsInvalid} isInvalid={isInvalid} />
                </Grid>
                <Grid item md={2}>
                    <label htmlFor=""><b>Permissions Group*</b></label>
                    <Permissions setPermissionsArray={setPermissionsArray} permissionsArray={permissionsArray} setIsInvalid={setIsInvalid} isInvalid={isInvalid} />
                </Grid>
                <Grid item md={2}>
                    <button class="btn submit-button" onClick={handleSubmit} disabled={loading} style={{ marginTop: '8%' }}>
                        {loading ? "Loading..." : "Submit"}
                    </button>
                </Grid>
            </Grid>
        </div>
    )
}

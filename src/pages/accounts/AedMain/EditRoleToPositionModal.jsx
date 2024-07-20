import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import {
    Form,
    Button as BButton,
    Button as BsButton,
} from "react-bootstrap";
import { CallPOSTAPI } from '../../../helper/API';
import { toast } from 'react-toastify';

const style = {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function EditRoleToPositionModal({
    show,
    setShow,
    rowData,
    fillRolesDD,
    fillPositionsDD,
    fetchAssignPermission
}) {

    console.log('rowData', rowData);

    const [loading, setLoading] = useState(false)
    const [selectedPosition, setSelectedPosition] = useState(rowData?.position_name);
    const [selectedPositionId, setSelectedPositionId] = useState(rowData?.position_id);

    const [selectedRole, setSelectedRole] = useState(parseInt(rowData?.role_id));
    const [invalid, setInvalid] = useState({
        // position: false,
        role: false
    })

    const handleClose = () => setShow(false);

    const roleList = () => {
        return (
            <>
                <div style={{ width: 300 }}>
                    <Form.Group className={"col"}>
                        <Form.Label>Select Role*</Form.Label>
                        <select
                            style={{ borderColor: invalid.role ? '#DC3545' : '' }}
                            className="form-control"
                            value={selectedRole}
                            name="contractYear"
                            onChange={(e) => {
                                setSelectedRole(e.target.value)
                                setInvalid({ ...invalid, role: false })
                            }}
                        >
                            <option value="" >--Select One--</option>
                            {fillRolesDD()}
                        </select>
                    </Form.Group>
                    {invalid.role && (
                        <p style={{ color: '#DC3545' }}>Please select role</p>
                    )}
                </div>
            </>
        )
    }

    const positionList = () => {
        return (
            <>
                <div style={{ width: 300 }}>
                    <Form.Label>Position name*</Form.Label>
                    <Form.Control
                        disabled
                        placeholder="Enter position name"
                        style={{ border: '1px solid #DEE2E6' }}
                        type="text"
                        name="position_name"
                        value={selectedPosition}
                        onChange={(e) => {
                            setSelectedPosition(e.target.value);
                            // setInvalid({ ...invalid, position: false });
                        }}
                    />
                    {invalid.role && (
                        <p style={{ color: '#DC3545' }}>Please select position</p>
                    )}
                </div>
            </>
        )
    }

    const handleSubmit = async () => {

        if (selectedRole === '') {
            setInvalid({ ...invalid, role: true })
            return
        }

        // if (selectedPosition === '') {
        //     setInvalid({ ...invalid, position: true })
        //     return
        // }

        setLoading(true)
        let body = { 'role_id': selectedRole, 'position_id': selectedPositionId }
        const response = await CallPOSTAPI('admin/update-role-to-position', body)
        if (response?.status) {
            fetchAssignPermission();
            setSelectedRole('')
            setLoading(false)
            toast.success(response?.msg)
            handleClose()
        }
        else {
            setSelectedRole('')
            setLoading(false)
            toast.error(response?.msg)
            handleClose()
        }
    }

    return (
        <div>
            <Modal
                open={show}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title">
                        <h3 style={{ fontWeight: 500, fontSize: 23, marginBottom: '4%' }}>Edit Assigned Role</h3>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div style={{ width: '100%', display: 'flex', gap: '4%' }}>
                            {positionList()}
                            {roleList()}
                        </div>
                        <div className=" d-flex justify-content-end">
                            <button
                                style={{ marginTop: 30, height: 40 }}
                                className="btn btn-danger text-uppercase ms-2"
                                type="button"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-success text-uppercase ms-2"
                                type="submit"
                                style={{ marginTop: 30, height: 40 }}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Submit'}
                            </button>
                        </div>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}

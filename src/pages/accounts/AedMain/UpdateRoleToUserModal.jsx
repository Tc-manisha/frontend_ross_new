import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { CallGETAPI } from '../../../helper/API';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    textAlign: 'center',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
};

export default function UpdateRoleToUserModal({
    updateModal,
    setUpdateModal,
    contactID,
    fetchUserTblData
}) {

    const [loading, setLoading] = useState(false)
    const handleClose = () => setUpdateModal(false);

    const handleUpdate = async () => {
        setLoading(true)

        const res = await CallGETAPI(
            "admin/unassigned-role-user/" + contactID
        );
        if (res.status) {
            setLoading(false)
            handleClose()
            toast.success(res?.data?.msg);
            fetchUserTblData();
        }
        else {
            toast.success(res?.data?.msg);
            setLoading(false)
            handleClose()
        }
    }

    return (
        <div>
            <Modal
                open={updateModal}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <h2 style={{ margin: 0, fontWeight: 600, fontSize: 30 }}>Are you sure?</h2>

                    <div className="col-12 content-flex-center" style={{ marginTop: '5%' }}>
                        <button
                            className="btn text-uppercase cancel-button"
                            type="button"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="btn text-uppercase ms-4 submit-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Yes"}
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
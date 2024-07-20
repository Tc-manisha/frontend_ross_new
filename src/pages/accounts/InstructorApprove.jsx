import React from 'react'
import Modal from '@mui/material/Modal';
import { Box, Typography, Button } from "@mui/material";
import { useState } from 'react';
import { CallPOSTAPINEW } from '../../helper/API';
import { useSearchParams } from 'react-router-dom';
import MessageHandler from '../../components/common/MessageHandler';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 386,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function InstructorApprove() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [ FormMsg, setFormMsg ] = useState({ type: true, msg: "" });
    const [ disabled, setDisabled ] = useState(false);

    // handle approve
    const handleApprove = async(value) => {
        let data = {
            "is_approved": value
        }

        let classId = searchParams.get("class_id");
        let contactId = searchParams.get("contact_id");
        let label = searchParams.get("label");
        let url = 'account/instructor-approval-for-class?class_id=' + classId + '&contact_id=' + contactId + '&label=' + label + '';

        const result = await CallPOSTAPINEW(url, data,)
        setFormMsg({ type: result?.status, msg: result?.data?.message });

        if(result?.status) {
            setDisabled(true)
        }
    }

    return (
        <>
            {/* modal */}
            <Modal
                open={ true }
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ style }>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <div className='text-center'>
                            Instructor Approve
                        </div>
                    </Typography>

                    <div className='w-100 d-flex justify-content-center mt-3'>
                      <Button className='bg-success text-white' disabled={disabled ? true : false} style={ { marginRight: "15px" } } onClick={ () => { handleApprove(1) } }>Yes</Button>
                      <Button className='bg-danger text-white' disabled={disabled ? true : false} onClick={ () => { handleApprove(0) } }>No</Button>
                    </div>

                    {/* alert msg */ }
                    <div className="my-4">
                        <MessageHandler
                            status={ FormMsg.type }
                            msg={ FormMsg.msg }
                            HandleMessage={ setFormMsg }
                        />
                    </div>
                </Box>
            </Modal>
        </>
    )
}

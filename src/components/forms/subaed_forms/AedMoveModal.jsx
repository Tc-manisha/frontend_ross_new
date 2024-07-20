import React from 'react'

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1,
};
function AedMoveModal({ open, setOpen,accountId,siteId })
{

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (
        <>
            <div>
                <Link className="btn text-primary ms-1" to={`/move-aed/`+accountId+'/'+siteId} >
                    <img
                        src="/add.svg"
                        alt="svg"
                        style={{ marginRight: "5px" }}
                    />
                    <span className="ms-1">Move</span>
                </Link>
{/*                 
                <button
                    className="btn text-primary ms-1"
                    type="button"
                    // onClick={ handleOpen }
                >
                    <img
                        src="/add.svg"
                        alt="svg"
                        style={{ marginRight: "5px" }}
                    />
                    <span className="ms-1">Move</span>
                </button> */}
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={ open }
                    onClose={ handleClose }
                    closeAfterTransition
                    slots={ { backdrop: Backdrop } }
                    slotProps={ {
                        backdrop: {
                            timeout: 500,
                        },
                    } }
                >
                    <Fade in={ open }>
                        <Box sx={ style }>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Move Site</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={ handleClose }
                                    />
                                </div>
                                <div className="modal-body">
                                    <p>Modal body text goes here.</p>
                                </div>
                                <div className="modal-footer gap-2">
                                    <button type="button" className="btn btn-secondary mr-2" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                    <button type="button" className="btn btn-primary">
                                        Save changes
                                    </button>
                                </div>
                            </div>

                            {/* <Typography id="transition-modal-title" variant="h6" component="h2">
              Move Site
            </Typography>
            <div className="" >

            </div> */}
                        </Box>
                    </Fade>
                </Modal>
            </div>
        </>
    )
}

export default AedMoveModal
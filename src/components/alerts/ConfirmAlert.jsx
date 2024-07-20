// import React from 'react'
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';

// function ConfirmAlert({show,handleClose,msg,handleOk,loading}) {
//   return (
//     <>
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{msg}</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" type="button" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary"  type="button" onClick={handleOk} disabled={loading}>
//             {loading ? 'Loading...' : 'Save Changes'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   )
// }

// export default 






import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

function ConfirmAlert({show,handleClose,msg,handleOk,loading}) {

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

  return (
    <>
      <Modal
               open={show}
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
                            onClick={handleOk}
                            className="btn text-uppercase ms-4 submit-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Yes"}
                        </button>
                    </div>
                </Box>
            </Modal>
    </>
  )
}

export default ConfirmAlert;
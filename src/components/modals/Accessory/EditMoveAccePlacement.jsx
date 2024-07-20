import { toast } from 'react-toastify';
import React,{useState} from 'react'
import { Modal, Button, Form } from 'react-bootstrap';
import { CallPOSTAPI } from '../../../helper/API';



function EditMoveAccePlacement({ id,show, onHide, aedDetails, onSave }) {
    const [loading,setloading] = useState(false);
    const [placementDetails, setPlacementDetails] = useState(aedDetails);

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setPlacementDetails(value);
    //   setPlacementDetails((prevDetails) => ({
    //     ...prevDetails,
    //     [name]: value,
    //   }));
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if(!placementDetails){
        toast.error('Please enter aed placement');
        return "";
      }
      const sendObj = {
        placement : placementDetails 
      }
      setloading(true)
      const result = await CallPOSTAPI('account/editAedPlacement/'+id, sendObj)
      setloading(false)
      if(result.data.status){
        toast.success(result.data.msg);
        onHide();
      }else{
        toast.error(result.data.msg);
      }
    //   onSave(placementDetails);
    //   onHide(); // Close the modal after saving
    };
  
  return (
    <>
         <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Accessory Placement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="location">
            <Form.Label>Accessory Placement</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={placementDetails}
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className=" d-flex justify-content-end" >
            <button className="btn btn-danger mt-4" type="button" onClick={onHide}>
              Cancel
            </button>
            &nbsp;
            <Button variant="primary" type="submit" className="mt-4"  disabled={loading}>
                {loading? 'Loading...':"Update Placement"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
    </>
  )
}

export default EditMoveAccePlacement
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CallGETAPI, CallPOSTAPI } from '../../../helper/API';
import select from 'react-select'
import { toast } from 'react-toastify';


const SupportContactsmodal = ({ addContactsModal, setAddContactsModal,issueType,supportId,onContactsSubmitted}) => {
  const handleClose = () => setAddContactsModal(false);
  const [contactsList, setContactsList] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [loading,setLoading] = useState(false);

  const fetchLoad = async () => {
    const response = await CallGETAPI('support/assign-by-issues/'+issueType);
      const contactsdetails = response?.data?.contactList || [];
      setContactsList(contactsdetails);  
     }

  useEffect(() => {
    fetchLoad();
  }, []);

 console.log(contactsList)
  
const payload = {
    "assign_to":selectedValue
}

const handleSubmit = async () => {
  let response = CallPOSTAPI(`support/reassign-ticket/${supportId}`, payload);
 
  if (response) {
    toast.success("Added Reassign successfully");
    handleClose();
    setLoading(false);
    if (onContactsSubmitted) {
      await onContactsSubmitted();
    }
  }
};

  return (
    <Modal
      show={addContactsModal}
      onHide={handleClose}
      dialogClassName="modal-30w"
      aria-labelledby="example-custom-modal-styling-title"
      size="lg"
      id="contacts-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Contacts Selection</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{minHeight:"300px"}}>
        <div className="modal-container" >
          <div className="my-modal-section">
           <h5 style={{marginBottom:"1%"}}> Assign to -</h5>
            <div className="upper-div">
            <select
                id="modelDropdown"
                className="form-control"
                name="Model"
                value={selectedValue} // Bind value to the selectedValue state
                onChange={(e) => setSelectedValue(e.target.value)} // Update selectedValue on change
                required
              >
                <option value="">- Select one -</option>
                {contactsList.map((contact, index) => (
                  <option key={index + 1} value={contact?.account_main_contact_id}>
                    {contact?.account_main_contact_firstname + " " + contact?.account_main_contact_lastname}
                  </option>
                ))}
              </select>
            
             </div> 
            </div>  
        </div>
      </Modal.Body>
      <Modal.Footer>
       {/* bottom buttons */}
         <div className="row pb-1 py-1" >
            <div className="col-12 content-flex-right" >
              <button className="btn btn-danger text-uppercase" type="button" onClick={ handleClose }>Cancel</button>
              <button className="btn btn-success text-uppercase ms-2" type="submit" 
                disabled={loading} onClick={handleSubmit} >
                  {loading?'Loading...':'Submit'}
                  </button>
            </div>
          </div>
      </Modal.Footer>
    </Modal>
  );
}

export default SupportContactsmodal;

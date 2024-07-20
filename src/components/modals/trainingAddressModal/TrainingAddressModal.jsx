import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import './trainingAddressModal.scss'
import { Form } from "react-bootstrap";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import AccessibleIcon from "@mui/icons-material/Accessible";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import { FetchDropDowns, GetCountries } from '../../../helper/BasicFn';
import { prepareOptions } from '../../../helper/Common';
import MultiTrainingFrom from '../../forms/MultiTrainingFrom';
import { CallPOSTAPI } from '../../../helper/API';

export default function TrainingAddressModal({addressModal, setAddressModal, title, accountId, siteId}) {

    const [ FormMsg, setFormMsg ] = React.useState({ type: true, msg: "" });
    const [ loading, setLoading ] = React.useState(false);
    const [ validated, setValidated ] = useState(false);

    // handle close modal
    const handleClose = () => setAddressModal(false);

    const [countryList,setCountryList] = React.useState([])
    const [ traininglocation, setTraininglocation ] = useState([ {
        "account_alternate_traning_location_company_name": "",
        "alternative_phone": "",
        "alternative_ext": "",
        "account_alternate_traning_location_address1": "",
        "account_alternate_traning_location_address2": "",
        "account_alternate_traning_location_city": "",
        "account_alternate_traning_location_state": "",
        "account_alternate_traning_location_country": 231,
        "account_alternate_traning_location_zipcode": "",
        "account_main_contact_status": 0
    } ]);

    const IncreaseTrainningLocation = () =>
    {
        let arr = [ ...traininglocation ];
        let obj = {
            "account_alternate_traning_location_company_name": "", 
            "alternative_phone": "", "alternative_ext": "", 
            "account_alternate_traning_location_address1": "", 
            "account_alternate_traning_location_address2": "", 
            "account_alternate_traning_location_city": "", 
            "account_alternate_traning_location_state": "", 
            "account_alternate_traning_location_country": 231, 
            "account_alternate_traning_location_zipcode": "", 
            "account_main_contact_status": 0
        };
        arr.push(obj);
        setTraininglocation(arr);
    }
    const [ trainingPhoneValidations, setTrainingPhoneValidations ] = useState(false);

    const DecreaseTrainningLocation = () =>
    {
        let arr = [ ...traininglocation ];
        if (traininglocation.length > 1)
        {
            arr.pop();
        }

        setTraininglocation(arr);
    };

    const [ formData, setFormData ] = useState({
        traininglocation: [],
    });

    const [ allDropDowns, setAllDropDowns ] = React.useState([]);

    const fetchOnload = async () =>
    {
        let AllDResult = await FetchDropDowns();
        if (AllDResult)
        {
          setAllDropDowns(AllDResult);
        }

        // get country
        const countries = await GetCountries();
        if(countries?.status) {
            let countriesData = prepareOptions(countries?.country, 'id', 'country_name')
            setCountryList(countriesData)
        }
  
    };

    // handle input change
    const handleInputChange = (e) =>
    {
        setFormData((old) => ({ ...old, [ e.target.name ]: e.target.value }));
    };

    const handleSubmit = async (e) =>
    {
      e.preventDefault();
  
      setLoading(true);
  
      // setValidated();
      const form = e.currentTarget;
      if (form.checkValidity() === false)
      {
        setLoading(false);
        setValidated(true);
        return;
      }
  
      let arr = formData;
      arr.traininglocation = traininglocation;
      
      let payloadData = {
          "account_id": accountId,
          "site_id": siteId,
          "site_training": formData.traininglocation,
      }
  
      let result = await CallPOSTAPI("account/add-new-training-address", payloadData);
      setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
      setLoading(false);
  
      if (result?.data?.status)
      {
        handleClose();
      }
  
    };

    useEffect(() =>
    {
      fetchOnload();
    }, []);

    return (
        <>
            <Modal show={ addressModal } onHide={ handleClose }
                dialogClassName="training-modal"
                aria-labelledby=""
                size="lg"
                id="address-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form
                        className=""
                        onSubmit={ handleSubmit }
                        noValidate
                        validated={ validated }
                        id="create-new-account-form"
                    >
                        <div className="modal-container" id="address-modal-content"  >
                            <div className="my-modal-section">
                                <MultiTrainingFrom
                                    altTrainerForm={ traininglocation }
                                    setSubFormData={ setTraininglocation }
                                    increaseAlternative={ IncreaseTrainningLocation }
                                    decreaseAlternative={ DecreaseTrainningLocation }
                                    handleInputChange={ handleInputChange }
                                    allDropDowns={ allDropDowns }
                                    noBtns={ false }
                                    countriesList={countryList}
                                    setTrainingPhoneValidations={setTrainingPhoneValidations}
                                />
                            </div>
                        </div>

                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <button className="btn btn-danger" onClick={ handleClose }>
                        Cancel
                    </button>
                    <button className="btn btn-success" type="button" onClick={ handleSubmit }>
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

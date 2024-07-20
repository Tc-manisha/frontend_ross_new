import React, { useState, useEffect } from "react";
import
  {
    Form,
    Button as BButton,
    Button as BsButton,
    InputGroup,
  } from "react-bootstrap";

import Container from "react-bootstrap/Container";

import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";

import { CallPOSTAPI } from "../../helper/API";
import { FetchDropDowns, GetCountries } from "../../helper/BasicFn";

import MessageHandler from "../../components/common/MessageHandler";
import MultiTrainingFrom from "../../components/forms/MultiTrainingFrom";
import { useNavigate, useParams } from "react-router-dom";
import SubHeading from "../../components/header/SubHeading";
import SubHeadingOther from "../../components/header/SubHeadingOther";
import { prepareOptions, validatePhone } from "../../helper/Common";
import { toast } from "react-toastify";

const SiteTrainingNew = ({ setShowSidebar }) =>
{
  const navigate = useNavigate();
  const {siteId} = useParams();
  const {accountId} = useParams();

  const [ validated, setValidated ] = useState(false);
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
      "alternative_phone": "", 
      "alternative_ext": "", 
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

  // handleInputChange
  const handleInputChange = (e) =>
  {
    setFormData((old) => ({ ...old, [ e.target.name ]: e.target.value }));
  };

  const [ altTrainerForm, setAltTrainerForm ] = useState([]);

  const [ altTrainerForm1, setAltTrainerForm1 ] = useState([
    {
      phone_number: "0",
      ext: "0",
      phone_type_id: "0",
      main: 0,
    },
  ]);

  const [ FormMsg, setFormMsg ] = React.useState({ type: true, msg: "" });
  const [ loading, setLoading ] = React.useState(false);
  const [submitDisable, setSubmitDisable] = useState(true)
  const [ validateField, setValidateField ] = React.useState(false);
  const [ phoneValidations, setPhoneValidations ] = useState({})

  // handle submit
  const handleSubmit = async (e) =>
  {
    e.preventDefault();

    const promises = traininglocation.map((data,index) => {
      let phone = data?.alternative_phone;
      if(phone != '') {
        const alternativePhoneValidate = validatePhone(data?.alternative_phone);
        setPhoneValidations((old) => ({...old, [index]: alternativePhoneValidate ? false : true}));
        setValidated(alternativePhoneValidate ? true : false);
      } else {
        setPhoneValidations((old) => ({...old, [index]: true}));
        setValidated(true);
      }
    })

    const form = e.currentTarget;
    if (form.checkValidity() === false)
    {
      setLoading(false);
      setValidated(true);
      return;
    }

    if(validateField == false) {
      saveForm();
    }

  };

  // save form
  const saveForm = async() => {
    let arr = formData;

    traininglocation.map((data) => {
      data.id = data.account_alternate_traning_location_id
      data.alternative_phone = data.alternative_phone
      data.alternative_ext = data.alternative_ext
      data.main = data.main ? 1 : 0
    })

    arr.traininglocation = traininglocation;

    let payloadData = {
        "account_id": accountId,
        "site_id": siteId,
        "site_training": formData.traininglocation,
    }

    let result = await CallPOSTAPI("account/add-new-training-address", payloadData);
    // setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
    setLoading(false);

    if (result?.data?.status)
    {
      // resetForm();
      toast.success('New Training Addedd Successfully');
      setTimeout(() => {
        navigate('/account/site-details/' + siteId);
      }, 1000)
    } else {
      toast.error('Something went wrong');
    }
  }

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

  useEffect(() =>
  {
    fetchOnload();
  }, []);

const object = [{
    "account_alternate_traning_location_company_name": "",
    "alternative_phone": "",
    "alternative_ext": "",
    "account_alternate_traning_location_address1": "",
    "account_alternate_traning_location_address2": "",
    "account_alternate_traning_location_city": "",
    "account_alternate_traning_location_state": "",
    "account_alternate_traning_location_zipcode": "",
}]

function compareKeys(traininglocation, object) {
  // Get the keys of the first object
  const keys = Object.keys(object[0]);
  
  // Iterate over the keys
  for (const key of keys) {
      // Check if the key exists in both objects and their values are equal
      if (!(key in traininglocation[0]) || traininglocation[0][key] !== object[0][key]) {
          // If key is missing or values are not equal, return false
          return false;
      }
  }
  // If all keys exist in traininglocation with matching values, return true
  return true;
}


useEffect(() => {
  compareKeys(traininglocation,object)
  if(traininglocation){
    setSubmitDisable(compareKeys(traininglocation, object));
  }
},[traininglocation])

  console.log(traininglocation);

  return (
    <>
    <div className='mt-4' style={{paddingInline:"45px"}}>

      {/* <SubHeading hideNew hideHierarchy/> */}
      <SubHeadingOther hideNew='tab' title="New Alternate Training Information" subHeading={true}  hideHierarchy={true} bottomLinks={false}/>

      <Form
        className=""
        onSubmit={ handleSubmit }
        noValidate
        validated={ validated }
        id="create-new-account-form"
      >
        <div className="contailer-fluid ">
          
          <div
            className="container-fluid bottom-border-blue"
            style={ {
              borderBottom: "4px solid rgb(13, 110, 253)",
              background: "#eee",
            } }
          >
            <div className="row my-4">
              <div
                className="col-12"
                style={ { marginBottom: "50px", marginTop: "20px" } }
              >
                <h2 className="text-center">Alternate Training Information</h2>
              </div>

              <div className="col-12" >
                <MultiTrainingFrom
                  altTrainerForm={ traininglocation }
                  setSubFormData={ setTraininglocation }
                  increaseAlternative={ IncreaseTrainningLocation }
                  decreaseAlternative={ DecreaseTrainningLocation }
                  handleInputChange={ handleInputChange }
                  allDropDowns={ allDropDowns }
                  noBtns={ false }
                  countriesList={countryList}
                  phoneValidations={phoneValidations}
                  setTrainingPhoneValidations={setPhoneValidations}
                  setValidateField={ setValidateField }
                />
              </div>

            </div>

          </div>

          <div className="my-3">
            <MessageHandler
              status={ FormMsg.type }
              msg={ FormMsg.msg }
              HandleMessage={ setFormMsg }
            />
          </div>

          <div
            className="container-fluid bottom-border-blue"
            style={ { marginBottom: "50px" } }
          >
            <div
              className="col-md-12 d-flex"
              style={ { marginTop: "25px", justifyContent: "right" } }
            >
              <Button
                className={ "btn btn-danger mx-4" }
                variant="danger"
                style={ { fontSize: "16px" } }
                onClick={()=>{navigate(-1)}}
              >
                Cancel
              </Button>

              <Button
                className={ "btn btn-success" }
                variant="success"
                style={ { marginRight: "5px", fontSize: "16px" } }
                type="submit"
                disabled={ submitDisable }
              >
                 {submitDisable ? 'Submit' : 'Submit'}
                {/* Submit */}
              </Button>
            </div>
          </div>

        </div>
      </Form>
      </div>
    </>
  );
};

export default SiteTrainingNew;

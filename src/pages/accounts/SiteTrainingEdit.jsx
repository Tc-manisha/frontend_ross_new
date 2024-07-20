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
import { EditSiteDetailsSingle, FetchDropDowns, GetCountries } from "../../helper/BasicFn";

import MessageHandler from "../../components/common/MessageHandler";
import MultiTrainingFrom from "../../components/forms/MultiTrainingFrom";
import { useNavigate, useParams } from "react-router-dom";
import { FetchAccountSiteTrainingDetails } from '../../helper/BasicFn';
import SubHeading from "../../components/header/SubHeading";
import SubHeadingOther from "../../components/header/SubHeadingOther";
import { prepareOptions, validatePhone } from "../../helper/Common";
import { toast } from "react-toastify";

const SiteTrainingEdit = ({ setShowSidebar }) =>
{
  const navigate = useNavigate();
  const {siteId,DetailID} = useParams();
  const {accountId} = useParams();

  const [ validated, setValidated ] = useState(false);
  const [ trainingData, setTrainingData ] = useState([]);
  const [ countryList,setCountryList ] = React.useState([])
  const [ selectedCountry,setSelectedCountry ] = React.useState({})

  const [ traininglocation, setTraininglocation ] = useState([ {
    "account_alternate_traning_location_company_name": "",
    "alternative_phone": "",
    "alternative_ext": "",
    "account_alternate_traning_location_address1": "",
    "account_alternate_traning_location_address2": "",
    "account_alternate_traning_location_city": "",
    "account_alternate_traning_location_state": "",
    "account_alternate_traning_location_country": "",
    "account_alternate_traning_location_zipcode": "",
    "account_main_contact_status": "0",
    "account_alternate_traning_location_id": "",
  } ]);

  const fetch = async () =>{
      // let data = await FetchAccountSiteTrainingDetails(siteId);
      let data = await EditSiteDetailsSingle(DetailID);
      if (data){
        let arr = [];
        if(data?.trainingLocations){
          arr.push(data?.trainingLocations)
        }
        setTrainingData(arr)
        
        // get country
        const countries = await GetCountries();
        if(countries?.status) {
          let countriesData = prepareOptions(countries?.country, 'id', 'country_name')
          setCountryList(countriesData)
        }

    }
  }

  useEffect(() =>
  {
    fetch()
  }, [])

  const IncreaseTrainningLocation = () =>
  {
    let arr = [ ...traininglocation ];
    let obj = {
      "account_alternate_traning_location_company_name": "", "alternative_phone": "", "alternative_ext": "", "account_alternate_traning_location_address1": "", "account_alternate_traning_location_address2": "", "account_alternate_traning_location_city": "", "account_alternate_traning_location_state": "", "account_alternate_traning_location_country": "", "account_alternate_traning_location_zipcode": "", "account_main_contact_status": "0","account_alternate_traning_location_id": "",
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

  const handleInputChange = (e) =>
  {
    setFormData((old) => ({ ...old, [ e.target.name ]: e.target.value }));
  };

  const [ FormMsg, setFormMsg ] = React.useState({ type: true, msg: "" });
  const [ loading, setLoading ] = React.useState(false);
  const [ phoneValidations, setPhoneValidations ] = useState({})
  const [ validateField, setValidateField ] = React.useState(false);

  const handleSubmit = async (e) =>
  {
    e.preventDefault();

    trainingData.map((data,index) => {
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
      trainingData.map((data) => {
        data.id = data.account_alternate_traning_location_id
        data.alternative_phone = data.alternative_phone
        data.alternative_ext = data.alternative_ext
        data.main = data.main ? 1 : 0
      })
      arr.traininglocation = trainingData;
      
      let payloadData = {
          "account_id": accountId,
          "site_id": siteId,
          "site_training": formData.traininglocation,
      }

      let result = await CallPOSTAPI("account/update-training-address", payloadData);
      // setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
      setLoading(false);

      if (result?.data?.status)
      {
        toast.success('Training Edited Successfully');
        navigate('/account/site-details/' + siteId);
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

  };

  useEffect(() =>
  {
    fetchOnload();
  }, []);

  return (
    <>
    <div className='mt-4' style={{paddingInline:"45px"}}>

    <SubHeadingOther hideNew='tab' title="Edit Training Address" subHeading={true}  hideHierarchy={true} bottomLinks={false}/>
    
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
              // borderBottom: "4px solid rgb(13, 110, 253)",
              background: "#eee",
            } }
          >
            <div className="row my-4">
              <div
                className="col-12"
                style={ { marginBottom: "50px", marginTop: "20px" } }
              >
                <h2 className="text-center">Edit Training Address</h2>
              </div>

              <div className="col-12" >
                <MultiTrainingFrom
                  altTrainerForm={ trainingData }
                  setSubFormData={ setTraininglocation }
                  increaseAlternative={ IncreaseTrainningLocation }
                  decreaseAlternative={ DecreaseTrainningLocation }
                  handleInputChange={ handleInputChange }
                  allDropDowns={ allDropDowns }
                  noBtns={ false }
                  type="trainingEdit"
                  phoneValidations={phoneValidations}
                  countriesList={countryList}
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
                disabled={ loading }
              >
                Submit
              </Button>
            </div>
          </div>

        </div>
      </Form>
      </div>
    </>
  );
};

export default SiteTrainingEdit;

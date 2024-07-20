import React, { useState, useEffect } from "react";

import { FormControlLabel, Icon, Switch } from "@mui/material";
import
{
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import "../../../../src/global.css";
import Button from "@mui/material/Button";
import SubForm from "../../SubForm";

import { DecryptToken, FetchDropDowns, GetCountries, ProductsDropDown } from "../../../helper/BasicFn";
import MultiEmailForm from "../../../components/forms/MultiEmailForm";
import { CallPOSTAPI } from "../../../helper/API";
import MessageHandler from "../../../components/common/MessageHandler";
import { useNavigate, useParams } from "react-router-dom";
import SubHeading from "../../../components/header/SubHeading";
import SubHeadingOther from "../../../components/header/SubHeadingOther";
import MainContactModalPhone from "../../../components/modals/MainContactModal/MainContactModalPhone";
import MainContactModalEmail from "../../../components/modals/MainContactModal/MainContactModalEmail";
import ContactModalEmail from "../../../components/modals/MainContactModal/ContactModalEmail";
import ContactModalPhone from "../../../components/modals/MainContactModal/ContactModalPhone";
import AddContactPhoneFrom from "../../../components/forms/AddContactPhoneFrom";
import AddContactMultiEmailForm from "../../../components/forms/AddContactMultiEmailForm";
import StateField from "../../../components/common/states/StatesField";
import { prepareOptions } from "../../../helper/Common";
import Select from 'react-select'
import ToogleSwitch from "../../../components/common/toggleSwitch/ToogleSwitch";
import { toast } from "react-toastify";

const NewContact = ({ setShowSidebar }) =>
{
  const navigate = useNavigate();
  const user = DecryptToken();
  const [ mainError, setMainError ] = useState(false);
  const [ validated, setValidated ] = useState(false);
  const { accountId } = useParams();
  const [ phoneValidation, setPhoneValidation ] = useState({});
  const [ countryList, setCountryList ] = React.useState([]);
  const [ selectedCountry, setSelectedCountry ] = React.useState({});
  const [ switchValue, setSwitchValue ] = useState({});
  const [ formData, setFormData ] = useState({

    account_id: accountId,

    account_main_contact_salutation: "",
    account_main_contact_firstname: "",
    account_main_contact_middlename: "",
    account_main_contact_lastname: "",
    account_main_contact_suffix: "",
    account_main_contact_title: "",
    account_main_contact_department: "",
    account_main_contact_status: 1,
    contact_status: 1,

    main_contact_phone: [],
    main_contact_email: [],
  });

  const [ multiEmailFormCount, setMultiEmailFormCount ] = useState([
    {
      account_main_contact_email: "",
      email_type_id: "",
      account_main_contact_email_main: '',
    },
  ]);

  const MultiEmailFormIncrease = () =>
  {
    let arr = [ ...multiEmailFormCount ];
    let obj = {

      account_main_contact_email: "",
      email_type_id: "",
      account_main_contact_email_main: '',
    };
    arr.push(obj);
    setMultiEmailFormCount(arr);
  };

  const MultiEmailFormDecrease = (index1) =>
  {
    let arr = [ ...multiEmailFormCount ];
    if (index1 >= 0 && multiEmailFormCount.length > 1)
    {
      const updateArr = arr.filter((_, index) => index !== index1);
      setMultiEmailFormCount(updateArr);
    }
  };

  const handleInputChange = (e) =>
  {
    setFormData((old) => ({ ...old, [ e.target.name ]: e.target.value }));
  };

  const [ altTrainerForm1, setAltTrainerForm1 ] = useState([
    {
      account_main_contact_phone_id: "",
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: "",
      account_main_contact_phone_main: 0,
    },
  ]);

  const increaseAlternative1 = () =>
  {
    let arr = [ ...altTrainerForm1 ];
    let obj = {
      account_main_contact_phone_id: "",
      account_main_contact_phone: "",
      account_main_contact_phone_ext: "",
      phone_type_id: "",
      account_main_contact_phone_main: 0,
    };
    arr.push(obj);
    setAltTrainerForm1(arr);
  };

  const decreaseAlternative1 = (index1) =>
  {
    let arr = [ ...altTrainerForm1 ];
    if (index1 >= 0 && altTrainerForm1.length > 1)
    {
      const updateArr = arr.filter((_, index) => index !== index1);
      setAltTrainerForm1(updateArr);
    }
  };

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
    if (countries?.status)
    {
      let countriesData = prepareOptions(countries?.country, 'id', 'country_name')
      setCountryList(countriesData)
      setSelectedCountry((old) => ({
        ...old, "contact_country": {
          "label": countriesData[ 230 ].label,
          "value": countriesData[ 230 ].value,
        }
      }))

    }
  };

  const [ FormMsg, setFormMsg ] = React.useState({ type: true, msg: "" });
  const [ loading, setLoading ] = React.useState(false);
  const [ openContactModal, setContactModal ] = React.useState(false);
  const [ listType, setListType ] = React.useState('')

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    setLoading(true);

    // check for phone validations
    for (const [ key, value ] of Object.entries(phoneValidation))
    {
      if (value)
      {
        setLoading(false);
        setValidated(true);
        return;
      }
    }

    const form = e.currentTarget;
    if (form.checkValidity() === false)
    {
      setLoading(false);
      setValidated(true);
      return;
    }

    SaveForm();
  };

  const checkisMainContact = (arr, key) =>
  {
    let newarr = arr.find((a) => (a[ key ]) ? true : false);

    return newarr ? true : false;
  }

  const SaveForm = async () =>
  {
    let arr = formData;
    arr.training_optout = formData.training_optout ? 1 : 0;

    arr.main_contact_phone = altTrainerForm1;
    arr.main_contact_email = multiEmailFormCount;

    if (arr.main_contact_phone.length > 1)
    {
      arr.main_contact_phone.find((data) =>
      {
        return data.account_main_contact_phone_main == 1
      })
    } else
    {
      setMainError(false)
    }

    // check for email main
    if (arr.main_contact_email.length > 1)
    {
      arr.main_contact_email.find((data) =>
      {
        return data.account_main_contact_email_main == 1
      })
    } else
    {
      setMainError(false)
    }


    let checkMainPhone = checkisMainContact(arr.main_contact_phone, 'account_main_contact_phone_main');
    let checkMainEmail = checkisMainContact(arr.main_contact_email, 'account_main_contact_email_main');

    if (!checkMainPhone  && altTrainerForm1.some(i => i?.account_main_contact_phone))
    {
      setListType('phone');
      setContactModal(true);
      return false;
    }

    if (!checkMainEmail)
    {
      setListType('email');
      setContactModal(true);
      return false;
    }

    arr.contact_country_name = selectedCountry.contact_country.label;
    arr.contact_country = selectedCountry.contact_country.value;

    if (!mainError)
    {
      let result = await CallPOSTAPI("account/add_account_contacts", arr);
      if(result?.data?.status) {
        // setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
        toast.success(result?.data?.msg);
        let pathUrl = "";
        if(user?.user_type == 3) {
          pathUrl = "/user/Contacts/" + formData?.account_id; 
        } else {
          pathUrl = '/account-details/' + formData?.account_id;
        }
        navigate(pathUrl, {
          state: {
            tab: 'Contacts',
            type: result?.data?.status,
            msg: result?.data?.msg
          }
        })
      } else {
          toast.error(result?.data?.msg);
      }
      setLoading(false);
    }
  }

  // handle select change
  const handleSelectChange = (data, key) =>
  {
    setSelectedCountry((old) => ({
      ...old, [ key ]: {
        "label": data.label,
        "value": data.value,
      }
    }))

    setFormData((old) => ({ ...old, [ key ]: data.value }));
  };

  useEffect(() =>
  {
    fetchOnload();
  }, []);

  // switchChangeHandle
  const switchChangeHandle = (switchValue, e) => {
    setFormData((old) => ({...old, [switchValue?.key] : switchValue?.value}));
  }

  // check for switch value and update values
  useEffect(() => {
    switchChangeHandle(switchValue);
  }, [switchValue]);

  return (
    <>
      <div className='mt-4' style={ { paddingInline: "45px" } }>
        <SubHeadingOther title="New Contact" hideNew='tab' subHeading={ true } hideHierarchy={ true } bottomLinks={ false } />
      </div>

      <Form
        className=""
        onSubmit={ handleSubmit }
        noValidate
        validated={ validated }
        id="create-new-account-form"
      >
        <div className="contailer-fluid px-4 mx-4">

          <div
            className="container-fluid bottom-border-blue pb-4 pt-2"
            style={ { background: "#eee" } }
          >
            <h2 className="text-left heading" >Contact Information</h2>
            <div className="row mb-4 mt-3">
              <Form.Group className={ "col NewContactFormField" }>
                <Form.Label>Salutation</Form.Label>
                <Form.Control
                  type="text"
                  name="account_main_contact_salutation"
                  onChange={ handleInputChange }
                />
              </Form.Group>

              <Form.Group className={ "col NewContactFormField" }>
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="account_main_contact_firstname"
                  onChange={ handleInputChange }
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter First Name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={ "col NewContactFormField" }>
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  name="account_main_contact_middlename"
                  onChange={ handleInputChange }

                />
                <Form.Control.Feedback type="invalid">
                  Please Enter Middle Name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={ "col NewContactFormField" }>
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="account_main_contact_lastname"
                  onChange={ handleInputChange }
                  required
                />
              </Form.Group>

              <Form.Group className={ "col NewContactFormField" }>
                <Form.Label>Suffix</Form.Label>
                <Form.Control
                  type="text"
                  name="account_main_contact_suffix"
                  onChange={ handleInputChange }
                />
              </Form.Group>

              <Form.Group className={ "col NewContactFormField" } >
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="account_main_contact_title"
                  onChange={ handleInputChange }
                />
              </Form.Group>
              <Form.Group className={ "col NewContactFormField" }>
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="account_main_contact_department"
                  onChange={ handleInputChange }
                />
              </Form.Group>

              <Form.Group className={ "col NewContactFormField" }>
                <Form.Label>Contact Status</Form.Label>

                <Form.Select
                  className={ "" }
                  name="contact_status"
                  onChange={ handleInputChange }
                  value={formData.contact_status}
                >
                  <option value="0" disabled>
                    --Select One--
                  </option>
                  { allDropDowns?.contactStatus &&
                    allDropDowns?.contactStatus.map((CS, index) => (
                      <option value={ CS.dropdown_contact_status_id } key={ index }>
                        { CS.contact_status_type }
                      </option>
                    )) }
                </Form.Select>
              </Form.Group>
            </div>

            <AddContactPhoneFrom
              altTrainerForm={ altTrainerForm1 }
              setSubFormData={ setAltTrainerForm1 }
              increaseAlternative={ increaseAlternative1 }
              decreaseAlternative={ decreaseAlternative1 }
              handleInputChange={ handleInputChange }
              allDropDowns={ allDropDowns }
              formData={ formData.main_contact_phone }
              formName={ "main_contact_phone" }
              setFormData={ setFormData }
              noBtns={ true }
              setPhoneValidation={ setPhoneValidation }
              phoneValidation={ phoneValidation }
            />

            <AddContactMultiEmailForm
              altTrainerForm={ multiEmailFormCount }
              setSubFormData={ setMultiEmailFormCount }
              increaseAlternative={ MultiEmailFormIncrease }
              decreaseAlternative={ MultiEmailFormDecrease }
              handleInputChange={ handleInputChange }
              allDropDowns={ allDropDowns }
              formData={ formData.main_contact_email }
              formName={ "main_contact_email" }
              setFormData={ setFormData }
            />

            <div className="row">
              <Form.Group className={ "col NewContactFormField" }>
                <Form.Label>Country</Form.Label>
                <Select
                  value={ selectedCountry?.contact_country }
                  options={ countryList }
                  onChange={ (data) => { handleSelectChange(data, 'contact_country') } }
                />
              </Form.Group>
              <Form.Group className={ "col NewContactFormField" }>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_address1"
                  onChange={ handleInputChange }
                  // required
                  value={ formData.contact_address1 }
                />

                <Form.Control.Feedback type="invalid">
                  Please Enter Address.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={ "col NewContactFormField" }>
                <Form.Label>Address 2</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_address2"
                  onChange={ handleInputChange }
                  value={ formData.contact_address2 }
                />
              </Form.Group>

              <Form.Group className={ "col NewContactFormField" }>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_city"
                  onChange={ handleInputChange }
                  value={ formData.contact_city }
                // required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter City.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={ "col NewContactFormField" }>
                <Form.Label>State </Form.Label>
                <StateField setFormData={ setFormData } valueKey="contact_state" selectedCountry={ selectedCountry?.contact_country?.value } validated={ false } required={ true } stateSelectedValue={ formData?.contact_state } />
              </Form.Group>

              <Form.Group className={ "col NewContactFormField" }>
                <Form.Label>Zip code</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_zipcode"
                  onChange={ handleInputChange }
                  value={ formData.contact_zipcode }
                // required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter Zip Code.
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <Form.Group className={ 'col my-4' }>
                <b className={ 'd-block' }>Training OptOut</b>
                <span className="d-inline-block mt-10-px">
                    <ToogleSwitch switchKeyValue={formData?.training_optout} setSwitchValue={setSwitchValue} switchValue={switchValue} switchKey={'training_optout'} />
                </span>
                {/* <div className="" >
                    <FormControlLabel
                    className={ '' }
                    label=""
                    control={
                        <Switch
                        color="primary"
                        size="medium"
                        value={ true }
                        name="training_optout"
                        onChange={ handleInputChange }
                        // checked={ formData.training_optout == 1 || formData.training_optout ? true : false }
                        /> }
                    />
                </div> */}
            </Form.Group>
          </div>

          <div className="my-4">
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
                onClick={ () => { navigate(-1) } }
              >
                Cancel
              </Button>

              <Button
                className={ "btn btn-success" }
                variant="success"
                style={ { marginRight: "5px", fontSize: "16px" } }
                type="submit"
              // disabled={ loading }
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Form>


      <ContactModalPhone
        // open={openContactModal}
        open={(listType === 'phone' ? true : false)}
        hanldeModal={ setContactModal }
        emailDataList={ altTrainerForm1 }
        phoneDataList={ altTrainerForm1 }
        dataType={ listType }
        setSubFormData={ setAltTrainerForm1 }
        SaveForm={ SaveForm }
        setDataType={ setListType }
      />

      <ContactModalEmail
        open={ (listType === 'email') ? true : false }
        hanldeModal={ setContactModal }
        emailDataList={ multiEmailFormCount }
        phoneDataList={ multiEmailFormCount }
        dataType={ listType }
        setSubFormData={ setMultiEmailFormCount }
        SaveForm={ SaveForm }
        setDataType={ setListType }
      />

    </>
  );
};

export default NewContact;

import React, { useState, useEffect } from "react";

import { FormControlLabel, Icon, Switch } from "@mui/material";
import
  {
    Form,
    Button as BButton,
    Button as BsButton,
    InputGroup,
  } from "react-bootstrap";
// import styles from "";
import styles from '../NewAccount.module.css';
import Container from "react-bootstrap/Container";

import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import SubForm from "../SubForm";

import { FetchDropDowns, ProductsDropDown } from "../../helper/BasicFn";
import MultiEmailForm from "../../components/forms/MultiEmailForm";
import { CallPOSTAPI } from "../../helper/API";
import MessageHandler from "../../components/common/MessageHandler";
import ProductModal from "../../components/modals/ProductModal";
import AccountReps from "../../components/modals/accountReps";
import SectionHeading from "../../components/common/SectionHeading";
import SubHeading from "../../components/header/SubHeading";
import { useNavigate } from "react-router-dom";

const NewContact = ({ setShowSidebar }) =>
{
  const navigate = useNavigate();
  const [ ProductModalData, setProductModalData ] = useState([]);

  const [ ProductShowModal, setProductShowModal ] = useState(false);
  const [ SelectedProductsData, setSelectedProductData ] = useState("");

  const [ SelectAccReps, setSelectAccReps ] = useState([]);
  const [ ShowAccRepsModal, setShowAccRepsModal ] = useState(false);
  const [ validated, setValidated ] = useState(false);

  const [ formData, setFormData ] = useState({

    location_phone: [],

    account_main_contact_salutation: "",
    account_main_contact_firstname: "",
    account_main_contact_middlename: "",
    account_main_contact_lastname: "",
    account_main_contact_suffix: "",
    account_main_contact_title: "",
    account_main_contact_department: "",

    main_contact_phone: [],
    main_contact_email: [],
  });

  const resetForm = () =>
  {
    document.getElementById("create-new-account-form").reset();
  };

  const [ multiEmailFormCount, setMultiEmailFormCount ] = useState([
    {
      email: "",
      email_type: "0",
      main: 0,
    },
  ]);
  const MultiEmailFormIncrease = () =>
  {
    let arr = [ ...multiEmailFormCount ];
    let obj = {
      email: "",
      email_type: "0",
      main: 0,
    };
    arr.push(obj);
    setMultiEmailFormCount(arr);
  };

  const MultiEmailFormDecrease = () =>
  {
    let arr = [ ...multiEmailFormCount ];
    if (multiEmailFormCount.length > 1)
    {
      arr.pop();
    }

    setMultiEmailFormCount(arr);
  };

  const handleInputChange = (e) =>
  {
    setFormData((old) => ({ ...old, [ e.target.name ]: e.target.value }));
  };

  const [ altTrainerForm1, setAltTrainerForm1 ] = useState([
    {
      phone_number: "0",
      ext: "0",
      phone_type_id: "0",
      main: 0,
    },
  ]);

  const increaseAlternative1 = () =>
  {
    let arr = [ ...altTrainerForm1 ];
    let obj = {
      phone_number: "0",
      ext: "0",
      phone_type_id: "0",
      main: "",
    };
    arr.push(obj);
    setAltTrainerForm1(arr);
  };

  const decreaseAlternative1 = () =>
  {
    let arr = [ ...altTrainerForm1 ];
    if (altTrainerForm1.length > 1)
    {
      arr.pop();
      setAltTrainerForm1(arr);
    }
  };

  const [ allDropDowns, setAllDropDowns ] = React.useState([]);

  const fetchOnload = async () =>
  {
    let ProductResult = await ProductsDropDown();
    if (ProductResult)
    {
      // setProductDropDown(ProductResult)
      setProductModalData(ProductResult?.products);
    }

    let AllDResult = await FetchDropDowns();
    if (AllDResult)
    {
      setAllDropDowns(AllDResult);
    }
  };

  const [ FormMsg, setFormMsg ] = React.useState({ type: true, msg: "" });
  const [ loading, setLoading ] = React.useState(false);

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
    arr.training_optout = formData.training_optout ? 1 : 0
    
    let emailData = []
    multiEmailFormCount.map((email) => {
        let data = {}
        data.email = email.email;
        data.email_type = parseInt(email.email_type_id);
        data.main = email?.main ? 1 : 0;
        emailData.push(data);
    })

    let phoneData = []
    altTrainerForm1.map((phone) => {
      let data = {}
      data.ext = phone.ext;
      data.phone_number = phone.phone_number;
      data.phone_type_id = parseInt(phone.phone_type_id);
      data.main = phone?.main ? 1 : 0;
      phoneData.push(data);
    })

    arr.main_contact_phone = phoneData;
    arr.main_contact_email = emailData;

    let result = await CallPOSTAPI("account/add_account_contacts", arr);
    setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
    setLoading(false);
  };
  useEffect(() =>
  {
    fetchOnload();
  }, []);

  return (
    <>
      <div className='mt-4' style={ { paddingInline: "45px" } }>
        <SubHeading hideNew hideHierarchy />
      </div>


      {/* <SectionHeading setShowSidebar={setShowSidebar} title="New Account" /> */ }

      <Form
        className=""
        onSubmit={ handleSubmit }
        noValidate
        validated={ validated }
        id="create-new-account-form"
      >
        <div className="contailer-fluid px-4">

          <div
            className="container-fluid bottom-border-blue pb-4"
            style={ { background: "#eee" } }
          >
            <div className="row my-4 ">
              <div
                className="col-12"
                style={ { marginBottom: "50px", marginTop: "20px" } }
              >
                <h2 className="text-center">Account Main Contact</h2>
              </div>

              <Form.Group className={ "col" }>
                <Form.Label>Salutation</Form.Label>
                <Form.Control
                  type="text"
                  name="account_main_contact_salutation"
                  onChange={ handleInputChange }
                />
              </Form.Group>

              <Form.Group className={ "col" }>
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

              <Form.Group className={ "col" }>
                <Form.Label>Middle Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="account_main_contact_middlename"
                  onChange={ handleInputChange }

                />
                <Form.Control.Feedback type="invalid">
                  Please Enter Middle Name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={ "col" }>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="account_main_contact_lastname"
                  onChange={ handleInputChange }
                  required
                />
              </Form.Group>

              <Form.Group className={ "col" }>
                <Form.Label>Suffix</Form.Label>
                <Form.Control
                  type="text"
                  name="account_main_contact_suffix"
                  onChange={ handleInputChange }
                />
              </Form.Group>

              <Form.Group className={ "col" }>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="account_main_contact_title"
                  onChange={ handleInputChange }
                />
              </Form.Group>
              <Form.Group className={ "col" }>
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="account_main_contact_department"
                  onChange={ handleInputChange }
                />
              </Form.Group>

              <Form.Group className={ "col" }>
                <Form.Label>Contact Status</Form.Label>

                <Form.Select
                  className={ "" }
                  name="contact_status"
                  onChange={ handleInputChange }
                >
                  <option value="0" selected>
                    --Select One--
                  </option>
                  { allDropDowns?.contactStatus &&
                    allDropDowns?.contactStatus.map((CS) => (
                      <option value={ CS.dropdown_contact_status_id }>
                        { CS.contact_status_type }
                      </option>
                    )) }
                </Form.Select>
              </Form.Group>
            </div>

            <SubForm
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
            />

            <MultiEmailForm
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

            <div className="row my-4">
              <Form.Group className={ "col" }>
                <Form.Label>Address *</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_address1"
                  onChange={ handleInputChange }
                  required
                  value={ formData.contact_address1 }
                />

                <Form.Control.Feedback type="invalid">
                  Please Enter Address.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={ "col" }>
                <Form.Label>Address 2</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_address2"
                  onChange={ handleInputChange }
                  value={ formData.contact_address2 }
                />
              </Form.Group>

              <Form.Group className={ "col" }>
                <Form.Label>City *</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_city"
                  onChange={ handleInputChange }
                  value={ formData.contact_city }
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter City.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={ "col" }>
                <Form.Label>State *</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_state"
                  onChange={ handleInputChange }
                  value={ formData.contact_state }
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter State.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={ "col" }>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_country"
                  onChange={ handleInputChange }
                  value={ formData.contact_country }
                />
              </Form.Group>

              <Form.Group className={ "col" }>
                <Form.Label>Zip code *</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_zipcode"
                  onChange={ handleInputChange }
                  value={ formData.contact_zipcode }
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter Zip Code.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <MessageHandler
            status={ FormMsg.type }
            msg={ FormMsg.msg }
            HandleMessage={ setFormMsg }
          />

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


    </>
  );
};

export default NewContact;

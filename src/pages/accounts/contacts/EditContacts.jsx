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
import styles from '../../NewAccount.module.css';
import Container from "react-bootstrap/Container";

import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import SubForm from "../../SubForm";

import { FetchDropDowns, ProductsDropDown, GetAccountEditContactList, GetCountries, DecryptToken } from "../../../helper/BasicFn";
import MultiEmailForm from "../../../components/forms/MultiEmailForm";
import { CallPOSTAPI } from "../../../helper/API";
import MessageHandler from "../../../components/common/MessageHandler";
import ProductModal from "../../../components/modals/ProductModal";
import AccountReps from "../../../components/modals/accountReps";
import SectionHeading from "../../../components/common/SectionHeading";
import SubHeading from "../../../components/header/SubHeading";
import { useNavigate, useParams } from "react-router-dom";
import ContactModalPhone from "../../../components/modals/MainContactModal/ContactModalPhone";
import ContactModalEmail from "../../../components/modals/MainContactModal/ContactModalEmail";
import AddContactPhoneFrom from "../../../components/forms/AddContactPhoneFrom";
import AddContactMultiEmailForm from "../../../components/forms/AddContactMultiEmailForm";
import EditContactMultiEmailForm from "../../../components/forms/EditContactMultiEmailForm";
import { prepareOptions, sortData } from "../../../helper/Common";
import Select from 'react-select'
import StateField from "../../../components/common/states/StatesField";
import ToogleSwitch from "../../../components/common/toggleSwitch/ToogleSwitch";
import Loading from "../../accounts/Loading";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const EditContact = ({ setShowSidebar }) =>
{
    const [loading2, setLoading2] = useState(true)
    const [ mainError, setMainError ] = useState(false);
    const [ ProductModalData, setProductModalData ] = useState([]);
    const [ validated, setValidated ] = useState(false);
    const [formData, setFormData] = useState([]);
    const navigate = useNavigate();
    const [listType,setListType] = React.useState('')
    const [openContactModal,setContactModal] = React.useState(false);
    const [ phoneValidation, setPhoneValidation ] = useState({});
    const user = DecryptToken();
    const [countryList,setCountryList] = React.useState([])
    const [selectedCountry,setSelectedCountry] = React.useState({})


    const resetForm = () =>
    {
        document.getElementById("create-new-account-form").reset();
    };

    const [ multiEmailFormCount, setMultiEmailFormCount ] = useState([
        {
            account_main_contact_email_id: "",
            account_main_contact_email: "",
            email_type_id: "",
            account_main_contact_email_main: 0,
        },
    ]);

    const MultiEmailFormIncrease = () =>
    {
        let arr = [ ...multiEmailFormCount ];
        let obj = {
            account_main_contact_email: "",
            email_type_id: "",
            account_main_contact_email_main: 0,
        };
        arr.push(obj);
        setMultiEmailFormCount(arr);
    };

    const MultiEmailFormDecrease = (index1) =>
    {
        let arr = [ ...multiEmailFormCount ];

        if (index1 >= 0 && multiEmailFormCount.length > 1) {
            if (arr[index1].account_main_contact_email_main !== 1) {
                const updateArr = arr.filter((item, index) => index !== index1);
                setMultiEmailFormCount(updateArr);
            } else {
                toast.error("Main contact cannot be removed");
            }
        }
    };

    const handleInputChange = (e) =>
    {
        if(e.target.type === 'checkbox') {
            setFormData((old) => ({ ...old, [ e.target.name ]: e.target.checked }));
        } else {
            setFormData((old) => ({ ...old, [ e.target.name ]: e.target.value }));
        }
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
    const updatedPhone = (data)=>{
        setAltTrainerForm1(data)
    }
    const [ allDropDowns, setAllDropDowns ] = React.useState([]);
    const [ switchValue, setSwitchValue ] = useState({});
    const { contactId } = useParams()

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
            AllDResult.phoneType = sortData(AllDResult?.phoneType, 'dropdown_phone_type_name');
            setAllDropDowns(AllDResult);
        }
        var data = await GetAccountEditContactList(contactId);
        if (data)
        {
            setFormData(data?.data?.data?.contactDetails)
            setMultiEmailFormCount(data?.data?.data?.email?.length > 0 ? data?.data?.data?.email : [...multiEmailFormCount, ...data?.data?.data?.email])
            setAltTrainerForm1(data?.data?.data?.phone.length > 0 ? data?.data?.data?.phone : [...altTrainerForm1, ...data?.data?.data?.phone])
        }

        // get country
        const countries = await GetCountries();
        if(countries?.status) {
            let countriesData = prepareOptions(countries?.country, 'id', 'country_name')
            setCountryList(countriesData)


            if(data?.data?.data?.contactDetails?.contact_country) {
                const country = countriesData.find(
                    (country) => country.value == parseInt(data?.data?.data?.contactDetails?.contact_country)
                );
                setSelectedCountry((old) => ({ ...old, "contact_country": {
                    "label" : country?.label,
                    "value" : country?.value,
                }}))
                setFormData((old) => ({ ...old, 'contact_country': country.value }));
            } else {
                setFormData((old) => ({ ...old, 'contact_country': countriesData[230].value }));
                setSelectedCountry((old) => ({ ...old, "contact_country": {
                    "label" : countriesData[230].label,
                    "value" : countriesData[230].value,
                }}))
            }
        
        }
        setLoading2(false);
    };

    // handle select change
    const handleSelectChange = (data, key) =>
    {
    setSelectedCountry((old) => ({ ...old, [ key ]: {
        "label" : data.label,
        "value" : data.value,
    }}))

    setFormData((old) => ({ ...old, [ key ]: data.value }));
    };

    const [ FormMsg, setFormMsg ] = React.useState({ type: true, msg: "" });
    const [ loading, setLoading ] = React.useState(false);

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        // check for phone validations
        for (const [key, value] of Object.entries(phoneValidation)) {
            if(value){
                setLoading(false);
                setValidated(true);
                return;
            }
        }

        // setValidated();
        const form = e.currentTarget;
        if (form.checkValidity() === false){
            setLoading(false);
            setValidated(true);
            return;
        }

     
        SaveForm();
    };


    const SaveForm  = async ()=>{
        formData.contact_id = contactId
        let arr = formData;
        arr.training_optout = formData.training_optout ? 1 : 0

        multiEmailFormCount.map((email, index) => {
            if(email.account_main_contact_email_id == '' || email.account_main_contact_email_id == null || email.account_main_contact_email_id == undefined) {
                email.account_main_contact_email_id = "";
            }
            email.account_main_contact_id = contactId;
        })

        altTrainerForm1.map((phone, index) => {
            if(phone.account_main_contact_phone_id == '' || phone.account_main_contact_phone_id == null || phone.account_main_contact_phone_id == undefined) {
                phone.account_main_contact_phone_id = "";
            }
            phone.account_main_contact_id = contactId;
        })

        arr.email = multiEmailFormCount;
        arr.phone = altTrainerForm1;

        if(arr.phone.length > 1) {
            let mainPhone = arr.phone.find((data) => {
                return data.account_main_contact_phone_main == 1
            })
        }

        if(arr.email.length > 1) {
            let mainEmail = arr.email.find((data) => {
                return data.account_main_contact_email_main == 1
            })
        }

        const result = await CallPOSTAPI("account/update-contact-details", arr);
        // setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
        setLoading(false);
        let url = "";
        if(user?.user_type === 0 || (user?.user_type === 2 && user?.sub_admin != "")){
            url = '/account-details/' + formData?.account_id;
        } else {
            url = '/user/Details/' + formData?.account_id;
        }
        navigate(url, {
            state: {
                tab: 'Contacts',
                type: result?.data?.status, 
                msg: result?.data?.msg
            }
        })
    }

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
        {loading2 ?
            <>
              <div className="showloading">
                <Loading />
              </div>
            </>
              :
            <>
            <div className='mt-4' style={ { paddingInline: "45px" } }>
                <SubHeading hideNew hideHierarchy subHeading={true} title="Edit Contact"  />
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
                        <h2 className="text-left heading" >Account Main Contact</h2>
                        <div className="row mb-4 mt-3">
                            <Form.Group className={ "col" }>
                                <Form.Label>Salutation</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="account_main_contact_salutation"
                                    onChange={ handleInputChange }
                                    defaultValue = {formData.account_main_contact_salutation}
                                />
                            </Form.Group>

                            <Form.Group className={ "col" }>
                                <Form.Label>First Name* </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="account_main_contact_firstname"
                                    onChange={ handleInputChange }
                                    defaultValue = {formData.account_main_contact_firstname}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please Enter First Name.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className={ "col" }>
                                <Form.Label>Middle Name </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="account_main_contact_middlename"
                                    onChange={ handleInputChange }
                                    defaultValue = {formData.account_main_contact_middlename}

                                />
                                <Form.Control.Feedback type="invalid">
                                    Please Enter Middle Name.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className={ "col" }>
                                <Form.Label>Last Name*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="account_main_contact_lastname"
                                    onChange={ handleInputChange }
                                    defaultValue = {formData.account_main_contact_lastname}
                                    required
                                />
                                    <Form.Control.Feedback type="invalid">
                                    Please Enter Last Name.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className={ "col" }>
                                <Form.Label>Suffix</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="account_main_contact_suffix"
                                    onChange={ handleInputChange }
                                    defaultValue = {formData.account_main_contact_suffix}

                                />
                            </Form.Group>

                            <Form.Group className={ "col" }>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="account_main_contact_title"
                                    onChange={ handleInputChange }
                                    defaultValue = {formData.account_main_contact_title}
                                />
                            </Form.Group>
                            <Form.Group className={ "col" }>
                                <Form.Label>Department</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="account_main_contact_department"
                                    onChange={ handleInputChange }
                                    defaultValue = {formData.account_main_contact_department}
                                />
                            </Form.Group>

                            <Form.Group className={ "col" }>
                                <Form.Label>Contact Status</Form.Label>

                                <Form.Select
                                    className={ "" }
                                    name="contact_status_id"
                                    onChange={ handleInputChange }
                                    value = {formData.contact_status_id}
                                >
                                    <option value="0" selected >
                                        --Select One--
                                    </option>
                                    { allDropDowns?.contactStatus &&
                                        allDropDowns?.contactStatus.map((CS,index) => (
                                            <option key={index} value={ CS.dropdown_contact_status_id }>
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
                            setPhoneValidation={setPhoneValidation}
                            phoneValidation={phoneValidation}
                        />

                        <EditContactMultiEmailForm
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
                                <Form.Label>Country</Form.Label>
                                <Select
                                    value={selectedCountry?.contact_country}
                                    options={ countryList }
                                    onChange={ (data) => { handleSelectChange(data, 'contact_country') } }
                                />
                            </Form.Group>
                            <Form.Group className={ "col" }>
                                <Form.Label>Address </Form.Label>
                                <Form.Control
                                type="text"
                                name="contact_address1"
                                onChange={ handleInputChange }
                                // required
                                value={formData.contact_address1}
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
                                value={formData.contact_address2}
                                />
                            </Form.Group>

                            <Form.Group className={ "col" }>
                                <Form.Label>City </Form.Label>
                                <Form.Control
                                type="text"
                                name="contact_city"
                                onChange={ handleInputChange }
                                value={formData.contact_city}
                                // required
                                />
                                <Form.Control.Feedback type="invalid">
                                Please Enter City.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className={ "col" }>
                                <Form.Label>State </Form.Label>
                                <StateField setFormData = {setFormData} valueKey="contact_state" selectedCountry={selectedCountry?.contact_country?.value} validated={false} required={true} stateSelectedValue={formData?.contact_state} />
              
                            </Form.Group>

                            <Form.Group className={ "col" }>
                                <Form.Label>Zip code </Form.Label>
                                <Form.Control
                                type="text"
                                name="contact_zipcode"
                                onChange={ handleInputChange }
                                value={formData.contact_zipcode}
                                // required
                                />
                                <Form.Control.Feedback type="invalid">
                                Please Enter Zip Code.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <Form.Group className={'col'}>
                            <b className={'d-block'}>Training OptOut</b>
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
                                    value={true}
                                    name="training_optout"
                                    onChange={ handleInputChange }
                                    checked={ formData.training_optout == 1 || formData.training_optout ? true : false }
                                /> }
                            />
                            </div> */}
                        </Form.Group>
                    </div>

                    {/* message */}
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
                                onClick={()=>{navigate(-1)}}
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
                open={(listType==='phone')?true:false}
                hanldeModal={setContactModal}
                emailDataList={altTrainerForm1}
                phoneDataList={altTrainerForm1}
                dataType={listType}
                setSubFormData={setAltTrainerForm1}
                SaveForm={SaveForm}
                setDataType={setListType}
            />

            <ContactModalEmail
            open={(listType==='email')?true:false}
            hanldeModal={setContactModal}
            emailDataList={multiEmailFormCount}
            phoneDataList={multiEmailFormCount}
            dataType={listType}
            setSubFormData={ setMultiEmailFormCount }
            SaveForm={SaveForm}
            setDataType={setListType}
            />
            </>
         }
        </>
    );
};

export default EditContact;

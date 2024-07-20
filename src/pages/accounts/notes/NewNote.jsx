import React, { useEffect } from 'react'
import SubHeadingOther from '../../../components/header/SubHeadingOther'
import
{
    Form,
    Button as BButton,
    Button as BsButton,
    InputGroup,
} from "react-bootstrap";
import { useState } from 'react';
import Select from 'react-select';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CallGETAPI, CallPOSTAPI } from '../../../helper/API';
import MessageHandler from '../../../components/common/MessageHandler';
import { prepareOptions, relatedToListData } from '../../../helper/Common';

import queryString from 'query-string';
import { toast } from 'react-toastify';
import { DecryptToken } from '../../../helper/BasicFn';


export default function NewNote({is_user=false}) {

    const user = DecryptToken();
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        notes: "",
        related_to: "",
        access: "",
        active: 1
    });
    const [selectedData, setSelectedData] = useState({})
    const [accessToList, setAccessToList] = useState([
        { label: 'Global', value: 'Global' },
        { label: 'Private', value: 'Private' },
        { label: 'Instructor', value: 'Instructor' },
    ])
    const [relatedToList, setRelatedToList] = useState([
        { label: 'Account', value: 'Account' },
        { label: 'Contacts', value: 'Contacts' },
        { label: 'Inperson Class', value: 'Inperson Class' },
        { label: 'Site', value: 'Site' },
    ])
    const [statusList, setStatusList] = useState([
        { label: 'Active', value: '1' },
        { label: 'Inactive', value: '0' }
    ])
    const [ FormMsg, setFormMsg ] = React.useState({ type: true, msg: "" });

    const navigate = useNavigate();
    const { accountId } = useParams();
	const location = useLocation();

    const queryParams = queryString.parse(location.search);
    // handle input change
    const handleInputChange = (e) =>
    {
        setFormData((old) => ({ ...old, [ e.target.name ]: e.target.value }));
    };

    // handle select change
    const handleSelectChange = (data, key) =>
    {
        setSelectedData((old) => ({ ...old, [ key ]: {
        "label" : data.label,
        "value" : data.value,
        }}))
        setFormData((old) => ({ ...old, [ key ]: data.value }));
    };
    const [errorMessage, setErrorMessage] = useState('');
    const handleNotesChange = (e) => {
        const value = e.target.value;
        if (value.length <= 1500) {
          // Update the state only if the character count is less than or equal to 1500
          setFormData((old) => ({ ...old, notes: value }));
          setErrorMessage('');
        } else {
          // Show an error message if the character count exceeds 1500
        //   setFormMsg({ type: false, msg: "Notes cannot exceed 1500 characters." });
        setErrorMessage('Notes cannot exceed 1500 characters.');
    }
      };


    // handle submit
    const handleSubmit = async(e) => {
        e.preventDefault();
// || formData?.related_to !== ''

if(errorMessage){
    return;
}
        if (formData?.access == ''){
            setValidated(true);
        }

        const form = e.currentTarget;
        
        if (form.checkValidity() === false){
            setValidated(true);
            return;
        }

        // save the form data
        saveData();
    }
    const [loading, setLoading] = useState(false);
    const saveData = async(e) => {
        setLoading(true);
        let payLoadData = {
            inperson_id: queryParams?.inperson_id ?? 0,
            account_id: queryParams?.account_id ?? 0,
            aed_id: queryParams?.aed_id ?? 0,
            site_id:queryParams?.site_id ?? 0,
            contact_id:queryParams?.contact_id ?? 0,        
            title: formData?.title ?? '',
            notes: formData?.notes ?? '',
            related_to: formData?.related_to ?? '',
            access: formData?.access ?? '',
            active: formData?.active ?? 1,
        }

        let result = await CallPOSTAPI("notes/save-notes", payLoadData);
        // let result = await CallPOSTAPI("notes/learn-notes", payLoadData);
        setFormMsg({ type: result?.data?.status, msg: result?.data?.message });
        setLoading(false)
        if(result?.data?.status) {
            toast.success('Notes Added Successfully');
            let redirectUrl = "";
            if(user?.user_type == 3){
                redirectUrl = "/user/Notes/" + queryParams?.account_id;
            } else {
                 redirectUrl = '/account-details/' + queryParams?.account_id;
            }
         
            if(queryParams?.account_id && queryParams?.contact_id) {
                if((user?.user_type == 2 && user?.sub_admin == "") || user?.user_type == 3) {
                redirectUrl = '/user/' + queryParams?.account_id + '/contact-details/' + queryParams?.contact_id;
                } else {
                    redirectUrl = '/account/' + queryParams?.account_id + '/contact-details/' + queryParams?.contact_id;
                }
            }

            if(queryParams?.account_id && queryParams?.site_id) {
                if((user?.user_type == 2 && user?.sub_admin == "") || user?.user_type == 3) {
                redirectUrl = '/user/site-details/' + queryParams?.site_id;
                } else {
                    redirectUrl = '/account/site-details/' + queryParams?.site_id;
                }
            }

            if(queryParams?.account_id && queryParams?.inperson_id) {
                redirectUrl = '/account/inperson/details/' + queryParams?.inperson_id;
            }

            if(is_user){
                navigate('/user/account_id/contact-details/'+queryParams?.contact_id, {
                    state: {
                        tab: 'Notes',
                        type: result?.data?.status,
                        msg: result?.data?.msg
                    }
                })
            }else{
                navigate(redirectUrl, {
                    state: {
                        tab: 'Notes',
                        type: result?.data?.status,
                        msg: result?.data?.msg
                    }
                })
            }
        }else{
            toast.error('Something went wrong please try again');
        }
        
    }
    const borderColor = validated && !formData?.access ? 'red' : 'initial';


    return (
        <>
            <div className="mt-4" style={ { width: "100%", paddingInline: "45px" } }>
                <SubHeadingOther hideNew='tab' title={ 'New Note'} newUrl="" subHeading={ true } hideHierarchy={true} bottomLinks={false} />

                {/* main form */}
                <Form
                    className=""
                    onSubmit={ handleSubmit }
                    noValidate
                    validated={ validated }
                    id="create-new-note-form"
                >
                    <div className='containerr'>
                        <div className="" >
                            <div
                                className="container-fluid mt-4 bottom-border-blue pt-2"
                                style={ {
                                    borderBottom: "4px solid rgb(13, 110, 253)",
                                    background: "#eee",
                                } }
                            >
                                <h2 className="heading">General Information</h2>

                                <div className="row my-3">

                                    <Form.Group className={ "col" }>
                                        <Form.Label>Title*</Form.Label>
                                         <Form.Control
                                            type="text"
                                            name="title"
                                            value={ formData?.title }
                                            onChange={ handleInputChange }
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            This field is required
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className={ "col" }>
                                        <Form.Label>Visibility*</Form.Label>
                                        <Select 
                                            type="text"
                                            name="access"
                                            value={selectedData?.access}
                                            options={ accessToList }
                                            onChange={ (data) => { handleSelectChange(data, 'access'); } }
                                            required
                                            style={{ borderColor }} 
                                        />
                                          {validated && !formData?.access && (
                                           <p className='invalid'>Visibility is required</p>
                                           )}
                                    </Form.Group>

                                    {/* <Form.Group className={ "col" }>
                                        <Form.Label>Related to</Form.Label>
                                        <Select
                                            value={selectedData?.related_to}
                                            options={ relatedToList }
                                            onChange={ (data) => { handleSelectChange(data, 'related_to') } }
                                        />
                                        {validated && formData?.related_to == '' && (<>
                                            <p className='invalid'>This field is required</p>
                                        </>)}
                                    </Form.Group> */}

                                    {/* <Form.Group className={ "col" }>
                                        <Form.Label>Status</Form.Label>
                                        <Select
                                            value={selectedData?.active}
                                            options={ statusList }
                                            onChange={ (data) => { handleSelectChange(data, 'active') } }
                                        />
                                    </Form.Group> */}
                                </div>

                                <div className="row ">
                                    <Form.Group className={ "col" }>
                                        <Form.Label>Notes*</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="notes"
                                            value={ formData?.notes }
                                            onChange={handleNotesChange}
                                            required
                                            rows={7}
                                        />
    {errorMessage?(<div className="error-message" style={{color:"#dc3545",fontWeight:".875em"}}>{errorMessage}</div>):(
						  
                                        <Form.Control.Feedback type="invalid">
                                            This field is required
                                        </Form.Control.Feedback>)}
                                    </Form.Group>
                                </div>

                                {/* message */}
                                <div className="my-5">
                                    <MessageHandler
                                        status={ FormMsg.type }
                                        msg={ FormMsg.msg }
                                        HandleMessage={ setFormMsg }
                                    />
                                </div>

                                {/* bottom buttons */ }
                                <div className="row pb-3" >
                                    <div className="col-12 content-flex-right" >
                                        <button className="btn btn-danger text-uppercase" type="button" onClick={()=>{navigate(-1)}}>Cancel</button>
                                        <button className="btn btn-success text-uppercase ms-2" type="submit" disabled={loading} >{loading?'Loading...':'Submit'}</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </>
    )
}

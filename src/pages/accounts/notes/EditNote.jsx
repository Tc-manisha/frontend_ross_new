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
import Loading from "../../accounts/Loading";
import { DecryptToken } from '../../../helper/BasicFn';

export default function EditNote() {
    const [loading2, setLoading2] = useState(true)
    const [validated, setValidated] = useState(false);
    const [loading,setLoading]      = useState(false);
    const user = DecryptToken();
    const [formData, setFormData]   = useState({
        title: "",
        notes: "",
        related_to: "",
        access: "",
        active: 1,
        account_id: "",
        site_id: "",
        contact_id: "",
    });
    const [selectedData, setSelectedData] = useState({})
    const [accessList, setAccessList] = useState([
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
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 }
    ])
    const [ FormMsg, setFormMsg ] = React.useState({ type: true, msg: "" });

    const navigate = useNavigate();
    const { noteId } = useParams();
	const location = useLocation();
    const [errorMessage, setErrorMessage] = useState('');

    // handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((old) => ({ ...old, [name]: value }));
      
        if (name === 'notes' && value.length > 1500) {
          setErrorMessage('Notes cannot exceed 1500 characters.');
        } else {
          setErrorMessage('');
        }
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

    // filter array with array key and value
    const filterArray = (arr, value) => {
        const filteredData = arr.find((item) => {
            return item.value == value
        })
        return filteredData;
    }

    // fetch on load
    const fetchOnLoad = async() => {

        // get support data
        const result = await CallGETAPI("notes/fetch_notes_details/" + noteId);
console.log({result});
        if(result?.status) {
            let noteDetails = result?.data?.data;
            setFormData(noteDetails);

            if(noteDetails?.related_to) {
                let filteredRelatedTo = filterArray(relatedToList,  noteDetails?.related_to);
                setSelectedData((old) => ({...old, ['related_to'] : filteredRelatedTo}));
            }

            if(noteDetails?.access) {
                let filteredAccess = filterArray(accessList,  noteDetails?.access);
                setSelectedData((old) => ({...old, ['access'] : filteredAccess}));
            }

            if(noteDetails?.active == 1 || noteDetails?.active == 0) {
                let filteredActive = filterArray(statusList,  noteDetails?.active);
                setSelectedData((old) => ({...old, ['active'] : filteredActive}));
            }
        }
        setLoading2(false);
    }

    useEffect(() => {
        fetchOnLoad();
    }, [])


    // handle submit
    const handleSubmit = async(e) => {
        e.preventDefault();

        if (errorMessage) {
            // Prevent form submission when there is an error
            return;
          }

        if(formData?.access == ''){
            setLoading(false);
            setValidated(true);
            return;
        }

        const form = e.currentTarget;
        
        if (form.checkValidity() === false){
            setLoading(false);
            setValidated(true);
            return;
        }

        // save the form data
        saveData();
    }

    const saveData = async(e) => {
        let payLoadData = {
            title: formData?.title ?? '',
            notes: formData?.notes ?? '',
            related_to: formData?.related_to ?? '',
            access: formData?.access ?? '',
            active: formData?.active ?? 1,
        }

        let result = await CallPOSTAPI("notes/update_notes/" + noteId, payLoadData);
        setFormMsg({ type: result?.data?.status, msg: result?.data?.message });
        
        if(result?.status) {
            let redirectUrl;
            if(user?.user_type === 0 || (user?.user_type === 2 && user?.sub_admin != "")){
             redirectUrl = '/account-details/' + formData?.account_id;
            } else {
             redirectUrl = '/user/Details/' + formData?.account_id;
            }

            if(formData?.account_id && formData?.contact_id) {
                if(user?.user_type === 0 || (user?.user_type === 2 && user?.sub_admin != "")){
                redirectUrl = '/account/' + formData?.account_id + '/contact-details/' + formData?.contact_id;
             } else {
                redirectUrl = '/user/' + formData?.account_id + '/contact-details/' + formData?.contact_id;
             }}

            if(formData?.account_id && formData?.site_id) {
                if(user?.user_type === 0 || (user?.user_type === 2 && user?.sub_admin != "")){
                redirectUrl = '/account/site-details/' + formData?.site_id;
            } else {
                redirectUrl = '/user/site-details/' + formData?.site_id;
           }
        }

            navigate(redirectUrl, {
                state: {
                  tab: 'Notes',
                  type: result?.data?.status,
                  msg: result?.data?.msg
                }
            });
        }        
    }

    return (
        <>
        {loading2 ?
            <>
              <div className="showloading">
                <Loading />
              </div>
            </>
              :
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
                                        <Form.Label>Visibility</Form.Label>
                                        <Select
                                            value={selectedData?.access}
                                            options={ accessList }
                                            required
                                            onChange={ (data) => { handleSelectChange(data, 'access'); } }
                                        />
                                        {validated && formData?.access == '' && (<>
                                            <p className='invalid'>This field is required</p>
                                        </>)}
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
                                    </Form.Group>

                                    <Form.Group className={ "col" }>
                                        <Form.Label>Status</Form.Label>
                                        <Select
                                            value={selectedData?.active}
                                            options={ statusList }
                                            onChange={ (data) => { handleSelectChange(data, 'active') } }
                                        />
                                    </Form.Group> */}
                                </div>

                                <div className="row " >
                                    <Form.Group className={ "col" }>
                                        <Form.Label>Notes*</Form.Label>
                                        <Form.Control 
                                            as="textarea"
                                            name="notes"
                                            value={ formData?.notes }
                                            onChange={ handleInputChange }
                                            required
                                            rows={7}
                                            isInvalid={errorMessage !== ''}
                                       />

<Form.Control.Feedback type="invalid">
    {errorMessage || 'This field is required'}
  </Form.Control.Feedback>
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
                                        <button className="btn btn-success text-uppercase ms-2" type="submit" disabled={loading}>
                                            {loading ? 'Loading...' : 'Submit'}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        }
        </>
    )
}

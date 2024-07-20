import React from 'react'
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
import { useNavigate, useParams } from 'react-router-dom';
import { CallGETAPI, CallPOSTAPI } from '../../../helper/API';
import MessageHandler from '../../../components/common/MessageHandler';
import { useEffect } from 'react';
import { prepareOptions, relatedToListData } from '../../../helper/Common';

export default function EditSupport() {

    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        account_id: "",
        contact_id: "",
        issue_type: "",
        assign_to: "",
        related_to: "",
        relation: "",
        due_date: "",
        issue: ""
    });
    const [selectedData, setSelectedData] = useState({})
    const [relatedToList, setRelatedToList] = useState(relatedToListData);
    const [issueTypeList, setIssueTypeList] = useState([
        { label: 'Issue 1', value: '1' },
        { label: 'Issue 2', value: '2' },
        { label: 'Issue 3', value: '3' },
    ]);
    const [assignedToList, setAssignedToList] = useState([ ]);
    const [ FormMsg, setFormMsg ] = React.useState({ type: true, msg: "" });

    const navigate = useNavigate();
    const { supportId } = useParams();

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


    // handle submit
    const handleSubmit = async(e) => {
        e.preventDefault();

        if (formData?.issue_type == '' || formData?.assign_to !== '')
        {
            setValidated(true);
        }

        const form = e.currentTarget;
        
        if (form.checkValidity() === false)
        {
            setValidated(true);
            return;
        }

        // save the form data
        saveData();
    }

    const saveData = async(e) => {
        let payLoadData = {
            account_id: formData.account_id,
            contact_id: "",
            issue_type: formData?.issue_type ?? 1,
            assign_to: formData?.assign_to ?? 1,
            related_to: formData?.related_to ?? 1,
            relation: formData?.relation ?? 1,
            due_date: formData?.due_date ?? '',
            issue: formData?.issue ?? '',
            owner_name: formData?.owner_name ?? '',
            status: 1,
        }

        let result = await CallPOSTAPI("support/update-ticket/" + supportId, payLoadData);
        setFormMsg({ type: result?.data?.status, msg: result?.data?.msg });
        
        if(result?.status) {
            navigate('/account/support/' + supportId)
        }
    }

    // filter array with array key and value
    const filterArray = (arr, value) => {
        const filteredData = arr.find((item) => {
            return item.value == value
        })
        return filteredData;
    }

    // get support data
    const fetchOnLoad = async() => {

        // get support data
        const result = await CallGETAPI("support/ticket-details/" + supportId);

        if(result?.status) {
            let ticketDetails = result?.data?.ticketDetails;
            setFormData(ticketDetails);

            const issueTypeResult = await CallGETAPI('support/all-issues-type');

            if(issueTypeResult?.status) {
                const issueTypes = issueTypeResult?.data?.issuesList
                const allIssueTypes = prepareOptions(issueTypes, 'issue_id', 'issue_name')
                setIssueTypeList(allIssueTypes);

                if(ticketDetails?.issue_type) {
                    let filteredIssueType = filterArray(allIssueTypes,  ticketDetails?.issue_type);
                    setSelectedData((old) => ({...old, ['issue_type'] : filteredIssueType}));
                }
            }

            if(ticketDetails?.related_to) {
                let filteredIssueType = filterArray(relatedToList,  ticketDetails?.related_to);
                setSelectedData((old) => ({...old, ['related_to'] : filteredIssueType}));
            }
        }
    }

    useEffect(() => {
        fetchOnLoad();
    }, [])

    // prepare owner name data
    const prepareOwnerName = (data) => {
        setFormData((old) => ({...old, ['owner_name']: data?.label}))
    }

    // prepare owner name data
    const fetchAssignToList = async(issueId) => {
        const result = await CallGETAPI('support/assign-by-issues/' + issueId);
        
        if(result?.status) {
            const assignToList = result?.data?.contactList
            assignToList.map((contact) => {
                contact.owner_name = contact?.account_main_contact_firstname + ' ' + contact.account_main_contact_lastname
            })
            const allAssignToList = prepareOptions(assignToList, 'account_main_contact_id', 'owner_name')
            setAssignedToList(allAssignToList);
            setSelectedData((old) => ({...old, ['assign_to']: allAssignToList[0] }))
        }
    }

    return (
        <>
            <div className="mt-4" style={ { width: "100%", paddingInline: "45px" } }>
                <SubHeadingOther hideNew='tab' title={ 'New Support Ticket'} newUrl="" subHeading={ true } hideHierarchy={true} bottomLinks={false} />

                {/* main form */}
                <Form
                    className=""
                    onSubmit={ handleSubmit }
                    noValidate
                    validated={ validated }
                    id="create-edit-support-form"
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
                                        <Form.Label>Issue Type*</Form.Label>
                                        <Select
                                            value={selectedData?.issue_type}
                                            options={ issueTypeList }
                                            onChange={ (data) => { handleSelectChange(data, 'issue_type'); fetchAssignToList(data?.value) } }
                                        />
                                        {validated && formData?.issue_type == '' && (<>
                                            <p className='invalid'>This field is required</p>
                                        </>)}
                                    </Form.Group>

                                    <Form.Group className={ "col" }>
                                        <Form.Label>Assigned to*</Form.Label>
                                        <Select
                                            value={selectedData?.assign_to}
                                            options={ assignedToList }
                                            onChange={ (data) => { handleSelectChange(data, 'assign_to'); prepareOwnerName(data) } }
                                        />
                                        {validated && formData?.assign_to == '' && (<>
                                            <p className='invalid'>This field is required</p>
                                        </>)}
                                    </Form.Group>

                                    <Form.Group className={ "col" }>
                                        <Form.Label>Related to</Form.Label>
                                        <Select
                                            value={selectedData?.related_to}
                                            options={ relatedToList }
                                            onChange={ (data) => { handleSelectChange(data, 'related_to') } }
                                        />
                                    </Form.Group>

                                    <Form.Group className={ "col" }>
                                        <Form.Label>Relation</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="relation"
                                            value={ formData?.relation }
                                            onChange={ handleInputChange }
                                        />
                                    </Form.Group>

                                    <Form.Group className={ "col" }>
                                        <Form.Label>Due Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="due_date"
                                            value={ formData?.due_date }
                                            onChange={ handleInputChange }
                                        />
                                    </Form.Group>
                                </div>

                                <div className="row my-4">
                                    <Form.Group className={ "col" }>
                                        <Form.Label>Issue*</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="issue"
                                            value={ formData?.issue }
                                            onChange={ handleInputChange }
                                            required
                                            rows={5}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                            This field is required
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
                                        <button className="btn btn-success text-uppercase ms-2" type="submit">Submit</button>
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

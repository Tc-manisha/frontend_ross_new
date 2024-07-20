import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import SingleEuipContact from './SingleEuipContact';

const AddContactsmodalNew = ({addContactsModal, setAddContactsModal, accountId,accountContact,selectedContact,setSelectedContacts }) =>{
    const handleClose = () => setAddContactsModal(false);
    const [ loading, setLoading ] = React.useState(false);
    const defaultObj = {        contract_officer:[],
        contracting_officer_rep:[],
        other_reps:[],
    }
    const [ handleContactSelectList, setHandleContactSelectList ] = React.useState([]);
    const [contactsList, setContactsList] = useState(accountContact || []);
   
    const [LocalContact,setLocalContacts] = useState(defaultObj);
    const [removeList,setremoveList] = useState(defaultObj);
    useEffect(()=>{
        console.log({removeList});
    },[removeList])
    const btns = (type, contactType) =>
    {
        return <>
            <div className='d-flex align-items-center' style={{height: '40px'}} >
                <span onClick={(e) => {handleAddContact(type, contactType)}} className="select-btn" >+</span>
                <span onClick={(e) => {handleRemoveContact(type, contactType)}} className="elemenate-btn" >-</span>
            </div>
        </>
    }

    
    // const [selectedList,]
    // set primary or backup contact data
    const handleAddContact = (type, contactType) => {
        const assingContact = {...LocalContact}
        if(handleContactSelectList && handleContactSelectList.length > 0){
            const uniqueArray = {...assingContact};
            assingContact[contactType] = (assingContact[contactType].length > 0) ? [...assingContact[contactType],...handleContactSelectList] : handleContactSelectList;
            for(let i = 0; i < assingContact[contactType].length; i++){
                const ep    = assingContact[contactType][i];
                const check = uniqueArray[contactType].find(it=>it.contact_id === ep.contact_id);
                if(!check?.contact_id){
                    uniqueArray[contactType].push(ep);
                }
            }
            setHandleContactSelectList([]);
            setLocalContacts(uniqueArray);
        }
    }

    // remove primary or backup contact data
    const handleRemoveContact = (type, contactType) => {
        const assingContact = {...LocalContact}
        console.log({removeList});
        if(handleContactSelectList && removeList[contactType].length > 0){
            const arr = {...assingContact};
            arr[contactType] =  assingContact[contactType].filter(it=>{
                const ch2 = removeList[contactType].includes((it.contact_id).toString())
                console.log({ch2});
                return !ch2;
            });  
            console.log({arr});
            setLocalContacts(arr);
            console.log({defaultObj});
            setremoveList(defaultObj);
        }
    }

    // handle select contact checked
    const handleSelectContact = (isChecked,data) => {
        if(isChecked){
            setHandleContactSelectList(oldArray => [...oldArray,{
                    contact_id: data?.contact_id,
                    contact_name: data?.contact_name,
                }]);

            // setHandleContactSelectList((prev)=>[prev,...[{
            //     contact_id: data?.contact_id,
            //     contact_name: data?.contact_name,
            // }]])
        }else{
            const arr = handleContactSelectList.filter((it)=>it.contact_id===data?.contact_id)
            setHandleContactSelectList(arr);
            // setHandleContactSelectList({
            //     contact_id: '',
            //     contact_name: '',
            // })
        }
    }

    // inperson class contact
    const handleInpersonClassSubmit = async () =>
    {
        let data = {
            account_id: accountId
        }
        data.account_contact = []
        setSelectedContacts(LocalContact);
        setLoading(false);
        handleClose()
    }

    useEffect(()=>{
        // if(selectedContact?.contract_officer?.contact_name){
            setLocalContacts(selectedContact);
        // }
    },[addContactsModal])


    const handleRemoveCheck  = (e,type)=>{
        if(e.target.checked){
            const ar = {...removeList};
            ar[type].push(e.target.value);
            setremoveList(ar);
        }else{
            const ar = {...removeList}//removeList[type].filter(it=>it===e.target.value);
            ar[type] = ar[type].filter(it=>it!==e.target.value);
            setremoveList(ar);
        }
    }
    return (
        <>
            <Modal show={ addContactsModal } onHide={ handleClose }
                dialogClassName="inperson-modal"
                aria-labelledby="example-custom-modal-styling-title"
                size="xl"
                id="product-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Account Contacts</Modal.Title>
                </Modal.Header>
                <Modal.Body >

                    <div className="modal-container" id="contact-modal-content"  >
                        <div className="my-modal-section">
                            <div className="upper-div">
                                <div className="products" style={ { maxHeight: '400px', overflowY: 'auto' } }>
                                    <ul>
                                        <li className='title'> Contacts</li>
                                        { contactsList.map((single, index) => (
                                            <li key={ index } 
                                            // onClick={ (e) => handleSelectContact(single) }
                                             className={handleContactSelectList?.contact_id == single.contact_id ? 'bg-primary text-white' : ''}>
                                                <label htmlFor={ 'contact_id_' + single.contact_id } className="checkbox" 
                                                // onClick={ (e) => handleSelectContact(single) }
                                                >
                                                    <input type='Checkbox'
                                                        name="contact_id"
                                                        className=''
                                                        onChange={ (e) => handleSelectContact(e.target.checked,single) }
                                                        // onClick={ (e) => handleSelectContact(single) }
                                                        value={ single.contact_id }
                                                        id={ 'contact_id_' + single.contact_id }
                                                        checked={
                                                            handleContactSelectList.find((it)=>it.contact_id===single?.contact_id)
                                                            // handleContactSelectList?.contact_id == single?.contact_id ? true : false 
                                                        }
                                                    />
                                                    <span>{ single.contact_name }</span>
                                                </label>
                                            </li>
                                        )) }
                                    </ul>
                                </div>

                                <div className="selected-products">
                                    <ul>
                                        <li className='title'>Assigned Contacts</li>
                                        {/* billing contact */}
                                        <li>
                                            <b className="d-flex align-items-center ">Contracting Officer {btns('primary', 'contract_officer')}</b>
                                            <div className='d-flex my-1' >
                                                <div className=' d-flex align-items-center'>
                                                    <div className='d-flex w-200' >
                                                    <span className=" light-head">
                                                        
                                                        {LocalContact?.contract_officer?.map((it,inx)=>(
                                                           <SingleEuipContact
                                                           inx={inx}
                                                           it={it} removeList={removeList}
                                                           handleRemoveCheck={handleRemoveCheck}
                                                           name={'contract_officer'}
                                                           checked={removeList.contract_officer.find((it2)=>parseInt(it2)===it?.contact_id) ? true : false}
                                                           />
                                                        ))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                        </li>
                                        {/* instructor contact */}
                                        <li>
                                            <b className="d-flex align-items-center ">Contracting Officer Rep { btns('primary', 'contracting_officer_rep') }</b>

                                            <div className='d-flex my-1' >
                                                <div className=' d-flex align-items-center'>
                                                    <div className='d-flex w-200' >
                                                    <span className=" light-head">
                                                        {LocalContact?.contracting_officer_rep?.map((it,inx)=>(
                                                           <SingleEuipContact
                                                           inx={inx}
                                                           it={it} removeList={removeList}
                                                           handleRemoveCheck={handleRemoveCheck}
                                                           name={'contracting_officer_rep'}
                                                           checked={removeList.contracting_officer_rep.find((it2)=>parseInt(it2)===it?.contact_id) ? true : false}
                                                           />
                                                        ))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        {/* training_site_cordinator contact */}
                                        <li>
                                            <b className="d-flex align-items-center "> Other Rep { btns('primary', 'other_reps') }</b>
                                            <div className='d-flex my-1' >
                                                <div className=' d-flex align-items-center'>
                                                    <div className='d-flex w-200' >
                                                    <span className=" light-head">
                                                        {LocalContact?.other_reps?.map((it,inx)=>(
                                                          <SingleEuipContact
                                                          inx={inx}
                                                          it={it} removeList={removeList}
                                                          handleRemoveCheck={handleRemoveCheck}
                                                          name={'other_reps'}
                                                          checked={removeList.other_reps.find((it2)=>parseInt(it2)===it?.contact_id) ? true : false}
                                                          />
                                                        ))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </Modal.Body>

                {/* alert */ }
                {/* <div className="my-4">
                    <MessageHandler
                        status={ FormMsg.type }
                        msg={ FormMsg.msg }
                        HandleMessage={ setFormMsg }
                    />
                </div> */}

                <Modal.Footer>
                    <button className="Cancel-btn" onClick={ handleClose }>
                        Cancel
                    </button>
                    <button className="submit-btn" type="button" onClick={ handleInpersonClassSubmit }>
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default AddContactsmodalNew;

import React, { useEffect, useState } from 'react'
import './statesModal.scss';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const items = [
    { projectId: 1, title: 'Demo Project 1' },
    { projectId: 2, title: 'Demo Project 2' },
    { projectId: 3, title: 'Demo Project 3' },
]
const StatesModal = ({ ShowStatesModal, setShowStatesModal, StatesModalData, SelectedStatesData, setSelectedStatedData, resultData }) =>
{

    const [ StateList, setStateList ] = useState(items);
    const [ selectedList, setSelectedList ] = useState([]);
    const [ HandleCheck, setHandleCheck ] = useState([]);
    const [ HandleUnCheck, setHandleUnCheck ] = useState([]);
    const [ ManageStateList, setManageStateList ] = useState([]);
    const [ checkedList, setCheckedList ] = useState([]);

    useEffect(() =>
    {
        let arr = [];
        let data = (SelectedStatesData) ? SelectedStatesData.split(",") : '';
       
        for (let index = 0; index < StatesModalData.length; index++)
        {
            const element = StatesModalData[ index ];
            let obj = { ...element, is_selected: false };
            if (data.includes(element.state_id.toString()))
            {
                obj.is_selected = true;
            }
            arr.push(obj);
        }
        setManageStateList(arr);
    }, [ StatesModalData, SelectedStatesData, ShowStatesModal ])

    const handleClose = () => setShowStatesModal(false);

    // HandleCheck,setHandleCheck
    const handleCheckClick = (e) =>
    {
        let checkboxVal = e.target.value;
        let isChecked = e.target.checked;
        let checkedList = HandleCheck;
        let isAlreadyAvaiale = 0;

        if (isChecked)
        {
            if (checkedList.includes(checkboxVal))
            {
                isAlreadyAvaiale = 1;
            }
            if (!isAlreadyAvaiale)
            {
                checkedList.push(checkboxVal);
                setHandleCheck(checkedList);
            }
        } else
        {
            let finalArr = [];
            for (let i = 0; i < checkedList.length; i++)
            {
                let ele = checkedList[ i ];
            
                if (checkboxVal !== ele)
                {
                    finalArr.push(ele)
                }
            }
            setHandleCheck(finalArr);
        }

    }

    const handleAdd = () =>
    {
       
        let arr = [];
        // setManageStateList
        for (let index = 0; index < ManageStateList.length; index++)
        {
            const element = ManageStateList[ index ];
            let obj = element;
            HandleCheck.forEach((single) =>
            {
                if (parseInt(single) === element.state_id)
                {
                    // arr.push(element);
                    obj.is_selected = true;
                }
            })

            arr.push(obj)
        }
        setManageStateList(arr)
        setHandleCheck([]);
    }

    // HandleUnCheck,setHandleUnCheck
    const handleRemove = () =>
    {
        let arr = [];
        // setManageStateList
        for (let index = 0; index < ManageStateList.length; index++)
        {
            const element = ManageStateList[ index ];
            let obj = element;
            HandleUnCheck.forEach((single) =>
            {
                if (parseInt(single) === element.state_id)
                {
                    obj.is_selected = false;
                }
            });
            arr.push(obj)
        }
        setManageStateList(arr)
        setHandleCheck([]);
        setHandleUnCheck([]);

    }
    const handleUnCheckClick = (e) =>
    {
        let checkboxVal = e.target.value;
        let isChecked = e.target.checked;
        let checkedList = HandleUnCheck;
        let isAlreadyAvaiale = 0;

        if (isChecked)
        {
            if (checkedList.includes(checkboxVal))
            {
                isAlreadyAvaiale = 1;
            }
            if (!isAlreadyAvaiale)
            {
                checkedList.push(checkboxVal);
                setHandleCheck(checkedList);
            }
        } else
        {
            let finalArr = [];
            for (let i = 0; i < checkedList.length; i++)
            {
                let ele = checkedList[ i ];
                if (checkboxVal !== ele)
                {
                    finalArr.push(ele)
                }
            }

            setHandleUnCheck(finalArr);
        }

    }


    const handleSubmit = () =>
    {
        let arr = '';
        for (let index = 0; index < ManageStateList.length; index++)
        {
            const element = ManageStateList[ index ];
            if (element.is_selected)
            {
                arr += element.state_id + ',';
            }
        }
        setSelectedStatedData(arr)
        handleClose();
    }

    return (
        <>

            <Modal show={ ShowStatesModal } onHide={ handleClose }
                dialogClassName="modal-120w"
                aria-labelledby="example-custom-modal-styling-title"
                size="lg"
                id="states-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>State Selection</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <div className="modal-container"  >
                        <div className="my-modal-section">
                            <div className="upper-div">
                                <div className="products" style={ { maxHeight: '400px', overflowY: 'auto' } }>
                                    <ul>
                                        <li className='title'>State / Areas</li>
                                        {
                                            ManageStateList.map((item, index) =>
                                            {
                                                return <div key={ index }>
                                                    { (!item.is_selected) && <li key={ item.state_id }
                                                        className="checkbox">
                                                        <label htmlFor={ 'insert_id_' + item.state_id }  >
                                                            <input type="checkbox" id={ 'insert_id_' + item.state_id }
                                                                value={ item.state_id }
                                                                onChange={ (e) => handleCheckClick(e) }
                                                            />
                                                            { item.state_name }
                                                        </label>

                                                    </li> }
                                                </div>
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className="btns">
                                    <button className="select-btn" onClick={ handleAdd }>+</button>
                                    <button className="elemenate-btn" onClick={ handleRemove }>-</button>
                                </div>
                                <div className="selected-products">
                                    <ul>
                                        <li className='title'>State / Areas</li>
                                        { ManageStateList.map((item, index) =>
                                        {

                                            return <div key={ index }>
                                                { item.is_selected && <li key={ item.state_id } className="" >
                                                    <label htmlFor={ 'set_insert_id_' + item.state_id }  >
                                                        <input type="checkbox" id={ 'set_insert_id_' + item.state_id }
                                                            value={ item.state_id }
                                                            onChange={ (e) => handleUnCheckClick(e) }
                                                        />
                                                        { item.state_name }
                                                    </label>
                                                </li>
                                                }
                                            </div>

                                        }) }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="Cancel-btn" onClick={ handleClose }>
                        Cancel
                    </button>
                    <button className="submit-btn" type="button" onClick={ handleSubmit }>
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>




        </>
    )
}


export default StatesModal;

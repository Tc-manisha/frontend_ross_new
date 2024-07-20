import React, { useEffect, useState } from 'react'
import './productModal.scss';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { sortData } from '../../../helper/Common';

const items = [
    { projectId: 1, title: 'Demo Project 1' },
    { projectId: 2, title: 'Demo Project 2' },
    { projectId: 3, title: 'Demo Project 3' },
]
const ProductModal = ({ ProductShowModal, setProductShowModal, ProductModalData, setProductModalData, SelectedProductsData, setSelectedProductData, resultData }) => {

    const [productList, setProductList] = useState(items);
    const [selectedList, setSelectedList] = useState([]);
    const [currentProductItem, setCurrentProductItem] = useState();
    const [HandleCheck, setHandleCheck] = useState([]);
    const [HandleUnCheck, setHandleUnCheck] = useState([]);
    const [ManageProductList, setManageProductList] = useState([]);
    const [checkedList, setCheckedList] = useState([]);

    useEffect(() => {
        let arr = [];
        let data = (resultData?.product_interest) ? resultData?.product_interest.split(",") : '';
        
        for (let index = 0; index < ProductModalData.length; index++) {
            const element = ProductModalData[index];

            let obj = {};
            if (typeof element.is_selected === 'undefined') {
                obj = { ...element, is_selected: false };
                if (data.includes(element.dropdown_product_interest_id.toString())) {
                    obj.is_selected = true;
                }                
            } else {
                obj = { ...element};
            }
            arr.push(obj);
        }

        let sortedArray = sortData(arr, 'dropdown_product_interest_name');
        setManageProductList(sortedArray);

    }, [ProductModalData, resultData?.product_interest, ProductShowModal])

    // useEffect(()=>{
    //     if(resultData?.product_interest && ManageProductList.length){
    //         let data = resultData?.product_interest.split(",")
    //         ManageProductList.map((item,i)=>{
    //             if(data.includes(item.dropdown_product_interest_id.toString())){
    //                 ManageProductList[i].is_selected = true
    //             }
    //         })
    //         setManageProductList(ManageProductList)
    //     }
    // },[resultData])

    const onProductClick = (e, key) => {
        const item = productList.find((item) => item.dropdown_product_interest_id === key)
        setCurrentProductItem(item);
    }

    const onSelectedProductClick = (e, key) => {
        const item = selectedList.find((item) => item.dropdown_product_interest_id === key)
        setCurrentProductItem(item);
    }

    const selectBtnHandle = () => {

        setSelectedList(prevList => {
            return [
                ...prevList,
                currentProductItem
            ]
        }
        )
        setProductList(prevList =>
            prevList.filter((item) => item.dropdown_product_interest_id !== currentProductItem.dropdown_product_interest_id)
        )

    }

    const elemenateBtnHandle = () => {
        setProductList(prevList => {

            return [
                ...prevList,
                currentProductItem
            ]
        }
        )
        setSelectedList(prevList =>
            prevList.filter((item) => item.dropdown_product_interest_id !== currentProductItem.dropdown_product_interest_id)

        )

    }
    // const [showModal, setShowModal] = useState(false);

    const handleClose = () => setProductShowModal(false);
    const handleShow = () => setProductShowModal(true);

    // HandleCheck,setHandleCheck
    const handleCheckClick = (e) => {
        let checkboxVal = e.target.value;
        let isChecked = e.target.checked;
        let checkedList = HandleCheck;
        let isAlreadyAvaiale = 0;

        if (isChecked) {
            if (checkedList.includes(checkboxVal)) {
                isAlreadyAvaiale = 1;
            }
            if (!isAlreadyAvaiale) {
                checkedList.push(checkboxVal);
                setHandleCheck(checkedList);
            }
        } else {
            let finalArr = [];
            for (let i = 0; i < checkedList.length; i++) {
                let ele = checkedList[i];
                if (checkboxVal !== ele) {
                    finalArr.push(ele)
                }
            }
            setHandleCheck(finalArr);
        }

    }

    const handleAdd = () => {

        let arr = [];
        // setManageProductList
        for (let index = 0; index < ManageProductList.length; index++) {
            const element = ManageProductList[index];
            let obj = element;
            HandleCheck.forEach((single) => {
                if (parseInt(single) === element.dropdown_product_interest_id) {
                    // arr.push(element);
                    obj.is_selected = true;
                }
            })

            arr.push(obj)
            // if(HandleCheck.indexOf(element.dropdown_product_interest_id) !== -1 ){
            // }
        }
        setManageProductList(arr);
        setHandleCheck([]);
    }

    // HandleUnCheck,setHandleUnCheck
    const handleRemove = () => {
        let arr = [];
        // setManageProductList
        for (let index = 0; index < ManageProductList.length; index++) {
            const element = ManageProductList[index];
            let obj = element;
            HandleUnCheck.forEach((single) => {
                if (parseInt(single) === element.dropdown_product_interest_id) {
                    obj.is_selected = false;
                }
            });
            arr.push(obj)
        }
        setManageProductList(arr)
        setHandleCheck([]);
        setHandleUnCheck([]);

    }

    const handleUnCheckClick = (e) => {
        let checkboxVal = e.target.value;
        let isChecked = e.target.checked;
        let checkedList = HandleUnCheck;
        let isAlreadyAvaiale = 0;

        if (isChecked) {
            if (checkedList.includes(checkboxVal)) {
                isAlreadyAvaiale = 1;
            }
            if (!isAlreadyAvaiale) {
                checkedList.push(checkboxVal);
                setHandleCheck(checkedList);
            }
        } else {
            let finalArr = [];
            for (let i = 0; i < checkedList.length; i++) {
                let ele = checkedList[i];
                if (checkboxVal !== ele) {
                    finalArr.push(ele)
                }
            }

            setHandleUnCheck(finalArr);
        }

    }

    const handleSubmit = () => {
        let arr = '';
        for (let index = 0; index < ManageProductList.length; index++) {
            const element = ManageProductList[index];
            if (element.is_selected) {
                arr += element.dropdown_product_interest_id + ',';
            }
        }
        setSelectedProductData(arr)
        setProductModalData(ManageProductList);
        handleClose();
    }

    return (
        <>
            <Modal show={ProductShowModal} onHide={handleClose}
                dialogClassName="modal-120w"
                aria-labelledby="example-custom-modal-styling-title"
                size="lg"
                id="product-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Products Intrests</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="modal-container"  >
                        <div className="my-modal-section">
                            <div className="upper-div">
                                <div className="products" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    <ul>
                                        {/* onClick={(e) => onProductClick(e, item.dropdown_product_interest_id)} */}
                                        <li className='title'>Products</li>
                                        {
                                            ManageProductList.map((item, index) => {
                                                return <div key={index}>
                                                    {(!item.is_selected) && <li key={item.dropdown_product_interest_id} className="checkbox">
                                                        <label htmlFor={'insert_id_' + item.dropdown_product_interest_id}  >
                                                            <input type="checkbox" id={'insert_id_' + item.dropdown_product_interest_id}
                                                                value={item.dropdown_product_interest_id}
                                                                onChange={(e) => handleCheckClick(e)}
                                                            />
                                                            {item.dropdown_product_interest_name}
                                                        </label>
                                                    </li>}
                                                </div>
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className="btns">
                                    <button className="select-btn" onClick={handleAdd}>+</button>
                                    <button className="elemenate-btn" onClick={handleRemove}>-</button>
                                </div>
                                <div className="selected-products">
                                    <ul>
                                        {/* onClick={(e) => onSelectedProductClick(e, item.dropdown_product_interest_id)} */}
                                        <li className='title'>Selected Products</li>
                                        {ManageProductList.map((item, index) => {

                                            return <div key={index}>
                                                {item.is_selected && <li key={item.dropdown_product_interest_id} className="checkbox" >
                                                    <label htmlFor={'set_insert_id_' + item.dropdown_product_interest_id}  >
                                                        <input type="checkbox" id={'set_insert_id_' + item.dropdown_product_interest_id}
                                                            value={item.dropdown_product_interest_id}
                                                            onChange={(e) => handleUnCheckClick(e)}
                                                        />
                                                        {item.dropdown_product_interest_name}
                                                    </label>
                                                </li>
                                                }
                                            </div>

                                        })}

                                    </ul>
                                </div>

                            </div>


                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button className="Cancel-btn" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="submit-btn" type="button" onClick={handleSubmit}>
                        Submit
                    </button>
                </Modal.Footer>

            </Modal>
        </>
    )
}


export default ProductModal;

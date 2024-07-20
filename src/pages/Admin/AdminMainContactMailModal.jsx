
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Form, Button as BButton, Button as BsButton } from "react-bootstrap";
import Box from '@mui/material/Box';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import { FormControlLabel, Radio, Switch } from "@mui/material";
import { removeBlankObj } from '../../helper/constants';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};


function AdminMainContactMailModal({
    saveForm,
    open,
    hanldeModal,
    emailDataList,
    phoneDataList,
    dataType,
    setSubFormData,
    setDataType,
    mailModalTitle,
    setNewFormData,
    newFormData,
    mailObjName,
    handleContinue
}) {

    const [allPhoneData, setAllPhoneData] = React.useState([]);

    const [filteredEmailArr, setFilteredEmailArr] = useState([])

    useEffect(() => {
        const updatedEmailArr = removeBlankObj(emailDataList, 'account_main_contact_email')
        if (updatedEmailArr) {
            setFilteredEmailArr(updatedEmailArr)
        }
    }, [emailDataList])

    const handleClose = () => {
        hanldeModal(false)
    }

    const updateFieldChanged = (e, index) => {

        let newArr = [...filteredEmailArr];

        if (e.target.type === 'radio') {
            newArr[index][e.target.name] = e.target.checked;
        } else {
            newArr[index][e.target.name] = e.target.value;
        }

        newArr.map((data, i) => {
            if (index === i) {
                data.account_main_contact_email_main = 1;
            } else {
                data.account_main_contact_email_main = 0;
            }
        });

        setNewFormData({ ...newFormData, [mailObjName]: newArr })
    }

    const handleContinueBtn = () => {
        handleClose();
        // handleContinue()
        // saveForm();
    }
    console.log(emailDataList);
    console.log(filteredEmailArr);

    return (
        <>
            <Modal show={open} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{mailModalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {filteredEmailArr && filteredEmailArr?.map((single, index) => (
                            <li key={index} >

                                <Form.Group className={'col d-block'}>
                                    <b className={''}>Main</b>
                                    <div className="">
                                        <FormControlLabel
                                            className={''}
                                            label={`${single?.account_main_contact_email}`}
                                            value={true}
                                            name="account_main_contact_email_main"
                                            onChange={(e) => updateFieldChanged(e, index)}
                                            control={<Radio color="primary" size="medium" checked={single?.account_main_contact_email_main === true || single?.account_main_contact_email_main ? true : false} />}
                                        />
                                    </div>
                                </Form.Group>
                            </li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleContinueBtn}>
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AdminMainContactMailModal;
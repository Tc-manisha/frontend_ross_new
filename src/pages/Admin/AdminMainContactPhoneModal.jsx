
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


function AdminMainContactPhoneModal({
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
    handleContinue,
    mailObjName
}) {

    const [allPhoneData, setAllPhoneData] = React.useState([]);
    const [filteredPhoneArr, setFilteredPhoneArr] = useState([])

    useEffect(() => {
        const updatedPhoneArr = removeBlankObj(emailDataList, 'account_main_contact_phone')
        if (updatedPhoneArr) {
            setFilteredPhoneArr(updatedPhoneArr)
        }
    }, [emailDataList])

    const handleClose = () => {
        hanldeModal(false)
        // setDataType('')
    }

    const updateFieldChanged = (e, index) => {

        let newArr = [...filteredPhoneArr];

        if (e.target.type === 'radio') {
            newArr[index][e.target.name] = e.target.checked;
        } else {
            newArr[index][e.target.name] = e.target.value;
        }

        newArr.map((data, i) => {
            if (index === i) {
                data.account_main_contact_phone_main = 1;
            } else {
                data.account_main_contact_phone_main = 0;
            }
        });
        setNewFormData({ ...newFormData, [mailObjName]: newArr })
    }

    const handleContinueBtn = () => {
        // handleContinue()
        handleClose();
        // saveForm();
    }

    return (
        <>
            <Modal show={open} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{mailModalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {filteredPhoneArr.map((single, index) => (
                            <li key={index} >
                                <Form.Group className={'col d-block'}>
                                    <b className={''}>Main</b>
                                    <div className="">
                                        <FormControlLabel
                                            className={''}
                                            label={`${single?.account_main_contact_phone}`}
                                            value={true}
                                            name="account_main_contact_phone_main"
                                            onChange={(e) => updateFieldChanged(e, index)}
                                            control={<Radio color="primary" size="medium" checked={single?.account_main_contact_phone_main === 1 || single?.account_main_contact_phone_main ? 1 : 0} />}
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

export default AdminMainContactPhoneModal;
import React from 'react'
import { useState, useEffect } from 'react'
import { CallGETAPI } from '../../helper/API'
import { Form } from "react-bootstrap";
import { FormControlLabel, Switch, Button } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import Moment from 'react-moment';
import Loading from './Loading';

export default function UserClassRegistration() {

    const[ classDetails, setClassDetails ] = useState({})
    const [ formData, setFormData ] = useState({});
    const navigate = useNavigate();
    const [ showLoading, setShowLoading ] = React.useState(true);
    const location = useLocation();

    // prepare end time
    const prepareEndTime = (time, duration) => {
        // Split the time into its components
        let [hours, minutes, seconds] = time.split(":");
        let [newHour, newMinutes] = duration.split(".");

        // Add 30 minutes and 2 hours to the time
        minutes = parseInt(minutes) + parseInt(newMinutes);
        hours   = parseInt(hours) + parseInt(newHour);

        // If the minutes go over 60, adjust the hours accordingly
        if (minutes >= 60) {
            hours++;
            minutes -= 60;
        }

        // If the hours go over 24, adjust them accordingly (assuming 24-hour time format)
        if (hours >= 24) {
            hours -= 24;
        }

        // Format the updated time as a string with leading zeros if necessary
        let updatedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        return updatedTime;
    }

    // get class details
    const getClassDetails = async() => {
        const result = await CallGETAPI('account/inperson-class/' + location?.state?.classId)

        if(result?.status) {
            let classData = result?.data?.data
            classData.inpersonClass.aed_information = JSON.parse(classData.inpersonClass.aed_information)
            classData.inpersonClass.class_contacts = JSON.parse(classData.inpersonClass.class_contacts)
            classData.inpersonClass.class_instructors = JSON.parse(classData.inpersonClass.class_instructors)
            classData.inpersonClass.classes = JSON.parse(classData.inpersonClass.classes)
            classData.inpersonClass.is_instructor_approved = classData.inpersonClass.is_instructor_approved != null ? JSON.parse(classData.inpersonClass.is_instructor_approved) : []

            classData.inpersonClass.end_time = prepareEndTime(classData?.inpersonClass?.course_time, classData?.inpersonClass?.hours);

            setClassDetails(classData)
            
        }

        setShowLoading(false);

    }

    // use effect on load
    useEffect(() => {
        getClassDetails();
    }, []);

    // handle input change
    const handleInputChange = (e) =>
    {
        if(e.target.type == 'checkbox') {
            setFormData((old) => ({ ...old, [ e.target.name ]: e.target.checked }));
        } else {
            setFormData((old) => ({ ...old, [ e.target.name ]: e.target.value }));
        }
    };


    return (
        <>
            <div className='relative'>
                {/* loading */}
                {showLoading ? 
                    <>
                        <div className="showloading">
                            <Loading />
                        </div>
                    </> : 
                    <>
                        <div className="regsitraion">
                            <div className='mt-4' style={ { paddingInline: "45px", paddingTop: '40px' } }>
                                <div className="container-sm d-flex justify-content-center">
                                    <div className='main-content' style={{maxWidth: '600px'}}>
                                        <h3 className='text-center'>{classDetails?.courseName}</h3>
                                        {/* class */}
                                        <div className="row my-4">
                                            <div className="col-md-6">
                                                <p><b>Session Schedule: <br />
                                                    <Moment data={classDetails?.inpersonClass?.course_date} format={'dddd, MMMM DD, YYYY'} /> <br />
                                                    <Moment format="hh:mm A">{classDetails?.inpersonClass?.course_date + ' ' + classDetails?.inpersonClass?.course_time}</Moment> 
                                                    <span> - </span>
                                                    <Moment format="hh:mm A">{classDetails?.inpersonClass?.course_date + ' ' + classDetails?.inpersonClass?.end_time}</Moment></b>
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className='text-capitalize'>{classDetails?.address}</p>
                                            </div>
                                        </div>

                                        <h5 className='text-center'><b>Cost: ${classDetails?.inpersonClass?.student_price}</b></h5>

                                        {/* registration details */}
                                        <div className="form-group mt-5">
                                            <div className="d-flex gap-4 align-items-center">
                                                <h5 className='mb-0'>Seats Needed</h5>
                                                <Form.Group className={ "col-md-2" }>
                                                    <Form.Control
                                                        type="number"
                                                        name="seats_needed"
                                                        required
                                                        onChange={ handleInputChange }
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>

                                        <h5 className='my-3'><b>Sub Total: ${classDetails?.inpersonClass?.student_price}</b></h5>

                                        {/* promo code */}
                                        <div className="row">
                                            <div className="col-md-3">
                                                <h5><b>Promo Code:</b></h5>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Control
                                                    type="text"
                                                    name="promo_code"
                                                    required
                                                    onChange={ handleInputChange }
                                                />
                                            </div>
                                            <div className="col-md-6 d-flex gap-3">
                                                <Button
                                                    className={ "btn account-btn" }
                                                    type="button"
                                                >
                                                    Apply
                                                </Button>
                                                <Button
                                                    className={ "btn account1-btn" }
                                                    type="button"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>

                                        <h5 className='my-3'><b>Net Total: ${classDetails?.inpersonClass?.student_price}</b></h5>

                                    </div>
                                </div>

                                <div className="col-12 text-center mt-5" >
                                    <button className="btn btn-primary text-uppercase" type="button" onClick={()=>{navigate('/payment-page', {  state: {
                                            classId: location?.state?.classId,
                                        }})}}
                                    >
                                        Pay Now
                                    </button>
                                </div>

                                {/* blue line */}
                                {/* <div style={{ width: '100%', height: '4px', background: 'rgb(13, 110, 253)', margin: '50px 0 50px 0'}}></div> */}

                                {/* <h1 className='text-center'>Survey Questions Location</h1> */}

                                {/* blue line */}
                                {/* <div style={{ width: '100%', height: '4px', background: 'rgb(13, 110, 253)', margin: '50px 0 50px 0'}}></div> */}

                                {/* payment form */}
                                {/* <div className="container-sm pb-5" style={{width: '600px'}}>
                                    <div className='main-content' style={{maxWidth: '600px'}}>
                                        
                                        <div className="form-group">
                                            <div className="row align-items-center">
                                                <div className="col-md-4">
                                                    <h5 className='mb-0 text-right'>Payment Type:</h5>
                                                </div>
                                                <Form.Group className={ "col-md-8" }>
                                                    <select name="payment_type" id="payment_type" className='form-control'>
				                                        <option value="" key={ 0 } selected >--Select One--</option>
                                                        <option value="full_payment">Full Payment</option>
                                                        <option value="partial_payment">Partial Payment</option>
                                                    </select>
                                                </Form.Group>
                                            </div>
                                        </div>

                                        <div className="form-group my-3">
                                            <div className="row align-items-center">
                                                <div className="col-md-4">
                                                    <h5 className='mb-0 text-right'>Name on Card:</h5>
                                                </div>
                                                <Form.Group className={ "col-md-8" }>
                                                    <Form.Control
                                                        type="text"
                                                        name="name_on_card"
                                                        required
                                                        onChange={ handleInputChange }
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>

                                        <div className="form-group my-3">
                                            <div className="row align-items-center">
                                                <div className="col-md-4">
                                                    <h5 className='mb-0 text-right'>Card Number:</h5>
                                                </div>
                                                <Form.Group className={ "col-md-8" }>
                                                    <Form.Control
                                                        type="text"
                                                        name="card_number"
                                                        required
                                                        onChange={ handleInputChange }
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>

                                        <div className="form-group my-3">
                                            <div className="row align-items-center">
                                                <div className="col-md-4">
                                                    <h5 className='mb-0 text-right'>Expiration Date:</h5>
                                                </div>
                                                <Form.Group className={ "col-md-8" }>
                                                    <Form.Control
                                                        type="text"
                                                        name="expiration_date"
                                                        required
                                                        onChange={ handleInputChange }
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>

                                        <div className="form-group my-3">
                                            <div className="row align-items-center">
                                                <div className="col-md-4">
                                                    <h5 className='mb-0 text-right'>CVV:</h5>
                                                </div>
                                                <Form.Group className={ "col-md-8" }>
                                                    <Form.Control
                                                        type="text"
                                                        name="cvv"
                                                        required
                                                        onChange={ handleInputChange }
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>

                                        <div className="form-group my-3">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Group className="">
                                                    <FormControlLabel
                                                        className={ "" }
                                                        label=""
                                                        control={
                                                            <Switch
                                                                color="primary"
                                                                size="medium"
                                                                value={ true }
                                                                name="agree_term"
                                                                onChange={ handleInputChange }
                                                            />
                                                        }
                                                    />
                                                </Form.Group>
                                                <div className="">
                                                    <h5 className='mb-0'>I agree to the terms and conditions </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div> */}
                                
                                {/* bottom buttons */ }
                                {/* <div className="row py-5" >
                                    <div className="col-12 content-flex-right" >
                                        <button className="btn btn-danger text-uppercase" type="button" onClick={()=>{navigate(-1)}}>Cancel</button>
                                        <button className="btn btn-success text-uppercase ms-3" type="submit">Submit</button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </>

                }
            </div>
        </>
    )
}

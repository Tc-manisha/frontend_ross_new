import React, { useEffect, useState } from 'react'
import Button from "@mui/material/Button";
import { CallGETAPI } from '../../helper/API';
import Moment from 'react-moment';
import { useNavigate, useParams } from 'react-router-dom';
import TableSkeletonFull from './skeleton/tableFull/TableSkeletonFull';
import Loading from './Loading';

export default function UserClassSelection() {

    const time = "13:00:00";
    const navigate = useNavigate();
    const { classId } = useParams();
    const [ classDetails, setClassDetails ] = useState({})
    const [ alternativeSession, setAlternativeSession ] = useState({})
    const [ showLoading, setShowLoading ] = React.useState(true);

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


    // set inperson class data
    const setCurrentInperson = async(classData) => {
        let course = classData
        course.courseName = classData?.course_name
        course.certName = classData?.cert_name

        // prepare end time
        course.end_time = prepareEndTime(classData?.inpersonClass?.course_time, classData?.inpersonClass?.hours);

        setClassDetails(course);
    }

    // get class details
    const getClassDetails = async() => {

        // get inperson class
        const result = await CallGETAPI('account/inperson-class/' + classId)

        if(result?.status) {
            let classData = result?.data?.data
            classData.inpersonClass.aed_information = JSON.parse(classData?.inpersonClass?.aed_information)
            classData.inpersonClass.class_contacts = JSON.parse(classData?.inpersonClass?.class_contacts)
            classData.inpersonClass.class_instructors = JSON.parse(classData?.inpersonClass?.class_instructors)
            classData.inpersonClass.classes = JSON.parse(classData?.inpersonClass?.classes)
            classData.inpersonClass.is_instructor_approved = classData?.inpersonClass?.is_instructor_approved != null ? JSON.parse(classData?.inpersonClass?.is_instructor_approved) : []

            // prepare end time
            const endTime = prepareEndTime(classData?.inpersonClass?.course_time, classData?.inpersonClass?.hours);
            classData.inpersonClass.end_time = endTime;

            setClassDetails(classData)
        }

        // get session class
        const sessionResult = await CallGETAPI('account/get-alternative-classes/' + classId)

        if(sessionResult?.status) {
            let classData = sessionResult?.data?.classes
            for(let i = 0; i < classData.length; i++) {
                classData[i].inpersonClass.end_time = prepareEndTime(classData[i]?.inpersonClass?.course_time, classData[i]?.inpersonClass?.hours);
            }
            setAlternativeSession(classData);
        }

        setShowLoading(false);
    }

    // use effect on load
    useEffect(() => {
        getClassDetails();
    }, []);

    return (
        <div className='relative'>
            {/* loading */}
            {showLoading ? 
                <>
                    <div className="showloading">
                        <Loading />
                    </div>
                </> : 
                <>
                    <div className='mt-4' style={ { paddingInline: "45px", paddingTop: '50px' } }>
                        <h3><b>{classDetails?.courseName}</b></h3>

                        {/* top grid */}
                        <div className="row my-3">
                            <div className="col-md-6">
                                <h5><b>Class Schedule:</b></h5>
                                {/* class details */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <p><b><Moment data={classDetails?.inpersonClass?.course_date} format={'dddd, MMMM DD, YYYY'} /></b></p>
                                    </div>
                                    <div className="col-md-6">
                                        <p>
                                            <b>
                                                <Moment format="hh:mm A">{classDetails?.inpersonClass?.course_date + ' ' + classDetails?.inpersonClass?.course_time}</Moment> 
                                                <span> - </span>
                                                <Moment format="hh:mm A">{classDetails?.inpersonClass?.course_date + ' ' + classDetails?.inpersonClass?.end_time}</Moment>
                                            </b>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-4">
                                        <p className='text-capitalize'>{classDetails?.address}</p>
                                    </div>
                                    <div className="col-md-5">
                                        <p><b>Enrolled: {parseInt(classDetails?.inpersonClass?.miximum) - parseInt(classDetails?.inpersonClass?.registered ?? 0)}, Max: {classDetails?.inpersonClass?.miximum} <br />
                                            Cost: ${classDetails?.inpersonClass?.student_price}</b>
                                        </p>
                                    </div>
                                    <div className="col-md-3">
                                        <Button
                                            className={ "btn account-btn ms-2" }
                                            type="button"
                                            onClick={(e) => {navigate('/', {
                                                state: {
                                                    classId: classId,
                                                }
                                            })}}
                                        >
                                            Register / Login
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* description */}
                        <p>Approximately a 3-4 hour comprehensive course designed to teach members of the general public correct CPR techniques for use on adults, children and infants ages 0 – 12 months.  The course also covers use of an AED (automated external defibrillator) as an important part of the CPR sequence for adults, children and infants.  Students learn how to relieve choking in a responsive or unresponsive adult, child and infant, and how to use a barrier device to prevent contamination during rescue breathing. This course satisfies the CPR requirement for child care providers in the State of Maryland.  Upon successful completion of the course, students receive a certification card valid for two years.</p>

                        {/* blue line */}
                        <div style={{ width: '100%', height: '4px', background: 'rgb(13, 110, 253)', margin: '80px 0 40px 0'}}></div>

                        {/* alternate Sessions */}
                        <div className="alternate-session">
                            <h3 className='text-center'>Alternate Sessions</h3>
                            <h5 className='text-center mt-3'><b>{classDetails?.courseName}</b></h5>
                            {/* card */}
                            {alternativeSession?.length > 0 && (
                                <div className="container-lg mb-5" style={{ marginTop: '70px' }}>
                                    <div className="row">
                                        {alternativeSession?.map((details, index) => (
                                            <div className="col-md-3" key={index} onClick={() => {setCurrentInperson(details)}}>
                                                <div className="card px-4 py-5" style={{cursor: 'pointer'}}>
                                                    <p>
                                                        <Moment data={details?.inpersonClass?.course_date} format={'dddd, MMMM DD, YYYY'} />
                                                        <br/>
                                                        <span>
                                                            <Moment format="hh:mm A">{details?.inpersonClass?.course_date + ' ' + details?.inpersonClass?.course_time}</Moment> 
                                                            <span> - </span>
                                                            <Moment format="hh:mm A">{details?.inpersonClass?.course_date + ' ' + details?.inpersonClass?.end_time}</Moment>
                                                        </span> 
                                                    </p>
                                                    <p className='text-capitalize mt-4 mb-0'>{details?.address}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* note para */}
                        <p className='mb-4'>Note: A comprehensive CPR/AED class incorporating pediatric and adult applications, which meets OSHA guidelines and state requirements for child care providers, lifeguards, etc. This course is intended for lay rescuers only. Students in the healthcare field or wishing to enter a healthcare profession should take the "BLS Provider" course. Students should dress comfortably and come prepared to practice and demonstrate skills while kneeling on the ground. A 2015 updated AHA student manual is included in the cost of the course. Students will receive their manual at class. There will be a 7% refund processing fee if students must cancel and receive a refund for class. Reschedules without 48 business hours notice will be charged $20.00.</p>
                    </div>
                </>
            }
        </div>
    )
}

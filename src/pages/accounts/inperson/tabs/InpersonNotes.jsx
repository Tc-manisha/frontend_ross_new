

import React, { useEffect, useState } from 'react'
import Box from "@mui/material/Box";
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { DateFormate } from '../../../../helper/TblFn';
import Moment from 'react-moment';
import Container from "react-bootstrap/Container";
import { CallGETAPI, CallGETAPINEW } from '../../../../helper/API';
import { useParams } from 'react-router-dom';
import { GetProfile, formatPhoneNumber, getPermission, prepareOptions } from '../../../../helper/Common';
import { GetCalendarGroup } from '../../../../helper/BasicFn';
import Notes from '../../tabs/Notes';
import UserNotes from '../../../../userPages/userComp/UserNotes';

export default function InpersonNotes({}) {

    const [inpersonClass, setInpersonsClass] = useState({});
    const [classContacts, setClassContacts] = useState({});
    const [trainingData, setTrainignData] = useState({});
    const { inpersonId } = useParams();
    const [accountId, setAccountId] = useState('');

    let profile = GetProfile(); //JSON.parse(localStorage.getItem("ross-profile"))
    let account_id = profile?.account_id
    let contact_id = profile?.contact_id

    let is_user = false
    let privileges = []
    if (profile.user_type > 1) {
        let permissions = getPermission()// localStorage.getItem('permissions')
        let permissionsArr = permissions.split(',')
        privileges = permissionsArr
        is_user = true
    }

    const getInpersonData = async () => {
        const inpersonData = await CallGETAPINEW('account/inperson-class/' + inpersonId)

        if (inpersonData?.status) {
            const inperson = inpersonData?.data?.data?.inpersonClass
            setAccountId(inperson?.account_id);
            // inperson.account_name = inpersonData?.data?.data?.account_name
            // inperson.cert_name = inpersonData?.data?.data?.certName
            // inperson.course_name = inpersonData?.data?.data?.courseName
            // inperson.site_name = inpersonData?.data?.data?.site_name

            // inperson.aed_information    = JSON.parse(inperson?.aed_information);
            // inperson.class_contacts     = JSON.parse(inperson?.class_contacts);
            // inperson.classes            = JSON.parse(inperson?.classes);
            // inperson.class_instructors = inperson?.class_instructors != null ? JSON.parse(inperson?.class_instructors) : '';
            // inperson.broad_cast = inperson?.broad_cast != null ? JSON.parse(inperson?.broad_cast) : '';
            // inperson.is_instructor_approved = JSON.parse(inperson?.is_instructor_approved) || [];

            // setInpersonsClass(inperson)
            // setClassContacts(inperson?.class_contacts[0])

            // if(inperson?.training_address_id) {
            //     let res = await CallGETAPI('account/edit-training-address/' + inperson?.training_address_id );
            //     if(res?.status){
            //         setTrainignData(res?.data?.trainingLocations);
            //     }
            // }

            // if(inperson?.color_group) {
            //     // filter colorGroup
            //     let colorGroup = await GetCalendarGroup();

            //     if (colorGroup.status)
            //     {
            //         let colorGroupData = colorGroup?.data?.calendarGroup
            //         let allcolorGroupData = prepareOptions(colorGroupData, "calendar_group_id", "calendar_group_name");
            //         const filteredcolorGroup = allcolorGroupData.find(
            //             (colorGroup) => colorGroup.value == inperson?.color_group
            //         )

            //         setInpersonsClass((old) => ({...old, ['color_group_label'] : filteredcolorGroup?.label}))
            //     }
            // }
        }
    }

    // getInpersonData
    useEffect(() => {
        getInpersonData();
    }, [])

    const user = getPermission();

    return (
        <div>
            {
                (is_user === true && user?.sub_admin === "") ?
                    <>
                        <UserNotes privileges={privileges} account_id={account_id} inperson_id={inpersonId} site_id={0} contact_id={contact_id} type={'INPERSON'} />
                    </>
                    :
                    <>
                        {accountId && <Notes accountId={accountId} inperson_id={inpersonId} site_id={0} contact_id={0} type={'INPERSON'} />}
                    </>
            }
        </div>
    )
}

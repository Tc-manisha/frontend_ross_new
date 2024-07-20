import { Box } from '@mui/material'
import React from 'react'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { GetInpersonClassesByAccountId } from '../../helper/BasicFn';
import { useState } from 'react';
// import Loading from '../Loading';
import TableSkeleton from '../../pages/accounts/skeleton/table/TableSkeleton';
import { GetProfile, getPermission } from '../../helper/Common';

const customers = [{
    ID: 1,
    FirstName: 'John',
    LastName: 'Heart',
    Prefix: 'Mr.',
    Position: 'CEO',
    Picture: 'images/employees/01.png',
    BirthDate: '1964/03/16',
    HireDate: '1995/01/15',
    Notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
    Address: '351 S Hill St.',
    State: 'California',
    City: 'Los Angeles',
}, {
    ID: 2,
    FirstName: 'Olivia',
    LastName: 'Peyton',
    Prefix: 'Mrs.',
    Position: 'Sales Assistant',
    Picture: 'images/employees/09.png',
    BirthDate: '1981/06/03',
    HireDate: '2012/05/14',
    Notes: 'Olivia loves to sell. She has been selling DevAV products since 2012. \r\n\r\nOlivia was homecoming queen in high school. She is expecting her first child in 6 months. Good Luck Olivia.',
    Address: '807 W Paseo Del Mar',
    State: 'California',
    City: 'Los Angeles',
}, {
    ID: 3,
    FirstName: 'Robert',
    LastName: 'Reagan',
    Prefix: 'Mr.',
    Position: 'CMO',
    Picture: 'images/employees/03.png',
    BirthDate: '1974/09/07',
    HireDate: '2002/11/08',
    Notes: 'Robert was recently voted the CMO of the year by CMO Magazine. He is a proud member of the DevAV Management Team.\r\n\r\nRobert is a championship BBQ chef, so when you get the chance ask him for his secret recipe.',
    Address: '4 Westmoreland Pl.',
    State: 'Arkansas',
    City: 'Bentonville',
}, {
    ID: 4,
    FirstName: 'Greta',
    LastName: 'Sims',
    Prefix: 'Ms.',
    Position: 'HR Manager',
    Picture: 'images/employees/04.png',
    BirthDate: '1977/11/22',
    HireDate: '1998/04/23',
    Notes: "Greta has been DevAV's HR Manager since 2003. She joined DevAV from Sonee Corp.\r\n\r\nGreta is currently training for the NYC marathon. Her best marathon time is 4 hours. Go Greta.",
    Address: '1700 S Grandview Dr.',
    State: 'Georgia',
    City: 'Atlanta',
}, {
    ID: 5,
    FirstName: 'Brett',
    LastName: 'Wade',
    Prefix: 'Mr.',
    Position: 'IT Manager',
    Picture: 'images/employees/05.png',
    BirthDate: '1968/12/01',
    HireDate: '2009/03/06',
    Notes: 'Brett came to DevAv from Microsoft and has led our IT department since 2012.\r\n\r\nWhen he is not working hard for DevAV, he coaches Little League (he was a high school pitcher).',
    Address: '1120 Old Mill Rd.',
    State: 'Idaho',
    City: 'Boise',
}, {
    ID: 6,
    FirstName: 'Sandra',
    LastName: 'Johnson',
    Prefix: 'Mrs.',
    Position: 'Controller',
    Picture: 'images/employees/06.png',
    BirthDate: '1974/11/15',
    HireDate: '2005/05/11',
    Notes: "Sandra is a CPA and has been our controller since 2008. She loves to interact with staff so if you've not met her, be certain to say hi.\r\n\r\nSandra has 2 daughters both of whom are accomplished gymnasts.",
    Address: '4600 N Virginia Rd.',
    State: 'Utah',
    City: 'Beaver',
}, {
    ID: 7,
    FirstName: 'Kevin',
    LastName: 'Carter',
    Prefix: 'Mr.',
    Position: 'Shipping Manager',
    Picture: 'images/employees/07.png',
    BirthDate: '1978/01/09',
    HireDate: '2009/08/11',
    Notes: 'Kevin is our hard-working shipping manager and has been helping that department work like clockwork for 18 months.\r\n\r\nWhen not in the office, he is usually on the basketball court playing pick-up games.',
    Address: '424 N Main St.',
    State: 'California',
    City: 'San Diego',
}, {
    ID: 8,
    FirstName: 'Cynthia',
    LastName: 'Stanwick',
    Prefix: 'Ms.',
    Position: 'HR Assistant',
    Picture: 'images/employees/08.png',
    BirthDate: '1985/06/05',
    HireDate: '2008/03/24',
    Notes: 'Cindy joined us in 2008 and has been in the HR department for 2 years. \r\n\r\nShe was recently awarded employee of the month. Way to go Cindy!',
    Address: '2211 Bonita Dr.',
    State: 'Arkansas',
    City: 'Little Rock',
}, {
    ID: 9,
    FirstName: 'Kent',
    LastName: 'Samuelson',
    Prefix: 'Dr.',
    Position: 'Ombudsman',
    Picture: 'images/employees/02.png',
    BirthDate: '1972/09/11',
    HireDate: '2009/04/22',
    Notes: 'As our ombudsman, Kent is on the front-lines solving customer problems and helping our partners address issues out in the field.    He is a classically trained musician and is a member of the Chamber Orchestra.',
    Address: '12100 Mora Dr',
    State: 'Missouri',
    City: 'St. Louis',
}, {
    ID: 10,
    FirstName: 'Taylor',
    LastName: 'Riley',
    Prefix: 'Mr.',
    Position: 'Network Admin',
    Picture: '',
    BirthDate: '1982/08/14',
    HireDate: '2012/04/14',
    Notes: "If you are like the rest of us at DevAV, then you've probably reached out for help from Taylor. He does a great job as a member of our IT department.",
    Address: '7776 Torreyson Dr',
    State: 'California',
    City: 'San Jose',
}];

export default function UserInpersonNew({ account_id, privileges }) {
    // const { account_id } = useParams();
    const [inpersonClasses, setInpersonClasses] = useState([]);
    const [showLoading, setShowLoading] = React.useState(true);

    // get inperson classes
    const getInpersonClasses = async () => {
        const result = await GetInpersonClassesByAccountId(account_id);

        if (result?.status) {
            setInpersonClasses(result?.classes)
        }

        // show loading false
        setShowLoading(false);
    }

    let profile = GetProfile(); //JSON.parse(localStorage.getItem('ross-profile'))
    let user_type = profile?.user_type

    let is_user = false
    let is_inperson_details = false

    if (user_type > 1) {
        is_user = true
        let permissions = getPermission();// localStorage.getItem('permissions')
        let permissionsArr = permissions.split(',')
        if (permissionsArr.includes('inperson-details')) {
            is_inperson_details = true
        }
    }
    // get inperson class name
    const inpersonClassesName = (data) => {
        return (
            <>
                <Link
                    style={{ color: "#0C71C3", fontWeight: 600, cursor: "pointer", textDecoration: 'none' }}
                    // to={'/user/inperson/details/' + data?.class_id}
                    to={is_user ? (is_inperson_details ? '/user/inperson/details/' + data?.class_id : '') : '/user/inperson/details/' + data?.class_id}
                >
                    {data?.course_name}
                </Link>
            </>
        )
    }

    // get inperson class name
    const inpersonClassesRegistered = (data) => {
        return (
            <>
                {data?.registered ?? 0}
            </>
        )
    }

    // get trainer column data
    const getTrainerColumnData = (data) => {
        if (data?.trainer != null && data?.trainer != undefined && data?.trainer != '') {
            const trainers = JSON.parse(data?.trainer)
            let trainerText = ''
            trainers.map((trainer, index) => {
                let trainerData = trainer?.contact_name + (index == trainers.length - 1 ? '' : ', ')
                trainerText = trainerText + trainerData
            })

            return (
                <>
                    <span className='truncate-one-line' title={trainerText}>{trainerText}</span>
                </>
            )
        } else {
            return ''
        }
    }

    useEffect(() => {
        getInpersonClasses();
    }, [])

    return (
        <div className='relative' style={{ marginBottom: '5%' }}>
            {/* loading */}
            {showLoading && (
                <div style={{ padding: '3% 0' }}>
                    <TableSkeleton />
                </div>
            )}

            {inpersonClasses?.length > 0 ? <>
                {inpersonClasses.map((data, index) => (
                    <div key={index}>
                        <>

                            <Box className="text-left pt-3 pb-1">
                                <div className='heading d-flex' >
                                    <h3 className="heading">{data?.siteName}</h3>
                                    {privileges.includes('new-inperson') && (
                                        <span className='' style={{ marginLeft: 'auto' }}>
                                            <Link to={`/account/inperson/new/${account_id}`} className="btn ">
                                                <img
                                                    src="/edit.svg"
                                                    alt="New"
                                                    style={{ marginRight: "5px" }}
                                                /> New</Link>
                                        </span>
                                    )}
                                </div>
                            </Box>

                            {/* data grid table */}
                            <div className="data-table pb-3">
                                <DataGrid
                                    dataSource={data?.classes}
                                    // height={ 250 }
                                    keyExpr="class_id"
                                    showColumnLines={true}
                                    showRowLines={true}
                                    showBorders={false}
                                    rowAlternationEnabled={true}>

                                    <Column dataField="course_name" cellRender={(e) => inpersonClassesName(e.data)} width={300} caption="Course Name" cssClass="column-header" />
                                    <Column dataField="class_date" caption="Class Date" cssClass="column-header" />
                                    <Column dataField="maximum" cellRender={(e) => inpersonClassesRegistered(e.data)} caption="Registered" width={150} cssClass="column-header" />
                                    <Column dataField="expected" caption="Expected" width={150} cssClass="column-header" />
                                    <Column dataField="maximum" caption="Maximum" width={150} cssClass="column-header" />
                                    <Column dataField="trainer" cellRender={(e) => getTrainerColumnData(e.data)} caption="Trainer" cssClass="column-header" />
                                    <Column dataField="status" caption="Status" width={150} cssClass="column-header" />
                                    <Column dataField="address" caption="Address" cssClass="column-header" />

                                    <Scrolling columnRenderingMode="virtual" />
                                    <Paging enabled={false} />
                                </DataGrid>
                            </div>
                        </>
                    </div>
                ))}
            </> : <>
                {/* data grid table */}
                <div className="data-table py-4">
                    <DataGrid
                        dataSource={[]}
                        keyExpr="course_name"
                        showColumnLines={true}
                        showRowLines={true}
                        showBorders={false}
                        rowAlternationEnabled={true}>

                        <Column dataField="course_name" width={300} caption="Course Name" cssClass="column-header" />
                        <Column dataField="class_date" caption="Class Date" cssClass="column-header" />
                        <Column dataField="maximum" caption="Registered" width={150} cssClass="column-header" />
                        <Column dataField="expected" caption="Expected" width={150} cssClass="column-header" />
                        <Column dataField="maximum" caption="Maximum" width={150} cssClass="column-header" />
                        <Column dataField="trainer" caption="Trainer" cssClass="column-header" />
                        <Column dataField="status" caption="Status" width={150} cssClass="column-header" />
                        <Column dataField="address" caption="Address" cssClass="column-header" />

                        <Scrolling columnRenderingMode="virtual" />
                        <Paging enabled={false} />
                    </DataGrid>
                </div>
            </>}

        </div>
    )
}

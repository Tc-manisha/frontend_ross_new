import { Box } from '@mui/material'
import React from 'react'
import '../accounts/contacts/tabs/table.css'
// import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
import { CallGETAPI, CallGETAPINEW } from '../../helper/API';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import SubHeading from '../../components/header/SubHeading';
import { AccountDetailsTab } from '../../utils';
import { useState } from 'react';

const classes = [
    {
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
        State: 'Register Assign',
        City: 'Los Angeles',
    },
];

export default function Classes() {
    const { accountId } = useParams();
    const [ currentTab, setCurrentTab ] = useState(AccountDetailsTab.INPERSON);
    const [ accountDetails, setAccountDetails ] = useState({});

    // get account data
    const getAccountData = async() => {
        const accountRes = await CallGETAPINEW(
            `account/inperson-class-by-contact/${ accountId }`
        );

        const accountData = accountRes?.data?.data?.AccountDetails;
        setAccountDetails(accountData);
    }

    useEffect(() => {
        getAccountData();
    }, [])
    return (
        <>
            <div className="mt-4" style={ { width: "100%", paddingInline: "45px" } }>

                <SubHeading hideNew='tab' title={ 'Account : ' + accountDetails?.account_name } newUrl="/new-account" subHeading={ true } hideHierarchy={accountDetails?.parent_account != '' && accountDetails?.parent_account != 0 ? false : true} editUrl={'/account/accounts-edit/' + accountId} />

                <Box className="bg-primary ">
                    <div className="d-flex border-bottom border-secondary">
                        { Object.values(AccountDetailsTab).map((tabItem, i) => (
                            <div
                                role="button"
                                key={ i }
                                className={ "text-light py-2 px-3 tab-button" }
                                style={ {
                                    backgroundColor: `${ tabItem === currentTab ? "#26AEE0" : "#0C71C3"
                                    }`,
                                } }
                            >
                                { tabItem }
                            </div>
                        )) }
                        </div>
                    </Box>

                {/* available classes */}
                <div className="available-classes">
                    {/* heading */}
                    <Box className="text-left pt-3 pb-1">
                        <h4 className='heading'>Available Classes</h4>
                    </Box>

                    {/* data grid table */}
                    <div className="data-table pb-3 multiple-row-table">
                        <DataGrid 
                            dataSource={classes}
                            //   height={ 250 }
                            keyExpr="ID"
                            showColumnLines={true}
                            showRowLines={false}
                            showBorders={false}
                            rowAlternationEnabled={true}>
                            <Column dataField="Prefix" width={350} caption="Course" />
                            <Column dataField="BirthDate" caption="Class Date" width={200} dataType="date" />
                            <Column dataField="FirstName" caption="Enrolled"  width={150} />
                            <Column dataField="LastName" caption="Trainer" />
                            <Column dataField="City" caption="Contact" />
                            <Column dataField="State" caption="Tasks" />
                            <Scrolling columnRenderingMode="virtual" />

                            <Paging enabled={ false } />
                        </DataGrid>
                    </div>
                </div>

                {/* Uncompleted Classes */}
                <div className="uncompleted-classes">
                    {/* heading */}
                    <Box className="text-left pt-3 pb-1">
                        <h4 className='heading'>Pending Classes</h4>
                    </Box>

                    {/* data grid table */}
                    <div className="data-table pb-3 multiple-row-table">
                        <DataGrid 
                            dataSource={classes}
                            //   height={ 250 }
                            keyExpr="ID"
                            showColumnLines={true}
                            showRowLines={false}
                            showBorders={false}
                            rowAlternationEnabled={true}>
                            <Column dataField="Prefix" width={350} caption="Course" />
                            <Column dataField="BirthDate" caption="Class Date" width={200} dataType="date" />
                            <Column dataField="FirstName" caption="Enrolled"  width={150} />
                            <Column dataField="LastName" caption="Trainer" />
                            <Column dataField="City" caption="Contact" />
                            <Column dataField="State" caption="Tasks" />

                            <Scrolling columnRenderingMode="virtual" />
                            <Paging enabled={ false } />
                        </DataGrid>
                    </div>
                </div>

                {/* Completed Classes */}
                <div className="completed-classes pb-4">
                    {/* heading */}
                    <Box className="text-left pt-3 pb-1">
                        <h4 className='heading'>Completed Classes</h4>
                    </Box>

                    {/* data grid table */}
                    <div className="data-table pb-3 multiple-row-table">
                        <DataGrid 
                            dataSource={classes}
                            //   height={ 250 }
                            keyExpr="ID"
                            showColumnLines={true}
                            showRowLines={false}
                            showBorders={false}
                            rowAlternationEnabled={true}>
                            <Column dataField="Prefix" width={350} caption="Course" />
                            <Column dataField="BirthDate" caption="Class Date" width={200} dataType="date" />
                            <Column dataField="FirstName" caption="Enrolled"  width={150} />
                            <Column dataField="LastName" caption="Trainer" />
                            <Column dataField="City" caption="Contact" />
                            <Column dataField="State" caption="Tasks" />
                            
                            <Scrolling columnRenderingMode="virtual" />
                            <Paging enabled={ false } />
                        </DataGrid>
                    </div>
                </div>
            </div>
        </>
    )
}

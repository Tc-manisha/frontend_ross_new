import React, { useEffect, useState } from 'react';
// import Header from '../../meep-table/Header';
// import TrainingTableData from './TrainingTableData';
import TrainingTableData from '../../pages/accounts/userTrainingTable/TrainingTableData';
// import AlertTable from './AlertTable';
import AlertTable from '../../pages/accounts/userTrainingTable/AlertTable';
// import Vector from '../../../img/Vector1.png';
// import Edit from '../../../img/Edit.png';
// import New from '../../../img/New.png';
// import Hierarchy from '../../../img/Hierarchy.png';
// import Delete from '../../../img/Delete.png';
// import Move from '../../../img/Move.png';
// import Fix from '../../../img/Fix.png';
import { Button as FixedButton } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CallGETAPI, CallPOSTAPI } from '../../helper/API';
import { styled, useTheme } from '@mui/material/styles';
import TrainingFilter from '../../components/trainingFilter/TrainingFilter';
import TableSkeleton from '../../pages/accounts/skeleton/table/TableSkeleton';
import { Box } from '@mui/material'


const UserTraningNewComp = ({ showAlert, privileges }) => {
    const navigate = useNavigate();
    const [alertTrainingData, setAlertTrainingData] = useState([]);
    const [trainingData, setTrainingData] = useState([]);
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState(showAlert);
    const [loading, setLoading] = useState(true); // Add loading state
    const { account_id , userAccountId} = useParams();
    const [alertData, setalertData] = useState('');

    // get training data
    const getAlertTrainingData = async () => {
        try {
            // alert training data
            const result = await CallGETAPI('account/admin-account-training-alert/' + userAccountId);

            if (result?.status) {
                const alertTrainingData = result?.data?.data;
                setAlertTrainingData(alertTrainingData);
            }

            // training data
            const trainingDataResult = await CallGETAPI('account/admin-account-training-by-site/' + userAccountId);

            if (trainingDataResult?.status) {
                const trainingData = trainingDataResult?.data?.data;
                setTrainingData(trainingData);
            }

            let results = await CallPOSTAPI("account/admin-account-training-filter/" + userAccountId);
            if (results?.data?.status) {
                const hasAlertData = results?.data?.alertData && results.data.alertData.length > 0;
                setalertData(hasAlertData);
            } else {
                setalertData(false);
            }



            setLoading(false); // Set loading to false when data fetching is complete
        } catch (error) {
            console.error('Error fetching data: ', error);
            setLoading(false); // Set loading to false in case of an error
        }
    };

    useEffect(() => {
        getAlertTrainingData();
    }, []);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));

    useEffect(() => {
        if (alert === true) {
            getAlertTrainingData();
        }
        // console.log(alert);
    }, [alert]);



    return (
        <div className='relative' style={{ margin: '2% 0 4%' }}>

           

            {loading ? (
                <>
                    <p>{loading}</p>
                    <div style={{ padding: '3% 0' }}>
                        <TableSkeleton />
                    </div>
                </>// Display a loading message while fetching data
            ) : (
                <>
                    {(alert || alertData) && (
                        <>
                            <div className='d-flex justify-content-between mt-4' style={{ marginTop: "5px", marginBottom: "5px", color: "#0c71c3" }}>
                                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#f36060" }}>Alert</div>
                            </div>
                            <AlertTable alertTrainingData={alertTrainingData} />
                        </>
                    )}

                    <Box className="text-left pb-1" style={{ display: 'flex' }}>
                        <h4 className='heading'>Request for Information</h4>

                        {/* {privileges.includes('training-new') && (
                            <span className='' style={{ marginLeft: 'auto' }}>
                                <Link to={`/account/rfi/new/${userAccountId}`} className="btn ">
                                    <img
                                        src="/edit.svg"
                                        alt="New"
                                        style={{ marginRight: "5px" }}
                                    /> New</Link>
                            </span>
                        )} */}
                    </Box>

                    {/* training other table */}
                    <TrainingTableData trainingData={trainingData} privileges={privileges} account_id={userAccountId} />
                </>
            )}
        </div>
    );
}

export default UserTraningNewComp;

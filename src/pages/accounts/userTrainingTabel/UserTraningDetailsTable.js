import React, { useEffect,useState } from 'react';
import Header from '../../meep-table/Header';
import TrainingTableData from './TrainingTableData';
import Fix from '../../../img/Fix.png'
import AlertTable from './AlertTable';
import Vector from '../../../img/Vector1.png';
import Edit from '../../../img/Edit.png';
import New from '../../../img/New.png';
import Hierarchy from '../../../img/Hierarchy.png';
import Delete from '../../../img/Delete.png';
import Move from '../../../img/Move.png';
import { Button as FixedButton } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import { useNavigate, useParams } from 'react-router-dom';
import { CallGETAPI, CallPOSTAPI } from '../../../helper/API';
import { styled, useTheme } from '@mui/material/styles';
import TrainingFilter from '../../../components/trainingFilter/TrainingFilter';
import { VscTools } from 'react-icons/vsc';
import UserFixAlerts from '../../../userPages/userComp/UserFixAlert';
import { Link } from 'react-router-dom';
import TableSkeleton from '../skeleton/table/TableSkeleton';
import { DecryptToken } from '../../../helper/BasicFn';


const UserTraningDetailsTable = () => {
  const navigate = useNavigate();
  const [alertTrainingData, setAlertTrainingData] = React.useState([]);
  const [trainingData, setTrainingData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState(true);
  const {siteId} = useParams();
  const [loading, setLoading] = useState(true);
  const [alertData, setalertData] = useState('');

  const token = DecryptToken();
  const accountId = token.account_id;
  // get training data
  const getAlertTrainingData = async() => {
    // alert training data
    const result = await CallGETAPI('user/account-training-alert');

    if(result?.status) {
      const alertTrainingData = result?.data?.data;
      setAlertTrainingData(alertTrainingData);
    }

    // training data
    const trainingDataResult = await CallGETAPI('user/account-training-by-site');
    // console.log(siteId);
    if(trainingDataResult?.status) {
      const trainingData = trainingDataResult?.data?.data;
      setTrainingData(trainingData);
    }

    let results1 = await CallPOSTAPI("account/admin-account-training-filter/" + accountId);
      if (results1?.data?.status){
     const hasAlertData = results1?.data?.alertData && results1.data.alertData.length > 0;
          setalertData(hasAlertData);
      } else {
       setalertData(false);
      }

    setLoading(false);
  }

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
    if(alert == true) {
      getAlertTrainingData();
    }
  }, [alert]);

  return (
    <div className='relative'>
      <div className="filter">
        {/* filter */}
        <FixedButton className="btn-style-filter" onClick={handleDrawerOpen}>
          Advanced Filters
        </FixedButton>

        <Drawer
          sx={{
            width: "300px",
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: "300px",
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          {/* filter component */}
          <TrainingFilter userAccountId={accountId} setOpen={setOpen} setTrainingData={setTrainingData} setAlert={setAlert} />
        </Drawer>
      </div>

      {loading ? (
        <>
         <p>{loading}</p>
		
						<div className="showloading-table">
            <TableSkeleton />
          </div>
        </>
      ) : (
        <>
          {(alert || alertData) ? (
            // Render the AlertTable component if alert is true
            <>
              <div className='d-flex flex-start align-items-center mt-4' style={{ marginTop: "5px", marginBottom: "5px", color: "#0c71c3" }}>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#f36060" }}>Alert</div>
                <Link to="/user/fix-alerts" style={{textDecoration:"none",marginLeft:"1280px"}}>
                  <div className='FixAlertsContainer' style={{display:'flex', alignItems:"center"}}>
                    {/* <VscTools /> */}
                    <div><img src={ Fix } style={ { marginRight: "5px" } } /></div>				
                    <h1 className='FixAlertsText' style={{ marginLeft: "1px", marginTop: "6px", fontSize: "17px",color: "rgb(12, 113, 195)",fontWeight: "500",cursor: "pointer" }}> Fix Alerts </h1>
                  </div>
                </Link>
              </div>
              <AlertTable alertTrainingData={alertTrainingData} />
              <TrainingTableData trainingData={trainingData} />
            </>
          ) : (
            // Render the TrainingTableData component if alert is false
            <TrainingTableData trainingData={trainingData} />
          )}
        </>
      )}
    </div>
  );
}

export default UserTraningDetailsTable;

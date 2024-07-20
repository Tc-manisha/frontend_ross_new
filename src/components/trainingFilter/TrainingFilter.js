import React, { useState, useEffect, useRef } from 'react'
import { createTheme } from "@mui/material";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Form } from "react-bootstrap";
import Select, { StylesConfig } from 'react-select';
import { AccountSiteList, DecryptToken, GetFilterData } from '../../helper/BasicFn';
import { CallGETAPINEW, CallPOSTAPI } from '../../helper/API';
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import TraningDetailsTable from '../../pages/accounts/userTrainingTable/TraningDetailsTabel';



export default function TrainingFilter({userAccountId, setOpen, setTrainingData, setAlert })
{
    const theme = createTheme();
    const navigate = useNavigate();
    const { accountId,site_id } = useParams();
    const [ coursesDataList, setCoursesDataList ] = useState([]);
    const [ sitesDataList, setSitesDataList ] = useState([]);
    const [ stateList, setStateList ] = useState([]);
    // const [alert, setAlert ] = useState();
    const [alertData, setalertData] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state
    const [ formData, setFormData ] = useState({
        "course": 0,
        "sites": [],
        "state":0,
    });

const token= DecryptToken();
let AccountId;
if (token && token.user_type === 3) {
    AccountId = userAccountId; 
}else{ AccountId = accountId;
}

useEffect(() => {
    fetchOnLoad();
}, [ ])

    // drawer header 
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'space-between',
    }));

    // close drawer function
    const handleDrawerClose = () =>
    {
        setOpen(false);
    };

    // handle select change
    const handleSelectChange = (data, key, type) =>
    {
        if(type == 'single') {
            setFormData((old) => ({ ...old, [ key ]: data }));
        } else {
            let valueArray = [];
            data.map((item, index) =>
            {
                valueArray.push({
                    label: item.label,
                    value: item.value,
                });
            })
            setFormData((old) => ({ ...old, [ key ]: valueArray }));
        }
    };

    // handle select change
    const handleSelectSubmitData = (data) =>
    {
        let valueArray = [];
        data.map((item) =>
        {
            if(!valueArray.includes(item.value)) {
                valueArray.push(item.value);
            }
        })

        return valueArray;
    };

    // prepare options
    const prepareOptions = (optionsData, key, value) =>
    {
        if (optionsData)
        {
            let allData = [];
            for (let i = 0; i < optionsData.length; i++)
            {
                let singleData = {};
                singleData.value = optionsData[ i ][ key ]
                singleData.label = optionsData[ i ][ value ]
                allData.push(singleData)
            }
            return allData;
        }

    }

    

    // fetchOnLoad
    const fetchOnLoad = async () => {
        try {
            let result1 = await GetFilterData();
            if (result1.status) {
                // stateList
                let stateListData = result1?.data?.stateList;
                let allstateListData = prepareOptions(stateListData, "state_id", "state_name");
                setStateList(allstateListData);
            }

            // sites data
            let siteData = await AccountSiteList(AccountId);
            if (siteData) {
                let allSiteData = siteData?.site_details;
                let filteredSites = prepareOptions(allSiteData, "account_site_info_id", "account_site_name");
                setSitesDataList(filteredSites);
            }

            // courses list
            const result = await CallGETAPINEW('account/all-course-list');

            if (result?.status) {
                const courseList = result?.data?.courseList;
                let filteredCourseList = prepareOptions(courseList, "course_id", "course_name");
                setCoursesDataList(filteredCourseList);
            }
        } catch (error) {
            // Handle error if any of the API requests fails
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Set loading to false whether successful or not
        }
    }

    // clear filter
    const handleClearFilter = async (e) =>
    {
        e.preventDefault();
        setFormData({
            "course": 0,
            "sites": [],
            "state":[],
        })
        setAlert(true);
        handleDrawerClose();
    }

   
    // submit
    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        
        if (token && token.user_type === 3) {
            const payloadData1 = {
                "site_id": formData?.sites.map(site => site.value),
                "state_id": formData?.state.map(state => state.value),
            };
        let results1 = await CallPOSTAPI("user/filter-account-training-by-site", payloadData1);
        if (results1?.data?.status)
        {
            setTrainingData(results1?.data?.data);
        }
        else
        {
            setTrainingData([]);
        }}

        let payloadData = {
            "course": formData?.course?.value,
            "site_id": formData?.sites?.length > 0 ? handleSelectSubmitData(formData?.sites) : [],
            "state_id": formData?.state?.length > 0 ?formData?.state.map(state => state.value): [],
        };
        let results = await CallPOSTAPI("account/admin-account-training-filter/" + AccountId, payloadData);
        if (results?.data?.status){
      
            setTrainingData(results?.data?.data);
            const hasAlertData = results?.data?.alertData && results.data.alertData.length > 0;
            setalertData(hasAlertData);
            setAlert(hasAlertData);
        } else {
          setTrainingData([]);
          setalertData(false);
        }
        handleDrawerClose();
    }
  
    useEffect(() =>
    {
        fetchOnLoad();
    }, [])

    
   
    useEffect(() => {
           
          
    }, [alertData]);
    
   
   

   
    return (
        <>
            {/* drawer header */ }
            <DrawerHeader>
                <div className="left-btns">
                    {/* <button className='btn btn-info' onClick={(e) => {handleClearFilter(e)}}>Clear</button>
                    <button className='btn btn-success ms-2' type='button' onClick={(e) => {handleSubmit(e)}}>Submit</button> */}
                </div>
                <IconButton onClick={ handleDrawerClose }>
                    { theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
                </IconButton>
            </DrawerHeader>

            {/* main content of filter */ }
            <div className="content px-4">
            {loading ? (
                     <p>{loading}</p> // Display a loading message while fetching data
                ) : (
                    <>
            {token && token.user_type !== 3 ? (
  <Form.Group className='mb-3'>
    <Form.Label>Course Name</Form.Label>
    <Select
      value={formData.course}
      className="react-select-container"
      options={coursesDataList}
      onChange={(data) => { handleSelectChange(data, 'course', 'single') }}
      menuPosition={'fixed'}
    />
  </Form.Group>
) : null}


                <Form.Group className='mb-3'>
                    <Form.Label>Site Name</Form.Label>
                    <Select
                        value={ formData.sites }
                        className="react-select-container"
                        options={ sitesDataList }
                        onChange={ (data) => { handleSelectChange(data, 'sites', 'multi') } }
                        menuPosition={ 'fixed' }
                        isMulti
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>State</Form.Label>
                    <Select
                        value={formData?.state}
                        className="react-select-container"
                        options={ stateList }
                        onChange={ (data) => { handleSelectChange(data, 'state', 'multi') } }
                        menuPosition={ 'fixed' }
                        isMulti
                    />
                 </Form.Group>
                   

                {/* submit buttons */ }
                <div className="left-btns mt-4 pb-2">
                    <button className='btn btn-outline-light' onClick={ (e) => { handleClearFilter(e) } }>Clear</button>
                    <button className='btn btn-light ms-2' type='button' onClick={ (e) => { handleSubmit(e) } }>Submit</button>
                </div>
                
                        </>
                )}
               
            </div>
        </>
    )
}


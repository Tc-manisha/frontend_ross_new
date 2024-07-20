
import React, { useEffect, useState } from 'react';
import { AccountDetailsTab } from '../../utils';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { CallGETAPI } from '../../helper/API';
import { useNavigate } from 'react-router-dom';
import { MainDashboardTopTabLists } from '../../helper/constants';
import { getPermission } from '../../helper/Common'; 

function TableTopBar({ tab, userPositionArr, tabs,userAccountId, account_id }) {
// console.log(userAccountId)
// console.log({tab})
  const navigate = useNavigate()
  const [isUser, setisUser] = useState(""); // Set an initial value to false
  const [loading, setLoading] = useState(true);
  const [filteredTabs, setFilteredTabs] = useState({})
  // const [filteredTabs, setFilteredTabs] = useState([]);

  const fetchLoad = async () => {
    let result1 = await CallGETAPI('user/user-permissions');
    const isUser = result1?.data.isTraining;
    setisUser(isUser);
    // console.log(isUser);
    setLoading(false);
  };

  // const allTabs = tabs?.map(tabItem => tabItem?.tab_name)

  const filterTabsArray = () => {
    let filteredData = {};
    const permission = getPermission(); //localStorage.getItem('permissions');
    if (!permission) {
      console.log('No Permission Found');
      return "";
    }
    const cp = permission.split(',');
    MainDashboardTopTabLists.forEach(tab => {
      if (cp.includes(tab.id)) {
        filteredData[tab.name] = tab.name;
      }
    });
    setFilteredTabs(filteredData)
  };

  useEffect(() => {
    fetchLoad();
    filterTabsArray()
  }, []); // Fetch permissions only once when the component mounts

  const hanldeTabClick = (tabItem,userAccountId) => {
    console.log({userAccountId})
    if(!userAccountId){
    navigate(`/user/${tabItem}/${account_id}`, { state: { tabs: tabs } })
    } else {
      console.log(userAccountId);
      navigate(`/user/${tabItem}/${userAccountId}`, { state: { tabs: tabs } })
    }}

  return (
    <>
      <Box className="bg-primary" sx={{ width: '100%' }}>
        <div className="d-flex border-bottom border-secondary">
          {loading ? (
            <p>{loading}</p> // Display a loading message while fetching permissions
          ) : (
            Object.values(filteredTabs).map((tabItem, i) => (
              (
                <>
                  <div onClick={() => hanldeTabClick(tabItem ,userAccountId)} className={"text-light py-2 px-3 tab-button text-decoration-none"}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: `${tabItem === tab ? "#26AEE0" : "#0C71C3"}`,
                    }}>
                    {tabItem}
                  </div>
                </>
              )
            ))
          )}
        </div>
      </Box>
    </>
  );
}

export default TableTopBar;

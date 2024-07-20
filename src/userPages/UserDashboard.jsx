import React, { useState } from 'react'
import { Link, Route, useParams } from 'react-router-dom';
import TableTopBar from './userComp/TableTopBar';
import { useEffect } from 'react';
import { CallGETAPI } from '../helper/API';
// import Contacts from '../pages/accounts/sites/tabs/Contacts';
import UserEquipments from './userComp/UserEquipment';
import UserTraningDetailsTable from '../pages/accounts/userTrainingTabel/UserTraningDetailsTable';
import UserNotes from './userComp/UserNotes';
import UserEmails from './userComp/UserEmails';
import UserSupport from './userComp/UserSupport';
import UserRFI from './userComp/UserRFI';
import { useLocation } from 'react-router-dom';
import UserSites from './userComp/UserSites';
import UserContacts from './userComp/UserContacts';
import UserDocuments from './userComp/UserDocuments';
import UserTraningNewComp from './userComp/UserTrainingNewComp';
import UserPops from './userComp/UserPop';
import New from '../img/New.png';
import { useNavigate } from 'react-router-dom';
import { MainDashboardTopTabLists, filteredDetailsTabs } from '../helper/constants';
import PermissionDeniedPage from './userComp/PermissionDeniedPage';
import CircularLoadingComp from './userComp/CircularLoadingComp';
import { GetProfile, getPermission, setPermission, userContactTabData, userSiteTabData } from '../helper/Common';
import { AccountContactDetails, DecryptToken, GroupBYCoordinatorInfo } from '../helper/BasicFn';
import Details from '../pages/accounts/user/tabs/Details';
import Sites from './userComp/userAccountTab/Sites';
import Contacts from './userComp/userAccountTab/Contacts';
import Notes from './userComp/userAccountTab/Notes';
import Support from './userComp/userAccountTab/Support';
import Equipment from './userComp/userAccountTab/Equipment';
import { EquipmentIcon } from '../helper/Icons';
import Inperson from './userComp/Inperson';

export default function UserDashboard() {

  const navigate = useNavigate()
  const location = useLocation()
  const { tab, userAccountId } = useParams();
  const selectedTab = tab || 'Sites';
  const [siteDataList, setsiteDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [privileges, setPrivileges] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  const [accountName, setAccountName] = useState('')
  const [CoordiDataList, setCoordiDataList] = useState([]);
  const [programDetails, setProgramDetails] = useState("");
  const [siteContactList, setSiteContactList] = useState([]);

  const userData = DecryptToken();
  let account_id = userData?.account_id;
  let contact_id = userData?.contact_id;
  let userPositionArr = getPermission();

  const fetchPrivilege = async () => {
    let response = await CallGETAPI('auth/priviledge')
    if (response.status) {
      setPrivileges(response?.data?.permission)
      setPermission(response?.data?.permission);
    }
  }

  const fetchAccountName = async () => {
    const response = await CallGETAPI(`account/account_info_detail/${userAccountId}`)
    if (response?.status) {
      setAccountName(response?.data?.data?.AccountDetails)
      let cordinatorInfo = response?.data?.data?.cordinatorInformation;
      let CoordiData = GroupBYCoordinatorInfo(cordinatorInfo);
      setCoordiDataList(CoordiData || []);
      setProgramDetails(response?.data?.data?.programDetails);
    }
  }

  const permissionTabsArr = privileges.map(id => {
    const foundItem = MainDashboardTopTabLists.find(item => item.id === id);
    return foundItem ? foundItem.name : null;
  }).filter(name => name !== null);


  const [tabMatched, setTabMatched] = useState(false)
  useEffect(() => {
    for (let index = 0; index < permissionTabsArr.length; index++) {
      let element = permissionTabsArr[index];
      if (element === tab) {
        setTabMatched(true);
        return;
      }
    }
    setTabMatched(false);
  }, [tab, permissionTabsArr]);

  let tabs = location?.state?.tabs

  const fetchLoad = async () => {
    const result = await userSiteTabData(userAccountId);
      setsiteDataList(result);

    let ContactData = await userContactTabData(userAccountId);
    if (ContactData) {
      setSiteContactList(ContactData);
    }
  }

  useEffect(() => {
    fetchLoad();
    fetchPrivilege()
    fetchAccountName()
  }, []);

  const subHeading = () => {
    return (
      <div style={{ display: 'flex', gap: "1px", width: '100%', justifyContent: 'left'}}>
        {/* {privileges.includes('new-account') && (
          <Link style={{ textDecoration: 'none' }} to={'/new-account'}>
            <img src={New} alt="New" />
            New
          </Link>
        )} */}

        <div style={{display:"flex",flexDirection:"column",gap:"0px"}}> 
        <div style={{display:"flex",flexDirection:"column"}}>
        {/* <button
              className="btn text-primary"
              type="button"
              // onClick={() => {
              //   HandleBackClick();
              // }}
            >
              <img src="/back.svg" alt="svg" style={{ marginRight: "0px",marginLeft:"0px",paddingLeft:"0px" }} />
              <span className="ms-2">Back</span>
            </button> */}

            <h1 className={"newAccountH1"} style={{marginLeft:"12px"}}>
                  {/* { ToogleIcon() } */}
                  <span className="account-title">Account : {accountName?.account_name}</span>
                </h1>
        </div>

<div>
        {privileges.includes('account-edit') && (
          <button
          className="btn text-primary"
          type="button"
          onClick={() => navigate('/account/accounts-edit/' + userAccountId)}
        >
          <img
            src="/edit.svg"
            alt="svg"
            style={{ marginRight: "0px" }}
          />
          <span className="ms-2">Edit</span>
        </button>
        )}

        {privileges.includes('assign-aed') && (
          <button
                      className="btn text-primary"
                      id=""
                      type="button"
                      style={{ backgroundColor: "transparent !important" }}
                      onClick={() => navigate('/assign-quipment/' + userAccountId)}
                    >
                      <EquipmentIcon />
                      <span className="ms-1">Assigned AED</span>
                    </button>
        )}
        </div>
        </div>
      </div>
    )
  }

  const documentRedirect = () => {
    navigate("/account-document-upload", {
      state: {
        type: "account",
        accountId: userAccountId?.userAccountId,
        // siteId: "",
      },
    });
  };

  const supportRedirect = () => {
    const stateData = {
      type: "Account",
      site_id: 0,
      accountId: userAccountId ? userAccountId?.userAccountId : 0,
      contactId: 0,
      accountName: accountName || "",
      support_name: accountName,
    };

    navigate("/account/new-support/" + userAccountId, { state: stateData });
  };

  const notesRedirect = () => {
    navigate(`/account/new-note?account_id=${userAccountId}`);
  };

  const handleHoverFloating = () => {
    setIsOpen(true);
  };

  const handleLeaveFloating = () => {
    setIsOpen(false);
  };

  const [documentData, setDocumentData] = useState(null);

  const getDocumentsData = async () => {
    const response = await CallGETAPI("user/user-document-tab/",  userAccountId);

    if (response?.status) {
      setDocumentData(response.data.data);
    }
  };

  useEffect(()=> {
    getDocumentsData();
  },[])

  return (
    <>
      {
        (loading ) ?
          <>
            <CircularLoadingComp />
          </>
          :
          <>
            {
              tabMatched ?
                <>
                  <div className='mt-4' style={{ paddingInline: "45px" }} >
                    <div className="row" >
                      <div className='col-md-12 mx-auto'  >
                        {subHeading()}
                        <TableTopBar tab={selectedTab} userPositionArr={userPositionArr} tabs={tabs} userAccountId={userAccountId} account_id={account_id} />
                        {selectedTab == 'Details' && <Details accountDetails={accountName} CoordiDataList={CoordiDataList} programDetails={programDetails} edit={false} is_user={true} tabs={tabs} privileges={privileges} account_id={account_id} />}
                        {selectedTab == 'Sites' && <Sites siteDataList={siteDataList} edit={false} is_user={true} tabs={tabs} privileges={privileges} account_id={account_id} />}
                        {selectedTab == 'Contacts' && <Contacts siteContactList={siteContactList} is_user={true} tabs={tabs} privileges={privileges} account_id={account_id} />}
                        {selectedTab == 'Equipment' && <Equipment is_user={true} tabs={tabs} privileges={privileges} account_id={account_id} userAccountId={userAccountId} contact_id={contact_id} />}
                        {selectedTab == 'Training' && <UserTraningNewComp is_user={true} privileges={privileges} account_id={account_id} />}
                        {selectedTab == 'Inperson' && <Inperson is_user={true} />}
                        {selectedTab == 'POPS' && <UserPops is_user={true} privileges={privileges} account_id={userAccountId} />}
                        {selectedTab == 'Alerts' && <UserTraningDetailsTable is_user={true} />}
                        {selectedTab == 'Training distribution' && <UserTraningDetailsTable is_user={true} />}
                        {selectedTab == 'Classes' && <UserClasses is_user={true} tabs={tabs} privileges={privileges} account_id={account_id} />}
                        {selectedTab == 'Notes' && <Notes is_user={true} tabs={tabs} privileges={privileges} account_id={userAccountId} contact_id={contact_id} />}
                        {selectedTab == 'Emails' && <UserEmails is_user={true} tabs={tabs} privileges={privileges} account_id={account_id}/>}
                        {selectedTab == 'Support' && <Support is_user={true} tabs={tabs} privileges={privileges} account_id={userAccountId}
                        stateData={{
                          type: "Account",
                          site_id: 0,
                          accountId: account_id ? account_id : 0,
                          contactId: 0,
                          accountName: accountName?.account_name || "",
                          support_name: accountName?.account_name,
                        }}
                        />}
                        {selectedTab == 'Documents' && <UserDocuments documentData={documentData} is_user={true} tabs={tabs} privileges={privileges} account_id={account_id} type={"Account"} />}
                        {selectedTab == 'RFI' && <UserRFI is_user={true} account_id={account_id} privileges={privileges} />}
                      </div>
                    </div>

                    {/* {
                      (privileges.includes('new-document') || privileges.includes('new-support') || privileges.includes('new-note')) && (
                        <div className="floating-menu-btn d-flex flex-column gap-2" style={{ marginBottom: '2%' }}
                          onMouseEnter={handleHoverFloating} onMouseLeave={handleLeaveFloating}
                        >
                          {isOpen && (
                            <>

                              {privileges.includes('new-document') && (
                                <img
                                  src="/NewDocument.svg"
                                  width={60}
                                  height={60}
                                  style={{
                                    padding: "2px",
                                    borderRadius: "50%",
                                    borderColor: "#0c71c3",
                                    borderWidth: "3px",
                                    borderStyle: "solid",
                                  }}
                                  className="pointer bg-white"
                                  onClick={documentRedirect}
                                  title="New Document"
                                />
                              )}

                              {privileges.includes('new-support') && (
                                <img
                                  src="/NewSupport.svg"
                                  width={60}
                                  height={60}
                                  style={{
                                    padding: "2px",
                                    borderRadius: "50%",
                                    borderColor: "#0c71c3",
                                    borderWidth: "3px",
                                    borderStyle: "solid",
                                  }}
                                  className="pointer bg-white"
                                  onClick={supportRedirect}
                                  title="New Support"
                                />
                              )}


                              {privileges.includes('new-note') && (
                                <img
                                  src="/NewNote.svg"
                                  width={60}
                                  height={60}
                                  style={{
                                    padding: "2px",
                                    borderRadius: "50%",
                                    borderColor: "#0c71c3",
                                    borderWidth: "3px",
                                    borderStyle: "solid",
                                  }}
                                  className="pointer bg-white"
                                  onClick={notesRedirect}
                                  title="New Note"
                                />
                              )}

                            </>
                          )}

                          <img
                            src="/Plus.svg"
                            width={60}
                            height={60}
                            style={{
                              padding: "2px",
                              borderRadius: "50%",
                              borderColor: "#0c71c3",
                              borderWidth: "3px",
                              borderStyle: "solid",
                            }}
                            className="pointer bg-white"
                            onClick={() => {
                              setIsOpen((prev) => !prev);
                            }}
                          />
                        </div>
                      )
                    } */}
                  </div>
                </>
                :
                <>
                  <PermissionDeniedPage setLoading={setLoading} />
                </>
            }
          </>
      }
    </>
  )
}

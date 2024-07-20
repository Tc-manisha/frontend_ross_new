import React from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AccountContactDetails, FetchAccountSiteDetails, GroupBYSiteCoordinatorInfo } from '../helper/BasicFn';
import { useState } from 'react';
import { useEffect } from 'react';
import Details from '../pages/accounts/sites/tabs/Details';
import { AccountSiteTab } from '../utils';
import BackButton from '../components/shared/BackButton';
import { Box } from '@mui/material';
import SiteDetailsTopBar from './userComp/SiteDetailsTopBar';
import UserContactTable from './userComp/UserContactTable';
import UserAeds from './userComp/UserAeds';
import TrainingTable from './userComp/TrainingTable';
import UserInperson from './userComp/UserInperson';
import New from '../img/New.png';
import UserSiteNotes from './userComp/UserSiteNotes';
import UserNotes from './userComp/UserNotes';
import UserEquipments from './userComp/UserEquipment';
import UserEmails from './userComp/UserEmails';
import UserRFI from './userComp/UserRFI';
import UserSupport from './userComp/UserSupport';
import UserDocuments from './userComp/UserDocuments';
import { MainDashboardTopTabLists, filteredDetailsTabs } from '../helper/constants';
import Loading from '../pages/accounts/Loading';
import { GetProfile, getPermission } from '../../helper/Common';

function UserAccountDetails() {
	const { siteId, tab } = useParams();
	// const currentTab = tab ? tab : 'Details';
	const [currentTab, setCurrentTab] = useState('')
	const [showLoading, setShowLoading] = React.useState(true);
	const [siteData, setSiteData] = React.useState([])
	const [billingData, setBillingData] = React.useState("")
	const [shippingData, setShippingData] = React.useState("")
	const [traningData, setTraningData] = React.useState([])
	const [aedUnits, setAedUnits] = React.useState([]);
	const [coordinatorData, setCoordinatorData] = React.useState([]);
	const [siteContactList, setSiteContactList] = React.useState([])
	const location = useLocation();
	const navigate = useNavigate();

	let permissions = getPermission(); //localStorage.getItem('permissions')
	let permissionsArr = permissions.split(',')

	let userData = GetProfile();// JSON.parse(localStorage.getItem("ross-profile"))
	let account_id = userData?.account_id
	let contact_id = userData?.contact_id

	let privileges = permissionsArr


	// FETCH DATA ON LOAD
	const fetch = async () => {
		setShowLoading(true);
		let data = await FetchAccountSiteDetails(siteId);
		if (data) {
			// setAccountData(data);
			setSiteData(data?.siteData)
			setBillingData(data?.billingData)
			setShippingData(data?.shippingData)
			setTraningData(data?.trainingLocations)

			let CoordiData = GroupBYSiteCoordinatorInfo(data?.cordinatorInformation);
			setCoordinatorData(CoordiData);
			setAedUnits(data?.aed_units);
			setShowLoading(false);

		}
		setShowLoading(false);
	}

	// on load
	useEffect(() => {
		fetch()
	}, [])

	const [tabBarlist, setTabBarlist] = useState([]);

	const subHeading = () => {
		return (
			<div style={{ display: 'flex', gap: 15, width: '100%', justifyContent: 'left', margin: '2% 0' }}>
				{privileges.includes('site-details-edit') && (
					<Link style={{ textDecoration: 'none' }} to={'/account/accounts-edit/' + account_id}>
						<img src={New} alt="New" />
						Edit
					</Link>
				)}
				{privileges.includes('assign-aed') && (
					<Link style={{ textDecoration: 'none' }} to={'/assign-quipment/' + account_id}>
						<img src={New} alt="New" />
						Assign AED
					</Link>
				)}
			</div>
		)
	}

	const fetchOnLoad = async () => {
		let ContactData = await AccountContactDetails(account_id);
		if (ContactData) {
			setSiteContactList(ContactData?.contact_list);
		}
	}

	const arr = [
		{
			name: 'Details'
		},
		{

			name: 'Contacts'
		},
		{

			name: 'Equipment'
		},
		{

			name: 'Inperson'
		},
		{

			name: 'Notes'
		},
		{

			name: 'Emails'
		},
		{

			name: 'Support'
		},
		{

			name: 'RFI'
		},
		{

			name: 'Documents'
		},
	];

	const settabPermissions = () => {

		const filteredSitesTabs = filteredDetailsTabs(arr)

		filteredSitesTabs.unshift({ name: 'Details', id: 'site-details', 'order': 1 })

		const Cp = getPermission();// localStorage.getItem('permissions');
		if (!Cp) {
			console.log('Invalid Permission');
		}
		const Cp2 = Cp.split(",");

		const newArr = [];
		filteredSitesTabs.map((it) => {
			if (Cp2.includes(it.id)) {
				newArr.push(it);
			}
		})

		var firstKey = newArr[0].name;
		setCurrentTab(firstKey)
		setTabBarlist(newArr);
	}

	const tabBarlistArr = tabBarlist.map(item => item?.name)

	useEffect(() => {
		settabPermissions();
		fetchOnLoad();
	}, [])

	return (
		<>

			<div className='mt-4 pb-5' style={{ paddingInline: "45px" }}>
			{/* {showLoading && (
                <div style={{
					marginTop: '500pc',
					marginLeft: '500px',
					transform: 'translate(-50%, -50%)',
				}}>
					<Loading />
				</div>
			)}   */}

			{!showLoading && (<> 
				<BackButton />
				<h3 style={{ fontWeight: 600, fontSize: 22, marginTop: '1%' }}>Site: {siteData?.account_site_name}</h3>
				{subHeading()}
				<SiteDetailsTopBar tabldList={tabBarlist} tab={currentTab} setCurrentTab={setCurrentTab} siteId={siteId} />

				{tabBarlistArr.includes('Details') && currentTab == 'Details' &&
					<Details
						siteData={siteData}
						billingData={billingData}
						shippingData={shippingData}
						traningData={traningData}
						aedUnits={aedUnits}
						coordinatorData={coordinatorData}
					/>}

				{tabBarlistArr.includes('Contacts') && currentTab == 'Contacts' && <UserContactTable is_user={true} site_id={siteId} siteContactList={siteContactList} privileges={privileges} account_id={account_id} />}
				{tabBarlistArr.includes('Equipment') && currentTab == 'Equipment' && <UserEquipments is_user={true} privileges={privileges} account_id={account_id} />}
				{tabBarlistArr.includes('Inperson') && currentTab == 'Inperson' && <UserInperson is_user={true} privileges={privileges} account_id={account_id} />}
				{tabBarlistArr.includes('RFI') && currentTab == 'RFI' && <UserRFI is_user={true} />}
				{tabBarlistArr.includes('Support') && currentTab == 'Support' && <UserSupport is_user={true} privileges={privileges} account_id={account_id} contact_id={contact_id} />}
				{tabBarlistArr.includes('Emails') && currentTab == 'Emails' && <UserEmails is_user={true} privileges={privileges} account_id={account_id} />}
				{tabBarlistArr.includes('Notes') && currentTab == 'Notes' && <UserNotes is_user={true} site_id={siteId} privileges={privileges} account_id={account_id} />}

				{/* {(currentTab == 'Documents') ? <div className='mt-4'>No Data Found</div> : ''} */}
				{tabBarlistArr.includes('Documents') && currentTab == 'Documents' && <UserDocuments is_user={true} site_id={siteId} privileges={privileges} account_id={account_id} contact_id={contact_id} />}

				</>)}
			</div>
		</>
	)
}

export default UserAccountDetails;
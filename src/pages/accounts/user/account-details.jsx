import React from "react";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { AccountDetailsTab } from "../../../utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CallGETAPI } from "../../../helper/API";
import { AccountContactDetails, AccountSiteList, GroupBYCoordinatorInfo } from "../../../helper/BasicFn";
import Inperson from "./tabs/Inperson";
import Pops from "./tabs/Pops";
import Notes from "./tabs/Notes";
import Emails from "./tabs/Emails";
import Support from "./tabs/Support";
import Documents from "./tabs/Documents";
import RFI from "./tabs/RFI";
import { styled } from '@mui/material/styles';
import { createTheme } from "@mui/material";
import SubHeading from "../../../components/header/SubHeading";
import Details from "./tabs/Details";
import Sites from "./tabs/Sites";
import Contacts from "./tabs/Contacts";
import Aeds from "./tabs/Aeds";
import UserTraningDetailsTabel from "../userTrainingTable/TraningDetailsTabel";
import TableSkeleton from "../skeleton/table/TableSkeleton";

const drawerWidth = 200;
const theme = createTheme();

const UserAccountDetails = ({ setShowSidebar, privileges }) =>
{
	const [ showLoading, setShowLoading ] = React.useState(true);
	const [ outsideClick, setOutsideClick ] = React.useState('');
	const [ currentTab, setCurrentTab ] = useState(AccountDetailsTab.DETAILS);
	const [ accountDetails, setAccountDetails ] = useState({});
	const [ CoordiDataList, setCoordiDataList ] = useState([]);
	const [ programDetails, setProgramDetails ] = useState({});
	const [ siteDataList, setSiteDataList ] = useState([]);
	const [ siteContactList, setSiteContactList ] = useState([]);
	const [ open, setOpen ] = React.useState(false);
	const [ httpsWeb, setHttpsWeb ] = useState(false)
	const [ FormMsg, setFormMsg ] = React.useState({ type: true, msg: "" });
	const navigate = useNavigate();
	const location = useLocation();
	const { accountId } = useParams();
	const [ EditUrl, setEditUrl ] = useState("/account/accounts-edit/" + accountId);

	console.log({privileges})
	const handleDrawerOpen = () =>
	{
		setOpen(true);
	};

	const handleDrawerClose = () =>
	{
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


	const handleTab = (item) =>
	{
		setCurrentTab(item)
		// setEditUrl("/account/"+item+'/'+accountId)
	}

	const fetchOnload = async () =>
	{
		const accountRes = await CallGETAPI(
			`account/account_info_detail/${ accountId }`
		);
		const accountData = accountRes?.data?.data?.AccountDetails;

		const cordinatorInfo = accountRes.data.data.cordinatorInformation;
		const ProgramDetailInfo = accountRes.data.data.programDetails;
		let CoordiData = GroupBYCoordinatorInfo(cordinatorInfo);

		setCoordiDataList(CoordiData);
		setAccountDetails(accountData);
		setProgramDetails(ProgramDetailInfo)

		let SiteData = await AccountSiteList(accountId);
		if (SiteData)
		{
			setSiteDataList(SiteData?.site_details);
		}

		let ContactData = await AccountContactDetails(accountId);
		if (ContactData)
		{
			setSiteContactList(ContactData?.contact_list);
		}

		var pattern = new RegExp('^(https?|http)://');

		if (pattern.test(accountDetails?.website))
		{
			setHttpsWeb(true)
		}

		// show loading false
		setShowLoading(false);
	};

	useEffect(() =>
	{
		fetchOnload();

		if (location?.state?.tab)
		{
			setCurrentTab(location?.state?.tab)
		}
	}, [ location ]);


	return (
		<>
			{/* loading */ }
			{ showLoading ?
				<>
					<div className="showloading-table">
						<TableSkeleton />
					</div>
				</> :
				<>
					<div className="mt-4" style={ { width: "100%", paddingInline: "45px" } } onClick={ (e) => { setOutsideClick(e) } }>

						<SubHeading hideNew='tab' title={ 'Account : ' + accountDetails?.account_name } newUrl="/new-account" subHeading={ true } hideHierarchy={ accountDetails?.parent_account != '' && accountDetails?.parent_account != 0 ? false : true } editUrl={ '/account/accounts-edit/' + accountId } outsideClickEvent={ outsideClick }
							support_type="Account"
							support_name={accountDetails?.account_name}
							site_id={0}
							privileges={privileges}
						/>

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
										onClick={ () => handleTab(tabItem) }
									>
										{ tabItem }
									</div>
								)) }
							</div>
						</Box>

						{ currentTab === AccountDetailsTab.DETAILS && (
							<>
								<Details accountDetails={ accountDetails } CoordiDataList={ CoordiDataList } programDetails={ programDetails } httpsWeb={ httpsWeb } />
							</>
						) }

						{ currentTab === AccountDetailsTab.SITES && (
							<>
								<Sites siteDataList={ siteDataList } />
							</>
						) }
                         {/* {JSON?.stringify(privileges.includes("contacts-tab"))} */}
						{(privileges.includes("contacts-tab") && currentTab === AccountDetailsTab.CONTACTS) && (
							<>
								<Contacts siteContactList={ siteContactList } />
							</>
						) }

						{/* DOCUMENTS */ }
						{ currentTab === AccountDetailsTab.DOCUMENTS && (
							<Documents />
						) }

						{/* POPS/PLANS */ }
						{ currentTab === AccountDetailsTab.INPERSON && (
							<Inperson />
						) }

						{/* POPS/PLANS */ }
						{ currentTab === AccountDetailsTab.POPS && (
							<Pops />
						) }

						{/* TRAINING */ }
						{ currentTab === AccountDetailsTab.TRAINING && (
							<UserTraningDetailsTabel />
						) }

						{/* SUPPORT */ }
						{ currentTab === AccountDetailsTab.SUPPORT && (
							<Support 
							
							stateData={
								{
									type:			'Account',
									site_id:  		 0,
									accountId: 		accountId || 0,
									contactId:  	0,
									accountName:	"",
									support_name: 	accountDetails?.account_name,		
								}} 
							/>
						) }

						{/* Notes */ }
						{ currentTab === AccountDetailsTab.NOTES && (
							<Notes accountId={accountId} type="ACCOUNT" />
						) }

						{/* Emails */ }
						{ currentTab === AccountDetailsTab.EMAILS && (
							<Emails />
						) }

						{/* RFI */ }
						{ currentTab === AccountDetailsTab.RFI && (
							<RFI />
						) }

						{/* AEDS */ }
						{ currentTab === AccountDetailsTab.AEDS && (
							<Aeds />
						) }


						{/* <div className="my-3">
              <MessageHandler
                status={ FormMsg.type }
                msg={ FormMsg.msg }
                HandleMessage={ setFormMsg }
              />
            </div> */}
					</div>
				</>
			}

		</>
	);
};

export default UserAccountDetails;

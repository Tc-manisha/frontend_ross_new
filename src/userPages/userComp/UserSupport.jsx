// import { Box } from '@mui/material'
// import React, { useEffect, useState } from 'react'
// import './Tabls.scss'
// // import 'devextreme/dist/css/dx.light.css';
// import DataGrid, { Scrolling, Paging, Column } from 'devextreme-react/data-grid';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { CallGETAPI } from '../../helper/API';
// import { prepareOptions } from '../../helper/Common';
// import TableSkeleton from '../../pages/accounts/skeleton/table/TableSkeleton';
// import { DecryptToken } from '../../helper/BasicFn';
// import New from '../../img/New.png';

// export default function UserSupport({ tabs, privileges, contact_id, account_id, stateData = {} }) {

// 	const navigate = useNavigate();
// 	const [supportList, setSupportList] = useState();
// 	const [issueTypeList, setIssueTypeList] = useState();
// 	const [loading, setLoading] = useState(true);
// 	// get support list
// 	const getSupportList = async (e) => {
// 		const issueTypeResult = await CallGETAPI('user/all-issues-type');

// 		if (issueTypeResult?.status) {
// 			const issueTypes = issueTypeResult?.data?.issuesList
// 			const allIssueTypes = prepareOptions(issueTypes, 'issue_id', 'issue_name')
// 			setIssueTypeList(allIssueTypes);
// 		}

// 		// get support details
// 		const result = await CallGETAPI("support/ticket-by-contact/" + contact_id);

// 		if (result?.status) {
// 			const resultData = result?.data?.ticketList;
// 			setSupportList(resultData);
// 		}
// 		setLoading(false);
// 	}

// 	useEffect(() => {
// 		getSupportList();
// 	}, []);

// 	// getStatus for table
// 	const getStatus = (data) => {
// 		return (
// 			<>
// 				{data?.status == 1 ?
// 					<span className='text-danger'>Active</span>
// 					:
// 					<span>Completed</span>
// 				}
// 			</>
// 		)
// 	}

// 	let is_support_details = false

// 	let permissions = localStorage.getItem('permissions')
// 	let permissionsArr = permissions.split(',')
// 	if (permissionsArr.includes('support-details')) {
// 		is_support_details = true
// 	}

// 	// getStatus for table
// 	const getIssue = (data) => {
// 		return (
// 			<>
// 				<Link className="link" style={{ fontWeight: 'bold', textDecoration: 'none' }} to={is_support_details ? '/account/support/' + data?.ticket_id : ''}>{data?.issue}</Link>
// 			</>
// 		)
// 	}

// 	// getStatus for table
// 	const getIssueType = (data) => {
// 		const filteredIssueType = issueTypeList.find((issue) => issue.value == data?.issue_type)
// 		return (
// 			<>
// 				<span>{filteredIssueType?.label}</span>
// 			</>
// 		)
// 	}

// 	// const token = DecryptToken();
// 	// const contact_id = token.contact_id;

// 	// const supportPermissionObj = tabs?.filter(tab => tab?.tab_name === 'Support')[0];
// 	// let supportPermissions = (supportPermissionObj?.permission).split(',')

// 	return (
// 		<div className='relative'>
// 			{/* data grid table */}
// 			<div className='data-table py-4'>
// 				{loading ? (
// 					<>
// 						<p>{loading}</p>
// 						<div>
// 							<TableSkeleton />
// 						</div>
// 					</>
// 				) : (
// 					<>
// 						<div style={{ display: 'flex', gap: '10%', width: 200, justifyContent: 'right', marginLeft: 'auto', marginBottom: '1%' }}>

// 							{privileges.includes('new-support') && (
// 								 <button className='btn ' type='button' style={{ marginTop: '10px' }} onClick={() => navigate("/account/new-support/" + account_id, { state: stateData })}>
// 								 <img
// 								   src="/edit.svg"
// 								   alt="Edit"
// 								   style={{ marginRight: "5px" }}
// 								 />
// 								 New
// 							   </button>
// 							)}

// 						</div>

// 						<DataGrid
// 							dataSource={supportList}
// 							keyExpr="ticket_id"
// 							showColumnLines={true}
// 							showRowLines={true}
// 							showBorders={false}
// 							rowAlternationEnabled={true}>
// 							<Column cellRender={(e) => getIssueType(e.data)} caption="Issue Type" cssClass="column-header" />
// 							<Column cellRender={(e) => getStatus(e.data)} caption='Status' cssClass="column-header" />
// 							<Column cellRender={(e) => getIssue(e.data)} caption='Issue' cssClass="column-header" />
// 							<Column dataField="due_date" caption='Due Date' cssClass="column-header" dataType={'date'} />
// 							<Column dataField="created_by" caption='Created' cssClass="column-header" />
// 							<Column dataField="created_date" caption='Created Date' cssClass="column-header" dataType={'date'} />
// 							<Column dataField="owner_name" caption='Owner' cssClass="column-header" />

// 							<Scrolling columnRenderingMode='virtual' />
// 							<Paging enabled={false} />
// 						</DataGrid>
// 					</>
// 				)}
// 			</div>
// 		</div>
// 	);
// }

import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import MenuIcon from "@mui/icons-material/Menu";
import { Alert, Box, Snackbar } from "@mui/material";
import { Button as FixedButton } from "@mui/material";

import { Button } from "../../components/trainingFilter/TrainingFilter";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import LockIcon from "@mui/icons-material/Lock";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CallGETAPI } from "../../helper/API";
import { FaSort } from "react-icons/fa";
import Drawer from "@mui/material/Drawer";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import AccountTbl from "../../components/tables/AccountTbl";
import { DynamicSort } from "../../helper/TblFn";
import SubHeading from "../../components/header/SubHeading";
import Filter from "../../components/filter/";
import { createTheme } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import { MenuLinks } from "../../utils";
import SidebarLink from "../../components/layout/SidebarLink";
import TableSkeleton from "../../pages/accounts/skeleton/table/TableSkeleton";
import SiteListTbl from "./SitelistTbl";
import SupportListTbl from "./SupportListTbl";
import { GetProfile, getPermission, prepareOptions } from "../../helper/Common";
import { DecryptToken } from "../../helper/BasicFn";
// import Loading from "./Loading";
// import TableSkeleton from "./skeleton/table/TableSkeleton";

const theme = createTheme();

const UserSupport = ({ setShowSidebar }) => {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = React.useState(true);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccount, setFilterdAccount] = useState([]);
  const [openModel, setOpenModel] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [siteDataList, setsiteDataList] = useState([]);

  const [supportList, setSupportList] = useState();
  const [issueTypeList, setIssueTypeList] = useState();
  const [loading, setLoading] = useState(true);

  const privileges = getPermission();

  // let userData = GetProfile();//JSON.parse(localStorage.getItem("ross-profile"))
  let userData = DecryptToken();
  // let userPositionArr = userData?.position.split(',')
  let account_id = userData?.account_id
  let contact_id = userData?.contact_id

  // get support list
  const getSupportList = async (e) => {
	setShowLoading(true);
  console.log("Here We Are")
   const issueTypeResult = await CallGETAPI("user/support-list");
     console.log(issueTypeResult?.data?.ticketList)
     const resultData = issueTypeResult?.data?.ticketList;
     setSupportList(resultData);

     var supportArr = [];
    //  console.log({issueTypeResult});
    // console.log({Arr1: issueTypeResult?.data?.ticketList?.assignto})
    // console.log({Arr2: issueTypeResult?.data?.ticketList?.createdby})
    // console.log({Arr3: issueTypeResult?.data?.ticketList?.closed})
//       supportArr = issueTypeResult?.data?.ticketList?.assignto.concat(issueTypeResult?.data?.ticketList?.createdby, issueTypeResult?.data?.ticketList?.closed);

// console.log({supportArr});
// setSupportList(supportArr)

  const issueTypeList = await CallGETAPI("user/all-issues-type");
   
    if (issueTypeList?.status) {
      const issueTypes = issueTypeList?.data?.issuesList;
      const allIssueTypes = prepareOptions(
        issueTypes,
        "issue_id",
        "issue_name"
      );
      setIssueTypeList(allIssueTypes);
    }

    // get support details
    const result = await CallGETAPI("support/ticket-by-contact/" + contact_id);

    if (result?.status) {
      const resultData = result?.data?.ticketList;
      // setSupportList(resultData);
    }
    setShowLoading(false);
  };

  useEffect(() => {
    getSupportList();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));

  const [searchInput, setSearchINput] = useState({
    name: "",
    equipment: "",
    training: "",
    type: "",
    parent: "",
    distributor: "",
    owner: "",
    secure: "",
  });
  const location = useLocation();
  const showDelete = location?.state?.showDelete;

  const handleCloseModel = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenModel(false);
  };

  //   const fetchLoad = async () => {
  //     let result = await CallGETAPI('user/user-site-list-v2');
  //     console.log(result)
  //     if (result?.status) {
  //       let siteData = result?.data?.data || [];
  //       console.log(siteData)
  //       setsiteDataList(siteData);
  //     }
  //   }

  //   useEffect(() => {
  //     fetchLoad();
  //   },[])

  //   const getAccountsList = async () => {
  //     const accountsData = await CallGETAPI("account/account-list");

  //     if (accountsData?.status) {
  //       setAccounts(accountsData?.data?.data?.account);
  //     }

  //     // show loading false
  //     setShowLoading(false);
  //   };

  // useEffect(() => {
  //   showDelete && setOpenModel(true);
  //   if (showDelete) {
  //     navigate("/accounts-listing", { state: { showDelete: false } });
  //   }
  // }, [showDelete]);

  // useEffect(() => {
  //   getAccountsList();
  // }, []);

  useEffect(() => {
    let filteredData = accounts;
    if (searchInput.name !== "") {
      filteredData = filteredData.filter(({ account_name }) =>
        account_name
          .toLocaleLowerCase()
          .includes(searchInput.name.toLocaleLowerCase())
      );
    }
    if (searchInput.type !== "") {
      filteredData = filteredData.filter(({ customer_type_name }) =>
        customer_type_name
          .toLocaleLowerCase()
          .includes(searchInput.type.toLocaleLowerCase())
      );
    }
    if (searchInput.parent !== "") {
      filteredData = filteredData.filter(({ parent_name }) =>
        parent_name
          .toLocaleLowerCase()
          .includes(searchInput.parent.toLocaleLowerCase())
      );
    }
    if (searchInput.distributor !== "") {
      filteredData = filteredData.filter(({ distributon_name }) =>
        distributon_name
          .toLocaleLowerCase()
          .includes(searchInput.distributor.toLocaleLowerCase())
      );
    }
    if (searchInput.secure !== "") {
      filteredData = filteredData.filter(
        ({ isSecure }) => isSecure == Number(searchInput.secure)
      );
    }

    setFilterdAccount(filteredData);
  }, [searchInput]);

  const [isAsc, setIsAsc] = useState(false);

  const handleSorting = (key) => {
    let sortedData = [...filteredAccount];
    if (sortedData?.[0]?.[key] === undefined) {
      return;
    }
    // isSecure

    const data = sortedData.sort((a, b) => {
      if (Number.isInteger(a[key])) {
        if (isAsc) {
          return b[key] - a[key];
        } else {
          return a[key] - b[key];
        }
      } else {
        let fa = a[key].toLowerCase(),
          fb = b[key].toLowerCase();
        if (isAsc) {
          if (fa < fb) {
            return 1;
          }
          if (fa > fb) {
            return -1;
          }
          return 1;
        } else {
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        }
      }
    });

    setFilterdAccount(data);
    setIsAsc(!isAsc);
  };

  // check account listing on state value
//   useEffect(() => {
//     if (location?.state?.accountListings) {
//       setTimeout(() => {
//         setAccounts(location?.state?.accountListings);
//       }, 1000);
//     } else {
//       setTimeout(() => {
//         getAccountsList();
//       }, 1000);
//     }

//     return () => {
//       // Anything in here is fired on component unmount.
//       location.state = "";
//     };
//   }, [location]);

  return (
    <>
      {/* loading */}
      {showLoading && (
        <div className="showloading-table">
          {/* <TableSkeleton /> */}
        </div>
      )}

      <div className="mt-4" style={{ paddingInline: "45px" }}>
        <SubHeading
          hideNew={true}
          hideHierarchy={true}
          title={"Support Listing"}
          // newUrl="/new-account"
          //   newUrl="/admin-account"
          subHeading={true}
        />

        <div style={{ minHeight: "84.6vh" }}>
          <Box className="d-flex justify-content-center py-4">
            <SupportListTbl tableData={supportList} showLoading={showLoading} setShowLoading={setShowLoading} issueTypeList={issueTypeList} privileges={privileges} />
          </Box>
        </div>
      </div>
    </>
  );
};

export default UserSupport;

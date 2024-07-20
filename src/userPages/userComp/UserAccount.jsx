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
import { CallGETAPI, CallPOSTAPI } from "../../helper/API";
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
// import TableSkeleton from "./skeleton/table/TableSkeleton";
import { useSelector, useDispatch } from "react-redux";
import AccountListTbl from "./AccountListTbl";
import { removeFilterData, removePayloadData } from "../../redux/slices/AccountListFilter";
import TableSkeleton from "../../pages/accounts/skeleton/table/TableSkeleton";

const theme = createTheme();

const UserAccount = ({ setShowSidebar, isUser, privileges, setUserAccountId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLoading, setShowLoading] = React.useState(true);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccount, setFilterdAccount] = useState([]);
  const [openModel, setOpenModel] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const filterData = useSelector((state) => state.accountlistfilter.filterData);

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

  const getAccountsList = async (payloadData = {}) => {
    setShowLoading(true);

    if (Object.keys(filterData).length !== 0) {
      const allFieldsEmpty = Object.entries(payloadData).map(([key, value]) => {
        if (key === "allToggle") {
          return value !== false;
        } else if (key !== "aed" && key !== "training") {
          return value?.length !== 0;
        }
        return false;
      });

      let isTrue = false;
      for (const item of allFieldsEmpty) {
        if (item === true) {
          isTrue = true;
          break;
        }
      }

      if (!isTrue) {
        const accountsData = await CallGETAPI("account/account-list");
        if (accountsData?.status) {
          setAccounts(accountsData?.data?.data?.account);
        }
      } else {
        let results = await CallPOSTAPI(
          "account/filter-search-result-v3",
          payloadData
        );
        if (results?.status) {
          setAccounts(results?.data?.account_list);
        }
      }
      setShowLoading(false);
    } else {
    //   const accountsData = await CallGETAPI("account/account-list");
      const accountsData = await CallGETAPI("user/user-account-list-v1");

      if (accountsData?.status) {
        setAccounts(accountsData?.data?.data?.accountlist);
      }
    }

    // show loading false
    setShowLoading(false);
  };

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
  const payloadData = useSelector(
    (state) => state.accountlistfilter.payloadData
  );
  // check account listing on state value
  useEffect(() => {
    if (location?.state?.accountListings) {
      setTimeout(() => {
        setAccounts(location?.state?.accountListings);
      }, 1000);
    } else {
      setTimeout(() => {
        getAccountsList(payloadData);
      }, 1000);
    }

    return () => {
      // Anything in here is fired on component unmount.
      location.state = "";
    };
  }, [location]);

  const handleClearFilterData = async () => {
    dispatch(removeFilterData());
    dispatch(removePayloadData());
    navigate("/accounts-listing", {
      state: {
        accountListings: false,
      },
    });
  };

  return (
    <>
      {/* loading */}
      {showLoading && (
        <div className="showloading-table">
          {/* <TableSkeleton /> */}
        </div>
      )} 
        <>
          <div>
            {/* {filterData && Object.keys(filterData).length !== 0 ? (
              <>
                <FixedButton
                  className="btn-style-listing-cancel-filter"
                  onClick={handleClearFilterData}
                >
                  Clear Filter
                </FixedButton>
              </>
            ) : null} */}
            {/* <FixedButton
              className="btn-style-filter"
              onClick={handleDrawerOpen}
            >
              Advanced Filters
            </FixedButton> */}
            {/* <Drawer
              sx={{
                width: "300px",
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: "300px",
                  boxSizing: "border-box",
                },
              }}
              // variant="persistent"
              anchor="right"
              open={open}
              onClose={handleDrawerClose}
            > */}
              {/* filter component  */}
              {/* <Filter
                setaccounts={setAccounts}
                accountListingPage={true}
                setOpen={setOpen}
                setShowLoading={setShowLoading}
                getAccountsList={getAccountsList}
              /> */}
            {/* </Drawer> */}
          </div>
          <Snackbar
            open={openModel}
            autoHideDuration={3000}
            onClose={handleCloseModel}
          >
            <Alert
              severity="success"
              sx={{ width: "100%" }}
              onClose={handleCloseModel}
            >
              Record Deleted SuccessFully!!!
            </Alert>
          </Snackbar>
          <div className="mt-4" style={{ paddingInline: "45px" }}>
            <SubHeading
              hideNew={true}
              hideHierarchy={true}
              title={"Account Listing"}
              // newUrl="/new-account"
              newUrl="/admin-account"
              subHeading={true}
            />

            <div style={{ minHeight: "84.6vh" }}>
              <Box className="d-flex justify-content-center py-4">
                <AccountListTbl tableData={accounts} privileges={privileges} setUserAccountId={setUserAccountId} showLoading={showLoading} />
              </Box>
            </div>
          </div>
        </>
    </>
  );
};

export default UserAccount;

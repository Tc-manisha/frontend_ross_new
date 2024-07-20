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
import ContactListTbl from "./ContactListTbl";
import {
  AccountContactDetails,
  DecryptToken,
  fetchUserAccountContact,
} from "../../helper/BasicFn";
import { GetProfile, getPermission } from "../../helper/Common";
import Loading from "../../pages/accounts/Loading";

const UserContacts = ({ setShowSidebar }) => {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = React.useState(true);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccount, setFilterdAccount] = useState([]);
  const [openModel, setOpenModel] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [siteDataList, setsiteDataList] = useState([]);
  const [siteContactList, setSiteContactList] = useState([]);

  const privileges = getPermission();

  // let userData = GetProfile();// JSON.parse(localStorage.getItem("ross-profile"));
  let userData = DecryptToken();
  let account_id = userData?.account_id;
  let is_user;

  // fetch on load
  const fetchOnlaod = async () => {
    setShowLoading(true);
    if (is_user) {
      let contactData = await fetchUserAccountContact();
      setSiteContactList(contactData?.contact_list || []);
    } else {
      let ContactData = await AccountContactDetails(account_id);
      if (ContactData) {
        setSiteContactList(ContactData?.contact_list);
      }
    }
    setShowLoading(false);
  };

  useEffect(() => {
    fetchOnlaod();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

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

  const fetchLoad = async () => {
    setShowLoading(true);
    let result = await CallGETAPI("user/account-contact-list-v2");
    console.log(result);
    if (result?.status) {
      let siteData = result?.data?.data || [];
      console.log(siteData);
      setsiteDataList(siteData);
    }
    setShowLoading(false);
  };

  useEffect(() => {
    fetchLoad();
  }, []);

  const getAccountsList = async () => {
    const accountsData = await CallGETAPI("account/account-list");

    if (accountsData?.status) {
      setAccounts(accountsData?.data?.data?.account);
    }

    // show loading false
    setShowLoading(false);
  };

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
  useEffect(() => {
    if (location?.state?.accountListings) {
      setTimeout(() => {
        setAccounts(location?.state?.accountListings);
      }, 1000);
    } else {
      setTimeout(() => {
        getAccountsList();
      }, 1000);
    }

    return () => {
      // Anything in here is fired on component unmount.
      location.state = "";
    };
  }, [location]);

  return (
    <>
      {/* loading */}
      {showLoading && (
        <div className="showloading-table">
          {/* <TableSkeleton /> */}
          {/* <Loading /> */}
        </div>
      )}

      <div className="mt-4" style={{ paddingInline: "45px" }}>
        <SubHeading
          hideNew={true}
          hideHierarchy={true}
          title={"Contact Listing"}
          // newUrl="/new-account"
          //   newUrl="/admin-account"
          subHeading={true}
        />

        <div style={{ minHeight: "84.6vh" }}>
          <Box className="d-flex justify-content-center py-4">
            <ContactListTbl
              tableData={siteDataList?.contact_list}
              privileges={privileges}
              showLoading={showLoading}
              setShowLoading={setShowLoading}
            />
          </Box>
        </div>
      </div>
    </>
  );
};

export default UserContacts;

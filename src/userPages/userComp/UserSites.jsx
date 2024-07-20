import React, { useEffect, useState } from "react";
import { Alert, Box, Snackbar } from "@mui/material";
import { Button as FixedButton } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CallGETAPI } from "../../helper/API";
import Drawer from "@mui/material/Drawer";
import SubHeading from "../../components/header/SubHeading";
import Filter from "../../components/filter/";
import { createTheme } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import TableSkeleton from "../../pages/accounts/skeleton/table/TableSkeleton";
import SiteListTbl from "./SitelistTbl";
import { getPermission } from "../../helper/Common";

const UserSites = ({ setShowSidebar }) => {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = React.useState(true);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccount, setFilterdAccount] = useState([]);
  const [openModel, setOpenModel] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [siteDataList, setsiteDataList] = useState([]);

  const privileges = getPermission();

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
    let result = await CallGETAPI('user/user-site-list-v2');
    console.log(result)
    if (result?.status) {
      let siteData = result?.data?.data || [];
      console.log(siteData)
      setsiteDataList(siteData);
    }
    setShowLoading(false);
  }

  useEffect(() => {
    fetchLoad();
  },[])

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
        </div>
      )}

      <div className="mt-4" style={{ paddingInline: "45px" }}>
        <SubHeading
          hideNew={true}
          hideHierarchy={true}
          title={"Site Listing"}
          // newUrl="/new-account"
        //   newUrl="/admin-account"
          subHeading={true}
        />

        <div style={{ minHeight: "84.6vh" }}>
          <Box className="d-flex justify-content-center py-4">
            <SiteListTbl tableData={siteDataList} privileges={privileges} showLoading={showLoading} setShowLoading={setShowLoading}/>
          </Box>
        </div>
      </div>
    </>
  );
};

export default UserSites;

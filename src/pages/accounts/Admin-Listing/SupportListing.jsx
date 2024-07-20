import React, { useEffect, useState } from "react";
import { Alert, Box, Snackbar } from "@mui/material";
import { Button as FixedButton } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CallGETAPI } from "../../../helper/API";
import Drawer from "@mui/material/Drawer";
import SubHeading from "../../../components/header/SubHeading";
import Filter from "../../../components/filter/";
import { createTheme } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import TableSkeleton from "../../../pages/accounts/skeleton/table/TableSkeleton";
import SupportListTbl from "./SupportListTbl";
import { GetProfile, prepareOptions } from "../../../helper/Common";

const SupportListing = ({ setShowSidebar }) => {
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

  let userData =  GetProfile();//JSON.parse(localStorage.getItem("ross-profile"));
  let account_id = userData?.account_id;
  let contact_id = userData?.contact_id;

  // get support list
  const getSupportList = async (e) => {
    setShowLoading(true);
    const issueTypeResult = await CallGETAPI("user/all-issues-type");
    // const issueTypeResult = await CallGETAPI("admin/admin-support-list-v1");
    console.log(issueTypeResult);
    if (issueTypeResult?.status) {
      const issueTypes = issueTypeResult?.data?.issuesList;
      const allIssueTypes = prepareOptions(
        issueTypes,
        "issue_id",
        "issue_name"
      );
      setIssueTypeList(allIssueTypes);
    }

    // get support details
    const result = await CallGETAPI("admin/admin-support-list-v1");

    if (result?.status) {
      const resultData = result?.data?.ticketList;
      setSupportList(resultData);
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

  const location = useLocation();
  const showDelete = location?.state?.showDelete;

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

  const handleCloseModel = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenModel(false);
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

  return (
    <>
      {/* loading */}
      {showLoading && (
        <div className="showloading-table">
          <TableSkeleton />
        </div>
      )}

      {/*<div>
        <FixedButton className="btn-style-filter" onClick={handleDrawerOpen}>
          Advanced Filters
        </FixedButton>
        <Drawer
          sx={{
            width: "300px",
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: "300px",
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          <Filter
            setaccounts={setAccounts}
            accountListingPage={true}
            setOpen={setOpen}
          />
        </Drawer>
        </div>*/}
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
          title={"Support Listing"}
          // newUrl="/new-account"
          //   newUrl="/admin-account"
          subHeading={true}
        />

        <div style={{ minHeight: "84.6vh" }}>
          <Box className="d-flex justify-content-center py-4">
            <SupportListTbl
              tableData={supportList}
              issueTypeList={issueTypeList}
              showLoading={showLoading}
              setShowLoading={setShowLoading}
            />
          </Box>
        </div>
      </div>
    </>
  );
};

export default SupportListing;

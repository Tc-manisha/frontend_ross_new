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
import NoteListTbl from "./NoteListTbl";
import { GetProfile } from "../../../helper/Common";

const NoteListing = ({ setShowSidebar }) => {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = React.useState(true);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccount, setFilterdAccount] = useState([]);
  const [openModel, setOpenModel] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [siteDataList, setsiteDataList] = useState([]);
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  let type;

  let userData = GetProfile();//JSON.parse(localStorage.getItem("ross-profile"));
  // let userPositionArr = userData?.position.split(",");
  let account_id = userData?.account_id;
  let contact_id = userData?.contact_id;

  const fetchData = async () => {
    setShowLoading(true);
    try {
      // let sendUrl = 'notes/account-notes/' + account_id;
      let sendUrl = "admin/admin-notes-list-v1";

      if (type === "CONTACT") {
        sendUrl = `notes/contact-notes?account_id=${account_id}&contact_id=${contact_id}`;
      }

      if (type === "SITE") {
        sendUrl = `notes/site-notes?account_id=${account_id}&site_id=${site_id}`;
      }

      if (type === "INPERSON") {
        sendUrl = `notes/inperson-notes?account_id=${account_id}&inperson_id=${inperson_id}`;
      }

      let response = await CallGETAPI(sendUrl);
      let resultData = response?.data?.data || [];
      console.log(response);

      setNotesData(resultData);
      setShowLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
          title={"Notes Listing"}
          // newUrl="/new-account"
          //   newUrl="/admin-account"
          subHeading={true}
        />

        <div style={{ minHeight: "84.6vh" }}>
          <Box className="d-flex justify-content-center py-4">
            <NoteListTbl
              tableData={notesData}
              showLoading={showLoading}
              setShowLoading={setShowLoading}
            />
          </Box>
        </div>
      </div>
    </>
  );
};

export default NoteListing;

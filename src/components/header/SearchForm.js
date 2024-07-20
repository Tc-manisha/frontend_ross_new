import React, { useEffect, useState } from "react";
import { Form, Button as BButton, Button as BsButton } from "react-bootstrap";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Person2Icon from "@mui/icons-material/Person2";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { CallGETAPI, CallPOSTAPI } from "../../helper/API";
import "../../../src/global.css";
import {
  removeFilterData as removeListingFilter,
  removePayloadData as removeListingFilterPayload,
} from "../../redux/slices/AccountListFilter";
import {
  removeFilterData as removeEquipmentFilter,
  removePayloadData as removeEquipmentFilterPayload,
} from "../../redux/slices/AccountDetailsEquipmentFilter";
import {
  removeFilterData as removeEquipmentListingFilter,
  removePayloadData as removeEquipmentListingFilterPayload,
} from "../../redux/slices/EquipmentListingFilterSlice";
import {
  removeFilterData as removeAccessoryListingFilter,
  removePayloadData as removeAccessoryListingFilterPayload,
} from "../../redux/slices/AccessoryListingFilterSlice";
import { useDispatch } from "react-redux";
import ReportsModel from "../modals/ReportsModel";
import SwitchUserModel from "../modals/SwitchUserModel";
import AdminReportsModel from "../modals/AdminReportModel";
import { GetProfile, getPermission, getToken, setPermission } from "../../helper/Common";
import { DecryptToken } from "../../helper/BasicFn";
import { toast } from "react-toastify";
import Loading from "../../pages/accounts/Loading";

export default function SearchForm({ setLoading }) {
  const urlObject = new URL(window.location.href);
  const isUser = urlObject.searchParams.get("is_user");

  const navigat = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  // const open = Boolean(anchorEl);
  const [open, setOpen] = useState(false);
  const [contactId, setContactId] = useState(null);
  const [rossProfile, setRossProfile] = useState([]);
  const [openReports, setOpenReports] = useState(false);
  const [adminOpenReports, setAdminOpenReports] = useState(false);
  const [openSwitchUser, setOpenSwitchUser] = useState(false);
  const dispatch = useDispatch();
  const privileges = getPermission();
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  setLoading(showLoading);
  const user = DecryptToken();

  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleLogout = () => {
    const is_user = Number(sessionStorage.getItem("is_user")) || 0;
    if (is_user) {
      sessionStorage.removeItem("is_user");
      sessionStorage.removeItem("ross_token");
      sessionStorage.removeItem("ross_rtoken");
      // localStorage.removeItem("ross_token");
      // localStorage.removeItem("ross-profile");
    } else {
      sessionStorage.removeItem("is_user");
      sessionStorage.removeItem("ross_token");
      sessionStorage.removeItem("ross_rtoken");
      localStorage.removeItem("ross_token");
      localStorage.removeItem("ross-profile");
    }
    dispatch(removeListingFilter());
    dispatch(removeListingFilterPayload());
    dispatch(removeEquipmentFilter());
    dispatch(removeEquipmentFilterPayload());
    dispatch(removeEquipmentListingFilter());
    dispatch(removeEquipmentListingFilterPayload());
    dispatch(removeAccessoryListingFilter());
    dispatch(removeAccessoryListingFilterPayload());
    navigat("/");
  };

  useEffect(() => {
    let profiles = GetProfile();
    setRossProfile(profiles);
    if (profiles) {
      setContactId(profiles?.contact_id);
    }
  }, []);

  const handleSwitchSubAdmin = async (e) => {
    e.preventDefault();
    setShowLoading(true);

    const res = await CallGETAPI("auth/switch-admin");
    let token = res?.data?.token;
    let refresh_token = res?.data?.refreshtoken;
    if (!token) {
      return;
    }

    localStorage.setItem("ross_token", token);
    localStorage.setItem("ross_rtoken", refresh_token);

    const permission = res?.data?.permission;
    setPermission(permission);
    const redirectSubAdmin = permission?.includes("dashboard")
      ? "/dashboard"
      : "";
    navigate(redirectSubAdmin);
    setShowLoading(false);
  };

  const moveSubAdminToUser = async (e) => {
    e.preventDefault();
    let userData = GetProfile();
    setShowLoading(true);

    let payload = {
      account_id: userData?.account_id,
      contact_id: userData?.contact_id,
    };
    const response = await CallPOSTAPI("account/switch-user", payload);
    let token = response?.data?.token;
    let refresh_token = response?.data?.refreshtoken;
    if (!token) {
      return;
    }

    localStorage.setItem("ross_token", token);
    localStorage.setItem("ross_rtoken", refresh_token);

    let permission = response?.data?.permission;
    if (permission?.length > 0) {
      permission.includes("dashboard")
        ? navigate("/user-dashboard1")
        : permission.includes("site-tab")
        ? navigate("/user-listing/sites")
        : permission.includes("contact-tab")
        ? navigate("/user-listing/contacts")
        : permission.includes("equipment-tab")
        ? navigate("/user-listing/equipment")
        : permission.includes("notes-tab")
        ? navigate("/user-listing/notes")
        : permission.includes("support-tab")
        ? navigate("/user-listing/support")
        : // permission.includes("account-details") ?
          navigate("/user/Details");
      // ? navigate("/user/account-details/" + user.account_id)
      // : "";
    } else {
      navigate("/user-dashboard");
    }
    setShowLoading(false);
  };

  return (
    <>
      <div
        className="Navbar-Search"
        style={{ position: "relative", width: "100%" }}
      >
        {/* {Number(user?.user?.user_type) == 0 ? (<>  
                <div className='d-flex mx-auto Search-button'>
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        // className="me-2"
                        aria-label="Search"
                    />
                    <button className="btn btn-search text-white p-0" variant="outline-success">
                   <SearchIcon /> 
                    </button>
                </div>
                </>) : ""
                 }  */}

        <div
          className="d-flex align-items-right NavbarUserIconDiv"
          // onClick={(e) => handleClick(e)}
          onClick={handleClick}
          style={{ position: "relative", cursor: "pointer" }}
        >
          <Person2Icon sx={{ color: "white" }} fontSize="large" />

          <div style={{ color: "white" }} className="NavbarUserEmailDiv">
            <div> {user?.name}</div>
            <div className="Email">{user?.email}</div>
          </div>

          <ArrowDropDownIcon
            className="ArrowIcon"
            sx={{ color: "white" }}
            fontSize="large"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          />
        </div>
      </div>

      <Menu
        className="user-dropdown"
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          style: { position: "absolute", backgroundColor: "black" },
        }}
      >
        {parseInt(user?.user_type) === 2 ? (
          <>
            {user?.sub_admin == "Work as an Admin" ? (
              <>
                <MenuItem
                  onClick={(e) => {
                    moveSubAdminToUser(e);
                    handleClose();
                  }}
                >
                  User
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  onClick={(e) => {
                    handleSwitchSubAdmin(e);
                    handleClose();
                  }}
                >
                  Admin
                </MenuItem>
              </>
            )}
          </>
        ) : (
          <>{/* <MenuItem onClick={handleClose}>Admin</MenuItem> */}</>
        )}

        {user?.user_type > 1 ? (
          <>
            {" "}
            {/* <MenuItem
              onClick={() => {
                setOpenReports(true);
                handleClose();
              }}
            >
              Reports
            </MenuItem> */}
          </>
        ) : (
          <>
            <MenuItem
              onClick={() => {
                setAdminOpenReports(true);
                handleClose();
              }}
            >
              Reports
            </MenuItem>
          </>
        )}

        {user?.user_type > 1 ? (
          <>
            <MenuItem
              onClick={() => {
                navigate("/user-dashboard1/user-profile/" + user?.contact_id);
                handleClose();
              }}
            >
              Profile
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={""}> Profile</MenuItem>
          </>
        )}

        {(user?.user_type == 0 && user?.is_admin == true) ||
         (user?.user_type == 2 && user?.sub_admin != "" && privileges?.includes("switch-user"))  ? (
          <>
                <MenuItem
                  onClick={() => {
                    setOpenSwitchUser(true);
                    handleClose();
                  }}
                >
                  {" "}
                  Switch User{" "}
                </MenuItem>
              
          </>
        ) : ( <> {" "} </>  )}

        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {openReports && (
        <>
          <ReportsModel
            openReports={openReports}
            setOpenReports={setOpenReports}
            privileges={privileges}
          />
        </>
      )}

      {adminOpenReports && (
        <>
          <AdminReportsModel
            openReports={adminOpenReports}
            setOpenReports={setAdminOpenReports}
            // privileges={privileges}
          />
        </>
      )}

      {openSwitchUser && (
        <SwitchUserModel
          openSwitchUser={openSwitchUser}
          setOpenSwitchUser={setOpenSwitchUser}
        />
      )}
    </>
  );
}

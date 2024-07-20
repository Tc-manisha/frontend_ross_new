import React, { useState, useEffect, useRef } from "react";
import "./header.scss";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../../img/red-logo.svg";
// import RedLogo from '../../img/red-logo.png';
import RedLogo from "../../img/red-logo.svg";

import SearchForm from "./SearchForm";
import NavDropdown from "react-bootstrap/NavDropdown";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";

import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";
import SubHeading from "./SubHeading";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Button } from "@mui/material";
import { MenuLinks, UserMenuLinks } from "../../utils";
import SidebarLink from "../layout/SidebarLink";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material";
import Offcanvas from "react-bootstrap/Offcanvas";
import Loading from "../../pages/accounts/Loading";
import PermissionManagerMenu from "../../utils/PermissionManagerMenu";
import "../../../src/global.css";
import { CallGETAPI, CallPOSTAPI } from "../../helper/API";
import { GetProfile, getPermission } from "../../helper/Common";
import { DecryptToken } from "../../helper/BasicFn";
import { linkTabsPermission } from "../../helper/permission";

const drawerWidth = 200;
const theme = createTheme();

export default function Header({
  isSearch,
  title,
  sideMenubar,
  setSideMenubar,
  isUser,
}) {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openn = Boolean(anchorEl);
  const [open, setOpen] = React.useState(false);
  const wrapperRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const userPermission = [
    "accounts-listing",
    "account-details",
    "account-edit",
    "site-tab",
    "sites-new",
    "site-details",
    "site-details-edit",
    "contact-tab",
    "contacts-new",
    "contact-details",
    "contact-details-edit",
    "equipment-tab",
    "new-aed",
    "aed-details",
    "aed-edit",
    "move-aed",
    "assign-aed",
    "new-accessories",
    "move-accessory",
    "new-aed-checks",
    "aed-check-details",
    "aed-service-check",
    "service-check-details",
    "training-tab",
    "training-new",
    "training-details",
    "edit-training",
    "inperson-tab",
    "new-inperson",
    "inperson-details",
    "edit-inperson",
    "pops-tab",
    "new-pop",
    "pop-details",
    "pop-edit",
    "notes-tab",
    "new-note",
    "note-details",
    "edit-note",
    "email-tab",
    "support-tab",
    "new-support",
    "support-details",
    "edit-support",
    "documents-tab",
    "new-document",
    "document-details",
    "edit-document",
    "rfi-tab",
    "new-rfi",
    "rfi-details",
    "edit-rfi",
    "out-of-service",
    "support-respond",
    "support-reassign",
    "support-close",
    "pop-clone",
    "inperson-clone",
    "inperson-student-tab",
    "inperson-certification-tab",
    "inperson-instructor",
    "inperson-broadcast",
  ];

  const privileges = getPermission();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setSideMenubar(false);
  };

  useEffect(() => {
    // if(sideMenubar && open) {
    //   handleDrawerClose();
    // }
  }, []);

  const handleImageClick = () => {
    // setLoading(true);
    setTimeout(() => {
      // setLoading(false);
      user?.user_type === 3
        ? navigate("/user-dashboard1")
        : navigate("/dashboard");
    }, 2000);
  };

  const user = DecryptToken();
  function compareTitles(userMenuLinks) {
    for (let i = 0; i < userMenuLinks.length; i++) {
      if (privileges?.includes(userMenuLinks[i]?.privillage)) {
        return true;
      }
    }
    return false;
  }

  const result = compareTitles(UserMenuLinks);

  const userData = GetProfile();

  const moveSubAdminToUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    let userData = GetProfile();

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
  };

  return (
    <>
      {/* off canvas */}
      <div className="sidebar-main">
        <Offcanvas
          className="sidebar"
          show={open}
          onHide={handleDrawerClose}
          style={{ backgroundColor: "black" }}
        >
          {/* header */}
          <Offcanvas.Header style={{ justifyContent: "flex-end" }}>
            <IconButton
              onClick={handleDrawerClose}
              style={{ backgroundColor: "white" }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Offcanvas.Header>
          {/* main body */}
          <Offcanvas.Body>
            <List className="TabletSizeFont">
              {(Number(user?.user_type) === 0 ||
               (Number(user?.user_type) === 2 && user?.sub_admin != "")) ? <>
                {MenuLinks.map(
                    (e, index) => (
                        <SidebarLink
                          details={e}
                          setOpen={setOpen}
                          key={index}
                        />
                      )
                  )}</> : <></>}

               {((Number(user?.user_type) != 0 && (Number(user?.user_type) != 2) || (Number(user?.user_type) == 2 && user?.sub_admin == ""))) ? <> 
                {UserMenuLinks.map(
                    (e, index) =>
                      (e.title === "Instructor Calendar" ||
                        e.title === "Admin Calendar" ||
                        ((e.title === "Home" && user?.user_type === 3 && privileges?.includes("dashboard") ) || (e.title === "Home" && user?.user_type === 2 && user?.sub_admin == "" && privileges?.includes("dashboard")) ) ||
                        (((linkTabsPermission(userPermission) === 1) && (e.title === "Accounts") ) && ((user?.user_type === 3 ) || (user?.user_type === 2)) ) ||
                        (e.title === "Site Listing" &&
                        privileges?.includes(e.privillage)) ||
                        (e.title === "Equipment Listing" &&
                        privileges?.includes(e.privillage)) ||
                        (e.title === "Accessory Listing" &&
                        privileges?.includes(e.privillage)) ||
                        (e.title === "Contact Listing" &&
                        privileges?.includes(e.privillage)) ||
                        (e.title === "Note Listing" &&
                        privileges?.includes(e.privillage)) ||
                        (e.title === "Support Listing" &&
                        privileges?.includes(e.privillage))) && (
                        <SidebarLink
                          details={e}
                          setOpen={setOpen}
                          key={index}
                        />
                      )
                  )}
                  </>:""}

              {user?.user_type == 0  ? <PermissionManagerMenu setOpen={setOpen} /> :  <> </> }

            </List>
          </Offcanvas.Body>
        </Offcanvas>
      </div>

      {/* navbar */}
      <Navbar
        bg={isSearch ? "black" : "white"}
        expand="lg"
        className="Navbar"
        // style={{ padding: "0 45px 0 45px" }}
      >
        <Container fluid className="MainNavbarDiv">
          <Navbar.Brand href="#" className="d-flex">
            <div className="d-flex NavbarBrandDiv">
              {/* {user?.user_type > 1 ? "" : */}
              <div>
                <IconButton
                  color="primary"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  className="MenuIcon"
                  sx={{ mr: 2, ...(openn && { display: "none" }) }}
                >
                  <MenuIcon style={{ color: "white" }} />
                </IconButton>
              </div>
              {/* } */}
              <div className="Navbar-Brand-wrapper">
                <header className={"navbar-brand"}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <img
                        className="brand-img"
                        src={isSearch ? "/red-logo.svg" : "/red-logo.svg"}
                        // width="410px"
                        onClick={handleImageClick}
                      />
                    </div>

                    <div>
                      {isSearch ? <SearchForm setLoading={setLoading} /> : ""}
                    </div>
                  </div>
                </header>
              </div>
            </div>
          </Navbar.Brand>
        </Container>
      </Navbar>

      {isSearch ? (
        ""
      ) : (
        <Navbar style={{ background: "#0c71c3" }}>
          <Container fluid>
            <Navbar.Collapse id="bottom-navbar">
              <Nav className="ml-auto">
                <Nav.Link className="nav-link" href="#home">
                  Training
                </Nav.Link>
                <Link to={"/calendar"} className="nav-link nav-link">
                  Calendar
                </Link>
                <Link className="nav-link" to="/">
                  Login
                </Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      {userData?.sub_admin && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgb(12, 113, 195)",
            color: "white",
            padding: "2px 7px",
            borderRadius: "0px",
            width: "auto",
            maxWidth: "100%",
            marginLeft: "0px",
            marginBottom: "5px",
            fontSize: "10px",
          }}
        >
          <h6
            style={{
              margin: 0,
              marginRight: "10px",
              fontSize: "12px",
              marginLeft: "47%",
            }}
          >
            {userData?.sub_admin}
          </h6>
          <span
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              marginLeft: "10px",
            }}
            onClick={(e) => {
              moveSubAdminToUser(e);
            }}
          >
            &#10005;
          </span>
        </div>
      )}

      {loading && (
        <>
          <div className="showloading">
            <Loading />
          </div>
        </>
      )}
    </>
  );
}

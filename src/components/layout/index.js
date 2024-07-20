import React, { useState, useEffect } from "react";

import Footer from "../footer";
import Header from "../header";
import TopBar from "../header/TopBar";
import { Sidebar } from "..";

import {
  addEventListeners,
  removeEventListeners,
} from "../../utils/eventListenerUtil";
import LogoutModal from "../../pages/auth/LogoutModal";
import { useNavigate } from "react-router-dom";
import { Logout, RefreashToken } from "../../helper/BasicFn";

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import SubHeading from "../header/SubHeading";
import { MenuLinks } from "../../utils";
import SidebarLink from "./SidebarLink";
import { Button } from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollButton from "../ScrollButton";
import { getToken } from "../../helper/Common";
const drawerWidth = 200;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    background: "#fff",
    flexGrow: 1,
    padding: "0px",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Layout(props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [sideMenubar, setSideMenubar] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    setShowSidebar(props.withSidebar);
  }, [props.withSidebar]);

  let headerType = (
    <>
      <Header
        sideMenubar={sideMenubar}
        setSideMenubar={setSideMenubar}
        title={props.pageTitle}
        isSearch={true}
      />
    </>
  );

  if (props.pageTitle == "login" || props.pageTitle == "guest") {
    headerType = (
      <>
        <TopBar /> <Header title={props.pageTitle} isSearch={false} />
      </>
    );
  }

  const [isWarningModalOpen, setWarningModalOpen] = useState(false);

  const navigate = useNavigate();

  const logoutNow = () => {};

  useEffect(() => {
    handleDrawerClose();
    const isUser = Number(sessionStorage.getItem('is_user') || 0);// urlObject.searchParams.get("is_user");

    let token = getToken();
    if (!token) {
      return;
    }

    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    jsonPayload = jsonPayload;
    isUser == 1 ? sessionStorage.setItem("ross-profile", jsonPayload) : localStorage.setItem("ross-profile", jsonPayload);
    if (!token) { return; }
    
    const createTimeout1 = () =>
      setTimeout(() => {
        setWarningModalOpen(true);
      }, 2 * 60 * 60 * 1000);

    const createTimeout2 = () =>
      setTimeout(() => {
        // Implement a sign out function here
        Logout();
        window.location.href = "/";
      }, 10000);

    const listener = () => {
      if (!isWarningModalOpen) {
        clearTimeout(timeout);
        timeout = createTimeout1();
      }
    };

    // Initialization
    let timeout = isWarningModalOpen ? createTimeout2() : createTimeout1();

    addEventListeners(listener);

    // Cleanup
    return () => {
      removeEventListeners(listener);
      clearTimeout(timeout);
    };
  }, [isWarningModalOpen, navigate]);

  const handleCancel = () => {
    RefreashToken();
    setWarningModalOpen(false);
  };

  return (
    <>
      <div
        className="body-section"
        onClick={() => {
          handleDrawerClose();
          setSideMenubar(true);
        }}
      >
        <div className="body-header">{headerType}</div>
        <div className="body-content">
          <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* <AppBar position={'fixed'}  open={open}>
          <SubHeading title={props.pageTitle} handleDrawerOpen={handleDrawerOpen} open={open}/>
        </AppBar> */}

            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                },
              }}
              variant="persistent"
              anchor="left"
              open={open}
            >
              <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "ltr" ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>
              </DrawerHeader>
              <Divider />
              <List>
                {MenuLinks.map((e, index) => (
                  <SidebarLink details={e} key={index} />
                ))}
              </List>
              <Divider />
            </Drawer>
            <Main open={open}>
              <DrawerHeader />
              <main
                // className={`content-div ${showSidebar ? "col" : ""} `}
                className={` ${
                  showSidebar ? "main-layout col" : "main-layout"
                } `}
                // style={ props.pageTitle === "login" ? { minHeight: "86.6vh",paddingTop:'10vh' } : { marginBottom: "0.3vh",marginTop:'140px' } }
                style={
                  props.pageTitle === "login"
                    ? { minHeight: "86.6vh", paddingTop: "10vh" }
                    : { marginBottom: "0.3vh", minHeight: "82.5vh" }
                }
              >
                {props.children}
              </main>
            </Main>

            {isWarningModalOpen && (
              <LogoutModal
                isOpen={isWarningModalOpen}
                handleCancel={handleCancel}
                logoutNow={logoutNow}
                onRequestClose={() => setWarningModalOpen(false)}
              />
            )}
          </Box>
        </div>
        <Footer />
        <ToastContainer />
        <ScrollButton />
      </div>
    </>
  );
}

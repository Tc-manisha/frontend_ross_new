import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CallGETAPI } from "../../helper/API";
import { DecryptToken } from "../../helper/BasicFn";
import { getPermission } from "../../helper/Common";
import { handleAccount } from "../../helper/permission";
// import { getNavMenus } from "../../utils";

function SidebarLink({ details, setOpen }) {
  const navigate = useNavigate();
  const { Icon, title, link } = details;

  const handleAccountBtn = async (e) => {
    e.preventDefault();
    if (title === "Accounts") {
      const accountBasedLink = await handleAccount();
      navigate(accountBasedLink);
    } else {
      navigate(link);
    }
    setOpen(false);
  };

  return (
    <ListItem disablePadding onClick={(e) => handleAccountBtn(e)}>
      <ListItemButton>
        <Link to={link} className="nav-link">
          <ListItemText primary={title} />
        </Link>
      </ListItemButton>
    </ListItem>
  );
}

export default SidebarLink;

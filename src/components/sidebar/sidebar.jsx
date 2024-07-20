import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getNavMenus } from "../../utils";

const sidebar = () => {
  const navigate = useNavigate();
  return (
    <div style={{ width: "150px" }} className="bg-primary text-white px-3 pb-5">
      <ul className="list-unstyled bg-primary mt-3">
        {getNavMenus(navigate)?.map((item, i) => (
          <li
            className="py-1 fs-base "
            role={"button"}
            key={i}
          >
            <Link to={item.link} className="text-white nav-link" >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default sidebar;

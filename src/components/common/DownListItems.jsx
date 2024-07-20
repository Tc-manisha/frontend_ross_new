import React from "react";

const DownListItems = ({ items }) => {
  return (
    <ul className="list-unstyled bg-primary ">
      {items?.map((item, i) => (
        <li className="border-top px-2 py-1 " key={i}>
          <div className="w-max-contnet fs-base">{item}</div>
        </li>
      ))}
    </ul>
  );
};

export default DownListItems;

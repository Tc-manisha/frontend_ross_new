import React from "react";

const Button = ({ title, onClick, style, className="bg-primary" }) => {
  return (
    <button
      style={style ? {} : { ...style }}
      className={`border-0  text-white px-4 py-1 ${className} `}
      onClick={() => {
        onClick && onClick();
      }}
    >
      {title}
    </button>
  );
};

export default Button;

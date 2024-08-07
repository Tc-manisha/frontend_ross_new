import React, { useState } from "react";

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour 
         in place of 'smooth' */
    });
  };

  window.addEventListener("scroll", toggleVisible);

  return (
    <div
      className="scroll-btn pointer"
      style={{ display: visible ? "inline" : "none" }}
      onClick={scrollToTop}
    >
      <img src="/top-page.svg" alt="scroll-top" width={40} height={40} />
    </div>
  );
};

export default ScrollButton;

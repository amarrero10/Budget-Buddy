import React from "react";
import "./Footer.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";

function Footer() {
  return (
    <div className=" footer">
      <h2>Project made by Albert Marrero</h2>
      <p>Social Media Links:</p>
      <div className=" icons-container">
        <a href="https://github.com/amarrero10" rel="noreferrer" target="_blank" className="icon-a">
          <FaGithub className="icons" />
        </a>
        <a
          href="https://www.linkedin.com/in/albert-marrero-dev/"
          rel="noreferrer"
          target="_blank"
          className="icon-a"
        >
          <FaLinkedin className="icons" />
        </a>
        <a href="https://albert-dev.com/" rel="noreferrer" target="_blank" className="icon-a">
          <CgWebsite className="icons" />
        </a>
      </div>
    </div>
  );
}

export default Footer;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import $ from "jquery";

/* importing icons */
import togglearrow from "../../assets/icons/togglearrow.png";
import togglearrowtoggled from "../../assets/icons/togglearrowtoggled.png";
import mainlogo from "../../assets/icons/quest.png";
import starticon from "../../assets/icons/start.png";
import control from "../../assets/icons/control.png";
import devices from "../../assets/icons/devices.png";

import "../../../node_modules/font-awesome/css/font-awesome.min.css";
import "../../assets/css/style.css";
import "./SideNavbar.css";
import "../../assets/css/custom.css";


const SideNavbar = props => {
  const [left, setLeft] = useState(false);
  let url = props.location.pathname;
  url = url.split("/");

  let expandSideNavBar = () => {
    $(".sidebar").toggleClass("toggled");
    setLeft(!left);
  };

  return (
    <ul
      className="BEMSidebar navbar-nav bg-gradient-primary sidebar sidebar-dark accordion bg-blue toggled"
      id="accordionSidebar"
    >
     
      <NavLink
        exact
        to="/home"
      >
        <img
          src={mainlogo}
          alt="main logo"
          className={
            left ? "BEMSidebar__mainLogo" : "BEMSidebar__mainLogoToggled"
          }
        />
      </NavLink>
      <div className="BEMSidebar__toggleArrowImage">
        <img
          src={left ? togglearrow : togglearrowtoggled}
          alt="togglearrow"
          style={{ cursor: "pointer" }}
          onClick={() => expandSideNavBar()}
          className={
            left ? "BEMSidebar__toggleArrow" : "BEMSidebar__toggleArrowToggled"
          }
        />
      </div>
      <div className="BEMSidebar__category">MAIN MENU</div>

      <li className={"nav-item" + (url[1] === "saleCustomer" ? " active" : "")}>
        <NavLink exact to="/saleCustomer" className="BEMSidebar__sideLinks nav-link">
          <i>
            <img src={starticon} alt="start link" />
          </i>
          <span>Customer</span>
        </NavLink>
      </li>

      <li
        className={"nav-item" + (url[1] === "itemCategory" ? " active" : "")}
      >
        <NavLink
          exact
          to="/itemCategory"
          className="BEMSidebar__sideLinksDiff nav-link"
        >
          <img src={devices} alt="schedule link" />
          <span>Item Category</span>
        </NavLink>
      </li>

      <li className={"nav-item" + (url[1] === "item" ? " active" : "")}>
        <NavLink exact to="/item" className="BEMSidebar__sideLinks nav-link">
          <img src={control} alt="control link" />
          <span>Item</span>
        </NavLink>
      </li>      
    </ul>
  );
};

export default withRouter(SideNavbar);

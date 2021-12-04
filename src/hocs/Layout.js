import React from "react";
import SideNavbar from "../components/Navbar/SideNavbar";
import Navbar from "../components/Navbar/Navbar";
// import './Layout.css'
const layout = props => (
  <div id="wrapper">
    <SideNavbar />
    <div id="content-wrapper" className="d-flex flex-column">
      <Navbar />
      {props.children}
    </div>
  </div>
);

export default layout;

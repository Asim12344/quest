import React, { useState } from "react";
import { withRouter } from "react-router";
import $ from "jquery";
import dropdownarrow from "../../assets/icons/dropdown.png";
import "../../../node_modules/font-awesome/css/font-awesome.min.css";
import "../../assets/css/custom.css";
import "./Navbar.css";
import * as actionCreators from '../../store/actions/index';
import { connect } from 'react-redux';

const Navbar = props => {
    let url = props.location.pathname;
    url = url.split("/");

    const [showModel, setShowModel] = useState(false);
    let sideNavBar = () => {
        $(".sidebar").toggleClass("toggled");
    };

    return (
        <div id="">
            <nav className="BEMNavbar navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <button
                    onClick={() => sideNavBar()}
                    id="sidebarToggleTop"
                    className="btn btn-link d-md-none rounded-circle mr-3"
                >
                    <i className="fa fa-bars"></i>
                </button>
                <h1
                    id="page_title"
                    className="BEMNavbar__title h5 mb-0 font-weight-bolder title-font"
                >
                    {url[1] === "saleCustomer" && <span>Sale Customer Information</span>}
                    {url[1] === "itemCategory" && <span>Item Category</span>}
                    {url[1] === "item" && <span>Item</span>}
                    {url[1] === "login" && <span>Login Form</span>}
                </h1>
                {url[1] !== "login" && (
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown no-arrow">
                            <span
                                onClick={() => setShowModel(!showModel)}
                                className="nav-link dropdown-toggle"
                                id="userDropdown"
                                role="button"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <span className="user-profile-image"></span>
                                <span className="BEMNavbar__profilename ml-2 d-none d-lg-inline small">
                                    {localStorage.getItem('userName')}
                                </span>
                                <img src={dropdownarrow} alt="dropdown arrow" />
                            </span>
                            <div
                                className={
                                    "dropdown-menu dropdown-menu-right shadow animated--grow-in" +
                                    (showModel ? " show" : null)
                                }
                                aria-labelledby="userDropdown"
                            >
                                <span
                                    className="dropdown-item"
                                    data-toggle="modal"
                                    data-target="#logoutModal"
                                    onClick={() => {
                                        setShowModel(!showModel)
                                        props.logout()}
                                    }
                                >
                                    <i className="fa fa-sign-out fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Logout
                                </span>
                            </div>
                        </li>
                    </ul>
                )}
                
            </nav>
        </div>
    );
};
const mapDispatchToProps = dispatch =>  {
    return {
        logout: () => dispatch(actionCreators.logout()),
    }
  };
  

export default connect(null, mapDispatchToProps)(withRouter(Navbar));

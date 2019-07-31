
// import {Navbar} from 'react-bootstrap';
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import AuthService from '../AuthService';

class Navbar extends Component {
    constructor() {
        super();
        this.Auth = new AuthService();
    }

    showNavigation = () => {
        if (this.Auth.loggedIn()) {
            return (
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/profile">Profile</Link>
                    </li>
                    <li className="nav-item">
                        {/* this is not using the Link component to logout or user and then refresh the application to the start */}
                        <a className="nav-link" href="/" onClick={() => this.Auth.logout()}>Logout</a>
                    </li>
                </ul>
            );
        } else {
            return (
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/signup">Signup</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Login</Link>
                    </li>
                </ul>
            );
        }
    };

    render() {
        return (
            
            <nav className="main-menu">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li>
                        <Link className="nav-link" to="/">
                            <i className="fa fa-home fa-2x"></i>
                            <span className="nav-text">
                                Home
                        </span>
                        </Link>

                    </li>
                    <li className="has-subnav">
                        <Link className="nav-link" to="/About">
                            <i className="fa fa-laptop fa-2x"></i>
                            <span className="nav-text">
                                About
                        </span>
                        </Link>

                    </li>
                    <li className="has-subnav">
                        <Link className="nav-link" to="/Profile">
                            <i className="fa fa-user-circle-o fa-2x"></i>
                            <span className="nav-text">
                                My Product Page
                        </span>
                        </Link>

                    </li>
                    <li className="has-subnav">
                        <Link className="nav-link" to="/Login">
                            <i className="fa fa-sign-in"></i>
                            <span className="nav-text">
                                Log in
                        </span>
                        </Link>

                    </li>
                    <li className="has-subnav">
                        <Link className="nav-link" to="/Signup">
                            <i className="fa fa-sign-out fa-lg"></i>
                            <span className="nav-text">
                                Sign Up
                        </span>
                        </Link>

                    </li>
                    <li>
                        <br />
                        <br />
                        <Link className="nav-link" to="/">
                            <img src="./images/logotr.png" classname="center logo" alt="logo" width="60" height="60"></img>
                        </Link>
                    </li>
                </ul>

                <ul className="logout">
                    <li>
                        <Link className="nav-link" to="/" onClick={() => this.Auth.logout()}>
                            <i className="fa fa-power-off fa-2x"></i>
                            <span className="nav-text">
                                Logout
                        </span>
                        </Link>
                    </li>
                </ul>
            </nav>
            
        )
    }
}

export default Navbar;
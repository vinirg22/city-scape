import { Navbar as BootstrapNavBar, Nav } from 'react-bootstrap'
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
                <li className="has-subnav">
                    <Link className="nav-link" to="/Profile">
                        <i className="fa fa-user-circle-o fa-2x"></i>
                        <span className="nav-text">
                            My Product Page
                        </span>
                    </Link>

                </li>
            );
        } else {
            return ([
                <li className="has-subnav">
                    <Link className="nav-link" to="/Login">
                        <i className="fa fa-sign-in"></i>
                        <span className="nav-text">
                            Log in
                        </span>
                    </Link>

                </li>,
                <li className="has-subnav">
                    <Link className="nav-link" to="/Signup">
                        <i className="fa fa-sign-out fa-lg"></i>
                        <span className="nav-text">
                            Sign Up
                        </span>
                    </Link>

                </li>
            ]);
        }
    };

    showLogout = () => {
        if (this.Auth.loggedIn()) {

            return (
                <li>
                    <Link className="nav-link" to="/" onClick={() => this.Auth.logout()}>
                        <i className="fa fa-power-off fa-2x"></i>
                        <span className="nav-text">
                            Logout
                        </span>
                    </Link>
                </li>
            );
        }
    }

    render() {
        return (
            <div>

                <nav className="main-menu">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li>
                        <Link className="nav-link" to="/">
                        <img class="logo-center"src="/images/logo-crm-trns.png" alt="Girl in a jacket" width="60" height="60"></img>
                        </Link>
                        </li>
                        <br></br>
                        <li>
                            <Link className="nav-link" to="/">
                                <i className="fa fa-home fa-2x"></i>
                                <span className="nav-text">
                                    Home
                        </span>
                            </Link>

                        </li>
                        <li className="has-subnav">
                            <Link className="nav-link" to="/about">
                                <i className="fa fa-laptop fa-2x"></i>
                                <span className="nav-text">
                                    About
                        </span>
                            </Link>

                        </li>
                        {this.showNavigation()}
                    </ul>

                    <ul className="logout">
                        {this.showLogout()}
                        {/* <li>
                        <Link className="nav-link" to="/" onClick={() => this.Auth.logout()}>
                            <i className="fa fa-power-off fa-2x"></i>
                            <span className="nav-text">
                                Logout
                        </span>
                        </Link>
                    </li> */}
                    </ul>
                </nav>

                {/* MOBILE MENU */}

                <BootstrapNavBar className="mobNav" collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <BootstrapNavBar.Brand href="#home">E-merge</BootstrapNavBar.Brand>
                    <BootstrapNavBar.Toggle aria-controls="responsive-navbar-nav" />
                    <BootstrapNavBar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/about">About</Nav.Link>
                            <Nav.Link href="/profile">My page</Nav.Link>
                            <Nav.Link href="/login">Login</Nav.Link>
                            <Nav.Link href="/signup">Signup</Nav.Link>
                            <Nav.Link href="/logout">Logout</Nav.Link>
                        </Nav>
                    </BootstrapNavBar.Collapse>
                </BootstrapNavBar>
            </div>
        )
    }
}

export default Navbar;
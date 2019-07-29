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
            <nav class="main-menu">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="fa fa-bars"></span>
                </button>
                <ul>
                    <li>
                        <a href="/">
                            <i class="fa fa-home fa-2x"></i>
                            <span class="nav-text">
                                Home
                        </span>
                        </a>

                    </li>
                    <li class="has-subnav">
                        <a href="/About">
                            <i class="fa fa-laptop fa-2x"></i>
                            <span class="nav-text">
                                About
                        </span>
                        </a>

                    </li>
                    <li class="has-subnav">
                        <a href="/Login">
                            <i class="fa fa-sign-in"></i>
                            <span class="nav-text">
                                Log in
                        </span>
                        </a>

                    </li>
                    <li class="has-subnav">
                        <a href="/Signup">
                            <i class="fa fa-sign-out fa-lg"></i>
                            <span class="nav-text">
                                Sign Up
                        </span>
                        </a>

                    </li>
                </ul>

                <ul class="logout">
                    <li>
                        <a className="nav-link" href="/" onClick={() => this.Auth.logout()}>
                            <i class="fa fa-power-off fa-2x"></i>
                            <span class="nav-text">
                                Logout
                        </span>
                        </a>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Navbar;
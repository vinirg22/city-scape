import React, { Component } from 'react';
import './App.css';
import axios from 'axios';



class Home extends Component {

    render() {
        console.log(process.env.REACT_APP_SECRET_CODE);
        return (
            <div className="hero-image">
                <img class="hero-image fluid" src="../images/Home-header.png" alt="header" />
                <div className="hero-text">
                    <div class="wrap">
                        <div class="search">
                            <input type="text" class="searchTerm" placeholder="What are you looking for?" />
                            <button type="submit" class="searchButton">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>





        );
    }
}

export default Home;
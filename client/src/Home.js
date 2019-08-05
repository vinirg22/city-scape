import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import AuthService from './components/AuthService';
import './App.css';
import API from './utils/API';

class Home extends Component {
    constructor() {
        super();
        this.Auth = new AuthService();
        this.state = {
            keyword: "",
            products: []
        };
    }

    productRender = true;

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    handleKeyDown = event => {
        if (event.key === 'Enter') {
            console.log('Enter pressed');
            this.submitSearch();
        }
    }

    submitSearch = event => {
        if (document.body.style.cursor === "wait") {
            console.log("searching ....");
            return;
        }
        document.body.style.cursor = "wait";


        var searchTerm = this.state.keyword.replace(/ +/g, "+");

        this.productRender = false;
        API.scrapeProduct(searchTerm)
            .then(res => {

                // check if duplicate items
                var uItems = [];
                for (let i = 0; i < res.data.length - 1; i++) {
                    var found = false;
                    for (let j = i + 1; j < res.data.length; j++) {
                        if (res.data[i].id === res.data[j].id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        // console.log(res.data[i]);
                        if (res.data[i].image && res.data[i].price && res.data[i].title)
                            uItems.push(res.data[i]);
                    }
                }
                this.setState({ products: uItems, keyword: "" });
                document.getElementsByClassName("search-result")[0].scrollIntoView({
                    behavior: 'smooth'
                });
                document.body.style.cursor = "default";
            })
            .catch(err => {
                document.body.style.cursor = "default";
                alert(err);
            });
    }

    saveSearch = (e, product) => {
        if (!this.Auth.loggedIn()) {
            this.props.history.replace('/login');
            return;
        }

        e.target.style.display = "none";
        e.target.nextSibling.style.display = "inline";

        product.userId = this.Auth.getProfile().id;
        console.log(product);
        API.saveProduct(product)
            .then((res) => {
                const products = this.state.products.filter(item => product.id !== item.id);

                this.setState({ products: products });
            })
    }

    render() {
        return (
            <div>
                 <div className="hero-image hero-image header-image fluid">

                <img id="headerImg " className="hero-image header2 fluid" src={process.env.PUBLIC_URL + "/images/header.png"} alt="header" />
                <video className="hero-image header-image fluid" autoPlay muted id="myVideo">
                    <source src={process.env.PUBLIC_URL + "/images/Video2.mp4"} type="video/mp4" />
                </video>
                <div className="hero-text" >
                    <div className="wrap clearfix">
                        <div className="search">
                            <input
                                value={this.state.keyword}
                                name="keyword"
                                type="text"
                                className="searchTerm"
                                placeholder="What are you looking for?"
                                onChange={this.handleInputChange}
                                onKeyDown={this.handleKeyDown}
                            />
                            <button type="submit" className="searchButton" onClick={this.submitSearch}>
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container search-result py-3">
                <div className="card-columns">
                    {this.state.products.map(product => (
                        <div className="card" key={product.id}>
                            <img src={product.image} className="card-img-top product-img" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">{product.title}</h5>
                                <div className="clearfix">
                                    <p className="card-text float-left">{product.price}</p>
                                    <button className="btn-add float-right" onClick={(e) => this.saveSearch(e, product)}>Add</button>
                                    <img className="save-gif float-right" src={process.env.PUBLIC_URL + "/images/blueloading.gif"} alt="loading" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        );
    }


}

export default Home;
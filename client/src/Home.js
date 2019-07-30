import React, { Component } from 'react';
import './App.css';
import API from './utils/API';

class Home extends Component {
    state = {
        keyword: "",
        products: []
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    submitSearch = event => {
        var searchTerm = this.state.keyword.replace(/ +/g, "+");

        API.scrapeProduct(searchTerm)
            .then(res => {
                console.log(res.data.length);
                console.log(res.data);

                this.setState({ products: res.data, keyword: "" });

                // this.props.history.replace('/');
            })
            .catch(err => alert(err));
    }

    render() {
        console.log(process.env.REACT_APP_SECRET_CODE);
        return (
            <div className="hero-image">
                <img className="hero-image fluid" src="../images/Home-header.png" alt="header" />
                <div className="hero-text">
                    <div className="wrap clearfix">
                        <div className="search">
                            <input
                                value={this.state.keyword}
                                name="keyword"
                                type="text"
                                className="searchTerm"
                                placeholder="What are you looking for?"
                                onChange={this.handleInputChange}
                            />
                            <button type="submit" className="searchButton" onClick={this.submitSearch}>
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className="container search-result py-3">
                        <h5>Products found...</h5>
                        <div className="card-columns">
                            {this.state.products.map(product => (
                                <div className="card">
                                    <img src={product.image} className="card-img-top product-img" alt="..." />

                                    <div className="card-body">
                                        <h5 className="card-title">{product.title}</h5>
                                        <div className="clearfix">
                                            <p className="card-text float-left">{product.price}</p>
                                            <button className="btn-add float-right">Add</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
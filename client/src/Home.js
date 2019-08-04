import 'bootstrap/dist/css/bootstrap.css';
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
    handleKeyDown = event => {
        if (event.key === 'Enter') {
            console.log('Enter pressed');
            {this.submitSearch()};
          }
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

    saveSearch = product => {

        API.saveProduct(product)
        .then((res) => {
            const products = this.state.products.filter(item => product.id !== item.id);
            
            this.setState({ products: products });
        })
    }

    

    render() {
        return (
            <div>
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
                        <h5>Products found...</h5>
                        <div className="card-columns">
                            {this.state.products.map(product => (
                                <div className="card">
                                    <img src={product.image} className="card-img-top product-img" alt="..." />

                                    <div className="card-body">
                                        <h5 className="card-title">{product.title}</h5>
                                        <div className="clearfix">
                                            <p className="card-text float-left">{product.price}</p>
                                            <button className="btn-add float-right" onClick={() => this.saveSearch(product)}>Add</button>
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
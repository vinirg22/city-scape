import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import './App.css';
import API from './utils/API';

class Home extends Component {
    state = {
        keyword: "",
        products: []
    };

    productRender = true;

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    submitSearch = event => {
        var searchTerm = this.state.keyword.replace(/ +/g, "+");

        this.productRender = false;
        API.scrapeProduct(searchTerm)
            .then(res => {
                console.log(res.data.length);
                console.log(res.data);

<<<<<<< HEAD
                this.setState({ products: res.data, keyword: "" });
=======
                // check if duplicate items
                var uItems = [];
                for(let i=0; i<res.data.length-1; i++) {
                    var found = false;
                    for(let j=i+1; j<res.data.length; j++) {
                        if (res.data[i].id === res.data[j].id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        uItems.push(res.data[i]);
                    }
                }

                this.setState({ products: uItems , keyword: "" });

>>>>>>> cc3211e71d3bd26954ab512813502f204cde0bbc
                // this.props.history.replace('/');
            })
            .catch(err => alert(err));
    }


    saveSearch = product => {

        API.saveProduct(product)
            .then((res) => {
                const products = this.state.products.filter(item => product.id !== item.id);
<<<<<<< HEAD
                this.setState({ products: products });

            })
        // this.scrolldown();
    }

componentDidUpdate(){
    if (this.state.products.length > 0 && !this.productRender){
        this.scrolldown();
        this.productRender = true;
        
    }
}
    scrolldown() {
        window.scroll({
            top: 500, // could be negative value
            left: 0,
            behavior: 'smooth'
        });
=======

                this.setState({ products: products });
            })
>>>>>>> cc3211e71d3bd26954ab512813502f204cde0bbc
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
                                />
                                <button type="submit" className="searchButton" onClick={this.submitSearch}>
                                    <i className="fa fa-search"></i>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="container search-result py-3">
<<<<<<< HEAD
                    <div className="card-columns">
                        {this.state.products.map(product => (
                            <div className="card">
=======
                    <h5>Products found...</h5>
                    <div className="card-columns">
                        {this.state.products.map(product => (
                            <div className="card" key={product.id}>
>>>>>>> cc3211e71d3bd26954ab512813502f204cde0bbc
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
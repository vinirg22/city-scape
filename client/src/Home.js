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
                        uItems.push(res.data[i]);
                    }
                }

                this.setState({ products: uItems, keyword: "" });

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
                 <div style={{
                        width: '1920px',
                        height: '1080px',
                       
                    }}>
                        <video autoplay muted loop poster="../images/video.mp4" src="../images/\video.mp4" />
                    </div>
                <div className="hero-image">
                    {/* <img className="hero-image fluid" src="../images/Home-header.png" alt="header" /> */}
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
                    <div className="card-columns">
                        {this.state.products.map(product => (
                            <div className="card" key={product.id}>
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
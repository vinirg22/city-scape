import React, { Component } from 'react';
import './App.css';
import API from './utils/API';


class Home extends Component {

    testSearch = () => {

        API.scrapeProduct()
            .then(res => {
                console.log(res.data.length);

                // this.props.history.replace('/');
            })
            .catch(err => alert(err));
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>Welcome You</h2>
                    <button type="button" className="btn btn-primary" onClick={this.testSearch}>Test</button>
                </div>
            </div>
        );
    }
}

export default Home;
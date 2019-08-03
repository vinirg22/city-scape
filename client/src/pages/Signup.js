import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthService from './../components/AuthService';
import API from './../utils/API';

class Signup extends Component {
  constructor() {
    super();
    this.Auth = new AuthService();
    this.state = {
      email: "",
      username: "",
      password: "",
      zipcode: ""
    }
  }

  componentWillMount() {
    if (this.Auth.loggedIn()) {
      this.props.history.replace('/');
    }
  }

  handleFormSubmit = event => {
    event.preventDefault();
    console.log(".... " + this.state.zipcode);
    API.validateZip(this.state.zipcode)
      .then(zipRes => {
        console.log(zipRes.data);
        if (zipRes.data.error)
          document.getElementById("login-error").innerText = zipRes.data.error;
        else {
          API.signUpUser(this.state.username, this.state.email, this.state.password, this.state.zipcode)
            .then(res => {
              // once the user has signed up
              // send them to the login page
              this.props.history.replace('/login');
            })
            .catch(err => {
              document.getElementById("login-error").innerText = err;
            });
        }
      })
      .catch(err => {
        document.getElementById("login-error").innerText = err;
      });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <div className="container ">

        <h1>Signup</h1>
        <form onSubmit={this.handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input className="form-control"
              placeholder="Username goes here..."
              name="username"
              type="text"
              id="username"
              onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address:</label>
            <input className="form-control"
              placeholder="Email goes here..."
              name="email"
              type="email"
              id="email"
              onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="pwd">Password:</label>
            <input className="form-control"
              placeholder="Password goes here..."
              name="password"
              type="password"
              id="pwd"
              onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="zipcode">Zipcode:</label>
            <input className="form-control"
              placeholder="Zipcode goes here..."
              name="zipcode"
              type="text"
              id="zipcode"
              onChange={this.handleChange} />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
          <span id="login-error"></span>

        </form>
        <p><Link to="/login">Go to Login</Link></p>
      </div>
    );
  }
}

export default Signup;
import React, { Component } from 'react';
import AuthService from './../components/AuthService';
import { Link } from 'react-router-dom';
import "../style/login.css"


class Login extends Component {
  constructor() {
    super();
    this.Auth = new AuthService();
  }

  componentWillMount() {
    if (this.Auth.loggedIn()) {
      this.props.history.replace('/');
    }
  }

  handleFormSubmit = event => {
    event.preventDefault();

    this.Auth.login(this.state.email, this.state.password)
      .then(res => {
        // once user is logged in
        // take them to their profile page
        // this.props.history.replace(`/profile`);
        window.location.reload('/profile');

      })
      .catch(err => {
        document.getElementById("login-error").innerText = err.response.data.message;
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
      <div className="container">
        <div className="container d-flex justify-content-center">
          <img className="logo-login" src="/images/logo-crm-trns.png" alt="logo" ></img>
        </div>
        <div className="container login-container p-4">
          <h1>Login</h1>
          <form onSubmit={this.handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address:</label>
              <input className="form-control input-login"
                placeholder="Email goes here..."
                name="email"
                type="email"
                id="email"
                onChange={this.handleChange} 
                required />
            </div>
            <div className="form-group">
              <label htmlFor="pwd">Password:</label>
              <input className="form-control input-login"
                placeholder="Password goes here..."
                name="password"
                type="password"
                id="pwd"
                onChange={this.handleChange}
                required />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            <span id="login-error"></span>
          </form>
          <hr/>
          <div className="clearfix mt-4">
            <p className="float-left mt-1">No Account?</p>
            <Link className="btn-login float-left" to="/signup">Create new account</Link>
          </div >
        </div >
      </div >

    );
  }
}

export default Login;
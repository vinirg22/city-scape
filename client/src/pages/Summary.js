import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import withAuth from './../components/withAuth';
import API from './../utils/API';
import { Link } from 'react-router-dom';

class Summary extends Component {

  state = {

  };

  componentDidMount() {
    var data = localStorage.getItem("productList");
    if (data === null) {
      return;
    }
    var pList = JSON.parse(data);
    console.log(pList);

  }

  function
  calc(event) {

    var x = Number(document.getElementById("first").value)
    var y = Number(document.getElementById("second").value)
    var z = Number(document.getElementById("third").value)
    var r = x + y - z;
    console.log(x + " " + y + " " + z);
    document.getElementById("result").value = r;
    event.preventDefault()
  }
  render() {
    return (
      <div className="container Profile">
        <p>Welcome: {this.state.username}</p>
        <Link to="/">Go home</Link>

        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-sm-6 col-md-4">
              One of three columns
              <form action="/action_page.php">
                Product Cost<br />
                <input id="first" type="number" name="cost" /><br />
                Shipping Cost<br />
                <input id="second" type="number" name="shipping" /><br />
                Current Price<br />
                <input id="third" type="number" name="price" /><br />Possible Profit<br />

                <input id="result" type="number" name="result" /><br /><br />
                <button onClick={this.calc}>Result</button>
              </form>
            </div>

          </div>
        </div>

      </div>


    )
  }
}

export default withAuth(Summary);
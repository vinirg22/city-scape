import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import withAuth from './../components/withAuth';
import API from './../utils/API';
import InputNumber from "../components/Input";
import "../style/Summary.css"



class Summary extends Component {

  state = {
    username: "",
    zipcode: "",
    products: []

  };

  componentDidMount() {
    API.getUser(this.props.user.id).then(res => {
      this.setState({
        username: res.data.username,
        zipcode: res.data.zipcode
      })
    });

    var data = localStorage.getItem("productList");
    if (data === null) {
      return;
    }
    var pList = JSON.parse(data);
    this.setState({ products: pList });

  }

  calcProfit = event => {
    event.preventDefault();

    this.clearInputError();

    if (!this.verifyInputNotEmpty("p-cost", "Product cost", "profit-error"))
      return;
    if (!this.verifyInputNotEmpty("p-shipping", "Shipping cost", "profit-error"))
      return;
    if (!this.verifyInputNotEmpty("p-price", "Current price", "profit-error"))
      return;

    var cost = Number(document.getElementById("p-cost").value)
    var shipping = Number(document.getElementById("p-shipping").value)
    var price = Number(document.getElementById("p-price").value)
    var profit = price - (cost + shipping);
    document.getElementById("p-result").value = profit.toFixed(2);
  }

  verifyInputNotEmpty(eleName, sName, errElem) {
    if (document.getElementById(eleName).value.trim())
      return true;

    document.getElementById(errElem).innerText = sName + " is required.";
    return false;
  }

  calcShipping = event => {
    event.preventDefault();

    this.clearInputError();

    if (!this.verifyInputNotEmpty("dim-w", "Item width", "shipping-error"))
      return;
    if (!this.verifyInputNotEmpty("dim-l", "Item length", "shipping-error"))
      return;
    if (!this.verifyInputNotEmpty("dim-h", "Item height", "shipping-error"))
      return;
    if (!this.verifyInputNotEmpty("p-weight", "Item weight", "shipping-error"))
      return;
    if (!this.verifyInputNotEmpty("p-org-zip", "Origin zip code", "shipping-error"))
      return;
    if (!this.verifyInputNotEmpty("p-dest-zip", "Destination zip code", "shipping-error"))
      return;



    var shippingInfo = {
      weight: document.getElementById("p-weight").value,
      weightUnit: document.getElementById("p-weightunit").value,
      dimWidth: document.getElementById("dim-w").value,
      dimLength: document.getElementById("dim-l").value,
      dimHeight: document.getElementById("dim-h").value,
      zipFrom: document.getElementById("p-org-zip").value,
      zipTo: document.getElementById("p-dest-zip").value
    }

    API.obtainShippingCost(JSON.stringify(shippingInfo))
      .then(res => {
        // console.log(res.data);
        if (res.data.error)
          document.getElementById("shipping-error").innerText = res.data.error;
        else
          document.getElementById("p-shipping").value = res.data;

        // this.setState({ products: res.data, keyword: "" });
      })
      .catch(err => {
        document.getElementById("shipping-error").innerText = err;
      });
  }

  clearInputError() {
    document.getElementById("profit-error").innerText = "";
    document.getElementById("shipping-error").innerText = "";
  }

  itemSelect = (e, product) => {

    this.clearInputError();
    document.getElementById("p-cost").value = "";
    document.getElementById("p-shipping").value = "";
    document.getElementById("p-price").value = "";
    document.getElementById("p-result").value = "";

    const objs = document.getElementsByClassName("sel-product-img");
    for (let i = 0; i < objs.length; i++) {
      objs[i].className = objs[i].className.replace(/\bimg-selected\b/g, "");
    }

    e.target.className += " img-selected";

    if (product.dimension) {
      var dimA = product.dimension.split("x");
      document.getElementById("dim-w").value = dimA[0].trim();
      document.getElementById("dim-l").value = dimA[1].trim();
      document.getElementById("dim-h").value = dimA[2].trim();
    } else {
      document.getElementById("dim-w").value = "";
      document.getElementById("dim-l").value = "";
      document.getElementById("dim-h").value = "";
    }
    if (product.weight) {
      document.getElementById("p-weight").value = product.weight.split(" ")[0].trim();
      document.getElementById("p-weightunit").value = product.weight.split(" ")[1].trim();

    } else {
      document.getElementById("p-weight").value = "";
    }
    if (product.price[0] === "$")
      document.getElementById("p-price").value = product.price.slice(1);
  }

  handleNumberInput = e => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Delete" || e.key === "Backspace")
      return true;
    if (e.target.value.length > 8) {
      e.preventDefault();
      return;
    }
    if (e.key === "." && e.target.value.indexOf(".") >= 0) {
      e.preventDefault();
      return;
    }
    if (".0123456789".indexOf(e.key) < 0)
      e.preventDefault();
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <div className="container Profile">
        <p>Welcome: {this.state.username}</p>

        <div className="container">
          <div className="row">
            <div className="col-md-4 col-sm-6">
              <div className="card">
                <div className="card-header">
                  Selected Items
                </div>
                <div className="card-body">
                  <div className="container sel-product-container">
                    {this.state.products.map(product => (
                      <div key={product.id} className="img-container mb-2" onClick={(e) => this.itemSelect(e, product)}>
                        <img src={product.image} className="card-img-top sel-product-img" alt="..." />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="row">
                <div className="card sel-calc-container">
                  <div className="card-header">
                    Shipping information (based on priority shipping)
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="card float-left card-shipping">
                        <div className="card-body">
                          Dimension (inches)<br />
                          W:<InputNumber id="dim-w" className="p-dimension" onKeyDown={this.handleNumberInput} />
                          H:<InputNumber id="dim-l" className="p-dimension" onKeyDown={this.handleNumberInput} />
                          D:<InputNumber id="dim-h" className="p-dimension" onKeyDown={this.handleNumberInput} />
                          <br />
                          Weight<br />
                          <InputNumber id="p-weight" className="mr-1" onKeyDown={this.handleNumberInput} />
                          <select id="p-weightunit" name="weight-unit">
                            <option value="pounds">pounds</option>
                            <option value="ounces">ounces</option>
                          </select>
                          <br />
                          <button className="btn btn-primary mt-2" onClick={this.calcShipping}>Calculate Shipping</button>
                        </div>
                      </div>
                      <div className="card card-shipping col-sm-4 ">
                        <div className="card-body">
                        Zip Code (From)<br />
                          <InputNumber id="p-org-zip"
                            onChange={this.handleInputChange}
                            name="zipcode"
                            value={this.state.zipcode}
                          /><br />
                          Zip Code (To)<br />
                          <InputNumber id="p-dest-zip"
                            onKeyDown={this.handleNumberInput}
                          /><br />
                          <p id="shipping-error" className="mt-3 mb-0"></p>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="card sel-calc-container mt-2">
                  <div className="card-header">
                    Profit calculation
                  </div>
                  <div className="card-body">
                    <form>
                      Product Cost<br />
                      <InputNumber id="p-cost" onKeyDown={this.handleNumberInput} /><br />
                      Shipping Cost<br />
                      <InputNumber id="p-shipping" readOnly /><br />
                      Current Price<br />
                      <InputNumber id="p-price" onKeyDown={this.handleNumberInput} /><br />

                      Possible Profit<br />
                      <input id="p-result" readOnly /><br /><br />
                      <div className="clearfix">
                        <button className="btn btn-success float-left" onClick={this.calcProfit}>Calculate Profit</button>
                        <p id="profit-error" className="text-center my-0"></p>
                      </div>

                    </form>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>


    )
  }
}

export default withAuth(Summary);
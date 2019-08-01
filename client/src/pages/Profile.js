import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import withAuth from './../components/withAuth';
import API from './../utils/API';
import { Link } from 'react-router-dom';
import "../style/Profile.css"

class Profile extends Component {

  state = {
    username: "",
    myProducts: []
  };

  proceedArr = [];

  componentDidMount() {
    API.getUser(this.props.user.id).then(res => {
      this.setState({
        username: res.data.username,
      })
    });
    API.getProduct()
      .then(res => {
        this.setState({ myProducts: res.data });
      });
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

  nextScreen = () => {
    // save to local storage
    localStorage.clear();
    localStorage.setItem("productList", JSON.stringify(this.proceedArr));
    this.props.history.replace('/summary')
  }

  obtainShippingInfo = () => {
    const idList = this.state.myProducts.map(item => item.id);
    var productStr = idList.join("|");

    // products is a long string consists of all product id concatinated with |
    API.obtainShippingInfo(productStr)
      .then((res) => {
        console.log(res);
        // check state.products with return data, if weight and dimension is available , show icon.
        var tempProd = this.state.myProducts;

        for (let i = 0; i < res.data.length; i++) {
          for (let j = 0; j < tempProd.length; j++) {
            if (tempProd[j].id === res.data[i].id) {
              // found product
              tempProd[j].weight = res.data[i].weight;
              tempProd[j].dimension = res.data[i].dimension;
              break;
            }
          }

        }

        this.setState({ myProducts: tempProd });
      })
  }

  renderShippingReady = (product) => {
    if (product.weight && product.dimension) {
      return (
        <img className="icon-shipping" src={process.env.PUBLIC_URL + "/images/shipping.png"} alt="shipping" />
      );
    }
  }

  handleCheckChange = (e, id) => {
    if (e.target.checked) {
      // add to array
      var myproducts = this.state.myProducts;
      for (let i=0; i<myproducts.length;i++) {
        if (id===myproducts[i].id) {
          this.proceedArr.push( myproducts[i]);
          break;
        }
      }
    } else {
      // delete from array
      this.proceedArr  = this.proceedArr.filter(item => id !== item.id);
    }
  }

  render() {
    return (
      <div className="container Profile">
        <p>Welcome: {this.state.username}</p>
        <Link to="/">Go home</Link>

        <div className="container mx-3">
          <div className="card">
            <div className="card-header myproduct-header clearfix">
              My products
              <button className="btn btn-success float-right ml-3" onClick={this.nextScreen}>
                Proceed to Calculate Shipping/Profit
              </button>
              <button className="btn btn-warning float-right" onClick={this.obtainShippingInfo}>
                Obtain Shipping information
              </button>
            </div>
            <div className="card-body">
              <div className="card-columns">
                {this.state.myProducts.map(product => (
                  <div className="card" key={product.id}>
                    <img src={product.image} className="card-img-top product-img" alt="..." />

                    <div className="card-body">
                      <h5 className="card-title">{product.title}</h5>
                      <div className="clearfix">
                        <p className="card-text float-left">{product.price}</p>
                        {this.renderShippingReady(product)}
                        <button className="btn-remove float-right" onClick={() => this.removeProduct(product.id)}>Remove</button>
                      </div>
                      <div className="checkbox-focus pl-2">
                        <input type="checkbox" name="item-focus" value="Bike" onChange={(e) => this.handleCheckChange(e, product.id)} /> Select to proceed.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withAuth(Profile);
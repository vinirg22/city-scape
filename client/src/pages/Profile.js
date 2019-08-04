import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import withAuth from './../components/withAuth';

// import Modal from '../components/Modal';
import API from './../utils/API';
// import { Link } from 'react-router-dom';
import "../style/Profile.css"

import MyModal from '../components/Modal';


class Profile extends Component {
  state = {
    username: "",
    myProducts: [],
    modalShow: false
  };

  componentDidMount() {
    API.getUser(this.props.user.id).then(res => {
      this.setState({
        username: res.data.username,
      })
    });

    API.getProduct(this.props.user.id)
      .then(res => {
        var data = localStorage.getItem("productList");
        if (data) {
          var pList = JSON.parse(data);
          for (let x = 0; x < pList.length; x++) {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].id === pList[x].id) {
                res.data[i].check = true;
                break;
              }
            }
          }
        }
        console.log("profile page getting data done..")
        console.log(res.data);
        this.setState({ myProducts: res.data });
      });
  }

  nextScreen = () => {
    var products = this.state.myProducts;

    var proceedArr = [];
    for (let i = 0; i < products.length; i++) {
      if (products[i].check) {
        proceedArr.push(products[i]);
      }
    }
    // save to local storage
    localStorage.setItem("productList", JSON.stringify(proceedArr));
    this.props.history.replace('/summary')
  }

  obtainShippingInfo = () => {

    // if products already have shipping info, skip them.
    var tempProd = this.state.myProducts;

    var idList = [];
    for (let i = 0; i < tempProd.length; i++) {
      if (!tempProd[i].weight || !tempProd[i].dimension) {
        console.log(tempProd[i].id + " got no info");
        idList.push(tempProd[i].id);
      }
    }

    if (idList.length === 0) {
      return;
    }

    var productStr = idList.join("|");
    console.log(productStr);

    // products is a long string consists of all product id concatinated with |
    API.obtainShippingInfo(productStr)
      .then((res) => {
        // check state.products with return data, if weight and dimension is available , show icon.

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
        console.log(".........");

        this.setState({ myProducts: tempProd, modalShow: false });

      })
    this.setState({ modalShow: true });
  }

  renderShippingReady = (product) => {
    if (product.weight && product.dimension) {
      return (
        <img className="icon-shipping" src={process.env.PUBLIC_URL + "/images/shipping.png"} alt="shipping" />
      );
    }
  }

  handleCheckChange = (e, id) => {

    var myproducts = this.state.myProducts;
    for (let i = 0; i < myproducts.length; i++) {
      if (id === myproducts[i].id) {
        myproducts[i].check = e.target.checked;
        this.setState({ myProducts: myproducts });
        break;
      }
    }
  }

  removeProduct = (e, id) => {
    e.target.style.display = "none";
    e.target.nextSibling.style.display = "inline";

    API.removeProduct(id)
      .then(res => {
        const products = this.state.myProducts.filter(item => id !== item.id);
        this.setState({ myProducts: products });
      })
      .catch(err => console.log(err));
  }



  render() {
    var prodStr = "Empty";
    if(this.state.myProducts && this.state.myProducts.length > 0){
      prodStr = "My products (" + this.state.myProducts.length
      + (this.state.myProducts.length > 1 ? " items)" : " item)");
    }
    return (
      <div className="container Profile">
        <p>Welcome: {this.state.username}</p>

        <div className="container mx-3">
          <div className="card">
            <div className="card-header myproduct-header clearfix">
              {prodStr}
              <button className="btn btn-success float-right ml-3" onClick={this.nextScreen}>
                Proceed to Calculate Shipping/Profit
              </button>

              {/* <-- modal btn --> */}
              <button className="btn btn-warning float-right" data-target="#myModal" onClick={this.obtainShippingInfo}>
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
                        <button className="btn-remove float-right" onClick={(e) => this.removeProduct(e, product.id)}>Remove</button>
                        <img className="save-gif float-right" src={process.env.PUBLIC_URL + "/../images/blueloading.gif"} alt="loading" />
                      </div>
                      <div className="checkbox-focus pl-2">
                        <input
                          type="checkbox"
                          name="item-focus"
                          value="Bike"
                          checked={product.check}
                          onChange={(e) => this.handleCheckChange(e, product.id)}
                        /> Select to proceed.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <MyModal
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
          data={this.state.myProducts}
          backdrop="static"
          keyboard={false}
        />
      </div>
    )
  }
}

export default withAuth(Profile);
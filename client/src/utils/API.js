import axios from 'axios';
export default {
  // Gets a single user by id

  scrapeProduct: (searchWord) => {
    return axios.get(`/api/products/scrape/${searchWord}`);
  },

  obtainShippingInfo: (products) => {
    return axios.get(`/api/products/scrapeDetail/${products}`);
  },

  obtainShippingCost: (info) => {
    return axios.get(`/api/products/shipping/${info}`);
  },

  validateZip: (zip) => {
    return axios.get(`/api/user/zip/${zip}`);
  },

  getUser: (id) => {
    return axios.get(`/api/user/${id}`);
  },
  // sign up a user to our service
  signUpUser: (username, email, password, zipcode) => {
    return axios.post('api/user/signup', {username: username, email: email, password: password, zipcode: zipcode});
  },

  saveProduct: (product) => {
    return axios.post('api/products/', product);
  },

  getProduct: (id) => {
    return axios.get('api/products/' + id);
  },

  removeProduct: (id) => {
    return axios.delete('api/products/' + id);
  }
 
};


const db = require("../models");
const axios = require("axios");
const XMLParser = require("./XML");

const auth = require("../config/auth");

const ZIP_URL = "http://production.shippingapis.com/ShippingAPI.dll?";

const ZIP_HEAD = 'API=CityStateLookup &XML=<CityStateLookupRequest USERID="' + process.env.USPS_KEY + '">'
    + '<ZipCode ID= "0"><Zip5>';

const ZIP_END = "</Zip5></ZipCode></CityStateLookupRequest>";

// Defining methods for the booksController
module.exports = {

    validateZip: function (req, res) {
        var url = ZIP_URL + ZIP_HEAD + req.params.id + ZIP_END;
        axios.get(url)
            .then(zipRes => {
                var info = XMLParser.XMLtoJSON(zipRes.data);
                if (info.CityStateLookupResponse.ZipCode.Error)
                    res.json({error: info.CityStateLookupResponse.ZipCode.Error.Description});
                else
                    res.json("success");
            })
            .catch(err => res.status(422).json(err));
    },

    signup: function (req, res) {
        db.User.create(req.body)
            .then(data => res.json(data))
            .catch(err => res.status(400).json(err));
    },

    login: function (req, res) {
        auth.logUserIn(req.body.email, req.body.password)
            .then(dbUser => res.json(dbUser))
            .catch(err => res.status(400).json(err));
    },

    getProfile: function (req, res) {
        db.User.findById(req.params.id).
            then(data => {
                if (data) {
                    res.json(data);
                } else {
                    res.status(404).send({ success: false, message: 'No user found' });
                }
            }).catch(err => res.status(400).send(err));
    }

}
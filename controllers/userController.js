const db = require("../models");

const auth = require("../config/auth");


// Defining methods for the booksController
module.exports = {

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
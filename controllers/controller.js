const express = require("express");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

var parser = require('fast-xml-parser');
var he = require('he');

const router = express.Router();

// Import the models to use its database functions.
// const db = require("../models");

function XMLtoJSON(xmlData) {
  var options = {
    attributeNamePrefix: "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName: "#text",
    ignoreAttributes: true,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    localeRange: "", //To support non english character in tag/attribute values.
    parseTrueNumberOnly: false,
    attrValueProcessor: a => he.decode(a, { isAttributeValue: true }),//default is a=>a
    tagValueProcessor: a => he.decode(a) //default is a=>a
  };

  console.log("XML valid : " + parser.validate(xmlData));
  var jsonObj = parser.parse(xmlData, options);

  console.log(jsonObj.RateV4Response.Package.Postage.SpecialServices);

}

// A GET route for scraping the echoJS website
router.get("/scrape", (req, res) => {
  // First, we grab the body of the html with axios

  // XMLtoJSON();

  axios.get("https://www.amazon.com/s?k=bluetooth+speaker").then((response) => {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    var numRec = $("div.s-result-item").length;
    console.log("num rec " + numRec);
    const arrObj = [];

    $("div.s-result-item").each(function (i, element) {
      // Save an empty result object
      const result = {};

      result.image = $(this)
        .find(".s-image")
        .attr("src");
      result.title = $(this)
        .find("span.a-size-medium.a-color-base.a-text-normal")
        .text();
      result.price = $(this)
        .find("span.a-offscreen").first()
        .text();

      arrObj.push(result);

    });

    // Send data to the client
    res.json(arrObj);

  })
    .catch(err => {
      console.log(err);
    });
});

// Export routes for server.js to use.
module.exports = router;

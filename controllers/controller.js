const express = require("express");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

var parser = require('fast-xml-parser');
var he = require('he');

// Import the models to use its database functions.
const db = require("../models");

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

const detailTags = [
  "div#detailBullets_feature_div",
  "table#productDetails_techSpec_section_1",
  "table#productDetails_detailBullets_sections1",
  "td.bucket .content"
];

module.exports = {

  scrapeDetail: function (req, res) {
    console.log("ScrapeDetail " + req.params.id);

    // axios.get("https://www.amazon.com/dp/" + req.params.id).then((response) => {
<<<<<<< HEAD

    /*  B07DD3W154
      B0779ZXQ9J
      B01I9OFGR0
      B07KX7BP43
      B07B9BNN24
      B072LNQBZT
      B01I9OED06
      B002UT92EY */
    axios.get("https://www.amazon.com/dp//B07JN74TJ2").then((response) => {
=======
    axios.get("https://www.amazon.com/dp/B07B9BNN24").then((response) => {
      // axios.get("https://www.amazon.com/dp/B072LNQBZT").then((response) => {
      // axios.get("https://www.amazon.com/dp/B002UT92EY").then((response) => {
>>>>>>> d6fd40c8daf60f5e009279700888cf0de13648bd
      const $ = cheerio.load(response.data);
      for (let i = 0; i < detailTags.length; i++) {
        let numRec = $(detailTags[i]).length;
        if (numRec > 0) {
          console.log("found " + numRec + " " + detailTags[i]);
          let sdim = "", weight = "", lable = "";
          $(detailTags[i]).each(function (i, element) {
            switch ($(this).children().get(0).name) {
              case "tbody":
                $(this).find('tr').each(function (index, element) {
                  label = $(element).find("th").text().trim();
                  switch (label) {
                    case "Product Dimensions":
                    case "Package Dimensions":
                      sdim = $(element).find("td").text().trim();
                      break;
                    case "Item Weight":
                    case "Shipping Weight":
                      weight = $(element).find("td").text().trim();
                      break;
                  }
                  if (weight && sdim) {
                    return false;
                  }
                });
                console.log("found : " + sdim + " | " + weight);
                break;
              case "ul":
                console.log("found ul tag");
                $(this).find('li').each(function (index, element) {
                  // console.log(index + " " + $(element).text().trim())
                  var item = $(element).text().split(":");
                  label = item[0].trim();
                  switch (label) {
                    case "Product Dimensions":
                    case "Package Dimensions":
                      sdim = item[1].trim();
                      break;
                    case "Item Weight":
                    case "Shipping Weight":
                      weight = item[1].trim();
                      break;
                  }
                  if (weight && sdim) {
                    return false;
                  }
                });
                console.log("found : " + sdim + " | " + weight);
                break;
            }
          });
          break;
        }

<<<<<<< HEAD
      }
    })
      // .catch(err => {
      //   console.log(err);
      // });
=======
      // Now, we grab every h2 within an article tag, and do the following:
      var numRec = $("td.bucket").length;
      console.log("rec found : " + numRec);
      if (numRec === 1) {
        $("td.bucket").each(function (i, element) {
          var dimension = $(this)
            .find("li").eq(0)
            .html().trim();
          var weight = $(this)
            .find("li").eq(1)
            .html().trim();
          console.log("dimension " + dimension);
          console.log("weight " + weight);
        });

      } else {
        // div.detailBullets_feature_div
        // productDetails_techSpec_section_1
        // td.bucket.content
        console.log("else found " + $("table#productDetails_detailBullets_sections1").length);
        $("table#productDetails_detailBullets_sections1").each(function (i, element) {
          var dimension = $(this)
            .find("td").eq(0)
            .html().trim();
          var weight = $(this)
            .find("td").eq(1)
            .html().trim();
          console.log("dimension " + dimension);
          console.log("weight " + weight);
        });

      }
    });
    // .catch(err => {
    //   console.log(err);
    // });
>>>>>>> d6fd40c8daf60f5e009279700888cf0de13648bd

  },
  scrape: function (req, res) {
    // A GET route for scraping the echoJS website
    // First, we grab the body of the html with axios

    // XMLtoJSON();
    console.log(req.params.id);

    // axios.get("https://www.amazon.com/s?k=bluetooth+speaker").then((response) => {
    axios.get("https://www.amazon.com/s?k=" + req.params.keyword).then((response) => {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      const $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      var numRec = $("div.s-result-item").length;
      console.log("num rec " + numRec);
      const arrObj = [];

      $("div.s-result-item").each(function (i, element) {
        // Save an empty result object
        const result = {};

        result.id = $(this).
          attr("data-asin");

        result.image = $(this)
          .find(".s-image")
          .attr("src");
        result.title = $(this)
          .find("span.a-size-medium.a-color-base.a-text-normal")
          .text();

        if (!result.title)
          result.title = $(this).find("span.a-size-base-plus.a-color-base.a-text-normal").text();

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
  },

  saveProduct: function (req, res) {
    console.log(req.body);
    db.Product.create(req.body)
      .then(data => res.json(data))
      .catch(err => res.status(400).json(err));
  },

  findProduct: function (req, res) {

  },

  deleteProduct: function (req, res) {

  },


};

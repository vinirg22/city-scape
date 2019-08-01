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
/*  B07DD3W154
  B0779ZXQ9J
  B01I9OFGR0
  B07KX7BP43
  B07B9BNN24
  B072LNQBZT
  B01I9OED06
  B002UT92EY */

module.exports = {

  getLegitWeight: function (weightStr) {
    return weightStr.split("(")[0].trim();

  },
  getLegitDimension: function (dimStr) {

  },

  scrapeDetail: function (req, res) {
    console.log("ScrapeDetail " + req.params.id);
    const idList = req.params.id.split("|");
    console.log(idList);

    var numCompleted = 0;
    var shippingInfoArr = [];
    for (let x = 0; x < idList.length; x++) {

      axios.get("https://www.amazon.com/dp/" + idList[x]).then((response) => {

        const $ = cheerio.load(response.data);
        for (let i = 0; i < detailTags.length; i++) {
          let numRec = $(detailTags[i]).length;
          if (numRec > 0) {
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
                  break;
                case "ul":
                  $(this).find('li').each(function (index, element) {
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
                  break;
              }
            });
            console.log(x + " " + idList[x] + " weight:" + weight + " , dimension: " + sdim);
            if (weight && sdim) {
              var shippingInfo = {
                id: idList[x],
                weight: weight.split("(")[0].trim(),
                dimension: sdim.split("inch")[0].trim()
              };
              shippingInfoArr.push(shippingInfo);
            }
            numCompleted++;
            if (numCompleted === idList.length) {
              console.log("obtain all shipping info");
              for (let j = 0; j < shippingInfoArr.length; j++) {
                console.log(shippingInfoArr[j]);
                db.Product.findOneAndUpdate(
                  { id: shippingInfoArr[j].id },
                  {
                    $set: {
                      weight: shippingInfoArr[j].weight,
                      dimension: shippingInfoArr[j].dimension
                    }
                  }
                )
                  .then((dbUpdate) => {
                    // If the User was updated successfully, send it back to the client
                    console.log("update success " + dbUpdate);

                  })
              }

              // db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })

              res.json(shippingInfoArr);
            }

            break;
          }

        }
      })
      // .catch(err => {
      //   console.log(err);
      // });
    }

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
    db.Product.create(req.body)
      .then(data => res.json(data))
      .catch(err => res.status(400).json(err));
  },

  findProduct: function (req, res) {
    db.Product
      .find(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  deleteProduct: function (req, res) {

  },

};

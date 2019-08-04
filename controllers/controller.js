const express = require("express");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const { ProxyCrawlAPI } = require('proxycrawl');
const pcAPI = new ProxyCrawlAPI({ token: process.env.PROXY_TOKEN });
const axios = require("axios");
const cheerio = require("cheerio");
const XMLParser = require("./XML");



// Import the models to use its database functions.
const db = require("../models");

const detailTags = [
  "div#detailBullets_feature_div",
  "table#productDetails_techSpec_section_1",
  "table#productDetails_detailBullets_sections1",
  "td.bucket .content"
];

const USPS_URL = "http://production.shippingapis.com/ShippingAPI.dll?";

const USPS_HEAD = 'API=RateV4&XML=<RateV4Request USERID="' + process.env.USPS_KEY + '">'
  + '<Revision>2</Revision><Package ID="1ST"><Service>PRIORITY</Service>'
  + '<FirstClassMailType>FLAT</FirstClassMailType>';
const USPS_END = "<Machinable>true</Machinable></Package></RateV4Request>";

module.exports = {

  calcShipping: function (req, res) {
    var info = JSON.parse(req.params.info);

    var url = USPS_URL + USPS_HEAD;

    url += "<ZipOrigination>" + info.zipFrom + "</ZipOrigination>";
    url += "<ZipDestination>" + info.zipTo + "</ZipDestination>";
    if (info.weightUnit === "pounds") {
      url += "<Pounds>" + info.weight + "</Pounds>";
      url += "<Ounces>0</Ounces>";
    } else {
      url += "<Pounds>0</Pounds>";
      url += "<Ounces>" + info.weight + "</Ounces>";
    }
    url += "<Container/><Size>REGULAR</Size>";
    url += "<Width>" + info.dimWidth + "</Width>";
    url += "<Length>" + info.dimLength + "</Length>";
    url += "<Height>" + info.dimHeight + "</Height>";
    url += USPS_END;

    axios.get(url)
      .then(shippingRes => {
        var info = XMLParser.XMLtoJSON(shippingRes.data);
        if (info.RateV4Response.Package.Error)
          res.json({ error: info.RateV4Response.Package.Error.Description });
        else
          res.json(info.RateV4Response.Package.Postage.Rate)
      })
      .catch(err => {
        console.log("...... error");
        console.log(err);
        res.status(422).json(err)
      });

  },

  scrapeDetail: function (req, res) {
    console.log("ScrapeDetail " + req.params.id);
    const idList = req.params.id.split("|");
    console.log(idList);

    // const idList = [ "B003B6S36S"];

    var numCompleted = 0;
    var shippingInfoArr = [];
    for (let x = 0; x < idList.length; x++) {
      // pcAPI.get("https://www.amazon.com/dp/" + idList[x]).then((response) => {
      //   const $ = cheerio.load(response.body);
      axios.get("https://www.amazon.com/dp/" + idList[x]).then((response) => {
        const $ = cheerio.load(response.data);
        var i = 0;
        for (i = 0; i < detailTags.length; i++) {
          let numRec = $(detailTags[i]).length;
          if (numRec > 0) {
            let sdim = "", weight = "";
            $(detailTags[i]).each(function (i, element) {
              switch ($(this).children().get(0).name) {
                case "tbody":
                  $(this).find('tr').each(function (index, element) {
                    // label = $(element).find("th").text().trim();
                    switch ($(element).find("th").text().trim()) {
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
                case "table":
                  $(this).find('li').each(function (index, element) {
                    var item = $(element).text().split(":");
                    // label = item[0].trim();
                    switch (item[0].trim()) {
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
            console.log("...  then " + idList[x] + " " + numCompleted + " - " + idList.length);
            if (numCompleted === idList.length) {
              console.log("obtain all shipping info");
              for (let j = 0; j < shippingInfoArr.length; j++) {
                db.Product.findOneAndUpdate(
                  { id: shippingInfoArr[j].id },
                  {
                    $set: {
                      weight: shippingInfoArr[j].weight,
                      dimension: shippingInfoArr[j].dimension
                    }
                  }
                );
              }

              res.json(shippingInfoArr);
            }

            break;
          }

        }
        if (i === detailTags.length) {
          // found nothing
          numCompleted++;
          console.log(".. found none " + idList[x] + " " + numCompleted + " " + idList.length);

          if (numCompleted === idList.length) {
            res.json(shippingInfoArr);
          }
        }
        console.log("..... " + i);
      })
        .catch(err => {
          // console.log(err);
          numCompleted++;
          console.log(".. catch " + idList[x] + " " + numCompleted + " " + idList.length);
          if (numCompleted === idList.length) {
            res.json(shippingInfoArr);
          }
        });
    }
  },

  scrape: function (req, res) {
    // A GET route for scraping the echoJS website
    // First, we grab the body of the html with axios

    axios.get("https://www.amazon.com/s?k=" + req.params.keyword).then((response) => {
      const $ = cheerio.load(response.data);
    // pcAPI.get("https://www.amazon.com/s?k=" + req.params.keyword).then((response) => {
    //   if (response.statusCode === 200 && response.originalStatus === 200) {  // by proxycrawl api
    //     const $ = cheerio.load(response.body);

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
      // } else {
      //   console.log('Failed: ', response.statusCode, response.originalStatus);
      // }

    })
      .catch(err => {
        console.log(err);
      });
  },

  saveProduct: function (req, res) {
    // find weight and dimension before saving.
    console.log(req.body);
    console.log("searching ... " + req.body.id);
    // pcAPI.get("https://www.amazon.com/dp/" + req.body.id).then((response) => {
    //   const $ = cheerio.load(response.body);
    axios.get("https://www.amazon.com/dp/" + req.body.id).then((response) => {
      const $ = cheerio.load(response.data);
      var i = 0;
      for (i = 0; i < detailTags.length; i++) {
        console.log("... " + detailTags[i]);
        let numRec = $(detailTags[i]).length;
        if (numRec > 0) {
          let sdim = "", weight = "";
          $(detailTags[i]).each(function (i, element) {
            switch ($(this).children().get(0).name) {
              case "tbody":
                $(this).find('tr').each(function (index, element) {
                  // label = $(element).find("th").text().trim();
                  switch ($(element).find("th").text().trim()) {
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
              case "table":
                $(this).find('li').each(function (index, element) {
                  var item = $(element).text().split(":");
                  // label = item[0].trim();
                  switch (item[0].trim()) {
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

          info = req.body;
          if (weight && sdim) {
            info.weight = weight.split("(")[0].trim();
            info.dimension = sdim.split("inch")[0].trim();
          }
          console.log("saving .. found " + detailTags[i]);
          console.log(info);

          db.Product
            .create(info)
            .then(data => res.json(data))
            .catch(err => res.status(400).json(err));


          break;
        }

      }
      if (i === detailTags.length) {
        // found nothing
        console.log("saving ..");
        console.log(req.body);
        db.Product
          .create(req.body)
          .then(data => res.json(data))
          .catch(err => res.status(400).json(err));
      }
    })
      .catch(err => {
        console.log(err);
        // found nothing
        console.log("saving ..");
        console.log(req.body);
        db.Product
          .create(req.body)
          .then(data => res.json(data))
          .catch(err => res.status(400).json(err));
      });
  },

  findProduct: function (req, res) {
    console.log("search ...   userid : " + req.params.id);
    req.params.id
    db.Product
      .find({ userId: req.params.id })
      .then(dbProduct => res.json(dbProduct))
      .catch(err => res.status(422).json(err));
  },

  deleteProduct: function (req, res) {
    db.Product.findOne({ id: req.params.id }, function (err, product) {
      if (err) { throw err; }
      console.log("Product found, now removing: " + product);
      product.remove();
      console.log("Product removed");
      res.json(product);
    });
    // db.Product
    //   .findById({ id: req.params.id })
    //   .then(dbProduct => dbProduct.remove())
    //   .then(dbProduct => res.json(dbProduct))
    //   .catch(err => res.status(422).json(err));
  }
};

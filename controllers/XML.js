var parser = require('fast-xml-parser');
var he = require('he');

module.exports = {

XMLtoJSON: function(xmlData) {
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
  
    // console.log(jsonObj.RateV4Response.Package.Postage.SpecialServices);
    return jsonObj;
  
  }
};
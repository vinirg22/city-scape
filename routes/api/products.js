const router = require("express").Router();
const controller = require("../../controllers/controller");

router.route("/shipping/:info")
  .get(controller.calcShipping);
  
router.route("/scrape/:keyword")
  .get(controller.scrape);

router.route("/scrapeDetail/:id")
  .get(controller.scrapeDetail);

router.route("/")
  .post(controller.saveProduct);
  
  router.route("/:id")
  .get(controller.findProduct)
  .delete(controller.deleteProduct);
    
// .delete(controller.remove);
module.exports = router;

const router = require("express").Router();
const controller = require("../../controllers/controller");

// Matches with "/api/books"
// router.route("/")
//   .get(controller.findAll)
//   .post(controller.create);

// // Matches with "/api/books/:id"
router.route("/scrape/:keyword")
  .get(controller.scrape);

router.route("/scrapedetail/:id")
  .get(controller.scrapeDetail);
  
  // .delete(controller.remove);
module.exports = router;

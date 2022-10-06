const express = require("express");
const router = express.Router();
const urlController = require("../controller/urlShorter");

//=========testApi=========
router.get("/test", function (req, res) {
  res.send("Hello Work");
});

//shortUrl API
router.post("/url/shorten", urlController.urlShort);

//Using Cache
router.get("/:urlCode", urlController.getLinkFromCache);

module.exports = router;

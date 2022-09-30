const express = require("express");
const router = express.Router();
const urlController = require("../controller/urlShorter");
//=========testApi=========
router.get("/test", function (req, res) {
  res.send("Hello Work");
});

//shortnerUrl API

router.post("/url/shorten", urlController.urlshorten);

//get Url

router.get("/:urlCode", urlController.getUrl);

module.exports = router;

const express = require("express");
const router = express.Router();
const urlController = require("../controller/urlShorter");
const redisController = require("../controller/redisController");
//=========testApi=========
router.get("/test", function (req, res) {
  res.send("Hello Work");
});

//shortUrl API
router.post("/url/shorten", redisController.urlShort);

//getLongUrl B  y urlCode API
//router.get("/:urlCode", urlController.getUrlByParam);
//Using Cache
router.get("/:urlCode", redisController.getLinkFromCache);

module.exports = router;

const urlModel = require("../model/Urlmodel");
const shortid = require("shortid");
const valiUrl = require("valid-url");
const axios = require("axios");

//shortUrl
exports.urlShort = async function (req, res) {
  try {
    //Not Accepting Empty req

    if (Object.keys(req.body).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Request Cant be empty" });
    }

    //Accepting link in String Format
    if (typeof req.body.longUrl != "string") {
      return res.status(400).send({
        status: false,
        msg: "LongURL can be in a String only!",
      });
    }

    //Checking baseUrl (Valid?/Not)
    if (!valiUrl.isUri(req.body.longUrl)) {
      return res
        .status(400)
        .send({ status: false, msg: "Url is Not Valid URL " });
    }

    //handling Dublication(bcz if this link is already present in Our Db We have to send him/her Same Shorterner)
    let duplicateUrl = await urlModel
      .findOne({ longUrl: req.body.longUrl })
      .select({ _id: 0, __v: 0 });

    //if not Found then Create that url in Collection
    if (duplicateUrl == null) {
      //genrating shortUrl
      let shortUrl = shortid.generate(req.body).toLowerCase();

      // let domain = new URL(urlStore.longUrl);
      //let baseUrl = "https://" + domain.hostname + "/" + shortUrll;

      let baseUrl = "http://localhost:3000/" + shortUrl;

      //Creating
      let urlStore = await urlModel.create({
        longUrl: req.body.longUrl,
        urlCode: shortUrl,
        shortUrl: baseUrl,
      });

      return res.status(201).send({
        status: true,
        data: {
          longUrl: urlStore.longUrl,
          shortUrl: urlStore.shortUrl,
          urlCode: urlStore.urlCode,
        },
      });
    }

    //checking alreqady (Present?/Not)
    if (duplicateUrl.longUrl == req.body.longUrl) {
      return res.status(201).send({
        status: true,
        msg: " this Url is already present",
        data: duplicateUrl,
      });
    }
  } catch (err) {
    res.send({ status: false, msg: "Server Error!!", err: err.message });
  }
};

//getUrl

exports.getUrlByParam = async function (req, res) {
  try {
    //================Get URLCODE=========================
    let urlCode = req.params.urlCode;

    //================Short Id Verification// npm i shortid=========================
    if (!shortid.isValid(urlCode))
      return res.status(400).send({ status: false, message: "Invalid Code" });
    if (!/^[a-zA-Z0-9_-]{7,14}$/.test(urlCode))
      return res.status(400).send({
        status: false,
        message:
          "Enter UrlCode with a-z A-Z 0-9 -_ and of length 7-14 characters",
      });

    //================Nano Id Verification// npm i nano-id=========================
    // if (!nanoId.verify(urlCode)) return res.status(400).send({ status: false, message: "Invalid Code" })

    //================Checking URLCode exsistence in DB=========================
    let findUrl = await urlModel.findOne({ urlCode: urlCode });
    if (!findUrl)
      return res.status(404).send({ status: false, message: "No URL found" });
    // longUrl = findUrl.longUrl;
    //================Rediecting To Original URL=========================
    return res.status(302).redirect(findUrl.longUrl);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

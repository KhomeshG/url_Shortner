const urlModel = require("../model/Urlmodel");
const shortid = require("shortid");
// const validUrl = require('valid-url');

//regex for links(global)
function validLink(link) {
  return /^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
}

//shortUrl
exports.urlShort = async function (req, res) {
  try {
    //Checking Url (valid?/Not)
    if (!validLink(req.body.longUrl)) {
      return res
        .status(400)
        .send({ status: false, msg: "Link is not in valid formate" });
    }

    //handling Dublication(bcz if this link is already present in Our Db We have to send him/her Same Shorterner)
    let duplicateUrl = await urlModel.findOne({ longUrl: req.body.longUrl });

    //if not Found then Create that url in Collection
    if (duplicateUrl == null) {
      //genrating shortUrl
      let shortUrl = shortid.generate(req.body).toLowerCase();

      // let domain = new URL(urlStore.longUrl);
      //let baseUrl = "https://" + domain.hostname + "/" + shortUrll;

      let baseUrl = "https://localhost:3000/" + shortUrl;

      //Creating
      let urlStore = await urlModel.create({
        longUrl: req.body.longUrl,
        urlCode: shortUrl,
        shortUrl: baseUrl,
      });

      return res.status(201).send({
        data: {
          longUrl: urlStore.longUrl,
          shortUrl: urlStore.shortUrl,
          urlCode: urlStore.urlCode,
        },
      });
    }

    //checking alreqady (Present?/Not)
    if (duplicateUrl.longUrl == req.body.longUrl) {
      return res.status(200).send({
        status: true,
        msg: " this link is already present",
        data: {
          longUrl: duplicateUrl.longUrl,
          shortUrl: duplicateUrl.shortUrl,
          urlCode: duplicateUrl.urlCode,
        },
      });
    }
  } catch (err) {
    res.send({ status: false, msg: "Server Error!!", err: err.message });
  }
};

//getUrl

const getUrlByParam = async function (req, res) {
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
    longUrl = findUrl.longUrl;
    //================Rediecting To Original URL=========================
    return res.status(302).redirect(findUrl.longUrl);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = { getUrlByParam };

//GET URL API

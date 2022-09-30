const urlModel = require("../model/Urlmodel");
//importing
const shortid = require("shortid");
const { generate } = require("shortid");

//
//regex for links(global)
function validLink(link) {
  return /^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
}

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
      //Using this for getting Host name

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

//GET URL API

exports.getUrl = async function (req, res) {
  let urlData = await urlModel.findOne({ longUrl: req.params });
  if (urlData == null) {
    return;
  }
};

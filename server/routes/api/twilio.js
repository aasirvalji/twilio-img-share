const express = require("express");
const Twilio = require("twilio");
const router = express.Router();
const path = require("path");
const dotenv = require("dotenv");
const Url = require("../../models/Url");

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });
const { MessagingResponse } = Twilio.twiml;

// Save incoming media URL(s) to mongoDB
router.post("/incoming", async (req, res) => {
  const { body } = req;
  const { NumMedia, From: SenderNumber } = body;

  console.log(`Number of media items: ${NumMedia}`, body);
  for (var i = 0; i < NumMedia; i++) {
    // eslint-disable-line
    const mediaUrl = body[`MediaUrl${i}`];
    const mediaType = body[`MediaContentType${i}`].split("/")[1];
    await Url.create({ link: mediaUrl, type: mediaType });
  }

  const messageBody =
    NumMedia === 0
      ? "Send us an image!"
      : `Thanks for sending us ${NumMedia} file(s). `;

  const response = new MessagingResponse();
  response.message(
    {
      from: process.env.TWILIO_PHONE_NUMBER,
      to: SenderNumber,
    },
    messageBody
  );

  return res.send(response.toString()).status(200);
});

// Get a list of URL(s) in db
router.get("/", async (req, res) => {
  const urls = await Url.find();
  return res.status(200).json(urls);
});

// Clear URL(s) in db
router.delete("/", async (req, res) => {
  await Url.deleteMany();
  return res.status(200).json({ success: true });
});

// Get twilio number config
router.get("/config", (req, res) => {
  res.status(200).send({ twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER });
});

module.exports = router;

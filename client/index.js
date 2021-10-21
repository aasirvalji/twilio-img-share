#!/usr/bin/env node
const program = require("commander");
const axios = require("axios");
const fs = require("fs");
const chalk = require("chalk");
const TWILIO_PROXY = "https://twilio-img.herokuapp.com";
const homedir = require("os").homedir();

program.version("1.0.0").description("Twilio Image Transfer Client");

program
  .option("-n", "save hosted images to local file, clear database")
  .option("-d", "download hosted images, clear database")
  .option("-v", "get hosted images urls")
  .parse();

// Validate args
var argsSelected = 0;
for (var val of Object.values(program.opts())) {
  val && argsSelected++;
}
if (argsSelected !== 1) return console.log("Please enter 1 argument");

// Destructure args
const { n: ns, d: ds, v: vs } = program.opts();

(async function () {
  if (ns) {
    try {
      // Get all image urls
      var { data } = await axios.get(`${TWILIO_PROXY}/api/twilio`);

      var logger = fs.createWriteStream(`${homedir}/urls.txt`, {
        flags: "a", // 'a' means appending (old data will be preserved)
      });

      // Save names to local file
      for (var d of data) {
        logger.write(d.link + "\r\n");
      }

      // Close file read, delete urls from db
      logger.close();
      var {
        data: { success },
      } = await axios.delete(`${TWILIO_PROXY}/api/twilio`);
      if (!success)
        return console.log("Something went wrong, please try again later.");

      console.log(
        chalk.blue(
          `Write successful. Hosted image URLs are stored in ${homedir}/urls.txt`
        )
      );
    } catch (error) {
      console.error(error);
    }
  } else if (ds) {
    try {
      // Get all image urls
      var { data } = await axios.get(`${TWILIO_PROXY}/api/twilio`);

      // Create directory to store images if it does not exist
      var dir = `${homedir}/timg-${Date.now()}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      // Get images s3 urls and download to local folder (timg-timestamp_seconds)
      const download_image = (url, image_path) =>
        axios({
          url,
          responseType: "stream",
        }).then(
          (response) =>
            new Promise((resolve, reject) => {
              response.data
                .pipe(fs.createWriteStream(image_path))
                .on("finish", () => resolve())
                .on("error", (e) => reject(e));
            })
        );
      for (var d of data) {
        download_image(d.link, `${dir}/${Date.now()}.${d.type}`);
      }

      // Close read, delete urls from db
      var {
        data: { success },
      } = await axios.delete(`${TWILIO_PROXY}/api/twilio`);
      if (!success)
        return console.log("Something went wrong, please try again later.");

      // return success message
      console.log(
        chalk.blue(`Download successful. Images are stored in ${dir}`)
      );
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      // Get all image urls
      var { data } = await axios.get(`${TWILIO_PROXY}/api/twilio`);

      for (var d of data) {
        console.log(`Image URL: ${d.link}   Image Type: ${d.type}`);
      }

      // Success message
      console.log(chalk.blue(`Ending read stream...`));
    } catch (error) {
      console.error(error);
    }
  }

  // Terminate with success code
  process.exit(1);
})();

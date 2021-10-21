## Image transfer/Image Hosting from your phone

### What

- The server is responsible for listening to incoming image messages to a specific twilio phone number.
  Upon receiving a image message, the image is hosted on a public bucket which can then be used
  by any website/downloaded by any laptop.

- The client is a cli program that's capable of creating a list of all of the public image URLs created by the server and
  store this list to a text file. Moreover, the program can download all of the images to a local folder. To get more information
  about the flags available for use with the program, run 'node index.js --help' OR 'timg --help'.

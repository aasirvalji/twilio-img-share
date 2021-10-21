const express = require("express");
const connectDB = require("./config/db");
const { urlencoded } = require("body-parser");

// Init database connection
connectDB();

// Init express app
const app = express();
app.use(urlencoded({ extended: false }));

// Initialize request middleware
app.use(express.json());

app.use("/api/twilio", require("./routes/api/twilio.js"));

// Set server port as environment or 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
});

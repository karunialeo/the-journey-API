const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const router = require("./src/routes");

app.use(express.json());
app.use(cors());
app.use("/api/v1/", router);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const router = express.Router();

const otherRoutes = require("./mangadexRoutes"); // your existing routes file

router.use("/", otherRoutes);

module.exports = router;

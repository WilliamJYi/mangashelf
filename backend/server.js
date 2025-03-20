require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/", routes);

// // Sample Route
// app.get("/", (req, res) => {
//   res.json({ message: "Backend is running!" });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

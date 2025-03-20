const express = require("express");
const router = express.Router();
const axios = require("axios");

const baseUrl = "https://api.mangadex.org";

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${baseUrl}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching external API:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${baseUrl}/manga`,
      params: {
        title: req.query.title,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching external API:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

router.get("/chapters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios({
      method: "GET",
      url: `${baseUrl}/manga/${id}/feed`,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching external API:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

router.get("/chapter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios({
      method: "GET",
      url: `https://api.mangadex.org/at-home/server/${id}`,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching external API:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

router.get("/covers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get cover details
    const response = await axios({
      method: "GET",
      url: `https://api.mangadex.org/cover/${id}`,
    });
    const coverId = response.data.data.relationships[0].id;
    const fileName = response.data.data.attributes.fileName;

    // Get image
    const imageResponse = await axios({
      method: "GET",
      url: `https://uploads.mangadex.org/covers/${coverId}/${fileName}`,
      responseType: "arraybuffer",
    });

    // Convert from binary to base64
    const base64 = Buffer.from(imageResponse.data, "binary").toString("base64");

    // Send base64 string with proper MIME type
    const mimeType = "image/jpeg";
    res.json({
      fileName: fileName,
      image: `data:${mimeType};base64,${base64}`,
    });
  } catch (error) {
    console.error("Error fetching external API:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

module.exports = router;

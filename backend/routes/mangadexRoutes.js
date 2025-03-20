const express = require("express");
const router = express.Router();
const axios = require("axios");
const redisClient = require("../config/redisClient");

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

// Get List of Mangas Based on Title
router.get("/search", async (req, res) => {
  try {
    const cachekey = `title:${req.query.title}`;
    const cacheTitle = await redisClient.get(cachekey);

    if (cacheTitle) {
      console.log("Serving cached title from Redis");
      return res.json(JSON.parse(cacheTitle));
    }

    const response = await axios({
      method: "GET",
      url: `${baseUrl}/manga`,
      params: {
        title: req.query.title,
      },
    });

    await redisClient.set(cachekey, JSON.stringify(response.data), {
      EX: 86400,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching external API:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// Get Chapters Based on Manga id
router.get("/chapters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { limit, lang, sort } = req.query;

    const cacheKey = `chapters:${id}`;

    const cachedChapters = await redisClient.get(cacheKey);

    if (cachedChapters) {
      console.log("Serving manga chapters from cache!");
      return res.json(JSON.parse(cachedChapters));
    }

    const response = await axios.get(`${baseUrl}/manga/${id}/feed`, {
      params: {
        translatedLanguage: [lang || "en"],
        order: { chapter: sort || "asc" },
        limit: limit || 100,
      },
    });

    const responseData = response.data;
    await redisClient.set(cacheKey, JSON.stringify(responseData), {
      EX: 86400,
    });

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching external API:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// Get Chapter Details based on Chapter id
router.get("/chapter/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cacheKey = `chapter:${id}`;

    const cachedChapter = await redisClient.get(cacheKey);

    if (cachedChapter) {
      console.log("Serving chapter details from cache!");
      return res.json(JSON.parse(cachedChapter));
    }

    const response = await axios.get(
      `https://api.mangadex.org/at-home/server/${id}`
    );

    const responseData = response.data;

    await redisClient.set(cacheKey, JSON.stringify(responseData), {
      EX: 86400,
    });

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching external API:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// Get Cover Image Details
router.get("/covers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Send base64 string with proper MIME type
    const mimeType = "image/jpeg";

    const cachedKey = `cover:${id}`;

    const cachedCover = await redisClient.get(cachedKey);

    if (cachedCover) {
      console.log("Serving cached cover from Redis");
      return res.send(`data:${mimeType};base64,${cachedCover}`);
    }

    // Get cover details
    const response = await axios.get(`https://api.mangadex.org/cover/${id}`);
    const coverId = response.data.data.relationships[0].id;
    const fileName = response.data.data.attributes.fileName;

    // Get image
    const imageResponse = await axios.get(
      `https://uploads.mangadex.org/covers/${coverId}/${fileName}`,
      { responseType: "arraybuffer" }
    );

    // Convert from binary to base64
    const base64 = Buffer.from(imageResponse.data, "binary").toString("base64");

    // Cache in Redis for TTL of 1 day
    await redisClient.set(cachedKey, base64, {
      EX: 86400,
    });

    const responseData = `data:${mimeType};base64,${base64}`;
    res.send(responseData);
  } catch (error) {
    console.error("Error fetching external API:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

module.exports = router;

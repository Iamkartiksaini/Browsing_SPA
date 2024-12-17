const express = require("express");
const cors = require("cors");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
// app.use(express.static("frontend"));

app.post("/fetch-page", async (req, res) => {
  const { url, isScript, isImages } = req.body;
  // Validate the URL
  try {
    new URL(url);
  } catch (error) {
    return res.status(400).send("Invalid URL");
  }

  try {
    const response = await axios.get(url);

    // Check if the response status is successful
    if (response.status < 200 || response.status >= 300) {
      return res.status(response.status).send("Error fetching the page");
    }

    // Use response.data instead of response.text()
    const text = response.data;

    const $ = cheerio.load(text);

    if (!isImages) {
      $("img").attr("src", "");
    }

    if (!isScript) {
      $("script").remove();
    }

    const modifiedHtml = $.html();

    res.send(modifiedHtml);
  } catch (error) {
    console.error("Error fetching the page:", error.message);
    res.status(500).send("Error fetching the page");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

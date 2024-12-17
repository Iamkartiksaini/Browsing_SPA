import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import cheerio from "cheerio";

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.static("frontend")); // Serve static files from the frontend directory

app.post("/fetch-page", async (req, res) => {
  const { url } = req.body;

  // Validate the URL
  try {
    new URL(url); // This will throw an error if the URL is invalid
  } catch (error) {
    return res.status(400).send("Invalid URL");
  }

  try {
    const response = await fetch(url);

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      return res.status(response.status).send("Error fetching the page");
    }

    const text = await response.text();

    // Load the HTML into cheerio
    const $ = cheerio.load(text);

    // Remove all <script> tags
    $("script").remove();

    // Get the modified HTML
    const modifiedHtml = $.html();

    res.send(modifiedHtml);
  } catch (error) {
    console.error("Error fetching the page:", error);
    res.status(500).send("Error fetching the page");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

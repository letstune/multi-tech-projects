const axios = require("axios");
require("dotenv").config();

async function getDirections({ from, to }) {
  const apiKey = process.env.OPENROUTESERVICE_API_KEY;
  if (!apiKey) throw new Error("OpenRouteService API key not set");
  const url = "https://api.openrouteservice.org/v2/directions/foot-walking";
  const body = {
    coordinates: [
      [from.lng, from.lat],
      [to.lng, to.lat],
    ],
  };
  const headers = {
    Authorization: apiKey,
    "Content-Type": "application/json",
  };
  const response = await axios.post(url, body, { headers });
  return response.data;
}

module.exports = { getDirections };

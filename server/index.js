require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// GET /api/props?t=<tournamentId>
app.get("/api/props", async (req, res) => {
  const t = req.query.t || "wk-demo";

  // MOCK fallback (default)
  const mockPath = path.join(__dirname, "mock", "props.json");
  const mock = JSON.parse(fs.readFileSync(mockPath, "utf-8"));
  return res.json({ tournamentId: t, source: "mock", props: mock });

  // --- Real provider example (leave commented until you add an API key) ---
  // try {
  //   if (!process.env.PROPS_API_URL || !process.env.PROPS_API_KEY) throw new Error('No provider configured');
  //   const url = `${process.env.PROPS_API_URL}?t=${encodeURIComponent(t)}`;
  //   const resp = await fetch(url, { headers: { Authorization: `Bearer ${process.env.PROPS_API_KEY}` } });
  //   const data = await resp.json();
  //   return res.json({ tournamentId: t, source: 'provider', props: data.props });
  // } catch (err) {
  //   console.error('Provider error:', err.message);
  //   return res.status(502).json({ error: 'Provider failed' });
  // }
});

app.listen(PORT, () => {
  console.log(`PropTeams API running on http://localhost:${PORT}`);
});

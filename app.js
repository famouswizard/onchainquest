import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import quests from "./quests.json" assert { type: "json" };
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.static("."));

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_BASE_URL = "https://api.neynar.com/v2/farcaster";

async function getUserCastsByFid(fid) {
  const res = await fetch(`${NEYNAR_BASE_URL}/user/casts?fid=${fid}&limit=50`, {
    headers: { "api_key": NEYNAR_API_KEY },
  });
  if (!res.ok) throw new Error("Failed to fetch user casts");
  const json = await res.json();
  return json.result.casts || [];
}

async function getUserByAddress(address) {
  const res = await fetch(`${NEYNAR_BASE_URL}/user-by-verification?address=${address}`, {
    headers: { "api_key": NEYNAR_API_KEY },
  });
  if (!res.ok) throw new Error("Failed to fetch user by address");
  const json = await res.json();
  return json.result.user || null;
}

app.get("/api/quests", (req, res) => {
  res.json(quests);
});

app.get("/api/verify/:id", async (req, res) => {
  const { id } = req.params;
  const { address } = req.query;

  const quest = quests.find((q) => q.id === id);
  if (!quest) return res.status(404).json({ message: "Quest not found" });

  try {
    if (quest.type === "tx") {
      const url = `https://api.basescan.org/api?module=account&action=txlist&address=${address}&sort=desc`;
      const r = await fetch(url);
      const json = await r.json();
      const hasTx = json.result && json.result.length > 0;
      return res.json({
        message: hasTx ? "✅ Quest completed (Base TX found)!" : "❌ No Base transactions found.",
      });
    }

    if (quest.type === "cast") {
      const user = await getUserByAddress(address);
      if (!user) {
        return res.json({ message: "❌ No Farcaster profile linked to this wallet." });
      }

      const fid = user.fid;
      const casts = await getUserCastsByFid(fid);
      const hasGmCast = casts.some((c) => c.text.toLowerCase().includes("#gm"));

      return res.json({
        message: hasGmCast
          ? "✅ Quest completed! You posted #gm on Farcaster."
          : "❌ No recent #gm casts found. Try posting one!",
      });
    }

    return res.json({ message: "⚙️ Unsupported quest type." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Error verifying quest." });
  }
});

app.listen(3000, () =>
  console.log("🚀 Onchain Quest running at http://localhost:3000")
);

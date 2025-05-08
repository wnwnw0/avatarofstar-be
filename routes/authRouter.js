const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userEmail = payload.email;

    if (userEmail === process.env.ADMIN_EMAIL) {
      res.json({ message: "Admin access granted", isAdmin:true });
    } else {
      res.status(403).json({ message: "Access denied", isAdmin: false });
    }
  } catch (error) {
    console.error("❌ Google token verification failed:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;

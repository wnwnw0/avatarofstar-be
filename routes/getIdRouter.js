const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

router.get("/:year/:month/:day/:hour", async (req, res) => {
    const { year, month, day, hour } = req.params;

    try {
        const [results] = await db.query(
            `SELECT id FROM main_data WHERE year = ? AND month = ? AND day = ? AND hour = ? LIMIT 1`,
            [year, month, day, hour]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "No ID found" });
        }

        res.json({ id: results[0].id });
    } catch (err) {
        console.error("❌ DB Error:", err);
        res.status(500).json({ error: "DB query failed" });
    }
});

module.exports = router;

const express = require("express");
const sql = require("mysql");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json()); // Parse JSON request body

const con = sql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

con.connect((err) => {
  if (err) console.log("Database connection error:", err);
  else console.log("Database connection established");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.post("/", async (req, res) => {
  try {
    const { fname, lname, email, phnum, password } = req.body;

    if (!fname || !lname || !email || !phnum || !password) {
      return res.status(400).send("All fields are required");
    }

    const query =
      "INSERT INTO userdata (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?)";
    con.query(query, [fname, lname, email, phnum, password], (err, result) => {
      if (err) {
        console.log("Database error:", err);
        res.status(500).send("Database error");
      } else {
        res.send("Data inserted successfully");
      }
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});
app.get("/latest-user", (req, res) => {
  const query = "SELECT * FROM userdata ORDER BY id DESC LIMIT 1";
  con.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving data");
    } else {
      res.json(result); // Ensure this is returning an array of objects
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

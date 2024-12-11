const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

let corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConfig = require("./app/config/db.config.js");
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Successfully connected to the database.");
});

// Default route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to Sharan's application" });
// });

app.get("/tutorials", (req, res) => {
  const query = "SELECT * FROM tutorials";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching tutorials:", err);
      res.status(500).send({ message: "Error retrieving tutorials." });
      return;
    }
    res.json(results);
  });
});

require("./app/routes/tutorial.routes.js")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

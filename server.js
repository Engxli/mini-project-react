const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const samplePets = require("./petsData.js");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//DB
const db = new sqlite3.Database(":memory:");
db.serialize(() => {
  db.run(`
      CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        details TEXT NOT NULL,
        available BOOLEAN NOT NULL DEFAULT false,
        image TEXT
      );
    `);
});

//Insert dummy data
const insert =
  "INSERT INTO books (name, details, image, available) VALUES (?, ?, ?, ?)";
samplePets.forEach((pet) => {
  db.run(insert, [pet.name, pet.details, pet.image, pet.available]);
});

// Create a pet
app.post("/books", (req, res) => {
  const { name, details, image, available } = req.body;
  console.log(name);
  const sql =
    "INSERT INTO books (name, details, image, available) VALUES (?, ?, ?, ?)";
  const params = [name, details, image, available];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, details, image, available });
  });
});

// Get all pets
app.get("/books", (req, res) => {
  const sql = "SELECT * FROM books";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get a pet by id
app.get("/book/:id", (req, res) => {
  const sql = "SELECT * FROM books WHERE id = ?";
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Update a pet by id
app.put("/book/:id", (req, res) => {
  const { available } = req.body;
  const sql = "UPDATE books SET available = ? WHERE id = ?";
  const params = [available, req.params.id];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: req.params.id, available });
  });
});

// Delete a pet
app.delete("/books/:id", (req, res) => {
  const sql = "DELETE FROM books WHERE id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "Pet deleted successfully", changes: this.changes });
  });
});

// Create a room
app.post("/rooms", (req, res) => {
  const { name, type, image, adopted } = req.body;
  const sql =
    "INSERT INTO rooms (name, type, image, adopted) VALUES (?, ?, ?, ?)";
  const params = [name, type, image, adopted];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, type, image, adopted });
  });
});

// Get all rooms
app.get("/rooms", (req, res) => {
  const sql = "SELECT * FROM rooms";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get a room by id
app.get("/rooms/:id", (req, res) => {
  const sql = "SELECT * FROM rooms WHERE id = ?";
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Update a room by id
app.put("/rooms/:id", (req, res) => {
  const { name, type, image, adopted } = req.body;
  const sql =
    "UPDATE rooms SET name = ?, type = ?, image = ?, adopted = ? WHERE id = ?";
  const params = [name, type, image, adopted, req.params.id];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: req.params.id, name, type, image, adopted });
  });
});

// Delete a room
app.delete("/rooms/:id", (req, res) => {
  const sql = "DELETE FROM rooms WHERE id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "room deleted successfully", changes: this.changes });
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

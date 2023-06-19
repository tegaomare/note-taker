const express = require("express");
const fs = require("fs");
const path = require("path");

const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static("public"));

//post request
app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    var notes = JSON.parse(data);
    let userNote = req.body;
    userNote.id = uuidv4();
    notes.push(userNote);
    fs.writeFile("./db/db.json", JSON.stringify(notes), (err, data) => {
      res.json(userNote);
    });
  });
});

//delete req
app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    const newNotes = notes.filter((note) => note.id !== req.params.id);
    //console.log(newNotes);

    fs.writeFile("./db/db.json", JSON.stringify(newNotes), (err, data) => {
      res.json({ msg: "successful" });
    });
  });
});

//GET
app.get("api/notes/:id", (req, res) => {
  res.json(notes[req.params.id]);
});

//GET
app.get("/api/notes", (req, res) => {
  // console.log();
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    var notes = JSON.parse(data);
    res.json(notes);
  });
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//msg to say that it is listening when node server is started
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT} 🚀`);
});

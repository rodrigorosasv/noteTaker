var express = require("express");
var path = require("path");
const fs = require("fs");

const { RSA_PSS_SALTLEN_AUTO } = require("constants");

var app = express();
var PORT = 5000;

//Creating notes array

var notes=[];

fs.readFile('./db/db.json','utf8', (err, data) => {
    if (err) throw err;
    notes=JSON.parse(data);
    //console.log(notes);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/viewNotes", function(req, res) {
    return res.json(notes);
});

app.delete('/api/deleteNotes/:id', function(req, res) {
    //console.log(req.params.id);
    notes.forEach(element => {
        if(element.id==req.params.id){
            var index=notes.indexOf(element);
            notes.splice(index,1);
        }
    });
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
        if (err) throw err;
        console.log('The file has been updated - removed item!');
      });
    return res.json(notes);
});

app.post("/api/viewNotes", function(req, res) {
    var newNote = req.body;
    notes.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
        if (err) throw err;
        console.log('The file has been updated - added item!');
      });
    res.json(newNote);
});
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
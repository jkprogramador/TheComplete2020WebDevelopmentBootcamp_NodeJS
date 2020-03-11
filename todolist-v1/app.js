const express = require("express");
const bodyParser = require("body-parser");
const date =  require(__dirname + '/date.js');

const app = express();
const todos = ["Buy Food", "Cook Food", "Eat Food"];
const workTodos = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  
  const day = date.getDate();

  res.render("list", { listTitle: day, myTodos: todos });
});

app.post("/", function(req, res) {
  const todo = req.body.todo;

  if ("Work" === req.body.list) {
    workTodos.push(todo);
    res.redirect("/work");
  } else {
    todos.push(todo);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", { listTitle: "Work", myTodos: workTodos });
});

app.post("/work", function(req, res) {
  workTodos.push(req.body.todo);

  res.redirect("/work");
});

app.listen(3000, function() {
  console.log("Started server at 3000");
});

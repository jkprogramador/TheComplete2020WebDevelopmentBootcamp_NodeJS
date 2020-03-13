const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require('lodash');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

/**
 * MongoDB Connection and DB
 */
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

/**
 * Model/Collections Schema
 */
const TodoSchema = {
  text: String
};

/**
 * Model/Collections
 */
const Todo = mongoose.model("Todo", TodoSchema);

/**
 * Document
 */
const todo1 = new Todo({
  text: "Buy Food"
});

const todo2 = new Todo({
  text: "Cook Food"
});

const todo3 = new Todo({
  text: "Eat Food"
});

const defaultTodos = [todo1, todo2, todo3];

const ListSchema = {
  name: String,
  todos: [TodoSchema]
};

const List = mongoose.model("List", ListSchema);

app.get("/", function(req, res) {
  Todo.find({}, function(err, results) {
    if (err) {
      console.log(err);
    } else {
      if (0 === results.length) {
        Todo.insertMany(defaultTodos, function(err) {
          console.log(err);
        });

        res.redirect("/");
      } else {
        const day = date.getDate();
        res.render("list", {
          listTitle: "Today",
          today: day,
          myTodos: results
        });
      }
    }
  });
});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function(err, foundList) {
    if (foundList) {
      const day = date.getDate();
      res.render("list", {
        listTitle: foundList.name,
        today: day,
        myTodos: foundList.todos
      });
    } else {
      const list = new List({
        name: customListName,
        todos: defaultTodos
      });

      list.save();

      res.redirect("/" + customListName);
    }
  });
});

app.post("/", function(req, res) {
  const todoText = req.body.todo;
  const listName = req.body.listTitle;
  const todo = new Todo({ text: todoText });

  if ("Today" === listName) {
    todo.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function(err, foundList) {
      if (err) {
        console.log(err);
      } else {
        foundList.todos.push(todo);
        foundList.save();
        res.redirect("/" + listName);
      }
    });
  }
});

app.post("/delete", function(req, res) {
  const todoId = req.body.checkBox;
  const listName = req.body.listName;

  if ("Today" === listName) {
    Todo.findByIdAndDelete(todoId, function(err) {
      if (!err) {
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { todos: { _id: todoId } } }, function(err, foundList) {
      if (!err) {
        res.redirect('/' + listName);
      }
    });
  }
});

app.listen(3000, function() {
  console.log("Started server at 3000");
});

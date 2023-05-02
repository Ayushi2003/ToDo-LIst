const express = require("express");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { connect } = require("http2");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("."));


const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "todo_db",
});

connection.connect((err) => {
  if (err) throw err;
  else console.log("Database Connected Successfully");
});

app.get("/", (req, res) => {
  var today = new Date();
  var options = {
    weekday: "long",
    year: "numeric",
    day: "numeric",
    month: "long",
  };
  var day = today.toLocaleDateString("en-US", options);
  let sql = "SELECT * from todo";
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render("homeUser", {
      kindOfDay: day,
      title: "To-Do List",
      todo: result,
    });
  });
});

app.get("/addTask", (req, res) => {
  res.render("addList", {
    title: "TODO LIST",
  });
});

app.post("/save", (req, res) => {
  let data = {
    title: req.body.title,
    description: req.body.description,
    time: req.body.time,
  };
  let sql = "INSERT INTO todo SET ?";
  let query = connection.query(sql, data, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/edit/:userId", (req, res) => {
  const userId = req.params.userId;
  let sql = `Select * from todo where id = ${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render("editList", {
      title: "To-Do List",
      todo: result[0],
    });
  });
});

app.post("/update", (req, res) => {
  const userId = req.body.id;
  let sql =
    "Update todo Set title='" +
    req.body.title +
    "', description='" +
    req.body.description +
    "', time= '" +
    req.body.time +
    "' where id = " +
    userId;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/delete/:id", (req, res) => {
  const userId = req.params.id;
  let sql = `Delete from todo where id=${userId}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});

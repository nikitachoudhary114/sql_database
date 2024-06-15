const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
let path = require("path");
const methodoverride = require("method-override");

let port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodoverride("_method"));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'data',
  password: 'abc--',
});

let createRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),

  ];
}
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let data = [];
// for (let i = 0; i < 100; i++) {
//   data.push(createRandomUser());
// }


app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
      // res.send(result);
    })
  } catch (err) {
    res.send(err);
  }
});

app.get("/show", (req, res) => {
  let q = `SELECT * FROM USER`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("show.ejs", { users })
    })
  } catch (err) {
    res.send(err);
  }
});

app.get("/show/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `select * from user where id = '${id}'`
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", {user});
    })
  } catch (err) {
    res.send(err);
  }
 
});

app.patch("/show/:id", (req, res) => {
  let { id } = req.params;
  let { username, password } = req.body;
  let q = `select * from user where id = '${id}'`
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (user.password == password) {
        let q2 = `update user set username='${username}' where id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/show");
        })
      }
      else {
        res.send("Wrong password");
      }
    })
  } catch (err) {
    res.send(err);
  }
});

app.delete("/show/:id", (req, res) => {
  let { id } = req.params;
  let q = `select * from user where id!=${id}`;
  connection.query(q, (err, users) => {
    try {
      if (err) throw err;
      res.render("show.ejs", { users });
    } catch (err) {
      res.send("Some error");
    }
  })
})

app.listen(port, () => {
  console.log("Listening to port", port);
});


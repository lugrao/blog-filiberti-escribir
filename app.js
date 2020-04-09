//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const app = express();

const mongoDBuser = "admin-lagoru";
const mongoDBpass = "";
mongoose.connect(`mongodb+srv://${mongoDBuser}:${mongoDBpass}@cluster0-7s9ma.mongodb.net/Blog-Filiberti`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  titulo: String,
  contenido: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {

  Post.find({}, (err, foundPosts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        posts: foundPosts
      });
    }
  })
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {

  const post = new Post({
    titulo: req.body.postTitle,
    contenido: req.body.postBody
  });

  post.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  Post.find({}, (err, foundPosts) => {
    if (err) {
      console.log(err);
    } else {
      foundPosts.forEach((post) => {
        const storedTitle = _.lowerCase(post.titulo);
        if (storedTitle === requestedTitle) {
          res.render("post", {
            titulo: post.titulo,
            contenido: post.contenido
          });
        }
      });
    }
  });

});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
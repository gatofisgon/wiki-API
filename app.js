const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const res = require("express/lib/response");

 const app = express();

 app.set('view engine', 'ejs');

 app.use(bodyParser.urlencoded({extended: true}));
 app.use(express.static("public"));

 mongoose.connect("mongodb://localhost:27017/wikiDB");

 const articleSchema = {
     title: String,
     content: String
 };

const Article = mongoose.model("Article", articleSchema);

//Making of the RESTful methods
//Chaining route methods
app.route("/")

/* ---------------------------------------------------------------------Requesting a not specific route -------------------------------------------------------------- */
.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        } else {
            console.log(err);
        }
    });
})

.post(function(req, res){
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Succesfully added a post");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, req){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Succesfully deleted all posts");
        } else {
            console.log(err);
        }
    });
});

/* ---------------------------------------------------------------------Requesting a specific route -------------------------------------------------------------- */
app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No matched articles found");
        }
    });
})

//Update was deprecated so I use updateOne, which is simpler.
//
.put(function (req, res){
    Article.replaceOne(
        {title: req.params.articleTitle}, 
        {title: req.params.articleTitle, content: req.body.content},
        function(err){
            if(!err){
                res.send("Article has been updated succesfully")
            } else {
                res.send("Failed to update the article");
            }
        })
})

//Kind of the same as update since the other one was deprecated.
.patch(function (req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Succesfully patched the article")
            } else {
                res.render("Failed to update")
            }
        }
    )
})

.delete(function (req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Item deleted succesfully");
            } else {
                res.send("Failed to delete");
            }
        }
    )
});




let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started succesfully");
});
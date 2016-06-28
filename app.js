var express = require("express"),
     bodyParser = require("body-parser"),
     methodOverride = require("method-override"),
     expressSanitizer = require("express-sanitizer"),
     mongoose = require("mongoose"),
     app = express();
     
     
mongoose.connect("mongodb://localhost/blogapp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created : { type : Date , default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title :"Test Blog 1",
//     image : "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=e2db4850687048d1d52717b09935660e",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus periam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus! ",
   
// });


app.get("/", function(req, res) {
    res.redirect("/blogs");
});
app.get("/blogs", function(req,res){
    Blog.find({}, function(err,blogs){
        if(err){
            console.log(err);
        }else{
                res.render("index" , {blogs: blogs});
        }
    });
});

app.get("/blogs/new" , function(req, res) {
    res.render("new");
});
app.post("/blogs" , function(req,res){
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log(err);
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("show" , {blog:foundBlog});
       }
   });
});

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err,foundBlog){
       if(err){
          res.redirect("/blogs")
       } else{
             res.render("edit", {blog : foundBlog});
       }
    });
});

app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.findByIdAndUpdate(req.params.id, req.body.blog , function(err, foundBlog){   //findByIdAndUpdate(id, newData, callback)
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req,res){
     Blog.findByIdAndRemove(req.params.id, req.body.blog , function(err){   //findByIdAndUpdate(id, newData, callback)
        if(err){
            res.redirect("/blogs");
        } else{
             res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is Running !!");
});
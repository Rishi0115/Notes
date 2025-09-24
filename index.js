const express=require('express');
const app=express();
const path=require('path');
const fs=require('fs');
require('dotenv').config();

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    fs.readdir(`./files`, function(err, files){
      res.render("index",{files: files});    })
});

app.post('/create',function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err){
        res.redirect('/');
    });
});

app.get('/edit/:filename',function(req,res){
     res.render('edit',{filename: req.params.filename});
});

app.post('/edit', function(req, res) {
  fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function(err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Error renaming file");
    }
    res.redirect('/');
  });
});

app.get('/file/:filename',function(req,res){
   fs.readFile(`./files/${req.params.filename}`,'utf8',function(err,data){
     res.render('show',{filename: req.params.filename, filedata: data,});
});
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

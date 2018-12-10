const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const con =mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "clinic",
    port: "3306"
});


app.get('/',(req, res)=>{
    //res.status(200).json("its the homepage");
    const sql="select * from posts";
    con.query(sql,(err,result)=>{
        if(err){
            console.log("error occured: ", err);
            res.sendStatus(400).json("error occured: ", err);
        }
        else{
            if(result.length>0){
                res.json(result);
                console.log(result);
                
            }
            else{
                res.send("no posts avaialble right now");
                console.log("no posts avaialble right no");
            }
        }
    });

});

app.post('/dashboard',(req, res)=>{
    const posts = {
        title: req.body.title,
        body: req.body.body,
        authorId: req.body.authorId,
        slug: req.body.slug,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    const sql ="INSERT INTO posts SET ?";
    con.query(sql,[posts],(err,result)=>{
        if(err){
            console.log("error : ", err);
        }
        else{
            if(result.insertId){
                console.log("1 record inserted, ID", result.insertId);
                res.send(`1 record inserted, ID ${result.insertId}`,200);
               
            }
            else{
                console.log(req.body);
                console.log(result);
                console.log("unable to insert post");
                res.send("unable to insert post",400);
            }
        }
    });
});

app.put('/dashboard/profile/edit',(req,res)=>{
    data ={
        author: req.body.authorId,
        id: req.body.id,
        title: req.body.title,
        body: req.body.body,
        date: new Date()
    }
    const sql = "update posts set title=?,body=?,updatedAt = ? where id=? and authorId=?";
    con.query(sql,[data.title,data.body,data.date,data.id,data.author],(err,result)=>{
        if(err){
            console.log("error : ", err);
        }
        else{
            if(result.affectedRows>0){
                console.log("post updated sucessfully");
                res.send("post updated successfully");
               
            }
            else{
                console.log("unable to update post");
                res.send("unable to update");
            }
        }
    });
});

app.delete('/dashboard/profile/delete',(req, res)=>{
    data={
        id: req.body.id,
        author: req.body.authorId
    }
    const sql = "delete from posts where id=? and authorId=?";
    con.query(sql,[data.id,data.author],(err,result)=>{
        if(err){
            console.log("error : ", err);
        }
        else{
            if(result.affectedRows>0){
                console.log("post deleted sucessfully");
                res.send("post deleted successfully");
               
            }
            else{
                console.log("unable to delete post");
                res.send("unable to delete update");
            }
        }
    });
});

app.get('/dashboard/post',(req, res)=>{
    data = {
        id: req.body.id,
        author: req.body.authorId
    }
    sql="select * from posts where id = ? and authorId = ?";
    con.query(sql,[data.id,data.author],(error,result)=>{
        if(error){
            console.log("error: ",error);
            res.send(400);
        }
        else{
            if(result.length > 0){
                console.log(result);
                res.json(result)
            }
            else{
                console.log("post not found");
                res.json("post not found")
            }
        }
    })
})

app.listen(3001,()=>{
   console.log("app is running at port 3001");
})
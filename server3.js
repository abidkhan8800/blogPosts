const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const sequelize = new Sequelize('clinic','root',"",{
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
const Post = sequelize.define("post", {
    title: { type: Sequelize.STRING },
    body: { type: Sequelize.TEXT },
    authorId: { type: Sequelize.STRING },
    slug: { type: Sequelize.STRING }
});

Post.sync();

sequelize.authenticate().then(()=>{
    console.log('connection has been established sucessfully.');
    
})
.catch(err=>{
    console.error('Unable to connect to the database:', err);
});

const con =mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "clinic",
    port: "3306"
});


app.get('/',(req, res)=>{
    Post.findAll({
        order: sequelize.literal("createdAt DESC")
    }).then(posts =>{
        console.log(posts);
        res.json(posts);
    })

});

app.post('/dashboard',(req, res)=>{
    Post.create({
        title: req.body.title,
        body: req.body.body,
        authorId: req.body.authorId,
        slug: req.body.slug
    }).then(data=>{
        console.log(data);
        res.json("post created", data)
    }).catch(err=>{
        console.log("err:" ,err);
        res.json("unable to create record")
    });
});

app.put('/dashboard/profile/edit',(req,res)=>{
    Post.update({
        title: req.body.title,
        body: req.body.body,
        updatedAt: new Date()
    },
    {
        where: {
            authorId: req.body.authorId,
            id: req.body.id,
        }
    }).then(function(rowsUpdated) {
        // console.log('record updated sucessfully');
        // console.log(rowsUpdated);
        if(rowsUpdated>0){
            res.json("post updated sucessfully");
            console.log('record updated sucessfully');
        }else{
            res.json("no such post found");
            console.log("no such post found");
        }
    }).catch(err=>{
        console.log('err: ', err);
        res.json("error");
    });
});

app.delete('/dashboard/profile/delete',(req, res)=>{
    Post.destroy({where: {
        id: req.body.id,
        authorId: req.body.authorId
    }
    }).then(affectedRows=>{
        //console.log('record deleted sucessfully');
        if(affectedRows>0){
            console.log('record deleted sucessfully');
            console.log(affectedRows);
            res.json('record deleted sucessfully');
        }
        else{
            console.log('record not found');
            console.log(affectedRows);
            res.json('record not found');
        }
    }).catch(err=>{
        console.log(err);
        res.json('err :', err);

    })
});

app.get('/dashboard/post',(req, res)=>{
    Post.findOne({
        where: {
            id: req.body.id,
            authorId: req.body.authorId
        }
    }).then(post=>{
        console.log(post);
        console.log(post.dataValues);
        res.json(post.dataValues);
    })
})

app.listen(3001,()=>{
console.log("app is running at port 3001");
})
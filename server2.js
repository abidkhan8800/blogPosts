const Sequelize = require('sequelize');
const mysql = require('mysql');

const sequelize = new Sequelize('assign1','root',"",{
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

// sequelize.authenticate().then(()=>{
//     console.log('connection has been established sucessfully.');
    
// })
// .catch(err=>{
//     console.error('Unable to connect to the database:', err);
// });

const User = sequelize.define('user', {
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    }
  });
  
  // force: true will drop the table if it already exists
  User.sync();
  
  User.findAll({
      order: sequelize.literal("createdAt DESC")
  }).then(users =>{
      const posts = JSON.parse(users)
      console.log(posts);
  })

//   User.create({
//       firstName: "Abid",
//       lastName: "Khan"
//   }).then(data=>{
//       console.log(data);
//   }).catch(err=>{
//       console.log("err:" ,err);
//   })
   
  User.update({firstName: 'xyz',lastName: 'xyz'},{
      where: {
          id: 23
      }
  }).then(function(rowsUpdated) {
      //res.json(rowsUpdated)
      console.log('record updated sucessfully');
      console.log(rowsUpdated);
  }).catch(err=>{
      console.log('err: ', err);
      //res.json("error");
  });
  
//   User.destroy({where: {
//       id: 25
//   }
//   }).then(affectedRows=>{
//     //console.log('record deleted sucessfully');
//      if(affectedRows>0){
//         console.log('record deleted sucessfully');
//         console.log(affectedRows);
//      }
//      else{
//          console.log('record not found');
//          console.log(affectedRows);
//      }
//   }).catch(err=>{
//       console.log(err)
//   })

User.findOne({
    where: {
        id: 12,
        lastname: 'khan'
    }
}).then(post=>{
    console.log(post.dataValues.id);
})
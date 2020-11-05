var express = require('express');
const app = express();
var mysql = require('mysql');
const cors = require('cors');
// const { data } = require('jquery');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

var corsOptions = {
  origin: '*',
  credentials: true
};
app.use(cors(corsOptions))


var con = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"Mmandoo1234!!",
    database:"Project"
  });

  app.get('/tables', (req, res) => {
    con.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query("SELECT table_name FROM information_schema.tables WHERE table_schema ='Project';", function (err, result) {
            connection.release();
            if (err) throw err;
            var tableNames = JSON.stringify(result)
            res.send(tableNames);
        })
      });
     })
  
  
  app.post('/createNewTable', (req, res) => {
    const obj = JSON.parse(JSON.stringify(req.body))
    var tbName = obj.tName;
    var records = []
    rowsToBeInserted(obj.ID, obj.FirstName, obj.LastName, obj.ClientID, records)
    
    // console.log(records)
    con.getConnection(function(err, connection) {
      
      if (err) throw err;
      var createTb = `CREATE TABLE ${tbName} (ID int PRIMARY KEY , firstName varchar(45) , lastName varchar(45) , clientID varchar(45))`;
      var insert = `INSERT INTO ${tbName} (ID, firstName, lastName, clientID) VALUES ?`
      connection.query(createTb, function (err, result) {
           if (err) throw err;
          
          console.log("Table Created!");
       })
      connection.query(insert, [records], function (err, result) {
        connection.release();
           if (err) throw err;
          
          console.log("Inserted");
      })
     });
    // res.send("database created!");
    // res.status(204).send()
    res.end()
  })

  
  app.post('/removeDatabase', (req, res) => {
    const obj = JSON.parse(JSON.stringify(req.body))
    var droppedDb = obj.name;
    
    con.getConnection(function(err, connection) {
      if (err) throw err;
      var sql = `DROP TABLE ${droppedDb}`;  
        connection.query(sql, function (err, result) {
          connection.release();
          if (err) throw err;
        
        console.log("Table dropped!");
      })
    })
    res.send("table dropped")
    res.end()
  })
app.post('/firstNameChar', (req, res) =>{
  const obj = JSON.parse(JSON.stringify(req.body))
  var character = obj.char;
  var database = obj.database;
    con.getConnection(function(err, connection) {
      if (err) throw err;
      var sql = `SELECT * FROM ${database} WHERE firstName LIKE '${character}%'`;  
        connection.query(sql, function (err, result) {
          connection.release();
          if (err) throw err;
          res.send(result)
      })
    })
})

app.post('/lastNameChar', (req, res) =>{
  const obj = JSON.parse(JSON.stringify(req.body))
  var character = obj.char;
  var database = obj.database;
  console.log(database)
  console.log(character)
    con.getConnection(function(err, connection) {
      if (err) throw err;
      var sql = `SELECT * FROM ${database} WHERE lastName LIKE '${character}%'`;  
        connection.query(sql, function (err, result) {
          connection.release();
          if (err) throw err;
          res.send(result)
      })
    })
})

app.post('/name', (req, res) =>{
  const obj = JSON.parse(JSON.stringify(req.body))
  var firstName = obj.firstName;
  var lastName = obj.lastName;
  var database = obj.database
    
    con.getConnection(function(err, connection) {
      if (err) throw err;
      var sql = `SELECT * FROM ${database} WHERE firstName = "${firstName}" AND lastName = "${lastName}"`;
        connection.query(sql, function (err, result) {
          connection.release();
          if (err) throw err;
          res.send(result);
      })
    })
})

app.post('/clientID', (req, res) =>{
  const obj = JSON.parse(JSON.stringify(req.body))
  var ID = obj.ID;
  var database = obj.database;
    con.getConnection(function(err, connection) {
      if (err) throw err;
      var sql = `SELECT * FROM ${database} WHERE clientID = "${ID}"`;  
        connection.query(sql, function (err, result) {
          connection.release();
          if (err) throw err;
          res.send(result)
        
      })
    })
})
app.post('/firstName', (req, res) =>{
  const obj = JSON.parse(JSON.stringify(req.body))
  var firstName = obj.firstName;
  var database = obj.database;
    
    con.getConnection(function(err, connection) {
      if (err) throw err;
      var sql = `SELECT * FROM ${database} WHERE firstName = "${firstName}"`;  
        connection.query(sql, function (err, result) {
          connection.release();
          if (err) throw err;
          res.send(result)
      })
    })
})

app.post('/lastName', (req, res) =>{
  const obj = JSON.parse(JSON.stringify(req.body))
  var lastName = obj.lastName;
  var database = obj.database;
    
    con.getConnection(function(err, connection) {
      if (err) throw err;
      var sql = `SELECT * FROM ${database} WHERE lastName = "${lastName}"`;  
        connection.query(sql, function (err, result) {
          connection.release();
          if (err) throw err;
          res.send(result)
      })
    })
})

app.post('/content', (req, res) =>{
  const obj = JSON.parse(JSON.stringify(req.body))
  var database = obj.database;
  // console.log(database)
    con.getConnection(function(err, connection) {
      if (err) throw err;
      var sql = `SELECT * FROM ${database}`;  
        connection.query(sql, function (err, result) {
          connection.release();
          if (err) throw err;
          res.send(result)
      })
    })
})


app.post('/insertRows', (req, res) =>{
  const obj = JSON.parse(JSON.stringify(req.body))
  console.log(obj)
  var tbName = obj.tName;
  var content = [];
  rowsToBeInserted(obj.ID, obj.FirstName, obj.LastName, obj.ClientID, content)
    
    // console.log(records)
  con.getConnection(function(err, connection) {
      
    if (err) throw err;
    var insert = `INSERT INTO ${tbName} (ID, firstName, lastName, clientID) VALUES ?`
    connection.query(insert, [content], function (err, result) {
      connection.release();
      if (err) throw err;
          
      console.log("Inserted");
      })
     });
    res.send("rows Inserted!");
    res.end()
})

app.post('/update', (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body))
  var tbName = obj.database;
  var oldValue = obj.old;
  var newValue = obj.new;
  var header = obj.colHeader;
  // rowsToBeInserted(obj.ID, obj.FirstName, obj.LastName, obj.ClientID, content)
    
    // console.log(records)
  con.getConnection(function(err, connection) {
      
    if (err) throw err;
    var update = `UPDATE ${tbName} SET ${header} = '${newValue}' WHERE ${header} = '${oldValue}'`
    connection.query(update, function (err, result) {
      connection.release();
      if (err) throw err;
          
      console.log("updated!");
      })
     });
    res.send("/tables");
    res.end()
})

function rowsToBeInserted(ID, fName, lName, cID, array){
  if (typeof (ID) == 'string'){
    array.push([(ID), (fName), (lName), (cID)])
  } else{ 
    for (var i = 0; i < fName.length; i++){
      array.push([(ID)[i], (fName)[i], (lName)[i], (cID)[i]])
    }
  }
}
  // app.get('/content', (req, res) =>{
  //   con.getConnection(function(err) {
  //     if (err) throw err;
  //     con.query("SELECT * FROM Project.CUSTOMER", function (err, result) {
  //         if (err) throw err;
  //         res.send(JSON.stringify(result));
  //         // console.log(JSON.stringify(result))
  //         // console.log("Connected!");
  //     })
  //   });
  // })
  app.listen(3000, () => {
    console.log(`Server running at ${'http://localhost:3000/'} ✔`);
  });
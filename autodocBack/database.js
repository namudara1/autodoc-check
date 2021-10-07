

var express = require('express');
var mysql = require('mysql');  
var app = express();



var con = mysql.createConnection({  
  host: "localhost",  
  user: "root",   
  password: "",
  database: 'autodoc'  
});  

con.connect(function(err) {   
  if (!!err){
    console.log("database Not Connected!");  

  } 
  else {
    console.log("database Connected!");  

  }
});  

module.exports =con;
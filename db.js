/*
https://codereview.stackexchange.com/questions/120331/passing-node-js-sql-connection-to-multiple-routes
*/

var mysql = require('mysql');
var settings = require('./settings.json');
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createConnection(settings);

        db.connect(function(err){
            if(!err) {
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();
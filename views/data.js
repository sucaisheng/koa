var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '15186478704scs?',
  database : 'news'
});
 
connection.connect();
 
connection.query('SELECT *  from user ', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0]);
});
 
connection.end();
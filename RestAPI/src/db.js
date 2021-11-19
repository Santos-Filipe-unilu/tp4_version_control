var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root2',
    password: 'root2root2',
    database: 'webdev4'

});
connection.connect(function(error){
    if(error){
        console.log(error);
    }else{
        console.log('Connected!')
    }
});

module.exports = connection;

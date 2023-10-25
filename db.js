var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'sql110.infinityfree.com',
	username:'if0_34654155',
	password:'Mathurharsh18',
	database:'if0_34654155_careclub	',
	port:3306
});
connection.connect(function(error){
	if(!error) {
		console.log('Database Connected Successfully..!!');
	} else {
		console.log(error);
	}
});

module.exports = connection;
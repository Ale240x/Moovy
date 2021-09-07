const mysql = require("mysql");

var middleware = {};

/*if(process.env.JAWSDB_URL) {
    // Se siamo su heroku
    middleware.options = {

        host: 'yvu4xahse0smimsc.chr7pe7iynqr.eu-west-1.rds.amazonaws.com', 
        port: 3306,
        user: 'by9oibax2wtp1evx',
        password: 'o5rkx2z64ua67goq',
        database: 'xcx5jxqx13fqwt1m',
    
    };
} else {*/

    middleware.options = {

        connectionLimit: 20, 
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '12345678',
        database: 'moovy',
        insecureAuth: true
    
    };


//crea un pool di connessioni
middleware.pool = mysql.createPool(middleware.options);

module.exports = middleware;
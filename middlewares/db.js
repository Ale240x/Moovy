const mysql = require("mysql");

var middleware = {};

    middleware.options = {

        connectionLimit: 20, 
        host: 'localhost',
        port: 3306,
        user: 'moovy',
        password: 'P4ssw0rdSicura',
        database: 'moovy',
        insecureAuth: true,
        //debug: true
    };


//crea un pool di connessioni
middleware.pool = mysql.createPool(middleware.options);

module.exports = middleware;
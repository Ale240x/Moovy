const path = require('path');
const createError = require('http-errors');
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const dbMiddleware = require("./middlewares/db");
const sessionStore = new MySQLStore(dbMiddleware.options);
const smtpMiddleware = require("./middlewares/smtp");

const cookieParser = require('cookie-parser');
//const logger = require('morgan');

require('ejs');

const RadiceRouter = require("./Controllers/routers/RadiceRouter");

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev')); //?

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  key: 'SID',
  secret: 'SSID',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) =>{
  req.dbPool = dbMiddleware.pool;
  req.transporter = smtpMiddleware.transporter;
  next();
});

app.use("/", RadiceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//connessione sicura https
/*app.use((req, res, next) => {

  if(req.headers['x-forwarded-proto'] == 'https' || req.secure) {
 
     global.ROOT_DIR = __dirname;
 
     req.dbPool = dbMiddleware.pool;

     req.transporter = smtpMiddleware.transporter;
     
     res.locals.viewsPath = __dirname + '/Views';
 
     next();
 
  } else {
 
       res.redirect('https://' + req.headers.host + req.url);
       req.dbPool = dbMiddleware.pool;
   } 
 });*/

let connection = dbMiddleware.pool.getConnection(function(err, connection) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
  return connection;
});

/*let connection = mysql.createConnection({
  host: 'localhost',
  user: 'moovy',
  password: 'P4ssw0rdSicura',
  database: 'moovy'
});

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});
*/

module.exports = app;

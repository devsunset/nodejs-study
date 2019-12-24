var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var redis = require('redis');

import { stream } from './configs/winston'
import v1Route from './routes/v1'
import response from './utils/response'

var app = express();

var client = redis.createClient(6379,'127.0.0.1');

const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/dev')

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: "localhost",
    port : 3306,
    user: "root",
    password: "admin",
    database: "test",
    connectionLimit: 5
});

/*
  pool.getConnection()
      .then(conn => {    
        conn.query("SELECT 1 as val")
          .then((rows) => {
            console.log(rows); //[ {val: 1}, meta: ... ]
            //Table must have been created before 
            // " CREATE TABLE myTable (id int, val varchar(255)) "
            return conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
          })
          .then((res) => {
            console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
            conn.end();
          })
          .catch(err => {
            //handle error
            console.log(err); 
            conn.end();
          })        
      }).catch(err => {
        //not connected
  });
*/

app.set('secret_key', "12345678901234567801234567890")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req,res,next){
      req.cache = client;
      next();
})

app.use(function(req,res,next){
      req.pool = pool;
      next();
})

//Sentry : https://sentry.io/welcome/
/*
if (process.env.NODE_ENV === 'production') {

  // 에러 핸들링 전 Sentry 로 캡쳐
  const sentry = require('@sentry/node')
  sentry.init({ dsn: process.env.SENTRY_DSN })
  app.use(sentry.Handlers.errorHandler())

  const { IncomingWebhook } = require('@slack/client')
  const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK)
  webhook.send({
    'attachments': [
      {
        'color': '#ff0000',
        'text': 'error - noti',
        'fields': [
          {
            'title': err.message,
            'value': err.stack,
            'short': false
          }
        ],
        'ts': moment().unix()
      }
    ]
  }, (err, res) => {
    if (err) {
      sentry.captureException(err)
    }
  })
}
*/

/*
combined 
[:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"]
common 
[:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]]
dev 
[:method :url :status :response-time ms - :res[content-length]]
short
[:remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms]
tiny
[:method :url :status :res[content-length] - :response-time ms]
*/

//app.use(logger('combined'))
app.use(logger('combined', { stream }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', v1Route)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use((err, req, res, next) => {
  let apiError = err

  if (!err.status) {
    apiError = createError(err)
  }

  // set locals, only providing error in development
  //res.locals.message = apiError.message
  //res.locals.error = process.env.NODE_ENV === 'development' ? apiError : {}

  if (process.env.NODE_ENV === 'test') {
    const errObj = {
      req: {
        headers: req.headers,
        query: req.query,
        body: req.body,
        route: req.route
      },
      error: {
        message: apiError.message,
        stack: apiError.stack,
        status: apiError.status
      }
    }

    logger.error(`${moment().format('YYYY-MM-DD HH:mm:ss')}`, errObj)
  } else {
    res.locals.message = apiError.message
    res.locals.error = apiError
  }

  // render the error page
  return response(res, {
    message: apiError.message
  }, apiError.status)
});

module.exports = app;

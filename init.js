const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sinav_cepte'
});

connection.connect();


const app = express()
const router = express.Router({ mergeParams: true })

app.use(cors());

app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.send("Parsing Error")
    } else {
        next();
    }
});

response = function response(status, message, data = {}) {
    return {
        status: status,
        message: message,
        data: data
    }
}

module.exports = {
    connection: connection,
    app: app,
    router: router,
    response
}

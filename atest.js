const express = require("express");
const app = express();
const router = express.Router()
const path = require ("path");
const pug = require('pug');

const bodyParser = require("body-parser");
const test = require("./Router/test.js")
const index =require("./index.js")
const mongoose = require ("mongoose")

mongoose.connect("mongodb://localhost/stories", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('db connected successfully'))

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use("/bootstrap", express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')))

app.use(bodyParser.urlencoded({
 extended: false
}));
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())

app.use("/", test)
//app.use("/fundamentals")

app.listen(2000, () => {
  console.log(`port 2000 is on`)
})

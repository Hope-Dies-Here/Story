const express = require("express");
const app = express();
const port = 3000;
const path = require ("path");
const pug = require('pug');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const oneDay = 1000 * 60 * 60 * 24;
const home = require("./Router/test.js")
const accounts = [
  {
    id: 0,
    name: 'Dummy',
    username: 'notDummy',
    password: 'dumb',
    message: [{
      
    }]
  }
]

app.set('view engine', 'pug');
app.set('views', './views');

app.use(sessions({
  secret: 'theSecretInGridient',
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}))

//bootstrap
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use("/bootstrap", express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')))

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')))
app.use("/test", home)
app.get("/", (req, res)=>{
  
  res.redirect("/home")
  /*
  if(req.session.user){
    res.redirect("/home")
  } else if(req.session.err){
    res.render('index', {
      err: 'somthing is wromg!!',
      u: req.session.u
    })
  }
  else{
    res.render('index', {
      message: ''
    })
  } */
})
app.post("/check", (req, res) => {
  const username = req.body.username
  const password = req.body.password
  session = req.session 
  
  let exist = accounts.filter(account => account.username == username)
  if(exist.length > 0) {
    console.log(`yeeeeeet ${exist[0].name}`)
    session.user = exist[0].name
    res.redirect("/home")
    
  } else {
    session.err = true
    session.u = username
    res.redirect("/")
    console.log("not yeet")
  }
  
})
app.get('/home', (req, res) => {
  //some("my note")
  /* session = req.session
  if(session.userid || session.user){
    res.render('home', {
    name: session.user
  })
  } else {
     res.redirect('/')
  } */
  res.render('home')
})


app.get("/friemds", (req, res) => {
 res.render('friends', {
   friemds: accounts
 })
})

app.get("/friemds/:id", (req,res) => {
  const id = req.params.id 
  console.log("lmao " + accounts.length)
  if(id >= accounts.length || isNaN(id)){
    res.send("u stupid")
  } else{
    res.render('msg', {
      name: accounts[id].name
    })
    //res.send(accounts[id].name)
  }
})
app.get("/fundamentals", (req, res) => {
  res.render('fundamentals')
})
let stories = []
app.get('/stories', (req, res) => {
  res.render("stories", {
    stories: stories
  })
})


app.post("/postStory", (req, res) => {
  const story = req.body.story 
  const title = req.body.title
  
  stories.push({
    title: title,
    story: story
  })
  console.log(stories)
  res.redirect('/stories')
})
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/")
})


app.listen(port, ()=>{
  
  console.log(`server at ${port}`)
  
})


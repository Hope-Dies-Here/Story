

const express = require ("express")
const router = express.Router()
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const Story = require ("../Models/story")
const User = require("../Models/user")
const oneDay = 1000 * 60 * 60 * 24;

router.use(sessions({
  secret: 'theSecretInGridient',
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}))

//middleware
async function getStory(req, res, next){
  let tempStory
  try{
    tempStory = await Story.findById(req.params.id)
    if(tempStory == null) {
      return res.status(404).json({msg: "no story found"})
    }
  } catch (err){
      return res.status(500).json({msg: "somthn err"}) 
    }
    res.tempStory = tempStory
    next()
}

function checkUser(req, res, next){
  if(req.session.user == undefined){
    return res.redirect("/")
  }
  next()
}
// sess


const accounts = [
  {
    id: 0,
    name: 'Dummy',
    username: 'notDummy',
    password: 'dumb',
  }
]

//routers
router.get("/", (req, res)=>{
  delete req.session.existUsername
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
  }
})
router.post("/check", async(req, res) => {
  const username = req.body.username
  const password = req.body.password
  session = req.session 
  const theUser = await User.find({
    username: username,
    password: password
  })
  session.theUser = theUser[0]
  //let exist = accounts.filter(account => account.username == username)
  if(theUser.length > 0) {
    session.user = theUser[0].name
    session.username = theUser[0].username
    res.redirect("/home")
    
  } else {
    session.err = true
    session.u = username
    res.redirect("/")
  }
  
})

router.get("/register", (req, res)=> {
  
  if(req.session.existUsername == undefined){
    res.render('register')
  } else{
    res.render('register', {
      name: req.session.existData.name,
      username: req.session.existData.username
    })
  }
})

router.post("/register", async(req, res)=> {
  const name = req.body.name
  const username = req.body.username
  const password = req.body.password
  const session = req.session
  const existingUsername = await User.find({username: username})
  if(existingUsername.length > 0){
    session.existUsername = true
    session.existData = {
      name: name,
      username: username
    }
    res.redirect('back')
  } else {
      try{
        const newUser = new User({
          name: name,
          username: username,
          password: password
        })
      await newUser.save()
      res.redirect("/")
    } catch(err){
      res.json({msg: err})
    }
  }
  
})

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/")
})

router.get("/home", checkUser, (req, res) => {
  res.render("home", {
    name: session.user
  })
})

//declaraton 
const stories = []
let alt = false

//routs
router.get("/fundamentals", checkUser, (req, res) => {
  res.render("fundamentals")
})

router.get("/stories", checkUser, async(req, res) => {
  try{
    const story = await Story.find()
    .sort({$natural: -1}).populate("owner")
    res.render("stories", {
      stories: story,
      sesUn: session.theUser.username,
      alt: alt
    })
    alt = false
  } catch(err) {
    res.status(500).json({msg: "lmao nope"})
    console.log(err)
  }
})

router.post('/postStory', async(req, res) => {
  const owner = session.theUser
  const story = new Story({
    title: req.body.title,
    story: req.body.story,
    owner: owner._id
  }) 
  try{
    const newStory = await story.save()
    res.redirect("/stories")
  } catch(err){
    res.status(500).send(`<p> ${err.message}</p>`)
  }
})

router.post('/delete/:id', checkUser, getStory, async(req, res) => {
  try{
  
  await res.tempStory.deleteOne()
  alt = true
  const story = await Story.find().sort({$natural: -1})
    res.redirect("/stories")
  } catch(err) {
    res.status(500).json({msg: "remove error"})
    console.log(err)
  }
})


router.get('/:id', checkUser, getStory, async(req, res) => {
  try{
    res.render('editStory', {
      title: res.tempStory.title,
      story: res.tempStory.story,
      id: res.tempStory.id
    })
  } catch(err){
    res.send(err)
  }
})

router.post('/updateStory/:id', getStory, async(req, res) => {
  if(req.body.title != null){
    res.tempStory.title = req.body.title
  }
  if(req.body.story != null){
    res.tempStory.story = req.body.story
  }
  try{
    await res.tempStory.save()
    res.redirect('/stories')
  } catch(err){
    console.log(err)
  }
})
module.exports = router

